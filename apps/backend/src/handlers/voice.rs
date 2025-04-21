use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use bytes::Bytes;
use futures::stream::{self, Stream};
use std::env;
use std::pin::Pin;
use tracing::{error, info};

use crate::models::{
    AppState, IntentAnalysisRequest, IntentAnalysisResponse, TranscriptRequest, TranscriptResponse,
    VoiceStreamRequest,
};
use crate::services::openai::analyze_intent;

// Type alias for the response stream
type ByteStream = Pin<Box<dyn Stream<Item = Result<Bytes, std::io::Error>> + Send>>;

pub async fn stream_tts(
    State(state): State<AppState>,
    Json(request): Json<VoiceStreamRequest>,
) -> Result<Response, (StatusCode, String)> {
    info!("Streaming TTS for call: {}", request.call_id);

    // Get ElevenLabs API key from environment
    let api_key = env::var("ELEVENLABS_API_KEY").expect("ELEVENLABS_API_KEY must be set");
    
    // Default voice if not specified
    let voice_id = request.voice_id.unwrap_or_else(|| "EXAVITQu4vr4xnSDxMaL".to_string()); // ElevenLabs "Rachel" voice

    // Prepare the request to ElevenLabs
    let client = reqwest::Client::new();
    let response = client
        .post(format!(
            "https://api.elevenlabs.io/v1/text-to-speech/{}/stream",
            voice_id
        ))
        .header("xi-api-key", api_key)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "text": request.text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }))
        .send()
        .await
        .map_err(|e| {
            error!("Failed to stream TTS: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to stream TTS: {}", e),
            )
        })?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("ElevenLabs API error: {}", error_text),
        ));
    }

    // Stream the audio response back to the client
    let stream = response.bytes_stream().map(|result| match result {
        Ok(bytes) => Ok(bytes),
        Err(err) => {
            error!("Error streaming TTS: {}", err);
            Err(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Stream error: {}", err),
            ))
        }
    });

    let boxed_stream: ByteStream = Box::pin(stream);

    // Send response with proper content type
    Ok((
        StatusCode::OK,
        [("content-type", "audio/mpeg")],
        axum::body::StreamBody::new(boxed_stream),
    )
        .into_response())
}

pub async fn create_transcript(
    State(state): State<AppState>,
    Json(request): Json<TranscriptRequest>,
) -> Result<Json<TranscriptResponse>, (StatusCode, String)> {
    info!("Creating transcript for call: {}", request.call_id);

    // Get OpenAI API key from environment
    let api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");

    // Create a temporary file to store the audio data
    let temp_dir = std::env::temp_dir();
    let file_path = temp_dir.join(format!("audio_{}.wav", request.call_id));
    tokio::fs::write(&file_path, &request.audio_data)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to write temporary audio file: {}", e),
            )
        })?;

    // Use the OpenAI client to transcribe the audio
    let client = reqwest::Client::new();
    let form = reqwest::multipart::Form::new()
        .text("model", "whisper-1")
        .file("file", &file_path)
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to create form: {}", e),
            )
        })?;

    let response = client
        .post("https://api.openai.com/v1/audio/transcriptions")
        .header("Authorization", format!("Bearer {}", api_key))
        .multipart(form)
        .send()
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to send request to OpenAI: {}", e),
            )
        })?;

    // Clean up the temporary file
    tokio::fs::remove_file(&file_path).await.ok();

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("OpenAI API error: {}", error_text),
        ));
    }

    // Parse the response
    let whisper_response: serde_json::Value = response.json().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to parse OpenAI response: {}", e),
        )
    })?;

    let text = whisper_response["text"]
        .as_str()
        .unwrap_or_default()
        .to_string();

    // Update transcript in database
    sqlx::query("UPDATE calls SET transcription = $1, updated_at = $2 WHERE id = $3")
        .bind(&text)
        .bind(chrono::Utc::now())
        .bind(request.call_id)
        .execute(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to update transcript: {}", e),
            )
        })?;

    Ok(Json(TranscriptResponse {
        text,
        confidence: 0.9, // Whisper doesn't provide confidence scores directly
    }))
}

pub async fn analyze_intent(
    State(state): State<AppState>,
    Json(request): Json<IntentAnalysisRequest>,
) -> Result<Json<IntentAnalysisResponse>, (StatusCode, String)> {
    info!("Analyzing intent for call: {}", request.call_id);

    // Use OpenAI to analyze the intent
    let analysis = analyze_intent(&request.transcript)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to analyze intent: {}", e),
            )
        })?;

    // Update the spam score and intent in the database
    sqlx::query(
        "UPDATE calls SET intent = $1, spam_score = $2, updated_at = $3 WHERE id = $4",
    )
    .bind(&analysis.intent)
    .bind(analysis.spam_likelihood)
    .bind(chrono::Utc::now())
    .bind(request.call_id)
    .execute(&state.db)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to update intent analysis: {}", e),
        )
    })?;

    Ok(Json(analysis))
} 
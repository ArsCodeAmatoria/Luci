use anyhow::Result;
use bytes::Bytes;
use reqwest::Client;
use std::env;
use tokio_stream::Stream;

pub async fn text_to_speech(
    text: &str,
    voice_id: Option<&str>,
) -> Result<impl Stream<Item = Result<Bytes, reqwest::Error>>> {
    // Get API key from environment
    let api_key = env::var("ELEVENLABS_API_KEY").expect("ELEVENLABS_API_KEY must be set");
    
    // Default voice if not specified
    let voice_id = voice_id.unwrap_or("EXAVITQu4vr4xnSDxMaL"); // Default to "Rachel" voice

    // Create client
    let client = Client::new();

    // Make request to ElevenLabs
    let response = client
        .post(format!(
            "https://api.elevenlabs.io/v1/text-to-speech/{}/stream",
            voice_id
        ))
        .header("xi-api-key", api_key)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }))
        .send()
        .await?;

    // Check for success
    if !response.status().is_success() {
        let error_text = response.text().await?;
        anyhow::bail!("ElevenLabs API error: {}", error_text);
    }

    // Return the byte stream
    Ok(response.bytes_stream())
} 
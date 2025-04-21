use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct VoiceStreamRequest {
    pub call_id: Uuid,
    pub text: String,
    pub voice_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TranscriptRequest {
    pub call_id: Uuid,
    pub audio_data: Vec<u8>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TranscriptResponse {
    pub text: String,
    pub confidence: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IntentAnalysisRequest {
    pub call_id: Uuid,
    pub transcript: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IntentAnalysisResponse {
    pub intent: String,
    pub confidence: f32,
    pub spam_likelihood: f32,
    pub sentiment: String,
    pub suggested_response: Option<String>,
    pub action_recommendation: ActionRecommendation,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum ActionRecommendation {
    Forward,
    TakeMessage,
    BlockCaller,
    OfferCallback,
} 
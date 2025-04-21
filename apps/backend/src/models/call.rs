use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Call {
    pub id: Uuid,
    pub user_id: Uuid,
    pub caller_number: String,
    pub caller_name: Option<String>,
    pub status: CallStatus,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub duration_seconds: Option<i32>,
    pub transcription: Option<String>,
    pub spam_score: Option<f32>,
    pub intent: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "call_status", rename_all = "snake_case")]
pub enum CallStatus {
    Ringing,
    InProgress,
    Completed,
    Missed,
    Blocked,
    Failed,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CallStartRequest {
    pub user_id: Uuid,
    pub caller_number: String,
    pub caller_name: Option<String>,
    pub twilio_call_sid: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CallRouteRequest {
    pub call_id: Uuid,
    pub action: CallRouteAction,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum CallRouteAction {
    Accept,
    Decline,
    Voicemail,
    ScheduleCallback,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CallResponse {
    pub id: Uuid,
    pub status: CallStatus,
    pub transcription: Option<String>,
    pub spam_score: Option<f32>,
    pub intent: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CallbackRequest {
    pub call_id: Uuid,
    pub scheduled_time: DateTime<Utc>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Callback {
    pub id: Uuid,
    pub call_id: Uuid,
    pub user_id: Uuid,
    pub caller_number: String,
    pub scheduled_time: DateTime<Utc>,
    pub status: CallbackStatus,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "callback_status", rename_all = "snake_case")]
pub enum CallbackStatus {
    Scheduled,
    Completed,
    Missed,
    Cancelled,
} 
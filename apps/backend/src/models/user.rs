use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub firebase_uid: Option<String>,
    pub email: String,
    pub name: Option<String>,
    pub phone_number: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSettings {
    pub id: Uuid,
    pub user_id: Uuid,
    pub enable_call_screening: bool,
    pub auto_spam_block: bool,
    pub voicemail_greeting: Option<String>,
    pub notification_preferences: NotificationPreferences,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotificationPreferences {
    pub email_notifications: bool,
    pub sms_notifications: bool,
    pub push_notifications: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user_id
    pub exp: usize,  // expiration time
} 
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use sqlx::types::Uuid;
use tracing::info;

use crate::models::{AppState, Call, CallResponse, CallRouteAction, CallRouteRequest, CallStartRequest, CallStatus};

pub async fn start_call(
    State(state): State<AppState>,
    Json(request): Json<CallStartRequest>,
) -> Result<Json<CallResponse>, (StatusCode, String)> {
    info!("Starting call from number: {}", request.caller_number);

    // Generate a new UUID for the call
    let call_id = Uuid::new_v4();
    let now = Utc::now();

    // Create a new call record
    let call = sqlx::query_as::<_, Call>(
        "INSERT INTO calls (id, user_id, caller_number, caller_name, status, started_at, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *",
    )
    .bind(call_id)
    .bind(request.user_id)
    .bind(&request.caller_number)
    .bind(request.caller_name)
    .bind(CallStatus::Ringing)
    .bind(now)
    .bind(now)
    .bind(now)
    .fetch_one(&state.db)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to create call: {}", e),
        )
    })?;

    // Store the Twilio call SID in Redis
    let redis_key = format!("call:{}:twilio_sid", call_id);
    let mut conn = state.redis.get_async_connection().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to connect to Redis: {}", e),
        )
    })?;

    redis::cmd("SET")
        .arg(&redis_key)
        .arg(&request.twilio_call_sid)
        .query_async::<_, ()>(&mut conn)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to store call SID in Redis: {}", e),
            )
        })?;

    // Return the response
    Ok(Json(CallResponse {
        id: call.id,
        status: call.status,
        transcription: None,
        spam_score: None,
        intent: None,
    }))
}

pub async fn route_call(
    State(state): State<AppState>,
    Json(request): Json<CallRouteRequest>,
) -> Result<Json<CallResponse>, (StatusCode, String)> {
    info!("Routing call: {:?}", request);

    // Get the call from the database
    let call = sqlx::query_as::<_, Call>("SELECT * FROM calls WHERE id = $1")
        .bind(request.call_id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Call not found".to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch call: {}", e),
            ),
        })?;

    // Update the call status based on the requested action
    let new_status = match request.action {
        CallRouteAction::Accept => CallStatus::InProgress,
        CallRouteAction::Decline => CallStatus::Missed,
        CallRouteAction::Voicemail => CallStatus::InProgress, // Will be updated to Completed after voicemail
        CallRouteAction::ScheduleCallback => CallStatus::Missed,
    };

    // Update the call in the database
    let updated_call = sqlx::query_as::<_, Call>(
        "UPDATE calls SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *",
    )
    .bind(new_status)
    .bind(Utc::now())
    .bind(request.call_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to update call: {}", e),
        )
    })?;

    // Return the updated call
    Ok(Json(CallResponse {
        id: updated_call.id,
        status: updated_call.status,
        transcription: updated_call.transcription,
        spam_score: updated_call.spam_score,
        intent: updated_call.intent,
    }))
}

pub async fn get_call(
    State(state): State<AppState>,
    Path(call_id): Path<Uuid>,
) -> Result<Json<Call>, (StatusCode, String)> {
    // Get the call from the database
    let call = sqlx::query_as::<_, Call>("SELECT * FROM calls WHERE id = $1")
        .bind(call_id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Call not found".to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch call: {}", e),
            ),
        })?;

    Ok(Json(call))
}

pub async fn get_call_history(
    State(state): State<AppState>,
) -> Result<Json<Vec<Call>>, (StatusCode, String)> {
    // Get recent calls from the database
    let calls = sqlx::query_as::<_, Call>("SELECT * FROM calls ORDER BY created_at DESC LIMIT 50")
        .fetch_all(&state.db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch calls: {}", e),
            )
        })?;

    Ok(Json(calls))
} 
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use sqlx::types::Uuid;
use tracing::info;

use crate::models::{AppState, Callback, CallbackRequest, CallbackStatus};

pub async fn schedule_callback(
    State(state): State<AppState>,
    Json(request): Json<CallbackRequest>,
) -> Result<Json<Callback>, (StatusCode, String)> {
    info!("Scheduling callback for call: {}", request.call_id);

    // Get call details
    let call = sqlx::query!(
        "SELECT user_id, caller_number FROM calls WHERE id = $1",
        request.call_id
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Call not found".to_string()),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to fetch call: {}", e),
        ),
    })?;

    // Generate a UUID for the callback
    let callback_id = Uuid::new_v4();
    let now = Utc::now();

    // Create the callback in the database
    let callback = sqlx::query_as::<_, Callback>(
        "INSERT INTO callbacks 
        (id, call_id, user_id, caller_number, scheduled_time, status, notes, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *",
    )
    .bind(callback_id)
    .bind(request.call_id)
    .bind(call.user_id)
    .bind(&call.caller_number)
    .bind(request.scheduled_time)
    .bind(CallbackStatus::Scheduled)
    .bind(request.notes)
    .bind(now)
    .bind(now)
    .fetch_one(&state.db)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to create callback: {}", e),
        )
    })?;

    Ok(Json(callback))
}

pub async fn get_callback(
    State(state): State<AppState>,
    Path(callback_id): Path<Uuid>,
) -> Result<Json<Callback>, (StatusCode, String)> {
    // Fetch the callback from the database
    let callback = sqlx::query_as::<_, Callback>("SELECT * FROM callbacks WHERE id = $1")
        .bind(callback_id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Callback not found".to_string()),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch callback: {}", e),
            ),
        })?;

    Ok(Json(callback))
}

pub async fn complete_callback(
    State(state): State<AppState>,
    Path(callback_id): Path<Uuid>,
) -> Result<Json<Callback>, (StatusCode, String)> {
    info!("Marking callback as completed: {}", callback_id);

    // Update the callback status
    let callback = sqlx::query_as::<_, Callback>(
        "UPDATE callbacks SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *",
    )
    .bind(CallbackStatus::Completed)
    .bind(Utc::now())
    .bind(callback_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Callback not found".to_string()),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to update callback: {}", e),
        ),
    })?;

    Ok(Json(callback))
}

pub async fn cancel_callback(
    State(state): State<AppState>,
    Path(callback_id): Path<Uuid>,
) -> Result<Json<Callback>, (StatusCode, String)> {
    info!("Cancelling callback: {}", callback_id);

    // Update the callback status
    let callback = sqlx::query_as::<_, Callback>(
        "UPDATE callbacks SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *",
    )
    .bind(CallbackStatus::Cancelled)
    .bind(Utc::now())
    .bind(callback_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Callback not found".to_string()),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to update callback: {}", e),
        ),
    })?;

    Ok(Json(callback))
}

pub async fn get_callbacks(
    State(state): State<AppState>,
) -> Result<Json<Vec<Callback>>, (StatusCode, String)> {
    // Fetch all upcoming callbacks
    let callbacks = sqlx::query_as::<_, Callback>(
        "SELECT * FROM callbacks WHERE status = 'scheduled' ORDER BY scheduled_time ASC",
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to fetch callbacks: {}", e),
        )
    })?;

    Ok(Json(callbacks))
} 
use axum::{extract::State, http::StatusCode, Json};
use tracing::info;

use crate::models::AppState;

#[derive(serde::Serialize)]
pub struct HealthResponse {
    status: String,
    version: String,
    database: String,
    redis: String,
}

pub async fn health_check(State(state): State<AppState>) -> Result<Json<HealthResponse>, StatusCode> {
    info!("Health check request received");

    // Check database connection
    let db_status = match sqlx::query("SELECT 1").execute(&state.db).await {
        Ok(_) => "ok".to_string(),
        Err(e) => {
            info!("Database health check failed: {}", e);
            format!("error: {}", e)
        }
    };

    // Check Redis connection
    let redis_status = match state.redis.get_async_connection().await {
        Ok(_) => "ok".to_string(),
        Err(e) => {
            info!("Redis health check failed: {}", e);
            format!("error: {}", e)
        }
    };

    // Create response
    let response = HealthResponse {
        status: "ok".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        database: db_status,
        redis: redis_status,
    };

    Ok(Json(response))
} 
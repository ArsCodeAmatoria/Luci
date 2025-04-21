use axum::{
    routing::{get, post},
    Router,
};

use crate::handlers;
use crate::models::AppState;

pub fn call_routes() -> Router<AppState> {
    Router::new()
        .route("/api/call/start", post(handlers::call::start_call))
        .route("/api/call/route", post(handlers::call::route_call))
        .route("/api/call/:id", get(handlers::call::get_call))
        .route("/api/call/history", get(handlers::call::get_call_history))
}

pub fn voice_routes() -> Router<AppState> {
    Router::new()
        .route("/api/voice/stream", post(handlers::voice::stream_tts))
        .route("/api/voice/transcript", post(handlers::voice::create_transcript))
        .route("/api/voice/analyze", post(handlers::voice::analyze_intent))
}

pub fn callback_routes() -> Router<AppState> {
    Router::new()
        .route("/api/callback", post(handlers::callback::schedule_callback))
        .route("/api/callback/:id", get(handlers::callback::get_callback))
        .route(
            "/api/callback/:id/complete",
            post(handlers::callback::complete_callback),
        )
        .route(
            "/api/callback/:id/cancel",
            post(handlers::callback::cancel_callback),
        )
        .route("/api/callbacks", get(handlers::callback::get_callbacks))
}

pub fn health_routes() -> Router<AppState> {
    Router::new().route("/health", get(handlers::health::health_check))
} 
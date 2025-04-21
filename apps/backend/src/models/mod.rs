mod call;
mod user;
mod voice;

pub use call::*;
pub use user::*;
pub use voice::*;

use redis::Client as RedisClient;
use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub redis: RedisClient,
} 
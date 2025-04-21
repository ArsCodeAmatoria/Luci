-- Create custom types
CREATE TYPE call_status AS ENUM ('ringing', 'in_progress', 'completed', 'missed', 'blocked', 'failed');
CREATE TYPE callback_status AS ENUM ('scheduled', 'completed', 'missed', 'cancelled');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    firebase_uid TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    phone_number TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enable_call_screening BOOLEAN NOT NULL DEFAULT TRUE,
    auto_spam_block BOOLEAN NOT NULL DEFAULT FALSE,
    voicemail_greeting TEXT,
    notification_preferences JSONB NOT NULL DEFAULT '{"email_notifications": true, "sms_notifications": true, "push_notifications": true}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)
);

-- Calls table
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caller_number TEXT NOT NULL,
    caller_name TEXT,
    status call_status NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    transcription TEXT,
    spam_score FLOAT,
    intent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Callbacks table
CREATE TABLE IF NOT EXISTS callbacks (
    id UUID PRIMARY KEY,
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caller_number TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    status callback_status NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blocked numbers table
CREATE TABLE IF NOT EXISTS blocked_numbers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, phone_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON calls (user_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls (status);
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls (started_at);
CREATE INDEX IF NOT EXISTS idx_callbacks_user_id ON callbacks (user_id);
CREATE INDEX IF NOT EXISTS idx_callbacks_status ON callbacks (status);
CREATE INDEX IF NOT EXISTS idx_callbacks_scheduled_time ON callbacks (scheduled_time);
CREATE INDEX IF NOT EXISTS idx_blocked_numbers_user_id ON blocked_numbers (user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_numbers_phone_number ON blocked_numbers (phone_number); 
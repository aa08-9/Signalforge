-- FRP-Core Event Store Schema
-- PostgreSQL initialization script

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Event Store Table (immutable)
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    event_type VARCHAR(255) NOT NULL,
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX idx_events_aggregate_id (aggregate_id),
    INDEX idx_events_event_type (event_type),
    INDEX idx_events_timestamp (timestamp),
    INDEX idx_events_version (aggregate_id, version)
);

-- State Snapshots (for fast replay)
CREATE TABLE snapshots (
    id BIGSERIAL PRIMARY KEY,
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(255) NOT NULL,
    state JSONB NOT NULL,
    version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (aggregate_id, version),
    INDEX idx_snapshots_aggregate_id (aggregate_id),
    INDEX idx_snapshots_version (aggregate_id, version DESC)
);

-- Reconciliation Log
CREATE TABLE reconciliation_log (
    id BIGSERIAL PRIMARY KEY,
    reconciliation_id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    aggregate_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'resolved', 'failed')),
    expected_state JSONB NOT NULL,
    actual_state JSONB NOT NULL,
    divergence JSONB,
    resolution_action VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    INDEX idx_recon_status (status),
    INDEX idx_recon_aggregate_id (aggregate_id),
    INDEX idx_recon_created_at (created_at DESC)
);

-- Replay Events (for audit trail)
CREATE TABLE replay_events (
    id BIGSERIAL PRIMARY KEY,
    replay_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    from_version BIGINT NOT NULL,
    to_version BIGINT NOT NULL,
    aggregate_id UUID,
    status VARCHAR(50) NOT NULL CHECK (status IN ('initiated', 'in_progress', 'completed', 'failed')),
    result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    INDEX idx_replay_status (status),
    INDEX idx_replay_aggregate_id (aggregate_id),
    INDEX idx_replay_created_at (created_at DESC)
);

-- Metrics Table (for TimescaleDB hypertable)
CREATE TABLE metrics (
    time TIMESTAMPTZ NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value FLOAT8 NOT NULL,
    labels JSONB DEFAULT '{}',
    PRIMARY KEY (time, metric_name)
);

-- Authentication: JWT Tokens
CREATE TABLE jwt_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    INDEX idx_jwt_user_id (user_id),
    INDEX idx_jwt_expires_at (expires_at)
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'operator', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_events_aggregate_type ON events(aggregate_type);
CREATE INDEX idx_events_payload_gin ON events USING GIN (payload);
CREATE INDEX idx_reconciliation_divergence_gin ON reconciliation_log USING GIN (divergence);

-- Trigger: Auto-update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Insert default admin user (password: admin, hashed with bcrypt in production)
INSERT INTO users (id, username, email, password_hash, role)
VALUES (
    uuid_generate_v4(),
    'admin',
    'admin@frpcore.local',
    '$2b$12$3XQsqr3R7v5Y3K4L4Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z',
    'admin'
) ON CONFLICT (username) DO NOTHING;

COMMIT;

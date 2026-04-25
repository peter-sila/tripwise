-- Add OAuth support to users table
-- This migration adds fields to support OAuth authentication (Google, etc.)

USE tripwise;

-- Add new columns to support OAuth
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_email VARCHAR(255);

-- Make password_hash nullable since OAuth users don't have passwords
ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- Create index on oauth_provider for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth_provider ON users(oauth_provider);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

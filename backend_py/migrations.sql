-- TripWise Database Migration Guide
-- Individual migration files for incremental schema updates
-- Run these in sequence if updating an existing database

-- ============================================================================
-- MIGRATION 1: Initial Schema (tripwise.sql)
-- ============================================================================
-- Complete schema with all 7 tables
-- Run: mysql tripwise < tripwise.sql


-- ============================================================================
-- MIGRATION 2: Add Admin Role Support
-- Run this if updating from older schema
-- ============================================================================
/*
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin', 'super_admin') DEFAULT 'user' AFTER is_admin,
ADD COLUMN IF NOT EXISTS permissions JSON DEFAULT NULL,
ADD INDEX idx_users_role (role);
*/


-- ============================================================================
-- MIGRATION 3: Add OAuth Support
-- Run this if updating from older schema without OAuth
-- ============================================================================
/*
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE AFTER is_admin,
ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50) AFTER google_id,
ADD COLUMN IF NOT EXISTS oauth_email VARCHAR(255) AFTER oauth_provider,
MODIFY COLUMN password_hash VARCHAR(255) NULL,
ADD INDEX IF NOT EXISTS idx_users_oauth_provider (oauth_provider),
ADD INDEX IF NOT EXISTS idx_users_google_id (google_id);
*/


-- ============================================================================
-- MIGRATION 4: Add Contact Messages Table Alias
-- If using 'contacts' table name instead of 'contact_messages'
-- ============================================================================
/*
CREATE TABLE IF NOT EXISTS contacts LIKE contact_messages;
*/


-- ============================================================================
-- Verification Queries - Run these to verify schema
-- ============================================================================

-- List all tables
-- SHOW TABLES;

-- Show users table structure
-- DESCRIBE users;

-- Show all indexes
-- SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = 'tripwise';

-- Show foreign keys
-- SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
-- FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
-- WHERE TABLE_SCHEMA = 'tripwise' AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Check table engines
-- SELECT TABLE_NAME, ENGINE, TABLE_COLLATION FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'tripwise';

-- TripWise Database Schema - Complete and Consolidated
-- Comprehensive SQL combining all migrations and schema updates
-- MySQL 5.7+

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tripwise;
USE tripwise;

-- ============================================================================
-- USERS TABLE - Authentication and user management
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),  -- NULL for OAuth users
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    
    -- Admin Role and Permissions (from migration_add_admin.sql)
    role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
    permissions JSON DEFAULT NULL,
    
    -- OAuth Support (from migration_add_oauth.sql)
    google_id VARCHAR(255) UNIQUE,
    oauth_provider VARCHAR(50),
    oauth_email VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_oauth_provider (oauth_provider),
    INDEX idx_users_google_id (google_id),
    INDEX idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- DESTINATIONS TABLE - Travel destinations
-- ============================================================================
CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url VARCHAR(500),
    category VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for search and filtering
    INDEX idx_destinations_name (name),
    INDEX idx_destinations_category (category),
    INDEX idx_destinations_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- REVIEWS TABLE - User reviews on destinations
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    
    -- Indexes for filtering and sorting
    INDEX idx_reviews_user_id (user_id),
    INDEX idx_reviews_destination_id (destination_id),
    INDEX idx_reviews_rating (rating),
    INDEX idx_reviews_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TRAVEL TIPS TABLE - User-submitted travel tips
-- ============================================================================
CREATE TABLE IF NOT EXISTS travel_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for filtering and sorting
    INDEX idx_travel_tips_user_id (user_id),
    INDEX idx_travel_tips_category (category),
    INDEX idx_travel_tips_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TRIP PLANS TABLE - User trip plans
-- ============================================================================
CREATE TABLE IF NOT EXISTS trip_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for filtering and sorting
    INDEX idx_trip_plans_user_id (user_id),
    INDEX idx_trip_plans_start_date (start_date),
    INDEX idx_trip_plans_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TRIP PLAN ITEMS TABLE - Activities/destinations in trip plans
-- ============================================================================
CREATE TABLE IF NOT EXISTS trip_plan_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_plan_id INT NOT NULL,
    destination_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    time TIME,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (trip_plan_id) REFERENCES trip_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
    
    -- Indexes for filtering and sorting
    INDEX idx_trip_plan_items_trip_plan_id (trip_plan_id),
    INDEX idx_trip_plan_items_destination_id (destination_id),
    INDEX idx_trip_plan_items_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- CONTACTS TABLE - Contact form submissions (from migration_add_contacts.sql)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for filtering and sorting
    INDEX idx_contacts_email (email),
    INDEX idx_contacts_status (status),
    INDEX idx_contacts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SCHEMA SUMMARY
-- ============================================================================
-- Total Tables: 8
--   1. users           - User authentication and management (with OAuth support)
--   2. destinations    - Travel destinations
--   3. reviews         - User reviews on destinations
--   4. travel_tips     - User-submitted travel tips
--   5. trip_plans      - User trip plans
--   6. trip_plan_items - Activities/destinations in trip plans
--   7. contacts        - Contact form submissions
--
-- Consolidated from:
--   ✓ tripwise.sql - Core schema
--   ✓ migration_add_admin.sql - Role and permissions support
--   ✓ migration_add_oauth.sql - OAuth (Google) authentication
--   ✓ migration_add_contacts.sql - Contact messages table
--
-- Relationships:
--   users (1) ──────┬──────> (Many) reviews
--                  ├──────> (Many) travel_tips
--                  └──────> (Many) trip_plans
--                               │
--                               └──> (Many) trip_plan_items ──> destinations (optional)
--
--   destinations (1) ────┬──────> (Many) reviews
--                        └──────> (Many) trip_plan_items
--
--   contacts (Independent - no foreign keys)
--
-- Cascade Delete Rules:
--   - When user is deleted: All reviews, travel_tips, trip_plans, contacts deleted
--   - When trip_plan is deleted: All trip_plan_items deleted
--   - When destination is deleted: All reviews deleted, trip_plan_items.destination_id set to NULL
--
-- Engine: InnoDB (for ACID compliance and foreign key support)
-- Charset: utf8mb4 (for full Unicode support)
-- ============================================================================

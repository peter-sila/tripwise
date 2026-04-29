-- TripWise Database Schema - Complete
-- Comprehensive SQL for creating all database tables
-- Compatible with both PHP and Python backends
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
    
    -- OAuth Support
    google_id VARCHAR(255) UNIQUE,
    oauth_provider VARCHAR(50),
    oauth_email VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_users_email (email),
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
-- CONTACT MESSAGES TABLE - Contact form submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
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
    INDEX idx_contact_messages_email (email),
    INDEX idx_contact_messages_status (status),
    INDEX idx_contact_messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SCHEMA SUMMARY
-- ============================================================================
-- Total Tables: 8
--   1. users           - User authentication and management
--   2. destinations    - Travel destinations
--   3. reviews         - User reviews on destinations
--   4. travel_tips     - User-submitted travel tips
--   5. trip_plans      - User trip plans
--   6. trip_plan_items - Activities/destinations in trip plans
--   7. contact_messages - Contact form submissions
--
-- Relationships:
--   users (1) ----> (Many) reviews
--   users (1) ----> (Many) travel_tips
--   users (1) ----> (Many) trip_plans
--       trip_plans (1) ----> (Many) trip_plan_items
--   destinations (1) ----> (Many) reviews
--   destinations (1) ----> (Many) trip_plan_items (optional)
--
-- Cascade Delete Rules:
--   - When user is deleted: All reviews, travel_tips, trip_plans deleted
--   - When trip_plan is deleted: All trip_plan_items deleted
--   - When destination is deleted: All reviews deleted, trip_plan_items.destination_id set to NULL
--
-- Engine: InnoDB (for ACID compliance and foreign key support)
-- Charset: utf8mb4 (for full Unicode support)
-- ============================================================================

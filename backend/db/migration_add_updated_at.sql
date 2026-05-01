-- Migration: Add updated_at column to tables missing it
-- This migration adds the updated_at column to tables that don't have it yet

USE tripwise_db;

-- Add updated_at to destinations if it doesn't exist
ALTER TABLE destinations 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
AFTER created_at;

-- Add updated_at to reviews if it doesn't exist  
ALTER TABLE reviews 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
AFTER created_at;

-- Add updated_at to travel_tips if it doesn't exist
ALTER TABLE travel_tips 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
AFTER created_at;

-- Add updated_at to trip_plans if it doesn't exist
ALTER TABLE trip_plans 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
AFTER created_at;

-- Add updated_at to trip_plan_items if it doesn't exist
ALTER TABLE trip_plan_items 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
AFTER created_at;

-- Add updated_at to contact_messages if it doesn't exist
ALTER TABLE contact_messages 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
AFTER created_at;

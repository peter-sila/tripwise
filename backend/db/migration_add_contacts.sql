-- Migration: Add Contacts Table
-- Date: 2026-04-28
-- Purpose: Store contact form submissions from visitors

USE tripwise_db;

-- Create contacts table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on email for quick lookups
CREATE INDEX idx_contacts_email ON contacts(email);

-- Create index on status for filtering
CREATE INDEX idx_contacts_status ON contacts(status);

-- Create index on created_at for sorting by date
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

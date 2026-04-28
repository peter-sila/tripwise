-- Migration: Add Admin Role and Permissions to Users Table

-- Add admin role and permissions to users table
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin', 'super_admin') DEFAULT 'user';
ALTER TABLE users ADD COLUMN permissions JSON DEFAULT NULL;
ALTER TABLE users ADD INDEX (role);

-- Update existing admin user (if adding manually later)
-- UPDATE users SET role = 'super_admin', permissions = JSON_OBJECT('all', true) WHERE email = 'admin@tripwise.com';

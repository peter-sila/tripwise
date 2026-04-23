<?php
// ====== CORS Headers for Cross-Origin Requests ======
header("Access-Control-Allow-Origin: http://localhost:5173"); // Adjust to your frontend URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Handle CORS preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
/**
 * TripWise Backend Configuration File
 * 
 * This file contains:
 * - CORS (Cross-Origin Resource Sharing) configuration
 * - Database connection setup
 * - Global application constants
 * - Utility functions for database access
 */

// Include environment variables from constants file
require_once __DIR__ . '/constants.php';

/**
 * Enable CORS Headers
 * 
 * Allows the React frontend (running on different domain/port) to communicate with the PHP backend.
 * IMPORTANT: In production, restrict 'Access-Control-Allow-Origin' to specific domain instead of '*'
 * 
 * @return void
 */
function enableCORS() {
    // Allow requests from any origin (development only - use specific domain in production)
    header('Access-Control-Allow-Origin: *');
    
    // Allowed HTTP methods for API requests
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    
    // Allowed request headers (Content-Type for JSON, Authorization for tokens)
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    // Cache preflight response for 24 hours
    header('Access-Control-Max-Age: 86400');
    
    // Handle browser preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * DATABASE CONFIGURATION CONSTANTS
 * Values imported from constants.php file (environment-specific)
 */
define('DB_HOST', $host);      // MySQL server hostname
define('DB_NAME', $db);        // Database name
define('DB_USER', $user);      // Database username
define('DB_PASS', $pass);      // Database password

/**
 * SECURITY & APPLICATION CONSTANTS
 */
// Secret key for JWT token generation (change this in production to a random string)
define('JWT_SECRET', 'your-secret-key-here');

// Base URL for API endpoints
define('API_BASE_URL', 'http://localhost/tripwise/backend/api/');

// Directory for user uploaded files
define('UPLOAD_DIR', __DIR__ . '/../uploads/');

/**
 * Get Database Connection
 * 
 * Creates and returns a PDO database connection.
 * Uses try-catch to handle connection errors gracefully.
 * 
 * @return PDO Database connection object
 * @throws PDOException if connection fails
 */
function getDBConnection() {
    try {
        // Create PDO connection to MySQL database
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS
        );
        
        // Set error mode to throw exceptions (easier error handling)
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        return $pdo;
    } catch (PDOException $e) {
        // Display connection error and stop execution
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
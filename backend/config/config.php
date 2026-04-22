<?php

require_once __DIR__ . '/constants.php';

// Enable CORS
function enableCORS() {
    // Allow all origins (development only - restrict in production)
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Database configuration
define('DB_HOST', $host);
define('DB_NAME', $db);
define('DB_USER', $user);
define('DB_PASS', $pass);

// JWT Secret Key (change this in production)
define('JWT_SECRET', 'your-secret-key-here');

// API Base URL
define('API_BASE_URL', 'http://localhost/tripwise/backend/api/');

// Other constants
define('UPLOAD_DIR', __DIR__ . '/../uploads/');

// Database connection function
function getDBConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
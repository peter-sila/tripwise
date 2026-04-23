<?php
/**
 * TripWise Authentication & Utility Functions
 * 
 * This file contains:
 * - Utility functions for API responses and input handling
 * - Authentication functions for login/register
 * - Request validation and sanitization
 * - User authorization checks
 */

require_once __DIR__ . '/../config/config.php';

/**
 * ============================================
 * UTILITY FUNCTIONS - API Response & Input
 * ============================================
 */

/**
 * Get JSON Input from Request Body
 * 
 * Reads and decodes the raw JSON request body sent by the frontend
 * 
 * @return array Decoded JSON data as associative array
 */
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

/**
 * Send JSON Response
 * 
 * Sends a JSON response with specified HTTP status code
 * Automatically sets Content-Type header and exits execution
 * 
 * @param array $data Response data to send
 * @param int $statusCode HTTP status code (default: 200 OK)
 * @return void
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Validate Required Fields
 * 
 * Checks if all required fields are present in the data array
 * 
 * @param array $data Data to validate
 * @param array $requiredFields Array of field names that must be present
 * @return array Array of missing field names (empty if all present)
 */
function validateRequired($data, $requiredFields) {
    $missing = [];
    foreach ($requiredFields as $field) {
        // Check if field exists and is not empty
        if (!isset($data[$field]) || empty($data[$field])) {
            $missing[] = $field;
        }
    }
    return $missing;
}

/**
 * Sanitize User Input
 * 
 * Prevents XSS attacks by:
 * - Removing HTML tags
 * - Converting special characters to HTML entities
 * - Trimming whitespace
 * 
 * @param string $input User input to sanitize
 * @return string Sanitized string
 */
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

/**
 * ============================================
 * AUTHENTICATION FUNCTIONS
 * ============================================
 */

/**
 * Authenticate User Credentials
 * 
 * Verifies email and password against database records
 * Uses bcrypt password hashing for security
 * 
 * @param string $email User email address
 * @param string $password User password (plain text)
 * @return array|false User data on success, false on failure
 */
function authenticateUser($email, $password) {
    // Get database connection
    $pdo = getDBConnection();
    
    // Query database for user with this email
    $stmt = $pdo->prepare("SELECT id, email, password_hash, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password matches hash and return user data (without password)
    if ($user && password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']); // Remove password hash for security
        return $user;
    }
    return false;
}

/**
 * Require Authentication
 * 
 * Middleware function to check if request has valid authorization token
 * Extracts Bearer token from Authorization header and verifies user exists
 * 
 * NOTE: Currently using simple token (user_id). Should be upgraded to JWT in production.
 * 
 * @return array Authenticated user data
 * @throws Exception with 401 Unauthorized if token missing or invalid
 */
function requireAuth() {
    // Get all request headers (case-insensitive)
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    // Check for Bearer token format: "Bearer <token>"
    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        throw new Exception('Unauthorized', 401);
    }

    // Extract token value
    $token = $matches[1];
    
    // TODO: In production, verify JWT token properly
    // For now, treat token as user_id
    $userId = (int)$token;

    // Query database to verify user exists
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT id, email, name FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return user data if found, otherwise return 401
    if (!$user) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }

    return $user;
}

/**
 * ============================================
 * AUTH ACTION FUNCTIONS - Login, Register, Logout
 * ============================================
 */

/**
 * Login Action
 * 
 * Processes user login request:
 * 1. Validates email and password are provided
 * 2. Authenticates credentials against database
 * 3. Returns user data and token on success
 * 
 * @return void (Exits with JSON response)
 */
function login() {
    // Parse JSON request body
    $data = getJsonInput();

    // Validate required fields
    $required = ['email', 'password'];
    $missing = validateRequired($data, $required);

    if (!empty($missing)) {
        sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }

    // Sanitize input (password is not sanitized to preserve special characters)
    $email = sanitizeInput($data['email']);
    $password = $data['password'];

    // Verify credentials
    $user = authenticateUser($email, $password);

    if (!$user) {
        sendResponse(['error' => 'Invalid email or password'], 401);
    }

    // Generate token (currently simple, should be JWT in production)
    $token = $user['id'];

    // Return success response with user data and token
    sendResponse(['message' => 'Login successful', 'user' => $user, 'token' => $token]);
}

/**
 * Register Action
 * 
 * Processes new user registration:
 * 1. Validates email, password, and name are provided
 * 2. Validates email format and password strength
 * 3. Checks email doesn't already exist
 * 4. Hashes password and inserts new user into database
 * 
 * @return void (Exits with JSON response)
 */
function register() {
    // Parse JSON request body
    $data = getJsonInput();

    // Validate all required fields present
    $required = ['email', 'password', 'name'];
    $missing = validateRequired($data, $required);

    if (!empty($missing)) {
        sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }

    // Sanitize inputs
    $email = sanitizeInput($data['email']);
    $name = sanitizeInput($data['name']);
    $password = $data['password'];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(['error' => 'Invalid email format'], 400);
    }

    // Validate password minimum length
    if (strlen($password) < 6) {
        sendResponse(['error' => 'Password must be at least 6 characters'], 400);
    }

    // Get database connection
    $pdo = getDBConnection();

    // Check if email already registered
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(['error' => 'Email already exists'], 409);
    }

    // Hash password using bcrypt algorithm
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user into database
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)");
    $stmt->execute([$email, $passwordHash, $name]);

    // Get ID of newly created user
    $userId = $pdo->lastInsertId();

    // Return success response with new user ID
    sendResponse(['message' => 'Registration successful', 'user_id' => $userId], 201);
}

/**
 * Logout Action
 * 
 * Processes user logout:
 * For stateless token-based auth, logout is primarily handled on client-side
 * (Frontend simply removes token from localStorage)
 * 
 * This endpoint serves as acknowledgment and future session management
 * 
 * @return void (Exits with JSON response)
 */
function logout() {
    // For stateless JWT, logout is handled on client side (remove token from storage)
    // If using session-based auth, would destroy session here: session_destroy()
    sendResponse(['message' => 'Logout successful']);
}
?>
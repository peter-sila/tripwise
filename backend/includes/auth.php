<?php
require_once __DIR__ . '/../config/config.php';

// Utility functions
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function validateRequired($data, $requiredFields) {
    $missing = [];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $missing[] = $field;
        }
    }
    return $missing;
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Authentication functions
function authenticateUser($email, $password) {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT id, email, password_hash, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']); // Don't return password hash
        return $user;
    }
    return false;
}

function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }

    $token = $matches[1];
    // For simplicity, using a simple token check. In production, use JWT.
    // Assuming token is user_id for now.
    $userId = (int)$token;

    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT id, email, name FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }

    return $user;
}

function login() {
    $data = getJsonInput();

    $required = ['email', 'password'];
    $missing = validateRequired($data, $required);

    if (!empty($missing)) {
        sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }

    $email = sanitizeInput($data['email']);
    $password = $data['password'];

    $user = authenticateUser($email, $password);

    if (!$user) {
        sendResponse(['error' => 'Invalid email or password'], 401);
    }

    // Simple token: user_id. In production, generate JWT.
    $token = $user['id'];

    sendResponse(['message' => 'Login successful', 'user' => $user, 'token' => $token]);
}

function register() {
    $data = getJsonInput();

    $required = ['email', 'password', 'name'];
    $missing = validateRequired($data, $required);

    if (!empty($missing)) {
        sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }

    $email = sanitizeInput($data['email']);
    $name = sanitizeInput($data['name']);
    $password = $data['password'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(['error' => 'Invalid email format'], 400);
    }

    if (strlen($password) < 6) {
        sendResponse(['error' => 'Password must be at least 6 characters'], 400);
    }

    $pdo = getDBConnection();

    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(['error' => 'Email already exists'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)");
    $stmt->execute([$email, $passwordHash, $name]);

    $userId = $pdo->lastInsertId();

    sendResponse(['message' => 'Registration successful', 'user_id' => $userId], 201);
}

function logout() {
    // For stateless JWT, logout is handled on client side.
    // If using sessions, destroy session here.
    sendResponse(['message' => 'Logout successful']);
}
?>
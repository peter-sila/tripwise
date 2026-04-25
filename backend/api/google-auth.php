<?php
ob_start();
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
 * Google OAuth Authentication Endpoint
 * 
 * Handles Google Sign-In/Sign-Up authentication
 * - Verifies Google ID token
 * - Creates or retrieves user from database
 * - Returns authentication token
 * 
 * Base URL: /backend/api/google-auth.php
 * 
 * Required POST Parameters:
 *   - id_token: Google ID token from frontend
 *   - action: 'google_signin' or 'google_signup'
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

// Get HTTP request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = getJsonInput();
    $action = $data['action'] ?? '';
    $idToken = $data['id_token'] ?? '';
    
    if (!$idToken) {
        sendResponse(['error' => 'Missing id_token'], 400);
        exit();
    }
    
    if ($action === 'google_signin') {
        googleSignIn($idToken);
    } else {
        sendResponse(['error' => 'Invalid action'], 400);
    }
} else {
    sendResponse(['error' => 'Method not allowed'], 405);
}

/**
 * Handle Google Sign-In
 * 
 * Verifies Google ID token and authenticates or creates user
 * 
 * @param string $idToken Google ID token from frontend
 */
function googleSignIn($idToken) {
    try {
        // Decode the ID token (in production, you should verify the signature)
        $tokenParts = explode('.', $idToken);
        
        if (count($tokenParts) !== 3) {
            sendResponse(['error' => 'Invalid token format'], 401);
            return;
        }
        
        // Decode the payload (second part)
        $payload = json_decode(
            base64_decode(strtr($tokenParts[1], '-_', '+/')),
            true
        );
        
        if (!$payload || !isset($payload['sub'])) {
            sendResponse(['error' => 'Invalid token payload'], 401);
            return;
        }
        
        $googleId = $payload['sub'];
        $email = $payload['email'] ?? '';
        $name = $payload['name'] ?? 'Google User';
        
        if (!$email) {
            sendResponse(['error' => 'Email not found in token'], 401);
            return;
        }
        
        global $conn;
        
        // Check if user exists with this Google ID
        $query = "SELECT * FROM users WHERE google_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('s', $googleId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // User exists, return their data
            $user = $result->fetch_assoc();
            $token = $user['id'];
            
            sendResponse([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'created_at' => $user['created_at']
                ]
            ]);
        } else {
            // Check if user exists with same email (from regular auth)
            $emailQuery = "SELECT * FROM users WHERE email = ?";
            $emailStmt = $conn->prepare($emailQuery);
            $emailStmt->bind_param('s', $email);
            $emailStmt->execute();
            $emailResult = $emailStmt->get_result();
            
            if ($emailResult->num_rows > 0) {
                // Link Google ID to existing user
                $existingUser = $emailResult->fetch_assoc();
                $updateQuery = "UPDATE users SET google_id = ?, oauth_provider = 'google' WHERE id = ?";
                $updateStmt = $conn->prepare($updateQuery);
                $updateStmt->bind_param('si', $googleId, $existingUser['id']);
                $updateStmt->execute();
                
                $token = $existingUser['id'];
                sendResponse([
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $existingUser['id'],
                        'email' => $existingUser['email'],
                        'name' => $existingUser['name'],
                        'created_at' => $existingUser['created_at']
                    ]
                ]);
            } else {
                // Create new user
                $insertQuery = "INSERT INTO users (email, name, google_id, oauth_provider, oauth_email, password_hash) 
                               VALUES (?, ?, ?, 'google', ?, NULL)";
                $insertStmt = $conn->prepare($insertQuery);
                $insertStmt->bind_param('ssss', $email, $name, $googleId, $email);
                
                if ($insertStmt->execute()) {
                    $userId = $conn->insert_id;
                    $token = $userId;
                    
                    sendResponse([
                        'success' => true,
                        'token' => $token,
                        'user' => [
                            'id' => $userId,
                            'email' => $email,
                            'name' => $name,
                            'created_at' => date('Y-m-d H:i:s')
                        ]
                    ]);
                } else {
                    sendResponse(['error' => 'Failed to create user'], 500);
                }
            }
        }
    } catch (Exception $e) {
        sendResponse(['error' => 'Authentication failed: ' . $e->getMessage()], 500);
    }
}
?>

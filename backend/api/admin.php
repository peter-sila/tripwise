<?php
ob_start();
// ====== CORS Headers for Cross-Origin Requests ======
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Handle CORS preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';

/**
 * Helper Functions
 */
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateAdminToken($adminId) {
    // In production, use JWT. For now, use a simple token
    $token = bin2hex(random_bytes(32));
    // In production, store this in a token table
    return [
        'token' => $token,
        'admin_id' => $adminId
    ];
}

/**
 * Admin Authentication & Management API
 */

$method = $_SERVER['REQUEST_METHOD'];
$data = getJsonInput();

switch ($method) {
    case 'POST':
        $action = $data['action'] ?? '';
        
        if ($action === 'login') {
            adminLogin($data);
        } elseif ($action === 'logout') {
            sendResponse(['success' => true, 'message' => 'Logged out successfully']);
        } else {
            sendResponse(['error' => 'Invalid action'], 400);
        }
        break;

    case 'GET':
        // Verify admin token
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';
        
        if (!$token) {
            sendResponse(['error' => 'Unauthorized'], 401);
        }
        
        // For now, validate token exists (in production, validate JWT)
        sendResponse(['authenticated' => true]);
        break;

    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}

/**
 * Admin Login Function
 */
function adminLogin($data) {
    global $pdo;
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    // Validate input
    if (empty($email) || empty($password)) {
        sendResponse(['error' => 'Email and password are required'], 400);
    }
    
    try {
        // Get admin from database
        $stmt = $pdo->prepare('SELECT id, email, name, password_hash, role, status, permissions FROM admins WHERE email = ?');
        $stmt->execute([$email]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin) {
            sendResponse(['error' => 'Invalid email or password'], 401);
        }
        
        // Check if admin is active
        if ($admin['status'] !== 'active') {
            sendResponse(['error' => 'Admin account is inactive'], 403);
        }
        
        // Verify password
        if (!verifyPassword($password, $admin['password_hash'])) {
            sendResponse(['error' => 'Invalid email or password'], 401);
        }
        
        // Update last login
        $updateStmt = $pdo->prepare('UPDATE admins SET last_login = NOW() WHERE id = ?');
        $updateStmt->execute([$admin['id']]);
        
        // Generate token
        $tokenData = generateAdminToken($admin['id']);
        
        // Return success response
        sendResponse([
            'success' => true,
            'message' => 'Login successful',
            'token' => $tokenData['token'],
            'admin' => [
                'id' => $admin['id'],
                'email' => $admin['email'],
                'name' => $admin['name'],
                'role' => $admin['role'],
                'permissions' => json_decode($admin['permissions'], true)
            ]
        ], 200);
        
    } catch (PDOException $e) {
        sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
}
?>

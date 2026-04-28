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

/**
 * Contact Form API Endpoint
 * 
 * Handles contact form submissions from visitors
 * 
 * Base URL: /backend/api/contact.php
 */

require_once __DIR__ . '/../config/config.php';

// Database connection
$host = 'localhost';
$db = 'tripwise_db';
$user = 'root';
$pass = 'wise';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        /**
         * POST - Submit Contact Form
         * 
         * Request Body (JSON):
         *   - name (required): Visitor's name
         *   - email (required): Visitor's email address
         *   - phone (optional): Visitor's phone number
         *   - subject (required): Message subject
         *   - message (required): Message content
         * 
         * Returns: { success: true, message: "...", id: <contact_id> }
         */
        
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required_fields = ['name', 'email', 'subject', 'message'];
        $missing = [];
        
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: ' . implode(', ', $missing)]);
            exit();
        }
        
        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email address']);
            exit();
        }
        
        // Sanitize inputs
        $name = trim($input['name']);
        $email = trim($input['email']);
        $phone = trim($input['phone'] ?? '');
        $subject = trim($input['subject']);
        $message = trim($input['message']);
        
        // Validate length
        if (strlen($name) > 255) {
            http_response_code(400);
            echo json_encode(['error' => 'Name is too long']);
            exit();
        }
        
        if (strlen($subject) > 255) {
            http_response_code(400);
            echo json_encode(['error' => 'Subject is too long']);
            exit();
        }
        
        if (strlen($message) < 10) {
            http_response_code(400);
            echo json_encode(['error' => 'Message must be at least 10 characters']);
            exit();
        }
        
        // Insert into database
        try {
            $query = "INSERT INTO contacts (name, email, phone, subject, message, status) 
                      VALUES (:name, :email, :phone, :subject, :message, 'new')";
            
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':phone' => $phone,
                ':subject' => $subject,
                ':message' => $message
            ]);
            
            $contact_id = $pdo->lastInsertId();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Your message has been received. We will get back to you soon!',
                'id' => $contact_id
            ]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save contact message']);
        }
        break;
        
    case 'GET':
        /**
         * GET - Retrieve Contact Messages (for admin dashboard - requires authentication)
         * 
         * Query Parameters:
         *   - status (optional): Filter by status (new, read, responded)
         *   - limit (optional): Number of records to return (default: 50)
         *   - offset (optional): Pagination offset (default: 0)
         * 
         * Returns: { contacts: [...], total: <count> }
         */
        
        // For now, allow public access. In production, add authentication check
        
        $status = $_GET['status'] ?? null;
        $limit = (int)($_GET['limit'] ?? 50);
        $offset = (int)($_GET['offset'] ?? 0);
        
        // Build query
        $query = "SELECT * FROM contacts WHERE 1=1";
        $params = [];
        
        if ($status) {
            $query .= " AND status = ?";
            $params[] = $status;
        }
        
        $query .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get total count
        $count_query = "SELECT COUNT(*) as total FROM contacts WHERE 1=1";
        $count_params = [];
        
        if ($status) {
            $count_query .= " AND status = ?";
            $count_params[] = $status;
        }
        
        $count_stmt = $pdo->prepare($count_query);
        $count_stmt->execute($count_params);
        $count_result = $count_stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            'contacts' => $contacts,
            'total' => $count_result['total']
        ]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

ob_end_flush();
?>

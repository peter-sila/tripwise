<?php
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
 * Travel Tips API Endpoint
 * 
 * Handles travel advice and tips operations:
 * - GET: Retrieve travel tips with optional category filtering
 * - POST: Submit new travel tip (requires authentication)
 * 
 * Base URL: /backend/api/travelTips.php
 * 
 * Travel tips include advice on:
 * - packing: What to bring and how to pack efficiently
 * - safety: Personal safety and health precautions
 * - budget: Money-saving travel tips
 * - health: Health considerations and recommendations
 * - culture: Cultural etiquette and customs
 * - transport: Transportation options and advice
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

// Enable CORS headers for cross-origin requests from frontend
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

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

// Route requests based on HTTP method
switch ($method) {
    case 'GET':
        /**
         * GET - List Travel Tips
         * 
         * Query Parameters:
         *   - category (optional): Filter by category (packing, safety, budget, health, culture, transport)
         * 
         * Returns: { travel_tips: [...] }
         * Each tip includes: id, user_id, title, content, category, user_name, created_at
         */
        
        // Get optional category filter from query string
        $category = $_GET['category'] ?? '';

        // Build base query with user name join
        // Join users table to include tip author's name
        $query = "SELECT t.*, u.name as user_name FROM travel_tips t JOIN users u ON t.user_id = u.id WHERE 1=1";
        $params = [];

        // Add category filter if provided
        if ($category) {
            $query .= " AND t.category = ?";
            $params[] = $category;
        }

        // Sort by newest first
        $query .= " ORDER BY t.created_at DESC";

        // Execute query and fetch all matching tips
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return tips list
        sendResponse(['travel_tips' => $tips]);
        break;

    case 'POST':
        /**
         * POST - Create New Travel Tip
         * 
         * Requires: Authentication token in Authorization header
         * 
         * Request Body (JSON):
         *   - title (required): Short title for the tip
         *   - content (required): Detailed tip content/advice
         *   - category (optional): Category classification
         * 
         * Returns: { message: "...", id: <new_id> }
         * 
         * Validation:
         *   - Title and content must be provided
         *   - Text sanitized to prevent XSS attacks
         *   - Category matched to predefined list
         */
        
        // Verify user is authenticated
        $user = requireAuth();
        
        // Parse incoming JSON data
        $data = getJsonInput();

        // Validate all required fields are present
        $required = ['title', 'content'];
        $missing = validateRequired($data, $required);

        // Return error if required fields missing
        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        // Extract and sanitize input data
        $title = sanitizeInput($data['title']);
        $content = sanitizeInput($data['content']);
        $category = $data['category'] ?? '';

        // Insert new travel tip into database
        $stmt = $pdo->prepare(
            "INSERT INTO travel_tips (user_id, title, content, category) 
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$user['id'], $title, $content, $category]);

        // Return success response
        sendResponse(['message' => 'Travel tip added successfully'], 201);
        break;

    default:
        // Handle unsupported HTTP methods
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
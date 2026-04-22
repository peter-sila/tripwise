<?php
/**
 * Reviews API Endpoint
 * 
 * Handles review operations for destinations:
 * - GET: Retrieve reviews for a specific destination
 * - POST: Submit a new review (requires authentication)
 * 
 * Base URL: /backend/api/reviews.php
 * 
 * Reviews include:
 * - User name (from users table join)
 * - Rating (1-5 scale)
 * - Comment/text
 * - Creation timestamp
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

// Enable CORS headers for cross-origin requests from frontend
enableCORS();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

// Route requests based on HTTP method
switch ($method) {
    case 'GET':
        /**
         * GET - List Reviews for Destination
         * 
         * Query Parameters:
         *   - destination_id (required): ID of destination to get reviews for
         * 
         * Returns: { reviews: [...] }
         * Each review includes: id, user_id, destination_id, rating, comment, user_name, created_at
         */
        
        // Get destination ID from query parameters
        $destination_id = $_GET['destination_id'] ?? null;

        // Validate destination ID is provided
        if (!$destination_id) {
            sendResponse(['error' => 'Destination ID required'], 400);
        }

        // Query reviews with user name joined from users table
        // Join ensures we can display reviewer's name with each review
        // Sort by newest first (ORDER BY created_at DESC)
        $stmt = $pdo->prepare("
            SELECT r.*, u.name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.destination_id = ? 
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$destination_id]);
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return reviews list
        sendResponse(['reviews' => $reviews]);
        break;

    case 'POST':
        /**
         * POST - Create New Review
         * 
         * Requires: Authentication token in Authorization header
         * 
         * Request Body (JSON):
         *   - destination_id (required): ID of destination being reviewed
         *   - rating (required): Rating 1-5 (1=poor, 5=excellent)
         *   - comment (required): Review text/comment
         * 
         * Returns: { message: "...", user_id: <id> }
         * 
         * Validation:
         *   - All fields must be provided
         *   - Rating must be integer between 1 and 5
         *   - Comment text sanitized to prevent XSS
         */
        
        // Verify user is authenticated
        $user = requireAuth();
        
        // Parse incoming JSON data
        $data = getJsonInput();

        // Validate all required fields are present
        $required = ['destination_id', 'rating', 'comment'];
        $missing = validateRequired($data, $required);

        // Return error if any required fields missing
        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        // Extract and cast data (ensure correct types)
        $destination_id = (int)$data['destination_id'];
        $rating = (int)$data['rating'];
        $comment = sanitizeInput($data['comment']);

        // Validate rating is within acceptable range (1-5)
        if ($rating < 1 || $rating > 5) {
            sendResponse(['error' => 'Rating must be between 1 and 5'], 400);
        }

        // Insert review into database with user ID, destination, rating, and comment
        $stmt = $pdo->prepare(
            "INSERT INTO reviews (user_id, destination_id, rating, comment) 
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$user['id'], $destination_id, $rating, $comment]);

        // Return success response
        sendResponse(['message' => 'Review added successfully'], 201);
        break;

    default:
        // Handle unsupported HTTP methods
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
?>
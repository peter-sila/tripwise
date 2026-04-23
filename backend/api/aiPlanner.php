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
 * AI Trip Planner API Endpoint
 * 
 * Handles trip planning operations:
 * - GET: Retrieve user's trip plans with associated activities/destinations
 * - POST: Create new trip plan with optional itinerary items
 * 
 * Base URL: /backend/api/aiPlanner.php
 * 
 * Features:
 * - Trip plan creation with title, description, date range
 * - Add multiple destinations/activities to each trip
 * - Organize itinerary by date and time
 * - Track all user trip plans with related items
 * 
 * Note: AI recommendations (not yet implemented)
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
         * GET - List User's Trip Plans
         * 
         * Requires: Authentication token in Authorization header
         * 
         * Returns: { trip_plans: [...] }
         * Each plan includes:
         *   - id, user_id, title, description, start_date, end_date, created_at
         *   - items: Array of trip plan items (destinations, activities, times)
         */
        
        // Verify user is authenticated
        $user = requireAuth();

        // Fetch all trip plans for the authenticated user
        // Sorted by newest first (most recent plans first)
        $stmt = $pdo->prepare(
            "SELECT * FROM trip_plans WHERE user_id = ? ORDER BY created_at DESC"
        );
        $stmt->execute([$user['id']]);
        $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // For each trip plan, fetch associated items (destinations, activities, etc.)
        // This creates a nested structure with items inside each plan
        foreach ($plans as &$plan) {
            // Get all items for this trip, sorted by date and time
            $stmt = $pdo->prepare(
                "SELECT * FROM trip_plan_items WHERE trip_plan_id = ? ORDER BY date, time"
            );
            $stmt->execute([$plan['id']]);
            $plan['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // Return plans with nested items
        sendResponse(['trip_plans' => $plans]);
        break;

    case 'POST':
        /**
         * POST - Create New Trip Plan
         * 
         * Requires: Authentication token in Authorization header
         * 
         * Request Body (JSON):
         *   - title (required): Trip plan name
         *   - description (optional): Detailed description
         *   - start_date (optional): Trip start date (YYYY-MM-DD)
         *   - end_date (optional): Trip end date (YYYY-MM-DD)
         *   - items (optional): Array of itinerary items
         *       Each item:
         *         - title (required): Activity/destination name
         *         - destination_id (optional): Associated destination ID
         *         - description (optional): Activity details
         *         - date (optional): Date for this item (YYYY-MM-DD)
         *         - time (optional): Time for this item (HH:MM:SS)
         * 
         * Returns: { message: "...", plan_id: <new_id> }
         * 
         * Example Request:
         * {
         *   "title": "5-Day Safari Adventure",
         *   "description": "Explore Masai Mara wildlife",
         *   "start_date": "2024-06-01",
         *   "end_date": "2024-06-05",
         *   "items": [
         *     {
         *       "title": "Arrive at lodge",
         *       "destination_id": 1,
         *       "date": "2024-06-01",
         *       "time": "14:00:00"
         *     }
         *   ]
         * }
         */
        
        // Verify user is authenticated
        $user = requireAuth();
        
        // Parse incoming JSON data
        $data = getJsonInput();

        // Validate required fields
        $required = ['title'];
        $missing = validateRequired($data, $required);

        // Return error if required fields missing
        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        // Extract and sanitize trip plan data
        $title = sanitizeInput($data['title']);
        $description = $data['description'] ?? '';
        $start_date = $data['start_date'] ?? null;
        $end_date = $data['end_date'] ?? null;

        // Insert new trip plan into database
        $stmt = $pdo->prepare(
            "INSERT INTO trip_plans (user_id, title, description, start_date, end_date) 
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$user['id'], $title, $description, $start_date, $end_date]);

        // Get the ID of newly created trip plan
        $planId = $pdo->lastInsertId();

        // Add itinerary items if provided in request
        if (isset($data['items']) && is_array($data['items'])) {
            // Loop through each item in the items array
            foreach ($data['items'] as $item) {
                // Extract and sanitize item data
                $itemTitle = sanitizeInput($item['title'] ?? '');
                $itemDescription = $item['description'] ?? '';
                $destination_id = $item['destination_id'] ?? null;
                $date = $item['date'] ?? null;
                $time = $item['time'] ?? null;

                // Insert each item into trip_plan_items table
                $stmt = $pdo->prepare(
                    "INSERT INTO trip_plan_items (trip_plan_id, destination_id, title, description, date, time) 
                     VALUES (?, ?, ?, ?, ?, ?)"
                );
                $stmt->execute([$planId, $destination_id, $itemTitle, $itemDescription, $date, $time]);
            }
        }

        // Return success response with new trip plan ID
        sendResponse(['message' => 'Trip plan created successfully', 'plan_id' => $planId], 201);
        break;

    default:
        // Handle unsupported HTTP methods
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
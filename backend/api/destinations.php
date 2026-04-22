<?php
/**
 * Destinations API Endpoint
 * 
 * Handles all destination-related operations:
 * - GET: Retrieve list of destinations with optional search and category filtering
 * - POST: Create new destination (requires authentication)
 * 
 * Base URL: /backend/api/destinations.php
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
         * GET - List Destinations
         * 
         * Query Parameters:
         *   - search (optional): Search term to filter by name, description, or location
         *   - category (optional): Filter by category (accommodation, gastronomy, activity)
         * 
         * Returns: { destinations: [...] }
         */
        
        // Get search and category parameters from query string
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? '';

        // Build dynamic SQL query based on filters
        $query = "SELECT * FROM destinations WHERE 1=1";
        $params = [];

        // Add search filter if provided
        if ($search) {
            $query .= " AND (name LIKE ? OR description LIKE ? OR location LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        // Add category filter if provided
        if ($category) {
            $query .= " AND category = ?";
            $params[] = $category;
        }

        // Execute query and return results
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(['destinations' => $destinations]);
        break;

    case 'POST':
        /**
         * POST - Create New Destination
         * 
         * Requires: Authentication token in Authorization header
         * 
         * Request Body (JSON):
         *   - name (required): Destination name
         *   - description (required): Detailed description
         *   - location (required): Geographic location
         *   - image_url (optional): URL to destination image
         *   - category (optional): Category type
         * 
         * Returns: { message: "...", id: <new_id> }
         */
        
        // Verify user is authenticated
        $user = requireAuth();
        
        // Parse incoming JSON data
        $data = getJsonInput();

        // Validate all required fields are present
        $required = ['name', 'description', 'location'];
        $missing = validateRequired($data, $required);

        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        // Sanitize input to prevent XSS
        $name = sanitizeInput($data['name']);
        $description = sanitizeInput($data['description']);
        $location = sanitizeInput($data['location']);
        $image_url = $data['image_url'] ?? '';
        $category = $data['category'] ?? '';

        // Insert new destination into database
        $stmt = $pdo->prepare(
            "INSERT INTO destinations (name, description, location, image_url, category) 
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$name, $description, $location, $image_url, $category]);

        // Return success response with new destination ID
        sendResponse(['message' => 'Destination added successfully', 'id' => $pdo->lastInsertId()], 201);
        break;

    default:
        // Handle unsupported HTTP methods
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
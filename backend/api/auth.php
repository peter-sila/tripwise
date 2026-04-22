<?php
/**
 * Authentication API Endpoint
 * 
 * Handles all user authentication operations:
 * - POST /auth.php: Perform login, register, or logout actions
 * - GET /auth.php: Verify current user authentication status
 * 
 * Base URL: /backend/api/auth.php
 * 
 * Authentication Methods:
 * - Registration: Create new user account with email/password
 * - Login: Authenticate existing user and receive token
 * - Logout: Clear user session (tokens are stateless, no server state)
 * - Verify: Check if provided token is valid and get user info
 * 
 * Token Format: Currently simple user ID (production should use JWT)
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

// Enable CORS headers for cross-origin requests from frontend
enableCORS();

// Get HTTP request method (POST or GET)
$method = $_SERVER['REQUEST_METHOD'];

// Route requests based on HTTP method
switch ($method) {
    case 'POST':
        /**
         * POST - Authentication Actions
         * 
         * Supported Actions:
         * 1. action=register - Create new user account
         * 2. action=login - Authenticate existing user
         * 3. action=logout - Logout user (clear token)
         * 
         * Request body must include 'action' field specifying which operation to perform.
         * Additional fields depend on the action (see login(), register(), logout() functions).
         */
        
        // Parse incoming JSON data
        $data = getJsonInput();
        $action = $data['action'] ?? '';

        // Route to appropriate function based on action
        if ($action === 'login') {
            // Handle user login
            // See includes/auth.php for implementation
            login();
        } elseif ($action === 'register') {
            // Handle user registration
            // See includes/auth.php for implementation
            register();
        } elseif ($action === 'logout') {
            // Handle user logout
            // See includes/auth.php for implementation
            logout();
        } else {
            // Invalid action specified
            sendResponse(['error' => 'Invalid action'], 400);
        }
        break;

    case 'GET':
        /**
         * GET - Verify Authentication
         * 
         * Requires: Authentication token in Authorization header
         * Format: Authorization: Bearer <token>
         * 
         * Returns: { user: {...} }
         * User object includes: id, email, name, created_at
         */
        
        // Verify user is authenticated (throws error if not)
        // requireAuth() checks Authorization header for valid token
        $user = requireAuth();
        
        // Return authenticated user information
        sendResponse(['user' => $user]);
        break;

    default:
        // Handle unsupported HTTP methods
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
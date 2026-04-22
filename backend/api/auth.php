<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

enableCORS();

// Authentication API
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = getJsonInput();
        $action = $data['action'] ?? '';

        if ($action === 'login') {
            login();
        } elseif ($action === 'register') {
            register();
        } elseif ($action === 'logout') {
            logout();
        } else {
            sendResponse(['error' => 'Invalid action'], 400);
        }
        break;

    case 'GET':
        // Check if user is authenticated
        $user = requireAuth();
        sendResponse(['user' => $user]);
        break;

    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
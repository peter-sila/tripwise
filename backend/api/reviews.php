<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

enableCORS();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        // Get reviews for a destination
        $destination_id = $_GET['destination_id'] ?? null;

        if (!$destination_id) {
            sendResponse(['error' => 'Destination ID required'], 400);
        }

        $stmt = $pdo->prepare("
            SELECT r.*, u.name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.destination_id = ? 
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$destination_id]);
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(['reviews' => $reviews]);
        break;

    case 'POST':
        // Add a review
        $user = requireAuth();
        $data = getJsonInput();

        $required = ['destination_id', 'rating', 'comment'];
        $missing = validateRequired($data, $required);

        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        $destination_id = (int)$data['destination_id'];
        $rating = (int)$data['rating'];
        $comment = sanitizeInput($data['comment']);

        if ($rating < 1 || $rating > 5) {
            sendResponse(['error' => 'Rating must be between 1 and 5'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user['id'], $destination_id, $rating, $comment]);

        sendResponse(['message' => 'Review added successfully'], 201);
        break;

    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

enableCORS();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        // Get all travel tips or by category
        $category = $_GET['category'] ?? '';

        $query = "SELECT t.*, u.name as user_name FROM travel_tips t JOIN users u ON t.user_id = u.id WHERE 1=1";
        $params = [];

        if ($category) {
            $query .= " AND t.category = ?";
            $params[] = $category;
        }

        $query .= " ORDER BY t.created_at DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(['travel_tips' => $tips]);
        break;

    case 'POST':
        // Add a travel tip
        $user = requireAuth();
        $data = getJsonInput();

        $required = ['title', 'content'];
        $missing = validateRequired($data, $required);

        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        $title = sanitizeInput($data['title']);
        $content = sanitizeInput($data['content']);
        $category = $data['category'] ?? '';

        $stmt = $pdo->prepare("INSERT INTO travel_tips (user_id, title, content, category) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user['id'], $title, $content, $category]);

        sendResponse(['message' => 'Travel tip added successfully'], 201);
        break;

    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
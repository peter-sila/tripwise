<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

enableCORS();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        // Get all destinations or search
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? '';

        $query = "SELECT * FROM destinations WHERE 1=1";
        $params = [];

        if ($search) {
            $query .= " AND (name LIKE ? OR description LIKE ? OR location LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        if ($category) {
            $query .= " AND category = ?";
            $params[] = $category;
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(['destinations' => $destinations]);
        break;

    case 'POST':
        // Add new destination (admin only, but for now allow authenticated users)
        $user = requireAuth();
        $data = getJsonInput();

        $required = ['name', 'description', 'location'];
        $missing = validateRequired($data, $required);

        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        $name = sanitizeInput($data['name']);
        $description = sanitizeInput($data['description']);
        $location = sanitizeInput($data['location']);
        $image_url = $data['image_url'] ?? '';
        $category = $data['category'] ?? '';

        $stmt = $pdo->prepare("INSERT INTO destinations (name, description, location, image_url, category) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $description, $location, $image_url, $category]);

        sendResponse(['message' => 'Destination added successfully', 'id' => $pdo->lastInsertId()], 201);
        break;

    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
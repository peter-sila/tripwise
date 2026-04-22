<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/auth.php';

enableCORS();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        // Get user's trip plans
        $user = requireAuth();

        $stmt = $pdo->prepare("SELECT * FROM trip_plans WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user['id']]);
        $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get items for each plan
        foreach ($plans as &$plan) {
            $stmt = $pdo->prepare("SELECT * FROM trip_plan_items WHERE trip_plan_id = ? ORDER BY date, time");
            $stmt->execute([$plan['id']]);
            $plan['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        sendResponse(['trip_plans' => $plans]);
        break;

    case 'POST':
        // Create a new trip plan
        $user = requireAuth();
        $data = getJsonInput();

        $required = ['title'];
        $missing = validateRequired($data, $required);

        if (!empty($missing)) {
            sendResponse(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
        }

        $title = sanitizeInput($data['title']);
        $description = $data['description'] ?? '';
        $start_date = $data['start_date'] ?? null;
        $end_date = $data['end_date'] ?? null;

        $stmt = $pdo->prepare("INSERT INTO trip_plans (user_id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user['id'], $title, $description, $start_date, $end_date]);

        $planId = $pdo->lastInsertId();

        // Add items if provided
        if (isset($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                $itemTitle = sanitizeInput($item['title'] ?? '');
                $itemDescription = $item['description'] ?? '';
                $destination_id = $item['destination_id'] ?? null;
                $date = $item['date'] ?? null;
                $time = $item['time'] ?? null;

                $stmt = $pdo->prepare("INSERT INTO trip_plan_items (trip_plan_id, destination_id, title, description, date, time) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$planId, $destination_id, $itemTitle, $itemDescription, $date, $time]);
            }
        }

        sendResponse(['message' => 'Trip plan created successfully', 'plan_id' => $planId], 201);
        break;

    default:
        sendResponse(['error' => 'Method not allowed'], 405);
}
?>
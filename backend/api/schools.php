<?php
// backend/api/schools.php

$method = $_SERVER['REQUEST_METHOD'];

// Middleware: Verify Admin Access
$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

// Allow GET to be public
if ($method !== 'GET') {
    if (!$user_data || $user_data['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["message" => "Forbidden - Admin access only"]);
        exit();
    }
}

if ($method === 'GET') {
    // List all schools
    try {
        $stmt = $db->query("SELECT u.id as user_id, u.email, u.status, s.id, s.name, s.description, u.created_at 
                            FROM schools s 
                            JOIN users u ON s.user_id = u.id 
                            ORDER BY u.created_at DESC");
        $schools = $stmt->fetchAll();
        echo json_encode($schools);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to fetch schools", "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Create new school (Account + Profile)
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->email) || empty($data->name)) {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data"]);
        exit();
    }

    try {
        // Check if email already exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(["message" => "A user with this email already exists"]);
            exit();
        }

        $db->beginTransaction();

        // 1. Create User account (Default Password)
        $default_password = 'Password123!';
        $password_hash = password_hash($default_password, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, 'school', 'active')");
        $stmt->execute([$data->email, $password_hash]);
        $user_id = $db->lastInsertId();

        // 2. Create School profile
        $stmt = $db->prepare("INSERT INTO schools (user_id, name) VALUES (?, ?)");
        $stmt->execute([$user_id, $data->name]);

        $db->commit();
        echo json_encode(["message" => "School created successfully", "id" => $user_id]);
    } catch (Exception $e) {
        if ($db->inTransaction()) $db->rollBack();
        file_put_contents(__DIR__ . '/../debug.log', date('Y-m-d H:i:s') . " - School Creation Error: " . $e->getMessage() . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(["message" => "Failed to create school", "error" => $e->getMessage()]);
    }
} elseif ($method === 'PATCH') {
    // Update school status
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->user_id) || empty($data->status)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing user_id or status"]);
        exit();
    }

    $valid_statuses = ['pending', 'active', 'rejected'];
    if (!in_array($data->status, $valid_statuses)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid status"]);
        exit();
    }

    try {
        $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ? AND role = 'school'");
        $stmt->execute([$data->status, $data->user_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "School status updated successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "School not found or no changes made"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to update status", "error" => $e->getMessage()]);
    }
}
?>

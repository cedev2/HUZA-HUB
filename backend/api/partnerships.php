<?php
// backend/api/partnerships.php

$method = $_SERVER['REQUEST_METHOD'];

// Middleware: Verify Admin Access
$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

if (!$user_data || !in_array($user_data['role'], ['admin', 'school'])) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden - Admin or School access only"]);
    exit();
}

if ($method === 'GET') {
    // List all partnerships
    try {
        if ($user_data['role'] === 'school') {
            $stmt = $db->prepare("SELECT p.*, s.name as school_name, c.name as company_name 
                                FROM partnerships p 
                                JOIN schools s ON p.school_id = s.id 
                                JOIN companies c ON p.company_id = c.id 
                                WHERE p.school_id = ?
                                ORDER BY p.created_at DESC");
            $stmt->execute([$user_data['profile_id']]);
            $partnerships = $stmt->fetchAll();
        } else {
            $stmt = $db->query("SELECT p.*, s.name as school_name, c.name as company_name 
                                FROM partnerships p 
                                JOIN schools s ON p.school_id = s.id 
                                JOIN companies c ON p.company_id = c.id 
                                ORDER BY p.created_at DESC");
            $partnerships = $stmt->fetchAll();
        }
        echo json_encode($partnerships);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to fetch partnerships", "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Create new partnership
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->school_id) || empty($data->company_id)) {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data"]);
        exit();
    }

    try {
        $stmt = $db->prepare("INSERT INTO partnerships (school_id, company_id, status) VALUES (?, ?, 'accepted')");
        $stmt->execute([$data->school_id, $data->company_id]);
        
        echo json_encode(["message" => "Partnership created successfully", "id" => $db->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to create partnership", "error" => $e->getMessage()]);
    }
}
?>

<?php
// backend/api/students.php

$method = $_SERVER['REQUEST_METHOD'];

// Middleware: Verify Access
$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

if (!$user_data) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

// Allow students to fetch their own profile
if ($action === 'me' && $user_data['role'] === 'student') {
    if ($method === 'GET') {
        try {
            $stmt = $db->prepare("SELECT s.*, u.email, sch.name as school_name 
                                FROM students s 
                                JOIN users u ON s.user_id = u.id 
                                LEFT JOIN schools sch ON s.school_id = sch.id
                                WHERE s.user_id = ?");
            $stmt->execute([$user_data['user_id']]);
            $profile = $stmt->fetch();
            echo json_encode($profile);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to fetch profile", "error" => $e->getMessage()]);
            exit();
        }
    }
}

if (!in_array($user_data['role'], ['admin', 'school'])) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden - Admin or School access only"]);
    exit();
}

if ($method === 'GET') {
    try {
        if ($user_data['role'] === 'school') {
            $stmt = $db->prepare("SELECT u.id as user_id, u.email, u.status, s.id, s.full_name, s.cv_path, s.profile_pic, s.bio, s.skills, u.created_at, s.trade, s.location, s.school_id, sch.name as school_name 
                                FROM students s 
                                JOIN users u ON s.user_id = u.id 
                                LEFT JOIN schools sch ON s.school_id = sch.id
                                WHERE s.school_id = ?
                                ORDER BY u.created_at DESC");
            $stmt->execute([$user_data['profile_id']]);
            $students = $stmt->fetchAll();
        } else {
            $stmt = $db->query("SELECT u.id as user_id, u.email, u.status, s.id, s.full_name, s.cv_path, s.profile_pic, s.bio, s.skills, u.created_at, s.trade, s.location, s.school_id, sch.name as school_name 
                                FROM students s 
                                JOIN users u ON s.user_id = u.id 
                                LEFT JOIN schools sch ON s.school_id = sch.id
                                ORDER BY u.created_at DESC");
            $students = $stmt->fetchAll();
        }
        echo json_encode($students);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to fetch students", "error" => $e->getMessage()]);
    }
}
?>

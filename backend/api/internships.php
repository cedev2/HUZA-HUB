<?php
// backend/api/internships.php

$method = $_SERVER['REQUEST_METHOD'];

// Helper to check if user is authenticated
$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

if ($method === 'GET') {
    // If user is a company, return only their internships
    if ($user_data && $user_data['role'] === 'company') {
        $sql = "SELECT i.*, c.name as company_name, c.logo as company_logo, 
                (SELECT COUNT(*) FROM applications WHERE internship_id = i.id) as applicants_count
                FROM internships i 
                JOIN companies c ON i.company_id = c.id 
                WHERE i.company_id = ? 
                ORDER BY i.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$user_data['profile_id']]);
        $internships = $stmt->fetchAll();
    } else {
        // List open internships for students/public
        $sql = "SELECT i.*, c.name as company_name, c.logo as company_logo 
                FROM internships i 
                JOIN companies c ON i.company_id = c.id 
                WHERE i.status = 'open' 
                ORDER BY i.created_at DESC";
        $stmt = $db->query($sql);
        $internships = $stmt->fetchAll();
    }
    echo json_encode($internships);
} elseif ($method === 'POST') {
    // Create internship (Company only)
    if (!$user_data || $user_data['role'] !== 'company') {
        http_response_code(403);
        echo json_encode(["message" => "Unauthorized. Only companies can post internships."]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->title) || empty($data->description)) {
        http_response_code(400);
        echo json_encode(["message" => "Title and description are required."]);
        exit();
    }

    $stmt = $db->prepare("INSERT INTO internships 
        (company_id, title, description, skills_required, duration, location, deadline, positions, is_paid, fee) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $user_data['profile_id'],
        $data->title,
        $data->description,
        $data->skills_required ?? '',
        $data->duration ?? 'Not specified',
        $data->location ?? 'Remote',
        $data->deadline ?? date('Y-m-d', strtotime('+30 days')),
        $data->positions ?? 1,
        isset($data->is_paid) ? (int)$data->is_paid : 0,
        (!empty($data->fee) && $data->is_paid) ? $data->fee : null,
    ]);

    http_response_code(201);
    echo json_encode(["message" => "Internship posted successfully"]);
}
?>

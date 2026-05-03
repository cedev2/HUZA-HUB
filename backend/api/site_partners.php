<?php
// backend/api/partners.php

$method = $_SERVER['REQUEST_METHOD'];

// Public access for GET
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM partners ORDER BY created_at DESC");
        $partners = $stmt->fetchAll();
        echo json_encode($partners);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to fetch partners", "error" => $e->getMessage()]);
    }
    exit();
}

// Admin only for POST and DELETE
$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

if (!$user_data || $user_data['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["message" => "Admin access required"]);
    exit();
}

if ($method === 'POST') {
    $name = $_POST['name'] ?? '';
    
    if (empty($name)) {
        http_response_code(400);
        echo json_encode(["message" => "Partner name is required"]);
        exit();
    }

    $logo_url = null;
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/../uploads/partners/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
        
        $file_ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid() . '.' . $file_ext;
        $upload_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $upload_path)) {
            $logo_url = 'uploads/partners/' . $file_name;
        }
    }

    try {
        // Check for duplicates
        $stmt = $db->prepare("SELECT id FROM partners WHERE name = ?");
        $stmt->execute([$name]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["message" => "A partner with this name already exists."]);
            exit();
        }

        $stmt = $db->prepare("INSERT INTO partners (name, logo_url) VALUES (?, ?)");
        $stmt->execute([$name, $logo_url]);
        echo json_encode(["message" => "Partner added successfully", "id" => $db->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to add partner", "error" => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Assuming DELETE /partners/{id} handled via query param or index.php rewrite
    // For simplicity, we'll check $action as ID if it exists
    $id = $action; 
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Partner ID required"]);
        exit();
    }

    try {
        // Optional: delete file from disk
        $stmt = $db->prepare("SELECT logo_url FROM partners WHERE id = ?");
        $stmt->execute([$id]);
        $partner = $stmt->fetch();
        if ($partner && $partner['logo_url']) {
            $file_path = __DIR__ . '/../' . $partner['logo_url'];
            if (file_exists($file_path)) unlink($file_path);
        }

        $stmt = $db->prepare("DELETE FROM partners WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Partner deleted successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to delete partner", "error" => $e->getMessage()]);
    }
}
?>

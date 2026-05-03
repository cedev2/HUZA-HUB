<?php
// backend/api/contact.php

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->name) || empty($data->email) || empty($data->message)) {
    http_response_code(400);
    echo json_encode(["message" => "Name, email, and message are required."]);
    exit();
}

try {
    // In a real app, you might send an email or store in a table
    // For now, let's store in a generic contact_messages table if it exists, or just return success
    // We'll use the notifications table as a fallback to alert admins
    
    $stmt = $db->prepare("INSERT INTO notifications (user_id, message, type) VALUES (1, ?, 'contact_form')");
    $msg = "Contact form submission from " . $data->name . " (" . $data->email . "): " . $data->message;
    $stmt->execute([$msg]);

    echo json_encode(["message" => "Message sent successfully! We will get back to you soon."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to send message", "error" => $e->getMessage()]);
}
?>

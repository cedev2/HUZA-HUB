<?php
// backend/api/applications.php

$method = $_SERVER['REQUEST_METHOD'];
$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

if (!$user_data) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

if ($method === 'POST') {
    // Apply for internship (Student only)
    if ($user_data['role'] !== 'student') {
        http_response_code(403);
        echo json_encode(["message" => "Only students can apply"]);
        exit();
    }

    // Detect content type: multipart (with files) or JSON
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $isMultipart = strpos($contentType, 'multipart/form-data') !== false;

    if ($isMultipart) {
        $internship_id = $_POST['internship_id'] ?? '';
        $cover_letter  = $_POST['cover_letter'] ?? '';
        $phone         = $_POST['phone'] ?? '';
        $school_name   = $_POST['school_name'] ?? '';
        $school_location = $_POST['school_location'] ?? '';
        $contact_email = $_POST['contact_email'] ?? '';
        $trade         = $_POST['trade'] ?? '';
    } else {
        $data = json_decode(file_get_contents("php://input"));
        $internship_id  = $data->internship_id ?? '';
        $cover_letter   = $data->cover_letter ?? '';
        $phone          = $data->phone ?? '';
        $school_name    = $data->school_name ?? '';
        $school_location = $data->school_location ?? '';
        $contact_email  = $data->contact_email ?? '';
        $trade          = $data->trade ?? '';
    }

    if (empty($internship_id)) {
        http_response_code(400);
        echo json_encode(["message" => "Internship ID is required"]);
        exit();
    }

    // Check if already applied
    $stmt = $db->prepare("SELECT id FROM applications WHERE internship_id = ? AND student_id = ?");
    $stmt->execute([$internship_id, $user_data['profile_id']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["message" => "You have already applied for this internship"]);
        exit();
    }

    // Check if internship is free (for file upload requirement)
    $stmt_i = $db->prepare("SELECT is_paid, company_id FROM internships WHERE id = ?");
    $stmt_i->execute([$internship_id]);
    $internship = $stmt_i->fetch();

    if (!$internship) {
        http_response_code(404);
        echo json_encode(["message" => "Internship not found"]);
        exit();
    }

    $pdf_letter_path = null;
    $report_pdf_path = null;

    // Handle PDF uploads only for FREE internships
    if (!$internship['is_paid'] && $isMultipart) {
        $uploadDir = __DIR__ . '/../uploads/applications/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }

        // School letter PDF
        if (!empty($_FILES['pdf_letter']['tmp_name'])) {
            $ext = pathinfo($_FILES['pdf_letter']['name'], PATHINFO_EXTENSION);
            $filename = 'letter_' . $user_data['profile_id'] . '_' . time() . '.' . $ext;
            if (move_uploaded_file($_FILES['pdf_letter']['tmp_name'], $uploadDir . $filename)) {
                $pdf_letter_path = 'uploads/applications/' . $filename;
            }
        }

        // Report PDF
        if (!empty($_FILES['report_pdf']['tmp_name'])) {
            $ext2 = pathinfo($_FILES['report_pdf']['name'], PATHINFO_EXTENSION);
            $filename2 = 'report_' . $user_data['profile_id'] . '_' . time() . '.' . $ext2;
            if (move_uploaded_file($_FILES['report_pdf']['tmp_name'], $uploadDir . $filename2)) {
                $report_pdf_path = 'uploads/applications/' . $filename2;
            }
        }
    }

    $stmt = $db->prepare("INSERT INTO applications 
        (internship_id, student_id, cover_letter, status, phone, school_name, school_location, pdf_letter, report_pdf, contact_email, trade) 
        VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $internship_id,
        $user_data['profile_id'],
        $cover_letter,
        $phone ?: null,
        $school_name ?: null,
        $school_location ?: null,
        $pdf_letter_path,
        $report_pdf_path,
        $contact_email ?: null,
        $trade ?: null,
    ]);

    // Create notification for company
    $stmt_u = $db->prepare("SELECT user_id FROM companies WHERE id = ?");
    $stmt_u->execute([$internship['company_id']]);
    $company_user = $stmt_u->fetch();

    if ($company_user) {
        $msg = "A new student has applied for your internship.";
        $stmt_n = $db->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'application')");
        $stmt_n->execute([$company_user['user_id'], $msg]);
    }

    echo json_encode(["message" => "Application submitted successfully"]);

} elseif ($method === 'GET') {
    // List applications (Role dependent)
    if ($user_data['role'] === 'student') {
        $stmt = $db->prepare("SELECT a.*, i.title, i.location, i.duration, i.deadline, i.description, i.is_paid, c.name as company_name 
                            FROM applications a 
                            JOIN internships i ON a.internship_id = i.id 
                            JOIN companies c ON i.company_id = c.id 
                            WHERE a.student_id = ?
                            ORDER BY a.applied_at DESC");
        $stmt->execute([$user_data['profile_id']]);
        echo json_encode($stmt->fetchAll());
    } elseif ($user_data['role'] === 'company') {
        $stmt = $db->prepare("SELECT a.*, s.full_name, i.title, i.is_paid,
                            a.phone, a.school_name, a.school_location, a.pdf_letter, a.report_pdf, a.trade
                            FROM applications a 
                            JOIN students s ON a.student_id = s.id 
                            JOIN internships i ON a.internship_id = i.id 
                            WHERE i.company_id = ?
                            ORDER BY a.applied_at DESC");
        $stmt->execute([$user_data['profile_id']]);
        echo json_encode($stmt->fetchAll());
    } elseif ($user_data['role'] === 'admin') {
        $stmt = $db->query("SELECT a.*, s.full_name, i.title, i.is_paid, c.name as company_name,
                            a.phone, a.school_name, a.school_location, a.trade
                            FROM applications a 
                            JOIN students s ON a.student_id = s.id 
                            JOIN internships i ON a.internship_id = i.id
                            JOIN companies c ON i.company_id = c.id
                            ORDER BY a.applied_at DESC");
        echo json_encode($stmt->fetchAll());
    }

} elseif ($method === 'PATCH') {
    // Update application status (Company only)
    if ($user_data['role'] !== 'company') {
        http_response_code(403);
        echo json_encode(["message" => "Only companies can update application status"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->application_id) || empty($data->status)) {
        http_response_code(400);
        echo json_encode(["message" => "application_id and status are required"]);
        exit();
    }

    $allowed_statuses = ['pending', 'accepted', 'rejected'];
    if (!in_array($data->status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid status. Must be pending, accepted, or rejected"]);
        exit();
    }

    // Verify the application belongs to this company's internship
    $check = $db->prepare("
        SELECT a.id, a.student_id, i.title, s.full_name as student_name
        FROM applications a
        JOIN internships i ON a.internship_id = i.id
        JOIN students s ON a.student_id = s.id
        WHERE a.id = ? AND i.company_id = ?
    ");
    $check->execute([$data->application_id, $user_data['profile_id']]);
    $application = $check->fetch();

    if (!$application) {
        http_response_code(403);
        echo json_encode(["message" => "Application not found or not authorized"]);
        exit();
    }

    $update = $db->prepare("UPDATE applications SET status = ? WHERE id = ?");
    $update->execute([$data->status, $data->application_id]);

    // Notify the student
    $student_user = $db->prepare("SELECT user_id FROM students WHERE id = ?");
    $student_user->execute([$application['student_id']]);
    $s_user = $student_user->fetch();

    if ($s_user) {
        $statusMsg = ucfirst($data->status);
        $msg = "Your application for '{$application['title']}' has been {$statusMsg}.";
        $notif = $db->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'application')");
        $notif->execute([$s_user['user_id'], $msg]);
    }

    echo json_encode(["message" => "Application status updated to {$data->status}"]);
}
?>

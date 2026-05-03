<?php
// backend/api/auth.php

$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'register') {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    $errors = [];
    if (empty($data->email)) $errors[] = "Email is required.";
    if (empty($data->password)) $errors[] = "Password is required.";
    if (empty($data->name)) $errors[] = "Full name is required.";
    if (empty($data->role)) $errors[] = "Role is required.";
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["message" => implode(" ", $errors)]);
        exit();
    }

    // Only students can register via public endpoint
    if ($data->role !== 'student') {
        http_response_code(403);
        echo json_encode(["message" => "Only students can create accounts publicly. Schools and companies must be registered by an administrator."]);
        exit();
    }

    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    // Check if email already exists
    try {
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["message" => "An account with this email already exists."]);
            exit();
        }

        $db->beginTransaction();

        // 1. Create User
        $stmt = $db->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, 'active')");
        $stmt->execute([$data->email, $password_hash, $data->role]);
        $user_id = $db->lastInsertId();

        // 2. Create Profile based on role
        if ($data->role === 'student') {
            $stmt = $db->prepare("INSERT INTO students (user_id, full_name, school_id, location, trade) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $user_id, 
                $data->name, 
                !empty($data->school_id) ? $data->school_id : null,
                !empty($data->location) ? $data->location : null,
                !empty($data->trade) ? $data->trade : null
            ]);
        } elseif ($data->role === 'school') {
            $stmt = $db->prepare("INSERT INTO schools (user_id, name) VALUES (?, ?)");
            $stmt->execute([$user_id, $data->name]);
        } elseif ($data->role === 'company') {
            $stmt = $db->prepare("INSERT INTO companies (user_id, name) VALUES (?, ?)");
            $stmt->execute([$user_id, $data->name]);
        }

        $db->commit();
        http_response_code(201);
        echo json_encode(["message" => "User registered successfully"]);
    } catch (Exception $e) {
        if ($db->inTransaction()) $db->rollBack();
        file_put_contents(__DIR__ . '/../register_error.log', date('Y-m-d H:i:s') . " - Registration Error: " . $e->getMessage() . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(["message" => "Registration failed. " . $e->getMessage()]);
    }
} elseif ($action === 'login') {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->email) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data"]);
        exit();
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$data->email]);
    $user = $stmt->fetch();

    if ($user && password_verify($data->password, $user['password'])) {
        if ($user['status'] === 'active') {
            // Get profile details
            $profile = null;
            if ($user['role'] === 'student') {
                $p_stmt = $db->prepare("SELECT * FROM students WHERE user_id = ?");
                $p_stmt->execute([$user['id']]);
                $profile = $p_stmt->fetch();
            } elseif ($user['role'] === 'school') {
                $p_stmt = $db->prepare("SELECT * FROM schools WHERE user_id = ?");
                $p_stmt->execute([$user['id']]);
                $profile = $p_stmt->fetch();
            } elseif ($user['role'] === 'company') {
                $p_stmt = $db->prepare("SELECT * FROM companies WHERE user_id = ?");
                $p_stmt->execute([$user['id']]);
                $profile = $p_stmt->fetch();
            }

            $token_payload = [
                "user_id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role'],
                "profile_id" => $profile['id'] ?? null
            ];

            $token = JwtHelper::generateToken($token_payload);

            echo json_encode([
                "message" => "Login successful",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "name" => $profile['full_name'] ?? $profile['name'] ?? 'Admin',
                    "school_id" => $profile['school_id'] ?? null,
                    "location" => $profile['location'] ?? null,
                    "trade" => $profile['trade'] ?? null
                ]
            ]);
        } else {
            http_response_code(403);
            echo json_encode(["message" => "Account is " . $user['status']]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials"]);
    }
} elseif ($action === 'change-password') {
    if ($method !== 'POST') {
        http_response_code(405);
        exit();
    }

    $token = JwtHelper::getBearerToken();
    $payload = JwtHelper::validateToken($token);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit();
    }

    $user_id = $payload['user_id'];

    $data = json_decode(file_get_contents("php://input"));
    if (empty($data->current_password) || empty($data->new_password)) {
        http_response_code(400);
        echo json_encode(["message" => "Current and new passwords are required"]);
        exit();
    }

    $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if ($user && password_verify($data->current_password, $user['password'])) {
        $new_hash = password_hash($data->new_password, PASSWORD_BCRYPT);
        $update = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
        $update->execute([$new_hash, $user_id]);
        echo json_encode(["message" => "Password updated successfully"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incorrect current password"]);
    }
}
?>

<?php
require_once 'config/db.php';
require_once 'utils/JwtHelper.php';

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("SELECT * FROM users WHERE email = 'heloxtech@gmail.com'");
$stmt->execute();
$user = $stmt->fetch();

$p_stmt = $db->prepare("SELECT * FROM companies WHERE user_id = ?");
$p_stmt->execute([$user['id']]);
$profile = $p_stmt->fetch();

$token_payload = [
    "user_id" => $user['id'],
    "email" => $user['email'],
    "role" => $user['role'],
    "profile_id" => $profile['id'] ?? null
];

$token = JwtHelper::generateToken($token_payload);
echo $token;
?>

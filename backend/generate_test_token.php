<?php
require_once 'utils/JwtHelper.php';

$payload = [
    'user_id' => 1,
    'email' => 'admin@huzahub.com',
    'role' => 'admin'
];

$token = JwtHelper::generateToken($payload);
echo $token;
?>

<?php
// backend/index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/db.php';
require_once 'utils/JwtHelper.php';
require_once 'utils/EnvLoader.php';

// Load environment variables
EnvLoader::load(__DIR__ . '/.env');

$request_uri = $_SERVER['REQUEST_URI'];
// Decoded URI to handle spaces (%20) correctly
$request_uri_decoded = urldecode($request_uri);
$base_path = '/HUZA HUB/backend/'; // Change this if your folder name is different

// Ensure we only replace the first occurrence of the base path
if (strpos($request_uri_decoded, $base_path) === 0) {
    $path = substr($request_uri_decoded, strlen($base_path));
} else {
    // Fallback if the base path doesn't match perfectly at start
    $path = str_replace($base_path, '', $request_uri_decoded);
}

$path = explode('?', $path)[0]; // Remove query strings
$parts = explode('/', trim($path, '/'));

$resource = $parts[0] ?? null;
$action = $parts[1] ?? null;

// Initialize Database
$database = new Database();
$db = $database->getConnection();

// Basic Routing Logic
if ($resource === 'auth') {
    require_once 'api/auth.php';
} elseif ($resource === 'students') {
    require_once 'api/students.php';
} elseif ($resource === 'schools') {
    require_once 'api/schools.php';
} elseif ($resource === 'companies') {
    require_once 'api/companies.php';
} elseif ($resource === 'internships') {
    require_once 'api/internships.php';
} elseif ($resource === 'applications') {
    require_once 'api/applications.php';
} elseif ($resource === 'partnerships') {
    require_once 'api/partnerships.php';
} elseif ($resource === 'site_partners') {
    require_once 'api/site_partners.php';
} elseif ($resource === 'messages') {
    require_once 'api/messages.php';
} elseif ($resource === 'notifications') {
    require_once 'api/notifications.php';
} elseif ($resource === 'stats') {
    require_once 'api/stats.php';
} elseif ($resource === 'contact') {
    require_once 'api/contact.php';
} else {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint not found", "path" => $path]);
}
?>

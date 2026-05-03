<?php
require_once 'utils/EnvLoader.php';
EnvLoader::load(__DIR__ . '/.env');

echo "DB_HOST: " . (getenv('DB_HOST') ?: "NOT SET") . "\n";
echo "DB_NAME: " . (getenv('DB_NAME') ?: "NOT SET") . "\n";
echo "DB_USER: " . (getenv('DB_USER') ?: "NOT SET") . "\n";
echo "DB_PASS: " . (getenv('DB_PASS') !== false ? "SET" : "NOT SET") . "\n";
echo "JWT_SECRET: " . (getenv('JWT_SECRET') ?: "NOT SET") . "\n";
?>

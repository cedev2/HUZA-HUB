<?php
// backend/check_data.php
require_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

$tables = ['users', 'students', 'companies', 'schools', 'internships', 'applications'];

echo "Database Status:\n";
foreach ($tables as $table) {
    try {
        $count = $db->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        echo "- $table: $count records\n";
    } catch (Exception $e) {
        echo "- $table: Table not found or error: " . $e->getMessage() . "\n";
    }
}
?>

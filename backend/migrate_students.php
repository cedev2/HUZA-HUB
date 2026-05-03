<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    // Add missing columns to students table if they don't exist
    $db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS school_id INT AFTER user_id");
    $db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS location VARCHAR(255) AFTER school_id");
    $db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS trade VARCHAR(255) AFTER location");
    echo "Migration successful: school_id, location, and trade columns verified/added to 'students' table.\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>

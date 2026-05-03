<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    // Add trade column to applications table if it doesn't exist
    $db->exec("ALTER TABLE applications ADD COLUMN IF NOT EXISTS trade VARCHAR(255) AFTER contact_email");
    echo "Migration successful: 'trade' column added to 'applications' table.\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>

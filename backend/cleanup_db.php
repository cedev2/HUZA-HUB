<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    // Disable foreign key checks
    $db->exec("SET FOREIGN_KEY_CHECKS = 0");

    // List of tables to TRUNCATE completely
    $tablesToTruncate = [
        'applications',
        'internships',
        'partnerships',
        'messages',
        'notifications',
        'students',
        'schools',
        'companies'
    ];

    foreach ($tablesToTruncate as $table) {
        $db->exec("TRUNCATE TABLE $table");
        echo "Truncated table: $table\n";
    }

    // Handle USERS table separately: Keep only admins
    $stmt = $db->query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $adminCount = $stmt->fetchColumn();
    
    if ($adminCount > 0) {
        $db->exec("DELETE FROM users WHERE role != 'admin'");
        echo "Deleted non-admin users. Kept $adminCount admin(s).\n";
        
        // Reset auto-increment for users if needed, but risky if IDs are used elsewhere.
        // Actually, better to just leave it or reset it to the next available ID.
    } else {
        echo "Warning: No admin found! Skipping deletion in 'users' table to prevent complete lockout.\n";
    }

    // Re-enable foreign key checks
    $db->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "\nDatabase cleanup completed successfully.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

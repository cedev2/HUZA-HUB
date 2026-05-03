<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->query("SELECT email, password, role FROM users WHERE role IN ('school', 'company')");
    while($row = $stmt->fetch()) {
        $v1 = password_verify('Password123!', $row['password']) ? 'YES' : 'NO';
        $v2 = password_verify('Pass123!', $row['password']) ? 'YES' : 'NO';
        echo "Email: {$row['email']} | Role: {$row['role']} | Valid Password123!: $v1 | Valid Pass123!: $v2\n";
    }
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>

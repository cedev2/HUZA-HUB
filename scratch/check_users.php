<?php
require_once 'backend/config/db.php';
$database = new Database();
$db = $database->getConnection();
if ($db) {
    echo "========= USERS =========\n";
    $stmt = $db->query("SELECT id, email, role, status FROM users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: " . $row['id'] . " | Email: " . $row['email'] . " | Role: " . $row['role'] . " | Status: " . $row['status'] . "\n";
    }
}
?>

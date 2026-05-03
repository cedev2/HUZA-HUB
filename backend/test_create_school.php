<?php
require_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();

    $email = 'testschool_' . time() . '@test.com';
    $password_hash = password_hash('Password123!', PASSWORD_BCRYPT);
    
    $stmt = $db->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, 'school', 'active')");
    $stmt->execute([$email, $password_hash]);
    $user_id = $db->lastInsertId();
    echo "User created: ID $user_id\n";

    $name = 'Test School';
    $stmt = $db->prepare("INSERT INTO schools (user_id, name) VALUES (?, ?)");
    $stmt->execute([$user_id, $name]);
    echo "School created!\n";

    $db->commit();
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
?>

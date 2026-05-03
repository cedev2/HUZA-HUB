<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->query("DESCRIBE students");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "STUDENTS TABLE:\n";
    print_r($columns);
    
    $stmt = $db->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "\nUSERS TABLE:\n";
    print_r($columns);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

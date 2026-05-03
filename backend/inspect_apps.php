<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->query("DESCRIBE applications");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "APPLICATIONS TABLE:\n";
    print_r($columns);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

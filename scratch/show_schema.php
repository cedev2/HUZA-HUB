<?php
require_once 'backend/config/db.php';
$database = new Database();
$db = $database->getConnection();
if ($db) {
    $tables = ['users', 'students', 'schools', 'companies', 'internships', 'applications'];
    foreach ($tables as $t) {
        echo "========= $t =========\n";
        try {
            $stmt = $db->query("SHOW CREATE TABLE $t");
            $row = $stmt->fetch(PDO::FETCH_NUM);
            echo $row[1] . "\n\n";
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage() . "\n\n";
        }
    }
}
?>

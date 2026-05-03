<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $count = $db->query("SELECT COUNT(*) FROM schools")->fetchColumn();
    echo "SCHOOL COUNT: " . $count . "\n";
    
    if ($count > 0) {
        $schools = $db->query("SELECT id, name FROM schools")->fetchAll(PDO::FETCH_ASSOC);
        print_r($schools);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

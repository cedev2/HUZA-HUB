<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

try {
    $sql = "CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql);
    echo "Table 'partners' created or already exists.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

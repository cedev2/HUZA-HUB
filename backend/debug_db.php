<?php
require_once 'config/db.php';
$database = new Database();
$db = $database->getConnection();

function checkTable($db, $tableName) {
    echo "\nStructure for table: $tableName\n";
    try {
        $stmt = $db->query("DESCRIBE $tableName");
        while($row = $stmt->fetch()) {
            echo "{$row['Field']} - {$row['Type']} - {$row['Null']} - {$row['Key']} - {$row['Default']} - {$row['Extra']}\n";
        }
    } catch(Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}

checkTable($db, 'users');
checkTable($db, 'schools');
checkTable($db, 'companies');
?>

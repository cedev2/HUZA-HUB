<?php
require_once 'backend/config/db.php';
$db = new Database();
$conn = $db->getConnection();
if ($conn) {
    echo "Connected successfully\n";
    $tables = ['users', 'students', 'schools', 'partnerships', 'internships', 'applications'];
    foreach ($tables as $t) {
        echo "========= $t =========\n";
        $stmt = $conn->query("DESCRIBE $t");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['Field'] . " - " . $row['Type'] . "\n";
        }
    }
} else {
    echo "Connection failed\n";
}
?>

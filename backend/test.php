<?php
require 'config/database.php';
try {
    $stmt = $db->query('SELECT * FROM applications LIMIT 1');
    print_r($stmt->fetch(PDO::FETCH_ASSOC));
    
    $stmt = $db->query('SELECT * FROM notifications LIMIT 1');
    print_r($stmt->fetch(PDO::FETCH_ASSOC));
} catch(Exception $e) {
    echo $e->getMessage();
}

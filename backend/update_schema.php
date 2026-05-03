<?php
require 'config/db.php';
try {
    $database = new Database();
    $db = $database->getConnection();

    // Add fee to internships
    $db->exec("ALTER TABLE internships ADD COLUMN fee VARCHAR(100) NULL COMMENT 'Stipend or fee amount for paid internships'");
    echo "Added fee to internships\n";

    // Add contact_email to applications
    $db->exec("ALTER TABLE applications ADD COLUMN contact_email VARCHAR(255) NULL");
    echo "Added contact_email to applications\n";

    echo "Done!\n";
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

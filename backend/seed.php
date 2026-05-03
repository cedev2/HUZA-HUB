<?php
// backend/seed.php
require_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

echo "Starting system seed...\n";

try {
    $db->beginTransaction();

    // 1. Clear existing data (except the admin we created)
    $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $db->exec("TRUNCATE TABLE applications;");
    $db->exec("TRUNCATE TABLE internships;");
    $db->exec("TRUNCATE TABLE partnerships;");
    $db->exec("TRUNCATE TABLE schools;");
    $db->exec("TRUNCATE TABLE companies;");
    $db->exec("TRUNCATE TABLE students;");
    $db->exec("DELETE FROM users WHERE role != 'admin';");
    $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "Existing data cleared.\n";

    $password_hash = password_hash('Pass123!', PASSWORD_BCRYPT);

    // 2. Seed Schools
    $school_names = ['Kigali Institute of Technology', 'Rwanda Global Academy', 'National University of Excellence'];
    $school_ids = [];
    foreach ($school_names as $name) {
        $email = strtolower(str_replace(' ', '', $name)) . "@edu.rw";
        $stmt = $db->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, 'school', 'active')");
        $stmt->execute([$email, $password_hash]);
        $uid = $db->lastInsertId();
        
        $stmt = $db->prepare("INSERT INTO schools (user_id, name, description) VALUES (?, ?, 'A premier educational institution.')");
        $stmt->execute([$uid, $name]);
        $school_ids[] = $db->lastInsertId();
    }
    echo "Seed: 3 Schools created.\n";

    // 3. Seed Companies
    $company_data = [
        ['TechNova Solutions', 'Software Engineering'],
        ['EcoSmart Energy', 'Renewable Energy'],
        ['CreativePulse Media', 'Digital Marketing'],
        ['HealthBridge Ltd', 'Medical Technology'],
        ['UrbanConstruct', 'Civil Engineering']
    ];
    $company_ids = [];
    foreach ($company_data as $data) {
        $email = strtolower(str_replace(' ', '', $data[0])) . "@corp.com";
        $stmt = $db->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, 'company', 'active')");
        $stmt->execute([$email, $password_hash]);
        $uid = $db->lastInsertId();
        
        $stmt = $db->prepare("INSERT INTO companies (user_id, name, description, website) VALUES (?, ?, ?, 'https://example.com')");
        $stmt->execute([$uid, $data[0], "Leading provider in " . $data[1]]);
        $company_ids[] = $db->lastInsertId();
    }
    echo "Seed: 5 Companies created.\n";

    // 4. Seed Students
    $student_names = ['John Doe', 'Alice Wright', 'Peter Ngabo', 'Sarah Smith', 'David Mugisha', 'Elena Rose', 'Kevin Blue', 'Maya Gold', 'Tom Silver', 'Rita Green'];
    $student_ids = [];
    foreach ($student_names as $name) {
        $email = strtolower(str_replace(' ', '', $name)) . "@student.rw";
        $stmt = $db->prepare("INSERT INTO users (email, password, role, status) VALUES (?, ?, 'student', 'active')");
        $stmt->execute([$email, $password_hash]);
        $uid = $db->lastInsertId();
        
        $stmt = $db->prepare("INSERT INTO students (user_id, full_name, bio, skills) VALUES (?, ?, 'I am a passionate student eager to learn.', 'PHP, React, CSS')");
        $stmt->execute([$uid, $name]);
        $student_ids[] = $db->lastInsertId();
    }
    echo "Seed: 10 Students created.\n";

    // 5. Seed Internships
    $titles = ['Frontend Developer', 'Backend Intern', 'Marketing Assistant', 'UI/UX Designer', 'Data Analyst'];
    $internship_ids = [];
    for ($i = 0; $i < 12; $i++) {
        $cid = $company_ids[array_rand($company_ids)];
        $title = $titles[array_rand($titles)];
        $stmt = $db->prepare("INSERT INTO internships (company_id, title, description, status, location) VALUES (?, ?, ?, 'open', 'Remera')");
        $stmt->execute([$cid, $title, "Professional internship opportunity in $title."]);
        $internship_ids[] = $db->lastInsertId();
    }
    echo "Seed: 12 Internships created.\n";

    // 6. Seed Applications
    for ($i = 0; $i < 15; $i++) {
        $sid = $student_ids[array_rand($student_ids)];
        $iid = $internship_ids[array_rand($internship_ids)];
        $stmt = $db->prepare("INSERT INTO applications (internship_id, student_id, status) VALUES (?, ?, 'pending')");
        $stmt->execute([$iid, $sid]);
    }
    echo "Seed: 15 Applications created.\n";

    // 7. Seed Partnerships
    foreach ($school_ids as $sid) {
        $cid = $company_ids[array_rand($company_ids)];
        $stmt = $db->prepare("INSERT INTO partnerships (school_id, company_id, status) VALUES (?, ?, 'accepted')");
        $stmt->execute([$sid, $cid]);
    }
    echo "Seed: Partnerships created.\n";

    $db->commit();
    echo "System seed completed successfully!\n";

} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo "Seed Failed: " . $e->getMessage() . "\n";
}
?>

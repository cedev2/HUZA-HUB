<?php
// backend/api/stats.php

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

$token = JwtHelper::getBearerToken();
$user_data = $token ? JwtHelper::validateToken($token) : null;

if (!$user_data) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$role = $user_data['role'];
$profile_id = $user_data['profile_id'];

$stats = [];

if ($role === 'admin') {
    // Admin Stats
    $stats['students'] = $db->query("SELECT COUNT(*) FROM students")->fetchColumn();
    $stats['companies'] = $db->query("SELECT COUNT(*) FROM companies")->fetchColumn();
    $stats['schools'] = $db->query("SELECT COUNT(*) FROM schools")->fetchColumn();
    $stats['internships'] = $db->query("SELECT COUNT(*) FROM internships")->fetchColumn();
    $stats['applications'] = $db->query("SELECT COUNT(*) FROM applications")->fetchColumn();

    // Advanced Chart Data - Growth (Registrations by Month)
    $growthQuery = $db->query("
        SELECT 
            DATE_FORMAT(created_at, '%b') as name,
            SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
            SUM(CASE WHEN role = 'company' THEN 1 ELSE 0 END) as companies
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 5 MONTH)
        GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
        ORDER BY YEAR(created_at), MONTH(created_at)
    ");
    $stats['growthData'] = $growthQuery->fetchAll(PDO::FETCH_ASSOC);

    // Ensure numeric types for Recharts
    foreach ($stats['growthData'] as &$row) {
        $row['students'] = (int)$row['students'];
        $row['companies'] = (int)$row['companies'];
    }

    // Advanced Chart Data - Category (Application Status Distribution)
    $categoryQuery = $db->query("
        SELECT status as name, COUNT(*) as value
        FROM applications
        GROUP BY status
    ");
    $stats['categoryData'] = $categoryQuery->fetchAll(PDO::FETCH_ASSOC);

    foreach ($stats['categoryData'] as &$row) {
        $row['value'] = (int)$row['value'];
        $row['name'] = ucfirst($row['name']);
    }

    // Advanced Chart Data - Placement Rate
    $totalApps = $stats['applications'];
    $acceptedApps = (int) $db->query("SELECT COUNT(*) FROM applications WHERE status = 'accepted'")->fetchColumn();
    $stats['placement_rate'] = $totalApps > 0 ? round(($acceptedApps / $totalApps) * 100) : 0;

    // Recent Partnerships Data
    $recentQuery = $db->query("
        SELECT p.status, s.name as school_name, c.name as company_name 
        FROM partnerships p 
        JOIN schools s ON p.school_id = s.id 
        JOIN companies c ON p.company_id = c.id 
        ORDER BY p.id DESC
        LIMIT 5
    ");
    $stats['recent_partnerships'] = $recentQuery->fetchAll(PDO::FETCH_ASSOC);
} elseif ($role === 'school') {
    // School Stats
    // Fetch students associated with this school
    $stmt = $db->prepare("SELECT COUNT(*) FROM students WHERE school_id = ?");
    $stmt->execute([$user_data['profile_id']]);
    $stats['total_students'] = $stmt->fetchColumn();
    
    $stats['active_partners'] = $db->prepare("SELECT COUNT(*) FROM partnerships WHERE school_id = ? AND status = 'accepted'");
    $stats['active_partners']->execute([$profile_id]);
    $stats['active_partners'] = (int) $stats['active_partners']->fetchColumn();
    
    $stats['applications'] = (int) $db->query("SELECT COUNT(*) FROM applications")->fetchColumn();
    
    $acceptedApps = (int) $db->query("SELECT COUNT(*) FROM applications WHERE status = 'accepted'")->fetchColumn();
    $stats['placement_rate'] = $stats['applications'] > 0 ? round(($acceptedApps / $stats['applications']) * 100) . '%' : '0%';

    // Recent Partnerships
    $recentQuery = $db->prepare("
        SELECT p.status, s.name as school_name, c.name as company_name, DATE_FORMAT(p.created_at, '%b %d, %Y') as date, p.id
        FROM partnerships p 
        JOIN schools s ON p.school_id = s.id 
        JOIN companies c ON p.company_id = c.id 
        WHERE p.school_id = ?
        ORDER BY p.id DESC
        LIMIT 5
    ");
    $recentQuery->execute([$profile_id]);
    $stats['recent_partnerships'] = $recentQuery->fetchAll(PDO::FETCH_ASSOC);

    // Live Activity Feed
    $activityQuery = $db->query("
        SELECT a.status as action, s.full_name as student_name, i.title as internship_title, c.name as company_name, 
               TIMESTAMPDIFF(HOUR, a.applied_at, NOW()) as hours_ago
        FROM applications a
        JOIN students s ON a.student_id = s.id
        JOIN internships i ON a.internship_id = i.id
        JOIN companies c ON i.company_id = c.id
        ORDER BY a.applied_at DESC
        LIMIT 3
    ");
    $stats['activity_feed'] = $activityQuery->fetchAll(PDO::FETCH_ASSOC);

} elseif ($role === 'company') {
    // Company Stats
    $stats['active_postings'] = $db->prepare("SELECT COUNT(*) FROM internships WHERE company_id = ? AND status = 'open'");
    $stats['active_postings']->execute([$profile_id]);
    $stats['active_postings'] = (int) $stats['active_postings']->fetchColumn();

    $stats['total_applicants'] = $db->prepare("SELECT COUNT(*) FROM applications a JOIN internships i ON a.internship_id = i.id WHERE i.company_id = ?");
    $stats['total_applicants']->execute([$profile_id]);
    $stats['total_applicants'] = (int) $stats['total_applicants']->fetchColumn();

    $unreadQuery = $db->prepare("SELECT COUNT(*) FROM messages WHERE receiver_id = (SELECT id FROM users WHERE role = 'company' AND profile_id = ?) AND is_read = 0");
    // Since messages table structure wasn't fully printed, we gracefully fallback if query fails
    try {
        $unreadQuery->execute([$profile_id]);
        $stats['unread_messages'] = (int) $unreadQuery->fetchColumn();
    } catch (Exception $e) {
        $stats['unread_messages'] = 0;
    }
} elseif ($role === 'student') {
    // Student Stats
    $stats['applied_count'] = $db->prepare("SELECT COUNT(*) FROM applications WHERE student_id = ?");
    $stats['applied_count']->execute([$profile_id]);
    $stats['applied_count'] = $stats['applied_count']->fetchColumn();
}

echo json_encode($stats);
?>

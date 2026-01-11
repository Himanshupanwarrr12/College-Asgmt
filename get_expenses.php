<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$category = $_GET['category'] ?? '';
$startDate = $_GET['startDate'] ?? '';
$endDate = $_GET['endDate'] ?? '';

$query = "SELECT * FROM expenses WHERE 1=1";
$params = [];
$types = "";

if (!empty($category)) {
    $query .= " AND category = ?";
    $params[] = $category;
    $types .= "s";
}

if (!empty($startDate)) {
    $query .= " AND date >= ?";
    $params[] = $startDate;
    $types .= "s";
}

if (!empty($endDate)) {
    $query .= " AND date <= ?";
    $params[] = $endDate;
    $types .= "s";
}

$query .= " ORDER BY date DESC, id DESC";

$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$expenses = [];
while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
}

echo json_encode(['success' => true, 'data' => $expenses]);

$stmt->close();
$conn->close();
?>
<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = $_POST['amount'] ?? '';
    $category = $_POST['category'] ?? '';
    $date = $_POST['date'] ?? '';
    $description = $_POST['description'] ?? '';

    if (empty($amount) || empty($category) || empty($date) || empty($description)) {
        echo json_encode(['success' => false, 'message' => 'All fields required']);
        exit;
    }

    if (!is_numeric($amount) || $amount <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid amount']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO expenses (amount, category, date, description) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("dsss", $amount, $category, $date, $description);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Expense added', 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add expense']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
$conn->close();
?>
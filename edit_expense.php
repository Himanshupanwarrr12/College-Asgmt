<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $amount = $_POST['amount'] ?? '';
    $category = $_POST['category'] ?? '';
    $date = $_POST['date'] ?? '';
    $description = $_POST['description'] ?? '';

    if (empty($id) || empty($amount) || empty($category) || empty($date) || empty($description)) {
        echo json_encode(['success' => false, 'message' => 'All fields required']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE expenses SET amount = ?, category = ?, date = ?, description = ? WHERE id = ?");
    $stmt->bind_param("dsssi", $amount, $category, $date, $description, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

    $stmt->close();
}
$conn->close();
?>
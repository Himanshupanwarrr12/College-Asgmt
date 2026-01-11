<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Expense Calculator</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<h1>Personal Expense Calculator</h1>

<form id="expenseForm">
  <input type="number" name="amount" placeholder="Amount" required>
  <input type="text" name="category" placeholder="Category" required>
  <input type="date" name="date" required>
  <input type="text" name="description" placeholder="Description" required>
  <button type="submit">Add Expense</button>
</form>

<h2>Expenses</h2>
<table border="1">
  <thead>
    <tr>
      <th>Amount</th>
      <th>Category</th>
      <th>Date</th>
      <th>Description</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody id="expenseList"></tbody>
</table>

<script src="js/script.js"></script>
</body>
</html>

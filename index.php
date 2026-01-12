<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Expense Calculator</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>💰 Personal Expense Calculator</h1>
            <p>Track your daily expenses and gain financial insights</p>
        </header>

        <!-- Add Expense Form -->
        <section class="expense-form-section">
            <h2>Add New Expense</h2>
            <form id="expenseForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="amount">Amount (₹)</label>
                        <input type="number" id="amount" name="amount" step="0.01" placeholder="Enter amount" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="date">Date</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <input type="text" id="description" name="description" placeholder="Brief description" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" id="submitBtn">Add Expense</button>
                <button type="button" class="btn btn-secondary" id="cancelBtn" style="display:none;" onclick="cancelEdit()">Cancel</button>
            </form>
        </section>

        <!-- Summary Statistics -->
        <section class="summary-section">
            <h2>Expense Summary</h2>
            <div class="summary-cards">
                <div class="card">
                    <div class="card-icon">💵</div>
                    <h3>Total Expenses</h3>
                    <p class="amount" id="totalExpense">₹0.00</p>
                </div>
                <div class="card">
                    <div class="card-icon">📊</div>
                    <h3>Total Entries</h3>
                    <p class="count" id="totalCount">0</p>
                </div>
                <div class="card">
                    <div class="card-icon">📈</div>
                    <h3>Average Expense</h3>
                    <p class="amount" id="avgExpense">₹0.00</p>
                </div>
            </div>
        </section>

        <!-- Filter Options -->
        <section class="filter-section">
            <h2>Filter Expenses</h2>
            <div class="filter-controls">
                <div class="form-group">
                    <label for="filterCategory">Category</label>
                    <select id="filterCategory">
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="filterStartDate">Start Date</label>
                    <input type="date" id="filterStartDate">
                </div>
                <div class="form-group">
                    <label for="filterEndDate">End Date</label>
                    <input type="date" id="filterEndDate">
                </div>
                <button onclick="applyFilter()" class="btn btn-primary">Apply Filter</button>
                <button onclick="resetFilter()" class="btn btn-secondary">Reset</button>
            </div>
        </section>

        <!-- Expense List -->
        <section class="expense-list-section">
            <h2>Expense List</h2>
            <div class="table-responsive">
                <table id="expenseTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="expenseList">
                        <tr>
                            <td colspan="5" class="no-data">Loading expenses...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Category Summary -->
        <section class="category-summary-section">
            <h2>Category-wise Summary</h2>
            <div id="categorySummary" class="category-summary">
                <p class="no-data">No expenses to display</p>
            </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
            <h2>Visual Analytics</h2>
            <div class="charts-container">
                <div class="chart-box">
                    <h3>Expenses by Category</h3>
                    <canvas id="categoryChart"></canvas>
                </div>
                <div class="chart-box">
                    <h3>Daily Spending Trend</h3>
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
        </section>

        <footer>
            <p>&copy; 2025 Personal Expense Calculator | Developed by Himanshu Panwar</p>
        </footer>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
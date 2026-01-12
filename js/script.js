// Global variables
let categoryChart = null;
let trendChart = null;
let editId = null;
let allExpenses = [];

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Load expenses on page load
document.addEventListener('DOMContentLoaded', function() {
    loadExpenses();
});

// Add/Edit Expense Form Submit
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const url = editId ? 'edit_expense.php' : 'add_expense.php';
    
    if (editId) {
        formData.append('id', editId);
    }
    
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            this.reset();
            document.getElementById('date').valueAsDate = new Date();
            document.getElementById('submitBtn').textContent = 'Add Expense';
            document.getElementById('cancelBtn').style.display = 'none';
            editId = null;
            loadExpenses();
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        showMessage('Error: ' + error, 'error');
    });
});

// Load Expenses
function loadExpenses() {
    const category = document.getElementById('filterCategory').value;
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    
    let url = 'get_expenses.php?';
    if (category) url += `category=${category}&`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allExpenses = data.data;
                displayExpenses(data.data);
                calculateSummary(data.data);
                displayCategorySummary(data.data);
                generateCharts(data.data);
            }
        })
        .catch(error => {
            console.error('Error loading expenses:', error);
            showMessage('Error loading expenses', 'error');
        });
}

// Display Expenses in Table
function displayExpenses(expenses) {
    const tbody = document.getElementById('expenseList');
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No expenses found. Add your first expense!</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td><span class="badge badge-${expense.category.toLowerCase()}">${expense.category}</span></td>
            <td>${expense.description}</td>
            <td class="amount-cell">₹${parseFloat(expense.amount).toFixed(2)}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="startEdit(${expense.id}, '${expense.amount}', '${expense.category}', '${expense.date}', '${escape(expense.description)}')">Edit</button>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Calculate Summary Statistics
function calculateSummary(expenses) {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;
    
    document.getElementById('totalExpense').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('totalCount').textContent = count;
    document.getElementById('avgExpense').textContent = `₹${average.toFixed(2)}`;
}

// Display Category Summary
function displayCategorySummary(expenses) {
    const categoryDiv = document.getElementById('categorySummary');
    
    if (expenses.length === 0) {
        categoryDiv.innerHTML = '<p class="no-data">No data available</p>';
        return;
    }
    
    const categoryTotals = {};
    
    expenses.forEach(expense => {
        const cat = expense.category;
        if (!categoryTotals[cat]) {
            categoryTotals[cat] = 0;
        }
        categoryTotals[cat] += parseFloat(expense.amount);
    });
    
    categoryDiv.innerHTML = '';
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    sortedCategories.forEach(([category, total]) => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <div class="category-header">
                <span class="category-icon">${getCategoryIcon(category)}</span>
                <h4>${category}</h4>
            </div>
            <p class="category-amount">₹${total.toFixed(2)}</p>
        `;
        categoryDiv.appendChild(item);
    });
}

// Generate Charts
function generateCharts(expenses) {
    if (expenses.length === 0) {
        if (categoryChart) categoryChart.destroy();
        if (trendChart) trendChart.destroy();
        return;
    }
    
    // Category Chart (Pie Chart)
    const categoryTotals = {};
    expenses.forEach(expense => {
        const cat = expense.category;
        if (!categoryTotals[cat]) {
            categoryTotals[cat] = 0;
        }
        categoryTotals[cat] += parseFloat(expense.amount);
    });
    
    const categoryLabels = Object.keys(categoryTotals);
    const categoryData = Object.values(categoryTotals);
    
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryData,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ₹' + context.parsed.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    
    // Trend Chart (Bar Chart)
    const dateTotals = {};
    expenses.forEach(expense => {
        const date = expense.date;
        if (!dateTotals[date]) {
            dateTotals[date] = 0;
        }
        dateTotals[date] += parseFloat(expense.amount);
    });
    
    const dateLabels = Object.keys(dateTotals).sort();
    const dateData = dateLabels.map(date => dateTotals[date]);
    
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    
    if (trendChart) {
        trendChart.destroy();
    }
    
    trendChart = new Chart(trendCtx, {
        type: 'bar',
        data: {
            labels: dateLabels.map(date => formatDate(date)),
            datasets: [{
                label: 'Daily Expenses (₹)',
                data: dateData,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Amount: ₹' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Start Edit Expense
function startEdit(id, amount, category, date, description) {
    editId = id;
    document.getElementById('amount').value = amount;
    document.getElementById('category').value = category;
    document.getElementById('date').value = date;
    document.getElementById('description').value = unescape(description);
    document.getElementById('submitBtn').textContent = 'Update Expense';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.expense-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancel Edit
function cancelEdit() {
    editId = null;
    document.getElementById('expenseForm').reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('submitBtn').textContent = 'Add Expense';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Delete Expense
function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('id', id);
    
    fetch('delete_expense.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Expense deleted successfully!', 'success');
            loadExpenses();
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        showMessage('Error deleting expense: ' + error, 'error');
    });
}

// Apply Filter
function applyFilter() {
    loadExpenses();
}

// Reset Filter
function resetFilter() {
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    loadExpenses();
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Get Category Icon
function getCategoryIcon(category) {
    const icons = {
        'Food': '🍔',
        'Transport': '🚗',
        'Entertainment': '🎬',
        'Shopping': '🛒',
        'Bills': '💡',
        'Healthcare': '⚕️',
        'Education': '📚',
        'Other': '📦'
    };
    return icons[category] || '📦';
}

// Show Message
function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Escape and unescape for descriptions with quotes
function escape(str) {
    return str.replace(/'/g, "\\'");
}

function unescape(str) {
    return str.replace(/\\'/g, "'");
}
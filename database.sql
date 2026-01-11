CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO expenses (amount, category, date, description) VALUES
(500.00, 'Food', '2025-01-10', 'Grocery shopping'),
(1200.00, 'Transport', '2025-01-09', 'Fuel for car'),
(300.00, 'Entertainment', '2025-01-08', 'Movie tickets'),
(150.00, 'Food', '2025-01-11', 'Restaurant lunch');
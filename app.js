// Load data from localStorage
let salary = localStorage.getItem("salary") || 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

document.getElementById('salary').value = salary;
document.getElementById('totalExpenses').textContent = calculateTotalExpenses();
document.getElementById('remainingBalance').textContent = salary - calculateTotalExpenses();

function saveSalary() {
    salary = parseFloat(document.getElementById('salary').value);
    localStorage.setItem("salary", salary);
    updateBalance();
}

function addExpense() {
    let expenseName = document.getElementById('expenseName').value;
    let expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
    let expenseDate = document.getElementById('expenseDate').value;  // Get selected date

    if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0 && expenseDate) {
        let expense = { name: expenseName, amount: expenseAmount, date: expenseDate };
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateExpenseList();
        updateBalance();
    } else {
        alert("Please enter valid expense details.");
    }
}

function calculateTotalExpenses() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function updateExpenseList() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `${expense.name} - $${expense.amount} - ${expense.date}`;
        expenseList.appendChild(listItem);
    });
    document.getElementById('totalExpenses').textContent = calculateTotalExpenses();
}

function updateBalance() {
    document.getElementById('remainingBalance').textContent = salary - calculateTotalExpenses();
}

function checkBalance() {
    alert(`Your remaining balance is $${salary - calculateTotalExpenses()}`);
}

// Function to clear all expenses
function clearExpenses() {
    if (confirm("Are you sure you want to clear all expenses?")) {
        expenses = [];
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateExpenseList();
        updateBalance();
    }
}

// Function to extract expenses by date range
function extractExpensesByDate() {
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    if (startDate && endDate) {
        let filteredExpenses = expenses.filter(expense => {
            return expense.date >= startDate && expense.date <= endDate;
        });

        displayExtractedExpenses(filteredExpenses);
    } else {
        alert("Please select both start and end dates.");
    }
}

// Function to display filtered expenses
function displayExtractedExpenses(filteredExpenses) {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    if (filteredExpenses.length > 0) {
        filteredExpenses.forEach(expense => {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.name} - $${expense.amount} - ${expense.date}`;
            expenseList.appendChild(listItem);
        });

        const totalFiltered = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
        document.getElementById('totalExpenses').textContent = totalFiltered;
        document.getElementById('remainingBalance').textContent = salary - totalFiltered;
    } else {
        expenseList.innerHTML = '<li>No expenses found for this date range.</li>';
        document.getElementById('totalExpenses').textContent = 0;
        document.getElementById('remainingBalance').textContent = salary;
    }
}

// Function to export expenses to CSV (for Excel)
function exportToCSV() {
    // Header of CSV file
    const header = ['Expense Name', 'Amount', 'Date'];
    const rows = expenses.map(expense => [expense.name, expense.amount, expense.date]);

    // Convert the header and rows into CSV format
    let csvContent = "data:text/csv;charset=utf-8," + header.join(",") + "\n";

    // Add the rows to CSV content
    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    // Create a downloadable link and simulate clicking it to download the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Remove the link after the download
}

// Initialize the page with existing data
updateExpenseList();

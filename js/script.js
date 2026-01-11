const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");

function loadExpenses() {
  fetch("get_expenses.php")
    .then(res => res.json())
    .then(data => {
      list.innerHTML = "";
      data.data.forEach(e => {
        list.innerHTML += `
          <tr>
            <td>${e.amount}</td>
            <td>${e.category}</td>
            <td>${e.date}</td>
            <td>${e.description}</td>
            <td>
              <button onclick="deleteExpense(${e.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(form);

  fetch("add_expense.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(() => {
    form.reset();
    loadExpenses();
  });
});

function deleteExpense(id) {
  const fd = new FormData();
  fd.append("id", id);

  fetch("delete_expense.php", {
    method: "POST",
    body: fd
  })
  .then(() => loadExpenses());
}

loadExpenses();

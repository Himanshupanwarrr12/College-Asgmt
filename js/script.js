const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");

let editId = null;

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
              <button onclick="startEdit(${e.id}, '${e.amount}', '${e.category}', '${e.date}', '${e.description}')">Edit</button>
              <button onclick="deleteExpense(${e.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}

function startEdit(id, amount, category, date, description) {
  form.amount.value = amount;
  form.category.value = category;
  form.date.value = date;
  form.description.value = description;
  editId = id;
  form.querySelector("button").textContent = "Update Expense";
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(form);

  if (editId) {
    formData.append("id", editId);

    fetch("edit_expense.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(() => {
      editId = null;
      form.querySelector("button").textContent = "Add Expense";
      form.reset();
      loadExpenses();
    });
  } else {
    fetch("add_expense.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      loadExpenses();
    });
  }
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

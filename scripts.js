// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// Inicializa a lista de despesas do localStorage ou cria uma nova
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Função para formatar o valor em BRL
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  value = Number(value) / 100; // Transforma o valor em centavos
  amount.value = formatCurrencyBRL(value); // Formata o valor como moeda
};

// Captura o evento de submit do formulário
form.onsubmit = (event) => {
  event.preventDefault();

  // Valida se os campos estão preenchidos
  if (!expense.value || !category.value || !amount.value) {
    alert("Preencha todos os campos!");
    return;
  }

  // Cria um objeto com os detalhes da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: parseFloat(amount.value.replace(/[^\d,]/g, "").replace(",", ".")),
    created_at: new Date(),
  };

  // Adiciona a nova despesa à lista e ao localStorage
  expenses.push(newExpense);
  saveExpensesToLocalStorage();
  expenseAdd(newExpense);

  // Limpa o formulário
  formClear();
};

// Salva as despesas no localStorage
function saveExpensesToLocalStorage() {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    alert("Não foi possível salvar as despesas.");
  }
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria elemento para adicionar na lista
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");
    expenseItem.dataset.id = newExpense.id;

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona name e category na div
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${formatCurrencyBRL(newExpense.amount).toUpperCase().replace("R$", "")}`;

    // Cria o ícone de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item na lista
    expenseList.append(expenseItem);

    // Atualiza totais
    updateTotals();
  } catch (error) {
    console.error("Erro ao adicionar despesa:", error);
    alert("Não foi possível adicionar a despesa.");
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista
    const items = expenseList.children;

    // Atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Variável para incrementar o total
    let total = 0;

    // Percorre cada item da lista
    for (let item of items) {
      const itemAmount = item.querySelector(".expense-amount");

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      value = parseFloat(value);

      // Verificar se é um número válido
      if (isNaN(value)) {
        console.error("Valor inválido encontrado:", itemAmount.textContent);
        continue;
      }

      // Incrementa o total
      total += value;
    }

    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expensesTotal.innerHTML = "";

    // Adiciona o símbolo da moeda e o valor total formatado
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.error("Erro ao atualizar totais:", error);
    alert("Não foi possível atualizar os totais.");
  }
}

// Evento que captura itens da lista
expenseList.addEventListener("click", function (event) {
  // Verifica se o evento foi disparado no ícone de remoção
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");

    // Remove o item da lista visualmente
    item.remove();

    // Remove o item do array de despesas
    const itemId = parseInt(item.dataset.id);
    expenses = expenses.filter((expense) => expense.id !== itemId);

    // Salva as despesas atualizadas no localStorage
    saveExpensesToLocalStorage();

    // Atualiza os totais
    updateTotals();
  }
});

// Limpa o formulário
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  // Coloca o foco no input amount
  expense.focus();
}

// Carrega as despesas salvas no localStorage ao iniciar a página
function loadExpensesFromLocalStorage() {
  try {
    expenses.forEach((expense) => expenseAdd(expense));
    updateTotals();
  } catch (error) {
    console.error("Erro ao carregar despesas do localStorage:", error);
    alert("Não foi possível carregar as despesas.");
  }
}

// Carrega as despesas ao carregar a página
window.addEventListener("DOMContentLoaded", loadExpensesFromLocalStorage);
// Seleciona os elementos do formulário

const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

//Captura o evento de input para formatar o valor
amount.oninput = () => {
  //Obtem o valor atual do input e remove os caracteres não numéricos
  let value = amount.value.replace(/\D/g, "");

  //Transforma o valor em centavos
  value = Number(value) / 100;

  //Atualiza o valor do input
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  //Formata o valor no padrão BRL
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  //Retorna o valor formatado
  return value;
}

//Captura o envento de submit do formulario para obter valores
form.onsubmit = (event) => {
  event.preventDefault();

  //Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };
  //Chama a função que irá adicionar o item na lista
  expenseAdd(newExpense);
};
//Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    //Cria elemento para adicionar na lista
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //Cria o ícone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    //Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    //Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona name e category na div
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    //Cria o ícon de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    //Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    //Adiciona o item na lista
    expenseList.append(expenseItem);

    //Limpa o formulário
    formClear();
    //Atualiza totais
    updateTotals();
  } catch (error) {
    alert("não foi possivel atualizar a lista");
    console.log(error);
  }
}
//Atualiza os totais

function updateTotals() {
  try {
    //Recupera todos os itens (li) da lista
    const items = expenseList.children;

    //Atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;
    //Variável para incrementar o total
    let total = 0;

    //Percorre cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      convert = parseFloat(value);
      // Verificar se é um número válido

      if (isNaN(value)) {
        return alert("Não foi possivel calcular o total.");
      }
      //Incrementa o total
      total += Number(value);
    }
    // Cria a span para adicionar o R$ formatado

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    //Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expensesTotal.innerHTML = "";

    //Adiciona o símbolo a moeda e o valor total formatado
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais");
  }
}
//Evento que captura itens da lista
expenseList.addEventListener("click", function (event) {
  //Verifica se o evento foi disparado
  if (event.target.classList.contains("remove-icon")) {
    //Obten a li pai do elemento clicado

    const item = event.target.closest(".expense");

    //remove o item da lista
    item.remove();
  }
  updateTotals();
});
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  //Coloca o foco no input amount
  expense.focus();
}

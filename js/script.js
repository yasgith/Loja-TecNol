// Função para exibir mensagens como Caixa de Diálogo
function showMessage(msg) {
  $("#textoDialog").html(msg);
  $.mobile.changePage("#msgDialog", { transition: "pop" });
}

// Validação simples do formulário de Contato
$(document).on("submit", "#contato", function (e) {
  e.preventDefault();

  // Corrigido: seleção correta dos campos pelo ID
  var name = $("#cname").val().trim();
  var email = $("#cemail").val().trim();
  var msg = $("#cmsg").val().trim();

  if (!name || !email || !msg) {
      showMessage("Preencha todos os campos.");
      return;
  }

  var arroba = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!arroba.test(email)) {
      showMessage("Email inválido.");
      return;
  }

  // Simula envio
  showMessage("Mensagem enviada com sucesso! Em breve entraremos em contato.");
  $(this)[0].reset();
});

// ========================
// Utilidades
// ========================
function getCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = carrinho.length;
}

function formatBR(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ========================
// Operações no carrinho
// ========================
function adicionarProduto(nome, preco) {
  const carrinho = getCarrinho();
  const existente = carrinho.find((p) => p.nome === nome);
  if (existente) {
    existente.qtd++;
  } else {
    carrinho.push({ nome, qtd: 1, preco: parseFloat(preco) });
  }
  salvarCarrinho(carrinho);
  alert(nome + " adicionado ao carrinho!");
  atualizarCarrinho();
}

function aumentarQtd(index) {
  const carrinho = getCarrinho();
  carrinho[index].qtd++;
  salvarCarrinho(carrinho);
  atualizarCarrinho();
}

function diminuirQtd(index) {
  const carrinho = getCarrinho();
  if (carrinho[index].qtd > 1) {
    carrinho[index].qtd--;
  } else {
    carrinho.splice(index, 1);
  }
  salvarCarrinho(carrinho);
  atualizarCarrinho();
}

function removerItem(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  atualizarCarrinho();
}

function esvaziarCarrinho() {
  salvarCarrinho([]);
  atualizarCarrinho();
}

// ========================
// Recibo
// ========================
function montarRecibo() {
  const carrinho = getCarrinho();
  if (!carrinho.length) {
    $("#reciboTexto").html("<p>Seu carrinho está vazio!</p>");
    return;
  }

  let total = 0;
  let html = "<h3>Compra Finalizada com Sucesso!</h3><ul>";
  carrinho.forEach(item => {
    const subtotal = item.qtd * item.preco;
    total += subtotal;
    html += `<li>${item.qtd}x ${item.nome} — ${formatBR(subtotal)}</li>`;
  });
  html += `</ul><p><strong>Total: ${formatBR(total)}</strong></p>`;

  $("#reciboTexto").html(html);
}

// ========================
// Render do carrinho
// ========================
function atualizarCarrinho() {
  const tabela = document.querySelector("#cart-table tbody");
  if (!tabela) return;

  const carrinho = getCarrinho();
  let total = 0;
  tabela.innerHTML = "";

  carrinho.forEach((item, index) => {
    const subtotal = item.qtd * item.preco;
    total += subtotal;
    const linha = `
      <tr>
        <td>${item.nome}</td>
        <td>
          <button class="ui-btn ui-mini ui-btn-inline" onclick="diminuirQtd(${index})">-</button>
          ${item.qtd}
          <button class="ui-btn ui-mini ui-btn-inline" onclick="aumentarQtd(${index})">+</button>
        </td>
        <td>${formatBR(subtotal)}</td>
        <td>
          <button class="ui-btn ui-mini ui-btn-inline ui-icon-delete ui-btn-icon-notext" onclick="removerItem(${index})">Remover</button>
        </td>
      </tr>`;
    tabela.insertAdjacentHTML("beforeend", linha);
  });

  document.getElementById("cart-total").textContent = formatBR(total);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = carrinho.length;
}

// ========================
// Eventos globais
// ========================
$(document).on("click", ".add-to-cart", function () {
  const nome = $(this).data("nome");
  const preco = $(this).data("preco");
  adicionarProduto(nome, preco);
});

// Monta recibo quando a página recibo.html abre
$(document).on("pageshow", "#reciboDialog", function () {
  montarRecibo();
});

// Ao fechar o recibo, limpar carrinho
$(document).on("pagehide", "#reciboDialog", function () {
  salvarCarrinho([]);
  atualizarCarrinho();
});

$(document).on("click", "a[data-icon='delete']", function () {
  esvaziarCarrinho();
});

$(document).on("pageshow", function () {
  salvarCarrinho(getCarrinho());
  atualizarCarrinho();
});

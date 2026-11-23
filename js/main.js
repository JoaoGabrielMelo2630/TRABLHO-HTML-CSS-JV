/* =========================================================
   GRÃO DOURADO — JavaScript principal (todas as páginas)

   Índice:
    1. Inicialização
    2. Tela de carregamento (preloader)
    4. Menu mobile e link ativo
    5. Efeitos de rolagem (cabeçalho, barra de progresso,
       voltar ao topo, animação de surgir)
    6. Aviso de cookies
    7. Utilitários (toast, preço, estrelas, modal)
    8. Carrinho de compras (gaveta lateral, cupom, entrega)

   Cada função confere se os elementos existem antes de rodar.
   ========================================================= */

/* ---------- 1. INICIALIZAÇÃO ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarMenuMobile();
  marcarLinkAtivo();
  iniciarEfeitosRolagem();
  iniciarRevelarAoRolar();
  iniciarAvisoCookies();
  criarCarrinho();
  atualizarContadorCarrinho();
  mostrarUsuario();

  const ano = document.getElementById("ano-atual");
  if (ano) ano.textContent = new Date().getFullYear();
});

/* ---------- 2. PRELOADER ---------- */
// "load" só dispara quando TUDO (CSS, scripts, fontes) terminou de carregar
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  setTimeout(() => preloader.classList.add("escondido"), 400);
});

/* ---------- USUÁRIO LOGADO (nome no topo + botão Sair) ---------- */
function mostrarUsuario() {
  const usuario = obterUsuarioLogado(); // função do auth.js
  if (!usuario) return;

  const primeiroNome = usuario.nome.split(" ")[0];
  const iniciais = usuario.nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  const area = document.createElement("div");
  area.className = "usuario-menu";
  area.innerHTML = `
    <button class="usuario-botao" id="usuario-botao" aria-haspopup="true" aria-expanded="false">
      <span class="usuario-avatar">${iniciais}</span>
      <span class="usuario-nome">Olá, ${escaparHTML(primeiroNome)}</span>
    </button>
    <div class="usuario-dropdown" id="usuario-dropdown">
      <p><strong>${escaparHTML(usuario.nome)}</strong><br><small>${escaparHTML(usuario.email)}</small></p>
      <a href="contato.html">Minhas mensagens</a>
      <button id="btn-sair">Sair</button>
    </div>
  `;
  document.querySelector(".acoes-cabecalho").prepend(area);

  const botao = document.getElementById("usuario-botao");
  const dropdown = document.getElementById("usuario-dropdown");
  botao.addEventListener("click", e => {
    e.stopPropagation();
    const aberto = dropdown.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
  });
  document.addEventListener("click", () => dropdown.classList.remove("aberto"));

  document.getElementById("btn-sair").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("usuarioLogado");
    location.href = "cadastro.html";
  });

  // Mensagem de boas-vindas logo depois do login/cadastro
  if (sessionStorage.getItem("boasVindas")) {
    sessionStorage.removeItem("boasVindas");
    setTimeout(() => mostrarToast(`Bem-vindo(a), ${primeiroNome}!`, "sucesso"), 900);
  }
}

/* ---------- 4. MENU MOBILE E LINK ATIVO ---------- */
function iniciarMenuMobile() {
  const botao = document.getElementById("btn-menu");
  const menu = document.querySelector(".menu");

  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botao.textContent = aberto ? "✕" : "☰";
    botao.setAttribute("aria-expanded", aberto); // acessibilidade
  });

  // Fecha o menu ao clicar em um link
  menu.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      menu.classList.remove("aberto");
      botao.textContent = "☰";
    })
  );
}

function marcarLinkAtivo() {
  const paginaAtual = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(link => {
    if (link.getAttribute("href") === paginaAtual) {
      link.classList.add("ativo");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- 5. EFEITOS DE ROLAGEM ---------- */
function iniciarEfeitosRolagem() {
  const cabecalho = document.querySelector(".cabecalho");
  const barra = document.getElementById("barra-progresso");
  const voltarTopo = document.getElementById("voltar-topo");

  function aoRolar() {
    const rolado = window.scrollY;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;

    cabecalho.classList.toggle("rolado", rolado > 20);
    voltarTopo.classList.toggle("visivel", rolado > 400);

    // Barra no topo mostra quanto da página já foi lida (0% a 100%)
    const porcentagem = alturaTotal > 0 ? (rolado / alturaTotal) * 100 : 0;
    barra.style.width = porcentagem + "%";
  }

  window.addEventListener("scroll", aoRolar);
  voltarTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  aoRolar();
}

function iniciarRevelarAoRolar() {
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".revelar").forEach(el => observador.observe(el));
}

/* ---------- 6. AVISO DE COOKIES ---------- */
function iniciarAvisoCookies() {
  if (localStorage.getItem("cookiesAceitos")) return;

  const aviso = document.createElement("div");
  aviso.className = "aviso-cookies";
  aviso.innerHTML = `
    <p>Usamos o armazenamento do navegador para lembrar seu carrinho e seus favoritos.</p>
    <button class="btn btn-primario btn-pequeno">Entendi</button>
  `;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.classList.add("mostrar"), 1200);

  aviso.querySelector("button").addEventListener("click", () => {
    localStorage.setItem("cookiesAceitos", "sim");
    aviso.classList.remove("mostrar");
    setTimeout(() => aviso.remove(), 400);
  });
}

/* ---------- 7. UTILITÁRIOS ---------- */
function mostrarToast(mensagem, tipo = "") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.className = `toast mostrar ${tipo}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove("mostrar"), 2800);
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Segurança: impede que o texto digitado pelo usuário vire código HTML
// (evita ataques do tipo XSS quando usamos innerHTML)
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Cria a tag <img> da foto de um produto.
// Se a foto falhar (sem internet), a imagem some e fica só a cor de fundo.
function imagemProduto(produto, largura = 600) {
  return `<img class="foto-real" src="${urlFoto(produto.foto, largura)}" alt="${produto.nome}"
               loading="lazy" onerror="this.remove()">`;
}

// Transforma uma nota (ex: 4.6) em estrelas: ★★★★☆
function gerarEstrelas(nota) {
  const cheias = Math.round(nota);
  return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

// Abre/fecha qualquer modal do site (detalhes do produto, confirmação etc.)
function abrirModal(id) {
  document.getElementById(id).classList.add("ativo");
  document.body.classList.add("sem-rolagem");
}
function fecharModal(id) {
  document.getElementById(id).classList.remove("ativo");
  document.body.classList.remove("sem-rolagem");
}

/* ---------- 8. CARRINHO ---------- */
/*
  Cada item salvo no localStorage tem o formato:
  { chave: "2-M", id: 2, nome, foto, tamanho: "M", precoUnitario, quantidade, observacao }
  A "chave" junta id + tamanho, para um Cappuccino P e um G
  aparecerem como itens separados.
*/
function lerCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarContadorCarrinho();
  renderizarCarrinho();
}

function atualizarContadorCarrinho() {
  const contador = document.querySelector(".contador-carrinho");
  if (!contador) return;
  const total = lerCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
  contador.textContent = total;
  contador.style.display = total > 0 ? "flex" : "none";

  // Pequena animação de "pulo" sempre que muda
  contador.classList.remove("pular");
  void contador.offsetWidth; // truque para reiniciar a animação CSS
  contador.classList.add("pular");
}

// Função usada pelo Início e pelo Cardápio para adicionar itens
function adicionarAoCarrinho(produto, tamanho = null, quantidade = 1, observacao = "") {
  const carrinho = lerCarrinho();
  const chave = `${produto.id}-${tamanho || "U"}`;
  const acrescimo = tamanho ? TAMANHOS[tamanho].acrescimo : 0;
  const existente = carrinho.find(item => item.chave === chave);

  if (existente) {
    existente.quantidade += quantidade;
    if (observacao) existente.observacao = observacao;
  } else {
    carrinho.push({
      chave,
      id: produto.id,
      nome: produto.nome,
      foto: produto.foto,
      tamanho,
      precoUnitario: produto.preco + acrescimo,
      quantidade,
      observacao
    });
  }

  salvarCarrinho(carrinho);
  mostrarToast(`${quantidade}x ${produto.nome} adicionado ao carrinho`, "sucesso");
}

// Cria a gaveta do carrinho via JavaScript (assim não repetimos o HTML em todas as páginas)
function criarCarrinho() {
  const html = `
    <div class="fundo-escuro" id="fundo-carrinho"></div>
    <aside class="carrinho" id="carrinho" aria-label="Carrinho de compras">
      <div class="carrinho-topo">
        <h3>Seu pedido</h3>
        <button class="btn-icone" id="fechar-carrinho" aria-label="Fechar carrinho">✕</button>
      </div>

      <div class="carrinho-itens" id="carrinho-itens"></div>

      <div class="carrinho-rodape" id="carrinho-rodape">
        <div class="opcoes-entrega">
          <label><input type="radio" name="entrega" value="retirada" checked> Retirar no balcão</label>
          <label><input type="radio" name="entrega" value="entrega"> Entrega (+${formatarPreco(TAXA_ENTREGA)})</label>
        </div>

        <div class="cupom">
          <input type="text" id="campo-cupom" placeholder="Cupom de desconto">
          <button class="btn-adicionar" id="aplicar-cupom">Aplicar</button>
        </div>
        <p class="dica-cupom">Dica: experimente o cupom <strong>GRAO10</strong></p>

        <div class="linha-valor"><span>Subtotal</span><span id="valor-subtotal">R$ 0,00</span></div>
        <div class="linha-valor desconto" id="linha-desconto"><span>Desconto</span><span id="valor-desconto">- R$ 0,00</span></div>
        <div class="linha-valor" id="linha-entrega"><span>Entrega</span><span>${formatarPreco(TAXA_ENTREGA)}</span></div>
        <div class="total"><span>Total</span><span id="valor-total">R$ 0,00</span></div>

        <button class="btn btn-primario" id="finalizar">Finalizar pedido</button>
        <button class="link-limpar" id="limpar-carrinho">Esvaziar carrinho</button>
      </div>
    </aside>

    <div class="modal" id="modal-pedido">
      <div class="modal-caixa modal-pequeno">
        <div class="icone-sucesso">✓</div>
        <h2>Pedido confirmado!</h2>
        <p>Número do pedido: <strong id="numero-pedido"></strong></p>
        <p id="texto-pedido"></p>
        <button class="btn btn-primario" data-fechar="modal-pedido">Fechar</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  const abrir = () => {
    document.getElementById("carrinho").classList.add("aberto");
    document.getElementById("fundo-carrinho").classList.add("ativo");
  };
  const fechar = () => {
    document.getElementById("carrinho").classList.remove("aberto");
    document.getElementById("fundo-carrinho").classList.remove("ativo");
  };

  document.getElementById("btn-carrinho").addEventListener("click", abrir);
  document.getElementById("fechar-carrinho").addEventListener("click", fechar);
  document.getElementById("fundo-carrinho").addEventListener("click", fechar);
  document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });

  // Opção de entrega muda o total
  document.querySelectorAll("input[name=entrega]").forEach(r => r.addEventListener("change", renderizarCarrinho));

  // Cupom
  document.getElementById("aplicar-cupom").addEventListener("click", () => {
    const codigo = document.getElementById("campo-cupom").value.trim().toUpperCase();
    if (CUPONS[codigo]) {
      localStorage.setItem("cupom", codigo);
      mostrarToast(`Cupom ${codigo} aplicado: ${CUPONS[codigo].descricao}`, "sucesso");
    } else {
      localStorage.removeItem("cupom");
      mostrarToast("Cupom inválido", "erro");
    }
    renderizarCarrinho();
  });

  document.getElementById("limpar-carrinho").addEventListener("click", () => {
    if (lerCarrinho().length === 0) return;
    salvarCarrinho([]);
    mostrarToast("Carrinho esvaziado");
  });

  document.getElementById("finalizar").addEventListener("click", () => {
    const carrinho = lerCarrinho();
    if (carrinho.length === 0) {
      mostrarToast("Adicione algum item primeiro!", "erro");
      return;
    }
    const { total } = calcularTotais();
    const entrega = document.querySelector("input[name=entrega]:checked").value;
    const numero = "#" + Math.floor(1000 + Math.random() * 9000); // número aleatório de 4 dígitos

    document.getElementById("numero-pedido").textContent = numero;
    document.getElementById("texto-pedido").textContent = entrega === "entrega"
      ? `Total de ${formatarPreco(total)}. Seu pedido chega em aproximadamente 35 minutos. `
      : `Total de ${formatarPreco(total)}. Fica pronto para retirada em 10 minutos. `;

    salvarCarrinho([]);
    localStorage.removeItem("cupom");
    document.getElementById("campo-cupom").value = "";
    fechar();
    abrirModal("modal-pedido");
  });

  // Qualquer botão com data-fechar="id" fecha o modal correspondente
  document.addEventListener("click", e => {
    const alvo = e.target.closest("[data-fechar]");
    if (alvo) fecharModal(alvo.dataset.fechar);
    if (e.target.classList.contains("modal")) fecharModal(e.target.id); // clique fora da caixa
  });

  renderizarCarrinho();
}

function calcularTotais() {
  const carrinho = lerCarrinho();
  const subtotal = carrinho.reduce((soma, i) => soma + i.precoUnitario * i.quantidade, 0);

  let desconto = 0;
  const cupom = CUPONS[localStorage.getItem("cupom")];
  if (cupom && subtotal > 0) {
    desconto = cupom.tipo === "porcentagem" ? subtotal * cupom.valor / 100 : Math.min(cupom.valor, subtotal);
  }

  const marcado = document.querySelector("input[name=entrega]:checked");
  const entrega = marcado && marcado.value === "entrega" && subtotal > 0 ? TAXA_ENTREGA : 0;

  return { subtotal, desconto, entrega, total: subtotal - desconto + entrega };
}

function renderizarCarrinho() {
  const area = document.getElementById("carrinho-itens");
  if (!area) return;
  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    area.innerHTML = `
      <div class="carrinho-vazio">
        <p>Seu carrinho está vazio.</p>
        <a href="cardapio.html" class="btn btn-primario btn-pequeno">Ver cardápio</a>
      </div>`;
  } else {
    area.innerHTML = carrinho.map(item => `
      <div class="item-carrinho">
        <span class="miniatura">${item.foto ? `<img class="foto-real" src="${urlFoto(item.foto, 120)}" alt="" onerror="this.remove()">` : ""}</span>
        <div class="dados">
          <strong>${item.nome}</strong>${item.tamanho ? ` <span class="tag-tamanho">${item.tamanho}</span>` : ""}<br>
          <small>${formatarPreco(item.precoUnitario)} cada</small>
          ${item.observacao ? `<small class="obs">${escaparHTML(item.observacao)}</small>` : ""}
        </div>
        <div class="qtd">
          <button data-chave="${item.chave}" data-mudanca="-1" aria-label="Diminuir">−</button>
          <span>${item.quantidade}</span>
          <button data-chave="${item.chave}" data-mudanca="1" aria-label="Aumentar">+</button>
        </div>
      </div>
    `).join("");

    area.querySelectorAll(".qtd button").forEach(btn => {
      btn.addEventListener("click", () => {
        let lista = lerCarrinho();
        const item = lista.find(i => i.chave === btn.dataset.chave);
        item.quantidade += Number(btn.dataset.mudanca);
        if (item.quantidade <= 0) lista = lista.filter(i => i.chave !== item.chave);
        salvarCarrinho(lista);
      });
    });
  }

  const { subtotal, desconto, entrega, total } = calcularTotais();
  document.getElementById("valor-subtotal").textContent = formatarPreco(subtotal);
  document.getElementById("valor-desconto").textContent = "- " + formatarPreco(desconto);
  document.getElementById("linha-desconto").style.display = desconto > 0 ? "flex" : "none";
  document.getElementById("linha-entrega").style.display = entrega > 0 ? "flex" : "none";
  document.getElementById("valor-total").textContent = formatarPreco(total);
  document.getElementById("carrinho-rodape").style.display = carrinho.length ? "block" : "none";
}

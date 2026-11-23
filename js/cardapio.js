/* =========================================================
   Página CARDÁPIO
   - Lista de produtos gerada a partir de dados.js
   - Filtro por categoria, busca, ordenação e favoritos
   - Leitura de parâmetro na URL (cardapio.html?categoria=doces)
   - Modal de detalhes com tamanho, quantidade e observação
   O carrinho em si fica no main.js (é compartilhado).
   ========================================================= */

// Estado da página: guarda o que o usuário escolheu
const estado = {
  categoria: "todos",
  busca: "",
  ordem: "relevancia"
};

let produtoAberto = null; // produto exibido no modal de detalhes

document.addEventListener("DOMContentLoaded", () => {
  lerParametroUrl();
  iniciarControles();
  iniciarModalDetalhes();
  renderizarProdutos();
});

/* ---------- FAVORITOS (salvos no localStorage) ---------- */
function lerFavoritos() {
  return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function alternarFavorito(id) {
  let favoritos = lerFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
    mostrarToast("Removido dos favoritos");
  } else {
    favoritos.push(id);
    mostrarToast("Adicionado aos favoritos");
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderizarProdutos();
}

/* ---------- PARÂMETRO NA URL ---------- */
function lerParametroUrl() {
  const parametros = new URLSearchParams(location.search);
  const categoria = parametros.get("categoria");
  if (categoria && CATEGORIAS[categoria]) estado.categoria = categoria;
}

/* ---------- CONTROLES (filtros, busca, ordem, favoritos) ---------- */
function iniciarControles() {
  const botoesFiltro = document.querySelectorAll(".filtro");

  botoesFiltro.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.categoria === estado.categoria);
    botao.addEventListener("click", () => {
      botoesFiltro.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      estado.categoria = botao.dataset.categoria;
      renderizarProdutos();
    });
  });

  document.getElementById("busca").addEventListener("input", e => {
    estado.busca = e.target.value;
    renderizarProdutos();
  });

  document.getElementById("ordenar").addEventListener("change", e => {
    estado.ordem = e.target.value;
    renderizarProdutos();
  });

  document.getElementById("limpar-filtros").addEventListener("click", () => {
    Object.assign(estado, { categoria: "todos", busca: "", ordem: "relevancia" });
    document.getElementById("busca").value = "";
    document.getElementById("ordenar").value = "relevancia";
    botoesFiltro.forEach(b => b.classList.toggle("ativo", b.dataset.categoria === "todos"));
    renderizarProdutos();
  });
}

// Remove acentos para a busca funcionar com "cafe" ou "café"
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* ---------- MONTA A LISTA NA TELA ---------- */
function renderizarProdutos() {
  const favoritos = lerFavoritos();
  const termo = normalizar(estado.busca);

  // 1) FILTRAR
  let lista = produtos.filter(p =>
    (estado.categoria === "todos" || p.categoria === estado.categoria) &&
    (normalizar(p.nome).includes(termo) || normalizar(p.descricao).includes(termo))
  );

  // 2) ORDENAR ([...lista] cria uma cópia para não mexer no array original)
  const ordenacoes = {
    relevancia:  (a, b) => a.id - b.id,
    menorPreco:  (a, b) => a.preco - b.preco,
    maiorPreco:  (a, b) => b.preco - a.preco,
    nome:        (a, b) => a.nome.localeCompare(b.nome),
    avaliacao:   (a, b) => b.nota - a.nota
  };
  lista = [...lista].sort(ordenacoes[estado.ordem]);

  // 3) DESENHAR
  const grade = document.getElementById("grade-produtos");
  grade.innerHTML = lista.map(p => {
    const favorito = favoritos.includes(p.id);
    const selo = p.selo ? `<span class="selo ${SELOS[p.selo].classe}">${SELOS[p.selo].texto}</span>` : "";
    return `
      <article class="card produto">
        <div class="imagem">
          ${imagemProduto(p)}
          ${selo}
          <button class="btn-favorito ${favorito ? "ativo" : ""}" data-id="${p.id}"
                  aria-label="${favorito ? "Remover dos" : "Adicionar aos"} favoritos"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="${favorito ? "currentColor" : "none"}" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button>
        </div>
        <div class="info">
          <span class="categoria">${CATEGORIAS[p.categoria]}</span>
          <h3>${p.nome}</h3>
          <div class="avaliacao"><span class="estrelas">${gerarEstrelas(p.nota)}</span> ${p.nota.toFixed(1)} (${p.avaliacoes})</div>
          <p class="descricao">${p.descricao}</p>
          <div class="rodape-produto">
            <span class="preco">${p.temTamanho ? "<small>a partir de</small> " : ""}${formatarPreco(p.preco)}</span>
            <button class="btn-adicionar" data-id="${p.id}">Ver detalhes</button>
          </div>
        </div>
      </article>`;
  }).join("");

  // Contador de resultados e aviso de "nada encontrado"
  document.getElementById("qtd-resultados").textContent =
    `${lista.length} ${lista.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  document.querySelector(".sem-resultados").style.display = lista.length ? "none" : "block";

  grade.querySelectorAll(".btn-favorito").forEach(btn =>
    btn.addEventListener("click", () => alternarFavorito(Number(btn.dataset.id)))
  );
  grade.querySelectorAll(".btn-adicionar").forEach(btn =>
    btn.addEventListener("click", () => abrirDetalhes(Number(btn.dataset.id)))
  );
}

/* ---------- MODAL DE DETALHES ---------- */
function iniciarModalDetalhes() {
  const modal = document.getElementById("modal-produto");

  modal.querySelector("#menos").addEventListener("click", () => mudarQuantidade(-1));
  modal.querySelector("#mais").addEventListener("click", () => mudarQuantidade(1));
  modal.querySelectorAll("input[name=tamanho]").forEach(r => r.addEventListener("change", atualizarPrecoModal));

  modal.querySelector("#adicionar-modal").addEventListener("click", () => {
    const tamanho = produtoAberto.temTamanho ? modal.querySelector("input[name=tamanho]:checked").value : null;
    const quantidade = Number(document.getElementById("qtd-modal").textContent);
    const observacao = document.getElementById("obs-modal").value.trim();
    adicionarAoCarrinho(produtoAberto, tamanho, quantidade, observacao);
    fecharModal("modal-produto");
  });
}

function abrirDetalhes(id) {
  produtoAberto = produtos.find(p => p.id === id);
  const p = produtoAberto;

  document.getElementById("modal-foto").innerHTML = imagemProduto(p, 900);
  document.getElementById("modal-categoria").textContent = CATEGORIAS[p.categoria];
  document.getElementById("modal-nome").textContent = p.nome;
  document.getElementById("modal-avaliacao").innerHTML =
    `<span class="estrelas">${gerarEstrelas(p.nota)}</span> ${p.nota.toFixed(1)} · ${p.avaliacoes} avaliações`;
  document.getElementById("modal-descricao").textContent = p.descricao;
  document.getElementById("modal-ingredientes").innerHTML = p.ingredientes.map(i => `<li>${i}</li>`).join("");
  document.getElementById("modal-calorias").textContent = `${p.calorias} kcal`;

  // Só mostra a escolha de tamanho para bebidas
  document.getElementById("grupo-tamanho").style.display = p.temTamanho ? "block" : "none";
  document.querySelector("input[name=tamanho][value=M]").checked = true;
  document.getElementById("qtd-modal").textContent = "1";
  document.getElementById("obs-modal").value = "";

  atualizarPrecoModal();
  abrirModal("modal-produto");
}

function mudarQuantidade(mudanca) {
  const el = document.getElementById("qtd-modal");
  const nova = Math.min(20, Math.max(1, Number(el.textContent) + mudanca)); // entre 1 e 20
  el.textContent = nova;
  atualizarPrecoModal();
}

function atualizarPrecoModal() {
  const p = produtoAberto;
  const tamanho = document.querySelector("input[name=tamanho]:checked").value;
  const unitario = p.preco + (p.temTamanho ? TAMANHOS[tamanho].acrescimo : 0);
  const quantidade = Number(document.getElementById("qtd-modal").textContent);
  document.getElementById("adicionar-modal").textContent = `Adicionar · ${formatarPreco(unitario * quantidade)}`;
}

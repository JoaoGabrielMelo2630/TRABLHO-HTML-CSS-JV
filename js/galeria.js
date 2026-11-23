/* =========================================================
   Página GALERIA
   - Fotos geradas a partir de um array
   - Filtro por categoria com animação
   - Lightbox: contador "3 de 12", setas, teclado
     (← → Esc) e deslizar com o dedo no celular
   ========================================================= */

const fotos = [
  { foto: FOTOS.interior,  legenda: "Nosso salão principal",     categoria: "espaco",  formato: "larga alta" },
  { foto: produtos[1].foto,  legenda: "Cappuccino com latte art",   categoria: "bebidas", formato: "" },
  { foto: produtos[9].foto,  legenda: "Croissants fresquinhos",     categoria: "comidas", formato: "" },
  { foto: FOTOS.fazenda,  legenda: "Flor do café na fazenda parceira", categoria: "espaco", formato: "alta" },
  { foto: FOTOS.torra,  legenda: "Torra do dia",               categoria: "espaco",  formato: "" },
  { foto: produtos[13].foto,  legenda: "Bolo de cenoura",            categoria: "comidas", formato: "" },
  { foto: FOTOS.barista,  legenda: "Nosso barista em ação",      categoria: "bebidas", formato: "larga" },
  { foto: FOTOS.graos,  legenda: "Grãos selecionados",         categoria: "espaco",  formato: "" },
  { foto: produtos[16].foto,  legenda: "Donuts da casa",             categoria: "comidas", formato: "" },
  { foto: produtos[5].foto,  legenda: "Café gelado no verão",       categoria: "bebidas", formato: "" },
  { foto: FOTOS.livro,  legenda: "Cantinho de leitura", categoria: "espaco", formato: "" },
  { foto: FOTOS.estudos,  legenda: "Área de estudos com Wi-Fi",  categoria: "espaco",  formato: "larga" },
  { foto: FOTOS.coado,  legenda: "Café coado na hora", categoria: "bebidas", formato: "" },
  { foto: produtos[14].foto,  legenda: "Cookies saindo do forno",    categoria: "comidas", formato: "" },
  { foto: FOTOS.maquina,  legenda: "Nossa máquina de espresso",  categoria: "espaco",  formato: "larga" }
];

let fotosVisiveis = [...fotos]; // muda conforme o filtro
let atual = 0;

document.addEventListener("DOMContentLoaded", () => {
  renderizarGaleria();
  iniciarFiltrosGaleria();
  iniciarLightbox();
});

function renderizarGaleria() {
  const grade = document.getElementById("grade-galeria");
  grade.innerHTML = fotosVisiveis.map((f, i) => `
    <button class="foto ${f.formato}" data-indice="${i}" aria-label="Ampliar foto: ${f.legenda}">
      <img class="foto-real" src="${urlFoto(f.foto, f.formato ? 900 : 500)}" alt="${f.legenda}" loading="lazy" onerror="this.remove()">
      <span class="legenda">${f.legenda}</span>
    </button>
  `).join("");

  grade.querySelectorAll(".foto").forEach(el =>
    el.addEventListener("click", () => abrirFoto(Number(el.dataset.indice)))
  );

  document.getElementById("qtd-fotos").textContent = `${fotosVisiveis.length} fotos`;
}

function iniciarFiltrosGaleria() {
  const botoes = document.querySelectorAll(".filtro");
  const grade = document.getElementById("grade-galeria");

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      botoes.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      const categoria = botao.dataset.categoria;
      fotosVisiveis = categoria === "todas" ? [...fotos] : fotos.filter(f => f.categoria === categoria);

      // Some, troca as fotos e aparece de novo
      grade.classList.add("trocando");
      setTimeout(() => {
        renderizarGaleria();
        grade.classList.remove("trocando");
      }, 250);
    });
  });
}

/* ---------- LIGHTBOX ---------- */
function abrirFoto(indice) {
  atual = (indice + fotosVisiveis.length) % fotosVisiveis.length;
  const foto = fotosVisiveis[atual];
  const conteudo = document.querySelector(".lightbox-conteudo");

  conteudo.innerHTML = `
    <div class="lightbox-imagem">
      <img class="foto-real" src="${urlFoto(foto.foto, 1400)}" alt="${foto.legenda}" onerror="this.remove()">
    </div>
    <p>${foto.legenda}</p>`;
  document.getElementById("lightbox-contador").textContent = `${atual + 1} de ${fotosVisiveis.length}`;
  document.getElementById("lightbox").classList.add("ativo");
  document.body.classList.add("sem-rolagem");
}

function fecharFoto() {
  document.getElementById("lightbox").classList.remove("ativo");
  document.body.classList.remove("sem-rolagem");
}

function iniciarLightbox() {
  const lightbox = document.getElementById("lightbox");

  lightbox.querySelector(".fechar").addEventListener("click", fecharFoto);
  lightbox.querySelector(".ant").addEventListener("click", () => abrirFoto(atual - 1));
  lightbox.querySelector(".prox").addEventListener("click", () => abrirFoto(atual + 1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) fecharFoto(); });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("ativo")) return;
    if (e.key === "Escape") fecharFoto();
    if (e.key === "ArrowLeft") abrirFoto(atual - 1);
    if (e.key === "ArrowRight") abrirFoto(atual + 1);
  });

  let inicioToque = 0;
  lightbox.addEventListener("touchstart", e => (inicioToque = e.touches[0].clientX));
  lightbox.addEventListener("touchend", e => {
    const diferenca = e.changedTouches[0].clientX - inicioToque;
    if (Math.abs(diferenca) > 50) abrirFoto(diferenca < 0 ? atual + 1 : atual - 1);
  });
}

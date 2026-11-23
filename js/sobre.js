/* =========================================================
   Página SOBRE
   - Barras de origem dos grãos (animadas ao aparecer)
   - Acordeão de perguntas frequentes com busca
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  iniciarBarras();
  iniciarAcordeao();
  iniciarBuscaFaq();
});

/* ---------- BARRAS DE PROGRESSO ---------- */
function iniciarBarras() {
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      entrada.target.querySelectorAll(".barra-preenchida").forEach(barra => {
        barra.style.width = barra.dataset.porcentagem + "%"; // a transição CSS faz a animação
      });
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.4 });

  const grafico = document.querySelector(".grafico-barras");
  if (grafico) observador.observe(grafico);
}

/* ---------- ACORDEÃO (FAQ) ---------- */
function iniciarAcordeao() {
  const itens = document.querySelectorAll(".acordeao-item");

  itens.forEach(item => {
    const pergunta = item.querySelector(".acordeao-pergunta");
    const resposta = item.querySelector(".acordeao-resposta");

    pergunta.addEventListener("click", () => {
      const estavaAberto = item.classList.contains("aberto");

      itens.forEach(outro => {
        outro.classList.remove("aberto");
        outro.querySelector(".acordeao-resposta").style.maxHeight = null;
        outro.querySelector(".acordeao-pergunta").setAttribute("aria-expanded", "false");
      });

      if (!estavaAberto) {
        item.classList.add("aberto");
        resposta.style.maxHeight = resposta.scrollHeight + "px";
        pergunta.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---------- BUSCA NAS PERGUNTAS ---------- */
function iniciarBuscaFaq() {
  const campo = document.getElementById("busca-faq");
  const aviso = document.getElementById("faq-vazio");

  campo.addEventListener("input", () => {
    const termo = campo.value.toLowerCase().trim();
    let visiveis = 0;

    document.querySelectorAll(".acordeao-item").forEach(item => {
      const texto = item.textContent.toLowerCase();
      const mostrar = texto.includes(termo);
      item.style.display = mostrar ? "" : "none";
      if (mostrar) visiveis++;
    });

    aviso.style.display = visiveis === 0 ? "block" : "none";
  });
}

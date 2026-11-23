/* =========================================================
   Página INÍCIO
   - Efeito de digitação no banner principal
   ========================================================= */

document.addEventListener("DOMContentLoaded", efeitoDigitacao);

/* ---------- EFEITO "MÁQUINA DE ESCREVER" ----------
   Digita uma frase letra por letra, espera, apaga e
   passa para a próxima, em ciclo. */
function efeitoDigitacao() {
  const alvo = document.getElementById("texto-digitado");
  const frases = [
    "Grãos selecionados de fazendas brasileiras.",
    "Torra artesanal feita todos os dias.",
    "Um cantinho aconchegante para estudar e trabalhar.",
    "Peça online e retire sem fila."
  ];
  let frase = 0, letra = 0, apagando = false;

  function digitar() {
    const texto = frases[frase];
    alvo.textContent = texto.substring(0, letra);

    if (!apagando && letra < texto.length)      { letra++; setTimeout(digitar, 55); }   // escrevendo
    else if (!apagando)                          { apagando = true; setTimeout(digitar, 1800); } // pausa
    else if (letra > 0)                          { letra--; setTimeout(digitar, 25); }   // apagando
    else { apagando = false; frase = (frase + 1) % frases.length; setTimeout(digitar, 300); } // próxima
  }
  digitar();
}

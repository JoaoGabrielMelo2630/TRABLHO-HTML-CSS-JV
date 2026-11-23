/* =========================================================
   GRÃO DOURADO — Proteção das páginas (autenticação)

   Este arquivo é carregado no <head> de TODAS as páginas,
   antes de qualquer conteúdo aparecer. Se não houver um
   usuário logado, manda a pessoa para a tela de cadastro.

   Observação: é uma SIMULAÇÃO para o trabalho. Em um site
   de verdade, o login seria verificado por um servidor.
   ========================================================= */

function obterUsuarioLogado() {
  // sessionStorage = some quando fecha o navegador
  // localStorage   = fica salvo ("Lembrar de mim")
  const dados = sessionStorage.getItem("usuarioLogado") || localStorage.getItem("usuarioLogado");
  return dados ? JSON.parse(dados) : null;
}

(function protegerPagina() {
  const pagina = location.pathname.split("/").pop() || "index.html";
  const naTelaDeCadastro = pagina === "cadastro.html";
  const usuario = obterUsuarioLogado();

  if (!usuario && !naTelaDeCadastro) {
    // replace() não deixa a página protegida no histórico do "voltar"
    location.replace("cadastro.html");
  } else if (usuario && naTelaDeCadastro) {
    location.replace("index.html");
  }
})();

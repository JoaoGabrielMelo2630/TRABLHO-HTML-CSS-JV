/* =========================================================
   Tela de CADASTRO / LOGIN (cadastro.html)
   - Abas "Criar conta" e "Entrar"
   - Validação de todos os campos
   - Medidor de força da senha
   - Botão para mostrar/ocultar a senha
   - Usuários salvos no localStorage (simulação)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  iniciarAbasAuth();
  iniciarMostrarSenha();
  iniciarForcaSenha();
  iniciarCadastro();
  iniciarLogin();
});

/* ---------- UTILITÁRIOS ---------- */
function lerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function mostrarAviso(mensagem, tipo = "") {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.className = `toast mostrar ${tipo}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove("mostrar"), 3000);
}

function marcarCampo(campo, erro) {
  const grupo = campo.closest(".grupo");
  grupo.querySelector(".mensagem-erro").textContent = erro;
  grupo.classList.toggle("erro", erro !== "");
  grupo.classList.toggle("sucesso", erro === "" && campo.type !== "checkbox");
  return erro === "";
}

function entrar(usuario, lembrar) {
  // Nunca guardamos a senha na sessão, só nome e e-mail
  const sessao = JSON.stringify({ nome: usuario.nome, email: usuario.email });
  if (lembrar) localStorage.setItem("usuarioLogado", sessao);
  else sessionStorage.setItem("usuarioLogado", sessao);
  sessionStorage.setItem("boasVindas", "sim");
  location.href = "index.html";
}

/* ---------- ABAS ---------- */
function iniciarAbasAuth() {
  const abas = document.querySelectorAll(".auth-aba");
  abas.forEach(aba => {
    aba.addEventListener("click", () => trocarAba(aba.dataset.alvo));
  });
  // Links do tipo "Já tem conta? Entrar"
  document.querySelectorAll("[data-trocar]").forEach(link => {
    link.addEventListener("click", e => { e.preventDefault(); trocarAba(link.dataset.trocar); });
  });
}

function trocarAba(alvo) {
  document.querySelectorAll(".auth-aba").forEach(a => a.classList.toggle("ativo", a.dataset.alvo === alvo));
  document.querySelectorAll(".auth-form").forEach(f => f.classList.toggle("ativo", f.id === alvo));
}

/* ---------- MOSTRAR / OCULTAR SENHA ---------- */
function iniciarMostrarSenha() {
  document.querySelectorAll(".ver-senha").forEach(botao => {
    botao.addEventListener("click", () => {
      const campo = document.getElementById(botao.dataset.campo);
      const mostrando = campo.type === "text";
      campo.type = mostrando ? "password" : "text";
      botao.textContent = mostrando ? "Mostrar" : "Ocultar";
      botao.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
    });
  });
}

/* ---------- FORÇA DA SENHA ---------- */
// Cada requisito é uma expressão regular testada na senha
const REQUISITOS = {
  tamanho:   s => s.length >= 8,
  maiuscula: s => /[A-Z]/.test(s),
  numero:    s => /[0-9]/.test(s),
  especial:  s => /[^A-Za-z0-9]/.test(s)
};

function iniciarForcaSenha() {
  const campo = document.getElementById("cad-senha");
  const barra = document.getElementById("forca-barra");
  const texto = document.getElementById("forca-texto");
  const niveis = [
    { nome: "Muito fraca", cor: "#d64545" },
    { nome: "Fraca",       cor: "#e8833a" },
    { nome: "Média",       cor: "#e0b32e" },
    { nome: "Boa",         cor: "#7cb342" },
    { nome: "Forte ",    cor: "#2e9e5b" }
  ];

  campo.addEventListener("input", () => {
    const senha = campo.value;
    let pontos = 0;

    // Conta quantos requisitos a senha já cumpre (0 a 4)
    Object.values(REQUISITOS).forEach(testar => { if (testar(senha)) pontos++; });

    const nivel = senha.length === 0 ? null : niveis[pontos];
    barra.style.width = senha.length === 0 ? "0" : `${(pontos / 4) * 100 || 10}%`;
    barra.style.background = nivel ? nivel.cor : "transparent";
    texto.textContent = nivel ? `Força: ${nivel.nome}` : "";
  });
}

/* ---------- CADASTRO ---------- */
function iniciarCadastro() {
  const form = document.getElementById("form-cadastro");

  const regras = {
    "cad-nome":  v => v.trim().split(" ").filter(Boolean).length < 2 ? "Digite nome e sobrenome." : "",
    "cad-email": v => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Digite um e-mail válido.";
      if (lerUsuarios().some(u => u.email === v.trim().toLowerCase())) return "Este e-mail já está cadastrado. Faça login.";
      return "";
    },
    "cad-senha": v => Object.values(REQUISITOS).every(testar => testar(v)) ? "" : "Use 8 caracteres ou mais, com letra maiúscula, número e símbolo.",
    "cad-confirmar": v => v !== document.getElementById("cad-senha").value || v === "" ? "As senhas não são iguais." : "",
  };

  const campos = Object.keys(regras).map(id => document.getElementById(id));
  const validar = campo => marcarCampo(campo, regras[campo.id](campo.value, campo));

  campos.forEach(campo => {
    campo.addEventListener("blur", () => { if (campo.value || campo.type === "checkbox") validar(campo); });
    campo.addEventListener("input", () => { if (campo.closest(".grupo").classList.contains("erro")) validar(campo); });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!campos.map(validar).every(Boolean)) {
      form.querySelector(".grupo.erro input").focus();
      mostrarAviso("Corrija os campos destacados.", "erro");
      return;
    }

    const usuario = {
      nome: document.getElementById("cad-nome").value.trim(),
      email: document.getElementById("cad-email").value.trim().toLowerCase(),
      // ATENÇÃO: só para simulação! Um site real nunca guarda a senha assim:
      // ela seria enviada a um servidor e salva criptografada (hash).
      senha: document.getElementById("cad-senha").value,
      criadoEm: new Date().toLocaleDateString("pt-BR")
    };

    const usuarios = lerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    const botao = form.querySelector("button[type=submit]");
    botao.disabled = true;
    botao.innerHTML = `<span class="spinner"></span> Criando sua conta...`;
    setTimeout(() => entrar(usuario, true), 1200);
  });
}

/* ---------- LOGIN ---------- */
function iniciarLogin() {
  const form = document.getElementById("form-login");
  let tentativas = 0;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("log-email");
    const senha = document.getElementById("log-senha");

    const okEmail = marcarCampo(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? "" : "Digite um e-mail válido.");
    const okSenha = marcarCampo(senha, senha.value ? "" : "Digite sua senha.");
    if (!okEmail || !okSenha) return;

    const usuario = lerUsuarios().find(u => u.email === email.value.trim().toLowerCase());

    if (!usuario || usuario.senha !== senha.value) {
      tentativas++;
      marcarCampo(senha, "E-mail ou senha incorretos.");
      // Animação de "tremer" o formulário
      form.classList.remove("tremer");
      void form.offsetWidth;
      form.classList.add("tremer");
      if (tentativas >= 3) mostrarAviso("Não tem conta ainda? Clique em \"Criar conta\" ");
      return;
    }

    const botao = form.querySelector("button[type=submit]");
    botao.disabled = true;
    botao.innerHTML = `<span class="spinner"></span> Entrando...`;
    setTimeout(() => entrar(usuario, document.getElementById("log-lembrar").checked), 900);
  });

  document.getElementById("esqueci").addEventListener("click", e => {
    e.preventDefault();
    mostrarAviso("Se o e-mail existir, enviaremos um link de recuperação (simulação).");
  });
}

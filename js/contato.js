/* =========================================================
   Página CONTATO
   - Status "aberto agora" e destaque do dia de hoje
   - Máscara de telefone e contador de caracteres
   - Campos extras que aparecem quando o assunto é "reserva"
   - Validação completa com mensagens de erro
   - Envio simulado (carregando...) e histórico das mensagens
     enviadas salvo no localStorage, com opção de excluir
   ========================================================= */

// Horários de funcionamento (índice = dia da semana, 0 = domingo)
const HORARIOS = [
  { dia: "Domingo",  abre: 8, fecha: 14 },
  { dia: "Segunda",  abre: 7, fecha: 20 },
  { dia: "Terça",    abre: 7, fecha: 20 },
  { dia: "Quarta",   abre: 7, fecha: 20 },
  { dia: "Quinta",   abre: 7, fecha: 20 },
  { dia: "Sexta",    abre: 7, fecha: 22 },
  { dia: "Sábado",   abre: 8, fecha: 18 }
];

const NOMES_ASSUNTO = {
  duvida: "Dúvida", reserva: "Reserva", sugestao: "Sugestão",
  elogio: "Elogio", reclamacao: "Reclamação", trabalhe: "Trabalhe conosco"
};

document.addEventListener("DOMContentLoaded", () => {
  montarHorarios();
  iniciarMascaraTelefone();
  iniciarContadorCaracteres();
  iniciarCamposReserva();
  iniciarValidacao();
  renderizarHistorico();
  preencherUsuario();
});

/* ---------- PREENCHE NOME E E-MAIL DE QUEM ESTÁ LOGADO ---------- */
function preencherUsuario() {
  const usuario = obterUsuarioLogado();
  if (!usuario) return;
  document.getElementById("nome").value = usuario.nome;
  document.getElementById("email").value = usuario.email;
}

/* ---------- HORÁRIOS + STATUS ---------- */
function montarHorarios() {
  const agora = new Date();
  const hoje = agora.getDay();
  const hora = agora.getHours() + agora.getMinutes() / 60;

  // Lista começando na segunda-feira (fica mais natural para o leitor)
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  document.getElementById("lista-horarios").innerHTML = ordem.map(i => {
    const h = HORARIOS[i];
    return `<li class="${i === hoje ? "hoje" : ""}">
              <span>${h.dia}${i === hoje ? " (hoje)" : ""}</span>
              <span>${h.abre}h às ${h.fecha}h</span>
            </li>`;
  }).join("");

  const { abre, fecha } = HORARIOS[hoje];
  const aberta = hora >= abre && hora < fecha;
  const selo = document.getElementById("status-loja");

  if (aberta) {
    const faltam = Math.round((fecha - hora) * 60);
    selo.textContent = faltam <= 60
      ? `Aberto — fecha em ${faltam} min`
      : `Aberto agora — até ${fecha}h`;
    selo.classList.add(faltam <= 60 ? "fechando" : "aberta");
  } else {
    const proximo = hora < abre ? `hoje às ${abre}h` : `amanhã às ${HORARIOS[(hoje + 1) % 7].abre}h`;
    selo.textContent = `Fechado — abre ${proximo}`;
    selo.classList.add("fechada");
  }
}

/* ---------- MÁSCARA DE TELEFONE ---------- */
function iniciarMascaraTelefone() {
  const campo = document.getElementById("telefone");
  campo.addEventListener("input", () => {
    let v = campo.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10)      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`; // celular
    else if (v.length > 6)  v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`; // fixo
    else if (v.length > 2)  v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0)  v = `(${v}`;
    campo.value = v;
  });
}

/* ---------- CONTADOR DE CARACTERES ---------- */
function iniciarContadorCaracteres() {
  const texto = document.getElementById("mensagem");
  const contador = document.getElementById("contador");
  const limite = Number(texto.getAttribute("maxlength"));

  texto.addEventListener("input", () => {
    const usados = texto.value.length;
    contador.textContent = `${usados}/${limite}`;
    contador.classList.toggle("quase-cheio", usados > limite * 0.9); // fica vermelho perto do limite
  });
}

/* ---------- CAMPOS DE RESERVA (aparecem só quando necessário) ---------- */
function iniciarCamposReserva() {
  const assunto = document.getElementById("assunto");
  const bloco = document.getElementById("campos-reserva");
  const data = document.getElementById("data");

  // Não deixa escolher uma data no passado
  data.min = new Date().toISOString().split("T")[0];

  assunto.addEventListener("change", () => {
    bloco.classList.toggle("visivel", assunto.value === "reserva");
  });
}

/* ---------- VALIDAÇÃO ---------- */
const regras = {
  nome:     v => v.trim().split(" ").filter(Boolean).length < 2 ? "Digite nome e sobrenome." : "",
  email:    v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Digite um e-mail válido (ex: nome@email.com)." : "",
  telefone: v => v.replace(/\D/g, "").length < 10 ? "Digite um telefone com DDD." : "",
  assunto:  v => v === "" ? "Escolha um assunto." : "",
  data:     v => reservaAtiva() && v === "" ? "Escolha a data da reserva." : "",
  hora:     v => reservaAtiva() && v === "" ? "Escolha o horário." : "",
  pessoas:  v => reservaAtiva() && (v < 2 || v > 20) ? "Reservas de 2 a 20 pessoas." : "",
  mensagem: v => v.trim().length < 10 ? "A mensagem precisa ter pelo menos 10 caracteres." : "",
  termos:   (_, campo) => !campo.checked ? "Você precisa aceitar para continuar." : ""
};

function reservaAtiva() {
  return document.getElementById("assunto").value === "reserva";
}

function validarCampo(campo) {
  const grupo = campo.closest(".grupo");
  const erro = regras[campo.id](campo.value, campo);
  grupo.querySelector(".mensagem-erro").textContent = erro;
  grupo.classList.toggle("erro", erro !== "");
  grupo.classList.toggle("sucesso", erro === "" && campo.type !== "checkbox");
  campo.setAttribute("aria-invalid", erro !== "");
  return erro === "";
}

function iniciarValidacao() {
  const form = document.getElementById("form-contato");
  const campos = Object.keys(regras).map(id => document.getElementById(id));

  campos.forEach(campo => {
    // Valida ao sair do campo; depois do primeiro erro, valida enquanto digita
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      if (campo.closest(".grupo").classList.contains("erro")) validarCampo(campo);
    });
    campo.addEventListener("change", () => {
      if (campo.type === "checkbox") validarCampo(campo);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const resultados = campos.map(validarCampo);
    if (!resultados.every(Boolean)) {
      // Leva o usuário até o primeiro campo com erro
      const primeiroErro = form.querySelector(".grupo.erro input, .grupo.erro select, .grupo.erro textarea");
      primeiroErro.focus();
      mostrarToast("Corrija os campos destacados.", "erro");
      return;
    }

    enviarFormulario(form);
  });
}

/* ---------- ENVIO SIMULADO ---------- */
function enviarFormulario(form) {
  const botao = form.querySelector("button[type=submit]");
  botao.disabled = true;
  botao.innerHTML = `<span class="spinner"></span> Enviando...`;

  // Monta um objeto com os dados do formulário
  const mensagem = {
    id: Date.now(),
    nome: form.nome.value.trim(),
    email: form.email.value.trim(),
    assunto: form.assunto.value,
    texto: form.mensagem.value.trim(),
    preferencia: form.querySelector("input[name=preferencia]:checked").value,
    data: new Date().toLocaleString("pt-BR"),
    reserva: reservaAtiva()
      ? { data: form.data.value.split("-").reverse().join("/"), hora: form.hora.value, pessoas: form.pessoas.value }
      : null
  };

  // setTimeout imita o tempo que um servidor de verdade levaria para responder
  setTimeout(() => {
    const historico = JSON.parse(localStorage.getItem("mensagens")) || [];
    historico.unshift(mensagem); // unshift coloca no início da lista
    localStorage.setItem("mensagens", JSON.stringify(historico));

    mostrarToast(`Obrigado, ${mensagem.nome.split(" ")[0]}! Responderemos por ${mensagem.preferencia}.`, "sucesso");

    form.reset();
    preencherUsuario();
    document.getElementById("contador").textContent = "0/500";
    document.getElementById("campos-reserva").classList.remove("visivel");
    form.querySelectorAll(".grupo").forEach(g => g.classList.remove("sucesso", "erro"));
    botao.disabled = false;
    botao.textContent = "Enviar mensagem";

    renderizarHistorico();
  }, 1500);
}

/* ---------- HISTÓRICO DE MENSAGENS ---------- */
function renderizarHistorico() {
  const historico = JSON.parse(localStorage.getItem("mensagens")) || [];
  const secao = document.getElementById("secao-historico");
  const lista = document.getElementById("lista-historico");

  secao.style.display = historico.length ? "block" : "none";

  lista.innerHTML = historico.map(m => `
    <div class="card mensagem-enviada">
      <div class="mensagem-topo">
        <span class="tag-assunto">${NOMES_ASSUNTO[m.assunto]}</span>
        <small>${m.data}</small>
      </div>
      <p>${escaparHTML(m.texto)}</p>
      ${m.reserva ? `<p class="info-reserva">${m.reserva.data} às ${m.reserva.hora} · ${m.reserva.pessoas} pessoas</p>` : ""}
      <div class="mensagem-rodape">
        <small>Resposta por: ${m.preferencia}</small>
        <button class="link-limpar" data-id="${m.id}">Excluir</button>
      </div>
    </div>
  `).join("");

  lista.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const restante = historico.filter(m => m.id !== Number(btn.dataset.id));
      localStorage.setItem("mensagens", JSON.stringify(restante));
      renderizarHistorico();
    });
  });
}

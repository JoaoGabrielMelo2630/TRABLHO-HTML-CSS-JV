# Grão Dourado — Trabalho Final de Front-End

Site de uma cafeteria artesanal **fictícia**, com 5 páginas, feito só com **HTML5, CSS3 e JavaScript puro** (sem bibliotecas nem frameworks).

**Como abrir:** extraia o zip (botão direito → *Extrair tudo*), abra a pasta e dê dois cliques em `index.html`.
Na primeira vez, o site abre a **tela de cadastro**: crie uma conta para entrar.

> As fotos vêm do **Unsplash** (banco de fotos gratuito), então precisam de **internet**. Sem internet, o site continua funcionando e mostra um fundo de cor neutra no lugar de cada foto.

---

## Estrutura de pastas

```
grao-dourado/
├── cadastro.html     → Tela de cadastro e login (primeira tela do site)
├── index.html        → Página inicial
├── sobre.html        → História, origem dos grãos e perguntas frequentes
├── cardapio.html     → Cardápio com filtros e pedidos
├── galeria.html      → Galeria de fotos
├── contato.html      → Formulário de contato e reservas
├── css/
│   ├── style.css       → Base: variáveis, layout, cabeçalho e estilos das páginas
│   ├── componentes.css → Componentes: modal, carrinho, preloader, fotos, menu do usuário...
│   └── cadastro.css    → Estilos só da tela de cadastro/login
└── js/
    ├── auth.js       → Protege as páginas: sem login, manda para o cadastro
    ├── cadastro.js   → Cadastro, login, força da senha
    ├── dados.js      → "Banco de dados": produtos, fotos, cupons, tamanhos
    ├── main.js       → Código usado em TODAS as páginas (menu, carrinho, login...)
    ├── inicio.js     → Só da página inicial
    ├── sobre.js      → Só da página Sobre
    ├── cardapio.js   → Só do Cardápio
    ├── galeria.js    → Só da Galeria
    └── contato.js    → Só do Contato
```

**Por que separar assim?** Cada página carrega o `main.js` (o que é comum a todas) e o JS dela própria. Fica mais organizado e mais fácil de achar o que procura.

---

## Recursos presentes em TODAS as páginas (`main.js`)

| Recurso | Como funciona |
|---|---|
| **Tela de carregamento** | Um anel girando (feito só com CSS) aparece até o evento `load` disparar e depois some com `opacity`. |
| **Menu hambúrguer** ☰ | Abaixo de 700px de largura o menu vira uma lista que abre com `max-height` animado. |
| **Link ativo** | O JS lê o nome do arquivo em `location.pathname` e destaca o link da página atual. |
| **Barra de progresso de leitura** | A linha dourada no topo mostra quanto da página você já rolou: `scrollY / (altura total - altura da janela) * 100`. |
| **Animação ao rolar** | Os elementos com a classe `revelar` aparecem quando entram na tela, usando `IntersectionObserver`. |
| **Voltar ao topo** ↑ | Aparece depois de 400px de rolagem e usa `scrollTo({ behavior: "smooth" })`. |
| **Aviso de cookies** | Aparece só na primeira visita e some para sempre ao clicar em "Entendi" (fica salvo no `localStorage`). |
| **Carrinho de compras** | A gaveta lateral é **criada pelo JavaScript** (`insertAdjacentHTML`), então o HTML não precisa ser repetido nas 5 páginas. Tem cupom de desconto, opção de entrega, subtotal/desconto/total e confirmação do pedido. |
| **Toast** | Notificação flutuante, em verde para sucesso e vermelho para erro. |

---

## Tela de cadastro e login (`cadastro.html` + `auth.js` + `cadastro.js`)

- **É a primeira tela do site.** O `auth.js` é carregado no `<head>` de todas as páginas, antes do conteúdo aparecer. Se ninguém estiver logado, ele usa `location.replace("cadastro.html")` para mandar a pessoa ao cadastro. Se já estiver logada e abrir o cadastro, ela vai direto para o início.
- **Layout dividido:** foto da cafeteria à esquerda e formulário à direita. No celular, a foto some e fica só o formulário.
- **Abas "Criar conta" / "Entrar"**, com links para trocar entre elas.
- **Cadastro com validação:** nome e sobrenome, e-mail válido e **não repetido**, senha forte e confirmação igual à senha.
- **Medidor de força da senha:** uma barra colorida (vermelho → verde) que cresce conforme a senha cumpre os requisitos (8 caracteres, letra maiúscula, número e símbolo). Cada requisito é testado com uma expressão regular.
- **Botão "Mostrar"** para mostrar/ocultar a senha (troca `type="password"` por `type="text"`).
- **Login:** confere o e-mail e a senha salvos. Se errar, o formulário "treme" (animação CSS).
- **"Lembrar de mim":** marcado, salva a sessão no `localStorage` (continua logado). Desmarcado, salva no `sessionStorage` (sai ao fechar o navegador).
- **Depois de entrar:** aparece o nome e as iniciais no topo, com um menu e o botão **Sair**, e uma mensagem de boas-vindas. O formulário de contato já vem com nome e e-mail preenchidos.
- **Simulação:** os usuários ficam no `localStorage` do navegador. Em um site real, a senha iria para um servidor e seria guardada criptografada. Isso está explicado nos comentários do código.

## Fotos reais

- **Sem emojis no site:** o ícone do carrinho e o coração dos favoritos são desenhados em **SVG** direto no código.
- Fotos gratuitas do **Unsplash** nos produtos, na galeria, no banner principal, e nos banners das páginas.
- Em `dados.js` cada produto tem o campo `foto` (o código da foto). A função `urlFoto(codigo, largura)` monta o endereço pedindo o tamanho certo, para carregar rápido.
- Cada `<img>` usa `loading="lazy"` (só carrega quando aparece na tela) e `onerror="this.remove()"`: se a foto falhar, ela some e fica só a cor de fundo do card.
- `object-fit: cover` faz a foto preencher o espaço sem distorcer, e no hover ela dá um zoom suave.

## Página por página

### 1. Início (`index.html` + `inicio.js`)
- **Efeito máquina de escrever:** digita e apaga 4 frases em ciclo com `setTimeout` e `substring()`.
- **Banner principal em tela cheia:** foto da cafeteria ao fundo com uma película escura por cima (`linear-gradient` + `url()` no `background-image`), foto redonda do cappuccino e os botões que levam ao Cardápio e ao Sobre.

### 2. Sobre (`sobre.html` + `sobre.js`)
- Introdução com uma lista de check personalizada (`::before`).
- **Gráfico de barras** da origem dos grãos: as barras crescem quando aparecem na tela (o JS muda a `width` e a `transition` do CSS faz a animação).
- **FAQ em acordeão** (só uma resposta aberta por vez, altura animada com `scrollHeight`) + **campo de busca** que filtra as perguntas.

### 3. Cardápio (`cardapio.html` + `cardapio.js` + `dados.js`)
- **18 produtos** gerados automaticamente a partir de um array de objetos.
- **Filtro por categoria**, **busca** (ignora acentos: "cafe" encontra "café", usando `normalize("NFD")`), **ordenação** (preço, nome, avaliação) e **favoritos** (coração). Os filtros funcionam juntos.
- **Favoritos ** salvos no `localStorage`.
- **Selos** "Mais vendido", "Novidade" e "Vegano", e **estrelas** de avaliação geradas por `gerarEstrelas()`.
- **Modal de detalhes:** ingredientes, calorias, **tamanho P/M/G** (o preço muda), quantidade de 1 a 20, observação para o barista e um botão que mostra o preço total na hora.
- **Parâmetro na URL:** `cardapio.html?categoria=doces` já abre filtrado (útil para links diretos), usando `URLSearchParams`.
- Contador "X produtos encontrados" e mensagem quando nada é encontrado.

### 4. Galeria (`galeria.html` + `galeria.js`)
- **14 fotos** geradas a partir de um array, em um **grid irregular** (fotos `larga` e `alta` com `grid-column: span 2` / `grid-row: span 2`).
- **Filtro por categoria** com animação de transição.
- **Lightbox:** amplia a foto, mostra o contador "2 de 14", navega pelas **setas do teclado** (← → Esc), pelos botões ou **deslizando o dedo**.

### 5. Contato (`contato.html` + `contato.js`)
- **Horário de funcionamento** gerado por JS, com o **dia de hoje destacado** e um **selo dinâmico**: aberto, fecha em X minutos, fechado (e quando abre).
- **Formulário completo com validação:**
  - nome e sobrenome, e-mail (regex), telefone, assunto, mensagem (mínimo de 10 caracteres) e checkbox de consentimento;
  - cada regra é uma função dentro do objeto `regras`;
  - valida ao sair do campo (`blur`) e, depois do primeiro erro, enquanto você digita;
  - ao enviar com erro, **leva o cursor até o primeiro campo errado**.
- **Máscara de telefone** automática: `(11) 98765-4321` para celular e `(11) 4002-8922` para fixo.
- **Contador de caracteres** que fica vermelho perto do limite.
- **Campos condicionais:** escolhendo "Reserva para grupo", aparecem data (não deixa escolher data passada), horário e nº de pessoas.
- **Preferência de resposta** (radio buttons).
- **Envio simulado:** o botão mostra "Enviando..." com um spinner por 1,5s (imitando um servidor).
- **Histórico de mensagens enviadas** salvo no `localStorage`, com botão para excluir.

---

## Conceitos utilizados (para citar na apresentação)

### HTML
- Tags semânticas: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `fieldset`, `legend`
- Formulários: `input` (text, email, tel, date, number, radio, checkbox, search), `select`, `textarea`, `label for`
- Atributos `data-*` para guardar informação no HTML (ex: `data-categoria`, `data-valor`)
- Acessibilidade: `aria-label`, `aria-expanded`, `aria-current`, `aria-invalid`, `role`, link "pular para o conteúdo"
- SEO: `meta description` e `lang="pt-BR"`

### CSS
- **Variáveis CSS** (`:root`) usadas no site todo
- **Flexbox** e **CSS Grid** (incluindo `repeat(auto-fill, minmax())` e `span`)
- `position` sticky / fixed / absolute
- Pseudo-elementos `::before` / `::after` e pseudo-classes `:hover`, `:focus-visible`, `:checked`, `:nth-child`
- `transition`, `transform` (translate, scale, rotate, **3D**) e `@keyframes` (flutuar, piscar, girar, pular)
- Componentes feitos só com CSS: botões de tamanho com radio escondido
- **Media queries** em 1000px, 900px e 700px (responsivo)
- `prefers-reduced-motion` (desliga animações para quem pede isso no sistema)

### JavaScript
- Manipulação do DOM: `querySelector`, `classList`, `innerHTML`, `textContent`, `createElement`, `insertAdjacentHTML`
- Eventos: `click`, `input`, `change`, `submit`, `blur`, `scroll`, `keydown`, `touchstart`, `DOMContentLoaded`, `load`
- **Arrays de objetos** e métodos `map`, `filter`, `reduce`, `find`, `sort`, `every`, `includes`, `slice`
- Template strings, desestruturação (`const { total } = ...`), spread (`[...lista]`, `{ ...produto }`)
- **localStorage, sessionStorage + JSON** (`stringify` / `parse`): carrinho, favoritos, cupom, mensagens
- Timers: `setTimeout`
- **Expressões regulares** (e-mail e telefone)
- `Date` (horário de funcionamento, data das mensagens), `toLocaleString("pt-BR")` para moeda
- APIs do navegador: `IntersectionObserver`, `URLSearchParams`
- Segurança: a função `escaparHTML()` impede que o texto digitado vire código (proteção contra XSS)

---

## Roteiro para demonstrar na apresentação

1. Abra o `index.html`: o site manda para o **cadastro**. Tente uma senha fraca (veja o medidor), crie a conta e veja seu nome no topo. Depois clique em **Sair** e entre de novo pela aba **Entrar** (erre a senha uma vez para ver a animação).
2. Abra o **Início**: mostre o carregamento e o texto digitando sozinho.
3. No **Cardápio**, adicione um item ao carrinho e veja o contador do carrinho pular.
4. Vá ao **Cardápio**: busque "cafe", ordene por menor preço, favorite um item (coração).
5. Abra os detalhes do **Cappuccino**, escolha G, quantidade 2 e escreva uma observação.
6. Abra o **carrinho**, aplique o cupom **GRAO10**, escolha entrega e finalize o pedido.
7. Na **Galeria**, filtre por "Comidas" e abra uma foto. Navegue com as setas do teclado.
8. No **Sobre**, veja as barras de origem dos grãos e busque "wi-fi" no FAQ.
9. No **Contato**, clique em enviar vazio (aparecem os erros), escolha "Reserva" (aparecem os campos extras), preencha tudo e envie. A mensagem aparece no histórico.
10. Diminua a janela do navegador (ou abra no celular) para mostrar o **menu hambúrguer** e o layout responsivo.

**Cupons para testar:** `GRAO10` (10%), `ESTUDANTE` (15%), `PRIMEIRA` (R$ 5).

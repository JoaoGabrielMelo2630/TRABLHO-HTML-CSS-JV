/* =========================================================
   GRÃO DOURADO — Dados do site
   Funciona como um "banco de dados" simples: um array de
   objetos com todos os produtos. É usado no Início (destaques)
   e no Cardápio. Para adicionar um produto, basta incluir um
   novo objeto aqui — o HTML é gerado automaticamente.
   ========================================================= */

const CATEGORIAS = {
  cafes:    "Cafés",
  bebidas:  "Bebidas",
  salgados: "Salgados",
  doces:    "Doces"
};

// Selos que aparecem no canto do card
const SELOS = {
  popular: { texto: "Mais vendido", classe: "selo-popular" },
  novo:    { texto: "Novidade",     classe: "selo-novo" },
  vegano:  { texto: "Vegano",       classe: "selo-vegano" }
};

// Acréscimo no preço de acordo com o tamanho da bebida
const TAMANHOS = {
  P: { nome: "Pequeno (200ml)", acrescimo: 0 },
  M: { nome: "Médio (300ml)",   acrescimo: 2 },
  G: { nome: "Grande (400ml)",  acrescimo: 4 }
};

// Cupons válidos no carrinho
const CUPONS = {
  GRAO10:   { tipo: "porcentagem", valor: 10, descricao: "10% de desconto" },
  PRIMEIRA: { tipo: "fixo",        valor: 5,  descricao: "R$ 5,00 de desconto" },
  ESTUDANTE:{ tipo: "porcentagem", valor: 15, descricao: "15% para estudantes" }
};

const TAXA_ENTREGA = 6;

/* ---------- FOTOS ----------
   As fotos são do Unsplash (unsplash.com), gratuitas para uso.
   Guardamos só o código de cada foto e montamos o endereço aqui,
   pedindo o tamanho certo (w = largura) para carregar rápido.
   Precisa de internet. Se a foto não carregar, aparece um fundo neutro no lugar. */
function urlFoto(codigo, largura = 600) {
  return `https://images.unsplash.com/${codigo}?auto=format&fit=crop&w=${largura}&q=75`;
}

// Fotos usadas em outras partes do site (banner, galeria, sobre...)
const FOTOS = {
  interior:   "photo-1554118811-1e0d58224f24",
  salao:      "photo-1521917441209-e886f0404a7b",
  estudos:    "photo-1456406644174-8ddd4cd52a06",
  graos:      "photo-1743356629215-abb470447e71",
  torra:      "photo-1741994042855-48baa6a524b6",
  fazenda:    "photo-1762004456257-168deb95c8ce",
  barista:    "photo-1766250343186-847200b11032",
  musica:     "photo-1587052655186-7c9fde446293",
  livro:      "photo-1696231989404-4a534a19c1e7",
  maquina:    "photo-1607273177127-47ec33b5be3f",
  coado:      "photo-1504469089401-14f795f6ddee",
  cappuccino: "photo-1673568438355-6136a2034d4b"
};

const produtos = [
  // ----- CAFÉS -----
  { id: 1, foto: "photo-1428550443830-190057dc8098", nome: "Espresso", categoria: "cafes", preco: 6.5,  nota: 4.9, avaliacoes: 312,
    selo: "popular", temTamanho: false, calorias: 5,
    descricao: "Curto, intenso e encorpado. Extraído em 25 segundos.",
    ingredientes: ["Café especial 100% arábica", "Água filtrada"] },

  { id: 2, foto: "photo-1673568438355-6136a2034d4b", nome: "Cappuccino", categoria: "cafes", preco: 11,  nota: 4.8, avaliacoes: 256,
    selo: "popular", temTamanho: true, calorias: 120,
    descricao: "Espresso, leite vaporizado, espuma cremosa e canela.",
    ingredientes: ["Espresso duplo", "Leite integral vaporizado", "Canela em pó"] },

  { id: 3, foto: "photo-1485808191679-5f86510681a2", nome: "Latte Caramelo", categoria: "cafes", preco: 13.5,  nota: 4.7, avaliacoes: 198,
    selo: null, temTamanho: true, calorias: 210,
    descricao: "Leite cremoso, espresso e calda de caramelo salgado.",
    ingredientes: ["Espresso", "Leite vaporizado", "Calda de caramelo artesanal", "Flor de sal"] },

  { id: 4, foto: "photo-1504469089401-14f795f6ddee", nome: "Coado na Hora", categoria: "cafes", preco: 8,  nota: 4.6, avaliacoes: 140,
    selo: null, temTamanho: true, calorias: 5,
    descricao: "Método V60 com o grão do dia. Notas de chocolate e frutas.",
    ingredientes: ["Café do dia moído na hora", "Água a 93°C"] },

  { id: 5, foto: "photo-1750520335073-2535aa280946", nome: "Mocha", categoria: "cafes", preco: 14,  nota: 4.7, avaliacoes: 121,
    selo: "novo", temTamanho: true, calorias: 260,
    descricao: "Espresso com chocolate meio amargo e chantilly.",
    ingredientes: ["Espresso", "Chocolate 50%", "Leite", "Chantilly"] },

  // ----- BEBIDAS -----
  { id: 6, foto: "photo-1767471716700-2b3aa77b1ab6", nome: "Café Gelado", categoria: "bebidas", preco: 14,  nota: 4.8, avaliacoes: 230,
    selo: "popular", temTamanho: true, calorias: 150,
    descricao: "Cold brew extraído por 18 horas, com gelo e leite.",
    ingredientes: ["Cold brew", "Gelo", "Leite", "Xarope de baunilha (opcional)"] },

  { id: 7, foto: "photo-1574372623190-ee1fa4423f7f", nome: "Chocolate Quente", categoria: "bebidas", preco: 12,  nota: 4.6, avaliacoes: 98,
    selo: null, temTamanho: true, calorias: 280,
    descricao: "Chocolate 50% cacau, cremoso, com chantilly.",
    ingredientes: ["Chocolate 50% cacau", "Leite integral", "Chantilly"] },

  { id: 8, foto: "photo-1650316710473-8b2ecdcd2b10", nome: "Suco Natural", categoria: "bebidas", preco: 10,  nota: 4.5, avaliacoes: 75,
    selo: "vegano", temTamanho: true, calorias: 110,
    descricao: "Laranja espremida na hora, sem açúcar.",
    ingredientes: ["Laranja pera"] },

  { id: 9, foto: "photo-1594975631657-904804a44e4d", nome: "Chá Gelado de Hibisco", categoria: "bebidas", preco: 9.5,  nota: 4.4, avaliacoes: 52,
    selo: "vegano", temTamanho: true, calorias: 40,
    descricao: "Hibisco, limão e um toque de hortelã.",
    ingredientes: ["Hibisco", "Limão", "Hortelã", "Gelo"] },

  // ----- SALGADOS -----
  { id: 10, foto: "photo-1692742249337-3bf05e2b1ed7", nome: "Croissant", categoria: "salgados", preco: 9.5,  nota: 4.8, avaliacoes: 187,
    selo: "popular", temTamanho: false, calorias: 230,
    descricao: "Massa folhada amanteigada, assada no dia.",
    ingredientes: ["Farinha de trigo", "Manteiga francesa", "Fermento natural"] },

  { id: 11, foto: "photo-1567891026259-c133718572a4", nome: "Pão de Queijo", categoria: "salgados", preco: 7,  nota: 4.9, avaliacoes: 340,
    selo: "popular", temTamanho: false, calorias: 260,
    descricao: "Porção com 6 unidades, receita mineira tradicional.",
    ingredientes: ["Polvilho", "Queijo canastra", "Ovos", "Leite"] },

  { id: 12, foto: "photo-1768257164310-5f53c8d83a4e", nome: "Sanduíche Natural", categoria: "salgados", preco: 16,  nota: 4.5, avaliacoes: 88,
    selo: null, temTamanho: false, calorias: 340,
    descricao: "Pão integral, frango desfiado, cenoura e requeijão.",
    ingredientes: ["Pão integral", "Frango", "Cenoura", "Requeijão", "Alface"] },

  { id: 13, foto: "photo-1456014673271-90b7fddf2eea", nome: "Quiche de Alho-Poró", categoria: "salgados", preco: 15,  nota: 4.6, avaliacoes: 64,
    selo: "novo", temTamanho: false, calorias: 310,
    descricao: "Massa crocante e recheio cremoso de alho-poró.",
    ingredientes: ["Massa podre", "Alho-poró", "Creme de leite", "Ovos", "Queijo"] },

  // ----- DOCES -----
  { id: 14, foto: "photo-1607269832078-1a3bd22a306d", nome: "Bolo de Cenoura", categoria: "doces", preco: 9,  nota: 4.8, avaliacoes: 205,
    selo: null, temTamanho: false, calorias: 350,
    descricao: "Fatia generosa com cobertura de chocolate.",
    ingredientes: ["Cenoura", "Farinha", "Ovos", "Cobertura de chocolate"] },

  { id: 15, foto: "photo-1589431683447-2c0abd8d99e2", nome: "Cookie Gigante", categoria: "doces", preco: 8.5,  nota: 4.7, avaliacoes: 160,
    selo: null, temTamanho: false, calorias: 390,
    descricao: "Crocante por fora, macio por dentro, com gotas de chocolate belga.",
    ingredientes: ["Farinha", "Manteiga", "Açúcar mascavo", "Chocolate belga"] },

  { id: 16, foto: "photo-1610143560214-73f246c30093", nome: "Brownie Vegano", categoria: "doces", preco: 10,  nota: 4.5, avaliacoes: 71,
    selo: "vegano", temTamanho: false, calorias: 320,
    descricao: "Úmido, sem leite e sem ovos, com nozes.",
    ingredientes: ["Cacau", "Farinha", "Óleo de coco", "Nozes", "Açúcar demerara"] },

  { id: 17, foto: "photo-1533137015-38dbe301e281", nome: "Donut", categoria: "doces", preco: 7.5,  nota: 4.4, avaliacoes: 93,
    selo: null, temTamanho: false, calorias: 300,
    descricao: "Massa fofinha com cobertura de morango e granulado.",
    ingredientes: ["Massa brioche", "Cobertura de morango", "Granulado"] },

  { id: 18, foto: "photo-1730988479310-cddfd20d564c", nome: "Cheesecake de Frutas Vermelhas", categoria: "doces", preco: 13,  nota: 4.9, avaliacoes: 110,
    selo: "novo", temTamanho: false, calorias: 410,
    descricao: "Base de biscoito, creme de cream cheese e calda de frutas vermelhas.",
    ingredientes: ["Biscoito", "Cream cheese", "Frutas vermelhas"] }
];

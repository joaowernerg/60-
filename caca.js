const PALAVRAS_BASE = [
  "AGUA",
  "FRUTA",
  "SONO",
  "EXERCICIO",
  "CAMINHADA",
  "SAUDE",
  "DESCANSO",
  "ENERGIA"
];

const GRID_SIZE = 10;

const DIRECOES = [
  [0, 1],   // direita
  [1, 0],   // baixo
  [1, 1],   // diagonal
  [0, -1],  // esquerda
  [-1, 0],  // cima
  [-1, -1], // diagonal inversa
  [1, -1],  // diagonal baixo-esquerda
  [-1, 1]   // diagonal cima-direita
];

const gridEl = document.getElementById("grid");
const listaEl = document.getElementById("lista");
const foundEl = document.getElementById("found");
const totalEl = document.getElementById("total");
const tempoEl = document.getElementById("tempo");
const btnNovo = document.getElementById("btn-novo");
const btnDica = document.getElementById("btn-dica");
const winDialog = document.getElementById("win");
const btnWin = document.getElementById("btn-win");

let matriz = [];
let palavras = [];
let palavrasEncontradas = new Set();
let posicoesPalavras = new Map();

let selecionando = false;
let selecao = [];
let timer = null;
let segundos = 0;

function iniciarTimer() {
  pararTimer();
  segundos = 0;
  atualizarTempo();

  timer = setInterval(() => {
    segundos++;
    atualizarTempo();
  }, 1000);
}

function pararTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function atualizarTempo() {
  const min = String(Math.floor(segundos / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  tempoEl.textContent = `${min}:${seg}`;
}

function criarMatrizVazia() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "")
  );
}

function embaralhar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function podeColocarPalavra(matriz, palavra, linha, col, dx, dy) {
  for (let i = 0; i < palavra.length; i++) {
    const r = linha + dx * i;
    const c = col + dy * i;

    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
      return false;
    }

    if (matriz[r][c] !== "" && matriz[r][c] !== palavra[i]) {
      return false;
    }
  }

  return true;
}

function colocarPalavra(matriz, palavra) {
  const tentativasMax = 200;

  for (let tentativa = 0; tentativa < tentativasMax; tentativa++) {
    const [dx, dy] = DIRECOES[Math.floor(Math.random() * DIRECOES.length)];
    const linha = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (!podeColocarPalavra(matriz, palavra, linha, col, dx, dy)) {
      continue;
    }

    const posicoes = [];

    for (let i = 0; i < palavra.length; i++) {
      const r = linha + dx * i;
      const c = col + dy * i;
      matriz[r][c] = palavra[i];
      posicoes.push([r, c]);
    }

    posicoesPalavras.set(palavra, posicoes);
    return true;
  }

  return false;
}

function preencherRestante(matriz) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (matriz[r][c] === "") {
        matriz[r][c] = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }
}

function renderLista() {
  listaEl.innerHTML = "";
  palavras.forEach((palavra) => {
    const li = document.createElement("li");
    li.textContent = palavra;

    if (palavrasEncontradas.has(palavra)) {
      li.classList.add("done");
    }

    listaEl.appendChild(li);
  });

  foundEl.textContent = palavrasEncontradas.size;
  totalEl.textContent = palavras.length;
}

function renderGrid() {
  gridEl.innerHTML = "";

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.textContent = matriz[r][c];
      btn.dataset.row = r;
      btn.dataset.col = c;

      btn.addEventListener("pointerdown", iniciarSelecao);
      btn.addEventListener("pointerenter", continuarSelecao);
      btn.addEventListener("pointerup", finalizarSelecao);

      gridEl.appendChild(btn);
    }
  }
}

function limparSelecaoVisual() {
  document.querySelectorAll(".cell.active").forEach((el) => {
    el.classList.remove("active");
  });
}

function marcarSelecaoVisual() {
  limparSelecaoVisual();

  selecao.forEach((item) => {
    item.el.classList.add("active");
  });
}

function iniciarSelecao(e) {
  selecionando = true;
  limparSelecaoVisual();

  selecao = [{
    row: Number(e.currentTarget.dataset.row),
    col: Number(e.currentTarget.dataset.col),
    letter: e.currentTarget.textContent,
    el: e.currentTarget
  }];

  marcarSelecaoVisual();
}

function continuarSelecao(e) {
  if (!selecionando) return;

  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);

  const jaExiste = selecao.some((item) => item.row === row && item.col === col);
  if (jaExiste) return;

  selecao.push({
    row,
    col,
    letter: e.currentTarget.textContent,
    el: e.currentTarget
  });

  marcarSelecaoVisual();
}

function obterTextoSelecao() {
  return selecao.map((item) => item.letter).join("");
}

function marcarPalavraEncontrada(posicoes) {
  posicoes.forEach(([r, c]) => {
    const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (el) {
      el.classList.remove("active");
      el.classList.add("found");
    }
  });
}

function finalizarSelecao() {
  if (!selecionando) return;
  selecionando = false;

  const texto = obterTextoSelecao();
  const textoInvertido = texto.split("").reverse().join("");

  let palavraAchada = null;

  for (const palavra of palavras) {
    if (
      !palavrasEncontradas.has(palavra) &&
      (texto === palavra || textoInvertido === palavra)
    ) {
      palavraAchada = palavra;
      break;
    }
  }

  if (palavraAchada) {
    palavrasEncontradas.add(palavraAchada);
    marcarPalavraEncontrada(posicoesPalavras.get(palavraAchada));
    renderLista();

    if (palavrasEncontradas.size === palavras.length) {
      pararTimer();
      setTimeout(() => winDialog.showModal(), 200);
    }
  } else {
    setTimeout(() => {
      limparSelecaoVisual();
    }, 200);
  }

  selecao = [];
}

function mostrarDica() {
  const restantes = palavras.filter((p) => !palavrasEncontradas.has(p));
  if (restantes.length === 0) return;

  const palavra = restantes[0];
  const primeiraPos = posicoesPalavras.get(palavra)?.[0];
  if (!primeiraPos) return;

  const [r, c] = primeiraPos;
  const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);

  if (!el) return;

  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 800);
}

function novoJogo() {
  palavrasEncontradas.clear();
  posicoesPalavras.clear();

  palavras = embaralhar(PALAVRAS_BASE).slice(0, 6);
  matriz = criarMatrizVazia();

  for (const palavra of palavras) {
    colocarPalavra(matriz, palavra);
  }

  preencherRestante(matriz);
  renderLista();
  renderGrid();
  iniciarTimer();
}

btnNovo.addEventListener("click", novoJogo);
btnDica.addEventListener("click", mostrarDica);
btnWin.addEventListener("click", novoJogo);

document.addEventListener("pointerup", () => {
  if (selecionando) {
    finalizarSelecao();
  }
});

novoJogo();

/* ========= Config: 10 níveis ========= */
const LEVEL_PAIRS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

/* FRUTAS */
const EMOJIS = [
  "🍎", "🍏", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈",
  "🍒", "🍑", "🥭", "🍍", "🥥", "🫐", "🥝", "🍅", "🥑", "🍆", "🫒"
];

/* ========= Estado ========= */
let level = 0;
let deck = [];
let flipped = [];
let matches = 0;
let moves = 0;
let seconds = 0;
let ticking = null;
let lock = false;

/* ========= Helpers ========= */
const $ = (s) => document.querySelector(s);

const pad = (n) => String(n).padStart(2, "0");
const timeFmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ========= Elementos ========= */
const uiLevel = $("#uiLevel");
const uiTime = $("#uiTime");
const uiMoves = $("#uiMoves");
const board = $("#board");

const modal = $("#modal");
const modalStats = $("#modalStats");
const mAgain = $("#mAgain");
const mNext = $("#mNext");

/* ========= Início ========= */
document.addEventListener("DOMContentLoaded", () => {
  startLevel(0);

  window.addEventListener("resize", layoutToFit);
  window.addEventListener("orientationchange", () => {
    setTimeout(layoutToFit, 250);
  });

  $("#btnRestartTop")?.addEventListener("click", () => startLevel(level));
  $("#btnNext")?.addEventListener("click", () => {
    startLevel(Math.min(level + 1, LEVEL_PAIRS.length - 1));
  });
  $("#btnPrev")?.addEventListener("click", () => {
    startLevel(Math.max(level - 1, 0));
  });

  mAgain?.addEventListener("click", () => {
    closeModal();
    startLevel(level);
  });

  mNext?.addEventListener("click", () => {
    closeModal();
    const next = level === LEVEL_PAIRS.length - 1 ? 0 : level + 1;
    startLevel(next);
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});

/* ========= Modal ========= */
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

/* ========= Montagem do nível ========= */
function startLevel(i) {
  level = i;
  stopTimer();

  seconds = 0;
  moves = 0;
  matches = 0;
  lock = false;
  flipped = [];

  uiLevel.textContent = `${level + 1}/${LEVEL_PAIRS.length}`;
  uiTime.textContent = "00:00";
  uiMoves.textContent = "0";

  const pairs = LEVEL_PAIRS[level];
  const set = shuffle(EMOJIS).slice(0, pairs);
  deck = shuffle([...set, ...set]);

  board.innerHTML = "";

  deck.forEach((fruit) => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.type = "button";
    btn.setAttribute("data-v", fruit);
    btn.setAttribute("aria-label", "Carta do jogo");

    const front = document.createElement("div");
    front.className = "side front";
    front.textContent = "❓";

    const back = document.createElement("div");
    back.className = "side back";
    back.textContent = fruit;

    btn.append(front, back);
    btn.addEventListener("click", () => flip(btn));

    board.appendChild(btn);
  });

  layoutToFit();
  startTimer();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ========= Layout responsivo ========= */
function layoutToFit() {
  const n = deck.length;
  if (n === 0) return;

  const gap = parseFloat(getComputedStyle(board).gap) || 8;
  const wrap = board.parentElement;
  const W = wrap.clientWidth;

  const top = board.getBoundingClientRect().top;
  const controlsSpace = 20;
  const H = window.innerHeight - top - controlsSpace;

  let best = { size: 0, cols: 1, rows: n };

  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);

    const sizeW = (W - gap * (cols - 1)) / cols;
    const sizeH = (H - gap * (rows - 1)) / rows;
    const size = Math.floor(Math.min(sizeW, sizeH));

    if (size > best.size) {
      best = { size, cols, rows };
    }
  }

  const minSize = window.innerWidth < 480 ? 42 : 50;
  const finalSize = Math.max(best.size, minSize);

  board.style.setProperty("--cols", best.cols);
  board.style.setProperty("--card-size", `${finalSize}px`);
}

/* ========= Lógica do jogo ========= */
function flip(card) {
  if (lock) return;
  if (card.classList.contains("flip")) return;
  if (card.classList.contains("matched")) return;

  card.classList.add("flip");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    uiMoves.textContent = moves;
    lock = true;

    const [a, b] = flipped;
    const matched = a.dataset.v === b.dataset.v;

    setTimeout(() => {
      if (matched) {
        a.classList.add("matched");
        b.classList.add("matched");
        matches++;

        if (matches === LEVEL_PAIRS[level]) {
          win();
        }
      } else {
        a.classList.remove("flip");
        b.classList.remove("flip");
      }

      flipped = [];
      lock = false;
    }, 400);
  }
}

function win() {
  stopTimer();
  modalStats.textContent = `Tempo: ${timeFmt(seconds)} • Movimentos: ${moves}`;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

/* ========= Timer ========= */
function startTimer() {
  stopTimer();
  ticking = setInterval(() => {
    seconds++;
    uiTime.textContent = timeFmt(seconds);
  }, 1000);
}

function stopTimer() {
  if (ticking) {
    clearInterval(ticking);
    ticking = null;
  }
}
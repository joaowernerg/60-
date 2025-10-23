// ====== SELETORES ======
const grid = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const tentativasDisplay = document.getElementById('tentativas');
const tempoDisplay = document.getElementById('tempo');
const winMessage = document.getElementById('winMessage');
const winText = document.getElementById('winText');
const modoClassico = document.getElementById('modoClassico');
const modoFormas = document.getElementById('modoFormas');

// ====== VARIÁVEIS ======
let modoAtual = 'classico';
window.nivelAtual = 1;
let cardsArray = [];
let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let tentativas = 0;
let tempo = 0;
let timer;

// ====== ÍCONES ======
const iconesClassicos = [
  '🍎','🍇','🍋','🍓','🍉','🍌','🍒','🥝','🍍','🥥',
  '🥑','🥕','🍈','🍅','🍆','🥬','🌽','🥔','🧄','🥦'
];
const iconesFormas = [
  '🔺','🔵','🟢','🟣','🟠','⬛','⬜','⭐','💎','🌀',
  '💠','⚪','⚫','🔷','🔶','🧩','🟥','🟧','🟨','🟩'
];

// ====== EVENTOS ======
if (modoClassico && modoFormas) {
  modoClassico.addEventListener('click', () => {
    modoAtual = 'classico';
    modoClassico.classList.add('active');
    modoFormas.classList.remove('active');
  });
  modoFormas.addEventListener('click', () => {
    modoAtual = 'formas';
    modoFormas.classList.add('active');
    modoClassico.classList.remove('active');
  });
}

startBtn.addEventListener('click', () => startGame(1));
restartBtn.addEventListener('click', () => startGame(1));

// ====== INICIAR JOGO ======
function startGame(nivel = window.nivelAtual) {
  grid.innerHTML = '';
  winMessage.classList.add('hidden');
  matchedPairs = 0;
  tentativas = 0;
  tempo = 0;
  tentativasDisplay.textContent = 0;
  tempoDisplay.textContent = '0s';
  clearInterval(timer);
  timer = setInterval(() => {
    tempo++;
    tempoDisplay.textContent = `${tempo}s`;
  }, 1000);

  window.nivelAtual = nivel;
  let totalPairs = nivel + 1;
  const iconesUsados = modoAtual === 'classico' ? iconesClassicos : iconesFormas;
  const selecionados = iconesUsados.slice(0, totalPairs);
  cardsArray = shuffle([...selecionados, ...selecionados]);

  ajustarGrid(totalPairs);

  cardsArray.forEach(icon => {
    const card = createCard(icon);
    grid.appendChild(card);
  });

  tornarResponsivo();
}

// ====== CRIAR CARTAS ======
function createCard(icon) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">❓</div>
      <div class="card-back">${icon}</div>
    </div>`;
  card.addEventListener('click', flipCard);
  return card;
}

// ====== VIRAR CARTA ======
function flipCard() {
  if (lockBoard || this.classList.contains('flip')) return;
  this.classList.add('flip');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  tentativas++;
  tentativasDisplay.textContent = tentativas;
  checkMatch(this);
}

// ====== CHECAR PAR ======
function checkMatch(secondCard) {
  const firstIcon = firstCard.querySelector('.card-back').textContent;
  const secondIcon = secondCard.querySelector('.card-back').textContent;

  if (firstIcon === secondIcon) {
    matchedPairs++;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetTurn();

    if (matchedPairs === cardsArray.length / 2) {
      clearInterval(timer);
      setTimeout(() => nextLevel(), 800);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetTurn();
    }, 800);
  }
}

// ====== PRÓXIMO NÍVEL ======
function nextLevel() {
  if (window.nivelAtual < 10) {
    winMessage.classList.remove('hidden');
    winText.textContent = `🎯 Você completou o Nível ${window.nivelAtual} em ${tentativas} tentativas e ${tempo}s!`;
    setTimeout(() => startGame(window.nivelAtual + 1), 2000);
  } else {
    showWinFinal();
  }
}

// ====== VITÓRIA FINAL ======
function showWinFinal() {
  winMessage.classList.remove('hidden');
  winText.textContent = `🏆 Parabéns! Você completou todos os 10 níveis do modo ${modoAtual}! 🎉 Você é o melhor!`;
}

// ====== RESET ======
function resetTurn() {
  [firstCard, lockBoard] = [null, false];
}

// ====== EMBARALHAR ======
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ====== AJUSTE DE GRID ======
function ajustarGrid(totalPairs) {
  if (totalPairs <= 3) grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  else if (totalPairs <= 6) grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  else if (totalPairs <= 9) grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
  else grid.style.gridTemplateColumns = 'repeat(6, 1fr)';
}

// ====== RESPONSIVIDADE ======
function tornarResponsivo() {
  const ajustarTamanho = () => {
    const largura = window.innerWidth;
    if (largura < 500) {
      grid.style.gap = '10px';
      document.querySelectorAll('.card').forEach(card => {
        card.style.height = '80px';
      });
    } else if (largura < 900) {
      grid.style.gap = '12px';
      document.querySelectorAll('.card').forEach(card => {
        card.style.height = '100px';
      });
    } else {
      grid.style.gap = '15px';
      document.querySelectorAll('.card').forEach(card => {
        card.style.height = '120px';
      });
    }
  };
  ajustarTamanho();
  window.addEventListener('resize', ajustarTamanho);
}

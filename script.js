// ===== Menu mobile =====
const menuBtn = document.getElementById('menuBtn');
const topNav = document.getElementById('topNav');

menuBtn.addEventListener('click', () => {
  const open = topNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// ===== Data de hoje e ano =====
const dataHoje = document.getElementById('dataHoje');
const anoAtual = document.getElementById('anoAtual');

const agora = new Date(); // usa o fuso do dispositivo
const nomeMes = agora.toLocaleDateString('pt-BR', { month: 'long' });
const dia = String(agora.getDate()).padStart(2, '0');
const ano = agora.getFullYear();
dataHoje.textContent = `${dia} de ${nomeMes} de ${ano}`;
anoAtual.textContent = ano;

// ===== Busca simples por seção =====
const buscaForm = document.getElementById('buscaForm');
const buscaInput = document.getElementById('busca');

const mapAlvos = {
  'noticia': '#noticias',
  'notícias': '#noticias',
  'noticias': '#noticias',
  'jogo': '#jogos',
  'jogos': '#jogos',
  'vídeo': '#videos',
  'video': '#videos',
  'vídeos': '#videos',
  'videos': '#videos',
  'dica': '#dicas',
  'dicas': '#dicas'
};

buscaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const termo = (buscaInput.value || '').toLowerCase().trim();
  let destino = null;

  for (const chave in mapAlvos) {
    if (termo.includes(chave)) {
      destino = mapAlvos[chave];
      break;
    }
  }

  if (!destino) destino = '#noticias'; // fallback
  document.querySelector(destino)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

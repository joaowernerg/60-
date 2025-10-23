// =====================================================
// Vida Saudável 60+ • funcionalidades do artigo
// =====================================================

// Helpers
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// Data de hoje (pt-BR) na linha de edição
(function setToday(){
  const el = $('#today');
  if (!el) return;
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  const text = now.toLocaleDateString('pt-BR', opts);
  el.textContent = text.charAt(0).toUpperCase() + text.slice(1);
})();

// Ano no rodapé
(function setYear(){
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Menu mobile
(function mobileMenu(){
  const btn = $('#menuBtn');
  const nav = $('#nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
  nav.addEventListener('click', e => {
    if (e.target.matches('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });
})();

// Botão Voltar (histórico)
(function backButton(){
  const btn = $('#goBackBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (history.length > 1) history.back(); else window.location.href = 'index.html';
  });
})();

// Filtro de referências
(function refFilter(){
  const input = $('#refSearch');
  const items = $$('#refList > li');
  if (!input || !items.length) return;
  input.addEventListener('input', () => {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    items.forEach(li => {
      const txt = li.textContent.toLowerCase();
      const ok = terms.every(t => txt.includes(t));
      li.style.display = ok ? '' : 'none';
    });
  });
})();

// Lightbox de vídeo (YouTube)
(function lightbox(){
  const lb = $('#lightbox');
  if (!lb) return;
  const player = $('.lightbox-player', lb);
  const closeBtn = $('#lbClose', lb);
  const openers = $$('.open-lightbox');

  function openWith(src){
    document.body.classList.add('no-scroll');
    lb.setAttribute('aria-hidden', 'false');
    player.innerHTML = `<iframe src="${src}" title="Player de vídeo" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen style="width:100%;height:100%;border:0"></iframe>`;
    closeBtn.focus({ preventScroll: true });
  }
  function close(){
    document.body.classList.remove('no-scroll');
    lb.setAttribute('aria-hidden', 'true');
    player.innerHTML = '';
  }

  openers.forEach(opener => {
    opener.addEventListener('click', e => {
      e.preventDefault();
      const yt = opener.getAttribute('data-yt');
      if (yt) openWith(`https://www.youtube.com/embed/${yt}?autoplay=1&modestbranding=1&rel=0`);
    });
  });

  $('.lightbox-backdrop', lb).addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && lb.getAttribute('aria-hidden') === 'false') close(); });
})();

// Modo cinema (dá foco nos vídeos)
(function cinema(){
  const btn = $('#btnCinema');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const active = document.body.classList.toggle('is-cinema');
    btn.setAttribute('aria-pressed', String(active));
    if (active) window.scrollTo({ top: $('#videos').offsetTop - 20, behavior: 'smooth' });
  });
})();

"use strict";

/* ============================
   Helpers
   ============================ */
const $id = (s) => document.getElementById(s);
const $$  = (s, root = document) => Array.from(root.querySelectorAll(s));

/* ============================
   Ano (rodapé) + Data por extenso (topo)
   ============================ */
(() => {
  const yearEl  = $id("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const todayEl = $id("today");
  if (todayEl) {
    const dt  = new Date();
    const fmt = dt.toLocaleDateString("pt-BR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    todayEl.textContent = fmt.charAt(0).toUpperCase() + fmt.slice(1);
  }
})();

/* ============================
   Menu mobile (suporta #siteNav ou #nav)
   ============================ */
(() => {
  const menuBtn = $id("menuBtn");
  const siteNav = $id("siteNav") || $id("nav");
  if (!menuBtn || !siteNav) return;

  menuBtn.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

/* ============================
   Modo cinema para seção de vídeos (se existir)
   ============================ */
(() => {
  const videosWrap = document.querySelector(".videos-wrap");
  const btnCinema  = $id("btnCinema");
  if (!videosWrap || !btnCinema) return;

  btnCinema.addEventListener("click", () => {
    const on = videosWrap.classList.toggle("cinema");
    btnCinema.setAttribute("aria-pressed", on ? "true" : "false");
  });
})();

/* ============================
   Lightbox de vídeo (YouTube) — abre apenas para botões com data-yt
   ============================ */
(() => {
  const lb       = $id("lightbox");
  const lbClose  = $id("lbClose");
  const lbPlayer = document.querySelector(".lightbox-player");
  if (!lb || !lbPlayer) return;

  const openLightbox = (ytId) => {
    if (!ytId) return;
    const src = `https://www.youtube.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0&cc_load_policy=1&color=white`;
    lbPlayer.innerHTML = `<iframe src="${src}" title="Player em destaque"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbPlayer.innerHTML = "";
  };

  // Abrir via botões
  $$(".open-lightbox[data-yt]").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn.dataset.yt));
  });

  // Fechar (botão, backdrop, ESC)
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => {
    if (e.target.classList.contains("lightbox-backdrop")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox();
  });
})();

/* ============================
   Filtro de referências (se existir)
   ============================ */
(() => {
  const refSearch = $id("refSearch");
  const refList   = $id("refList");
  if (!refSearch || !refList) return;

  refSearch.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$("#refList > li").forEach((li) => {
      li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
})();

/* ============================
   Voltar ao topo (se existir)
   ============================ */
(() => {
  const backToTop = $id("backToTop");
  if (!backToTop) return;

  const THRESHOLD = 200;
  const toggleBackToTop = () => {
    backToTop.classList.toggle("show", window.scrollY > THRESHOLD);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ============================
   Botões “← Voltar” (histórico) — suporta .goBackBtn e #goBackBtn
   ============================ */
(() => {
  const backButtons = $$(".goBackBtn, #goBackBtn");
  if (!backButtons.length) return;

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const hasHistory = window.history.length > 1;
      const ref = document.referrer || "";
      let sameOrigin = false;
      try { sameOrigin = ref && new URL(ref).origin === location.origin; } catch {}

      if (hasHistory && sameOrigin) {
        history.back();
      } else {
        location.href = "index.html"; // fallback para home
      }
    });
  });
})();
// Ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Máscara simples de telefone (ex.: (11) 90000-0000)
const tel = document.getElementById('whats');
tel?.addEventListener('input', () => {
  let v = tel.value.replace(/\D/g,'').slice(0,11);
  if (v.length > 10) {
    tel.value = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (v.length > 6) {
    tel.value = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (v.length > 2) {
    tel.value = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  } else {
    tel.value = v.replace(/(\d*)/, '($1');
  }
});

// Geolocalização
const btnGeo = document.getElementById('btnGeo');
const lat = document.getElementById('lat');
const lng = document.getElementById('lng');

btnGeo?.addEventListener('click', () => {
  if(!navigator.geolocation){alert('Geolocalização não suportada.');return;}
  btnGeo.disabled = true; btnGeo.textContent = 'Localizando…';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (lat) lat.value = pos.coords.latitude.toFixed(6);
      if (lng) lng.value = pos.coords.longitude.toFixed(6);
      btnGeo.textContent = '📍 Localização obtida';
      btnGeo.disabled = false;
    },
    () => {
      alert('Não foi possível obter sua localização.');
      btnGeo.textContent = '📍 Usar minha localização';
      btnGeo.disabled = false;
    },
    { enableHighAccuracy:true, timeout:12000 }
  );
});

// Monta mensagem de denúncia
function montarMensagem() {
  const v = id => (document.getElementById(id)?.value || '').trim();
  const ck = id => document.getElementById(id)?.checked;

  const obrig = [];
  if (!v('tipo')) obrig.push('Tipo');
  if (!v('endereco')) obrig.push('Endereço');
  if (!v('descricao')) obrig.push('Descrição');
  if (!ck('privacidade')) obrig.push('Privacidade');

  if (obrig.length) {
    alert('Preencha: ' + obrig.join(', ') + '.');
    return null;
  }
  return [
    'ECO-DENÚNCIA', '',
    `Tipo: ${v('tipo')}`,
    `Quando: ${v('quando') || 'não informado'}`,
    `Local: ${v('endereco')}`,
    `Coordenadas: ${(v('lat') && v('lng')) ? (v('lat') + ', ' + v('lng')) : 'não informado'}`, '',
    'Descrição:',
    v('descricao'), '',
    '— Dados do denunciante —',
    `Nome: ${v('nome') || 'não informado'}`,
    `WhatsApp: ${v('whats') || 'não informado'}`,
    `E-mail: ${v('email') || 'não informado'}`,
    `Autorizo contato: ${ck('contatoOk') ? 'Sim' : 'Não'}`
  ].join('\n');
}

// Exibe preview e botão de copiar
function mostrarPreview(texto) {
  const out = document.getElementById('preview');
  const wrap = document.getElementById('copyWrap');
  const msg = document.getElementById('copyMsg');
  if (!out || !wrap || !msg) return;
  out.textContent = texto;
  out.hidden = false;
  wrap.hidden = false;
  msg.textContent = '';
}

// Enviar por e-mail (mailto)
document.getElementById('btnEmail')?.addEventListener('click', () => {
  const texto = montarMensagem(); if (!texto) return;
  mostrarPreview(texto);
  const destinatario = (document.getElementById('email')?.value || '').trim() || 'contato@vidas60.com';
  const assunto = encodeURIComponent('ECO-Denúncia - Vida Saudável 60+');
  const corpo = encodeURIComponent(texto + '\n\n(Anexe suas fotos ao e-mail antes de enviar.)');
  window.location.href = `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;
});

// Enviar por WhatsApp
document.getElementById('btnWhats')?.addEventListener('click', () => {
  const texto = montarMensagem(); if (!texto) return;
  mostrarPreview(texto);
  const numero = (document.getElementById('whats')?.value || '').replace(/\D/g,'');
  const msg = encodeURIComponent(texto + '\n\n(Envie as fotos na conversa.)');
  const url = numero ? `https://wa.me/55${numero}?text=${msg}` : `https://wa.me/?text=${msg}`;
  window.open(url, '_blank');
});

// Copiar para a área de transferência
document.getElementById('btnCopy')?.addEventListener('click', async () => {
  const txt = document.getElementById('preview')?.textContent.trim();
  const msg = document.getElementById('copyMsg');
  if (!txt || !msg) return;
  try {
    await navigator.clipboard.writeText(txt);
    msg.textContent = 'Texto copiado! ✅';
    msg.className = 'small ok';
  } catch {
    msg.textContent = 'Não foi possível copiar. Selecione e copie manualmente.';
    msg.className = 'small';
  }
});

// Limpar formulário
document.getElementById('btnClear')?.addEventListener('click', () => {
  const out = document.getElementById('preview');
  const wrap = document.getElementById('copyWrap');
  const msg = document.getElementById('copyMsg');
  if (out) out.hidden = true;
  if (wrap) wrap.hidden = true;
  if (msg) msg.textContent = '';
});

// script.js
// ===== Jornal Agora – funcionalidades básicas =====

document.addEventListener("DOMContentLoaded", () => {
  // 1) Ano automático no rodapé
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Menu mobile (abre/fecha)
  const menuBtn = document.getElementById("menuBtn");
  const topNav  = document.getElementById("topNav");

  if (menuBtn && topNav) {
    // Acessibilidade
    menuBtn.setAttribute("aria-controls", "topNav");
    menuBtn.setAttribute("aria-expanded", "false");

    const toggleMenu = () => {
      const isOpen = topNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      // dica: no CSS, crie .top-nav.is-open { display: block; } para mobile
      if (isOpen) {
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleEscKey);
      } else {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscKey);
      }
    };

    const handleClickOutside = (e) => {
      if (!topNav.contains(e.target) && e.target !== menuBtn) {
        topNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscKey);
      }
    };

    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        topNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscKey);
        menuBtn.focus();
      }
    };

    menuBtn.addEventListener("click", toggleMenu);

    // Fecha o menu ao clicar num link de navegação
    topNav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      if (topNav.classList.contains("is-open")) {
        topNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 3) Rolagem suave para âncoras da página (#ultimas, #brasil, #mundo)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id); // atualiza o hash na URL
      }
    });
  });

  // 4) Melhoria: garantir lazy-loading das imagens (se não estiver no HTML)
  document.querySelectorAll("img:not([loading])").forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });

  // 5) Sombra no header ao rolar (efeito visual opcional)
  const header = document.querySelector(".site-header");
  let last = 0;
  if (header) {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > 8 && last <= 8) header.classList.add("with-shadow");
      if (y <= 8 && last > 8) header.classList.remove("with-shadow");
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});
document.getElementById("year").textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const topNav = document.getElementById("topNav");

menuBtn.addEventListener("click", () => {
  topNav.classList.toggle("open");
});

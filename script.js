document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js carregado com sucesso");

  // ===== DATA =====
  const dataHoje = document.getElementById("dataHoje");
  const anoAtual = document.getElementById("anoAtual");

  if (dataHoje) {
    const agora = new Date();
    const dias = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado"
    ];
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro"
    ];

    dataHoje.textContent = `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;
  }

  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

  // ===== MENU =====
  const menuBtn = document.getElementById("menuBtn");
  const topNav = document.getElementById("topNav");

  if (menuBtn && topNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = topNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    topNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        topNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== BARRA DE PROGRESSO =====
  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");

  window.addEventListener(
    "scroll",
    () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const percent = total > 0 ? (h.scrollTop / total) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = percent + "%";
      }

      if (toTop) {
        toTop.classList.toggle("show", h.scrollTop > 300);
      }
    },
    { passive: true }
  );

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== ANIMAÇÃO =====
  const animatedItems = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedItems.forEach((item) => observer.observe(item));
  } else {
    animatedItems.forEach((item) => item.classList.add("visible"));
  }

  // ===== LEITURA FÁCIL =====
  const easyReadBtn = document.getElementById("easyReadBtn");

  if (easyReadBtn) {
    easyReadBtn.addEventListener("click", () => {
      document.body.classList.toggle("easy-read");
    });
  }

  // ===== AUMENTAR / DIMINUIR LETRA =====
  const fontDec = document.getElementById("fontDec");
  const fontInc = document.getElementById("fontInc");
  const fontReset = document.getElementById("fontReset");
  const fontHint = document.getElementById("fontHint");

  const MIN_PX = 16;
  const MAX_PX = 26;
  const DEFAULT_PX = 18;
  const STEP = 1;

  function getSavedFontSize() {
    const saved = parseInt(localStorage.getItem("vs60_font_px"), 10);
    if (!isNaN(saved) && saved >= MIN_PX && saved <= MAX_PX) {
      return saved;
    }
    return DEFAULT_PX;
  }

  function applyFontSize(size) {
    const value = Math.max(MIN_PX, Math.min(MAX_PX, size));
    document.documentElement.style.fontSize = value + "px";
    localStorage.setItem("vs60_font_px", value);

    if (fontHint) {
      fontHint.textContent = `Tamanho: ${value}px`;
    }
  }

  applyFontSize(getSavedFontSize());

  if (fontDec) {
    fontDec.addEventListener("click", () => {
      const current = parseInt(
        getComputedStyle(document.documentElement).fontSize,
        10
      );
      applyFontSize(current - STEP);
    });
  }

  if (fontInc) {
    fontInc.addEventListener("click", () => {
      const current = parseInt(
        getComputedStyle(document.documentElement).fontSize,
        10
      );
      applyFontSize(current + STEP);
    });
  }

  if (fontReset) {
    fontReset.addEventListener("click", () => {
      applyFontSize(DEFAULT_PX);
    });
  }

  // ===== TTS / ÁUDIO =====
  const hasTTS =
    "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  const ttsPlayPage = document.getElementById("ttsPlayPage");
  const ttsPause = document.getElementById("ttsPause");
  const ttsStop = document.getElementById("ttsStop");
  const ttsStatus = document.getElementById("ttsStatus");

  function setTtsStatus(message) {
    if (ttsStatus) {
      ttsStatus.textContent = message;
    }
  }

  function getPortugueseVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((voice) => voice.lang === "pt-BR") ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("pt")) ||
      null
    );
  }

  function cleanTextFromElement(element) {
    if (!element) return "";

    const clone = element.cloneNode(true);

    clone.querySelectorAll(
      "button, script, style, iframe, nav, .audio-toolbar, .actions-row, #progressBar, #toTop, #easyReadBtn"
    ).forEach((item) => item.remove());

    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  function stopSpeech() {
    if (!hasTTS) return;
    window.speechSynthesis.cancel();
    setTtsStatus("Leitura parada.");
  }

  function pauseResumeSpeech() {
    if (!hasTTS) return;

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setTtsStatus("Leitura pausada.");
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setTtsStatus("Leitura retomada.");
    }
  }

  function speakText(text) {
    if (!hasTTS) {
      alert("Seu navegador não suporta leitura em voz. Teste no Google Chrome.");
      return;
    }

    const clean = (text || "").trim();
    if (!clean) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = getPortugueseVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "pt-BR";
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setTtsStatus("Lendo...");
    utterance.onend = () => setTtsStatus("Leitura concluída.");
    utterance.onerror = () => setTtsStatus("Erro ao ler em voz alta.");

    window.speechSynthesis.speak(utterance);
  }

  if (hasTTS) {
    window.speechSynthesis.getVoices();

    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  document.querySelectorAll(".audio-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-section");

      if (target === "page-all") {
        const main = document.querySelector("main");
        const text = cleanTextFromElement(main);
        speakText(text);
        return;
      }

      const section = document.getElementById(target);
      const text = cleanTextFromElement(section);
      speakText(text);
    });
  });

  if (ttsPlayPage) {
    ttsPlayPage.addEventListener("click", () => {
      const main = document.querySelector("main");
      const text = cleanTextFromElement(main);
      speakText(text);
    });
  }

  if (ttsPause) {
    ttsPause.addEventListener("click", pauseResumeSpeech);
  }

  if (ttsStop) {
    ttsStop.addEventListener("click", stopSpeech);
  }

  window.addEventListener("beforeunload", () => {
    if (hasTTS) {
      window.speechSynthesis.cancel();
    }
  });
});
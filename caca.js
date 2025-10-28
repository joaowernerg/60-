// ===== util: remover acentos =====
function normalizeWord(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/gi, '')
    .toUpperCase();
}

// ===== palavras com dicas (Forca – Autonomia & Saúde Dermatológica) =====
const HANGMAN_WORDS = [
  { word: "AUTONOMIA",     hint: "Capacidade de se cuidar e tomar decisões no dia a dia." },
  { word: "INDEPENDENCIA", hint: "Realizar tarefas pessoais com segurança e liberdade." },
  { word: "CONFIANCA",     hint: "Acreditar em si; importante para manter a rotina de autocuidado." },
  { word: "AUTOESTIMA",    hint: "Como você se vê; aumenta com hábitos saudáveis." },
  { word: "CUIDADOS",      hint: "Passos simples e constantes para bem-estar." },
  { word: "PELE",          hint: "Órgão que protege o corpo; precisa de atenção diária." },
  { word: "HIDRATACAO",    hint: "Mantém a pele macia e ajuda na elasticidade." },
  { word: "PROTETOR",      hint: "Ajuda a prevenir danos do sol na pele." },
  { word: "SOL",           hint: "Exposição controlada e protegida é essencial." },
  { word: "PREVENCAO",     hint: "Melhor caminho para evitar problemas futuros." },
  { word: "BEMESTAR",      hint: "Sensação de saúde física e emocional." },
  { word: "DERMATOLOGIA",  hint: "Especialidade que cuida da pele, cabelos e unhas." },
  { word: "HIDRATAR",      hint: "Ação diária com água e cremes adequados." },
  { word: "SUAVIDADE",     hint: "Textura agradável da pele bem cuidada." },
  { word: "ELASTICIDADE",  hint: "Propriedade da pele de esticar e voltar." },
  { word: "CICATRIZACAO",  hint: "Processo natural de reparo da pele." },
  { word: "PROTECAO",      hint: "Barreira contra agressões externas." },
  { word: "ROTINA",        hint: "Regularidade que faz a diferença nos resultados." },
  { word: "SABONETE",      hint: "Limpeza suave e específica para o tipo de pele." },
  { word: "HIPOALERGENICO",hint: "Produto que reduz risco de alergias cutâneas." },
  // extras do seu portal (bem-estar geral)
  { word: "AGUA",          hint: "Hidratação de dentro para fora." },
  { word: "CAMINHADA",     hint: "Movimento leve que melhora circulação." },
  { word: "LEGUME",        hint: "Coloridos no prato = nutrientes para a pele." },
  { word: "FRUTA",         hint: "Vitaminas importantes para o corpo e pele." },
  { word: "SONO",          hint: "Descanso regula hormônios e regeneração da pele." },
  { word: "RESPIRAR",      hint: "Respiração profunda reduz o estresse." },
  { word: "SORRISO",       hint: "Faz bem para a autoestima e relações." },
  { word: "GRATIDAO",      hint: "Atitude mental que melhora o bem-estar." }
];

// API simples para seu jogo
export function getRandomHangmanWord() {
  const item = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
  return { word: normalizeWord(item.word), hint: item.hint };
}

export { HANGMAN_WORDS };

/* ===== Configuração ===== */
const PALAVRAS = [
  "AGUA","CAMINHADA","FRUTA","LEGUME","SONO","RESPIRAR","SOURISO","SORRISO",
  "ALONGAR","MUSICA","LAZER","AMIGOS","MEDITAR","FIBRA","CEREAL","DANCA",
  "HIDRATAR","GRATIDAO","ZUMBA","SALADAS","PEIXE","AZEITE","CHAVE","CORACAO"
].map(p => p.normalize("NFD").replace(/[\u0300-\u036f]/g,"")); // sem acento

const TAM = 14; // lado da grade
const DIRECOES = [
  [1,0],[-1,0],[0,1],[0,-1],
  [1,1],[-1,-1],[1,-1],[-1,1]
];
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ===== Estado ===== */
let grade = [];
let posPalavras = new Map(); // palavra -> array de coords
let inicioSel = null;
let atualSel = null;
let encontrado = new Set();
let timer = null, segundos = 0;

/* ===== Util ===== */
const el = s => document.querySelector(s);
const gridEl = el("#grid");
const listaEl = el("#lista");
const foundEl = el("#found");
const totalEl = el("#total");
const tempoEl = el("#tempo");
const dlg = el("#win");

function fmtTempo(s){
  const m = Math.floor(s/60).toString().padStart(2,"0");
  const ss = (s%60).toString().padStart(2,"0");
  return `${m}:${ss}`;
}

/* ===== Geração da grade ===== */
function criaVazio(n){ return Array.from({length:n}, ()=>Array(n).fill("")) }

function cabe(pal, x,y, dx,dy){
  for(let i=0;i<pal.length;i++){
    const nx = x + dx*i, ny = y + dy*i;
    if(nx<0||ny<0||nx>=TAM||ny>=TAM) return false;
    const cel = grade[ny][nx];
    if(cel && cel !== pal[i]) return false;
  }
  return true;
}

function coloca(pal){
  // tenta 200 vezes com direções aleatórias
  for(let t=0;t<200;t++){
    const [dx,dy] = DIRECOES[Math.floor(Math.random()*DIRECOES.length)];
    const x = Math.floor(Math.random()*TAM);
    const y = Math.floor(Math.random()*TAM);
    if(!cabe(pal,x,y,dx,dy)) continue;
    const coords = [];
    for(let i=0;i<pal.length;i++){
      const nx = x + dx*i, ny = y + dy*i;
      grade[ny][nx] = pal[i];
      coords.push([nx,ny]);
    }
    posPalavras.set(pal, coords);
    return true;
  }
  return false;
}

function preencheAleatorio(){
  for(let y=0;y<TAM;y++){
    for(let x=0;x<TAM;x++){
      if(!grade[y][x]) grade[y][x] = ALFABETO[Math.floor(Math.random()*ALFABETO.length)];
    }
  }
}

function embaralha(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function montaLista(){
  listaEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  for(const p of posPalavras.keys()){
    const li = document.createElement("li");
    li.dataset.word = p;
    li.innerHTML = `<span>${p}</span> <small>—</small>`;
    frag.appendChild(li);
  }
  listaEl.appendChild(frag);
  totalEl.textContent = posPalavras.size;
  foundEl.textContent = encontrado.size;
}

function desenhaGrid(){
  gridEl.style.setProperty("--size", TAM);
  gridEl.innerHTML = "";
  for(let y=0;y<TAM;y++){
    for(let x=0;x<TAM;x++){
      const d = document.createElement("div");
      d.className = "cell";
      d.setAttribute("role","gridcell");
      d.setAttribute("data-x", x);
      d.setAttribute("data-y", y);
      d.textContent = grade[y][x];
      gridEl.appendChild(d);
    }
  }
}

function novoJogo(){
  clearInterval(timer); segundos = 0; tempoEl.textContent = "00:00";
  timer = setInterval(()=>{ segundos++; tempoEl.textContent = fmtTempo(segundos) },1000);

  grade = criaVazio(TAM);
  posPalavras.clear();
  encontrado.clear();
  inicioSel = atualSel = null;

  // escolhe até 10 palavras
  const alvo = Math.min(10, PALAVRAS.length);
  const escolhidas = embaralha([...PALAVRAS]).slice(0, alvo);

  // para cada palavra, 50% chance de invertida
  for(const w of escolhidas){
    const w2 = Math.random()<0.5 ? w.split("").reverse().join("") : w;
    const ok = coloca(w2);
    if(!ok){
      // se não coube, tenta palavra normal
      coloca(w);
    }
  }

  preencheAleatorio();
  desenhaGrid();
  montaLista();
  foundEl.textContent = "0";
}

/* ===== Seleção ===== */
function limpaSelecaoTemp(){
  gridEl.querySelectorAll(".cell.sel").forEach(c=>c.classList.remove("sel"));
}

function marcaCaminho(x0,y0,x1,y1){
  limpaSelecaoTemp();
  const dx = Math.sign(x1-x0), dy = Math.sign(y1-y0);
  if(dx===0 && dy===0){ el(`[data-x="${x0}"][data-y="${y0}"]`)?.classList.add("sel"); return; }
  // precisa alinhar em linha/coluna/diagonal
  if(!(dx===0 || dy===0 || Math.abs(x1-x0)===Math.abs(y1-y0))) return;

  const passos = Math.max(Math.abs(x1-x0), Math.abs(y1-y0));
  for(let i=0;i<=passos;i++){
    const x = x0 + dx*i, y = y0 + dy*i;
    el(`.cell[data-x="${x}"][data-y="${y}"]`)?.classList.add("sel");
  }
}

function coordsSel(){
  const sel = [...gridEl.querySelectorAll(".cell.sel")];
  return sel.map(c => [Number(c.dataset.x), Number(c.dataset.y)]);
}

function textoSel(coords){
  return coords.map(([x,y]) => grade[y][x]).join("");
}

function confereSelecao(){
  const coords = coordsSel();
  if(coords.length<2) return false;
  const palavra = textoSel(coords);
  const inversa = palavra.split("").reverse().join("");
  let match = null;

  for(const p of posPalavras.keys()){
    if(p === palavra || p === inversa){
      // confere que coords batem com posPalavras (para evitar falsos positivos)
      const alvo = posPalavras.get(p);
      if(igualCoords(coords, alvo) || igualCoords(coords, [...alvo].reverse())){
        match = p; break;
      }
    }
  }
  if(match){
    // fixa como encontrada
    for(const [x,y] of coords){
      el(`.cell[data-x="${x}"][data-y="${y}"]`)?.classList.add("ok");
    }
    gridEl.querySelectorAll(".cell.sel").forEach(c=>{
      c.classList.remove("sel"); c.classList.add("ok");
    });
    encontrado.add(match);
    const li = listaEl.querySelector(`li[data-word="${match}"]`);
    if(li){ li.classList.add("ok"); li.querySelector("small").textContent = "ok"; }
    foundEl.textContent = encontrado.size;

    if(encontrado.size === posPalavras.size){
      clearInterval(timer);
      dlg.showModal();
    }
    return true;
  }
  return false;
}

function igualCoords(a,b){
  if(a.length!==b.length) return false;
  for(let i=0;i<a.length;i++){
    if(a[i][0]!==b[i][0] || a[i][1]!==b[i][1]) return false;
  }
  return true;
}

/* ===== Interação mouse/touch ===== */
function cellFromEvent(e){
  const t = e.target.closest(".cell");
  if(!t) return null;
  return [Number(t.dataset.x), Number(t.dataset.y)];
}

gridEl.addEventListener("mousedown", e=>{
  const c = cellFromEvent(e); if(!c) return;
  inicioSel = c; atualSel = c;
  marcaCaminho(...inicioSel, ...atualSel);
  e.preventDefault();
});
gridEl.addEventListener("mousemove", e=>{
  if(!inicioSel) return;
  const c = cellFromEvent(e); if(!c) return;
  atualSel = c; marcaCaminho(...inicioSel, ...atualSel);
});
window.addEventListener("mouseup", ()=>{
  if(!inicioSel) return;
  if(!confereSelecao()) limpaSelecaoTemp();
  inicioSel = atualSel = null;
});

// Touch
gridEl.addEventListener("touchstart", e=>{
  const c = cellFromEvent(e.changedTouches[0]); if(!c) return;
  inicioSel = c; atualSel = c;
  marcaCaminho(...inicioSel, ...atualSel);
},{passive:true});
gridEl.addEventListener("touchmove", e=>{
  if(!inicioSel) return;
  const touch = e.changedTouches[0];
  const elem = document.elementFromPoint(touch.clientX, touch.clientY);
  const cell = elem?.closest?.(".cell");
  if(cell){
    atualSel = [Number(cell.dataset.x), Number(cell.dataset.y)];
    marcaCaminho(...inicioSel, ...atualSel);
  }
},{passive:true});
gridEl.addEventListener("touchend", ()=>{
  if(!inicioSel) return;
  if(!confereSelecao()) limpaSelecaoTemp();
  inicioSel = atualSel = null;
},{passive:true});

/* ===== Dica ===== */
function highlightUmaLetra(word){
  const coords = posPalavras.get(word);
  if(!coords) return;
  const [x,y] = coords[0];
  el(`.cell[data-x="${x}"][data-y="${y}"]`)?.classList.add("sel");
  setTimeout(()=>limpaSelecaoTemp(), 800);
}

el("#btn-dica").addEventListener("click", ()=>{
  const pendentes = [...posPalavras.keys()].filter(w=>!encontrado.has(w));
  if(!pendentes.length) return;
  const alvo = pendentes[Math.floor(Math.random()*pendentes.length)];
  highlightUmaLetra(alvo);
});

/* ===== Novo jogo ===== */
el("#btn-novo").addEventListener("click", novoJogo);

/* ===== Init ===== */
novoJogo();

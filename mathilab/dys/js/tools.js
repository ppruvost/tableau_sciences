/**
 * tools.js — Outils interactifs pour le travail du sens du nombre.
 * Principes : aucun chronomètre imposé, correction visuelle bienveillante,
 * tout est utilisable à la souris, au toucher et au clavier.
 * Lit `prefs.calme` (défini dans app.js) : en mode calme, pas de flash chronométré.
 */

// ------------------------------------------------------------------ utilitaires
function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Nombre en lettres (0 à 999), orthographe rectifiée non utilisée (traits d'union classiques). */
function nombreEnLettres(n) {
  const u = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const dizaines = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante" };
  function moins100(x) {
    if (x < 20) return u[x];
    if (x < 70) {
      const d = Math.floor(x / 10), r = x % 10;
      if (r === 0) return dizaines[d];
      return dizaines[d] + (r === 1 ? "-et-un" : "-" + u[r]);
    }
    if (x < 80) {
      const r = x - 60;
      return "soixante" + (r === 11 ? "-et-onze" : "-" + u[r]);
    }
    if (x === 80) return "quatre-vingts";
    return "quatre-vingt-" + u[x - 80];
  }
  if (n === 0) return "zéro";
  const h = Math.floor(n / 100), r = n % 100;
  let out = "";
  if (h === 1) out = "cent";
  else if (h > 1) out = u[h] + " cent" + (r === 0 ? "s" : "");
  if (r > 0) out += (out ? " " : "") + moins100(r);
  return out;
}

// ============================================================================
// OUTIL 1 — COMBIEN DE POINTS ? (subitizing)
// ============================================================================
function toolSubitizing() {
  const root = el(`
    <div class="outil">
      <h2>Combien de points ?</h2>
      <p class="intro">Regarde l'image et dis combien il y a de points, sans les compter un par un. Tu peux regarder aussi longtemps que tu veux.</p>
      <div class="outil-controls">
        <label>Niveau
          <select id="sub-niveau">
            <option value="5">1 à 5 (comme un dé)</option>
            <option value="10">1 à 10 (cadre de 10)</option>
          </select>
        </label>
        <label>Mode
          <select id="sub-mode">
            <option value="libre">Je regarde le temps que je veux</option>
            <option value="flash">Flash de 2 secondes</option>
          </select>
        </label>
      </div>
      <div class="outil-zone" id="sub-zone" aria-live="polite"></div>
      <div class="reponses" id="sub-reps"></div>
      <p class="feedback" id="sub-fb" aria-live="polite"></p>
      <div class="actions"><button type="button" class="primary" id="sub-next">Nouvelle image</button></div>
      <p class="score" id="sub-score"></p>
    </div>`);

  const zone = root.querySelector("#sub-zone");
  const reps = root.querySelector("#sub-reps");
  const fb = root.querySelector("#sub-fb");
  const scoreEl = root.querySelector("#sub-score");
  const selNiveau = root.querySelector("#sub-niveau");
  const selMode = root.querySelector("#sub-mode");
  let n = 0, bien = 0, total = 0, timer = null, repondu = false;

  if (prefs.calme) {
    selMode.value = "libre";
    selMode.disabled = true;
    selMode.title = "Désactivé en mode calme";
  }

  function decomposer(k) {
    if (k <= 5) return `${Math.ceil(k / 2)} + ${Math.floor(k / 2)} = ${k}`;
    return `5 + ${k - 5} = ${k}`;
  }

  const DICE = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8] };

  function drawDice(k) {
    const dots = DICE[k].map((c) => `<circle cx="${30 + (c % 3) * 30}" cy="${30 + Math.floor(c / 3) * 30}" r="11" fill="var(--accent)"/>`).join("");
    return `<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="Image de points"><rect x="4" y="4" width="112" height="112" rx="16" fill="var(--card)" stroke="var(--ink)" stroke-width="3"/>${dots}</svg>`;
  }

  function drawFrame(k) {
    let out = "";
    for (let i = 0; i < 10; i++) {
      const x = 8 + (i % 5) * 50, y = 8 + Math.floor(i / 5) * 50;
      out += `<rect x="${x}" y="${y}" width="46" height="46" fill="var(--card)" stroke="var(--ink)" stroke-width="2.5"/>`;
      if (i < k) out += `<circle cx="${x + 23}" cy="${y + 23}" r="16" fill="${i < 5 ? "var(--accent)" : "var(--accent2)"}"/>`;
    }
    return `<svg viewBox="0 0 266 112" width="300" height="126" role="img" aria-label="Cadre de 10 avec des points">${out}</svg>`;
  }

  function draw(k) {
    return Number(selNiveau.value) === 5 ? drawDice(k) : drawFrame(k);
  }

  function nouveau() {
    clearTimeout(timer);
    repondu = false;
    const max = Number(selNiveau.value);
    let next;
    do { next = randInt(1, max); } while (next === n && max > 1);
    n = next;
    fb.textContent = "";
    zone.innerHTML = draw(n);
    reps.innerHTML = "";
    for (let i = 1; i <= max; i++) {
      const b = el(`<button type="button" class="num-btn">${i}</button>`);
      b.addEventListener("click", () => repondre(i));
      reps.appendChild(b);
    }
    if (selMode.value === "flash" && !prefs.calme) {
      timer = setTimeout(() => {
        if (!repondu) zone.innerHTML = `<div class="cache">?</div>`;
      }, 2000);
    }
  }

  function repondre(i) {
    if (repondu) return;
    repondu = true;
    clearTimeout(timer);
    total++;
    zone.innerHTML = draw(n);
    const ok = i === n;
    if (ok) bien++;
    fb.className = "feedback " + (ok ? "ok" : "info");
    fb.textContent = ok ? `✓ Oui, c'est ${n}.` : `C'était ${n}.${n > 1 ? " Tu peux la décomposer : " + decomposer(n) + "." : ""}`;
    reps.querySelectorAll("button").forEach((b) => {
      b.disabled = true;
      if (Number(b.textContent) === n) b.classList.add("good");
      else if (Number(b.textContent) === i && !ok) b.classList.add("miss");
    });
    scoreEl.textContent = `Bien vus : ${bien} sur ${total}`;
  }

  root.querySelector("#sub-next").addEventListener("click", nouveau);
  selNiveau.addEventListener("change", nouveau);
  selMode.addEventListener("change", nouveau);
  nouveau();
  return root;
}

// ============================================================================
// OUTIL 2 — PLACER UN NOMBRE SUR LA DROITE
// ============================================================================
function toolDroite() {
  const root = el(`
    <div class="outil">
      <h2>Placer un nombre sur la droite</h2>
      <p class="intro">Clique (ou touche) la droite à l'endroit où tu penses que se trouve le nombre. Tu peux aussi taper ta réponse. Il n'y a pas de note : on regarde seulement de combien tu étais proche.</p>
      <div class="outil-controls">
        <label>Échelle
          <select id="dr-max">
            <option value="10">de 0 à 10</option>
            <option value="20">de 0 à 20</option>
            <option value="100">de 0 à 100</option>
          </select>
        </label>
      </div>
      <p class="cible">Où se trouve le nombre <strong id="dr-cible" class="gros-nombre"></strong> ?</p>
      <div class="droite" id="dr-droite" role="application" aria-label="Droite numérique, cliquer pour placer le nombre"></div>
      <div class="outil-controls">
        <label>Ou je tape le nombre
          <input type="number" id="dr-saisie" min="0" inputmode="numeric">
        </label>
        <button type="button" class="secondary" id="dr-valider">Valider</button>
      </div>
      <p class="feedback" id="dr-fb" aria-live="polite"></p>
      <div class="actions"><button type="button" class="primary" id="dr-next">Nouveau nombre</button></div>
    </div>`);

  const droite = root.querySelector("#dr-droite");
  const cibleEl = root.querySelector("#dr-cible");
  const fb = root.querySelector("#dr-fb");
  const selMax = root.querySelector("#dr-max");
  const saisie = root.querySelector("#dr-saisie");
  let max = 10, cible = 0, fini = false;

  function construireDroite() {
    max = Number(selMax.value);
    const tickStep = max <= 20 ? 1 : 5;
    const labelStep = max <= 10 ? 1 : max <= 20 ? 5 : 10;
    saisie.max = max;
    let html = `<div class="droite-ligne"></div>`;
    for (let i = 0; i <= max; i += tickStep) {
      const left = (i / max) * 100;
      const major = i % labelStep === 0;
      html += `<div class="droite-tick ${major ? "major" : ""}" style="left:${left}%"></div>`;
      if (major) html += `<div class="droite-label" style="left:${left}%">${i}</div>`;
    }
    droite.innerHTML = html;
  }

  function marqueur(valeur, classe, texte) {
    const m = el(`<div class="droite-marque ${classe}" style="left:${(valeur / max) * 100}%"><span>${esc(texte)}</span></div>`);
    droite.appendChild(m);
  }

  function nouveau() {
    construireDroite();
    fini = false;
    do { cible = randInt(max <= 10 ? 1 : 2, max - 1); } while (max >= 20 && cible % 5 === 0 && Math.random() < 0.7);
    cibleEl.textContent = cible;
    fb.textContent = "";
    fb.className = "feedback";
    saisie.value = "";
  }

  function verifier(valeur) {
    if (fini) return;
    fini = true;
    const ecart = Math.abs(valeur - cible);
    droite.querySelectorAll(".droite-marque").forEach((m) => m.remove());
    marqueur(valeur, "eleve", "toi : " + valeur);
    if (ecart !== 0) marqueur(cible, "bonne", String(cible));
    let msg, cls;
    if (ecart === 0) { msg = "✓ Pile au bon endroit !"; cls = "ok"; }
    else if (ecart <= Math.max(1, Math.round(max * 0.05))) { msg = `Très proche : il n'y avait que ${ecart} d'écart.`; cls = "ok"; }
    else { msg = `Il y avait ${ecart} d'écart. Regarde où se trouve ${cible} : tu peux t'aider des repères.`; cls = "info"; }
    fb.className = "feedback " + cls;
    fb.textContent = msg;
  }

  droite.addEventListener("click", (e) => {
    const rect = droite.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    verifier(Math.round(frac * max));
  });
  root.querySelector("#dr-valider").addEventListener("click", () => {
    const v = Number(saisie.value);
    if (saisie.value === "" || isNaN(v) || v < 0 || v > max) {
      fb.className = "feedback info";
      fb.textContent = `Tape un nombre entre 0 et ${max}.`;
      return;
    }
    verifier(v);
  });
  root.querySelector("#dr-next").addEventListener("click", nouveau);
  selMax.addEventListener("change", nouveau);
  nouveau();
  return root;
}

// ============================================================================
// OUTIL 3 — CONSTRUIRE UN NOMBRE (valeur positionnelle)
// ============================================================================
function toolNumeration() {
  const root = el(`
    <div class="outil">
      <h2>Construire un nombre</h2>
      <p class="intro">Avec les flèches, ajoute ou enlève des centaines, des dizaines et des unités. Regarde comment le nombre change.</p>
      <div class="num-cols" id="nu-cols"></div>
      <div class="num-resultat">
        <p class="gros-nombre" id="nu-nombre">0</p>
        <p id="nu-lettres" class="lettres">zéro</p>
        <p id="nu-decomp" class="decomp">0</p>
      </div>
      <div class="blocs" id="nu-blocs" aria-hidden="true"></div>
      <div class="defi" id="nu-defi">
        <p><strong>Défi :</strong> <span id="nu-defi-texte"></span></p>
        <div class="actions">
          <button type="button" class="secondary" id="nu-defi-new">Autre défi</button>
          <button type="button" class="primary" id="nu-defi-check">Vérifier</button>
        </div>
        <p class="feedback" id="nu-fb" aria-live="polite"></p>
      </div>
    </div>`);

  const vals = { c: 0, d: 0, u: 0 };
  const cols = [
    { k: "c", nom: "Centaines", cls: "col-c" },
    { k: "d", nom: "Dizaines", cls: "col-d" },
    { k: "u", nom: "Unités", cls: "col-u" }
  ];
  const colsEl = root.querySelector("#nu-cols");
  let objectif = 0;

  function total() { return vals.c * 100 + vals.d * 10 + vals.u; }

  function maj() {
    cols.forEach((c) => (colsEl.querySelector(`[data-chiffre="${c.k}"]`).textContent = vals[c.k]));
    const t = total();
    root.querySelector("#nu-nombre").textContent = t;
    root.querySelector("#nu-lettres").textContent = nombreEnLettres(t);
    const parts = [];
    if (vals.c) parts.push(vals.c * 100);
    if (vals.d) parts.push(vals.d * 10);
    if (vals.u) parts.push(vals.u);
    root.querySelector("#nu-decomp").textContent = t === 0 ? "0" : `${t} = ${parts.join(" + ")}`;
    let blocs = "";
    blocs += `<div class="blocs-col col-c">${'<span class="bloc-c"></span>'.repeat(vals.c)}</div>`;
    blocs += `<div class="blocs-col col-d">${'<span class="bloc-d"></span>'.repeat(vals.d)}</div>`;
    blocs += `<div class="blocs-col col-u">${'<span class="bloc-u"></span>'.repeat(vals.u)}</div>`;
    root.querySelector("#nu-blocs").innerHTML = blocs;
  }

  cols.forEach((c) => {
    const box = el(`
      <div class="num-col ${c.cls}">
        <p class="num-col-nom">${c.nom}</p>
        <button type="button" class="num-fleche" aria-label="Ajouter une ${c.nom.toLowerCase().slice(0, -1)}">▲</button>
        <p class="num-chiffre" data-chiffre="${c.k}">0</p>
        <button type="button" class="num-fleche" aria-label="Enlever une ${c.nom.toLowerCase().slice(0, -1)}">▼</button>
      </div>`);
    const [haut, bas] = box.querySelectorAll("button");
    haut.addEventListener("click", () => { vals[c.k] = Math.min(9, vals[c.k] + 1); maj(); });
    bas.addEventListener("click", () => { vals[c.k] = Math.max(0, vals[c.k] - 1); maj(); });
    colsEl.appendChild(box);
  });

  function nouveauDefi() {
    objectif = randInt(11, 999);
    root.querySelector("#nu-defi-texte").textContent = `construis le nombre ${objectif} (${nombreEnLettres(objectif)}).`;
    const fb = root.querySelector("#nu-fb");
    fb.textContent = "";
    fb.className = "feedback";
  }

  root.querySelector("#nu-defi-new").addEventListener("click", nouveauDefi);
  root.querySelector("#nu-defi-check").addEventListener("click", () => {
    const fb = root.querySelector("#nu-fb");
    if (total() === objectif) { fb.className = "feedback ok"; fb.textContent = `✓ Bravo, c'est bien ${objectif}.`; }
    else {
      fb.className = "feedback info";
      fb.textContent = `Pas encore : tu as construit ${total()}. Relis le nombre chiffre par chiffre : ${String(objectif).split("").join(" | ")}.`;
    }
  });
  maj();
  nouveauDefi();
  return root;
}

// ============================================================================
// OUTIL 4 — LES TABLES EN IMAGES
// ============================================================================
function toolTables() {
  const root = el(`
    <div class="outil">
      <h2>Les tables en images</h2>
      <p class="intro">Une multiplication, c'est un rectangle de points : a lignes de b points. Les points sont coupés en deux couleurs (5 + le reste) pour t'aider à ne pas tout compter.</p>
      <div class="outil-controls">
        <label>Lignes (a)
          <select id="tb-a"></select>
        </label>
        <label>Points par ligne (b)
          <select id="tb-b"></select>
        </label>
        <label class="check"><input type="checkbox" id="tb-cache"> Je cherche d'abord le résultat</label>
      </div>
      <div class="outil-zone" id="tb-zone"></div>
      <p class="gros-nombre" id="tb-calcul"></p>
      <div id="tb-saisie" class="outil-controls hidden">
        <label>Mon résultat <input type="number" id="tb-rep" inputmode="numeric"></label>
        <button type="button" class="primary" id="tb-verif">Vérifier</button>
      </div>
      <p class="feedback" id="tb-fb" aria-live="polite"></p>
      <div class="astuce" id="tb-astuce"></div>
    </div>`);

  const selA = root.querySelector("#tb-a");
  const selB = root.querySelector("#tb-b");
  for (let i = 1; i <= 10; i++) {
    selA.insertAdjacentHTML("beforeend", `<option value="${i}">${i}</option>`);
    selB.insertAdjacentHTML("beforeend", `<option value="${i}">${i}</option>`);
  }
  selA.value = "4";
  selB.value = "6";
  const cache = root.querySelector("#tb-cache");

  function astuce(a, b) {
    if (a === 10 || b === 10) return "×10 : j'ajoute un zéro à l'autre nombre.";
    if (a === 1 || b === 1) return "×1 : le nombre ne change pas.";
    if (a === 2 || b === 2) return `×2 : je double ${a === 2 ? b : a}, soit ${(a === 2 ? b : a) * 2}.`;
    if (a === 5 || b === 5) { const o = a === 5 ? b : a; return `×5 : la moitié de ${o} × 10 = ${o * 10} ÷ 2 = ${o * 5}.`; }
    if (a === 9 || b === 9) { const o = a === 9 ? b : a; return `×9 : ${o} × 10 − ${o} = ${o * 10} − ${o} = ${o * 9}.`; }
    const g = Math.max(a, b), p = Math.min(a, b);
    if (g > 5) return `Je coupe : ${p} × 5 + ${p} × ${g - 5} = ${p * 5} + ${p * (g - 5)} = ${p * g}.`;
    return `Je peux le voir en deux morceaux : ${p} × ${g - 1} + ${p}.`;
  }

  function dessiner() {
    const a = Number(selA.value), b = Number(selB.value);
    const taille = 26;
    let svg = "";
    for (let r = 0; r < a; r++) {
      for (let c = 0; c < b; c++) {
        const col = c < 5 ? "var(--accent)" : "var(--accent2)";
        svg += `<circle cx="${14 + c * taille}" cy="${14 + r * taille}" r="10" fill="${col}"/>`;
      }
    }
    root.querySelector("#tb-zone").innerHTML = `<svg viewBox="0 0 ${b * taille + 4} ${a * taille + 4}" width="${Math.min(520, b * taille + 4)}" role="img" aria-label="${a} lignes de ${b} points">${svg}</svg>`;
    const fb = root.querySelector("#tb-fb");
    fb.textContent = ""; fb.className = "feedback";
    const saisieBox = root.querySelector("#tb-saisie");
    root.querySelector("#tb-rep").value = "";
    if (cache.checked) {
      root.querySelector("#tb-calcul").textContent = `${a} × ${b} = ?`;
      saisieBox.classList.remove("hidden");
      root.querySelector("#tb-astuce").textContent = "";
    } else {
      root.querySelector("#tb-calcul").textContent = `${a} × ${b} = ${a * b}`;
      saisieBox.classList.add("hidden");
      root.querySelector("#tb-astuce").textContent = "Astuce : " + astuce(a, b);
    }
  }

  root.querySelector("#tb-verif").addEventListener("click", () => {
    const a = Number(selA.value), b = Number(selB.value);
    const v = Number(root.querySelector("#tb-rep").value);
    const fb = root.querySelector("#tb-fb");
    if (v === a * b) {
      fb.className = "feedback ok"; fb.textContent = `✓ Oui, ${a} × ${b} = ${a * b}.`;
      root.querySelector("#tb-calcul").textContent = `${a} × ${b} = ${a * b}`;
      root.querySelector("#tb-astuce").textContent = "Astuce : " + astuce(a, b);
    } else {
      fb.className = "feedback info";
      fb.textContent = "Pas encore. Regarde les deux couleurs : compte d'abord la première couleur, puis ajoute le reste. Tu peux aussi essayer l'astuce.";
      root.querySelector("#tb-astuce").textContent = "Astuce : " + astuce(a, b);
    }
  });
  selA.addEventListener("change", dessiner);
  selB.addEventListener("change", dessiner);
  cache.addEventListener("change", dessiner);
  dessiner();
  return root;
}

// ============================================================================
// ROUTAGE DES OUTILS
// ============================================================================
const OUTILS = [
  { id: "subitizing", label: "Combien de points ?", build: toolSubitizing },
  { id: "droite", label: "Placer un nombre", build: toolDroite },
  { id: "numeration", label: "Construire un nombre", build: toolNumeration },
  { id: "tables", label: "Les tables en images", build: toolTables }
];

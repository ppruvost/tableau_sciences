/**
 * app.js — Parcours Dys · Dyscalculie.
 * Dépend de data.js (DYS_DATA…) et tools.js (esc, el, OUTILS…).
 * Données conservées uniquement dans le navigateur (localStorage).
 */

const PREFS_KEY = "dys_prefs_v1";
const DOSSIERS_KEY = "dys_dossiers_v1";
const SEUILS = { rouge: 0.8, orange: 1.6 }; // moyenne des items (0 à 2)

function lireJSON(cle, defaut) {
  try { return JSON.parse(localStorage.getItem(cle)) || defaut; } catch (e) { return defaut; }
}
function ecrireJSON(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) { /* stockage indisponible */ }
}

// ------------------------------------------------------------ préférences
const prefs = Object.assign(
  { taille: 100, interligne: 1.7, police: "lisible", theme: "clair", calme: false },
  lireJSON(PREFS_KEY, {})
);

function appliquerPrefs() {
  const r = document.documentElement;
  r.style.fontSize = prefs.taille + "%";
  r.style.setProperty("--interligne", String(prefs.interligne));
  r.dataset.theme = prefs.theme;
  r.dataset.police = prefs.police;
  r.dataset.calme = prefs.calme ? "1" : "0";
  ecrireJSON(PREFS_KEY, prefs);
}

// ------------------------------------------------------------ état
const state = {
  view: "parcours",      // parcours | outils | memos
  step: "identite",      // identite | positionnement | plan
  outil: "subitizing",
  eleve: { prenom: "", nom: "", classe: "", referent: "", date: "" },
  reponses: {},          // { competenceId: [n0, n1, n2] }
  suivi: {},             // { moduleKey: { fait, note } }
  dossierId: null
};

function slug(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function sauverDossier() {
  if (!state.dossierId) return;
  const d = lireJSON(DOSSIERS_KEY, {});
  d[state.dossierId] = { eleve: state.eleve, reponses: state.reponses, suivi: state.suivi, maj: new Date().toISOString() };
  ecrireJSON(DOSSIERS_KEY, d);
}

// ------------------------------------------------------------ calcul des niveaux
const LIBELLES_NIVEAU = { rouge: "à travailler", orange: "en progrès", vert: "acquis" };
const SYMBOLES_NIVEAU = { rouge: "●", orange: "◐", vert: "✓" };

function niveau(compId) {
  const n = state.reponses[compId];
  if (!n || n.length < 3 || n.some((x) => x === undefined || x === null)) return null;
  const m = n.reduce((a, b) => a + b, 0) / n.length;
  return m < SEUILS.rouge ? "rouge" : m < SEUILS.orange ? "orange" : "vert";
}

function positionnementComplet() {
  return DYS_DATA.every((d) => d.competences.every((c) => niveau(c.id)));
}

// ------------------------------------------------------------ rendu général
const root = document.getElementById("app");

function render() {
  root.innerHTML = "";
  root.appendChild(renderHeader());
  const main = document.createElement("main");
  main.id = "contenu";
  main.className = "main";
  main.tabIndex = -1;
  if (state.view === "parcours") {
    if (state.step === "identite") main.appendChild(renderIdentite());
    else if (state.step === "positionnement") main.appendChild(renderPositionnement());
    else main.appendChild(renderPlan());
  } else if (state.view === "outils") {
    main.appendChild(renderOutils());
  } else {
    main.appendChild(renderMemos());
  }
  root.appendChild(main);
}

function renderHeader() {
  const header = document.createElement("header");
  header.className = "topbar";
  const tabs = [
    { id: "parcours", label: "Parcours" },
    { id: "outils", label: "Outils & jeux" },
    { id: "memos", label: "Aide-mémoire" }
  ];
  header.innerHTML = `
    <div class="topbar-top">
      <div>
        <p class="brand">Parcours Dys · Dyscalculie</p>
        <p class="brand-sub">Comprendre, manipuler, s'appuyer sur des outils — sans chrono</p>
      </div>
      <details class="prefs">
        <summary>Confort de lecture</summary>
        <div class="prefs-grid">
          <div class="pref">
            <span class="pref-nom">Taille du texte</span>
            <span class="pref-ctrl">
              <button type="button" id="pf-moins" aria-label="Réduire le texte">A−</button>
              <span id="pf-taille">${prefs.taille}%</span>
              <button type="button" id="pf-plus" aria-label="Agrandir le texte">A+</button>
            </span>
          </div>
          <label class="pref">
            <span class="pref-nom">Espacement des lignes</span>
            <select id="pf-interligne">
              <option value="1.5">Normal</option>
              <option value="1.7">Aéré</option>
              <option value="2">Très aéré</option>
            </select>
          </label>
          <label class="pref">
            <span class="pref-nom">Police</span>
            <select id="pf-police">
              <option value="lisible">Lisible (Atkinson)</option>
              <option value="systeme">Verdana / système</option>
            </select>
          </label>
          <label class="pref">
            <span class="pref-nom">Couleurs</span>
            <select id="pf-theme">
              <option value="clair">Clair</option>
              <option value="creme">Crème (moins éblouissant)</option>
              <option value="sombre">Sombre</option>
              <option value="contraste">Contraste élevé</option>
            </select>
          </label>
          <label class="pref pref-check">
            <input type="checkbox" id="pf-calme">
            <span><strong>Mode calme</strong> : pas de chrono, pas d'animation</span>
          </label>
        </div>
      </details>
    </div>
    <nav class="tabs" aria-label="Sections">
      ${tabs.map((t) => `<button type="button" class="tab ${state.view === t.id ? "active" : ""}" data-view="${t.id}" ${state.view === t.id ? 'aria-current="page"' : ""}>${t.label}</button>`).join("")}
    </nav>`;

  header.querySelector("#pf-interligne").value = String(prefs.interligne);
  header.querySelector("#pf-police").value = prefs.police;
  header.querySelector("#pf-theme").value = prefs.theme;
  header.querySelector("#pf-calme").checked = prefs.calme;

  const majTaille = (delta) => {
    prefs.taille = Math.min(160, Math.max(90, prefs.taille + delta));
    header.querySelector("#pf-taille").textContent = prefs.taille + "%";
    appliquerPrefs();
  };
  header.querySelector("#pf-moins").addEventListener("click", () => majTaille(-10));
  header.querySelector("#pf-plus").addEventListener("click", () => majTaille(10));
  header.querySelector("#pf-interligne").addEventListener("change", (e) => { prefs.interligne = Number(e.target.value); appliquerPrefs(); });
  header.querySelector("#pf-police").addEventListener("change", (e) => { prefs.police = e.target.value; appliquerPrefs(); });
  header.querySelector("#pf-theme").addEventListener("change", (e) => { prefs.theme = e.target.value; appliquerPrefs(); });
  header.querySelector("#pf-calme").addEventListener("change", (e) => { prefs.calme = e.target.checked; appliquerPrefs(); });

  header.querySelectorAll(".tab").forEach((b) =>
    b.addEventListener("click", () => { state.view = b.dataset.view; render(); window.scrollTo(0, 0); })
  );
  return header;
}

// ------------------------------------------------------------ étape 1 : dossier
function renderIdentite() {
  const dossiers = lireJSON(DOSSIERS_KEY, {});
  const ids = Object.keys(dossiers);
  const s = document.createElement("section");
  s.innerHTML = `
    ${renderFil("identite")}
    <h1>Dossier de l'élève</h1>
    <p class="intro">Renseigne les informations puis passe au positionnement. Ce parcours est un outil pédagogique : il ne pose aucun diagnostic et ne remplace pas un bilan ni un plan d'accompagnement.</p>
    ${ids.length ? `<div class="field"><label for="charger">Reprendre un dossier existant</label>
      <select id="charger"><option value="">— Choisir —</option>
      ${ids.map((id) => `<option value="${esc(id)}">${esc(dossiers[id].eleve.prenom)} ${esc(dossiers[id].eleve.nom)} — ${esc(dossiers[id].eleve.classe || "")}</option>`).join("")}
      </select></div>` : ""}
    <div class="row">
      <div class="field"><label for="prenom">Prénom</label><input id="prenom" type="text" value="${esc(state.eleve.prenom)}"></div>
      <div class="field"><label for="nom">Nom</label><input id="nom" type="text" value="${esc(state.eleve.nom)}"></div>
    </div>
    <div class="row">
      <div class="field"><label for="classe">Classe</label><input id="classe" type="text" placeholder="ex. 5e, 2de pro…" value="${esc(state.eleve.classe)}"></div>
      <div class="field"><label for="referent">Référent·e</label><input id="referent" type="text" value="${esc(state.eleve.referent)}"></div>
      <div class="field"><label for="date">Date</label><input id="date" type="date" value="${esc(state.eleve.date)}"></div>
    </div>
    <div class="actions"><button type="button" class="primary" id="start">Commencer le positionnement</button></div>`;

  ["prenom", "nom", "classe", "referent", "date"].forEach((k) =>
    s.querySelector("#" + k).addEventListener("input", (e) => { state.eleve[k] = e.target.value; })
  );
  s.querySelector("#start").addEventListener("click", () => {
    if (!state.eleve.prenom.trim() && !state.eleve.nom.trim()) { alert("Indique au moins un prénom ou un nom."); return; }
    if (!state.eleve.date) state.eleve.date = new Date().toISOString().slice(0, 10);
    if (!state.dossierId) state.dossierId = slug(state.eleve.prenom + "-" + state.eleve.nom) + "-" + Date.now().toString(36);
    sauverDossier();
    state.step = "positionnement";
    render(); window.scrollTo(0, 0);
  });
  const ch = s.querySelector("#charger");
  if (ch) ch.addEventListener("change", (e) => {
    const d = dossiers[e.target.value];
    if (!d) return;
    state.dossierId = e.target.value;
    state.eleve = d.eleve; state.reponses = d.reponses || {}; state.suivi = d.suivi || {};
    state.step = "positionnement";
    render(); window.scrollTo(0, 0);
  });
  return s;
}

function renderFil(actuel) {
  const etapes = [["identite", "1 · Dossier"], ["positionnement", "2 · Positionnement"], ["plan", "3 · Plan de travail"]];
  const idx = etapes.findIndex((e) => e[0] === actuel);
  return `<ol class="fil" aria-label="Étapes">${etapes
    .map((e, i) => `<li class="${i < idx ? "done" : i === idx ? "active" : ""}" ${i === idx ? 'aria-current="step"' : ""}>${e[1]}</li>`)
    .join("")}</ol>`;
}

// ------------------------------------------------------------ étape 2 : positionnement
const ECHELLE = [
  { v: 0, label: "Pas encore" },
  { v: 1, label: "Avec de l'aide" },
  { v: 2, label: "Tout seul·e" }
];

function renderPositionnement() {
  const s = document.createElement("section");
  s.innerHTML = `
    ${renderFil("positionnement")}
    <h1>Positionnement</h1>
    <p class="intro">Pour chaque phrase, choisis la réponse qui te ressemble le plus. Il n'y a pas de bonne ou de mauvaise réponse : cela sert seulement à choisir des activités utiles pour toi.</p>`;

  DYS_DATA.forEach((d) => {
    s.insertAdjacentHTML("beforeend", `<h2 class="domaine">${esc(d.label)}</h2>`);
    d.competences.forEach((c) => s.appendChild(carteCompetence(c)));
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  const retour = el(`<button type="button" class="secondary">← Dossier</button>`);
  retour.addEventListener("click", () => { state.step = "identite"; render(); });
  const suite = el(`<button type="button" class="primary" id="suite">Voir mon plan de travail →</button>`);
  suite.disabled = !positionnementComplet();
  suite.addEventListener("click", () => {
    if (!positionnementComplet()) return;
    sauverDossier(); state.step = "plan"; render(); window.scrollTo(0, 0);
  });
  const aide = el(`<p class="aide-suite" id="aide-suite"></p>`);
  actions.append(retour, suite);
  s.append(actions, aide);
  majBoutonSuite(s);
  return s;
}

function majBoutonSuite(s) {
  const btn = s.querySelector("#suite");
  const aide = s.querySelector("#aide-suite");
  if (!btn) return;
  const ok = positionnementComplet();
  btn.disabled = !ok;
  const reste = DYS_DATA.reduce((a, d) => a + d.competences.filter((c) => !niveau(c.id)).length, 0);
  aide.textContent = ok ? "" : `Il reste ${reste} bloc${reste > 1 ? "s" : ""} à compléter.`;
}

function carteCompetence(c) {
  const card = document.createElement("div");
  card.className = "carte";
  const nv = niveau(c.id);
  card.innerHTML = `<h3>${esc(c.label)} ${nv ? `<span class="badge ${nv}">${SYMBOLES_NIVEAU[nv]} ${LIBELLES_NIVEAU[nv]}</span>` : ""}</h3>`;
  c.items.forEach((texte, i) => {
    const cur = (state.reponses[c.id] || [])[i];
    const row = el(`
      <div class="item" role="radiogroup" aria-labelledby="q-${c.id}-${i}">
        <p class="item-q" id="q-${c.id}-${i}">${esc(texte)}</p>
        <div class="echelle">
          ${ECHELLE.map((e) => `<label class="choix ${cur === e.v ? "sel" : ""}"><input type="radio" name="${c.id}-${i}" value="${e.v}" ${cur === e.v ? "checked" : ""}><span>${e.label}</span></label>`).join("")}
        </div>
      </div>`);
    row.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("change", () => {
        if (!state.reponses[c.id]) state.reponses[c.id] = [];
        state.reponses[c.id][i] = Number(inp.value);
        sauverDossier();
        const nouvelle = carteCompetence(c);
        card.replaceWith(nouvelle);
        const rad = nouvelle.querySelector(`input[name="${c.id}-${i}"]:checked`);
        if (rad) rad.focus();
        majBoutonSuite(document.querySelector("main section"));
      })
    );
    card.appendChild(row);
  });
  return card;
}

// ------------------------------------------------------------ étape 3 : plan de travail
function construirePlan() {
  const domaines = [...DYS_DATA].sort((a, b) => a.priorite - b.priorite);
  return domaines.map((d) => {
    const rouges = [], oranges = [], acquis = [];
    d.competences.forEach((c) => {
      const n = niveau(c.id);
      (n === "rouge" ? rouges : n === "orange" ? oranges : acquis).push(c);
    });
    const modules = [
      ...rouges.map((c) => ({ key: c.id + "__remobilisation", competence: c, type: "remobilisation", niveau: "rouge", module: c.modules.remobilisation })),
      ...oranges.map((c) => ({ key: c.id + "__consolidation", competence: c, type: "consolidation", niveau: "orange", module: c.modules.consolidation }))
    ];
    return { domaine: d, modules, acquis };
  });
}

function amenagementsSynthese(plan) {
  const set = new Set();
  plan.forEach((p) => p.modules.forEach((m) => m.module.amenagements.forEach((a) => set.add(a))));
  return [...set];
}

function renderPlan() {
  const plan = construirePlan();
  const total = plan.reduce((a, p) => a + p.modules.length, 0);
  const s = document.createElement("section");
  s.innerHTML = `
    ${renderFil("plan")}
    <h1>Plan de travail</h1>
    <p class="intro">${esc(state.eleve.prenom)} ${esc(state.eleve.nom)}${state.eleve.classe ? " · " + esc(state.eleve.classe) : ""} · ${esc(state.eleve.date)}.
    On commence par des activités pour <strong>remobiliser</strong> (manipuler, jouer, se rassurer) quand c'est « à travailler », puis on <strong>consolide</strong> avec des stratégies quand c'est « en progrès ». Les outils de l'onglet « Outils & jeux » peuvent accompagner chaque module.</p>`;

  if (total === 0) s.insertAdjacentHTML("beforeend", `<div class="vide">Toutes les compétences sont marquées « acquises » : aucun module n'est nécessaire pour l'instant.</div>`);

  plan.forEach((p) => {
    if (!p.modules.length && !p.acquis.length) return;
    s.insertAdjacentHTML("beforeend", `<h2 class="domaine">${esc(p.domaine.label)}</h2>`);
    p.modules.forEach((m) => s.appendChild(carteModule(m)));
    if (p.acquis.length) s.insertAdjacentHTML("beforeend", `<p class="acquis"><span class="badge vert">✓ acquis</span> ${p.acquis.map((c) => esc(c.label)).join(" · ")}</p>`);
  });

  const amen = amenagementsSynthese(plan);
  s.insertAdjacentHTML("beforeend", `
    <h2 class="domaine">Aménagements à proposer</h2>
    <div class="carte">
      <h3>Pour tout le parcours</h3>
      <ul>${AMENAGEMENTS_GENERAUX.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      ${amen.length ? `<h3>Selon les modules retenus</h3><ul>${amen.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
      <p class="note">Ces propositions sont à valider avec l'équipe éducative, la famille et, si besoin, les professionnels qui suivent l'élève.</p>
    </div>`);

  const actions = document.createElement("div");
  actions.className = "actions no-print";
  const retour = el(`<button type="button" class="secondary">← Revoir le positionnement</button>`);
  retour.addEventListener("click", () => { state.step = "positionnement"; render(); });
  const imprimer = el(`<button type="button" class="secondary">Imprimer</button>`);
  imprimer.addEventListener("click", () => window.print());
  const exporter = el(`<button type="button" class="primary">Exporter (.md)</button>`);
  exporter.addEventListener("click", () => exporterMarkdown(plan));
  actions.append(retour, imprimer, exporter);
  s.appendChild(actions);
  return s;
}

function carteModule(m) {
  const sv = state.suivi[m.key] || { fait: false, note: "" };
  const mod = m.module;
  const card = el(`
    <article class="carte module ${m.niveau}">
      <div class="module-tete">
        <h3>${esc(mod.titre)}</h3>
        <span class="badge ${m.niveau}">${m.type === "remobilisation" ? "● Remobilisation" : "◐ Consolidation"}</span>
      </div>
      <p class="meta">Compétence : ${esc(m.competence.label)} · ${esc(mod.duree)}</p>
      <p><strong>Objectif —</strong> ${esc(mod.objectif)}</p>
      <h4>Activités</h4>
      <ul>${mod.activites.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      <h4>Aménagements</h4>
      <ul class="amen">${mod.amenagements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      <p class="meta">Ressources : ${esc(mod.ressources.join(", "))}</p>
      <div class="suivi no-print">
        <label class="check"><input type="checkbox" ${sv.fait ? "checked" : ""}> Module réalisé</label>
        <label class="note-label">Notes de suivi
          <textarea rows="3" placeholder="Ce qui a aidé, ce qui bloque, les réussites…">${esc(sv.note)}</textarea>
        </label>
      </div>
    </article>`);
  card.querySelector('input[type="checkbox"]').addEventListener("change", (e) => {
    state.suivi[m.key] = Object.assign({ fait: false, note: "" }, state.suivi[m.key], { fait: e.target.checked });
    sauverDossier();
  });
  card.querySelector("textarea").addEventListener("blur", (e) => {
    state.suivi[m.key] = Object.assign({ fait: false, note: "" }, state.suivi[m.key], { note: e.target.value });
    sauverDossier();
  });
  return card;
}

function exporterMarkdown(plan) {
  const L = [];
  L.push(`# Parcours Dys · Dyscalculie — ${state.eleve.prenom} ${state.eleve.nom}`, "");
  L.push(`- Classe : ${state.eleve.classe || "—"}`, `- Référent·e : ${state.eleve.referent || "—"}`, `- Date : ${state.eleve.date || "—"}`, "");
  plan.forEach((p) => {
    if (!p.modules.length && !p.acquis.length) return;
    L.push(`## ${p.domaine.label}`, "");
    p.modules.forEach((m) => {
      const sv = state.suivi[m.key] || { fait: false, note: "" };
      L.push(`### ${m.module.titre} (${m.type})`);
      L.push(`- Compétence : ${m.competence.label}`, `- Durée : ${m.module.duree}`, `- Objectif : ${m.module.objectif}`);
      L.push(`- Activités : ${m.module.activites.join(" ; ")}`, `- Aménagements : ${m.module.amenagements.join(" ; ")}`);
      L.push(`- Ressources : ${m.module.ressources.join(", ")}`, `- Réalisé : ${sv.fait ? "oui" : "non"}`);
      if (sv.note) L.push(`- Notes : ${sv.note}`);
      L.push("");
    });
    if (p.acquis.length) L.push(`Acquis : ${p.acquis.map((c) => c.label).join(" ; ")}`, "");
  });
  L.push("## Aménagements généraux", "", ...AMENAGEMENTS_GENERAUX.map((a) => `- ${a}`), "");
  const blob = new Blob([L.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parcours-dys-${slug(state.eleve.prenom + "-" + state.eleve.nom) || "eleve"}.md`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// ------------------------------------------------------------ onglet Outils
function renderOutils() {
  const s = document.createElement("section");
  s.innerHTML = `
    <h1>Outils & jeux</h1>
    <p class="intro">Des outils pour manipuler les nombres, à utiliser en séance ou seul·e. Il n'y a ni note ni chrono imposé.</p>
    <div class="soustabs" role="tablist" aria-label="Outils">
      ${OUTILS.map((o) => `<button type="button" role="tab" class="soustab ${state.outil === o.id ? "active" : ""}" aria-selected="${state.outil === o.id}" data-outil="${o.id}">${o.label}</button>`).join("")}
    </div>
    <div id="zone-outil"></div>`;
  const zone = s.querySelector("#zone-outil");
  const o = OUTILS.find((x) => x.id === state.outil) || OUTILS[0];
  zone.appendChild(o.build());
  s.querySelectorAll(".soustab").forEach((b) =>
    b.addEventListener("click", () => { state.outil = b.dataset.outil; render(); })
  );
  return s;
}

// ------------------------------------------------------------ onglet Aide-mémoire
function renderMemos() {
  const s = document.createElement("section");
  s.innerHTML = `
    <h1>Aide-mémoire</h1>
    <p class="intro">Des repères courts à garder sous les yeux pendant les exercices. Tu peux les imprimer.</p>
    <div class="memos">
      ${DYS_MEMOS.map((m) => `<article class="memo"><h3>${esc(m.titre)}</h3><ul>${m.lignes.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></article>`).join("")}
    </div>
    <div class="actions no-print"><button type="button" class="primary" id="print-memo">Imprimer les aide-mémoire</button></div>`;
  s.querySelector("#print-memo").addEventListener("click", () => window.print());
  return s;
}

// ------------------------------------------------------------ démarrage
appliquerPrefs();
render();

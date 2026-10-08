/**
 * app.js — Logique du générateur de parcours MLDS.
 * Aucune dépendance externe. État persisté en localStorage (par dossier élève).
 */

const SEUILS = { rouge: 0.8, orange: 1.6 }; // moyenne des items (0 à 2)
const STORAGE_KEY = "mlds_dossiers_v1";

const state = {
  view: "parcours",  // parcours | jeux
  jeuOuvert: null,   // null | "expressions" | "calcul" | "memoire"
  step: "identite", // identite | positionnement | plan
  eleve: { nom: "", prenom: "", classe: "", referent: "", date: "" },
  reponses: {},   // { competenceId: [note0, note1, note2] }
  suivi: {},      // { moduleKey: { fait: bool, note: string } }
  dossierId: null
};

// ---------------------------------------------------------------- Storage --
function loadDossiers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveDossier() {
  if (!state.dossierId) return;
  const dossiers = loadDossiers();
  dossiers[state.dossierId] = {
    eleve: state.eleve,
    reponses: state.reponses,
    suivi: state.suivi,
    maj: new Date().toISOString()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dossiers));
  } catch (e) {
    console.warn("Sauvegarde locale impossible :", e);
  }
}

function slug(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// -------------------------------------------------------------- Scoring ---
function competenceNiveau(competenceId) {
  const notes = state.reponses[competenceId];
  if (!notes || notes.some((n) => n === undefined || n === null)) return null;
  const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
  if (moyenne < SEUILS.rouge) return "rouge";
  if (moyenne < SEUILS.orange) return "orange";
  return "vert";
}

function positionnementComplet() {
  for (const domaine of PARCOURS_DATA) {
    for (const c of domaine.competences) {
      if (!competenceNiveau(c.id)) return false;
    }
  }
  return true;
}

// ------------------------------------------------------------- Rendering --
const app = document.getElementById("app");

function render() {
  app.innerHTML = "";
  app.appendChild(renderSidebar());
  const main = document.createElement("main");
  main.className = "main";
  if (state.view === "jeux") {
    main.appendChild(
      renderJeuxSection(state.jeuOuvert, (id) => {
        state.jeuOuvert = id;
        render();
      })
    );
  } else {
    if (state.step === "identite") main.appendChild(renderIdentite());
    if (state.step === "positionnement") main.appendChild(renderPositionnement());
    if (state.step === "plan") main.appendChild(renderPlan());
  }
  app.appendChild(main);
}

function renderSidebar() {
  const aside = document.createElement("aside");
  aside.className = "sidebar";

  const steps = [
    { id: "identite", label: "1 · Dossier élève" },
    { id: "positionnement", label: "2 · Positionnement" },
    { id: "plan", label: "3 · Plan de travail & suivi" }
  ];
  const order = steps.map((s) => s.id);
  const currentIdx = order.indexOf(state.step);

  aside.innerHTML = `
    <p class="brand">Parcours MLDS</p>
    <p class="brand-sub">Remobilisation &amp; consolidation<br>Algèbre · Géométrie · TP cuisine (micro-ondes)</p>
    <div class="tabbar">
      <button type="button" class="tab-btn ${state.view === "parcours" ? "active" : ""}" data-view="parcours">📋 Parcours</button>
      <button type="button" class="tab-btn ${state.view === "jeux" ? "active" : ""}" data-view="jeux">🎲 Jeux &amp; activités</button>
    </div>
    ${
      state.view === "parcours"
        ? `<ul class="stepper">
      ${steps
        .map((s, i) => {
          const cls = i < currentIdx ? "done" : i === currentIdx ? "active" : "";
          return `<li class="${cls}">${s.label}</li>`;
        })
        .join("")}
    </ul>`
        : `<ul class="stepper">
      ${JEUX_LISTE.map(
        (j) => `<li class="${state.jeuOuvert === j.id ? "active" : ""}">${escapeHtml(j.titre)}</li>`
      ).join("")}
    </ul>`
    }
    ${
      state.view === "parcours" && (state.eleve.nom || state.eleve.prenom)
        ? `<div class="eleve-recap"><strong>${escapeHtml(state.eleve.prenom)} ${escapeHtml(state.eleve.nom)}</strong>${state.eleve.classe ? escapeHtml(state.eleve.classe) : ""}${state.eleve.date ? "<br>" + escapeHtml(state.eleve.date) : ""}</div>`
        : ""
    }
  `;

  aside.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      if (state.view === "jeux") state.jeuOuvert = null;
      render();
    });
  });

  return aside;
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str || "";
  return d.innerHTML;
}

// ------------------------------------------------------- Étape 1 : identité
function renderIdentite() {
  const section = document.createElement("section");

  const dossiers = loadDossiers();
  const dossierIds = Object.keys(dossiers);

  section.innerHTML = `
    <h1>Nouveau dossier de positionnement</h1>
    <p class="intro">Renseigne les informations de l'élève avant de démarrer le positionnement. Le parcours généré porte sur les mathématiques : algèbre, géométrie, et des TP de recettes sucrées au micro-ondes pour travailler volumes et proportionnalité en situation concrète.</p>
    ${
      dossierIds.length
        ? `<div class="field" style="max-width:420px">
             <label for="charger">Ou reprendre un dossier existant</label>
             <select id="charger">
               <option value="">— Sélectionner —</option>
               ${dossierIds
                 .map((id) => {
                   const d = dossiers[id];
                   return `<option value="${id}">${escapeHtml(d.eleve.prenom)} ${escapeHtml(d.eleve.nom)} — ${escapeHtml(d.eleve.classe || "")}</option>`;
                 })
                 .join("")}
             </select>
           </div>`
        : ""
    }
    <div class="row">
      <div class="field">
        <label for="prenom">Prénom</label>
        <input id="prenom" type="text" value="${escapeHtml(state.eleve.prenom)}">
      </div>
      <div class="field">
        <label for="nom">Nom</label>
        <input id="nom" type="text" value="${escapeHtml(state.eleve.nom)}">
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label for="classe">Classe / niveau</label>
        <input id="classe" type="text" placeholder="ex. 3e, 2de pro…" value="${escapeHtml(state.eleve.classe)}">
      </div>
      <div class="field">
        <label for="referent">Référent MLDS</label>
        <input id="referent" type="text" value="${escapeHtml(state.eleve.referent)}">
      </div>
      <div class="field">
        <label for="date">Date du positionnement</label>
        <input id="date" type="date" value="${escapeHtml(state.eleve.date)}">
      </div>
    </div>
    <div class="actions">
      <button class="primary" id="btn-start">Commencer le positionnement</button>
    </div>
  `;

  section.querySelector("#btn-start").addEventListener("click", () => {
    state.eleve.prenom = section.querySelector("#prenom").value.trim();
    state.eleve.nom = section.querySelector("#nom").value.trim();
    state.eleve.classe = section.querySelector("#classe").value.trim();
    state.eleve.referent = section.querySelector("#referent").value.trim();
    state.eleve.date = section.querySelector("#date").value || new Date().toISOString().slice(0, 10);
    if (!state.eleve.prenom && !state.eleve.nom) {
      alert("Indique au moins un prénom ou un nom pour créer le dossier.");
      return;
    }
    if (!state.dossierId) {
      state.dossierId = slug(`${state.eleve.prenom}-${state.eleve.nom}-${state.eleve.classe}`) + "-" + Date.now().toString(36);
    }
    saveDossier();
    state.step = "positionnement";
    render();
  });

  const chargerEl = section.querySelector("#charger");
  if (chargerEl) {
    chargerEl.addEventListener("change", (e) => {
      const id = e.target.value;
      if (!id) return;
      const d = dossiers[id];
      state.dossierId = id;
      state.eleve = d.eleve;
      state.reponses = d.reponses || {};
      state.suivi = d.suivi || {};
      state.step = "positionnement";
      render();
    });
  }

  return section;
}

// ------------------------------------------------ Étape 2 : positionnement
function renderPositionnement() {
  const section = document.createElement("section");
  const header = document.createElement("div");
  header.innerHTML = `
    <h1>Positionnement</h1>
    <p class="intro">Pour chaque affirmation, indique le niveau de l'élève : <strong>0</strong> = ne sait pas faire, <strong>1</strong> = sait faire avec aide, <strong>2</strong> = sait faire seul(e). Le niveau de la compétence se calcule automatiquement.</p>
  `;
  section.appendChild(header);

  PARCOURS_DATA.forEach((domaine) => {
    const h = document.createElement("h2");
    h.className = "domaine-title";
    h.textContent = domaine.label;
    section.appendChild(h);

    if (domaine.recettesBonus) section.appendChild(renderRecettesBonus(domaine.recettesBonus));

    domaine.competences.forEach((c) => {
      section.appendChild(renderCompetenceCard(c));
    });
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnRetour = document.createElement("button");
  btnRetour.className = "secondary";
  btnRetour.textContent = "← Retour au dossier";
  btnRetour.addEventListener("click", () => { state.step = "identite"; render(); });

  const btnSuite = document.createElement("button");
  btnSuite.className = "primary";
  btnSuite.textContent = "Générer le plan de travail →";
  btnSuite.disabled = !positionnementComplet();
  btnSuite.title = btnSuite.disabled ? "Renseigne toutes les affirmations pour continuer" : "";
  btnSuite.addEventListener("click", () => {
    if (!positionnementComplet()) return;
    saveDossier();
    state.step = "plan";
    render();
  });

  actions.appendChild(btnRetour);
  actions.appendChild(btnSuite);
  section.appendChild(actions);

  return section;
}

function renderRecettesBonus(recettesBonus) {
  const details = document.createElement("details");
  details.className = "recettes-bonus no-print";
  const summary = document.createElement("summary");
  summary.textContent = "📖 Fiche de recettes bonus (variantes pour les TP)";
  details.appendChild(summary);

  const inner = document.createElement("div");
  inner.className = "recettes-bonus-inner";
  inner.innerHTML = `
    <p class="recettes-chapo">${escapeHtml(recettesBonus.chapo)}</p>
    <div class="recettes-grid">
      ${recettesBonus.recettes
        .map(
          (r) => `
        <div class="recette-card">
          <h4>${escapeHtml(r.titre)}</h4>
          <p class="module-meta">${escapeHtml(r.portions)} · ${escapeHtml(r.duree)}</p>
          <ol>${r.etapes.map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ol>
        </div>`
        )
        .join("")}
    </div>
    <p class="module-meta" style="margin-top:14px"><strong>Conseils de cuisson</strong></p>
    <ul>${recettesBonus.conseils.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
  `;
  details.appendChild(inner);
  return details;
}

function renderCompetenceCard(competence) {
  const card = document.createElement("div");
  card.className = "competence-card";

  const niveau = competenceNiveau(competence.id);
  const badge = niveau
    ? `<span class="niveau-badge ${niveau}">${niveau === "rouge" ? "non maîtrisé" : niveau === "orange" ? "fragile" : "maîtrisé"}</span>`
    : "";

  card.innerHTML = `<h3>${escapeHtml(competence.label)} ${badge}</h3>`;

  competence.items.forEach((itemText, idx) => {
    const row = document.createElement("div");
    row.className = "item-row";
    const current = (state.reponses[competence.id] || [])[idx];
    row.innerHTML = `
      <span class="item-text">${escapeHtml(itemText)}</span>
      <span class="scale" data-competence="${competence.id}" data-idx="${idx}">
        ${[0, 1, 2]
          .map(
            (v) =>
              `<button type="button" data-val="${v}" class="${current === v ? "selected" : ""}">${v}</button>`
          )
          .join("")}
      </span>
    `;
    card.appendChild(row);
  });

  card.querySelectorAll(".scale").forEach((scaleEl) => {
    const compId = scaleEl.dataset.competence;
    const idx = Number(scaleEl.dataset.idx);
    scaleEl.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = Number(btn.dataset.val);
        if (!state.reponses[compId]) state.reponses[compId] = [];
        state.reponses[compId][idx] = val;
        saveDossier();
        render();
        // Remettre le focus proche de l'action pour la navigation clavier
      });
    });
  });

  return card;
}

// --------------------------------------------------- Étape 3 : plan/suivi
function buildPlan() {
  // Retourne un tableau ordonné de modules à travailler, groupés par domaine.
  const domaines = [...PARCOURS_DATA].sort((a, b) => a.priorite - b.priorite);
  const plan = [];

  domaines.forEach((domaine) => {
    const rouges = [];
    const oranges = [];
    const acquis = [];

    domaine.competences.forEach((c) => {
      const niveau = competenceNiveau(c.id);
      if (niveau === "rouge") rouges.push(c);
      else if (niveau === "orange") oranges.push(c);
      else acquis.push(c);
    });

    const modules = [];
    rouges.forEach((c) =>
      modules.push({ key: `${c.id}__remobilisation`, competence: c, type: "remobilisation", niveau: "rouge", module: c.modules.remobilisation })
    );
    oranges.forEach((c) =>
      modules.push({ key: `${c.id}__consolidation`, competence: c, type: "consolidation", niveau: "orange", module: c.modules.consolidation })
    );

    plan.push({ domaine, modules, acquis });
  });

  return plan;
}

function renderPlan() {
  const section = document.createElement("section");
  const plan = buildPlan();
  const totalModules = plan.reduce((acc, d) => acc + d.modules.length, 0);

  const header = document.createElement("div");
  header.innerHTML = `
    <h1>Plan de travail personnalisé</h1>
    <p class="intro">Parcours généré pour ${escapeHtml(state.eleve.prenom)} ${escapeHtml(state.eleve.nom)}${state.eleve.classe ? " · " + escapeHtml(state.eleve.classe) : ""} le ${escapeHtml(state.eleve.date)}. Les modules « remobilisation » précèdent les modules « consolidation », domaine par domaine.</p>
  `;
  section.appendChild(header);

  if (totalModules === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Toutes les compétences positionnées sont maîtrisées : aucun module de remobilisation ou de consolidation n'est nécessaire pour l'instant.";
    section.appendChild(empty);
  }

  plan.forEach(({ domaine, modules, acquis }) => {
    if (modules.length === 0 && acquis.length === 0) return;
    const h = document.createElement("h2");
    h.className = "domaine-title";
    h.textContent = domaine.label;
    section.appendChild(h);

    if (domaine.recettesBonus) section.appendChild(renderRecettesBonus(domaine.recettesBonus));

    modules.forEach((entry) => section.appendChild(renderModuleCard(entry)));

    if (acquis.length) {
      const acquisBox = document.createElement("p");
      acquisBox.innerHTML = `Compétences déjà maîtrisées : <span class="acquis-list" style="display:inline">${acquis.map((c) => escapeHtml(c.label)).join(" · ")}</span>`;
      section.appendChild(acquisBox);
    }
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnRetour = document.createElement("button");
  btnRetour.className = "secondary";
  btnRetour.textContent = "← Revoir le positionnement";
  btnRetour.addEventListener("click", () => { state.step = "positionnement"; render(); });

  const btnPrint = document.createElement("button");
  btnPrint.className = "secondary";
  btnPrint.textContent = "Imprimer la fiche";
  btnPrint.addEventListener("click", () => window.print());

  const btnExport = document.createElement("button");
  btnExport.className = "primary";
  btnExport.textContent = "Exporter la fiche (.md)";
  btnExport.addEventListener("click", () => exportMarkdown(plan));

  actions.appendChild(btnRetour);
  actions.appendChild(btnPrint);
  actions.appendChild(btnExport);
  section.appendChild(actions);

  return section;
}

function renderModuleCard({ key, competence, type, niveau, module }) {
  const card = document.createElement("div");
  card.className = `module-card ${niveau}`;
  const suivi = state.suivi[key] || { fait: false, note: "" };

  card.innerHTML = `
    <div class="module-head">
      <h4>${escapeHtml(module.titre)}</h4>
      <span class="module-type">${type === "remobilisation" ? "REMOBILISATION" : "CONSOLIDATION"}</span>
    </div>
    <p class="module-meta">Compétence : ${escapeHtml(competence.label)} · Durée indicative : ${escapeHtml(module.duree)}</p>
    <p class="objectif"><strong>Objectif —</strong> ${escapeHtml(module.objectif)}</p>
    <ul>${module.activites.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
    <p class="module-meta">Ressources : ${escapeHtml(module.ressources.join(", "))}</p>
    <div class="module-suivi no-print">
      <input type="checkbox" id="fait-${key}" ${suivi.fait ? "checked" : ""}>
      <label for="fait-${key}">Module réalisé</label>
    </div>
    <div class="field notes-field no-print" style="margin-top:10px">
      <label for="note-${key}">Notes de suivi</label>
      <textarea id="note-${key}" placeholder="Observations, freins, réussites…">${escapeHtml(suivi.note)}</textarea>
    </div>
  `;

  card.querySelector(`#fait-${key}`).addEventListener("change", (e) => {
    if (!state.suivi[key]) state.suivi[key] = { fait: false, note: "" };
    state.suivi[key].fait = e.target.checked;
    saveDossier();
  });
  card.querySelector(`#note-${key}`).addEventListener("blur", (e) => {
    if (!state.suivi[key]) state.suivi[key] = { fait: false, note: "" };
    state.suivi[key].note = e.target.value;
    saveDossier();
  });

  return card;
}

// --------------------------------------------------------------- Export --
function exportMarkdown(plan) {
  const lines = [];
  lines.push(`# Parcours MLDS — ${state.eleve.prenom} ${state.eleve.nom}`);
  lines.push("");
  lines.push(`- Classe : ${state.eleve.classe || "—"}`);
  lines.push(`- Référent MLDS : ${state.eleve.referent || "—"}`);
  lines.push(`- Date du positionnement : ${state.eleve.date || "—"}`);
  lines.push("");

  plan.forEach(({ domaine, modules, acquis }) => {
    if (modules.length === 0 && acquis.length === 0) return;
    lines.push(`## ${domaine.label}`);
    lines.push("");
    if (domaine.recettesBonus) {
      lines.push(`_${domaine.recettesBonus.chapo}_`);
      lines.push("");
      domaine.recettesBonus.recettes.forEach((r) => {
        lines.push(`- **${r.titre}** (${r.portions}, ${r.duree}) : ${r.etapes.join(" ; ")}`);
      });
      lines.push("");
      lines.push(`Conseils : ${domaine.recettesBonus.conseils.join(" ; ")}`);
      lines.push("");
    }
    modules.forEach(({ key, competence, type, module }) => {
      const suivi = state.suivi[key] || { fait: false, note: "" };
      lines.push(`### ${module.titre} (${type === "remobilisation" ? "remobilisation" : "consolidation"})`);
      lines.push(`- Compétence : ${competence.label}`);
      lines.push(`- Durée indicative : ${module.duree}`);
      lines.push(`- Objectif : ${module.objectif}`);
      lines.push(`- Activités : ${module.activites.join(" ; ")}`);
      lines.push(`- Ressources : ${module.ressources.join(", ")}`);
      lines.push(`- Réalisé : ${suivi.fait ? "oui" : "non"}`);
      if (suivi.note) lines.push(`- Notes : ${suivi.note}`);
      lines.push("");
    });
    if (acquis.length) {
      lines.push(`Compétences déjà maîtrisées : ${acquis.map((c) => c.label).join(" ; ")}`);
      lines.push("");
    }
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parcours-mlds-${slug(state.eleve.prenom + "-" + state.eleve.nom) || "eleve"}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ------------------------------------------------------------------ Init --
render();

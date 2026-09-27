/* script.js — Moyennes par automatisme et par élève
   Réutilise le même projet Supabase que le reste de PlayLab (js/supabase.js). */

// ==============================
//   CONFIG — à ajuster si besoin
// ==============================
const SUPABASE_URL = "https://obsqakmhtvfuwnoxoksr.supabase.co";
const SUPABASE_KEY = "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu";
const TABLE_NAME = "quiz_sessions";

// Seuls les statuts listés ici sont pris en compte dans les moyennes
// (une session en cours ou abandonnée n'a pas de score exploitable).
// Confirmé via le schéma Supabase : status ∈ {en_cours, termine, abandonne}.
const STATUTS_VALIDES = ["termine"];

// Schéma confirmé via le connecteur Supabase (table quiz_sessions) :
// id, nom, prenom, quiz, categorie, device_id, started_at, ended_at,
// score, total, note_10, note_20, playmaths_points, status.
const COLS = {
  nom: ["nom", "name", "last_name", "lastname"],
  prenom: ["prenom", "prénom", "first_name", "firstname"],
  activite: ["categorie", "activite", "activité", "type_activite", "category"],
  quiz: ["quiz", "nom_quiz", "activite_nom", "titre_quiz", "quiz_nom", "nom_activite", "nom_du_quiz"],
  statut: ["status", "statut"],
  date: ["started_at", "date", "created_at", "date_debut", "debut"],
  note10: ["note_10", "note10"],
  scoreText: ["score", "note", "resultat", "résultat"],
  scoreNum: ["score", "bonnes_reponses", "nb_bonnes", "correct_count", "note_obtenue"],
  scoreTotal: ["total", "score_total", "note_sur", "total_questions", "nb_questions", "nombre_questions"],
};

let supabaseClient = null;
let allRows = [];
let refreshTimer = null;

// ==============================
//   OUTILS DE LECTURE FLEXIBLE
// ==============================
function pick(row, candidates) {
  for (const key of candidates) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return null;
}

function normStr(v) {
  return (v || "").toString().trim();
}

function titleCase(s) {
  s = normStr(s);
  if (!s) return s;
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Extrait un code d'automatisme/module en tête du libellé du quiz,
// ex: "B 03 - Lecture de graphiques…" -> code "B03", intitulé le reste.
function parseQuizLabel(raw) {
  const label = normStr(raw);
  const m = label.match(/^([A-Za-z]{1,3}\s?\d{1,3})\s*[-–:]?\s*(.*)$/);
  if (m) {
    return {
      code: m[1].replace(/\s+/g, "").toUpperCase(),
      intitule: m[2] || label,
    };
  }
  return { code: label || "—", intitule: label || "—" };
}

// Renvoie le score ramené sur 10 (nombre) ou null si non exploitable.
// Priorité à note_10 (déjà calculée côté Supabase), puis score/total,
// puis en dernier recours un champ texte du type "8/10".
function parseScoreSur10(row) {
  const note10 = pick(row, COLS.note10);
  if (note10 !== null && !isNaN(parseFloat(note10))) {
    return parseFloat(note10);
  }

  const num = pick(row, COLS.scoreNum);
  const den = pick(row, COLS.scoreTotal);
  if (num !== null && den !== null && parseFloat(den) > 0 && !isNaN(parseFloat(num))) {
    return (parseFloat(num) / parseFloat(den)) * 10;
  }

  const txt = pick(row, COLS.scoreText);
  if (txt !== null) {
    const m = txt.toString().match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (m) {
      const n = parseFloat(m[1]);
      const d = parseFloat(m[2]);
      if (d > 0) return (n / d) * 10;
    }
  }
  return null;
}

function isStatutValide(row) {
  const statut = normStr(pick(row, COLS.statut)).toLowerCase();
  if (!statut) return true; // pas de colonne statut -> on ne filtre pas
  return STATUTS_VALIDES.includes(statut);
}

function rowDate(row) {
  const d = pick(row, COLS.date);
  if (!d) return null;
  const parsed = new Date(d);
  return isNaN(parsed) ? null : parsed;
}

// ==============================
//   CHARGEMENT DES DONNÉES
// ==============================
async function initSupabase() {
  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseClient;
}

async function loadData() {
  const loadingMsg = document.getElementById("loadingMsg");
  const errorMsg = document.getElementById("errorMsg");
  const table = document.getElementById("resultsTable");

  loadingMsg.style.display = "block";
  errorMsg.style.display = "none";
  table.style.display = "none";

  try {
    const client = await initSupabase();
    const { data, error } = await client.from(TABLE_NAME).select("*");
    if (error) throw error;

    allRows = (data || []).filter(isStatutValide).filter((r) => parseScoreSur10(r) !== null);

    populateFilterOptions();
    renderAll();
  } catch (err) {
    console.error(err);
    errorMsg.textContent =
      "Impossible de charger les résultats (" +
      (err.message || err) +
      "). Vérifiez le nom de la table/des colonnes en tête de script.js.";
    errorMsg.style.display = "block";
  } finally {
    loadingMsg.style.display = "none";
  }
}

// ==============================
//   FILTRES
// ==============================
function populateFilterOptions() {
  const activiteSel = document.getElementById("filterActivite");
  const codeSel = document.getElementById("filterCode");

  const activites = new Set();
  const codes = new Set();

  allRows.forEach((row) => {
    const act = normStr(pick(row, COLS.activite));
    if (act) activites.add(act);
    const { code } = parseQuizLabel(pick(row, COLS.quiz));
    if (code) codes.add(code);
  });

  const prevActivite = activiteSel.value;
  const prevCode = codeSel.value;

  activiteSel.innerHTML = '<option value="">Toutes</option>';
  [...activites].sort().forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    activiteSel.appendChild(opt);
  });
  // Par défaut on se concentre sur "Automatisme" si cette activité existe
  if (!prevActivite && [...activites].some((a) => /automatisme/i.test(a))) {
    activiteSel.value = [...activites].find((a) => /automatisme/i.test(a));
  } else {
    activiteSel.value = prevActivite;
  }

  codeSel.innerHTML = '<option value="">Tous</option>';
  [...codes].sort().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    codeSel.appendChild(opt);
  });
  codeSel.value = prevCode;
}

function getFilteredRows() {
  const activite = document.getElementById("filterActivite").value;
  const code = document.getElementById("filterCode").value;
  const eleve = normStr(document.getElementById("filterEleve").value).toLowerCase();
  const dateFrom = document.getElementById("filterDateFrom").value;
  const dateTo = document.getElementById("filterDateTo").value;

  return allRows.filter((row) => {
    if (activite && normStr(pick(row, COLS.activite)) !== activite) return false;

    const { code: rowCode } = parseQuizLabel(pick(row, COLS.quiz));
    if (code && rowCode !== code) return false;

    if (eleve) {
      const full = (normStr(pick(row, COLS.nom)) + " " + normStr(pick(row, COLS.prenom))).toLowerCase();
      if (!full.includes(eleve)) return false;
    }

    const d = rowDate(row);
    if (dateFrom && d && d < new Date(dateFrom)) return false;
    if (dateTo && d) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }

    return true;
  });
}

// ==============================
//   AGRÉGATION
// ==============================
function computeGroups(rows) {
  const groups = new Map();

  rows.forEach((row) => {
    const nom = titleCase(pick(row, COLS.nom));
    const prenom = titleCase(pick(row, COLS.prenom));
    const { code, intitule } = parseQuizLabel(pick(row, COLS.quiz));
    const score = parseScoreSur10(row);
    if (score === null) return;

    const key = nom.toLowerCase() + "|" + prenom.toLowerCase() + "|" + code;
    if (!groups.has(key)) {
      groups.set(key, { nom, prenom, code, intitule, scores: [] });
    }
    groups.get(key).scores.push(Math.round(score * 100) / 100);
  });

  return [...groups.values()].map((g) => {
    const moyenne = g.scores.reduce((a, b) => a + b, 0) / g.scores.length;
    return {
      ...g,
      tentatives: g.scores.length,
      moyenne: Math.round(moyenne * 100) / 100,
    };
  });
}

let sortState = { key: "nom", dir: 1 };

function sortGroups(groups) {
  const { key, dir } = sortState;
  return groups.slice().sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (typeof va === "string") {
      return va.localeCompare(vb) * dir;
    }
    return (va - vb) * dir;
  });
}

// ==============================
//   RENDU
// ==============================
function moyClass(m) {
  if (m >= 7) return "good";
  if (m >= 5) return "mid";
  return "low";
}

function renderTable(groups) {
  const tbody = document.getElementById("resultsBody");
  const table = document.getElementById("resultsTable");
  const emptyMsg = document.getElementById("emptyMsg");

  tbody.innerHTML = "";

  if (groups.length === 0) {
    table.style.display = "none";
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  table.style.display = "table";

  groups.forEach((g) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.nom}</td>
      <td>${g.prenom}</td>
      <td><span class="pill">${g.code}</span></td>
      <td>${g.intitule}</td>
      <td>${g.tentatives}</td>
      <td><span class="moy ${moyClass(g.moyenne)}">${g.moyenne.toFixed(2)} / 10</span></td>
      <td class="detail-scores">${g.scores.map((s) => s.toFixed(1)).join(" · ")}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStats(groups) {
  const eleves = new Set(groups.map((g) => g.nom + "|" + g.prenom));
  const automatismes = new Set(groups.map((g) => g.code));
  const tentatives = groups.reduce((sum, g) => sum + g.tentatives, 0);
  const moyGen =
    groups.length > 0 ? groups.reduce((sum, g) => sum + g.moyenne, 0) / groups.length : null;

  document.getElementById("statEleves").textContent = eleves.size;
  document.getElementById("statAutomatismes").textContent = automatismes.size;
  document.getElementById("statTentatives").textContent = tentatives;
  document.getElementById("statMoyGen").textContent = moyGen !== null ? moyGen.toFixed(2) : "–";
}

function renderAll() {
  const filtered = getFilteredRows();
  const groups = sortGroups(computeGroups(filtered));
  renderStats(groups);
  renderTable(groups);
}

// ==============================
//   EXPORT CSV
// ==============================
function exportCsv() {
  const filtered = getFilteredRows();
  const groups = sortGroups(computeGroups(filtered));

  const header = ["Nom", "Prenom", "Automatisme", "Intitule", "Tentatives", "Moyenne_sur_10", "Scores"];
  const lines = [header.join(";")];

  groups.forEach((g) => {
    lines.push(
      [
        g.nom,
        g.prenom,
        g.code,
        `"${g.intitule.replace(/"/g, '""')}"`,
        g.tentatives,
        g.moyenne.toFixed(2),
        g.scores.map((s) => s.toFixed(1)).join(" "),
      ].join(";")
    );
  });

  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moyennes_automatismes.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ==============================
//   ÉVÉNEMENTS
// ==============================
function setupSortHeaders() {
  document.querySelectorAll("#resultsTable thead th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (sortState.key === key) {
        sortState.dir *= -1;
      } else {
        sortState = { key, dir: 1 };
      }
      renderAll();
    });
  });
}

function setupAutoRefresh() {
  const checkbox = document.getElementById("autoRefresh");
  function apply() {
    if (refreshTimer) clearInterval(refreshTimer);
    if (checkbox.checked) {
      refreshTimer = setInterval(loadData, 30000);
    }
  }
  checkbox.addEventListener("change", apply);
  apply();
}

function setupEvents() {
  ["filterActivite", "filterCode", "filterEleve", "filterDateFrom", "filterDateTo"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderAll);
    document.getElementById(id).addEventListener("change", renderAll);
  });
  document.getElementById("btnRefresh").addEventListener("click", loadData);
  document.getElementById("btnExport").addEventListener("click", exportCsv);
  setupSortHeaders();
  setupAutoRefresh();
}

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  loadData();
});
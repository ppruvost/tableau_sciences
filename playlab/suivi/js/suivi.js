// =====================================================================
// Tableau de suivi en direct — élèves en train de faire un automatisme,
// un PlayMaths ou un PlaySciences.
// =====================================================================

const CATEGORIE_LABELS = {
  automatisme: "Automatisme",
  playmaths: "PlayMaths",
  playsciences: "PlaySciences",
  autre: "Autre",
};

let suiviSessionsBrutes = [];
let suiviPollInterval = null;

const els = {};

document.addEventListener("DOMContentLoaded", () => {

  els.date = document.getElementById("filtre-date");
  els.categorie = document.getElementById("filtre-categorie");
  els.recherche = document.getElementById("filtre-recherche");
  els.seuil = document.getElementById("filtre-seuil");
  els.auto = document.getElementById("filtre-auto");
  els.btnRefresh = document.getElementById("btn-refresh");
  els.tbody = document.getElementById("tbody-sessions");
  els.vide = document.getElementById("etat-vide");
  els.statCours = document.getElementById("stat-cours");
  els.statTermine = document.getElementById("stat-termine");
  els.statAbandon = document.getElementById("stat-abandon");
  els.maj = document.getElementById("derniere-maj");

  // Date du jour par défaut (fuseau local)
  els.date.value = formatDateInput(new Date());

  els.date.addEventListener("change", chargerEtAfficher);
  els.categorie.addEventListener("change", afficher);
  els.recherche.addEventListener("input", afficher);
  els.seuil.addEventListener("change", afficher);
  els.btnRefresh.addEventListener("click", chargerEtAfficher);
  els.auto.addEventListener("change", gererAutoRefresh);

  chargerEtAfficher();
  gererAutoRefresh();

});

function formatDateInput(d) {
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function gererAutoRefresh() {

  if (suiviPollInterval) {
    clearInterval(suiviPollInterval);
    suiviPollInterval = null;
  }

  if (els.auto.checked) {
    suiviPollInterval = setInterval(chargerEtAfficher, 5000);
  }
}

async function chargerEtAfficher() {

  const [annee, mois, jour] = els.date.value.split("-").map(Number);

  const debut = new Date(annee, mois - 1, jour, 0, 0, 0);
  const fin = new Date(annee, mois - 1, jour + 1, 0, 0, 0);

  const resultat = await suiviChargerSessions(debut.toISOString(), fin.toISOString());

  if (resultat === null) {
    els.maj.textContent = "⚠️ Connexion impossible — dernières données affichées";
    return;
  }

  suiviSessionsBrutes = resultat;

  const maintenant = new Date();
  els.maj.textContent =
    `Actualisé à ${maintenant.toLocaleTimeString("fr-FR")}`;

  afficher();
}

// Calcule le statut affiché : 'termine' | 'abandonne' | 'encours'
// Un statut 'en_cours' en base est requalifié en 'abandonne' à l'affichage
// si aucune fin n'est arrivée au-delà du seuil choisi (sécurité en cas de
// fermeture d'appareil sans signal réseau).
function statutAffiche(session, seuilMinutes) {

  if (session.status === "termine") return "termine";
  if (session.status === "abandonne") return "abandonne";

  const debut = new Date(session.started_at);
  const minutesEcoulees = (Date.now() - debut.getTime()) / 60000;

  if (minutesEcoulees > seuilMinutes) return "abandonne";

  return "encours";
}

function afficher() {

  const filtreCategorie = els.categorie.value;
  const filtreTexte = els.recherche.value.trim().toLowerCase();
  const seuilMinutes = parseInt(els.seuil.value, 10) || 15;

  let lignes = suiviSessionsBrutes.map(s => ({
    ...s,
    statutCalcule: statutAffiche(s, seuilMinutes),
  }));

  if (filtreCategorie !== "tous") {
    lignes = lignes.filter(s => s.categorie === filtreCategorie);
  }

  if (filtreTexte) {
    lignes = lignes.filter(s =>
      (s.nom || "").toLowerCase().includes(filtreTexte) ||
      (s.prenom || "").toLowerCase().includes(filtreTexte)
    );
  }

  // Tri : élèves en cours d'abord (les plus anciens en tête, donc les plus
  // proches d'un abandon en haut de liste), puis le reste par heure de
  // début décroissante.
  lignes.sort((a, b) => {
    const aCours = a.statutCalcule === "encours" ? 0 : 1;
    const bCours = b.statutCalcule === "encours" ? 0 : 1;
    if (aCours !== bCours) return aCours - bCours;

    if (aCours === 0) {
      return new Date(a.started_at) - new Date(b.started_at);
    }
    return new Date(b.started_at) - new Date(a.started_at);
  });

  // Compteurs (sur l'ensemble filtré par catégorie/recherche, avant tri)
  const nbCours = lignes.filter(s => s.statutCalcule === "encours").length;
  const nbTermine = lignes.filter(s => s.statutCalcule === "termine").length;
  const nbAbandon = lignes.filter(s => s.statutCalcule === "abandonne").length;

  els.statCours.textContent = nbCours;
  els.statTermine.textContent = nbTermine;
  els.statAbandon.textContent = nbAbandon;

  rendreTableau(lignes);
}

function heure(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dateJour(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function duree(session) {

  const debut = new Date(session.started_at).getTime();
  const finRef = session.ended_at ? new Date(session.ended_at).getTime() : Date.now();

  const totalSecondes = Math.max(0, Math.round((finRef - debut) / 1000));
  const min = Math.floor(totalSecondes / 60);
  const sec = totalSecondes % 60;

  return `${min} min ${String(sec).padStart(2, "0")} s`;
}

function badgeStatut(statutCalcule) {

  const config = {
    termine:   { classe: "termine",   texte: "Terminé" },
    abandonne: { classe: "abandonne", texte: "Abandonné" },
    encours:   { classe: "encours",   texte: "En cours" },
  }[statutCalcule];

  return `<span class="statut ${config.classe}"><span class="dot"></span>${config.texte}</span>`;
}

function rendreTableau(lignes) {

  if (!lignes.length) {
    els.tbody.innerHTML = "";
    els.vide.style.display = "block";
    return;
  }

  els.vide.style.display = "none";

  els.tbody.innerHTML = lignes.map(s => {

    const catLabel = CATEGORIE_LABELS[s.categorie] || CATEGORIE_LABELS.autre;
    const catClasse = CATEGORIE_LABELS[s.categorie] ? s.categorie : "autre";

    const scoreHtml = (s.note_10 !== null && s.note_10 !== undefined)
      ? `<div class="score-note">${s.note_10}/10</div><div class="score-pts">${s.playmaths_points ?? 0} pts PlayMaths</div>`
      : `<div class="score-pts">—</div>`;

    const rowClasse = s.statutCalcule === "encours" ? "row-cours" : "";

    return `
      <tr class="${rowClasse}">
        <td><span class="eleve-nom">${escapeHtml(s.nom)}</span></td>
        <td><span class="eleve-prenom">${escapeHtml(s.prenom)}</span></td>
        <td><span class="badge-cat ${catClasse}">${catLabel}</span></td>
        <td><span class="quiz-title" title="${escapeHtml(s.quiz)}">${escapeHtml(s.quiz)}</span></td>
        <td>${dateJour(s.started_at)}</td>
        <td>${heure(s.started_at)}</td>
        <td>${heure(s.ended_at)}</td>
        <td>${duree(s)}</td>
        <td>${scoreHtml}</td>
        <td>${badgeStatut(s.statutCalcule)}</td>
      </tr>
    `;

  }).join("");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
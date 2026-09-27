// =====================================================================
// Suivi Memory — reconstitue, pour chaque pseudo connecté, la dernière
// manche répondue, et déduit un statut (en cours / terminé / abandonné).
// Anonyme : seul le pseudo choisi par l'élève est affiché, comme dans
// le jeu lui-même — aucune identité n'est collectée.
// =====================================================================

const memoryRoundsById = {};
(window.MEMORY_ROUNDS || []).forEach(r => { memoryRoundsById[r.id] = r; });
const TOTAL_ROUNDS = (window.MEMORY_ROUNDS || []).length;

let participantsBruts = [];
let reponsesBrutes = [];
let currentRound = -1;
let pollInterval = null;

const els = {};

document.addEventListener("DOMContentLoaded", () => {

  els.seuilJamais = document.getElementById("filtre-seuil-jamais");
  els.seuilArret = document.getElementById("filtre-seuil-arret");
  els.auto = document.getElementById("filtre-auto");
  els.btnRefresh = document.getElementById("btn-refresh");
  els.tbody = document.getElementById("tbody-participants");
  els.vide = document.getElementById("etat-vide");
  els.statCours = document.getElementById("stat-cours");
  els.statTermine = document.getElementById("stat-termine");
  els.statAbandon = document.getElementById("stat-abandon");
  els.maj = document.getElementById("derniere-maj");
  els.rondeActuelle = document.getElementById("ronde-actuelle");

  els.seuilJamais.addEventListener("change", afficher);
  els.seuilArret.addEventListener("change", afficher);
  els.btnRefresh.addEventListener("click", chargerEtAfficher);
  els.auto.addEventListener("change", gererAutoRefresh);

  chargerEtAfficher();
  gererAutoRefresh();

});

function gererAutoRefresh() {

  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }

  if (els.auto.checked) {
    pollInterval = setInterval(chargerEtAfficher, 4000);
  }
}

async function chargerEtAfficher() {

  const [participants, reponses, round] = await Promise.all([
    memoryGetParticipants(),
    memoryGetAllReponses(),
    memoryGetSessionRound(),
  ]);

  if (participants === null || reponses === null) {
    els.maj.textContent = "⚠️ Connexion impossible — dernières données affichées";
    return;
  }

  participantsBruts = participants;
  reponsesBrutes = reponses;
  currentRound = round;

  els.maj.textContent = `Actualisé à ${new Date().toLocaleTimeString("fr-FR")}`;

  afficher();
}

function libelleRonde(id) {
  if (id === -1) return "En attente du lancement";
  if (id === 9999) return "Séance terminée";
  const r = memoryRoundsById[id];
  return r ? `${r.block} — ${r.label}` : `Manche ${id}`;
}

function afficher() {

  els.rondeActuelle.textContent = libelleRonde(currentRound);

  const seuilJamais = parseInt(els.seuilJamais.value, 10) || 3;
  const seuilArret = parseInt(els.seuilArret.value, 10) || 3;

  // Regroupe les réponses par pseudo
  const parPseudo = {};
  reponsesBrutes.forEach(r => {
    const p = r.pseudo || "(anonyme)";
    if (!parPseudo[p]) parPseudo[p] = [];
    parPseudo[p].push(r);
  });

  // Manche de référence pour mesurer un écart :
  // - si la séance est terminée (9999), on compare à la toute dernière manche
  // - sinon, à la manche en cours
  const referenceIndex = currentRound === 9999 ? TOTAL_ROUNDS - 1 : currentRound;

  const lignes = participantsBruts.map(part => {

    const reps = parPseudo[part.pseudo] || [];
    const bonnes = reps.filter(r => r.correcte).length;
    const total = reps.length;
    const dernierIndex = total ? Math.max(...reps.map(r => r.manche)) : null;

    let statut;

    if (currentRound === -1) {
      statut = "attente"; // séance pas encore lancée : personne n'est en retard
    } else if (dernierIndex === null) {
      statut = referenceIndex >= seuilJamais ? "abandonne" : "encours";
    } else {
      const ecart = referenceIndex - dernierIndex;
      if (ecart >= seuilArret) {
        statut = "abandonne";
      } else if (currentRound === 9999) {
        statut = "termine";
      } else {
        statut = "encours";
      }
    }

    return {
      pseudo: part.pseudo,
      joined_at: part.joined_at,
      bonnes,
      total,
      dernierIndex,
      statut,
    };
  });

  // Tri : les cas à surveiller (abandon) d'abord, puis alphabétique
  const ordre = { abandonne: 0, encours: 1, attente: 1, termine: 2 };
  lignes.sort((a, b) => {
    if (ordre[a.statut] !== ordre[b.statut]) return ordre[a.statut] - ordre[b.statut];
    return (a.pseudo || "").localeCompare(b.pseudo || "");
  });

  els.statCours.textContent = lignes.filter(l => l.statut === "encours" || l.statut === "attente").length;
  els.statTermine.textContent = lignes.filter(l => l.statut === "termine").length;
  els.statAbandon.textContent = lignes.filter(l => l.statut === "abandonne").length;

  rendreTableau(lignes);
}

function heure(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function badgeStatut(statut) {

  const config = {
    termine:   { classe: "termine",   texte: "A joué jusqu'au bout" },
    abandonne: { classe: "abandonne", texte: "Ne répond plus" },
    encours:   { classe: "encours",   texte: "En cours" },
    attente:   { classe: "encours",   texte: "Connecté, en attente" },
  }[statut];

  return `<span class="statut ${config.classe}"><span class="dot"></span>${config.texte}</span>`;
}

function rendreTableau(lignes) {

  if (!lignes.length) {
    els.tbody.innerHTML = "";
    els.vide.style.display = "block";
    return;
  }

  els.vide.style.display = "none";

  els.tbody.innerHTML = lignes.map(l => {

    const rowClasse = (l.statut === "encours" || l.statut === "attente") ? "row-cours" : "";
    const dernierLabel = l.dernierIndex === null ? "—" : libelleRonde(l.dernierIndex);
    const scoreLabel = l.total ? `${l.bonnes}/${l.total} bonnes` : "—";

    return `
      <tr class="${rowClasse}">
        <td><span class="eleve-nom">${escapeHtml(l.pseudo)}</span></td>
        <td>${heure(l.joined_at)}</td>
        <td>${escapeHtml(dernierLabel)}</td>
        <td>${scoreLabel}</td>
        <td>${badgeStatut(l.statut)}</td>
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
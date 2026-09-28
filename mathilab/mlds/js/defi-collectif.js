/* ============================================================
   DÉFI COLLECTIF — moteur du pavage
   Inspiré du problème « Paver la cuisine » (GIGANT, 2021).
   Aucune validation automatique de « bonne réponse » : l'élève
   manipule, constate, et discute sa conjecture avec son groupe
   ou son professeur — conformément à la posture d'accompagnement
   décrite dans le mémoire (guider sans donner la solution).
   ============================================================ */

const $ = (id) => document.getElementById(id);

const PALETTE = ["#4338CA", "#0EA5E9", "#F4A300", "#34A853", "#E85D4B", "#8B5CF6", "#D97706", "#059669"];

let taille = 3;
let mugIndex = 4;          // centre d'une grille 3x3
let dominoes = [];         // [{a, b, couleur}]
let selection = null;
let modePlacementMug = false;

const grilleEl   = $("grille-defi");
const statutEl   = $("statut-grille");
const messageEl  = $("message-defi");


/* ============================================================
   OUTILS DE GRILLE
   ============================================================ */

function ligne(i) { return Math.floor(i / taille); }
function colonne(i) { return i % taille; }

function adjacentes(i, j) {
  if (ligne(i) === ligne(j) && Math.abs(colonne(i) - colonne(j)) === 1) return true;
  if (colonne(i) === colonne(j) && Math.abs(ligne(i) - ligne(j)) === 1) return true;
  return false;
}

function dominoDe(i) {
  return dominoes.find((d) => d.a === i || d.b === i) || null;
}


/* ============================================================
   RENDU
   ============================================================ */

function dessiner() {
  grilleEl.style.gridTemplateColumns = `repeat(${taille}, 1fr)`;
  grilleEl.innerHTML = "";

  for (let i = 0; i < taille * taille; i++) {
    const cellule = document.createElement("div");
    cellule.className = "case-defi";
    cellule.setAttribute("role", "button");
    cellule.setAttribute("tabindex", "0");

    if (i === mugIndex) {
      cellule.classList.add("mug");
      cellule.innerHTML = '<i class="fa-solid fa-mug-hot"></i>';
      cellule.setAttribute("aria-label", "Case du four à micro-ondes (bloquée)");
    } else {
      const d = dominoDe(i);
      if (d) {
        cellule.style.background = PALETTE[d.couleur % PALETTE.length];
        cellule.style.borderColor = PALETTE[d.couleur % PALETTE.length];
      }
      if (i === selection) cellule.classList.add("selectionnee");
      cellule.setAttribute("aria-label", `Case ${i + 1}`);
    }

    cellule.addEventListener("click", () => clicCase(i));
    cellule.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clicCase(i); }
    });

    grilleEl.appendChild(cellule);
  }

  const casesLibres = taille * taille - 1 - dominoes.length * 2;
  statutEl.textContent =
    `Plan de travail ${taille}×${taille} — ${dominoes.length} plat(s) posé(s) — ` +
    `${casesLibres} case(s) encore libre(s) sur ${taille * taille - 1}.`;
}


/* ============================================================
   INTERACTIONS
   ============================================================ */

function clicCase(i) {

  if (modePlacementMug) {
    if (i !== mugIndex) {
      mugIndex = i;
      dominoes = [];
      selection = null;
      modePlacementMug = false;
      messageEl.textContent = "Le four a été déplacé. Les plats précédents ont été retirés.";
      dessiner();
    }
    return;
  }

  if (i === mugIndex) return;

  // Case déjà occupée par un domino → on le retire (pratique pour recommencer)
  const d = dominoDe(i);
  if (d) {
    dominoes = dominoes.filter((x) => x !== d);
    messageEl.textContent = "Plat retiré.";
    dessiner();
    return;
  }

  if (selection === null) {
    selection = i;
    messageEl.textContent = "Choisis une case libre juste à côté pour poser le plat (2 cases).";
    dessiner();
    return;
  }

  if (selection === i) {
    selection = null;
    messageEl.textContent = "";
    dessiner();
    return;
  }

  if (adjacentes(selection, i)) {
    dominoes.push({ a: selection, b: i, couleur: dominoes.length });
    selection = null;
    messageEl.textContent = "";
  } else {
    selection = i;
    messageEl.textContent = "Choisis une case libre juste à côté (pas en diagonale) pour poser le plat.";
  }

  dessiner();
}


/* ============================================================
   CONTRÔLES
   ============================================================ */

function changerTaille(nouvelleTaille) {
  taille = nouvelleTaille;
  mugIndex = Math.floor((taille * taille) / 2);
  dominoes = [];
  selection = null;
  modePlacementMug = false;
  messageEl.textContent = "";

  document.querySelectorAll("[data-taille]").forEach((btn) => {
    btn.classList.toggle("actif", Number(btn.dataset.taille) === taille);
  });

  dessiner();
}

$("btn-taille-3")?.addEventListener("click", () => changerTaille(3));
$("btn-taille-5")?.addEventListener("click", () => changerTaille(5));

$("btn-deplacer-four")?.addEventListener("click", () => {
  modePlacementMug = true;
  selection = null;
  messageEl.textContent = "Clique sur la case où tu veux placer le four à micro-ondes.";
});

$("btn-effacer-plats")?.addEventListener("click", () => {
  dominoes = [];
  selection = null;
  messageEl.textContent = "Tous les plats ont été retirés.";
  dessiner();
});


/* ============================================================
   INITIALISATION
   ============================================================ */

document.querySelector('[data-taille="3"]')?.classList.add("actif");
dessiner();

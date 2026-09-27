/* ============================================================
   MLDS MATHS — MOTEUR DE L'APPLICATION
   Conçu pour des élèves en remobilisation : un écran = une seule
   tâche, boutons larges, aucune pénalité, feedback immédiat et
   bienveillant, possibilité de revenir en arrière à tout moment.
   ============================================================ */

const $ = (id) => document.getElementById(id);

const vueAccueil   = $("vue-accueil");
const vueAtelier    = $("vue-atelier");
const vueRecap      = $("vue-recap");

const grilleAteliers = $("grille-ateliers");

let atelierCourant = null;
let indexQuestion  = 0;
let reponses       = []; // true/false par question


/* ============================================================
   ACCUEIL — GÉNÉRATION DES CARTES
   ============================================================ */

function construireAccueil() {
  grilleAteliers.innerHTML = "";

  ATELIERS.forEach((atelier) => {
    const carte = document.createElement("button");
    carte.type = "button";
    carte.className = `carte-atelier ${atelier.couleur}`;
    carte.setAttribute("aria-label", `Ouvrir l'atelier ${atelier.titre}`);
    carte.innerHTML = `
      <i class="fa-solid ${atelier.icone}"></i>
      <span class="carte-souscat">${atelier.sousTitre}</span>
      <span class="carte-titre">${atelier.titre}</span>
      <span class="carte-nb">${atelier.questions.length} questions</span>
    `;
    carte.addEventListener("click", () => demarrerAtelier(atelier.id));
    grilleAteliers.appendChild(carte);
  });
}


/* ============================================================
   DÉMARRAGE D'UN ATELIER
   ============================================================ */

function demarrerAtelier(id) {
  atelierCourant = ATELIERS.find((a) => a.id === id);
  if (!atelierCourant) return;

  indexQuestion = 0;
  reponses = [];

  $("atelier-titre").textContent = atelierCourant.titre;
  $("atelier-sous-titre").textContent = atelierCourant.sousTitre;
  $("atelier-intro").textContent = atelierCourant.intro;

  vueAtelier.dataset.couleur = atelierCourant.couleur;

  afficherIntroOuQuestion(true);

  basculerVue(vueAtelier);
}


function afficherIntroOuQuestion(premiereFois) {
  const intro = $("bloc-intro");
  const question = $("bloc-question");

  if (premiereFois) {
    intro.classList.remove("cachee");
    question.classList.add("cachee");
  } else {
    intro.classList.add("cachee");
    question.classList.remove("cachee");
    afficherQuestion();
  }
}


/* ============================================================
   AFFICHAGE D'UNE QUESTION
   ============================================================ */

function afficherQuestion() {
  const q = atelierCourant.questions[indexQuestion];

  $("progression-texte").textContent =
    `Question ${indexQuestion + 1} sur ${atelierCourant.questions.length}`;

  const pct = Math.round((indexQuestion / atelierCourant.questions.length) * 100);
  $("progression-barre").style.width = pct + "%";

  $("enonce-question").textContent = q.enonce;

  const zoneChoix = $("zone-choix");
  zoneChoix.innerHTML = "";

  const zoneFeedback = $("zone-feedback");
  zoneFeedback.innerHTML = "";
  zoneFeedback.className = "zone-feedback cachee";

  $("btn-suivant").classList.add("cachee");

  q.choix.forEach((texte, i) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "choix-reponse";
    bouton.textContent = texte;
    bouton.addEventListener("click", () => validerReponse(i, bouton));
    zoneChoix.appendChild(bouton);
  });
}


/* ============================================================
   VALIDATION D'UNE RÉPONSE
   ============================================================ */

function validerReponse(indexChoisi, boutonClique) {
  const q = atelierCourant.questions[indexQuestion];
  const estCorrect = indexChoisi === q.bonne;

  reponses[indexQuestion] = estCorrect;

  // On bloque tous les boutons pour éviter les clics multiples
  document.querySelectorAll(".choix-reponse").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.bonne) btn.classList.add("bonne-reponse");
    if (i === indexChoisi && !estCorrect) btn.classList.add("mauvaise-reponse");
  });

  const zoneFeedback = $("zone-feedback");
  zoneFeedback.classList.remove("cachee");
  zoneFeedback.className = `zone-feedback ${estCorrect ? "feedback-ok" : "feedback-a-revoir"}`;
  zoneFeedback.innerHTML = `
    <p class="feedback-titre">
      <i class="fa-solid ${estCorrect ? "fa-circle-check" : "fa-lightbulb"}"></i>
      ${estCorrect ? "Bien joué, c'est la bonne réponse !" : "Pas tout à fait, mais regarde bien :"}
    </p>
    <p class="feedback-explication">${q.explication}</p>
  `;

  const dernierQ = indexQuestion === atelierCourant.questions.length - 1;
  const btnSuivant = $("btn-suivant");
  btnSuivant.classList.remove("cachee");
  btnSuivant.innerHTML = dernierQ
    ? '<i class="fa-solid fa-flag-checkered"></i> Voir mon bilan'
    : '<i class="fa-solid fa-arrow-right"></i> Question suivante';
}


/* ============================================================
   NAVIGATION QUESTION SUIVANTE / BILAN
   ============================================================ */

function questionSuivante() {
  const dernierQ = indexQuestion === atelierCourant.questions.length - 1;

  if (dernierQ) {
    afficherRecap();
    basculerVue(vueRecap);
    return;
  }

  indexQuestion++;
  afficherQuestion();
}


/* ============================================================
   BILAN DE FIN D'ATELIER
   ============================================================ */

function afficherRecap() {
  const total = reponses.length;
  const reussies = reponses.filter(Boolean).length;

  $("recap-titre").textContent = atelierCourant.titre;
  $("recap-score-nb").textContent = `${reussies} / ${total}`;

  let message;
  let icone;
  if (reussies === total) {
    message = "Parfait ! Tu maîtrises très bien cette notion.";
    icone = "fa-trophy";
  } else if (reussies >= total / 2) {
    message = "Bon travail, tu progresses bien sur cette notion !";
    icone = "fa-thumbs-up";
  } else {
    message = "C'est normal de ne pas tout retenir du premier coup : n'hésite pas à refaire l'atelier ou à consulter la fiche outil.";
    icone = "fa-seedling";
  }

  $("recap-message").innerHTML = `<i class="fa-solid ${icone}"></i> ${message}`;
}


/* ============================================================
   BASCULE ENTRE LES VUES
   ============================================================ */

function basculerVue(vue) {
  [vueAccueil, vueAtelier, vueRecap].forEach((v) => v.classList.remove("vue-active"));
  vue.classList.add("vue-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ============================================================
   ÉVÉNEMENTS GLOBAUX
   ============================================================ */

$("btn-commencer-atelier")?.addEventListener("click", () => afficherIntroOuQuestion(false));
$("btn-suivant")?.addEventListener("click", questionSuivante);
$("btn-retour-accueil")?.addEventListener("click", () => basculerVue(vueAccueil));
$("btn-rejouer")?.addEventListener("click", () => demarrerAtelier(atelierCourant.id));
$("btn-recap-accueil")?.addEventListener("click", () => basculerVue(vueAccueil));

document.querySelectorAll(".btn-fiche-outil").forEach((btn) => {
  btn.addEventListener("click", () => window.open("fiche-outil.html", "_blank"));
});


/* ============================================================
   INITIALISATION
   ============================================================ */

construireAccueil();

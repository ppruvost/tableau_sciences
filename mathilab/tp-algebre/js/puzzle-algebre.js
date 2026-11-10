/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * Activité Puzzle : rendu commun (sous-onglets Sujet A / B / C, lecture seule)
 * mathilab/tp-algebre/js/puzzle-algebre.js
 *
 * Chaque TD fournit une fonction construire(cle) qui renvoie
 *   { A: {contexte, problematique, questions[5]}, B: {...}, C: {...} }
 * (clé = « niveau-filière », ex. '1ere-trpm') ou null.
 * Les 4 premières questions font progresser, la 5e répond à la problématique.
 * Aucune zone de saisie dans les sujets : les réponses se rédigent dans
 * « Trace écrite - Compte rendu » (question 5 de l'onglet « Activités Puzzle »,
 * rappel de la problématique du sujet actif par puzzle-affichage.js).
 * ============================================================
 */

export const CADRES = {
  trpm: "Dans un atelier d'usinage",
  tci: "Dans un atelier de chaudronnerie",
  mcc: "Dans un atelier de confection",
  log: "Dans une plateforme logistique",
  agora: "Dans un service administratif",
};

export function fmt(v) {
  return (Math.round(v * 100) / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

/** coefs du degré le plus élevé au degré 0 → « x³ − 15x² + 48x + 150 » */
export function polynome(coefs) {
  const deg = coefs.length - 1;
  let s = '';
  coefs.forEach((c, i) => {
    if (!c) return;
    const p = deg - i;
    const abs = Math.abs(c);
    const m = (abs === 1 && p > 0) ? '' : fmt(abs);
    const v = p === 0 ? '' : p === 1 ? 'x' : 'x' + ['', '', '²', '³'][p];
    s += (s === '' ? (c < 0 ? '−' : '') : (c < 0 ? ' − ' : ' + ')) + m + v;
  });
  return s || '0';
}

const LETTRES = ['a', 'b', 'c'];
const MSG_ATTENTE = "Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher les sujets.";
const MSG_ABSENT = "Aucun sujet n'est défini pour cette filière à ce niveau dans ce TD. Choisir une autre filière.";

/**
 * Sous-onglets Sujet A / B / C : un seul écouteur délégué, affichage explicite
 * des panneaux (classe « actif » + display), indépendant du reste du TD.
 */
function initSousOnglets() {
  const racine = document.getElementById('activites-puzzle');
  if (!racine || racine.dataset.sousPuzzleInit === '1') return;
  racine.dataset.sousPuzzleInit = '1';

  const afficher = (id) => {
    racine.querySelectorAll('.sous-btn[data-sous]').forEach((b) => {
      const actif = b.dataset.sous === id;
      b.classList.toggle('actif', actif);
      b.setAttribute('aria-selected', actif ? 'true' : 'false');
    });
    racine.querySelectorAll('.sous-panel').forEach((p) => {
      const actif = p.id === id;
      p.classList.toggle('actif', actif);
      p.style.display = actif ? '' : 'none';
    });
  };

  racine.addEventListener('click', (e) => {
    const btn = e.target.closest('.sous-btn[data-sous]');
    if (!btn || !racine.contains(btn)) return;
    afficher(btn.dataset.sous);
  });

  const initial = racine.querySelector('.sous-btn.actif[data-sous]') || racine.querySelector('.sous-btn[data-sous]');
  if (initial) afficher(initial.dataset.sous);
}

function message(texte) {
  const info = document.getElementById('puzzle-info');
  if (!info) return;
  info.textContent = texte;
  info.hidden = !texte;
  info.style.display = texte ? '' : 'none';
}

function remplirSujet(lettre, sujet) {
  const ctx = document.getElementById(`puzzle-${lettre}-contexte`);
  const prb = document.getElementById(`puzzle-${lettre}-problematique`);
  const ol = document.getElementById(`puzzle-${lettre}-enonce`);

  if (ctx) ctx.textContent = sujet ? sujet.contexte : '';

  if (prb) {
    prb.textContent = '';
    if (sujet && sujet.problematique) {
      const fort = document.createElement('strong');
      fort.textContent = 'Problématique : ';
      prb.append(fort, document.createTextNode(sujet.problematique));
    }
  }

  if (!ol) return;
  ol.replaceChildren();
  const questions = sujet && Array.isArray(sujet.questions) ? sujet.questions : [];
  questions.forEach((texte, i) => {
    const li = document.createElement('li');
    li.textContent = texte;
    if (i === questions.length - 1) li.className = 'puzzle-question-finale';
    ol.appendChild(li);
  });
}

export function initPuzzle(construire, selectId = 'select-filiere-pro') {
  initSousOnglets();

  const rendre = (cle) => {
    if (!cle) {
      LETTRES.forEach((l) => remplirSujet(l, null));
      message(MSG_ATTENTE);
      return;
    }
    let sujets = null;
    try { sujets = construire(cle); }
    catch (err) { console.error('[tp-algebre] construction des sujets impossible :', err); }
    if (!sujets) {
      LETTRES.forEach((l) => remplirSujet(l, null));
      message(MSG_ABSENT);
      return;
    }
    LETTRES.forEach((l) => remplirSujet(l, sujets[l.toUpperCase()] || null));
    message('');
  };

  const select = document.getElementById(selectId);
  if (!select) return;
  select.addEventListener('change', () => rendre(select.value || null));
  rendre(select.value || null);
}

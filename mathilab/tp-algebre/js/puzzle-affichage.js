/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * Question 5 de l'onglet « Activités Puzzle » : problématique du sujet actif
 * mathilab/tp-algebre/js/puzzle-affichage.js
 * ============================================================
 * Dans « Trace écrite - Compte rendu », la question 5 de l'onglet « Activités Puzzle »
 * rappelle UNIQUEMENT la problématique du sujet actif (sous-onglet Sujet A, B ou C),
 * selon la classe et la filière choisies dans « Contexte professionnel ».
 * Même principe que tp-electricite (rappel lié à l'onglet affiché), mais le rappel
 * suit ici le sous-onglet de sujet.
 *
 * Source : les paragraphes #puzzle-a/b/c-problematique remplis par puzzle-algebre.js
 * (aucune donnée dupliquée). Le rappel est réécrit :
 *   - au changement de filière (puzzle-algebre.js réécrit les problématiques) ;
 *   - au clic sur Sujet A / B / C (ou changement de sous-onglet par le code).
 * Le conteneur #puzzle-rappel ne contient qu'un seul <p> : celui du sujet actif
 * (repris tel quel par compte-rendu-algebre.js pour l'impression).
 * ============================================================
 */

const MSG_ATTENTE =
  'Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher ici la problématique.';

const LETTRES = ['a', 'b', 'c'];

export function initPuzzleAffichage() {
  const rappel = document.getElementById('puzzle-rappel');
  const racine = document.getElementById('activites-puzzle');
  if (!rappel || !racine || rappel.dataset.rappelLie === '1') return;
  rappel.dataset.rappelLie = '1';

  // Lettre (a, b, c) du sujet actif : sous-onglet marqué « actif », sinon panneau actif.
  const lettreActive = () => {
    const btn = racine.querySelector('.sous-btn.actif[data-sous]');
    const panneau = racine.querySelector('.sous-panel.actif');
    const id = (btn && btn.dataset.sous) || (panneau && panneau.id) || '';
    const m = /puzzle-sujet-([abc])$/.exec(id);
    return m ? m[1] : 'a';
  };

  // Problématique d'un sujet, sans le préfixe « Problématique : » ajouté par puzzle-algebre.js.
  const problematique = (lettre) => {
    const el = document.getElementById(`puzzle-${lettre}-problematique`);
    return (el ? el.textContent : '').replace(/^\s*Problématique\s*:\s*/i, '').trim();
  };

  const afficher = () => {
    const lettre = lettreActive();
    const texte = problematique(lettre);
    const p = document.createElement('p');
    if (texte) {
      const sujet = document.createElement('strong');
      sujet.textContent = `Sujet ${lettre.toUpperCase()} — `;
      p.append(sujet, document.createTextNode(texte));
    } else {
      p.className = 'puzzle-rappel-vide';
      p.textContent = MSG_ATTENTE;
    }
    rappel.replaceChildren(p);
  };

  // Changement de sujet : clic (après que le module du TD a basculé la classe « actif »)
  // ou changement de classe fait par le code.
  racine.addEventListener('click', (e) => {
    if (e.target.closest('.sous-btn[data-sous]')) setTimeout(afficher, 0);
  });
  const observateurClasses = new MutationObserver(afficher);
  racine.querySelectorAll('.sous-btn[data-sous]').forEach((b) =>
    observateurClasses.observe(b, { attributes: true, attributeFilter: ['class'] }));

  // Changement de filière : puzzle-algebre.js réécrit les problématiques des sujets.
  const observateurTextes = new MutationObserver(afficher);
  LETTRES.forEach((l) => {
    const el = document.getElementById(`puzzle-${l}-problematique`);
    if (el) observateurTextes.observe(el, { childList: true, characterData: true, subtree: true });
  });

  const select = document.getElementById('select-filiere-pro');
  if (select) select.addEventListener('change', () => setTimeout(afficher, 0));

  afficher();
}

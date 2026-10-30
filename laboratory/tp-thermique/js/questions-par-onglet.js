/**
 * tp-thermique/js/questions-par-onglet.js
 *
 * R7 / R9 — N'affiche que le bloc de questions de l'onglet de
 * manipulation actif. Chaîne d'identifiants (R5) :
 *   .tab-btn[data-tab] = .tab-panel#id = .questions-bloc[data-onglet]
 *   = .problematique-rappel[data-activite]
 *
 * À appeler APRÈS initTabs() et initOngletsParFiliere().
 */

export function getOngletActif() {
  const bouton = document.querySelector('.tabs-header .tab-btn.actif');
  if (bouton?.dataset.tab) return bouton.dataset.tab;
  return document.querySelector('.tab-panel.actif')?.id || null;
}

export function getBlocQuestionsActif() {
  const id = getOngletActif();
  if (!id) return null;
  return document.querySelector(`.questions-bloc[data-onglet="${id}"]`);
}

function appliquer() {
  const blocs = document.querySelectorAll('.questions-bloc[data-onglet]');
  const actif = getOngletActif();
  blocs.forEach(bloc => {
    bloc.hidden = bloc.dataset.onglet !== actif;
  });
}

export function initQuestionsParOnglet() {
  const entete = document.querySelector('.tabs-header');
  if (!entete) return;

  appliquer();

  // Suit tout changement d'onglet, qu'il vienne d'initTabs() ou de
  // initOngletsParFiliere() (changement de classe .actif ou de visibilité).
  const observateur = new MutationObserver(appliquer);
  observateur.observe(entete, {
    attributes: true,
    attributeFilter: ['class', 'hidden', 'style'],
    subtree: true,
  });

  entete.addEventListener('click', () => setTimeout(appliquer, 0));
}

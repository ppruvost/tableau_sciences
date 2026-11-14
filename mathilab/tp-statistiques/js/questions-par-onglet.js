/**
 * mathilab/tp-statistiques/js/questions-par-onglet.js
 *
 * Trace écrite : n'affiche que le bloc de questions de l'onglet d'activité
 * actif (bloc [data-onglet] égal au data-tab du bouton .tab-btn.actif).
 * Mise à jour au clic sur un onglet ET par MutationObserver sur la classe
 * « actif » (le changement d'onglet peut venir d'un autre module).
 */

function afficher(element, visible) {
  element.hidden = !visible;
  element.style.display = visible ? '' : 'none';
}

export function initQuestionsParOnglet() {
  const blocs = [...document.querySelectorAll('[data-type="bilan"] .questions-bloc[data-onglet]')];
  if (!blocs.length) return;

  const boutons = [...document.querySelectorAll('.tabs-header .tab-btn')];

  function appliquer() {
    const actif = document.querySelector('.tabs-header .tab-btn.actif')?.dataset.tab;
    blocs.forEach(bloc => afficher(bloc, bloc.dataset.onglet === actif));
  }

  boutons.forEach(bouton => {
    if (bouton.dataset.questionsLie === '1') return;
    bouton.dataset.questionsLie = '1';
    bouton.addEventListener('click', () => setTimeout(appliquer, 0));
    new MutationObserver(appliquer).observe(bouton, { attributes: true, attributeFilter: ['class'] });
  });

  appliquer();
}

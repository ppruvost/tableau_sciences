/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * Questions affichées selon l'onglet actif
 * mathilab/tp-geometrie/js/questions-par-onglet.js
 * ============================================================
 * Convention HTML (section « Trace écrite ») :
 *   <div class="questions-bloc" data-onglet="<id du data-tab>" hidden>
 *     <ol class="questions-tp"> 5 <li> </ol>
 *   </div>
 * Seul le bloc de l'onglet actif est affiché ; si aucun bloc ne
 * correspond, le premier reste visible. La synchronisation se fait au
 * clic ET par observation de la classe « actif » des boutons
 * (changement d'onglet par programme, filtrage par filière).
 */

const SELECTEUR_BOUTONS = '.tabs-header .tab-btn';

/** Identifiant (data-tab) de l'onglet actif, ou null. */
export function ongletActif() {
  const bouton = document.querySelector(`${SELECTEUR_BOUTONS}.actif`);
  return bouton ? bouton.dataset.tab : null;
}

function blocs() {
  return [...document.querySelectorAll('.questions-bloc[data-onglet]')];
}

/** Bloc de questions de l'onglet actif (repli : premier bloc). */
export function blocOngletActif() {
  const liste = blocs();
  const id = ongletActif();
  return liste.find((bloc) => bloc.dataset.onglet === id) || liste[0] || null;
}

function synchroniser() {
  const actif = blocOngletActif();
  blocs().forEach((bloc) => { bloc.hidden = bloc !== actif; });
}

export function initQuestionsParOnglet() {
  const boutons = [...document.querySelectorAll(SELECTEUR_BOUTONS)];
  boutons.forEach((bouton) => {
    if (bouton.dataset.questionsLie) return;
    bouton.dataset.questionsLie = '1';
    bouton.addEventListener('click', () => setTimeout(synchroniser, 0));
    new MutationObserver(synchroniser).observe(bouton, { attributes: true, attributeFilter: ['class'] });
  });
  synchroniser();
}

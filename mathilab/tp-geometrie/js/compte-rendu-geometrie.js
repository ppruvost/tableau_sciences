/**
 * tp-geometrie/js/compte-rendu-geometrie.js
 *
 * Construit la configuration attendue par js/compte-rendu.js
 * (genererCompteRendu) à partir des SEULES questions affichées selon
 * l'activité réalisée (voir js/questions-par-activite.js), et câble le
 * bouton #btn-imprimer.
 *
 * L'affichage des questions par activité est initialisé ici : il suffit
 * donc que chaque TD appelle initImpressionCompteRendu().
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import {
  initAffichageQuestionsParActivite,
  construireSectionsQuestionsActivite,
  verifierActiviteChoisie,
  valeur,
} from '../../js/questions-par-activite.js';

// Conservé pour compatibilité avec les TD qui l'importaient déjà.
export { initAffichageQuestionsParActivite };

// Résumé du TD, en texte libre.
function construireSectionResume() {
  const zone = document.getElementById('resume-tp');
  if (!zone) return null;
  return { titre: 'Résumé du TD', texte: valeur(zone) };
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TD (ex. "Solides, aires, volumes, Pythagore et Thalès")
 * @param {string} params.tp    - Identifiant du TD (ex. "TD01")
 */
export function initImpressionCompteRendu({ titre, tp }) {
  initAffichageQuestionsParActivite();

  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', () => {
    if (!verifierActiviteChoisie()) return;

    const sections = [
      ...construireSectionsQuestionsActivite(),
      construireSectionResume(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Géométrie',
      tp,
      sections,
      noteFinale: true,
      plateforme: 'MathiLab',
    });
  });
}

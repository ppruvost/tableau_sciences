/**
 * tp-statistiques/js/compte-rendu-statistiques.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD de
 * statistiques actuellement affiché, et câble le bouton #btn-imprimer
 * dessus.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import {
  initAffichageQuestionsParActivite,
  construireSectionsQuestionsActivite,
  verifierActiviteChoisie,
} from '../../js/questions-par-activite.js';

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Puissance et énergie électrique")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 */
export function initImpressionCompteRendu({ titre, tp }) {

  // Seules les questions de l'activité réalisée sont affichées et reprises
  // (fiches puzzle et synthèse comprises si l'activité puzzle est choisie).
  initAffichageQuestionsParActivite();

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    if (!verifierActiviteChoisie()) return;

    const sections = [
      ...construireSectionsQuestionsActivite(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Statistiques',
      tp,
      sections,
      noteFinale: true,
      plateforme: 'MathiLab',
    });
  });
}

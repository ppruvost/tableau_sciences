/**
 * tp-geometrie/js/compte-rendu-geometrie.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD
 * de géométrie actuellement affiché, et câble le bouton #btn-imprimer
 * dessus.
 *
 * Convention identique à tp-algebre/js/compte-rendu-algebre.js et
 * tp-statistiques/js/compte-rendu-statistiques.js.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';

function texte(el) {
  return (el?.textContent || '').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

// Une section "notation" (question + compétence + zone de réponse)
// par <li> de .questions-tp, au format attendu par compte-rendu.js.
function construireSectionsQuestions() {
  return [...document.querySelectorAll('.questions-tp > li')].map(li => ({
    titre: texte(li.querySelector('.question-entete strong')),
    notation: true,
    competence: texte(li.querySelector('.cartouche')),
    texte: valeur(li.querySelector('.zone-eleve textarea')),
  }));
}

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
  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', () => {
    const sections = [
      ...construireSectionsQuestions(),
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

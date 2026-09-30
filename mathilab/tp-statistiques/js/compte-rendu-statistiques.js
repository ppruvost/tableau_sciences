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

function texte(el) {
  return (el?.textContent || '').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

// Résumé du TD, en texte libre.
function construireSectionResume() {

  const zone = document.getElementById('resume-tp');

  if (!zone) return null;

  return { titre: 'Résumé du TD', texte: valeur(zone) };
}

// Tableau de résultats de la section [data-type="resultats"], lu
// génériquement ligne par ligne (1ère cellule = libellé, cellules
// suivantes = valeurs saisies ou déjà affichées).
function construireSectionResultats() {

  const lignes = document.querySelectorAll('[data-type="resultats"] table tbody tr');

  if (!lignes.length) return null;

  const items = [...lignes].map(tr => {

    const cellules = [...tr.children];
    const label = texte(cellules[0]);

    const valeurs = cellules.slice(1).map(td => {
      const input = td.querySelector('input');
      return input ? valeur(input) : texte(td);
    }).filter(Boolean);

    return { label, valeur: valeurs.join(' — ') || '—' };
  });

  return { titre: 'Tableau de résultats', items };
}

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
      construireSectionResultats(),
      ...construireSectionsQuestionsActivite(),
      construireSectionResume(),
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

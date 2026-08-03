/**
 * tp-statistiques/js/compte-rendu-statistiques.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD de
 * statistiques actuellement affiché, et câble le bouton #btn-imprimer
 * dessus.
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

// Une section par fiche puzzle (.fiche-puzzle), lue génériquement :
// titre = data-titre de la fiche, texte = réponse du groupe expert.
function construireSectionsPuzzle() {

  return [...document.querySelectorAll('.fiche-puzzle')].map(fiche => ({
    titre: `Fiche puzzle — ${fiche.dataset.titre || ''}`,
    texte: valeur(fiche.querySelector('.zone-eleve textarea')),
  }));
}

// Synthèse de la séance 2 (groupes puzzle mélangés).
function construireSectionSynthesePuzzle() {

  const zone = document.getElementById('puzzle-synthese');

  if (!zone) return null;

  return { titre: 'Synthèse puzzle (Séance 2)', texte: valeur(zone) };
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Puissance et énergie électrique")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 */
export function initImpressionCompteRendu({ titre, tp }) {

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    const sections = [
      construireSectionResultats(),
      ...construireSectionsQuestions(),
      construireSectionResume(),
      ...construireSectionsPuzzle(),
      construireSectionSynthesePuzzle(),
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

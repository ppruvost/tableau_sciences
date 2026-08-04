/**
 * tp-algorithme/js/compte-rendu-algorithme.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD
 * d'algorithmique actuellement affiché, et câble le bouton
 * #btn-imprimer dessus.
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

// Une section par exercice de code (.code-exercice) : le programme
// Python final écrit/modifié par l'élève avant envoi vers PyLab.
// Le résultat d'exécution reste dans l'onglet PyLab (outil externe,
// comme NumWorks) — à reporter à la main dans le tableau de résultats.
function construireSectionsCode() {

  return [...document.querySelectorAll('.code-exercice')].map(bloc => ({
    titre: `Code Python — ${bloc.dataset.titre || ''}`,
    texte: valeur(bloc.querySelector('.code-editeur-python')),
  }));
}

// Une section par fiche puzzle (.fiche-puzzle), lue génériquement.
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
 * @param {string} params.titre - Titre du TD
 * @param {string} params.tp    - Numéro du TD (ex. "A1")
 */
export function initImpressionCompteRendu({ titre, tp }) {

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    const sections = [
      ...construireSectionsCode(),
      ...construireSectionsQuestions(),
      construireSectionResume(),
      ...construireSectionsPuzzle(),
      construireSectionSynthesePuzzle(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Algorithmique',
      tp,
      sections,
      noteFinale: true,
      plateforme: 'MathiLab',
    });
  });
}

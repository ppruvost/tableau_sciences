/**
 * tp-algebre/js/compte-rendu-algebre.js
 * Identique en structure à tp-statistiques/js/compte-rendu-statistiques.js.
 */
import { genererCompteRendu } from '../../js/compte-rendu.js';

function texte(el) { return (el?.textContent || '').trim(); }
function valeur(el) { return (el?.value || '').trim(); }

function construireSectionsQuestions() {
  return [...document.querySelectorAll('.questions-tp > li')].map(li => ({
    titre: texte(li.querySelector('.question-entete strong')),
    notation: true,
    competence: texte(li.querySelector('.cartouche')),
    texte: valeur(li.querySelector('.zone-eleve textarea')),
  }));
}

function construireSectionResume() {
  const zone = document.getElementById('resume-tp');
  if (!zone) return null;
  return { titre: 'Résumé du TD', texte: valeur(zone) };
}

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

function construireSectionsPuzzle() {
  return [...document.querySelectorAll('.fiche-puzzle')].map(fiche => ({
    titre: `Fiche puzzle — ${fiche.dataset.titre || ''}`,
    texte: valeur(fiche.querySelector('.zone-eleve textarea')),
  }));
}

function construireSectionSynthesePuzzle() {
  const zone = document.getElementById('puzzle-synthese');
  if (!zone) return null;
  return { titre: 'Synthèse puzzle (Séance 2)', texte: valeur(zone) };
}

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
      domaine: 'Algèbre - Analyse',
      tp,
      sections,
      noteFinale: true,
      plateforme: 'MathiLab',
    });
  });
}

/**
 * tp-algebre/js/compte-rendu-algebre.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD
 * d'algèbre actuellement affiché, et câble le bouton #btn-imprimer
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

// Récapitulatif des outils interactifs travaillés (équation résolue,
// inéquation résolue, intervalle généré, énoncé traduit), lu
// génériquement pour ne dépendre d'aucun onglet en particulier.
function construireSectionOutils() {
  const items = [];

  const eqEtapes = document.querySelectorAll('#eq-etapes li');
  if (eqEtapes.length) {
    items.push({
      label: 'Équation résolue',
      valeur: [...eqEtapes].map(li => texte(li)).join(' — '),
    });
  }

  const inNotation = document.getElementById('in-notation');
  if (inNotation && texte(inNotation)) {
    items.push({ label: 'Solution de l\'inéquation', valeur: texte(inNotation) });
  }

  const giResultat = document.getElementById('gi-resultat');
  if (giResultat && texte(giResultat)) {
    items.push({ label: 'Intervalle généré', valeur: texte(giResultat) });
  }

  const pbEquation = document.getElementById('pb-equation');
  if (pbEquation && valeur(pbEquation)) {
    items.push({ label: 'Équation proposée (problème)', valeur: valeur(pbEquation) });
  }

  if (!items.length) return null;
  return { titre: 'Outils travaillés', items };
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TD (ex. "Résoudre un problème du premier degré")
 * @param {string} params.tp    - Identifiant du TD (ex. "S1")
 */
export function initImpressionCompteRendu({ titre, tp }) {
  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', () => {
    const sections = [
      construireSectionOutils(),
      ...construireSectionsQuestions(),
      construireSectionResume(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Algèbre – Analyse',
      tp,
      sections,
      noteFinale: true,
      plateforme: 'MathiLab',
    });
  });
}

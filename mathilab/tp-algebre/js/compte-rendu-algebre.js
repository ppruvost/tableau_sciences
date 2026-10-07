/**
 * tp-algebre/js/compte-rendu-algebre.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD
 * d'algèbre actuellement affiché, et câble le bouton #btn-imprimer
 * dessus.
 *
 * Seules les questions de l'activité réalisée (liste #activite-realisee)
 * sont reprises : voir js/questions-par-activite.js.
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
  initAffichageQuestionsParActivite();

  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', () => {
    if (!verifierActiviteChoisie()) return;

    const sections = [
      construireSectionOutils(),
      ...construireSectionsQuestionsActivite(),
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

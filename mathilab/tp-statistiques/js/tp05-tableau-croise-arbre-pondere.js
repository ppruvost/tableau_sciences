/**
 * tp-statistiques/js/tp05-tableau-croise-arbre-pondere.js
 *
 * Contrôleur du TP S5 « Tableau croisé, conditionnement et arbre
 * pondéré », commun aux classes de 1ère et de Terminale. L'onglet
 * « Arbre pondéré et indépendance » (Tle uniquement) est affiché ou
 * masqué dynamiquement en fonction du niveau déduit de la filière
 * sélectionnée dans le contexte professionnel.
 */

import { $, arrondir, initSections, initTabs } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { analyserTableauCroise, verifierIndependance } from '../../js/probabilites.js';

const PROFILS = {

  tci: {
    contexte: "Un contrôle qualité croise le poste de soudure (poste 1 ou poste 2) et la conformité de la pièce (conforme ou non conforme).",
    problematique1ere: "Le taux de non-conformité dépend-il du poste de soudure utilisé ?",
    problematiqueTle: "Peut-on modéliser ce contrôle par un arbre pondéré, et le poste de soudure est-il indépendant du résultat de la pièce ?",
  },

  trpm: {
    contexte: "Un contrôle qualité croise la machine d'usinage (machine 1 ou machine 2) et la conformité de la pièce produite.",
    problematique1ere: "Le taux de non-conformité dépend-il de la machine utilisée pour l'usinage ?",
    problematiqueTle: "Peut-on modéliser ce contrôle par un arbre pondéré, et la machine est-elle indépendante du résultat de la pièce ?",
  },

  mcc: {
    contexte: "Un contrôle qualité croise l'atelier de confection (atelier 1 ou atelier 2) et la conformité de la pièce (conforme ou nécessitant une retouche).",
    problematique1ere: "Le taux de retouche dépend-il de l'atelier qui a confectionné la pièce ?",
    problematiqueTle: "Peut-on modéliser ce contrôle par un arbre pondéré, et l'atelier est-il indépendant du besoin de retouche ?",
  },

  agora: {
    contexte: "Un service administratif croise l'agent qui a traité un dossier (agent 1 ou agent 2) et le respect du délai de traitement (dans les délais ou hors délais).",
    problematique1ere: "Le respect des délais dépend-il de l'agent qui a traité le dossier ?",
    problematiqueTle: "Peut-on modéliser ce suivi par un arbre pondéré, et l'agent est-il indépendant du respect des délais ?",
  },

  log: {
    contexte: "Un service logistique croise le transporteur utilisé (transporteur 1 ou 2) et le respect du délai de livraison (livré à temps ou en retard).",
    problematique1ere: "Le taux de retard dépend-il du transporteur utilisé ?",
    problematiqueTle: "Peut-on modéliser ce suivi par un arbre pondéré, et le transporteur est-il indépendant du retard de livraison ?",
  },

};

const CONTEXTES_PRO = {};
Object.entries(PROFILS).forEach(([id, p]) => {
  CONTEXTES_PRO[`1ere-${id}`] = { contexte: p.contexte, problematique: p.problematique1ere };
  CONTEXTES_PRO[`tle-${id}`] = { contexte: p.contexte, problematique: p.problematiqueTle };
});

export function init() {

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initBasculeOngletTle();
  initTableauCroise();
  initArbrePondere();

  initSections();
  initTabs();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Tableau croisé, conditionnement et arbre pondéré',
    tp: 'S5',
  });
}

// =================================================================
// Affichage conditionnel de l'onglet « Arbre pondéré » (Tle)
// =================================================================
function initBasculeOngletTle() {

  const select = $('select-filiere-pro');
  const ongletTle = document.querySelector('.tab-btn[data-niveau="tle"]');
  if (!select || !ongletTle) return;

  function basculer() {
    const estTle = select.value.startsWith('tle-');
    ongletTle.style.display = estTle ? '' : 'none';
  }

  select.addEventListener('change', basculer);
  basculer();
}

// =================================================================
// Onglet 1 — Tableau croisé d'effectifs
// =================================================================
function initTableauCroise() {

  const btnCalculer = $('tc-calculer');
  const tbodyResultats = $('tc-tbody-resultats');
  if (!btnCalculer || !tbodyResultats) return;

  btnCalculer.addEventListener('click', () => {

    const nAB = parseInt($('tc-nab').value, 10) || 0;
    const nAnonB = parseInt($('tc-nabbarre').value, 10) || 0;
    const nnonAB = parseInt($('tc-nabarreb').value, 10) || 0;
    const nnonAnonB = parseInt($('tc-nabarrebbarre').value, 10) || 0;

    const res = analyserTableauCroise(nAB, nAnonB, nnonAB, nnonAnonB);

    if (!res) {
      tbodyResultats.innerHTML = '<tr><td colspan="2">Renseigner des effectifs dont la somme est strictement positive.</td></tr>';
      return;
    }

    const lignes = [
      ['Total de l\'échantillon', res.total],
      ['P(A)', arrondir(res.pA, 3)],
      ['P(Ā)', arrondir(res.pNonA, 3)],
      ['P(B)', arrondir(res.pB, 3)],
      ['P(A∩B)', arrondir(res.pAinterB, 3)],
      ['P(A∪B)', arrondir(res.pAuB, 3)],
      ['Fréquence conditionnelle (proportion de A parmi B)', res.pAsachantB === null ? '—' : arrondir(res.pAsachantB, 3)],
      ['Probabilité conditionnelle P_A(B)', res.pBsachantA === null ? '—' : arrondir(res.pBsachantA, 3)],
    ];

    tbodyResultats.innerHTML = lignes
      .map(([label, valeur]) => `<tr><td>${label}</td><td>${valeur}</td></tr>`)
      .join('');
  });
}

// =================================================================
// Onglet 2 — Arbre pondéré et indépendance (Tle)
// =================================================================
function initArbrePondere() {

  const btnConstruire = $('ap-construire');
  const tbody = $('ap-tbody');
  if (!btnConstruire || !tbody) return;

  btnConstruire.addEventListener('click', () => {

    const pA = parseFloat($('ap-pa').value) / 100;
    const pAB = parseFloat($('ap-pab').value) / 100;
    const pAbarreB = parseFloat($('ap-pabarreb').value) / 100;

    if ([pA, pAB, pAbarreB].some(v => Number.isNaN(v) || v <= 0 || v >= 1)) return;

    const pAnonB = pA * (1 - pAB);
    const pAinterB = pA * pAB;
    const pNonA = 1 - pA;
    const pNonAinterB = pNonA * pAbarreB;
    const pNonAinterNonB = pNonA * (1 - pAbarreB);

    const chemins = [
      { c1: 'A', c2: 'B', proba: pAinterB },
      { c1: 'A', c2: 'B̄', proba: pAnonB },
      { c1: 'Ā', c2: 'B', proba: pNonAinterB },
      { c1: 'Ā', c2: 'B̄', proba: pNonAinterNonB },
    ];

    tbody.innerHTML = chemins
      .map(c => `<tr><td>${c.c1}</td><td>${c.c2}</td><td>${c.c1} puis ${c.c2}</td><td>${arrondir(c.proba, 4)}</td></tr>`)
      .join('');

    // Formule des probabilités totales : P(B) = P(A∩B) + P(Ā∩B)
    const pB = pAinterB + pNonAinterB;
    $('ap-pb').innerHTML = `<strong>P(B) = P(A∩B) + P(Ā∩B) = ${arrondir(pB, 4)}</strong> (formule des probabilités totales)`;

    const { produit, ecart } = verifierIndependance(pA, pB, pAinterB);
    const independants = Math.abs(ecart) < 0.005;

    $('ap-independance').innerHTML = independants
      ? `<strong>P(A) × P(B) = ${arrondir(produit, 4)} ≈ P(A∩B) : A et B semblent indépendants.</strong>`
      : `<strong>P(A) × P(B) = ${arrondir(produit, 4)} ≠ P(A∩B) = ${arrondir(pAinterB, 4)} : A et B ne sont pas indépendants.</strong>`;
  });
}

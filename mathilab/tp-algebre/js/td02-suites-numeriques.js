/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * TD02 : Étudier et comparer des suites numériques
 * (1ère : suites arithmétiques / Tle : suites géométriques)
 * mathilab/tp-algebre/js/td02-suites-numeriques.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {
  calculerTermesSuiteArithmetique, calculerTermesSuiteGeometrique,
  sommeTermes, sensVariationArithmetique, sensVariationGeometrique,
  dessinerNuagePoints
} from '../../js/algebre.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_TD02 = {
  '2nde-remi': {
    contexte: "Le coût d'une intervention de maintenance comprend des frais fixes, puis un tarif horaire constant (variation constante) ; la valeur d'un équipement se déprécie d'un pourcentage fixe chaque année (taux fixe).",
    problematique: "Quel est le coût facturé pour n heures d'intervention, et comment évolue la valeur d'un équipement au fil des années ?",
  },
  '2nde-mcc': {
    contexte: "Un atelier de confection augmente sa production d'un nombre fixe de pièces chaque semaine (variation constante) ; la valeur d'une machine à coudre se déprécie d'un pourcentage fixe chaque année (taux fixe).",
    problematique: "Combien de pièces l'atelier produira-t-il à la semaine n, et comment évolue la valeur de l'équipement au fil du temps ?",
  },
  '2nde-gatl': {
    contexte: "Le tarif d'un transporteur comprend des frais fixes, puis un montant constant par kilomètre (variation constante) ; le volume de colis traité par un entrepôt augmente d'un pourcentage fixe chaque mois (taux fixe).",
    problematique: "Quel est le coût facturé pour n kilomètres, et quel volume de colis l'entrepôt devra-t-il traiter dans n mois ?",
  },
};

const LIBELLES_RESULTATS = [
  ['nombreTermes', 'Nombre de termes calculés'],
  ['dernierTerme', 'Dernier terme calculé'],
  ['sens', 'Sens de variation'],
  ['somme', 'Somme des n premiers termes'],
];

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v;
}

/* ============================================================
   NIVEAU 1ère — SUITES ARITHMÉTIQUES (préfixe ar-)
   ============================================================ */

function calculerEtAfficherSuiteArithmetique() {
  const u0 = parseFloat(document.getElementById('ar-u0').value);
  const r = parseFloat(document.getElementById('ar-r').value);
  const n = parseInt(document.getElementById('ar-n').value, 10);

  if (Number.isNaN(u0) || Number.isNaN(r) || Number.isNaN(n) || n < 2) return;

  const termes = calculerTermesSuiteArithmetique(u0, r, n);
  const somme = sommeTermes(termes);
  const variation = sensVariationArithmetique(r);

  document.getElementById('ar-tbody-termes').innerHTML = termes
    .map((t) => `<tr><td>${t.n}</td><td>${formater(t.valeur)}</td></tr>`).join('');

  const resultats = {
    nombreTermes: n,
    dernierTerme: termes[termes.length - 1].valeur,
    sens: `${variation.sens} (${variation.explication})`,
    somme,
  };

  document.getElementById('ar-tbody-resultats').innerHTML = LIBELLES_RESULTATS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(resultats[cle])}</td></tr>`).join('');

  dessinerNuagePoints('ar-nuage', [{ label: 'u(n)', points: termes }]);
}

function initEtudierSuiteArithmetique() {
  document.getElementById('ar-calculer')?.addEventListener('click', calculerEtAfficherSuiteArithmetique);
  calculerEtAfficherSuiteArithmetique();
}

function calculerEtAfficherComparaisonArithmetique() {
  const u0A = parseFloat(document.getElementById('ar-cs-u0-a').value);
  const rA = parseFloat(document.getElementById('ar-cs-r-a').value);
  const u0B = parseFloat(document.getElementById('ar-cs-u0-b').value);
  const rB = parseFloat(document.getElementById('ar-cs-r-b').value);
  const n = parseInt(document.getElementById('ar-cs-n').value, 10);

  const labelA = document.getElementById('ar-cs-label-a').value || 'Évolution A';
  const labelB = document.getElementById('ar-cs-label-b').value || 'Évolution B';
  document.getElementById('ar-cs-th-a').textContent = labelA;
  document.getElementById('ar-cs-th-b').textContent = labelB;

  if ([u0A, rA, u0B, rB, n].some((v) => Number.isNaN(v)) || n < 2) {
    document.getElementById('ar-cs-tbody-comparaison').innerHTML =
      '<tr><td colspan="3">Renseigner les deux évolutions puis cliquer sur « Comparer ».</td></tr>';
    document.getElementById('ar-cs-nuage').innerHTML = '';
    return;
  }

  const termesA = calculerTermesSuiteArithmetique(u0A, rA, n);
  const termesB = calculerTermesSuiteArithmetique(u0B, rB, n);
  const sommeA = sommeTermes(termesA);
  const sommeB = sommeTermes(termesB);
  const variationA = sensVariationArithmetique(rA);
  const variationB = sensVariationArithmetique(rB);

  const lignes = [
    ['Dernier terme', formater(termesA[termesA.length - 1].valeur), formater(termesB[termesB.length - 1].valeur)],
    ['Sens de variation', variationA.sens, variationB.sens],
    ['Somme des n premiers termes', formater(sommeA), formater(sommeB)],
  ];

  document.getElementById('ar-cs-tbody-comparaison').innerHTML = lignes
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join('');

  dessinerNuagePoints('ar-cs-nuage', [
    { label: labelA, points: termesA, couleur: 'var(--couleur-primaire, #2563eb)' },
    { label: labelB, points: termesB, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initComparerSuitesArithmetiques() {
  document.getElementById('ar-cs-calculer')?.addEventListener('click', calculerEtAfficherComparaisonArithmetique);
  ['ar-cs-label-a', 'ar-cs-label-b'].forEach((id) =>
    document.getElementById(id)?.addEventListener('input', calculerEtAfficherComparaisonArithmetique));
  calculerEtAfficherComparaisonArithmetique();
}

/* ============================================================
   NIVEAU Tle — SUITES GÉOMÉTRIQUES (préfixe geo-)
   ============================================================ */

function calculerEtAfficherSuiteGeometrique() {
  const u0 = parseFloat(document.getElementById('geo-u0').value);
  const q = parseFloat(document.getElementById('geo-q').value);
  const n = parseInt(document.getElementById('geo-n').value, 10);

  if (Number.isNaN(u0) || Number.isNaN(q) || q <= 0 || Number.isNaN(n) || n < 2) return;

  const termes = calculerTermesSuiteGeometrique(u0, q, n);
  const somme = sommeTermes(termes);
  const variation = sensVariationGeometrique(u0, q);

  document.getElementById('geo-tbody-termes').innerHTML = termes
    .map((t) => `<tr><td>${t.n}</td><td>${formater(t.valeur)}</td></tr>`).join('');

  const resultats = {
    nombreTermes: n,
    dernierTerme: termes[termes.length - 1].valeur,
    sens: `${variation.sens} (${variation.explication})`,
    somme,
  };

  document.getElementById('geo-tbody-resultats').innerHTML = LIBELLES_RESULTATS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(resultats[cle])}</td></tr>`).join('');

  dessinerNuagePoints('geo-nuage', [{ label: 'u(n)', points: termes }]);
}

function initEtudierSuiteGeometrique() {
  document.getElementById('geo-calculer')?.addEventListener('click', calculerEtAfficherSuiteGeometrique);
  calculerEtAfficherSuiteGeometrique();
}

function calculerEtAfficherComparaisonGeometrique() {
  const u0A = parseFloat(document.getElementById('geo-cs-u0-a').value);
  const qA = parseFloat(document.getElementById('geo-cs-q-a').value);
  const u0B = parseFloat(document.getElementById('geo-cs-u0-b').value);
  const qB = parseFloat(document.getElementById('geo-cs-q-b').value);
  const n = parseInt(document.getElementById('geo-cs-n').value, 10);

  const labelA = document.getElementById('geo-cs-label-a').value || 'Évolution A';
  const labelB = document.getElementById('geo-cs-label-b').value || 'Évolution B';
  document.getElementById('geo-cs-th-a').textContent = labelA;
  document.getElementById('geo-cs-th-b').textContent = labelB;

  if ([u0A, qA, u0B, qB, n].some((v) => Number.isNaN(v)) || qA <= 0 || qB <= 0 || n < 2) {
    document.getElementById('geo-cs-tbody-comparaison').innerHTML =
      '<tr><td colspan="3">Renseigner les deux évolutions puis cliquer sur « Comparer ».</td></tr>';
    document.getElementById('geo-cs-nuage').innerHTML = '';
    return;
  }

  const termesA = calculerTermesSuiteGeometrique(u0A, qA, n);
  const termesB = calculerTermesSuiteGeometrique(u0B, qB, n);
  const sommeA = sommeTermes(termesA);
  const sommeB = sommeTermes(termesB);
  const variationA = sensVariationGeometrique(u0A, qA);
  const variationB = sensVariationGeometrique(u0B, qB);

  const lignes = [
    ['Dernier terme', formater(termesA[termesA.length - 1].valeur), formater(termesB[termesB.length - 1].valeur)],
    ['Sens de variation', variationA.sens, variationB.sens],
    ['Somme des n premiers termes', formater(sommeA), formater(sommeB)],
  ];

  document.getElementById('geo-cs-tbody-comparaison').innerHTML = lignes
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join('');

  dessinerNuagePoints('geo-cs-nuage', [
    { label: labelA, points: termesA, couleur: 'var(--couleur-primaire, #2563eb)' },
    { label: labelB, points: termesB, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initComparerSuitesGeometriques() {
  document.getElementById('geo-cs-calculer')?.addEventListener('click', calculerEtAfficherComparaisonGeometrique);
  ['geo-cs-label-a', 'geo-cs-label-b'].forEach((id) =>
    document.getElementById(id)?.addEventListener('input', calculerEtAfficherComparaisonGeometrique));
  calculerEtAfficherComparaisonGeometrique();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_TD02 });

initEtudierSuiteArithmetique();
initComparerSuitesArithmetiques();

initEtudierSuiteGeometrique();
initComparerSuitesGeometriques();

initRadarCompetences();
initImpressionCompteRendu({ titre: 'Étudier et comparer des suites numériques', tp: 'TD02' });
OK td02 js

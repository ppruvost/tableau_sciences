/**
 * /js/tp02-suites-arithmetiques.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { calculerTermesSuiteArithmetique, sommeTermes, sensVariationArithmetique, dessinerNuagePoints } from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre-1ere.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_P1 = {
  '2nde-remi': {
    contexte: "Le coût d'une intervention de maintenance comprend des frais fixes de déplacement, puis un tarif horaire constant.",
    problematique: "Quel est le coût facturé pour n heures d'intervention, et quel est le montant total facturé sur plusieurs interventions ?",
  },
  '2nde-mcc': {
    contexte: "Un atelier de confection augmente sa production d'un nombre fixe de pièces chaque semaine.",
    problematique: "Combien de pièces l'atelier produira-t-il à la semaine n, et quelle est la production cumulée sur la période ?",
  },
  '2nde-gatl': {
    contexte: "Le tarif d'un transporteur comprend des frais fixes de prise en charge, puis un montant constant par kilomètre parcouru.",
    problematique: "Quel est le coût facturé pour n kilomètres, et quel est le montant total sur plusieurs trajets ?",
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

/* ---------- Onglet 1 : étudier une suite ---------- */

function calculerEtAfficherSuite() {
  const u0 = parseFloat(document.getElementById('es-u0').value);
  const r = parseFloat(document.getElementById('es-r').value);
  const n = parseInt(document.getElementById('es-n').value, 10);

  if (Number.isNaN(u0) || Number.isNaN(r) || Number.isNaN(n) || n < 2) return;

  const termes = calculerTermesSuiteArithmetique(u0, r, n);
  const somme = sommeTermes(termes);
  const variation = sensVariationArithmetique(r);

  document.getElementById('es-tbody-termes').innerHTML = termes
    .map((t) => `<tr><td>${t.n}</td><td>${formater(t.valeur)}</td></tr>`).join('');

  const resultats = {
    nombreTermes: n,
    dernierTerme: termes[termes.length - 1].valeur,
    sens: `${variation.sens} (${variation.explication})`,
    somme,
  };

  document.getElementById('es-tbody-resultats').innerHTML = LIBELLES_RESULTATS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(resultats[cle])}</td></tr>`).join('');

  dessinerNuagePoints('es-nuage', [{ label: 'u(n)', points: termes }]);
}

function initEtudierSuite() {
  document.getElementById('es-calculer')?.addEventListener('click', calculerEtAfficherSuite);
  calculerEtAfficherSuite();
}

/* ---------- Onglet 2 : comparer deux évolutions ---------- */

function calculerEtAfficherComparaison() {
  const u0A = parseFloat(document.getElementById('cs-u0-a').value);
  const rA = parseFloat(document.getElementById('cs-r-a').value);
  const u0B = parseFloat(document.getElementById('cs-u0-b').value);
  const rB = parseFloat(document.getElementById('cs-r-b').value);
  const n = parseInt(document.getElementById('cs-n').value, 10);

  const labelA = document.getElementById('cs-label-a').value || 'Évolution A';
  const labelB = document.getElementById('cs-label-b').value || 'Évolution B';
  document.getElementById('cs-th-a').textContent = labelA;
  document.getElementById('cs-th-b').textContent = labelB;

  if ([u0A, rA, u0B, rB, n].some((v) => Number.isNaN(v)) || n < 2) {
    document.getElementById('cs-tbody-comparaison').innerHTML =
      '<tr><td colspan="3">Renseigner les deux évolutions puis cliquer sur « Comparer ».</td></tr>';
    document.getElementById('cs-nuage').innerHTML = '';
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

  document.getElementById('cs-tbody-comparaison').innerHTML = lignes
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join('');

  dessinerNuagePoints('cs-nuage', [
    { label: labelA, points: termesA, couleur: 'var(--couleur-primaire, #2563eb)' },
    { label: labelB, points: termesB, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initComparerSuites() {
  document.getElementById('cs-calculer')?.addEventListener('click', calculerEtAfficherComparaison);
  ['cs-label-a', 'cs-label-b'].forEach((id) =>
    document.getElementById(id)?.addEventListener('input', calculerEtAfficherComparaison));
  calculerEtAfficherComparaison();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_P1 });
initEtudierSuite();
initComparerSuites();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Générer et étudier des suites arithmétiques', tp: 'P1' });

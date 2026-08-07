/**
 */js/tp07-suites-geometriques.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { calculerTermesSuiteGeometrique, sommeTermes, sensVariationGeometrique, dessinerNuagePoints } from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_A1 = {
  '2nde-remi': {
    contexte: "Une machine augmente sa cadence de production d'un pourcentage fixe chaque jour : sa production quotidienne suit une suite géométrique.",
    problematique: "Quelle sera la production de la machine après n jours, et quelle est la production totale cumulée ?",
  },
  '2nde-mcc': {
    contexte: "La valeur d'un équipement de confection se déprécie d'un même pourcentage chaque année.",
    problematique: "Comment évolue la valeur de l'équipement au fil des années, et à partir de quand faut-il le remplacer ?",
  },
  '2nde-gatl': {
    contexte: "Le volume de colis traité par un entrepôt augmente d'un pourcentage fixe chaque mois.",
    problematique: "Quel volume de colis l'entrepôt devra-t-il traiter dans n mois, et quel volume cumulé sur la période ?",
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
  const q = parseFloat(document.getElementById('es-q').value);
  const n = parseInt(document.getElementById('es-n').value, 10);

  if (Number.isNaN(u0) || Number.isNaN(q) || q <= 0 || Number.isNaN(n) || n < 2) return;

  const termes = calculerTermesSuiteGeometrique(u0, q, n);
  const somme = sommeTermes(termes);
  const variation = sensVariationGeometrique(u0, q);

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
  const qA = parseFloat(document.getElementById('cs-q-a').value);
  const u0B = parseFloat(document.getElementById('cs-u0-b').value);
  const qB = parseFloat(document.getElementById('cs-q-b').value);
  const n = parseInt(document.getElementById('cs-n').value, 10);

  const labelA = document.getElementById('cs-label-a').value || 'Évolution A';
  const labelB = document.getElementById('cs-label-b').value || 'Évolution B';
  document.getElementById('cs-th-a').textContent = labelA;
  document.getElementById('cs-th-b').textContent = labelB;

  if ([u0A, qA, u0B, qB, n].some((v) => Number.isNaN(v)) || qA <= 0 || qB <= 0 || n < 2) {
    document.getElementById('cs-tbody-comparaison').innerHTML =
      '<tr><td colspan="3">Renseigner les deux évolutions puis cliquer sur « Comparer ».</td></tr>';
    document.getElementById('cs-nuage').innerHTML = '';
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
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_A1 });
initEtudierSuite();
initComparerSuites();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Étudier et comparer des suites géométriques', tp: 'A1' });

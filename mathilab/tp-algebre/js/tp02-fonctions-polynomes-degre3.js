/**
 * tp-algebre/js/tp02-fonctions-polynomes-degre3.js
 */
import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {
  evaluerPolynomeDegre3, deriveePolynomeDegre3, resoudreTrinome,
  tableauVariationsDegre3, dessinerCourbe,
} from '../../js/algebre.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_A2 = {
  '2nde-remi': {
    contexte: "Le coût de fabrication d'une série de pièces varie avec la quantité produite selon une loi polynomiale de degré 3.",
    problematique: "Pour quelle quantité de pièces le coût de fabrication est-il minimal ?",
  },
  '2nde-mcc': {
    contexte: "Le temps de montage d'un vêtement évolue avec la complexité du modèle selon une loi polynomiale de degré 3.",
    problematique: "À partir de quelle complexité le temps de montage redevient-il plus favorable ?",
  },
  '2nde-gatl': {
    contexte: "Le coût logistique d'un entrepôt varie avec le volume traité selon une loi polynomiale de degré 3.",
    problematique: "Pour quel volume traité le coût logistique est-il minimal ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ---------- Onglet 1 : fonction cube ---------- */

function initFonctionCube() {
  dessinerCourbe('fc-courbe', [
    { label: 'f(x) = x³', fn: (x) => x ** 3, xMin: -2, xMax: 2, points: [{ x: 0, y: 0 }] },
  ]);
}

/* ---------- Onglet 2 : polynôme de degré 3 quelconque ---------- */

function lireCoefficients() {
  return [
    parseFloat(document.getElementById('pd-a').value),
    parseFloat(document.getElementById('pd-b').value),
    parseFloat(document.getElementById('pd-c').value),
    parseFloat(document.getElementById('pd-d').value),
  ];
}

function etudierPolynome() {
  const coeffs = lireCoefficients();
  const xMin = parseFloat(document.getElementById('pd-xmin').value);
  const xMax = parseFloat(document.getElementById('pd-xmax').value);
  if (coeffs.some((c) => Number.isNaN(c)) || Number.isNaN(xMin) || Number.isNaN(xMax) || xMin >= xMax) return;

  const [a, b, c] = coeffs;
  const derivee = deriveePolynomeDegre3([a, b, c]);
  const { discriminant, racines } = resoudreTrinome(derivee);

  document.getElementById('pd-tbody-derivee').innerHTML = `
    <tr><td>f'(x)</td><td>${derivee[0]}x² + ${derivee[1]}x + ${derivee[2]}</td></tr>
    <tr><td>Discriminant de f'</td><td>${discriminant === null ? '—' : formater(discriminant)}</td></tr>
    <tr><td>Point(s) critique(s) sur ]${xMin} ; ${xMax}[</td><td>${racines.length ? racines.filter((x) => x > xMin && x < xMax).map(formater).join(' ; ') : 'aucun'}</td></tr>
  `;

  const etapes = tableauVariationsDegre3(coeffs, xMin, xMax);
  document.getElementById('pd-tbody-variations').innerHTML = etapes
    .map((e) => `<tr><td>${formater(e.x)}</td><td>${formater(e.valeur)}</td><td>${e.nature}</td></tr>`).join('');

  dessinerCourbe('pd-courbe', [{
    label: 'f(x)',
    fn: (x) => evaluerPolynomeDegre3(coeffs, x),
    xMin, xMax,
    points: etapes.filter((e) => e.nature !== 'borne').map((e) => ({ x: e.x, y: e.valeur })),
  }]);
}

function compterSolutions() {
  const coeffs = lireCoefficients();
  const xMin = parseFloat(document.getElementById('pd-xmin').value);
  const xMax = parseFloat(document.getElementById('pd-xmax').value);
  const cible = parseFloat(document.getElementById('pd-cible').value);
  if ([...coeffs, xMin, xMax, cible].some((v) => Number.isNaN(v))) return;

  const etapes = tableauVariationsDegre3(coeffs, xMin, xMax);
  let solutions = 0;
  for (let i = 0; i < etapes.length - 1; i++) {
    const y1 = etapes[i].valeur;
    const y2 = etapes[i + 1].valeur;
    const min = Math.min(y1, y2);
    const max = Math.max(y1, y2);
    if (cible > min && cible < max) solutions += 1;
    if (cible === y1 || cible === y2) solutions += 0.5; // borne partagée entre deux intervalles
  }
  solutions = Math.round(solutions);

  document.getElementById('pd-solutions').textContent =
    `Pour c = ${cible}, l'équation f(x) = c admet environ ${solutions} solution(s) sur [${xMin} ; ${xMax}] (lecture graphique du tableau de variations).`;
}

function initPolynomeDegre3() {
  document.getElementById('pd-calculer')?.addEventListener('click', etudierPolynome);
  document.getElementById('pd-compter-solutions')?.addEventListener('click', compterSolutions);
  etudierPolynome();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_A2 });
initFonctionCube();
initPolynomeDegre3();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Étudier des fonctions polynômes de degré 3', tp: 'A2' });

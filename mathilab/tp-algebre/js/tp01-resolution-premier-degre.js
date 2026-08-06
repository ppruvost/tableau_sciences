/**
 * /js/tp01-resolution-premier-degre.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import {
  resoudreEquationPremierDegre, resoudreInequationPremierDegre,
  intervalleDepuisOperateur, dessinerCourbe,
} from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre-2nde.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_N1 = {
  '2nde-remi': {
    contexte: "Le coût d'une pièce usinée comprend des frais de matière et un coût horaire de main d'œuvre.",
    problematique: "Combien d'heures d'usinage sont possibles pour rester dans un budget donné ?",
  },
  '2nde-mcc': {
    contexte: "Le coût d'une commande de tissu comprend des frais fixes et un tarif au mètre.",
    problematique: "Quelle longueur de tissu peut-on commander pour rester dans un budget donné ?",
  },
  '2nde-gatl': {
    contexte: "Le coût d'un transport comprend des frais fixes de prise en charge et un tarif au kilomètre.",
    problematique: "Quelle distance de transport peut-on financer pour rester dans un budget donné ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v;
}

/* ---------- Onglet 1 : équation ---------- */

function resoudreEquation() {
  const a = parseFloat(document.getElementById('eq-a').value);
  const b = parseFloat(document.getElementById('eq-b').value);
  const c = parseFloat(document.getElementById('eq-c').value);
  if ([a, b, c].some((v) => Number.isNaN(v)) || a === 0) return;

  const x = resoudreEquationPremierDegre(a, b, c);

  document.getElementById('eq-etapes').innerHTML = `
    ${a}x + ${b} = ${c}<br>
    ${a}x = ${c} − ${b} = ${formater(c - b)}<br>
    x = ${formater(c - b)} / ${a} = <strong>${formater(x)}</strong>
  `;

  const xMin = x - 5;
  const xMax = x + 5;
  dessinerCourbe('eq-courbe', [
    { label: `y = ${a}x + ${b}`, fn: (t) => a * t + b, xMin, xMax, couleur: 'var(--couleur-primaire, #2563eb)', points: [{ x, y: c }] },
    { label: `y = ${c}`, fn: () => c, xMin, xMax, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initEquation() {
  document.getElementById('eq-resoudre')?.addEventListener('click', resoudreEquation);
  resoudreEquation();
}

/* ---------- Onglet 2 : inéquation ---------- */

function resoudreInequation() {
  const a = parseFloat(document.getElementById('in-a').value);
  const b = parseFloat(document.getElementById('in-b').value);
  const comparateur = document.getElementById('in-comparateur').value;
  const c = parseFloat(document.getElementById('in-c').value);
  if ([a, b, c].some((v) => Number.isNaN(v)) || a === 0) return;

  const { seuil, operateur } = resoudreInequationPremierDegre(a, b, comparateur, c);
  const symboles = { '>=': '⩾', '<=': '⩽', '>': '>', '<': '<' };

  document.getElementById('in-etapes').innerHTML = `
    ${a}x + ${b} ${symboles[comparateur]} ${c}<br>
    ${a}x ${symboles[comparateur]} ${formater(c - b)}<br>
    ${a < 0 ? '(a < 0 : le sens de l\'inégalité s\'inverse en divisant)<br>' : ''}
    x ${symboles[operateur]} ${formater(seuil)}<br>
    Solution : <strong>${intervalleDepuisOperateur(formater(seuil), operateur)}</strong>
  `;

  const xMin = seuil - 5;
  const xMax = seuil + 5;
  dessinerCourbe('in-courbe', [
    { label: `y = ${a}x + ${b}`, fn: (t) => a * t + b, xMin, xMax, couleur: 'var(--couleur-primaire, #2563eb)', points: [{ x: seuil, y: c }] },
    { label: `y = ${c}`, fn: () => c, xMin, xMax, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initInequation() {
  document.getElementById('in-resoudre')?.addEventListener('click', resoudreInequation);
  resoudreInequation();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_N1 });
initEquation();
initInequation();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Résoudre un problème du premier degré", tp: 'N1' });

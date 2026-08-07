/**
 * /js/tp09-fonctions-exponentielles-logarithme.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import {
  fonctionExponentielle, fonctionLogDecimal, resoudreExponentielle,
  resoudreLogDecimal, dessinerCourbe,
} from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_A3 = {
  '2nde-remi': {
    contexte: "La température d'une pièce en refroidissement suit une évolution exponentielle en fonction du temps.",
    problematique: "Au bout de combien de temps la pièce atteint-elle une température donnée ?",
  },
  '2nde-mcc': {
    contexte: "La proportion de teinture absorbée par un tissu évolue de façon exponentielle avec le temps de trempage.",
    problematique: "Quel temps de trempage permet d'atteindre un taux d'absorption donné ?",
  },
  '2nde-gatl': {
    contexte: "Le taux de charge d'une batterie de chariot élévateur évolue de façon exponentielle avec le temps de charge.",
    problematique: "Quel temps de charge est nécessaire pour atteindre un seuil de charge donné ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(3) : v;
}

/* ---------- Onglet 1 : fonction exponentielle de base q ---------- */

function tracerExponentielle() {
  const q = parseFloat(document.getElementById('fe-q').value);
  const xMin = parseFloat(document.getElementById('fe-xmin').value);
  const xMax = parseFloat(document.getElementById('fe-xmax').value);
  if (Number.isNaN(q) || q <= 0 || q === 1 || Number.isNaN(xMin) || Number.isNaN(xMax) || xMin >= xMax) return;

  document.getElementById('fe-variations').textContent =
    q > 1 ? `q = ${q} > 1 : la fonction x ↦ qˣ est strictement croissante sur ℝ.`
      : `0 < q = ${q} < 1 : la fonction x ↦ qˣ est strictement décroissante sur ℝ.`;

  dessinerCourbe('fe-courbe', [{ label: `x ↦ ${q}ˣ`, fn: fonctionExponentielle(q), xMin, xMax }]);
}

function resoudreEquationExponentielle() {
  const q = parseFloat(document.getElementById('fe-q').value);
  const a = parseFloat(document.getElementById('fe-a').value);
  if (Number.isNaN(q) || q <= 0 || q === 1 || Number.isNaN(a) || a <= 0) {
    document.getElementById('fe-solution').textContent = 'q doit être strictement positif et différent de 1, a doit être strictement positif.';
    return;
  }
  const x = resoudreExponentielle(q, a);
  document.getElementById('fe-solution').textContent = `${q}ˣ = ${a} ⟺ x = ln(${a}) / ln(${q}) ≈ ${formater(x)}.`;
}

function initFonctionExponentielle() {
  document.getElementById('fe-tracer')?.addEventListener('click', tracerExponentielle);
  document.getElementById('fe-resoudre')?.addEventListener('click', resoudreEquationExponentielle);
  tracerExponentielle();
}

/* ---------- Onglet 2 : fonction logarithme décimal ---------- */

function tracerLog() {
  const xMin = parseFloat(document.getElementById('fl-xmin').value);
  const xMax = parseFloat(document.getElementById('fl-xmax').value);
  if (Number.isNaN(xMin) || xMin <= 0 || Number.isNaN(xMax) || xMin >= xMax) return;

  dessinerCourbe('fl-courbe', [{ label: 'x ↦ log(x)', fn: fonctionLogDecimal(), xMin, xMax }]);
}

function resoudreEquationLog() {
  const a = parseFloat(document.getElementById('fl-a').value);
  if (Number.isNaN(a)) return;
  const x = resoudreLogDecimal(a);
  document.getElementById('fl-solution').textContent = `log(x) = ${a} ⟺ x = 10^${a} = ${formater(x)}.`;
}

function initFonctionLog() {
  document.getElementById('fl-tracer')?.addEventListener('click', tracerLog);
  document.getElementById('fl-resoudre')?.addEventListener('click', resoudreEquationLog);
  tracerLog();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_A3 });
initFonctionExponentielle();
initFonctionLog();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Fonctions exponentielles et logarithme décimal', tp: 'A3' });

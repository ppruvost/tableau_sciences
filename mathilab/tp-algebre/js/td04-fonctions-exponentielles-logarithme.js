/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * TD04 : Fonctions exponentielles et logarithme décimal (Tle)
 * mathilab/tp-algebre/js/td04-fonctions-exponentielles-logarithme.js
 * ============================================================
 */

import FILIERES_PRO from '../../../js/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import {
  fonctionExponentielle, fonctionLogDecimal, resoudreExponentielle,
  resoudreLogDecimal, dessinerCourbe,
} from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';
import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import { initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { garantirMenuFiliere } from './filiere-select.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initPuzzleAffichage } from './puzzle-affichage.js';
import { initNavigationTP } from './nav-tp.js';

import { initPuzzle, CADRES, fmt, polynome } from './puzzle-algebre.js';

const CONTEXTES_TD04 = {
  'tle-trpm': {
    contexte: "La température d'une pièce en refroidissement, ou l'usure d'un outil de coupe, suit une évolution exponentielle en fonction du temps.",
    problematiques: {
      'fonction-exponentielle': "Au bout de combien de temps la pièce atteint-elle une température ou un seuil d'usure donné ?",
      'fonction-log': "Comment le logarithme décimal permet-il de retrouver le temps nécessaire pour atteindre une température ou un seuil d'usure donné ?",
    },
  },
  'tle-tci': {
    contexte: "La température d'une pièce chaudronnée en refroidissement après soudure suit une évolution exponentielle en fonction du temps.",
    problematiques: {
      'fonction-exponentielle': "Au bout de combien de temps la pièce atteint-elle une température donnée ?",
      'fonction-log': "Comment le logarithme décimal permet-il de retrouver le temps nécessaire pour atteindre une température donnée ?",
    },
  },
  'tle-mcc': {
    contexte: "La proportion de teinture absorbée par un tissu évolue de façon exponentielle avec le temps de trempage.",
    problematiques: {
      'fonction-exponentielle': "Quel temps de trempage permet d'atteindre un taux d'absorption donné ?",
      'fonction-log': "Comment le logarithme décimal permet-il de retrouver le temps de trempage nécessaire pour atteindre un taux d'absorption donné ?",
    },
  },
  'tle-log': {
    contexte: "Le taux de charge d'une batterie de chariot élévateur évolue de façon exponentielle avec le temps de charge.",
    problematiques: {
      'fonction-exponentielle': "Quel temps de charge est nécessaire pour atteindre un seuil de charge donné ?",
      'fonction-log': "Comment le logarithme décimal permet-il de retrouver le temps de charge nécessaire pour atteindre un seuil de charge donné ?",
    },
  },
  'tle-agora': {
    contexte: "Le taux de traitement d'un stock de dossiers en attente évolue de façon exponentielle avec le temps, à mesure que la charge de travail diminue.",
    problematiques: {
      'fonction-exponentielle': "Au bout de combien de temps le stock de dossiers atteint-il un seuil donné ?",
      'fonction-log': "Comment le logarithme décimal permet-il de retrouver le temps nécessaire pour atteindre un seuil de dossiers donné ?",
    },
  },
};

/* ============================================================
   ACTIVITÉS PUZZLE — sujets A/B/C liés à la filière choisie
   (mêmes clés que CONTEXTES_TD04). Chaque situation est modélisée
   par la fraction restante à atteindre le seuil, sous la forme
   x ↦ qˣ, avec 0 < q < 1 (évolution exponentielle décroissante).
   ============================================================ */

const PUZZLE_TD04 = {
  'tle-trpm': {
    q: 0.85, aB: 0.25, variable: 'minutes',
    grandeur: 'l’écart de température restant entre la pièce et l’ambiante (en °C)',
  },
  'tle-tci': {
    q: 0.80, aB: 0.20, variable: 'minutes',
    grandeur: 'l’écart de température restant entre la pièce chaudronnée et l’ambiante (en °C)',
  },
  'tle-mcc': {
    q: 0.75, aB: 0.10, variable: 'minutes',
    grandeur: 'la proportion de teinture non encore absorbée par le tissu',
  },
  'tle-log': {
    q: 0.90, aB: 0.15, variable: 'minutes',
    grandeur: 'la proportion de la batterie restant à charger',
  },
  'tle-agora': {
    q: 0.88, aB: 0.05, variable: 'jours',
    grandeur: 'la proportion du stock de dossiers restant à traiter',
  },
};

function construirePuzzleTD04(cle) {
  const d = PUZZLE_TD04[cle];
  if (!d) return null;
  const cadre = CADRES[cle.split('-')[1]];
  const { q, aB, variable, grandeur } = d;
  const A = {
    contexte: `${cadre}, on suit ${grandeur} : sa valeur est multipliée par ${fmt(q)} à chaque unité de temps (en ${variable}).`,
    problematique: `Quelle fraction de la valeur initiale reste-t-il après 5, puis 10 ${variable}, et comment évolue-t-elle ?`,
    questions: [
      `Justifier que cette évolution est modélisée par la fonction f(x) = ${fmt(q)}^x.`,
      `Calculer f(0), f(5) et f(10).`,
      `Donner le sens de variation de f en justifiant (0 < q < 1).`,
      `Représenter f graphiquement (calculatrice ou GeoGebra).`,
      `Répondre à la problématique par une phrase.`],
  };
  const B = {
    contexte: `${cadre}, un seuil d'alerte est fixé lorsque ${grandeur} n'est plus que ${fmt(aB * 100)} % de sa valeur initiale.`,
    problematique: `Au bout de combien de ${variable} ce seuil est-il atteint ?`,
    questions: [
      `Écrire l'équation ${fmt(q)}^x = ${fmt(aB)} traduisant le seuil.`,
      `Encadrer la solution à l'aide d'un tableau de valeurs (calculatrice).`,
      `Affiner l'encadrement au dixième et justifier qu'il n'existe qu'une solution.`,
      `Vérifier en calculant ${fmt(q)}^x pour la valeur trouvée.`,
      `Répondre à la problématique par une phrase, avec l'unité.`],
  };
  const C = {
    contexte: `${cadre}, on veut déterminer une durée exacte sans procéder par tâtonnements, en utilisant le logarithme décimal.`,
    problematique: `Quelle durée faut-il pour que la valeur initiale de ${grandeur} soit divisée par deux, et comment la calculer avec le logarithme décimal ?`,
    questions: [
      `Rappeler la propriété log(a^x) = x × log(a).`,
      `Appliquer le logarithme décimal aux deux membres de ${fmt(q)}^x = 0,5.`,
      `Isoler x : x = log(0,5) / log(${fmt(q)}).`,
      `Calculer x à la calculatrice et l'arrondir au dixième.`,
      `Répondre à la problématique par une phrase, avec l'unité (${variable}).`],
  };
  return { A, B, C };
}

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

/* ============================================================
   INITIALISATION — point d'entrée appelé par navigation.js
   ============================================================ */

/** Une étape en erreur n'empêche jamais les suivantes. */
function etape(nom, fn) {
  try { fn(); }
  catch (err) { console.error(`[tp-algebre] étape « ${nom} » en erreur :`, err); }
}

export function init() {
  etape('initZoomVisuels', () => { initZoomVisuels(); });
  etape('initContextePro', () => { initContextePro({ afficherProblematique: false, filieres: FILIERES_PRO, contextes: CONTEXTES_TD04 }); });
  etape('garantirMenuFiliere', () => { garantirMenuFiliere(CONTEXTES_TD04); });
  etape('initPuzzle', () => { initPuzzle(construirePuzzleTD04); });
  etape('initPuzzleAffichage', () => { initPuzzleAffichage(); });
  etape('initOngletsParFiliere', () => { initOngletsParFiliere(); });
  etape('initSections', () => { initSections(); });
  etape('initTabs', () => { initTabs(); });
  etape('initModesOperatoires', () => { initModesOperatoires(); });
  etape('initFonctionExponentielle', () => { initFonctionExponentielle(); });
  etape('initFonctionLog', () => { initFonctionLog(); });
  etape('initRadarCompetences', () => { initRadarCompetences(); });
  etape('initQuestionsParOnglet', () => { initQuestionsParOnglet(); });
  etape('initNavigationTP', () => { initNavigationTP(); });
  etape('initImpressionCompteRendu', () => {
    initImpressionCompteRendu({ titre: "Fonctions exponentielles et logarithme décimal", tp: 'TD04' });
  });
}
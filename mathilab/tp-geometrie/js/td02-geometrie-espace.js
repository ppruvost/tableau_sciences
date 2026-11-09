/**
 * mathilab/tp-geometrie/js/td02-geometrie-espace.js
 *
 * Contrôleur du TD02 « Géométrie dans l'espace : représenter et sectionner un solide ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-geometrie/modules/td02-geometrie-espace.html dans #content.
 *
 * Convention SciLab / MathiLab (claude_v6.md) :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init()
 */

// 1. Imports partagés (../../../js/…), puis données (../../data/…), puis locaux (./…)
import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import { initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { garantirMenuFiliere } from './filiere-select.js';
import FILIERES_PRO from '../../../js/filieres.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';
import { initImpressionCompteRendu } from './compte-rendu-geometrie.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { initOutilsGeoGebra } from './outils-geogebra.js';
import { G2 } from './puzzle-geometrie.js';

// puzzle-onglet.js : plusieurs emplacements essayés ; s'il est introuvable,
// seul le puzzle est désactivé (le reste du TD, dont le menu de filière, fonctionne).
let demarrerPuzzle = () => { console.error('[tp-geometrie] puzzle-onglet.js introuvable : puzzle désactivé'); };
for (const chemin of ['../../../js/puzzle-onglet.js', '../../js/puzzle-onglet.js']) {
  try { ({ demarrerPuzzle } = await import(chemin)); break; }
  catch (err) { console.warn('[tp-geometrie] import impossible :', chemin); }
}

// 2. Données propres au TD (contextes professionnels, constantes)
const CONTEXTES_PRO = {
  "1ere-trpm": {
    "contexte": "En usinage, une pièce mécanique résulte souvent de l'assemblage de plusieurs solides usuels, et sa coupe en plan technique correspond à une section par un plan.",
    "problematiques": {
      "representer-solide": "Comment représenter une pièce composée de plusieurs solides usuels et calculer son volume total ?",
      "section-plan": "Comment prévoir la forme de la section d'une pièce coupée par un plan, comme sur un plan technique en coupe ?"
    }
  },
  "1ere-tci": {
    "contexte": "En chaudronnerie, une pièce résulte souvent de l'assemblage de plusieurs solides (cylindre, cône), et sa coupe en plan technique correspond à une section par un plan.",
    "problematiques": {
      "representer-solide": "Comment représenter une pièce chaudronnée composée de plusieurs solides (cylindre, cône) et calculer son volume total ?",
      "section-plan": "Comment prévoir la forme de la section d'une pièce chaudronnée coupée par un plan ?"
    }
  },
  "1ere-mcc": {
    "contexte": "En confection, un patron en volume (mannequin, gabarit) peut se modéliser par un assemblage de solides usuels.",
    "problematiques": {
      "representer-solide": "Comment représenter un gabarit composé de plusieurs solides usuels et calculer son volume total ?",
      "section-plan": "Comment prévoir la forme de la section d'un gabarit coupé par un plan ?"
    }
  },
  "1ere-log": {
    "contexte": "En logistique, un espace de stockage ou un colis composé résulte souvent de l'assemblage de plusieurs solides usuels (pavés, cylindres).",
    "problematiques": {
      "representer-solide": "Comment représenter un espace de stockage composé de plusieurs solides et calculer son volume total ?",
      "section-plan": "Comment prévoir la forme de la section d'un colis ou d'un espace de stockage coupé par un plan ?"
    }
  },
  "1ere-agora": {
    "contexte": "Dans une structure administrative, l'agencement d'un local ou d'un mobilier peut se modéliser par un assemblage de solides usuels.",
    "problematiques": {
      "representer-solide": "Comment représenter un agencement composé de plusieurs solides et en calculer le volume total ?",
      "section-plan": "Comment prévoir la forme de la section d'un mobilier ou d'un local coupé par un plan ?"
    }
  }
};

// ============================================================
// Initialisation
// ============================================================

// ------------------------------------------------------------
// Sous-onglets Sujet A / B / C de l'onglet « Activités Puzzle ».
// Fonction locale (aucun import) : ne peut pas empêcher le chargement du module.
// ------------------------------------------------------------
function initSousOngletsPuzzle() {
  const racine = document.getElementById('activites-puzzle');
  if (!racine || racine.dataset.sousPuzzleInit === '1') return;
  racine.dataset.sousPuzzleInit = '1';

  const afficher = (id) => {
    racine.querySelectorAll('.sous-btn[data-sous]').forEach((b) => {
      const actif = b.dataset.sous === id;
      b.classList.toggle('actif', actif);
      b.setAttribute('aria-selected', actif ? 'true' : 'false');
    });
    racine.querySelectorAll('.sous-panel').forEach((p) => {
      const actif = p.id === id;
      p.classList.toggle('actif', actif);
      p.style.display = actif ? '' : 'none';
    });
  };

  racine.addEventListener('click', (e) => {
    const btn = e.target.closest('.sous-btn[data-sous]');
    if (!btn || !racine.contains(btn)) return;
    afficher(btn.dataset.sous);
  });

  const initial = racine.querySelector('.sous-btn.actif[data-sous]') || racine.querySelector('.sous-btn[data-sous]');
  if (initial) afficher(initial.dataset.sous);
}

/** Une étape en erreur n'empêche jamais les suivantes. */
function etape(nom, fn) {
  try { fn(); }
  catch (err) { console.error(`[tp-geometrie] étape « ${nom} » en erreur :`, err); }
}

/**
 * Point d'entrée du TD (appelé par navigation.js).
 * Ordre : zoom → outils → onglets du TD → contexte pro → puzzle →
 * filtrage par filière → sections → onglets → modes opératoires → radar →
 * questions par onglet → navigation TD → impression.
 */
export function init() {
  etape('initZoomVisuels', () => { initZoomVisuels(); });
  etape('initOutilsGeoGebra', () => { initOutilsGeoGebra(); });
  etape('initContextePro', () => { initContextePro({ afficherProblematique: false, filieres: FILIERES_PRO, contextes: CONTEXTES_PRO }); });
  etape('garantirMenuFiliere', () => { garantirMenuFiliere(CONTEXTES_PRO); });
  etape('demarrerPuzzle', () => { demarrerPuzzle(G2); });
  etape('initSousOngletsPuzzle', () => { initSousOngletsPuzzle(); });
  etape('initOngletsParFiliere', () => { initOngletsParFiliere(); });
  etape('initSections', () => { initSections(); });
  etape('initTabs', () => { initTabs(); });
  etape('initModesOperatoires', () => { initModesOperatoires(); });
  etape('initRadarCompetences', () => { initRadarCompetences(); });
  etape('initQuestionsParOnglet', () => { initQuestionsParOnglet(); });
  etape('initNavigationTP', () => { initNavigationTP(); });
  etape('initImpressionCompteRendu', () => {
    initImpressionCompteRendu({ titre: 'Géométrie dans l\'espace : représenter et sectionner un solide', tp: 'TD02' });
  });
}
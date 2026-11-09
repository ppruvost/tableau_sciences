/**
 * mathilab/tp-geometrie/js/td03-vecteurs.js
 *
 * Contrôleur du TD03 « Vecteurs du plan et de l'espace ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-geometrie/modules/td03-vecteurs.html dans #content.
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
import { initPuzzleAffichage } from './puzzle-affichage.js';
import { initNavigationTP } from './nav-tp.js';
import { initOutilsGeoGebra } from './outils-geogebra.js';
import { G3 } from './puzzle-geometrie.js';
import { initAtelierStatique } from './atelier-statique.js';

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
    "contexte": "En usinage, une force de coupe ou un déplacement d'outil se modélisent par un vecteur : direction, sens et intensité.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter une force de coupe ou un déplacement d'outil par un vecteur et construire la somme de deux vecteurs ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un déplacement d'outil ou une force ?",
      "vecteurs-espace": "Comment calculer la norme et tester la colinéarité de deux forces ou déplacements dans l'espace ?",
      "activites-atelier": "Comment déterminer les efforts sur un support et vérifier la résistance d'une soudure à l'aide des vecteurs ?"
    }
  },
  "1ere-tci": {
    "contexte": "En chaudronnerie, un effort de cintrage ou un déplacement de tôle se modélisent par un vecteur : direction, sens et intensité.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter un effort de cintrage ou un déplacement par un vecteur et construire la somme de deux efforts ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un effort ou un déplacement ?",
      "vecteurs-espace": "Comment calculer la norme et tester la colinéarité de deux efforts ou déplacements dans l'espace ?",
      "activites-atelier": "Comment déterminer les efforts sur une pièce chaudronnée (oreille de levage, support) et vérifier la résistance de ses soudures ?"
    }
  },
  "1ere-mcc": {
    "contexte": "En confection, un déplacement d'aiguille ou une tension de fil se modélisent par un vecteur : direction, sens et intensité.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter un déplacement d'aiguille ou une tension de fil par un vecteur et construire leur somme ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un déplacement d'aiguille ou une tension ?",
      "vecteurs-espace": "Comment calculer la norme et tester la colinéarité de deux vecteurs de l'espace ?"
    }
  },
  "1ere-log": {
    "contexte": "En logistique, un déplacement de marchandise ou un trajet se modélisent par un vecteur : direction, sens et distance.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter un déplacement de marchandise ou un trajet par un vecteur et construire la somme de deux déplacements ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer la longueur d'un trajet ?",
      "activites-atelier": "Comment déterminer les efforts sur un support de charge et vérifier qu'il résiste, à l'aide des vecteurs ?"
    }
  },
  "1ere-agora": {
    "contexte": "Dans une structure administrative, un déplacement de dossier entre deux services peut se modéliser par un vecteur reliant deux positions.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter un déplacement par un vecteur et construire la somme de deux déplacements ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un déplacement ?"
    }
  },
  "tle-trpm": {
    "contexte": "En usinage, une force ou un déplacement d'outil dans l'espace (trois dimensions) se modélisent par un vecteur de l'espace.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter une force de coupe ou un déplacement d'outil par un vecteur et construire la somme de deux vecteurs ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un déplacement d'outil ou une force ?",
      "vecteurs-espace": "Comment calculer la norme et tester la colinéarité de deux forces ou déplacements dans l'espace ?",
      "activites-atelier": "Comment déterminer les efforts sur un support et vérifier la résistance d'une soudure à l'aide des vecteurs ?"
    }
  },
  "tle-tci": {
    "contexte": "En chaudronnerie, une pièce travaillée dans les trois dimensions nécessite de modéliser des efforts ou déplacements par des vecteurs de l'espace.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter un effort de cintrage ou un déplacement par un vecteur et construire la somme de deux efforts ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un effort ou un déplacement ?",
      "vecteurs-espace": "Comment calculer la norme et tester la colinéarité de deux efforts ou déplacements dans l'espace ?",
      "activites-atelier": "Comment déterminer les efforts sur une pièce chaudronnée (oreille de levage, support) et vérifier la résistance de ses soudures ?"
    }
  },
  "tle-mcc": {
    "contexte": "En confection, un gabarit ou un mouvement dans les trois dimensions peut se modéliser par des vecteurs de l'espace.",
    "problematiques": {
      "construire-vecteurs": "Comment représenter un déplacement d'aiguille ou une tension de fil par un vecteur et construire leur somme ?",
      "coordonnees-plan": "Comment calculer les coordonnées, la somme et la norme de vecteurs du plan pour déterminer un déplacement d'aiguille ou une tension ?",
      "vecteurs-espace": "Comment calculer la norme et tester la colinéarité de deux vecteurs de l'espace ?"
    }
  }
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : Math.round(v * 1000) / 1000) : v;
}

/* ============================================================
   1ère — COORDONNÉES, SOMME, PRODUIT PAR UN RÉEL, NORME (PLAN)
   ============================================================ */

function calculerVecteurPlan() {
  const ax = parseFloat(document.getElementById('vp-ax').value);
  const ay = parseFloat(document.getElementById('vp-ay').value);
  const bx = parseFloat(document.getElementById('vp-bx').value);
  const by = parseFloat(document.getElementById('vp-by').value);
  const zone = document.getElementById('vp-resultat');
  if ([ax, ay, bx, by].some((v) => Number.isNaN(v))) return;

  const x = bx - ax;
  const y = by - ay;
  const norme = Math.sqrt(x * x + y * y);

  zone.innerHTML = `Vecteur AB (${formater(x)} ; ${formater(y)}) — Norme ‖AB‖ = √(${formater(x)}² + ${formater(y)}²) ≈ ${formater(norme)}`;
}

function calculerCombinaisonPlan() {
  const ux = parseFloat(document.getElementById('vp-ux').value);
  const uy = parseFloat(document.getElementById('vp-uy').value);
  const vx = parseFloat(document.getElementById('vp-vx').value);
  const vy = parseFloat(document.getElementById('vp-vy').value);
  const k = parseFloat(document.getElementById('vp-k').value);
  const zone = document.getElementById('vp-combi-resultat');
  if ([ux, uy, vx, vy, k].some((v) => Number.isNaN(v))) return;

  const sx = ux + vx;
  const sy = uy + vy;
  const kx = k * ux;
  const ky = k * uy;

  zone.innerHTML = `
    u + v = (${formater(sx)} ; ${formater(sy)})<br>
    ${k}·u = (${formater(kx)} ; ${formater(ky)})
  `;
}

function initVecteursPlan() {
  document.getElementById('vp-calculer')?.addEventListener('click', calculerVecteurPlan);
  calculerVecteurPlan();
  document.getElementById('vp-combiner')?.addEventListener('click', calculerCombinaisonPlan);
  calculerCombinaisonPlan();
}

/* ============================================================
   Tle — VECTEURS DANS L'ESPACE (groupement B)
   ============================================================ */

function calculerVecteurEspace() {
  const ax = parseFloat(document.getElementById('ve-ax').value);
  const ay = parseFloat(document.getElementById('ve-ay').value);
  const az = parseFloat(document.getElementById('ve-az').value);
  const bx = parseFloat(document.getElementById('ve-bx').value);
  const by = parseFloat(document.getElementById('ve-by').value);
  const bz = parseFloat(document.getElementById('ve-bz').value);
  const zone = document.getElementById('ve-resultat');
  if (!zone || [ax, ay, az, bx, by, bz].some((v) => Number.isNaN(v))) return;

  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  const norme = Math.sqrt(x * x + y * y + z * z);

  zone.innerHTML = `Vecteur AB (${formater(x)} ; ${formater(y)} ; ${formater(z)}) — Norme ‖AB‖ = √(${formater(x)}² + ${formater(y)}² + ${formater(z)}²) ≈ ${formater(norme)}`;
}

function testerColinearite() {
  const ux = parseFloat(document.getElementById('ve-ux').value);
  const uy = parseFloat(document.getElementById('ve-uy').value);
  const uz = parseFloat(document.getElementById('ve-uz').value);
  const vx = parseFloat(document.getElementById('ve-vx').value);
  const vy = parseFloat(document.getElementById('ve-vy').value);
  const vz = parseFloat(document.getElementById('ve-vz').value);
  const zone = document.getElementById('ve-colineaire-resultat');
  if (!zone || [ux, uy, uz, vx, vy, vz].some((v) => Number.isNaN(v))) return;

  // Colinéarité en dimension 3 : produit vectoriel nul (aux erreurs
  // d'arrondi près), plus robuste qu'une simple comparaison de rapports
  // (qui échoue dès qu'une coordonnée est nulle).
  const px = uy * vz - uz * vy;
  const py = uz * vx - ux * vz;
  const pz = ux * vy - uy * vx;
  const normeProduit = Math.sqrt(px * px + py * py + pz * pz);

  if (normeProduit < 0.01) {
    zone.innerHTML = `Produit vectoriel u ∧ v = (${formater(px)} ; ${formater(py)} ; ${formater(pz)}) ≈ (0 ; 0 ; 0) → <strong>u et v sont colinéaires</strong>.`;
  } else {
    zone.innerHTML = `Produit vectoriel u ∧ v = (${formater(px)} ; ${formater(py)} ; ${formater(pz)}) ≠ (0 ; 0 ; 0) → <strong>u et v ne sont pas colinéaires</strong>.`;
  }
}

function initVecteursEspace() {
  document.getElementById('ve-calculer')?.addEventListener('click', calculerVecteurEspace);
  calculerVecteurEspace();
  document.getElementById('ve-colineaire')?.addEventListener('click', testerColinearite);
  testerColinearite();
}

/* ============================================================
   FILTRAGE DES ONGLETS SELON LA FILIÈRE (data-filieres) :
   - Vecteurs dans l'espace : groupement B (TRPM, TCI, MCC), Tle
   - Activités atelier : TRPM, TCI, logistique
   ============================================================ */

/** Affiche/masque un élément : attribut hidden (+ style.display pour rester compatible avec onglets-filiere.js). */
function afficher(element, visible) {
  element.hidden = !visible;
  element.style.display = visible ? '' : 'none';
}

function filtrerOngletsParFiliere() {
  const select = document.getElementById('select-filiere-pro');
  const zoneMessage = document.getElementById('td03-message-filiere');
  if (!select) return;

  function idFiliere(valeurSelect) {
    // Le sélecteur peut renvoyer soit l'id brut de la filière (ex.
    // "mcc"), soit une valeur préfixée par le niveau (ex. "tle-mcc") :
    // on prend systématiquement le dernier segment.
    return (valeurSelect || '').split('-').pop();
  }

  function appliquerFiltre() {
    const filiere = idFiliere(select.value);
    let premierVisible = null;
    let unOngletCache = false;

    document.querySelectorAll('.tabs-header .tab-btn').forEach((bouton) => {
      const restriction = bouton.dataset.filieres;
      const visible = !restriction || !filiere || restriction.split(',').includes(filiere);

      afficher(bouton, visible);

      const panneau = document.getElementById(bouton.dataset.tab);
      if (!visible) {
        unOngletCache = true;
        if (panneau) { panneau.classList.remove('actif'); panneau.hidden = true; }
        bouton.classList.remove('actif');
      } else if (!premierVisible) {
        premierVisible = bouton;
      }
    });

    // Si l'onglet actif vient d'être masqué, activer le premier onglet
    // encore visible.
    const activeVisible = document.querySelector('.tabs-header .tab-btn.actif');
    if (!activeVisible && premierVisible) {
      premierVisible.classList.add('actif');
      const panneau = document.getElementById(premierVisible.dataset.tab);
      if (panneau) { panneau.classList.add('actif'); panneau.hidden = false; }
    }

    if (zoneMessage) {
      if (unOngletCache && filiere) {
        const noms = [...document.querySelectorAll('.tabs-header .tab-btn')]
          .filter((bouton) => bouton.hidden)
          .map((bouton) => `« ${bouton.textContent.trim()} »`);
        afficher(zoneMessage, true);
        zoneMessage.textContent = `${noms.length > 1 ? 'Les onglets' : "L'onglet"} ${noms.join(', ')} ${noms.length > 1 ? 'ne sont pas proposés' : "n'est pas proposé"} pour votre filière.`;
      } else {
        afficher(zoneMessage, false);
      }
    }
  }

  select.addEventListener('change', appliquerFiltre);
  appliquerFiltre();
}

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
  etape('initVecteursPlan', () => { initVecteursPlan(); });
  etape('initVecteursEspace', () => { initVecteursEspace(); });
  etape('initAtelierStatique', () => { initAtelierStatique(); });
  etape('initContextePro', () => { initContextePro({ afficherProblematique: false, filieres: FILIERES_PRO, contextes: CONTEXTES_PRO }); });
  etape('garantirMenuFiliere', () => { garantirMenuFiliere(CONTEXTES_PRO); });
  etape('demarrerPuzzle', () => { demarrerPuzzle(G3); });
  etape('initPuzzleAffichage', () => { initPuzzleAffichage(); });
  etape('initSousOngletsPuzzle', () => { initSousOngletsPuzzle(); });
  etape('initOngletsParFiliere', () => { initOngletsParFiliere(); });
  etape('filtrageOngletsParFiliere', () => { filtrerOngletsParFiliere(); });
  etape('initSections', () => { initSections(); });
  etape('initTabs', () => { initTabs(); });
  etape('initModesOperatoires', () => { initModesOperatoires(); });
  etape('initRadarCompetences', () => { initRadarCompetences(); });
  etape('initQuestionsParOnglet', () => { initQuestionsParOnglet(); });
  etape('initNavigationTP', () => { initNavigationTP(); });
  etape('initImpressionCompteRendu', () => {
    initImpressionCompteRendu({ titre: 'Vecteurs du plan et de l\'espace', tp: 'TD03' });
  });
}
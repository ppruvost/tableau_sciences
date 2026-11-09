/**
 * mathilab/tp-geometrie/js/td04-trigonometrie.js
 *
 * Contrôleur du TD04 « Trigonométrie : cercle trigonométrique et fonctions sinus/cosinus ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-geometrie/modules/td04-trigonometrie.html dans #content.
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
import { G4 } from './puzzle-geometrie.js';

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
    "contexte": "En usinage, un angle de coupe ou une rotation de pièce sur un tour se décrivent à l'aide du cercle trigonométrique.",
    "problematiques": {
      "cercle-trigo": "Comment convertir un angle de rotation et en déterminer le cosinus et le sinus ?",
      "fonctions-sin-cos": "Comment décrire par une courbe sinus ou cosinus le mouvement périodique d'une pièce en rotation, en indiquant sa période ?"
    }
  },
  "1ere-tci": {
    "contexte": "En chaudronnerie, un angle de pliage ou de cintrage se décrit à l'aide du cercle trigonométrique.",
    "problematiques": {
      "cercle-trigo": "Comment convertir un angle de pliage et en déterminer le cosinus et le sinus ?",
      "fonctions-sin-cos": "Comment décrire par une courbe sinus ou cosinus un phénomène périodique lié à un angle de pliage ou de cintrage, en indiquant sa période ?"
    }
  },
  "1ere-mcc": {
    "contexte": "En confection, un angle de coupe de tissu ou une rotation de patron se décrivent à l'aide du cercle trigonométrique.",
    "problematiques": {
      "cercle-trigo": "Comment convertir un angle de coupe et en déterminer le cosinus et le sinus ?",
      "fonctions-sin-cos": "Comment décrire par une courbe sinus ou cosinus le mouvement périodique d'une aiguille de machine à coudre, en indiquant sa période ?"
    }
  }
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : Math.round(v * 10000) / 10000) : v;
}

/* ============================================================
   CERCLE TRIGONOMÉTRIQUE ET CONVERSION D'ANGLES
   ============================================================ */

function calculerCercleTrigo() {
  const degres = parseFloat(document.getElementById('ct-degres').value);
  const zone = document.getElementById('ct-resultat');
  if (!zone || Number.isNaN(degres)) return;

  const radians = (degres * Math.PI) / 180;
  const cosinus = Math.cos(radians);
  const sinus = Math.sin(radians);

  zone.innerHTML = `
    ${degres}° = ${degres} × π / 180 ≈ ${formater(radians)} rad<br>
    cos(${formater(radians)}) ≈ ${formater(cosinus)}<br>
    sin(${formater(radians)}) ≈ ${formater(sinus)}
  `;
}

function initCercleTrigo() {
  document.getElementById('ct-calculer')?.addEventListener('click', calculerCercleTrigo);
  calculerCercleTrigo();
}

/* ============================================================
   FILTRAGE DES ONGLETS SELON LA FILIÈRE (groupement B
   uniquement : TRPM, TCI, MCC — module absent pour AGorA et
   Logistique, faute de filière "groupement A" dans le référentiel)
   ============================================================ */

/** Affiche/masque un élément : attribut hidden (+ style.display pour rester compatible avec onglets-filiere.js). */
function afficher(element, visible) {
  element.hidden = !visible;
  element.style.display = visible ? '' : 'none';
}

function filtrerOngletsParFiliere() {
  const select = document.getElementById('select-filiere-pro');
  const zoneMessage = document.getElementById('td04-message-filiere');
  const zoneActivites = document.querySelector('.tabs-container');
  if (!select) return;

  function idFiliere(valeurSelect) {
    return (valeurSelect || '').split('-').pop();
  }

  function appliquerFiltre() {
    const filiere = idFiliere(select.value);
    let premierVisible = null;
    let toutCache = true;

    document.querySelectorAll('.tabs-header .tab-btn').forEach((bouton) => {
      const restriction = bouton.dataset.filieres;
      const visible = !restriction || !filiere || restriction.split(',').includes(filiere);

      afficher(bouton, visible);

      const panneau = document.getElementById(bouton.dataset.tab);
      if (!visible) {
        if (panneau) { panneau.classList.remove('actif'); panneau.hidden = true; }
        bouton.classList.remove('actif');
      } else {
        toutCache = false;
        if (!premierVisible) premierVisible = bouton;
      }
    });

    const activeVisible = document.querySelector('.tabs-header .tab-btn.actif');
    if (!activeVisible && premierVisible) {
      premierVisible.classList.add('actif');
      const panneau = document.getElementById(premierVisible.dataset.tab);
      if (panneau) { panneau.classList.add('actif'); panneau.hidden = false; }
    }

    if (zoneMessage) {
      if (toutCache && filiere) {
        afficher(zoneMessage, true);
        zoneMessage.textContent = "Ce TD (Trigonométrie) est réservé au groupement B (TRPM, TCI, MCC) : il ne concerne pas votre filière.";
        if (zoneActivites) afficher(zoneActivites, false);
      } else {
        afficher(zoneMessage, false);
        if (zoneActivites) afficher(zoneActivites, true);
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
  etape('initCercleTrigo', () => { initCercleTrigo(); });
  etape('initContextePro', () => { initContextePro({ afficherProblematique: false, filieres: FILIERES_PRO, contextes: CONTEXTES_PRO }); });
  etape('garantirMenuFiliere', () => { garantirMenuFiliere(CONTEXTES_PRO); });
  etape('demarrerPuzzle', () => { demarrerPuzzle(G4); });
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
    initImpressionCompteRendu({ titre: 'Trigonométrie : cercle trigonométrique et fonctions sinus/cosinus', tp: 'TD04' });
  });
}
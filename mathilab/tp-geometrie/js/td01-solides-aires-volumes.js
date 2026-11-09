/**
 * mathilab/tp-geometrie/js/td01-solides-aires-volumes.js
 *
 * Contrôleur du TD01 « Solides, aires, volumes, Pythagore et Thalès ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-geometrie/modules/td01-solides-aires-volumes.html dans #content.
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
import { G1 } from './puzzle-geometrie.js';

// puzzle-onglet.js : plusieurs emplacements essayés ; s'il est introuvable,
// seul le puzzle est désactivé (le reste du TD, dont le menu de filière, fonctionne).
let demarrerPuzzle = () => { console.error('[tp-geometrie] puzzle-onglet.js introuvable : puzzle désactivé'); };
for (const chemin of ['../../../js/puzzle-onglet.js', '../../js/puzzle-onglet.js']) {
  try { ({ demarrerPuzzle } = await import(chemin)); break; }
  catch (err) { console.warn('[tp-geometrie] import impossible :', chemin); }
}

// 2. Données propres au TD (contextes professionnels, constantes)
const CONTEXTES_PRO = {
  "2nde-remi": {
    "contexte": "En atelier de réalisation mécanique, contrôler qu'une pièce est d'équerre, calculer le volume de matière d'une pièce cylindrique, ou changer d'échelle un plan sont des gestes courants.",
    "problematiques": {
      "aires-perimetres": "Comment calculer l'aire et le périmètre d'une pièce plane (plaque, flasque) pour déterminer la matière à prévoir et la longueur à usiner ?",
      "volumes": "Comment calculer le volume d'une pièce cylindrique ou d'un bloc de matière pour prévoir la quantité de matière à approvisionner ?",
      "pythagore": "Comment vérifier, par le calcul, qu'une pièce est d'équerre et déterminer la longueur d'une diagonale ?",
      "thales": "Comment déterminer une longueur inaccessible ou intermédiaire sur une pièce ou un plan à l'aide de droites parallèles ?",
      "agrandissement": "Comment un changement d'échelle affecte-t-il les longueurs, l'aire et le volume d'une pièce ?"
    }
  },
  "2nde-mcc": {
    "contexte": "En atelier de confection, construire un patron à une autre échelle, ou vérifier l'équerrage d'une pièce de tissu découpée, font appel à la géométrie et au théorème de Pythagore.",
    "problematiques": {
      "aires-perimetres": "Comment calculer l'aire et le périmètre d'une pièce de tissu pour déterminer la quantité de tissu et la longueur de bordure à prévoir ?",
      "volumes": "Comment calculer le volume d'un rouleau ou d'un colis de tissu pour prévoir son stockage et son transport ?",
      "pythagore": "Comment vérifier qu'une pièce découpée est d'équerre et déterminer la longueur d'une diagonale de tissu ?",
      "thales": "Comment déterminer une longueur sur un patron en utilisant des droites parallèles et des proportions ?",
      "agrandissement": "Comment un changement d'échelle affecte-t-il les longueurs et l'aire d'un patron, donc la quantité de tissu nécessaire ?"
    }
  },
  "2nde-gatl": {
    "contexte": "En logistique, calculer le volume d'un colis ou d'un espace de stockage, ou vérifier l'agencement d'un entrepôt, font appel à des calculs d'aires et de volumes.",
    "problematiques": {
      "aires-perimetres": "Comment calculer l'aire et le périmètre d'une zone de stockage pour déterminer la surface au sol disponible et la longueur à baliser ?",
      "volumes": "Comment calculer le volume d'un colis ou d'un espace de stockage pour optimiser le rangement ?",
      "pythagore": "Comment contrôler qu'un emplacement de stockage est d'équerre et déterminer la longueur d'une diagonale pour y ranger un objet long ?",
      "thales": "Comment déterminer une hauteur ou une distance dans un entrepôt à l'aide de droites parallèles et de proportions ?",
      "agrandissement": "Comment un changement de dimensions d'un colis affecte-t-il sa surface et son volume de stockage ?"
    }
  }
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : Math.round(v * 1000) / 1000) : v;
}

/* ============================================================
   AIRES ET PÉRIMÈTRES
   ============================================================ */

const CONFIG_FIGURES = {
  carre:     { label1: 'Côté (cm)', label2: null },
  rectangle: { label1: 'Longueur (cm)', label2: 'Largeur (cm)' },
  triangle:  { label1: 'Base (cm)', label2: 'Hauteur (cm)' },
  disque:    { label1: 'Rayon (cm)', label2: null },
};

function actualiserChampsFigure() {
  const type = document.getElementById('fig-type').value;
  const config = CONFIG_FIGURES[type];
  document.getElementById('fig-dim1-label').textContent = config.label1;
  const groupe2 = document.getElementById('fig-dim2-groupe');
  if (config.label2) {
    groupe2.hidden = false;
    document.getElementById('fig-dim2-label').textContent = config.label2;
  } else {
    groupe2.hidden = true;
  }
}

function calculerFigure() {
  const type = document.getElementById('fig-type').value;
  const d1 = parseFloat(document.getElementById('fig-dim1').value);
  const d2 = parseFloat(document.getElementById('fig-dim2').value);
  const zone = document.getElementById('fig-resultat');
  if (Number.isNaN(d1)) return;

  let aire, perimetre, formule;

  switch (type) {
    case 'carre':
      aire = d1 * d1;
      perimetre = 4 * d1;
      formule = `Aire = côté² = ${d1}² = ${formater(aire)} cm² ; Périmètre = 4 × côté = ${formater(perimetre)} cm`;
      break;
    case 'rectangle':
      aire = d1 * d2;
      perimetre = 2 * (d1 + d2);
      formule = `Aire = L × l = ${d1} × ${d2} = ${formater(aire)} cm² ; Périmètre = 2(L + l) = ${formater(perimetre)} cm`;
      break;
    case 'triangle':
      aire = (d1 * d2) / 2;
      formule = `Aire = (base × hauteur) / 2 = (${d1} × ${d2}) / 2 = ${formater(aire)} cm² (périmètre non calculable sans les 3 côtés)`;
      perimetre = null;
      break;
    case 'disque':
      aire = Math.PI * d1 * d1;
      perimetre = 2 * Math.PI * d1;
      formule = `Aire = π × rayon² = ${formater(aire)} cm² ; Circonférence = 2π × rayon = ${formater(perimetre)} cm`;
      break;
  }

  zone.innerHTML = formule;
}

function initAiresPerimetres() {
  document.getElementById('fig-type')?.addEventListener('change', actualiserChampsFigure);
  document.getElementById('fig-calculer')?.addEventListener('click', calculerFigure);
  actualiserChampsFigure();
  calculerFigure();
}

/* ============================================================
   VOLUMES DE SOLIDES
   ============================================================ */

const CONFIG_SOLIDES = {
  cube:     { label1: 'Arête (cm)', label2: null, label3: null },
  pave:     { label1: 'Longueur (cm)', label2: 'Largeur (cm)', label3: 'Hauteur (cm)' },
  cylindre: { label1: 'Rayon (cm)', label2: null, label3: 'Hauteur (cm)' },
  pyramide: { label1: 'Aire de la base (cm²)', label2: null, label3: 'Hauteur (cm)' },
  cone:     { label1: 'Rayon (cm)', label2: null, label3: 'Hauteur (cm)' },
  boule:    { label1: 'Rayon (cm)', label2: null, label3: null },
};

function actualiserChampsSolide() {
  const type = document.getElementById('sol-type').value;
  const config = CONFIG_SOLIDES[type];

  document.getElementById('sol-dim1-label').textContent = config.label1;

  const g2 = document.getElementById('sol-dim2-groupe');
  const g3 = document.getElementById('sol-dim3-groupe');

  if (config.label2) {
    g2.hidden = false;
    document.getElementById('sol-dim2-label').textContent = config.label2;
  } else {
    g2.hidden = true;
  }

  if (config.label3) {
    g3.hidden = false;
    document.getElementById('sol-dim3-label').textContent = config.label3;
  } else {
    g3.hidden = true;
  }
}

function calculerSolide() {
  const type = document.getElementById('sol-type').value;
  const d1 = parseFloat(document.getElementById('sol-dim1').value);
  const d2 = parseFloat(document.getElementById('sol-dim2').value);
  const d3 = parseFloat(document.getElementById('sol-dim3').value);
  const zone = document.getElementById('sol-resultat');
  if (Number.isNaN(d1)) return;

  let volume, surface = null, formule;

  switch (type) {
    case 'cube':
      volume = d1 ** 3;
      surface = 6 * d1 * d1;
      formule = `Volume = arête³ = ${d1}³ = ${formater(volume)} cm³ ; Surface totale = 6 × arête² = ${formater(surface)} cm²`;
      break;
    case 'pave':
      volume = d1 * d2 * d3;
      surface = 2 * (d1 * d2 + d1 * d3 + d2 * d3);
      formule = `Volume = L × l × h = ${formater(volume)} cm³ ; Surface totale = ${formater(surface)} cm²`;
      break;
    case 'cylindre':
      volume = Math.PI * d1 * d1 * d3;
      surface = 2 * Math.PI * d1 * d1 + 2 * Math.PI * d1 * d3;
      formule = `Volume = π × rayon² × hauteur = ${formater(volume)} cm³ ; Surface totale = ${formater(surface)} cm²`;
      break;
    case 'pyramide':
      volume = (d1 * d3) / 3;
      formule = `Volume = (aire de la base × hauteur) / 3 = (${d1} × ${d3}) / 3 = ${formater(volume)} cm³`;
      break;
    case 'cone':
      volume = (Math.PI * d1 * d1 * d3) / 3;
      formule = `Volume = (π × rayon² × hauteur) / 3 = ${formater(volume)} cm³`;
      break;
    case 'boule':
      volume = (4 / 3) * Math.PI * d1 ** 3;
      formule = `Volume = (4/3) × π × rayon³ = ${formater(volume)} cm³`;
      break;
  }

  zone.innerHTML = formule;
}

function initVolumes() {
  document.getElementById('sol-type')?.addEventListener('change', actualiserChampsSolide);
  document.getElementById('sol-calculer')?.addEventListener('click', calculerSolide);
  actualiserChampsSolide();
  calculerSolide();
}

/* ============================================================
   THÉORÈME DE PYTHAGORE ET SA RÉCIPROQUE
   ============================================================ */

function calculerPythagore() {
  const a = parseFloat(document.getElementById('pyth-a').value);
  const b = parseFloat(document.getElementById('pyth-b').value);
  const zone = document.getElementById('pyth-resultat');
  if (Number.isNaN(a) || Number.isNaN(b)) return;

  const c = Math.sqrt(a * a + b * b);
  zone.innerHTML = `c² = a² + b² = ${a}² + ${b}² = ${formater(a * a + b * b)} → c = √${formater(a * a + b * b)} ≈ ${formater(c)} cm`;
}

function verifierReciproquePythagore() {
  const a = parseFloat(document.getElementById('pyth-r-a').value);
  const b = parseFloat(document.getElementById('pyth-r-b').value);
  const c = parseFloat(document.getElementById('pyth-r-c').value);
  const zone = document.getElementById('pyth-r-resultat');
  if ([a, b, c].some((v) => Number.isNaN(v))) return;

  const sommeCarres = a * a + b * b;
  const carreGrandCote = c * c;
  const ecart = Math.abs(sommeCarres - carreGrandCote);

  if (ecart < 0.05) {
    zone.innerHTML = `a² + b² = ${formater(sommeCarres)} et c² = ${formater(carreGrandCote)} : ces valeurs sont égales (aux erreurs de mesure près) → <strong>le triangle est rectangle</strong>.`;
  } else {
    zone.innerHTML = `a² + b² = ${formater(sommeCarres)} et c² = ${formater(carreGrandCote)} : ces valeurs sont différentes → <strong>le triangle n'est pas rectangle</strong>.`;
  }
}

function initPythagore() {
  document.getElementById('pyth-calculer')?.addEventListener('click', calculerPythagore);
  calculerPythagore();
  document.getElementById('pyth-r-verifier')?.addEventListener('click', verifierReciproquePythagore);
  verifierReciproquePythagore();
}

/* ============================================================
   THÉORÈME DE THALÈS
   ============================================================ */

function calculerThales() {
  const ab = parseFloat(document.getElementById('th-ab').value);
  const ac = parseFloat(document.getElementById('th-ac').value);
  const bc = parseFloat(document.getElementById('th-bc').value);
  const ad = parseFloat(document.getElementById('th-ad').value);
  const zone = document.getElementById('th-resultat');
  if ([ab, ac, bc, ad].some((v) => Number.isNaN(v)) || ab === 0) return;

  if (ad > ab) {
    zone.innerHTML = `⚠ AD (${ad}) doit être inférieur à AB (${ab}) : D doit appartenir au segment [AB].`;
    return;
  }

  const rapport = ad / ab;
  const ae = rapport * ac;
  const de = rapport * bc;

  zone.innerHTML = `
    AD/AB = ${ad}/${ab} = ${formater(rapport)}<br>
    AE = (AD/AB) × AC = ${formater(rapport)} × ${ac} = <strong>${formater(ae)}</strong><br>
    DE = (AD/AB) × BC = ${formater(rapport)} × ${bc} = <strong>${formater(de)}</strong>
  `;
}

function initThales() {
  document.getElementById('th-calculer')?.addEventListener('click', calculerThales);
  calculerThales();
}

/* ============================================================
   AGRANDISSEMENT / RÉDUCTION
   ============================================================ */

function calculerAgrandissement() {
  const k = parseFloat(document.getElementById('agr-k').value);
  const longueur = parseFloat(document.getElementById('agr-longueur').value);
  const aire = parseFloat(document.getElementById('agr-aire').value);
  const volume = parseFloat(document.getElementById('agr-volume').value);
  const zone = document.getElementById('agr-resultat');
  if ([k, longueur, aire, volume].some((v) => Number.isNaN(v))) return;

  const nature = k > 1 ? 'agrandissement' : (k < 1 ? 'réduction' : 'transformation neutre (k = 1)');

  zone.innerHTML = `
    Coefficient k = ${k} → ${nature}<br>
    Nouvelle longueur = longueur × k = ${longueur} × ${k} = <strong>${formater(longueur * k)} cm</strong><br>
    Nouvelle aire = aire × k² = ${aire} × ${k}² = <strong>${formater(aire * k * k)} cm²</strong><br>
    Nouveau volume = volume × k³ = ${volume} × ${k}³ = <strong>${formater(volume * k ** 3)} cm³</strong>
  `;
}

function initAgrandissement() {
  document.getElementById('agr-calculer')?.addEventListener('click', calculerAgrandissement);
  calculerAgrandissement();
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
  etape('initAiresPerimetres', () => { initAiresPerimetres(); });
  etape('initVolumes', () => { initVolumes(); });
  etape('initPythagore', () => { initPythagore(); });
  etape('initThales', () => { initThales(); });
  etape('initAgrandissement', () => { initAgrandissement(); });
  etape('initContextePro', () => { initContextePro({ afficherProblematique: false, filieres: FILIERES_PRO, contextes: CONTEXTES_PRO }); });
  etape('garantirMenuFiliere', () => { garantirMenuFiliere(CONTEXTES_PRO); });
  etape('demarrerPuzzle', () => { demarrerPuzzle(G1); });
  etape('initSousOngletsPuzzle', () => { initSousOngletsPuzzle(); });
  etape('initOngletsParFiliere', () => { initOngletsParFiliere(); });
  etape('initSections', () => { initSections(); });
  etape('initTabs', () => { initTabs(); });
  etape('initModesOperatoires', () => { initModesOperatoires(); });
  etape('initRadarCompetences', () => { initRadarCompetences(); });
  etape('initQuestionsParOnglet', () => { initQuestionsParOnglet(); });
  etape('initNavigationTP', () => { initNavigationTP(); });
  etape('initImpressionCompteRendu', () => {
    initImpressionCompteRendu({ titre: 'Solides, aires, volumes, Pythagore et Thalès', tp: 'TD01' });
  });
}
/**
 * MATHILAB — STATISTIQUE ET PROBABILITÉS
 * TD S04 : Nuage de points et ajustement (1ère / Tle)
 * mathilab/tp-statistiques/js/td04-nuage-points-ajustement.js
 */

import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import { initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { garantirMenuFiliere } from './filiere-select.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';
import { demarrerPuzzle } from '../../../js/puzzle-onglet.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { S4 as MODELE_PUZZLE } from './puzzle-statistiques.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — une problématique par onglet
   1ère : onglets « affine » et « interpolation » ;
   Tle : + onglet « ajustement non affine ».
   ============================================================ */

const DONNEES_FILIERES = {
  tci: {
    ctx1ere: "L'épaisseur d'une tôle et le temps de découpe nécessaire sont deux grandeurs liées par le processus de chaudronnerie.",
    affine: "Existe-t-il un lien affine entre l'épaisseur de tôle et le temps de découpe, et avec quelle qualité ?",
    interp: "Comment prévoir le temps de découpe d'une épaisseur non encore testée ?",
    ctxTle: "Certaines relations d'usure d'outil ne sont pas linéaires en fonction de la vitesse de coupe.",
    nonAffine: "Quel modèle choisir lorsque la relation entre deux grandeurs n'est pas affine ?"
  },
  trpm: {
    ctx1ere: "La vitesse de coupe et la durée de vie d'un outillage sont deux grandeurs liées lors de la réalisation d'un produit mécanique.",
    affine: "Existe-t-il un lien affine entre la vitesse de coupe et la durée de vie d'un outillage, et avec quelle qualité ?",
    interp: "Comment estimer la durée de vie d'un outillage pour une vitesse de coupe non testée ?",
    ctxTle: "Certaines relations d'usure d'outillage (durée de vie selon la vitesse) ne sont pas linéaires.",
    nonAffine: "Quel modèle non affine choisir pour ajuster la durée de vie d'un outillage ?"
  },
  mcc: {
    ctx1ere: "La taille d'une cliente et la quantité de tissu nécessaire à une robe varient ensemble de façon à peu près proportionnelle.",
    affine: "Existe-t-il un lien affine entre la taille d'une cliente et la quantité de tissu nécessaire, et avec quelle qualité ?",
    interp: "Comment estimer la quantité de tissu nécessaire pour une taille non mesurée ?",
    ctxTle: "Certaines relations de production (temps de finition selon la complexité d'un modèle) ne sont pas linéaires.",
    nonAffine: "Quel modèle non affine choisir pour ajuster un nuage de points en confection ?"
  },
  agora: {
    ctx1ere: "Le nombre de dossiers traités et le temps de traitement associé sont deux grandeurs liées dans un service administratif.",
    affine: "Existe-t-il un lien affine entre le nombre de dossiers traités et le temps de traitement, et avec quelle qualité ?",
    interp: "Comment estimer le temps de traitement d'un volume de dossiers inhabituel ?",
    ctxTle: "Certaines évolutions administratives (délai de traitement selon la charge) ne sont pas strictement linéaires.",
    nonAffine: "Quel modèle non affine choisir pour ajuster un délai de traitement administratif ?"
  },
  log: {
    ctx1ere: "Le nombre de colis d'une commande et le temps de préparation associé sont deux grandeurs liées en entrepôt.",
    affine: "Existe-t-il un lien affine entre le nombre de colis d'une commande et le temps de préparation, et avec quelle qualité ?",
    interp: "Comment estimer le temps de préparation d'une commande de taille inhabituelle ?",
    ctxTle: "Certaines évolutions logistiques (délai selon la distance) ne sont pas strictement linéaires.",
    nonAffine: "Quel modèle non affine choisir pour ajuster une évolution logistique ?"
  }
};

const CONTEXTES_PRO = {};
Object.entries(DONNEES_FILIERES).forEach(([filiere, d]) => {
  CONTEXTES_PRO[`1ere-${filiere}`] = {
    contexte: d.ctx1ere,
    problematiques: {
      'nuage-ajustement-affine': d.affine,
      'interpoler-extrapoler': d.interp
    }
  };
  CONTEXTES_PRO[`tle-${filiere}`] = {
    contexte: d.ctxTle,
    problematiques: {
      'nuage-ajustement-affine': d.affine,
      'interpoler-extrapoler': d.interp,
      'ajustement-non-affine': d.nonAffine
    }
  };
});

/* ============================================================
   RÉGRESSION LINÉAIRE (moindres carrés) ET NUAGE DE POINTS
   ============================================================ */

function regressionLineaire(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);

  const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const b = (sy - a * sx) / n;

  const moyY = sy / n;
  const ssTot = points.reduce((s, p) => s + (p.y - moyY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (a * p.x + b)) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { a, b, r2 };
}

function dessinerNuage(conteneurId, points, regression) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;
  if (points.length < 3) {
    conteneur.innerHTML = '<p class="info">Saisir au moins 3 points pour tracer le nuage.</p>';
    return;
  }
  const largeur = 480, hauteur = 260;
  const marge = { haut: 16, bas: 30, gauche: 44, droite: 16 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;

  const xMin = Math.min(...points.map(p => p.x)), xMax = Math.max(...points.map(p => p.x));
  const yMin = Math.min(...points.map(p => p.y)), yMax = Math.max(...points.map(p => p.y));
  const etX = (xMax - xMin) || 1, etY = (yMax - yMin) || 1;

  const x = v => marge.gauche + ((v - xMin) / etX) * largeurUtile;
  const y = v => marge.haut + hauteurUtile - ((v - yMin) / etY) * hauteurUtile;

  const pointsSvg = points.map(p => `<circle cx="${x(p.x).toFixed(1)}" cy="${y(p.y).toFixed(1)}" r="3.5" class="diagramme-barre" />`).join('');

  let droite = '';
  if (regression) {
    const y1 = regression.a * xMin + regression.b;
    const y2 = regression.a * xMax + regression.b;
    droite = `<line x1="${x(xMin).toFixed(1)}" y1="${y(y1).toFixed(1)}" x2="${x(xMax).toFixed(1)}" y2="${y(y2).toFixed(1)}" stroke="var(--domaine-accent)" stroke-width="2" />`;
  }

  conteneur.innerHTML = `
    <svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      ${droite}
      ${pointsSvg}
    </svg>`;
}

/* ============================================================
   ONGLET 1 — NUAGE DE POINTS ET AJUSTEMENT AFFINE
   ============================================================ */

const pointsAffine = [];
let regressionCourante = null;

function actualiserNuageAffine() {
  document.getElementById('na-tbody').innerHTML = pointsAffine
    .map((p, i) => `<tr><td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td></tr>`).join('');

  const resultat = document.getElementById('na-resultat');
  if (pointsAffine.length < 3) {
    resultat.textContent = '';
    regressionCourante = null;
    dessinerNuage('na-nuage', pointsAffine, null);
    return;
  }
  regressionCourante = regressionLineaire(pointsAffine);
  const signeB = regressionCourante.b < 0 ? '−' : '+';
  resultat.textContent =
    `y = ${regressionCourante.a.toFixed(3)} x ${signeB} ${Math.abs(regressionCourante.b).toFixed(3)}   —   R² = ${regressionCourante.r2.toFixed(3)}`;
  dessinerNuage('na-nuage', pointsAffine, regressionCourante);
}

function initNuageAffine() {
  document.getElementById('na-ajouter')?.addEventListener('click', () => {
    const x = parseFloat(document.getElementById('na-x').value);
    const y = parseFloat(document.getElementById('na-y').value);
    if (Number.isNaN(x) || Number.isNaN(y)) return;
    pointsAffine.push({ x, y });
    document.getElementById('na-x').value = '';
    document.getElementById('na-y').value = '';
    actualiserNuageAffine();
  });
  actualiserNuageAffine();
}

/* ============================================================
   ONGLET 2 — INTERPOLER / EXTRAPOLER
   ============================================================ */

function initInterpolerExtrapoler() {
  document.getElementById('ie-estimer')?.addEventListener('click', () => {
    const div = document.getElementById('ie-resultat');
    if (!regressionCourante) {
      div.textContent = "Construire d'abord l'ajustement dans l'onglet précédent (au moins 3 points).";
      return;
    }
    const x = parseFloat(document.getElementById('ie-x').value);
    if (Number.isNaN(x)) return;
    const y = regressionCourante.a * x + regressionCourante.b;
    const xs = pointsAffine.map(p => p.x);
    const type = (x >= Math.min(...xs) && x <= Math.max(...xs)) ? 'interpolation' : 'extrapolation';
    div.textContent = `Pour x = ${x} : y ≈ ${y.toFixed(2)} (${type})`;
  });
}

/* ============================================================
   ONGLET 3 (Tle) — AJUSTEMENT NON AFFINE : z = log10(y)
   ============================================================ */

const pointsNonAffine = [];

function actualiserNonAffine() {
  document.getElementById('na2-tbody').innerHTML = pointsNonAffine
    .map((p, i) => `<tr><td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td><td>${Math.log10(p.y).toFixed(3)}</td></tr>`).join('');

  const resultat = document.getElementById('na2-resultat');
  if (pointsNonAffine.length < 3) {
    resultat.textContent = '';
    document.getElementById('na2-nuage').innerHTML = '';
    return;
  }

  const pointsZ = pointsNonAffine.map(p => ({ x: p.x, y: Math.log10(p.y) }));
  const reg = regressionLineaire(pointsZ);
  const K = reg.b, A = reg.a;
  resultat.textContent =
    `z = ${A.toFixed(3)} x + ${K.toFixed(3)}  →  y ≈ 10^${K.toFixed(3)} × 10^(${A.toFixed(3)} x)   —   R² (sur x, z) = ${reg.r2.toFixed(3)}`;
  dessinerNuage('na2-nuage', pointsZ, reg);
}

function initNonAffine() {
  document.getElementById('na2-ajouter')?.addEventListener('click', () => {
    const x = parseFloat(document.getElementById('na2-x').value);
    const y = parseFloat(document.getElementById('na2-y').value);
    if (Number.isNaN(x) || Number.isNaN(y) || y <= 0) return;
    pointsNonAffine.push({ x, y });
    document.getElementById('na2-x').value = '';
    document.getElementById('na2-y').value = '';
    actualiserNonAffine();
  });
  actualiserNonAffine();
}

/* ============================================================
   FILTRAGE DES ONGLETS PAR NIVEAU (onglet Tle)
   ============================================================ */

function afficher(element, visible) {
  if (!element) return;
  element.hidden = !visible;
  element.style.display = visible ? '' : 'none';
}

// Valeur du menu : <niveau>-<filière> (2nde-remi, 1ere-trpm, tle-mcc) → premier segment
function idNiveau() {
  const valeur = document.getElementById('select-filiere-pro')?.value || '';
  return valeur.split('-')[0];
}

function filtrerOngletsParNiveau() {
  const estTle = idNiveau() === 'tle';

  document.querySelectorAll('.tabs-container [data-niveau="tle"]').forEach(el => afficher(el, estTle));

  // Si l'onglet actif vient d'être masqué, revenir au premier onglet visible
  const actif = document.querySelector('.tabs-header .tab-btn.actif');
  if (actif && actif.hidden) {
    [...document.querySelectorAll('.tabs-header .tab-btn')].find(b => !b.hidden)?.click();
  }

  const message = document.getElementById('td04-message-filiere');
  if (message) {
    message.textContent = estTle
      ? "Onglet « Ajustement non affine » disponible pour le niveau Terminale."
      : "Sélectionner votre filière ci-dessus : l'onglet « Ajustement non affine » n'apparaît qu'au niveau Terminale.";
  }
}

function initFiltrageNiveau() {
  const select = document.getElementById('select-filiere-pro');
  if (select && select.dataset.td04Lie !== '1') {
    select.dataset.td04Lie = '1';
    select.addEventListener('change', filtrerOngletsParNiveau);
  }
  filtrerOngletsParNiveau();
}

/* ============================================================
   INITIALISATION (appelée par navigation.js après chargement du fragment)
   ============================================================ */

function etape(nom, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[tp-statistiques] étape « ${nom} » en erreur :`, err);
  }
}

export function init() {

  pointsAffine.length = 0;
  pointsNonAffine.length = 0;
  regressionCourante = null;

  etape('zoom', () => initZoomVisuels());
  etape('onglet 1 : nuage et ajustement affine', initNuageAffine);
  etape('onglet 2 : interpoler / extrapoler', initInterpolerExtrapoler);
  etape('onglet 3 : ajustement non affine', initNonAffine);
  etape('contexte pro', () => initContextePro({
    afficherProblematique: false,
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO
  }));
  etape('menu filière', () => garantirMenuFiliere(CONTEXTES_PRO));
  etape('puzzle', () => demarrerPuzzle(MODELE_PUZZLE));
  etape('onglets par filière', () => initOngletsParFiliere());
  etape('filtrage des onglets par niveau', initFiltrageNiveau);
  etape('sections', () => initSections());
  etape('onglets', () => initTabs());
  etape('modes opératoires', () => initModesOperatoires());
  etape('radar', () => initRadarCompetences());
  etape('questions par onglet', () => initQuestionsParOnglet());
  etape('navigation TD', () => initNavigationTP());
  etape('impression', () => initImpressionCompteRendu({
    titre: 'Nuage de points et ajustement',
    tp: 'TD04'
  }));
}

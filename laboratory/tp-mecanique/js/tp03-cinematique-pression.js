/**
 * tp-mecanique/js/tp03-cinematique-pression.js
 *
 * Contrôleur du TP03 « Cinématique et pression ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-mecanique/modules/tp03-cinematique-pression.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro, getFiliereSelectionnee } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-mecanique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';
import { initAcquisitionExaoPression } from './exao-pression.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Un vérin pneumatique utilisé en chaudronnerie doit exercer une force pressante suffisante sur une pièce, tout en respectant la pression maximale admissible du circuit d'air comprimé.",
    problematique: "Comment calculer la pression exercée par un vérin et vérifier son évolution lorsque le volume d'air comprimé varie ?",
  },

  '1ere-trpm': {
    contexte: "Le déplacement rapide d'un chariot automatisé sur une machine-outil doit être maîtrisé en accélération pour éviter tout à-coup préjudiciable à la précision de l'usinage.",
    problematique: "Comment caractériser l'accélération d'un chariot automatisé et la pression exercée par un vérin de serrage ?",
  },

  '1ere-mcc': {
    contexte: "Le déplacement du tissu sous le pied-de-biche d'une machine à coudre doit être régulier, tandis que la pression exercée par ce pied-de-biche conditionne la qualité de l'entraînement du tissu.",
    problematique: "Comment caractériser l'accélération du tissu entraîné et la pression exercée par le pied-de-biche ?",
  },

};

export function init() {

  initVitesseAcceleration();
  initSimulateurAcceleration();
  initPressionForce();
  initSurfacePiston();
  initForceInverse();
  initBoyleMariotte();
  initTableauMesuresBoyleMariotte();
  initAcquisitionExaoPression();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'CinematiquePression',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Caractériser l'accélération et la vitesse » et « Distinguer
  // pression et force pressante » sont communs aux trois filières en
  // 1ère (TCI, TRPM, MCC), non repris ensuite.
  initOngletsParFiliere({
    mapping: {
      '2nde-remi': [],
      '2nde-mcc':  [],
      '1ere-tci':  ['vitesse-acceleration', 'pression-force', 'acquisition-exao'],
      '1ere-trpm': ['vitesse-acceleration', 'pression-force', 'acquisition-exao'],
      '1ere-mcc':  ['vitesse-acceleration', 'pression-force', 'acquisition-exao'],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   [],
    },
    messageId: 'tp03m-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre niveau : l'accélération et la pression sont étudiées en classe de 1ère.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Cinématique et pression',
    tp: 'TP03',
  });
}

// =================================================================
// Onglet 1 — Accélération moyenne a = (v2 - v1) / (t2 - t1)
// =================================================================
function initVitesseAcceleration() {

  const inputT1 = $('acc-t1');
  const inputV1 = $('acc-v1');
  const inputT2 = $('acc-t2');
  const inputV2 = $('acc-v2');
  const zoneResultat = $('acc-resultat');

  if (!inputT1 || !inputV1 || !inputT2 || !inputV2 || !zoneResultat) return;

  function calculer() {

    const t1 = parseFloat(inputT1.value);
    const v1 = parseFloat(inputV1.value);
    const t2 = parseFloat(inputT2.value);
    const v2 = parseFloat(inputV2.value);

    if ([t1, v1, t2, v2].some(Number.isNaN) || t2 === t1) {
      zoneResultat.textContent = 'Saisir deux instants et les vitesses correspondantes pour calculer l\'accélération moyenne entre ces deux instants.';
      return;
    }

    const a = (v2 - v1) / (t2 - t1);
    const nature = a > 0.05 ? 'le mouvement accélère' : (a < -0.05 ? 'le mouvement ralentit' : 'la vitesse reste globalement constante (mouvement uniforme)');

    zoneResultat.innerHTML = `
      Accélération moyenne a = <strong>${arrondir(a, 3)} m/s²</strong><br>
      Entre ces deux instants, ${nature}.
    `;
  }

  [inputT1, inputV1, inputT2, inputV2].forEach(input => input.addEventListener('input', calculer));
}

// =================================================================
// Onglet 1 (bis) — Simulateur animé de mouvement rectiligne
//
// Remplace vidéo / chronophotographie / ExAO lorsqu'aucun de ces
// moyens n'est disponible : anime un mobile sur un rail avec un
// chronomètre et un compteur de vitesse. L'élève met l'enregistrement
// en pause à deux instants de son choix, note les valeurs affichées
// (bouton dédié), qui sont reportées automatiquement dans les champs
// acc-t1 / acc-v1 / acc-t2 / acc-v2 pour déclencher le calcul de
// initVitesseAcceleration() ci-dessus.
//
// Le mobile animé (nom + pictogramme) s'adapte à la filière
// professionnelle choisie dans « Contexte professionnel », afin que
// la situation simulée corresponde à celle de l'élève.
// =================================================================
const DUREE_SIMULATION = 6; // s

const MOBILE_PAR_FILIERE = {
  '1ere-tci':  { nom: 'la pièce déplacée sur la ligne de chaudronnerie', icone: '🔧' },
  '1ere-trpm': { nom: 'le chariot automatisé de la machine-outil',       icone: '🤖' },
  '1ere-mcc':  { nom: 'le tissu entraîné par la machine à coudre',       icone: '🧵' },
};
const MOBILE_PAR_DEFAUT = { nom: 'le mobile étudié', icone: '⚫' };

function mobileSimule() {
  const filiere = getFiliereSelectionnee();
  return (filiere && MOBILE_PAR_FILIERE[filiere.cle]) || MOBILE_PAR_DEFAUT;
}

// Trois natures de mouvement possibles, tirées au hasard, avec des
// paramètres physiquement réalistes pour un mobile de TP (chariot,
// pièce, tissu...). La distance parcourue (xFin) sert ensuite à mettre
// automatiquement à l'échelle le rail dessiné, quel que soit le tirage.
function genererScenarioMouvement() {
  const type = ['acceleree', 'ralentie', 'uniforme'][Math.floor(Math.random() * 3)];
  let v0, a;

  if (type === 'acceleree') {
    v0 = Math.random() * 0.15;                 // 0 .. 0,15 m/s
    a  = 0.05 + Math.random() * 0.06;           // 0,05 .. 0,11 m/s²
  } else if (type === 'ralentie') {
    v0 = 1.0 + Math.random() * 0.5;             // 1,0 .. 1,5 m/s
    a  = -(0.06 + Math.random() * 0.09);        // -0,06 .. -0,15 m/s²
  } else {
    v0 = 0.5 + Math.random() * 0.6;             // 0,5 .. 1,1 m/s
    a  = 0;
  }

  const T = DUREE_SIMULATION;
  const xFin = Math.max(v0 * T + 0.5 * a * T * T, 0.3);

  return { type, v0, a, T, xFin };
}

function initSimulateurAcceleration() {

  const canvasScene   = $('acc-sim-canvas');
  const canvasGraphe  = $('acc-sim-canvas-graphe');
  const zoneTemps     = $('acc-sim-temps');
  const zoneVitesse   = $('acc-sim-vitesse');
  const zoneMobileNom = $('acc-sim-mobile-nom');
  const zoneMessage   = $('acc-sim-message');
  const btnToggle     = $('acc-sim-toggle');
  const btnNouveau    = $('acc-sim-nouveau');
  const btnNoter1     = $('acc-sim-noter1');
  const btnNoter2     = $('acc-sim-noter2');

  const inputT1 = $('acc-t1');
  const inputV1 = $('acc-v1');
  const inputT2 = $('acc-t2');
  const inputV2 = $('acc-v2');

  if (!canvasScene || !canvasGraphe || !btnToggle || !btnNouveau || !btnNoter1 || !btnNoter2) return;

  let scenario = genererScenarioMouvement();
  let simTime = 0;
  let running = false;
  let dernierTs = null;
  let rafId = null;
  let point1 = null; // { t, v } noté par l'élève
  let point2 = null;

  const position = t => scenario.v0 * t + 0.5 * scenario.a * t * t;
  const vitesseA = t => Math.max(0, scenario.v0 + scenario.a * t);

  function majNomMobile() {
    if (zoneMobileNom) zoneMobileNom.textContent = mobileSimule().nom;
  }

  function declencherInput(el) {
    if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function majCadrans() {
    if (zoneTemps) zoneTemps.textContent = `${arrondir(simTime, 2)} s`;
    if (zoneVitesse) zoneVitesse.textContent = `${arrondir(vitesseA(simTime), 2)} m/s`;
  }

  function dessinerScene() {
    const conteneur = canvasScene.parentElement;
    const largeur = (conteneur && conteneur.clientWidth) || 600;
    const hauteur = 150;
    const dpr = window.devicePixelRatio || 1;

    canvasScene.width = largeur * dpr;
    canvasScene.height = hauteur * dpr;
    const ctx = canvasScene.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largeur, hauteur);

    const margeG = 20, margeD = 30, yRail = hauteur - 40;
    const pixelsParMetre = (largeur - margeG - margeD) / scenario.xFin;

    ctx.strokeStyle = '#999';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margeG, yRail);
    ctx.lineTo(largeur - margeD, yRail);
    ctx.stroke();

    ctx.strokeStyle = '#ccc';
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const pasGrad = scenario.xFin / 5;
    for (let i = 0; i <= 5; i++) {
      const xm = i * pasGrad;
      const xp = margeG + xm * pixelsParMetre;
      ctx.beginPath();
      ctx.moveTo(xp, yRail - 6);
      ctx.lineTo(xp, yRail + 6);
      ctx.stroke();
      ctx.fillText(`${arrondir(xm, 1)} m`, xp, yRail + 20);
    }

    function marqueurInstant(pt, couleur, etiquette) {
      if (!pt) return;
      const xp = margeG + position(pt.t) * pixelsParMetre;
      ctx.strokeStyle = couleur;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xp, yRail - 34);
      ctx.lineTo(xp, yRail + 10);
      ctx.stroke();
      ctx.fillStyle = couleur;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(etiquette, xp, yRail - 36);
    }
    marqueurInstant(point1, '#e67e22', 't₁');
    marqueurInstant(point2, '#c0392b', 't₂');

    const xMobile = margeG + position(simTime) * pixelsParMetre;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(mobileSimule().icone, xMobile, yRail - 4);
  }

  function dessinerGraphe() {
    const conteneur = canvasGraphe.parentElement;
    const largeur = (conteneur && conteneur.clientWidth) || 600;
    const hauteur = 200;
    const dpr = window.devicePixelRatio || 1;

    canvasGraphe.width = largeur * dpr;
    canvasGraphe.height = hauteur * dpr;
    const ctx = canvasGraphe.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largeur, hauteur);

    const marge = 45;
    const tMax = scenario.T;
    const vMax = Math.max(scenario.v0, vitesseA(scenario.T)) * 1.2 || 1;

    const xPix = t => marge + (t / tMax) * (largeur - marge - 15);
    const yPix = v => hauteur - marge - (v / vMax) * (hauteur - marge - 15);

    ctx.strokeStyle = '#e5e5e5';
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const t = (tMax * i) / 5;
      const x = xPix(t);
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, hauteur - marge);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(arrondir(t, 1), x, hauteur - marge + 14);

      const v = (vMax * i) / 5;
      const y = yPix(v);
      ctx.beginPath();
      ctx.moveTo(marge, y);
      ctx.lineTo(largeur - 15, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(arrondir(v, 2), marge - 6, y + 3);
    }

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marge, 10);
    ctx.lineTo(marge, hauteur - marge);
    ctx.lineTo(largeur - 15, hauteur - marge);
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('t (s)', largeur / 2, hauteur - 6);
    ctx.save();
    ctx.translate(12, hauteur / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('v (m/s)', 0, 0);
    ctx.restore();

    ctx.strokeStyle = '#1B6CA8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let premier = true;
    for (let t = 0; t <= simTime; t += 0.05) {
      const x = xPix(t), y = yPix(vitesseA(t));
      if (premier) { ctx.moveTo(x, y); premier = false; } else ctx.lineTo(x, y);
    }
    ctx.lineTo(xPix(simTime), yPix(vitesseA(simTime)));
    ctx.stroke();

    function pointNote(pt, couleur, etiquette) {
      if (!pt) return;
      const x = xPix(pt.t), y = yPix(pt.v);
      ctx.fillStyle = couleur;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(etiquette, x, y - 10);
    }
    pointNote(point1, '#e67e22', 'v₁');
    pointNote(point2, '#c0392b', 'v₂');
  }

  function rafraichir() {
    majCadrans();
    dessinerScene();
    dessinerGraphe();
  }

  function boucle(ts) {
    if (!running) return;
    if (dernierTs === null) dernierTs = ts;
    const dt = (ts - dernierTs) / 1000;
    dernierTs = ts;
    simTime = Math.min(simTime + dt, scenario.T);
    rafraichir();
    if (simTime >= scenario.T) {
      arreter(true);
      return;
    }
    rafId = requestAnimationFrame(boucle);
  }

  function demarrer() {
    if (simTime >= scenario.T) return;
    running = true;
    dernierTs = null;
    btnToggle.textContent = '⏸️ Mettre en pause';
    btnNoter1.disabled = true;
    btnNoter2.disabled = true;
    rafId = requestAnimationFrame(boucle);
  }

  function arreter(termine) {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    btnToggle.textContent = termine ? '✅ Enregistrement terminé' : "▶️ Reprendre l'enregistrement";
    btnToggle.disabled = !!termine;
    if (simTime > 0) {
      btnNoter1.disabled = false;
      btnNoter2.disabled = false;
    }
  }

  function nouveauMouvement() {
    scenario = genererScenarioMouvement();
    simTime = 0;
    running = false;
    dernierTs = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    point1 = null;
    point2 = null;

    btnToggle.disabled = false;
    btnToggle.textContent = "▶️ Lancer l'enregistrement";
    btnNoter1.disabled = true;
    btnNoter2.disabled = true;
    if (zoneMessage) zoneMessage.style.display = 'none';

    [inputT1, inputV1, inputT2, inputV2].forEach(input => {
      if (!input) return;
      input.value = '';
      declencherInput(input);
    });

    rafraichir();
  }

  function noterInstant(numero) {
    const t = simTime;
    const v = vitesseA(simTime);

    if (numero === 1) {
      point1 = { t, v };
      if (inputT1) { inputT1.value = arrondir(t, 2); declencherInput(inputT1); }
      if (inputV1) { inputV1.value = arrondir(v, 2); declencherInput(inputV1); }
      if (zoneMessage) zoneMessage.style.display = 'none';
    } else {
      if (point1 && t <= point1.t && zoneMessage) {
        zoneMessage.textContent = "L'instant 2 doit être postérieur à l'instant 1 : relancez l'enregistrement et mettez-le en pause plus tard pour le noter à nouveau.";
        zoneMessage.style.display = 'block';
      } else if (zoneMessage) {
        zoneMessage.style.display = 'none';
      }
      point2 = { t, v };
      if (inputT2) { inputT2.value = arrondir(t, 2); declencherInput(inputT2); }
      if (inputV2) { inputV2.value = arrondir(v, 2); declencherInput(inputV2); }
    }

    dessinerScene();
    dessinerGraphe();
  }

  btnToggle.addEventListener('click', () => (running ? arreter(false) : demarrer()));
  btnNouveau.addEventListener('click', nouveauMouvement);
  btnNoter1.addEventListener('click', () => noterInstant(1));
  btnNoter2.addEventListener('click', () => noterInstant(2));

  document.getElementById('select-filiere-pro')?.addEventListener('change', () => {
    majNomMobile();
    dessinerScene();
  });

  majNomMobile();
  rafraichir();
}

// =================================================================
// Onglet 2 — Pression et force pressante P = F / S
// =================================================================
function initPressionForce() {

  const inputForce = $('pf-force');
  const inputSurface = $('pf-surface');
  const zoneResultat = $('pf-resultat');

  if (!inputForce || !inputSurface || !zoneResultat) return;

  function calculer() {

    const f = parseFloat(inputForce.value);
    const sCm2 = parseFloat(inputSurface.value);

    if (Number.isNaN(f) || Number.isNaN(sCm2) || sCm2 === 0) {
      zoneResultat.textContent = 'Saisir la force pressante et la surface pressée pour calculer la pression correspondante.';
      return;
    }

    const sM2 = sCm2 * 1e-4;
    const p = f / sM2;

    zoneResultat.innerHTML = `
      Pression P = F / S = <strong>${arrondir(p, 0)} Pa</strong>
      (soit ${arrondir(p / 100, 1)} hPa)
    `;
  }

  inputForce.addEventListener('input', calculer);
  inputSurface.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 (suite) — Surface du piston à partir de son diamètre
// S = π × (d/2)², reportée automatiquement dans le champ pf-surface
// pour être réutilisée par le calcul P = F/S ci-dessus.
// =================================================================
function initSurfacePiston() {

  const inputDiametre = $('pf-diametre');
  const inputSurface = $('pf-surface');
  const zoneResultat = $('pf-diametre-resultat');

  if (!inputDiametre || !inputSurface || !zoneResultat) return;

  inputDiametre.addEventListener('input', () => {

    const dMm = parseFloat(inputDiametre.value);

    if (Number.isNaN(dMm) || dMm <= 0) {
      zoneResultat.textContent = 'Saisir le diamètre interne du piston (indiqué sur la seringue) pour calculer automatiquement la surface pressée S et la reporter ci-dessous.';
      return;
    }

    const rMm = dMm / 2;
    const sMm2 = Math.PI * rMm * rMm;
    const sCm2 = sMm2 / 100;

    inputSurface.value = arrondir(sCm2, 3);
    inputSurface.dispatchEvent(new Event('input'));

    zoneResultat.innerHTML = `
      Surface S = π × (d/2)² = <strong>${arrondir(sCm2, 3)} cm²</strong>
      — reportée automatiquement dans le calcul P = F/S ci-dessus.
    `;
  });

}

// =================================================================
// Onglet 2 (suite) — Calcul inverse F = P × S à partir de la
// pression lue directement sur le capteur numérique ou le manomètre.
// =================================================================
function initForceInverse() {

  const inputPression = $('pf-pression-lue');
  const inputSurface = $('pf-surface-inverse');
  const zoneResultat = $('pf-inverse-resultat');

  if (!inputPression || !inputSurface || !zoneResultat) return;

  function calculer() {

    const pHpa = parseFloat(inputPression.value);
    const sCm2 = parseFloat(inputSurface.value);

    if (Number.isNaN(pHpa) || Number.isNaN(sCm2) || sCm2 === 0) {
      zoneResultat.textContent = 'Saisir la pression lue sur le dispositif et la surface du piston pour déduire la force pressante F = P × S.';
      return;
    }

    const pPa = pHpa * 100;
    const sM2 = sCm2 * 1e-4;
    const f = pPa * sM2;

    zoneResultat.innerHTML = `
      Force pressante F = P × S = <strong>${arrondir(f, 2)} N</strong>
    `;
  }

  inputPression.addEventListener('input', calculer);
  inputSurface.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 (suite) — Loi de Boyle-Mariotte P1×V1 = P2×V2
// =================================================================
function initBoyleMariotte() {

  const inputP1 = $('bm-p1');
  const inputV1 = $('bm-v1');
  const inputV2 = $('bm-v2');
  const zoneResultat = $('bm-resultat');

  if (!inputP1 || !inputV1 || !inputV2 || !zoneResultat) return;

  function calculer() {

    const p1 = parseFloat(inputP1.value);
    const v1 = parseFloat(inputV1.value);
    const v2 = parseFloat(inputV2.value);

    if (Number.isNaN(p1) || Number.isNaN(v1) || Number.isNaN(v2) || v2 === 0) {
      zoneResultat.textContent = 'Saisir la pression et le volume initiaux, puis le volume final, pour calculer la pression finale attendue par la loi de Boyle-Mariotte.';
      return;
    }

    const p2 = (p1 * v1) / v2;

    zoneResultat.innerHTML = `
      D'après P₁×V₁ = P₂×V₂, pression finale attendue :
      <strong>${arrondir(p2, 0)} hPa</strong>
    `;
  }

  inputP1.addEventListener('input', calculer);
  inputV1.addEventListener('input', calculer);
  inputV2.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 (suite) — Tableau de mesures (V, P) sur plusieurs points
// pour les deux dispositifs expérimentaux (capteur numérique /
// vérin à vis + manomètre analogique) et vérification de la
// constance du produit P × V (loi de Boyle-Mariotte).
// =================================================================
let bmMesures = [];
let bmProchainId = 1;
let bmDernierPoints = [];

function initTableauMesuresBoyleMariotte() {

  const corps = $('bm-table-corps');
  const boutonAjouter = $('bm-ajouter-mesure');
  const zoneResultat = $('bm-table-resultat');

  if (!corps || !boutonAjouter || !zoneResultat) return;

  // Deux lignes de départ (vides) pour que l'élève voie immédiatement
  // la structure du tableau à compléter.
  bmMesures = [
    { id: bmProchainId++, dispositif: 'numerique', volume: '', pression: '' },
    { id: bmProchainId++, dispositif: 'numerique', volume: '', pression: '' },
  ];

  function ajouterLigne() {
    bmMesures.push({ id: bmProchainId++, dispositif: 'numerique', volume: '', pression: '' });
    rafraichir();
  }

  function supprimerLigne(id) {
    if (bmMesures.length <= 1) return;
    bmMesures = bmMesures.filter(m => m.id !== id);
    rafraichir();
  }

  function majMesure(id, champ, valeur) {
    const mesure = bmMesures.find(m => m.id === id);
    if (mesure) mesure[champ] = valeur;
    calculerVerification();
  }

  function calculerVerification() {

    // Colonne P×V affichée pour chaque ligne du tableau.
    bmMesures.forEach(m => {
      const v = parseFloat(m.volume);
      const p = parseFloat(m.pression);
      const cellule = corps.querySelector(`tr[data-id="${m.id}"] .bm-pv`);
      if (!cellule) return;
      cellule.textContent = (!Number.isNaN(v) && !Number.isNaN(p)) ? arrondir(p * v, 0) : '—';
    });

    const points = bmMesures
      .map(m => ({ v: parseFloat(m.volume), p: parseFloat(m.pression) }))
      .filter(pt => !Number.isNaN(pt.v) && !Number.isNaN(pt.p) && pt.v > 0);

    bmDernierPoints = points;
    dessinerCourbeBoyleMariotte(points);

    if (points.length < 2) {
      zoneResultat.textContent = 'Ajouter au moins deux mesures (V, P) pour vérifier la constance du produit P × V.';
      return;
    }

    const produits = points.map(pt => pt.p * pt.v);
    const moyenne = produits.reduce((s, x) => s + x, 0) / produits.length;
    const ecartMaxRelatif = Math.max(...produits.map(x => Math.abs(x - moyenne) / moyenne)) * 100;

    const verdict = ecartMaxRelatif < 10
      ? 'Le produit P × V reste approximativement constant : les mesures sont cohérentes avec la loi de Boyle-Mariotte.'
      : "L'écart entre les valeurs de P × V dépasse 10 % : vérifier l'étanchéité du montage ou une éventuelle variation de température.";

    zoneResultat.innerHTML = `
      Produit moyen P × V ≈ <strong>${arrondir(moyenne, 0)} hPa·mL</strong>
      (écart maximal à la moyenne : ${arrondir(ecartMaxRelatif, 1)} %)<br>
      ${verdict}
    `;
  }

  function rafraichir() {

    corps.innerHTML = '';

    bmMesures.forEach((m, index) => {

      const ligne = document.createElement('tr');
      ligne.dataset.id = m.id;

      ligne.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <select class="bm-dispositif">
            <option value="numerique" ${m.dispositif === 'numerique' ? 'selected' : ''}>Capteur numérique</option>
            <option value="manometre" ${m.dispositif === 'manometre' ? 'selected' : ''}>Vérin + manomètre</option>
          </select>
        </td>
        <td class="saisie"><input type="number" step="0.1" class="bm-volume" value="${m.volume}"></td>
        <td class="saisie"><input type="number" step="1" class="bm-pression" value="${m.pression}"></td>
        <td class="bm-pv">—</td>
        <td><button type="button" class="btn btn-danger bm-supprimer" ${bmMesures.length <= 1 ? 'disabled' : ''}>🗑</button></td>
      `;

      corps.appendChild(ligne);

      ligne.querySelector('.bm-dispositif').addEventListener('change', e => majMesure(m.id, 'dispositif', e.target.value));
      ligne.querySelector('.bm-volume').addEventListener('input', e => majMesure(m.id, 'volume', e.target.value));
      ligne.querySelector('.bm-pression').addEventListener('input', e => majMesure(m.id, 'pression', e.target.value));
      ligne.querySelector('.bm-supprimer').addEventListener('click', () => supprimerLigne(m.id));

    });

    calculerVerification();

  }

  boutonAjouter.addEventListener('click', ajouterLigne);

  window.addEventListener('resize', () => dessinerCourbeBoyleMariotte(bmDernierPoints));

  // Redessine la courbe juste avant l'impression du compte-rendu (voir
  // compte-rendu-mecanique.js), au cas où le canvas n'aurait jamais été
  // affiché à sa taille définitive (onglet resté fermé, par exemple).
  document.addEventListener('cr:avant-impression', () => dessinerCourbeBoyleMariotte(bmDernierPoints));

  rafraichir();

}

// =================================================================
// Onglet 2 (suite) — Tracé de la courbe P = f(V) : points mesurés
// (rouge) et courbe théorique P = k / V (bleu), k étant le produit
// moyen P × V calculé sur les mesures exploitables.
// =================================================================
function dessinerCourbeBoyleMariotte(points) {

  const canvas = $('bm-canvas-courbe');
  if (!canvas) return;

  const conteneur = canvas.parentElement;
  const largeurAffichee = (conteneur && conteneur.clientWidth) || 600;
  const hauteurAffichee = 320;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = largeurAffichee * dpr;
  canvas.height = hauteurAffichee * dpr;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, largeurAffichee, hauteurAffichee);

  const marge = 55;

  if (points.length === 0) {
    ctx.fillStyle = '#8a8a8a';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Saisir des mesures (V, P) dans le tableau ci-dessus pour tracer la courbe.',
      largeurAffichee / 2,
      hauteurAffichee / 2
    );
    return;
  }

  const vMax = Math.max(...points.map(pt => pt.v)) * 1.15 || 1;
  const pMax = Math.max(...points.map(pt => pt.p)) * 1.15 || 1;

  const xPix = v => marge + (v / vMax) * (largeurAffichee - marge - 20);
  const yPix = p => hauteurAffichee - marge - (p / pMax) * (hauteurAffichee - marge - 20);

  // Graduations et quadrillage.
  ctx.strokeStyle = '#e5e5e5';
  ctx.fillStyle = '#666';
  ctx.font = '11px sans-serif';
  ctx.lineWidth = 1;

  const nbDivisions = 5;
  for (let i = 0; i <= nbDivisions; i++) {

    const v = (vMax * i) / nbDivisions;
    const x = xPix(v);
    ctx.beginPath();
    ctx.moveTo(x, 15);
    ctx.lineTo(x, hauteurAffichee - marge);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(arrondir(v, 0), x, hauteurAffichee - marge + 16);

    const p = (pMax * i) / nbDivisions;
    const y = yPix(p);
    ctx.beginPath();
    ctx.moveTo(marge, y);
    ctx.lineTo(largeurAffichee - 20, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(arrondir(p, 0), marge - 8, y + 4);

  }

  // Axes.
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(marge, 15);
  ctx.lineTo(marge, hauteurAffichee - marge);
  ctx.lineTo(largeurAffichee - 20, hauteurAffichee - marge);
  ctx.stroke();

  ctx.fillStyle = '#333';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Volume V (mL)', largeurAffichee / 2, hauteurAffichee - 10);

  ctx.save();
  ctx.translate(16, hauteurAffichee / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Pression P (hPa)', 0, 0);
  ctx.restore();

  // Courbe théorique P = k / V, dès que deux mesures exploitables existent.
  if (points.length >= 2) {

    const produits = points.map(pt => pt.p * pt.v);
    const k = produits.reduce((s, x) => s + x, 0) / produits.length;

    ctx.strokeStyle = '#1B6CA8';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let depart = false;
    const nbEtapes = 300;

    for (let i = 1; i <= nbEtapes; i++) {
      const v = (vMax * i) / nbEtapes;
      const p = k / v;
      if (p > pMax) continue;
      const x = xPix(v);
      const y = yPix(p);
      if (!depart) { ctx.moveTo(x, y); depart = true; }
      else ctx.lineTo(x, y);
    }

    ctx.stroke();

  }

  // Points mesurés.
  points.forEach(pt => {
    const x = xPix(pt.v);
    const y = yPix(pt.p);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#c0392b';
    ctx.fill();
    ctx.strokeStyle = '#7a1f14';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

}

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
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-mecanique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

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
  initPressionForce();
  initSurfacePiston();
  initForceInverse();
  initBoyleMariotte();
  initTableauMesuresBoyleMariotte();

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
      '1ere-tci':  ['vitesse-acceleration', 'pression-force'],
      '1ere-trpm': ['vitesse-acceleration', 'pression-force'],
      '1ere-mcc':  ['vitesse-acceleration', 'pression-force'],
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

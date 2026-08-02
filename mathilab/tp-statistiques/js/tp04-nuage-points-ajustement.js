/**
 * tp-statistiques/js/tp04-nuage-points-ajustement.js
 *
 * Contrôleur du TP S4 « Nuage de points et ajustement », commun aux
 * classes de 1ère et de Terminale. L'onglet « Ajustement non affine »
 * (Tle uniquement) est affiché ou masqué dynamiquement en fonction du
 * niveau déduit de la filière sélectionnée dans le contexte
 * professionnel.
 */

import { $, arrondir, initSections, initTabs } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { regressionLineaire, coefficientDetermination, dessinerNuageAjustement } from '../../js/ajustement.js';

// Contexte professionnel commun à un même métier, décliné en une
// problématique 1ère (ajustement affine) et une problématique Tle
// (choix du modèle le plus pertinent, y compris non affine).
const PROFILS = {

  tci: {
    contexte: "En chaudronnerie industrielle, le temps de découpe au laser d'une tôle dépend de son épaisseur : plus la tôle est épaisse, plus la découpe est longue.",
    problematique1ere: "Peut-on prévoir le temps de découpe d'une tôle à partir de son épaisseur, à l'aide d'un ajustement affine ?",
    problematiqueTle: "L'évolution du temps de découpe en fonction de l'épaisseur est-elle vraiment linéaire, ou un autre modèle serait-il plus pertinent ?",
  },

  trpm: {
    contexte: "En réalisation de produits mécaniques, la durée de vie d'un outil de coupe (nombre de pièces usinées avant remplacement) dépend de la vitesse de coupe utilisée.",
    problematique1ere: "Peut-on prévoir la durée de vie d'un outil à partir de la vitesse de coupe, à l'aide d'un ajustement affine ?",
    problematiqueTle: "La durée de vie d'un outil décroît-elle de façon linéaire avec la vitesse de coupe, ou son évolution est-elle mieux modélisée par un autre type de courbe ?",
  },

  mcc: {
    contexte: "En atelier de confection, le temps de montage d'une pièce dépend de la longueur totale de couture à réaliser.",
    problematique1ere: "Peut-on prévoir le temps de montage d'une pièce à partir de la longueur de couture, à l'aide d'un ajustement affine ?",
    problematiqueTle: "Le temps de montage évolue-t-il de façon linéaire avec la longueur de couture pour toutes les pièces, ou un autre modèle serait-il plus adapté ?",
  },

  agora: {
    contexte: "Dans un service administratif, le temps de traitement quotidien des dossiers dépend du nombre de dossiers reçus dans la journée.",
    problematique1ere: "Peut-on prévoir le temps de traitement quotidien à partir du nombre de dossiers reçus, à l'aide d'un ajustement affine ?",
    problematiqueTle: "Le temps de traitement augmente-t-il de façon linéaire avec le nombre de dossiers, ou son évolution suit-elle un autre modèle (saturation, effet de seuil...) ?",
  },

  log: {
    contexte: "Dans un service logistique, le délai de livraison d'une commande dépend de la distance à parcourir jusqu'au client.",
    problematique1ere: "Peut-on prévoir le délai de livraison à partir de la distance, à l'aide d'un ajustement affine ?",
    problematiqueTle: "Le délai de livraison évolue-t-il de façon linéaire avec la distance, ou un autre modèle rendrait-il mieux compte des données ?",
  },

};

const CONTEXTES_PRO = {};
Object.entries(PROFILS).forEach(([id, p]) => {
  CONTEXTES_PRO[`1ere-${id}`] = { contexte: p.contexte, problematique: p.problematique1ere };
  CONTEXTES_PRO[`tle-${id}`] = { contexte: p.contexte, problematique: p.problematiqueTle };
});

export function init() {

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Statistiques',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initBasculeOngletTle();

  const obtenirAjustement = initNuageAjustementAffine();
  initInterpolerExtrapoler(obtenirAjustement);
  initAjustementNonAffine();

  initSections();
  initTabs();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Nuage de points et ajustement',
    tp: 'S4',
  });
}

// =================================================================
// Affichage conditionnel de l'onglet « Ajustement non affine »
// selon le niveau (1ère ou Tle) déduit de la filière sélectionnée.
// =================================================================
function initBasculeOngletTle() {

  const select = $('select-filiere-pro');
  const ongletTle = document.querySelector('.tab-btn[data-niveau="tle"]');
  if (!select || !ongletTle) return;

  function basculer() {
    const estTle = select.value.startsWith('tle-');
    ongletTle.style.display = estTle ? '' : 'none';
  }

  select.addEventListener('change', basculer);
  basculer();
}

// =================================================================
// Onglet 1 — Nuage de points et ajustement affine
// =================================================================
function initNuageAjustementAffine() {

  const btnAjouter = $('na-ajouter');
  const inputX = $('na-x');
  const inputY = $('na-y');
  const tbody = $('na-tbody');

  const points = [];
  let ajustementCourant = null;

  if (!btnAjouter || !tbody) return () => ajustementCourant;

  btnAjouter.addEventListener('click', () => {

    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);
    if (Number.isNaN(x) || Number.isNaN(y)) return;

    points.push({ x, y });
    redessiner();

    inputX.value = '';
    inputY.value = '';
    inputX.focus();
  });

  function redessiner() {

    tbody.innerHTML = points
      .map((p, i) => `<tr><td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td></tr>`)
      .join('');

    const zoneEquation = $('na-equation');

    if (points.length < 3) {
      dessinerNuageAjustement('na-nuage', points, {});
      ajustementCourant = null;
      zoneEquation.textContent = 'Saisir au moins 3 points pour construire la droite d\'ajustement.';
      return;
    }

    const { a, b } = regressionLineaire(points);
    const r2 = coefficientDetermination(points, a, b);

    ajustementCourant = { a, b, points };

    dessinerNuageAjustement('na-nuage', points, { a, b });

    zoneEquation.innerHTML = `<strong>y = ${arrondir(a, 3)} x + ${arrondir(b, 3)}</strong> — Coefficient de détermination R² = ${arrondir(r2, 3)}`;
  }

  return () => ajustementCourant;
}

// =================================================================
// Onglet 2 — Interpoler / extrapoler
// =================================================================
function initInterpolerExtrapoler(obtenirAjustement) {

  const btnEstimer = $('ie-estimer');
  const inputX = $('ie-x');

  if (!btnEstimer) return;

  btnEstimer.addEventListener('click', () => {

    const ajustement = obtenirAjustement();
    const zoneResultat = $('ie-resultat');

    if (!ajustement) {
      zoneResultat.textContent = 'Construire d\'abord l\'ajustement dans l\'onglet précédent (au moins 3 points).';
      return;
    }

    const x = parseFloat(inputX.value);
    if (Number.isNaN(x)) return;

    const { a, b, points } = ajustement;
    const y = a * x + b;

    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));
    const estInterpolation = x >= xMin && x <= xMax;

    zoneResultat.innerHTML = `<strong>y ≈ ${arrondir(y, 3)}</strong> pour x = ${x} — ${estInterpolation ? 'interpolation (x dans l\'intervalle mesuré)' : 'extrapolation (x en dehors de l\'intervalle mesuré, résultat moins fiable)'}.`;
  });
}

// =================================================================
// Onglet 3 — Ajustement non affine (changement de variable, Tle)
// =================================================================
function initAjustementNonAffine() {

  const btnAjouter = $('na2-ajouter');
  const inputX = $('na2-x');
  const inputY = $('na2-y');
  const tbody = $('na2-tbody');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);
    if (Number.isNaN(x) || Number.isNaN(y) || y <= 0) return;

    points.push({ x, y });
    redessiner();

    inputX.value = '';
    inputY.value = '';
    inputX.focus();
  });

  function redessiner() {

    tbody.innerHTML = points
      .map((p, i) => `<tr><td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td><td>${arrondir(Math.log10(p.y), 3)}</td></tr>`)
      .join('');

    const zoneEquation = $('na2-equation');

    if (points.length < 3) {
      dessinerNuageAjustement('na2-nuage', points, {});
      zoneEquation.textContent = 'Saisir au moins 3 points (y > 0) pour construire l\'ajustement.';
      return;
    }

    const pointsTransformes = points.map(p => ({ x: p.x, y: Math.log10(p.y) }));
    const { a, b } = regressionLineaire(pointsTransformes);
    const r2 = coefficientDetermination(pointsTransformes, a, b);

    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));
    const pas = (xMax - xMin) / 40 || 1;
    const courbe = [];
    for (let x = xMin; x <= xMax + pas / 2; x += pas) {
      courbe.push({ x, y: 10 ** (a * x + b) });
    }

    dessinerNuageAjustement('na2-nuage', points, { courbe });

    const B = 10 ** b;
    zoneEquation.innerHTML = `<strong>y ≈ ${arrondir(B, 3)} × 10<sup>${arrondir(a, 3)} x</sup></strong> — R² (sur x, z = log₁₀(y)) = ${arrondir(r2, 3)}`;
  }
}

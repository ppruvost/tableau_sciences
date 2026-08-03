/**
 * tp-statistiques/js/tp03-fluctuation-frequence-probabilites.js
 *
 * Contrôleur du TP S3 « Fluctuation d'une fréquence, probabilités ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-statistiques/modules/tp03-fluctuation-frequence-probabilites.html
 * dans #content.
 */

import { $, arrondir, initSections, initTabs } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';
import { dessinerDiagrammeBarres } from '../../js/statistiques.js';
import { simulerEchantillon, etendueFrequences } from '../../js/probabilites.js';

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "Un atelier annonce un taux de pièces non conformes de p %. Sur un contrôle qualité portant sur un petit lot de pièces, la fréquence observée de pièces non conformes n'est presque jamais exactement égale à p.",
    problematique: "Un contrôle sur un petit échantillon suffit-il pour juger de la qualité réelle d'une production ?",
  },

  '2nde-gatl': {
    contexte: "Un transporteur annonce un taux de retard de livraison de p %. Sur un échantillon de quelques commandes suivies, la fréquence de retard observée varie d'une semaine à l'autre.",
    problematique: "Un suivi sur un petit nombre de livraisons suffit-il pour juger de la fiabilité réelle d'un transporteur ?",
  },

  '2nde-mcc': {
    contexte: "Un atelier de confection annonce un taux de pièces nécessitant une retouche de p %. Sur un contrôle qualité portant sur un petit lot de pièces confectionnées, la fréquence de retouches observée n'est presque jamais exactement égale à p.",
    problematique: "Un contrôle sur un petit lot de pièces suffit-il pour juger de la qualité réelle d'une production textile ?",
  },

};

export function init() {

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initFluctuationEchantillons();
  initStabilisationN();
  initArbreDenombrement();

  initSections();
  initTabs();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Fluctuation d'une fréquence, probabilités",
    tp: 'S3',
  });
}

// =================================================================
// Onglet 1 — Fluctuation sur plusieurs échantillons de taille n
// =================================================================
function initFluctuationEchantillons() {

  const btnTirer = $('fl-tirer');
  const btnReinit = $('fl-reinitialiser');
  const inputP = $('fl-p');
  const inputN = $('fl-n');
  const tbody = $('fl-tbody');

  if (!btnTirer || !tbody) return;

  let echantillons = [];

  btnTirer.addEventListener('click', () => {

    const p = parseFloat(inputP.value) / 100;
    const n = parseInt(inputN.value, 10);

    if (Number.isNaN(p) || p <= 0 || p >= 1 || Number.isNaN(n) || n < 1) return;

    echantillons.push(simulerEchantillon(n, p));
    redessiner();
  });

  btnReinit.addEventListener('click', () => {
    echantillons = [];
    redessiner();
  });

  function redessiner() {

    tbody.innerHTML = echantillons
      .map((e, i) => `<tr><td>Essai ${i + 1}</td><td>${e.effectifSucces}</td><td>${arrondir(e.frequence, 3)}</td></tr>`)
      .join('');

    const donneesBarres = echantillons.map((e, i) => ({
      label: `E${i + 1}`,
      effectif: Math.round(e.frequence * 100),
    }));

    dessinerDiagrammeBarres('fl-barres', donneesBarres, { yLabel: 'Fréquence (%)' });

    const zoneEtendue = $('fl-etendue');
    if (echantillons.length < 2) {
      zoneEtendue.textContent = 'Tirer au moins deux échantillons pour calculer l\'étendue des fréquences.';
    } else {
      const etendue = etendueFrequences(echantillons.map(e => e.frequence));
      zoneEtendue.innerHTML = `<strong>Étendue des fréquences observées : ${arrondir(etendue, 3)}</strong>`;
    }
  }
}

// =================================================================
// Onglet 2 — Stabilisation quand n augmente
// =================================================================
function initStabilisationN() {

  const btnAugmenter = $('st-augmenter');
  const btnReinit = $('st-reinitialiser');
  const inputP = $('st-p');

  if (!btnAugmenter) return;

  let n = 5;
  let points = [];

  btnAugmenter.addEventListener('click', () => {

    const p = parseFloat(inputP.value) / 100;
    if (Number.isNaN(p) || p <= 0 || p >= 1) return;

    n *= 2;
    const echantillon = simulerEchantillon(n, p);
    points.push({ x: n, y: echantillon.frequence });

    dessinerGraphiqueLigne('st-graphique', points, { xLabel: 'Taille de l\'échantillon n', yLabel: 'Fréquence' });
  });

  btnReinit.addEventListener('click', () => {
    n = 5;
    points = [];
    $('st-graphique').innerHTML = '';
  });
}

// =================================================================
// Onglet 3 — Arbre à deux niveaux
// =================================================================
function initArbreDenombrement() {

  const btnCalculer = $('ar-calculer');
  const inputP = $('ar-p');
  const tbody = $('ar-tbody');

  if (!btnCalculer || !tbody) return;

  btnCalculer.addEventListener('click', () => {

    const p = parseFloat(inputP.value) / 100;
    if (Number.isNaN(p) || p <= 0 || p >= 1) return;

    const q = 1 - p;

    const chemins = [
      { c1: 'Succès', c2: 'Succès', proba: p * p },
      { c1: 'Succès', c2: 'Échec', proba: p * q },
      { c1: 'Échec', c2: 'Succès', proba: q * p },
      { c1: 'Échec', c2: 'Échec', proba: q * q },
    ];

    tbody.innerHTML = chemins
      .map(c => `<tr><td>${c.c1}</td><td>${c.c2}</td><td>${c.c1} puis ${c.c2}</td><td>${arrondir(c.proba, 4)}</td></tr>`)
      .join('');

    const somme = chemins.reduce((s, c) => s + c.proba, 0);
    $('ar-verification').innerHTML = `<strong>Somme des 4 probabilités : ${arrondir(somme, 4)} (doit valoir 1)</strong>`;
  });
}

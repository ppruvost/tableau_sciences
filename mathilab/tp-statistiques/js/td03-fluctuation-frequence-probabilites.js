/**
 * MATHILAB — STATISTIQUE ET PROBABILITÉS
 * TD S03 : Fluctuation d'une fréquence, probabilités
 * mathilab/tp-statistiques/js/td03-fluctuation-frequence-probabilites.js
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
import { S3 as MODELE_PUZZLE } from './puzzle-statistiques.js';
import { dessinerDiagrammeBarres } from '../../js/statistiques.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — une problématique par onglet
   ============================================================ */

const CONTEXTES_PRO = {
  '2nde-remi': {
    contexte: "L'atelier annonce un taux de pièces non conformes p. Chaque contrôle qualité réalisé sur un échantillon donne une fréquence qui fluctue autour de p.",
    problematiques: {
      'fluctuation-echantillons': "Un contrôle qualité qui s'écarte du taux annoncé signale-t-il forcément un problème de production ?",
      'stabilisation-n': "Combien de pièces faut-il contrôler pour que la fréquence de pièces non conformes observée soit fiable ?",
      'arbre-denombrement': "Quelle est la probabilité d'obtenir exactement une pièce non conforme sur deux pièces contrôlées successivement ?"
    }
  },
  '2nde-mcc': {
    contexte: "Un atelier annonce un taux de retouche p. Chaque contrôle sur un lot de pièces confectionnées donne une fréquence de retouche différente d'un lot à l'autre.",
    problematiques: {
      'fluctuation-echantillons': "Un taux de retouche observé plus élevé que d'habitude signale-t-il forcément une dérive de qualité ?",
      'stabilisation-n': "Sur combien de pièces faut-il contrôler un lot pour que le taux de retouche observé soit fiable ?",
      'arbre-denombrement': "Quelle est la probabilité qu'exactement une pièce sur deux contrôlées successivement soit à retoucher ?"
    }
  },
  '2nde-gatl': {
    contexte: "Un transporteur annonce un taux de retard p. Chaque suivi de livraisons sur une période donne une fréquence de retard qui varie.",
    problematiques: {
      'fluctuation-echantillons': "Un taux de retard observé sur une semaine permet-il de juger la fiabilité réelle d'un transporteur ?",
      'stabilisation-n': "Sur combien de livraisons faut-il suivre un transporteur pour que son taux de retard observé soit fiable ?",
      'arbre-denombrement': "Quelle est la probabilité qu'exactement une livraison sur deux suivies soit en retard ?"
    }
  }
};

function tirerEchantillon(p, n) {
  let succes = 0;
  for (let i = 0; i < n; i++) if (Math.random() < p) succes++;
  return succes;
}

/* ============================================================
   ONGLET 1 — FLUCTUATION SUR ÉCHANTILLONS DE MÊME TAILLE
   ============================================================ */

const essaisFluctuation = [];

function actualiserFluctuation() {
  const tbody = document.getElementById('fl-tbody');
  tbody.innerHTML = essaisFluctuation
    .map((e, i) => `<tr><td>${i + 1}</td><td>${e.succes}</td><td>${e.frequence.toFixed(3)}</td></tr>`).join('');

  dessinerDiagrammeBarres(
    'fl-barres',
    essaisFluctuation.map((e, i) => ({ label: `#${i + 1}`, effectif: Math.round(e.frequence * 1000) / 1000 })),
    { yLabel: 'Fréquence' }
  );

  const div = document.getElementById('fl-resultat');
  if (essaisFluctuation.length >= 2) {
    const freqs = essaisFluctuation.map(e => e.frequence);
    const etendue = Math.max(...freqs) - Math.min(...freqs);
    div.textContent = `Étendue des fréquences observées : ${etendue.toFixed(3)}`;
  } else {
    div.textContent = '';
  }
}

function initFluctuation() {
  document.getElementById('fl-tirer')?.addEventListener('click', () => {
    const p = (parseFloat(document.getElementById('fl-p').value) || 0) / 100;
    const n = parseInt(document.getElementById('fl-n').value, 10) || 20;
    const succes = tirerEchantillon(p, n);
    essaisFluctuation.push({ succes, frequence: succes / n });
    actualiserFluctuation();
  });
  document.getElementById('fl-reinitialiser')?.addEventListener('click', () => {
    essaisFluctuation.length = 0;
    actualiserFluctuation();
  });
  actualiserFluctuation();
}

/* ============================================================
   ONGLET 2 — STABILISATION QUAND n AUGMENTE
   ============================================================ */

const etapesStabilisation = [];
let tailleCourante = 10;

function dessinerStabilisation() {
  const conteneur = document.getElementById('st-graphique');
  if (etapesStabilisation.length < 1) { conteneur.innerHTML = ''; return; }

  const largeur = 480, hauteur = 240;
  const marge = { haut: 16, bas: 30, gauche: 44, droite: 16 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;
  const p = (parseFloat(document.getElementById('st-p').value) || 0) / 100;

  const xMax = etapesStabilisation[etapesStabilisation.length - 1].n;
  const x = n => marge.gauche + (Math.log2(n) / Math.log2(xMax || 1)) * largeurUtile;
  const y = f => marge.haut + hauteurUtile - f * hauteurUtile;

  const pts = etapesStabilisation.map(e => `${x(e.n).toFixed(1)},${y(e.frequence).toFixed(1)}`).join(' ');

  conteneur.innerHTML = `
    <svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      <line x1="${marge.gauche}" y1="${y(p).toFixed(1)}" x2="${largeur - marge.droite}" y2="${y(p).toFixed(1)}" stroke="var(--gris-bordure,#ccc)" stroke-dasharray="4 3" />
      <polyline points="${pts}" fill="none" stroke="var(--domaine-accent)" stroke-width="2" />
    </svg>`;
}

function initStabilisation() {
  document.getElementById('st-augmenter')?.addEventListener('click', () => {
    const p = (parseFloat(document.getElementById('st-p').value) || 0) / 100;
    const succes = tirerEchantillon(p, tailleCourante);
    etapesStabilisation.push({ n: tailleCourante, frequence: succes / tailleCourante });
    tailleCourante *= 2;
    dessinerStabilisation();
  });
  document.getElementById('st-reinitialiser')?.addEventListener('click', () => {
    etapesStabilisation.length = 0;
    tailleCourante = 10;
    dessinerStabilisation();
  });
  dessinerStabilisation();
}

/* ============================================================
   ONGLET 3 — ARBRE DE DÉNOMBREMENT À 2 NIVEAUX
   ============================================================ */

function initArbreDenombrement() {
  document.getElementById('ar-calculer')?.addEventListener('click', () => {
    const p = (parseFloat(document.getElementById('ar-p').value) || 0) / 100;
    const q = 1 - p;
    const chemins = [
      ['Succès', 'Succès', p * p],
      ['Succès', 'Échec', p * q],
      ['Échec', 'Succès', q * p],
      ['Échec', 'Échec', q * q],
    ];
    document.getElementById('ar-tbody').innerHTML = chemins
      .map(([a, b, proba]) => `<tr><td>${a}</td><td>${b}</td><td>${a} puis ${b}</td><td>${proba.toFixed(4)}</td></tr>`).join('');
    const somme = chemins.reduce((s, c) => s + c[2], 0);
    document.getElementById('ar-resultat').textContent =
      `Somme des 4 probabilités : ${somme.toFixed(4)} (doit valoir 1) — P(exactement un succès) = 2p(1 − p) = ${(2 * p * q).toFixed(4)}`;
  });
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

  essaisFluctuation.length = 0;
  etapesStabilisation.length = 0;
  tailleCourante = 10;

  etape('zoom', () => initZoomVisuels());
  etape('onglet 1 : fluctuation', initFluctuation);
  etape('onglet 2 : stabilisation', initStabilisation);
  etape('onglet 3 : arbre de dénombrement', initArbreDenombrement);
  etape('contexte pro', () => initContextePro({
    afficherProblematique: false,
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO
  }));
  etape('menu filière', () => garantirMenuFiliere(CONTEXTES_PRO));
  etape('puzzle', () => demarrerPuzzle(MODELE_PUZZLE));
  etape('onglets par filière', () => initOngletsParFiliere());
  etape('sections', () => initSections());
  etape('onglets', () => initTabs());
  etape('modes opératoires', () => initModesOperatoires());
  etape('radar', () => initRadarCompetences());
  etape('questions par onglet', () => initQuestionsParOnglet());
  etape('navigation TD', () => initNavigationTP());
  etape('impression', () => initImpressionCompteRendu({
    titre: "Fluctuation d'une fréquence, probabilités",
    tp: 'TD03'
  }));
}

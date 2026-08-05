/**
 * tp-statistiques/js/tp03-fluctuation-frequence-probabilites.js
 */
import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {regrouperEnClasses, classeModale, dessinerDiagrammeBarres, dessinerDiagrammeSecteurs } from '../../js/statistiques.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_S3 = {
  '2nde-remi': {
    contexte: "L'atelier annonce un taux de pièces non conformes p. Chaque contrôle qualité réalisé sur un échantillon donne une fréquence qui fluctue autour de p.",
    problematique: "Un contrôle qualité qui s'écarte du taux annoncé signale-t-il forcément un problème de production ?",
  },
  '2nde-mcc': {
    contexte: "Un atelier annonce un taux de retouche p. Chaque contrôle sur un lot de pièces confectionnées donne une fréquence de retouche différente d'un lot à l'autre.",
    problematique: "Un taux de retouche observé plus élevé que d'habitude signale-t-il forcément une dérive de qualité ?",
  },
  '2nde-gatl': {
    contexte: "Un transporteur annonce un taux de retard p. Chaque suivi de livraisons sur une période donne une fréquence de retard qui varie.",
    problematique: "Un taux de retard observé sur une semaine permet-il de juger la fiabilité réelle d'un transporteur ?",
  },
};

function tirerEchantillon(p, n) {
  let succes = 0;
  for (let i = 0; i < n; i++) if (Math.random() < p) succes++;
  return succes;
}

/* ---------- Onglet 1 : fluctuation sur échantillons de même taille ---------- */
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

  const div = document.getElementById('fl-etendue');
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

/* ---------- Onglet 2 : stabilisation quand n augmente ---------- */
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
}

/* ---------- Onglet 3 : arbre de dénombrement à 2 niveaux ---------- */
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
    document.getElementById('ar-verification').textContent = `Somme des 4 probabilités : ${somme.toFixed(4)} (doit valoir 1)`;
  });
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_S3 });
initFluctuation();
initStabilisation();
initArbreDenombrement();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Fluctuation d'une fréquence, probabilités", tp: 'S3' });

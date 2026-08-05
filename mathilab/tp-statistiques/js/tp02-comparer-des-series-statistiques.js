import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {regrouperEnClasses, classeModale, dessinerDiagrammeBarres, dessinerDiagrammeSecteurs } from '../../js/statistiques.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_S2 = {
  '2nde-remi': {
    contexte: "Deux réglages d'une même machine peuvent produire des pièces de cote moyenne identique, mais avec une dispersion très différente.",
    problematique: "Quel réglage de machine choisir entre deux séries de cotes ayant la même moyenne ?",
  },
  '2nde-mcc': {
    contexte: "Deux ateliers de confection peuvent afficher le même temps moyen de montage d'une pièce, avec une régularité très différente d'un poste à l'autre.",
    problematique: "Quel atelier est le plus régulier entre deux séries de temps de montage ?",
  },
  '2nde-gatl': {
    contexte: "Deux transporteurs peuvent annoncer le même délai moyen de livraison, avec des écarts très différents autour de cette moyenne.",
    problematique: "Quel transporteur choisir entre deux séries de délais de livraison de moyenne comparable ?",
  },
};

const LIBELLES_INDICATEURS = [
  ['n', 'Effectif n'], ['min', 'Minimum'], ['max', 'Maximum'], ['etendue', 'Étendue'],
  ['moyenne', 'Moyenne'], ['mediane', 'Médiane'], ['q1', 'Q1'], ['q3', 'Q3'],
  ['ecartInterquartile', 'Écart interquartile (Q3 − Q1)'], ['ecartType', 'Écart type'],
];

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v;
}

/* ---------- Onglet 1 : indicateurs d'une série ---------- */
const serieUnique = [];

function actualiserIndicateursSerie() {
  document.getElementById('is-tbody-valeurs').innerHTML = serieUnique
    .map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('') || '<tr><td colspan="2">Aucune valeur.</td></tr>';

  const tbody = document.getElementById('is-tbody-indicateurs');
  if (serieUnique.length < 4) {
    tbody.innerHTML = '<tr><td colspan="2">Saisir au moins 4 valeurs pour afficher les indicateurs.</td></tr>';
    document.getElementById('is-boite').innerHTML = '';
    return;
  }
  const ind = indicateursCompletes(serieUnique);
  tbody.innerHTML = LIBELLES_INDICATEURS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(ind[cle])}</td></tr>`).join('');
  dessinerBoiteMoustaches('is-boite', serieUnique, { label: 'Série' });
}

function initIndicateursSerie() {
  const btn = document.getElementById('is-ajouter');
  const champ = document.getElementById('is-valeur');
  btn?.addEventListener('click', () => {
    const v = parseFloat(champ.value);
    if (Number.isNaN(v)) return;
    serieUnique.push(v);
    champ.value = '';
    champ.focus();
    actualiserIndicateursSerie();
  });
  actualiserIndicateursSerie();
}

/* ---------- Onglet 2 : comparer 2 séries ---------- */
const serieA = [], serieB = [];

function actualiserComparaison() {
  document.getElementById('cs-tbody-a').innerHTML = serieA.map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('');
  document.getElementById('cs-tbody-b').innerHTML = serieB.map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('');

  const labelA = document.getElementById('cs-label-a').value || 'Série A';
  const labelB = document.getElementById('cs-label-b').value || 'Série B';
  document.getElementById('cs-th-a').textContent = labelA;
  document.getElementById('cs-th-b').textContent = labelB;

  const tbody = document.getElementById('cs-tbody-comparaison');
  if (serieA.length < 4 || serieB.length < 4) {
    tbody.innerHTML = '<tr><td colspan="3">Saisir au moins 4 valeurs dans chaque série pour afficher la comparaison.</td></tr>';
    document.getElementById('cs-boites').innerHTML = '';
    return;
  }

  const indA = indicateursCompletes(serieA);
  const indB = indicateursCompletes(serieB);
  tbody.innerHTML = LIBELLES_INDICATEURS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(indA[cle])}</td><td>${formater(indB[cle])}</td></tr>`).join('');

  dessinerBoiteMoustaches('cs-boites', serieA, { label: labelA, serieComparee: { label: labelB, valeurs: serieB } });
}

function initComparaison() {
  const btnA = document.getElementById('cs-ajouter-a');
  const champA = document.getElementById('cs-valeur-a');
  const btnB = document.getElementById('cs-ajouter-b');
  const champB = document.getElementById('cs-valeur-b');

  btnA?.addEventListener('click', () => {
    const v = parseFloat(champA.value);
    if (Number.isNaN(v)) return;
    serieA.push(v); champA.value = ''; champA.focus();
    actualiserComparaison();
  });
  btnB?.addEventListener('click', () => {
    const v = parseFloat(champB.value);
    if (Number.isNaN(v)) return;
    serieB.push(v); champB.value = ''; champB.focus();
    actualiserComparaison();
  });
  document.getElementById('cs-label-a')?.addEventListener('input', actualiserComparaison);
  document.getElementById('cs-label-b')?.addEventListener('input', actualiserComparaison);

  actualiserComparaison();
}

initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_S2 });
initIndicateursSerie();
initComparaison();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Comparer des séries à l'aide d'indicateurs statistiques", tp: 'S2' });

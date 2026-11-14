/**
 * MATHILAB — STATISTIQUE ET PROBABILITÉS
 * TD S02 : Comparer des séries à l'aide d'indicateurs statistiques
 * mathilab/tp-statistiques/js/td02-comparer-des-series-statistiques.js
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
import { S2 as MODELE_PUZZLE } from './puzzle-statistiques.js';
// indicateursCompletes et dessinerBoiteMoustaches étaient utilisés sans être importés
// dans l'ancienne version : [À VÉRIFIER] qu'ils sont bien exportés par js/statistiques.js
import { indicateursCompletes, dessinerBoiteMoustaches } from '../../js/statistiques.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — une problématique par onglet
   ============================================================ */

const CONTEXTES_PRO = {
  '2nde-remi': {
    contexte: "Deux réglages d'une même machine peuvent produire des pièces de cote moyenne identique, mais avec une dispersion très différente.",
    problematiques: {
      'indicateurs-serie': "Comment résumer une série de cotes de pièces usinées par des indicateurs de position et de dispersion ?",
      'comparer-series': "Quel réglage de machine choisir entre deux séries de cotes ayant la même moyenne ?"
    }
  },
  '2nde-mcc': {
    contexte: "Deux ateliers de confection peuvent afficher le même temps moyen de montage d'une pièce, avec une régularité très différente d'un poste à l'autre.",
    problematiques: {
      'indicateurs-serie': "Comment résumer une série de temps de montage par des indicateurs de position et de dispersion ?",
      'comparer-series': "Quel atelier est le plus régulier entre deux séries de temps de montage ?"
    }
  },
  '2nde-gatl': {
    contexte: "Deux transporteurs peuvent annoncer le même délai moyen de livraison, avec des écarts très différents autour de cette moyenne.",
    problematiques: {
      'indicateurs-serie': "Comment résumer une série de délais de livraison par des indicateurs de position et de dispersion ?",
      'comparer-series': "Quel transporteur choisir entre deux séries de délais de livraison de moyenne comparable ?"
    }
  }
};

const LIBELLES_INDICATEURS = [
  ['n', 'Effectif n'], ['min', 'Minimum'], ['max', 'Maximum'], ['etendue', 'Étendue'],
  ['moyenne', 'Moyenne'], ['mediane', 'Médiane'], ['q1', 'Q1'], ['q3', 'Q3'],
  ['ecartInterquartile', 'Écart interquartile (Q3 − Q1)'], ['ecartType', 'Écart type'],
];

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v;
}

/* ============================================================
   ONGLET 1 — INDICATEURS D'UNE SÉRIE
   ============================================================ */

const serieUnique = [];

function actualiserIndicateursSerie() {
  document.getElementById('is-tbody-valeurs').innerHTML = serieUnique
    .map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('')
    || '<tr><td colspan="2">Aucune valeur.</td></tr>';

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

  function ajouter() {
    const v = parseFloat(champ.value);
    if (Number.isNaN(v)) return;
    serieUnique.push(v);
    champ.value = '';
    champ.focus();
    actualiserIndicateursSerie();
  }

  if (btn && btn.dataset.lie !== '1') {
    btn.dataset.lie = '1';
    btn.addEventListener('click', ajouter);
    champ?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ajouter(); } });
  }
  actualiserIndicateursSerie();
}

/* ============================================================
   ONGLET 2 — COMPARER DEUX SÉRIES
   ============================================================ */

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
  // Les noms de séries sont saisis par l'élève : texte brut (jamais d'innerHTML)
  tbody.textContent = '';
  LIBELLES_INDICATEURS.forEach(([cle, label]) => {
    const tr = document.createElement('tr');
    [label, formater(indA[cle]), formater(indB[cle])].forEach(valeur => {
      const td = document.createElement('td');
      td.textContent = String(valeur);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  dessinerBoiteMoustaches('cs-boites', serieA, { label: labelA, serieComparee: { label: labelB, valeurs: serieB } });
}

function initComparaison() {
  function lier(idBouton, idChamp, serie) {
    const btn = document.getElementById(idBouton);
    const champ = document.getElementById(idChamp);
    function ajouter() {
      const v = parseFloat(champ.value);
      if (Number.isNaN(v)) return;
      serie.push(v);
      champ.value = '';
      champ.focus();
      actualiserComparaison();
    }
    if (btn && btn.dataset.lie !== '1') {
      btn.dataset.lie = '1';
      btn.addEventListener('click', ajouter);
      champ?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ajouter(); } });
    }
  }
  lier('cs-ajouter-a', 'cs-valeur-a', serieA);
  lier('cs-ajouter-b', 'cs-valeur-b', serieB);
  document.getElementById('cs-label-a')?.addEventListener('input', actualiserComparaison);
  document.getElementById('cs-label-b')?.addEventListener('input', actualiserComparaison);

  actualiserComparaison();
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

  serieUnique.length = 0;
  serieA.length = 0;
  serieB.length = 0;

  etape('zoom', () => initZoomVisuels());
  etape('onglet 1 : indicateurs d\'une série', initIndicateursSerie);
  etape('onglet 2 : comparer deux séries', initComparaison);
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
    titre: "Comparer des séries à l'aide d'indicateurs statistiques",
    tp: 'TD02'
  }));
}

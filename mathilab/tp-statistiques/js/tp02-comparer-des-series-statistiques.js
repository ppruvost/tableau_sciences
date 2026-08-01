/**
 * tp-statistiques/js/tp02-comparer-des-series-statistiques.js
 *
 * Contrôleur du TP S2 « Comparer des séries à l'aide d'indicateurs
 * statistiques ». Chargé par navigation.js juste après l'injection du
 * fragment tp-statistiques/modules/tp02-comparer-des-series-statistiques.html
 * dans #content.
 */

import { $, arrondir, initSections, initTabs } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { indicateursCompletes, mode, dessinerBoiteMoustaches } from '../../js/statistiques.js';

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En atelier de réalisation mécanique, deux réglages différents d'une même machine peuvent produire des pièces dont la cote varie légèrement d'une pièce à l'autre. Comparer les deux séries de mesures permet de choisir le réglage le plus fiable.",
    problematique: "Quel réglage de machine choisir entre deux séries de mesures : celui qui donne la valeur moyenne la plus proche de la cote visée, ou celui qui est le plus régulier ?",
  },

  '2nde-gatl': {
    contexte: "Un service logistique peut faire appel à deux transporteurs différents pour une même livraison. Comparer leurs délais de livraison sur plusieurs commandes permet de choisir le transporteur le plus fiable, pas seulement le plus rapide en moyenne.",
    problematique: "Quel transporteur choisir entre deux séries de délais de livraison : celui qui est le plus rapide en moyenne, ou celui qui est le plus régulier ?",
  },

};

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

  initIndicateursSerie();
  initComparaisonSeries();

  initSections();
  initTabs();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Comparer des séries à l'aide d'indicateurs statistiques",
    tp: 'S2',
  });
}

// Libellés des indicateurs, dans l'ordre attendu par le programme.
const LIGNES_INDICATEURS = [
  { cle: 'min', label: 'Minimum' },
  { cle: 'max', label: 'Maximum' },
  { cle: 'etendue', label: 'Étendue' },
  { cle: 'moyenne', label: 'Moyenne' },
  { cle: 'mediane', label: 'Médiane' },
  { cle: 'q1', label: 'Q1 (premier quartile)' },
  { cle: 'q3', label: 'Q3 (troisième quartile)' },
  { cle: 'ecartInterquartile', label: 'Écart interquartile (Q3 − Q1)' },
  { cle: 'ecartType', label: 'Écart type' },
];

// =================================================================
// Onglet 1 — Indicateurs d'une série
// =================================================================
function initIndicateursSerie() {

  const btnAjouter = $('is-ajouter');
  const inputValeur = $('is-valeur');
  const tbody = $('is-tbody-valeurs');

  if (!btnAjouter || !tbody) return;

  const valeurs = [];

  btnAjouter.addEventListener('click', () => {

    const v = parseFloat(inputValeur.value);
    if (Number.isNaN(v)) return;

    valeurs.push(v);
    redessiner();

    inputValeur.value = '';
    inputValeur.focus();
  });

  function redessiner() {

    tbody.innerHTML = valeurs
      .map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`)
      .join('');

    const tbodyIndicateurs = $('is-tbody-indicateurs');

    if (valeurs.length < 4) {
      tbodyIndicateurs.innerHTML = '<tr><td colspan="2">Saisir au moins 4 valeurs pour afficher les indicateurs.</td></tr>';
      dessinerBoiteMoustaches('is-boite', valeurs);
      return;
    }

    const ind = indicateursCompletes(valeurs);
    const modes = mode(valeurs);

    tbodyIndicateurs.innerHTML = LIGNES_INDICATEURS
      .map(l => `<tr><td>${l.label}</td><td>${arrondir(ind[l.cle], 2)}</td></tr>`)
      .join('') + `<tr><td>Mode</td><td>${modes.join(' ; ')}</td></tr>`;

    dessinerBoiteMoustaches('is-boite', valeurs, { label: 'Série' });
  }
}

// =================================================================
// Onglet 2 — Comparaison de deux séries
// =================================================================
function initComparaisonSeries() {

  const btnAjouterA = $('cs-ajouter-a');
  const btnAjouterB = $('cs-ajouter-b');
  const inputValeurA = $('cs-valeur-a');
  const inputValeurB = $('cs-valeur-b');
  const inputLabelA = $('cs-label-a');
  const inputLabelB = $('cs-label-b');
  const tbodyA = $('cs-tbody-a');
  const tbodyB = $('cs-tbody-b');

  if (!btnAjouterA || !btnAjouterB) return;

  const seriesA = [];
  const seriesB = [];

  btnAjouterA.addEventListener('click', () => {
    const v = parseFloat(inputValeurA.value);
    if (Number.isNaN(v)) return;
    seriesA.push(v);
    redessiner();
    inputValeurA.value = '';
    inputValeurA.focus();
  });

  btnAjouterB.addEventListener('click', () => {
    const v = parseFloat(inputValeurB.value);
    if (Number.isNaN(v)) return;
    seriesB.push(v);
    redessiner();
    inputValeurB.value = '';
    inputValeurB.focus();
  });

  inputLabelA.addEventListener('input', redessiner);
  inputLabelB.addEventListener('input', redessiner);

  function redessiner() {

    const labelA = inputLabelA.value.trim() || 'Série A';
    const labelB = inputLabelB.value.trim() || 'Série B';

    tbodyA.innerHTML = seriesA.map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('');
    tbodyB.innerHTML = seriesB.map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('');

    $('cs-th-a').textContent = labelA;
    $('cs-th-b').textContent = labelB;

    const tbodyComparaison = $('cs-tbody-comparaison');

    if (seriesA.length < 4 || seriesB.length < 4) {
      tbodyComparaison.innerHTML = '<tr><td colspan="3">Saisir au moins 4 valeurs dans chaque série pour afficher la comparaison.</td></tr>';
    } else {

      const indA = indicateursCompletes(seriesA);
      const indB = indicateursCompletes(seriesB);

      tbodyComparaison.innerHTML = LIGNES_INDICATEURS
        .map(l => `<tr><td>${l.label}</td><td>${arrondir(indA[l.cle], 2)}</td><td>${arrondir(indB[l.cle], 2)}</td></tr>`)
        .join('');
    }

    if (seriesA.length >= 4) {
      dessinerBoiteMoustaches('cs-boites', seriesA, {
        label: labelA,
        serieComparee: seriesB.length >= 4 ? { label: labelB, valeurs: seriesB } : null,
      });
    } else {
      $('cs-boites').innerHTML = '<p class="info">Saisir au moins 4 valeurs dans chaque série pour afficher les boîtes à moustaches.</p>';
    }
  }
}

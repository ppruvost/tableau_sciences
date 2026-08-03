/**
 * tp-statistiques/js/tp01-organiser-une-serie-statistique.js
 *
 * Contrôleur du TP S1 « Organiser et représenter une série
 * statistique ». Chargé par navigation.js juste après l'injection du
 * fragment tp-statistiques/modules/tp01-organiser-une-serie-statistique.html
 * dans #content.
 */

import { $, arrondir, initSections, initTabs } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { dessinerHistogramme } from '../../js/incertitudes.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';
import { regrouperEnClasses, classeModale, dessinerDiagrammeBarres, dessinerDiagrammeSecteurs } from '../../js/statistiques.js';

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En atelier de réalisation mécanique, un contrôle qualité relève régulièrement une cote de pièce usinée ou un temps de cycle machine. Ces mesures répétées forment une série statistique qu'il faut organiser avant de pouvoir l'analyser.",
    problematique: "Comment organiser et représenter une série de mesures d'atelier pour en tirer une information utile au contrôle qualité ?",
  },

  '2nde-gatl': {
    contexte: "Dans un service de gestion administrative, transport et logistique, on relève par exemple des délais de livraison, des temps de traitement de commandes ou des quantités de colis expédiés chaque jour. Ces relevés forment une série statistique à organiser avant de pouvoir la commenter.",
    problematique: "Comment organiser et représenter une série de délais ou de quantités logistiques pour en tirer une information utile au suivi de l'activité ?",
  },

  '2nde-mcc': {
    contexte: "En atelier de confection, on relève par exemple les longueurs de pièces de tissu découpées ou les temps de montage d'un vêtement pour plusieurs pièces produites. Ces relevés forment une série statistique à organiser.",
    problematique: "Comment organiser et représenter une série de mesures de production textile pour en tirer une information utile au contrôle qualité ?",
  },

};

export function init() {

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initRegroupementClasses();
  initSerieQualitative();
  initSerieChronologique();

  initSections();
  initTabs();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Organiser et représenter une série statistique',
    tp: 'S1',
  });
}

// =================================================================
// Onglet 1 — Regroupement en classes
// =================================================================
function initRegroupementClasses() {

  const btnAjouter = $('rc-ajouter');
  const inputValeur = $('rc-valeur');
  const inputNbClasses = $('rc-nb-classes');
  const tbody = $('rc-tbody-valeurs');

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

  inputNbClasses.addEventListener('input', redessiner);

  function redessiner() {

    tbody.innerHTML = valeurs
      .map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`)
      .join('');

    const nClasses = Math.min(Math.max(parseInt(inputNbClasses.value, 10) || 5, 2), 10);

    dessinerHistogramme('rc-histogramme', valeurs, { nClasses });

    const classes = regrouperEnClasses(valeurs, nClasses);
    const tbodyClasses = $('rc-tbody-classes');
    const zoneModale = $('rc-classe-modale');

    if (tbodyClasses) {
      tbodyClasses.innerHTML = classes
        .map(c => `<tr><td>[${arrondir(c.debut, 1)} ; ${arrondir(c.fin, 1)}[</td><td>${c.effectif}</td></tr>`)
        .join('');
    }

    if (zoneModale) {
      if (valeurs.length < 2) {
        zoneModale.textContent = 'Ajouter au moins deux valeurs pour déterminer la classe modale.';
      } else {
        const modale = classeModale(classes);
        zoneModale.innerHTML = modale
          ? `<strong>Classe modale : [${arrondir(modale.debut, 1)} ; ${arrondir(modale.fin, 1)}[ (effectif ${modale.effectif})</strong>`
          : '';
      }
    }
  }
}

// =================================================================
// Onglet 2 — Série qualitative (bâtons + secteurs)
// =================================================================
function initSerieQualitative() {

  const btnAjouter = $('ql-ajouter');
  const inputCategorie = $('ql-categorie');
  const inputEffectif = $('ql-effectif');
  const tbody = $('ql-tbody');

  if (!btnAjouter || !tbody) return;

  const donnees = [];

  btnAjouter.addEventListener('click', () => {

    const label = inputCategorie.value.trim();
    const effectif = parseInt(inputEffectif.value, 10);

    if (!label || Number.isNaN(effectif) || effectif < 0) return;

    donnees.push({ label, effectif });
    redessiner();

    inputCategorie.value = '';
    inputEffectif.value = '';
    inputCategorie.focus();
  });

  function redessiner() {

    tbody.innerHTML = donnees
      .map(d => `<tr><td>${d.label}</td><td>${d.effectif}</td></tr>`)
      .join('');

    dessinerDiagrammeBarres('ql-barres', donnees, { yLabel: 'Effectif' });
    dessinerDiagrammeSecteurs('ql-secteurs', donnees);
  }
}

// =================================================================
// Onglet 3 — Série chronologique (lignes brisées)
// =================================================================
function initSerieChronologique() {

  const btnAjouter = $('lb-ajouter');
  const inputPeriode = $('lb-periode');
  const inputValeur = $('lb-valeur');

  if (!btnAjouter) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const x = parseFloat(inputPeriode.value);
    const y = parseFloat(inputValeur.value);

    if (Number.isNaN(x) || Number.isNaN(y)) return;

    points.push({ x, y });
    points.sort((a, b) => a.x - b.x);

    dessinerGraphiqueLigne('lb-graphique', points, { xLabel: 'Période', yLabel: 'Valeur' });

    inputPeriode.value = '';
    inputValeur.value = '';
    inputPeriode.focus();
  });
}

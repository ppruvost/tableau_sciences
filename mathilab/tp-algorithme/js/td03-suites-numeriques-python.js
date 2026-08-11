/**
 * tp-algorithme/js/td03-suites-numeriques-python.js
 *
 * Contrôleur du TD03 « Suites numériques en Python ». Chargé par
 * navigation.js juste après l'injection du fragment
 * tp-algorithme/modules/td03-suites-numeriques-python.html
 * dans #content.
 */
import { initSections, initTabs } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algorithme.js';
import { initBoutonsPyLab } from '../../js/pylab.js';

const CONTEXTES_PRO = {
  '2nde-remi': {
    contexte: "Une machine de production peut augmenter sa cadence chaque jour d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, la production attendue selon le modèle d'évolution retenu ?",
  },
  '2nde-gatl': {
    contexte: "Un entrepôt peut voir son volume de colis traité augmenter chaque mois d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, le volume de colis attendu selon le modèle d'évolution retenu ?",
  },
  '2nde-mcc': {
    contexte: "Un atelier de confection peut augmenter sa production chaque semaine d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, la production attendue selon le modèle d'évolution retenu ?",
  },
};

export function init() {
  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });
  initBoutonsPyLab('.btn-pylab');
  initSections();
  initTabs();
  initRadarCompetences();
  initImpressionCompteRendu({
    titre: 'Suites numériques en Python',
    tp: 'TD03',
  });
}

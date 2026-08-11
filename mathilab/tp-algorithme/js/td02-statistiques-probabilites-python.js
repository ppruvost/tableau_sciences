/**
 * tp-algorithme/js/td02-statistiques-probabilites-python.js
 *
 * Contrôleur du TD02 « Statistiques à deux variables et
 * probabilités en Python ». Chargé par navigation.js juste après
 * l'injection du fragment
 * tp-algorithme/modules/td02-statistiques-probabilites-python.html
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
    contexte: "En atelier de réalisation mécanique, une série de mesures (dimension, temps d'usinage) peut être liée à une autre grandeur ; un contrôle qualité en deux étapes peut être représenté par un arbre pondéré.",
    problematique: "Comment ajuster une série de mesures pour prédire une valeur non mesurée, et comment estimer le risque combiné de deux contrôles successifs ?",
  },
  '2nde-gatl': {
    contexte: "En logistique, un délai de livraison peut être lié à la distance parcourue ; un incident de livraison peut dépendre de plusieurs facteurs représentables par un arbre pondéré.",
    problematique: "Comment ajuster une série de délais de livraison pour en prédire un nouveau, et comment estimer le risque combiné de deux incidents successifs ?",
  },
  '2nde-mcc': {
    contexte: "En atelier de confection, un temps de montage peut être lié à la complexité d'un modèle ; un contrôle qualité en deux étapes (montage puis finition) peut être représenté par un arbre pondéré.",
    problematique: "Comment ajuster une série de temps de montage pour en prédire un nouveau, et comment estimer le risque combiné de deux contrôles successifs ?",
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
    titre: 'Statistiques à deux variables et probabilités en Python',
    tp: 'TD02',
  });
}

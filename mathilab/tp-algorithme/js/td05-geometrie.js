/**
 * tp-algorithme/js/td05-geometrie.js
 *
 * Contrôleur du TD05 « Géométrie : calculs et constructions ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-algorithme/modules/td05-geometrie.html
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
    contexte: "En atelier de réalisation mécanique, contrôler qu'une pièce est d'équerre, calculer le volume de matière d'une pièce cylindrique, ou construire un plan sont des gestes courants.",
    problematique: "Comment vérifier, par le calcul ou une construction, qu'une pièce respecte les dimensions et l'angle attendus ?",
  },
  '2nde-gatl': {
    contexte: "En logistique, calculer le volume d'un colis ou d'un espace de stockage, ou vérifier l'agencement d'un entrepôt, font appel à des calculs d'aires et de volumes.",
    problematique: "Comment calculer les dimensions et le volume disponibles pour optimiser le rangement d'un espace de stockage ?",
  },
  '2nde-mcc': {
    contexte: "En atelier de confection, construire un patron ou vérifier l'équerrage d'une pièce de tissu découpée font appel à la géométrie et au théorème de Pythagore.",
    problematique: "Comment vérifier, par le calcul ou une construction, qu'une pièce découpée respecte les dimensions et l'angle attendus ?",
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
    titre: 'Géométrie : calculs et constructions',
    tp: 'TD05',
  });
}

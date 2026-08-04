/**
 * tp-algorithme/js/td01-simuler-une-experience-aleatoire.js
 *
 * Contrôleur du TD A1 « Simuler une expérience aléatoire
 * (Python / PyLab) ». Chargé par navigation.js juste après
 * l'injection du fragment
 * tp-algorithme/modules/td01-simuler-une-experience-aleatoire.html
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
    contexte: "En atelier de réalisation mécanique, un contrôle qualité relève un taux de pièces non conformes. Simuler ce taux en Python permet de tester des milliers de contrôles virtuels en quelques secondes.",
    problematique: "Un programme de simulation peut-il aider à prévoir le nombre de pièces non conformes attendu sur une grande série de production ?",
  },

  '2nde-gatl': {
    contexte: "Un service logistique suit un taux de retard de livraison. Simuler ce taux en Python permet de tester des milliers de livraisons virtuelles en quelques secondes.",
    problematique: "Un programme de simulation peut-il aider à prévoir le nombre de livraisons en retard attendu sur une grande période ?",
  },

  '2nde-mcc': {
    contexte: "Un atelier de confection suit un taux de pièces nécessitant une retouche. Simuler ce taux en Python permet de tester des milliers de pièces virtuelles en quelques secondes.",
    problematique: "Un programme de simulation peut-il aider à prévoir le nombre de retouches attendu sur une grande série de production ?",
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
    titre: 'Simuler une expérience aléatoire (Python / PyLab)',
    tp: 'A1',
  });
}

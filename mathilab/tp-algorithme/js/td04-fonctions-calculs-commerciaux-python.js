/**
 * tp-algorithme/js/td04-fonctions-calculs-commerciaux-python.js
 *
 * Contrôleur du TD04 « Fonctions et calculs commerciaux en
 * Python ». Chargé par navigation.js juste après l'injection du
 * fragment
 * tp-algorithme/modules/td04-fonctions-calculs-commerciaux-python.html
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
    contexte: "En atelier de réalisation mécanique, une pièce ou un procédé peuvent se modéliser par une fonction (coût, dimension) ; un investissement ou une facture d'achat de matière nécessite un calcul d'intérêt ou de remise.",
    problematique: "Comment automatiser, en Python, la recherche d'un optimum de production et le calcul d'un coût financier ?",
  },
  '2nde-gatl': {
    contexte: "En logistique, un coût de tournée ou un délai peuvent se modéliser par une fonction ; le financement d'un véhicule ou d'un entrepôt nécessite un calcul d'intérêt ou de remise sur facture.",
    problematique: "Comment automatiser, en Python, la recherche d'un coût minimal et le calcul d'un financement ?",
  },
  '2nde-mcc': {
    contexte: "En atelier de confection, un coût de production ou un temps de montage peuvent se modéliser par une fonction ; l'achat de matériel ou de tissu nécessite un calcul d'intérêt ou de remise.",
    problematique: "Comment automatiser, en Python, la recherche d'un optimum de production et le calcul d'un coût financier ?",
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
    titre: 'Fonctions et calculs commerciaux en Python',
    tp: 'TD04',
  });
}

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
  '1ere-trpm': {
    contexte: "En usinage, un coût de production non factorisé peut nécessiter une résolution par balayage ; un placement à intérêts simples peut financer un outillage.",
    problematique: "Comment résoudre par balayage une équation de coût qui ne se factorise pas, et quel capital obtient-on après plusieurs périodes de placement à intérêts simples ?",
  },
  '1ere-tci': {
    contexte: "En chaudronnerie, une équation liée à une dimension de pièce peut ne pas se factoriser simplement ; un placement à intérêts simples peut financer un équipement.",
    problematique: "Comment résoudre par balayage une équation de dimensionnement qui ne se factorise pas, et quel capital obtient-on après plusieurs périodes de placement à intérêts simples ?",
  },
  '1ere-mcc': {
    contexte: "En confection, un coût de production non factorisé peut nécessiter une résolution par balayage ; un placement à intérêts simples peut financer du matériel.",
    problematique: "Comment résoudre par balayage une équation de coût qui ne se factorise pas, et quel capital obtient-on après plusieurs périodes de placement à intérêts simples ?",
  },
  '1ere-log': {
    contexte: "En logistique, un coût de tournée non factorisé peut nécessiter une résolution par balayage ; un placement à intérêts simples peut financer un véhicule.",
    problematique: "Comment résoudre par balayage une équation de coût de tournée qui ne se factorise pas, et quel capital obtient-on après plusieurs périodes de placement à intérêts simples ?",
  },
  '1ere-agora': {
    contexte: "Dans une structure administrative, un coût de gestion non factorisé peut nécessiter une résolution par balayage ; un placement à intérêts simples peut financer un équipement de bureau.",
    problematique: "Comment résoudre par balayage une équation de coût de gestion qui ne se factorise pas, et quel capital obtient-on après plusieurs périodes de placement à intérêts simples ?",
  },
  'tle-trpm': {
    contexte: "En usinage, un coût de production de degré 3 (avec extremum local) peut nécessiter une résolution par balayage ; un emprunt à intérêts composés peut financer un outillage.",
    problematique: "Comment trouver par balayage les racines d'une fonction de degré 3, et quel est le coût total d'un crédit finançant un équipement ?",
  },
  'tle-tci': {
    contexte: "En chaudronnerie, une équation de degré 3 (contrainte, déformation) peut nécessiter une résolution par balayage ; un emprunt à intérêts composés peut financer un équipement.",
    problematique: "Comment trouver par balayage les racines d'une fonction de degré 3, et quel est le coût total d'un crédit finançant un équipement ?",
  },
  'tle-mcc': {
    contexte: "En confection, un coût de production de degré 3 peut nécessiter une résolution par balayage ; un emprunt à intérêts composés peut financer du matériel.",
    problematique: "Comment trouver par balayage les racines d'une fonction de degré 3, et quel est le coût total d'un crédit finançant du matériel ?",
  },
  'tle-log': {
    contexte: "En logistique, un coût de tournée de degré 3 peut nécessiter une résolution par balayage ; un emprunt à intérêts composés peut financer un véhicule.",
    problematique: "Comment trouver par balayage les racines d'une fonction de degré 3, et quel est le coût total d'un crédit finançant un véhicule ?",
  },
  'tle-agora': {
    contexte: "Dans une structure administrative, un coût de gestion de degré 3 peut nécessiter une résolution par balayage ; un emprunt à intérêts composés peut financer un équipement.",
    problematique: "Comment trouver par balayage les racines d'une fonction de degré 3, et quel est le coût total d'un crédit finançant un équipement ?",
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

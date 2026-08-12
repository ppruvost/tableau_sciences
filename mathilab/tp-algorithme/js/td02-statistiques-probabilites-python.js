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
  '1ere-trpm': {
    contexte: "En atelier de réalisation mécanique, une série de mesures (dimension, temps d'usinage) peut être liée à une autre grandeur ; un contrôle qualité en deux étapes peut être représenté par un arbre pondéré.",
    problematique: "Comment ajuster une série de mesures pour prédire une valeur non mesurée, et comment estimer le risque combiné de deux contrôles successifs ?",
  },
  '1ere-tci': {
    contexte: "En chaudronnerie industrielle, une surface de tôle développée peut être liée à une dimension de pièce ; un contrôle en plusieurs étapes (soudure puis contrôle dimensionnel) peut être représenté par un arbre pondéré.",
    problematique: "Comment ajuster une série de mesures de tôlerie pour en prédire une nouvelle, et comment estimer le risque combiné de deux contrôles successifs ?",
  },
  '1ere-mcc': {
    contexte: "En atelier de confection, un temps de montage peut être lié à la complexité d'un modèle ; un contrôle qualité en deux étapes (montage puis finition) peut être représenté par un arbre pondéré.",
    problematique: "Comment ajuster une série de temps de montage pour en prédire un nouveau, et comment estimer le risque combiné de deux contrôles successifs ?",
  },
  '1ere-log': {
    contexte: "En logistique, un délai de livraison peut être lié à la distance parcourue ; un incident de livraison peut dépendre de plusieurs facteurs représentables par un arbre pondéré.",
    problematique: "Comment ajuster une série de délais de livraison pour en prédire un nouveau, et comment estimer le risque combiné de deux incidents successifs ?",
  },
  '1ere-agora': {
    contexte: "Dans une structure administrative, un délai de traitement de dossier peut être lié au nombre de dossiers en attente ; un contrôle en plusieurs étapes (saisie puis validation) peut être représenté par un arbre pondéré.",
    problematique: "Comment ajuster une série de délais de traitement pour en prédire un nouveau, et comment estimer le risque combiné de deux contrôles successifs ?",
  },
  'tle-trpm': {
    contexte: "En atelier de réalisation mécanique, une série de mesures peut ne pas suivre un modèle affine (usure d'outil, dérive thermique) ; un contrôle qualité en deux étapes peut dépendre l'une de l'autre ou non.",
    problematique: "Quel modèle d'ajustement choisir lorsqu'une droite ne convient pas, et deux contrôles successifs sont-ils réellement indépendants ?",
  },
  'tle-tci': {
    contexte: "En chaudronnerie industrielle, une grandeur peut évoluer de façon non affine avec les dimensions (déformation, contrainte) ; deux contrôles successifs (soudure puis étanchéité) peuvent être liés ou non.",
    problematique: "Quel modèle d'ajustement choisir pour une série non affine, et deux contrôles de tôlerie sont-ils indépendants ?",
  },
  'tle-mcc': {
    contexte: "En atelier de confection, un coût ou un temps de production peut évoluer de façon non affine avec la taille de série ; deux contrôles qualité successifs peuvent être liés ou non.",
    problematique: "Quel modèle d'ajustement choisir pour une série non affine, et deux contrôles de confection sont-ils indépendants ?",
  },
  'tle-log': {
    contexte: "En logistique, un coût de transport peut évoluer de façon non affine avec la distance (effet de seuil, tarifs dégressifs) ; deux incidents successifs sur une tournée peuvent être liés ou non.",
    problematique: "Quel modèle d'ajustement choisir pour un coût de transport non affine, et deux incidents de livraison sont-ils indépendants ?",
  },
  'tle-agora': {
    contexte: "Dans une structure administrative, un délai de traitement peut évoluer de façon non affine avec la charge de travail ; deux contrôles administratifs successifs peuvent être liés ou non.",
    problematique: "Quel modèle d'ajustement choisir pour un délai non affine, et deux contrôles administratifs sont-ils indépendants ?",
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

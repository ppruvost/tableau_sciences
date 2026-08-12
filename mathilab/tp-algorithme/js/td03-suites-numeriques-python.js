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
  '1ere-trpm': {
    contexte: "Une machine d'usinage peut augmenter sa cadence chaque jour d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, la production attendue selon le modèle d'évolution retenu ?",
  },
  '1ere-tci': {
    contexte: "Un atelier de chaudronnerie peut augmenter sa production de pièces chaque semaine d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, la production attendue selon le modèle d'évolution retenu ?",
  },
  '1ere-mcc': {
    contexte: "Un atelier de confection peut augmenter sa production chaque semaine d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, la production attendue selon le modèle d'évolution retenu ?",
  },
  '1ere-log': {
    contexte: "Un entrepôt peut voir son volume de colis traité augmenter chaque mois d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, le volume de colis attendu selon le modèle d'évolution retenu ?",
  },
  '1ere-agora': {
    contexte: "Une structure administrative peut voir son nombre de dossiers traités augmenter chaque mois d'une quantité fixe (suite arithmétique) ou d'un pourcentage fixe (suite géométrique).",
    problematique: "Comment calculer, terme après terme, le nombre de dossiers traités attendu selon le modèle d'évolution retenu ?",
  },
  'tle-trpm': {
    contexte: "Une machine d'usinage peut voir sa cadence progresser à taux fixe (suite géométrique), en lien direct avec les fonctions exponentielles étudiées en Algèbre-Analyse.",
    problematique: "Comment calculer la production cumulée sur n jours d'une machine dont la cadence progresse à taux fixe, et à partir de quand dépasse-t-elle une capacité donnée ?",
  },
  'tle-tci': {
    contexte: "Un atelier de chaudronnerie peut voir sa production progresser à taux fixe (suite géométrique), en lien direct avec les fonctions exponentielles étudiées en Algèbre-Analyse.",
    problematique: "Comment calculer la production cumulée sur n semaines d'un atelier dont la production progresse à taux fixe, et à partir de quand dépasse-t-elle une capacité donnée ?",
  },
  'tle-mcc': {
    contexte: "Un atelier de confection peut voir sa production progresser à taux fixe (suite géométrique), en lien direct avec les fonctions exponentielles étudiées en Algèbre-Analyse.",
    problematique: "Comment calculer la production cumulée sur n semaines d'un atelier dont la production progresse à taux fixe, et à partir de quand dépasse-t-elle une capacité donnée ?",
  },
  'tle-log': {
    contexte: "Un entrepôt peut voir son volume de colis traité progresser à taux fixe (suite géométrique), en lien direct avec les fonctions exponentielles étudiées en Algèbre-Analyse.",
    problematique: "Comment calculer le volume cumulé de colis traités sur n mois, et à partir de quand dépasse-t-il une capacité de stockage donnée ?",
  },
  'tle-agora': {
    contexte: "Une structure administrative peut voir son nombre de dossiers traités progresser à taux fixe (suite géométrique), en lien direct avec les fonctions exponentielles étudiées en Algèbre-Analyse.",
    problematique: "Comment calculer le nombre cumulé de dossiers traités sur n mois, et à partir de quand dépasse-t-il une capacité de traitement donnée ?",
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

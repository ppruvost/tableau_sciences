/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * TD02 : Géométrie dans l'espace (représenter et sectionner un solide)
 * mathilab/tp-geometrie/js/td02-geometrie-espace.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-geometrie.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

/* Module ouvert à toutes les filières professionnelles à ce niveau
   (aucune restriction de groupement mentionnée dans le référentiel
   pour la géométrie dans l'espace en 1ère). */
const CONTEXTES_TD02 = {
  '1ere-trpm': {
    contexte: "En usinage, une pièce mécanique résulte souvent de l'assemblage de plusieurs solides usuels, et sa coupe en plan technique correspond à une section par un plan.",
    problematique: "Comment représenter une pièce composée de plusieurs solides et anticiper sa coupe en plan technique ?",
  },
  '1ere-tci': {
    contexte: "En chaudronnerie, une pièce résulte souvent de l'assemblage de plusieurs solides (cylindre, cône), et sa coupe en plan technique correspond à une section par un plan.",
    problematique: "Comment représenter une pièce chaudronnée composée de plusieurs solides et anticiper sa coupe en plan technique ?",
  },
  '1ere-mcc': {
    contexte: "En confection, un patron en volume (mannequin, gabarit) peut se modéliser par un assemblage de solides usuels.",
    problematique: "Comment représenter un gabarit composé de plusieurs solides et anticiper sa section ?",
  },
  '1ere-log': {
    contexte: "En logistique, un espace de stockage ou un colis composé résulte souvent de l'assemblage de plusieurs solides usuels (pavés, cylindres).",
    problematique: "Comment représenter un espace de stockage composé de plusieurs solides et calculer son volume total ?",
  },
  '1ere-agora': {
    contexte: "Dans une structure administrative, l'agencement d'un local ou d'un mobilier peut se modéliser par un assemblage de solides usuels.",
    problematique: "Comment représenter un agencement composé de plusieurs solides et en calculer le volume total ?",
  },
};

function initialiserTD02() {
  initOngletsParFiliere();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_TD02
  });

  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Géométrie dans l'espace : représenter et sectionner un solide",
    tp: 'TD02'
  });
}

initialiserTD02();

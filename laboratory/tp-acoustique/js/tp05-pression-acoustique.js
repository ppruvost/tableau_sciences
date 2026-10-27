/**
 * tp-acoustique/js/tp05-pression-acoustique.js
 *
 * Contrôleur du TP05 « Pression et niveau acoustiques ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp05-pression-acoustique.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP05()
 */

import { initZoomVisuels } from '../../js/zoom-visuel.js';
import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, nombreFr, ajouterLigne } from './compte-rendu-acoustique.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
// D'après le référentiel, la capacité « Caractériser la propagation d'un
// signal sonore » (qui couvre TP04 et TP05) n'est évaluée qu'en 1ère pour
// la filière Métiers de la couture et de la confection, et en Terminale
// pour les filières Technicien en chaudronnerie industrielle et Technicien
// en réalisation de produits mécaniques. Le menu est donc restreint à ces
// 3 combinaisons via FILIERES_AUTORISEES (voir plus bas), même si 1ère et
// Tle proposent par ailleurs les mêmes filières dans data/filieres.js.
const CONTEXTES_PRO = {

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, la disposition des postes dans un atelier peut être pensée pour limiter le niveau sonore perçu par chaque opérateur, en s'appuyant sur l'atténuation du son avec la distance.",
    problematiques: {
      "niveau-depuis-pression": "Comment calculer le niveau d'intensité acoustique à partir de la pression acoustique mesurée ?",
      "attenuation-distance": "Comment le niveau sonore évolue-t-il avec la distance à la source, et comment en tirer parti pour limiter l'exposition ?",
    },
  },

  'tle-tci': {
    contexte: "En Technicien en chaudronnerie industrielle, l'organisation d'un atelier (éloignement des postes de soudure et de découpe, écrans acoustiques) s'appuie sur la connaissance de l'atténuation du niveau sonore avec la distance.",
    problematiques: {
      "niveau-depuis-pression": "Comment calculer le niveau d'intensité acoustique à partir de la pression acoustique mesurée ?",
      "attenuation-distance": "Comment le niveau sonore évolue-t-il avec la distance à la source, et comment en tirer parti pour limiter l'exposition ?",
    },
  },

  'tle-trpm': {
    contexte: "En Réalisation de produits mécaniques, l'organisation d'un atelier d'usinage (éloignement des machines-outils bruyantes, écrans acoustiques) s'appuie sur la connaissance de l'atténuation du niveau sonore avec la distance.",
    problematiques: {
      "niveau-depuis-pression": "Comment calculer le niveau d'intensité acoustique à partir de la pression acoustique mesurée ?",
      "attenuation-distance": "Comment le niveau sonore évolue-t-il avec la distance à la source, et comment en tirer parti pour limiter l'exposition ?",
    },
  },

};

// Restreint le menu déroulant "filière professionnelle" aux seules
// combinaisons réellement évaluées pour ce TP (cf. commentaire ci-dessus).
const FILIERES_AUTORISEES = ['1ere-mcc', 'tle-tci', 'tle-trpm'];

// Petit mot affiché sous le menu pour expliquer la restriction : les
// filières/niveaux non listés ci-dessus n'étudient pas cette capacité ici.
const NOTE_RESTRICTION_REFERENTIEL =
  "D'après le référentiel, cette capacité n'est évaluée qu'en 1ère (Métiers de la couture et de la confection) et en Terminale (Technicien en chaudronnerie industrielle, Technicien en réalisation de produits mécaniques). Ce TP n'est pas évalué pour les autres niveaux et filières professionnelles.";

// Constantes de référence pour le calcul du niveau d'intensité acoustique
const PRESSION_REFERENCE = 2e-5;   // Pa
const INTENSITE_REFERENCE = 1e-12; // W/m²

// Exécute une étape d'initialisation ; une erreur dans une étape est
// journalisée sans empêcher les suivantes de s'exécuter.
function etape(nom, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[tp-acoustique] étape « ${nom} » en erreur :`, err);
  }
}

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {

  etape('initZoomVisuels', () => {
    initZoomVisuels();
  });

  etape('initNiveauDepuisPression', () => {
    initNiveauDepuisPression();
  });

  etape('initNiveauDepuisIntensite', () => {
    initNiveauDepuisIntensite();
  });

  etape('initAttenuationDistance', () => {
    initAttenuationDistance();
  });

  etape('initMateriel', () => {
    initMateriel({
      equipementId: 'materiel-equipements',
      equipment: laboratoryEquipment,
      categorie: 'Acoustique',
    });
  });

  etape('initContextePro', () => {
    initContextePro({
      afficherProblematique: false,
      filieres: FILIERES_PRO,
      contextes: CONTEXTES_PRO,
      filieresAutorisees: FILIERES_AUTORISEES,
      noteRestriction: NOTE_RESTRICTION_REFERENTIEL,
    });
  });

  etape('initSections', () => {
    initSections();
  });

  etape('initTabs', () => {
    initTabs();
  });

  etape('initModesOperatoires', () => {
    initModesOperatoires();
  });

  etape('initRadarCompetences', () => {
    initRadarCompetences();
  });

  etape('initQuestionsParOnglet', () => {
    initQuestionsParOnglet();
  });

  etape('initImpressionCompteRendu', () => {
    initImpressionCompteRendu({
      titre: 'Pression et niveau acoustiques',
      tp: 'TP05',
      // Mesures saisies (valeurs, tableaux, graphiques), insérées avant les questions.
      sectionsSupplementaires: () => [
        sectionNiveauxCompteRendu(),
        sectionAttenuationCompteRendu(),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1a — Niveau à partir de la pression acoustique
// L = 20 log10(p / p0)
// =================================================================
function initNiveauDepuisPression() {

  const inputPression = $('pression-mesuree');
  const outputNiveau = $('niveau-depuis-pression-out');

  if (!inputPression || !outputNiveau) return;

  inputPression.addEventListener('input', () => {

    const pression = parseFloat(inputPression.value);

    if (Number.isNaN(pression) || pression <= 0) {
      outputNiveau.textContent = '—';
      return;
    }

    const niveau = 20 * Math.log10(pression / PRESSION_REFERENCE);
    outputNiveau.textContent = `${arrondir(niveau, 1)} dB`;
  });
}

// =================================================================
// Onglet 1b — Niveau à partir de l'intensité acoustique
// L = 10 log10(I / I0)
// =================================================================
function initNiveauDepuisIntensite() {

  const inputIntensite = $('intensite-mesuree');
  const outputNiveau = $('niveau-depuis-intensite-out');

  if (!inputIntensite || !outputNiveau) return;

  inputIntensite.addEventListener('input', () => {

    const intensite = parseFloat(inputIntensite.value);

    if (Number.isNaN(intensite) || intensite <= 0) {
      outputNiveau.textContent = '—';
      return;
    }

    const niveau = 10 * Math.log10(intensite / INTENSITE_REFERENCE);
    outputNiveau.textContent = `${arrondir(niveau, 1)} dB`;
  });
}

// =================================================================
// Onglet 2 — Atténuation du niveau sonore avec la distance
// Relevé (distance, niveau) affiché et tracé
// =================================================================
// État partagé avec l'impression du compte-rendu (réinitialisé à chaque affichage).
const pointsAttenuation = [];

function initAttenuationDistance() {

  const btnAjouter = $('attenuation-ajouter');
  const inputDistance = $('attenuation-distance-valeur');
  const inputNiveau = $('attenuation-niveau-valeur');
  const tbody = $('tbody-attenuation-distance');

  if (!btnAjouter || !tbody) return;

  const points = pointsAttenuation;
  points.length = 0;

  btnAjouter.addEventListener('click', () => {

    const distance = parseFloat(inputDistance.value);
    const niveau = parseFloat(inputNiveau.value);

    if (Number.isNaN(distance) || Number.isNaN(niveau)) return;

    points.push({ distance, niveau });
    points.sort((a, b) => a.distance - b.distance);

    redessinerTableauAttenuation(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-attenuation-distance',
      points.map(p => ({ x: p.distance, y: p.niveau })),
      { xLabel: 'Distance (m)', yLabel: 'Niveau sonore (dB)' }
    );

    inputDistance.value = '';
    inputNiveau.value = '';
    inputDistance.focus();
  });
}

function redessinerTableauAttenuation(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {
    ajouterLigne(tbody, [i + 1, `${arrondir(pt.distance, 1)} m`, `${arrondir(pt.niveau, 0)} dB`]);
  });
}

// =================================================================
// Sections transmises à js/compte-rendu.js
// =================================================================

function sectionNiveauxCompteRendu() {
  return sectionValeurs('Calculs : niveau d\'intensité acoustique', [
    ['Pression acoustique p (Pa)', 'pression-mesuree'],
    ['Niveau calculé à partir de p', 'niveau-depuis-pression-out'],
    ['Intensité acoustique I (W/m²)', 'intensite-mesuree'],
    ['Niveau calculé à partir de I', 'niveau-depuis-intensite-out'],
  ]);
}

function sectionAttenuationCompteRendu() {
  if (!pointsAttenuation.length) return null;
  const section = {
    titre: 'Mesures : atténuation du niveau sonore avec la distance',
    tableau: {
      entetes: ['N°', 'Distance (m)', 'Niveau sonore (dB)'],
      lignes: pointsAttenuation.map((p, i) => [i + 1, nombreFr(p.distance, 1), nombreFr(p.niveau, 0)]),
    },
  };
  // Conteneur du graphique : compte-rendu.js en extrait le <svg> (aucun graphique
  // tant qu'il y a moins de 2 points : le conteneur ne porte alors qu'un message).
  const conteneur = document.getElementById('graphique-attenuation-distance');
  if (conteneur?.querySelector('svg')) {
    section.canvas = conteneur;
    section.legende = 'Niveau sonore en fonction de la distance à la source';
  }
  return section;
}

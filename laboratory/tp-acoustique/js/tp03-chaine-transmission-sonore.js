/**
 * tp-acoustique/js/tp03-chaine-transmission-sonore.js
 *
 * Contrôleur du TP03 « Chaîne de transmission sonore ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp03-chaine-transmission-sonore.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP03()
 */

import { initZoomVisuels } from '../../js/zoom-visuel.js';
import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, nombreFr, canvasDe, ajouterLigne } from './compte-rendu-acoustique.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, des capteurs à ultrasons (fondés sur le même principe piézoélectrique) sont utilisés pour détecter la présence d'une pièce ou mesurer une distance sans contact.",
    problematiques: {
      "emetteur-piezo": "Comment un émetteur piézoélectrique transforme-t-il un signal électrique en onde sonore ?",
      "recepteur-piezo": "Comment un récepteur piézoélectrique convertit-il une onde sonore en tension, et comment cette tension évolue-t-elle avec la distance ?",
      "schema-chaine": "Comment décrire une chaîne de transmission d'information par canal sonore (émetteur, milieu de propagation, récepteur) ?",
    },
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains équipements de contrôle qualité utilisent des capteurs à ultrasons pour vérifier l'épaisseur ou la présence d'un tissu sur la chaîne de production.",
    problematiques: {
      "emetteur-piezo": "Comment un émetteur piézoélectrique transforme-t-il un signal électrique en onde sonore ?",
      "recepteur-piezo": "Comment un récepteur piézoélectrique convertit-il une onde sonore en tension, et comment cette tension évolue-t-elle avec la distance ?",
      "schema-chaine": "Comment décrire une chaîne de transmission d'information par canal sonore (émetteur, milieu de propagation, récepteur) ?",
    },
  },

};

// Réponses correctes attendues pour le schéma de la chaîne de transmission
const REPONSES_CHAINE = {
  'chaine-emetteur': 'emetteur',
  'chaine-milieu': 'milieu',
  'chaine-recepteur': 'recepteur',
};

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

  etape('initEmetteurPiezo', () => {
    initEmetteurPiezo();
  });

  etape('initRecepteurPiezo', () => {
    initRecepteurPiezo();
  });

  etape('initSchemaChaine', () => {
    initSchemaChaine();
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
      titre: 'Chaîne de transmission sonore',
      tp: 'TP03',
      // Mesures saisies (valeurs, tableaux, graphiques), insérées avant les questions.
      sectionsSupplementaires: () => [
        sectionEmetteurCompteRendu(),
        sectionRecepteurCompteRendu(),
        sectionChaineCompteRendu(),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Émetteur piézoélectrique
// Relevé qualitatif (tension, observation) dans un tableau cumulatif
// =================================================================
// États partagés avec l'impression du compte-rendu : le module reste en cache
// d'une navigation à l'autre, les init* les remettent à zéro.
const mesuresEmetteur = [];
const pointsRecepteur = [];

function initEmetteurPiezo() {

  const btnAjouter = $('emetteur-ajouter');
  const inputTension = $('emetteur-tension');
  const inputObservation = $('emetteur-observation');
  const tbody = $('tbody-emetteur-piezo');

  if (!btnAjouter || !tbody) return;

  mesuresEmetteur.length = 0;

  btnAjouter.addEventListener('click', () => {

    const tension = parseFloat(inputTension.value);
    const observation = (inputObservation.value || '').trim();

    if (Number.isNaN(tension) || !observation) return;

    mesuresEmetteur.push({ tension, observation });

    ajouterLigne(tbody, [mesuresEmetteur.length, `${arrondir(tension, 1)} V`, observation]);

    inputTension.value = '';
    inputObservation.value = '';
    inputTension.focus();
  });
}

// =================================================================
// Onglet 2 — Récepteur piézoélectrique
// Relevé (distance, tension reçue) affiché et tracé
// =================================================================
function initRecepteurPiezo() {

  const btnAjouter = $('recepteur-ajouter');
  const inputDistance = $('recepteur-distance');
  const inputTension = $('recepteur-tension');
  const tbody = $('tbody-recepteur-piezo');

  if (!btnAjouter || !tbody) return;

  const points = pointsRecepteur;
  points.length = 0;

  btnAjouter.addEventListener('click', () => {

    const distance = parseFloat(inputDistance.value);
    const tension = parseFloat(inputTension.value);

    if (Number.isNaN(distance) || Number.isNaN(tension)) return;

    points.push({ distance, tension });
    points.sort((a, b) => a.distance - b.distance);

    redessinerTableauRecepteur(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-recepteur-piezo',
      points.map(p => ({ x: p.distance, y: p.tension })),
      { xLabel: 'Distance (cm)', yLabel: 'Tension reçue (mV)' }
    );

    inputDistance.value = '';
    inputTension.value = '';
    inputDistance.focus();
  });
}

function redessinerTableauRecepteur(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {
    ajouterLigne(tbody, [i + 1, `${arrondir(pt.distance, 0)} cm`, `${arrondir(pt.tension, 0)} mV`]);
  });
}

// =================================================================
// Onglet 3 — Schéma de la chaîne de transmission
// Vérification des trois select par rapport aux réponses attendues
// =================================================================
function initSchemaChaine() {

  const btnVerifier = $('chaine-verifier');
  const resultat = $('chaine-resultat');

  if (!btnVerifier || !resultat) return;

  btnVerifier.addEventListener('click', () => {

    const reponses = Object.keys(REPONSES_CHAINE).map(id => ({
      id,
      valeur: $(id)?.value || '',
      attendu: REPONSES_CHAINE[id],
    }));

    if (reponses.some(r => !r.valeur)) {
      resultat.textContent = 'Compléter les trois éléments du schéma avant de vérifier.';
      resultat.classList.remove('succes', 'erreur');
      return;
    }

    const valeurs = reponses.map(r => r.valeur);
    const doublons = new Set(valeurs).size !== valeurs.length;
    const correct = !doublons && reponses.every(r => r.valeur === r.attendu);

    if (correct) {
      resultat.textContent = '✓ Schéma correct : émetteur → milieu de propagation → récepteur.';
      resultat.classList.add('succes');
      resultat.classList.remove('erreur');
    } else {
      resultat.textContent = '✗ Schéma incorrect : revoir le rôle de chaque élément de la chaîne.';
      resultat.classList.add('erreur');
      resultat.classList.remove('succes');
    }
  });
}

// =================================================================
// Sections transmises à js/compte-rendu.js
// =================================================================

function sectionEmetteurCompteRendu() {
  if (!mesuresEmetteur.length) return null;
  return {
    titre: 'Mesures : émetteur piézoélectrique',
    tableau: {
      entetes: ['N°', 'Tension appliquée (V)', 'Observation'],
      lignes: mesuresEmetteur.map((m, i) => [i + 1, nombreFr(m.tension, 1), m.observation]),
    },
  };
}

function sectionRecepteurCompteRendu() {
  if (!pointsRecepteur.length) return null;
  const section = {
    titre: 'Mesures : récepteur piézoélectrique',
    tableau: {
      entetes: ['N°', 'Distance (cm)', 'Tension reçue (mV)'],
      lignes: pointsRecepteur.map((p, i) => [i + 1, nombreFr(p.distance, 0), nombreFr(p.tension, 0)]),
    },
  };
  // Graphique tracé par js/graphique.js (repris seulement s'il s'agit d'un canvas).
  const canvas = canvasDe('graphique-recepteur-piezo');
  if (canvas) {
    section.canvas = canvas;
    section.legende = 'Tension reçue en fonction de la distance';
  }
  return section;
}

function sectionChaineCompteRendu() {
  return sectionValeurs('Schéma de la chaîne de transmission', [
    ['1. Élément qui produit le son', 'chaine-emetteur'],
    ['2. Élément qui transporte le son', 'chaine-milieu'],
    ['3. Élément qui reçoit le son', 'chaine-recepteur'],
    ['Vérification', 'chaine-resultat', /^[✓✗]/],
  ]);
}

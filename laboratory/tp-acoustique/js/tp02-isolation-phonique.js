/**
 * tp-acoustique/js/tp02-isolation-phonique.js
 *
 * Contrôleur du TP02 « Isolation phonique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp02-isolation-phonique.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP02()
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
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, les capots et carters de machines-outils sont parfois doublés de matériaux absorbants pour limiter le bruit transmis à l'atelier.",
    problematiques: {
      "mesure-attenuation": "Comment mesurer l'atténuation apportée par un matériau isolant pour protéger un poste de meulage ou de découpe du bruit ?",
      "classement-isolants": "Comment choisir, parmi plusieurs matériaux, le plus isolant pour protéger un poste de meulage ou de découpe du bruit ?",
    },
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, un atelier regroupant plusieurs machines peut nécessiter une cloison ou un panneau absorbant entre les postes de travail pour limiter la gêne sonore.",
    problematiques: {
      "mesure-attenuation": "Comment mesurer l'atténuation apportée par un matériau isolant pour protéger un atelier de confection du bruit ?",
      "classement-isolants": "Comment choisir, parmi plusieurs matériaux, le plus isolant pour protéger un atelier de confection du bruit ?",
    },
  },

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

  etape('initMesureAttenuation', () => {
    initMesureAttenuation();
  });

  etape('initClassementIsolants', () => {
    initClassementIsolants();
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

  etape('initOngletsParFiliere', () => {
    initOngletsParFiliere({
      mapping: {
        '2nde-remi': ['mesure-attenuation', 'classement-isolants'],
        '2nde-mcc': ['mesure-attenuation', 'classement-isolants'],
      },
      messageId: 'tp02-message-filiere',
      messageTexte: "Ce TP n'est pas au programme de votre filière à ce niveau. Reportez-vous au niveau où il est étudié dans votre spécialité.",
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
      titre: 'Isolation phonique',
      tp: 'TP02',
      // Mesures saisies (valeurs, tableaux, graphiques), insérées avant les questions.
      sectionsSupplementaires: () => [
        sectionAttenuationCompteRendu(),
        sectionIsolantsCompteRendu(),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Mesure de l'atténuation d'un matériau
// Atténuation (dB) = Niveau sans matériau - Niveau avec matériau
// =================================================================
function initMesureAttenuation() {

  const inputSans = $('niveau-sans-materiau');
  const inputAvec = $('niveau-avec-materiau');
  const outputAttenuation = $('attenuation-calculee');

  if (!inputSans || !inputAvec || !outputAttenuation) return;

  function calculer() {

    const sans = parseFloat(inputSans.value);
    const avec = parseFloat(inputAvec.value);

    if (Number.isNaN(sans) || Number.isNaN(avec)) {
      outputAttenuation.textContent = '—';
      return;
    }

    const attenuation = sans - avec;
    outputAttenuation.textContent = `${arrondir(attenuation, 1)} dB`;
  }

  inputSans.addEventListener('input', calculer);
  inputAvec.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 — Classement des matériaux isolants
// Relevé (matériau, épaisseur, atténuation) reclassé du plus isolant
// au moins isolant à chaque ajout
// =================================================================
// État partagé avec l'impression du compte-rendu (réinitialisé à chaque affichage).
const isolants = [];

function initClassementIsolants() {

  const btnAjouter = $('isolant-ajouter');
  const inputMateriau = $('isolant-materiau');
  const inputEpaisseur = $('isolant-epaisseur');
  const inputAttenuation = $('isolant-attenuation');
  const tbody = $('tbody-classement-isolants');

  if (!btnAjouter || !tbody) return;

  isolants.length = 0; // état remis à zéro à chaque affichage du TP

  btnAjouter.addEventListener('click', () => {

    const materiau = (inputMateriau.value || '').trim();
    const epaisseur = parseFloat(inputEpaisseur.value);
    const attenuation = parseFloat(inputAttenuation.value);

    if (!materiau || Number.isNaN(epaisseur) || Number.isNaN(attenuation)) return;

    isolants.push({ materiau, epaisseur, attenuation });
    isolants.sort((a, b) => b.attenuation - a.attenuation); // + isolant -> - isolant

    redessinerTableauIsolants(tbody, isolants);

    inputMateriau.value = '';
    inputEpaisseur.value = '';
    inputAttenuation.value = '';
    inputMateriau.focus();
  });
}

function redessinerTableauIsolants(tbody, isolants) {

  tbody.innerHTML = '';

  isolants.forEach(iso => {
    ajouterLigne(tbody, [iso.materiau, `${arrondir(iso.epaisseur, 0)} mm`, `${arrondir(iso.attenuation, 1)} dB`]);
  });
}

// =================================================================
// Sections transmises à js/compte-rendu.js
// =================================================================

function sectionAttenuationCompteRendu() {
  return sectionValeurs('Mesures : atténuation apportée par un matériau', [
    ['Niveau sonore sans matériau (dB)', 'niveau-sans-materiau'],
    ['Niveau sonore avec matériau (dB)', 'niveau-avec-materiau'],
    ['Atténuation calculée', 'attenuation-calculee'],
  ]);
}

function sectionIsolantsCompteRendu() {
  if (!isolants.length) return null;
  return {
    titre: 'Classement des matériaux isolants (du plus au moins isolant)',
    tableau: {
      entetes: ['Matériau', 'Épaisseur (mm)', 'Atténuation (dB)'],
      lignes: isolants.map(i => [i.materiau, nombreFr(i.epaisseur, 0), nombreFr(i.attenuation, 1)]),
    },
  };
}
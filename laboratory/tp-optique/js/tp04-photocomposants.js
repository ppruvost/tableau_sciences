/**
 * tp-optique/js/tp04-photocomposants.js
 *
 * Contrôleur du TP04 « Photocomposants ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp04-photocomposants.html dans #content.
 *
 * Convention SciLab (structure alignée sur tp-electricite, CLAUDE v4) :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP04()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, sectionTableau, ajouterLigne } from './compte-rendu-optique.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { initMateriel } from '../../../js/materiel.js';
import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';
import { dessinerGraphiqueLigne } from '../../../js/graphique.js';

const CELERITE = 3.00e8;       // m/s
const PLANCK = 6.63e-34;       // J·s
const ELECTRON_VOLT = 1.60e-19; // J

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, des photodétecteurs (barrières optiques, capteurs de présence) sécurisent certaines machines en détectant le passage d'une pièce ou d'une main.",
    problematiques: {
      'caracteristique-eclairement': "Comment la réponse d'un photocomposant évolue-t-elle lorsque l'éclairement qu'il reçoit augmente ?",
      'caracteristique-longueur-onde': "Comment choisir un photocomposant sensible à la couleur de la lumière émise par la source d'une barrière optique ?",
      'energie-photon': "Pourquoi l'énergie d'un photon dépend-elle de la couleur de la lumière, et en quoi cela explique-t-il la sensibilité d'un photodétecteur ?",
    },
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains automates de découpe utilisent des capteurs photoélectriques pour détecter le bord d'un tissu ou l'arrêt d'un rouleau.",
    problematiques: {
      'caracteristique-eclairement': "Comment un capteur photoélectrique détecte-t-il le passage d'un tissu à partir de la variation d'éclairement reçue ?",
      'caracteristique-longueur-onde': "Comment la réponse d'un photocomposant dépend-elle de la couleur de la lumière reçue ?",
      'energie-photon': "Quelle relation lie l'énergie d'un photon à sa longueur d'onde, et que permet-elle d'expliquer sur le fonctionnement des capteurs ?",
    },
  },

};

// Exécute une étape d'initialisation ; une erreur dans une étape est
// journalisée sans empêcher les suivantes de s'exécuter.
function etape(nom, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[tp-optique] étape « ${nom} » en erreur :`, err);
  }
}

export function init() {

  etape('initZoomVisuels', () => {
    initZoomVisuels();
  });

  etape('initCaracteristiqueEclairement', () => {
    initCaracteristiqueEclairement();
  });

  etape('initCaracteristiqueLongueurOnde', () => {
    initCaracteristiqueLongueurOnde();
  });

  etape('initEnergiePhoton', () => {
    initEnergiePhoton();
  });

  etape('initMateriel', () => {
    initMateriel({
      equipementId: 'materiel-equipements',
      equipment: laboratoryEquipment,
      categorie: 'Optique',
    });
  });

  etape('initContextePro', () => {
    initContextePro({
      filieres: FILIERES_PRO,
      contextes: CONTEXTES_PRO,
      afficherProblematique: false,
    });
  });

  // TP destiné aux classes de 2nde (filières REMI et MCC).
  // Les clés absentes seraient traitées comme « aucune restriction » : les huit
  // niveaux/filières connus de l'optique sont donc tous déclarés.
  etape('initOngletsParFiliere', () => {
    initOngletsParFiliere({
      mapping: {
        '2nde-remi':  ['caracteristique-eclairement', 'caracteristique-longueur-onde', 'energie-photon'],
        '2nde-mcc':   ['caracteristique-eclairement', 'caracteristique-longueur-onde', 'energie-photon'],
        '1ere-tci':   [],
        '1ere-trpm':  [],
        '1ere-mcc':   [],
        'tle-tci':    [],
        'tle-trpm':   [],
        'tle-mcc':    [],
      },
      messageId: 'tp04-message-filiere',
      messageTexte: "Ce TP n'est pas au programme de votre niveau ou de votre filière : il est destiné aux classes de 2nde (filières REMI et MCC).",
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

  etape('initNavigationTP', () => {
    initNavigationTP();
  });

  etape('initImpressionCompteRendu', () => {
    initImpressionCompteRendu({
      titre: "Photocomposants",
      tp: 'TP04',
      sectionsSupplementaires: () => [
          ...sectionsPhotocomposant('Tableau — Caractéristique en fonction de l\'éclairement',
            'tbody-caracteristique-eclairement', 'graphique-eclairement',
            "Grandeur électrique en fonction de l'éclairement"),
          sectionTableau("Tableau — Caractéristique en fonction de la longueur d'onde",
            'tbody-caracteristique-longueur-onde', {
              idGraphique: 'graphique-longueur-onde',
              legende: "Grandeur électrique en fonction de la longueur d'onde",
            }),
          sectionValeurs("Manipulation — Énergie du photon", [
            ["Longueur d'onde λ (nm)", 'photon-longueur-onde'],
            ['Énergie du photon (J)', 'photon-energie-j'],
            ['Énergie du photon (eV)', 'photon-energie-ev'],
          ]),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Caractéristique en fonction de l'éclairement
// =================================================================
function initCaracteristiqueEclairement() {

  const btnAjouter = $('eclairement-ajouter');
  const inputLux = $('eclairement-lux');
  const inputGrandeur = $('eclairement-grandeur');
  const tbody = $('tbody-caracteristique-eclairement');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const lux = parseFloat(inputLux.value);
    const grandeur = parseFloat(inputGrandeur.value);

    if (Number.isNaN(lux) || Number.isNaN(grandeur)) return;

    points.push({ lux, grandeur });
    points.sort((a, b) => a.lux - b.lux);

    tbody.innerHTML = '';
    points.forEach((p, i) => {
      ajouterLigne(tbody, [i + 1, `${arrondir(p.lux, 0)} lux`, arrondir(p.grandeur, 3)]);
    });

    dessinerGraphiqueLigne(
      'graphique-eclairement',
      points.map(p => ({ x: p.lux, y: p.grandeur })),
      { xLabel: 'Éclairement (lux)', yLabel: 'Grandeur électrique' }
    );

    inputLux.value = '';
    inputGrandeur.value = '';
    inputLux.focus();
  });
}

// =================================================================
// Onglet 2 — Caractéristique en fonction de la longueur d'onde
// =================================================================
function initCaracteristiqueLongueurOnde() {

  const btnAjouter = $('longueur-onde-ajouter');
  const inputSource = $('longueur-onde-source');
  const inputNm = $('longueur-onde-nm');
  const inputGrandeur = $('longueur-onde-grandeur');
  const tbody = $('tbody-caracteristique-longueur-onde');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const source = (inputSource.value || '').trim();
    const nm = parseFloat(inputNm.value);
    const grandeur = parseFloat(inputGrandeur.value);

    if (!source || Number.isNaN(nm) || Number.isNaN(grandeur)) return;

    points.push({ source, nm, grandeur });
    points.sort((a, b) => a.nm - b.nm);

    tbody.innerHTML = '';
    points.forEach(p => {
      ajouterLigne(tbody, [p.source, `${arrondir(p.nm, 0)} nm`, arrondir(p.grandeur, 3)]);
    });

    dessinerGraphiqueLigne(
      'graphique-longueur-onde',
      points.map(p => ({ x: p.nm, y: p.grandeur })),
      { xLabel: "Longueur d'onde (nm)", yLabel: 'Grandeur électrique' }
    );

    inputSource.value = '';
    inputNm.value = '';
    inputGrandeur.value = '';
    inputSource.focus();
  });
}

// =================================================================
// Onglet 3 — Énergie du photon : E = h.c / λ
// =================================================================
function initEnergiePhoton() {

  const inputNm = $('photon-longueur-onde');
  const outputJ = $('photon-energie-j');
  const outputEv = $('photon-energie-ev');

  if (!inputNm || !outputJ || !outputEv) return;

  inputNm.addEventListener('input', () => {

    const nm = parseFloat(inputNm.value);

    if (Number.isNaN(nm) || nm <= 0) {
      outputJ.textContent = '—';
      outputEv.textContent = '—';
      return;
    }

    const lambdaM = nm * 1e-9;
    const energieJ = (PLANCK * CELERITE) / lambdaM;
    const energieEv = energieJ / ELECTRON_VOLT;

    outputJ.textContent = `${energieJ.toExponential(3)} J`;
    outputEv.textContent = `${arrondir(energieEv, 3)} eV`;
  });
}

// Sections « photocomposant » puis « tableau + graphique » : le type de
// photocomposant (select sans valeur vide) n'est imprimé que si des mesures existent.
function sectionsPhotocomposant(titre, idTbody, idGraphique, legende) {
  const mesures = sectionTableau(titre, idTbody, { idGraphique, legende });
  if (!mesures) return [];
  return [
    sectionValeurs('Manipulation — Caractéristique en fonction de l\'éclairement', [
      ['Photocomposant étudié', 'photo-type-1'],
    ]),
    mesures,
  ].filter(Boolean);
}
/**
 * tp-optique/js/tp06-lentilles.js
 *
 * Contrôleur du TP06 « Lentilles convergentes et divergentes ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp06-lentilles.html dans #content.
 *
 * Convention SciLab (structure alignée sur tp-electricite, CLAUDE v4) :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP06()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, sectionTableau, ajouterLigne, RESULTAT_CALCULE } from './compte-rendu-optique.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { initMateriel } from '../../../js/materiel.js';
import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "En chaudronnerie industrielle, les loupes et viseurs optiques utilisés pour le contrôle des soudures et des tôles reposent sur des lentilles convergentes dont la distance focale détermine le grossissement.",
    problematiques: {
      'differencier-lentilles': "Comment reconnaître une lentille convergente d'une lentille divergente avant de choisir la loupe d'un poste de contrôle ?",
      'distance-focale': "Comment déterminer expérimentalement la distance focale d'une lentille convergente utilisée dans un viseur de contrôle ?",
      'conjugaison-grandissement': "Comment prévoir la position, la taille et le sens de l'image formée par une lentille convergente ?",
    },
  },

  '1ere-trpm': {
    contexte: "En réalisation de produits mécaniques, le contrôle qualité des pièces usinées s'appuie sur des loupes et viseurs optiques dont les lentilles convergentes déterminent le grossissement observé.",
    problematiques: {
      'differencier-lentilles': "Comment reconnaître une lentille convergente d'une lentille divergente avant de choisir la loupe d'un poste de contrôle ?",
      'distance-focale': "Comment déterminer expérimentalement la distance focale d'une lentille convergente utilisée dans une loupe de contrôle ?",
      'conjugaison-grandissement': "Comment prévoir la position, la taille et le sens de l'image formée par une lentille convergente ?",
    },
  },

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, les loupes d'établi utilisées pour les travaux de précision (couture fine, contrôle qualité) sont des lentilles convergentes choisies pour leur distance focale.",
    problematiques: {
      'differencier-lentilles': "Comment reconnaître une lentille convergente, utilisable comme loupe d'établi ?",
      'distance-focale': "Comment déterminer expérimentalement la distance focale d'une loupe d'établi ?",
      'conjugaison-grandissement': "Comment prévoir la position et le grandissement de l'image donnée par une loupe d'établi pour choisir la lentille adaptée ?",
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

  etape('initDifferencierLentilles', () => {
    initDifferencierLentilles();
  });

  etape('initDistanceFocale', () => {
    initDistanceFocale();
  });

  etape('initConjugaisonGrandissement', () => {
    initConjugaisonGrandissement();
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

  // TP destiné aux classes de 1ère (filières TCI, TRPM et MCC).
  // Les clés absentes seraient traitées comme « aucune restriction » : les huit
  // niveaux/filières connus de l'optique sont donc tous déclarés.
  etape('initOngletsParFiliere', () => {
    initOngletsParFiliere({
      mapping: {
        '2nde-remi':  [],
        '2nde-mcc':   [],
        '1ere-tci':   ['differencier-lentilles', 'distance-focale', 'conjugaison-grandissement'],
        '1ere-trpm':  ['differencier-lentilles', 'distance-focale', 'conjugaison-grandissement'],
        '1ere-mcc':   ['differencier-lentilles', 'distance-focale', 'conjugaison-grandissement'],
        'tle-tci':    [],
        'tle-trpm':   [],
        'tle-mcc':    [],
      },
      messageId: 'tp06-message-filiere',
      messageTexte: "Ce TP n'est pas au programme de votre niveau ou de votre filière : il est destiné aux classes de 1ère (filières TCI, TRPM et MCC).",
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
      titre: "Lentilles convergentes et divergentes",
      tp: 'TP06',
      sectionsSupplementaires: () => [
          sectionValeurs('Manipulation — Convergente ou divergente ?', [
            ['Forme observée', 'lentille-forme'],
            ['Effet sur un faisceau parallèle', 'lentille-faisceau'],
            ['Nature de la lentille', 'lentille-nature-out'],
          ]),
          sectionTableau('Tableau — Distance focale : essais', 'tbody-distance-focale'),
          sectionValeurs('Manipulation — Distance focale : moyenne', [
            ['Résultat', 'focale-moyenne', /^Distance focale moyenne/],
          ]),
          sectionValeurs('Manipulation — Conjugaison et grandissement', [
            ['Position de l\'objet OA (cm)', 'conjugaison-oa'],
            ["Distance focale f' (cm)", 'conjugaison-f'],
            ["Position de l'image OA' calculée", 'conjugaison-oa-prime-out'],
            ['Grandissement γ calculé', 'conjugaison-grandissement-out'],
            ["Nature de l'image", 'conjugaison-nature', RESULTAT_CALCULE],
            ["OA' mesuré sur le montage (cm)", 'conjugaison-oa-prime-mesure'],
          ]),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Différencier convergente / divergente
// =================================================================
function initDifferencierLentilles() {

  const selectForme = $('lentille-forme');
  const selectFaisceau = $('lentille-faisceau');
  const output = $('lentille-nature-out');

  if (!selectForme || !selectFaisceau || !output) return;

  function calculer() {

    const forme = selectForme.value;
    const faisceau = selectFaisceau.value;

    if (!forme || !faisceau) {
      output.textContent = '—';
      return;
    }

    const coherent = (forme === 'epaisse-centre' && faisceau === 'converge')
      || (forme === 'mince-centre' && faisceau === 'diverge');

    if (forme === 'epaisse-centre' && faisceau === 'converge') {
      output.textContent = 'Lentille convergente';
    } else if (forme === 'mince-centre' && faisceau === 'diverge') {
      output.textContent = 'Lentille divergente';
    } else {
      output.textContent = 'Observation incohérente : revoir la manipulation.';
    }
  }

  selectForme.addEventListener('change', calculer);
  selectFaisceau.addEventListener('change', calculer);
}

// =================================================================
// Onglet 2 — Distance focale expérimentale (moyenne des essais)
// =================================================================
function initDistanceFocale() {

  const btnAjouter = $('focale-ajouter');
  const inputDistance = $('focale-distance-mesuree');
  const tbody = $('tbody-distance-focale');
  const moyenne = $('focale-moyenne');

  if (!btnAjouter || !tbody) return;

  const mesures = [];

  btnAjouter.addEventListener('click', () => {

    const distance = parseFloat(inputDistance.value);
    if (Number.isNaN(distance) || distance <= 0) return;

    mesures.push(distance);

    ajouterLigne(tbody, [mesures.length, `${arrondir(distance, 1)} cm`]);

    if (moyenne) {
      const m = mesures.reduce((a, b) => a + b, 0) / mesures.length;
      moyenne.textContent = `Distance focale moyenne f' ≈ ${arrondir(m, 1)} cm (sur ${mesures.length} mesure${mesures.length > 1 ? 's' : ''}).`;
    }

    inputDistance.value = '';
    inputDistance.focus();
  });
}

// =================================================================
// Onglet 3 — Conjugaison et grandissement
// 1/OA' - 1/OA = 1/f' ; γ = OA'/OA
// =================================================================
function initConjugaisonGrandissement() {

  const inputOA = $('conjugaison-oa');
  const inputF = $('conjugaison-f');
  const outputOAPrime = $('conjugaison-oa-prime-out');
  const outputGamma = $('conjugaison-grandissement-out');
  const nature = $('conjugaison-nature');

  if (!inputOA || !inputF || !outputOAPrime || !outputGamma) return;

  function calculer() {

    const OA = parseFloat(inputOA.value);
    const f = parseFloat(inputF.value);

    if (Number.isNaN(OA) || Number.isNaN(f) || OA === 0 || f === 0) {
      outputOAPrime.textContent = '—';
      outputGamma.textContent = '—';
      if (nature) nature.textContent = 'Compléter OA et f\' pour afficher la nature de l\'image.';
      return;
    }

    // 1/OA' = 1/f' + 1/OA
    const invOAPrime = (1 / f) + (1 / OA);

    if (invOAPrime === 0) {
      outputOAPrime.textContent = 'Image à l\'infini';
      outputGamma.textContent = '—';
      if (nature) nature.textContent = 'L\'objet est situé dans le plan focal objet : l\'image se forme à l\'infini.';
      return;
    }

    const OAPrime = 1 / invOAPrime;
    const gamma = OAPrime / OA;

    outputOAPrime.textContent = `${arrondir(OAPrime, 1)} cm`;
    outputGamma.textContent = arrondir(gamma, 2);

    if (nature) {

      const typeImage = OAPrime > 0 ? 'réelle (peut être projetée sur un écran)' : 'virtuelle (ne peut pas être projetée sur un écran)';
      const sens = gamma < 0 ? 'renversée' : 'droite';
      const taille = Math.abs(gamma) > 1 ? 'agrandie' : (Math.abs(gamma) < 1 ? 'réduite' : 'de même taille que l\'objet');

      nature.textContent = `Image ${typeImage}, ${sens}, ${taille} (γ = ${arrondir(gamma, 2)}).`;
    }
  }

  inputOA.addEventListener('input', calculer);
  inputF.addEventListener('input', calculer);
}
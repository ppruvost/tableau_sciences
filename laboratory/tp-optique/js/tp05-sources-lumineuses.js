/**
 * tp-optique/js/tp05-sources-lumineuses.js
 *
 * Contrôleur du TP05 « Sources lumineuses ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp05-sources-lumineuses.html dans #content.
 *
 * Convention SciLab (structure alignée sur tp-electricite, CLAUDE v4) :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP05()
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
    contexte: "En chaudronnerie industrielle, l'éclairage du poste de soudage et de traçage doit être suffisant et durable ; le choix des lampes de l'atelier a un impact direct sur la facture énergétique.",
    problematiques: {
      'spectres-emission': "Comment reconnaître une source lumineuse à partir de son spectre d'émission pour choisir l'éclairage d'un poste de soudage ou de traçage ?",
      'efficacite-energetique': "Comment comparer l'efficacité énergétique de deux sources lumineuses pour choisir l'éclairage d'un poste de travail ?",
      'proprietes-laser': "Quelles propriétés du faisceau laser (directivité, couleur unique) le rendent-elles utile en atelier, et quels risques entraînent-elles ?",
    },
  },

  '1ere-trpm': {
    contexte: "Sur une machine-outil, un éclairage localisé performant et économe est nécessaire pour le contrôle précis des pièces usinées ; le choix des lampes de l'atelier a un impact direct sur la facture énergétique.",
    problematiques: {
      'spectres-emission': "Comment reconnaître une source lumineuse à partir de son spectre d'émission pour choisir l'éclairage localisé d'une machine-outil ?",
      'efficacite-energetique': "Comment comparer l'efficacité énergétique de deux sources lumineuses pour choisir l'éclairage d'un poste de travail ?",
      'proprietes-laser': "Comment exploiter la directivité et la couleur unique d'un faisceau laser pour le contrôle ou le traçage de pièces usinées ?",
    },
  },

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, un bon éclairage du poste de couture (température de couleur adaptée, efficacité énergétique) facilite le travail de précision et limite la consommation électrique de l'atelier.",
    problematiques: {
      'spectres-emission': "Comment le spectre d'émission d'une lampe renseigne-t-il sur la qualité de l'éclairage d'un poste de couture ?",
      'efficacite-energetique': "Comment choisir, à partir des indicateurs d'emballage, la lampe la mieux adaptée à l'éclairage d'un poste de couture ?",
      'proprietes-laser': "Pourquoi un faisceau laser reste-t-il fin et de couleur unique, et comment l'utiliser sans risque pour repérer ou découper un tissu ?",
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

  etape('initSpectresEmission', () => {
    initSpectresEmission();
  });

  etape('initEfficaciteEnergetique', () => {
    initEfficaciteEnergetique();
  });

  etape('initProprietesLaser', () => {
    initProprietesLaser();
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
        '1ere-tci':   ['spectres-emission', 'efficacite-energetique', 'proprietes-laser'],
        '1ere-trpm':  ['spectres-emission', 'efficacite-energetique', 'proprietes-laser'],
        '1ere-mcc':   ['spectres-emission', 'efficacite-energetique', 'proprietes-laser'],
        'tle-tci':    [],
        'tle-trpm':   [],
        'tle-mcc':    [],
      },
      messageId: 'tp05-message-filiere',
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
      titre: "Sources lumineuses",
      tp: 'TP05',
      sectionsSupplementaires: () => [
          sectionTableau('Tableau — Sources et spectres associés', 'tbody-spectres-emission'),
          sectionEfficaciteLampes(),
          sectionValeurs('Manipulation — Efficacité énergétique : conclusion', [
            ['Comparaison des deux lampes', 'efficacite-comparaison', RESULTAT_CALCULE],
            ['Justification du choix de la lampe', 'choix-lampe-justification'],
          ]),
          sectionValeurs('Manipulation — Propriétés du laser', [
            ['Diamètre du faisceau à proximité (mm)', 'laser-diametre-proche'],
            ['Diamètre du faisceau à grande distance (mm)', 'laser-diametre-loin'],
            ['Conclusion sur la divergence', 'laser-conclusion-out'],
          ]),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Associer une source à son spectre d'émission
// =================================================================
function initSpectresEmission() {

  const btnAjouter = $('spectre-ajouter');
  const selectSource = $('spectre-source');
  const selectType = $('spectre-type');
  const tbody = $('tbody-spectres-emission');

  if (!btnAjouter || !tbody) return;

  const LABELS_SOURCE = { soleil: 'Soleil', del: 'Lampe à DEL', incandescence: 'Lampe à incandescence', laser: 'Laser' };
  const LABELS_TYPE = {
    'continu-large': 'Continu, sur tout le domaine visible',
    'continu-chaud': 'Continu, plus intense dans le rouge/IR',
    'bandes': 'Composé de quelques bandes colorées',
    'raie': 'Une seule raie très fine (monochromatique)',
  };

  btnAjouter.addEventListener('click', () => {

    const source = selectSource.value;
    const type = selectType.value;

    if (!source || !type) return;

    ajouterLigne(tbody, [LABELS_SOURCE[source] || source, LABELS_TYPE[type] || type]);

    selectSource.value = '';
    selectType.value = '';
  });
}

// =================================================================
// Onglet 2 — Efficacité énergétique de deux lampes
// =================================================================
function initEfficaciteEnergetique() {

  const inputPA = $('lampe-a-puissance');
  const inputFA = $('lampe-a-flux');
  const outputEffA = $('lampe-a-efficacite');

  const inputPB = $('lampe-b-puissance');
  const inputFB = $('lampe-b-flux');
  const outputEffB = $('lampe-b-efficacite');

  const comparaison = $('efficacite-comparaison');

  if (!inputPA || !inputFA || !outputEffA || !inputPB || !inputFB || !outputEffB) return;

  function efficacite(puissance, flux) {

    const p = parseFloat(puissance);
    const f = parseFloat(flux);

    if (Number.isNaN(p) || Number.isNaN(f) || p <= 0) return null;

    return f / p;
  }

  function calculer() {

    const effA = efficacite(inputPA.value, inputFA.value);
    const effB = efficacite(inputPB.value, inputFB.value);

    outputEffA.textContent = effA === null ? '—' : `${arrondir(effA, 1)} lm/W`;
    outputEffB.textContent = effB === null ? '—' : `${arrondir(effB, 1)} lm/W`;

    if (comparaison) {

      if (effA === null || effB === null) {
        comparaison.textContent = 'Compléter les puissances et flux lumineux des deux lampes pour afficher la comparaison.';
        return;
      }

      const meilleure = effA >= effB ? 'A' : 'B';
      const rapport = effA >= effB ? effA / effB : effB / effA;

      comparaison.textContent = `La lampe ${meilleure} est la plus efficace, avec une efficacité énergétique environ ${arrondir(rapport, 1)} fois supérieure à l'autre lampe.`;
    }
  }

  [inputPA, inputFA, inputPB, inputFB].forEach(el => el.addEventListener('input', calculer));
}

// =================================================================
// Onglet 3 — Propriétés du laser : divergence du faisceau
// =================================================================
function initProprietesLaser() {

  const inputProche = $('laser-diametre-proche');
  const inputLoin = $('laser-diametre-loin');
  const output = $('laser-conclusion-out');

  if (!inputProche || !inputLoin || !output) return;

  function calculer() {

    const proche = parseFloat(inputProche.value);
    const loin = parseFloat(inputLoin.value);

    if (Number.isNaN(proche) || Number.isNaN(loin) || proche <= 0) {
      output.textContent = '—';
      return;
    }

    const variation = ((loin - proche) / proche) * 100;

    if (Math.abs(variation) < 20) {
      output.textContent = `Variation d'environ ${arrondir(variation, 0)} % : faisceau peu divergent, caractéristique du laser.`;
    } else {
      output.textContent = `Variation d'environ ${arrondir(variation, 0)} % : divergence significative, vérifier le montage.`;
    }
  }

  inputProche.addEventListener('input', calculer);
  inputLoin.addEventListener('input', calculer);
}

// Tableau de comparaison des deux lampes : les cellules de saisie ne sont pas
// dans un tbody[id], il est donc reconstruit ici à partir des champs.
function sectionEfficaciteLampes() {
  const lire = (id, saisie) => {
    const el = $(id);
    const v = el ? (saisie ? el.value : el.textContent).trim() : '';
    return (v === '—' ? '' : v).replace(/(\d)\.(\d)/g, '$1,$2');
  };
  const lignes = [['A', 'lampe-a'], ['B', 'lampe-b']].map(([nom, prefixe]) => [
    nom,
    lire(`${prefixe}-puissance`, true),
    lire(`${prefixe}-flux`, true),
    lire(`${prefixe}-efficacite`, false),
  ]);
  if (!lignes.some(l => l[1] || l[2])) return null;
  return {
    titre: 'Tableau — Efficacité énergétique de deux lampes',
    tableau: {
      entetes: ['Lampe', 'Puissance électrique (W)', 'Flux lumineux (lm)', 'Efficacité (lm/W)'],
      lignes: lignes.map(l => l.map(v => v || '—')),
    },
  };
}
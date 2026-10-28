/**
 * tp-acoustique/js/tp01-caracteriser-un-son.js
 *
 * Contrôleur du TP01 « Caractériser un son ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp01-caracteriser-un-son.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP01()
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
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, les postes de meulage, perçage et découpe génèrent des niveaux sonores élevés et prolongés, exposant les opérateurs à un risque auditif.",
    problematiques: {
      "periode-frequence": "Comment mesurer la période et la fréquence du son émis par une machine d'atelier (meuleuse, perceuse) à l'aide d'un oscilloscope ?",
      "niveau-intensite": "Comment mesurer le niveau d'intensité acoustique à un poste de travail (meulage, perçage, découpe) et le situer par rapport aux seuils de dangerosité et de douleur ?",
      "classement-sons": "Comment classer du plus grave au plus aigu les sons émis par une machine d'atelier (meuleuse, perceuse) à partir de leur fréquence ?",
    },
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, les ateliers regroupant plusieurs machines à coudre et surjeteuses en fonctionnement simultané peuvent atteindre des niveaux sonores gênants sur la durée d'une journée de travail.",
    problematiques: {
      "periode-frequence": "Comment mesurer la période et la fréquence du son émis par une machine à coudre ou une surjeteuse à l'aide d'un oscilloscope ?",
      "niveau-intensite": "Comment mesurer le niveau d'intensité acoustique à un atelier de confection et le situer par rapport aux seuils de dangerosité et de douleur ?",
      "classement-sons": "Comment classer du plus grave au plus aigu les sons émis par une machine à coudre ou une surjeteuse à partir de leur fréquence ?",
    },
  },

};

// Échelle de niveau d'intensité acoustique (repères usuels, en dB)
// utilisée pour situer une mesure et pour colorer la barre graduée.
const ECHELLE_DB = [
  { seuil: 0, label: 'Silence' },
  { seuil: 30, label: 'Chuchotement' },
  { seuil: 60, label: 'Conversation normale' },
  { seuil: 85, label: 'Seuil de dangerosité' },
  { seuil: 100, label: 'Atelier bruyant' },
  { seuil: 120, label: 'Seuil de douleur' },
  { seuil: 140, label: 'Danger immédiat' },
];

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

  etape('initPeriodeFrequence', () => {
    initPeriodeFrequence();
  });

  etape('initNiveauIntensite', () => {
    initNiveauIntensite();
  });

  etape('initClassementSons', () => {
    initClassementSons();
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
        '2nde-remi': ['periode-frequence', 'niveau-intensite', 'classement-sons'],
        '2nde-mcc': ['periode-frequence', 'niveau-intensite', 'classement-sons'],
      },
      messageId: 'tp01-message-filiere',
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
      titre: 'Caractériser un son',
      tp: 'TP01',
      // Mesures saisies (valeurs, tableaux, graphiques), insérées avant les questions.
      sectionsSupplementaires: () => [
        sectionValeursCompteRendu(),
        sectionClassementCompteRendu(),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Période / fréquence
// Relation f = 1/T, période saisie en millisecondes
// =================================================================
function initPeriodeFrequence() {

  const inputPeriode = $('periode-mesuree');
  const outputFrequence = $('frequence-calculee');

  if (!inputPeriode || !outputFrequence) return;

  inputPeriode.addEventListener('input', () => {

    const periodeMs = parseFloat(inputPeriode.value);

    if (Number.isNaN(periodeMs) || periodeMs <= 0) {
      outputFrequence.textContent = '—';
      return;
    }

    const frequence = 1000 / periodeMs; // T en ms -> f en Hz
    outputFrequence.textContent = `${arrondir(frequence, 1)} Hz`;
  });
}

// =================================================================
// Onglet 2 — Niveau d'intensité acoustique
// Appréciation qualitative + barre graduée colorée
// =================================================================
function initNiveauIntensite() {

  const inputNiveau = $('niveau-mesure');
  const outputAppreciation = $('niveau-appreciation');
  const conteneurEchelle = $('echelle-db');

  if (conteneurEchelle) {
    dessinerEchelleDb(conteneurEchelle);
  }

  if (!inputNiveau || !outputAppreciation) return;

  inputNiveau.addEventListener('input', () => {

    const niveau = parseFloat(inputNiveau.value);

    if (Number.isNaN(niveau)) {
      outputAppreciation.textContent = '—';
      positionnerCurseurEchelle(null);
      return;
    }

    outputAppreciation.textContent = apprecierNiveau(niveau);
    positionnerCurseurEchelle(niveau);
  });
}

function apprecierNiveau(niveau) {

  if (niveau < 85) return 'En dessous du seuil de dangerosité';
  if (niveau < 120) return 'Au-delà du seuil de dangerosité — protection requise';
  return 'Au-delà du seuil de douleur — danger immédiat';
}

function dessinerEchelleDb(conteneur) {

  conteneur.innerHTML = '';

  const barre = document.createElement('div');
  barre.className = 'echelle-db-barre';

  ECHELLE_DB.forEach((repere, i) => {

    const suivant = ECHELLE_DB[i + 1];
    const largeur = suivant ? suivant.seuil - repere.seuil : 20;

    const segment = document.createElement('div');
    segment.className = 'echelle-db-segment';
    segment.style.flexGrow = String(largeur);
    segment.title = `${repere.label} (à partir de ${repere.seuil} dB)`;
    segment.textContent = repere.label;

    barre.appendChild(segment);
  });

  const curseur = document.createElement('div');
  curseur.id = 'echelle-db-curseur';
  curseur.className = 'echelle-db-curseur';
  curseur.style.display = 'none';

  conteneur.appendChild(barre);
  conteneur.appendChild(curseur);
}

function positionnerCurseurEchelle(niveau) {

  const curseur = $('echelle-db-curseur');
  if (!curseur) return;

  if (niveau === null || Number.isNaN(niveau)) {
    curseur.style.display = 'none';
    return;
  }

  const NIVEAU_MAX_ECHELLE = 140;
  const pourcentage = Math.min(100, Math.max(0, (niveau / NIVEAU_MAX_ECHELLE) * 100));

  curseur.style.display = 'block';
  curseur.style.left = `${pourcentage}%`;
}

// =================================================================
// Onglet 3 — Classement des sons du plus grave au plus aigu
// Relevé (source, fréquence) saisi par l'élève, reclassé en direct
// =================================================================
// État partagé avec l'impression du compte-rendu : le module reste en cache
// d'une navigation à l'autre, initClassementSons() le réinitialise.
const sons = [];

function initClassementSons() {

  const btnAjouter = $('classement-ajouter');
  const inputSource = $('classement-source');
  const inputFrequence = $('classement-frequence');
  const tbody = $('tbody-classement-sons');

  if (!btnAjouter || !tbody) return;

  sons.length = 0; // état remis à zéro à chaque affichage du TP

  btnAjouter.addEventListener('click', () => {

    const source = (inputSource.value || '').trim();
    const frequence = parseFloat(inputFrequence.value);

    if (!source || Number.isNaN(frequence)) return;

    sons.push({ source, frequence });
    sons.sort((a, b) => a.frequence - b.frequence); // grave -> aigu

    redessinerTableauClassement(tbody, sons);

    inputSource.value = '';
    inputFrequence.value = '';
    inputSource.focus();
  });
}

function redessinerTableauClassement(tbody, sons) {

  tbody.innerHTML = '';

  sons.forEach(son => {
    ajouterLigne(tbody, [son.source, `${arrondir(son.frequence, 0)} Hz`]);
  });
}

// =================================================================
// Sections transmises à js/compte-rendu.js
// =================================================================

function sectionValeursCompteRendu() {
  return sectionValeurs('Mesures : période, fréquence et niveau d\'intensité acoustique', [
    ['Période mesurée à l\'oscilloscope (ms)', 'periode-mesuree'],
    ['Fréquence calculée', 'frequence-calculee'],
    ['Niveau mesuré au sonomètre (dB)', 'niveau-mesure'],
    ['Appréciation', 'niveau-appreciation'],
  ]);
}

function sectionClassementCompteRendu() {
  if (!sons.length) return null;
  return {
    titre: 'Classement des sons du plus grave au plus aigu',
    tableau: {
      entetes: ['Source sonore', 'Fréquence mesurée (Hz)'],
      lignes: sons.map(s => [s.source, nombreFr(s.frequence, 0)]),
    },
  };
}
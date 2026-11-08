/**
 * tp-optique/js/tp03-perception-couleurs.js
 *
 * Contrôleur du TP03 « Perception des couleurs ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp03-perception-couleurs.html dans #content.
 *
 * Convention SciLab (structure alignée sur tp-electricite, CLAUDE v4) :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP03()
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

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, le contrôle visuel de pièces (repérage de code couleur, contrôle qualité) dépend fortement de la couleur de l'éclairage de l'atelier.",
    problematiques: {
      'synthese-additive': "Comment obtenir toutes les couleurs, y compris le blanc, à partir de trois lumières colorées seulement ?",
      'synthese-soustractive': "Comment des filtres colorés modifient-ils la couleur de la lumière transmise lors d'un contrôle visuel ?",
      'couleur-objet-eclairage': "Pourquoi la couleur perçue d'une pièce peut-elle changer selon l'éclairage de l'atelier, et comment l'éviter lors d'un contrôle qualité ?",
      'modele-oeil': "Comment l'œil, modélisé par une lentille et un écran, permet-il de percevoir la couleur d'une pièce observée ?",
    },
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, l'assortiment des couleurs de tissus doit être vérifié sous un éclairage neutre, car la couleur perçue d'un tissu dépend de la composition spectrale de la lumière qui l'éclaire.",
    problematiques: {
      'synthese-additive': "Comment un écran ou un éclairage coloré reproduit-il toutes les teintes à partir de trois lumières colorées ?",
      'synthese-soustractive': "Comment la superposition de filtres ou de teintures colorées modifie-t-elle la couleur finale perçue d'un tissu ?",
      'couleur-objet-eclairage': "Pourquoi deux tissus qui semblent assortis sous un éclairage peuvent-ils sembler différents sous un autre, et comment l'anticiper ?",
      'modele-oeil': "Comment l'œil perçoit-il la couleur d'un tissu, et pourquoi cette perception dépend-elle de la lumière reçue ?",
    },
  },

};

// Prévisions usuelles de synthèse additive (combinaisons de lumières
// rouge/vert/bleu superposées sur un écran blanc)
function prevoirSyntheseAdditive(rouge, vert, bleu) {

  if (rouge && vert && bleu) return 'Blanc';
  if (rouge && vert) return 'Jaune';
  if (rouge && bleu) return 'Magenta';
  if (vert && bleu) return 'Cyan';
  if (rouge) return 'Rouge';
  if (vert) return 'Vert';
  if (bleu) return 'Bleu';
  return 'Noir (aucune lumière)';
}

// Réponses correctes attendues pour le schéma de l'œil
const REPONSES_OEIL = {
  'oeil-element1': 'cristallin',
  'oeil-element2': 'retine',
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

  etape('initSyntheseAdditive', () => {
    initSyntheseAdditive();
  });

  etape('initSyntheseSoustractive', () => {
    initSyntheseSoustractive();
  });

  etape('initCouleurObjetEclairage', () => {
    initCouleurObjetEclairage();
  });

  etape('initModeleOeil', () => {
    initModeleOeil();
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
        '2nde-remi':  ['synthese-additive', 'synthese-soustractive', 'couleur-objet-eclairage', 'modele-oeil'],
        '2nde-mcc':   ['synthese-additive', 'synthese-soustractive', 'couleur-objet-eclairage', 'modele-oeil'],
        '1ere-tci':   [],
        '1ere-trpm':  [],
        '1ere-mcc':   [],
        'tle-tci':    [],
        'tle-trpm':   [],
        'tle-mcc':    [],
      },
      messageId: 'tp03-message-filiere',
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
      titre: "Perception des couleurs",
      tp: 'TP03',
      sectionsSupplementaires: () => [
          sectionTableau('Tableau — Synthèse additive', 'tbody-synthese-additive'),
          sectionTableau('Tableau — Synthèse soustractive', 'tbody-synthese-soustractive'),
          sectionTableau("Tableau — Couleur d'un objet et éclairage", 'tbody-couleur-objet'),
          sectionValeurs("Manipulation — Modèle de l'œil", [
            ['Élément qui joue le rôle de lentille convergente', 'oeil-element1'],
            ["Élément qui joue le rôle d'écran", 'oeil-element2'],
            ['Vérification du schéma', 'oeil-resultat', /^(✓|✗)/],
          ]),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Synthèse additive
// =================================================================
function initSyntheseAdditive() {

  const checkRouge = $('additive-rouge');
  const checkVert = $('additive-vert');
  const checkBleu = $('additive-bleu');
  const outputPrevision = $('additive-resultat-out');

  const btnAjouter = $('additive-ajouter');
  const inputObservation = $('additive-observation');
  const tbody = $('tbody-synthese-additive');

  if (checkRouge && checkVert && checkBleu && outputPrevision) {

    function calculerPrevision() {
      outputPrevision.textContent = prevoirSyntheseAdditive(
        checkRouge.checked, checkVert.checked, checkBleu.checked
      );
    }

    [checkRouge, checkVert, checkBleu].forEach(c => c.addEventListener('change', calculerPrevision));
    calculerPrevision();
  }

  if (!btnAjouter || !tbody) return;

  btnAjouter.addEventListener('click', () => {

    const observation = (inputObservation.value || '').trim();
    if (!observation) return;

    const prevision = prevoirSyntheseAdditive(
      checkRouge?.checked, checkVert?.checked, checkBleu?.checked
    );

    ajouterLigne(tbody, [checkRouge?.checked ? '✓' : '—', checkVert?.checked ? '✓' : '—', checkBleu?.checked ? '✓' : '—', prevision, observation]);

    inputObservation.value = '';
    inputObservation.focus();
  });
}

// =================================================================
// Onglet 2 — Synthèse soustractive
// =================================================================
function initSyntheseSoustractive() {

  const btnAjouter = $('soustractive-ajouter');
  const selectFiltre1 = $('soustractive-filtre1');
  const selectFiltre2 = $('soustractive-filtre2');
  const inputObservation = $('soustractive-observation');
  const tbody = $('tbody-synthese-soustractive');

  if (!btnAjouter || !tbody) return;

  const LABELS_FILTRE = { cyan: 'Cyan', magenta: 'Magenta', jaune: 'Jaune' };

  btnAjouter.addEventListener('click', () => {

    const observation = (inputObservation.value || '').trim();
    if (!observation) return;

    const filtre1 = LABELS_FILTRE[selectFiltre1.value] || '(aucun)';
    const filtre2 = LABELS_FILTRE[selectFiltre2.value] || '(aucun)';

    ajouterLigne(tbody, [filtre1, filtre2, observation]);

    inputObservation.value = '';
    inputObservation.focus();
  });
}

// =================================================================
// Onglet 3 — Couleur d'un objet selon l'éclairage
// =================================================================
function initCouleurObjetEclairage() {

  const btnAjouter = $('objet-ajouter');
  const inputCouleurObjet = $('objet-couleur');
  const selectEclairage = $('objet-eclairage');
  const inputObservation = $('objet-observation');
  const tbody = $('tbody-couleur-objet');

  if (!btnAjouter || !tbody) return;

  const LABELS_ECLAIRAGE = { blanc: 'Blanc', rouge: 'Rouge', vert: 'Vert', bleu: 'Bleu' };

  btnAjouter.addEventListener('click', () => {

    const objet = (inputCouleurObjet.value || '').trim();
    const observation = (inputObservation.value || '').trim();

    if (!objet || !observation) return;

    ajouterLigne(tbody, [objet, LABELS_ECLAIRAGE[selectEclairage.value] || selectEclairage.value, observation]);

    inputCouleurObjet.value = '';
    inputObservation.value = '';
    inputCouleurObjet.focus();
  });
}

// =================================================================
// Onglet 4 — Modèle de l'œil : vérification du schéma
// =================================================================
function initModeleOeil() {

  const btnVerifier = $('oeil-verifier');
  const resultat = $('oeil-resultat');

  if (!btnVerifier || !resultat) return;

  btnVerifier.addEventListener('click', () => {

    const reponses = Object.keys(REPONSES_OEIL).map(id => ({
      id,
      valeur: $(id)?.value || '',
      attendu: REPONSES_OEIL[id],
    }));

    resultat.classList.remove('succes', 'erreur');

    if (reponses.some(r => !r.valeur)) {
      resultat.textContent = 'Compléter les deux éléments du schéma avant de vérifier.';
      return;
    }

    const valeurs = reponses.map(r => r.valeur);
    const doublons = new Set(valeurs).size !== valeurs.length;
    const correct = !doublons && reponses.every(r => r.valeur === r.attendu);

    if (correct) {
      afficherVerdict(resultat, '✓ Schéma correct : la cornée/le cristallin joue le rôle de lentille convergente, la rétine celui d\'écran.', 'succes');
    } else {
      afficherVerdict(resultat, '✗ Schéma incorrect : revoir le rôle de chaque élément de l\'œil.', 'erreur');
    }
  });
}

// Verdict de vérification : écrit dans un <strong> (élément enfant) avec une
// icône ✓ / ✗, l'état n'étant jamais porté par la seule couleur.
function afficherVerdict(zone, texte, etat) {
  zone.classList.remove('succes', 'erreur');
  zone.classList.add(etat);
  const fort = document.createElement('strong');
  fort.textContent = texte;
  zone.replaceChildren(fort);
}
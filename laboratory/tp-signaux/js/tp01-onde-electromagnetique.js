/**
 * tp-signaux/js/tp01-onde-electromagnetique.js
 *
 * Contrôleur du TP S01 « Caractériser une onde électromagnétique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-signaux/modules/tp01-onde-electromagnetique.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init()
 */

import { $, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, sectionTableau, nombreFr, RESULTAT_CALCULE } from './compte-rendu-signaux.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { initMateriel } from '../../js/materiel.js';
import { initZoomVisuels } from '../../js/zoom-visuel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CELERITE = 3.00e8; // m/s, vitesse de la lumière dans le vide

// Contexte professionnel par filière (clé "niveau-idFiliere") ;
// une problématique par onglet (clé = data-tab).
const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "En chaudronnerie industrielle, le suivi des pièces et des lots en production s'appuie de plus en plus sur des badges ou étiquettes RFID, lus par des ondes électromagnétiques.",
    problematiques: {
      'relation-lambda-c-f': "Comment déterminer la longueur d'onde utilisée par un badge RFID à partir de sa fréquence de fonctionnement ?",
      'domaine-spectral': "À quel domaine du spectre électromagnétique appartiennent les ondes utilisées par un badge RFID ?",
      'sources-vie-courante': "Quels objets d'un atelier de chaudronnerie émettent ou détectent des ondes électromagnétiques, et dans quels domaines du spectre ?",
    },
  },

  '1ere-trpm': {
    contexte: "En réalisation de produits mécaniques, le suivi des pièces sur la ligne de production s'appuie de plus en plus sur des badges ou étiquettes RFID, lus par des ondes électromagnétiques.",
    problematiques: {
      'relation-lambda-c-f': "Comment déterminer la longueur d'onde utilisée par un badge RFID à partir de sa fréquence de fonctionnement ?",
      'domaine-spectral': "À quel domaine du spectre électromagnétique appartiennent les ondes utilisées par un badge RFID ?",
      'sources-vie-courante': "Quels objets d'une ligne de production mécanique émettent ou détectent des ondes électromagnétiques, et dans quels domaines du spectre ?",
    },
  },

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, les postes connectés (wifi, tablettes de suivi de production) utilisent des ondes électromagnétiques pour échanger des données en temps réel.",
    problematiques: {
      'relation-lambda-c-f': "Comment déterminer la longueur d'onde d'un réseau wifi à partir de sa fréquence de fonctionnement ?",
      'domaine-spectral': "Quel domaine du spectre électromagnétique est utilisé par un réseau wifi ?",
      'sources-vie-courante': "Quels objets d'un atelier de confection connecté émettent ou détectent des ondes électromagnétiques, et dans quels domaines du spectre ?",
    },
  },

};

// Domaines du spectre électromagnétique, définis par leurs bornes en
// log10(longueur d'onde en mètres). Frontières approximatives, à
// l'échelle du Bac Pro (seule la borne du visible est une valeur de
// référence usuelle : 400 nm - 700 nm).
// Les ondes hertziennes désignent l'ensemble des ondes radioélectriques ;
// les micro-ondes (1 mm à 1 m, soit 300 MHz à 300 GHz) en sont une
// sous-catégorie. Sur la frise, le segment « Ondes hertziennes » ne montre
// donc que les ondes radio de longueur d'onde supérieure à 1 m ; `affichage`
// précise ce rattachement dans le résultat.
const DOMAINES_SPECTRE = [
  { id: 'gamma', label: 'Gamma', affichage: 'Gamma', min: -14, max: -11 },
  { id: 'x', label: 'X', affichage: 'X', min: -11, max: -8 },
  { id: 'uv', label: 'UV', affichage: 'UV', min: -8, max: Math.log10(4e-7) },
  { id: 'visible', label: 'Visible', affichage: 'Visible', min: Math.log10(4e-7), max: Math.log10(7e-7) },
  { id: 'ir', label: 'IR', affichage: 'IR', min: Math.log10(7e-7), max: -3 },
  { id: 'micro-ondes', label: 'Micro-ondes', affichage: 'Micro-ondes (sous-catégorie des ondes hertziennes)', min: -3, max: 0 },
  { id: 'hertziennes', label: 'Ondes hertziennes', affichage: 'Ondes hertziennes (hors micro-ondes)', min: 0, max: 4 },
];

const LOG_MIN = DOMAINES_SPECTRE[0].min;
const LOG_MAX = DOMAINES_SPECTRE[DOMAINES_SPECTRE.length - 1].max;

// Exécute une étape d'initialisation ; une erreur dans une étape est
// journalisée sans empêcher les suivantes de s'exécuter.
function etape(nom, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[tp-signaux] étape « ${nom} » en erreur :`, err);
  }
}

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {

  etape('initZoomVisuels', () => {
    initZoomVisuels();
  });

  etape('initRelationLambdaCF', () => {
    initRelationLambdaCF();
  });

  etape('initDomaineSpectral', () => {
    initDomaineSpectral();
  });

  etape('initSourcesVieCourante', () => {
    initSourcesVieCourante();
  });

  etape('initMateriel', () => {
    initMateriel({
      equipementId: 'materiel-equipements',
      equipment: laboratoryEquipment,
      categorie: 'Signaux',
    });
  });

  etape('initContextePro', () => {
    initContextePro({
      filieres: FILIERES_PRO,
      contextes: CONTEXTES_PRO,
      afficherProblematique: false,
    });
  });

  // Ce TP est au programme de la classe de Première (TCI, TRPM, MCC) ;
  // en Terminale, il est remplacé par le TP S02.
  etape('initOngletsParFiliere', () => {
    initOngletsParFiliere({
      mapping: {
        '1ere-tci':  ['relation-lambda-c-f', 'domaine-spectral', 'sources-vie-courante'],
        '1ere-trpm': ['relation-lambda-c-f', 'domaine-spectral', 'sources-vie-courante'],
        '1ere-mcc':  ['relation-lambda-c-f', 'domaine-spectral', 'sources-vie-courante'],
        'tle-tci':   [],
        'tle-trpm':  [],
        'tle-mcc':   [],
      },
      messageId: 'tp01-message-filiere',
      messageTexte: "Ce TP n'est pas au programme de la classe de Terminale : la caractérisation d'une onde électromagnétique est traitée en classe de Première. Poursuivre avec le TP S02 « Transmettre l'information ».",
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
      titre: 'Caractériser une onde électromagnétique',
      tp: 'TP01',
      sectionsSupplementaires: () => [
        // Les deux champs sont recopiés dans le résultat (« f = … Hz ; λ = … m »),
        // en écriture française : ils ne sont pas repris une seconde fois.
        sectionValeurs('Manipulation — Relation λ = c/f', [
          ['Fréquence et longueur d\'onde', 'onde-resultat', RESULTAT_CALCULE],
        ]),
        sectionValeurs('Manipulation — Domaine spectral', [
          ["Longueur d'onde dans le vide (m)", 'spectre-longueur-onde'],
          ['Domaine identifié', 'spectre-domaine-out'],
        ]),
        sectionTableau('Tableau — Sources et détecteurs de la vie courante', 'tbody-sources-vie-courante'),
      ],
    });
  });
}

// =================================================================
// Mise en forme des grandeurs (virgule décimale, puissances de 10)
// =================================================================
const EXPOSANTS = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

// 3 chiffres significatifs ; écriture décimale entre 10⁻² et 10⁴,
// « a × 10ⁿ » en dehors.
function ecrireGrandeur(x) {

  if (!Number.isFinite(x) || x === 0) return '0';

  const exposant = Math.floor(Math.log10(Math.abs(x)));

  if (exposant >= -2 && exposant <= 3) {
    return nombreFr(Number(x.toPrecision(3)), 5);
  }

  const mantisse = Number((x / 10 ** exposant).toPrecision(3));
  const sup = String(exposant).split('').map(c => EXPOSANTS[c]).join('');
  return `${nombreFr(mantisse, 2)} × 10${sup}`;
}

// Valeur recopiée dans un champ : 4 chiffres significatifs, sans bruit
// de calcul flottant (0.12499999999999999 → 0.125) ; notation exponentielle
// pour les ordres de grandeur extrêmes (6e+14 plutôt que 600000000000000).
function valeurChamp(x) {
  const arrondi = Number(x.toPrecision(4));
  const exposant = Math.floor(Math.log10(Math.abs(arrondi)));
  return exposant >= 6 || exposant <= -4 ? arrondi.toExponential() : String(arrondi);
}

// =================================================================
// Onglet 1 — Relation λ = c / f, conversion bidirectionnelle
// =================================================================
function initRelationLambdaCF() {

  const inputFrequence = $('onde-frequence-em');
  const inputLongueur = $('onde-longueur-em');
  const resultat = $('onde-resultat');

  if (!inputFrequence || !inputLongueur) return;

  const invite = resultat ? resultat.textContent : '';

  function afficher(f, lambda) {

    if (!resultat) return;

    if (f === null) {
      resultat.textContent = invite;
      return;
    }

    // Résultat avec élément enfant : repris par le compte rendu.
    const fort = document.createElement('strong');
    fort.textContent = `f = ${ecrireGrandeur(f)} Hz ; λ = ${ecrireGrandeur(lambda)} m`;
    resultat.replaceChildren(fort);
  }

  // Les affectations de .value ne déclenchent pas d'événement « input » :
  // aucune boucle de mise à jour croisée possible.
  inputFrequence.addEventListener('input', () => {

    const f = parseFloat(inputFrequence.value);

    if (Number.isNaN(f) || f <= 0) {
      inputLongueur.value = '';
      afficher(null);
      return;
    }

    const lambda = CELERITE / f;
    inputLongueur.value = valeurChamp(lambda);
    afficher(f, lambda);
  });

  inputLongueur.addEventListener('input', () => {

    const lambda = parseFloat(inputLongueur.value);

    if (Number.isNaN(lambda) || lambda <= 0) {
      inputFrequence.value = '';
      afficher(null);
      return;
    }

    const f = CELERITE / lambda;
    inputFrequence.value = valeurChamp(f);
    afficher(f, lambda);
  });
}

// =================================================================
// Onglet 2 — Identifier le domaine spectral à partir de λ
// =================================================================
function initDomaineSpectral() {

  const inputLongueur = $('spectre-longueur-onde');
  const outputDomaine = $('spectre-domaine-out');
  const conteneur = $('spectre-em');

  if (conteneur) {
    dessinerSpectreEm(conteneur);
  }

  if (!inputLongueur || !outputDomaine) return;

  inputLongueur.addEventListener('input', () => {

    const lambda = parseFloat(inputLongueur.value);

    if (Number.isNaN(lambda) || lambda <= 0) {
      outputDomaine.textContent = '—';
      positionnerCurseurSpectre(null);
      return;
    }

    const domaine = identifierDomaine(lambda);
    outputDomaine.textContent = domaine ? domaine.affichage : 'Hors échelle';
    positionnerCurseurSpectre(lambda);
  });
}

function identifierDomaine(lambda) {

  const logLambda = Math.log10(lambda);
  return DOMAINES_SPECTRE.find(d => logLambda >= d.min && logLambda < d.max) || null;
}

function dessinerSpectreEm(conteneur) {

  conteneur.innerHTML = '';

  const barre = document.createElement('div');
  barre.className = 'spectre-em-barre';

  DOMAINES_SPECTRE.forEach(domaine => {

    const largeur = domaine.max - domaine.min;

    const segment = document.createElement('div');
    segment.className = 'spectre-em-segment';
    segment.dataset.domaine = domaine.id;
    segment.style.flexGrow = String(largeur); // largeur calculée à l'exécution
    segment.title = domaine.label;
    segment.textContent = domaine.label;

    barre.appendChild(segment);
  });

  const curseur = document.createElement('div');
  curseur.id = 'spectre-em-curseur';
  curseur.className = 'spectre-em-curseur';
  curseur.hidden = true;

  conteneur.appendChild(barre);
  conteneur.appendChild(curseur);
}

function positionnerCurseurSpectre(lambda) {

  const curseur = $('spectre-em-curseur');
  if (!curseur) return;

  if (lambda === null || Number.isNaN(lambda) || lambda <= 0) {
    curseur.hidden = true;
    return;
  }

  const logLambda = Math.log10(lambda);
  const pourcentage = Math.min(100, Math.max(0, ((logLambda - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100));

  curseur.hidden = false;
  curseur.style.left = `${pourcentage}%`; // position calculée à l'exécution
}

// =================================================================
// Onglet 3 — Sources et détecteurs de la vie courante
// Relevé cumulatif (objet, domaine, rôle) dans un tableau
// =================================================================
function initSourcesVieCourante() {

  const btnAjouter = $('source-ajouter');
  const inputObjet = $('source-objet');
  const selectDomaine = $('source-domaine');
  const selectRole = $('source-role');
  const tbody = $('tbody-sources-vie-courante');

  if (!btnAjouter || !tbody) return;

  const LABELS_DOMAINE = Object.fromEntries(DOMAINES_SPECTRE.map(d => [d.id, d.label]));
  const LABELS_ROLE = { emetteur: 'Émetteur', detecteur: 'Détecteur', 'les-deux': 'Émetteur et détecteur' };

  // État du relevé : remis à zéro à chaque init() (le module reste en cache
  // d'une navigation à l'autre, le tableau affiché est reconstruit vide).
  const lignes = [];

  function afficherTableau() {

    tbody.innerHTML = '';

    lignes.forEach(ligne => {
      const tr = document.createElement('tr');
      [ligne.objet, LABELS_DOMAINE[ligne.domaine] || ligne.domaine, LABELS_ROLE[ligne.role] || ligne.role]
        .forEach(texte => {
          const td = document.createElement('td');
          td.textContent = texte; // texte brut : aucune injection HTML
          tr.appendChild(td);
        });
      tbody.appendChild(tr);
    });
  }

  afficherTableau();

  btnAjouter.addEventListener('click', () => {

    const objet = (inputObjet.value || '').trim();
    const domaine = selectDomaine.value;
    const role = selectRole.value;

    if (!objet || !domaine || !role) return;

    lignes.push({ objet, domaine, role });
    afficherTableau();

    inputObjet.value = '';
    selectDomaine.value = '';
    selectRole.value = '';
    inputObjet.focus();
  });
}

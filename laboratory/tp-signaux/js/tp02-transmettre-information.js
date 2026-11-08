/**
 * tp-signaux/js/tp02-transmettre-information.js
 *
 * Contrôleur du TP S02 « Transmettre l'information ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-signaux/modules/tp02-transmettre-information.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init()
 */

import { $, initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, sectionTableau, nombreFr } from './compte-rendu-signaux.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { initMateriel } from '../../../js/materiel.js';
import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

// Contexte professionnel par filière (clé "niveau-idFiliere") ;
// une problématique par onglet (clé = data-tab).
const CONTEXTES_PRO = {

  'tle-tci': {
    contexte: "En chaudronnerie industrielle, les liaisons entre automates et capteurs sur une ligne de production combinent parfois des câbles (propagation guidée) et des liaisons sans fil (propagation libre).",
    problematiques: {
      'propagation-libre-guidee': "Quel mode de propagation (libre ou guidée) choisir pour relier deux équipements d'une ligne de production, et pourquoi ?",
      'chaine-generale': "Comment identifier l'émetteur, le canal de propagation et le récepteur d'une liaison entre deux équipements d'une ligne de production ?",
      'fibre-optique': "Comment une fibre optique guide-t-elle l'information entre deux équipements éloignés d'une ligne de production ?",
    },
  },

  'tle-trpm': {
    contexte: "En réalisation de produits mécaniques, les liaisons entre automates et capteurs sur une ligne d'usinage combinent parfois des câbles (propagation guidée) et des liaisons sans fil (propagation libre).",
    problematiques: {
      'propagation-libre-guidee': "Quel mode de propagation (libre ou guidée) choisir pour relier deux équipements d'une ligne d'usinage, et pourquoi ?",
      'chaine-generale': "Comment identifier l'émetteur, le canal de propagation et le récepteur d'une liaison entre deux équipements d'une ligne d'usinage ?",
      'fibre-optique': "Comment une fibre optique guide-t-elle l'information entre deux équipements éloignés d'une ligne d'usinage ?",
    },
  },

  'tle-mcc': {
    contexte: "En Métiers de la couture et de la confection, un atelier connecté peut combiner un réseau wifi pour le suivi de production et des liaisons filaires ou par fibre optique pour les échanges de données volumineux.",
    problematiques: {
      'propagation-libre-guidee': "Parmi les systèmes d'un atelier connecté (wifi, câbles, fibre optique), lesquels utilisent la propagation libre et lesquels la propagation guidée ?",
      'chaine-generale': "Comment identifier l'émetteur, le canal de propagation et le récepteur dans les systèmes de transmission d'un atelier connecté ?",
      'fibre-optique': "Selon quel principe une fibre optique transmet-elle les données volumineuses d'un atelier connecté ?",
    },
  },

};

// Systèmes de transmission étudiés dans l'onglet « Chaîne de transmission ».
// `elements` : éléments proposés dans les trois listes (mélangés, avec des
// intrus) ; `emetteur`, `canal`, `recepteur` : réponses attendues.
const SYSTEMES_CHAINE = {
  wifi: {
    label: 'le réseau wifi',
    elements: [
      'Smartphone', 'Câble réseau (paire torsadée)', 'Air (ondes électromagnétiques)',
      'Fibre optique', 'Routeur wifi',
    ],
    emetteur: 'Routeur wifi',
    canal: 'Air (ondes électromagnétiques)',
    recepteur: 'Smartphone',
  },
  telecommande: {
    label: 'la télécommande infrarouge',
    elements: [
      'Récepteur infrarouge du téléviseur', 'Haut-parleur', 'Air (lumière infrarouge)',
      'Antenne wifi', 'Télécommande (diode infrarouge)',
    ],
    emetteur: 'Télécommande (diode infrarouge)',
    canal: 'Air (lumière infrarouge)',
    recepteur: 'Récepteur infrarouge du téléviseur',
  },
  fibre: {
    label: 'la liaison par fibre optique',
    elements: [
      'Photodétecteur', 'Air', 'Laser', 'Microphone', 'Fibre optique',
    ],
    emetteur: 'Laser',
    canal: 'Fibre optique',
    recepteur: 'Photodétecteur',
  },
};

// Les trois listes du schéma, avec le rôle attendu pour chacune.
const ROLES_CHAINE = {
  'chaine-generale-emetteur': 'emetteur',
  'chaine-generale-canal': 'canal',
  'chaine-generale-recepteur': 'recepteur',
};

// Exécute une étape d'initialisation ; une erreur dans une étape est
// journalisée sans empêcher les suivantes de s'exécuter.
function etape(nom, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[tp-signaux] étape « ${nom} » en erreur :`, err);
  }
}

// Vrai si l'élève a modifié le champ par rapport à sa valeur par défaut.
function modifie(id) {
  const champ = $(id);
  return Boolean(champ) && champ.value !== champ.defaultValue;
}

// Section « fibre optique » : n₁ et n₂ ont des valeurs par défaut ; la
// section n'est imprimée que si l'élève a saisi un angle ou modifié un indice.
function sectionFibre() {

  if (!$('fibre-angle-teste')?.value && !modifie('fibre-n1') && !modifie('fibre-n2')) return null;

  return sectionValeurs('Manipulation — Fibre optique et réflexion totale', [
    ['Indice du cœur n₁', 'fibre-n1'],
    ['Indice de la gaine n₂', 'fibre-n2'],
    ['Angle critique θc calculé', 'fibre-angle-critique'],
    ["Angle d'incidence testé sur l'interface cœur-gaine (°)", 'fibre-angle-teste'],
    ['Le rayon reste-t-il guidé ?', 'fibre-conclusion'],
  ]);
}

// Section « chaîne de transmission » : imprimée seulement si un verdict
// (✓ / ✗) est affiché, c'est-à-dire si l'élève a cliqué sur « Vérifier ».
function sectionChaine() {

  const verdict = $('chaine-generale-resultat');
  if (!/^[✓✗]/.test((verdict?.textContent || '').trim())) return null;

  return sectionValeurs('Manipulation — Chaîne de transmission', [
    ['Système étudié', 'chaine-generale-systeme'],
    ['Élément désigné comme émetteur', 'chaine-generale-emetteur'],
    ['Élément désigné comme canal de propagation', 'chaine-generale-canal'],
    ['Élément désigné comme récepteur', 'chaine-generale-recepteur'],
    ['Vérification', 'chaine-generale-resultat'],
  ]);
}

export function init() {

  etape('initZoomVisuels', () => {
    initZoomVisuels();
  });

  etape('initPropagationLibreGuidee', () => {
    initPropagationLibreGuidee();
  });

  etape('initChaineGenerale', () => {
    initChaineGenerale();
  });

  etape('initFibreOptique', () => {
    initFibreOptique();
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

  // Ce TP est au programme de la classe de Terminale (TCI, TRPM, MCC) ;
  // en Première, c'est le TP S01 qui est traité.
  etape('initOngletsParFiliere', () => {
    initOngletsParFiliere({
      mapping: {
        '1ere-tci':  [],
        '1ere-trpm': [],
        '1ere-mcc':  [],
        'tle-tci':   ['propagation-libre-guidee', 'chaine-generale', 'fibre-optique'],
        'tle-trpm':  ['propagation-libre-guidee', 'chaine-generale', 'fibre-optique'],
        'tle-mcc':   ['propagation-libre-guidee', 'chaine-generale', 'fibre-optique'],
      },
      messageId: 'tp02-message-filiere',
      messageTexte: "Ce TP n'est pas au programme de la classe de Première : la transmission d'informations par propagation libre ou guidée est traitée en classe de Terminale. Réaliser le TP S01 « Caractériser une onde électromagnétique ».",
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
      titre: "Transmettre l'information",
      tp: 'TP02',
      sectionsSupplementaires: () => {
        const sections = [
          sectionTableau('Tableau — Propagation libre ou guidée', 'tbody-propagation-type'),
          sectionChaine(),
          sectionFibre(),
        ].filter(Boolean);
        // Sans section, la capture automatique reprendrait les valeurs par
        // défaut (indices de la fibre, système étudié) comme si elles avaient
        // été saisies : on déclare explicitement qu'il n'y a rien à reprendre.
        return sections.length
          ? sections
          : [{ titre: 'Manipulations', texte: 'Aucune manipulation renseignée.' }];
      },
    });
  });
}

// =================================================================
// Onglet 1 — Propagation libre ou guidée
// Relevé cumulatif (système, type d'onde, mode de propagation)
// =================================================================
function initPropagationLibreGuidee() {

  const btnAjouter = $('propagation-ajouter');
  const inputSysteme = $('propagation-systeme');
  const selectOnde = $('propagation-type-onde');
  const selectMode = $('propagation-mode');
  const tbody = $('tbody-propagation-type');

  if (!btnAjouter || !tbody) return;

  const LABELS_ONDE = { sonore: 'Sonore', lumineuse: 'Lumineuse', electromagnetique: 'Électromagnétique' };
  const LABELS_MODE = { libre: 'Libre', guidee: 'Guidée' };

  // État du relevé : remis à zéro à chaque init() (le module reste en cache
  // d'une navigation à l'autre, le tableau affiché est reconstruit vide).
  const lignes = [];

  function afficherTableau() {

    tbody.innerHTML = '';

    lignes.forEach(ligne => {
      const tr = document.createElement('tr');
      [ligne.systeme, LABELS_ONDE[ligne.onde] || ligne.onde, LABELS_MODE[ligne.mode] || ligne.mode]
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

    const systeme = (inputSysteme.value || '').trim();
    const onde = selectOnde.value;
    const mode = selectMode.value;

    if (!systeme || !onde || !mode) return;

    lignes.push({ systeme, onde, mode });
    afficherTableau();

    inputSysteme.value = '';
    selectOnde.value = '';
    selectMode.value = '';
    inputSysteme.focus();
  });
}

// =================================================================
// Onglet 2 — Chaîne de transmission générale
// Vérification des trois select par rapport aux réponses attendues
// =================================================================
function initChaineGenerale() {

  const btnVerifier = $('chaine-generale-verifier');
  const resultat = $('chaine-generale-resultat');
  const selectSysteme = $('chaine-generale-systeme');

  if (!btnVerifier || !resultat || !selectSysteme) return;

  const invite = resultat.textContent;

  // Le résultat est écrit dans un élément enfant (<strong>) : c'est ce qui
  // le rend lisible par le compte rendu. Le texte d'invite reste du texte seul.
  function afficherVerdict(message, etat) {

    resultat.classList.remove('feedback-verification', 'succes', 'erreur');

    if (!etat) {
      resultat.textContent = message;
      return;
    }

    const fort = document.createElement('strong');
    fort.textContent = message;
    resultat.replaceChildren(fort);
    resultat.classList.add('feedback-verification', etat);
  }

  // Remplit les trois listes avec les éléments réels du système choisi.
  function remplirListes() {

    const systeme = SYSTEMES_CHAINE[selectSysteme.value];
    if (!systeme) return;

    Object.keys(ROLES_CHAINE).forEach(id => {
      const select = $(id);
      if (!select) return;

      select.length = 1; // garde « -- Choisir -- »
      select.value = '';

      systeme.elements.forEach(element => {
        const option = document.createElement('option');
        option.value = element;
        option.textContent = element;
        select.appendChild(option);
      });
    });

    afficherVerdict(invite, null);
  }

  btnVerifier.addEventListener('click', () => {

    const systeme = SYSTEMES_CHAINE[selectSysteme.value];
    if (!systeme) return;

    const reponses = Object.entries(ROLES_CHAINE).map(([id, role]) => ({
      valeur: $(id)?.value || '',
      attendu: systeme[role],
    }));

    if (reponses.some(r => !r.valeur)) {
      afficherVerdict('Compléter les trois éléments du schéma avant de vérifier.', null);
      return;
    }

    const bonnes = reponses.filter(r => r.valeur === r.attendu).length;

    if (bonnes === reponses.length) {
      afficherVerdict(
        `✓ Schéma correct pour ${systeme.label} : ${systeme.emetteur} (émetteur) → ${systeme.canal} (canal de propagation) → ${systeme.recepteur} (récepteur).`,
        'succes'
      );
    } else {
      afficherVerdict(
        `✗ Schéma incorrect pour ${systeme.label} : ${bonnes} réponse(s) correcte(s) sur 3. Revoir le rôle de chaque élément.`,
        'erreur'
      );
    }
  });

  // Changer de système recharge les listes ; modifier un choix invalide le
  // verdict affiché : le compte rendu ne reprend jamais un verdict qui ne
  // correspond plus aux réponses.
  selectSysteme.addEventListener('change', remplirListes);
  Object.keys(ROLES_CHAINE).forEach(id => {
    $(id)?.addEventListener('change', () => afficherVerdict(invite, null));
  });

  remplirListes();
}

// =================================================================
// Onglet 3 — Fibre optique et réflexion totale
// θc = arcsin(n2/n1) ; comparaison de l'angle testé à θc
// =================================================================
function initFibreOptique() {

  const inputN1 = $('fibre-n1');
  const inputN2 = $('fibre-n2');
  const outputAngleCritique = $('fibre-angle-critique');
  const inputAngleTeste = $('fibre-angle-teste');
  const outputConclusion = $('fibre-conclusion');

  if (!inputN1 || !inputN2 || !outputAngleCritique) return;

  function angleCritiqueDeg() {

    const n1 = parseFloat(inputN1.value);
    const n2 = parseFloat(inputN2.value);

    if (Number.isNaN(n1) || Number.isNaN(n2) || n1 <= 0 || n2 <= 0 || n2 >= n1) {
      return null;
    }

    const thetaCRad = Math.asin(n2 / n1);
    return thetaCRad * (180 / Math.PI);
  }

  function calculerAngleCritique() {

    const thetaC = angleCritiqueDeg();

    if (thetaC === null) {
      outputAngleCritique.textContent = '—';
    } else {
      outputAngleCritique.textContent = `${nombreFr(thetaC, 2)} °`;
    }

    calculerConclusion();
  }

  function calculerConclusion() {

    if (!inputAngleTeste || !outputConclusion) return;

    const thetaC = angleCritiqueDeg();
    const angleTeste = parseFloat(inputAngleTeste.value);

    if (thetaC === null || Number.isNaN(angleTeste)) {
      outputConclusion.textContent = '—';
      return;
    }

    const thetaCTexte = nombreFr(thetaC, 1);

    if (angleTeste >= thetaC) {
      outputConclusion.textContent = `Oui — angle ≥ θc (${thetaCTexte}°) : réflexion totale, le rayon reste guidé.`;
    } else {
      outputConclusion.textContent = `Non — angle < θc (${thetaCTexte}°) : une partie de la lumière sort par réfraction.`;
    }
  }

  inputN1.addEventListener('input', calculerAngleCritique);
  inputN2.addEventListener('input', calculerAngleCritique);
  if (inputAngleTeste) inputAngleTeste.addEventListener('input', calculerConclusion);

  calculerAngleCritique();
}
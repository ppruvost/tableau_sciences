/**
 * tp-electricite/js/tp02-transport-energie.js
 *
 * Contrôleur du TP02 « Transport de l'énergie électrique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-electricite/modules/tp02-transport-energie.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-electricite.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Un atelier de chaudronnerie est alimenté à partir du réseau basse tension du bâtiment, lui-même issu d'un poste de transformation qui abaisse la haute tension du réseau de distribution.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  '1ere-trpm': {
    contexte: "Les machines-outils d'un atelier de production mécanique sont alimentées en basse tension, obtenue après plusieurs abaissements successifs de tension depuis le réseau de transport.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  '1ere-mcc': {
    contexte: "Un atelier de confection est raccordé au réseau basse tension, issu d'un transformateur de distribution qui abaisse la tension transportée depuis les lignes à haute tension.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  'tle-tci': {
    contexte: "Un atelier de chaudronnerie est alimenté à partir du réseau basse tension du bâtiment, lui-même issu d'un poste de transformation qui abaisse la haute tension du réseau de distribution.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  'tle-trpm': {
    contexte: "Les machines-outils d'un atelier de production mécanique sont alimentées en basse tension, obtenue après plusieurs abaissements successifs de tension depuis le réseau de transport.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  'tle-mcc': {
    contexte: "Un atelier de confection est raccordé au réseau basse tension, issu d'un transformateur de distribution qui abaisse la tension transportée depuis les lignes à haute tension.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

};

const RESEAU_INFO = {
  centrale: { nom: 'Centrale de production', tension: 'quelques kV à quelques dizaines de kV' },
  tht: { nom: 'Réseau très haute tension (transport)', tension: 'de 225 kV à 400 kV' },
  ht: { nom: 'Réseau haute tension (répartition régionale)', tension: 'de 20 kV à 90 kV' },
  bt: { nom: 'Réseau basse tension (distribution finale)', tension: '230 V / 400 V' },
};

export function init() {

  initReseau();
  initEffetJoule();
  initTransformateur();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Transport',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Transporter l'énergie sous forme électrique » figure au
  // programme de 1ère pour TCI/TRPM, mais seulement de Terminale
  // pour MCC (non exigible en 1ère MCC, non repris en Tle TCI/TRPM).
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  ['reseau-distribution', 'effet-joule', 'transformateur'],
      '1ere-trpm': ['reseau-distribution', 'effet-joule', 'transformateur'],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   ['reseau-distribution', 'effet-joule', 'transformateur'],
    },
    messageId: 'tp02-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière à ce niveau. Reportez-vous au niveau où le transport de l'énergie électrique est étudié dans votre spécialité.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Transport de l'énergie électrique",
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Réseau de distribution
// =================================================================
function initReseau() {

  const select = $('reseau-select');
  const zoneInfo = $('reseau-info');

  if (!select || !zoneInfo) return;

  select.addEventListener('change', () => {

    const info = RESEAU_INFO[select.value];

    if (!info) {
      zoneInfo.textContent = 'Sélectionner une étape pour afficher l\'ordre de grandeur de tension associé.';
      return;
    }

    zoneInfo.innerHTML = `
      <strong>${info.nom}</strong><br>
      Ordre de grandeur de tension : ${info.tension}
    `;
  });
}

// =================================================================
// Onglet 2 — Simulateur interactif : effet Joule et pertes en ligne
// =================================================================
//
// Transporte une même puissance P par deux lignes de résistance R
// identique, l'une en basse tension (U1), l'autre en haute tension
// (U2). Calcule pour chacune l'intensité, la puissance perdue par
// effet Joule et la part de la puissance transportée qui est perdue,
// puis pilote une représentation visuelle de l'échauffement du câble
// (couleur + ondes de chaleur) via la variable CSS --chauffe.

function initEffetJoule() {

  const inputP  = $('joule-puissance');
  const inputR  = $('joule-resistance-simu');
  const inputU1 = $('joule-tension-bt');
  const inputU2 = $('joule-tension-ht');

  const zoneConclusion = $('joule-conclusion');

  if (!inputP || !inputR || !inputU1 || !inputU2 || !zoneConclusion) return;

  // Couleur du câble interpolée : vert (froid) → ambre → rouge (chaud).
  // t est un taux de charge thermique entre 0 et 1.
  function couleurChauffe(t) {

    const froid = [0, 135, 90];   // --vert-acide
    const tiede = [202, 111, 30]; // --ambre-fer
    const chaud = [192, 57, 43];  // --rouge-ph

    const [a, b] = t < 0.5 ? [froid, tiede] : [tiede, chaud];
    const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;

    const r = Math.round(a[0] + (b[0] - a[0]) * k);
    const g = Math.round(a[1] + (b[1] - a[1]) * k);
    const bch = Math.round(a[2] + (b[2] - a[2]) * k);

    return `rgb(${r}, ${g}, ${bch})`;
  }

  function appliquerEchauffement(filEl, t) {

    const clamped = Math.min(1, Math.max(0, t));
    const couleur = couleurChauffe(clamped);

    filEl.style.setProperty('--chauffe', clamped.toFixed(2));
    filEl.style.backgroundColor = couleur;
    filEl.style.color = couleur;
    filEl.style.boxShadow = `0 0 ${4 + 40 * clamped}px ${1 + 10 * clamped}px ${couleur}`;
  }

  function formaterPuissance(w) {
    if (w >= 1000) return `${arrondir(w / 1000, 2)} kW`;
    return `${arrondir(w, 1)} W`;
  }

  function simuler() {

    const pKw = parseFloat(inputP.value);
    const r   = parseFloat(inputR.value);
    const u1  = parseFloat(inputU1.value);      // volts
    const u2Kv = parseFloat(inputU2.value);     // kilovolts

    if ([pKw, r, u1, u2Kv].some(Number.isNaN) || u1 <= 0 || u2Kv <= 0) return;

    const pWatts = pKw * 1000;
    const u2 = u2Kv * 1000; // volts

    const i1 = pWatts / u1;
    const i2 = pWatts / u2;

    const pertes1 = r * i1 * i1;
    const pertes2 = r * i2 * i2;

    const part1 = (pertes1 / pWatts) * 100;
    const part2 = (pertes2 / pWatts) * 100;

    // Affichage des réglages
    $('joule-puissance-valeur').textContent = `${arrondir(pKw, 0)} kW`;
    $('joule-resistance-simu-valeur').textContent = `${arrondir(r, 1)} Ω`;
    $('joule-tension-bt-valeur').textContent = `${arrondir(u1, 0)} V`;
    $('joule-tension-ht-valeur').textContent = `${arrondir(u2Kv, 0)} kV`;

    $('joule-bt-tension-affiche').textContent = `${arrondir(u1, 0)} V`;
    $('joule-ht-tension-affiche').textContent = `${arrondir(u2Kv, 0)} kV`;

    // Mesures basse tension
    $('joule-bt-intensite').textContent = `${arrondir(i1, 1)} A`;
    $('joule-bt-pertes').textContent = formaterPuissance(pertes1);
    $('joule-bt-part').textContent = `${arrondir(Math.min(part1, 999), 1)} %`;

    // Mesures haute tension
    $('joule-ht-intensite').textContent = `${arrondir(i2, 2)} A`;
    $('joule-ht-pertes').textContent = formaterPuissance(pertes2);
    $('joule-ht-part').textContent = `${arrondir(part2, 3)} %`;

    // Échauffement visuel : échelle de charge thermique bornée à
    // 50 % de perte (au-delà, le câble est affiché au rouge maximal).
    appliquerEchauffement($('joule-bt-fil'), part1 / 50);
    appliquerEchauffement($('joule-ht-fil'), part2 / 50);

    // Conclusion
    if (pertes2 > 0) {

      const rapport = pertes1 / pertes2;

      zoneConclusion.innerHTML = `
        À puissance transportée égale (${formaterPuissance(pWatts)}), les pertes par
        effet Joule sont environ <strong>${arrondir(rapport, 0)} fois plus faibles</strong>
        en haute tension (${arrondir(u2Kv, 0)} kV) qu'en basse tension (${arrondir(u1, 0)} V) :
        <strong>${formaterPuissance(pertes1)}</strong> contre <strong>${formaterPuissance(pertes2)}</strong>.
        C'est pourquoi le réseau de transport fonctionne sous très haute tension.
      `;
    }
  }

  [inputP, inputR, inputU1, inputU2].forEach((input) => {
    input.addEventListener('input', simuler);
  });

  simuler();
}

// =================================================================
// Onglet 3 — Rôle du transformateur (élévateur / abaisseur)
// =================================================================
function initTransformateur() {

  const inputU1 = $('transfo-u1');
  const inputU2 = $('transfo-u2');
  const zoneResultat = $('transfo-resultat');

  if (!inputU1 || !inputU2 || !zoneResultat) return;

  function analyserTransformateur() {

    const u1 = parseFloat(inputU1.value);
    const u2 = parseFloat(inputU2.value);

    if (Number.isNaN(u1) || Number.isNaN(u2) || u1 === 0) {
      zoneResultat.textContent = 'Saisir les deux tensions mesurées pour déterminer si le transformateur est élévateur ou abaisseur.';
      return;
    }

    const rapport = u2 / u1;
    const role = rapport > 1 ? 'élévateur' : (rapport < 1 ? 'abaisseur' : 'ni élévateur ni abaisseur (rapport 1:1)');

    zoneResultat.innerHTML = `
      Rapport de transformation U₂ / U₁ = <strong>${arrondir(rapport, 2)}</strong><br>
      Ce transformateur est donc <strong>${role}</strong> de tension.
    `;
  }

  inputU1.addEventListener('input', analyserTransformateur);
  inputU2.addEventListener('input', analyserTransformateur);
}

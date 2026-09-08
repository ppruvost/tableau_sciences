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
  initTransformateurSimulateur();
  initManipTransformateurReel();
  initManipJouleReel();

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
      '1ere-tci':  ['reseau-distribution', 'effet-joule', 'transformateur', 'manipulation-reelle'],
      '1ere-trpm': ['reseau-distribution', 'effet-joule', 'transformateur', 'manipulation-reelle'],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   ['reseau-distribution', 'effet-joule', 'transformateur', 'manipulation-reelle'],
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
// Onglet 3 — Simulateur interactif : transformateur élévateur /
// abaisseur, à partir du rapport de spires N2/N1.
// =================================================================
//
// Complète (sans la remplacer) la fonction initTransformateur()
// ci-dessous, qui gère la vérification à partir des mesures réelles
// U1/U2 relevées sur le transformateur du poste de travail.

function initTransformateurSimulateur() {

  const inputU1 = $('transfo-u1-simu');
  const inputN1 = $('transfo-n1');
  const inputN2 = $('transfo-n2');

  const zoneConclusion = $('transfo-conclusion-simu');

  if (!inputU1 || !inputN1 || !inputN2 || !zoneConclusion) return;

  // Échelle logarithmique commune aux deux barres de tension, pour
  // pouvoir représenter aussi bien un fonctionnement abaisseur
  // (U2 très petit) qu'élévateur (U2 très grand) sur la même hauteur.
  const BARRE_MIN = 0.01;   // V
  const BARRE_MAX = 20000;  // V

  function hauteurBarre(v) {
    const vClamp = Math.min(BARRE_MAX, Math.max(BARRE_MIN, v));
    const t = (Math.log10(vClamp) - Math.log10(BARRE_MIN)) / (Math.log10(BARRE_MAX) - Math.log10(BARRE_MIN));
    return Math.min(100, Math.max(4, t * 100));
  }

  // Espacement (px) entre les traits de spires : plus N est grand,
  // plus les traits sont serrés. Échelle inverse (k / N) pour bien
  // distinguer les régimes, plutôt qu'une simple interpolation
  // linéaire qui aplatit les écarts sur la plage utile de N.
  function espacementSpires(n) {
    return Math.min(25, Math.max(3, 2000 / Math.max(10, n)));
  }

  function formaterTension(v) {
    if (v >= 1000) return `${arrondir(v / 1000, 2)} kV`;
    if (v < 1) return `${arrondir(v * 1000, 0)} mV`;
    return `${arrondir(v, v < 10 ? 2 : 1)} V`;
  }

  function simuler() {

    const u1 = parseFloat(inputU1.value);
    const n1 = parseFloat(inputN1.value);
    const n2 = parseFloat(inputN2.value);

    if ([u1, n1, n2].some(Number.isNaN) || n1 <= 0) return;

    const rapport = n2 / n1;
    const u2 = u1 * rapport;

    // Réglages affichés
    $('transfo-u1-simu-valeur').textContent = `${arrondir(u1, 0)} V`;
    $('transfo-n1-valeur').textContent = `${arrondir(n1, 0)} spires`;
    $('transfo-n2-valeur').textContent = `${arrondir(n2, 0)} spires`;

    // Schéma des bobines
    $('transfo-n1-affiche').textContent = `N₁ = ${arrondir(n1, 0)} spires`;
    $('transfo-n2-affiche').textContent = `N₂ = ${arrondir(n2, 0)} spires`;
    $('transfo-image-primaire').style.setProperty('--espacement', `${espacementSpires(n1)}px`);
    $('transfo-image-secondaire').style.setProperty('--espacement', `${espacementSpires(n2)}px`);

    // Barres de tension
    $('transfo-barre-u1').style.height = `${hauteurBarre(u1)}%`;
    $('transfo-barre-u2').style.height = `${hauteurBarre(u2)}%`;
    $('transfo-u1-affiche').textContent = formaterTension(u1);
    $('transfo-u2-affiche').textContent = formaterTension(u2);

    // Conclusion
    let role;
    if (rapport > 1.02) role = 'élévateur';
    else if (rapport < 0.98) role = 'abaisseur';
    else role = 'ni élévateur ni abaisseur (rapport 1:1)';

    zoneConclusion.innerHTML = `
      Rapport de transformation N₂ / N₁ = U₂ / U₁ = <strong>${arrondir(rapport, 2)}</strong>.
      Pour U₁ = ${formaterTension(u1)}, on obtient U₂ = <strong>${formaterTension(u2)}</strong> :
      ce transformateur est donc <strong>${role}</strong> de tension.
    `;
  }

  [inputU1, inputN1, inputN2].forEach((input) => {
    input.addEventListener('input', simuler);
  });

  simuler();
}

// =================================================================
// Onglet 3 — Vérification expérimentale à partir des mesures réelles
// (U1, U2 relevées au voltmètre sur le transformateur du poste de
// travail). Complète le simulateur théorique ci-dessus.
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

// =================================================================
// Onglet 4 — Manipulation réelle : vérification expérimentale du
// rôle du transformateur et de l'effet Joule avec le matériel du
// poste de travail (générateur 0-12V, transformateur, résistances,
// multimètre).
// =================================================================
//
// À ajouter dans tp02-transport-energie.js :
//   1) les deux fonctions ci-dessous
//   2) leurs appels dans init(), à côté des autres initXxx()

function initManipTransformateurReel() {

  const inputU1 = $('manip-transfo-u1');
  const inputU2 = $('manip-transfo-u2');
  const zoneResultat = $('manip-transfo-resultat');

  if (!inputU1 || !inputU2 || !zoneResultat) return;

  function analyser() {

    const u1 = parseFloat(inputU1.value);
    const u2 = parseFloat(inputU2.value);

    if (Number.isNaN(u1) || Number.isNaN(u2) || u1 === 0) {
      zoneResultat.textContent = 'Saisir les deux tensions mesurées pour vérifier si ce transformateur est élévateur ou abaisseur.';
      return;
    }

    const rapport = u2 / u1;
    const role = rapport > 1 ? 'élévateur' : (rapport < 1 ? 'abaisseur' : 'ni élévateur ni abaisseur (rapport 1:1)');

    zoneResultat.innerHTML = `
      Rapport de transformation mesuré U₂ / U₁ = <strong>${arrondir(rapport, 2)}</strong><br>
      Le transformateur utilisé est donc <strong>${role}</strong> de tension.
    `;
  }

  inputU1.addEventListener('input', analyser);
  inputU2.addEventListener('input', analyser);
}

function initManipJouleReel() {

  const inputR1 = $('manip-r1');
  const inputI1 = $('manip-i1');
  const inputR2 = $('manip-r2');
  const inputI2 = $('manip-i2');
  const selectRessenti1 = $('manip-ressenti-1');
  const selectRessenti2 = $('manip-ressenti-2');

  const zoneResultat = $('manip-joule-resultat');

  if (!inputR1 || !inputI1 || !inputR2 || !inputI2 || !zoneResultat) return;

  const LABEL_RESSENTI = {
    froid: 'froid / à peine tiède',
    tiede: 'tiède',
    chaud: 'chaud',
  };

  function analyser() {

    const r1 = parseFloat(inputR1.value);
    const i1 = parseFloat(inputI1.value);
    const r2 = parseFloat(inputR2.value);
    const i2 = parseFloat(inputI2.value);

    if ([r1, i1, r2, i2].some(Number.isNaN)) {
      zoneResultat.textContent = 'Compléter le tableau ci-dessus (résistance, intensité mesurée et échauffement ressenti pour les deux essais) pour comparer les puissances dissipées par effet Joule.';
      return;
    }

    const p1 = r1 * i1 * i1;
    const p2 = r2 * i2 * i2;

    const ressenti1 = LABEL_RESSENTI[selectRessenti1?.value] || null;
    const ressenti2 = LABEL_RESSENTI[selectRessenti2?.value] || null;

    let phraseRessenti = '';
    if (ressenti1 && ressenti2) {
      phraseRessenti = ` Cela correspond bien à un ressenti « ${ressenti1} » pour l'essai 1 et « ${ressenti2} » pour l'essai 2.`;
    }

    zoneResultat.innerHTML = `
      Essai 1 : PJ = ${arrondir(r1, 1)} × ${arrondir(i1, 2)}² = <strong>${arrondir(p1, 2)} W</strong><br>
      Essai 2 : PJ = ${arrondir(r2, 1)} × ${arrondir(i2, 2)}² = <strong>${arrondir(p2, 2)} W</strong><br>
      Plus l'intensité qui traverse une résistance est grande, plus la puissance dissipée par effet Joule augmente rapidement (au carré de l'intensité).${phraseRessenti}
    `;
  }

  [inputR1, inputI1, inputR2, inputI2].forEach((input) => {
    input.addEventListener('input', analyser);
  });
  if (selectRessenti1) selectRessenti1.addEventListener('change', analyser);
  if (selectRessenti2) selectRessenti2.addEventListener('change', analyser);
}
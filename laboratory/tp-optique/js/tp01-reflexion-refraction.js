/**
 * tp-optique/js/tp01-reflexion-refraction.js
 *
 * Contrôleur du TP01 « Réflexion et réfraction ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp01-reflexion-refraction.html dans #content.
 *
 * Convention SciLab (structure alignée sur tp-electricite, CLAUDE v4) :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP01()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu, sectionValeurs, sectionValeursSi } from './compte-rendu-optique.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { initMateriel } from '../../js/materiel.js';
import { initZoomVisuels } from '../../js/zoom-visuel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, le contrôle de surfaces polies ou réfléchissantes (pièces usinées, miroirs de guidage laser) s'appuie sur la maîtrise des lois de la réflexion et de la réfraction.",
    problematiques: {
      'loi-reflexion': "Comment vérifier que l'angle de réflexion d'un faisceau laser sur une pièce polie est égal à l'angle d'incidence ?",
      'loi-refraction': "Comment déterminer l'indice de réfraction d'un matériau transparent à partir de mesures d'angles ?",
      'angle-limite': "À partir de quel angle d'incidence un faisceau reste-t-il entièrement dans un matériau transparent, et pourquoi ce phénomène permet-il de guider la lumière ?",
    },
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains contrôles optiques (vérification de la transparence ou du brillant d'un tissu, éclairage d'un poste de travail) reposent sur la façon dont la lumière se réfléchit ou se réfracte à la surface d'un matériau.",
    problematiques: {
      'loi-reflexion': "Comment prévoir la direction dans laquelle un tissu brillant ou un miroir d'atelier renvoie la lumière ?",
      'loi-refraction': "Comment la lumière change-t-elle de direction en passant de l'air à un matériau transparent, et comment le prévoir ?",
      'angle-limite': "Dans quelles conditions la lumière est-elle totalement renvoyée à l'intérieur d'un matériau transparent (fibre optique d'éclairage, par exemple) ?",
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

  etape('initLoiReflexion', () => {
    initLoiReflexion();
  });

  etape('initLoiRefraction', () => {
    initLoiRefraction();
  });

  etape('initAngleLimite', () => {
    initAngleLimite();
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
        '2nde-remi':  ['loi-reflexion', 'loi-refraction', 'angle-limite'],
        '2nde-mcc':   ['loi-reflexion', 'loi-refraction', 'angle-limite'],
        '1ere-tci':   [],
        '1ere-trpm':  [],
        '1ere-mcc':   [],
        'tle-tci':    [],
        'tle-trpm':   [],
        'tle-mcc':    [],
      },
      messageId: 'tp01-message-filiere',
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
      titre: "Réflexion et réfraction",
      tp: 'TP01',
      sectionsSupplementaires: () => [
          sectionValeurs('Manipulation — Loi de la réflexion', [
            ["Angle d'incidence i₁ (°)", 'reflexion-i1'],
            ['Angle de réflexion mesuré i₂ (°)', 'reflexion-i2-mesure'],
            ['Écart à la loi', 'reflexion-ecart'],
          ]),
          sectionValeursSi('Manipulation — Loi de la réfraction', ['refraction-i1', 'refraction-i2-mesure'], [
            ['Indice du milieu 1 (n₁)', 'refraction-n1'],
            ["Angle d'incidence i₁ (°)", 'refraction-i1'],
            ['Indice du milieu 2 (n₂)', 'refraction-n2'],
            ['Angle de réfraction i₂ calculé', 'refraction-i2-out'],
            ['Angle de réfraction mesuré (°)', 'refraction-i2-mesure'],
            ['Indice n₂ déduit de la mesure', 'refraction-n2-calcule'],
          ]),
          sectionValeursSi('Manipulation — Angle limite et réflexion totale', ['limite-angle-teste'], [
            ['Indice du milieu incident n₁ (plexiglas)', 'limite-n1'],
            ['Indice du milieu émergent n₂ (air)', 'limite-n2'],
            ['Angle limite θ_lim calculé', 'limite-angle-out'],
            ["Angle d'incidence testé (°)", 'limite-angle-teste'],
            ['Comportement du rayon', 'limite-resultat', /^(✓|✗)/],
          ]),
      ].filter(Boolean),
    });
  });

}

// =================================================================
// Onglet 1 — Loi de la réflexion : i1 = i2
// =================================================================
function initLoiReflexion() {

  const inputI1 = $('reflexion-i1');
  const inputI2 = $('reflexion-i2-mesure');
  const outputEcart = $('reflexion-ecart');

  if (!inputI1 || !inputI2 || !outputEcart) return;

  function calculer() {

    const i1 = parseFloat(inputI1.value);
    const i2 = parseFloat(inputI2.value);

    if (Number.isNaN(i1) || Number.isNaN(i2)) {
      outputEcart.textContent = '—';
      return;
    }

    const ecart = i2 - i1;
    const signe = ecart >= 0 ? '+' : '';

    outputEcart.textContent = `${signe}${arrondir(ecart, 1)} °`;
  }

  inputI1.addEventListener('input', calculer);
  inputI2.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 — Loi de la réfraction : n1 sin(i1) = n2 sin(i2)
// =================================================================
function initLoiRefraction() {

  const inputN1 = $('refraction-n1');
  const inputI1 = $('refraction-i1');
  const inputN2 = $('refraction-n2');
  const outputI2 = $('refraction-i2-out');

  const inputI2Mesure = $('refraction-i2-mesure');
  const outputN2Calcule = $('refraction-n2-calcule');

  if (inputN1 && inputI1 && inputN2 && outputI2) {

    function calculerI2() {

      const n1 = parseFloat(inputN1.value);
      const i1 = parseFloat(inputI1.value);
      const n2 = parseFloat(inputN2.value);

      if (Number.isNaN(n1) || Number.isNaN(i1) || Number.isNaN(n2) || n2 <= 0) {
        outputI2.textContent = '—';
        return;
      }

      const sinI2 = (n1 * Math.sin(i1 * Math.PI / 180)) / n2;

      if (sinI2 > 1 || sinI2 < -1) {
        outputI2.textContent = 'Réflexion totale (pas de rayon réfracté)';
        return;
      }

      const i2 = Math.asin(sinI2) * 180 / Math.PI;
      outputI2.textContent = `${arrondir(i2, 1)} °`;
    }

    inputN1.addEventListener('input', calculerI2);
    inputI1.addEventListener('input', calculerI2);
    inputN2.addEventListener('input', calculerI2);
  }

  if (inputN1 && inputI1 && inputI2Mesure && outputN2Calcule) {

    function calculerN2() {

      const n1 = parseFloat(inputN1.value);
      const i1 = parseFloat(inputI1.value);
      const i2Mesure = parseFloat(inputI2Mesure.value);

      if (Number.isNaN(n1) || Number.isNaN(i1) || Number.isNaN(i2Mesure)) {
        outputN2Calcule.textContent = '—';
        return;
      }

      const sinI2 = Math.sin(i2Mesure * Math.PI / 180);

      if (sinI2 === 0) {
        outputN2Calcule.textContent = '—';
        return;
      }

      const n2 = (n1 * Math.sin(i1 * Math.PI / 180)) / sinI2;
      outputN2Calcule.textContent = arrondir(n2, 3);
    }

    inputN1.addEventListener('input', calculerN2);
    inputI1.addEventListener('input', calculerN2);
    inputI2Mesure.addEventListener('input', calculerN2);
  }
}

// =================================================================
// Onglet 3 — Angle limite et réflexion totale
// sin(theta_lim) = n2 / n1, condition n2 < n1
// =================================================================
function initAngleLimite() {

  const inputN1 = $('limite-n1');
  const inputN2 = $('limite-n2');
  const outputAngle = $('limite-angle-out');

  const inputAngleTeste = $('limite-angle-teste');
  const btnVerifier = $('limite-verifier');
  const resultat = $('limite-resultat');

  if (!inputN1 || !inputN2 || !outputAngle) return;

  function angleLimiteDeg() {

    const n1 = parseFloat(inputN1.value);
    const n2 = parseFloat(inputN2.value);

    if (Number.isNaN(n1) || Number.isNaN(n2) || n1 <= 0 || n2 <= 0 || n2 >= n1) {
      return null;
    }

    return Math.asin(n2 / n1) * 180 / Math.PI;
  }

  function calculerAngleLimite() {

    const thetaLim = angleLimiteDeg();

    if (thetaLim === null) {
      outputAngle.textContent = 'Non défini (n₂ doit être < n₁)';
    } else {
      outputAngle.textContent = `${arrondir(thetaLim, 2)} °`;
    }
  }

  inputN1.addEventListener('input', calculerAngleLimite);
  inputN2.addEventListener('input', calculerAngleLimite);
  calculerAngleLimite();

  if (btnVerifier && resultat && inputAngleTeste) {

    btnVerifier.addEventListener('click', () => {

      const thetaLim = angleLimiteDeg();
      const angleTeste = parseFloat(inputAngleTeste.value);

      resultat.classList.remove('succes', 'erreur');

      if (thetaLim === null || Number.isNaN(angleTeste)) {
        resultat.textContent = 'Compléter les indices et l\'angle testé avant de vérifier.';
        return;
      }

      if (angleTeste >= thetaLim) {
        afficherVerdict(resultat, `✓ angle ≥ θ_lim (${arrondir(thetaLim, 1)}°) : réflexion totale, aucun rayon ne sort dans l'air.`, 'succes');
      } else {
        afficherVerdict(resultat, `✗ angle < θ_lim (${arrondir(thetaLim, 1)}°) : pas de réflexion totale, une partie de la lumière sort par réfraction dans l'air.`, 'erreur');
      }
    });
  }
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

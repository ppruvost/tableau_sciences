/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * TD03 : Vecteurs du plan (1ère, toutes filières) et de l'espace
 * (Tle, groupement B : TRPM, TCI, MCC uniquement)
 * mathilab/tp-geometrie/js/td03-vecteurs.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-geometrie.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_TD03 = {
  '1ere-trpm': {
    contexte: "En usinage, une force de coupe ou un déplacement d'outil se modélisent par un vecteur : direction, sens et intensité.",
    problematique: "Comment représenter et calculer une force ou un déplacement à l'aide d'un vecteur ?",
  },
  '1ere-tci': {
    contexte: "En chaudronnerie, un effort de cintrage ou un déplacement de tôle se modélisent par un vecteur : direction, sens et intensité.",
    problematique: "Comment représenter et calculer un effort ou un déplacement à l'aide d'un vecteur ?",
  },
  '1ere-mcc': {
    contexte: "En confection, un déplacement d'aiguille ou une tension de fil se modélisent par un vecteur : direction, sens et intensité.",
    problematique: "Comment représenter et calculer un déplacement ou une tension à l'aide d'un vecteur ?",
  },
  '1ere-log': {
    contexte: "En logistique, un déplacement de marchandise ou un trajet se modélisent par un vecteur : direction, sens et distance.",
    problematique: "Comment représenter et calculer un déplacement ou un trajet à l'aide d'un vecteur ?",
  },
  '1ere-agora': {
    contexte: "Dans une structure administrative, un déplacement de dossier entre deux services peut se modéliser par un vecteur reliant deux positions.",
    problematique: "Comment représenter et calculer un déplacement à l'aide d'un vecteur ?",
  },
  'tle-trpm': {
    contexte: "En usinage, une force ou un déplacement d'outil dans l'espace (trois dimensions) se modélisent par un vecteur de l'espace.",
    problematique: "Comment calculer la norme et tester la colinéarité de deux forces ou déplacements dans l'espace ?",
  },
  'tle-tci': {
    contexte: "En chaudronnerie, une pièce travaillée dans les trois dimensions nécessite de modéliser des efforts ou déplacements par des vecteurs de l'espace.",
    problematique: "Comment calculer la norme et tester la colinéarité de deux efforts ou déplacements dans l'espace ?",
  },
  'tle-mcc': {
    contexte: "En confection, un gabarit ou un mouvement dans les trois dimensions peut se modéliser par des vecteurs de l'espace.",
    problematique: "Comment calculer la norme et tester la colinéarité de deux vecteurs de l'espace ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : Math.round(v * 1000) / 1000) : v;
}

/* ============================================================
   1ère — COORDONNÉES, SOMME, PRODUIT PAR UN RÉEL, NORME (PLAN)
   ============================================================ */

function calculerVecteurPlan() {
  const ax = parseFloat(document.getElementById('vp-ax').value);
  const ay = parseFloat(document.getElementById('vp-ay').value);
  const bx = parseFloat(document.getElementById('vp-bx').value);
  const by = parseFloat(document.getElementById('vp-by').value);
  const zone = document.getElementById('vp-resultat');
  if ([ax, ay, bx, by].some((v) => Number.isNaN(v))) return;

  const x = bx - ax;
  const y = by - ay;
  const norme = Math.sqrt(x * x + y * y);

  zone.innerHTML = `Vecteur AB (${formater(x)} ; ${formater(y)}) — Norme ‖AB‖ = √(${formater(x)}² + ${formater(y)}²) ≈ ${formater(norme)}`;
}

function calculerCombinaisonPlan() {
  const ux = parseFloat(document.getElementById('vp-ux').value);
  const uy = parseFloat(document.getElementById('vp-uy').value);
  const vx = parseFloat(document.getElementById('vp-vx').value);
  const vy = parseFloat(document.getElementById('vp-vy').value);
  const k = parseFloat(document.getElementById('vp-k').value);
  const zone = document.getElementById('vp-combi-resultat');
  if ([ux, uy, vx, vy, k].some((v) => Number.isNaN(v))) return;

  const sx = ux + vx;
  const sy = uy + vy;
  const kx = k * ux;
  const ky = k * uy;

  zone.innerHTML = `
    u + v = (${formater(sx)} ; ${formater(sy)})<br>
    ${k}·u = (${formater(kx)} ; ${formater(ky)})
  `;
}

function initVecteursPlan() {
  document.getElementById('vp-calculer')?.addEventListener('click', calculerVecteurPlan);
  calculerVecteurPlan();
  document.getElementById('vp-combiner')?.addEventListener('click', calculerCombinaisonPlan);
  calculerCombinaisonPlan();
}

/* ============================================================
   Tle — VECTEURS DANS L'ESPACE (groupement B)
   ============================================================ */

function calculerVecteurEspace() {
  const ax = parseFloat(document.getElementById('ve-ax').value);
  const ay = parseFloat(document.getElementById('ve-ay').value);
  const az = parseFloat(document.getElementById('ve-az').value);
  const bx = parseFloat(document.getElementById('ve-bx').value);
  const by = parseFloat(document.getElementById('ve-by').value);
  const bz = parseFloat(document.getElementById('ve-bz').value);
  const zone = document.getElementById('ve-resultat');
  if (!zone || [ax, ay, az, bx, by, bz].some((v) => Number.isNaN(v))) return;

  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  const norme = Math.sqrt(x * x + y * y + z * z);

  zone.innerHTML = `Vecteur AB (${formater(x)} ; ${formater(y)} ; ${formater(z)}) — Norme ‖AB‖ = √(${formater(x)}² + ${formater(y)}² + ${formater(z)}²) ≈ ${formater(norme)}`;
}

function testerColinearite() {
  const ux = parseFloat(document.getElementById('ve-ux').value);
  const uy = parseFloat(document.getElementById('ve-uy').value);
  const uz = parseFloat(document.getElementById('ve-uz').value);
  const vx = parseFloat(document.getElementById('ve-vx').value);
  const vy = parseFloat(document.getElementById('ve-vy').value);
  const vz = parseFloat(document.getElementById('ve-vz').value);
  const zone = document.getElementById('ve-colineaire-resultat');
  if (!zone || [ux, uy, uz, vx, vy, vz].some((v) => Number.isNaN(v))) return;

  // Colinéarité en dimension 3 : produit vectoriel nul (aux erreurs
  // d'arrondi près), plus robuste qu'une simple comparaison de rapports
  // (qui échoue dès qu'une coordonnée est nulle).
  const px = uy * vz - uz * vy;
  const py = uz * vx - ux * vz;
  const pz = ux * vy - uy * vx;
  const normeProduit = Math.sqrt(px * px + py * py + pz * pz);

  if (normeProduit < 0.01) {
    zone.innerHTML = `Produit vectoriel u ∧ v = (${formater(px)} ; ${formater(py)} ; ${formater(pz)}) ≈ (0 ; 0 ; 0) → <strong>u et v sont colinéaires</strong>.`;
  } else {
    zone.innerHTML = `Produit vectoriel u ∧ v = (${formater(px)} ; ${formater(py)} ; ${formater(pz)}) ≠ (0 ; 0 ; 0) → <strong>u et v ne sont pas colinéaires</strong>.`;
  }
}

function initVecteursEspace() {
  document.getElementById('ve-calculer')?.addEventListener('click', calculerVecteurEspace);
  calculerVecteurEspace();
  document.getElementById('ve-colineaire')?.addEventListener('click', testerColinearite);
  testerColinearite();
}

/* ============================================================
   FILTRAGE DES ONGLETS SELON LA FILIÈRE (groupement B uniquement
   pour l'onglet "Vecteurs dans l'espace", niveau Tle)
   ============================================================ */

function filtrerOngletsParFiliere() {
  const select = document.getElementById('select-filiere-pro');
  const zoneMessage = document.getElementById('td03-message-filiere');
  if (!select) return;

  function idFiliere(valeurSelect) {
    // Le sélecteur peut renvoyer soit l'id brut de la filière (ex.
    // "mcc"), soit une valeur préfixée par le niveau (ex. "tle-mcc") :
    // on prend systématiquement le dernier segment.
    return (valeurSelect || '').split('-').pop();
  }

  function appliquerFiltre() {
    const filiere = idFiliere(select.value);
    let premierVisible = null;
    let unOngletCache = false;

    document.querySelectorAll('.tabs-header .tab-btn').forEach((bouton) => {
      const restriction = bouton.dataset.filieres;
      const visible = !restriction || !filiere || restriction.split(',').includes(filiere);

      bouton.style.display = visible ? '' : 'none';

      const panneau = document.getElementById(bouton.dataset.tab);
      if (!visible) {
        unOngletCache = true;
        if (panneau) panneau.classList.remove('actif');
        bouton.classList.remove('actif');
      } else if (!premierVisible) {
        premierVisible = bouton;
      }
    });

    // Si l'onglet actif vient d'être masqué, activer le premier onglet
    // encore visible.
    const activeVisible = document.querySelector('.tabs-header .tab-btn.actif');
    if (!activeVisible && premierVisible) {
      premierVisible.classList.add('actif');
      const panneau = document.getElementById(premierVisible.dataset.tab);
      if (panneau) panneau.classList.add('actif');
    }

    if (zoneMessage) {
      if (unOngletCache && filiere) {
        zoneMessage.style.display = 'block';
        zoneMessage.textContent = "L'onglet « Vecteurs dans l'espace » (Terminale) est réservé au groupement B (TRPM, TCI, MCC) : il n'apparaît pas pour votre filière.";
      } else {
        zoneMessage.style.display = 'none';
      }
    }
  }

  select.addEventListener('change', appliquerFiltre);
  appliquerFiltre();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

function initialiserTD03() {
  initOngletsParFiliere();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_TD03
  });

  initVecteursPlan();
  initVecteursEspace();
  filtrerOngletsParFiliere();

  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Vecteurs du plan et de l\'espace',
    tp: 'TD03'
  });
}

initialiserTD03();

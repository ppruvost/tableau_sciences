/**
 * MATHILAB — STATISTIQUE ET PROBABILITÉS
 * TD S05 : Tableau croisé, conditionnement et arbre pondéré (1ère / Tle)
 * mathilab/tp-statistiques/js/td05-tableau-croise-arbre-pondere.js
 */

import { initZoomVisuels } from '../../../js/zoom-visuel.js';
import { initSections, initTabs, initModesOperatoires } from '../../../js/utils.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { garantirMenuFiliere } from './filiere-select.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';
import { demarrerPuzzle } from '../../../js/puzzle-onglet.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initNavigationTP } from './nav-tp.js';
import { S5 as MODELE_PUZZLE } from './puzzle-statistiques.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — une problématique par onglet
   1ère : onglet « tableau croisé » ; Tle : + onglet « arbre pondéré ».
   ============================================================ */

const DONNEES_FILIERES = {
  tci: {
    ctx1ere: "Un contrôle qualité croise souvent le poste de chaudronnerie et la conformité de la pièce produite.",
    tableau: "La conformité d'une pièce dépend-elle du poste qui l'a produite ?",
    ctxTle: "Deux contrôles successifs sur une même chaîne de production peuvent être représentés par un arbre pondéré.",
    arbre: "Les résultats de deux contrôles successifs sont-ils indépendants ?"
  },
  trpm: {
    ctx1ere: "Un contrôle qualité croise souvent l'outillage utilisé et la conformité du produit mécanique réalisé.",
    tableau: "La conformité d'une pièce dépend-elle de l'outillage utilisé pour la réaliser ?",
    ctxTle: "Deux contrôles successifs sur un outillage en maintenance peuvent être représentés par un arbre pondéré.",
    arbre: "Les résultats de deux contrôles successifs sur un outillage sont-ils indépendants ?"
  },
  mcc: {
    ctx1ere: "Un contrôle qualité croise souvent l'atelier de confection et la présence d'un défaut sur la pièce.",
    tableau: "Le taux de non-conformité dépend-il de l'atelier de confection ?",
    ctxTle: "Deux contrôles qualité successifs en confection peuvent être représentés par un arbre pondéré.",
    arbre: "Les résultats de deux contrôles qualité successifs sont-ils indépendants ?"
  },
  agora: {
    ctx1ere: "Un suivi administratif croise souvent le service émetteur et le respect du délai de traitement d'un dossier.",
    tableau: "Le respect du délai dépend-il du service qui traite le dossier ?",
    ctxTle: "Deux étapes successives de traitement d'un dossier peuvent être représentées par un arbre pondéré.",
    arbre: "Les résultats de deux étapes de traitement successives sont-ils indépendants ?"
  },
  log: {
    ctx1ere: "Un suivi logistique croise souvent la zone de livraison et le respect du délai annoncé.",
    tableau: "Le taux de retard dépend-il de la zone de livraison ?",
    ctxTle: "Deux étapes successives d'un parcours logistique peuvent être représentées par un arbre pondéré.",
    arbre: "Les résultats de deux étapes logistiques successives sont-ils indépendants ?"
  }
};

const CONTEXTES_PRO = {};
Object.entries(DONNEES_FILIERES).forEach(([filiere, d]) => {
  CONTEXTES_PRO[`1ere-${filiere}`] = {
    contexte: d.ctx1ere,
    problematiques: { 'tableau-croise': d.tableau }
  };
  CONTEXTES_PRO[`tle-${filiere}`] = {
    contexte: d.ctxTle,
    problematiques: { 'tableau-croise': d.tableau, 'arbre-pondere': d.arbre }
  };
});

/* ============================================================
   ONGLET 1 — TABLEAU CROISÉ
   ============================================================ */

function initTableauCroise() {
  document.getElementById('tc-calculer')?.addEventListener('click', () => {
    const lire = id => parseInt(document.getElementById(id).value, 10) || 0;
    const nAB = lire('tc-nab');
    const nABbarre = lire('tc-nabbarre');
    const nAbarreB = lire('tc-nabarreb');
    const nAbarreBbarre = lire('tc-nabarrebbarre');

    const total = nAB + nABbarre + nAbarreB + nAbarreBbarre;
    const tbody = document.getElementById('tc-tbody-resultats');
    if (total === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Renseigner au moins un effectif non nul.</td></tr>';
      return;
    }

    const nA = nAB + nABbarre;
    const nB = nAB + nAbarreB;

    const pA = nA / total;
    const pB = nB / total;
    const pAinterB = nAB / total;
    const pAB = nA ? nAB / nA : null; // P_A(B)

    const lignes = [
      ['P(A)', pA], ['P(B)', pB], ['P(A ∩ B)', pAinterB],
      ['P(A ∪ B)', pA + pB - pAinterB],
      ['P_A(B) (sachant A)', pAB],
    ];
    tbody.innerHTML = lignes
      .map(([l, v]) => `<tr><td>${l}</td><td>${v === null ? '—' : v.toFixed(3)}</td></tr>`).join('');
  });
}

/* ============================================================
   ONGLET 2 (Tle) — ARBRE PONDÉRÉ
   ============================================================ */

function initArbrePondere() {
  document.getElementById('ap-construire')?.addEventListener('click', () => {
    const pA = (parseFloat(document.getElementById('ap-pa').value) || 0) / 100;
    const pAB = (parseFloat(document.getElementById('ap-pab').value) || 0) / 100;
    const pAbarreB = (parseFloat(document.getElementById('ap-pabarreb').value) || 0) / 100;
    const pAbarre = 1 - pA;

    const chemins = [
      ['A', 'B', pA * pAB],
      ['A', 'B̄', pA * (1 - pAB)],
      ['Ā', 'B', pAbarre * pAbarreB],
      ['Ā', 'B̄', pAbarre * (1 - pAbarreB)],
    ];
    document.getElementById('ap-tbody').innerHTML = chemins
      .map(([a, b, p]) => `<tr><td>${a}</td><td>${b}</td><td>${a} puis ${b}</td><td>${p.toFixed(4)}</td></tr>`).join('');

    const pB = pA * pAB + pAbarre * pAbarreB;
    document.getElementById('ap-pb-resultat').textContent =
      `P(B) = P(A∩B) + P(Ā∩B) = ${pB.toFixed(4)}`;

    const independants = Math.abs(pAB - pAbarreB) < 0.005;
    document.getElementById('ap-independance-resultat').textContent = independants
      ? 'P_A(B) ≈ P_Ā(B) : A et B semblent indépendants.'
      : 'P_A(B) ≠ P_Ā(B) : A et B ne semblent pas indépendants.';
  });
}

/* ============================================================
   FILTRAGE DES ONGLETS PAR NIVEAU (onglet Tle)
   ============================================================ */

function afficher(element, visible) {
  if (!element) return;
  element.hidden = !visible;
  element.style.display = visible ? '' : 'none';
}

// Valeur du menu : <niveau>-<filière> (1ere-trpm, tle-mcc) → premier segment
function idNiveau() {
  const valeur = document.getElementById('select-filiere-pro')?.value || '';
  return valeur.split('-')[0];
}

function filtrerOngletsParNiveau() {
  const estTle = idNiveau() === 'tle';

  document.querySelectorAll('.tabs-container [data-niveau="tle"]').forEach(el => afficher(el, estTle));

  const actif = document.querySelector('.tabs-header .tab-btn.actif');
  if (actif && actif.hidden) {
    [...document.querySelectorAll('.tabs-header .tab-btn')].find(b => !b.hidden)?.click();
  }

  const message = document.getElementById('td05-message-filiere');
  if (message) {
    message.textContent = estTle
      ? "Onglet « Arbre pondéré et indépendance » disponible pour le niveau Terminale."
      : "Sélectionner votre filière ci-dessus : l'onglet « Arbre pondéré et indépendance » n'apparaît qu'au niveau Terminale.";
  }
}

function initFiltrageNiveau() {
  const select = document.getElementById('select-filiere-pro');
  if (select && select.dataset.td05Lie !== '1') {
    select.dataset.td05Lie = '1';
    select.addEventListener('change', filtrerOngletsParNiveau);
  }
  filtrerOngletsParNiveau();
}

/* ============================================================
   INITIALISATION (appelée par navigation.js après chargement du fragment)
   ============================================================ */

function etape(nom, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[tp-statistiques] étape « ${nom} » en erreur :`, err);
  }
}

export function init() {

  etape('zoom', () => initZoomVisuels());
  etape('onglet 1 : tableau croisé', initTableauCroise);
  etape('onglet 2 : arbre pondéré', initArbrePondere);
  etape('contexte pro', () => initContextePro({
    afficherProblematique: false,
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO
  }));
  etape('menu filière', () => garantirMenuFiliere(CONTEXTES_PRO));
  etape('puzzle', () => demarrerPuzzle(MODELE_PUZZLE));
  etape('onglets par filière', () => initOngletsParFiliere());
  etape('filtrage des onglets par niveau', initFiltrageNiveau);
  etape('sections', () => initSections());
  etape('onglets', () => initTabs());
  etape('modes opératoires', () => initModesOperatoires());
  etape('radar', () => initRadarCompetences());
  etape('questions par onglet', () => initQuestionsParOnglet());
  etape('navigation TD', () => initNavigationTP());
  etape('impression', () => initImpressionCompteRendu({
    titre: 'Tableau croisé, conditionnement et arbre pondéré',
    tp: 'TD05'
  }));
}

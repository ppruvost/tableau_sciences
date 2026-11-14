/**
 * MATHILAB — STATISTIQUE ET PROBABILITÉS
 * TD S01 : Organiser et représenter une série statistique
 * mathilab/tp-statistiques/js/td01-organiser-une-serie-statistique.js
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
import { S1 as MODELE_PUZZLE } from './puzzle-statistiques.js';
import {
  regrouperEnClasses,
  classeModale,
  dessinerDiagrammeBarres,
  dessinerDiagrammeSecteurs
} from '../../js/statistiques.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — une problématique par onglet
   ============================================================ */

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte:
      "Dans un atelier de maintenance industrielle, plusieurs mesures " +
      "peuvent être relevées sur une machine : niveau sonore, température, " +
      "durée d'utilisation ou nombre de pièces produites. Ces données doivent " +
      "être organisées afin de faciliter leur lecture.",
    problematiques: {
      'regrouper-classes':
        "Comment regrouper en classes les mesures relevées sur une machine pour repérer rapidement les valeurs les plus fréquentes ?",
      'representer-qualitative':
        "Comment représenter les types de pannes ou d'arrêts d'une machine pour identifier la cause la plus fréquente ?",
      'representer-chronologique':
        "Comment représenter l'évolution d'une mesure de machine dans le temps pour détecter une dérive ?"
    }
  },

  '2nde-mcc': {
    contexte:
      "Dans un atelier de confection, le contrôle qualité permet de relever " +
      "des informations sur les pièces fabriquées : temps de montage, " +
      "catégories de défauts ou nombre de pièces conformes.",
    problematiques: {
      'regrouper-classes':
        "Comment regrouper en classes les temps de montage des pièces pour repérer la durée la plus courante ?",
      'representer-qualitative':
        "Comment représenter les catégories de défauts relevées au contrôle qualité pour identifier le défaut le plus fréquent ?",
      'representer-chronologique':
        "Comment représenter l'évolution du nombre de pièces conformes d'un jour à l'autre pour suivre la qualité de production ?"
    }
  },

  '2nde-gatl': {
    contexte:
      "Dans le domaine du transport et de la logistique, les entreprises " +
      "suivent les délais de livraison, les volumes transportés et les " +
      "différents types d'incidents rencontrés.",
    problematiques: {
      'regrouper-classes':
        "Comment regrouper en classes les délais de livraison pour repérer les délais les plus courants ?",
      'representer-qualitative':
        "Comment représenter les types d'incidents de transport pour identifier le plus fréquent ?",
      'representer-chronologique':
        "Comment représenter l'évolution des volumes transportés semaine après semaine pour anticiper les périodes chargées ?"
    }
  }
};

/* ============================================================
   OUTILS
   ============================================================ */

function lireNombre(champ) {
  if (!champ) return null;
  const valeur = parseFloat(champ.value);
  return Number.isFinite(valeur) ? valeur : null;
}

function afficherMessage(message) {
  const zone = document.getElementById('td01-message-saisie');
  if (!zone) return;
  zone.textContent = message;
  zone.hidden = false;
}

function effacerMessage() {
  const zone = document.getElementById('td01-message-saisie');
  if (!zone) return;
  zone.textContent = '';
  zone.hidden = true;
}

function echapperHTML(valeur) {
  return String(valeur)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formaterNombre(valeur) {
  if (!Number.isFinite(valeur)) return '';
  if (Number.isInteger(valeur)) return String(valeur);
  return valeur.toFixed(2).replace('.', ',');
}

/* ============================================================
   ONGLET 1 — REGROUPER UNE SÉRIE EN CLASSES
   ============================================================ */

const serieQuantitative = [];

function actualiserRegroupement() {

  const tbodyValeurs = document.getElementById('rc-tbody-valeurs');
  const tbodyClasses = document.getElementById('rc-tbody-classes');
  const zoneHistogramme = document.getElementById('rc-histogramme');
  const zoneModale = document.getElementById('rc-resultat');
  const champNombreClasses = document.getElementById('rc-nb-classes');

  /* Tableau des valeurs */
  if (tbodyValeurs) {
    tbodyValeurs.innerHTML = serieQuantitative.length === 0
      ? '<tr><td colspan="2">Aucune valeur saisie.</td></tr>'
      : serieQuantitative
          .map((valeur, index) =>
            '<tr><td>' + (index + 1) + '</td><td>' + formaterNombre(valeur) + '</td></tr>')
          .join('');
  }

  /* Pas assez de valeurs */
  if (serieQuantitative.length < 2) {
    if (tbodyClasses) tbodyClasses.innerHTML = '<tr><td colspan="2">Saisir au moins deux valeurs.</td></tr>';
    if (zoneHistogramme) zoneHistogramme.innerHTML = '<p class="info">Le diagramme apparaîtra après la saisie d’au moins deux valeurs.</p>';
    if (zoneModale) zoneModale.textContent = '';
    return;
  }

  /* Nombre de classes */
  let nombreClasses = parseInt(champNombreClasses?.value, 10);
  if (!Number.isInteger(nombreClasses)) nombreClasses = 5;
  nombreClasses = Math.max(2, Math.min(10, nombreClasses));
  if (champNombreClasses) champNombreClasses.value = nombreClasses;

  /* Regroupement */
  let classes;
  try {
    classes = regrouperEnClasses(serieQuantitative, nombreClasses);
  } catch (erreur) {
    console.error('[tp-statistiques] erreur de regroupement :', erreur);
    if (tbodyClasses) tbodyClasses.innerHTML = '<tr><td colspan="2">Impossible de regrouper cette série.</td></tr>';
    return;
  }

  if (!Array.isArray(classes) || classes.length === 0) {
    if (tbodyClasses) tbodyClasses.innerHTML = '<tr><td colspan="2">Aucune classe disponible.</td></tr>';
    return;
  }

  /* Tableau classes / effectifs */
  if (tbodyClasses) {
    tbodyClasses.innerHTML = classes
      .map(classe => {
        const libelle = classe.libelle ?? classe.classe ?? classe.nom ?? '';
        const effectif = classe.effectif ?? classe.n ?? classe.nombre ?? 0;
        return '<tr><td>' + echapperHTML(libelle) + '</td><td>' + effectif + '</td></tr>';
      })
      .join('');
  }

  /* Diagramme en colonnes */
  if (zoneHistogramme) {
    zoneHistogramme.innerHTML = '';
    try {
      dessinerDiagrammeBarres('rc-histogramme', classes, {
        titre: 'Répartition des mesures',
        axeX: 'Classes',
        axeY: 'Effectif'
      });
    } catch (erreur) {
      console.error('[tp-statistiques] erreur du diagramme :', erreur);
      zoneHistogramme.innerHTML = '<p class="info">Le diagramme ne peut pas être affiché.</p>';
    }
  }

  /* Classe modale */
  if (zoneModale) {
    try {
      const modale = classeModale(classes);
      if (modale) {
        const libelle = modale.libelle ?? modale.classe ?? modale.nom ?? String(modale);
        zoneModale.textContent = 'Classe modale : ' + libelle;
      } else {
        zoneModale.textContent = 'Aucune classe modale.';
      }
    } catch (erreur) {
      console.error('[tp-statistiques] erreur classe modale :', erreur);
      zoneModale.textContent = '';
    }
  }
}

function initRegroupementClasses() {

  const bouton = document.getElementById('rc-ajouter');
  const champValeur = document.getElementById('rc-valeur');
  const champClasses = document.getElementById('rc-nb-classes');

  function ajouterValeur() {
    const valeur = lireNombre(champValeur);
    if (valeur === null) {
      afficherMessage('Saisir une valeur numérique.');
      champValeur?.focus();
      return;
    }
    effacerMessage();
    serieQuantitative.push(valeur);
    champValeur.value = '';
    champValeur.focus();
    actualiserRegroupement();
  }

  if (bouton && bouton.dataset.lie !== '1') {
    bouton.dataset.lie = '1';
    bouton.addEventListener('click', ajouterValeur);
    champValeur?.addEventListener('keydown', evenement => {
      if (evenement.key === 'Enter') { evenement.preventDefault(); ajouterValeur(); }
    });
    champClasses?.addEventListener('change', actualiserRegroupement);
  }

  actualiserRegroupement();
}

/* ============================================================
   ONGLET 2 — SÉRIE QUALITATIVE
   ============================================================ */

const serieQualitative = [];

function actualiserSerieQualitative() {

  const tbody = document.getElementById('ql-tbody');
  const zoneBarres = document.getElementById('ql-barres');
  const zoneSecteurs = document.getElementById('ql-secteurs');

  if (tbody) {
    tbody.innerHTML = serieQualitative.length === 0
      ? '<tr><td colspan="2">Aucune catégorie saisie.</td></tr>'
      : serieQualitative
          .map(donnee => '<tr><td>' + echapperHTML(donnee.categorie) + '</td><td>' + donnee.effectif + '</td></tr>')
          .join('');
  }

  if (serieQualitative.length === 0) {
    if (zoneBarres) zoneBarres.innerHTML = '<p class="info">Ajouter des catégories pour afficher le diagramme.</p>';
    if (zoneSecteurs) zoneSecteurs.innerHTML = '<p class="info">Ajouter des catégories pour afficher le diagramme.</p>';
    return;
  }

  if (zoneBarres) {
    zoneBarres.innerHTML = '';
    try {
      dessinerDiagrammeBarres('ql-barres', serieQualitative, {
        titre: 'Répartition des catégories',
        axeX: 'Catégories',
        axeY: 'Effectifs'
      });
    } catch (erreur) {
      console.error('[tp-statistiques] erreur diagramme en bâtons :', erreur);
      zoneBarres.innerHTML = '<p class="info">Le diagramme en bâtons ne peut pas être affiché.</p>';
    }
  }

  if (zoneSecteurs) {
    zoneSecteurs.innerHTML = '';
    try {
      dessinerDiagrammeSecteurs('ql-secteurs', serieQualitative, { titre: 'Répartition des catégories' });
    } catch (erreur) {
      console.error('[tp-statistiques] erreur diagramme en secteurs :', erreur);
      zoneSecteurs.innerHTML = '<p class="info">Le diagramme en secteurs ne peut pas être affiché.</p>';
    }
  }
}

function initSerieQualitative() {

  const bouton = document.getElementById('ql-ajouter');
  const champCategorie = document.getElementById('ql-categorie');
  const champEffectif = document.getElementById('ql-effectif');

  function ajouterCategorie() {
    const categorie = champCategorie?.value.trim();
    const effectif = lireNombre(champEffectif);

    if (!categorie) {
      afficherMessage('Saisir le nom de la catégorie.');
      champCategorie?.focus();
      return;
    }
    if (effectif === null || effectif < 0 || !Number.isInteger(effectif)) {
      afficherMessage('Saisir un effectif entier positif ou nul.');
      champEffectif?.focus();
      return;
    }
    effacerMessage();

    const existante = serieQualitative.find(
      donnee => donnee.categorie.toLowerCase() === categorie.toLowerCase()
    );
    if (existante) existante.effectif += effectif;
    else serieQualitative.push({ categorie, effectif });

    champCategorie.value = '';
    champEffectif.value = '';
    champCategorie.focus();
    actualiserSerieQualitative();
  }

  if (bouton && bouton.dataset.lie !== '1') {
    bouton.dataset.lie = '1';
    bouton.addEventListener('click', ajouterCategorie);
    champEffectif?.addEventListener('keydown', evenement => {
      if (evenement.key === 'Enter') { evenement.preventDefault(); ajouterCategorie(); }
    });
  }

  actualiserSerieQualitative();
}

/* ============================================================
   ONGLET 3 — ÉVOLUTION CHRONOLOGIQUE (lignes brisées)
   ============================================================ */

const serieChronologique = [];

function dessinerLignesBrisees() {

  const conteneur = document.getElementById('lb-graphique');
  if (!conteneur) return;

  if (serieChronologique.length === 0) {
    conteneur.innerHTML = '<p class="info">Ajouter des points pour afficher l’évolution.</p>';
    return;
  }

  const donnees = [...serieChronologique].sort((a, b) => a.periode - b.periode);

  const largeur = 800, hauteur = 420;
  const margeGauche = 70, margeDroite = 30, margeHaut = 40, margeBas = 70;

  const periodes = donnees.map(point => point.periode);
  const valeurs = donnees.map(point => point.valeur);

  let minimumX = Math.min(...periodes), maximumX = Math.max(...periodes);
  let minimumY = Math.min(...valeurs), maximumY = Math.max(...valeurs);

  if (minimumX === maximumX) { minimumX -= 1; maximumX += 1; }
  if (minimumY === maximumY) { minimumY -= 1; maximumY += 1; }

  const largeurGraphique = largeur - margeGauche - margeDroite;
  const hauteurGraphique = hauteur - margeHaut - margeBas;

  const x = valeur => margeGauche + ((valeur - minimumX) / (maximumX - minimumX)) * largeurGraphique;
  const y = valeur => hauteur - margeBas - ((valeur - minimumY) / (maximumY - minimumY)) * hauteurGraphique;

  const points = donnees.map(point => `${x(point.periode)},${y(point.valeur)}`).join(' ');

  const cercles = donnees
    .map(point => `<circle cx="${x(point.periode)}" cy="${y(point.valeur)}" r="5" class="point-chronologique"></circle>`)
    .join('');

  const etiquettes = donnees
    .map(point =>
      `<text x="${x(point.periode)}" y="${hauteur - 35}" text-anchor="middle" class="etiquette-chronologique">` +
      echapperHTML(point.periode) + '</text>')
    .join('');

  conteneur.innerHTML =
    '<svg viewBox="0 0 800 420" width="100%" role="img" aria-label="Diagramme à lignes brisées">' +
      `<line x1="${margeGauche}" y1="${margeHaut}" x2="${margeGauche}" y2="${hauteur - margeBas}" class="axe-graphique"></line>` +
      `<line x1="${margeGauche}" y1="${hauteur - margeBas}" x2="${largeur - margeDroite}" y2="${hauteur - margeBas}" class="axe-graphique"></line>` +
      `<polyline points="${points}" fill="none" class="ligne-chronologique"></polyline>` +
      cercles + etiquettes +
      `<text x="${largeur / 2}" y="25" text-anchor="middle" class="titre-graphique">Évolution de la grandeur mesurée</text>` +
      `<text x="${largeur / 2}" y="${hauteur - 8}" text-anchor="middle">Période</text>` +
    '</svg>';
}

function initEvolutionChronologique() {

  const bouton = document.getElementById('lb-ajouter');
  const champPeriode = document.getElementById('lb-periode');
  const champValeur = document.getElementById('lb-valeur');

  function ajouterPoint() {
    const periode = lireNombre(champPeriode);
    const valeur = lireNombre(champValeur);

    if (periode === null) { afficherMessage('Saisir une période.'); champPeriode?.focus(); return; }
    if (valeur === null) { afficherMessage('Saisir une valeur.'); champValeur?.focus(); return; }
    effacerMessage();

    const existant = serieChronologique.find(point => point.periode === periode);
    if (existant) existant.valeur = valeur;
    else serieChronologique.push({ periode, valeur });

    champPeriode.value = '';
    champValeur.value = '';
    champPeriode.focus();
    dessinerLignesBrisees();
  }

  if (bouton && bouton.dataset.lie !== '1') {
    bouton.dataset.lie = '1';
    bouton.addEventListener('click', ajouterPoint);
    champValeur?.addEventListener('keydown', evenement => {
      if (evenement.key === 'Enter') { evenement.preventDefault(); ajouterPoint(); }
    });
  }

  dessinerLignesBrisees();
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

  // Les séries sont réinitialisées à chaque chargement du fragment
  serieQuantitative.length = 0;
  serieQualitative.length = 0;
  serieChronologique.length = 0;

  etape('zoom', () => initZoomVisuels());
  etape('onglet 1 : regroupement en classes', initRegroupementClasses);
  etape('onglet 2 : série qualitative', initSerieQualitative);
  etape('onglet 3 : évolution chronologique', initEvolutionChronologique);
  etape('contexte pro', () => initContextePro({
    afficherProblematique: false,
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO
  }));
  etape('menu filière', () => garantirMenuFiliere(CONTEXTES_PRO));
  etape('puzzle', () => demarrerPuzzle(MODELE_PUZZLE));
  etape('onglets par filière', () => initOngletsParFiliere());
  etape('sections', () => initSections());
  etape('onglets', () => initTabs());
  etape('modes opératoires', () => initModesOperatoires());
  etape('radar', () => initRadarCompetences());
  etape('questions par onglet', () => initQuestionsParOnglet());
  etape('navigation TD', () => initNavigationTP());
  etape('impression', () => initImpressionCompteRendu({
    titre: 'Organiser et représenter une série statistique',
    tp: 'TD01'
  }));
}

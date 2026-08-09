/**
 * ============================================================
 * MATHILAB — STATISTIQUES
 * TP S1 : Organiser et représenter une série statistique
 * mathilab/tp-statistiques/js/tp01-organiser-une-serie-statistique.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';

import {
  initContextePro
} from '../../js/contexte-pro.js';

import {
  regrouperEnClasses,
  classeModale,
  dessinerDiagrammeBarres,
  dessinerDiagrammeSecteurs
} from '../../js/statistiques.js';

import {
  initRadarCompetences
} from '../../js/radar.js';

import {
  initImpressionCompteRendu
} from './compte-rendu-statistiques.js';

import {
  initOngletsParFiliere
} from '../../js/onglets-filiere.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — S1
   ============================================================ */

const CONTEXTES_S1 = {

  '2nde-remi': {
    contexte:
      "Dans un atelier de maintenance industrielle, plusieurs mesures " +
      "peuvent être relevées sur une machine : niveau sonore, température, " +
      "durée d'utilisation ou nombre de pièces produites. Ces données doivent " +
      "être organisées afin de faciliter leur lecture.",
    problematique:
      "Comment organiser et représenter les mesures réalisées sur une machine " +
      "afin d'en extraire rapidement des informations utiles ?"
  },

  '2nde-mcc': {
    contexte:
      "Dans un atelier de confection, le contrôle qualité permet de relever " +
      "des informations sur les pièces fabriquées : temps de montage, " +
      "catégories de défauts ou nombre de pièces conformes.",
    problematique:
      "Comment organiser les données d'un contrôle qualité et choisir une " +
      "représentation permettant d'identifier rapidement les résultats importants ?"
  },

  '2nde-gatl': {
    contexte:
      "Dans le domaine du transport et de la logistique, les entreprises " +
      "suivent les délais de livraison, les volumes transportés et les " +
      "différents types d'incidents rencontrés.",
    problematique:
      "Comment organiser et représenter les données de transport afin de " +
      "faciliter leur analyse et leur exploitation ?"
  }

};

/* ============================================================
   OUTILS
   ============================================================ */

function lireNombre(champ) {
  if (!champ) {
    return null;
  }
  const valeur = parseFloat(champ.value);
  return Number.isFinite(valeur) ? valeur : null;
}

function afficherMessage(message) {
  const zone = document.getElementById('s01-message-filiere');
  if (!zone) {
    return;
  }
  zone.textContent = message;
  zone.style.display = 'block';
}

function effacerMessage() {
  const zone = document.getElementById('s01-message-filiere');
  if (!zone) {
    return;
  }
  zone.textContent = '';
  zone.style.display = 'none';
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
  if (!Number.isFinite(valeur)) {
    return '';
  }
  if (Number.isInteger(valeur)) {
    return String(valeur);
  }
  return valeur.toFixed(2).replace('.', ',');
}

/* ============================================================
   ONGLET 1
   REGROUPER UNE SÉRIE EN CLASSES
   ============================================================ */

const serieQuantitative = [];

function actualiserRegroupement() {

  const tbodyValeurs = document.getElementById('rc-tbody-valeurs');
  const tbodyClasses = document.getElementById('rc-tbody-classes');
  const zoneHistogramme = document.getElementById('rc-histogramme');
  const zoneModale = document.getElementById('rc-classe-modale');
  const champNombreClasses = document.getElementById('rc-nb-classes');

  /* TABLEAU DES VALEURS */
  if (tbodyValeurs) {
    if (serieQuantitative.length === 0) {
      tbodyValeurs.innerHTML =
        '<tr><td colspan="2">Aucune valeur saisie.</td></tr>';
    } else {
      tbodyValeurs.innerHTML = serieQuantitative
        .map((valeur, index) =>
          '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + formaterNombre(valeur) + '</td>' +
          '</tr>'
        )
        .join('');
    }
  }

  /* PAS ASSEZ DE VALEURS */
  if (serieQuantitative.length < 2) {
    if (tbodyClasses) {
      tbodyClasses.innerHTML =
        '<tr><td colspan="2">Saisir au moins deux valeurs.</td></tr>';
    }
    if (zoneHistogramme) {
      zoneHistogramme.innerHTML =
        '<p class="info">Le diagramme apparaîtra après la saisie d’au moins deux valeurs.</p>';
    }
    if (zoneModale) {
      zoneModale.innerHTML = '';
    }
    return;
  }

  /* NOMBRE DE CLASSES */
  let nombreClasses = parseInt(champNombreClasses?.value, 10);
  if (!Number.isInteger(nombreClasses)) {
    nombreClasses = 5;
  }
  nombreClasses = Math.max(2, Math.min(10, nombreClasses));
  if (champNombreClasses) {
    champNombreClasses.value = nombreClasses;
  }

  /* REGROUPEMENT */
  let classes;
  try {
    classes = regrouperEnClasses(serieQuantitative, nombreClasses);
  } catch (erreur) {
    console.error('Erreur de regroupement :', erreur);
    if (tbodyClasses) {
      tbodyClasses.innerHTML =
        '<tr><td colspan="2">Impossible de regrouper cette série.</td></tr>';
    }
    return;
  }

  if (!Array.isArray(classes) || classes.length === 0) {
    if (tbodyClasses) {
      tbodyClasses.innerHTML =
        '<tr><td colspan="2">Aucune classe disponible.</td></tr>';
    }
    return;
  }

  /* TABLEAU CLASSES / EFFECTIFS */
  if (tbodyClasses) {
    tbodyClasses.innerHTML = classes
      .map(classe => {
        const libelle = classe.libelle ?? classe.classe ?? classe.nom ?? '';
        const effectif = classe.effectif ?? classe.n ?? classe.nombre ?? 0;
        return (
          '<tr>' +
            '<td>' + echapperHTML(libelle) + '</td>' +
            '<td>' + effectif + '</td>' +
          '</tr>'
        );
      })
      .join('');
  }

  /* DIAGRAMME EN COLONNES */
  if (zoneHistogramme) {
    zoneHistogramme.innerHTML = '';
    try {
      dessinerDiagrammeBarres('rc-histogramme', classes, {
        titre: 'Répartition des mesures',
        axeX: 'Classes',
        axeY: 'Effectif'
      });
    } catch (erreur) {
      console.error('Erreur du diagramme :', erreur);
      zoneHistogramme.innerHTML =
        '<p class="info">Le diagramme ne peut pas être affiché.</p>';
    }
  }

  /* CLASSE MODALE */
  if (zoneModale) {
    try {
      const modale = classeModale(classes);
      if (modale) {
        const libelle = modale.libelle ?? modale.classe ?? modale.nom ?? String(modale);
        zoneModale.innerHTML =
          '<strong>Classe modale : </strong>' + echapperHTML(libelle);
      } else {
        zoneModale.innerHTML = 'Aucune classe modale.';
      }
    } catch (erreur) {
      console.error('Erreur classe modale :', erreur);
      zoneModale.innerHTML = '';
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

  bouton?.addEventListener('click', ajouterValeur);

  champValeur?.addEventListener('keydown', evenement => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouterValeur();
    }
  });

  champClasses?.addEventListener('change', actualiserRegroupement);

  actualiserRegroupement();
}

/* ============================================================
   ONGLET 2
   SÉRIE QUALITATIVE
   ============================================================ */

const serieQualitative = [];

function actualiserSerieQualitative() {

  const tbody = document.getElementById('ql-tbody');
  const zoneBarres = document.getElementById('ql-barres');
  const zoneSecteurs = document.getElementById('ql-secteurs');

  /* TABLEAU */
  if (tbody) {
    if (serieQualitative.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Aucune catégorie saisie.</td></tr>';
    } else {
      tbody.innerHTML = serieQualitative
        .map(donnee =>
          '<tr>' +
            '<td>' + echapperHTML(donnee.categorie) + '</td>' +
            '<td>' + donnee.effectif + '</td>' +
          '</tr>'
        )
        .join('');
    }
  }

  /* AUCUNE DONNÉE */
  if (serieQualitative.length === 0) {
    if (zoneBarres) {
      zoneBarres.innerHTML =
        '<p class="info">Ajouter des catégories pour afficher le diagramme.</p>';
    }
    if (zoneSecteurs) {
      zoneSecteurs.innerHTML =
        '<p class="info">Ajouter des catégories pour afficher le diagramme.</p>';
    }
    return;
  }

  /* DIAGRAMME EN BÂTONS */
  if (zoneBarres) {
    zoneBarres.innerHTML = '';
    try {
      dessinerDiagrammeBarres('ql-barres', serieQualitative, {
        titre: 'Répartition des catégories',
        axeX: 'Catégories',
        axeY: 'Effectifs'
      });
    } catch (erreur) {
      console.error('Erreur diagramme en bâtons :', erreur);
      zoneBarres.innerHTML =
        '<p class="info">Le diagramme en bâtons ne peut pas être affiché.</p>';
    }
  }

  /* DIAGRAMME EN SECTEURS */
  if (zoneSecteurs) {
    zoneSecteurs.innerHTML = '';
    try {
      dessinerDiagrammeSecteurs('ql-secteurs', serieQualitative, {
        titre: 'Répartition des catégories'
      });
    } catch (erreur) {
      console.error('Erreur diagramme en secteurs :', erreur);
      zoneSecteurs.innerHTML =
        '<p class="info">Le diagramme en secteurs ne peut pas être affiché.</p>';
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

    const categorieExistante = serieQualitative.find(
      donnee => donnee.categorie.toLowerCase() === categorie.toLowerCase()
    );

    if (categorieExistante) {
      categorieExistante.effectif += effectif;
    } else {
      serieQualitative.push({ categorie, effectif });
    }

    champCategorie.value = '';
    champEffectif.value = '';
    champCategorie.focus();

    actualiserSerieQualitative();
  }

  bouton?.addEventListener('click', ajouterCategorie);

  champEffectif?.addEventListener('keydown', evenement => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouterCategorie();
    }
  });

  actualiserSerieQualitative();
}

/* ============================================================
   ONGLET 3
   ÉVOLUTION CHRONOLOGIQUE
   ============================================================ */

const serieChronologique = [];

function dessinerLignesBrisees() {

  const conteneur = document.getElementById('lb-graphique');
  if (!conteneur) {
    return;
  }

  if (serieChronologique.length === 0) {
    conteneur.innerHTML =
      '<p class="info">Ajouter des points pour afficher l’évolution.</p>';
    return;
  }

  const donnees = [...serieChronologique].sort((a, b) => a.periode - b.periode);

  const largeur = 800;
  const hauteur = 420;
  const margeGauche = 70;
  const margeDroite = 30;
  const margeHaut = 40;
  const margeBas = 70;

  const periodes = donnees.map(point => point.periode);
  const valeurs = donnees.map(point => point.valeur);

  let minimumX = Math.min(...periodes);
  let maximumX = Math.max(...periodes);
  let minimumY = Math.min(...valeurs);
  let maximumY = Math.max(...valeurs);

  if (minimumX === maximumX) {
    minimumX -= 1;
    maximumX += 1;
  }
  if (minimumY === maximumY) {
    minimumY -= 1;
    maximumY += 1;
  }

  const largeurGraphique = largeur - margeGauche - margeDroite;
  const hauteurGraphique = hauteur - margeHaut - margeBas;

  const x = valeur =>
    margeGauche + ((valeur - minimumX) / (maximumX - minimumX)) * largeurGraphique;

  const y = valeur =>
    hauteur - margeBas - ((valeur - minimumY) / (maximumY - minimumY)) * hauteurGraphique;

  const points = donnees
    .map(point => `${x(point.periode)},${y(point.valeur)}`)
    .join(' ');

  const cercles = donnees
    .map(point =>
      '<circle ' +
        `cx="${x(point.periode)}" ` +
        `cy="${y(point.valeur)}" ` +
        'r="5" ' +
        'class="point-chronologique"' +
      '></circle>'
    )
    .join('');

  const etiquettes = donnees
    .map(point =>
      '<text ' +
        `x="${x(point.periode)}" ` +
        `y="${hauteur - 35}" ` +
        'text-anchor="middle" ' +
        'class="etiquette-chronologique"' +
      '>' +
        echapperHTML(point.periode) +
      '</text>'
    )
    .join('');

  conteneur.innerHTML =
    '<svg ' +
      'viewBox="0 0 800 420" ' +
      'width="100%" ' +
      'role="img" ' +
      'aria-label="Diagramme à lignes brisées"' +
    '>' +
      '<line ' +
        `x1="${margeGauche}" ` +
        `y1="${margeHaut}" ` +
        `x2="${margeGauche}" ` +
        `y2="${hauteur - margeBas}" ` +
        'class="axe-graphique"' +
      '></line>' +
      '<line ' +
        `x1="${margeGauche}" ` +
        `y1="${hauteur - margeBas}" ` +
        `x2="${largeur - margeDroite}" ` +
        `y2="${hauteur - margeBas}" ` +
        'class="axe-graphique"' +
      '></line>' +
      '<polyline ' +
        `points="${points}" ` +
        'fill="none" ' +
        'class="ligne-chronologique"' +
      '></polyline>' +
      cercles +
      etiquettes +
      '<text ' +
        `x="${largeur / 2}" ` +
        'y="25" ' +
        'text-anchor="middle" ' +
        'class="titre-graphique"' +
      '>' +
        'Évolution de la grandeur mesurée' +
      '</text>' +
      '<text ' +
        `x="${largeur / 2}" ` +
        `y="${hauteur - 8}" ` +
        'text-anchor="middle"' +
      '>' +
        'Période' +
      '</text>' +
    '</svg>';
}

function initEvolutionChronologique() {

  const bouton = document.getElementById('lb-ajouter');
  const champPeriode = document.getElementById('lb-periode');
  const champValeur = document.getElementById('lb-valeur');

  function ajouterPoint() {
    const periode = lireNombre(champPeriode);
    const valeur = lireNombre(champValeur);

    if (periode === null) {
      afficherMessage('Saisir une période.');
      champPeriode?.focus();
      return;
    }

    if (valeur === null) {
      afficherMessage('Saisir une valeur.');
      champValeur?.focus();
      return;
    }

    effacerMessage();

    const pointExistant = serieChronologique.find(point => point.periode === periode);

    if (pointExistant) {
      pointExistant.valeur = valeur;
    } else {
      serieChronologique.push({ periode, valeur });
    }

    champPeriode.value = '';
    champValeur.value = '';
    champPeriode.focus();

    dessinerLignesBrisees();
  }

  bouton?.addEventListener('click', ajouterPoint);

  champValeur?.addEventListener('keydown', evenement => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouterPoint();
    }
  });

  dessinerLignesBrisees();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

function initialiserTP01() {

  initOngletsParFiliere();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_S1
  });

  initRegroupementClasses();
  initSerieQualitative();
  initEvolutionChronologique();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Organiser et représenter une série statistique',
    tp: 'S1'
  });
}

/* ============================================================
   DÉMARRAGE
   ============================================================ */

initialiserTP01();

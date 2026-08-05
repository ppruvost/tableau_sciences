/**
 * tp-statistiques/js/tp01-organiser-une-serie-statistique.js
 */
import { initContextePro } from '../../js/contexte-pro.js';
import {
  regrouperEnClasses,
  classeModale,
  dessinerDiagrammeBarres,
  dessinerDiagrammeSecteurs,
} from '../../js/statistiques.js';
import { initRadarCompetences } from './radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import FILIERES_PRO from '../../data/filieres.js';

/* ============================================================
   CONTEXTE PROFESSIONNEL (menu déroulant)
   ============================================================ */

const CONTEXTES_S1 = {
  '2nde-remi': {
    contexte: "En atelier REMI, chaque pièce usinée est mesurée (cote, diamètre, épaisseur). Ces mesures répétées forment une série statistique qu'il faut savoir organiser avant de l'interpréter.",
    problematique: "Comment regrouper une série de cotes mesurées en atelier pour en tirer une lecture claire de la qualité de production ?",
  },
  '2nde-mcc': {
    contexte: "En atelier de confection, un contrôle qualité relève un défaut (ou son absence) sur chaque pièce cousue : c'est une série qualitative, différente d'une série de mesures chiffrées.",
    problematique: "Comment représenter les résultats d'un contrôle qualité en confection pour identifier le défaut le plus fréquent ?",
  },
  '2nde-gatl': {
    contexte: "En logistique, les délais de livraison et les volumes traités jour après jour forment des séries statistiques, quantitatives ou chronologiques selon ce qu'on étudie.",
    problematique: "Comment organiser une série de délais de livraison pour évaluer la régularité d'un transporteur ?",
  },
};

/* ============================================================
   ONGLET 1 — REGROUPER UNE SÉRIE EN CLASSES
   ============================================================ */

const valeursClasses = [];

function rendreTableauValeurs(tbodyId, valeurs) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = valeurs
    .map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`)
    .join('') || '<tr><td colspan="2">Aucune valeur saisie.</td></tr>';
}

function actualiserRegroupementClasses() {
  rendreTableauValeurs('rc-tbody-valeurs', valeursClasses);

  const nbClasses = parseInt(document.getElementById('rc-nb-classes')?.value, 10) || 5;
  const classesModaleDiv = document.getElementById('rc-classe-modale');
  const tbodyClasses = document.getElementById('rc-tbody-classes');

  if (valeursClasses.length < 2) {
    if (tbodyClasses) tbodyClasses.innerHTML = '<tr><td colspan="2">Saisir au moins 2 valeurs.</td></tr>';
    if (classesModaleDiv) classesModaleDiv.textContent = '';
    document.getElementById('rc-histogramme').innerHTML = '';
    return;
  }

  const classes = regrouperEnClasses(valeursClasses, nbClasses);

  if (tbodyClasses) {
    tbodyClasses.innerHTML = classes
      .map(c => `<tr><td>[${c.debut.toFixed(1)} ; ${c.fin.toFixed(1)}[</td><td>${c.effectif}</td></tr>`)
      .join('');
  }

  dessinerDiagrammeBarres(
    'rc-histogramme',
    classes.map(c => ({ label: `[${c.debut.toFixed(1)};${c.fin.toFixed(1)}[`, effectif: c.effectif })),
    { yLabel: 'Effectif' }
  );

  const modale = classeModale(classes);
  if (classesModaleDiv && modale) {
    classesModaleDiv.textContent = `Classe modale : [${modale.debut.toFixed(1)} ; ${modale.fin.toFixed(1)}[ (effectif ${modale.effectif})`;
  }
}

function initRegroupementClasses() {
  const btn = document.getElementById('rc-ajouter');
  const champValeur = document.getElementById('rc-valeur');
  const champNbClasses = document.getElementById('rc-nb-classes');
  if (!btn || !champValeur) return;

  btn.addEventListener('click', () => {
    const v = parseFloat(champValeur.value);
    if (Number.isNaN(v)) return;
    valeursClasses.push(v);
    champValeur.value = '';
    champValeur.focus();
    actualiserRegroupementClasses();
  });

  champValeur.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  champNbClasses?.addEventListener('change', actualiserRegroupementClasses);

  actualiserRegroupementClasses();
}

/* ============================================================
   ONGLET 2 — SÉRIE QUALITATIVE
   ============================================================ */

const categoriesQualitatives = [];

function actualiserSerieQualitative() {
  const tbody = document.getElementById('ql-tbody');
  if (tbody) {
    tbody.innerHTML = categoriesQualitatives
      .map(c => `<tr><td>${c.label}</td><td>${c.effectif}</td></tr>`)
      .join('') || '<tr><td colspan="2">Aucune catégorie saisie.</td></tr>';
  }
  dessinerDiagrammeBarres('ql-barres', categoriesQualitatives, { yLabel: 'Effectif' });
  dessinerDiagrammeSecteurs('ql-secteurs', categoriesQualitatives);
}

function initSerieQualitative() {
  const btn = document.getElementById('ql-ajouter');
  const champCategorie = document.getElementById('ql-categorie');
  const champEffectif = document.getElementById('ql-effectif');
  if (!btn || !champCategorie || !champEffectif) return;

  btn.addEventListener('click', () => {
    const label = champCategorie.value.trim();
    const effectif = parseInt(champEffectif.value, 10);
    if (!label || Number.isNaN(effectif)) return;
    categoriesQualitatives.push({ label, effectif });
    champCategorie.value = '';
    champEffectif.value = '';
    champCategorie.focus();
    actualiserSerieQualitative();
  });

  actualiserSerieQualitative();
}

/* ============================================================
   ONGLET 3 — SÉRIE CHRONOLOGIQUE (LIGNES BRISÉES)
   ============================================================ */

const pointsChronologiques = [];

function dessinerLignesBrisees(conteneurId, points) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  if (points.length < 2) {
    conteneur.innerHTML = '<p class="info">Ajouter au moins 2 points pour tracer le graphique.</p>';
    return;
  }

  const tries = [...points].sort((a, b) => a.periode - b.periode);
  const largeur = 480, hauteur = 240;
  const marge = { haut: 16, bas: 30, gauche: 44, droite: 16 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;

  const xMin = tries[0].periode, xMax = tries[tries.length - 1].periode;
  const yMin = Math.min(...tries.map(p => p.valeur));
  const yMax = Math.max(...tries.map(p => p.valeur));
  const etendueX = (xMax - xMin) || 1;
  const etendueY = (yMax - yMin) || 1;

  const x = p => marge.gauche + ((p - xMin) / etendueX) * largeurUtile;
  const y = v => marge.haut + hauteurUtile - ((v - yMin) / etendueY) * hauteurUtile;

  const pointsSvg = tries.map(p => `${x(p.periode).toFixed(1)},${y(p.valeur).toFixed(1)}`).join(' ');
  const marqueurs = tries.map(p => `<circle class="diagramme-barre" cx="${x(p.periode).toFixed(1)}" cy="${y(p.valeur).toFixed(1)}" r="3.5"></circle>`).join('');

  conteneur.innerHTML = `
    <svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      <polyline points="${pointsSvg}" fill="none" stroke="var(--domaine-accent)" stroke-width="2" />
      ${marqueurs}
    </svg>`;
}

function initSerieChronologique() {
  const btn = document.getElementById('lb-ajouter');
  const champPeriode = document.getElementById('lb-periode');
  const champValeur = document.getElementById('lb-valeur');
  if (!btn || !champPeriode || !champValeur) return;

  btn.addEventListener('click', () => {
    const periode = parseFloat(champPeriode.value);
    const valeur = parseFloat(champValeur.value);
    if (Number.isNaN(periode) || Number.isNaN(valeur)) return;
    pointsChronologiques.push({ periode, valeur });
    champPeriode.value = '';
    champValeur.value = '';
    champPeriode.focus();
    dessinerLignesBrisees('lb-graphique', pointsChronologiques);
  });

  dessinerLignesBrisees('lb-graphique', pointsChronologiques);
}

/* ============================================================
   INITIALISATION GÉNÉRALE DU TP
   ============================================================ */

initContextePro({
  filieres: FILIERES_PRO,
  contextes: CONTEXTES_S1,
});

initRegroupementClasses();
initSerieQualitative();
initSerieChronologique();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Organiser et représenter une série statistique", tp: 'S1' });

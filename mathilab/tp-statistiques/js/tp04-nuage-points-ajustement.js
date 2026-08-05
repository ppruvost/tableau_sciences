import { initContextePro, getFiliereSelectionnee } from '../../js/contexte-pro.js';
import { initRadarCompetences } from './radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import FILIERES_PRO from '../../data/filieres.js';

const CONTEXTES_S4 = {
  '1ere-tci': { contexte: "L'épaisseur d'une tôle et le temps de découpe nécessaire sont deux grandeurs liées par le processus de chaudronnerie.", problematique: "Comment prévoir le temps de découpe d'une épaisseur non encore testée ?" },
  'tle-tci': { contexte: "Certaines relations d'usure d'outil ne sont pas linéaires en fonction de la vitesse de coupe.", problematique: "Quel modèle choisir lorsque la relation entre deux grandeurs n'est pas affine ?" },
  '1ere-trpm': { contexte: "La vitesse de coupe et la durée de vie d'un outillage sont deux grandeurs liées lors de la réalisation d'un produit mécanique.", problematique: "Comment estimer la durée de vie d'un outillage pour une vitesse de coupe non testée ?" },
  'tle-trpm': { contexte: "Certaines relations d'usure d'outillage (durée de vie selon la vitesse) ne sont pas linéaires.", problematique: "Quel modèle non affine choisir pour ajuster la durée de vie d'un outillage ?" },
  '1ere-mcc': { contexte: "La taille d'une cliente et la quantité de tissu nécessaire à une robe varient ensemble de façon à peu près proportionnelle.", problematique: "Comment estimer la quantité de tissu nécessaire pour une taille non mesurée ?" },
  'tle-mcc': { contexte: "Certaines relations de production (temps de finition selon la complexité d'un modèle) ne sont pas linéaires.", problematique: "Quel modèle non affine choisir pour ajuster un nuage de points en confection ?" },
  '1ere-agora': { contexte: "Le nombre de dossiers traités et le temps de traitement associé sont deux grandeurs liées dans un service administratif.", problematique: "Comment estimer le temps de traitement d'un volume de dossiers inhabituel ?" },
  'tle-agora': { contexte: "Certaines évolutions administratives (délai de traitement selon la charge) ne sont pas strictement linéaires.", problematique: "Quel modèle non affine choisir pour ajuster un délai de traitement administratif ?" },
  '1ere-log': { contexte: "Le nombre de colis d'une commande et le temps de préparation associé sont deux grandeurs liées en entrepôt.", problematique: "Comment estimer le temps de préparation d'une commande de taille inhabituelle ?" },
  'tle-log': { contexte: "Certaines évolutions logistiques (délai selon la distance) ne sont pas strictement linéaires.", problematique: "Quel modèle non affine choisir pour ajuster une évolution logistique ?" },
};

/* ---------- Régression linéaire (moindres carrés) ---------- */
function regressionLineaire(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const syy = points.reduce((s, p) => s + p.y * p.y, 0);

  const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const b = (sy - a * sx) / n;

  const moyY = sy / n;
  const ssTot = points.reduce((s, p) => s + (p.y - moyY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (a * p.x + b)) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { a, b, r2 };
}

function dessinerNuage(conteneurId, points, regression) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;
  if (points.length < 3) {
    conteneur.innerHTML = '<p class="info">Saisir au moins 3 points pour tracer le nuage.</p>';
    return;
  }
  const largeur = 480, hauteur = 260;
  const marge = { haut: 16, bas: 30, gauche: 44, droite: 16 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;

  const xMin = Math.min(...points.map(p => p.x)), xMax = Math.max(...points.map(p => p.x));
  const yMin = Math.min(...points.map(p => p.y)), yMax = Math.max(...points.map(p => p.y));
  const etX = (xMax - xMin) || 1, etY = (yMax - yMin) || 1;

  const x = v => marge.gauche + ((v - xMin) / etX) * largeurUtile;
  const y = v => marge.haut + hauteurUtile - ((v - yMin) / etY) * hauteurUtile;

  const pointsSvg = points.map(p => `<circle cx="${x(p.x).toFixed(1)}" cy="${y(p.y).toFixed(1)}" r="3.5" class="diagramme-barre" />`).join('');

  let droite = '';
  if (regression) {
    const y1 = regression.a * xMin + regression.b;
    const y2 = regression.a * xMax + regression.b;
    droite = `<line x1="${x(xMin).toFixed(1)}" y1="${y(y1).toFixed(1)}" x2="${x(xMax).toFixed(1)}" y2="${y(y2).toFixed(1)}" stroke="var(--domaine-accent)" stroke-width="2" />`;
  }

  conteneur.innerHTML = `
    <svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      ${droite}
      ${pointsSvg}
    </svg>`;
}

/* ---------- Onglet 1 : nuage + ajustement affine ---------- */
const pointsAffine = [];
let regressionCourante = null;

function actualiserNuageAffine() {
  document.getElementById('na-tbody').innerHTML = pointsAffine
    .map((p, i) => `<tr><td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td></tr>`).join('');

  const equationDiv = document.getElementById('na-equation');
  if (pointsAffine.length < 3) {
    equationDiv.textContent = '';
    regressionCourante = null;
    dessinerNuage('na-nuage', pointsAffine, null);
    return;
  }
  regressionCourante = regressionLineaire(pointsAffine);
  equationDiv.textContent = `y = ${regressionCourante.a.toFixed(3)} x + ${regressionCourante.b.toFixed(3)}   —   R² = ${regressionCourante.r2.toFixed(3)}`;
  dessinerNuage('na-nuage', pointsAffine, regressionCourante);
}

function initNuageAffine() {
  document.getElementById('na-ajouter')?.addEventListener('click', () => {
    const x = parseFloat(document.getElementById('na-x').value);
    const y = parseFloat(document.getElementById('na-y').value);
    if (Number.isNaN(x) || Number.isNaN(y)) return;
    pointsAffine.push({ x, y });
    document.getElementById('na-x').value = '';
    document.getElementById('na-y').value = '';
    actualiserNuageAffine();
  });
  actualiserNuageAffine();
}

/* ---------- Onglet 2 : interpoler / extrapoler ---------- */
function initInterpolerExtrapoler() {
  document.getElementById('ie-estimer')?.addEventListener('click', () => {
    const div = document.getElementById('ie-resultat');
    if (!regressionCourante) {
      div.textContent = "Construire d'abord l'ajustement dans l'onglet précédent (au moins 3 points).";
      return;
    }
    const x = parseFloat(document.getElementById('ie-x').value);
    if (Number.isNaN(x)) return;
    const y = regressionCourante.a * x + regressionCourante.b;
    const xs = pointsAffine.map(p => p.x);
    const type = (x >= Math.min(...xs) && x <= Math.max(...xs)) ? 'interpolation' : 'extrapolation';
    div.textContent = `Pour x = ${x} : y ≈ ${y.toFixed(2)} (${type})`;
  });
}

/* ---------- Onglet 3 : ajustement non affine (Tle) — z = log10(y) ---------- */
const pointsNonAffine = [];

function actualiserNonAffine() {
  document.getElementById('na2-tbody').innerHTML = pointsNonAffine
    .map((p, i) => `<tr><td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td><td>${Math.log10(p.y).toFixed(3)}</td></tr>`).join('');

  const equationDiv = document.getElementById('na2-equation');
  if (pointsNonAffine.length < 3) { equationDiv.textContent = ''; document.getElementById('na2-nuage').innerHTML = ''; return; }

  const pointsZ = pointsNonAffine.map(p => ({ x: p.x, y: Math.log10(p.y) }));
  const reg = regressionLineaire(pointsZ);
  const K = reg.b, A = reg.a;
  equationDiv.textContent = `z = ${A.toFixed(3)} x + ${K.toFixed(3)}  →  y ≈ 10^${K.toFixed(3)} × 10^(${A.toFixed(3)} x)   —   R² (sur x,z) = ${reg.r2.toFixed(3)}`;
  dessinerNuage('na2-nuage', pointsZ, reg);
}

function initNonAffine() {
  document.getElementById('na2-ajouter')?.addEventListener('click', () => {
    const x = parseFloat(document.getElementById('na2-x').value);
    const y = parseFloat(document.getElementById('na2-y').value);
    if (Number.isNaN(x) || Number.isNaN(y) || y <= 0) return;
    pointsNonAffine.push({ x, y });
    document.getElementById('na2-x').value = '';
    document.getElementById('na2-y').value = '';
    actualiserNonAffine();
  });
  actualiserNonAffine();
}

/* ---------- Affichage de l'onglet Tle selon le niveau choisi ---------- */
function gererNiveauAffiche() {
  const filiere = getFiliereSelectionnee();
  const estTle = filiere?.niveau === 'Tle';
  document.querySelectorAll('[data-niveau="tle"]').forEach(el => {
    el.style.display = estTle ? '' : 'none';
  });
  const message = document.getElementById('s04-message-niveau');
  if (message) {
    message.textContent = estTle
      ? "Onglet « Ajustement non affine » disponible pour le niveau Terminale."
      : "Sélectionner votre filière ci-dessus : l'onglet « Ajustement non affine » n'apparaît qu'au niveau Terminale.";
  }
}

document.getElementById('select-filiere-pro')?.addEventListener('change', gererNiveauAffiche);

initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_S4 });
initNuageAffine();
initInterpolerExtrapoler();
initNonAffine();
gererNiveauAffiche();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Nuage de points et ajustement", tp: 'S4' });

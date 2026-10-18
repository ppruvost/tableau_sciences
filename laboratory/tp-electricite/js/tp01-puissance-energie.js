/**
 * tp-electricite/js/tp01-puissance-energie.js
 *
 * Contrôleur du TP01 « Puissance et énergie électrique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-electricite/modules/tp01-puissance-energie.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-electricite.js';
import { initQuestionsParOnglet } from './questions-par-onglet.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Avant de mettre sous tension un poste à souder ou un touret à meuler, il faut connaître la puissance appelée par l'appareil afin de vérifier la compatibilité avec l'installation électrique de l'atelier.",
    problematiques: {
      'mesure-puissance': "Comment déterminer la puissance électrique consommée par un équipement d'atelier ?",
      'energie-consommee': "Comment déterminer l'énergie qu'un équipement d'atelier consomme sur une durée donnée ?",
    },
  },

  '1ere-trpm': {
    contexte: "Une machine-outil (perceuse, fraiseuse) consomme une puissance électrique qui dépend de son utilisation. Connaître cette puissance permet de dimensionner correctement l'installation électrique qui l'alimente.",
    problematiques: {
      'mesure-puissance': "Comment déterminer la puissance électrique consommée par une machine-outil ?",
      'energie-consommee': "Comment déterminer l'énergie qu'une machine-outil consomme sur une durée donnée ?",
    },
  },

  '1ere-mcc': {
    contexte: "Une machine à coudre industrielle ou un fer à repasser professionnel consomme une puissance électrique indiquée sur sa plaque signalétique. Cette information conditionne le nombre d'appareils pouvant être utilisés simultanément sur une même installation.",
    problematiques: {
      'mesure-puissance': "Comment déterminer la puissance électrique consommée par un équipement de couture ?",
      'energie-consommee': "Comment déterminer l'énergie qu'un équipement de couture consomme au cours d'une journée de travail ?",
    },
  },

};

export function init() {

  initPuissance();
  initEnergie();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Puissance',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // Ce TP correspond à « Distinguer énergie et puissance électrique »,
  // commun aux trois filières en 1ère et déjà acquis en Tle.
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  ['mesure-puissance', 'energie-consommee'],
      '1ere-trpm': ['mesure-puissance', 'energie-consommee'],
      '1ere-mcc':  ['mesure-puissance', 'energie-consommee'],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   [],
    },
    messageId: 'tp01-message-filiere',
    messageTexte: "Ce TP a déjà été traité en classe de 1ère : la puissance et l'énergie électriques ne sont pas reprises en Terminale.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();
  initQuestionsParOnglet();

  initImpressionCompteRendu({
    titre: 'Puissance et énergie électrique',
    tp: 'TP01',
    // Tableaux de mesures + graphiques P = f(U×I) et E = f(P×t), insérés avant les questions.
    sectionsSupplementaires: () => [
      sectionMesuresCompteRendu(),
      sectionEnergieCompteRendu(),
    ].filter(Boolean),
  });
}

// =================================================================
// Onglet 1 — Mesure et calcul de la puissance P = U × I
// =================================================================

// État partagé avec l'impression du compte-rendu. Le module reste en cache
// d'une navigation à l'autre : initPuissance() le réinitialise à chaque
// affichage du TP, pour rester cohérent avec le tableau affiché.
const mesuresPuissance = [];
let regressionCourante = null;

// Nombre minimal de mesures complètes (U, I, P wattmètre) pour la régression.
const NB_POINTS_MIN = 3;

function initPuissance() {

  const btnAjouter = $('pui-ajouter');
  const inputTension = $('pui-tension');
  const inputIntensite = $('pui-intensite');
  const inputWatt = $('pui-wattmetre');
  const tbody = $('tbody-puissance');

  mesuresPuissance.length = 0;
  regressionCourante = null;

  if (!btnAjouter || !tbody) return;

  btnAjouter.addEventListener('click', () => {

    const u = parseFloat(inputTension.value);
    const i = parseFloat(inputIntensite.value);
    const pw = parseFloat(inputWatt.value);

    if (Number.isNaN(u) || Number.isNaN(i)) return;

    mesuresPuissance.push({ u, i, pw: Number.isNaN(pw) ? null : pw });

    redessinerTableauPuissance(tbody, mesuresPuissance);
    tracerRegression(mesuresPuissance);

    inputTension.value = '';
    inputIntensite.value = '';
    inputWatt.value = '';
    inputTension.focus();
  });
}

/** Écart relatif (en %) entre U×I et la puissance lue, ou null si non calculable. */
function ecartRelatif(m) {
  if (m.pw === null || m.pw === 0) return null;
  return Math.abs(m.u * m.i - m.pw) / m.pw * 100;
}

function redessinerTableauPuissance(tbody, mesures) {

  tbody.innerHTML = '';

  mesures.forEach((m, idx) => {

    const ecart = ecartRelatif(m);

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${arrondir(m.u, 2)} V</td>
      <td>${arrondir(m.i, 2)} A</td>
      <td>${arrondir(m.u * m.i, 2)} W</td>
      <td>${m.pw === null ? '—' : arrondir(m.pw, 2) + ' W'}</td>
      <td>${ecart === null ? '—' : arrondir(ecart, 1) + ' %'}</td>
    `;

    tbody.appendChild(tr);
  });
}

// -----------------------------------------------------------------
// Graphique P(wattmètre) = f(U×I) + droite de régression
// -----------------------------------------------------------------

/** Points (x = U×I, y = P lue) des mesures complètes. */
function pointsGraphique(mesures) {
  return mesures
    .filter(m => m.pw !== null)
    .map(m => ({ x: m.u * m.i, y: m.pw }));
}

/**
 * Régression proportionnelle par moindres carrés : y = a·x (droite passant
 * par l'origine). a = Σxy / Σx². Le R² est ici non centré :
 * R² = 1 − Σ(y − a·x)² / Σy².
 */
function regressionLineaire(points) {

  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);

  if (sxx < 1e-12) return null; // tous les x sont nuls

  const a = sxy / sxx;

  const syy = points.reduce((s, p) => s + p.y * p.y, 0);
  const scr = points.reduce((s, p) => s + (p.y - a * p.x) ** 2, 0);
  const r2 = syy === 0 ? 1 : 1 - scr / syy;

  return { a, r2 };
}

/** Pas « arrondi » (1, 2, 5 × 10^k) pour graduer un axe. */
function pasGraduation(max, nbGraduations = 6) {

  const brut = max / nbGraduations;
  const puissance = Math.pow(10, Math.floor(Math.log10(brut)));
  const fraction = brut / puissance;
  const coef = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;

  return coef * puissance;
}

function texteRegression(reg, formatNombre, y = 'P', x = 'U×I') {
  return `${y} = ${formatNombre(reg.a, 3)} × (${x}) — R² = ${formatNombre(reg.r2, 4)}`;
}

function tracerRegression(mesures) {

  const canvas = $('pui-canvas');
  const msg = $('pui-graphique-msg');
  const zoneReg = $('pui-regression');

  if (!canvas || !msg || !zoneReg) return;

  regressionCourante = null;

  const points = pointsGraphique(mesures);

  if (points.length < NB_POINTS_MIN) {
    canvas.style.display = 'none';
    zoneReg.style.display = 'none';
    msg.style.display = '';
    return;
  }

  const reg = regressionLineaire(points);

  if (!reg) {
    canvas.style.display = 'none';
    zoneReg.style.display = 'none';
    msg.style.display = '';
    msg.textContent = 'Toutes les valeurs de U×I sont nulles : impossible de tracer la droite. Vérifier les mesures saisies.';
    return;
  }

  msg.style.display = 'none';
  canvas.style.display = 'block';
  zoneReg.style.display = '';

  dessinerGraphique(canvas, points, reg);

  regressionCourante = reg;

  zoneReg.innerHTML = `
    Droite de régression :
    <strong>${texteRegression(reg, arrondir)}</strong>.
    Si P = U × I, la pente est proche de 1.
  `;
}

// -----------------------------------------------------------------
// Impression : section « Mesures » du compte-rendu
// -----------------------------------------------------------------

/** Nombre au format français (virgule décimale) pour l'impression. */
function nombreFr(valeur, decimales) {
  return String(arrondir(valeur, decimales)).replace('.', ',');
}

/**
 * Section transmise à js/compte-rendu.js : tableau des mesures saisies,
 * graphique P = f(U×I) (si au moins 3 mesures complètes) et équation de la droite.
 * Retourne null si aucune mesure n'a été saisie.
 */
function sectionMesuresCompteRendu() {

  if (!mesuresPuissance.length) return null;

  const section = {
    titre: 'Mesures : tableau et graphique P = f(U×I)',
    tableau: {
      entetes: ['N°', 'U (V)', 'I (A)', 'P = U×I (W)', 'P wattmètre (W)', 'Écart relatif'],
      lignes: mesuresPuissance.map((m, idx) => {
        const ecart = ecartRelatif(m);
        return [
          idx + 1,
          nombreFr(m.u, 2),
          nombreFr(m.i, 2),
          nombreFr(m.u * m.i, 2),
          m.pw === null ? '—' : nombreFr(m.pw, 2),
          ecart === null ? '—' : nombreFr(ecart, 1) + ' %',
        ];
      }),
    },
  };

  const canvas = $('pui-canvas');

  if (regressionCourante && canvas) {
    section.canvas = canvas;
    section.legende = `Droite de régression : ${texteRegression(regressionCourante, nombreFr)}`;
  }

  return section;
}

function dessinerGraphique(canvas, points, reg, libelles = { x: 'U × I (W)', y: 'P lue au wattmètre (W)' }) {

  const dpr = window.devicePixelRatio || 1;
  const L = 640; // dimensions logiques (identiques à width/height du HTML)
  const H = 380;

  // Résolution adaptée aux écrans haute densité (taille logique conservée).
  canvas.width = L * dpr;
  canvas.height = H * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Couleurs fixes + fond blanc : le graphique est aussi imprimé dans le
  // compte-rendu (image PNG), il doit rester lisible quel que soit le thème.
  const couleurTexte = '#222';
  const couleurPrincipale = '#2563eb';
  const couleurGrille = 'rgba(128,128,128,0.25)';

  const marge = { haut: 20, droite: 20, bas: 50, gauche: 70 };
  const zoneL = L - marge.gauche - marge.droite;
  const zoneH = H - marge.haut - marge.bas;

  const xBrut = Math.max(...points.map(p => p.x), 0.1);
  const yBrut = Math.max(...points.map(p => p.y), reg.a * xBrut, 0.1);

  const pasX = pasGraduation(xBrut);
  const pasY = pasGraduation(yBrut);
  const xMax = Math.ceil(xBrut / pasX) * pasX;
  const yMax = Math.ceil(yBrut / pasY) * pasY;

  const px = x => marge.gauche + (x / xMax) * zoneL;
  const py = y => marge.haut + zoneH - (y / yMax) * zoneH;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, L, H);
  ctx.font = '12px sans-serif';
  ctx.fillStyle = couleurTexte;
  ctx.strokeStyle = couleurGrille;
  ctx.lineWidth = 1;

  // Grille + graduations
  ctx.textAlign = 'center';
  for (let x = 0; x <= xMax + 1e-9; x += pasX) {
    ctx.beginPath();
    ctx.moveTo(px(x), marge.haut);
    ctx.lineTo(px(x), marge.haut + zoneH);
    ctx.stroke();
    ctx.fillText(arrondir(x, 2), px(x), marge.haut + zoneH + 16);
  }

  ctx.textAlign = 'right';
  for (let y = 0; y <= yMax + 1e-9; y += pasY) {
    ctx.beginPath();
    ctx.moveTo(marge.gauche, py(y));
    ctx.lineTo(marge.gauche + zoneL, py(y));
    ctx.stroke();
    ctx.fillText(arrondir(y, 2), marge.gauche - 6, py(y) + 4);
  }

  // Axes
  ctx.strokeStyle = couleurTexte;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(marge.gauche, marge.haut);
  ctx.lineTo(marge.gauche, marge.haut + zoneH);
  ctx.lineTo(marge.gauche + zoneL, marge.haut + zoneH);
  ctx.stroke();

  // Titres des axes
  ctx.textAlign = 'center';
  ctx.fillText(libelles.x, marge.gauche + zoneL / 2, H - 10);

  ctx.save();
  ctx.translate(16, marge.haut + zoneH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(libelles.y, 0, 0);
  ctx.restore();

  // Droite de régression y = a·x, de l'origine au bord du cadre
  const xFin = reg.a > 0 ? Math.min(xMax, yMax / reg.a) : xMax;

  ctx.strokeStyle = couleurPrincipale;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px(0), py(0));
  ctx.lineTo(px(xFin), py(reg.a * xFin));
  ctx.stroke();

  // Points de mesure
  ctx.fillStyle = couleurPrincipale;
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(px(p.x), py(p.y), 5, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Légende
  ctx.fillStyle = couleurTexte;
  ctx.textAlign = 'left';
  ctx.fillText('● mesures — ligne : droite y = a·x', marge.gauche + 10, marge.haut + 14);
}

// =================================================================
// Onglet 2 — Énergie électrique E = P × t
// (même principe que l'onglet 1 : saisie, tableau, régression, impression)
// =================================================================

const mesuresEnergie = [];
let regressionEnergie = null;

function initEnergie() {

  const btnAjouter = $('ener-ajouter');
  const inputPuissance = $('ener-puissance');
  const inputDuree = $('ener-duree');
  const inputLue = $('ener-lue');
  const tbody = $('tbody-energie');

  mesuresEnergie.length = 0;
  regressionEnergie = null;

  if (!btnAjouter || !tbody) return;

  btnAjouter.addEventListener('click', () => {

    const p = parseFloat(inputPuissance.value);
    const t = parseFloat(inputDuree.value);
    const e = parseFloat(inputLue.value);

    if (Number.isNaN(p) || Number.isNaN(t)) return;

    mesuresEnergie.push({ p, t, e: Number.isNaN(e) ? null : e });

    redessinerTableauEnergie(tbody, mesuresEnergie);
    afficherResultatEnergie(mesuresEnergie[mesuresEnergie.length - 1]);
    tracerRegressionEnergie(mesuresEnergie);

    // P reste en général constante pendant la série : seule la durée change.
    inputDuree.value = '';
    inputLue.value = '';
    inputDuree.focus();
  });
}

/** Écart relatif (en %) entre P×t et l'énergie lue, ou null si non calculable. */
function ecartEnergie(m) {
  if (m.e === null || m.e === 0) return null;
  return Math.abs(m.p * m.t - m.e) / m.e * 100;
}

function redessinerTableauEnergie(tbody, mesures) {

  tbody.innerHTML = '';

  mesures.forEach((m, idx) => {

    const ecart = ecartEnergie(m);
    const joules = m.p * m.t;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${arrondir(m.p, 2)} W</td>
      <td>${arrondir(m.t, 0)} s</td>
      <td>${arrondir(joules, 0)} J</td>
      <td>${arrondir(joules / 3600, 3)} Wh</td>
      <td>${m.e === null ? '—' : arrondir(m.e, 0) + ' J'}</td>
      <td>${ecart === null ? '—' : arrondir(ecart, 1) + ' %'}</td>
    `;

    tbody.appendChild(tr);
  });
}

function afficherResultatEnergie(m) {

  const zone = $('ener-resultat');
  if (!zone) return;

  const joules = m.p * m.t;

  zone.innerHTML = `
    Dernière mesure — énergie reçue :
    <strong>${arrondir(joules, 0)} J</strong>
    soit <strong>${arrondir(joules / 3600, 3)} Wh</strong>
    = <strong>${arrondir(joules / 3.6e6, 5)} kWh</strong>.
  `;
}

function tracerRegressionEnergie(mesures) {

  const canvas = $('ener-canvas');
  const msg = $('ener-graphique-msg');
  const zoneReg = $('ener-regression');

  if (!canvas || !msg || !zoneReg) return;

  regressionEnergie = null;

  const points = mesures
    .filter(m => m.e !== null)
    .map(m => ({ x: m.p * m.t, y: m.e }));

  if (points.length < NB_POINTS_MIN) {
    canvas.style.display = 'none';
    zoneReg.style.display = 'none';
    msg.style.display = '';
    return;
  }

  const reg = regressionLineaire(points);

  if (!reg) {
    canvas.style.display = 'none';
    zoneReg.style.display = 'none';
    msg.style.display = '';
    msg.textContent = 'Toutes les valeurs de P×t sont nulles : impossible de tracer la droite. Vérifier les mesures saisies.';
    return;
  }

  msg.style.display = 'none';
  canvas.style.display = 'block';
  zoneReg.style.display = '';

  dessinerGraphique(canvas, points, reg, { x: 'P × t (J)', y: 'E lue au joulemètre (J)' });

  regressionEnergie = reg;

  zoneReg.innerHTML = `
    Droite de régression :
    <strong>${texteRegression(reg, arrondir, 'E', 'P×t')}</strong>.
    Si E = P × t, la pente est proche de 1.
  `;
}

/** Section « Énergie » du compte-rendu (null si aucune mesure saisie). */
function sectionEnergieCompteRendu() {

  if (!mesuresEnergie.length) return null;

  const section = {
    titre: 'Énergie : tableau et graphique E = f(P×t)',
    tableau: {
      entetes: ['N°', 'P (W)', 't (s)', 'E = P×t (J)', 'E (Wh)', 'E joulemètre (J)', 'Écart relatif'],
      lignes: mesuresEnergie.map((m, idx) => {
        const ecart = ecartEnergie(m);
        const joules = m.p * m.t;
        return [
          idx + 1,
          nombreFr(m.p, 2),
          nombreFr(m.t, 0),
          nombreFr(joules, 0),
          nombreFr(joules / 3600, 3),
          m.e === null ? '—' : nombreFr(m.e, 0),
          ecart === null ? '—' : nombreFr(ecart, 1) + ' %',
        ];
      }),
    },
  };

  const canvas = $('ener-canvas');

  if (regressionEnergie && canvas) {
    section.canvas = canvas;
    section.legende = `Droite de régression : ${texteRegression(regressionEnergie, nombreFr, 'E', 'P×t')}`;
  }

  return section;
}
/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * TD01 : Solides, aires, volumes, Pythagore et Thalès
 * mathilab/tp-geometrie/js/td01-solides-aires-volumes.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-geometrie.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_TD01 = {
  '2nde-remi': {
    contexte: "En atelier de réalisation mécanique, contrôler qu'une pièce est d'équerre, calculer le volume de matière d'une pièce cylindrique, ou changer d'échelle un plan sont des gestes courants.",
    problematique: "Comment vérifier, par le calcul, qu'une pièce respecte les dimensions et l'angle attendus, et comment un changement d'échelle affecte-t-il ses dimensions ?",
  },
  '2nde-mcc': {
    contexte: "En atelier de confection, construire un patron à une autre échelle, ou vérifier l'équerrage d'une pièce de tissu découpée, font appel à la géométrie et au théorème de Pythagore.",
    problematique: "Comment vérifier qu'une pièce découpée respecte les dimensions et l'angle attendus, et comment un changement d'échelle affecte-t-il un patron ?",
  },
  '2nde-gatl': {
    contexte: "En logistique, calculer le volume d'un colis ou d'un espace de stockage, ou vérifier l'agencement d'un entrepôt, font appel à des calculs d'aires et de volumes.",
    problematique: "Comment calculer les dimensions et le volume disponibles pour optimiser le rangement d'un espace de stockage ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : Math.round(v * 1000) / 1000) : v;
}

/* ============================================================
   AIRES ET PÉRIMÈTRES
   ============================================================ */

const CONFIG_FIGURES = {
  carre:     { label1: 'Côté (cm)', label2: null },
  rectangle: { label1: 'Longueur (cm)', label2: 'Largeur (cm)' },
  triangle:  { label1: 'Base (cm)', label2: 'Hauteur (cm)' },
  disque:    { label1: 'Rayon (cm)', label2: null },
};

function actualiserChampsFigure() {
  const type = document.getElementById('fig-type').value;
  const config = CONFIG_FIGURES[type];
  document.getElementById('fig-dim1-label').textContent = config.label1;
  const groupe2 = document.getElementById('fig-dim2-groupe');
  if (config.label2) {
    groupe2.style.display = '';
    document.getElementById('fig-dim2-label').textContent = config.label2;
  } else {
    groupe2.style.display = 'none';
  }
}

function calculerFigure() {
  const type = document.getElementById('fig-type').value;
  const d1 = parseFloat(document.getElementById('fig-dim1').value);
  const d2 = parseFloat(document.getElementById('fig-dim2').value);
  const zone = document.getElementById('fig-resultat');
  if (Number.isNaN(d1)) return;

  let aire, perimetre, formule;

  switch (type) {
    case 'carre':
      aire = d1 * d1;
      perimetre = 4 * d1;
      formule = `Aire = côté² = ${d1}² = ${formater(aire)} cm² ; Périmètre = 4 × côté = ${formater(perimetre)} cm`;
      break;
    case 'rectangle':
      aire = d1 * d2;
      perimetre = 2 * (d1 + d2);
      formule = `Aire = L × l = ${d1} × ${d2} = ${formater(aire)} cm² ; Périmètre = 2(L + l) = ${formater(perimetre)} cm`;
      break;
    case 'triangle':
      aire = (d1 * d2) / 2;
      formule = `Aire = (base × hauteur) / 2 = (${d1} × ${d2}) / 2 = ${formater(aire)} cm² (périmètre non calculable sans les 3 côtés)`;
      perimetre = null;
      break;
    case 'disque':
      aire = Math.PI * d1 * d1;
      perimetre = 2 * Math.PI * d1;
      formule = `Aire = π × rayon² = ${formater(aire)} cm² ; Circonférence = 2π × rayon = ${formater(perimetre)} cm`;
      break;
  }

  zone.innerHTML = formule;
}

function initAiresPerimetres() {
  document.getElementById('fig-type')?.addEventListener('change', actualiserChampsFigure);
  document.getElementById('fig-calculer')?.addEventListener('click', calculerFigure);
  actualiserChampsFigure();
  calculerFigure();
}

/* ============================================================
   VOLUMES DE SOLIDES
   ============================================================ */

const CONFIG_SOLIDES = {
  cube:     { label1: 'Arête (cm)', label2: null, label3: null },
  pave:     { label1: 'Longueur (cm)', label2: 'Largeur (cm)', label3: 'Hauteur (cm)' },
  cylindre: { label1: 'Rayon (cm)', label2: null, label3: 'Hauteur (cm)' },
  pyramide: { label1: 'Aire de la base (cm²)', label2: null, label3: 'Hauteur (cm)' },
  cone:     { label1: 'Rayon (cm)', label2: null, label3: 'Hauteur (cm)' },
  boule:    { label1: 'Rayon (cm)', label2: null, label3: null },
};

function actualiserChampsSolide() {
  const type = document.getElementById('sol-type').value;
  const config = CONFIG_SOLIDES[type];

  document.getElementById('sol-dim1-label').textContent = config.label1;

  const g2 = document.getElementById('sol-dim2-groupe');
  const g3 = document.getElementById('sol-dim3-groupe');

  if (config.label2) {
    g2.style.display = '';
    document.getElementById('sol-dim2-label').textContent = config.label2;
  } else {
    g2.style.display = 'none';
  }

  if (config.label3) {
    g3.style.display = '';
    document.getElementById('sol-dim3-label').textContent = config.label3;
  } else {
    g3.style.display = 'none';
  }
}

function calculerSolide() {
  const type = document.getElementById('sol-type').value;
  const d1 = parseFloat(document.getElementById('sol-dim1').value);
  const d2 = parseFloat(document.getElementById('sol-dim2').value);
  const d3 = parseFloat(document.getElementById('sol-dim3').value);
  const zone = document.getElementById('sol-resultat');
  if (Number.isNaN(d1)) return;

  let volume, surface = null, formule;

  switch (type) {
    case 'cube':
      volume = d1 ** 3;
      surface = 6 * d1 * d1;
      formule = `Volume = arête³ = ${d1}³ = ${formater(volume)} cm³ ; Surface totale = 6 × arête² = ${formater(surface)} cm²`;
      break;
    case 'pave':
      volume = d1 * d2 * d3;
      surface = 2 * (d1 * d2 + d1 * d3 + d2 * d3);
      formule = `Volume = L × l × h = ${formater(volume)} cm³ ; Surface totale = ${formater(surface)} cm²`;
      break;
    case 'cylindre':
      volume = Math.PI * d1 * d1 * d3;
      surface = 2 * Math.PI * d1 * d1 + 2 * Math.PI * d1 * d3;
      formule = `Volume = π × rayon² × hauteur = ${formater(volume)} cm³ ; Surface totale = ${formater(surface)} cm²`;
      break;
    case 'pyramide':
      volume = (d1 * d3) / 3;
      formule = `Volume = (aire de la base × hauteur) / 3 = (${d1} × ${d3}) / 3 = ${formater(volume)} cm³`;
      break;
    case 'cone':
      volume = (Math.PI * d1 * d1 * d3) / 3;
      formule = `Volume = (π × rayon² × hauteur) / 3 = ${formater(volume)} cm³`;
      break;
    case 'boule':
      volume = (4 / 3) * Math.PI * d1 ** 3;
      formule = `Volume = (4/3) × π × rayon³ = ${formater(volume)} cm³`;
      break;
  }

  zone.innerHTML = formule;
}

function initVolumes() {
  document.getElementById('sol-type')?.addEventListener('change', actualiserChampsSolide);
  document.getElementById('sol-calculer')?.addEventListener('click', calculerSolide);
  actualiserChampsSolide();
  calculerSolide();
}

/* ============================================================
   THÉORÈME DE PYTHAGORE ET SA RÉCIPROQUE
   ============================================================ */

function calculerPythagore() {
  const a = parseFloat(document.getElementById('pyth-a').value);
  const b = parseFloat(document.getElementById('pyth-b').value);
  const zone = document.getElementById('pyth-resultat');
  if (Number.isNaN(a) || Number.isNaN(b)) return;

  const c = Math.sqrt(a * a + b * b);
  zone.innerHTML = `c² = a² + b² = ${a}² + ${b}² = ${formater(a * a + b * b)} → c = √${formater(a * a + b * b)} ≈ ${formater(c)} cm`;
}

function verifierReciproquePythagore() {
  const a = parseFloat(document.getElementById('pyth-r-a').value);
  const b = parseFloat(document.getElementById('pyth-r-b').value);
  const c = parseFloat(document.getElementById('pyth-r-c').value);
  const zone = document.getElementById('pyth-r-resultat');
  if ([a, b, c].some((v) => Number.isNaN(v))) return;

  const sommeCarres = a * a + b * b;
  const carreGrandCote = c * c;
  const ecart = Math.abs(sommeCarres - carreGrandCote);

  if (ecart < 0.05) {
    zone.innerHTML = `a² + b² = ${formater(sommeCarres)} et c² = ${formater(carreGrandCote)} : ces valeurs sont égales (aux erreurs de mesure près) → <strong>le triangle est rectangle</strong>.`;
  } else {
    zone.innerHTML = `a² + b² = ${formater(sommeCarres)} et c² = ${formater(carreGrandCote)} : ces valeurs sont différentes → <strong>le triangle n'est pas rectangle</strong>.`;
  }
}

function initPythagore() {
  document.getElementById('pyth-calculer')?.addEventListener('click', calculerPythagore);
  calculerPythagore();
  document.getElementById('pyth-r-verifier')?.addEventListener('click', verifierReciproquePythagore);
  verifierReciproquePythagore();
}

/* ============================================================
   THÉORÈME DE THALÈS
   ============================================================ */

function calculerThales() {
  const ab = parseFloat(document.getElementById('th-ab').value);
  const ac = parseFloat(document.getElementById('th-ac').value);
  const bc = parseFloat(document.getElementById('th-bc').value);
  const ad = parseFloat(document.getElementById('th-ad').value);
  const zone = document.getElementById('th-resultat');
  if ([ab, ac, bc, ad].some((v) => Number.isNaN(v)) || ab === 0) return;

  if (ad > ab) {
    zone.innerHTML = `⚠ AD (${ad}) doit être inférieur à AB (${ab}) : D doit appartenir au segment [AB].`;
    return;
  }

  const rapport = ad / ab;
  const ae = rapport * ac;
  const de = rapport * bc;

  zone.innerHTML = `
    AD/AB = ${ad}/${ab} = ${formater(rapport)}<br>
    AE = (AD/AB) × AC = ${formater(rapport)} × ${ac} = <strong>${formater(ae)}</strong><br>
    DE = (AD/AB) × BC = ${formater(rapport)} × ${bc} = <strong>${formater(de)}</strong>
  `;
}

function initThales() {
  document.getElementById('th-calculer')?.addEventListener('click', calculerThales);
  calculerThales();
}

/* ============================================================
   AGRANDISSEMENT / RÉDUCTION
   ============================================================ */

function calculerAgrandissement() {
  const k = parseFloat(document.getElementById('agr-k').value);
  const longueur = parseFloat(document.getElementById('agr-longueur').value);
  const aire = parseFloat(document.getElementById('agr-aire').value);
  const volume = parseFloat(document.getElementById('agr-volume').value);
  const zone = document.getElementById('agr-resultat');
  if ([k, longueur, aire, volume].some((v) => Number.isNaN(v))) return;

  const nature = k > 1 ? 'agrandissement' : (k < 1 ? 'réduction' : 'transformation neutre (k = 1)');

  zone.innerHTML = `
    Coefficient k = ${k} → ${nature}<br>
    Nouvelle longueur = longueur × k = ${longueur} × ${k} = <strong>${formater(longueur * k)} cm</strong><br>
    Nouvelle aire = aire × k² = ${aire} × ${k}² = <strong>${formater(aire * k * k)} cm²</strong><br>
    Nouveau volume = volume × k³ = ${volume} × ${k}³ = <strong>${formater(volume * k ** 3)} cm³</strong>
  `;
}

function initAgrandissement() {
  document.getElementById('agr-calculer')?.addEventListener('click', calculerAgrandissement);
  calculerAgrandissement();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

function initialiserTD01() {
  initOngletsParFiliere();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_TD01
  });

  initAiresPerimetres();
  initVolumes();
  initPythagore();
  initThales();
  initAgrandissement();

  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Solides, aires, volumes, Pythagore et Thalès',
    tp: 'TD01'
  });
}

initialiserTD01();

/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * TD03 : Étudier des fonctions
 * (1ère : résolution graphique, polynômes degré 2, dérivation /
 *  Tle : polynômes degré 3)
 * mathilab/tp-algebre/js/td03-fonctions.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {
  dessinerCourbe, trouverIntersections, intervallesInequation,
  fonctionPolynomeFactorisee, caracteristiquesParabole, deuxiemeRacine, evaluerPolynomeDegre2,
  deriveePolynomeDegre2, equationTangente, fonctionInverse,
  evaluerPolynomeDegre3, deriveePolynomeDegre3, resoudreTrinome, tableauVariationsDegre3,
} from '../../js/algebre.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_TD03 = {
  '1ere-trpm': {
    contexte: "Lors d'une opération d'usinage sur tour ou fraiseuse, le volume de matière enlevée sur une pièce mécanique évolue en fonction d'une dimension de passe selon une fonction polynôme de degré 2 ou 3.",
    problematique: "Pour quelles dimensions le volume de matière enlevée (ou le coût de production associé) reste-t-il dans une plage acceptable ?",
  },
  '1ere-tci': {
    contexte: "Lors du façonnage d'une pièce chaudronnée, la surface de tôle développée nécessaire évolue en fonction d'une dimension de la pièce selon une fonction polynôme de degré 2 ; l'effort de cintrage évolue avec l'angle de pliage.",
    problematique: "Pour quelles dimensions la surface de tôle nécessaire reste-t-elle dans une plage acceptable, et pour quel angle l'effort de cintrage est-il minimal ?",
  },
  '1ere-mcc': {
    contexte: "Le coût de production d'une petite série de vêtements évolue en fonction du nombre de pièces confectionnées selon une fonction polynôme de degré 2 ou 3.",
    problematique: "Pour quelle quantité de pièces produites le coût de production est-il minimal, et reste-t-il dans une plage acceptable pour la rentabilité de l'atelier ?",
  },
  '1ere-log': {
    contexte: "Le coût global d'une tournée de livraison évolue en fonction du nombre de points de livraison desservis selon une fonction polynôme de degré 2 ou 3.",
    problematique: "Pour quel nombre de points de livraison le coût global de la tournée est-il minimal ?",
  },
  '1ere-agora': {
    contexte: "Le résultat financier d'une structure administrative évolue en fonction du nombre de dossiers traités selon une fonction polynôme de degré 2 ou 3.",
    problematique: "Pour quel nombre de dossiers traités le résultat financier est-il optimal, tout en restant dans une plage acceptable pour l'équilibre budgétaire ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ============================================================
   NIVEAU 1ère — RÉSOLUTION GRAPHIQUE (préfixe rg-)
   ============================================================ */

function construireFonction(type, coef1, coef2) {
  return type === 'carre' ? (x) => coef1 * x ** 2 : (x) => coef1 * x + coef2;
}

function libelleFonction(nom, type, coef1, coef2) {
  return type === 'carre' ? `${nom}(x) = ${coef1}x²` : `${nom}(x) = ${coef1}x + ${coef2}`;
}

function tracerEtResoudre() {
  const typeF = document.getElementById('rg-type-f').value;
  const coef1F = parseFloat(document.getElementById('rg-f-coef1').value);
  const coef2F = parseFloat(document.getElementById('rg-f-coef2').value);
  const typeG = document.getElementById('rg-type-g').value;
  const coef1G = parseFloat(document.getElementById('rg-g-coef1').value);
  const coef2G = parseFloat(document.getElementById('rg-g-coef2').value);
  const xMin = parseFloat(document.getElementById('rg-xmin').value);
  const xMax = parseFloat(document.getElementById('rg-xmax').value);

  if ([coef1F, coef2F, coef1G, coef2G, xMin, xMax].some((v) => Number.isNaN(v)) || xMin >= xMax) return;

  const f = construireFonction(typeF, coef1F, coef2F);
  const g = construireFonction(typeG, coef1G, coef2G);

  dessinerCourbe('rg-courbe', [
    { label: libelleFonction('f', typeF, coef1F, coef2F), fn: f, xMin, xMax, couleur: 'var(--couleur-primaire, #2563eb)' },
    { label: libelleFonction('g', typeG, coef1G, coef2G), fn: g, xMin, xMax, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);

  const solutions = trouverIntersections(f, g, xMin, xMax);
  document.getElementById('rg-solutions-egalite').textContent = solutions.length
    ? `f(x) = g(x) pour x ≈ ${solutions.map(formater).join(' ; ')}.`
    : `Aucune solution trouvée pour f(x) = g(x) sur [${xMin} ; ${xMax}].`;

  const intervalles = intervallesInequation(f, g, xMin, xMax);
  document.getElementById('rg-solutions-inegalite').textContent = intervalles.length
    ? `f(x) ⩾ g(x) sur ${intervalles.map(([a, b]) => `[${formater(a)} ; ${formater(b)}]`).join(' ∪ ')}.`
    : `f(x) < g(x) sur tout l'intervalle [${xMin} ; ${xMax}].`;
}

function basculerChampCoef2(typeSelectId, coef2GroupeId) {
  const select = document.getElementById(typeSelectId);
  const groupe = document.getElementById(coef2GroupeId);
  if (!select || !groupe) return;
  const actualiser = () => { groupe.style.display = select.value === 'carre' ? 'none' : ''; };
  select.addEventListener('change', actualiser);
  actualiser();
}

function initResolutionGraphique() {
  basculerChampCoef2('rg-type-f', 'rg-f-coef2-groupe');
  basculerChampCoef2('rg-type-g', 'rg-g-coef2-groupe');
  document.getElementById('rg-resoudre')?.addEventListener('click', tracerEtResoudre);
  tracerEtResoudre();
}

/* ============================================================
   NIVEAU 1ère — POLYNÔMES DE DEGRÉ 2 (préfixe ep-/rm-)
   ============================================================ */

function etudierParabole() {
  const a = parseFloat(document.getElementById('ep-a').value);
  const x1 = parseFloat(document.getElementById('ep-x1').value);
  const x2 = parseFloat(document.getElementById('ep-x2').value);
  if ([a, x1, x2].some((v) => Number.isNaN(v)) || a === 0) return;

  const { axeSymetrie, sommet, ordonneeOrigine, signeA } = caracteristiquesParabole(a, x1, x2);
  const f = fonctionPolynomeFactorisee(a, x1, x2);

  const [xMin, xMax] = [Math.min(x1, x2) - 2, Math.max(x1, x2) + 2];

  document.getElementById('ep-tbody').innerHTML = `
    <tr><td>Racines</td><td>x1 = ${formater(x1)} ; x2 = ${formater(x2)}</td></tr>
    <tr><td>Signe de a</td><td>${signeA}</td></tr>
    <tr><td>Axe de symétrie</td><td>x = ${formater(axeSymetrie)}</td></tr>
    <tr><td>Sommet</td><td>(${formater(sommet.x)} ; ${formater(sommet.y)})</td></tr>
    <tr><td>Ordonnée à l'origine</td><td>f(0) = ${formater(ordonneeOrigine)}</td></tr>
    <tr><td>Signe de f(x)</td><td>${a > 0
      ? `positif à l'extérieur de [${formater(Math.min(x1, x2))} ; ${formater(Math.max(x1, x2))}], négatif entre les racines`
      : `négatif à l'extérieur de [${formater(Math.min(x1, x2))} ; ${formater(Math.max(x1, x2))}], positif entre les racines`}</td></tr>
  `;

  dessinerCourbe('ep-courbe', [{
    label: 'f(x)', fn: f, xMin, xMax,
    points: [{ x: x1, y: 0 }, { x: x2, y: 0 }, sommet],
  }]);
}

function trouverRacineManquante() {
  const a = parseFloat(document.getElementById('rm-a').value);
  const b = parseFloat(document.getElementById('rm-b').value);
  const c = parseFloat(document.getElementById('rm-c').value);
  const x1 = parseFloat(document.getElementById('rm-x1').value);
  if ([a, b, c, x1].some((v) => Number.isNaN(v)) || a === 0) return;

  const fx1 = evaluerPolynomeDegre2([a, b, c], x1);
  const x2 = deuxiemeRacine(a, b, x1);
  const fx2 = evaluerPolynomeDegre2([a, b, c], x2);

  document.getElementById('rm-resultat').innerHTML = `
    f(x1) = ${formater(fx1)} ${Math.abs(fx1) < 1e-6 ? '(x1 est bien racine)' : "(⚠ x1 n'est pas racine de ce polynôme)"}<br>
    x1 + x2 = −b/a = ${formater(-b / a)} ⟹ x2 = ${formater(x2)}<br>
    Vérification : f(x2) = ${formater(fx2)}
  `;
}

function initPolynomesDegre2() {
  document.getElementById('ep-calculer')?.addEventListener('click', etudierParabole);
  etudierParabole();
  document.getElementById('rm-calculer')?.addEventListener('click', trouverRacineManquante);
  trouverRacineManquante();
}

/* ============================================================
   NIVEAU 1ère — DÉRIVATION ET VARIATIONS (préfixe tg-/fi-)
   ============================================================ */

function calculerTangente() {
  const a = parseFloat(document.getElementById('tg-a').value);
  const b = parseFloat(document.getElementById('tg-b').value);
  const c = parseFloat(document.getElementById('tg-c').value);
  const x0 = parseFloat(document.getElementById('tg-x0').value);
  if ([a, b, c, x0].some((v) => Number.isNaN(v))) return;

  const f = (x) => evaluerPolynomeDegre2([a, b, c], x);
  const [dA, dB] = deriveePolynomeDegre2([a, b]);
  const fPrime = (x) => dA * x + dB;
  const { m, p, fn: tangente } = equationTangente(f, fPrime, x0);

  document.getElementById('tg-tbody').innerHTML = `
    <tr><td>f'(x)</td><td>${dA}x + ${dB}</td></tr>
    <tr><td>f'(${x0}) (nombre dérivé)</td><td>${formater(m)}</td></tr>
    <tr><td>f(${x0})</td><td>${formater(f(x0))}</td></tr>
    <tr><td>Équation de la tangente en x0 = ${x0}</td><td>y = ${formater(m)}x + ${formater(p)}</td></tr>
  `;

  const sommetX = -dB / (2 * dA);
  const xMin = Math.min(x0, sommetX) - 2;
  const xMax = Math.max(x0, sommetX) + 2;

  document.getElementById('tg-tbody-variations').innerHTML = `
    <tr><td>${formater(xMin)}</td><td>${formater(f(xMin))}</td><td>borne</td></tr>
    <tr><td>${formater(sommetX)}</td><td>${formater(f(sommetX))}</td><td>${a > 0 ? 'minimum' : 'maximum'}</td></tr>
    <tr><td>${formater(xMax)}</td><td>${formater(f(xMax))}</td><td>borne</td></tr>
  `;

  dessinerCourbe('tg-courbe', [
    { label: 'f(x)', fn: f, xMin, xMax, couleur: 'var(--couleur-primaire, #2563eb)', points: [{ x: x0, y: f(x0) }] },
    { label: 'tangente en x0', fn: tangente, xMin, xMax, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initFonctionInverse() {
  dessinerCourbe('fi-courbe', [
    { label: 'f(x) = 1/x', fn: fonctionInverse(), xMin: -3, xMax: -0.2 },
    { label: 'f(x) = 1/x', fn: fonctionInverse(), xMin: 0.2, xMax: 3 },
  ]);
}

function initDerivationVariations() {
  document.getElementById('tg-calculer')?.addEventListener('click', calculerTangente);
  calculerTangente();
  initFonctionInverse();
}

/* ============================================================
   NIVEAU Tle — POLYNÔMES DE DEGRÉ 3 (préfixe fc-/pd-)
   ============================================================ */

function initFonctionCube() {
  dessinerCourbe('fc-courbe', [
    { label: 'f(x) = x³', fn: (x) => x ** 3, xMin: -2, xMax: 2, points: [{ x: 0, y: 0 }] },
  ]);
}

function lireCoefficients() {
  return [
    parseFloat(document.getElementById('pd-a').value),
    parseFloat(document.getElementById('pd-b').value),
    parseFloat(document.getElementById('pd-c').value),
    parseFloat(document.getElementById('pd-d').value),
  ];
}

function etudierPolynomeDegre3() {
  const coeffs = lireCoefficients();
  const xMin = parseFloat(document.getElementById('pd-xmin').value);
  const xMax = parseFloat(document.getElementById('pd-xmax').value);
  if (coeffs.some((c) => Number.isNaN(c)) || Number.isNaN(xMin) || Number.isNaN(xMax) || xMin >= xMax) return;

  const [a, b, c] = coeffs;
  const derivee = deriveePolynomeDegre3([a, b, c]);
  const { discriminant, racines } = resoudreTrinome(derivee);

  document.getElementById('pd-tbody-derivee').innerHTML = `
    <tr><td>f'(x)</td><td>${derivee[0]}x² + ${derivee[1]}x + ${derivee[2]}</td></tr>
    <tr><td>Discriminant de f'</td><td>${discriminant === null ? '—' : formater(discriminant)}</td></tr>
    <tr><td>Point(s) critique(s) sur ]${xMin} ; ${xMax}[</td><td>${racines.length ? racines.filter((x) => x > xMin && x < xMax).map(formater).join(' ; ') : 'aucun'}</td></tr>
  `;

  const etapes = tableauVariationsDegre3(coeffs, xMin, xMax);
  document.getElementById('pd-tbody-variations').innerHTML = etapes
    .map((e) => `<tr><td>${formater(e.x)}</td><td>${formater(e.valeur)}</td><td>${e.nature}</td></tr>`).join('');

  dessinerCourbe('pd-courbe', [{
    label: 'f(x)',
    fn: (x) => evaluerPolynomeDegre3(coeffs, x),
    xMin, xMax,
    points: etapes.filter((e) => e.nature !== 'borne').map((e) => ({ x: e.x, y: e.valeur })),
  }]);
}

function compterSolutionsDegre3() {
  const coeffs = lireCoefficients();
  const xMin = parseFloat(document.getElementById('pd-xmin').value);
  const xMax = parseFloat(document.getElementById('pd-xmax').value);
  const cible = parseFloat(document.getElementById('pd-cible').value);
  if ([...coeffs, xMin, xMax, cible].some((v) => Number.isNaN(v))) return;

  const etapes = tableauVariationsDegre3(coeffs, xMin, xMax);
  let solutions = 0;
  for (let i = 0; i < etapes.length - 1; i++) {
    const y1 = etapes[i].valeur;
    const y2 = etapes[i + 1].valeur;
    const min = Math.min(y1, y2);
    const max = Math.max(y1, y2);
    if (cible > min && cible < max) solutions += 1;
    if (cible === y1 || cible === y2) solutions += 0.5;
  }
  solutions = Math.round(solutions);

  document.getElementById('pd-solutions').textContent =
    `Pour c = ${cible}, l'équation f(x) = c admet environ ${solutions} solution(s) sur [${xMin} ; ${xMax}] (lecture graphique du tableau de variations).`;
}

function initPolynomeDegre3() {
  document.getElementById('pd-calculer')?.addEventListener('click', etudierPolynomeDegre3);
  document.getElementById('pd-compter-solutions')?.addEventListener('click', compterSolutionsDegre3);
  etudierPolynomeDegre3();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_TD03 });

initResolutionGraphique();
initPolynomesDegre2();
initDerivationVariations();

initFonctionCube();
initPolynomeDegre3();

initRadarCompetences();
initImpressionCompteRendu({ titre: 'Étudier des fonctions', tp: 'TD03' });

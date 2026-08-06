/**
 * /js/tp04-polynomes-degre2.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import {
  fonctionPolynomeFactorisee, caracteristiquesParabole, deuxiemeRacine,
  evaluerPolynomeDegre2, dessinerCourbe,
} from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre-1ere.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_P3 = {
  '2nde-remi': {
    contexte: "La trajectoire d'un copeau lors d'un usinage, ou la surface d'une pièce en fonction d'une dimension, se modélise par une fonction polynôme de degré 2.",
    problematique: "Pour quelles dimensions la surface (ou la contrainte étudiée) reste-t-elle dans une plage acceptable ?",
  },
  '2nde-mcc': {
    contexte: "La quantité de tissu nécessaire à une découpe évolue avec une dimension du patron selon une loi polynomiale de degré 2.",
    problematique: "Pour quelles dimensions du patron la quantité de tissu reste-t-elle dans une plage acceptable ?",
  },
  '2nde-gatl': {
    contexte: "Le volume optimal de chargement d'un véhicule en fonction d'une dimension de la caisse se modélise par une fonction polynôme de degré 2.",
    problematique: "Pour quelles dimensions le volume de chargement reste-t-il positif et exploitable ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ---------- Onglet 1 : étudier une parabole ---------- */

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

function initEtudierParabole() {
  document.getElementById('ep-calculer')?.addEventListener('click', etudierParabole);
  etudierParabole();
}

/* ---------- Onglet 2 : racine manquante ---------- */

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

function initRacineManquante() {
  document.getElementById('rm-calculer')?.addEventListener('click', trouverRacineManquante);
  trouverRacineManquante();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_P3 });
initEtudierParabole();
initRacineManquante();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Découvrir les fonctions polynômes de degré 2', tp: 'P3' });

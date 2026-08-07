/**
 * /js/tp05-derivation-variations.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import {
  evaluerPolynomeDegre2, deriveePolynomeDegre2, equationTangente,
  fonctionInverse, dessinerCourbe,
} from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre-1ere.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_P4 = {
  '1ere-tci': {
    contexte: "L'effort de cintrage exercé sur une tôle lors d'une opération de chaudronnerie évolue avec l'angle de pliage selon une loi que l'on peut approcher localement par sa tangente.",
    problematique: "Quel est le taux de variation de l'effort de cintrage pour un angle de pliage donné, et pour quel angle cet effort est-il minimal ?",
  },
  '1ere-trpm': {
    contexte: "La force de coupe exercée par l'outil lors d'une opération d'usinage évolue avec la vitesse d'avance selon une loi que l'on peut approcher localement par sa tangente.",
    problematique: "Comment évolue la force de coupe pour une vitesse d'avance donnée, et pour quelle vitesse cette force est-elle minimale ?",
  },
  '1ere-mcc': {
    contexte: "Le coût de production d'une pièce en cuir évolue avec la quantité fabriquée en série selon une loi que l'on peut approcher localement par sa tangente.",
    problematique: "Comment évolue le coût de production pour une quantité donnée, et pour quelle quantité fabriquée ce coût est-il minimal ?",
  },
  '1ere-log': {
  contexte: "Le coût de stockage dans un entrepôt logistique évolue avec la quantité de marchandises stockées selon une loi que l'on peut approcher localement par sa tangente.",
  problematique: "Comment évolue le coût de stockage pour une quantité stockée donnée, et pour quelle quantité ce coût est-il minimal ?",
  },
  '1ere-agora': {
    contexte: "Le bénéfice réalisé par une entreprise évolue avec la quantité de produits vendus selon une loi que l'on peut approcher localement par sa tangente.",
    problematique: "Comment évolue le bénéfice pour une quantité vendue donnée, et pour quelle quantité ce bénéfice est-il maximal ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ---------- Onglet 1 : nombre dérivé et tangente ---------- */

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

function initTangente() {
  document.getElementById('tg-calculer')?.addEventListener('click', calculerTangente);
  calculerTangente();
}

/* ---------- Onglet 2 : fonction inverse ---------- */

function initFonctionInverse() {
  dessinerCourbe('fi-courbe', [
    { label: 'f(x) = 1/x', fn: fonctionInverse(), xMin: -3, xMax: -0.2 },
    { label: 'f(x) = 1/x', fn: fonctionInverse(), xMin: 0.2, xMax: 3 },
  ]);
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_P4 });
initTangente();
initFonctionInverse();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Nombre dérivé, tangente et variations d'une fonction", tp: 'P4' });

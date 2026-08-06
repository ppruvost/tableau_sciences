/**
 * tp-algebre-1ere/js/tp02-resolution-graphique.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { dessinerCourbe, trouverIntersections, intervallesInequation } from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre-1ere.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_P2 = {
  '2nde-remi': {
    contexte: "Deux méthodes d'usinage ont des coûts qui évoluent différemment avec la quantité de pièces produites.",
    problematique: "Pour quelle quantité de pièces les deux méthodes coûtent-elles le même prix, et laquelle choisir selon la quantité ?",
  },
  '2nde-mcc': {
    contexte: "Deux fournisseurs de tissu proposent des tarifs qui évoluent différemment avec la quantité commandée.",
    problematique: "À partir de quelle quantité commandée un fournisseur devient-il plus avantageux que l'autre ?",
  },
  '2nde-gatl': {
    contexte: "Deux transporteurs proposent des tarifs qui évoluent différemment avec la distance parcourue.",
    problematique: "À partir de quelle distance un transporteur devient-il plus avantageux que l'autre ?",
  },
};

function construireFonction(type, coef1, coef2) {
  return type === 'carre' ? (x) => coef1 * x ** 2 : (x) => coef1 * x + coef2;
}

function libelleFonction(nom, type, coef1, coef2) {
  return type === 'carre' ? `${nom}(x) = ${coef1}x²` : `${nom}(x) = ${coef1}x + ${coef2}`;
}

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
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
  const actualiser = () => { groupe.style.display = select.value === 'carre' ? 'none' : ''; };
  select?.addEventListener('change', actualiser);
  actualiser();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_P2 });
basculerChampCoef2('rg-type-f', 'rg-f-coef2-groupe');
basculerChampCoef2('rg-type-g', 'rg-g-coef2-groupe');
document.getElementById('rg-resoudre')?.addEventListener('click', tracerEtResoudre);
tracerEtResoudre();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Résoudre graphiquement des équations et des inéquations", tp: 'P2' });

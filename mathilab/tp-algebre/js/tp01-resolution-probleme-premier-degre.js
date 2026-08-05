import { initContextePro } from '../../js/contexte-pro.js';
import { resoudreEquationPremierDegre, resoudreInequationPremierDegre, tracerDroiteEtHorizontale } from '../../js/algebre.js';
import { initRadarCompetences } from './radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import FILIERES_PRO from '../../data/filieres.js';

const CONTEXTES_A1 = {
  '2nde-remi': {
    contexte: "Un sous-traitant propose plusieurs tarifs d'usinage : frais fixes + prix à la pièce. Choisir le tarif le plus avantageux dépend du nombre de pièces commandées.",
    problematique: "À partir de combien de pièces un tarif avec frais fixes devient-il plus avantageux qu'un tarif au prix unitaire seul ?",
  },
  '2nde-mcc': {
    contexte: "Un atelier de confection doit acheter du tissu dans la limite d'un budget fixé, en plus de frais de teinture indépendants du métrage.",
    problematique: "Quel métrage de tissu maximal peut-on acheter sans dépasser le budget disponible ?",
  },
  '2nde-gatl': {
    contexte: "Un transporteur doit livrer un client dans un délai imposé, en tenant compte d'un temps de chargement fixe et d'une vitesse moyenne de trajet.",
    problematique: "Jusqu'à quelle distance de livraison le délai imposé par le client reste-t-il respecté ?",
  },
};

/* ---------- Onglet 1 : équation ---------- */
function initEquation() {
  const btn = document.getElementById('eq-resoudre');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const a = parseFloat(document.getElementById('eq-a').value) || 0;
    const b = parseFloat(document.getElementById('eq-b').value) || 0;
    const c = parseFloat(document.getElementById('eq-c').value) || 0;

    document.getElementById('eq-enonce').textContent = `Équation à résoudre : ${a} x + ${b} = ${c}`;

    const res = resoudreEquationPremierDegre(a, b, c);
    const div = document.getElementById('eq-etapes');
    div.innerHTML = res.solvable
      ? res.etapes.map(l => `<div>${l}</div>`).join('') + `<div style="margin-top:var(--gap-sm);"><strong>Solution : x = ${Number(res.x.toFixed(4))}</strong></div>`
      : res.message;
  });
  btn.click();
}

/* ---------- Onglet 2 : inéquation ---------- */
function initInequation() {
  const btn = document.getElementById('ineq-resoudre');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const a = parseFloat(document.getElementById('ineq-a').value) || 0;
    const b = parseFloat(document.getElementById('ineq-b').value) || 0;
    const c = parseFloat(document.getElementById('ineq-c').value) || 0;
    const signe = document.getElementById('ineq-signe').value;
    const symboles = { lt: '<', le: '≤', gt: '>', ge: '≥' };

    document.getElementById('ineq-enonce').textContent = `Inéquation à résoudre : ${a} x + ${b} ${symboles[signe]} ${c}`;

    const res = resoudreInequationPremierDegre(a, b, c, signe);
    const div = document.getElementById('ineq-etapes');
    div.innerHTML = res.solvable
      ? res.etapes.map(l => `<div>${l}</div>`).join('') + `<div style="margin-top:var(--gap-sm);"><strong>Solution : S = ${res.intervalle}</strong></div>`
      : res.message;
  });
  btn.click();
}

/* ---------- Onglet 3 : résolution graphique ---------- */
function initResolutionGraphique() {
  const btn = document.getElementById('gr-tracer');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const a = parseFloat(document.getElementById('gr-a').value) || 0;
    const b = parseFloat(document.getElementById('gr-b').value) || 0;
    const c = parseFloat(document.getElementById('gr-c').value) || 0;

    const { xInter } = tracerDroiteEtHorizontale('gr-graphique', a, b, c);

    const div = document.getElementById('gr-resultat');
    div.textContent = a !== 0
      ? `Point d'intersection : x ≈ ${Number(xInter.toFixed(4))} (droite bleue = y = ${a} x + ${b} ; droite pointillée = y = ${c})`
      : "a doit être différent de 0 pour tracer une droite oblique.";
  });
  btn.click();
}

initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_A1 });
initEquation();
initInequation();
initResolutionGraphique();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Résolution d'un problème du premier degré", tp: 'A1' });

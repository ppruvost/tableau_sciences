/**
 * tp-algebre-1ere/js/tp05-calculs-commerciaux-financiers.js
 */
import FILIERES_PRO from '../../../data/filieres.js';
import { initContextePro } from '../../../js/contexte-pro.js';
import { capitalInteretsSimples, tauxProportionnel, coutMarginalExact, coutMarginalApproche, coutMoyen } from '../../../js/finance.js';
import { evaluerPolynomeDegre2, deriveePolynomeDegre2 } from '../../../js/algebre.js';
import { initRadarCompetences } from '../../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre-1ere.js';
import { initOngletsParFiliere } from '../../../js/onglets-filiere.js';

const CONTEXTES_P5 = {};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ---------- Onglet 1 : intérêts simples ---------- */

function calculerInteretsSimples() {
  const c0 = parseFloat(document.getElementById('is-c0').value);
  const t = parseFloat(document.getElementById('is-t').value);
  const n = parseInt(document.getElementById('is-n').value, 10);
  if (Number.isNaN(c0) || Number.isNaN(t) || Number.isNaN(n)) return;

  const cn = capitalInteretsSimples(c0, t, n);
  document.getElementById('is-resultat').textContent =
    `c${n} = ${c0} × (1 + ${t} × ${n}) ≈ ${formater(cn)} €.`;
}

function calculerTauxProportionnel() {
  const tauxAnnuel = parseFloat(document.getElementById('tp-annuel').value);
  const periodes = parseInt(document.getElementById('tp-periode').value, 10);
  if (Number.isNaN(tauxAnnuel) || Number.isNaN(periodes)) return;

  const taux = tauxProportionnel(tauxAnnuel, periodes);
  document.getElementById('tp-resultat').textContent =
    `${tauxAnnuel} / ${periodes} ≈ ${(taux * 100).toFixed(4)} % par période.`;
}

function initInteretsSimples() {
  document.getElementById('is-calculer')?.addEventListener('click', calculerInteretsSimples);
  document.getElementById('tp-calculer')?.addEventListener('click', calculerTauxProportionnel);
  calculerInteretsSimples();
}

/* ---------- Onglet 2 : coûts ---------- */

function calculerCouts() {
  const a = parseFloat(document.getElementById('ct-a').value);
  const b = parseFloat(document.getElementById('ct-b').value);
  const c = parseFloat(document.getElementById('ct-c').value);
  const x = parseInt(document.getElementById('ct-x').value, 10);
  if ([a, b, c, x].some((v) => Number.isNaN(v)) || x <= 0) return;

  const C = (q) => evaluerPolynomeDegre2([a, b, c], q);
  const [dA, dB] = deriveePolynomeDegre2([a, b]);
  const Cprime = (q) => dA * q + dB;

  const coutTotal = C(x);
  const marginalExact = coutMarginalExact(C, x);
  const marginalApproche = coutMarginalApproche(Cprime, x);
  const moyen = coutMoyen(C, x);

  document.getElementById('ct-tbody').innerHTML = `
    <tr><td>Coût total C(${x})</td><td>${formater(coutTotal)} €</td></tr>
    <tr><td>Coût marginal exact Cm(${x}) = C(${x + 1}) − C(${x})</td><td>${formater(marginalExact)} €</td></tr>
    <tr><td>Coût marginal approché C'(${x})</td><td>${formater(marginalApproche)} €</td></tr>
    <tr><td>Coût moyen unitaire C(${x}) / ${x}</td><td>${formater(moyen)} €</td></tr>
  `;
}

function initCouts() {
  document.getElementById('ct-calculer')?.addEventListener('click', calculerCouts);
  calculerCouts();
}

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_P5 });
initInteretsSimples();
initCouts();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Calculs commerciaux et financiers', tp: 'P5' });

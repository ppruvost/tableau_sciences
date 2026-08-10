/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * TD05 : Calculs commerciaux et financiers
 * (1ère : intérêts simples, coût marginal/moyen /
 *  Tle : intérêts composés, amortissement d'un emprunt)
 * mathilab/tp-algebre/js/td05-calculs-commerciaux-financiers.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {
  capitalInteretsSimples, tauxProportionnel, coutMarginalExact, coutMarginalApproche, coutMoyen,
  capitalInteretsComposes, dureePourCapital, tableauAmortissementAnnuitesConstantes,
  tableauAmortissementConstant, coutEmprunt, tauxMensuelEquivalent,
} from '../../js/finance.js';
import { evaluerPolynomeDegre2, deriveePolynomeDegre2 } from '../../js/algebre.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_TD05 = {
  '2nde-remi': {
    contexte: "L'achat d'une nouvelle machine-outil peut être financé par un emprunt, ou son coût de fonctionnement suivi via un coût marginal/moyen ; le mode de remboursement influe sur le coût total de l'emprunt.",
    problematique: "Quel mode de placement, de production ou de remboursement choisir pour la machine-outil au meilleur coût ?",
  },
  '2nde-mcc': {
    contexte: "L'achat de nouvelles machines à coudre peut être financé par un emprunt ; le coût de production d'une série de vêtements dépend de la quantité fabriquée (coût marginal, coût moyen).",
    problematique: "Quel mode de remboursement minimise le coût total de l'emprunt, et pour quelle quantité produite le coût moyen est-il le plus favorable ?",
  },
  '2nde-gatl': {
    contexte: "L'achat d'un nouveau véhicule de livraison peut être financé par un emprunt ; le coût d'une tournée dépend du nombre de livraisons effectuées (coût marginal, coût moyen).",
    problematique: "Quel mode de remboursement choisir pour financer le véhicule, et comment évolue le coût d'une tournée selon le nombre de livraisons ?",
  },
  '1ere-log': {
    contexte: "Le prix d'achat d'un lot de marchandises fait l'objet de remises et de frais avant d'être intégré au coût de revient logistique ; un investissement (entrepôt, véhicule) peut être financé par un emprunt.",
    problematique: "Quel est le coût de revient réel d'un lot de marchandises, et quel mode de financement retenir pour un investissement logistique ?",
  },
  '1ere-agora': {
    contexte: "La facturation d'une prestation implique le calcul de remises et d'intérêts ; un investissement administratif peut être financé par un emprunt dont le coût dépend du mode de remboursement.",
    problematique: "Quel est le montant net à payer par le client, et quel mode de remboursement minimise le coût d'un emprunt pour la structure ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ============================================================
   NIVEAU 1ère — INTÉRÊTS SIMPLES (préfixe is-/tp-)
   ============================================================ */

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

/* ============================================================
   NIVEAU 1ère — COÛT MARGINAL ET COÛT MOYEN (préfixe ct-)
   ============================================================ */

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

/* ============================================================
   NIVEAU Tle — INTÉRÊTS COMPOSÉS (préfixe ic-)
   ============================================================ */

function calculerCapital() {
  const c0 = parseFloat(document.getElementById('ic-c0').value);
  const t = parseFloat(document.getElementById('ic-t').value);
  const n = parseInt(document.getElementById('ic-n').value, 10);
  if (Number.isNaN(c0) || Number.isNaN(t) || Number.isNaN(n)) return;

  const cn = capitalInteretsComposes(c0, t, n);
  document.getElementById('ic-resultat').textContent =
    `c${n} = ${c0} × (1 + ${t})^${n} ≈ ${formater(cn)} €.`;
}

function calculerDuree() {
  const c0 = parseFloat(document.getElementById('ic-c0').value);
  const t = parseFloat(document.getElementById('ic-t').value);
  const cible = parseFloat(document.getElementById('ic-cible').value);
  if (Number.isNaN(c0) || Number.isNaN(t) || Number.isNaN(cible)) return;

  const n = dureePourCapital(c0, t, cible);
  document.getElementById('ic-resultat-duree').textContent = n === null
    ? 'Données invalides pour ce calcul.'
    : `Il faut environ ${formater(n)} périodes pour que ${c0} € atteignent ${cible} € au taux de ${t} par période.`;
}

function initInteretsComposes() {
  document.getElementById('ic-calculer')?.addEventListener('click', calculerCapital);
  document.getElementById('ic-duree')?.addEventListener('click', calculerDuree);
  calculerCapital();
}

/* ============================================================
   NIVEAU Tle — AMORTISSEMENT (préfixe am-/tm-)
   ============================================================ */

function genererTableauAmortissement() {
  const capital = parseFloat(document.getElementById('am-capital').value);
  const taux = parseFloat(document.getElementById('am-taux').value);
  const duree = parseInt(document.getElementById('am-duree').value, 10);
  const mode = document.getElementById('am-mode').value;
  if (Number.isNaN(capital) || Number.isNaN(taux) || Number.isNaN(duree) || duree < 1) return;

  const tableau = mode === 'annuites-constantes'
    ? tableauAmortissementAnnuitesConstantes(capital, taux, duree)
    : tableauAmortissementConstant(capital, taux, duree);

  document.getElementById('am-tbody').innerHTML = tableau.map((ligne) => `
    <tr>
      <td>${ligne.periode}</td>
      <td>${formater(ligne.capitalDebut)}</td>
      <td>${formater(ligne.interet)}</td>
      <td>${formater(ligne.amortissement)}</td>
      <td>${formater(ligne.annuite)}</td>
      <td>${formater(ligne.capitalFin)}</td>
    </tr>
  `).join('');

  document.getElementById('am-cout').textContent =
    `Coût total de l'emprunt (somme des intérêts versés) : ${formater(coutEmprunt(tableau))} €.`;
}

function calculerTauxMensuel() {
  const tauxAnnuel = parseFloat(document.getElementById('tm-annuel').value);
  if (Number.isNaN(tauxAnnuel)) return;
  const tauxMensuel = tauxMensuelEquivalent(tauxAnnuel);
  document.getElementById('tm-resultat').textContent =
    `Taux mensuel équivalent à un taux annuel de ${tauxAnnuel} : (1 + ${tauxAnnuel})^(1/12) − 1 ≈ ${(tauxMensuel * 100).toFixed(3)} % par mois.`;
}

function initAmortissement() {
  document.getElementById('am-generer')?.addEventListener('click', genererTableauAmortissement);
  document.getElementById('tm-calculer')?.addEventListener('click', calculerTauxMensuel);
  genererTableauAmortissement();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_TD05 });

initInteretsSimples();
initCouts();

initInteretsComposes();
initAmortissement();

initRadarCompetences();
initImpressionCompteRendu({ titre: 'Calculs commerciaux et financiers', tp: 'TD05' });

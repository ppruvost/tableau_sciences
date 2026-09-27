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

import { initPuzzle, CADRES, fmt, polynome } from './puzzle-algebre.js';

const CONTEXTES_TD05 = {
  '1ere-trpm': {
    contexte: "L'achat d'une nouvelle machine-outil peut être financé sur trésorerie placée à intérêts simples ; le coût de fonctionnement se suit via un coût marginal/moyen.",
    problematique: "Quel capital obtient-on en plaçant une trésorerie à intérêts simples, et pour quelle quantité produite le coût moyen unitaire est-il le plus favorable ?",
  },
  '1ere-tci': {
    contexte: "L'achat d'un nouvel équipement de chaudronnerie peut être financé sur trésorerie placée à intérêts simples ; le coût de production d'une série de pièces dépend de la quantité fabriquée.",
    problematique: "Quel capital obtient-on en plaçant une trésorerie à intérêts simples, et pour quelle quantité produite le coût moyen unitaire est-il le plus favorable ?",
  },
  '1ere-mcc': {
    contexte: "L'achat de nouvelles machines à coudre peut être financé sur trésorerie placée à intérêts simples ; le coût de production d'une série de vêtements dépend de la quantité fabriquée.",
    problematique: "Quel capital obtient-on en plaçant une trésorerie à intérêts simples, et pour quelle quantité produite le coût moyen unitaire est-il le plus favorable ?",
  },
  '1ere-log': {
    contexte: "Le prix d'achat d'un lot de marchandises fait l'objet de remises et de frais avant d'être intégré au coût de revient logistique ; une trésorerie disponible peut être placée à intérêts simples.",
    problematique: "Quel est le coût de revient réel d'un lot de marchandises, et quel capital obtient-on en plaçant une trésorerie à intérêts simples ?",
  },
  '1ere-agora': {
    contexte: "La facturation d'une prestation implique le calcul de remises et d'intérêts ; une trésorerie disponible peut être placée à intérêts simples en attendant un investissement.",
    problematique: "Quel est le montant net à payer par le client, et quel capital obtient-on en plaçant une trésorerie à intérêts simples ?",
  },
  'tle-trpm': {
    contexte: "L'achat d'une nouvelle machine-outil peut être financé par un emprunt, dont le mode de remboursement influe sur son coût total.",
    problematique: "Quel mode de remboursement choisir pour financer la machine-outil au meilleur coût ?",
  },
  'tle-tci': {
    contexte: "L'achat d'un nouvel équipement de chaudronnerie peut être financé par un emprunt, dont le mode de remboursement influe sur son coût total.",
    problematique: "Quel mode de remboursement choisir pour financer l'équipement au meilleur coût ?",
  },
  'tle-mcc': {
    contexte: "L'achat de nouvelles machines à coudre peut être financé par un emprunt, dont le coût dépend du mode de remboursement.",
    problematique: "Quel mode de remboursement minimise le coût total de l'emprunt pour l'atelier ?",
  },
  'tle-log': {
    contexte: "L'achat d'un nouveau véhicule de livraison peut être financé par un emprunt, dont le coût dépend du mode de remboursement.",
    problematique: "Quel mode de remboursement choisir pour financer le véhicule au meilleur coût ?",
  },
  'tle-agora': {
    contexte: "Un investissement administratif (matériel de bureau, logiciel) peut être financé par un emprunt dont le coût dépend du mode de remboursement.",
    problematique: "Quel mode de remboursement minimise le coût total de l'emprunt pour la structure ?",
  },
};

/* ============================================================
   ACTIVITÉS PUZZLE — sujets A/B/C liés à la filière choisie
   (extrait du niveau-filière : mêmes montants pour 1ère et Tle
   d'une même filière, activité de synthèse transversale)
   ============================================================ */

const PUZZLE_TD05 = {
  trpm: { capital: 8000, taux: 0.035, duree: 4, materiel: 'la machine-outil' },
  tci: { capital: 9500, taux: 0.032, duree: 5, materiel: 'l’équipement de chaudronnerie' },
  mcc: { capital: 6000, taux: 0.030, duree: 3, materiel: 'les machines à coudre' },
  log: { capital: 15000, taux: 0.028, duree: 5, materiel: 'le véhicule de livraison' },
  agora: { capital: 4000, taux: 0.025, duree: 3, materiel: 'le matériel de bureau' },
};

function filiereDepuisCle(cle) {
  const partie = cle ? cle.split('-')[1] : null;
  return partie && PUZZLE_TD05[partie] ? partie : null;
}

function construirePuzzleTD05(cle) {
  const fil = filiereDepuisCle(cle);
  const d = fil ? PUZZLE_TD05[fil] : null;
  if (!d) return null;
  const tle = cle.startsWith('tle');
  const cadre = CADRES[fil];
  const { capital: C, taux: t, duree: n, materiel } = d;
  const tp = fmt(t * 100);
  if (!tle) {
    return {
      A: {
        contexte: `${cadre}, une trésorerie de ${fmt(C)} € est placée ${n} ans à ${tp} % par an, à intérêts simples, pour financer ${materiel}.`,
        problematique: `Quel capital disposera-t-on au bout de ${n} ans avec des intérêts simples ?`,
        questions: [
          `Calculer l'intérêt versé au bout d'un an (I = C × t).`,
          `En déduire les intérêts totaux sur ${n} ans.`,
          `Calculer le capital final.`,
          `Vérifier avec un tableau année par année (capital, intérêts).`,
          `Répondre à la problématique par une phrase, avec l'unité.`] },
      B: {
        contexte: `${cadre}, la même trésorerie de ${fmt(C)} € est placée ${n} ans à ${tp} % par an, mais à intérêts composés : les intérêts de chaque année sont ajoutés au capital.`,
        problematique: `Quel capital et quels intérêts obtient-on au bout de ${n} ans avec des intérêts composés ?`,
        questions: [
          `Donner le coefficient multiplicateur annuel 1 + t.`,
          `Calculer le capital après 1 an, puis après 2 ans.`,
          `Appliquer la formule C × (1 + t)^n pour n = ${n}.`,
          `En déduire les intérêts totaux.`,
          `Répondre à la problématique par une phrase, avec l'unité.`] },
      C: {
        contexte: `${cadre}, le responsable hésite entre un placement à intérêts simples et un placement à intérêts composés (même capital, même taux, même durée).`,
        problematique: `Quel placement choisir pour financer ${materiel} le plus rapidement ?`,
        questions: [
          `Calculer les intérêts totaux à intérêts simples.`,
          `Calculer les intérêts totaux à intérêts composés.`,
          `Calculer l'écart en euros, puis en pourcentage des intérêts simples.`,
          `Expliquer pourquoi l'écart augmente chaque année.`,
          `Répondre à la problématique par une recommandation argumentée.`] },
    };
  }
  return {
    A: {
      contexte: `${cadre}, l'achat de ${materiel} coûte ${fmt(C)} € ; il est financé par un emprunt sur ${n} ans au taux annuel de ${tp} %, remboursé par annuités constantes.`,
      problematique: `Quel est le coût total de cet emprunt remboursé par annuités constantes ?`,
      questions: [
        `Calculer l'annuité constante a = C × t / (1 − (1 + t)^(−n)).`,
        `Pour l'année 1, calculer les intérêts, l'amortissement (a − intérêts) et le capital restant dû.`,
        `Compléter le tableau d'amortissement pour les ${n} années.`,
        `Calculer le coût total de l'emprunt (n × a − C).`,
        `Répondre à la problématique par une phrase, avec l'unité.`] },
    B: {
      contexte: `${cadre}, pour le même emprunt de ${fmt(C)} € sur ${n} ans à ${tp} %, la banque propose un remboursement par amortissement constant : la même part de capital est remboursée chaque année.`,
      problematique: `Quel est le coût total de l'emprunt remboursé par amortissement constant ?`,
      questions: [
        `Calculer l'amortissement annuel constant C / n.`,
        `Calculer les intérêts et l'annuité de l'année 1.`,
        `Compléter le tableau d'amortissement pour les ${n} années.`,
        `Calculer le coût total de l'emprunt (somme des intérêts).`,
        `Répondre à la problématique par une phrase, avec l'unité.`] },
    C: {
      contexte: `${cadre}, la banque propose deux modes de remboursement pour financer ${materiel} (${fmt(C)} € sur ${n} ans à ${tp} %) : annuités constantes ou amortissement constant.`,
      problematique: `Quel mode de remboursement choisir pour financer ${materiel} ?`,
      questions: [
        `Calculer le coût total de chaque mode de remboursement.`,
        `Comparer les annuités de la première année.`,
        `Comparer les coûts totaux et calculer l'économie réalisée.`,
        `Discuter : quel mode pèse le moins sur la trésorerie les premières années ?`,
        `Répondre à la problématique par une recommandation argumentée.`] },
  };
}

function initActivitesPuzzleTD05() {
  initPuzzle(construirePuzzleTD05);
}

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

initActivitesPuzzleTD05();

initRadarCompetences();
initImpressionCompteRendu({ titre: 'Calculs commerciaux et financiers', tp: 'TD05' });
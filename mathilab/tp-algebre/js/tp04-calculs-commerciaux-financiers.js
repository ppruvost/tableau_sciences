/**
 * tp-algebre/js/tp04-calculs-commerciaux-financiers.js
 */
import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {
  capitalInteretsComposes, dureePourCapital, tableauAmortissementAnnuitesConstantes,
  tableauAmortissementConstant, coutEmprunt, tauxMensuelEquivalent,
} from '../../js/finance.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_A4 = {
  '2nde-remi': {
    contexte: "L'achat d'une nouvelle machine-outil peut être financé par un emprunt, dont le mode de remboursement influe sur son coût total.",
    problematique: "Quel mode de remboursement choisir pour financer la machine-outil au meilleur coût ?",
  },
  '2nde-mcc': {
    contexte: "L'achat de nouvelles machines à coudre peut être financé par un emprunt, dont le coût dépend du mode de remboursement.",
    problematique: "Quel mode de remboursement minimise le coût total de l'emprunt pour l'atelier ?",
  },
  '2nde-gatl': {
    contexte: "L'achat d'un nouveau véhicule de livraison peut être financé par un emprunt, dont le coût dépend du mode de remboursement.",
    problematique: "Quel mode de remboursement choisir pour financer le véhicule au meilleur coût ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? v.toFixed(2) : v;
}

/* ---------- Onglet 1 : intérêts composés ---------- */

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

/* ---------- Onglet 2 : amortissement ---------- */

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

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_A4 });
initInteretsComposes();
initAmortissement();
initRadarCompetences();
initImpressionCompteRendu({ titre: 'Calculs commerciaux et financiers', tp: 'A4' });

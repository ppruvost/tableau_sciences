/**
 * tp-statistiques/js/tp05-tableau-croise-arbre-pondere.js
 */
import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {regrouperEnClasses, classeModale, dessinerDiagrammeBarres, dessinerDiagrammeSecteurs } from '../../js/statistiques.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-statistiques.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_S5 = {
  '1ere-tci': { contexte: "Un contrôle qualité croise souvent le poste de chaudronnerie et la conformité de la pièce produite.", problematique: "La conformité d'une pièce dépend-elle du poste qui l'a produite ?" },
  'tle-tci': { contexte: "Deux contrôles successifs sur une même chaîne de production peuvent être représentés par un arbre pondéré.", problematique: "Les résultats de deux contrôles successifs sont-ils indépendants ?" },
  '1ere-trpm': { contexte: "Un contrôle qualité croise souvent l'outillage utilisé et la conformité du produit mécanique réalisé.", problematique: "La conformité d'une pièce dépend-elle de l'outillage utilisé pour la réaliser ?" },
  'tle-trpm': { contexte: "Deux contrôles successifs sur un outillage en maintenance peuvent être représentés par un arbre pondéré.", problematique: "Les résultats de deux contrôles successifs sur un outillage sont-ils indépendants ?" },
  '1ere-mcc': { contexte: "Un contrôle qualité croise souvent l'atelier de confection et la présence d'un défaut sur la pièce.", problematique: "Le taux de non-conformité dépend-il de l'atelier de confection ?" },
  'tle-mcc': { contexte: "Deux contrôles qualité successifs en confection peuvent être représentés par un arbre pondéré.", problematique: "Les résultats de deux contrôles qualité successifs sont-ils indépendants ?" },
  '1ere-agora': { contexte: "Un suivi administratif croise souvent le service émetteur et le respect du délai de traitement d'un dossier.", problematique: "Le respect du délai dépend-il du service qui traite le dossier ?" },
  'tle-agora': { contexte: "Deux étapes successives de traitement d'un dossier peuvent être représentées par un arbre pondéré.", problematique: "Les résultats de deux étapes de traitement successives sont-ils indépendants ?" },
  '1ere-log': { contexte: "Un suivi logistique croise souvent la zone de livraison et le respect du délai annoncé.", problematique: "Le taux de retard dépend-il de la zone de livraison ?" },
  'tle-log': { contexte: "Deux étapes successives d'un parcours logistique peuvent être représentées par un arbre pondéré.", problematique: "Les résultats de deux étapes logistiques successives sont-ils indépendants ?" },
};

/* ---------- Onglet 1 : tableau croisé ---------- */
function initTableauCroise() {
  document.getElementById('tc-calculer')?.addEventListener('click', () => {
    const nAB = parseInt(document.getElementById('tc-nab').value, 10) || 0;
    const nABbarre = parseInt(document.getElementById('tc-nabbarre').value, 10) || 0;
    const nAbarreB = parseInt(document.getElementById('tc-nabarreb').value, 10) || 0;
    const nAbarreBbarre = parseInt(document.getElementById('tc-nabarrebbarre').value, 10) || 0;

    const total = nAB + nABbarre + nAbarreB + nAbarreBbarre;
    const tbody = document.getElementById('tc-tbody-resultats');
    if (total === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Renseigner au moins un effectif non nul.</td></tr>';
      return;
    }

    const nA = nAB + nABbarre;
    const nAbarre = nAbarreB + nAbarreBbarre;
    const nB = nAB + nAbarreB;

    const pA = nA / total;
    const pB = nB / total;
    const pAinterB = nAB / total;
    const pAB = nA ? nAB / nA : null; // P_A(B)

    const lignes = [
      ['P(A)', pA], ['P(B)', pB], ['P(A ∩ B)', pAinterB],
      ['P(A ∪ B)', pA + pB - pAinterB],
      ['P_A(B) (sachant A)', pAB],
    ];
    tbody.innerHTML = lignes.map(([l, v]) => `<tr><td>${l}</td><td>${v === null ? '—' : v.toFixed(3)}</td></tr>`).join('');
  });
}

/* ---------- Onglet 2 (Tle) : arbre pondéré ---------- */
function initArbrePondere() {
  document.getElementById('ap-construire')?.addEventListener('click', () => {
    const pA = (parseFloat(document.getElementById('ap-pa').value) || 0) / 100;
    const pAB = (parseFloat(document.getElementById('ap-pab').value) || 0) / 100;
    const pAbarreB = (parseFloat(document.getElementById('ap-pabarreb').value) || 0) / 100;
    const pAbarre = 1 - pA;

    const chemins = [
      ['A', 'B', pA * pAB],
      ['A', 'B̄', pA * (1 - pAB)],
      ['Ā', 'B', pAbarre * pAbarreB],
      ['Ā', 'B̄', pAbarre * (1 - pAbarreB)],
    ];
    document.getElementById('ap-tbody').innerHTML = chemins
      .map(([a, b, p]) => `<tr><td>${a}</td><td>${b}</td><td>${a} puis ${b}</td><td>${p.toFixed(4)}</td></tr>`).join('');

    const pB = pA * pAB + pAbarre * pAbarreB;
    document.getElementById('ap-pb').textContent = `P(B) = P(A∩B) + P(Ā∩B) = ${pB.toFixed(4)}`;

    const independants = Math.abs(pAB - pAbarreB) < 0.005;
    document.getElementById('ap-independance').textContent = independants
      ? `P_A(B) ≈ P_Ā(B) : A et B semblent indépendants.`
      : `P_A(B) ≠ P_Ā(B) : A et B ne semblent pas indépendants.`;
  });
}

function gererNiveauAffiche() {
  const filiere = getFiliereSelectionnee();
  const estTle = filiere?.niveau === 'Tle';
  document.querySelectorAll('[data-niveau="tle"]').forEach(el => { el.style.display = estTle ? '' : 'none'; });
  const message = document.getElementById('s05-message-niveau');
  if (message) {
    message.textContent = estTle
      ? "Onglet « Arbre pondéré et indépendance » disponible pour le niveau Terminale."
      : "Sélectionner votre filière ci-dessus : l'onglet « Arbre pondéré et indépendance » n'apparaît qu'au niveau Terminale.";
  }
}

document.getElementById('select-filiere-pro')?.addEventListener('change', gererNiveauAffiche);

initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_S5 });
initTableauCroise();
initArbrePondere();
gererNiveauAffiche();
initRadarCompetences();
initImpressionCompteRendu({ titre: "Tableau croisé, conditionnement et arbre pondéré", tp: 'S5' });

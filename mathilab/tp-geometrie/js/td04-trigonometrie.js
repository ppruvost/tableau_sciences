/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * TD04 : Trigonométrie — cercle trigonométrique et fonctions
 * sinus/cosinus (1ère, groupement B : TRPM, TCI, MCC uniquement)
 * mathilab/tp-geometrie/js/td04-trigonometrie.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-geometrie.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_TD04 = {
  '1ere-trpm': {
    contexte: "En usinage, un angle de coupe ou une rotation de pièce sur un tour se décrivent à l'aide du cercle trigonométrique.",
    problematique: "Comment convertir un angle de rotation et en déterminer le cosinus et le sinus ?",
  },
  '1ere-tci': {
    contexte: "En chaudronnerie, un angle de pliage ou de cintrage se décrit à l'aide du cercle trigonométrique.",
    problematique: "Comment convertir un angle de pliage et en déterminer le cosinus et le sinus ?",
  },
  '1ere-mcc': {
    contexte: "En confection, un angle de coupe de tissu ou une rotation de patron se décrivent à l'aide du cercle trigonométrique.",
    problematique: "Comment convertir un angle de coupe et en déterminer le cosinus et le sinus ?",
  },
};

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : Math.round(v * 10000) / 10000) : v;
}

/* ============================================================
   CERCLE TRIGONOMÉTRIQUE ET CONVERSION D'ANGLES
   ============================================================ */

function calculerCercleTrigo() {
  const degres = parseFloat(document.getElementById('ct-degres').value);
  const zone = document.getElementById('ct-resultat');
  if (!zone || Number.isNaN(degres)) return;

  const radians = (degres * Math.PI) / 180;
  const cosinus = Math.cos(radians);
  const sinus = Math.sin(radians);

  zone.innerHTML = `
    ${degres}° = ${degres} × π / 180 ≈ ${formater(radians)} rad<br>
    cos(${formater(radians)}) ≈ ${formater(cosinus)}<br>
    sin(${formater(radians)}) ≈ ${formater(sinus)}
  `;
}

function initCercleTrigo() {
  document.getElementById('ct-calculer')?.addEventListener('click', calculerCercleTrigo);
  calculerCercleTrigo();
}

/* ============================================================
   FILTRAGE DES ONGLETS SELON LA FILIÈRE (groupement B
   uniquement : TRPM, TCI, MCC — module absent pour AGorA et
   Logistique, faute de filière "groupement A" dans le référentiel)
   ============================================================ */

function filtrerOngletsParFiliere() {
  const select = document.getElementById('select-filiere-pro');
  const zoneMessage = document.getElementById('td04-message-filiere');
  const zoneActivites = document.querySelector('.tabs-container');
  if (!select) return;

  function idFiliere(valeurSelect) {
    return (valeurSelect || '').split('-').pop();
  }

  function appliquerFiltre() {
    const filiere = idFiliere(select.value);
    let premierVisible = null;
    let toutCache = true;

    document.querySelectorAll('.tabs-header .tab-btn').forEach((bouton) => {
      const restriction = bouton.dataset.filieres;
      const visible = !restriction || !filiere || restriction.split(',').includes(filiere);

      bouton.style.display = visible ? '' : 'none';

      const panneau = document.getElementById(bouton.dataset.tab);
      if (!visible) {
        if (panneau) panneau.classList.remove('actif');
        bouton.classList.remove('actif');
      } else {
        toutCache = false;
        if (!premierVisible) premierVisible = bouton;
      }
    });

    const activeVisible = document.querySelector('.tabs-header .tab-btn.actif');
    if (!activeVisible && premierVisible) {
      premierVisible.classList.add('actif');
      const panneau = document.getElementById(premierVisible.dataset.tab);
      if (panneau) panneau.classList.add('actif');
    }

    if (zoneMessage) {
      if (toutCache && filiere) {
        zoneMessage.style.display = 'block';
        zoneMessage.textContent = "Ce TD (Trigonométrie) est réservé au groupement B (TRPM, TCI, MCC) : il ne concerne pas votre filière.";
        if (zoneActivites) zoneActivites.style.display = 'none';
      } else {
        zoneMessage.style.display = 'none';
        if (zoneActivites) zoneActivites.style.display = '';
      }
    }
  }

  select.addEventListener('change', appliquerFiltre);
  appliquerFiltre();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

function initialiserTD04() {
  initOngletsParFiliere();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_TD04
  });

  initCercleTrigo();
  filtrerOngletsParFiliere();

  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Trigonométrie : cercle trigonométrique et fonctions sinus/cosinus',
    tp: 'TD04'
  });
}

initialiserTD04();

/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * Outils partagés : ouverture de GéoGébra (3D / Classic) dans la page
 * mathilab/tp-geometrie/js/outils-geogebra.js
 * ============================================================
 * Les scripts des TD sont des modules ES : leurs fonctions ne sont pas
 * globales. Les boutons des fragments HTML utilisent onclick="loadInFrame(...)"
 * et onclick="loadGeoGebraClassic()", donc on les expose ici sur window
 * (sans écraser une définition déjà fournie par navigation.js).
 */

const URL_3D = 'https://www.geogebra.org/3d?embed&lang=fr';
const URL_CLASSIC = 'https://www.geogebra.org/classic?embed&lang=fr';

/** Retourne la barre d'outils la plus proche du bouton cliqué (ou la première de la page). */
function trouverBarre(bouton) {
  return (bouton && bouton.closest && bouton.closest('.toolbar'))
    || document.querySelector('#content .toolbar')
    || document.querySelector('.toolbar');
}

/**
 * Ouvre (ou ferme si la même adresse est déjà affichée) un cadre GéoGébra
 * juste sous la barre d'outils.
 */
export function loadInFrame(url, bouton) {
  const barre = trouverBarre(bouton || (window.event && window.event.target) || document.activeElement);
  if (!barre) { window.open(url, '_blank', 'noopener'); return; }

  let cadre = barre.nextElementSibling;
  if (!cadre || !cadre.classList.contains('cadre-geogebra')) {
    cadre = document.createElement('div');
    cadre.className = 'cadre-geogebra';
    barre.insertAdjacentElement('afterend', cadre);
  }

  if (cadre.dataset.url === url) {          // second clic : on referme
    cadre.remove();
    return;
  }

  cadre.dataset.url = url;
  cadre.innerHTML = '';

  const entete = document.createElement('div');
  entete.className = 'cadre-geogebra-entete';

  const lien = document.createElement('a');
  lien.href = url.replace('?embed&', '?');
  lien.target = '_blank';
  lien.rel = 'noopener';
  lien.textContent = '↗ Ouvrir dans un nouvel onglet';

  const fermer = document.createElement('button');
  fermer.type = 'button';
  fermer.className = 'btn btn-secondaire';
  fermer.textContent = '✕ Fermer';
  fermer.addEventListener('click', () => cadre.remove());

  entete.append(lien, fermer);

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = 'GéoGébra';
  iframe.loading = 'lazy';
  iframe.allow = 'fullscreen';
  iframe.setAttribute('allowfullscreen', '');

  cadre.append(entete, iframe);
  cadre.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─────────────────────────────────────────────────────────────
// GéoGébra 3D « direct » (sans iframe), comme code.js à la racine du projet :
// GéoGébra Classic avec la vue « 3D Graphiques » (perspective 5), dont le menu
// permet Ouvrir / Enregistrer sur l'ordinateur (ce que n'offre pas l'app « 3d »).
// Le script deployggb.js n'est chargé qu'au premier clic.
// ─────────────────────────────────────────────────────────────
const URL_DEPLOYGGB = 'https://www.geogebra.org/apps/deployggb.js';
const CLE_3D_DIRECT = 'ggb:3d-direct';
let chargementDeploy = null;

function chargerDeployGGB() {
  if (window.GGBApplet) return Promise.resolve();
  if (!chargementDeploy) {
    chargementDeploy = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = URL_DEPLOYGGB;
      script.onload = () => resolve();
      script.onerror = () => { chargementDeploy = null; reject(new Error('deployggb.js indisponible')); };
      document.head.appendChild(script);
    });
  }
  return chargementDeploy;
}

export async function loadGeoGebra3D(bouton) {
  const barre = trouverBarre(bouton || (window.event && window.event.target) || document.activeElement);
  if (!barre) { window.open('https://www.geogebra.org/3d?lang=fr', '_blank', 'noopener'); return; }

  let cadre = barre.nextElementSibling;
  if (!cadre || !cadre.classList.contains('cadre-geogebra')) {
    cadre = document.createElement('div');
    cadre.className = 'cadre-geogebra';
    barre.insertAdjacentElement('afterend', cadre);
  }

  if (cadre.dataset.url === CLE_3D_DIRECT) {   // second clic : on referme
    cadre.remove();
    return;
  }

  cadre.dataset.url = CLE_3D_DIRECT;
  cadre.innerHTML = '';

  const entete = document.createElement('div');
  entete.className = 'cadre-geogebra-entete';

  const lien = document.createElement('a');
  lien.href = 'https://www.geogebra.org/classic?lang=fr';
  lien.target = '_blank';
  lien.rel = 'noopener';
  lien.textContent = '↗ Ouvrir dans un nouvel onglet';

  const fermer = document.createElement('button');
  fermer.type = 'button';
  fermer.className = 'btn btn-secondaire';
  fermer.textContent = '✕ Fermer';
  fermer.addEventListener('click', () => cadre.remove());

  entete.append(lien, fermer);

  const conteneur = document.createElement('div');
  conteneur.className = 'ggb-conteneur';
  conteneur.id = 'ggb-3d-conteneur';
  conteneur.textContent = 'Chargement de GéoGébra 3D…';

  cadre.append(entete, conteneur);
  cadre.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  try {
    await chargerDeployGGB();
    if (!cadre.isConnected) return;            // fermé pendant le chargement
    conteneur.textContent = '';
    const params = {
      appName: 'classic',
      perspective: '5',                        // vue « 3D Graphiques » de Classic
      width: Math.max(320, Math.floor(conteneur.clientWidth || cadre.clientWidth || 800)),
      height: Math.max(480, Math.round(window.innerHeight * 0.7)),
      showToolBar: true,
      showAlgebraInput: true,
      showMenuBar: true,
      enableRightClick: true,
      enableShiftDragZoom: true,
      showResetIcon: true,
      useBrowserForJS: true,
      language: 'fr'
    };
    new window.GGBApplet(params, true).inject('ggb-3d-conteneur');
  } catch (e) {
    conteneur.textContent = 'GéoGébra n\u2019a pas pu être chargé (connexion Internet ?). Utilise le lien « Ouvrir dans un nouvel onglet ».';
  }
}
export function loadGeoGebraClassic(bouton) { loadInFrame(URL_CLASSIC, bouton); }

/** Navigation entre TD : réutilise les boutons du menu (data-module). */
function loadTP(nom) {
  const bouton = document.querySelector(`nav button[data-module="${nom}"]`);
  if (bouton) bouton.click();
}

export function exposerOutils() {
  if (typeof window.loadInFrame !== 'function') {
    // Les boutons inline appellent loadInFrame(url) : le bouton est retrouvé via l'élément actif.
    window.loadInFrame = (url) => loadInFrame(url, (window.event && window.event.target) || document.activeElement);
  }
  if (typeof window.loadGeoGebra3D !== 'function') {
    window.loadGeoGebra3D = () => loadGeoGebra3D((window.event && window.event.target) || document.activeElement);
  }
  if (typeof window.loadGeoGebraClassic !== 'function') {
    window.loadGeoGebraClassic = () => loadGeoGebraClassic((window.event && window.event.target) || document.activeElement);
  }
  if (typeof window.loadTP !== 'function') {
    window.loadTP = loadTP;
  }
}
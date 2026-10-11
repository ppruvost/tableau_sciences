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

export function loadGeoGebra3D(bouton) { loadInFrame(URL_3D, bouton); }
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
  if (typeof window.loadGeoGebraClassic !== 'function') {
    window.loadGeoGebraClassic = () => loadGeoGebraClassic((window.event && window.event.target) || document.activeElement);
  }
  if (typeof window.loadTP !== 'function') {
    window.loadTP = loadTP;
  }
}

/**
 * tp-thermique/js/zoom-illustrations.js
 *
 * Zoom des illustrations (img[data-zoom]) : bouton rond bleu « + » pour
 * ouvrir une fenêtre d'agrandissement, bouton rond bleu « − » pour la
 * fermer (même logique que le zoom éditeur/console de PyLab).
 * Fermeture aussi par la touche Échap ou un clic hors de l'image.
 * Aucun style en ligne : tout est dans les classes .zoom-* de style.css.
 */

let fenetre = null;
let imageZoom = null;
let declencheur = null;

function creerFenetre() {
  fenetre = document.createElement('div');
  fenetre.className = 'zoom-fenetre';
  fenetre.hidden = true;
  fenetre.setAttribute('role', 'dialog');
  fenetre.setAttribute('aria-modal', 'true');
  fenetre.setAttribute('aria-label', 'Illustration agrandie');

  const fermer = document.createElement('button');
  fermer.type = 'button';
  fermer.className = 'btn-zoom btn-zoom-fermer';
  fermer.setAttribute('aria-label', 'Fermer l\u2019agrandissement');
  fermer.textContent = '\u2212';
  fermer.addEventListener('click', fermerFenetre);

  imageZoom = document.createElement('img');
  imageZoom.className = 'zoom-image';
  imageZoom.alt = '';

  fenetre.append(fermer, imageZoom);
  fenetre.addEventListener('click', e => {
    if (e.target === fenetre) fermerFenetre();
  });
  document.body.appendChild(fenetre);
}

function ouvrirFenetre(img, bouton) {
  if (!fenetre) creerFenetre();
  imageZoom.src = img.currentSrc || img.src;
  imageZoom.alt = img.alt;
  fenetre.setAttribute('aria-label', img.alt || 'Illustration agrandie');
  declencheur = bouton || img;
  fenetre.hidden = false;
  document.body.classList.add('zoom-ouvert');
  fenetre.querySelector('.btn-zoom-fermer').focus();
}

function fermerFenetre() {
  if (!fenetre || fenetre.hidden) return;
  fenetre.hidden = true;
  imageZoom.removeAttribute('src');
  document.body.classList.remove('zoom-ouvert');
  declencheur?.focus?.();
}

export function initZoomIllustrations() {
  document.querySelectorAll('img[data-zoom]').forEach(img => {
    if (img.dataset.zoomPret) return;
    img.dataset.zoomPret = '1';

    const conteneur = img.closest('.mode-op') || img.parentElement;
    conteneur.classList.add('zoom-conteneur');

    const ouvrir = document.createElement('button');
    ouvrir.type = 'button';
    ouvrir.className = 'btn-zoom btn-zoom-ouvrir';
    ouvrir.setAttribute('aria-label', 'Agrandir l\u2019illustration');
    ouvrir.textContent = '+';
    ouvrir.addEventListener('click', () => ouvrirFenetre(img, ouvrir));
    conteneur.appendChild(ouvrir);

    img.addEventListener('click', () => ouvrirFenetre(img, ouvrir));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fermerFenetre();
  });
}

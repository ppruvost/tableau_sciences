/**
 * mathilab/tp-geometrie/js/outils-geogebra.js
 *
 * Ouverture de GéoGébra (3D / Classic) et de la calculatrice NumWorks
 * depuis les fragments du domaine Géométrie.
 *
 * Les fragments n'utilisent aucun attribut onclick : les boutons portent
 * data-ggb="3d" ou data-ggb="classique", les liens data-outil-index, et
 * sont câblés par initOutilsGeoGebra() (appelée par init() des contrôleurs).
 * Aucune fonction n'est exposée sur window (règle §7.3 de claude_v6.md).
 *
 * Si GéoGébra est utilisé par un autre domaine de MathiLab, ce module
 * devra être déplacé dans js/ (RACINE du site, point unique, §11).
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
  const barre = trouverBarre(bouton || document.activeElement);
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
  const barre = trouverBarre(bouton || document.activeElement);
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
    conteneur.textContent = 'GéoGébra n\u2019a pas pu être chargé (connexion Internet ?). Utiliser le lien « Ouvrir dans un nouvel onglet ».';
  }
}
export function loadGeoGebraClassic(bouton) { loadInFrame(URL_CLASSIC, bouton); }

/* ============================================================
   OUVERTURE DANS UN NOUVEL ONGLET DE LA PAGE PRINCIPALE
   ============================================================
 * Les outils GéoGébra (Classic / 3D) et Calculatrice sont des entrées de la
 * barre latérale de la page principale du laboratoire. Le bouton du TD ouvre
 * cette page dans un NOUVEL ONGLET (le TD en cours, et donc le travail de
 * l'élève, reste intact), puis y déclenche l'entrée voulue : même rendu
 * qu'un clic sur la barre latérale (outil dans la page, entrée surlignée).
 * Ordre de repli : 1) nouvel onglet de la page principale ; 2) visionneuse
 * du hub MathiLab si le navigateur bloque l'ouverture ; 3) comportement
 * d'origine du TD (TD ouvert seul).
 */

/** Fenêtres ancêtres accessibles (même origine), de la plus proche à la plus haute. */
function fenetresAncetres() {
  const liste = [];
  let w = window;
  try {
    while (w.parent && w.parent !== w) {
      w = w.parent;
      void w.document;              // lève une exception si l'origine diffère
      liste.push(w);
    }
  } catch { /* cadre d'une autre origine : on s'arrête */ }
  return liste;
}

function empreinte(el) {
  return [
    el.getAttribute('onclick'), el.getAttribute('href'), el.getAttribute('title'),
    el.getAttribute('aria-label'), el.dataset && (el.dataset.url || el.dataset.module || el.dataset.outil),
    el.textContent,
  ].filter(Boolean).join(' ');
}

/** Élément cliquable de la page `doc` dont l'empreinte correspond (feuilles de l'arbre en priorité). */
function trouverElement(doc, motif, { exact = false } = {}) {
  const candidats = [...doc.querySelectorAll('.menu-item, button, a, li, [onclick], [role="button"]')];
  const ok = (el) => (exact ? (el.textContent || '').trim() === motif : motif.test(empreinte(el)));
  const trouves = candidats.filter(ok);
  return trouves.find((el) => !el.querySelector('button, a, li, .menu-item')) || trouves[0] || null;
}

function cliquer(el) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: el.ownerDocument.defaultView }));
}

/** Déclenche l'entrée de l'outil dans la page principale `w`. @returns {boolean} true si une entrée a été trouvée. */
function declencherOutil(w, outil, url) {
  const doc = w.document;

  if (outil === 'numworks') {
    const entree = trouverElement(doc, /numworks|calculatrice/i);
    if (!entree) return false;
    cliquer(entree);
    return true;
  }

  const texteSousMenu = outil === 'ggb3d' ? '3D' : 'Classic';
  const sousMenu = trouverElement(doc, texteSousMenu, { exact: true });
  if (sousMenu) { cliquer(sousMenu); return true; }

  // Sous-menu non encore affiché : survol de l'entrée GéoGébra, puis nouvel essai.
  const entree = trouverElement(doc, /g[ée]og[ée]bra/i);
  if (!entree) return false;
  ['mouseenter', 'mouseover'].forEach((type) =>
    entree.dispatchEvent(new MouseEvent(type, { bubbles: true, view: w })));
  setTimeout(() => {
    const apres = trouverElement(doc, texteSousMenu, { exact: true });
    if (apres) cliquer(apres);
    else if (typeof w.loadInFrame === 'function') w.loadInFrame(url, entree);
    else w.location.href = url;
  }, 120);
  return true;
}

/** Adresse de la page principale du laboratoire (racine du site contenant /mathilab/). */
function urlPagePrincipale() {
  const hautes = fenetresAncetres();
  const haute = hautes[hautes.length - 1];
  if (haute) return haute.location.origin + haute.location.pathname;
  return new URL('../../', location.href).href;     // TD ouvert seul : .../mathilab/tp-geometrie/ → racine
}

/**
 * Ouvre l'outil dans un nouvel onglet de la page principale.
 * @param {'ggb3d'|'ggbclassic'|'numworks'} outil
 * @param {string} url - adresse directe de l'outil (dernier recours si l'entrée est introuvable)
 * @returns {boolean} false si le navigateur a bloqué l'ouverture
 */
export function ouvrirDansNouvelOnglet(outil, url) {
  const onglet = window.open(urlPagePrincipale(), '_blank');   // appel synchrone au clic : pas bloqué
  if (!onglet) return false;

  let essais = 0;
  let pret = 0;
  const minuteur = setInterval(() => {
    essais += 1;
    try {
      const doc = onglet.document;
      if (doc.readyState === 'complete' && doc.location.href !== 'about:blank') {
        pret += 1;
        if (pret >= 3 && declencherOutil(onglet, outil, url)) { clearInterval(minuteur); return; }  // laisse le temps aux scripts de la page de s'initialiser
      }
    } catch { /* page pas encore accessible */ }
    if (essais > 80) {                 // ~12 s : entrée introuvable → on ouvre l'outil directement
      clearInterval(minuteur);
      try { onglet.location.href = url; } catch { /* onglet fermé */ }
    }
  }, 150);
  return true;
}

/**
 * Repli : ouvre l'outil dans la visionneuse du hub MathiLab (mathilab/index.html).
 * @returns {boolean} true si le message a été envoyé, false si le TD est ouvert seul.
 */
function ouvrirDansHub(url, titre) {
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(
        { type: 'mathilab:ouvrir-outil', url: new URL(url, location.href).href, titre },
        window.location.origin
      );
      return true;
    } catch (err) {
      console.warn('[tp-geometrie] ouverture via le hub impossible :', err);
    }
  }
  return false;
}

/** Nouvel onglet de la page principale, sinon hub ; false si rien n'est possible (TD ouvert seul). */
export function ouvrirDansIndex(url, titre, outil) {
  return ouvrirDansNouvelOnglet(outil, url) || ouvrirDansHub(url, titre);
}

/** Câble les boutons [data-ggb] du fragment courant (une seule fois par bouton). */
export function initBoutonsGeoGebra() {
  document.querySelectorAll('[data-ggb]').forEach((bouton) => {
    if (bouton.dataset.ggbLie) return;
    bouton.dataset.ggbLie = '1';
    bouton.addEventListener('click', () => {
      const en3d = bouton.dataset.ggb === '3d';
      // 1) page principale / hub ; 2) repli (TD ouvert seul) : comportement d'origine
      if (ouvrirDansIndex(en3d ? URL_3D : URL_CLASSIC, en3d ? 'GéoGébra 3D' : 'GéoGébra Classic', en3d ? 'ggb3d' : 'ggbclassic')) return;
      if (en3d) loadGeoGebra3D(bouton);
      else loadGeoGebraClassic(bouton);
    });
  });
}

/**
 * Liens [data-outil-index] (ex. calculatrice NumWorks) : ouverts via l'index
 * du hub ; sans hub, le lien garde son comportement normal (nouvel onglet).
 */
export function initOutilsIndex() {
  document.querySelectorAll('a[data-outil-index]').forEach((lien) => {
    if (lien.dataset.outilLie) return;
    lien.dataset.outilLie = '1';
    lien.addEventListener('click', (evenement) => {
      if (ouvrirDansIndex(lien.href, lien.dataset.outilIndex || texte(lien), 'numworks')) evenement.preventDefault();
    });
  });
}

function texte(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }

/** Câble les boutons GéoGébra et les liens d'outils du fragment courant (idempotent). */
export function initOutilsGeoGebra() {
  initBoutonsGeoGebra();
  initOutilsIndex();
}

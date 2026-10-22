/**
 * laboratory/js/zoom-visuel.js
 *
 * Module partagé (tp-chimie, tp-electricite) : agrandissement des
 * illustrations (schémas de montage, tableaux, photos) en fenêtre.
 *
 * Même logique que le zoom de PyLab (éditeur et console) :
 *   - bouton rond bleu « + » sur l'illustration : ouvre une fenêtre qui
 *     l'affiche en grand ;
 *   - bouton rond bleu « − » dans la fenêtre : la ferme
 *     (aussi : touche Échap ou clic sur le fond sombre).
 *
 * Fonctionne pour les SVG intégrés dans la page comme pour les illustrations
 * importées par <img src="….svg">.
 *
 * Il suffit d'importer ce module (import "../../js/zoom-visuel.js") : les
 * illustrations .mode-image présentes dans la page, ou ajoutées ensuite
 * (chargement dynamique des TP), reçoivent automatiquement le bouton +.
 */

const SELECTEUR = "svg.mode-image, img.mode-image, .mode-op img";

const ICONE_PLUS =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
  '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
const ICONE_MOINS =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
  '<path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

const STYLES = `
.zoom-visuel-wrap { position: relative; display: block; }

.zoom-visuel-btn {
  width: 40px; height: 40px; min-height: 0; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  color: #ffffff; cursor: pointer;
  border: none; border-radius: 50%;
  background: #4169e1;
  box-shadow: 0 3px 8px rgba(65, 105, 225, 0.30);
  transition: background 0.2s ease, transform 0.2s ease;
}
.zoom-visuel-btn:hover { background: #1e90ff; transform: scale(1.08); }
.zoom-visuel-btn:active { transform: scale(1); }
.zoom-visuel-btn:focus-visible { outline: 3px solid #1e90ff; outline-offset: 3px; }
.zoom-visuel-btn svg { display: block; margin: 0; }

.zoom-visuel-wrap > .zoom-visuel-btn { position: absolute; top: 8px; right: 8px; z-index: 2; }

.zoom-visuel-modal {
  position: fixed; inset: 0; z-index: 10000;
  display: none; align-items: center; justify-content: center;
  padding: 3vh 3vw;
  background: rgba(23, 32, 51, 0.72);
}
.zoom-visuel-modal.show { display: flex; }

.zoom-visuel-window {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; overflow: hidden;
  background: #ffffff; color: #172033;
  border: 2px solid #4169e1; border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.zoom-visuel-bar {
  min-height: 64px; padding: 0 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  color: #243b73; font-weight: bold;
  border-bottom: 1px solid #c8d9ee; background: #dce8f8;
}

.zoom-visuel-content {
  flex: 1; min-height: 0; padding: 2vh 2vw;
  display: flex; align-items: center; justify-content: center;
  overflow: auto; background: #ffffff; color: #172033;
}
.zoom-visuel-content > svg,
.zoom-visuel-content > img {
  flex: 1; min-width: 0; min-height: 0;
  width: 100%; height: 100%; max-width: none; max-height: none;
  object-fit: contain;
}

@media print {
  .zoom-visuel-btn, .zoom-visuel-modal { display: none !important; }
}
`;

let modal = null;
let contenu = null;
let titre = null;
let boutonFermer = null;
let declencheur = null;

function injecterStyles() {
  if (document.getElementById("zoom-visuel-styles")) return;
  const style = document.createElement("style");
  style.id = "zoom-visuel-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function creerFenetre() {
  if (modal) return;

  modal = document.createElement("div");
  modal.className = "zoom-visuel-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-label", "Illustration en grand");

  modal.innerHTML =
    '<div class="zoom-visuel-window">' +
      '<div class="zoom-visuel-bar">' +
        '<span class="zoom-visuel-titre"></span>' +
        '<button type="button" class="zoom-visuel-btn zoom-visuel-fermer" ' +
          'title="Fermer le zoom" aria-label="Fermer la fenêtre de zoom">' + ICONE_MOINS + '</button>' +
      '</div>' +
      '<div class="zoom-visuel-content"></div>' +
    '</div>';

  document.body.appendChild(modal);

  contenu = modal.querySelector(".zoom-visuel-content");
  titre = modal.querySelector(".zoom-visuel-titre");
  boutonFermer = modal.querySelector(".zoom-visuel-fermer");

  boutonFermer.addEventListener("click", fermer);

  // clic sur le fond sombre = fermeture
  modal.addEventListener("click", event => {
    if (event.target === modal) fermer();
  });
}

function libelle(visuel) {
  return visuel.getAttribute("aria-label") || visuel.getAttribute("alt") || "Illustration";
}

function ouvrir(visuel, bouton) {
  creerFenetre();

  const copie = visuel.cloneNode(true);
  copie.removeAttribute("id");
  copie.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
  copie.removeAttribute("width");
  copie.removeAttribute("height");
  copie.removeAttribute("style");
  copie.removeAttribute("loading");

  contenu.replaceChildren(copie);
  titre.textContent = libelle(visuel);

  declencheur = bouton;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  contenu.scrollTop = 0;
  boutonFermer.focus();
}

function fermer() {
  if (!modal || !modal.classList.contains("show")) return;

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  contenu.replaceChildren();

  if (declencheur && declencheur.isConnected) declencheur.focus();
  declencheur = null;
}

function decorer(visuel) {
  if (visuel.dataset.zoomVisuel) return;
  if (visuel.closest(".zoom-visuel-modal")) return;
  visuel.dataset.zoomVisuel = "1";

  const enveloppe = document.createElement("div");
  enveloppe.className = "zoom-visuel-wrap";
  visuel.parentNode.insertBefore(enveloppe, visuel);
  enveloppe.appendChild(visuel);

  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "zoom-visuel-btn zoom-visuel-ouvrir";
  bouton.title = "Agrandir l'illustration";
  bouton.setAttribute("aria-label", "Agrandir l'illustration : " + libelle(visuel));
  bouton.innerHTML = ICONE_PLUS;
  bouton.addEventListener("click", () => ouvrir(visuel, bouton));
  enveloppe.appendChild(bouton);
}

function scanner(racine) {
  if (racine.nodeType !== 1 && racine.nodeType !== 9) return;
  if (racine.matches && racine.matches(SELECTEUR)) decorer(racine);
  racine.querySelectorAll(SELECTEUR).forEach(decorer);
}

export function initZoomVisuels() {
  injecterStyles();
  scanner(document);
}

function demarrer() {
  initZoomVisuels();

  // TP chargés dynamiquement : on décore aussi les illustrations ajoutées plus tard
  new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(n => scanner(n)));
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") fermer();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", demarrer, { once: true });
} else {
  demarrer();
}
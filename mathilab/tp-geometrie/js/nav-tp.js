/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * Boutons « Accueil » / « TD suivant » de fin de fragment
 * mathilab/tp-geometrie/js/nav-tp.js
 * ============================================================
 * Remplace les attributs onclick des fragments :
 *   [data-aller-accueil]  → retour à la page d'accueil du domaine
 *   [data-aller-tp="<m>"] → chargement du fragment <m> (window.loadTP,
 *                           sinon clic sur le bouton « nav [data-module] »)
 *
 * À appeler dans init() de chaque contrôleur, après l'injection du
 * fragment (les boutons ciblés sont ceux de la page courante).
 */

const URL_ACCUEIL = '../index.html';

function aller(module) {
  if (typeof window.loadTP === 'function') {
    window.loadTP(module);
    return;
  }
  const bouton = document.querySelector(`nav button[data-module="${module}"]`);
  if (bouton) bouton.click();
}

export function initNavigationTP() {
  document.querySelectorAll('[data-aller-accueil]').forEach((bouton) => {
    if (bouton.dataset.navLie) return;
    bouton.dataset.navLie = '1';
    bouton.addEventListener('click', () => { location.href = URL_ACCUEIL; });
  });

  document.querySelectorAll('[data-aller-tp]').forEach((bouton) => {
    if (bouton.dataset.navLie) return;
    bouton.dataset.navLie = '1';
    bouton.addEventListener('click', () => aller(bouton.dataset.allerTp));
  });
}

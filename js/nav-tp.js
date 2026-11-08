/**
 * js/nav-tp.js — boutons de fin de fragment (RACINE du site, point unique).
 *
 *   [data-aller-accueil]  → page d'accueil de la plateforme (../index.html,
 *                           relatif à tp-<domaine>/index.html)
 *   [data-aller-tp="<m>"] → window.loadTP(<m>) (navigation.js) ; repli : clic sur
 *                           le bouton « nav button[data-module="<m>"] »
 *
 * À appeler dans init() de chaque contrôleur, avant l'impression.
 * Idempotent (marqueur data-nav-lie) : un second appel ne double pas les écouteurs.
 */

const URL_ACCUEIL = '../index.html';

export function initNavigationTP() {
  document.querySelectorAll('[data-aller-accueil]').forEach(el => {
    if (el.dataset.navLie) return;
    el.dataset.navLie = '1';
    el.addEventListener('click', () => { location.href = URL_ACCUEIL; });
  });

  document.querySelectorAll('[data-aller-tp]').forEach(el => {
    if (el.dataset.navLie) return;
    el.dataset.navLie = '1';
    el.addEventListener('click', () => {
      const module = el.dataset.allerTp;
      if (!module) return;
      if (typeof window.loadTP === 'function') {
        window.loadTP(module);
        return;
      }
      document.querySelector(`nav button[data-module="${module}"]`)?.click();
    });
  });
}

export default initNavigationTP;

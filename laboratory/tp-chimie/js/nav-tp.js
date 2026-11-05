/**
 * tp-chimie/js/nav-tp.js
 *
 * Câble les boutons de navigation de fin de fragment (div.nav-tp) :
 *   [data-aller-accueil]   → retour à l'accueil du laboratoire ;
 *   [data-aller-tp="<m>"]  → window.loadTP(<m>) (exposée par js/navigation.js),
 *                            avec repli sur le clic du bouton « nav [data-module="<m>"] ».
 * Remplace les anciens attributs onclick (CLAUDE v4, §2.4 et §16.4).
 * Aucune dépendance. À appeler dans init() de chaque contrôleur, une fois le
 * fragment injecté.
 */

const URL_ACCUEIL = '../index.html';

export function initNavigationTP() {

  document.querySelectorAll('[data-aller-accueil]').forEach(bouton => {
    bouton.addEventListener('click', () => {
      location.href = URL_ACCUEIL;
    });
  });

  document.querySelectorAll('[data-aller-tp]').forEach(bouton => {
    bouton.addEventListener('click', () => {
      const module = bouton.dataset.allerTp;
      if (!module) return;

      if (typeof window.loadTP === 'function') {
        window.loadTP(module);
        return;
      }

      document.querySelector(`nav [data-module="${CSS.escape(module)}"]`)?.click();
    });
  });
}

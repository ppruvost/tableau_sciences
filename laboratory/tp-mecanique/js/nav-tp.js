/**
 * tp-mecanique/js/nav-tp.js
 *
 * Boutons de fin de fragment (.nav-tp), sans attribut onclick :
 *   [data-aller-accueil]   → retour à la page d'accueil du laboratoire ;
 *   [data-aller-tp="<m>"]  → chargement du TP <m> via window.loadTP()
 *                            (exposé par navigation.js) ; repli : clic sur
 *                            le bouton « nav [data-module="<m>"] ».
 *
 * À appeler dans init() de chaque contrôleur, après l'injection du
 * fragment (CLAUDE v4, §3.2 étape 11 et §16.4).
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

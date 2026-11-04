/**
 * tp-acoustique/js/nav-tp.js
 *
 * Câble les boutons de navigation de fin de fragment, sans onclick :
 *   - data-aller-accueil          → retour à l'accueil du site ;
 *   - data-aller-tp="<module>"    → charge le fragment du TP indiqué
 *                                   (même identifiant que data-module de <nav>).
 */

const URL_ACCUEIL = '../index.html';

function aller(module) {
  // Fonction globale exposée par navigation.js.
  if (typeof window.loadTP === 'function') {
    window.loadTP(module);
    return;
  }
  // Repli : même effet qu'un clic sur le bouton du <nav> correspondant.
  const bouton = [...document.querySelectorAll('nav [data-module]')]
    .find(b => b.dataset.module === module);
  if (bouton) bouton.click();
}

export function initNavigationTP() {

  document.querySelectorAll('[data-aller-accueil]').forEach(bouton => {
    bouton.addEventListener('click', () => {
      location.href = URL_ACCUEIL;
    });
  });

  document.querySelectorAll('[data-aller-tp]').forEach(bouton => {
    bouton.addEventListener('click', () => aller(bouton.dataset.allerTp));
  });
}

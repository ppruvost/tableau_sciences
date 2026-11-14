/**
 * mathilab/tp-statistiques/js/nav-tp.js
 *
 * Boutons de bas de TD, câblés par attributs data-* (aucun onclick) :
 *   [data-aller-accueil]       → accueil de la plateforme MathiLab
 *   [data-aller-tp="<module>"] → TD suivant (clic sur le bouton de <nav>
 *                                portant le même data-module, ce qui laisse
 *                                navigation.js charger le fragment)
 * Câblage idempotent (dataset.navLie).
 */

export function initNavigationTP() {

  document.querySelectorAll('[data-aller-accueil]').forEach(bouton => {
    if (bouton.dataset.navLie === '1') return;
    bouton.dataset.navLie = '1';
    bouton.addEventListener('click', () => { location.href = '../index.html'; });
  });

  document.querySelectorAll('[data-aller-tp]').forEach(bouton => {
    if (bouton.dataset.navLie === '1') return;
    bouton.dataset.navLie = '1';
    bouton.addEventListener('click', () => {
      const module = bouton.dataset.allerTp;
      const cible = [...document.querySelectorAll('nav button[data-module]')]
        .find(b => b.dataset.module === module);
      if (cible) {
        cible.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('[tp-statistiques] bouton de navigation introuvable pour :', module);
      }
    });
  });
}

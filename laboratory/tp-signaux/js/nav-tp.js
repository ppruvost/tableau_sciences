/**
 * tp-signaux/js/nav-tp.js
 *
 * Navigation « Accueil / TP précédent / TP suivant » du bas de chaque TP.
 * Les fragments HTML ne portent plus d'attribut onclick : ils déclarent
 *   data-aller-accueil          → retour à l'accueil du laboratoire ;
 *   data-aller-tp="<module>"    → chargement du TP par loadTP() (navigation.js).
 */

export function initNavigationTP() {

  document.querySelectorAll('.nav-tp [data-aller-accueil]').forEach(bouton => {
    bouton.addEventListener('click', () => {
      location.href = '../index.html';
    });
  });

  document.querySelectorAll('.nav-tp [data-aller-tp]').forEach(bouton => {
    bouton.addEventListener('click', () => {
      if (typeof window.loadTP === 'function') {
        window.loadTP(bouton.dataset.allerTp);
      } else {
        console.warn('[tp-signaux] loadTP() indisponible : navigation vers', bouton.dataset.allerTp, 'impossible.');
      }
    });
  });
}

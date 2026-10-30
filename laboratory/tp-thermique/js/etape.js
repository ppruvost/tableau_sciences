/**
 * tp-thermique/js/etape.js
 *
 * R12 — Initialisation tolérante aux pannes : chaque étape s'exécute dans
 * un try/catch journalisé, une erreur n'empêche pas les étapes suivantes.
 */
export function etape(nom, fn) {
  try {
    fn();
  } catch (erreur) {
    console.error(`[tp-thermique] étape « ${nom} » en échec :`, erreur);
  }
}

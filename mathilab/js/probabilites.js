/**
 * js/probabilites.js
 * Module partagé — domaine « Statistique et probabilités » (MathiLab).
 *
 * Outils de simulation pour le module « Fluctuations d'une fréquence
 * selon les échantillons, probabilités » (2nde) : tirage aléatoire
 * d'une expérience à deux issues, simulation d'un échantillon de
 * taille n, étendue d'une série de fréquences.
 */

/**
 * Simule une expérience aléatoire à deux issues (succès / échec) de
 * probabilité de succès p, avec remise.
 * @returns {boolean} true si l'issue « succès » est obtenue
 */
export function tirageBernoulli(p) {
  return Math.random() < p;
}

/**
 * Simule un échantillon aléatoire de taille n pour une expérience à
 * deux issues de probabilité p, et renvoie l'effectif de succès et
 * la fréquence observée.
 */
export function simulerEchantillon(n, p) {
  let effectifSucces = 0;
  for (let i = 0; i < n; i += 1) {
    if (tirageBernoulli(p)) effectifSucces += 1;
  }
  return { n, effectifSucces, frequence: effectifSucces / n };
}

/**
 * Étendue d'une série de fréquences observées sur plusieurs
 * échantillons de même taille n (capacité du programme : « Déterminer
 * l'étendue des fréquences [...] de la série d'échantillons de taille
 * n »).
 */
export function etendueFrequences(frequences) {
  if (!frequences || !frequences.length) return null;
  return Math.max(...frequences) - Math.min(...frequences);
}

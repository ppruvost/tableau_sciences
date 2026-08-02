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

/* ============================================================
   TABLEAU CROISÉ D'EFFECTIFS (1ère / Tle)
   ============================================================ */

/**
 * À partir d'un tableau croisé 2×2 d'effectifs
 *   [[n(A∩B), n(A∩B̄)],
 *    [n(Ā∩B), n(Ā∩B̄)]]
 * calcule les marges, le total, et les probabilités usuelles :
 * P(A), P(B), P(A∩B), P(A∪B), P(Ā), la fréquence conditionnelle et
 * la probabilité conditionnelle PA(B) = P(A∩B) / P(A).
 */
export function analyserTableauCroise(nAB, nAnonB, nnonAB, nnonAnonB) {

  const total = nAB + nAnonB + nnonAB + nnonAnonB;
  if (total <= 0) return null;

  const nA = nAB + nAnonB;
  const nNonA = nnonAB + nnonAnonB;
  const nB = nAB + nnonAB;
  const nNonB = nAnonB + nnonAnonB;

  const pA = nA / total;
  const pB = nB / total;
  const pAinterB = nAB / total;
  const pAuB = pA + pB - pAinterB;
  const pNonA = nNonA / total;

  const pAsachantB = nB > 0 ? nAB / nB : null; // fréquence conditionnelle (parmi B)
  const pBsachantA = nA > 0 ? nAB / nA : null; // probabilité conditionnelle PA(B)

  return {
    total, nA, nNonA, nB, nNonB, nAB,
    pA, pB, pAinterB, pAuB, pNonA,
    pAsachantB, pBsachantA,
  };
}

/**
 * Deux événements A et B (probabilités pA, pB, pAinterB connues) sont
 * indépendants si P(A∩B) = P(A) × P(B). Renvoie l'écart entre les
 * deux membres (proche de 0 : indépendance plausible) et le produit
 * P(A) × P(B) pour affichage.
 */
export function verifierIndependance(pA, pB, pAinterB) {
  const produit = pA * pB;
  return { produit, ecart: pAinterB - produit };
}

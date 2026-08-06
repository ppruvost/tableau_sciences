/**
 * mathilab/js/finance.js
 * Fonctions utilitaires réutilisables pour le module « Calculs commerciaux et financiers ».
 */

/* ---------- Intérêts composés ---------- */

// Capital obtenu après n périodes d'un placement à intérêts composés : cn = c0 (1 + t)^n.
export function capitalInteretsComposes(c0, t, n) {
  return c0 * (1 + t) ** n;
}

// Durée n nécessaire pour qu'un capital c0 placé au taux t atteigne un capital cible.
export function dureePourCapital(c0, t, capitalCible) {
  if (c0 <= 0 || capitalCible <= 0 || t <= -1) return null;
  return Math.log(capitalCible / c0) / Math.log(1 + t);
}

/* ---------- Intérêts simples et taux proportionnels (1ère) ---------- */

// Capital disponible après n périodes d'un placement à intérêt simple : cn = c0 (1 + t n).
export function capitalInteretsSimples(c0, t, n) {
  return c0 * (1 + t * n);
}

// Taux proportionnel à un taux annuel, pour un nombre de périodes par an donné (12 pour un taux mensuel, 360 pour un taux journalier...).
export function tauxProportionnel(tauxAnnuel, periodesParAn) {
  return tauxAnnuel / periodesParAn;
}

/* ---------- Coûts (1ère) ---------- */

// Coût marginal exact : Cm(x) = C(x + 1) - C(x).
export function coutMarginalExact(fonctionCout, x) {
  return fonctionCout(x + 1) - fonctionCout(x);
}

// Coût marginal approché, pour une production importante : Cm(x) ≈ C'(x).
export function coutMarginalApproche(fonctionCoutDerivee, x) {
  return fonctionCoutDerivee(x);
}

// Coût moyen unitaire : C(x) / x.
export function coutMoyen(fonctionCout, x) {
  return x === 0 ? null : fonctionCout(x) / x;
}

/* ---------- Tableaux d'amortissement d'un emprunt ---------- */

// Amortissement par annuités constantes : chaque échéance (intérêt + amortissement) est identique.
export function tableauAmortissementAnnuitesConstantes(capital, tauxAnnuel, duree) {
  const annuite = tauxAnnuel === 0
    ? capital / duree
    : (capital * tauxAnnuel) / (1 - (1 + tauxAnnuel) ** -duree);

  const lignes = [];
  let capitalRestant = capital;
  for (let periode = 1; periode <= duree; periode++) {
    const interet = capitalRestant * tauxAnnuel;
    const amortissement = annuite - interet;
    capitalRestant -= amortissement;
    lignes.push({
      periode,
      capitalDebut: periode === 1 ? capital : lignes[periode - 2].capitalFin,
      interet,
      amortissement,
      annuite,
      capitalFin: Math.max(capitalRestant, 0),
    });
  }
  return lignes;
}

// Amortissement constant : le capital remboursé est identique à chaque échéance, l'annuité diminue.
export function tableauAmortissementConstant(capital, tauxAnnuel, duree) {
  const amortissementConstant = capital / duree;
  const lignes = [];
  let capitalRestant = capital;
  for (let periode = 1; periode <= duree; periode++) {
    const capitalDebut = capitalRestant;
    const interet = capitalDebut * tauxAnnuel;
    const annuite = amortissementConstant + interet;
    capitalRestant -= amortissementConstant;
    lignes.push({
      periode,
      capitalDebut,
      interet,
      amortissement: amortissementConstant,
      annuite,
      capitalFin: Math.max(capitalRestant, 0),
    });
  }
  return lignes;
}

// Coût total de l'emprunt : somme des intérêts versés sur toute la durée.
export function coutEmprunt(tableauAmortissement) {
  return tableauAmortissement.reduce((total, ligne) => total + ligne.interet, 0);
}

/* ---------- Taux ---------- */

// Taux mensuel équivalent à un taux annuel donné (même capitalisation sur 12 mois).
export function tauxMensuelEquivalent(tauxAnnuel) {
  return (1 + tauxAnnuel) ** (1 / 12) - 1;
}

// Taux moyen d'une suite de taux successifs t1, t2, ..., tn (même effet cumulé sur n périodes).
export function tauxMoyen(taux) {
  const produit = taux.reduce((acc, t) => acc * (1 + t), 1);
  return produit ** (1 / taux.length) - 1;
}

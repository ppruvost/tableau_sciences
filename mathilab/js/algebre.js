/**
 * mathilab/js/algebre.js
 * Fonctions utilitaires réutilisables par les modules de tp-algebre
 * (calcul de suites géométriques, sens de variation, tracé SVG de nuages de points et de courbes).
 */

/* ---------- Suites géométriques ---------- */

// Renvoie les termes u0, u1, ..., u_{n-1} d'une suite géométrique de premier terme u0 et de raison q.
export function calculerTermesSuiteGeometrique(u0, q, nombreTermes) {
  const termes = [];
  let terme = u0;
  for (let n = 0; n < nombreTermes; n++) {
    termes.push({ n, valeur: terme });
    terme *= q;
  }
  return termes;
}

// Somme des n premiers termes d'une suite géométrique, calculée par addition directe (sans formule).
export function sommeTermes(termes) {
  return termes.reduce((total, t) => total + t.valeur, 0);
}

// Détermine et explicite le sens de variation d'une suite géométrique de raison q > 0.
export function sensVariationGeometrique(u0, q) {
  if (q === 1) {
    return { sens: 'constante', explication: 'q = 1 : la suite est constante, tous les termes sont égaux.' };
  }
  if (u0 > 0) {
    return q > 1
      ? { sens: 'croissante', explication: 'u0 > 0 et q > 1 : la suite est croissante.' }
      : { sens: 'décroissante', explication: 'u0 > 0 et 0 < q < 1 : la suite est décroissante.' };
  }
  if (u0 < 0) {
    return q > 1
      ? { sens: 'décroissante', explication: 'u0 < 0 et q > 1 : la suite est décroissante.' }
      : { sens: 'croissante', explication: 'u0 < 0 et 0 < q < 1 : la suite est croissante.' };
  }
  return { sens: 'constante', explication: 'u0 = 0 : tous les termes de la suite sont nuls.' };
}

/* ---------- Suites arithmétiques (1ère) ---------- */

// Renvoie les termes u0, u1, ..., u_{n-1} d'une suite arithmétique de premier terme u0 et de raison r.
export function calculerTermesSuiteArithmetique(u0, r, nombreTermes) {
  const termes = [];
  for (let n = 0; n < nombreTermes; n++) {
    termes.push({ n, valeur: u0 + n * r });
  }
  return termes;
}

// Détermine et explicite le sens de variation d'une suite arithmétique à l'aide de sa raison r.
export function sensVariationArithmetique(r) {
  if (r > 0) return { sens: 'croissante', explication: 'r > 0 : chaque terme est obtenu en ajoutant un nombre positif au précédent.' };
  if (r < 0) return { sens: 'décroissante', explication: 'r < 0 : chaque terme est obtenu en ajoutant un nombre négatif au précédent.' };
  return { sens: 'constante', explication: 'r = 0 : tous les termes de la suite sont égaux.' };
}

/* ---------- Tracé SVG : nuage de points (n ; un) ---------- */

// series : tableau de { label, couleur, points: [{n, valeur}, ...] }
export function dessinerNuagePoints(containerId, series, options = {}) {
  const conteneur = document.getElementById(containerId);
  if (!conteneur) return;

  const tousLesPoints = series.flatMap((s) => s.points);
  if (tousLesPoints.length === 0) {
    conteneur.innerHTML = '';
    return;
  }

  const largeur = options.largeur || 600;
  const hauteur = options.hauteur || 320;
  const marge = { haut: 20, bas: 40, gauche: 55, droite: 20 };

  const nMax = Math.max(...tousLesPoints.map((p) => p.n));
  const valeurMax = Math.max(...tousLesPoints.map((p) => p.valeur), 0);
  const valeurMin = Math.min(...tousLesPoints.map((p) => p.valeur), 0);

  const xPourN = (n) => marge.gauche + (n / (nMax || 1)) * (largeur - marge.gauche - marge.droite);
  const yPourValeur = (v) => {
    const amplitude = (valeurMax - valeurMin) || 1;
    return hauteur - marge.bas - ((v - valeurMin) / amplitude) * (hauteur - marge.haut - marge.bas);
  };

  const couleursParDefaut = ['var(--couleur-primaire, #2563eb)', 'var(--couleur-secondaire, #dc2626)'];

  let svg = `<svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" role="img">`;

  // axes
  svg += `<line x1="${marge.gauche}" y1="${yPourValeur(0)}" x2="${largeur - marge.droite}" y2="${yPourValeur(0)}" stroke="#94a3b8" stroke-width="1"/>`;
  svg += `<line x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" stroke="#94a3b8" stroke-width="1"/>`;
  svg += `<text x="${largeur - marge.droite}" y="${yPourValeur(0) - 6}" font-size="12" text-anchor="end" fill="#64748b">n</text>`;
  svg += `<text x="${marge.gauche - 6}" y="${marge.haut + 10}" font-size="12" text-anchor="end" fill="#64748b">u(n)</text>`;

  // graduations en abscisse
  for (let n = 0; n <= nMax; n++) {
    svg += `<text x="${xPourN(n)}" y="${hauteur - marge.bas + 16}" font-size="10" text-anchor="middle" fill="#64748b">${n}</text>`;
  }

  series.forEach((s, indexSerie) => {
    const couleur = s.couleur || couleursParDefaut[indexSerie % couleursParDefaut.length];
    s.points.forEach((p) => {
      svg += `<circle cx="${xPourN(p.n)}" cy="${yPourValeur(p.valeur)}" r="4" fill="${couleur}"><title>u(${p.n}) = ${p.valeur.toFixed(2)}</title></circle>`;
    });
  });

  // légende si plusieurs séries
  if (series.length > 1) {
    series.forEach((s, indexSerie) => {
      const couleur = s.couleur || couleursParDefaut[indexSerie % couleursParDefaut.length];
      const y = marge.haut + indexSerie * 16;
      svg += `<circle cx="${largeur - 130}" cy="${y}" r="4" fill="${couleur}"/>`;
      svg += `<text x="${largeur - 120}" y="${y + 4}" font-size="11" fill="#334155">${s.label}</text>`;
    });
  }

  svg += '</svg>';
  conteneur.innerHTML = svg;
}

/* ---------- Polynômes de degré 3 : f(x) = a x^3 + b x^2 + c x + d ---------- */

export function evaluerPolynomeDegre3([a, b, c, d], x) {
  return a * x ** 3 + b * x ** 2 + c * x + d;
}

// Dérivée de a x^3 + b x^2 + c x + d : f'(x) = 3a x^2 + 2b x + c (trinôme du second degré).
export function deriveePolynomeDegre3([a, b, c]) {
  return [3 * a, 2 * b, c];
}

// Résout un trinôme A x^2 + B x + C = 0 (A peut être nul : cas d'une fonction affine).
export function resoudreTrinome([A, B, C]) {
  if (A === 0) {
    if (B === 0) return { discriminant: null, racines: [] };
    return { discriminant: null, racines: [-C / B] };
  }
  const discriminant = B * B - 4 * A * C;
  if (discriminant < 0) return { discriminant, racines: [] };
  if (discriminant === 0) return { discriminant, racines: [-B / (2 * A)] };
  const racine = Math.sqrt(discriminant);
  const x1 = (-B - racine) / (2 * A);
  const x2 = (-B + racine) / (2 * A);
  return { discriminant, racines: [Math.min(x1, x2), Math.max(x1, x2)] };
}

// Construit le tableau de variations d'un polynôme de degré <= 3 à partir du signe de sa dérivée.
// Renvoie une liste ordonnée d'étapes { x, valeur, nature } où nature vaut 'borne', 'minimum' ou 'maximum'.
export function tableauVariationsDegre3(coeffs, xMin, xMax) {
  const [a] = coeffs;
  const derivee = deriveePolynomeDegre3(coeffs);
  const { racines } = resoudreTrinome(derivee);
  const pointsCritiques = racines.filter((x) => x > xMin && x < xMax).sort((p, q) => p - q);

  const abscisses = [xMin, ...pointsCritiques, xMax];
  const etapes = abscisses.map((x, i) => {
    let nature = 'borne';
    if (i > 0 && i < abscisses.length - 1) {
      const pente = a >= 0 ? 1 : -1; // signe de f' juste avant le point critique, pour un a x^3 dominant
      nature = pente > 0 ? 'maximum' : 'minimum';
    }
    return { x, valeur: evaluerPolynomeDegre3(coeffs, x), nature };
  });
  return etapes;
}

/* ---------- Tracé SVG : courbe d'une fonction ---------- */

// series : tableau de { label, couleur, fn, xMin, xMax, points: [{x,y}]  (points marquants, optionnel) }
export function dessinerCourbe(containerId, series, options = {}) {
  const conteneur = document.getElementById(containerId);
  if (!conteneur) return;

  const largeur = options.largeur || 600;
  const hauteur = options.hauteur || 320;
  const marge = { haut: 20, bas: 40, gauche: 55, droite: 20 };
  const nbEchantillons = options.nbEchantillons || 120;

  const xMin = Math.min(...series.map((s) => s.xMin));
  const xMax = Math.max(...series.map((s) => s.xMax));

  const echantillonsParSerie = series.map((s) => {
    const pas = (s.xMax - s.xMin) / nbEchantillons;
    const pts = [];
    for (let i = 0; i <= nbEchantillons; i++) {
      const x = s.xMin + i * pas;
      const y = s.fn(x);
      if (Number.isFinite(y)) pts.push({ x, y });
    }
    return pts;
  });

  const toutesOrdonnees = echantillonsParSerie.flat().map((p) => p.y);
  const yMin = Math.min(...toutesOrdonnees, 0);
  const yMax = Math.max(...toutesOrdonnees, 0);

  const xVersPx = (x) => marge.gauche + ((x - xMin) / ((xMax - xMin) || 1)) * (largeur - marge.gauche - marge.droite);
  const yVersPx = (y) => hauteur - marge.bas - ((y - yMin) / ((yMax - yMin) || 1)) * (hauteur - marge.haut - marge.bas);

  const couleursParDefaut = ['var(--couleur-primaire, #2563eb)', 'var(--couleur-secondaire, #dc2626)'];

  let svg = `<svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" role="img">`;

  // axes
  svg += `<line x1="${marge.gauche}" y1="${yVersPx(0)}" x2="${largeur - marge.droite}" y2="${yVersPx(0)}" stroke="#94a3b8" stroke-width="1"/>`;
  svg += `<line x1="${xVersPx(0)}" y1="${marge.haut}" x2="${xVersPx(0)}" y2="${hauteur - marge.bas}" stroke="#94a3b8" stroke-width="1"/>`;
  svg += `<text x="${largeur - marge.droite}" y="${yVersPx(0) - 6}" font-size="12" text-anchor="end" fill="#64748b">x</text>`;
  svg += `<text x="${xVersPx(0) + 6}" y="${marge.haut + 10}" font-size="12" fill="#64748b">y</text>`;

  series.forEach((s, indexSerie) => {
    const couleur = s.couleur || couleursParDefaut[indexSerie % couleursParDefaut.length];
    const chemin = echantillonsParSerie[indexSerie]
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${xVersPx(p.x).toFixed(1)},${yVersPx(p.y).toFixed(1)}`).join(' ');
    svg += `<path d="${chemin}" fill="none" stroke="${couleur}" stroke-width="2"/>`;

    (s.points || []).forEach((p) => {
      svg += `<circle cx="${xVersPx(p.x)}" cy="${yVersPx(p.y)}" r="4" fill="${couleur}"><title>(${p.x.toFixed(2)} ; ${p.y.toFixed(2)})</title></circle>`;
    });
  });

  const libellesUniques = [...new Map(series.map((s, i) => [s.label, s.couleur || couleursParDefaut[i % couleursParDefaut.length]])).entries()];
  if (libellesUniques.length > 1) {
    libellesUniques.forEach(([label, couleur], indexLegende) => {
      const y = marge.haut + indexLegende * 16;
      svg += `<line x1="${largeur - 140}" y1="${y}" x2="${largeur - 124}" y2="${y}" stroke="${couleur}" stroke-width="2"/>`;
      svg += `<text x="${largeur - 118}" y="${y + 4}" font-size="11" fill="#334155">${label}</text>`;
    });
  }

  svg += '</svg>';
  conteneur.innerHTML = svg;
}

/* ---------- Équations et inéquations du premier degré (2nde) ---------- */

// Résout a x + b = c (a != 0) : x = (c - b) / a.
export function resoudreEquationPremierDegre(a, b, c) {
  if (a === 0) return null;
  return (c - b) / a;
}

// Résout a x + b (comparateur) c, avec comparateur parmi '>', '>=', '<', '<='.
// Renvoie le seuil et le comparateur à utiliser pour x (le sens s'inverse si a < 0).
export function resoudreInequationPremierDegre(a, b, comparateur, c) {
  if (a === 0) return null;
  const seuil = (c - b) / a;
  const inverse = { '>=': '<=', '<=': '>=', '>': '<', '<': '>' };
  const operateur = a < 0 ? inverse[comparateur] : comparateur;
  return { seuil, operateur };
}

// Traduit un couple { seuil, operateur } en notation d'intervalle de ℝ.
export function intervalleDepuisOperateur(seuil, operateur) {
  switch (operateur) {
    case '>=': return `[${seuil} ; +∞[`;
    case '>': return `]${seuil} ; +∞[`;
    case '<=': return `]−∞ ; ${seuil}]`;
    case '<': return `]−∞ ; ${seuil}[`;
    default: return '';
  }
}

/* ---------- Résolution graphique de f(x) = g(x) et f(x) >= g(x) (1ère) ---------- */

// Recherche par balayage des abscisses où fn1(x) - fn2(x) change de signe (approximation des solutions de fn1(x) = fn2(x)).
export function trouverIntersections(fn1, fn2, xMin, xMax, nbEchantillons = 400) {
  const pas = (xMax - xMin) / nbEchantillons;
  const solutions = [];
  let xPrecedent = xMin;
  let ecartPrecedent = fn1(xMin) - fn2(xMin);
  for (let i = 1; i <= nbEchantillons; i++) {
    const x = xMin + i * pas;
    const ecart = fn1(x) - fn2(x);
    if (ecartPrecedent === 0) {
      solutions.push(xPrecedent);
    } else if (ecart === 0) {
      solutions.push(x);
    } else if ((ecartPrecedent < 0 && ecart > 0) || (ecartPrecedent > 0 && ecart < 0)) {
      // interpolation linéaire entre les deux échantillons pour affiner la racine de (fn1 - fn2)
      const xApprox = xPrecedent + (0 - ecartPrecedent) * (x - xPrecedent) / (ecart - ecartPrecedent);
      solutions.push(xApprox);
    }
    xPrecedent = x;
    ecartPrecedent = ecart;
  }
  return solutions;
}

// Détermine, par balayage, les intervalles sur lesquels fn1(x) >= fn2(x).
export function intervallesInequation(fn1, fn2, xMin, xMax, nbEchantillons = 400) {
  const bornes = [xMin, ...trouverIntersections(fn1, fn2, xMin, xMax, nbEchantillons), xMax]
    .sort((a, b) => a - b);
  const intervalles = [];
  for (let i = 0; i < bornes.length - 1; i++) {
    const milieu = (bornes[i] + bornes[i + 1]) / 2;
    if (fn1(milieu) >= fn2(milieu)) {
      intervalles.push([bornes[i], bornes[i + 1]]);
    }
  }
  // fusion des intervalles contigus
  return intervalles.reduce((acc, courant) => {
    const dernier = acc[acc.length - 1];
    if (dernier && Math.abs(dernier[1] - courant[0]) < 1e-6) {
      dernier[1] = courant[1];
      return acc;
    }
    acc.push(courant);
    return acc;
  }, []);
}

/* ---------- Fonctions polynômes de degré 2 (1ère) ---------- */

// f(x) = a (x - x1)(x - x2), forme factorisée.
export function fonctionPolynomeFactorisee(a, x1, x2) {
  return (x) => a * (x - x1) * (x - x2);
}

// Sommet, axe de symétrie et ordonnée à l'origine d'une parabole donnée sous forme factorisée.
export function caracteristiquesParabole(a, x1, x2) {
  const axeSymetrie = (x1 + x2) / 2;
  const sommet = { x: axeSymetrie, y: fonctionPolynomeFactorisee(a, x1, x2)(axeSymetrie) };
  const ordonneeOrigine = fonctionPolynomeFactorisee(a, x1, x2)(0);
  return { axeSymetrie, sommet, ordonneeOrigine, signeA: a > 0 ? 'positif' : 'négatif' };
}

// Deuxième racine d'un polynôme a x^2 + b x + c connaissant une racine x1 (relation somme des racines = -b/a).
export function deuxiemeRacine(a, b, x1) {
  return -b / a - x1;
}

/* ---------- Dérivation d'un polynôme de degré <= 2, tangente, fonction inverse (1ère) ---------- */

export function evaluerPolynomeDegre2([a, b, c], x) {
  return a * x ** 2 + b * x + c;
}

// Dérivée de a x^2 + b x + c : f'(x) = 2a x + b.
export function deriveePolynomeDegre2([a, b]) {
  return [2 * a, b];
}

// Équation réduite y = m x + p de la tangente à la courbe de f au point d'abscisse x0.
export function equationTangente(f, fPrime, x0) {
  const m = fPrime(x0);
  const p = f(x0) - m * x0;
  return { m, p, fn: (x) => m * x + p };
}

export function fonctionInverse() {
  return (x) => 1 / x;
}

/* ---------- Fonctions exponentielles de base q et logarithme décimal ---------- */

export function fonctionExponentielle(q) {
  return (x) => q ** x;
}

export function fonctionLogDecimal() {
  return (x) => Math.log10(x);
}

// Résout q^x = a (avec q > 0, q != 1, a > 0) : x = log(a) / log(q).
export function resoudreExponentielle(q, a) {
  if (q <= 0 || q === 1 || a <= 0) return null;
  return Math.log(a) / Math.log(q);
}

// Résout log(x) = a : x = 10^a.
export function resoudreLogDecimal(a) {
  return 10 ** a;
}

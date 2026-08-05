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

/**
 * js/ajustement.js
 * Module partagé — domaine « Statistique et probabilités » (MathiLab),
 * niveaux 1ère et Tle.
 *
 * Régression linéaire (méthode des moindres carrés), coefficient de
 * détermination R², et tracé d'un nuage de points avec sa droite (ou
 * courbe, après changement de variable) d'ajustement.
 *
 * Comme graphique.js / statistiques.js, aucune couleur n'est codée en
 * dur : les classes .nuage-* sont stylées une fois dans
 * css/domaine.css et recolorées par le style.css du domaine.
 */

/**
 * Ajustement affine y = a x + b par la méthode des moindres carrés.
 */
export function regressionLineaire(points) {
  const n = points.length;
  if (n < 2) return null;

  const xMoy = points.reduce((s, p) => s + p.x, 0) / n;
  const yMoy = points.reduce((s, p) => s + p.y, 0) / n;

  const numerateur = points.reduce((s, p) => s + (p.x - xMoy) * (p.y - yMoy), 0);
  const denominateur = points.reduce((s, p) => s + (p.x - xMoy) ** 2, 0);

  if (denominateur === 0) return null;

  const a = numerateur / denominateur;
  const b = yMoy - a * xMoy;

  return { a, b };
}

/**
 * Coefficient de détermination R² d'un ajustement y = a x + b sur une
 * série de points. Proche de 1 : ajustement pertinent.
 */
export function coefficientDetermination(points, a, b) {
  const n = points.length;
  if (n < 2) return null;

  const yMoy = points.reduce((s, p) => s + p.y, 0) / n;
  const sct = points.reduce((s, p) => s + (p.y - yMoy) ** 2, 0);
  const scr = points.reduce((s, p) => s + (p.y - (a * p.x + b)) ** 2, 0);

  if (sct === 0) return null;

  return 1 - scr / sct;
}

/**
 * Trace un nuage de points, avec en option :
 *  - une droite d'ajustement y = a x + b (options.a, options.b) ;
 *  - ou une courbe d'ajustement quelconque, fournie point par point,
 *    déjà triée par x croissant (options.courbe = [{x,y}, ...]),
 *    utile après un changement de variable (Tle).
 */
export function dessinerNuageAjustement(conteneurId, points, options = {}) {

  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const {
    xLabel = 'x',
    yLabel = 'y',
    largeur = 480,
    hauteur = 280,
    a = null,
    b = null,
    courbe = null,
  } = options;

  if (!points || points.length < 2) {
    conteneur.innerHTML = '<p class="info">Ajouter au moins 2 points pour afficher le nuage.</p>';
    return;
  }

  const marge = { haut: 16, droite: 16, bas: 34, gauche: 50 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y).concat(courbe ? courbe.map(p => p.y) : []);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);

  const xEchelle = x => marge.gauche + (xMax === xMin
    ? largeurUtile / 2
    : (x - xMin) / (xMax - xMin) * largeurUtile);

  const yEchelle = y => marge.haut + hauteurUtile - (yMax === yMin
    ? hauteurUtile / 2
    : (y - yMin) / (yMax - yMin) * hauteurUtile);

  const cercles = points
    .map(p => `<circle class="nuage-point" cx="${xEchelle(p.x).toFixed(1)}" cy="${yEchelle(p.y).toFixed(1)}" r="4" />`)
    .join('');

  let trace = '';

  if (courbe && courbe.length >= 2) {
    const chemin = courbe
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xEchelle(p.x).toFixed(1)} ${yEchelle(p.y).toFixed(1)}`)
      .join(' ');
    trace = `<path class="nuage-droite" d="${chemin}" fill="none" />`;
  } else if (a !== null && b !== null) {
    const y1 = a * xMin + b;
    const y2 = a * xMax + b;
    trace = `<line class="nuage-droite" x1="${xEchelle(xMin).toFixed(1)}" y1="${yEchelle(y1).toFixed(1)}" x2="${xEchelle(xMax).toFixed(1)}" y2="${yEchelle(y2).toFixed(1)}" />`;
  }

  conteneur.innerHTML = `
    <svg class="nuage-svg" viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="nuage-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="nuage-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      ${trace}
      ${cercles}
      <text class="nuage-label" x="${largeur / 2}" y="${hauteur - 6}" text-anchor="middle">${xLabel}</text>
      <text class="nuage-label" x="12" y="${hauteur / 2}" text-anchor="middle" transform="rotate(-90 12 ${hauteur / 2})">${yLabel}</text>
    </svg>
  `;
}

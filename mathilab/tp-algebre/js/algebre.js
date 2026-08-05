/**
 * js/algebre.js
 * Module partagé — domaine « Algèbre - Analyse » (MathiLab).
 *
 * Comme statistiques.js, aucune couleur n'est codée en dur : les
 * classes SVG réutilisées (.diagramme-axe, .diagramme-barre...)
 * viennent de tp.css / domaine.css et sont recolorées par le
 * style.css de tp-algèbre.
 */

/**
 * Résout a x + b = c (a ≠ 0) et renvoie x ainsi que le détail des
 * étapes de calcul, dans le vocabulaire du programme.
 */
export function resoudreEquationPremierDegre(a, b, c) {
  if (a === 0) {
    return { solvable: false, message: b === c ? "Tout réel x est solution (équation toujours vraie)." : "Aucune solution (équation impossible)." };
  }
  const etape1 = c - b; // a x = c - b
  const x = etape1 / a;
  return {
    solvable: true,
    x,
    etapes: [
      `a x + b = c  ⟺  ${a} x + (${b}) = ${c}`,
      `⟺  ${a} x = ${c} − (${b}) = ${etape1}`,
      `⟺  x = ${etape1} ÷ ${a} = ${Number(x.toFixed(4))}`,
    ],
  };
}

const LIBELLES_SIGNE = { lt: '<', le: '≤', gt: '>', ge: '≥' };

/**
 * Résout a x + b ▢ c (▢ ∈ {<,≤,>,≥}, a ≠ 0) et renvoie la solution
 * sous forme d'intervalle de ℝ, en inversant le sens si a < 0.
 */
export function resoudreInequationPremierDegre(a, b, c, signe) {
  if (a === 0) {
    const vrai = { lt: b < c, le: b <= c, gt: b > c, ge: b >= c }[signe];
    return { solvable: false, message: vrai ? "Tout réel x est solution." : "Aucune solution." };
  }

  const seuil = (c - b) / a;
  let signeFinal = signe;
  if (a < 0) {
    signeFinal = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' }[signe];
  }

  const bornesInterval = {
    lt: `]-∞ ; ${Number(seuil.toFixed(4))}[`,
    le: `]-∞ ; ${Number(seuil.toFixed(4))}]`,
    gt: `]${Number(seuil.toFixed(4))} ; +∞[`,
    ge: `[${Number(seuil.toFixed(4))} ; +∞[`,
  }[signeFinal];

  const etapes = [
    `a x + b ${LIBELLES_SIGNE[signe]} c  ⟺  ${a} x + (${b}) ${LIBELLES_SIGNE[signe]} ${c}`,
    `⟺  ${a} x ${LIBELLES_SIGNE[signe]} ${c - b}`,
  ];
  if (a < 0) {
    etapes.push(`⟺  x ${LIBELLES_SIGNE[signeFinal]} ${Number(seuil.toFixed(4))}  (division par un nombre négatif : le sens s'inverse)`);
  } else {
    etapes.push(`⟺  x ${LIBELLES_SIGNE[signeFinal]} ${Number(seuil.toFixed(4))}`);
  }

  return { solvable: true, seuil, signeFinal, intervalle: bornesInterval, etapes };
}

/**
 * Trace la droite y = a x + b et la droite horizontale y = c sur un
 * repère SVG, avec leur point d'intersection.
 */
export function tracerDroiteEtHorizontale(conteneurId, a, b, c, options = {}) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const { largeur = 480, hauteur = 320 } = options;
  const marge = { haut: 20, bas: 30, gauche: 44, droite: 20 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;

  const xInter = a !== 0 ? (c - b) / a : null;

  // Fenêtre centrée autour du point d'intersection (ou de l'origine).
  const centreX = xInter !== null ? xInter : 0;
  const demiPortee = Math.max(6, Math.abs(centreX) + 4);
  const xMin = centreX - demiPortee, xMax = centreX + demiPortee;

  const yAuxBornes = [a * xMin + b, a * xMax + b, c, 0];
  const yMin = Math.min(...yAuxBornes) - 2;
  const yMax = Math.max(...yAuxBornes) + 2;

  const x = v => marge.gauche + ((v - xMin) / (xMax - xMin)) * largeurUtile;
  const y = v => marge.haut + hauteurUtile - ((v - yMin) / (yMax - yMin)) * hauteurUtile;

  const yGaucheDroite = a * xMin + b;
  const yDroiteDroite = a * xMax + b;

  let pointInter = '';
  if (xInter !== null) {
    pointInter = `<circle cx="${x(xInter).toFixed(1)}" cy="${y(c).toFixed(1)}" r="5" class="diagramme-barre" />
      <line x1="${x(xInter).toFixed(1)}" y1="${y(c).toFixed(1)}" x2="${x(xInter).toFixed(1)}" y2="${(hauteur - marge.bas).toFixed(1)}" stroke="var(--gris-bordure,#ccc)" stroke-dasharray="3 3" />`;
  }

  conteneur.innerHTML = `
    <svg viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${y(0).toFixed(1)}" x2="${largeur - marge.droite}" y2="${y(0).toFixed(1)}" />
      <line class="diagramme-axe" x1="${x(0).toFixed(1)}" y1="${marge.haut}" x2="${x(0).toFixed(1)}" y2="${hauteur - marge.bas}" />
      <line x1="${x(xMin).toFixed(1)}" y1="${y(yGaucheDroite).toFixed(1)}" x2="${x(xMax).toFixed(1)}" y2="${y(yDroiteDroite).toFixed(1)}" stroke="var(--domaine-accent)" stroke-width="2" />
      <line x1="${marge.gauche}" y1="${y(c).toFixed(1)}" x2="${largeur - marge.droite}" y2="${y(c).toFixed(1)}" stroke="var(--domaine-accent-fonce)" stroke-width="2" stroke-dasharray="6 4" />
      ${pointInter}
    </svg>`;

  return { xInter };
}

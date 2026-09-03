/**
 * js/statistiques.js
 * Module partagé — domaine « Statistique et probabilités » (MathiLab).
 *
 * S'appuie volontairement sur js/incertitudes.js (calculerStatistiques,
 * dessinerHistogramme) : la moyenne, l'écart type et l'histogramme d'une
 * série statistique sont EXACTEMENT les mêmes outils que ceux déjà
 * utilisés dans tous les TP de sciences de SciLab pour analyser une
 * série de mesures répétées (« Mesures et incertitudes »). Ce module
 * complète cette base avec les indicateurs et représentations propres
 * au programme de mathématiques : mode, classe modale, médiane,
 * quartiles, écart interquartile, boîte à moustaches, diagrammes en
 * bâtons/colonnes et en secteurs.
 *
 * Comme radar.js / graphique.js / incertitudes.js, aucune couleur
 * n'est codée en dur : les classes .boite-*, .diagramme-barre-*,
 * .diagramme-secteur-* sont stylées une fois dans css/domaine.css et
 * recolorées par le style.css de chaque domaine mathématique.
 */

import { calculerStatistiques } from './incertitudes.js';

/* ============================================================
   INDICATEURS DE POSITION ET DE DISPERSION
   ============================================================ */

function trier(valeurs) {
  return [...valeurs].sort((a, b) => a - b);
}

/**
 * Médiane et quartiles par la méthode des rangs (programme Bac Pro) :
 * pour une série triée de n valeurs, le rang du quartile Q1 est le
 * plus petit entier supérieur ou égal à n/4 (arrondi au majorant), et
 * celui de Q3 à 3n/4. La médiane est la valeur centrale (ou la
 * moyenne des deux valeurs centrales si n est pair).
 */
export function mediane(valeurs) {
  const v = trier(valeurs);
  const n = v.length;
  if (!n) return null;
  const milieu = Math.floor(n / 2);
  return n % 2 === 0 ? (v[milieu - 1] + v[milieu]) / 2 : v[milieu];
}

function valeurAuRang(valeursTriees, rangFractionnaire) {
  const rang = Math.ceil(rangFractionnaire);
  const index = Math.min(Math.max(rang - 1, 0), valeursTriees.length - 1);
  return valeursTriees[index];
}

export function quartiles(valeurs) {
  const v = trier(valeurs);
  const n = v.length;
  if (n < 2) return null;

  const q1 = valeurAuRang(v, n / 4);
  const q3 = valeurAuRang(v, (3 * n) / 4);

  return { q1, q3, ecartInterquartile: q3 - q1 };
}

/**
 * Mode d'une série de valeurs discrètes (la ou les valeurs les plus
 * fréquentes). Pour une série regroupée en classes, utiliser
 * classeModale() plutôt que mode().
 */
export function mode(valeurs) {
  if (!valeurs.length) return null;
  const effectifs = new Map();
  valeurs.forEach(v => effectifs.set(v, (effectifs.get(v) || 0) + 1));
  const effectifMax = Math.max(...effectifs.values());
  return [...effectifs.entries()]
    .filter(([, eff]) => eff === effectifMax)
    .map(([val]) => val);
}

/**
 * Formate une borne de classe pour l'affichage : entier tel quel,
 * décimal arrondi à 2 chiffres avec virgule (notation française).
 */
function formaterBorneClasse(valeur) {
  if (!Number.isFinite(valeur)) return '';
  if (Number.isInteger(valeur)) return String(valeur);
  return valeur.toFixed(2).replace(/0+$/, '').replace(/,?\.$/, '').replace('.', ',');
}

/**
 * Regroupe une série en nClasses classes de même amplitude
 * ([debut ; fin[), avec le même algorithme que dessinerHistogramme
 * (js/incertitudes.js), afin que le tableau des classes affiché dans
 * un TP corresponde exactement au diagramme tracé à côté.
 *
 * Chaque classe est automatiquement bornée à partir du minimum et du
 * maximum des valeurs saisies (amplitude = étendue / nClasses) et
 * reçoit un libellé lisible ("[debut ; fin[") exposé à la fois sous
 * `label` (attendu par dessinerDiagrammeBarres) et `libelle` (attendu
 * par les tableaux de classes des TP), afin que passer par exemple
 * nClasses = 5 suffise à obtenir directement les 5 classes prêtes à
 * afficher, sans configuration manuelle des bornes.
 */
export function regrouperEnClasses(valeurs, nClasses = 5) {
  if (!valeurs || valeurs.length < 2) return [];

  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const etendue = max - min || 1;
  const largeurClasse = etendue / nClasses;

  const classes = Array.from({ length: nClasses }, (_, i) => {
    const debut = min + i * largeurClasse;
    const fin = min + (i + 1) * largeurClasse;
    const libelle = `[${formaterBorneClasse(debut)} ; ${formaterBorneClasse(fin)}[`;
    return { debut, fin, effectif: 0, libelle, label: libelle };
  });

  valeurs.forEach(v => {
    let idx = Math.floor((v - min) / largeurClasse);
    if (idx >= nClasses) idx = nClasses - 1;
    if (idx < 0) idx = 0;
    classes[idx].effectif += 1;
  });

  return classes;
}

/**
 * Classe modale : la classe d'effectif maximal, parmi des classes
 * définies par { debut, fin, effectif } (issues par exemple d'un
 * regroupement par classes affiché à l'histogramme).
 */
export function classeModale(classes) {
  if (!classes || !classes.length) return null;
  return classes.reduce((max, c) => (c.effectif > max.effectif ? c : max), classes[0]);
}

/**
 * Ensemble complet des indicateurs de position et de dispersion d'une
 * série statistique à une variable, dans le vocabulaire du programme.
 */
export function indicateursCompletes(valeurs) {
  if (!valeurs || valeurs.length < 2) return null;

  const v = trier(valeurs);
  const base = calculerStatistiques(v); // moyenne, écartType (js/incertitudes.js)
  const q = quartiles(v);

  return {
    n: base.n,
    min: v[0],
    max: v[v.length - 1],
    etendue: v[v.length - 1] - v[0],
    moyenne: base.moyenne,
    mediane: mediane(v),
    q1: q.q1,
    q3: q.q3,
    ecartInterquartile: q.ecartInterquartile,
    ecartType: base.ecartType,
  };
}

/* ============================================================
   BOÎTE À MOUSTACHES (SVG)
   ============================================================ */

/**
 * Trace une boîte à moustaches horizontale à partir d'une série de
 * valeurs. Si un second objet { label, valeurs } est fourni via
 * options.serieComparee, les deux boîtes sont superposées, alignées
 * sur la même échelle, pour permettre la comparaison directe.
 */
export function dessinerBoiteMoustaches(conteneurId, valeurs, options = {}) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const { unite = '', label = 'Série', largeur = 480, serieComparee = null } = options;

  const series = [{ label, valeurs }];
  if (serieComparee && serieComparee.valeurs && serieComparee.valeurs.length) {
    series.push(serieComparee);
  }

  const invalides = series.filter(s => !s.valeurs || s.valeurs.length < 4);
  if (invalides.length) {
    conteneur.innerHTML = '<p class="info">Ajouter au moins 4 valeurs pour construire une boîte à moustaches.</p>';
    return;
  }

  const toutesValeurs = series.flatMap(s => s.valeurs);
  const echelleMin = Math.min(...toutesValeurs);
  const echelleMax = Math.max(...toutesValeurs);
  const etendueEchelle = echelleMax - echelleMin || 1;

  const marge = { gauche: 90, droite: 24, haut: 20 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurLigne = 62;
  const hauteur = marge.haut * 2 + series.length * hauteurLigne;

  const x = valeur => marge.gauche + ((valeur - echelleMin) / etendueEchelle) * largeurUtile;

  const lignes = series.map((s, i) => {
    const ind = indicateursCompletes(s.valeurs);
    const yCentre = marge.haut + i * hauteurLigne + hauteurLigne / 2;
    const demiHauteurBoite = 14;

    return `
      <line class="boite-moustache" x1="${x(ind.min).toFixed(1)}" y1="${yCentre}" x2="${x(ind.q1).toFixed(1)}" y2="${yCentre}" />
      <line class="boite-moustache" x1="${x(ind.q3).toFixed(1)}" y1="${yCentre}" x2="${x(ind.max).toFixed(1)}" y2="${yCentre}" />
      <line class="boite-moustache" x1="${x(ind.min).toFixed(1)}" y1="${yCentre - demiHauteurBoite / 2}" x2="${x(ind.min).toFixed(1)}" y2="${yCentre + demiHauteurBoite / 2}" />
      <line class="boite-moustache" x1="${x(ind.max).toFixed(1)}" y1="${yCentre - demiHauteurBoite / 2}" x2="${x(ind.max).toFixed(1)}" y2="${yCentre + demiHauteurBoite / 2}" />
      <rect class="boite-corps" x="${x(ind.q1).toFixed(1)}" y="${yCentre - demiHauteurBoite}" width="${(x(ind.q3) - x(ind.q1)).toFixed(1)}" height="${demiHauteurBoite * 2}" />
      <line class="boite-mediane" x1="${x(ind.mediane).toFixed(1)}" y1="${yCentre - demiHauteurBoite}" x2="${x(ind.mediane).toFixed(1)}" y2="${yCentre + demiHauteurBoite}" />
      <text class="boite-label" x="${marge.gauche - 10}" y="${yCentre + 4}" text-anchor="end">${s.label}</text>
    `;
  }).join('');

  const axeY = hauteur - 4;

  conteneur.innerHTML = `
    <svg class="boite-svg" viewBox="0 0 ${largeur} ${hauteur + 20}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      ${lignes}
      <line class="boite-axe" x1="${marge.gauche}" y1="${axeY}" x2="${largeur - marge.droite}" y2="${axeY}" />
      <text class="boite-label" x="${largeur / 2}" y="${hauteur + 16}" text-anchor="middle">Valeur${unite ? ' (' + unite + ')' : ''}</text>
    </svg>
  `;
}

/* ============================================================
   DIAGRAMME EN BÂTONS / COLONNES (SVG)
   ============================================================ */

/**
 * @param {string} conteneurId
 * @param {{label:string, effectif:number}[]} donnees
 */
export function dessinerDiagrammeBarres(conteneurId, donnees, options = {}) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const { largeur = 460, hauteur = 240, yLabel = 'Effectif' } = options;

  if (!donnees || !donnees.length) {
    conteneur.innerHTML = '<p class="info">Ajouter au moins une catégorie pour afficher le diagramme.</p>';
    return;
  }

  const marge = { haut: 16, bas: 46, gauche: 40, droite: 14 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;
  const largeurBarre = largeurUtile / donnees.length;
  const effectifMax = Math.max(...donnees.map(d => d.effectif), 1);

  const barres = donnees.map((d, i) => {
    const h = (d.effectif / effectifMax) * hauteurUtile;
    const x = marge.gauche + i * largeurBarre;
    const y = marge.haut + (hauteurUtile - h);
    return `
      <rect class="diagramme-barre" x="${(x + largeurBarre * 0.15).toFixed(1)}" y="${y.toFixed(1)}" width="${(largeurBarre * 0.7).toFixed(1)}" height="${h.toFixed(1)}" />
      <text class="diagramme-barre-effectif" x="${(x + largeurBarre / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle">${d.effectif}</text>
      <text class="diagramme-barre-label" x="${(x + largeurBarre / 2).toFixed(1)}" y="${hauteur - marge.bas + 16}" text-anchor="middle">${d.label}</text>
    `;
  }).join('');

  conteneur.innerHTML = `
    <svg class="diagramme-barres-svg" viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="diagramme-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      ${barres}
      <text class="diagramme-barre-label" x="12" y="${hauteur / 2}" text-anchor="middle" transform="rotate(-90 12 ${hauteur / 2})">${yLabel}</text>
    </svg>
  `;
}

/* ============================================================
   DIAGRAMME EN SECTEURS (SVG)
   ============================================================ */

/**
 * @param {string} conteneurId
 * @param {{label:string, effectif:number}[]} donnees
 */
export function dessinerDiagrammeSecteurs(conteneurId, donnees, options = {}) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const { taille = 220 } = options;

  const total = (donnees || []).reduce((s, d) => s + d.effectif, 0);
  if (!donnees || !donnees.length || total <= 0) {
    conteneur.innerHTML = '<p class="info">Ajouter au moins une catégorie pour afficher le diagramme.</p>';
    return;
  }

  const centre = taille / 2;
  const rayon = taille / 2 - 8;
  let angleDepart = -Math.PI / 2;

  const secteurs = donnees.map((d, i) => {
    const proportion = d.effectif / total;
    const angleArrive = angleDepart + proportion * 2 * Math.PI;

    const x1 = centre + rayon * Math.cos(angleDepart);
    const y1 = centre + rayon * Math.sin(angleDepart);
    const x2 = centre + rayon * Math.cos(angleArrive);
    const y2 = centre + rayon * Math.sin(angleArrive);
    const grandArc = angleArrive - angleDepart > Math.PI ? 1 : 0;

    const chemin = `M ${centre} ${centre} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rayon} ${rayon} 0 ${grandArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;

    angleDepart = angleArrive;

    return `<path class="diagramme-secteur secteur-${i % 8}" d="${chemin}"><title>${d.label} : ${d.effectif} (${(proportion * 100).toFixed(1)} %)</title></path>`;
  }).join('');

  const legende = donnees.map((d, i) => `
    <span class="secteur-legende-item">
      <span class="secteur-legende-puce secteur-${i % 8}"></span>
      ${d.label} — ${d.effectif} (${((d.effectif / total) * 100).toFixed(1)} %)
    </span>
  `).join('');

  conteneur.innerHTML = `
    <svg class="diagramme-secteurs-svg" viewBox="0 0 ${taille} ${taille}" width="${taille}" height="${taille}" style="display:block;margin:0 auto;">
      ${secteurs}
    </svg>
    <div class="secteur-legende">${legende}</div>
  `;
}

/**
 * tp-mecanique/js/flexion-poutre.js
 *
 * Simulateur de flexion simple d'une poutre sur deux appuis, utilisé
 * par l'onglet « Flexion d'une poutre » du TP04 (moment des forces).
 * Contenu fondé sur le document « Flexion simple — 1ère Bac Pro TCI »
 * (exercices 1 et 2, corrigé, fiche synthèse).
 *
 * L'élève fait varier le matériau, la section, la portée, le type de
 * charge (ponctuelle / répartie) et la valeur de la charge, jusqu'à la
 * rupture. Le simulateur affiche :
 *   - la poutre déformée (déformation amplifiée), les appuis, la charge
 *     et les réactions ;
 *   - les diagrammes de l'effort tranchant V et du moment fléchissant Mf ;
 *   - Mf max, Wx, σmax, σadm, coefficient de sécurité, flèche f et l/250 ;
 *   - le détail des calculs (méthode en 6 étapes du cours).
 *
 * Unités internes : N, mm, N·mm, N/mm² (comme dans le cours).
 * Point d'entrée : initFlexionPoutre(), appelé par
 * tp04-equilibre-rotation-archimede.js.
 */

// =================================================================
// Données
// =================================================================

// σadm et E du sapin : données de l'exercice 2. σadm de l'acier : exercice 1
// (σadm = Re / S = 235 / 2,35 = 100 N/mm²). Les contraintes limites sont des
// valeurs indicatives pour la simulation (Re de l'acier S235, rupture en
// flexion du sapin) ; E de l'acier = 210 000 N/mm² (valeur usuelle).
const MATERIAUX = {
  acier: {
    nom: 'Acier S235',
    sigmaAdm: 100,
    sigmaLim: 235,
    E: 210000,
    fragile: false,
    limNom: 'Re',
  },
  sapin: {
    nom: 'Sapin',
    sigmaAdm: 11,
    sigmaLim: 40,
    E: 10000,
    fragile: true,
    limNom: 'σ rupture',
  },
};

// Profilés IPE du tableau de l'exercice 1 (Wx du cours, en cm³).
// I en cm⁴ et dimensions de la section : valeurs usuelles de catalogue.
const IPE = {
  'IPE 100': { h: 100, b: 55, tw: 4.1, tf: 5.7, WxCm3: 34.2, ICm4: 171 },
  'IPE 120': { h: 120, b: 64, tw: 4.4, tf: 6.3, WxCm3: 53.0, ICm4: 318 },
  'IPE 140': { h: 140, b: 73, tw: 4.7, tf: 6.9, WxCm3: 77.3, ICm4: 541 },
  'IPE 160': { h: 160, b: 82, tw: 5.0, tf: 7.4, WxCm3: 109, ICm4: 869 },
  'IPE 180': { h: 180, b: 91, tw: 5.3, tf: 8.0, WxCm3: 146, ICm4: 1317 },
};

// Situations des exercices 1 et 2 du cours.
const SCENARIOS = {
  exercice1: {
    materiau: 'acier', section: 'ipe', ipe: 'IPE 120',
    portee: 4, type: 'ponctuelle', position: 1, charge: 6000,
  },
  exercice2: {
    materiau: 'sapin', section: 'rect', b: 63, h: 150, orientation: 'chant',
    portee: 3, type: 'repartie', position: 1.5, charge: 1500,
  },
};

const MAX_RELEVES = 12;

// Géométrie du dessin (viewBox 640 × …)
const X0 = 50;
const X1 = 590;
const LPX = X1 - X0;

// =================================================================
// Utilitaires
// =================================================================

const $id = id => document.getElementById(id);

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function num(valeur, defaut) {
  const n = parseFloat(String(valeur).replace(',', '.'));
  return Number.isFinite(n) ? n : defaut;
}

function fmt(n, decimales = 0) {
  if (!Number.isFinite(n)) return '—';
  const s = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  }).format(n);
  return s.replace('-', '−');
}

// Idem avec un nombre de décimales fixe (ex. 53,0 ; 7,14)
function fmtFixe(n, decimales) {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n).replace('-', '−');
}

// Plus petite « valeur ronde » (1 ; 1,5 ; 2 ; 3 ; 4 ; 5 ; 6 ; 8 ; 10 × 10^k) ≥ v
function arrondiSup(v) {
  if (!(v > 0)) return 1;
  const puissance = Math.pow(10, Math.floor(Math.log10(v)));
  const paliers = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const m = v / puissance;
  return paliers.find(p => p >= m - 1e-9) * puissance;
}

// Pas « rond » (1, 2, 5 × 10^k) le plus proche par défaut de v, minimum 1
function pasRond(v) {
  if (!(v > 1)) return 1;
  const puissance = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / puissance;
  const p = m >= 5 ? 5 : m >= 2 ? 2 : 1;
  return Math.max(1, p * puissance);
}

function prefersReducedMotion() {
  return window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// =================================================================
// Lecture de l'interface
// =================================================================

function recupererElements() {
  const ids = [
    'materiau', 'section', 'groupe-rect', 'groupe-ipe', 'b', 'h',
    'orientation', 'ipe', 'portee', 'type', 'groupe-position', 'position',
    'charge-label', 'charge-range', 'charge-input', 'charge-max',
    'btn-rupture', 'btn-zero', 'btn-amplifier', 'btn-releve', 'btn-efface',
    'btn-ex1', 'btn-ex2', 'etat', 'scene', 'diagrammes', 'section-svg',
    'jauge-remplissage', 'jauge-adm', 'jauge-texte', 'calcul',
    'releves-corps', 'releves-vide',
    'ind-ra', 'ind-rb', 'ind-mf', 'ind-wx', 'ind-sigma', 'ind-adm',
    'ind-lim', 'ind-k', 'ind-fleche', 'ind-fadm',
  ];
  const r = {};
  for (const id of ids) {
    r[id] = $id('flex-' + id);
    if (!r[id]) return null;
  }
  return r;
}

function lireParametres(r, charge) {
  const mat = MATERIAUX[r.materiau.value] || MATERIAUX.sapin;

  let section;
  if (r.section.value === 'ipe' && mat !== MATERIAUX.sapin) {
    const nom = r.ipe.value in IPE ? r.ipe.value : 'IPE 120';
    const d = IPE[nom];
    section = {
      type: 'ipe', nom, libelle: nom,
      h: d.h, b: d.b, tw: d.tw, tf: d.tf,
      Wx: d.WxCm3 * 1000, I: d.ICm4 * 10000,
    };
  } else {
    const b = clamp(num(r.b.value, 63), 5, 600);
    const h = clamp(num(r.h.value, 150), 5, 600);
    const chant = r.orientation.value !== 'plat';
    const bv = chant ? b : h; // largeur dans le plan perpendiculaire aux charges
    const hv = chant ? h : b; // hauteur, dans le plan des charges
    section = {
      type: 'rect', b: bv, h: hv,
      Wx: bv * hv * hv / 6,
      I: bv * hv * hv * hv / 12,
      libelle: `${fmt(b)} × ${fmt(h)} mm ${chant ? 'sur chant' : 'à plat'}`,
    };
  }

  const l = clamp(num(r.portee.value, 3), 0.5, 12) * 1000;
  const type = r.type.value === 'ponctuelle' ? 'ponctuelle' : 'repartie';
  const la = clamp(num(r.position.value, 1) * 1000, 0.01 * l, 0.99 * l);

  return { mat, section, l, type, la, charge: Math.max(0, charge) };
}

// =================================================================
// Physique
// =================================================================

function deflexion(p, x) {
  const { l } = p;
  const EI = p.mat.E * p.section.I;
  if (p.type === 'repartie') {
    const q = p.charge / 1000; // N/mm
    return q * x * (l ** 3 - 2 * l * x * x + x ** 3) / (24 * EI);
  }
  const a = p.la;
  const b = l - a;
  const Q = p.charge;
  if (x <= a) return Q * b * x * (l * l - b * b - x * x) / (6 * EI * l);
  return Q * a * (l - x) * (2 * l * x - x * x - a * a) / (6 * EI * l);
}

function moment(p, res, x) {
  if (p.type === 'repartie') return res.RA * x - res.q * x * x / 2;
  return x <= p.la
    ? res.RA * x
    : res.RA * x - res.Q * (x - p.la);
}

function analyser(p) {
  const { l, mat, section } = p;
  const res = { q: 0, la: 0, lb: 0 };

  if (p.type === 'ponctuelle') {
    res.Q = p.charge;
    res.la = p.la;
    res.lb = l - p.la;
    res.RA = res.Q * res.lb / l;
    res.RB = res.Q * res.la / l;
    res.MfMax = res.Q * res.la * res.lb / l;
    res.xMax = p.la;
  } else {
    res.q = p.charge / 1000;
    res.Q = res.q * l;
    res.RA = res.RB = res.Q / 2;
    res.MfMax = res.q * l * l / 8;
    res.xMax = l / 2;
  }

  res.sigma = res.MfMax / section.Wx;
  res.k = res.sigma > 0 ? mat.sigmaLim / res.sigma : Infinity;
  res.fAdm = l / 250;

  // Flèche maximale : échantillonnage (la position de la flèche max dépend
  // de la position de la charge ; au milieu ou sous charge répartie on
  // retrouve exactement Q·l³/(48EI) et 5ql⁴/(384EI) du cours).
  const N = 400;
  let fMax = 0;
  for (let i = 0; i <= N; i++) {
    const f = deflexion(p, l * i / N);
    if (f > fMax) fMax = f;
  }
  res.f = fMax;

  res.rompu = res.Q > 0 && res.sigma >= mat.sigmaLim;
  return res;
}

function etatPoutre(p, res) {
  if (!(res.Q > 0)) return 'repos';
  if (res.rompu) return 'rupture';
  if (res.sigma > p.mat.sigmaAdm) return 'contrainte';
  if (res.f > res.fAdm) return 'fleche';
  return 'ok';
}

// Charge (N ou N/m) qui amène σmax à la contrainte limite du matériau
function chargeRupture(p) {
  const MfLim = p.mat.sigmaLim * p.section.Wx; // N·mm
  if (p.type === 'ponctuelle') {
    return MfLim * p.l / (p.la * (p.l - p.la)); // N
  }
  return 8 * MfLim / (p.l * p.l) * 1000; // N/m
}

// =================================================================
// Dessin : scène (poutre déformée, appuis, charges, réactions)
// =================================================================

const Y0 = 105; // ligne moyenne de la poutre non déformée

function pointe(id, classe) {
  return `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="${classe}"/></marker>`;
}

function dessinerScene(r, p, res, amplif, etat) {
  const { l, section } = p;
  const px = x => X0 + x / l * LPX;
  const mmVersPx = LPX / l;
  const ep = clamp(section.h / l * LPX, 9, 34);
  const ratio = res.sigma / p.mat.sigmaLim;

  // Ligne moyenne
  const xm = res.xMax;
  const chute = clamp(34 + (ratio - 1) * 140, 34, 78);
  const yc = x => {
    if (res.rompu) {
      return x <= xm
        ? Y0 + chute * (x / xm)
        : Y0 + chute * ((l - x) / (l - xm));
    }
    return Y0 + amplif * deflexion(p, x) * mmVersPx;
  };

  const n = 80;
  const haut = [];
  const bas = [];
  for (let i = 0; i <= n; i++) {
    const x = l * i / n;
    const X = px(x);
    const Y = yc(x);
    haut.push(`${X.toFixed(1)},${(Y - ep / 2).toFixed(1)}`);
    bas.unshift(`${X.toFixed(1)},${(Y + ep / 2).toFixed(1)}`);
  }
  const classePoutre = res.rompu ? 'flex-poutre flex-poutre--rompue' : 'flex-poutre';

  // Appuis
  const yApp = Y0 + ep / 2;
  const appuiA = `<path class="flex-appui" d="M${X0},${yApp} l-15,24 h30 z"/>`
    + `<path class="flex-appui-sol" d="M${X0 - 22},${yApp + 24} h44"/>`;
  const appuiB = `<path class="flex-appui" d="M${X1},${yApp} l-15,24 h30 z"/>`
    + `<circle class="flex-appui" cx="${X1 - 9}" cy="${yApp + 28}" r="4"/>`
    + `<circle class="flex-appui" cx="${X1 + 9}" cy="${yApp + 28}" r="4"/>`
    + `<path class="flex-appui-sol" d="M${X1 - 22},${yApp + 32} h44"/>`;

  // Réactions (flèches vers le haut)
  const yReacBase = yApp + 38;
  const reaction = (X, nom, val) =>
    `<line class="flex-reaction" x1="${X}" y1="${yReacBase + 36}" x2="${X}" y2="${yReacBase}" marker-end="url(#flex-pointe-reaction)"/>`
    + `<text class="flex-texte" x="${X}" y="${yReacBase + 54}" text-anchor="middle">${nom} = ${fmt(val)} N</text>`;

  // Charge
  let charge = '';
  if (res.Q > 0) {
    if (p.type === 'ponctuelle') {
      const X = px(res.la);
      const yTete = yc(res.la) - ep / 2;
      charge = `<line class="flex-charge" x1="${X}" y1="${yTete - 52}" x2="${X}" y2="${yTete}" marker-end="url(#flex-pointe-charge)"/>`
        + `<text class="flex-texte flex-texte--charge" x="${X}" y="${yTete - 58}" text-anchor="middle">Q = ${fmt(res.Q)} N</text>`;
    } else {
      const yQueue = Y0 - ep / 2 - 40;
      const nf = 12;
      let fleches = '';
      for (let i = 0; i <= nf; i++) {
        const x = l * i / nf;
        const X = px(x);
        fleches += `<line class="flex-charge" x1="${X.toFixed(1)}" y1="${yQueue}" x2="${X.toFixed(1)}" y2="${(yc(x) - ep / 2 - 1).toFixed(1)}" marker-end="url(#flex-pointe-charge)"/>`;
      }
      charge = `<line class="flex-charge" x1="${X0}" y1="${yQueue}" x2="${X1}" y2="${yQueue}"/>`
        + fleches
        + `<text class="flex-texte flex-texte--charge" x="${(X0 + X1) / 2}" y="${yQueue - 8}" text-anchor="middle">q = ${fmt(p.charge)} N/m</text>`;
    }
  }

  // Cotes
  const yCote = 250;
  let cotes = `<line class="flex-cote" x1="${X0}" y1="${yCote}" x2="${X1}" y2="${yCote}" marker-start="url(#flex-pointe-cote)" marker-end="url(#flex-pointe-cote)"/>`
    + `<text class="flex-texte" x="${(X0 + X1) / 2}" y="${yCote - 6}" text-anchor="middle">l = ${fmt(l / 1000, 2)} m</text>`;
  if (p.type === 'ponctuelle') {
    const X = px(res.la);
    cotes += `<line class="flex-cote" x1="${X0}" y1="${yCote + 18}" x2="${X}" y2="${yCote + 18}" marker-start="url(#flex-pointe-cote)" marker-end="url(#flex-pointe-cote)"/>`
      + `<text class="flex-texte" x="${(X0 + X) / 2}" y="${yCote + 14}" text-anchor="middle">la = ${fmt(res.la / 1000, 2)} m</text>`;
  }

  // Rupture : fissure (bois) ou rotule plastique (acier)
  let marque = '';
  if (res.rompu) {
    const X = px(xm);
    const Y = yc(xm);
    if (p.mat.fragile) {
      marque = `<path class="flex-fissure" d="M${X - 2},${Y + ep / 2} l6,-${ep * 0.28} l-8,-${ep * 0.25} l7,-${ep * 0.25} l-4,-${ep * 0.2}"/>`
        + `<text class="flex-texte flex-texte--alerte" x="${X}" y="${Y + ep / 2 + 24}" text-anchor="middle">✖ fissure : rupture</text>`;
    } else {
      marque = `<circle class="flex-rotule" cx="${X}" cy="${Y}" r="${ep * 0.8}"/>`
        + `<text class="flex-texte flex-texte--alerte" x="${X}" y="${Y + ep / 2 + 24}" text-anchor="middle">✖ rotule plastique</text>`;
    }
  }

  const noteAmplif = !res.rompu && amplif > 1.05
    ? `<text class="flex-texte flex-texte--note" x="${X1 + 40}" y="16" text-anchor="end">Déformation amplifiée ×${fmt(amplif)}</text>`
    : '';

  r.scene.innerHTML = `
    <defs>
      ${pointe('flex-pointe-charge', 'flex-pointe-charge')}
      ${pointe('flex-pointe-reaction', 'flex-pointe-reaction')}
      ${pointe('flex-pointe-cote', 'flex-pointe-cote')}
    </defs>
    ${appuiA}${appuiB}
    <polygon class="${classePoutre}" points="${haut.join(' ')} ${bas.join(' ')}"/>
    <text class="flex-texte flex-texte--lettre" x="${X0 - 24}" y="${Y0 + 5}" text-anchor="middle">A</text>
    <text class="flex-texte flex-texte--lettre" x="${X1 + 24}" y="${Y0 + 5}" text-anchor="middle">B</text>
    ${charge}
    ${reaction(X0, 'RA', res.RA)}
    ${reaction(X1, 'RB', res.RB)}
    ${marque}
    ${cotes}
    ${noteAmplif}
  `;

  r.scene.classList.toggle('flex-scene--etat-rupture', etat === 'rupture');
}

// =================================================================
// Dessin : diagrammes V et Mf
// =================================================================

function dessinerDiagrammes(r, p, res) {
  const { l } = p;
  const px = x => X0 + x / l * LPX;

  const yV = 100;
  const yM = 220;
  const vMax = Math.max(res.RA, res.RB, 1e-9);
  const sV = 50 / vMax;
  const sM = 90 / Math.max(res.MfMax, 1e-9);

  // Effort tranchant V
  let ptsV;
  if (p.type === 'ponctuelle') {
    const xa = px(res.la);
    ptsV = [
      [X0, yV], [X0, yV - sV * res.RA], [xa, yV - sV * res.RA],
      [xa, yV + sV * res.RB], [X1, yV + sV * res.RB], [X1, yV],
    ];
  } else {
    ptsV = [[X0, yV], [X0, yV - sV * res.RA], [X1, yV + sV * res.RB], [X1, yV]];
  }
  const polyV = ptsV.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  // Moment fléchissant Mf (tracé du côté de la fibre tendue : vers le bas)
  const n = 120;
  const ptsM = [[X0, yM]];
  for (let i = 0; i <= n; i++) {
    const x = l * i / n;
    ptsM.push([px(x), yM + sM * moment(p, res, x)]);
  }
  ptsM.push([X1, yM]);
  const polyM = ptsM.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const xMaxPx = px(res.xMax);
  const yMfMax = yM + sM * res.MfMax;
  const ancre = xMaxPx > X1 - 120 ? 'end' : xMaxPx < X0 + 120 ? 'start' : 'middle';
  const dxLabel = ancre === 'end' ? 6 : ancre === 'start' ? -6 : 0;

  const MfN = res.MfMax / 1000; // N·mm → N·m

  r.diagrammes.innerHTML = `
    <text class="flex-texte flex-texte--titre" x="${X0}" y="18">Effort tranchant V (N)</text>
    <line class="flex-axe" x1="${X0 - 10}" y1="${yV}" x2="${X1 + 10}" y2="${yV}"/>
    <polygon class="flex-diag-v" points="${polyV}"/>
    <text class="flex-texte" x="${X0 + 6}" y="${yV - sV * res.RA - 6}">+${fmt(res.RA)}</text>
    <text class="flex-texte" x="${X1 - 6}" y="${yV + sV * res.RB + 16}" text-anchor="end">−${fmt(res.RB)}</text>
    <line class="flex-repere" x1="${xMaxPx}" y1="${yV - 58}" x2="${xMaxPx}" y2="${yMfMax}"/>
    <text class="flex-texte flex-texte--note" x="${xMaxPx + 6}" y="${yV - 46}">V = 0 ou changement de signe</text>

    <text class="flex-texte flex-texte--titre" x="${X0}" y="${yM - 24}">Moment fléchissant Mf (N·m) — tracé côté fibre tendue</text>
    <line class="flex-axe" x1="${X0 - 10}" y1="${yM}" x2="${X1 + 10}" y2="${yM}"/>
    <polygon class="flex-diag-m" points="${polyM}"/>
    <circle class="flex-point-max" cx="${xMaxPx}" cy="${yMfMax}" r="4.5"/>
    <text class="flex-texte flex-texte--valeur" x="${xMaxPx + dxLabel}" y="${yMfMax + 20}" text-anchor="${ancre}">Mf max = ${fmt(MfN, 1)} N·m</text>
    <text class="flex-texte" x="${X0}" y="${yM + 16}" text-anchor="middle">0</text>
    <text class="flex-texte" x="${X1}" y="${yM + 16}" text-anchor="middle">0</text>
  `;
}

// =================================================================
// Dessin : section droite
// =================================================================

function dessinerSection(r, p) {
  const s = p.section;
  const taille = 96;
  const echelle = taille / Math.max(s.h, s.b);
  const w = s.b * echelle;
  const h = s.h * echelle;
  const cx = 60;
  const cy = 74;

  let forme;
  if (s.type === 'ipe') {
    const tf = Math.max(s.tf * echelle, 3);
    const tw = Math.max(s.tw * echelle, 3);
    forme = `<path class="flex-section-forme" d="M${cx - w / 2},${cy - h / 2} h${w} v${tf} h${-(w - tw) / 2} v${h - 2 * tf} h${(w - tw) / 2} v${tf} h${-w} v${-tf} h${(w - tw) / 2} v${-(h - 2 * tf)} h${-(w - tw) / 2} z"/>`;
  } else {
    forme = `<rect class="flex-section-forme" x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}"/>`;
  }

  r['section-svg'].innerHTML = `
    ${forme}
    <line class="flex-axe-neutre" x1="${cx - 56}" y1="${cy}" x2="${cx + 56}" y2="${cy}"/>
    <text class="flex-texte flex-texte--note" x="${cx + 56}" y="${cy - 4}" text-anchor="end">fibre neutre</text>
    <text class="flex-texte flex-texte--note" x="${cx}" y="${cy - h / 2 - 5}" text-anchor="middle">▼ compression</text>
    <text class="flex-texte flex-texte--note" x="${cx}" y="${cy + h / 2 + 14}" text-anchor="middle">▲ traction</text>
  `;
}

// =================================================================
// Indicateurs, jauge, calcul détaillé
// =================================================================

const LIBELLES_ETAT = {
  repos: { icone: '○', texte: 'Aucune charge appliquée : la poutre est au repos.' },
  ok: { icone: '✔', texte: 'La poutre résiste : σmax ≤ σadm et f ≤ l/250.' },
  fleche: { icone: '⚠', texte: 'Flèche trop grande (f > l/250) : la poutre résiste encore mais n\'est plus admissible.' },
  contrainte: { icone: '⚠', texte: 'Contrainte admissible dépassée (σmax > σadm) : la poutre n\'est plus sûre, mais elle n\'est pas encore rompue.' },
  rupture: { icone: '✖', texte: 'RUPTURE : σmax a atteint la contrainte limite du matériau.' },
};

function majIndicateurs(r, p, res, etat) {
  const { mat, section } = p;
  r['ind-ra'].textContent = `${fmt(res.RA)} N`;
  r['ind-rb'].textContent = `${fmt(res.RB)} N`;
  r['ind-mf'].textContent = `${fmtFixe(res.MfMax / 1000, 1)} N·m`;
  r['ind-wx'].textContent = `${fmtFixe(section.Wx / 1000, 1)} cm³`;
  r['ind-sigma'].textContent = `${fmtFixe(res.sigma, 2)} N/mm²`;
  r['ind-adm'].textContent = `${fmt(mat.sigmaAdm)} N/mm²`;
  r['ind-lim'].textContent = `${fmt(mat.sigmaLim)} N/mm² (${mat.limNom})`;
  r['ind-k'].textContent = Number.isFinite(res.k) ? fmt(res.k, 2) : '—';
  r['ind-fleche'].textContent = `${fmtFixe(res.f, 1)} mm`;
  r['ind-fadm'].textContent = `${fmtFixe(res.fAdm, 1)} mm`;

  const sigmaCarte = r['ind-sigma'].closest('.flex-indic');
  if (sigmaCarte) sigmaCarte.dataset.etat = etat;

  // Jauge σmax / σ limite : repère σadm
  const part = clamp(res.sigma / mat.sigmaLim, 0, 1);
  r['jauge-remplissage'].style.width = `${(part * 100).toFixed(1)}%`;
  r['jauge-adm'].style.left = `${(mat.sigmaAdm / mat.sigmaLim * 100).toFixed(1)}%`;
  r['jauge-texte'].textContent =
    `σmax = ${fmt(res.sigma, 1)} N/mm² — ${fmt(res.sigma / mat.sigmaLim * 100)} % de la limite`
    + ` (repère σadm = ${fmt(mat.sigmaAdm)} N/mm²)`;
}

function majEtat(r, p, etat, memo) {
  const cle = etat + (p.mat.fragile ? '-f' : '-d');
  if (memo.etat === cle) return;
  memo.etat = cle;
  const l = LIBELLES_ETAT[etat];
  let texte = l.texte;
  if (etat === 'rupture') {
    texte = p.mat.fragile
      ? 'RUPTURE : σmax a atteint la contrainte de rupture du bois, la poutre casse au point de moment maximal.'
      : 'RUPTURE : σmax a atteint la limite d\'élasticité Re de l\'acier, la poutre se plastifie (déformation permanente) au point de moment maximal.';
  }
  r.etat.dataset.etat = etat;
  r.etat.textContent = `${l.icone} ${texte}`;
}

function majCalcul(r, p, res) {
  const { mat, section, l } = p;
  const lm = l / 1000;
  const lignes = [];

  // 1. Réactions
  if (p.type === 'ponctuelle') {
    const la = res.la / 1000;
    const lb = res.lb / 1000;
    lignes.push(
      `<strong>Réactions d'appuis</strong> (ΣF = 0, ΣM/B = 0) :<br>`
      + `R<sub>A</sub> = Q × l<sub>b</sub> / l = ${fmt(res.Q)} × ${fmt(lb, 2)} / ${fmt(lm, 2)} = <strong>${fmt(res.RA)} N</strong><br>`
      + `R<sub>B</sub> = Q × l<sub>a</sub> / l = ${fmt(res.Q)} × ${fmt(la, 2)} / ${fmt(lm, 2)} = <strong>${fmt(res.RB)} N</strong>`
    );
    lignes.push(
      `<strong>Effort tranchant V</strong> :<br>`
      + `entre A et C : V = R<sub>A</sub> = +${fmt(res.RA)} N ; `
      + `entre C et B : V = R<sub>A</sub> − Q = ${fmt(res.RA - res.Q)} N (V change de signe en C).`
    );
    lignes.push(
      `<strong>Moment fléchissant</strong> : Mf = 0 en A et en B ; V s'annule en C donc Mf est maximal en C :<br>`
      + `Mf max = Q × l<sub>a</sub> × l<sub>b</sub> / l = ${fmt(res.Q)} × ${fmt(la, 2)} × ${fmt(lb, 2)} / ${fmt(lm, 2)} = <strong>${fmt(res.MfMax / 1000, 1)} N·m</strong> = ${fmt(res.MfMax)} N·mm`
    );
  } else {
    lignes.push(
      `<strong>Réactions d'appuis</strong> :<br>`
      + `charge équivalente Q = q × l = ${fmt(p.charge)} × ${fmt(lm, 2)} = ${fmt(res.Q)} N ; `
      + `par symétrie R<sub>A</sub> = R<sub>B</sub> = Q / 2 = <strong>${fmt(res.RA)} N</strong>`
    );
    lignes.push(
      `<strong>Effort tranchant V</strong> :<br>`
      + `V(A) = +${fmt(res.RA)} N ; V(B) = −${fmt(res.RB)} N ; V s'annule au milieu de la poutre (x = ${fmt(lm / 2, 2)} m).`
    );
    lignes.push(
      `<strong>Moment fléchissant</strong> : maximal là où V = 0 (mi-portée) :<br>`
      + `Mf max = q × l² / 8 = ${fmt(p.charge)} × ${fmt(lm, 2)}² / 8 = <strong>${fmt(res.MfMax / 1000, 1)} N·m</strong> = ${fmt(res.MfMax)} N·mm`
    );
  }

  // 4. Section et contrainte
  const wxTexte = section.type === 'rect'
    ? `W<sub>x</sub> = b × h² / 6 = ${fmt(section.b, 1)} × ${fmt(section.h, 1)}² / 6 = <strong>${fmt(section.Wx)} mm³</strong>`
    : `W<sub>x</sub> (tableau ${section.nom}) = ${fmt(section.Wx / 1000, 1)} cm³ = <strong>${fmt(section.Wx)} mm³</strong>`;
  const verdict = res.rompu
    ? `σmax ≥ ${mat.limNom} = ${fmt(mat.sigmaLim)} N/mm² → <strong>la poutre est rompue</strong>`
    : res.sigma > mat.sigmaAdm
      ? `σmax > σadm = ${fmt(mat.sigmaAdm)} N/mm² → <strong>la condition de résistance n'est plus respectée</strong>`
      : `σmax ≤ σadm = ${fmt(mat.sigmaAdm)} N/mm² → <strong>la poutre résiste</strong>`;
  lignes.push(
    `<strong>Contrainte de flexion</strong> :<br>${wxTexte}<br>`
    + `σ<sub>max</sub> = Mf max / W<sub>x</sub> = ${fmt(res.MfMax)} / ${fmt(section.Wx)} = <strong>${fmt(res.sigma, 2)} N/mm²</strong><br>${verdict}`
  );

  // 5. Flèche
  const I = section.I;
  let formuleFleche;
  if (p.type === 'repartie') {
    formuleFleche = `f = 5 × q × l⁴ / (384 × E × I) avec q = ${fmt(res.q, 3)} N/mm, l = ${fmt(l)} mm, E = ${fmt(mat.E)} N/mm², I = ${fmt(I)} mm⁴`;
  } else if (Math.abs(res.la - l / 2) < 1) {
    formuleFleche = `f = Q × l³ / (48 × E × I) avec l = ${fmt(l)} mm, E = ${fmt(mat.E)} N/mm², I = ${fmt(I)} mm⁴`;
  } else {
    formuleFleche = `charge non centrée : flèche maximale calculée par le simulateur (E = ${fmt(mat.E)} N/mm², I = ${fmt(I)} mm⁴)`;
  }
  const verdictF = res.f <= res.fAdm
    ? `f ≤ l/250 → flèche acceptable`
    : `f > l/250 → flèche trop grande`;
  lignes.push(
    `<strong>Flèche</strong> :<br>${formuleFleche}<br>`
    + `f = <strong>${fmt(res.f, 1)} mm</strong> ; f<sub>adm</sub> = l / 250 = ${fmt(res.fAdm, 1)} mm → ${verdictF}`
  );

  r.calcul.innerHTML = lignes.map(t => `<li>${t}</li>`).join('');
}

// =================================================================
// Initialisation
// =================================================================

export function initFlexionPoutre() {

  const r = recupererElements();
  if (!r) return;

  let chargeCourante = 0;
  let rampe = null;
  const memo = { etat: null };

  // ── Rendu complet ──────────────────────────────────────────────
  function rendre() {
    const p = lireParametres(r, chargeCourante);
    const res = analyser(p);
    const etat = etatPoutre(p, res);

    // Amplification : choisie pour que la flèche à la rupture fasse ~60 px
    let amplif = 1;
    if (r['btn-amplifier'].getAttribute('aria-pressed') === 'true') {
      const pRupt = { ...p, charge: chargeRupture(p) };
      const fRupt = analyser(pRupt).f;
      const pxRupt = fRupt * LPX / p.l;
      amplif = pxRupt > 0 ? clamp(60 / pxRupt, 1, 500) : 1;
    }

    const rompuAvant = r.scene.classList.contains('flex-scene--etat-rupture');
    dessinerScene(r, p, res, amplif, etat);
    if (etat === 'rupture' && !rompuAvant) {
      r.scene.classList.remove('flex-scene--secousse');
      void r.scene.getBoundingClientRect(); // relance l'animation
      r.scene.classList.add('flex-scene--secousse');
    }
    dessinerDiagrammes(r, p, res);
    dessinerSection(r, p);
    majIndicateurs(r, p, res, etat);
    majEtat(r, p, etat, memo);
    majCalcul(r, p, res);

    r['btn-releve'].disabled = !(res.Q > 0);
  }

  // ── Curseur de charge adapté à la configuration ────────────────
  function reglerCurseur({ charge } = {}) {
    const p = lireParametres(r, 0);
    const max = arrondiSup(1.5 * chargeRupture(p));
    const pas = pasRond(max / 500);
    r['charge-range'].max = String(max);
    r['charge-range'].step = String(pas);
    r['charge-input'].max = String(max);
    r['charge-input'].step = String(pas);
    r['charge-max'].textContent = fmt(max);
    definirCharge(clamp(charge !== undefined ? charge : chargeCourante, 0, max), false);
  }

  function definirCharge(valeur, rendreAussi = true) {
    const max = num(r['charge-range'].max, 1);
    chargeCourante = clamp(valeur, 0, max);
    r['charge-range'].value = String(chargeCourante);
    const pas = num(r['charge-range'].step, 1);
    const arrondi = pas >= 1 ? Math.round(chargeCourante) : chargeCourante;
    r['charge-input'].value = String(arrondi);
    if (rendreAussi) rendre();
  }

  // ── Adaptation de l'interface à la configuration ───────────────
  function adapterInterface() {
    const sapin = r.materiau.value === 'sapin';
    const optIpe = r.section.querySelector('option[value="ipe"]');
    if (optIpe) optIpe.disabled = sapin;
    if (sapin && r.section.value === 'ipe') r.section.value = 'rect';

    const rect = r.section.value !== 'ipe';
    r['groupe-rect'].hidden = !rect;
    r['groupe-ipe'].hidden = rect;

    const ponctuelle = r.type.value === 'ponctuelle';
    r['groupe-position'].hidden = !ponctuelle;
    r['charge-label'].textContent = ponctuelle ? 'Charge Q (N)' : 'Charge q (N/m)';

    // la ne peut pas dépasser la portée
    const l = clamp(num(r.portee.value, 3), 0.5, 12);
    r.position.max = String(l);
    const pos = num(r.position.value, 1);
    if (pos >= l || pos <= 0) r.position.value = String(l / 2);
  }

  function surChangementConfig() {
    arreterRampe();
    adapterInterface();
    reglerCurseur();
    rendre();
  }

  // ── Scénarios du cours ─────────────────────────────────────────
  function appliquerScenario(s) {
    arreterRampe();
    r.materiau.value = s.materiau;
    r.section.value = s.section;
    if (s.ipe) r.ipe.value = s.ipe;
    if (s.b) r.b.value = String(s.b);
    if (s.h) r.h.value = String(s.h);
    if (s.orientation) r.orientation.value = s.orientation;
    r.portee.value = String(s.portee);
    r.type.value = s.type;
    r.position.value = String(s.position);
    adapterInterface();
    reglerCurseur({ charge: s.charge });
    rendre();
  }

  // ── Rampe « jusqu'à la rupture » ───────────────────────────────
  function arreterRampe() {
    if (rampe) cancelAnimationFrame(rampe.id);
    rampe = null;
    r['btn-rupture'].textContent = '💥 Charger jusqu\'à la rupture';
    r['btn-rupture'].setAttribute('aria-pressed', 'false');
  }

  function lancerRampe() {
    const p = lireParametres(r, 0);
    const cible = chargeRupture(p) * 1.08;
    const rupt = chargeRupture(p);
    const debut = chargeCourante >= rupt ? 0 : chargeCourante;
    const duree = prefersReducedMotion() ? 600 : 5500;
    const t0 = performance.now();

    r['btn-rupture'].textContent = '⏹ Arrêter';
    r['btn-rupture'].setAttribute('aria-pressed', 'true');

    const pas = now => {
      if (!document.body.contains(r.scene)) { rampe = null; return; }
      const t = clamp((now - t0) / duree, 0, 1);
      definirCharge(debut + (cible - debut) * t);

      const pCourant = lireParametres(r, chargeCourante);
      const fini = t >= 1 || analyser(pCourant).rompu;
      if (fini) {
        arreterRampe();
      } else {
        rampe.id = requestAnimationFrame(pas);
      }
    };
    rampe = { id: requestAnimationFrame(pas) };
  }

  // ── Relevés de mesures ─────────────────────────────────────────
  function releverMesure() {
    const p = lireParametres(r, chargeCourante);
    const res = analyser(p);
    const etat = etatPoutre(p, res);
    const lignes = r['releves-corps'].querySelectorAll('tr');
    if (lignes.length >= MAX_RELEVES) return;

    const config = `${p.mat.nom}, ${p.section.libelle}, l = ${fmt(p.l / 1000, 2)} m`;
    const chargeTexte = p.type === 'ponctuelle'
      ? `Q = ${fmt(res.Q)} N (à ${fmt(res.la / 1000, 2)} m de A)`
      : `q = ${fmt(p.charge)} N/m`;
    const l = LIBELLES_ETAT[etat];
    const etatCourt = {
      ok: 'résiste', fleche: 'flèche excessive', contrainte: 'σadm dépassée',
      rupture: 'RUPTURE', repos: 'repos',
    }[etat];

    const tr = document.createElement('tr');
    const cellules = [
      String(lignes.length + 1),
      config,
      chargeTexte,
      `${fmt(res.MfMax / 1000, 1)} N·m`,
      `${fmt(res.sigma, 1)} N/mm²`,
      `${fmt(res.f, 1)} mm`,
      `${l.icone} ${etatCourt}`,
    ];
    cellules.forEach(texte => {
      const td = document.createElement('td');
      td.textContent = texte;
      tr.appendChild(td);
    });
    r['releves-corps'].appendChild(tr);
    r['releves-vide'].hidden = true;
  }

  function effacerReleves() {
    r['releves-corps'].replaceChildren();
    r['releves-vide'].hidden = false;
  }

  // ── Écouteurs ──────────────────────────────────────────────────
  ['materiau', 'section', 'ipe', 'b', 'h', 'orientation', 'portee', 'type', 'position']
    .forEach(id => {
      const evt = (r[id].tagName === 'SELECT') ? 'change' : 'input';
      r[id].addEventListener(evt, surChangementConfig);
    });

  r['charge-range'].addEventListener('input', () => {
    arreterRampe();
    definirCharge(num(r['charge-range'].value, 0));
  });

  r['charge-input'].addEventListener('input', () => {
    arreterRampe();
    const v = num(r['charge-input'].value, NaN);
    if (!Number.isFinite(v)) return;
    chargeCourante = clamp(v, 0, num(r['charge-range'].max, 1));
    r['charge-range'].value = String(chargeCourante);
    rendre();
  });

  r['charge-input'].addEventListener('change', () => {
    definirCharge(num(r['charge-input'].value, 0));
  });

  r['btn-rupture'].addEventListener('click', () => {
    if (rampe) { arreterRampe(); return; }
    lancerRampe();
  });

  r['btn-zero'].addEventListener('click', () => {
    arreterRampe();
    definirCharge(0);
  });

  r['btn-amplifier'].addEventListener('click', () => {
    const actif = r['btn-amplifier'].getAttribute('aria-pressed') !== 'true';
    r['btn-amplifier'].setAttribute('aria-pressed', String(actif));
    r['btn-amplifier'].classList.toggle('actif', actif);
    rendre();
  });

  r['btn-ex1'].addEventListener('click', () => appliquerScenario(SCENARIOS.exercice1));
  r['btn-ex2'].addEventListener('click', () => appliquerScenario(SCENARIOS.exercice2));
  r['btn-releve'].addEventListener('click', releverMesure);
  r['btn-efface'].addEventListener('click', effacerReleves);

  // Situation de départ : exercice 2 du cours (gîte en sapin, charge répartie)
  appliquerScenario(SCENARIOS.exercice2);
}
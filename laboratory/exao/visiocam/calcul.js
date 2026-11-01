/* VisioCam – calculs purs (aucun accès au DOM, testables sous Node).
 *
 * Repère physique : origine O choisie par l'élève, axe Oy vers le haut (l'image a son axe y vers le bas).
 * Si l'étalon sert d'axe, Ox suit la direction de l'étalon (angleAxe, en radians, dans le repère de l'image).
 *   x =  dx·cosθ + dy·sinθ        y = dx·sinθ − dy·cosθ        (dx, dy : écart à l'origine en pixels image)
 *   dx = x·cosθ + y·sinθ          dy = x·sinθ − y·cosθ         (transformation inverse)
 */
(function (racine) {
  'use strict';

  const finie = Number.isFinite;

  function mediane(t) {
    const a = t.filter(finie).sort((x, y) => x - y);
    if (!a.length) return NaN;
    const m = a.length >> 1;
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  /** Droite des moindres carrés y = pente·x + ordonnee. */
  function regressionLineaire(xs, ys) {
    const X = [], Y = [];
    for (let i = 0; i < xs.length; i++) if (finie(xs[i]) && finie(ys[i])) { X.push(xs[i]); Y.push(ys[i]); }
    const n = X.length;
    if (n < 2) return null;
    const mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n;
    let sxx = 0, sxy = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxx += (X[i] - mx) ** 2; sxy += (X[i] - mx) * (Y[i] - my); syy += (Y[i] - my) ** 2; }
    if (sxx === 0) return null;
    const pente = sxy / sxx, ordonnee = my - pente * mx;
    const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
    const incertitudePente = n > 2 ? Math.sqrt(Math.max(0, (syy - pente * sxy) / (n - 2)) / sxx) : null;
    return { pente, ordonnee, r2, n, incertitudePente };
  }

  /** Moyenne glissante (fenêtre impaire, bords raccourcis). */
  function lisser(v, fen) {
    if (!(fen > 1)) return v.slice();
    const h = fen >> 1;
    return v.map((_, i) => {
      let s = 0, k = 0;
      for (let j = Math.max(0, i - h); j <= Math.min(v.length - 1, i + h); j++) { s += v[j]; k++; }
      return s / k;
    });
  }

  /** Dérivée centrée (temps non régulier accepté) ; null aux extrémités. */
  function derivee(T, V) {
    return V.map((_, i) => {
      if (i === 0 || i === V.length - 1) return null;
      const a = V[i - 1], b = V[i + 1];
      if (a == null || b == null) return null;
      const dt = T[i + 1] - T[i - 1];
      return dt > 0 ? (b - a) / dt : null;
    });
  }

  const norme = (a, b) => (a == null || b == null ? null : Math.hypot(a, b));

  /**
   * points : [{n, px, py}] (n = numéro d'image, px/py en pixels image)
   * o : {fps, pxParMetre, origine:{x,y}|null, angleAxe, lissage, t0}
   */
  function construireDonnees(points, o) {
    const pts = points.slice().sort((a, b) => a.n - b.n);
    if (!pts.length) return [];
    const org = o.origine || { x: pts[0].px, y: pts[0].py };
    const th = o.angleAxe || 0, c = Math.cos(th), s = Math.sin(th);
    const k = o.pxParMetre > 0 ? 1 / o.pxParMetre : 1;
    const n0 = o.t0 === undefined || o.t0 === null ? pts[0].n : o.t0;
    let X = pts.map(p => ((p.px - org.x) * c + (p.py - org.y) * s) * k);
    let Y = pts.map(p => ((p.px - org.x) * s - (p.py - org.y) * c) * k);
    if (o.lissage > 1) { X = lisser(X, o.lissage); Y = lisser(Y, o.lissage); }
    const T = pts.map(p => (p.n - n0) / o.fps);
    const vx = derivee(T, X), vy = derivee(T, Y);
    const ax = derivee(T, vx), ay = derivee(T, vy);
    return pts.map((p, i) => ({
      n: p.n, t: T[i], x: X[i], y: Y[i],
      vx: vx[i], vy: vy[i], v: norme(vx[i], vy[i]),
      ax: ax[i], ay: ay[i], a: norme(ax[i], ay[i]),
      theta: null, rayon: null
    }));
  }

  function deplier(a) {
    const r = [a[0]];
    for (let i = 1; i < a.length; i++) {
      let d = a[i] - a[i - 1];
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      r.push(r[i - 1] + d);
    }
    return r;
  }

  /** Mode rotation : l'origine est le centre ; θ = angle du point autour du centre (rad, dépliés). */
  function ajouterAngle(rows) {
    if (!rows.length) return rows;
    const th = deplier(rows.map(r => Math.atan2(r.y, r.x)));
    rows.forEach((r, i) => { r.theta = th[i]; r.rayon = Math.hypot(r.x, r.y); });
    return rows;
  }

  /** Bilan sur l'intervalle [t1, t2]. */
  function bilan(rows, t1, t2) {
    const sel = rows.filter(r => r.t >= t1 - 1e-9 && r.t <= t2 + 1e-9);
    const res = { n: sel.length, sel };
    if (sel.length < 2) return res;
    res.duree = sel[sel.length - 1].t - sel[0].t;
    let d = 0;
    for (let i = 1; i < sel.length; i++) d += Math.hypot(sel[i].x - sel[i - 1].x, sel[i].y - sel[i - 1].y);
    res.distance = d;
    res.vMoy = res.duree > 0 ? d / res.duree : null;
    res.ecartDirect = Math.hypot(sel[sel.length - 1].x - sel[0].x, sel[sel.length - 1].y - sel[0].y);
    const vs = sel.filter(r => r.v != null);
    res.regV = vs.length >= 2 ? regressionLineaire(vs.map(r => r.t), vs.map(r => r.v)) : null;
    res.premierV = vs[0] || null;
    res.dernierV = vs[vs.length - 1] || null;
    const ths = sel.filter(r => r.theta != null);
    if (ths.length >= 2) {
      res.regTheta = regressionLineaire(ths.map(r => r.t), ths.map(r => r.theta));
      res.rayon = ths.reduce((s, r) => s + r.rayon, 0) / ths.length;
    }
    return res;
  }

  /* ---------- Suivi automatique par gabarit (somme des écarts absolus) ---------- */

  function gris(data, nPix) {
    const g = new Uint8Array(nPix);
    for (let i = 0; i < nPix; i++) g[i] = (data[4 * i] * 77 + data[4 * i + 1] * 151 + data[4 * i + 2] * 28) >> 8;
    return g;
  }

  /** img : {data,width,height} carré de côté impair centré sur l'objet. */
  function creerGabarit(img) {
    return { w: img.width, h: img.height, g: gris(img.data, img.width * img.height) };
  }

  /**
   * region : {data,width,height,x0,y0} (x0,y0 = position de la région dans l'image complète)
   * Cherche le centre (x,y), à ±S pixels de (cx,cy), où le gabarit ressemble le plus à l'image.
   * Retourne {x, y, ecart} (ecart = écart moyen par pixel, 0 à 255) ou null.
   */
  function meilleurePosition(region, gab, cx, cy, S) {
    const W = region.width, H = region.height, g = gris(region.data, W * H);
    const gw = gab.w, gh = gab.h, hx = gw >> 1, hy = gh >> 1, G = gab.g;
    const xmin = Math.max(Math.round(cx) - S, region.x0 + hx), xmax = Math.min(Math.round(cx) + S, region.x0 + W - 1 - hx);
    const ymin = Math.max(Math.round(cy) - S, region.y0 + hy), ymax = Math.min(Math.round(cy) + S, region.y0 + H - 1 - hy);
    if (xmin > xmax || ymin > ymax) return null;
    let best = Infinity, bx = cx, by = cy;
    for (let y = ymin; y <= ymax; y++) {
      for (let x = xmin; x <= xmax; x++) {
        const tx = x - hx - region.x0, ty = y - hy - region.y0;
        let s = 0;
        for (let j = 0; j < gh && s < best; j++) {
          let a = (ty + j) * W + tx, b = j * gw;
          for (let i = 0; i < gw; i++) { const d = g[a + i] - G[b + i]; s += d < 0 ? -d : d; }
        }
        if (s < best) { best = s; bx = x; by = y; }
      }
    }
    return { x: bx, y: by, ecart: best / (gw * gh) };
  }

  /* ---------- Formats ---------- */

  function formater(v, chiffres) {
    if (v == null || !finie(v)) return '—';
    if (v === 0) return '0';
    const p = Number(v.toPrecision(chiffres || 3));
    return p.toLocaleString('fr-FR', { maximumFractionDigits: 8 });
  }

  function versCsv(entetes, lignes, fr) {
    const sep = fr ? ';' : ',';
    const num = v => (v == null || !finie(v) ? '' : fr ? String(v).replace('.', ',') : String(v));
    return [entetes.join(sep)].concat(lignes.map(l => l.map(num).join(sep))).join('\r\n');
  }

  const api = {
    mediane, regressionLineaire, lisser, derivee, construireDonnees, deplier, ajouterAngle, bilan,
    creerGabarit, meilleurePosition, formater, versCsv
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  racine.Calcul = api;
})(typeof window !== 'undefined' ? window : globalThis);

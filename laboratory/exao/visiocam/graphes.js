/* VisioCam – tracé de graphiques sur <canvas> (sans bibliothèque externe, fonctionne hors ligne).
 *
 * Graphes.tracer(canvas, {
 *   xLabel, yLabel, aspectEgal,
 *   series : [{nom, x:[], y:[], couleur, marqueur:'rond'|'carre'|'triangle'|'croix', ligne:true|false}],
 *   droites: [{pente, ordonnee, nom, couleur}]        // y = pente·x + ordonnee
 *   bande  : {x1, x2}                                  // intervalle d'étude surligné
 * })
 * Les marqueurs diffèrent par la forme (pas seulement par la couleur) : lisible en cas de daltonisme.
 */
(function (racine) {
  'use strict';

  const POLICE = '"Atkinson Hyperlegible", system-ui, "Segoe UI", Ubuntu, sans-serif';

  function theme() {
    const cs = getComputedStyle(document.documentElement);
    const g = (n, d) => cs.getPropertyValue(n).trim() || d;
    return { fond: g('--card', '#fff'), encre: g('--ink', '#1c2430'), att: g('--mut', '#64707f'),
             trait: g('--line', '#dde3ea'), acc: g('--acc', '#0a66c2') };
  }

  function pas(min, max, cible) {
    const brut = (max - min) / cible;
    const p = Math.pow(10, Math.floor(Math.log10(brut)));
    const f = brut / p;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
  }

  const fmt = v => (Math.round(v * 1e9) / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 6 });

  function marqueur(ctx, forme, x, y, r) {
    ctx.beginPath();
    if (forme === 'carre') ctx.rect(x - r, y - r, 2 * r, 2 * r);
    else if (forme === 'triangle') { ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x + r * 1.1, y + r * 0.9); ctx.lineTo(x - r * 1.1, y + r * 0.9); ctx.closePath(); }
    else if (forme === 'croix') { ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); }
    else ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (forme === 'croix') ctx.stroke(); else ctx.fill();
  }

  function tracer(canvas, spec) {
    const th = theme();
    const largeur = Math.max(320, canvas.clientWidth || 640);
    const hauteur = Math.round(spec.aspectEgal ? Math.min(largeur * 0.75, 560) : Math.max(240, largeur * 0.5));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(largeur * dpr); canvas.height = Math.round(hauteur * dpr);
    canvas.style.height = hauteur + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = th.fond; ctx.fillRect(0, 0, largeur, hauteur);

    const G = 64, D = 18, H = 18, B = 48;
    const L = largeur - G - D, Ht = hauteur - H - B;
    const series = (spec.series || []).map(s => {
      const x = [], y = [];
      s.x.forEach((v, i) => { if (Number.isFinite(v) && Number.isFinite(s.y[i])) { x.push(v); y.push(s.y[i]); } });
      return Object.assign({}, s, { x, y });
    });
    const tousX = [].concat(...series.map(s => s.x)), tousY = [].concat(...series.map(s => s.y));
    canvas._carte = null;
    if (!tousX.length) {
      ctx.fillStyle = th.att; ctx.font = '15px ' + POLICE; ctx.textAlign = 'center';
      ctx.fillText('Pas encore de données : pointez l’objet image par image.', largeur / 2, hauteur / 2);
      return;
    }
    let xmin = Math.min(...tousX), xmax = Math.max(...tousX), ymin = Math.min(...tousY), ymax = Math.max(...tousY);
    if (xmin === xmax) { xmin -= 1; xmax += 1; }
    if (ymin === ymax) { ymin -= 1; ymax += 1; }
    const px = (xmax - xmin) * 0.06, py = (ymax - ymin) * 0.08;
    xmin -= px; xmax += px; ymin -= py; ymax += py;
    if (spec.aspectEgal) {
      const e = Math.max((xmax - xmin) / L, (ymax - ymin) / Ht);
      const cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
      xmin = cx - e * L / 2; xmax = cx + e * L / 2; ymin = cy - e * Ht / 2; ymax = cy + e * Ht / 2;
    }
    const X = v => G + (v - xmin) / (xmax - xmin) * L;
    const Y = v => H + Ht - (v - ymin) / (ymax - ymin) * Ht;
    canvas._carte = { xmin, xmax, ymin, ymax, gauche: G, haut: H, largeur: L, hauteur: Ht };

    // intervalle d'étude
    if (spec.bande) {
      ctx.fillStyle = th.acc; ctx.globalAlpha = 0.12;
      const a = Math.max(G, X(Math.min(spec.bande.x1, spec.bande.x2))), b = Math.min(G + L, X(Math.max(spec.bande.x1, spec.bande.x2)));
      if (b > a) ctx.fillRect(a, H, b - a, Ht);
      ctx.globalAlpha = 1;
    }
    // grille + graduations
    ctx.font = '12px ' + POLICE; ctx.lineWidth = 1;
    const sx = pas(xmin, xmax, 7), sy = pas(ymin, ymax, 6);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let v = Math.ceil(xmin / sx) * sx; v <= xmax + 1e-9; v += sx) {
      const x = Math.round(X(v)) + 0.5;
      ctx.strokeStyle = th.trait; ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x, H + Ht); ctx.stroke();
      ctx.fillStyle = th.att; ctx.fillText(fmt(v), x, H + Ht + 5);
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let v = Math.ceil(ymin / sy) * sy; v <= ymax + 1e-9; v += sy) {
      const y = Math.round(Y(v)) + 0.5;
      ctx.strokeStyle = th.trait; ctx.beginPath(); ctx.moveTo(G, y); ctx.lineTo(G + L, y); ctx.stroke();
      ctx.fillStyle = th.att; ctx.fillText(fmt(v), G - 7, y);
    }
    // axes passant par zéro et cadre
    ctx.strokeStyle = th.att; ctx.lineWidth = 1.2;
    if (xmin < 0 && xmax > 0) { ctx.beginPath(); ctx.moveTo(X(0), H); ctx.lineTo(X(0), H + Ht); ctx.stroke(); }
    if (ymin < 0 && ymax > 0) { ctx.beginPath(); ctx.moveTo(G, Y(0)); ctx.lineTo(G + L, Y(0)); ctx.stroke(); }
    ctx.strokeRect(G + 0.5, H + 0.5, L, Ht);
    // titres d'axes
    ctx.fillStyle = th.encre; ctx.font = '13px ' + POLICE; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(spec.xLabel || '', G + L / 2, hauteur - 8);
    ctx.save(); ctx.translate(15, H + Ht / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(spec.yLabel || '', 0, 0); ctx.restore();

    // droites (modèles)
    ctx.save(); ctx.beginPath(); ctx.rect(G, H, L, Ht); ctx.clip();
    (spec.droites || []).forEach(d => {
      ctx.strokeStyle = d.couleur || '#d35400'; ctx.lineWidth = 2; ctx.setLineDash([8, 5]);
      ctx.beginPath(); ctx.moveTo(X(xmin), Y(d.pente * xmin + d.ordonnee)); ctx.lineTo(X(xmax), Y(d.pente * xmax + d.ordonnee)); ctx.stroke();
    });
    ctx.setLineDash([]);
    // séries
    series.forEach((s, k) => {
      const couleur = s.couleur || ['#0a66c2', '#c0392b', '#1a9b4a'][k % 3];
      ctx.strokeStyle = couleur; ctx.fillStyle = couleur;
      if (s.ligne) { ctx.lineWidth = 1.5; ctx.beginPath(); s.x.forEach((v, i) => (i ? ctx.lineTo(X(v), Y(s.y[i])) : ctx.moveTo(X(v), Y(s.y[i])))); ctx.stroke(); }
      ctx.lineWidth = 2;
      s.x.forEach((v, i) => marqueur(ctx, s.marqueur || 'rond', X(v), Y(s.y[i]), 4.5));
    });
    ctx.restore();

    // légende
    const items = series.filter(s => s.nom).map((s, k) => ({ nom: s.nom, couleur: s.couleur || ['#0a66c2', '#c0392b', '#1a9b4a'][k % 3], forme: s.marqueur || 'rond', droite: false }))
      .concat((spec.droites || []).filter(d => d.nom).map(d => ({ nom: d.nom, couleur: d.couleur || '#d35400', droite: true })));
    ctx.font = '12px ' + POLICE; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    let ly = H + 14;
    items.forEach(it => {
      ctx.fillStyle = th.fond; ctx.globalAlpha = 0.85;
      ctx.fillRect(G + 8, ly - 10, ctx.measureText(it.nom).width + 34, 20); ctx.globalAlpha = 1;
      ctx.strokeStyle = it.couleur; ctx.fillStyle = it.couleur; ctx.lineWidth = 2;
      if (it.droite) { ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(G + 12, ly); ctx.lineTo(G + 30, ly); ctx.stroke(); ctx.setLineDash([]); }
      else marqueur(ctx, it.forme, G + 21, ly, 4.5);
      ctx.fillStyle = th.encre; ctx.fillText(it.nom, G + 38, ly);
      ly += 20;
    });
  }

  racine.Graphes = { tracer };
})(window);

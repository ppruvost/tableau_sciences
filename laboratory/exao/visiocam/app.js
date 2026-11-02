/* VisioCam – acquisition vidéo (caméra USB / smartphone, fichier, démonstration), pointage image par image,
 * suivi automatique et exploitation graphique (trajectoire, x(t), v(t), a(t), rotation).
 * Fonctionne dans un navigateur récent (Chrome, Chromium, Edge, Firefox) sous Lubuntu comme sous Windows.
 * Dépend de calcul.js (mathématiques) et graphes.js (tracés). Aucune bibliothèque externe.
 */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const pause = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = (v, n) => Calcul.formater(v, n || 3);

  const cvVideo = $('cvVideo'), cvOverlay = $('cvOverlay'), cvLoupe = $('loupe');
  const ctxV = cvVideo.getContext('2d', { willReadFrequently: true });
  const ctxO = cvOverlay.getContext('2d');
  const ctxL = cvLoupe.getContext('2d');

  /* ---------------------------------------------------------------- état */
  const etat = {
    source: null,            // {type, w, h, fps, duree, nImages, dessiner(n, ctx), detruire()}
    n: 0,                    // image affichée
    fin: 0,                  // dernière image du suivi automatique
    points: new Map(),       // n -> {px, py, auto}
    etalon: { a: null, b: null },
    pxParMetre: null,
    origine: null, centre: null,
    mode: 'translation',
    vue: 'trajectoire',
    sel: { t1: null, t2: null, auto: true },
    rows: [], bilan: null,
    occupe: false, stop: false, lecture: false,
    flux: null, rec: null, enreg: false, morceaux: [], dernierBlob: null, fpsLive: 30
  };

  /* ------------------------------------------------------- messages / aide */
  function dire(txt, type) {
    const m = $('message');
    m.textContent = txt || '';
    m.className = 'info' + (type ? ' ' + type : '');
    m.hidden = !txt;
  }

  const GUIDES = {
    m1: { titre: 'M1 · Décrire un mouvement', etapes: [
      'Filmez le mobile (A : caméra, B : fichier, C : démonstration) avec, dans le même plan, un objet de longueur connue (règle, mètre).',
      'Outil « Étalon » : cliquez sur les deux extrémités de l’objet connu, puis saisissez sa longueur en mètres.',
      'Outil « Pointer l’objet » : cliquez sur le mobile image par image, ou utilisez le suivi automatique.',
      'Onglet « Trajectoire » : décrivez la trajectoire (rectiligne, circulaire, quelconque).',
      'Cochez « Vecteurs vitesse » et lisez le bilan : distance, durée et vitesse moyenne v = d / Δt.',
      'Disque ou roue : choisissez le mode « Rotation », placez le centre, pointez un point du bord : fréquence f, période T et vitesse v = 2π·f·R.'] },
    m3: { titre: 'M3 · Cinématique : vitesse et accélération', etapes: [
      'Filmez le mobile (chariot sur plan incliné, bille, chute…) avec un étalon de longueur connue dans le plan du mouvement.',
      'Outil « Étalon » : deux clics aux extrémités de l’étalon, puis sa longueur en mètres.',
      'Pointez le mobile image par image (ou suivi automatique) sur toute la durée du mouvement.',
      'Onglet « Vitesse v(t) » : repérez si la vitesse est constante ou varie ; choisissez l’intervalle d’étude en faisant glisser la souris.',
      'Bilan : l’accélération a est la pente de v(t) (a = Δv / Δt) ; onglet « Accélération a(t) » pour la comparer image par image.',
      'Reportez t₁, v₁, t₂, v₂ indiqués dans le bilan dans l’onglet « Vitesse et accélération » du TP.'] },
    general: { titre: '', etapes: [
      'Choisissez une source : caméra (A), fichier du smartphone (B) ou démonstration (C).',
      'Étalonnez l’image : outil « Étalon », deux clics, longueur en mètres.',
      'Pointez le mobile image par image (ou suivi automatique).',
      'Lisez la trajectoire, les vecteurs vitesse, v(t) et a(t) dans la partie 3, puis exportez en CSV ou PNG.'] }
  };

  function afficherGuide() {
    const tp = (new URLSearchParams(location.search).get('tp') || '').toLowerCase();
    const g = GUIDES[tp] || GUIDES.general;
    $('guideTp').textContent = g.titre;
    const ol = $('guideEtapes');
    ol.innerHTML = '';
    g.etapes.forEach(t => { const li = document.createElement('li'); li.textContent = t; ol.appendChild(li); });
    if (tp === 'm3') etat.vue = 'v';
  }

  /* ----------------------------------------------------- scènes de démonstration */
  const ECH = 400; // pixels par mètre dans les scènes de démonstration

  function fondDemo(ctx, W, H) {
    ctx.fillStyle = '#f3f6fa'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#dfe6ee'; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
  }
  function regle(ctx, x, y, L, vertical, ech) {
    ctx.save(); ctx.translate(x, y); if (vertical) { ctx.rotate(Math.PI / 2); ctx.scale(1, -1); }
    ctx.fillStyle = '#e8c872'; ctx.fillRect(0, 0, L, 16);
    ctx.strokeStyle = '#3b2f10'; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) { const h = i % 5 === 0 ? 12 : 7; ctx.beginPath(); ctx.moveTo(i * L / 10, 0); ctx.lineTo(i * L / 10, h); ctx.stroke(); }
    ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 16); ctx.moveTo(L, -4); ctx.lineTo(L, 16); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#3b2f10'; ctx.font = '600 16px sans-serif'; ctx.textAlign = 'center';
    if (vertical) { ctx.save(); ctx.translate(x - 12, y + L / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('1 m', 0, 0); ctx.restore(); }
    else ctx.fillText('1 m', x + L / 2, y - 10);
  }
  function bille(ctx, x, y, r) {
    const g = ctx.createRadialGradient(x - r / 3, y - r / 3, r / 6, x, y, r);
    g.addColorStop(0, '#ff8a80'); g.addColorStop(1, '#b71c1c');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
  }

  const SCENES = {
    mru: { fps: 30, duree: 3, mode: 'translation', attendu: 'Attendu : v ≈ 0,50 m/s constante, a ≈ 0 m/s² (étalon horizontal de 1 m).',
      dessiner(ctx, t, W, H) { fondDemo(ctx, W, H); regle(ctx, 100, 480, ECH, false);
        ctx.fillStyle = '#90a4ae'; ctx.fillRect(60, 400, 840, 6); bille(ctx, 90 + 200 * t, 380, 14); } },
    mrua: { fps: 30, duree: 4, mode: 'translation', attendu: 'Attendu : a ≈ 0,20 m/s² ; v = 0,80 m/s à t = 4 s (trajectoire rectiligne inclinée).',
      dessiner(ctx, t, W, H) { fondDemo(ctx, W, H); regle(ctx, 100, 480, ECH, false);
        const ang = 10 * Math.PI / 180, s = 0.5 * 0.2 * t * t * ECH;
        ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(60, 120 + 14); ctx.lineTo(60 + 800 * Math.cos(ang), 134 + 800 * Math.sin(ang)); ctx.stroke();
        bille(ctx, 90 + s * Math.cos(ang), 120 + s * Math.sin(ang), 14); } },
    chute: { fps: 60, duree: 0.8, mode: 'translation', attendu: 'Attendu : a ≈ 9,81 m/s² (étalon vertical de 1 m, 150 px/m). Placez l’axe Ox le long de l’étalon.',
      dessiner(ctx, t, W, H) { fondDemo(ctx, W, H); regle(ctx, 860, 40, 150, true);
        bille(ctx, 480, 40 + 0.5 * 9.81 * t * t * 150, 14); } },
    rot: { fps: 30, duree: 2, mode: 'rotation', attendu: 'Attendu : f = 1,5 Hz, T ≈ 0,67 s, R = 0,30 m, v ≈ 2,8 m/s. Placez le centre au milieu du disque.',
      dessiner(ctx, t, W, H) { fondDemo(ctx, W, H); regle(ctx, 100, 480, ECH, false);
        ctx.fillStyle = '#b0bec5'; ctx.beginPath(); ctx.arc(480, 270, 150, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = '#607d8b'; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = '#263238'; ctx.beginPath(); ctx.arc(480, 270, 6, 0, 2 * Math.PI); ctx.fill();
        const a = 2 * Math.PI * 1.5 * t; bille(ctx, 480 + 120 * Math.cos(a), 270 - 120 * Math.sin(a), 14); } }
  };

  function creerSourceDemo(cle) {
    const sc = SCENES[cle], W = 960, H = 540;
    return { type: 'demo', w: W, h: H, fps: sc.fps, duree: sc.duree, nImages: Math.floor(sc.duree * sc.fps + 1e-6), scene: sc,
      async dessiner(n, ctx) { sc.dessiner(ctx, n / sc.fps, W, H); }, detruire() {} };
  }

  /* ------------------------------------------------ chargement d'une vidéo */
  function attendre(cible, evt, ms) {
    return new Promise((res, rej) => {
      const t = setTimeout(() => { nettoyer(); rej(new Error('délai dépassé')); }, ms);
      const ok = () => { nettoyer(); res(); };
      const ko = () => { nettoyer(); rej(cible.error || new Error('erreur')); };
      function nettoyer() { clearTimeout(t); cible.removeEventListener(evt, ok); cible.removeEventListener('error', ko); }
      cible.addEventListener(evt, ok); cible.addEventListener('error', ko);
    });
  }

  async function allerA(v, t) {
    t = Math.max(0, t);
    if (Number.isFinite(v.duration)) t = Math.min(t, Math.max(0, v.duration - 1e-3));
    if (Math.abs(v.currentTime - t) < 1e-4 && v.readyState >= 2) return;
    const p = attendre(v, 'seeked', 3000).catch(() => {});
    v.currentTime = t;
    await p;
  }

  /* Les enregistrements WebM du navigateur n'ont pas de durée : on force son calcul. */
  async function corrigerDuree(v) {
    if (Number.isFinite(v.duration)) return;
    await new Promise(res => {
      const fin = () => { v.removeEventListener('timeupdate', fin); v.currentTime = 0; res(); };
      v.addEventListener('timeupdate', fin);
      setTimeout(res, 2500);
      v.currentTime = 1e101;
    });
  }

  /* Mesure de la cadence de lecture (ne donne PAS la cadence de prise de vue d'un ralenti). */
  async function mesureFps(v) {
    if (!('requestVideoFrameCallback' in v)) return null;
    await allerA(v, 0);
    const temps = [];
    const ancienne = v.playbackRate;
    v.playbackRate = 0.1;
    await new Promise(res => {
      let fini = false;
      const fin = () => { if (fini) return; fini = true; v.pause(); res(); };
      const cb = (now, m) => { temps.push(m.mediaTime); if (temps.length >= 12 || v.ended) fin(); else v.requestVideoFrameCallback(cb); };
      v.requestVideoFrameCallback(cb);
      v.play().catch(fin);
      setTimeout(fin, 6000);
    });
    v.playbackRate = ancienne;
    const dts = [];
    for (let i = 1; i < temps.length; i++) if (temps[i] > temps[i - 1]) dts.push(temps[i] - temps[i - 1]);
    const m = Calcul.mediane(dts);
    return m > 0 ? 1 / m : null;
  }

  const FPS_USUELS = [24, 25, 30, 48, 50, 60, 100, 120, 200, 240, 250, 300, 480, 960];
  const arrondirFps = f => { const p = FPS_USUELS.find(x => Math.abs(f - x) / x < 0.03); return p || Math.round(f * 100) / 100; };

  async function chargerVideo(url, fpsImpose, dureeEnreg, nom) {
    dire('Chargement de la vidéo…');
    libererSource();
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    try { await attendre(v, 'loadedmetadata', 20000); }
    catch (e) {
      URL.revokeObjectURL(url);
      dire('Cette vidéo ne peut pas être lue par le navigateur (codec non pris en charge, souvent H.265/HEVC). ' +
        'Réglez le smartphone sur « format le plus compatible » (H.264) ou convertissez : ffmpeg -i entree.mov -c:v libx264 -crf 18 sortie.mp4', 'erreur');
      return;
    }
    await corrigerDuree(v);
    let duree = Number.isFinite(v.duration) ? v.duration : null;
    if (dureeEnreg) duree = duree ? Math.min(duree, dureeEnreg + 0.5) : dureeEnreg;
    if (!duree) { dire('Durée de la vidéo introuvable.', 'erreur'); return; }
    const ratio = Math.min(1, 1920 / v.videoWidth), W = Math.round(v.videoWidth * ratio), H = Math.round(v.videoHeight * ratio);
    const src = { type: 'video', video: v, url, w: W, h: H, fps: fpsImpose || 30, duree, nImages: 1,
      async dessiner(n, ctx) { await allerA(v, (n + 0.5) / this.fps); ctx.drawImage(v, 0, 0, W, H); },
      detruire() { try { v.pause(); } catch (e) {} URL.revokeObjectURL(url); v.removeAttribute('src'); v.load(); } };
    src.nImages = Math.max(1, Math.floor(duree * src.fps + 1e-6));
    await installerSource(src);
    let msg = `Vidéo chargée${nom ? ' : ' + nom : ''} — ${v.videoWidth}×${v.videoHeight}, ${fmt(duree)} s.`;
    if (fpsImpose) { msg += ` Cadence retenue : ${fmt(fpsImpose, 4)} images/s.`; dire(msg, 'ok'); return; }
    dire(msg + ' Mesure de la cadence…');
    const f = await mesureFps(v).catch(() => null);
    if (f) {
      appliquerFps(arrondirFps(f), true);
      dire(msg + ` Cadence mesurée : ${fmt(etat.source.fps, 4)} images/s. Vidéo au ralenti ? Saisissez la cadence de prise de vue ci-dessous.`, 'ok');
    } else dire(msg + ' Cadence non mesurable dans ce navigateur : vérifiez la valeur 30 images/s et corrigez-la si besoin.', 'ok');
    afficherImage(etat.n);
  }

  function appliquerFps(f, silencieux) {
    const s = etat.source;
    if (!s || s.type !== 'video' || !(f > 0)) return;
    s.fps = f;
    s.nImages = Math.max(1, Math.floor(s.duree * f + 1e-6));
    etat.fin = s.nImages - 1;
    $('fps').value = String(Math.round(f * 1000) / 1000);
    majGlisseur();
    if (!silencieux) afficherImage(Math.min(etat.n, s.nImages - 1));
  }

  function libererSource() {
    etat.lecture = false;
    if (etat.source) etat.source.detruire();
    etat.source = null;
  }

  function installerSource(src) {
    etat.source = src;
    [cvVideo, cvOverlay].forEach(c => { c.width = src.w; c.height = src.h; });
    $('fps').value = String(src.fps);
    $('fps').disabled = src.type === 'demo';
    etat.n = 0; etat.fin = src.nImages - 1;
    resetMesures();
    $('vide').hidden = true;
    majGlisseur(); majBoutons();
    return afficherImage(0);
  }

  function resetMesures() {
    etat.points.clear();
    etat.etalon = { a: null, b: null }; etat.pxParMetre = null;
    etat.origine = null; etat.centre = null;
    etat.sel = { t1: null, t2: null, auto: true };
    $('etalonInfo').textContent = 'Étalon : non défini (valeurs en pixels).';
    recalculer();
  }

  /* ------------------------------------------------------------ affichage */
  let jeton = 0;
  async function afficherImage(n) {
    const s = etat.source;
    if (!s) return;
    n = clamp(Math.round(n), 0, s.nImages - 1);
    const j = ++jeton;
    etat.n = n;
    await s.dessiner(n, ctxV);
    if (j !== jeton) return;
    majInfoImage();
    dessinerOverlay();
  }

  function majGlisseur() {
    const s = etat.source, g = $('glisseur');
    g.max = s ? s.nImages - 1 : 0;
    g.value = etat.n;
    $('plage').textContent = s ? `Fin du suivi : image ${etat.fin + 1} (t = ${fmt(etat.fin / s.fps)} s)` : '';
  }

  function majInfoImage() {
    const s = etat.source;
    if (!s) { $('infoImage').textContent = '—'; return; }
    $('glisseur').value = etat.n;
    const p = etat.points.get(etat.n);
    $('infoImage').textContent = `Image ${etat.n + 1} / ${s.nImages} · t vidéo = ${(etat.n / s.fps).toFixed(3).replace('.', ',')} s · ` +
      `${etat.points.size} point(s) pointé(s)` + (p ? ' · cette image est pointée' + (p.auto ? ' (suivi auto)' : '') : '');
  }

  function majBoutons() {
    const has = !!etat.source, occ = etat.occupe;
    ['btnPrev10', 'btnPrev', 'glisseur', 'btnNext', 'btnNext10', 'btnPlay', 'btnDetectFps', 'btnFin', 'btnEffacer', 'btnSupprPoint', 'btnPng']
      .forEach(id => { $(id).disabled = !has || occ; });
    $('btnDetectFps').disabled = !has || occ || etat.source.type !== 'video';
    $('btnSuivi').disabled = !has || occ;
    $('btnSuiviStop').disabled = !occ;
    const ok = etat.rows.length > 0;
    ['btnCsv', 'btnCopier', 'btnPngGraphe'].forEach(id => { $(id).disabled = !ok; });
  }

  /* --------------------------------------------------------------- overlay */
  function axeAngle() {
    const { a, b } = etat.etalon;
    if (!$('alignAxe').checked || !a || !b) return 0;
    let th = Math.atan2(b.y - a.y, b.x - a.x);
    if (Math.cos(th) < -1e-9) th += Math.PI;
    return th;
  }
  const versImage = (x, y, th) => ({ dx: x * Math.cos(th) + y * Math.sin(th), dy: x * Math.sin(th) - y * Math.cos(th) });

  function fleche(x0, y0, x1, y1, couleur, u) {
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 2) return;
    const a = Math.atan2(y1 - y0, x1 - x0), t = Math.min(12 * u, L * 0.5);
    ctxO.strokeStyle = couleur; ctxO.fillStyle = couleur; ctxO.lineWidth = 2.5 * u;
    ctxO.beginPath(); ctxO.moveTo(x0, y0); ctxO.lineTo(x1, y1); ctxO.stroke();
    ctxO.beginPath(); ctxO.moveTo(x1, y1);
    ctxO.lineTo(x1 - t * Math.cos(a - 0.4), y1 - t * Math.sin(a - 0.4));
    ctxO.lineTo(x1 - t * Math.cos(a + 0.4), y1 - t * Math.sin(a + 0.4)); ctxO.closePath(); ctxO.fill();
  }

  function croix(p, u, couleur, nom) {
    ctxO.strokeStyle = '#fff'; ctxO.lineWidth = 5 * u;
    ctxO.beginPath(); ctxO.moveTo(p.x - 12 * u, p.y); ctxO.lineTo(p.x + 12 * u, p.y); ctxO.moveTo(p.x, p.y - 12 * u); ctxO.lineTo(p.x, p.y + 12 * u); ctxO.stroke();
    ctxO.strokeStyle = couleur; ctxO.lineWidth = 2.2 * u; ctxO.stroke();
    if (nom) { ctxO.fillStyle = '#fff'; ctxO.font = `700 ${15 * u}px sans-serif`; ctxO.textAlign = 'left'; ctxO.fillText(nom, p.x + 10 * u, p.y - 8 * u); }
  }

  function dessinerOverlay() {
    const W = cvOverlay.width, H = cvOverlay.height, u = Math.max(1, W / 800);
    ctxO.clearRect(0, 0, W, H);
    if (!etat.source) return;
    // étalon
    const { a, b } = etat.etalon;
    if (a) {
      ctxO.strokeStyle = '#ffd400'; ctxO.fillStyle = '#ffd400'; ctxO.lineWidth = 3 * u;
      ctxO.beginPath(); ctxO.arc(a.x, a.y, 5 * u, 0, 2 * Math.PI); ctxO.fill();
      if (b) {
        ctxO.beginPath(); ctxO.moveTo(a.x, a.y); ctxO.lineTo(b.x, b.y); ctxO.stroke();
        ctxO.beginPath(); ctxO.arc(b.x, b.y, 5 * u, 0, 2 * Math.PI); ctxO.fill();
        ctxO.font = `700 ${15 * u}px sans-serif`; ctxO.textAlign = 'center';
        ctxO.fillText(fmt(Number($('etalonLong').value)) + ' m', (a.x + b.x) / 2, (a.y + b.y) / 2 - 10 * u);
      }
    }
    // repère (origine ou centre)
    const th = axeAngle();
    let o = etat.mode === 'rotation' ? etat.centre : etat.origine;
    if (!o && etat.rows.length) { const p1 = etat.points.get(etat.rows[0].n); if (p1) o = { x: p1.px, y: p1.py }; }
    if (o) {
      const L = 60 * u, ex = versImage(1, 0, th), ey = versImage(0, 1, th);
      fleche(o.x, o.y, o.x + L * ex.dx, o.y + L * ex.dy, '#4fc3f7', u);
      fleche(o.x, o.y, o.x + L * ey.dx, o.y + L * ey.dy, '#ffb74d', u);
      ctxO.font = `700 ${15 * u}px sans-serif`; ctxO.textAlign = 'left'; ctxO.fillStyle = '#4fc3f7';
      ctxO.fillText('x', o.x + (L + 6 * u) * ex.dx, o.y + (L + 6 * u) * ex.dy);
      ctxO.fillStyle = '#ffb74d'; ctxO.fillText('y', o.x + (L + 6 * u) * ey.dx, o.y + (L + 6 * u) * ey.dy);
      if (etat.mode === 'rotation') croix(o, u, '#ff5252', 'centre');
    }
    // vecteurs vitesse / accélération
    const vmax = Math.max(0, ...etat.rows.map(r => r.v || 0)), amax = Math.max(0, ...etat.rows.map(r => r.a || 0));
    const Lmax = Number($('longVec').value) * u;
    const un = etat.pxParMetre ? 'm' : 'px';
    [['voirVecV', 'v', 'vx', 'vy', vmax, '#00e5ff'],
     ['voirVecA', 'a', 'ax', 'ay', amax, '#ffab40']].forEach(([id, k, kx, ky, mx, couleur]) => {
      if (!$(id).checked || !(mx > 0)) return;
      etat.rows.forEach(r => {
        if (r[k] == null || !(r[k] > 0)) return;
        const p = etat.points.get(r.n); if (!p) return;
        const d = versImage(r[kx], r[ky], th), l = Math.hypot(d.dx, d.dy) || 1, f = (r[k] / mx * Lmax) / l;
        fleche(p.px, p.py, p.px + d.dx * f, p.py + d.dy * f, couleur, u);
      });
    });
    // positions pointées
    const cur = etat.points.get(etat.n);
    etat.points.forEach((p, n) => {
      ctxO.lineWidth = 2 * u; ctxO.strokeStyle = '#fff';
      ctxO.fillStyle = p.auto ? '#ff9800' : '#00b0ff';
      const r = (n === etat.n ? 6 : 4) * u;
      ctxO.beginPath();
      if (p.auto) { ctxO.moveTo(p.px, p.py - r * 1.3); ctxO.lineTo(p.px + r * 1.3, p.py); ctxO.lineTo(p.px, p.py + r * 1.3); ctxO.lineTo(p.px - r * 1.3, p.py); ctxO.closePath(); }
      else ctxO.arc(p.px, p.py, r, 0, 2 * Math.PI);
      ctxO.fill(); ctxO.stroke();
    });
    if (cur) { ctxO.strokeStyle = '#ff1744'; ctxO.lineWidth = 3 * u; ctxO.beginPath(); ctxO.arc(cur.px, cur.py, 12 * u, 0, 2 * Math.PI); ctxO.stroke(); }
    // légende des vecteurs
    const legendes = [];
    if ($('voirVecV').checked && vmax > 0) legendes.push(`flèche bleue : v max = ${fmt(vmax)} ${un}/s`);
    if ($('voirVecA').checked && amax > 0) legendes.push(`flèche orange : a max = ${fmt(amax)} ${un}/s²`);
    legendes.forEach((t, i) => {
      ctxO.font = `600 ${14 * u}px sans-serif`; ctxO.textAlign = 'left';
      const w = ctxO.measureText(t).width + 14 * u;
      ctxO.fillStyle = '#000a'; ctxO.fillRect(8 * u, H - (34 + i * 26) * u, w, 22 * u);
      ctxO.fillStyle = '#fff'; ctxO.fillText(t, 15 * u, H - (18 + i * 26) * u);
    });
  }

  /* --------------------------------------------------------------- pointage */
  function coords(e) {
    const r = cvOverlay.getBoundingClientRect();
    return { x: (e.clientX - r.left) * cvOverlay.width / r.width, y: (e.clientY - r.top) * cvOverlay.height / r.height };
  }
  const outil = () => document.querySelector('input[name=outil]:checked').value;
  const pasPointage = () => clamp(Math.round(Number($('pas').value)) || 1, 1, 50);
  function choisirOutil(o) { document.querySelector(`input[name=outil][value=${o}]`).checked = true; }

  function majEtalon() {
    const { a, b } = etat.etalon, L = Number($('etalonLong').value);
    if (a && b && L > 0) {
      etat.pxParMetre = Math.hypot(b.x - a.x, b.y - a.y) / L;
      $('etalonInfo').textContent = `Étalon : ${fmt(etat.pxParMetre, 4)} pixels par mètre.`;
    } else {
      etat.pxParMetre = null;
      $('etalonInfo').textContent = a ? 'Étalon : cliquez sur la seconde extrémité.' : 'Étalon : non défini (valeurs en pixels).';
    }
  }

  cvOverlay.addEventListener('pointerdown', async e => {
    if (!etat.source || etat.occupe) return;
    e.preventDefault();
    const p = coords(e), o = outil();
    if (o === 'etalon') {
      if (!etat.etalon.a || etat.etalon.b) { etat.etalon = { a: p, b: null }; }
      else { etat.etalon.b = p; choisirOutil('pointer'); }
      majEtalon(); recalculer(); dessinerOverlay();
      return;
    }
    if (o === 'origine') { etat.origine = p; choisirOutil('pointer'); recalculer(); dessinerOverlay(); return; }
    if (o === 'centre') { etat.centre = p; choisirOutil('pointer'); recalculer(); dessinerOverlay(); return; }
    if (etat.mode === 'rotation' && !etat.centre) {
      dire('Mode rotation : placez d’abord le centre (outil « Centre de rotation »), puis pointez un point du bord.', 'erreur');
      choisirOutil('centre'); return;
    }
    etat.points.set(etat.n, { px: p.x, py: p.y, auto: false });
    recalculer();
    const suivante = etat.n + pasPointage();
    if (suivante <= etat.source.nImages - 1) await afficherImage(suivante);
    else dessinerOverlay();
  });

  cvOverlay.addEventListener('pointermove', e => {
    if (!etat.source) return;
    const p = coords(e), L = cvLoupe.width, z = 33;
    cvLoupe.hidden = false;
    ctxL.imageSmoothingEnabled = false;
    ctxL.clearRect(0, 0, L, L);
    ctxL.drawImage(cvVideo, p.x - z / 2, p.y - z / 2, z, z, 0, 0, L, L);
    ctxL.strokeStyle = '#ff1744'; ctxL.lineWidth = 1.5;
    ctxL.beginPath(); ctxL.moveTo(L / 2, 0); ctxL.lineTo(L / 2, L); ctxL.moveTo(0, L / 2); ctxL.lineTo(L, L / 2); ctxL.stroke();
    const enHautADroite = p.x > cvOverlay.width * 0.6 && p.y < cvOverlay.height * 0.35;
    cvLoupe.style.left = enHautADroite ? '8px' : 'auto';
    cvLoupe.style.right = enHautADroite ? 'auto' : '8px';
  });
  cvOverlay.addEventListener('pointerleave', () => { cvLoupe.hidden = true; });

  /* ------------------------------------------------------- navigation image */
  const aller = d => { if (etat.source && !etat.occupe) afficherImage(etat.n + d); };
  $('btnPrev').onclick = () => aller(-1);
  $('btnNext').onclick = () => aller(1);
  $('btnPrev10').onclick = () => aller(-10);
  $('btnNext10').onclick = () => aller(10);
  $('glisseur').addEventListener('input', () => { if (etat.source && !etat.occupe) afficherImage(Number($('glisseur').value)); });
  document.addEventListener('keydown', e => {
    if (!etat.source || etat.occupe || (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== 'range')) return;
    if (e.key === 'ArrowRight') { aller(e.shiftKey ? 10 : 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { aller(e.shiftKey ? -10 : -1); e.preventDefault(); }
  });

  $('btnPlay').onclick = async () => {
    const s = etat.source;
    if (!s) return;
    if (etat.lecture) { etat.lecture = false; return; }
    etat.lecture = true; $('btnPlay').textContent = '⏸ Pause';
    if (etat.n >= s.nImages - 1) await afficherImage(0);
    const vit = Number($('vitesseLecture').value);
    while (etat.lecture && etat.source === s && etat.n < s.nImages - 1) {
      const t0 = performance.now();
      await afficherImage(etat.n + 1);
      const reste = 1000 / (s.fps * vit) - (performance.now() - t0);
      if (reste > 0) await pause(reste);
    }
    etat.lecture = false; $('btnPlay').textContent = '▶ Lecture';
  };

  /* ---------------------------------------------------------------- réglages */
  $('fps').addEventListener('change', () => {
    const s = etat.source, f = Number($('fps').value);
    if (!s || s.type !== 'video') return;
    if (!(f > 0)) { $('fps').value = String(s.fps); return; }
    if (etat.points.size && !confirm('Changer la cadence efface les points déjà pointés. Continuer ?')) { $('fps').value = String(s.fps); return; }
    if (etat.points.size) { etat.points.clear(); recalculer(); }
    appliquerFps(f);
  });
  $('btnDetectFps').onclick = async () => {
    const s = etat.source;
    if (!s || s.type !== 'video') return;
    if (!('requestVideoFrameCallback' in s.video)) { dire('Mesure automatique indisponible dans ce navigateur (utilisez Chrome, Chromium ou Edge) : saisissez la cadence.', 'erreur'); return; }
    if (etat.points.size && !confirm('Mesurer la cadence peut la modifier et effacer les points déjà pointés. Continuer ?')) return;
    dire('Mesure de la cadence…');
    const f = await mesureFps(s.video).catch(() => null);
    if (!f) { dire('Cadence non mesurable : saisissez-la à la main.', 'erreur'); return; }
    if (etat.points.size) { etat.points.clear(); recalculer(); }
    appliquerFps(arrondirFps(f));
    dire(`Cadence de lecture mesurée : ${fmt(s.fps, 4)} images/s. Pour une vidéo au ralenti, saisissez la cadence de prise de vue.`, 'ok');
  };
  $('etalonLong').addEventListener('input', () => { majEtalon(); recalculer(); dessinerOverlay(); });
  ['alignAxe', 'lissage'].forEach(id => $(id).addEventListener('change', () => { recalculer(); dessinerOverlay(); }));
  ['voirVecV', 'voirVecA', 'longVec'].forEach(id => $(id).addEventListener('input', dessinerOverlay));
  $('btnFin').onclick = () => { etat.fin = etat.n; majGlisseur(); };
  $('btnSupprPoint').onclick = () => { if (etat.points.delete(etat.n)) { recalculer(); majInfoImage(); dessinerOverlay(); } };
  $('btnEffacer').onclick = () => {
    if (etat.points.size && !confirm('Effacer tous les points pointés ?')) return;
    etat.points.clear(); etat.sel = { t1: null, t2: null, auto: true }; recalculer(); majInfoImage(); dessinerOverlay();
  };
  $('mode').addEventListener('change', () => {
    etat.mode = $('mode').value;
    $('tabTheta').hidden = etat.mode !== 'rotation';
    if (etat.mode !== 'rotation' && etat.vue === 'theta') etat.vue = 'trajectoire';
    if (etat.mode === 'rotation' && !etat.centre) dire('Mode rotation : choisissez l’outil « Centre de rotation » et cliquez au centre du disque.');
    recalculer(); dessinerOverlay();
  });

  /* --------------------------------------------------------- suivi automatique */
  async function suiviAuto() {
    const s = etat.source;
    if (!s) return;
    const p0 = etat.points.get(etat.n);
    if (!p0) { dire('Pointez d’abord l’objet sur l’image courante (outil « Pointer l’objet »), puis relancez le suivi.', 'erreur'); return; }
    const demi = clamp(Math.round(Number($('gabarit').value)) || 14, 4, 80);
    const S = clamp(Math.round(Number($('recherche').value)) || 60, 5, 300);
    const tol = clamp(Number($('tolerance').value) || 45, 5, 255);
    const maj = $('majGabarit').checked, pas = pasPointage();
    const fin = Math.min(etat.fin, s.nImages - 1);
    if (etat.n >= fin) { dire('Placez-vous avant l’image de fin du suivi, ou déplacez la fin (bouton « Fin du suivi »).', 'erreur'); return; }
    etat.occupe = true; etat.stop = false; majBoutons();
    dire('Suivi automatique en cours…');
    const d = 2 * demi + 1;
    const lire = (x, y) => Calcul.creerGabarit(ctxV.getImageData(Math.round(x) - demi, Math.round(y) - demi, d, d));
    let gab = lire(p0.px, p0.py), cur = { x: p0.px, y: p0.py }, compte = 0, motif = '';
    for (let k = etat.n + pas; k <= fin && !etat.stop; k += pas) {
      await afficherImage(k);
      const x0 = Math.max(0, Math.round(cur.x) - S - demi), y0 = Math.max(0, Math.round(cur.y) - S - demi);
      const x1 = Math.min(s.w, Math.round(cur.x) + S + demi + 1), y1 = Math.min(s.h, Math.round(cur.y) + S + demi + 1);
      if (x1 - x0 < d || y1 - y0 < d) { motif = `Objet sorti de l’image à l’image ${k + 1}.`; break; }
      const im = ctxV.getImageData(x0, y0, x1 - x0, y1 - y0);
      const r = Calcul.meilleurePosition({ data: im.data, width: im.width, height: im.height, x0, y0 }, gab, cur.x, cur.y, S);
      if (!r) { motif = `Objet sorti de l’image à l’image ${k + 1}.`; break; }
      if (r.ecart > tol) { motif = `Objet perdu à l’image ${k + 1} (écart ${Math.round(r.ecart)} > tolérance ${Math.round(tol)}). Pointez-le à la main, puis relancez.`; break; }
      etat.points.set(k, { px: r.x, py: r.y, auto: true });
      cur = { x: r.x, y: r.y }; compte++;
      if (maj) gab = lire(r.x, r.y);
      recalculer(); dessinerOverlay();
      await pause(0);
    }
    etat.occupe = false; majBoutons(); majInfoImage();
    dire(`Suivi terminé : ${compte} point(s) ajouté(s). ${motif}`.trim(), motif ? 'erreur' : 'ok');
  }
  $('btnSuivi').onclick = suiviAuto;
  $('btnSuiviStop').onclick = () => { etat.stop = true; };

  /* ------------------------------------------------------ calculs et résultats */
  let planifie = false;
  function recalculer() {
    const rot = etat.mode === 'rotation';
    const pts = [...etat.points.entries()].map(([n, p]) => ({ n, px: p.px, py: p.py }));
    const fps = etat.source ? etat.source.fps : 30;
    const org = rot ? etat.centre : etat.origine;
    etat.rows = (rot && !etat.centre) ? [] : Calcul.construireDonnees(pts, {
      fps, pxParMetre: etat.pxParMetre, origine: org, angleAxe: axeAngle(), lissage: Number($('lissage').value)
    });
    if (rot) Calcul.ajouterAngle(etat.rows);
    if (etat.rows.length) {
      const tmin = etat.rows[0].t, tmax = etat.rows[etat.rows.length - 1].t;
      if (etat.sel.auto || etat.sel.t1 == null) { etat.sel.t1 = tmin; etat.sel.t2 = tmax; }
      $('t1').value = String(Number(etat.sel.t1.toFixed(4)));
      $('t2').value = String(Number(etat.sel.t2.toFixed(4)));
    } else { $('t1').value = ''; $('t2').value = ''; }
    etat.bilan = etat.rows.length ? Calcul.bilan(etat.rows, etat.sel.t1, etat.sel.t2) : null;
    majBoutons();
    if (!planifie) { planifie = true; requestAnimationFrame(() => { planifie = false; rendre(); }); }
  }

  const unites = () => (etat.pxParMetre ? 'm' : 'px');

  function rendre() {
    document.querySelectorAll('.tab').forEach(b => {
      const on = b.dataset.vue === etat.vue;
      b.classList.toggle('actif', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const tab = etat.vue === 'tableau';
    $('tableauZone').hidden = !tab; $('graphe').hidden = tab;
    if (tab) rendreTableau(); else rendreGraphe();
    rendreBilan();
  }

  function rendreGraphe() {
    const rows = etat.rows, b = etat.bilan, L = unites(), g = $('graphe');
    const col = k => rows.map(r => r[k] == null ? NaN : r[k]);
    const t = col('t');
    g.classList.toggle('temps', etat.vue !== 'trajectoire');
    const bande = etat.vue !== 'trajectoire' && rows.length ? { x1: etat.sel.t1, x2: etat.sel.t2 } : null;
    let spec;
    switch (etat.vue) {
      case 'xyt':
        spec = { xLabel: 't (s)', yLabel: `position (${L})`, bande, series: [
          { nom: 'x(t)', x: t, y: col('x'), marqueur: 'rond', couleur: '#0a66c2', ligne: true },
          { nom: 'y(t)', x: t, y: col('y'), marqueur: 'carre', couleur: '#c0392b', ligne: true }] };
        break;
      case 'v':
        spec = { xLabel: 't (s)', yLabel: `v (${L}/s)`, bande, series: [{ nom: 'v (image par image)', x: t, y: col('v'), marqueur: 'rond', ligne: true }],
          droites: b && b.regV ? [{ pente: b.regV.pente, ordonnee: b.regV.ordonnee, nom: `a = ${fmt(b.regV.pente)} ${L}/s² (pente)` }] : [] };
        break;
      case 'a':
        spec = { xLabel: 't (s)', yLabel: `a (${L}/s²)`, bande, series: [{ nom: 'a (image par image)', x: t, y: col('a'), marqueur: 'carre', couleur: '#c0392b', ligne: true }],
          droites: b && b.regV ? [{ pente: 0, ordonnee: b.regV.pente, nom: `a = pente de v(t) = ${fmt(b.regV.pente)} ${L}/s²`, couleur: '#0a66c2' }] : [] };
        break;
      case 'theta':
        spec = { xLabel: 't (s)', yLabel: 'θ (rad)', bande, series: [{ nom: 'θ(t)', x: t, y: col('theta'), marqueur: 'triangle', ligne: true }],
          droites: b && b.regTheta ? [{ pente: b.regTheta.pente, ordonnee: b.regTheta.ordonnee, nom: `ω = ${fmt(b.regTheta.pente)} rad/s` }] : [] };
        break;
      default:
        spec = { xLabel: `x (${L})`, yLabel: `y (${L})`, aspectEgal: true, series: [{ nom: 'positions successives', x: col('x'), y: col('y'), marqueur: 'rond', ligne: true }] };
    }
    Graphes.tracer(g, spec);
  }

  function rendreTableau() {
    const rot = etat.mode === 'rotation', L = unites();
    const cols = [['n', 'image'], ['t', 't (s)'], ['x', `x (${L})`], ['y', `y (${L})`], ['vx', `vx (${L}/s)`], ['vy', `vy (${L}/s)`], ['v', `v (${L}/s)`],
      ['ax', `ax (${L}/s²)`], ['ay', `ay (${L}/s²)`], ['a', `a (${L}/s²)`]];
    if (rot) cols.push(['theta', 'θ (rad)'], ['rayon', `R (${L})`]);
    const tb = $('tableau');
    tb.innerHTML = '';
    const th = tb.createTHead().insertRow();
    cols.forEach(c => { const h = document.createElement('th'); h.textContent = c[1]; th.appendChild(h); });
    th.appendChild(document.createElement('th'));
    const corps = tb.createTBody();
    etat.rows.forEach(r => {
      const tr = corps.insertRow();
      cols.forEach(c => { tr.insertCell().textContent = c[0] === 'n' ? String(r.n + 1) : fmt(r[c[0]], 4); });
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = '✕'; b.title = 'Supprimer ce point'; b.setAttribute('aria-label', `Supprimer le point de l’image ${r.n + 1}`);
      b.onclick = () => { etat.points.delete(r.n); recalculer(); majInfoImage(); dessinerOverlay(); };
      tr.insertCell().appendChild(b);
    });
  }

  function carte(titre, valeur, detail, large) {
    const d = document.createElement('div');
    d.className = 'carte' + (large ? ' large' : '');
    const b = document.createElement('b'); b.textContent = titre;
    const s = document.createElement('span'); s.textContent = valeur;
    d.append(b, s);
    if (detail) { const sm = document.createElement('small'); sm.textContent = detail; d.appendChild(sm); }
    return d;
  }

  function rendreBilan() {
    const zone = $('bilan'), b = etat.bilan, L = unites();
    zone.innerHTML = '';
    const rot = etat.mode === 'rotation';
    if (rot && !etat.centre) { zone.innerHTML = '<p class="hint">Mode rotation : placez le centre du disque (outil « Centre de rotation »), puis pointez un point du bord.</p>'; return; }
    if (!b || b.n < 2) { zone.innerHTML = '<p class="hint">Pointez au moins deux positions pour obtenir un bilan.</p>'; return; }
    if (!etat.pxParMetre) zone.appendChild(carte('Étalonnage manquant', 'valeurs en pixels', 'Utilisez l’outil « Étalon » pour obtenir des mètres.', true));
    zone.appendChild(carte('Durée Δt', `${fmt(b.duree)} s`, `${b.n} positions sur l’intervalle`));
    zone.appendChild(carte('Distance parcourue d', `${fmt(b.distance)} ${L}`, `écart entre première et dernière position : ${fmt(b.ecartDirect)} ${L}`));
    if (b.vMoy != null) zone.appendChild(carte('Vitesse moyenne v = d / Δt', `${fmt(b.vMoy)} ${L}/s`, etat.pxParMetre ? `soit ${fmt(b.vMoy * 3.6)} km/h` : ''));
    if (b.regV) {
      const inc = b.regV.incertitudePente != null ? ` ± ${fmt(b.regV.incertitudePente, 2)}` : '';
      zone.appendChild(carte('Accélération a (pente de v(t))', `${fmt(b.regV.pente)}${inc} ${L}/s²`, `v(t) = a·t + v₀ avec v₀ = ${fmt(b.regV.ordonnee)} ${L}/s · R² = ${fmt(b.regV.r2, 3)}`));
    }
    if (b.premierV && b.dernierV && b.premierV !== b.dernierV) {
      const f = r => `t = ${fmt(r.t)} s ; v = ${fmt(r.v)} ${L}/s`;
      zone.appendChild(carte('À reporter dans le TP (a = Δv / Δt)', `Δv = ${fmt(b.dernierV.v - b.premierV.v)} ${L}/s`, `instant 1 : ${f(b.premierV)} — instant 2 : ${f(b.dernierV)}`, true));
    }
    if (rot && b.regTheta) {
      const w = Math.abs(b.regTheta.pente), fr = w / (2 * Math.PI);
      zone.appendChild(carte('Fréquence de rotation f', `${fmt(fr)} Hz`, `période T = ${fmt(1 / fr)} s · ${fmt(fr * 60)} tr/min · ω = ${fmt(w)} rad/s`));
      zone.appendChild(carte('Vitesse périphérique v = 2π·f·R', `${fmt(w * b.rayon)} ${L}/s`, `rayon moyen R = ${fmt(b.rayon)} ${L}`));
    }
  }

  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => { etat.vue = b.dataset.vue; rendre(); }));
  ['t1', 't2'].forEach(id => $(id).addEventListener('change', () => {
    const a = Number($('t1').value), b = Number($('t2').value);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return;
    etat.sel = { t1: Math.min(a, b), t2: Math.max(a, b), auto: false };
    recalculer();
  }));
  $('btnToutes').onclick = () => { etat.sel = { t1: null, t2: null, auto: true }; recalculer(); };

  // sélection de l'intervalle d'étude à la souris sur les graphes en fonction du temps
  (() => {
    const g = $('graphe'); let depart = null;
    const tDe = e => {
      const c = g._carte;
      if (!c || etat.vue === 'trajectoire' || etat.vue === 'tableau') return null;
      const x = e.clientX - g.getBoundingClientRect().left;
      return clamp(c.xmin + (x - c.gauche) / c.largeur * (c.xmax - c.xmin), c.xmin, c.xmax);
    };
    g.addEventListener('pointerdown', e => { const t = tDe(e); if (t == null) return; depart = t; g.setPointerCapture(e.pointerId); });
    g.addEventListener('pointermove', e => {
      if (depart == null) return;
      const t = tDe(e); if (t == null || Math.abs(t - depart) < 1e-9) return;
      etat.sel = { t1: Math.min(t, depart), t2: Math.max(t, depart), auto: false };
      recalculer();
    });
    const fin = () => { depart = null; };
    g.addEventListener('pointerup', fin); g.addEventListener('pointercancel', fin);
  })();

  let attenteRedim = null;
  window.addEventListener('resize', () => { clearTimeout(attenteRedim); attenteRedim = setTimeout(rendre, 150); });

  /* ----------------------------------------------------------------- exports */
  function telecharger(nom, blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nom;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  const horodatage = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`; };

  function tableauExport() {
    const rot = etat.mode === 'rotation', L = unites();
    const ent = ['image', 't (s)', `x (${L})`, `y (${L})`, `vx (${L}/s)`, `vy (${L}/s)`, `v (${L}/s)`, `ax (${L}/s²)`, `ay (${L}/s²)`, `a (${L}/s²)`];
    const cles = ['n', 't', 'x', 'y', 'vx', 'vy', 'v', 'ax', 'ay', 'a'];
    if (rot) { ent.push('theta (rad)', `R (${L})`); cles.push('theta', 'rayon'); }
    return { ent, lignes: etat.rows.map(r => cles.map(k => (k === 'n' ? r.n + 1 : r[k]))) };
  }
  $('btnCsv').onclick = () => {
    const { ent, lignes } = tableauExport();
    telecharger(`visiocam-${horodatage()}.csv`, new Blob(['\uFEFF' + Calcul.versCsv(ent, lignes, $('csvFr').checked)], { type: 'text/csv;charset=utf-8' }));
  };
  $('btnCopier').onclick = async () => {
    const { ent, lignes } = tableauExport();
    const txt = [ent.join('\t')].concat(lignes.map(l => l.map(v => (v == null || !Number.isFinite(v) ? '' : String(v).replace('.', ','))).join('\t'))).join('\n');
    try { await navigator.clipboard.writeText(txt); dire('Tableau copié : collez-le dans LibreOffice Calc ou Excel (Ctrl+V).', 'ok'); }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
      const ok = document.execCommand && document.execCommand('copy'); ta.remove();
      dire(ok ? 'Tableau copié : collez-le dans le tableur (Ctrl+V).' : 'Copie impossible : utilisez « Exporter CSV ».', ok ? 'ok' : 'erreur');
    }
  };
  $('btnPngGraphe').onclick = () => { $('graphe').toBlob(b => b && telecharger(`visiocam-graphe-${etat.vue}-${horodatage()}.png`, b)); };
  $('btnPng').onclick = () => {
    if (!etat.source) return;
    const c = document.createElement('canvas'); c.width = cvVideo.width; c.height = cvVideo.height;
    const x = c.getContext('2d'); x.drawImage(cvVideo, 0, 0); x.drawImage(cvOverlay, 0, 0);
    c.toBlob(b => b && telecharger(`visiocam-chronophotographie-${horodatage()}.png`, b));
  };

  /* -------------------------------------------------------- caméra et enregistrement */
  const cameraPossible = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  async function listerCameras() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) return;
    let devs = [];
    try { devs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput'); } catch (e) { return; }
    const sel = $('selCamera'), actuel = sel.value;
    sel.innerHTML = '';
    if (!devs.length) { sel.add(new Option('Aucune caméra détectée', '')); return; }
    if (devs.every(d => !d.deviceId)) { sel.add(new Option('(cliquez sur « Activer la caméra » pour voir les noms)', '')); return; }
    devs.forEach((d, i) => sel.add(new Option(d.label || `Caméra ${i + 1}`, d.deviceId)));
    if ([...sel.options].some(o => o.value === actuel)) sel.value = actuel;
  }

  function texteErreurCamera(e) {
    switch (e && e.name) {
      case 'NotAllowedError': case 'SecurityError': return 'Accès à la caméra refusé : autorisez-la (icône caméra ou cadenas dans la barre d’adresse), puis recommencez.';
      case 'NotFoundError': case 'DevicesNotFoundError': return 'Aucune caméra détectée. Vérifiez le câble USB et le mode « Webcam » du téléphone (aide ci-dessous), puis « Actualiser la liste ».';
      case 'NotReadableError': case 'AbortError': return 'La caméra est utilisée par une autre application (visioconférence, DroidCam, OBS…). Fermez-la puis recommencez.';
      case 'OverconstrainedError': return 'Cette caméra n’accepte pas cette résolution ou cette cadence : choisissez une valeur plus faible.';
      default: return 'Impossible d’ouvrir la caméra : ' + ((e && (e.message || e.name)) || 'erreur inconnue');
    }
  }

  async function activerCamera() {
    arreterCamera();
    const [w, h] = $('selRes').value.split('x').map(Number), fps = Number($('selFps').value), id = $('selCamera').value;
    const video = { width: { ideal: w }, height: { ideal: h }, frameRate: { ideal: fps } };
    if (id) video.deviceId = { exact: id };
    try { etat.flux = await navigator.mediaDevices.getUserMedia({ video, audio: false }); }
    catch (e) { dire(texteErreurCamera(e), 'erreur'); return; }
    const live = $('live');
    live.srcObject = etat.flux; live.hidden = false;
    await live.play().catch(() => {});
    const piste = etat.flux.getVideoTracks()[0], s = piste.getSettings();
    etat.fpsLive = s.frameRate || fps;
    dire(`Caméra active : ${piste.label || 'caméra'} — ${s.width}×${s.height} à ${Math.round(s.frameRate || 0)} images/s. Placez le mobile et l’étalon dans le champ, puis cliquez sur « Enregistrer ».`, 'ok');
    piste.addEventListener('ended', () => { dire('La caméra a été déconnectée (câble USB ?).', 'erreur'); arreterCamera(); });
    $('btnCam').disabled = true; $('btnCamStop').disabled = false; $('btnRec').disabled = false; $('btnRecStop').disabled = true;
    await listerCameras();
    if ([...$('selCamera').options].some(o => o.value === piste.getSettings().deviceId)) $('selCamera').value = piste.getSettings().deviceId;
  }

  function arreterCamera() {
    if (etat.enreg && etat.rec) arreterEnregistrement();   // l'enregistrement en cours est conservé, pas abandonné
    if (etat.flux) etat.flux.getTracks().forEach(t => t.stop());
    etat.flux = null;
    const live = $('live'); live.srcObject = null; live.hidden = true;
    $('btnCam').disabled = !cameraPossible; $('btnCamStop').disabled = true; $('btnRec').disabled = true;
    if (!etat.enreg) { $('btnRecStop').disabled = true; $('chrono').className = 'badge idle'; $('chrono').textContent = 'Prêt'; }
  }

  const DUREE_MAX = 30;
  function demarrerEnregistrement() {
    if (etat.enreg) return;
    if (!etat.flux || typeof MediaRecorder === 'undefined') { dire('Enregistrement impossible dans ce navigateur : filmez avec le smartphone et utilisez la source B.', 'erreur'); return; }
    const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
    const mime = types.find(t => MediaRecorder.isTypeSupported(t)) || '';
    etat.morceaux = []; etat.termine = false;
    let rec;
    try { rec = new MediaRecorder(etat.flux, mime ? { mimeType: mime, videoBitsPerSecond: 8e6 } : { videoBitsPerSecond: 8e6 }); }
    catch (e) { dire('Enregistrement impossible : ' + e.message, 'erreur'); return; }
    rec.ondataavailable = e => { if (e.data && e.data.size) etat.morceaux.push(e.data); };
    rec.onstop = terminerEnregistrement;
    const mesure = { n: 0, t0: null, t1: null };
    etat.mesure = mesure;
    const live = $('live');
    if ('requestVideoFrameCallback' in live) {
      const cb = (now, m) => {
        if (!etat.enreg) return;
        const ts = m.presentationTime || now;
        if (mesure.t0 == null) mesure.t0 = ts;
        mesure.t1 = ts; mesure.n++;
        live.requestVideoFrameCallback(cb);
      };
      live.requestVideoFrameCallback(cb);
    }
    etat.rec = rec; etat.enreg = true; etat.debutEnreg = performance.now();
    rec.start(250);
    $('btnRec').disabled = true; $('btnRecStop').disabled = false; $('btnCamStop').disabled = true;
    $('chrono').className = 'badge rec'; $('chrono').textContent = '● REC 0,0 s';
    dire('Enregistrement en cours… cliquez sur « ■ Arrêter l’enregistrement » pour le terminer (30 s maximum).');
    etat.horloge = setInterval(() => {
      const s = (performance.now() - etat.debutEnreg) / 1000;
      $('chrono').textContent = '● REC ' + s.toFixed(1).replace('.', ',') + ' s';
      if (s >= DUREE_MAX) arreterEnregistrement();
    }, 100);
  }

  /* Arrête l'enregistrement et traite la vidéo ; un délai de secours évite de la perdre si l'événement « stop » n'arrive pas. */
  function arreterEnregistrement() {
    clearInterval(etat.horloge);
    const rec = etat.rec;
    if (!rec) return;
    if (rec.state !== 'inactive') {
      try { rec.requestData(); } catch (e) {}
      try { rec.stop(); } catch (e) {}
    }
    clearTimeout(etat.secours);
    etat.secours = setTimeout(terminerEnregistrement, 2500);
  }

  async function terminerEnregistrement() {
    if (etat.termine) return;
    etat.termine = true;
    clearTimeout(etat.secours); clearInterval(etat.horloge);
    const duree = (performance.now() - etat.debutEnreg) / 1000;
    etat.enreg = false;
    $('btnRec').disabled = !etat.flux; $('btnRecStop').disabled = true; $('btnCamStop').disabled = !etat.flux;
    $('chrono').className = 'badge idle'; $('chrono').textContent = 'Prêt';
    const type = (etat.rec && etat.rec.mimeType) || 'video/webm';
    const blob = new Blob(etat.morceaux, { type });
    if (!blob.size) { dire('Enregistrement vide : la caméra n’a envoyé aucune image. Vérifiez que le flux du smartphone est toujours actif (terminal « scrcpy »).', 'erreur'); return; }
    etat.dernierBlob = blob; $('btnTelecharger').disabled = false;
    dire(`Enregistrement terminé (${fmt(duree)} s). Chargement pour le pointage…`);
    const m = etat.mesure;
    let fps = m && m.n > 5 && m.t1 > m.t0 ? (m.n - 1) / ((m.t1 - m.t0) / 1000) : etat.fpsLive;
    fps = arrondirFps(fps);
    try { await chargerVideo(URL.createObjectURL(blob), fps, duree, 'enregistrement de la caméra'); }
    catch (e) { dire('Chargement de l’enregistrement impossible : ' + (e && e.message || e) + '. Utilisez « Télécharger l’enregistrement » puis la source B.', 'erreur'); }
  }

  $('btnCam').onclick = activerCamera;
  $('btnCamStop').onclick = arreterCamera;
  $('btnRec').onclick = demarrerEnregistrement;
  $('btnRecStop').onclick = arreterEnregistrement;
  $('btnListe').onclick = listerCameras;
  $('btnTelecharger').onclick = () => {
    if (!etat.dernierBlob) return;
    telecharger(`visiocam-${horodatage()}.${/mp4/.test(etat.dernierBlob.type) ? 'mp4' : 'webm'}`, etat.dernierBlob);
  };
  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) navigator.mediaDevices.addEventListener('devicechange', listerCameras);

  /* ----------------------------------------------------------- fichier et démo */
  $('fichier').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const fps = Number($('fpsFichier').value);
    chargerVideo(URL.createObjectURL(f), fps > 0 ? fps : null, null, f.name);
    e.target.value = '';
  });

  function infoDemo() { $('demoInfo').textContent = SCENES[$('selDemo').value].attendu; }
  $('selDemo').addEventListener('change', infoDemo);
  $('btnDemo').onclick = () => {
    const cle = $('selDemo').value, sc = SCENES[cle];
    libererSource();
    $('mode').value = sc.mode; etat.mode = sc.mode; $('tabTheta').hidden = sc.mode !== 'rotation';
    if (sc.mode !== 'rotation' && etat.vue === 'theta') etat.vue = 'trajectoire';
    installerSource(creerSourceDemo(cle));
    dire('Démonstration : ' + sc.attendu + ' Étalonnez sur la règle de 1 m, puis pointez (ou lancez le suivi automatique).', 'ok');
  };

  /* ------------------------------------------------------------------ départ */
  function demarrer() {
    afficherGuide();
    infoDemo();
    if (!cameraPossible) {
      $('warn').hidden = false;
      $('warn').textContent = 'Caméra indisponible dans ce contexte : ouvrez la page en HTTPS (Codeberg Pages) ou via http://localhost. ' +
        'Le chargement d’une vidéo (B) et la démonstration (C) restent possibles.';
      ['btnCam', 'btnListe'].forEach(id => { $(id).disabled = true; });
    } else listerCameras();
    if (typeof MediaRecorder === 'undefined') $('btnRec').title = 'Enregistrement non pris en charge par ce navigateur';
    majBoutons();
    recalculer();
  }
  demarrer();
})();
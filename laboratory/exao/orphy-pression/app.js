'use strict';
const $ = id => document.getElementById(id);
const FULL_SCALE = 1500, TOL_PCT = 1;           // capsule 0–1500 hPa, ±1 %
$('pTol').textContent = (FULL_SCALE * TOL_PCT / 100).toFixed(0);

let port = null, reader = null, writer = null, keepReading = false;
let simTimer = null, pollTimer = null, simulating = false;
let series = [];            // {t, p}
let boyle = [];             // {v, p}
let lastP = null, t0 = Date.now();
const MAX_SECONDS = 60;

if (!('serial' in navigator)) $('warn').hidden = false;

/* ---------- Terminal ---------- */
function log(text, cls) {
  const log = $('log');
  const span = document.createElement('span');
  if (cls) span.className = cls;
  span.textContent = text;
  log.appendChild(span);
  while (log.childNodes.length > 500) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}
const toHex = b => Array.from(b, x => x.toString(16).padStart(2, '0')).join(' ');

/* ---------- Connexion ---------- */
function setStatus(txt, cls) {
  const s = $('status'); s.textContent = txt; s.className = 'badge ' + cls;
}
async function connect() {
  try {
    port = await navigator.serial.requestPort();
    const f = $('fmt').value;
    await port.open({
      baudRate: parseInt($('baud').value, 10),
      dataBits: 8,
      parity: f[1] === 'E' ? 'even' : f[1] === 'O' ? 'odd' : 'none',
      stopBits: f[2] === '2' ? 2 : 1,
      bufferSize: 4096
    });
    await applySignals();
    writer = port.writable.getWriter();
    keepReading = true;
    setStatus('Connecté', 'on');
    $('btnConnect').disabled = true; $('btnDisconnect').disabled = false;
    log(`[Connecté ${$('baud').value} bauds ${f}]\n`);
    readLoop();
    startPolling();
  } catch (e) {
    log('[Erreur connexion] ' + e.message + '\n');
    if (/permission|denied|busy|access/i.test(e.message))
      log('[Linux] sudo usermod -aG dialout $USER puis se reconnecter à la session.\n');
  }
}
async function readLoop() {
  const dec = new TextDecoder();
  let buf = '';
  while (port && port.readable && keepReading) {
    reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        log($('hex').checked ? toHex(value) + '\n' : dec.decode(value, { stream: true }));
        buf += dec.decode(value, { stream: true });
        let m;
        while ((m = buf.search(/[\r\n]/)) >= 0) {
          const line = buf.slice(0, m); buf = buf.slice(m + 1);
          if (line.trim()) handleLine(line);
        }
        if (buf.length > 2000) buf = '';
      }
    } catch (e) { log('[Erreur lecture] ' + e.message + '\n'); }
    finally { reader.releaseLock(); }
  }
}
async function disconnect() {
  keepReading = false; stopPolling();
  try { if (reader) await reader.cancel(); } catch {}
  try { if (writer) { writer.releaseLock(); } } catch {}
  try { if (port) await port.close(); } catch {}
  port = reader = writer = null;
  setStatus('Déconnecté', 'off');
  $('btnConnect').disabled = false; $('btnDisconnect').disabled = true;
  log('[Déconnecté]\n');
}
async function send() {
  if (!writer) { log('[Non connecté]\n'); return; }
  let data;
  if ($('hexSend').checked) {
    const hexes = $('cmd').value.trim().split(/[\s,;]+/).filter(Boolean);
    if (!hexes.length || hexes.some(h => !/^[0-9a-fA-F]{1,2}$/.test(h))) { log('[Hex invalide]\n'); return; }
    data = new Uint8Array(hexes.map(h => parseInt(h, 16)));
  } else {
    const eol = $('eol').value.replace('\\r', '\r').replace('\\n', '\n');
    data = new TextEncoder().encode($('cmd').value + eol);
  }
  await writer.write(data);
  log('> ' + toHex(data) + '\n', 'tx');
}
async function applySignals() {
  try { await port.setSignals({ dataTerminalReady: $('dtr').checked, requestToSend: $('rts').checked }); }
  catch (e) { log('[Signaux DTR/RTS] ' + e.message + '\n'); }
}
/* Scan passif : écoute 2,5 s pour chaque débit et combinaison DTR/RTS */
async function scan() {
  if (port) await disconnect();
  let p;
  try { p = await navigator.serial.requestPort(); } catch (e) { log('[Scan annulé]\n'); return; }
  log("[Scan : allumez l'ORPHY juste avant, appuyez sur des touches, ne touchez plus à la page. Durée ≈ 1 min 10]\n");
  const bauds = [9600, 19200, 38400, 57600, 115200, 230400];
  const sigs = [[true, true], [true, false], [false, true], [false, false]];
  for (const b of bauds) for (const [dtr, rts] of sigs) {
    try {
      await p.open({ baudRate: b });
      await p.setSignals({ dataTerminalReady: dtr, requestToSend: rts });
      const r = p.readable.getReader(); let n = 0; const first = [];
      const to = setTimeout(() => r.cancel(), 2500);
      try {
        while (true) {
          const { value, done } = await r.read();
          if (done) break;
          if (value) { n += value.length; for (const x of value) if (first.length < 16) first.push(x); }
        }
      } catch {}
      clearTimeout(to); r.releaseLock(); await p.close();
      log(`${b} bauds DTR=${+dtr} RTS=${+rts} : ${n} octet(s) ${n ? toHex(first) : ''}\n`);
    } catch (e) { log(`${b} bauds : erreur ${e.message}\n`); try { await p.close(); } catch {} }
  }
  log('[Scan terminé]\n');
}
function startPolling() {
  stopPolling();
  const ms = parseInt($('poll').value, 10);
  if (ms > 0 && $('cmd').value) pollTimer = setInterval(send, ms);
}
function stopPolling() { if (pollTimer) clearInterval(pollTimer); pollTimer = null; }

/* ---------- Décodage ---------- */
function toHpa(raw) {
  if ($('mode').value === 'hpa') return raw;
  const r1 = +$('r1').value, r2 = +$('r2').value, p1 = +$('p1').value, p2 = +$('p2').value;
  if (r1 === r2) return NaN;
  return p1 + (raw - r1) * (p2 - p1) / (r2 - r1);
}
function handleLine(line) {
  // première valeur numérique de la ligne (virgule ou point décimal)
  const m = line.match(/[-+]?\d+(?:[.,]\d+)?(?:[eE][-+]?\d+)?/);
  if (!m) return;
  const raw = parseFloat(m[0].replace(',', '.'));
  const p = toHpa(raw);
  if (Number.isFinite(p)) pushValue(p);
}

/* ---------- Affichage ---------- */
function pushValue(p) {
  lastP = p;
  const t = (Date.now() - t0) / 1000;
  series.push({ t, p });
  while (series.length && t - series[0].t > MAX_SECONDS) series.shift();
  $('pHpa').textContent = p.toFixed(1);
  $('pKpa').textContent = (p / 10).toFixed(2);
  $('pBar').textContent = (p / 1000).toFixed(3);
  $('gaugeBar').style.width = Math.max(0, Math.min(100, p / FULL_SCALE * 100)) + '%';
  drawChart();
}
function drawChart() {
  const c = $('chart'), g = c.getContext('2d');
  const W = c.width, H = c.height, L = 55, B = 25, T = 10, R = 10;
  g.clearRect(0, 0, W, H);
  const css = getComputedStyle(document.body);
  const ink = css.color, mut = '#8895a5';
  g.font = '12px sans-serif'; g.strokeStyle = mut; g.fillStyle = mut;
  for (let i = 0; i <= 5; i++) {
    const y = T + (H - T - B) * i / 5, v = FULL_SCALE * (1 - i / 5);
    g.globalAlpha = .25; g.beginPath(); g.moveTo(L, y); g.lineTo(W - R, y); g.stroke(); g.globalAlpha = 1;
    g.fillText(v.toFixed(0), 8, y + 4);
  }
  g.fillText('hPa', 8, T + 2 - 0); g.fillText('temps (s)', W - 70, H - 6);
  if (series.length < 2) return;
  const tEnd = series[series.length - 1].t, tStart = Math.max(0, tEnd - MAX_SECONDS);
  const x = t => L + (t - tStart) / (tEnd - tStart || 1) * (W - L - R);
  const y = p => T + (H - T - B) * (1 - Math.max(0, Math.min(FULL_SCALE, p)) / FULL_SCALE);
  g.strokeStyle = '#0a66c2'; g.lineWidth = 2; g.beginPath();
  series.forEach((s, i) => i ? g.lineTo(x(s.t), y(s.p)) : g.moveTo(x(s.t), y(s.p)));
  g.stroke();
  g.fillStyle = mut; g.fillText(tStart.toFixed(0), L, H - 6); g.fillText(tEnd.toFixed(0), W - R - 25, H - 6);
}

/* ---------- Simulation ---------- */
function toggleSim() {
  if (simulating) {
    clearInterval(simTimer); simulating = false;
    setStatus('Déconnecté', 'off'); $('btnSim').textContent = 'Mode simulation';
    return;
  }
  simulating = true; t0 = Date.now();
  setStatus('Simulation', 'sim'); $('btnSim').textContent = 'Arrêter la simulation';
  simTimer = setInterval(() => {
    const t = (Date.now() - t0) / 1000;
    const p = 1013 + 120 * Math.sin(t / 3) + (Math.random() - .5) * 4;
    log(p.toFixed(1) + '\n'); handleLine(p.toFixed(1));
  }, 200);
}

/* ---------- Boyle-Mariotte ---------- */
function addBoyle() {
  if (lastP == null) { alert('Aucune mesure de pression reçue.'); return; }
  const v = (+$('vTube').value) + (+$('vSyr').value);
  boyle.push({ v, p: lastP });
  renderBoyle();
}
function renderBoyle() {
  $('tbody').innerHTML = boyle.map((b, i) =>
    `<tr><td>${i + 1}</td><td>${b.v.toFixed(2)}</td><td>${(1 / b.v).toFixed(4)}</td><td>${b.p.toFixed(1)}</td><td>${(b.p * b.v).toFixed(0)}</td></tr>`).join('');
  const n = boyle.length;
  if (n >= 2) {
    const xs = boyle.map(b => 1 / b.v), ys = boyle.map(b => b.p);
    const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
    const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
    const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    const syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
    const k = sxy / sxx, b0 = my - k * mx, r2 = sxy * sxy / (sxx * syy || 1);
    const pv = boyle.map(b => b.p * b.v), mean = pv.reduce((a, b) => a + b) / n;
    $('boyleRes').textContent =
      `P = k·(1/V) + b : k = ${k.toFixed(0)} hPa·cm³, b = ${b0.toFixed(1)} hPa, R² = ${r2.toFixed(4)} · P·V moyen = ${mean.toFixed(0)} hPa·cm³`;
    drawBoyle(k, b0);
  } else { $('boyleRes').textContent = ''; drawBoyle(); }
}
function drawBoyle(k, b0) {
  const c = $('chartB'), g = c.getContext('2d'), W = c.width, H = c.height, L = 55, B = 28, T = 10, R = 15;
  g.clearRect(0, 0, W, H);
  g.font = '12px sans-serif'; g.fillStyle = g.strokeStyle = '#8895a5';
  g.beginPath(); g.moveTo(L, T); g.lineTo(L, H - B); g.lineTo(W - R, H - B); g.stroke();
  g.fillText('P (hPa)', 5, T + 10); g.fillText('1/V (cm⁻³)', W - 80, H - 8);
  if (!boyle.length) return;
  const xs = boyle.map(b => 1 / b.v), ys = boyle.map(b => b.p);
  const xmax = Math.max(...xs) * 1.1, ymax = Math.max(...ys, 1) * 1.1;
  const X = x => L + x / xmax * (W - L - R), Y = y => H - B - y / ymax * (H - B - T);
  if (k !== undefined) {
    g.strokeStyle = '#c0392b'; g.beginPath(); g.moveTo(X(0), Y(b0)); g.lineTo(X(xmax), Y(k * xmax + b0)); g.stroke();
  }
  g.fillStyle = '#0a66c2';
  boyle.forEach(b => { g.beginPath(); g.arc(X(1 / b.v), Y(b.p), 4, 0, 7); g.fill(); });
}

/* ---------- Export CSV ---------- */
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
$('btnCsv').onclick = () =>
  download('orphy_pression.csv', 't_s;P_hPa\n' + series.map(s => `${s.t.toFixed(2)};${s.p.toFixed(1)}`.replace(/\./g, ',')).join('\n'));
$('btnCsvBoyle').onclick = () =>
  download('boyle_mariotte.csv', 'V_cm3;P_hPa;PV\n' + boyle.map(b => `${b.v.toFixed(2)};${b.p.toFixed(1)};${(b.p * b.v).toFixed(0)}`.replace(/\./g, ',')).join('\n'));

/* ---------- Événements ---------- */
$('btnConnect').onclick = connect;
$('btnDisconnect').onclick = disconnect;
$('btnSim').onclick = toggleSim;
$('btnSend').onclick = send;
$('btnScan').onclick = scan;
$('dtr').onchange = $('rts').onchange = () => { if (port) applySignals(); };
$('cmd').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
$('poll').onchange = () => { if (writer) startPolling(); };
$('btnClear').onclick = () => { series = []; t0 = Date.now(); drawChart(); };
$('btnClearLog').onclick = () => $('log').textContent = '';
$('btnAdd').onclick = addBoyle;
$('btnClearBoyle').onclick = () => { boyle = []; renderBoyle(); };
$('mode').onchange = () => $('linBox').hidden = $('mode').value !== 'lin';
if ('serial' in navigator) navigator.serial.addEventListener('disconnect', () => { if (port) disconnect(); });
drawChart(); drawBoyle();
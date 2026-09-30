/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * TD03 : onglet « Activités atelier » (statique et RDM)
 * mathilab/tp-geometrie/js/atelier-statique.js
 *
 * Trois calculateurs, tirés des TP de mécanique (Mermoz) :
 *   1. poids P = m × g (vecteur vertical vers le bas)
 *   2. équilibre de forces verticales parallèles
 *      (théorème des moments en A, puis de la résultante)
 *   3. résistance d'un cordon de soudure au cisaillement
 * ============================================================
 */

const num = (id) => {
  const el = document.getElementById(id);
  if (!el || el.value === '') return NaN;
  return parseFloat(el.value);
};

const f = (v) => (Math.round(v * 100) / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 });

/* ============================================================
   SOUS-ONGLETS de l'onglet atelier (portée limitée à #activites-atelier)
   ============================================================ */
function initSousOngletsAtelier() {
  const racine = document.getElementById('activites-atelier');
  if (!racine) return;
  const boutons = [...racine.querySelectorAll('.sous-btn[data-atelier]')];
  boutons.forEach((btn) => btn.addEventListener('click', () => {
    boutons.forEach((b) => b.classList.toggle('actif', b === btn));
    racine.querySelectorAll('.sous-panel').forEach((p) => {
      p.classList.toggle('actif', p.id === btn.dataset.atelier);
    });
  }));
}

/* ============================================================
   1. POIDS
   ============================================================ */
function calculerPoids() {
  const m = num('at-masse');
  const g = num('at-g');
  const zone = document.getElementById('at-poids-res');
  if (!zone) return;
  if ([m, g].some(Number.isNaN) || m < 0 || g <= 0) {
    zone.textContent = 'Saisir une masse positive et une valeur de g strictement positive.';
    return;
  }
  const P = m * g;
  zone.innerHTML = `
    P = m × g = ${f(m)} × ${f(g)} = <strong>${f(P)} N</strong><br>
    Vecteur poids : P⃗ (0 ; −${f(P)}) — norme ‖P⃗‖ = ${f(P)} N, appliqué en G, droite d'action verticale, sens vers le bas.
  `;
}

/* ============================================================
   2. ÉQUILIBRE DE FORCES VERTICALES PARALLÈLES
   Les charges agissent vers le bas ; A et B (appuis) vers le haut.
   Moments en A : B × (xB − xA) = Σ F × (x − xA)
   Résultante   : A + B = Σ F
   ============================================================ */
const PRESETS_EQ = {
  // TP3 : pré-séparateur suspendu à deux tiges filetées (P = 300 kg × 10)
  separateur: { xa: 0, xb: 608, charges: [['P (poids)', 3000, 400], ['', '', ''], ['', '', '']] },
  // TP2 : clapet anti-retour (cotes relevées sur le sujet, origine en G)
  clapet: { xa: 103, xb: -105, charges: [['P (poids)', 120, 0], ['C (tuyauterie gauche)', 350, -227], ['D (tuyauterie droite)', 250, 223.5]] },
};

function appliquerPresetEquilibre(cle) {
  const p = PRESETS_EQ[cle];
  if (!p) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('at-xa', p.xa);
  set('at-xb', p.xb);
  p.charges.forEach(([nom, n, x], i) => {
    set(`at-f${i + 1}-nom`, nom);
    set(`at-f${i + 1}-n`, n);
    set(`at-f${i + 1}-x`, x);
  });
  calculerEquilibre();
}

function calculerEquilibre() {
  const zone = document.getElementById('at-eq-res');
  if (!zone) return;
  const xa = num('at-xa');
  const xb = num('at-xb');
  if ([xa, xb].some(Number.isNaN)) { zone.textContent = 'Saisir les positions de A et de B.'; return; }
  if (xa === xb) { zone.textContent = 'A et B doivent être à des positions différentes.'; return; }

  const charges = [1, 2, 3]
    .map((i) => ({
      nom: (document.getElementById(`at-f${i}-nom`)?.value || `F${i}`).trim() || `F${i}`,
      n: num(`at-f${i}-n`),
      x: num(`at-f${i}-x`),
    }))
    .filter((c) => !Number.isNaN(c.n) && !Number.isNaN(c.x));

  if (charges.length === 0) { zone.textContent = 'Renseigner au moins une charge (intensité et position).'; return; }

  const somme = charges.reduce((s, c) => s + c.n, 0);
  const moments = charges.reduce((s, c) => s + c.n * (c.x - xa), 0);
  const B = moments / (xb - xa);
  const A = somme - B;

  const detailMoments = charges
    .map((c) => `${f(c.n)} × (${f(c.x)} − ${f(xa)})`)
    .join(' + ');
  const sens = (v) => (v >= 0 ? 'vers le haut' : 'vers le bas (le sens est inversé)');

  zone.innerHTML = `
    <strong>Moments en A :</strong> B × (${f(xb)} − ${f(xa)}) = ${detailMoments}<br>
    B = ${f(moments)} / ${f(xb - xa)} = <strong>${f(B)} N</strong> (${sens(B)})<br><br>
    <strong>Résultante :</strong> A + B = ${f(somme)} N, donc A = ${f(somme)} − ${f(B)} = <strong>${f(A)} N</strong> (${sens(A)})<br><br>
    <strong>Lecture vectorielle :</strong> ${charges.map((c) => `${c.nom.split(' (')[0]}⃗ (0 ; −${f(c.n)})`).join(' ; ')} ;
    A⃗ (0 ; ${f(A)}) ; B⃗ (0 ; ${f(B)}) — somme des ordonnées =
    ${f(A + B - somme)}, soit le vecteur nul : le système est en équilibre.
  `;
}

/* ============================================================
   3. RÉSISTANCE D'UNE SOUDURE (cisaillement)
   S = n × a × L ; Rg = Re / 2 ; Rpg = Rg / s ; τ = T / S ; τ ≤ Rpg
   ============================================================ */
const PRESETS_SD = {
  // TP2 RDM : support de détecteur, longueur cherchée
  detecteur: { T: 540, Re: 175, s: 5, a: 3, n: 1, L: '' },
  // TP1 RDM : oreille de levage, cordons a = 2,5 mm de 60 mm de chaque côté
  oreille: { T: 600, Re: 235, s: 10, a: 2.5, n: 2, L: 60 },
};

function appliquerPresetSoudure(cle) {
  const p = PRESETS_SD[cle];
  if (!p) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('at-T', p.T); set('at-Re', p.Re); set('at-s', p.s);
  set('at-a', p.a); set('at-n', p.n); set('at-L', p.L);
  calculerSoudure();
}

function calculerSoudure() {
  const zone = document.getElementById('at-sd-res');
  if (!zone) return;
  const T = num('at-T');
  const Re = num('at-Re');
  const s = num('at-s');
  const a = num('at-a');
  const n = num('at-n');
  const L = num('at-L');

  if ([T, Re, s, a, n].some(Number.isNaN) || T < 0 || Re <= 0 || s <= 0 || a <= 0 || n < 1) {
    zone.textContent = 'Saisir T, Re, s, a et n (valeurs strictement positives).';
    return;
  }

  const Rg = Re / 2;
  const Rpg = Rg / s;
  const Lmin = T / (n * a * Rpg);

  let html = `
    Rg = Re / 2 = ${f(Re)} / 2 = <strong>${f(Rg)} MPa</strong><br>
    Rpg = Rg / s = ${f(Rg)} / ${f(s)} = <strong>${f(Rpg)} MPa</strong><br>
    Longueur minimale : Lmin = T / (n × a × Rpg) = ${f(T)} / (${f(n)} × ${f(a)} × ${f(Rpg)}) = <strong>${f(Lmin)} mm</strong>
    (en pratique, arrondir au millimètre supérieur : ${Math.ceil(Lmin)} mm)
  `;

  if (!Number.isNaN(L) && L > 0) {
    const S = n * a * L;
    const tau = T / S;
    const ok = tau <= Rpg;
    html += `<br><br>
      S = n × a × L = ${f(n)} × ${f(a)} × ${f(L)} = <strong>${f(S)} mm²</strong><br>
      τ = T / S = ${f(T)} / ${f(S)} = <strong>${f(tau)} MPa</strong><br>
      ${f(tau)} ${ok ? '≤' : '>'} ${f(Rpg)} → <strong>${ok ? 'la condition de résistance est vérifiée : la soudure résiste.' : 'la condition de résistance n\'est pas vérifiée : la soudure ne résiste pas.'}</strong>
    `;
  }

  zone.innerHTML = html;
}

/* ============================================================
   INITIALISATION
   ============================================================ */
export function initAtelierStatique() {
  initSousOngletsAtelier();

  document.getElementById('at-poids-calc')?.addEventListener('click', calculerPoids);
  document.getElementById('at-eq-calc')?.addEventListener('click', calculerEquilibre);
  document.getElementById('at-sd-calc')?.addEventListener('click', calculerSoudure);

  document.querySelectorAll('[data-preset-eq]').forEach((b) => b.addEventListener('click', () => appliquerPresetEquilibre(b.dataset.presetEq)));
  document.querySelectorAll('[data-preset-sd]').forEach((b) => b.addEventListener('click', () => appliquerPresetSoudure(b.dataset.presetSd)));

  calculerPoids();
  calculerEquilibre();
  calculerSoudure();
}

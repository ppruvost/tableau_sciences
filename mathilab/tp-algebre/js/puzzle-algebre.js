/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * Activité Puzzle : rendu commun (sous-onglets Sujet A / B / C / Synthèse)
 * mathilab/tp-algebre/js/puzzle-algebre.js
 *
 * Chaque TD fournit une fonction construire(cle) qui renvoie
 *   { A: {contexte, problematique, questions[5]}, B: {...}, C: {...} }
 * (clé = « niveau-filière », ex. '1ere-trpm') ou null.
 * Les 4 premières questions font progresser, la 5e répond à la problématique.
 * ============================================================
 */

export const CADRES = {
  trpm: "Dans un atelier d'usinage",
  tci: "Dans un atelier de chaudronnerie",
  mcc: "Dans un atelier de confection",
  log: "Dans une plateforme logistique",
  agora: "Dans un service administratif",
};

export function fmt(v) {
  return (Math.round(v * 100) / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

/** coefs du degré le plus élevé au degré 0 → « x³ − 15x² + 48x + 150 » */
export function polynome(coefs) {
  const deg = coefs.length - 1;
  let s = '';
  coefs.forEach((c, i) => {
    if (!c) return;
    const p = deg - i;
    const abs = Math.abs(c);
    const m = (abs === 1 && p > 0) ? '' : fmt(abs);
    const v = p === 0 ? '' : p === 1 ? 'x' : 'x' + ['', '', '²', '³'][p];
    s += (s === '' ? (c < 0 ? '−' : '') : (c < 0 ? ' − ' : ' + ')) + m + v;
  });
  return s || '0';
}

const LETTRES = ['a', 'b', 'c'];
const INFO_DEFAUT = "Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher les trois sujets.";
const INFO_SUJETS = "Chaque sujet (A, B, C) a son propre contexte et sa propre problématique : 4 questions pour progresser, puis une 5e question pour répondre à la problématique.";

function initSousOnglets() {
  const barre = document.querySelector('#activites-puzzle .sous-onglets');
  const panneau = document.getElementById('activites-puzzle');
  if (!barre || !panneau) return;
  barre.querySelectorAll('.sous-btn').forEach(btn => btn.addEventListener('click', () => {
    barre.querySelectorAll('.sous-btn').forEach(x => x.classList.toggle('actif', x === btn));
    panneau.querySelectorAll('.sous-panel').forEach(p => p.classList.toggle('actif', p.id === btn.dataset.sous));
  }));
}

export function initPuzzle(construire, selectId = 'select-filiere-pro') {
  initSousOnglets();
  const rendre = cle => {
    const info = document.getElementById('puzzle-info');
    const sujets = cle ? construire(cle) : null;
    LETTRES.forEach(l => {
      const s = sujets ? sujets[l.toUpperCase()] : null;
      const ctx = document.getElementById(`puzzle-${l}-contexte`);
      const prb = document.getElementById(`puzzle-${l}-problematique`);
      const qs = document.getElementById(`puzzle-${l}-enonce`);
      if (ctx) ctx.textContent = s ? s.contexte : '';
      if (prb) prb.innerHTML = s ? `<strong>Problématique :</strong> ${s.problematique}` : '';
      if (qs) qs.innerHTML = s ? s.questions.map(q => `<li>${q}</li>`).join('') : '';
    });
    if (info) info.textContent = sujets ? INFO_SUJETS : INFO_DEFAUT;
  };
  const select = document.getElementById(selectId);
  if (!select) return;
  select.addEventListener('change', () => rendre(select.value || null));
  rendre(select.value || null);
}

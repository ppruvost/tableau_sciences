/**
 * ============================================================
 * MATHILAB — Activité Puzzle en onglet (statistiques, géométrie, algorithme)
 * mathilab/js/puzzle-onglet.js
 *
 * Un modèle de TD = { params, build }
 *   params : { 'filiere' | 'niveau-filiere' : {...} }
 *   build(P, niveau, cadre, filiere) →
 *     { A: {contexte, problematique, questions[5], code?}, B: {...}, C: {...} }
 * Les 4 premières questions font progresser ; la 5e répond à la problématique.
 * ============================================================
 */

export const CADRES = {
  remi: "Dans un atelier de maintenance industrielle",
  gatl: "Dans une entreprise de transport et de logistique",
  trpm: "Dans un atelier d'usinage",
  tci: "Dans un atelier de chaudronnerie",
  mcc: "Dans un atelier de confection",
  log: "Dans une plateforme logistique",
  agora: "Dans un service administratif",
};

export const R5 = "Répondre à la problématique par une phrase argumentée, avec l'unité.";

export function fmt(v) {
  return (Math.round(v * 100) / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

const LETTRES = ['a', 'b', 'c'];
const INFO_DEFAUT = "Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher les trois sujets.";
const INFO_SUJETS = "Organisation en classe puzzle : chaque groupe expert traite un sujet (A, B ou C) avec son propre contexte et sa propre problématique — 4 questions pour progresser, puis une 5e question pour répondre à la problématique. En séance 2, les groupes mélangés confrontent leurs résultats dans la synthèse.";

function initSousOnglets() {
  const barre = document.querySelector('#activites-puzzle .sous-onglets');
  const panneau = document.getElementById('activites-puzzle');
  if (!barre || !panneau) return;
  barre.querySelectorAll('.sous-btn').forEach(btn => btn.addEventListener('click', () => {
    barre.querySelectorAll('.sous-btn').forEach(x => x.classList.toggle('actif', x === btn));
    panneau.querySelectorAll('.sous-panel').forEach(p => p.classList.toggle('actif', p.id === btn.dataset.sous));
  }));
}

export function demarrerPuzzle(modele, selectId = 'select-filiere-pro') {
  initSousOnglets();
  const construire = cle => {
    const [niv, fil] = cle.split('-');
    const P = modele.params[cle] || modele.params[fil];
    return P ? modele.build(P, niv, CADRES[fil], fil) : null;
  };
  const rendre = cle => {
    const info = document.getElementById('puzzle-info');
    const sujets = cle ? construire(cle) : null;
    LETTRES.forEach(l => {
      const s = sujets ? sujets[l.toUpperCase()] : null;
      const set = (id, fn) => { const el = document.getElementById(`puzzle-${l}-${id}`); if (el) fn(el); };
      set('contexte', el => { el.textContent = s ? s.contexte : ''; });
      set('problematique', el => { el.innerHTML = s ? `<strong>Problématique :</strong> ${s.problematique}` : ''; });
      set('enonce', el => { el.innerHTML = s ? s.questions.map(q => `<li>${q}</li>`).join('') : ''; });
      set('code', el => { if (s && s.code) el.value = s.code; });
    });
    if (info) info.textContent = sujets ? INFO_SUJETS : INFO_DEFAUT;
  };
  const select = document.getElementById(selectId);
  if (!select) return;
  select.addEventListener('change', () => rendre(select.value || null));
  rendre(select.value || null);
}

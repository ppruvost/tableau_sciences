/* ==========================================================================
   notation/analyse-physique.js — Règles de notation des comptes rendus de PHYSIQUE (SciLab)
   Sans accès au DOM : utilisable dans le navigateur comme sous Node (tests).

   Trois rubriques, cotées comme les questions (0 = non conforme, 1 = partiel, 2 = réussi) :
     • choix du matériel utilisé ;
     • pertinence des valeurs saisies dans « Manipulation » ;
     • questions Q1 à Q5 (contrôles de calcul + grille propre au TP).

   Les contrôles communs à tous les TP de physique sont dans controlesGeneriques().
   Les grilles propres à un TP sont dans REFERENTIELS (clé « domaine|code »).
   Pour noter un nouveau TP : ajouter une entrée dans REFERENTIELS (voir « ELECTRICITE|TP02 »).
   ========================================================================== */

/* ---------- Outils ---------- */

const CHIFFRES_INDICE = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };

/** Minuscules, sans accents, indices convertis (U₁ → u1), espaces simplifiés. */
export function norm(s) {
  return String(s ?? "").toLowerCase()
    .replace(/[₀-₉]/g, d => CHIFFRES_INDICE[d])
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ").trim();
}

const versNombre = t => parseFloat(String(t).replace(",", "."));
const fmtN = x => (Math.round(x * 100) / 100).toString().replace(".", ",");

/** Nombres écrits dans un texte (hors « U1 », « I2 » : chiffres collés à une lettre-variable). */
export function nombres(texte) {
  const t = String(texte ?? "").replace(/(\d)\s*[x×*]\s*(?=\d)/gi, "$1 × ");
  return (t.match(/(?<![A-Za-zÀ-ÿ\d_.,])-?\d+(?:[.,]\d+)?/g) || []).map(versNombre).filter(Number.isFinite);
}

/** a ≈ b à `tol` près (relatif). */
export const proche = (a, b, tol = 0.03) => Number.isFinite(a) && Number.isFinite(b) && (a === b || Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b), 1e-9));

/** Valeur en unité SI (kW → W, kV → V, mA → A…). */
function enSI(valeur, unite) {
  const m = /^([kmM])?(W|V|A|Ω|ohm)s?\b/.exec(unite || "");
  if (!m || !m[1]) return valeur;
  return valeur * { k: 1e3, m: 1e-3, M: 1e6 }[m[1]];
}

/* ---------- Contrôle des calculs écrits par l'élève ---------- */

/**
 * Repère les égalités « 28.8 × 0.43² = 5.33 » et vérifie le résultat.
 * Ne signale que les erreurs de calcul certaines (opération mal effectuée).
 */
export function erreursArithmetiques(texte) {
  const t = String(texte ?? "").replace(/,/g, ".").replace(/[×x*]/gi, "*").replace(/[÷:]/g, "/").replace(/−/g, "-");
  const re = /((?:\d+(?:\.\d+)?²?\s*[*/+\-]\s*)+\d+(?:\.\d+)?²?)\s*=\s*(-?\d+(?:\.\d+)?)/g;
  const erreurs = [];
  let m;
  while ((m = re.exec(t))) {
    const expr = m[1].replace(/²/g, "**2");
    if (!/^[\d.+\-*/\s]+$/.test(expr)) continue;               // rien d'autre que des chiffres et opérateurs
    let attendu;
    try { attendu = Function(`"use strict"; return (${expr});`)(); } catch { continue; }
    const donne = parseFloat(m[2]);
    if (Number.isFinite(attendu) && Math.abs(attendu - donne) > Math.max(0.02 * Math.abs(attendu), 0.011)) {
      erreurs.push(`calcul « ${m[1].replace(/\*/g, "×").replace(/\s+/g, " ")} = ${m[2]} » : le résultat exact est ${fmtN(attendu)}`);
    }
  }
  return erreurs;
}

/* ---------- Contrôles communs à tous les TP de physique ---------- */

/** Contrôles applicables sans grille propre au TP : calculs faux, résultats éloignés de ceux de la manipulation. */
export function controlesGeneriques(c, q) {
  const erreurs = [], remarques = [];
  const rep = String(q.reponse || "");
  if (!rep.trim()) return { erreurs, remarques };
  erreurs.push(...erreursArithmetiques(rep));
  const refs = c.manipulationResultats || [];
  const calcul = /calcul/.test(norm(q.enonce));
  const nb = nombres(rep);
  if (calcul && refs.length && nb.length && !refs.some(r => nb.some(n => proche(n, r, 0.03)))) {
    remarques.push(`aucun résultat de l'élève ne correspond à ceux de la manipulation (${[...new Set(refs)].map(fmtN).join(" ; ")})`);
  }
  return { erreurs, remarques };
}

/* ---------- Référentiel : ÉLECTRICITÉ — TP02 « Transport de l'énergie électrique » ---------- */

const ORDRE_ECHAUFFEMENT = ["froid", "tiede", "chaud", "tres chaud", "brulant"];

function contexteTP02(c) {
  const lignes = c.manipulationValeurs || [];
  const val = re => {
    const l = lignes.find(x => re.test(norm(x.label)));
    return l && l.valeur !== null ? enSI(l.valeur, l.unite) : null;
  };
  const txt = re => { const l = lignes.find(x => re.test(norm(x.label))); return l ? norm(l.texte) : ""; };
  const x = {
    P: val(/^puissance transportee/), Rl: val(/^resistance de la ligne/), U1bt: val(/^tension basse tension/),
    Ibt: val(/^basse tension - intensite/), pertesBt: val(/^basse tension - pertes/),
    Usim: val(/^simulateur - tension au primaire/), N1: val(/spires au primaire/), N2: val(/spires au secondaire/),
    U1: val(/^partie a - tension mesuree au primaire/), U2: val(/^partie a - tension mesuree au secondaire/),
    R1: val(/essai 1 - resistance/), I1: val(/essai 1 - intensite/), R2: val(/essai 2 - resistance/), I2: val(/essai 2 - intensite/),
    ech1: txt(/essai 1 - echauffement/), ech2: txt(/essai 2 - echauffement/)
  };
  x.ratio = x.U1 > 0 && x.U2 !== null ? x.U2 / x.U1 : null;
  x.PJ1 = x.R1 > 0 && x.I1 !== null ? x.R1 * x.I1 ** 2 : null;
  x.PJ2 = x.R2 > 0 && x.I2 !== null ? x.R2 * x.I2 ** 2 : null;
  return x;
}

const niveauEchauffement = t => { const i = ORDRE_ECHAUFFEMENT.findIndex(n => t.includes(n)); return i; };

/** Cotation 0/1/2 d'après le nombre de critères satisfaits sur `total`. */
function cotationParCriteres(satisfaits, total, { reussite = total, partiel = Math.ceil(total / 2) } = {}) {
  return satisfaits >= reussite ? 2 : satisfaits >= partiel ? 1 : 0;
}

const TP02 = {
  titre: "ÉLECTRICITÉ — TP02 Transport de l’énergie électrique",

  /* Matériel : essentiels (tous attendus), acceptés (utiles, non pénalisés), le reste est hors sujet. */
  materiel: {
    essentiels: [
      { nom: "Générateur de tension alternative", re: /generateur/ },
      { nom: "Multimètre numérique", re: /multimetre/ },
      { nom: "Transformateur", re: /transformateur/ },
      { nom: "Résistances", re: /resistance/ },
      { nom: "Fils de connexion", re: /\bfils\b|cordon/ }
    ],
    acceptes: [/pince.*crocodile/, /interrupteur|bouton/]
  },

  /* Pertinence des valeurs saisies : liste de contrôles { libelle, test(x) → true | false | null (non vérifiable) }. */
  manipulation: [
    { libelle: "valeurs de la manipulation réelle toutes renseignées et positives",
      test: x => [x.U1, x.U2, x.R1, x.I1, x.R2, x.I2].every(v => v !== null && v > 0) },
    { libelle: "tension au primaire compatible avec le générateur (0–12 V, tolérance 10 %)",
      test: x => x.U1 === null ? null : x.U1 > 0 && x.U1 <= 13.2 },
    { libelle: "rapport U₂/U₁ mesuré plausible pour un transformateur (entre 0,05 et 20)",
      test: x => x.ratio === null ? null : x.ratio >= 0.05 && x.ratio <= 20 },
    { libelle: "tension R × I de chaque essai compatible avec le générateur (0–12 V, tolérance 10 %)",
      test: x => (x.R1 && x.I1 && x.R2 && x.I2) ? x.R1 * x.I1 <= 13.2 && x.R2 * x.I2 <= 13.2 : null },
    { libelle: "échauffement ressenti cohérent avec l'intensité (plus d'intensité → au moins aussi chaud)",
      test: x => {
        if (x.I1 === null || x.I2 === null) return null;
        const n1 = niveauEchauffement(x.ech1), n2 = niveauEchauffement(x.ech2);
        if (n1 < 0 || n2 < 0) return null;
        return x.PJ1 === null || x.PJ2 === null ? null : (x.PJ2 - x.PJ1) * (n2 - n1) >= 0;
      } },
    { libelle: "simulateur : I = P / U et pertes = R × I² cohérents",
      test: x => (x.P && x.U1bt && x.Ibt && x.Rl && x.pertesBt) ? proche(x.Ibt, x.P / x.U1bt, 0.03) && proche(x.pertesBt, x.Rl * x.Ibt ** 2, 0.03) : null }
  ],

  /* Questions Q1 à Q5 : { cotation, justification, erreurs } d'après la réponse et les valeurs de la manipulation. */
  questions: {
    Q1(c, q) {
      const t = norm(q.reponse);
      const volt = /voltm|v~|tension/.test(t), amp = /amp\w*m\w*tre|a~|intensite|courant/.test(t);
      const deriv = /derivation|parallele/.test(t), serie = /\bserie\b/.test(t);
      const voltOK = volt && deriv, ampOK = amp && serie;
      const justifie = /permet|car |parce|afin|pour mesurer|pour mettre|pour que/.test(t);
      const k = [voltOK, ampOK, justifie].filter(Boolean).length;
      const manque = [!voltOK && "voltmètre (V~) en dérivation pour la tension", !ampOK && "ampèremètre (A~) en série pour l’intensité", !justifie && "justification du branchement"].filter(Boolean);
      return { cotation: !t ? 0 : cotationParCriteres(k, 3), erreurs: [],
        justification: manque.length ? `Manque : ${manque.join(" ; ")}.` : "Position du multimètre, branchement et justification donnés pour les deux mesures." };
    },

    Q2(c, q) {
      const x = contexteTP02(c), t = norm(q.reponse), nb = nombres(q.reponse);
      if (!t || x.ratio === null) return { cotation: t ? null : 0, justification: t ? "" : "Pas de réponse.", erreurs: [] };
      const valeursOK = nb.some(n => proche(n, x.U1, 0.01)) && nb.some(n => proche(n, x.U2, 0.01));
      const claim = /u2 ?\/ ?u1 ?= ?(-?\d+(?:[.,]\d+)?)/.exec(t);
      const rapportDonne = claim ? versNombre(claim[1]) : null;
      const rapportOK = rapportDonne !== null ? proche(rapportDonne, x.ratio, 0.03) : nb.some(n => proche(n, x.ratio, 0.03));
      const dit = /abaisseur/.test(t) ? "abaisseur" : /elevateur/.test(t) ? "élévateur" : "";
      const attendu = x.ratio < 1 ? "abaisseur" : "élévateur";
      const sensOK = dit === attendu;
      const erreurs = [];
      if (!rapportOK) {
        const inverse = rapportDonne !== null && proche(rapportDonne, 1 / x.ratio, 0.03);
        erreurs.push(`U₂/U₁ attendu ≈ ${fmtN(x.ratio)} (${fmtN(x.U2)} / ${fmtN(x.U1)}), l’élève donne ${rapportDonne !== null ? fmtN(rapportDonne) : "autre chose"}${inverse ? " (rapport inversé : U₁/U₂)" : ""}`);
      }
      if (rapportDonne !== null && dit && ((rapportDonne > 1) !== (dit === "élévateur"))) erreurs.push(`conclusion « ${dit} » incohérente avec le rapport écrit (${fmtN(rapportDonne)})`);
      if (!sensOK) erreurs.push(`sens attendu : ${attendu}${dit ? `, l’élève écrit « ${dit} »` : ", non précisé"}`);
      const k = [valeursOK, rapportOK, sensOK].filter(Boolean).length;
      const cot = valeursOK && rapportOK && sensOK ? 2 : (valeursOK && (rapportOK || sensOK)) || (rapportOK && sensOK) ? 1 : 0;
      return { cotation: cot, erreurs, justification: k === 3 ? "Tensions, rapport U₂/U₁ et sens du transformateur corrects." : `Contrôle : ${erreurs.concat(valeursOK ? [] : ["tensions U₁ et U₂ mesurées non rappelées"]).join(" ; ")}.` };
    },

    Q3(c, q) {
      const x = contexteTP02(c), t = norm(q.reponse), nb = nombres(q.reponse);
      if (!t || x.PJ1 === null || x.PJ2 === null) return { cotation: t ? null : 0, justification: t ? "" : "Pas de réponse.", erreurs: [] };
      const intensitesOK = nb.some(n => proche(n, x.I1, 0.01)) && nb.some(n => proche(n, x.I2, 0.01));
      const pj1 = nb.some(n => proche(n, x.PJ1, 0.03)), pj2 = nb.some(n => proche(n, x.PJ2, 0.03));
      const lien = /echauff|chaud|tiede|chaleur|temperature/.test(t);
      const erreurs = erreursArithmetiques(q.reponse);
      if (!(pj1 && pj2)) {
        const sansCarre = nb.some(n => proche(n, x.R1 * x.I1, 0.03)) || nb.some(n => proche(n, x.R2 * x.I2, 0.03));
        erreurs.push(`P_J attendues ≈ ${fmtN(x.PJ1)} W (essai 1) et ${fmtN(x.PJ2)} W (essai 2)${sansCarre ? " : l’élève a calculé R × I au lieu de R × I²" : ""}`);
      }
      const k = [intensitesOK, pj1 && pj2, lien].filter(Boolean).length;
      const cot = k === 3 ? 2 : k === 2 ? 1 : (intensitesOK || (pj1 && pj2)) ? 1 : 0;
      return { cotation: cot, erreurs, justification: k === 3 ? "Intensités, puissances dissipées et lien avec l’échauffement corrects." : `Contrôle : ${erreurs.join(" ; ") || "réponse incomplète"}${lien ? "" : " ; lien avec l’échauffement non fait"}.` };
    },

    Q4(c, q) {
      const x = contexteTP02(c), t = norm(q.reponse), nb = nombres(q.reponse);
      if (!t || x.ratio === null) return { cotation: t ? null : 0, justification: t ? "" : "Pas de réponse.", erreurs: [] };
      const attendu = x.ratio < 1 ? "abaisseur" : "elevateur";
      const sensOK = t.includes(attendu);
      const claim = /u([12]) ?\/ ?u([12]) ?= ?(-?\d+(?:[.,]\d+)?)/.exec(t);
      // rapport écrit dans l'orientation annoncée (U2/U1 ou U1/U2) : juste si la valeur correspond à cette orientation
      const rapportOK = claim ? proche(versNombre(claim[3]), claim[1] === "2" ? x.ratio : 1 / x.ratio, 0.03) : nb.some(n => proche(n, x.ratio, 0.03) || proche(n, 1 / x.ratio, 0.03));
      const joule = /joule|puissance|chaleur|echauff/.test(t) && /intensite|courant|\bi\b/.test(t);
      const avecUnite = (norm(q.reponse).match(/\d(?:[.,]\d+)? ?(?:v|w|a|ohms?|kw|kv|ma)\b/g) || []).length;
      const unitesOK = avecUnite >= 2;
      const erreurs = [];
      if (!rapportOK) erreurs.push(`rapport mesuré U₂/U₁ ≈ ${fmtN(x.ratio)} attendu${claim ? `, l’élève écrit U${claim[1]}/U${claim[2]} = ${fmtN(versNombre(claim[3]))}` : ""}`);
      const watts = [...norm(q.reponse).matchAll(/(-?\d+(?:[.,]\d+)?) ?w\b/g)].map(m => versNombre(m[1]));
      if (watts.length && !watts.some(w => proche(w, x.PJ1, 0.05) || proche(w, x.PJ2, 0.05))) erreurs.push(`puissance donnée (${watts.map(fmtN).join(" ; ")} W) différente des mesures (${fmtN(x.PJ1)} W et ${fmtN(x.PJ2)} W)`);
      const k = [sensOK, rapportOK, joule, unitesOK].filter(Boolean).length;
      const manque = [!sensOK && "sens du transformateur", !rapportOK && "rapport mesuré exact", !joule && "lien effet Joule / intensité", !unitesOK && "valeurs avec leurs unités"].filter(Boolean);
      return { cotation: cotationParCriteres(k, 4, { reussite: 3, partiel: 2 }), erreurs,
        justification: manque.length ? `Conclusion à compléter : ${manque.join(" ; ")}${erreurs.length ? ` (${erreurs.join(" ; ")})` : ""}.` : "Conclusion complète : transformateur, effet Joule, valeurs et unités." };
    },

    Q5(c, q) {
      const t = norm(q.reponse);
      const tensions = /tension/.test(t) && /(entree|primaire)/.test(t) && /(sortie|secondaire)/.test(t);
      const echauffement = /(temperature|echauff|chaleur)/.test(t) && /(intensite|courant)/.test(t);
      const k = [tensions, echauffement].filter(Boolean).length;
      const manque = [!tensions && "mesure des tensions au primaire et au secondaire", !echauffement && "observation de l’échauffement selon l’intensité"].filter(Boolean);
      return { cotation: !t ? 0 : cotationParCriteres(k, 2, { reussite: 2, partiel: 1 }), erreurs: [],
        justification: manque.length ? `La démarche proposée ne mentionne pas : ${manque.join(" ; ")}.` : "La démarche répond aux deux parties de la problématique." };
    }
  }
};

export const REFERENTIELS = { "electricite|tp02": TP02 };

export const estPhysique = c => /physi|chimie|sciences/i.test(c.matiere || "") && !/math/i.test(c.matiere || "");
export const referentiel = c => REFERENTIELS[`${norm(c.domaine)}|${norm(c.codeTd)}`] || null;

/* ---------- Rubrique « Matériel utilisé » ---------- */

/**
 * @returns {{cotation:number|null, justification:string, resume:string, facultatif:boolean}}
 * Sans référentiel pour ce TP, la rubrique reste à coter par l'enseignant (facultative : exclue de la note tant qu'elle est vide).
 */
export function evaluerMateriel(c) {
  const choisis = (c.materiel || []).map(m => m.nom);
  const resume = choisis.length ? choisis.map(n => `• ${n}`).join("\n") : "(aucun matériel déclaré)";
  const ref = referentiel(c);
  if (!ref) return { cotation: null, justification: "Pas de grille de matériel pour ce TP : à coter par l’enseignant.", resume, facultatif: true };
  const n = choisis.map(norm);
  const manquants = ref.materiel.essentiels.filter(e => !n.some(x => e.re.test(x)));
  const horsSujet = choisis.filter((_, i) => !ref.materiel.essentiels.some(e => e.re.test(n[i])) && !ref.materiel.acceptes.some(re => re.test(n[i])));
  const cotation = manquants.length === 0 && horsSujet.length === 0 ? 2
    : manquants.length <= Math.floor(ref.materiel.essentiels.length / 3) && horsSujet.length <= 1 ? 1 : 0;
  const parts = [];
  if (manquants.length) parts.push(`manque : ${manquants.map(m => m.nom).join(", ")}`);
  if (horsSujet.length) parts.push(`matériel inutile pour ce TP : ${horsSujet.join(", ")}`);
  return { cotation, resume, facultatif: false,
    justification: parts.length ? `Choix du matériel — ${parts.join(" ; ")}.` : "Matériel essentiel complet, sans matériel inutile." };
}

/* ---------- Rubrique « Pertinence des valeurs saisies » ---------- */

/** Résumé lisible des valeurs saisies + cotation d'après les contrôles du référentiel. */
export function evaluerManipulation(c) {
  const lignes = c.manipulationValeurs || [];
  const resume = lignes.length ? lignes.map(l => `${l.label} : ${l.texte}`).join("\n") : "(aucune valeur lue)";
  const ref = referentiel(c);
  if (!ref) return { cotation: null, justification: "Pas de grille de pertinence pour ce TP : à coter par l’enseignant.", resume, facultatif: true };
  if (!lignes.length) return { cotation: 0, justification: "Aucune valeur saisie dans « Manipulation ».", resume, facultatif: false };
  const x = contexteTP02(c);
  const verifies = ref.manipulation.map(r => ({ r, ok: r.test(x) })).filter(v => v.ok !== null);
  const echecs = verifies.filter(v => !v.ok).map(v => v.r.libelle);
  const part = verifies.length ? (verifies.length - echecs.length) / verifies.length : 0;
  const cotation = part >= 0.99 ? 2 : part >= 0.6 ? 1 : 0;
  return { cotation, resume, facultatif: false,
    justification: echecs.length ? `Valeurs peu pertinentes — à revoir : ${echecs.join(" ; ")}.` : `Valeurs saisies pertinentes (${verifies.length} contrôles réussis).` };
}

/* ---------- Questions Q1 à Q5 ---------- */

/**
 * Contrôles d'une question : { cotation (proposée, ou null), justification, erreurs[], remarques[] }.
 * `erreurs` = erreurs certaines (calcul faux, valeur incohérente) : elles plafonnent la cotation à 1.
 */
export function evaluerQuestion(c, q) {
  const ref = referentiel(c);
  const regle = ref?.questions[q.code];
  if (regle) {
    const r = regle(c, q);
    const arith = erreursArithmetiques(q.reponse).filter(e => !(r.erreurs || []).some(x => x.includes(e)));
    return { cotation: r.cotation, justification: r.justification, erreurs: [...(r.erreurs || []), ...arith], remarques: [] };
  }
  const g = controlesGeneriques(c, q);
  return { cotation: null, justification: "", erreurs: g.erreurs, remarques: g.remarques };
}

/* ==========================================================================
   notation/analyse-rubriques.js — Rubriques cotées en plus des questions
   (même barème 0 / 1 / 2, même note /10)

     MAT    choix du matériel utilisé            (physique)
     MANIP  pertinence des valeurs saisies       (physique)
     AUTO   auto-évaluation des compétences      (TOUTES les matières : maths et sciences)

   Chaque rubrique est une « pseudo-question » (rubrique: true) rangée dans copie.questions :
   elle est cotée, modifiable et enregistrée comme une question (table notation_reponses).
   ========================================================================== */
import { estPhysique, evaluerMateriel, evaluerManipulation, evaluerQuestion } from "./analyse-physique.js";

export const CODES_RUBRIQUES = ["MAT", "MANIP", "AUTO"];
export const estRubrique = q => CODES_RUBRIQUES.includes(q.code);
export const questionsReelles = c => c.questions.filter(q => !estRubrique(q));

const TITRES = {
  MAT: "Choix du matériel utilisé",
  MANIP: "Pertinence des valeurs saisies dans « Manipulation »",
  AUTO: "Auto-évaluation des compétences (lucidité : écart avec la cotation des questions)"
};

const pseudoQuestion = (code, extra = {}) => ({
  code, rubrique: true, competence: "", enonce: TITRES[code], reponse: "",
  cotation: null, cotationIA: null, signal: false, justification: "", facultatif: false, manuel: false, ...extra
});

/* ---------- Auto-évaluation ---------- */

/**
 * Lucidité de l'élève : pour chaque compétence auto-évaluée (niveau 0 à 2) ET travaillée dans les questions,
 * on compare le niveau déclaré à la moyenne des cotations (0 à 2) des questions de cette compétence.
 * Écart moyen ≤ 0,5 → 2 ; ≤ 1 → 1 ; sinon 0.   Aucune compétence comparable → rubrique non évaluée (null).
 */
export function cotationAutoEvaluation(questions, autoevaluation) {
  const parSigle = {};
  questions.filter(q => !estRubrique(q) && q.competence && q.cotation !== null && q.cotation !== undefined)
    .forEach(q => (parSigle[q.competence] ||= []).push(Number(q.cotation)));
  const lignes = (autoevaluation || [])
    .filter(a => Number.isFinite(a.niveau) && parSigle[a.sigle])
    .map(a => {
      const prof = parSigle[a.sigle].reduce((s, x) => s + x, 0) / parSigle[a.sigle].length;
      return { sigle: a.sigle, eleve: a.niveau, prof, ecart: Math.abs(a.niveau - prof) };
    });
  if (!lignes.length) return { cotation: null, justification: "Aucune compétence auto-évaluée ne peut être comparée aux questions cotées.", lignes };
  const moyenne = lignes.reduce((s, l) => s + l.ecart, 0) / lignes.length;
  const cotation = moyenne <= 0.5 ? 2 : moyenne <= 1 ? 1 : 0;
  const detail = lignes.map(l => `${l.sigle} ${l.eleve}/${(Math.round(l.prof * 10) / 10).toString().replace(".", ",")}`).join(", ");
  return { cotation, lignes, justification: `Écart moyen ${(Math.round(moyenne * 100) / 100).toString().replace(".", ",")} point (élève/cotation : ${detail}).` };
}

/** Met à jour la rubrique AUTO d'après les cotations actuelles (sauf si l'enseignant l'a fixée à la main). */
export function recalculerAuto(c) {
  const q = c.questions.find(x => x.code === "AUTO");
  if (!q) return;
  const r = cotationAutoEvaluation(c.questions, c.autoevaluation);
  q.reponse = (c.autoevaluation || []).map(a => `${a.sigle} — ${a.capacite} : niveau ${a.niveau}`).join("\n");
  if (q.manuel) return;
  q.cotation = q.cotationIA = r.cotation;
  q.justification = r.justification;
  q.facultatif = r.cotation === null;
}

/* ---------- Création des rubriques à la lecture d'une copie ---------- */

export function ajouterRubriques(c) {
  c.questions = c.questions.filter(q => !estRubrique(q));
  const avant = [];
  if (estPhysique(c)) {
    avant.push(pseudoQuestion("MAT"), pseudoQuestion("MANIP"));
  }
  const apres = (c.autoevaluation || []).length ? [pseudoQuestion("AUTO", { facultatif: true })] : [];
  c.questions = [...avant, ...c.questions, ...apres];
  evaluerRubriquesPhysique(c);
  recalculerAuto(c);
}

/** Cote MAT et MANIP (règles déterministes). Une cotation fixée à la main n'est jamais écrasée. */
export function evaluerRubriquesPhysique(c) {
  if (c.rubriquesGelees) return;     // copie rouverte depuis la base : les données brutes du PDF ne sont plus là
  [["MAT", evaluerMateriel], ["MANIP", evaluerManipulation]].forEach(([code, fn]) => {
    const q = c.questions.find(x => x.code === code);
    if (!q || q.manuel) return;
    const r = fn(c);
    q.reponse = r.resume; q.facultatif = r.facultatif;
    q.cotation = q.cotationIA = r.cotation; q.justification = r.justification;
  });
}

/* ---------- Contrôles de physique sur Q1…Qn ---------- */

const RE_AJOUT = /\s*(?:⚠ Contrôles automatiques|ℹ Remarque) :[\s\S]*$/;

/**
 * Applique la grille et les contrôles de physique aux questions.
 *  - source « locale » (pas d'IA) : la cotation proposée par la grille du TP remplace la pré-analyse générique ;
 *  - source « ia » : la cotation de l'IA est conservée, mais plafonnée à 1 en cas d'erreur certaine
 *    (calcul faux, valeur incohérente) ; les contrôles sont ajoutés à la justification.
 */
export function appliquerControles(c, source = "ia") {
  if (!estPhysique(c)) { recalculerAuto(c); return; }
  questionsReelles(c).forEach(q => {
    if (q.manuel) return;
    const ev = evaluerQuestion(c, q);
    let base = String(q.justification || "").replace(RE_AJOUT, "").trim();
    if (source === "locale" && ev.cotation !== null && ev.cotation !== undefined) {
      q.cotation = ev.cotation;
      base = ev.justification || base;
    }
    if (ev.erreurs.length && q.cotation !== null && q.cotation > 1) q.cotation = 1;
    const neuves = ev.erreurs.filter(e => !base.includes(e));      // évite de répéter ce que la grille a déjà écrit
    const ajout = [
      neuves.length ? `⚠ Contrôles automatiques : ${neuves.join(" ; ")}.` : "",
      ev.remarques.length ? `ℹ Remarque : ${ev.remarques.join(" ; ")}.` : ""
    ].filter(Boolean).join(" ");
    q.justification = [base, ajout].filter(Boolean).join(" ");
    q.cotationIA = q.cotation;
  });
  evaluerRubriquesPhysique(c);
  recalculerAuto(c);
}

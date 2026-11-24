/* ==========================================================================
   notation/analyse-parser.js — Lecture des comptes rendus PDF de Mermoz Lab
   (MathiLab, SciLab, …) : en-tête élève, titre du TD/TP, contexte professionnel,
   questions Q1…Qn avec leur compétence (APP/ANA/REA/VAL/COM), réponses de l'élève,
   problématique et auto-évaluation.
   Fonctionne dans le navigateur (pdf.js) comme sous Node (tests).
   ========================================================================== */

export const COMPETENCES = {
  APP: "S’approprier",
  ANA: "Analyser / Raisonner",
  REA: "Réaliser",
  VAL: "Valider",
  COM: "Communiquer"
};

const RE_BADGE = /\b(APP|ANA|REA|VAL|COM)\s+NOTE\s+0\s+1\s+2\b/;
const RE_BADGE_G = /\b(APP|ANA|REA|VAL|COM)\s+NOTE\s+0\s+1\s+2\b/g;
const RE_PIED = [
  /^id=[0-9a-f]+\s*$/i,
  /^https?:\/\/\S+(\s+\d+\/\d+)?\s*$/i,
  /^\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}\b/,
  /^MathiLab\s+—\s+Mermoz Lab/i,
  /^SciLab\s+—\s+Mermoz Lab/i
];
const RE_QUESTION = /^(?:(Sujet\s+[ABC])\s*[—–-]\s*)?Q\s?(\d+)\s*[.)]\s*(.*)$/i;
const TERMINAISON = /[.?!:;…)»"]\s*$/;

/* ---------- 1. Extraction des lignes (pdf.js) ---------- */

/** Regroupe en mots les lettres espacées d'un titre (« G É O M É T R I E »). */
function recollerLettresEspacees(s) {
  const t = s.split(" ");
  const sortie = [];
  let run = [];
  const vider = () => {
    if (run.length >= 3) sortie.push(run.join(""));
    else sortie.push(...run);
    run = [];
  };
  for (const m of t) {
    if (m.length === 1 && m !== "—" && m !== "–" && m !== "-") run.push(m);
    else { vider(); sortie.push(m); }
  }
  vider();
  return sortie.join(" ");
}

/** Lit toutes les pages et renvoie une liste de lignes { texte, cellules[] }. */
export async function lignesDepuisPdf(doc) {
  const lignes = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const contenu = await page.getTextContent();
    const items = contenu.items
      .filter(i => typeof i.str === "string" && i.str.trim() !== "")
      .map(i => ({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0 }))
      .sort((a, b) => b.y - a.y || a.x - b.x);

    const rangees = [];
    for (const it of items) {
      const r = rangees[rangees.length - 1];
      if (r && Math.abs(r.y - it.y) <= 5) r.items.push(it);
      else rangees.push({ y: it.y, items: [it] });
    }
    for (const r of rangees) {
      r.items.sort((a, b) => a.x - b.x);
      const cellules = [];
      let courant = null;
      for (const it of r.items) {
        if (courant && it.x - courant.fin < 4) {          // même mot ou même cellule
          const colle = it.x - courant.fin < 0.5;
          courant.s += (colle ? "" : " ") + it.s;
          courant.fin = it.x + it.w;
        } else {
          courant = { s: it.s, fin: it.x + it.w };
          cellules.push(courant);
        }
      }
      const cs = cellules.map(c => recollerLettresEspacees(c.s.replace(/\s+/g, " ").trim()));
      lignes.push({ texte: cs.join(" ").replace(/\s+/g, " ").trim(), cellules: cs, page: p });
    }
  }
  return lignes;
}

/* ---------- 2. Analyse de la structure ---------- */

const nettoyer = s => (s || "").replace(/\s+/g, " ").trim();

function niveauDepuis(texte) {
  const t = (texte || "").toLowerCase();
  if (/\b(2nde|2de|seconde)\b/.test(t) || /^2[a-z]/.test(t)) return "2nde";
  if (/\b(1ère|1ere|1re|première|premiere)\b/.test(t) || /^1[a-z]/.test(t)) return "1ère";
  if (/\b(tle|terminale|term)\b/.test(t) || /^t[a-z]/.test(t)) return "Terminale";
  return "";
}

function dateISO(s) {
  const m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s || "");
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

/** Nom, prénom, id lus dans le nom de fichier MermozLab_Nom_Prénom_id…pdf (secours). */
function depuisNomFichier(nom) {
  const m = /^MermozLab_([^_]+)_([^_]+)_id[_=]?([0-9a-f]+)/i.exec(nom || "");
  return m ? { nom: m[1], prenom: m[2], pdfId: m[3] } : {};
}

export function analyserLignes(lignes, nomFichier = "") {
  const fich = depuisNomFichier(nomFichier);
  const L = lignes.filter(l => !RE_PIED.some(re => re.test(l.texte)));
  const res = {
    matiere: "", domaine: "", codeTd: "", titre: "", niveau: "", classe: "",
    nom: fich.nom || "", prenom: fich.prenom || "", dateCopie: "", pdfId: fich.pdfId || "",
    filiere: "", contexte: "", manipulation: "", problematique: "",
    questions: [], autoevaluation: [], avertissements: []
  };
  const idLigne = lignes.map(l => /^id=([0-9a-f]+)/i.exec(l.texte)).find(Boolean);
  if (idLigne) res.pdfId = idLigne[1];

  // --- En-tête : matière, domaine, titre
  const iNom = L.findIndex(l => /^NOM\b/.test(l.texte) && /PR[ÉE]NOM/.test(l.texte));
  const entete = L.slice(0, iNom >= 0 ? iNom : 8);
  for (let i = 0; i < entete.length; i++) {
    const t = entete[i].texte;
    let m;
    if ((m = /Bac\s*Pro\s*[—–-]\s*(.+)$/i.exec(t))) res.matiere = nettoyer(m[1]);
    else if ((m = /^(.+?)\s*[—–-]\s*(T[DP]\s?\d+[A-Z]?\.?\d*)\s*(.*)$/i.exec(t))) {
      res.domaine = nettoyer(m[1]);
      res.codeTd = nettoyer(m[2]).replace(/\s/g, "");
      res.niveau = niveauDepuis(m[3]);
      const sous = entete[i + 1] && !/^(NOM|Compte)/i.test(entete[i + 1].texte) ? nettoyer(entete[i + 1].texte) : "";
      res.titre = sous ? `${res.codeTd} — ${sous}` : res.codeTd;
    }
  }

  // --- Élève : ligne d'étiquettes puis ligne de valeurs (4 cellules)
  if (iNom >= 0 && L[iNom + 1]) {
    const v = L[iNom + 1].cellules;
    if (v.length >= 4) {
      [res.nom, res.prenom, res.classe] = [v[0], v[1], v[2]];
      res.dateCopie = dateISO(v[3]);
    } else {
      res.avertissements.push("Identité de l’élève : lecture incomplète, à vérifier.");
      const d = /(\d{1,2}\/\d{1,2}\/\d{4})/.exec(L[iNom + 1].texte);
      if (d) res.dateCopie = dateISO(d[1]);
    }
  }
  if (!res.dateCopie) {
    const g = lignes.map(l => /généré le\s+(\d{1,2}\/\d{1,2}\/\d{4})/i.exec(l.texte)).find(Boolean);
    if (g) res.dateCopie = dateISO(g[1]);
  }
  if (!res.niveau) res.niveau = niveauDepuis(res.classe);

  // --- Contexte professionnel (jusqu'à « Manipulation » ou Q1)
  const iCtx = L.findIndex(l => /^Contexte professionnel/i.test(l.texte));
  const iPremQ = L.findIndex(l => RE_QUESTION.test(l.texte.replace(RE_BADGE, "").trim()));
  const iManip = L.findIndex((l, i) => i > iCtx && /^(Manipulation|Activité|Expérience|Protocole)\b/i.test(l.texte));
  if (iCtx >= 0) {
    const fin = [iManip, iPremQ].filter(i => i > iCtx).sort((a, b) => a - b)[0] ?? L.length;
    const bloc = L.slice(iCtx + 1, fin).map(l => l.texte);
    // la filière tient sur 1 ou 2 lignes (« 2nde — … » puis suite) : la ligne contenant « — » ouvre, la suivante courte la ferme
    const fil = [];
    const ctx = [];
    let filOuverte = false;
    bloc.forEach(t => {
      if (/^Fili[èe]re$/i.test(t)) { return; }
      if (!filOuverte && ctx.length === 0 && fil.length === 0 && /^(2nde|1[èe]re|Tle|Terminale)\s*[—–-]/i.test(t)) { fil.push(t); filOuverte = true; return; }
      if (filOuverte && fil.length === 1 && t.length < 60 && !/[.?!]$/.test(t)) { fil.push(t); filOuverte = false; return; }
      filOuverte = false;
      ctx.push(t);
    });
    res.filiere = nettoyer(fil.join(" "));
    res.contexte = nettoyer(ctx.join(" "));
    if (res.filiere && !res.niveau) res.niveau = niveauDepuis(res.filiere);
  }
  if (iManip >= 0 && iPremQ > iManip) {
    res.manipulation = L.slice(iManip, iPremQ).map(l => l.texte).filter(t => !/^R[ée]sultat$/i.test(t)).join("\n");
  }

  // --- Questions
  const iAuto = L.findIndex(l => /^Auto-?[ée]valuation/i.test(l.texte));
  const finQ = iAuto >= 0 ? iAuto : L.length;
  let badgeEnAttente = "";
  let q = null;
  let phase = "";           // "enonce" | "reponse" | "problematique"
  let probLignes = [];
  const clore = () => {
    if (!q) return;
    q.enonce = nettoyer(q.enonce);
    q.reponse = q.reponse.join("\n").replace(/\n{2,}/g, "\n").trim();
    if (/^\(pas de r[ée]ponse saisie\)$/i.test(q.reponse)) q.reponse = "";
    res.questions.push(q);
    q = null;
  };
  for (let i = Math.max(iPremQ, 0); i < finQ && iPremQ >= 0; i++) {
    let t = L[i].texte;
    const badge = RE_BADGE.exec(t);
    if (badge) t = nettoyer(t.replace(RE_BADGE_G, ""));
    const m = RE_QUESTION.exec(t);
    if (m) {
      clore();
      q = { code: `${m[1] ? m[1].replace(/\s+/g, "") + "-" : ""}Q${m[2]}`, numero: +m[2], sujet: m[1] || "",
            competence: "", enonce: m[3] || "", reponse: [] };
      phase = TERMINAISON.test(q.enonce) ? "reponse" : "enonce";
      if (badge) q.competence = badge[1];
      else if (badgeEnAttente) q.competence = badgeEnAttente;
      badgeEnAttente = "";
      continue;
    }
    if (!q) { if (badge) badgeEnAttente = badge[1]; continue; }
    if (badge && t === "") {                      // ligne réduite au badge
      if (!q.competence && q.reponse.length === 0) q.competence = badge[1];
      else badgeEnAttente = badge[1];
      continue;
    }
    if (badge && !q.competence && q.reponse.length === 0) q.competence = badge[1];
    else if (badge) badgeEnAttente = badge[1];
    if (!t) continue;
    if (/^PROBL[ÉE]MATIQUE$/i.test(t)) { phase = "problematique"; probLignes = []; continue; }
    if (phase === "problematique") {
      probLignes.push(t);
      if (/\?\s*$/.test(t)) { q.problematique = nettoyer(probLignes.join(" ")); phase = "reponse"; }
      continue;
    }
    if (phase === "enonce") {
      q.enonce += " " + t;
      if (TERMINAISON.test(t)) phase = "reponse";
      continue;
    }
    q.reponse.push(t);
  }
  if (phase === "problematique" && q && probLignes.length) q.problematique = nettoyer(probLignes[0]);
  clore();
  const avecProb = res.questions.find(x => x.problematique);
  if (avecProb) res.problematique = avecProb.problematique;

  // --- Auto-évaluation
  if (iAuto >= 0) {
    for (let i = iAuto + 1; i < L.length; i++) {
      if (/^Radar/i.test(L[i].texte)) break;
      const c = L[i].cellules;
      if (c.length >= 4 && COMPETENCES[c[1]]) {
        res.autoevaluation.push({ sigle: c[1], capacite: c[2], niveau: parseInt(c[c.length - 1], 10) });
      }
    }
  }

  // --- Contrôles
  if (!res.nom || !res.prenom) res.avertissements.push("Nom ou prénom introuvable : à saisir.");
  if (!res.questions.length) res.avertissements.push("Aucune question détectée : ce PDF n’a peut-être pas le format Mermoz Lab.");
  res.questions.forEach(x => { if (!x.competence) res.avertissements.push(`${x.code} : compétence non détectée.`); });
  return res;
}

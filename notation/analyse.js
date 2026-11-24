/* ==========================================================================
   notation/analyse.js — Analyse des comptes rendus PDF (Mermoz Lab)
   Dépôt de PDF → lecture → analyse IA (Edge Function « analyser-copie »)
   → cotation 0/1/2 par question et par rubrique (matériel, valeurs de la manipulation, auto-évaluation)
   → note /10 → enregistrement Supabase.
   Accès protégé : connexion Supabase Auth + règles RLS (supabase/notation.sql).
   ========================================================================== */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
import { lignesDepuisPdf, analyserLignes } from "./analyse-parser.js";
import { ajouterRubriques, appliquerControles, recalculerAuto, evaluerRubriquesPhysique, questionsReelles, estRubrique } from "./analyse-rubriques.js";

const SUPABASE_URL = "https://obsqakmhtvfuwnoxoksr.supabase.co";
const SUPABASE_CLE = "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu"; // clé publique : la sécurité repose sur la RLS
const sb = createClient(SUPABASE_URL, SUPABASE_CLE, { auth: { persistSession: true, storageKey: "notation-auth" } });

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
}

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LIBELLE_COT = { 0: "0 – Non conforme", 1: "1 – Partiel", 2: "2 – Réussi" };
const NOM_COMP = { APP: "S’approprier", ANA: "Analyser / Raisonner", REA: "Réaliser", VAL: "Valider", COM: "Communiquer" };

let copies = [];
let uidCompteur = 0;
let integrerAuto = true;       // l'auto-évaluation compte dans la note (maths comme sciences)
try { if (localStorage.getItem("notation-integrer-auto") === "0") integrerAuto = false; } catch { /* stockage indisponible */ }
let derniereBase = [];

function message(el, texte, type = "info") {
  el.textContent = texte || "";
  el.className = "message" + (texte ? " " + type : "");
}

/* ============================ Connexion ============================ */

async function afficherSelonSession() {
  const { data } = await sb.auth.getSession();
  const connecte = !!data.session;
  $("#vue-connexion").hidden = connecte;
  $("#vue-app").hidden = !connecte;
  $("#btn-deco").hidden = !connecte;
  if (connecte) { chargerBase(); afficherCompteur(); }
}

$("#form-connexion").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = $("#msg-connexion");
  message(msg, "Connexion…", "info");
  const { error } = await sb.auth.signInWithPassword({ email: $("#email").value.trim(), password: $("#mdp").value });
  $("#mdp").value = "";
  if (error) { message(msg, "Connexion refusée : vérifiez l’e-mail et le mot de passe.", "erreur"); return; }
  message(msg, "");
  afficherSelonSession();
});

$("#btn-deco").addEventListener("click", async () => {
  await sb.auth.signOut();
  copies = []; derniereBase = [];
  $("#liste-copies").innerHTML = ""; $("#barre-globale").hidden = true;
  afficherSelonSession();
});

/* ============================ Onglets ============================ */

function activerOnglet(nom) {
  const analyse = nom === "analyse";
  $("#tab-analyse").classList.toggle("actif", analyse);
  $("#tab-base").classList.toggle("actif", !analyse);
  $("#tab-analyse").setAttribute("aria-selected", analyse);
  $("#tab-base").setAttribute("aria-selected", !analyse);
  $("#panneau-analyse").hidden = !analyse;
  $("#panneau-base").hidden = analyse;
  if (!analyse) chargerBase();
}
$("#tab-analyse").addEventListener("click", () => activerOnglet("analyse"));
$("#tab-base").addEventListener("click", () => activerOnglet("base"));

/* ============================ Dépôt des PDF ============================ */

const zone = $("#zone-depot");
["dragenter", "dragover"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("survol"); }));
["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("survol"); }));
zone.addEventListener("drop", e => traiterFichiers([...e.dataTransfer.files]));
$("#fichiers").addEventListener("change", e => { traiterFichiers([...e.target.files]); e.target.value = ""; });

async function empreinte(buffer) {
  const h = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function traiterFichiers(fichiers) {
  const msg = $("#msg-depot");
  const pdfs = fichiers.filter(f => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
  if (!pdfs.length) { message(msg, "Aucun fichier PDF détecté.", "erreur"); return; }
  if (!window.pdfjsLib) { message(msg, "Le lecteur PDF n’a pas pu être chargé (connexion internet ?).", "erreur"); return; }
  let ajoutes = 0, doublons = 0, echecs = [];
  for (const [i, f] of pdfs.entries()) {
    message(msg, `Lecture de ${f.name} (${i + 1}/${pdfs.length})…`, "info");
    try {
      const buffer = await f.arrayBuffer();
      const emp = await empreinte(buffer);
      if (copies.some(c => c.empreinte === emp)) { doublons++; continue; }
      const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const lignes = await lignesDepuisPdf(doc);
      if (!lignes.length) throw new Error("PDF sans texte lisible (scan ?)");
      const r = analyserLignes(lignes, f.name);
      copies.push(nouvelleCopie(r, f.name, emp));
      ajoutes++;
    } catch (err) {
      echecs.push(`${f.name} (${err.message})`);
    }
  }
  let t = `${ajoutes} copie(s) lue(s).`;
  if (doublons) t += ` ${doublons} doublon(s) ignoré(s).`;
  if (echecs.length) t += ` Échec : ${echecs.join(" ; ")}.`;
  message(msg, t, echecs.length ? "erreur" : "ok");
  afficher();
}

function nouvelleCopie(r, nomFichier, emp) {
  const c = {
    uid: ++uidCompteur, dbId: null, fichier: nomFichier, empreinte: emp,
    matiere: r.matiere, domaine: r.domaine, codeTd: r.codeTd, titre: r.titre, niveau: r.niveau, classe: r.classe,
    filiere: r.filiere, nom: r.nom, prenom: r.prenom, dateCopie: r.dateCopie, pdfId: r.pdfId,
    contexte: r.contexte, manipulation: r.manipulation, problematique: r.problematique,
    autoevaluation: r.autoevaluation, avertissements: r.avertissements,
    materiel: r.materiel, manipulationValeurs: r.manipulationValeurs, manipulationResultats: r.manipulationResultats,
    questions: r.questions.map(q => ({ ...q, cotation: null, cotationIA: null, signal: false, justification: "" })),
    commentaireProf: "", commentaireNote: "", analysePar: "", valide: false, etat: "lue", occupe: false
  };
  ajouterRubriques(c);        // matériel, valeurs de la manipulation (physique) et auto-évaluation (toutes matières)
  return c;
}

/* ============================ Note et commentaires ============================ */

/** Éléments qui comptent dans la note : questions + rubriques cotées. L'auto-évaluation peut être exclue (case à cocher) ;
 *  une rubrique facultative restée vide (pas de grille pour ce TP) n'est pas comptée. */
function elementsNotes(c) {
  const vide = q => q.cotation === null || q.cotation === undefined;
  return c.questions.filter(q => !(q.code === "AUTO" && !integrerAuto) && !(q.rubrique && q.facultatif && vide(q)));
}

function noteCopie(c) {
  const items = elementsNotes(c);
  const n = items.length;
  if (!n || items.some(q => q.cotation === null || q.cotation === undefined)) return null;
  const total = items.reduce((s, q) => s + Number(q.cotation), 0);
  const sur10 = Math.round((total / (2 * n)) * 10 * 4) / 4;     // arrondi au quart de point, comme la grille
  return { total, max: 2 * n, sur10 };
}
const fmt = x => (Math.round(x * 100) / 100).toString().replace(".", ",");

function commentaireLocal(c) {
  const note = noteCopie(c);
  if (!note) return "";
  const ratio = note.total / note.max;
  const reelles = questionsReelles(c);
  const bien = reelles.filter(q => q.cotation === 2).map(q => NOM_COMP[q.competence]).filter(Boolean);
  const aTravailler = reelles.filter(q => q.cotation < 2).map(q => NOM_COMP[q.competence]).filter(Boolean);
  const vides = reelles.filter(q => !String(q.reponse).trim()).length;
  const parts = [];
  if (ratio >= 0.8) parts.push("Très bon travail : tu as bien compris ce qui était demandé.");
  else if (ratio >= 0.5) parts.push("Tu as de bonnes idées et tu as compris l’essentiel.");
  else if (ratio > 0) parts.push("Tu as commencé à poser de bonnes bases, continue.");
  else parts.push("Cette fois, ton travail n’est pas assez avancé pour être évalué.");
  if (bien.length) parts.push(`Point fort : ${[...new Set(bien)][0].toLowerCase()}.`);
  if (vides) parts.push("Pense à répondre à toutes les questions, même avec une phrase simple.");
  else if (aTravailler.length) parts.push(`Pour progresser, précise davantage tes réponses (${[...new Set(aTravailler)][0].toLowerCase()}) : cite la propriété, le calcul ou la mesure que tu utilises.`);
  return parts.join(" ");
}

/* ============================ Pré-analyse locale (sans IA) ============================ */

const MOTS_VIDES = new Set(["dans", "avec", "pour", "elle", "elles", "sont", "cette", "comme", "mais", "donc", "leur", "leurs", "plus", "tout", "tous", "faire", "fait", "ainsi", "entre", "selon", "quel", "quelle", "quels", "quelles", "dont", "sans", "sous", "vers", "chez", "être", "avoir", "avez", "vous", "nous", "ils", "ont"]);
const racines = s => new Set((s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]{4,}/g) || []).filter(m => !MOTS_VIDES.has(m)).map(m => m.slice(0, 5)));

function preAnalyse(c) {
  const ref = racines([c.contexte, c.problematique, c.manipulation].join(" "));
  questionsReelles(c).forEach(q => {
    const rep = String(q.reponse || "").trim();
    const mots = rep ? rep.split(/\s+/).length : 0;
    const refQ = new Set([...ref, ...racines(q.enonce)]);
    const commun = [...racines(rep)].filter(r => refQ.has(r)).length;
    const aChiffres = /\d/.test(rep);
    const styleIA = /^\s*([-*•]|\d+[.)])\s|\*\*|^#{1,3}\s|\ben conclusion\b|\ben résumé\b|\bil est (important|essentiel) de\b|\bvoici\b/im.test(rep) || rep.length > 500;
    q.signal = false;
    if (!rep) { q.cotation = 0; q.justification = "Pas de réponse."; }
    else if (styleIA) { q.cotation = 0; q.signal = true; q.justification = "Style très rédigé ou très long pour ce niveau : copier-coller possible, à vérifier avec l’élève."; }
    else if (mots >= 4 && commun === 0 && !aChiffres) { q.cotation = 0; q.justification = "Aucun lien repéré avec la question ou le contexte : hors sujet possible."; }
    else if (mots < 5 && !aChiffres) { q.cotation = 1; q.justification = "Réponse très courte : une idée est peut-être présente mais elle reste à préciser."; }
    else if ((mots >= 12 && commun >= 2) || (q.competence === "REA" && aChiffres && /=/.test(rep))) { q.cotation = 2; q.justification = "Réponse en lien avec la question, avec des éléments précis."; }
    else { q.cotation = 1; q.justification = "Idée en rapport avec la question mais à préciser."; }
    q.cotationIA = q.cotation;
  });
  c.analysePar = "pré-analyse locale (sans IA)";
  appliquerControles(c, "locale");     // grille du TP (physique), matériel, valeurs de la manipulation, auto-évaluation
}

/* ============================ Analyse IA ============================ */

const PAUSE_ENTRE_APPELS_MS = 2500;      // espacement mini entre deux copies (quotas par minute)
const ATTENTE_QUOTA_MAX_S = 120;         // au-delà, on considère le quota épuisé (journalier)
const TENTATIVES_QUOTA = 3;
const attendre = ms => new Promise(r => setTimeout(r, ms));
const jourCourt = () => new Date().toISOString().slice(0, 10);

/* Compteur du jour (stocké dans ce navigateur seulement : simple repère, pas une limite). */
function lireCompteur() {
  try {
    const v = JSON.parse(localStorage.getItem("notation-ia-compteur") || "null");
    if (v && v.jour === jourCourt()) return v;
  } catch { /* stockage indisponible */ }
  return { jour: jourCourt(), total: 0, par: {} };
}
function compterAnalyse(fournisseur) {
  const v = lireCompteur();
  v.total++; v.par[fournisseur || "?"] = (v.par[fournisseur || "?"] || 0) + 1;
  try { localStorage.setItem("notation-ia-compteur", JSON.stringify(v)); } catch { /* ignoré */ }
  afficherCompteur();
}
function afficherCompteur() {
  const v = lireCompteur();
  const el = $("#compteur-ia"); if (!el) return;
  const detail = Object.entries(v.par).map(([k, n]) => `${k} : ${n}`).join(", ");
  el.textContent = v.total ? `Aujourd’hui : ${v.total} copie(s) analysée(s) par IA (${detail}).` : "";
}

/** Appelle la Edge Function ; en cas d’erreur, lit le message renvoyé par le serveur. */
async function appelerIA(charge) {
  const { data, error } = await sb.functions.invoke("analyser-copie", { body: { copie: charge } });
  if (!error && data && !data.erreur) return data;
  let detail = data?.erreur || "", statut = 0, delai = 0;
  try {
    statut = error?.context?.status || 0;
    const j = await error?.context?.json?.();
    if (j?.erreur) detail = j.erreur;
    delai = Number(j?.reessayer_dans_s) || 0;
  } catch { /* corps non JSON */ }
  const e = new Error(detail || error?.message || "réponse vide");
  e.quota = statut === 429; e.delai = delai;
  throw e;
}

/** Une copie → IA. Retourne "ia" | "locale" | "quota" (quota seulement en mode lot). */
async function analyserCopie(c, { lot = false, attenteQuota = false } = {}) {
  const msg = $("#msg-depot");
  c.occupe = true; afficherCarte(c);
  const charge = {
    domaine: c.domaine, titre: c.titre, niveau: c.niveau, filiere: c.filiere, contexte: c.contexte,
    problematique: c.problematique, manipulation: c.manipulation,
    questions: questionsReelles(c).map(q => ({ code: q.code, competence: q.competence, enonce: q.enonce, reponse: q.reponse }))
  };
  try {
    let data;
    for (let essai = 1; ; essai++) {
      try { data = await appelerIA(charge); break; }
      catch (err) {
        if (err.quota) {
          // Quota « par minute » : on patiente puis on réessaie ; quota journalier : on s’arrête.
          if (attenteQuota && err.delai && err.delai <= ATTENTE_QUOTA_MAX_S && essai < TENTATIVES_QUOTA) {
            message(msg, `Quota gratuit atteint : reprise automatique dans ${err.delai + 2} s…`, "info");
            await attendre((err.delai + 2) * 1000); continue;
          }
          throw err;
        }
        if (essai >= 2) throw err;
        await attendre(3000);                      // erreur passagère : un seul nouvel essai
      }
    }
    const parCode = new Map(data.questions.map(x => [x.code, x]));
    questionsReelles(c).forEach(q => {
      const x = parCode.get(q.code);
      if (!x) return;
      q.cotation = q.cotationIA = x.cotation; q.signal = !!x.signal_ia; q.justification = x.justification || "";
    });
    c.analysePar = data.modele || "IA";
    if (questionsReelles(c).some(q => q.cotation === null)) throw new Error("cotation incomplète");
    appliquerControles(c, "ia");         // plafonne à 1 les réponses avec erreur certaine ; cote matériel, valeurs, auto-évaluation
    c.commentaireNote = data.commentaire_note || commentaireLocal(c);
    compterAnalyse(data.fournisseur);
    if (!lot) message(msg, `Analyse IA terminée pour ${c.prenom} ${c.nom} (${c.analysePar}).`, "ok");
    c.etat = "analysée"; c.valide = false; c.occupe = false; afficherCarte(c);
    return "ia";
  } catch (err) {
    if (err.quota && lot) {                         // lot : on laisse la copie « à analyser » pour plus tard
      c.occupe = false; afficherCarte(c);
      return "quota";
    }
    preAnalyse(c);
    c.commentaireNote = commentaireLocal(c);
    if (!lot) message(msg, `Module IA indisponible (${err.message}) : pré-analyse locale appliquée à ${c.prenom} ${c.nom}, à vérifier question par question.`, "erreur");
    c.etat = "analysée"; c.valide = false; c.occupe = false; afficherCarte(c);
    return "locale";
  }
}

/* Analyse en lot : une copie à la fois, espacées, avec reprise sur quota, arrêt possible. */
let lotEnCours = false, lotStop = false;
$("#btn-stop").addEventListener("click", () => { lotStop = true; $("#btn-stop").disabled = true; });

$("#btn-tout-analyser").addEventListener("click", async () => {
  if (lotEnCours) return;
  const msg = $("#msg-depot");
  const aFaire = copies.filter(c => c.etat === "lue");
  if (!aFaire.length) { message(msg, "Aucune copie à analyser (toutes sont déjà analysées).", "info"); return; }
  const auto = $("#auto-enreg").checked;
  lotEnCours = true; lotStop = false;
  const bouton = $("#btn-tout-analyser"), stop = $("#btn-stop"), prog = $("#progression");
  bouton.disabled = true; stop.hidden = false; stop.disabled = false;
  prog.hidden = false; prog.max = aFaire.length; prog.value = 0;
  let ia = 0, locales = 0, enreg = 0, echecEnreg = 0, arret = "";
  for (const [i, c] of aFaire.entries()) {
    if (lotStop) { arret = "Arrêt demandé."; break; }
    message(msg, `Analyse ${i + 1} / ${aFaire.length} : ${c.prenom} ${c.nom}…`, "info");
    const r = await analyserCopie(c, { lot: true, attenteQuota: true });
    if (r === "quota") { arret = "Quotas gratuits épuisés : les copies restantes sont conservées, relancez plus tard."; break; }
    if (r === "ia") {
      ia++;
      if (auto) { if (await enregistrerCopie(c, { silencieux: true })) enreg++; else echecEnreg++; }
    } else locales++;
    prog.value = i + 1;
    if (i < aFaire.length - 1 && !lotStop) await attendre(PAUSE_ENTRE_APPELS_MS);
  }
  lotEnCours = false; bouton.disabled = false; stop.hidden = true; prog.hidden = true;
  const restantes = copies.filter(c => c.etat === "lue").length;
  let t = `${ia} copie(s) analysée(s) par IA`;
  if (locales) t += `, ${locales} en pré-analyse locale (à vérifier de près)`;
  if (auto) t += `, ${enreg} enregistrée(s)` + (echecEnreg ? ` (${echecEnreg} échec(s) : vérifiez nom et prénom)` : "");
  t += ".";
  if (restantes) t += ` ${restantes} restante(s).`;
  if (arret) t += " " + arret;
  message(msg, t, arret.startsWith("Quotas") || locales || echecEnreg ? "erreur" : "ok");
});

/* ============================ Enregistrement Supabase ============================ */

async function enregistrerCopie(c, { silencieux = false } = {}) {
  const msg = $("#msg-depot");
  const note = noteCopie(c);
  if (!c.nom.trim() || !c.prenom.trim()) { message(msg, "Renseignez le nom et le prénom avant d’enregistrer.", "erreur"); return false; }
  if (!note) { message(msg, `${c.prenom} ${c.nom} : cotez chaque question (ou lancez l’analyse) avant d’enregistrer.`, "erreur"); return false; }
  c.occupe = true; afficherCarte(c);
  const ligne = {
    empreinte: c.empreinte, nom_fichier: c.fichier, pdf_id: c.pdfId || null, matiere: c.matiere || null,
    domaine: c.domaine.trim(), code_td: c.codeTd || null, titre_td: c.titre.trim(), niveau: c.niveau || null,
    classe: c.classe || null, filiere: c.filiere || null, nom: c.nom.trim(), prenom: c.prenom.trim(),
    date_copie: c.dateCopie || null, contexte_pro: c.contexte || null, problematique: c.problematique || null,
    autoevaluation: c.autoevaluation?.length ? c.autoevaluation : null,
    commentaire_prof: c.commentaireProf.trim() || null, commentaire_note: c.commentaireNote.trim() || null,
    total_points: note.total, total_max: note.max, note_sur_10: note.sur10,
    analyse_par: c.analysePar || null, statut: c.valide ? "valide" : "a_valider"
  };
  try {
    let id = c.dbId;
    if (id) {
      const { error } = await sb.from("notation_copies").update(ligne).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await sb.from("notation_copies").upsert(ligne, { onConflict: "empreinte" }).select("id").single();
      if (error) throw error;
      id = data.id;
    }
    const { error: e1 } = await sb.from("notation_reponses").delete().eq("copie_id", id);
    if (e1) throw e1;
    const reps = c.questions.filter(q => !(q.rubrique && (q.cotation === null || q.cotation === undefined))).map((q, i) => ({
      copie_id: id, code: q.code, ordre: i + 1, competence: q.competence || null, enonce: q.enonce, reponse: q.reponse,
      cotation_ia: q.cotationIA ?? q.cotation, cotation_prof: q.cotationIA !== null && q.cotationIA !== undefined && q.cotation !== q.cotationIA ? q.cotation : null,
      signal_ia: !!q.signal, justification: q.justification || null
    }));
    const { error: e2 } = await sb.from("notation_reponses").insert(reps);
    if (e2) throw e2;
    c.dbId = id; c.etat = "enregistrée";
    if (!silencieux) message(msg, `${c.prenom} ${c.nom} : copie enregistrée (${fmt(note.sur10)} / 10).`, "ok");
    c.occupe = false; afficherCarte(c);
    return true;
  } catch (err) {
    c.occupe = false; afficherCarte(c);
    message(msg, `Échec de l’enregistrement : ${err.message || err}`, "erreur");
    return false;
  }
}

$("#btn-tout-enregistrer").addEventListener("click", async () => {
  let ok = 0;
  for (const c of copies) if (c.etat !== "enregistrée" && await enregistrerCopie(c)) ok++;
  if (ok) message($("#msg-depot"), `${ok} copie(s) enregistrée(s).`, "ok");
});
const caseAuto = $("#integrer-auto");
if (caseAuto) {
  caseAuto.checked = integrerAuto;
  caseAuto.addEventListener("change", () => {
    integrerAuto = caseAuto.checked;
    try { localStorage.setItem("notation-integrer-auto", integrerAuto ? "1" : "0"); } catch { /* ignoré */ }
    copies.forEach(c => { if (c.etat === "enregistrée") c.etat = "analysée"; });   // la note change : à ré-enregistrer
    afficher();
  });
}
$("#btn-vider").addEventListener("click", () => { copies = []; afficher(); message($("#msg-depot"), ""); });

/* ============================ Affichage des copies ============================ */

function champ(c, cle, etiquette, type = "text") {
  const id = `c${c.uid}-${cle}`;
  return `<div><label for="${id}">${etiquette}</label><input id="${id}" type="${type}" data-champ="${cle}" value="${esc(c[cle])}"></div>`;
}

const LIBELLE_RUBRIQUE = { MAT: "Matériel", MANIP: "Valeurs saisies", AUTO: "Auto-évaluation" };

function ligneRubrique(c, q, i) {
  const idq = `c${c.uid}-q${i}`;
  const nonEvalue = q.cotation === null || q.cotation === undefined;
  const peutRecalculer = q.code === "AUTO" || !c.rubriquesGelees;
  const opts = [
    `<option value="" ${nonEvalue ? "selected" : ""}>${q.facultatif ? "— non évalué —" : "— à coter —"}</option>`,
    ...[0, 1, 2].map(v => `<option value="${v}" ${String(q.cotation ?? "") === String(v) ? "selected" : ""}>${LIBELLE_COT[v]}</option>`),
    peutRecalculer ? `<option value="auto">↺ Cotation automatique</option>` : ""
  ].join("");
  const exclue = q.code === "AUTO" && !integrerAuto;
  return `<tr data-i="${i}" class="rubrique${exclue ? " exclue" : ""}">
    <td><span class="q-code">${esc(q.code)}</span><br><small>${esc(LIBELLE_RUBRIQUE[q.code] || "")}</small></td>
    <td><span class="q-enonce"><strong>${esc(q.enonce)}</strong>${exclue ? " — <em>non comptée dans la note (case décochée)</em>" : ""}</span>
        <pre class="q-lecture">${esc(q.reponse) || "—"}</pre></td>
    <td><label class="sr-only" for="${idq}-cot">Cotation ${esc(q.code)}</label>
        <select id="${idq}-cot" class="cot" data-qchamp="cotation">${opts}</select></td>
    <td><label class="sr-only" for="${idq}-j">Justification ${esc(q.code)}</label>
        <textarea id="${idq}-j" class="q-justif" data-qchamp="justification">${esc(q.justification)}</textarea></td>
  </tr>`;
}

function ligneQuestion(c, q, i) {
  if (q.rubrique) return ligneRubrique(c, q, i);
  const idq = `c${c.uid}-q${i}`;
  const opts = ["", 0, 1, 2].map(v => `<option value="${v}" ${String(q.cotation ?? "") === String(v) ? "selected" : ""}>${v === "" ? "— à coter —" : LIBELLE_COT[v]}</option>`).join("");
  return `<tr data-i="${i}">
    <td><span class="q-code">${esc(q.code)}</span><br><small>${esc(q.competence ? NOM_COMP[q.competence] || q.competence : "?")}</small></td>
    <td><span class="q-enonce">${esc(q.enonce)}</span>
        ${q.problematique ? `<span class="q-enonce"><strong>Problématique :</strong> ${esc(q.problematique)}</span>` : ""}
        <label class="sr-only" for="${idq}-rep">Réponse de l’élève ${esc(q.code)}</label>
        <textarea id="${idq}-rep" class="q-reponse ${String(q.reponse).trim() ? "" : "vide"}" data-qchamp="reponse" placeholder="(pas de réponse saisie)">${esc(q.reponse)}</textarea></td>
    <td><label class="sr-only" for="${idq}-cot">Cotation ${esc(q.code)}</label>
        <select id="${idq}-cot" class="cot" data-qchamp="cotation">${opts}</select>
        <label class="suspect"><input type="checkbox" data-qchamp="signal" ${q.signal ? "checked" : ""}> Copier-coller IA suspecté</label></td>
    <td><label class="sr-only" for="${idq}-j">Justification ${esc(q.code)}</label>
        <textarea id="${idq}-j" class="q-justif" data-qchamp="justification">${esc(q.justification)}</textarea></td>
  </tr>`;
}

function carteHTML(c, ouverte) {
  const note = noteCopie(c);
  const etat = c.occupe ? "⏳ Traitement…" : c.etat === "enregistrée" ? "✔ Enregistrée" : c.etat === "analysée" ? "● Analysée, à enregistrer" : "○ Lue, à analyser";
  return `<details class="copie" data-uid="${c.uid}" ${ouverte ? "open" : ""}>
  <summary><span>${esc(c.prenom)} ${esc(c.nom)} — ${esc(c.domaine)} ${esc(c.codeTd)} <small>(${esc(c.classe)})</small></span>
    <span><span class="etat">${etat}</span> <span class="note-badge" data-role="badge">${note ? fmt(note.sur10) + " / 10" : "— / 10"}</span></span></summary>
  <div class="corps">
    ${c.avertissements.length ? `<div class="avert">${c.avertissements.map(esc).join("<br>")}</div>` : ""}
    <div class="grille-meta">
      ${champ(c, "domaine", "Domaine")}${champ(c, "titre", "Titre du TD / TP")}${champ(c, "niveau", "Niveau de classe")}
      ${champ(c, "classe", "Classe")}${champ(c, "nom", "Nom")}${champ(c, "prenom", "Prénom")}${champ(c, "dateCopie", "Date", "date")}
      ${champ(c, "filiere", "Filière")}
    </div>
    <div class="contexte">
      <p><strong>Contexte professionnel :</strong> ${esc(c.contexte) || "<em>non détecté</em>"}</p>
      <p><strong>Problématique :</strong> ${esc(c.problematique) || "<em>non détectée</em>"}</p>
    </div>
    <div class="table-wrapper"><table>
      <thead><tr><th>Question / rubrique</th><th>Énoncé et réponse de l’élève</th><th>Cotation</th><th>Justification</th></tr></thead>
      <tbody>${c.questions.map((q, i) => ligneQuestion(c, q, i)).join("")}</tbody>
    </table></div>
    <div class="resultat">
      <span>Note : <span class="grande" data-role="note">${note ? fmt(note.sur10) + " / 10" : "— / 10"}</span></span>
      <span data-role="detail">${note ? `(${note.total} point(s) sur ${note.max})` : "Cotez toutes les questions pour obtenir la note."}</span>
      ${c.analysePar ? `<small>Analyse : ${esc(c.analysePar)}</small>` : ""}
    </div>
    <label for="c${c.uid}-cn">Commentaire accompagnant la note (modifiable)</label>
    <textarea id="c${c.uid}-cn" data-champ="commentaireNote">${esc(c.commentaireNote)}</textarea>
    <label for="c${c.uid}-cp">Commentaire de l’enseignant sur la copie</label>
    <textarea id="c${c.uid}-cp" data-champ="commentaireProf" placeholder="Remarque personnelle, à conserver avec la copie">${esc(c.commentaireProf)}</textarea>
    <label class="suspect"><input type="checkbox" data-champ="valide" ${c.valide ? "checked" : ""}> Cotation validée par l’enseignant</label>
    <div class="actions">
      <button type="button" class="btn btn-principal" data-action="analyser" ${c.occupe ? "disabled" : ""}>${c.etat === "lue" ? "Analyser (IA)" : "Relancer l’analyse"}</button>
      <button type="button" class="btn" data-action="enregistrer" ${c.occupe ? "disabled" : ""}>Enregistrer dans la base</button>
      <button type="button" class="btn btn-discret" data-action="retirer">Retirer de la liste</button>
    </div>
  </div>
</details>`;
}

function afficher() {
  const liste = $("#liste-copies");
  liste.innerHTML = copies.map((c, i) => carteHTML(c, copies.length <= 3 || i === 0)).join("");
  $("#barre-globale").hidden = copies.length === 0;
}

function afficherCarte(c) {
  const ancien = $(`details[data-uid="${c.uid}"]`);
  if (!ancien) return afficher();
  const tmp = document.createElement("div");
  tmp.innerHTML = carteHTML(c, ancien.open);
  ancien.replaceWith(tmp.firstElementChild);
}

function majNote(c, el) {
  const note = noteCopie(c);
  const txt = note ? fmt(note.sur10) + " / 10" : "— / 10";
  el.querySelector('[data-role="badge"]').textContent = txt;
  el.querySelector('[data-role="note"]').textContent = txt;
  el.querySelector('[data-role="detail"]').textContent = note ? `(${note.total} point(s) sur ${note.max})` : "Cotez toutes les questions pour obtenir la note.";
}

/** Rafraîchit la ligne « Auto-évaluation » (cotation et justification calculées) sans refaire toute la carte. */
function majLigneAuto(c, el) {
  const i = c.questions.findIndex(x => x.code === "AUTO");
  if (i < 0) return;
  const q = c.questions[i];
  const tr = el.querySelector(`tr[data-i="${i}"]`);
  if (!tr) return;
  const sel = tr.querySelector("select");
  if (sel) sel.value = q.cotation === null || q.cotation === undefined ? "" : String(q.cotation);
  const ta = tr.querySelector("textarea");
  if (ta) ta.value = q.justification || "";
}

const liste = $("#liste-copies");
const copieDe = el => copies.find(c => String(c.uid) === el.closest("details")?.dataset.uid);

liste.addEventListener("input", e => {
  const c = copieDe(e.target); if (!c) return;
  const el = e.target.closest("details");
  if (e.target.dataset.champ) {
    c[e.target.dataset.champ] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (c.etat === "enregistrée") c.etat = "analysée";
  } else if (e.target.dataset.qchamp) {
    const q = c.questions[+e.target.closest("tr").dataset.i];
    const k = e.target.dataset.qchamp;
    if (q.rubrique && k === "cotation" && e.target.value === "auto") {       // retour à la cotation automatique
      q.manuel = false;
      if (q.code === "AUTO") recalculerAuto(c); else evaluerRubriquesPhysique(c);
      if (c.etat === "enregistrée") c.etat = "analysée";
      afficherCarte(c);
      return;
    }
    q[k] = k === "cotation" ? (e.target.value === "" ? null : +e.target.value) : k === "signal" ? e.target.checked : e.target.value;
    if (q.rubrique && k === "cotation") q.manuel = true;                      // l'enseignant a le dernier mot
    if (k === "cotation") {
      if (!q.rubrique) { recalculerAuto(c); majLigneAuto(c, el); }            // l'auto-évaluation suit les cotations
      majNote(c, el);
    }
    if (c.etat === "enregistrée") c.etat = "analysée";
  }
});

liste.addEventListener("click", async e => {
  const b = e.target.closest("[data-action]"); if (!b) return;
  const c = copieDe(b); if (!c) return;
  if (b.dataset.action === "analyser") await analyserCopie(c);
  if (b.dataset.action === "enregistrer") await enregistrerCopie(c);
  if (b.dataset.action === "retirer") { copies = copies.filter(x => x !== c); afficher(); }
});

/* ============================ Copies enregistrées ============================ */

const nettoyerFiltre = s => s.replace(/[%,()*\\]/g, " ").trim();

async function chargerBase() {
  const msg = $("#msg-base");
  message(msg, "Chargement…", "info");
  let req = sb.from("notation_copies")
    .select("id,date_copie,created_at,nom,prenom,classe,domaine,titre_td,code_td,niveau,note_sur_10,statut")
    .order("date_copie", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(500);
  const n = nettoyerFiltre($("#f-nom").value), d = nettoyerFiltre($("#f-domaine").value), niv = $("#f-niveau").value;
  if (n) req = req.or(`nom.ilike.%${n}%,prenom.ilike.%${n}%`);
  if (d) req = req.ilike("domaine", `%${d}%`);
  if (niv) req = req.eq("niveau", niv);
  const { data, error } = await req;
  if (error) { message(msg, `Lecture impossible : ${error.message}. Le script supabase/notation.sql a-t-il été exécuté ?`, "erreur"); return; }
  derniereBase = data;
  message(msg, `${data.length} copie(s).`, "ok");
  $("#table-base tbody").innerHTML = data.map(r => `<tr data-id="${esc(r.id)}">
    <td>${esc(r.date_copie ? r.date_copie.split("-").reverse().join("/") : "")}</td>
    <td>${esc(r.prenom)} ${esc(r.nom)}</td><td>${esc(r.classe)}</td><td>${esc(r.domaine)}</td><td>${esc(r.titre_td)}</td>
    <td>${esc(r.niveau)}</td><td><strong>${r.note_sur_10 === null ? "—" : fmt(r.note_sur_10)}</strong></td>
    <td>${r.statut === "valide" ? "✔ Validée" : "○ À valider"}</td>
    <td><button type="button" class="btn" data-b="ouvrir">Ouvrir</button>
        <button type="button" class="btn btn-danger" data-b="suppr">Supprimer</button></td></tr>`).join("");
}

$("#filtres").addEventListener("submit", e => { e.preventDefault(); chargerBase(); });

$("#table-base").addEventListener("click", async e => {
  const b = e.target.closest("[data-b]"); if (!b) return;
  const id = b.closest("tr").dataset.id;
  if (b.dataset.b === "suppr") {
    if (!confirm("Supprimer définitivement cette copie et ses cotations ?")) return;
    const { error } = await sb.from("notation_copies").delete().eq("id", id);
    if (error) { message($("#msg-base"), `Suppression impossible : ${error.message}`, "erreur"); return; }
    copies = copies.filter(c => c.dbId !== id);
    chargerBase();
  } else ouvrirEnregistree(id);
});

async function ouvrirEnregistree(id) {
  const deja = copies.find(c => c.dbId === id);
  if (!deja) {
    const [{ data: r, error }, { data: reps, error: e2 }] = await Promise.all([
      sb.from("notation_copies").select("*").eq("id", id).single(),
      sb.from("notation_reponses").select("*").eq("copie_id", id).order("ordre")
    ]);
    if (error || e2) { message($("#msg-base"), `Lecture impossible : ${(error || e2).message}`, "erreur"); return; }
    copies.push({
      uid: ++uidCompteur, dbId: id, fichier: r.nom_fichier || "", empreinte: r.empreinte, matiere: r.matiere || "",
      domaine: r.domaine || "", codeTd: r.code_td || "", titre: r.titre_td || "", niveau: r.niveau || "", classe: r.classe || "",
      filiere: r.filiere || "", nom: r.nom, prenom: r.prenom, dateCopie: r.date_copie || "", pdfId: r.pdf_id || "",
      contexte: r.contexte_pro || "", manipulation: "", problematique: r.problematique || "",
      autoevaluation: r.autoevaluation || [], avertissements: [],
      materiel: null, manipulationValeurs: [], manipulationResultats: [], rubriquesGelees: true,
      questions: reps.map(x => ({ code: x.code, competence: x.competence || "", enonce: x.enonce || "", reponse: x.reponse || "",
        cotation: x.cotation_prof ?? x.cotation_ia, cotationIA: x.cotation_ia, signal: x.signal_ia, justification: x.justification || "",
        ...(estRubrique(x) ? { rubrique: true, facultatif: false, manuel: x.cotation_prof !== null && x.cotation_prof !== undefined } : {}) })),
      commentaireProf: r.commentaire_prof || "", commentaireNote: r.commentaire_note || "", analysePar: r.analyse_par || "",
      valide: r.statut === "valide", etat: "enregistrée", occupe: false
    });
  }
  activerOnglet("analyse");
  afficher();
  const c = copies.find(x => x.dbId === id);
  const el = $(`details[data-uid="${c.uid}"]`);
  if (el) { el.open = true; el.scrollIntoView({ behavior: "smooth", block: "start" }); }
}

/* ============================ Export CSV ============================ */

$("#btn-csv").addEventListener("click", () => {
  if (!derniereBase.length) { message($("#msg-base"), "Rien à exporter.", "erreur"); return; }
  const cell = v => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;          // neutralise les formules tableur
    return `"${s.replace(/"/g, '""')}"`;
  };
  const cols = [["date_copie", "Date"], ["nom", "Nom"], ["prenom", "Prénom"], ["classe", "Classe"], ["niveau", "Niveau"],
    ["domaine", "Domaine"], ["titre_td", "TD / TP"], ["note_sur_10", "Note /10"], ["statut", "Statut"]];
  const lignes = [cols.map(c => cell(c[1])).join(";"), ...derniereBase.map(r => cols.map(c => cell(r[c[0]])).join(";"))];
  const blob = new Blob(["\ufeff" + lignes.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "notation_copies.csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});

afficherSelonSession();

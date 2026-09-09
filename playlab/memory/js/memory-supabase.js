// Connexion Supabase pour le module memory — comptage anonyme des réponses
// Réutilise les mêmes identifiants que /playlab/js/supabase.js (clé publishable, sans risque à exposer côté client)

const MEMORY_SUPABASE_URL = "https://obsqakmhtvfuwnoxoksr.supabase.co";
const MEMORY_SUPABASE_KEY = "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu";

const MEMORY_HEADERS = {
  apikey: MEMORY_SUPABASE_KEY,
  Authorization: `Bearer ${MEMORY_SUPABASE_KEY}`,
};

// Envoie une réponse anonyme (aucune identité, aucun cookie, aucun identifiant élève)
async function memorySubmitAnswer(manche, correcte) {
  try {
    await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses`, {
      method: "POST",
      headers: { ...MEMORY_HEADERS, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ manche, correcte }),
    });
  } catch (e) {
    console.error("Envoi de la réponse impossible (connexion perdue ?)", e);
  }
}

// Compte bonnes/mauvaises réponses pour une manche donnée
async function memoryGetCounts(manche) {
  const headers = { ...MEMORY_HEADERS, Prefer: "count=exact" };
  try {
    const [goodRes, badRes] = await Promise.all([
      fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses?manche=eq.${manche}&correcte=eq.true&select=id`, { headers, method: "HEAD" }),
      fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses?manche=eq.${manche}&correcte=eq.false&select=id`, { headers, method: "HEAD" }),
    ]);
    const good = parseInt((goodRes.headers.get("content-range") || "0/0").split("/")[1], 10) || 0;
    const bad = parseInt((badRes.headers.get("content-range") || "0/0").split("/")[1], 10) || 0;
    return { good, bad };
  } catch (e) {
    console.error("Lecture des compteurs impossible", e);
    return { good: 0, bad: 0 };
  }
}

// Récupère toutes les réponses pour construire le récapitulatif final manche par manche
async function memoryGetAllCounts() {
  try {
    const res = await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses?select=manche,correcte`, { headers: MEMORY_HEADERS });
    const rows = await res.json();
    const map = {};
    rows.forEach(r => {
      if (!map[r.manche]) map[r.manche] = { good: 0, bad: 0 };
      if (r.correcte) map[r.manche].good += 1; else map[r.manche].bad += 1;
    });
    return map;
  } catch (e) {
    console.error("Lecture du récapitulatif impossible", e);
    return {};
  }
}

// Vide la table pour repartir sur une séance vierge (aucune trace d'identité de toute façon, mais on repart à zéro)
async function memoryResetSession() {
  try {
    await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses?id=gt.0`, {
      method: "DELETE",
      headers: MEMORY_HEADERS,
    });
  } catch (e) {
    console.error("Réinitialisation impossible", e);
  }
}

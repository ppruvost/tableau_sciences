// Connexion Supabase pour le module memory — comptage anonyme, participants et synchronisation de séance

const MEMORY_SUPABASE_URL = "https://obsqakmhtvfuwnoxoksr.supabase.co";
const MEMORY_SUPABASE_KEY = "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu";

const MEMORY_HEADERS = {
  apikey: MEMORY_SUPABASE_KEY,
  Authorization: `Bearer ${MEMORY_SUPABASE_KEY}`,
};

// --- Réponses ---

async function memorySubmitAnswer(manche, correcte, pseudo) {
  try {
    await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses`, {
      method: "POST",
      headers: { ...MEMORY_HEADERS, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ manche, correcte, pseudo: pseudo || null }),
    });
  } catch (e) {
    console.error("Envoi de la réponse impossible (connexion perdue ?)", e);
  }
}

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

// --- Participants (façon Kahoot) ---

async function memoryJoin(pseudo) {
  try {
    await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_participants`, {
      method: "POST",
      headers: { ...MEMORY_HEADERS, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ pseudo }),
    });
  } catch (e) {
    console.error("Impossible de rejoindre la séance", e);
  }
}

async function memoryGetParticipants() {
  try {
    const res = await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_participants?select=pseudo,joined_at&order=joined_at.asc`, { headers: MEMORY_HEADERS });
    return await res.json();
  } catch (e) {
    console.error("Lecture des participants impossible", e);
    return [];
  }
}

// --- Session (synchronisation automatique de la manche en cours) ---

async function memorySetSessionRound(roundId) {
  try {
    await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_session?id=eq.1`, {
      method: "PATCH",
      headers: { ...MEMORY_HEADERS, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ current_round: roundId, updated_at: new Date().toISOString() }),
    });
  } catch (e) {
    console.error("Mise à jour de la session impossible", e);
  }
}

async function memoryGetSessionRound() {
  try {
    const res = await fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_session?id=eq.1&select=current_round`, { headers: MEMORY_HEADERS });
    const rows = await res.json();
    return rows.length ? rows[0].current_round : -1;
  } catch (e) {
    console.error("Lecture de la session impossible", e);
    return -1;
  }
}

// --- Réinitialisation complète (nouvelle séance) ---

async function memoryResetSession() {
  try {
    await Promise.all([
      fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_reponses?id=gt.0`, { method: "DELETE", headers: MEMORY_HEADERS }),
      fetch(`${MEMORY_SUPABASE_URL}/rest/v1/memory_participants?id=gt.0`, { method: "DELETE", headers: MEMORY_HEADERS }),
    ]);
    await memorySetSessionRound(-1);
  } catch (e) {
    console.error("Réinitialisation impossible", e);
  }
}

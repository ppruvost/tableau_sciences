// Connexion Supabase pour le tableau de suivi en direct (lecture seule)
// Réutilise le même projet que le reste de PlayLab.

const SUIVI_SUPABASE_URL = "https://obsqakmhtvfuwnoxoksr.supabase.co";
const SUIVI_SUPABASE_KEY = "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu";

const SUIVI_HEADERS = {
  apikey: SUIVI_SUPABASE_KEY,
  Authorization: `Bearer ${SUIVI_SUPABASE_KEY}`,
};

// Récupère les sessions de quiz dont la date de début est comprise
// entre dateDebutISO (incluse) et dateFinISO (exclue).
async function suiviChargerSessions(dateDebutISO, dateFinISO) {

  const params = new URLSearchParams({
    select: "id,nom,prenom,quiz,categorie,started_at,ended_at,score,total,note_10,note_20,playmaths_points,status",
    started_at: `gte.${dateDebutISO}`,
    order: "started_at.desc",
  });

  const url =
    `${SUIVI_SUPABASE_URL}/rest/v1/quiz_sessions?${params.toString()}` +
    `&started_at=lt.${encodeURIComponent(dateFinISO)}`;

  try {

    const res = await fetch(url, { headers: SUIVI_HEADERS });

    if (!res.ok) {
      console.error("Suivi : réponse Supabase non OK", await res.text());
      return [];
    }

    return await res.json();

  } catch (e) {
    console.error("Suivi : lecture des sessions impossible (connexion internet ?)", e);
    return null; // null = erreur réseau, distinct d'une liste simplement vide
  }
}
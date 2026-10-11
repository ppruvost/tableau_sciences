// Connexion Supabase pour le tableau de suivi en direct (lecture seule)
// Réutilise le même projet que le reste de PlayLab.

const SUIVI_SUPABASE_URL = "https://obsqakmhtvfuwnoxoksr.supabase.co";
const SUIVI_SUPABASE_KEY = "sb_publishable_6FzuHhDBYOOSiAR9J-CiCA_KBfcyfhu";

const SUIVI_HEADERS = {
  apikey: SUIVI_SUPABASE_KEY,
  Authorization: `Bearer ${SUIVI_SUPABASE_KEY}`,
};

// Code enseignant : demandé une fois par onglet, conservé le temps de la session.
const SUIVI_CODE_CLE = "psci_code_prof";
let suiviCodeRefuse = false;

function suiviObtenirCode() {

  let code = sessionStorage.getItem(SUIVI_CODE_CLE);

  if (!code && !suiviCodeRefuse) {
    code = window.prompt("Code enseignant :");
    if (!code) suiviCodeRefuse = true; // ne pas redemander toutes les 5 s
  }

  return code || null;
}

// Récupère les sessions de quiz dont la date de début est comprise
// entre dateDebutISO (incluse) et dateFinISO (exclue), via la fonction
// serveur quiz_resultats_prof (protégée par le code enseignant).
async function suiviChargerSessions(dateDebutISO, dateFinISO) {

  const code = suiviObtenirCode();

  if (!code) return [];

  try {

    const res = await fetch(
      `${SUIVI_SUPABASE_URL}/rest/v1/rpc/quiz_resultats_prof`,
      {
        method: "POST",
        headers: { ...SUIVI_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_code: code,
          p_debut: dateDebutISO,
          p_fin: dateFinISO
        })
      }
    );

    if (!res.ok) {
      console.error("Suivi : réponse Supabase non OK", await res.text());
      sessionStorage.removeItem(SUIVI_CODE_CLE);
      suiviCodeRefuse = true; // code invalide : recharger la page pour réessayer
      return [];
    }

    sessionStorage.setItem(SUIVI_CODE_CLE, code);

    return await res.json();

  } catch (e) {
    console.error("Suivi : lecture des sessions impossible (connexion internet ?)", e);
    return null; // null = erreur réseau, distinct d'une liste simplement vide
  }
}
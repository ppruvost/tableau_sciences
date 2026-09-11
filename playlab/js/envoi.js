// =============================
// CONTRÔLE D'ACCÈS ANTI-TRICHE
// nom + prénom + appareil, verrou 10h, vérifié côté serveur (Supabase)
// =============================
const ACCES_DEVICE_KEY = "psci_device_id";

function normaliserTexte(str) {

  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

}

function setCookie(name, value, days) {

  const expires =
    new Date(Date.now() + days * 864e5)
      .toUTCString();

  document.cookie =
    `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;

}

function getCookie(name) {

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );

  return match
    ? decodeURIComponent(match[1])
    : null;

}

// Empreinte d'appareil : identifiant stable stocké en localStorage + cookie
// (double stockage pour résister à un nettoyage partiel). Ce n'est PAS une
// adresse MAC (inaccessible depuis un navigateur, par conception) mais une
// empreinte de navigateur/appareil, suffisante pour détecter un changement
// de pseudo sur le même appareil.
function getDeviceId() {

  let id =
    localStorage.getItem(ACCES_DEVICE_KEY) ||
    getCookie(ACCES_DEVICE_KEY);

  if (id) {
    localStorage.setItem(ACCES_DEVICE_KEY, id);
    setCookie(ACCES_DEVICE_KEY, id, 400);
    return id;
  }

  const empreinte = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency,
    navigator.platform,
    screen.width + "x" + screen.height + "x" + screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ].join("|");

  let hash = 0;

  for (let i = 0; i < empreinte.length; i++) {
    hash = (hash << 5) - hash + empreinte.charCodeAt(i);
    hash |= 0;
  }

  id =
    "dev_" +
    Math.abs(hash).toString(36) +
    "_" +
    Date.now().toString(36);

  localStorage.setItem(ACCES_DEVICE_KEY, id);
  setCookie(ACCES_DEVICE_KEY, id, 400);

  return id;

}

// Vérifie ET enregistre la tentative en une seule fois côté serveur
// (fonction Postgres sécurisée, voir setup_access_control.sql).
// Renvoie { allowed: true } ou { allowed: false, remaining_minutes: n }.
async function verifierAccesQuiz(nom, prenom, quiz) {

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Variables Supabase absentes");
  }

  const deviceId = getDeviceId();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/check_and_register_quiz_attempt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_nom: normaliserTexte(nom),
        p_prenom: normaliserTexte(prenom),
        p_quiz: quiz,
        p_device_id: deviceId
      })
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();

}


// =============================
// MODERATION AUTOMATISME
// prénom + automatisme + cooldown
// =============================
const COOLDOWN_MS = 10 * 60 * 1000; // 10 min

function getKey(prenom, automatisme) {
  return `cooldown_${prenom.trim().toLowerCase()}_${automatisme.trim().toLowerCase()}`;
}

function canSendScore(prenom, automatisme) {

  if (!prenom || !automatisme) return false;

  const key = getKey(prenom, automatisme);

  const lastAttempt =
    localStorage.getItem(key);

  if (!lastAttempt) return true;

  const now = Date.now();

  return (
    now - parseInt(lastAttempt)
  ) > COOLDOWN_MS;
}

function updateLastScore(prenom, automatisme) {

  const key =
    getKey(prenom, automatisme);

  localStorage.setItem(
    key,
    Date.now()
  );
}

function remainingCooldown(prenom, automatisme){

  const key =
    getKey(prenom, automatisme);

  const last =
    localStorage.getItem(key);

  if(!last) return 0;

  const diff =
    COOLDOWN_MS -
    (Date.now() - parseInt(last));

  return Math.max(
    0,
    Math.ceil(diff / 60000)
  );
}


// =============================
// ENVOI SCORE SUPABASE (leaderboard)
// =============================
async function envoyerScore(prenom, score){

  if (!SUPABASE_URL || !SUPABASE_KEY) {

    throw new Error(
      "Variables Supabase absentes"
    );

  }

  try {

    const res =
      await fetch(

        `${SUPABASE_URL}/rest/v1/scores`,

        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
            apikey: SUPABASE_KEY,
            Authorization:
              `Bearer ${SUPABASE_KEY}`
          },

          body: JSON.stringify({
            prenom,
            score
          })

        }

      );

    if(!res.ok){

      throw new Error(
        await res.text()
      );

    }

    console.log(
      "Score ajouté avec succès"
    );

    return true;

  }

  catch(err){

    console.error(
      "Erreur Supabase :",
      err
    );

    throw err;

  }

}


// =============================
// ENVOI EMAIL RESULTAT (Edge Function Supabase + Resend)
// Remplace l'ancien envoi via EmailJS.
// =============================
async function envoyerEmailResultat({
  nom,
  prenom,
  quiz,
  score,
  total,
  detailsRecap
}) {

  if (!SUPABASE_URL || !SUPABASE_KEY) {

    throw new Error(
      "Variables Supabase absentes"
    );

  }

  const body = {

    nom: nom || "",

    prenom: prenom || "",

    quiz: quiz || "",

    score,

    total,

    // L'Edge Function attend un tableau d'objets {question, reponse, correct}.
    // On y glisse le récapitulatif texte déjà construit par sendResults().
    details: detailsRecap
      ? [{
          question: "Détail des réponses",
          reponse: detailsRecap,
          correct: true
        }]
      : []

  };

  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/send-quiz-results`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {

    throw new Error(
      await res.text()
    );

  }

  console.log(
    "Email de résultat envoyé avec succès"
  );

  return true;

}


// =============================
// ENVOI RESULTATS
// =============================
async function sendResults(
  user = {},
  score = 0,
  total = 0,
  note20 = 0,
  playMathsPoints = 0,
  questions = []
) {

  const prenom =
    user?.prenom || "";

  const titreQuiz =
    document.title || "";

  // =============================
  // CONTROLE COOLDOWN
  // =============================
  if (!canSendScore(
    prenom,
    titreQuiz
  )) {

    const minutes =
      remainingCooldown(
        prenom,
        titreQuiz
      );

    alert(
      `⏳ ${prenom}, attends encore ${minutes} min avant de renvoyer un score pour cet automatisme.`
    );

    return;
  }


  // =============================
  // RECAP QUESTIONS
  // =============================
  let recap = "";

  (questions || []).forEach((q, i) => {

    recap +=
      `Q${i + 1}: ${q?.question || ""}\n`;

    recap +=
      `Réponse élève : ${q?.userAnswer || "Aucune"}\n`;

    recap +=
      `Bonne réponse : ${q?.bonne_reponse || ""}\n\n`;

  });


  const emailPromise =
    envoyerEmailResultat({
      nom: user?.nom || "",
      prenom,
      quiz: titreQuiz,
      score,
      total,
      detailsRecap: recap
    });


  const savePromise =
    envoyerScore(
      prenom,
      playMathsPoints
    );


  try {

    const [
      emailRes,
      saveRes
    ] = await Promise.allSettled([

      emailPromise,
      savePromise

    ]);


    if (
      saveRes.status === "fulfilled"
    ) {

      updateLastScore(
        prenom,
        titreQuiz
      );

      console.log(
        "Cooldown mis à jour"
      );

    }


    if (
      emailRes.status === "fulfilled"
    ) {

      console.log(
        "Email envoyé avec succès"
      );

    }

    else {

      console.error(
        "Erreur envoi email :",
        emailRes.reason
      );

    }


    if (
      saveRes.status === "fulfilled"
    ) {

      console.log(
        "Score sauvegardé"
      );

      if (
        typeof loadLeaderboard ===
        "function"
      ) {

        loadLeaderboard();

      }

    }

    else {

      console.error(
        "Erreur sauvegarde :",
        saveRes.reason
      );

    }


    if (
      emailRes.status === "fulfilled"
      &&
      saveRes.status === "fulfilled"
    ) {

      alert(
        "✅ Résultats envoyés et classement mis à jour !"
      );

    }

    else {

      alert(
        "⚠️ Résultats partiellement envoyés."
      );

    }

  }

  catch(err){

    console.error(
      "Erreur globale :",
      err
    );

    alert(
      "❌ " +
      (err?.message || err)
    );

  }

}
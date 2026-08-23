// =============================
// UTILS
// =============================
// Normalise un prénom pour la comparaison : minuscules + suppression des accents
// Ex: "Léo", "leo", "LEO", "léo" => "leo"
function normalizePrenom(prenom) {
  return (prenom || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
    .trim()
    .toLowerCase();
}

// Ne garde qu'une seule entrée par prénom normalisé (la meilleure, car la liste
// d'entrée est déjà triée par score desc puis date desc), puis tronque à `limit`
function dedupeByPrenom(scores, limit = 10) {
  const seen = new Set();
  const result = [];

  for (const joueur of scores) {
    const key = normalizePrenom(joueur?.prenom);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(joueur);
    if (result.length >= limit) break;
  }

  return result;
}

// =============================
// LEADERBOARD RENDER
// =============================
function renderLeaderboard(topScores = []) {
  const table = document.getElementById("scoreTable");
  if (!table) return;

  table.innerHTML = "";

  const safeScores = Array.isArray(topScores) ? topScores : [];

  safeScores.forEach((joueur, index) => {
    const tr = document.createElement("tr");

    const rankTd = document.createElement("td");
    rankTd.textContent = index + 1;

    const prenomTd = document.createElement("td");
    prenomTd.textContent = joueur?.prenom || "";

    const dateTd = document.createElement("td");
    dateTd.textContent = joueur?.date || "";

    const scoreTd = document.createElement("td");
    scoreTd.textContent = joueur?.score ?? 0;

    tr.append(rankTd, prenomTd, dateTd, scoreTd);
    table.appendChild(tr);
  });
}

// =============================
// CHARGEMENT DES SCORES
// =============================
async function loadLeaderboard() {

  try {

    // On récupère plus de 10 lignes en amont (ex. 100) car la déduplication
    // par prénom (casse/accents confondus) va réduire le nombre de lignes :
    // il faut une marge suffisante pour pouvoir reconstituer un top 10 complet.
    const res = await fetch(

      `${SUPABASE_URL}/rest/v1/scores?select=prenom,score,date_score&order=score.desc,date_score.desc&limit=100`,

      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }

    );

    if (!res.ok) {

      throw new Error(
        "Erreur Supabase : " + res.status
      );

    }

    const data = await res.json();

    const allScores = data.map(joueur => ({

      prenom: joueur.prenom,

      score: joueur.score,

      date: new Date(
        joueur.date_score
      ).toLocaleDateString("fr-FR")

    }));

    // Un seul prénom (indépendamment de la casse/accents) apparaît dans le
    // classement, avec son meilleur score. Cela libère de la place pour
    // 9 autres joueurs distincts dans le top 10.
    const topScores = dedupeByPrenom(allScores, 10);

    renderLeaderboard(topScores);

  }

  catch(err){

    console.error(
      "Erreur leaderboard :",
      err
    );

  }

}


// =============================
// INIT
// =============================
loadLeaderboard();

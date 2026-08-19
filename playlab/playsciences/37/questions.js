/* ============================================================
   ============  QUIZ PLAYSCIENCES — O6. Lentilles convergentes/divergentes (Tle)  ============
   ============================================================ */

window.questions = [

  {
    question: "Une lentille convergente est plus épaisse :",
    options: [
      "En son centre que sur les bords",
      "Sur les bords qu'en son centre",
      "De façon uniforme partout",
      "Elle n'a pas d'épaisseur variable"
    ],
    bonne_reponse: "En son centre que sur les bords",
    explication: "Une lentille convergente (biconvexe le plus souvent) est bombée et plus épaisse au centre, ce qui fait converger les rayons."
  },

  {
    question: "Une lentille divergente, à l'inverse, est plus épaisse :",
    options: [
      "Sur les bords qu'en son centre",
      "En son centre que sur les bords",
      "Uniforme partout",
      "Impossible à déterminer"
    ],
    bonne_reponse: "Sur les bords qu'en son centre",
    explication: "Une lentille divergente est creusée en son centre (biconcave le plus souvent), ce qui écarte les rayons lumineux."
  },

  {
    question: "Un faisceau de rayons parallèles à l'axe optique, après une lentille convergente, converge en un point appelé :",
    options: [
      "Le foyer image",
      "Le centre optique",
      "L'axe secondaire",
      "Le point de divergence"
    ],
    bonne_reponse: "Le foyer image",
    explication: "Tous les rayons initialement parallèles à l'axe optique se rejoignent au foyer image après la traversée de la lentille convergente."
  },

  {
    question: "La distance focale f' d'une lentille se mesure entre :",
    options: [
      "Le centre optique et le foyer image",
      "Les deux foyers",
      "L'objet et l'image",
      "Les deux bords de la lentille"
    ],
    bonne_reponse: "Le centre optique et le foyer image",
    explication: "La distance focale est, par définition, la distance entre le centre optique O de la lentille et son foyer image F'."
  },

  {
    question: "Une lentille de vergence C = 5 δ (dioptries) a une distance focale f' égale à :",
    options: [
      "0,2 m",
      "5 m",
      "0,5 m",
      "20 m"
    ],
    bonne_reponse: "0,2 m",
    explication: "f' = 1/C = 1/5 = 0,2 m."
  },

  {
    question: "La vergence d'une lentille divergente est, par convention :",
    options: [
      "Négative",
      "Positive",
      "Toujours nulle",
      "Toujours égale à 1"
    ],
    bonne_reponse: "Négative",
    explication: "Par convention, la vergence (en dioptries) est positive pour une lentille convergente et négative pour une divergente."
  },

  {
    question: "La relation de conjugaison de Descartes pour une lentille mince s'écrit (OA' : position image, OA : position objet, f' : distance focale) :",
    options: [
      "1/OA' − 1/OA = 1/f'",
      "1/OA' + 1/OA = 1/f'",
      "OA' × OA = f'",
      "OA' − OA = f'"
    ],
    bonne_reponse: "1/OA' − 1/OA = 1/f'",
    explication: "La relation de conjugaison relie algébriquement les positions de l'objet, de l'image et le foyer image de la lentille."
  },

  {
    question: "Le grandissement γ d'une lentille est défini par le rapport :",
    options: [
      "γ = A'B'/AB (taille image sur taille objet)",
      "γ = OA/OA'",
      "γ = f'/OA",
      "γ = AB × A'B'"
    ],
    bonne_reponse: "γ = A'B'/AB (taille image sur taille objet)",
    explication: "Le grandissement compare algébriquement la taille de l'image à celle de l'objet ; il indique aussi le sens (droit ou renversé)."
  },

  {
    question: "Si le grandissement γ est négatif, l'image est :",
    options: [
      "Renversée par rapport à l'objet",
      "De même sens que l'objet",
      "Invisible",
      "De taille nulle obligatoirement"
    ],
    bonne_reponse: "Renversée par rapport à l'objet",
    explication: "Un grandissement négatif traduit une image inversée (à l'envers) par rapport à l'objet ; s'il est positif, l'image est droite."
  },

  {
    question: "Pour différencier rapidement une lentille convergente d'une divergente à l'œil nu, on peut observer un texte à travers elle :",
    options: [
      "Convergente : le texte apparaît grossi de près",
      "Les deux donnent toujours le même effet",
      "Divergente : le texte disparaît totalement",
      "Impossible sans instrument"
    ],
    bonne_reponse: "Convergente : le texte apparaît grossi de près",
    explication: "Une lentille convergente, utilisée comme loupe, agrandit le texte vu de près ; une divergente le rapetisse."
  }
];

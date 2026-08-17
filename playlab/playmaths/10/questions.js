/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce graphique représente les 8 premiers termes d'une suite (uₙ). Quelle est sa nature ?",
    graphique: "img/q1.png",
    options: [
      "Une suite arithmétique",
      "Une suite géométrique",
      "Une suite constante",
      "Une suite ni arithmétique ni géométrique"
    ],
    bonne_reponse: "Une suite géométrique",
    explication: "La courbe a une allure exponentielle typique : chaque terme est obtenu en multipliant le précédent par une raison constante, ce qui caractérise une suite géométrique."
  },

  {
    question: "Une suite géométrique a pour premier terme u₀ = 3 et pour raison q = 2. Quelle est la valeur de u₃ ?",
    options: [
      "24",
      "18",
      "9",
      "6"
    ],
    bonne_reponse: "24",
    explication: "uₙ = u₀ × qⁿ, donc u₃ = 3 × 2³ = 3 × 8 = 24."
  },

  {
    question: "Comment détermine-t-on le sens de variation d'une suite géométrique de raison q > 0 et de premier terme positif ?",
    options: [
      "Croissante si q > 1, décroissante si 0 < q < 1, constante si q = 1",
      "Toujours croissante quel que soit q",
      "Toujours décroissante quel que soit q",
      "Le sens de variation ne dépend jamais de q"
    ],
    bonne_reponse: "Croissante si q > 1, décroissante si 0 < q < 1, constante si q = 1",
    explication: "Pour une suite géométrique à termes positifs, le sens de variation dépend directement de la position de la raison q par rapport à 1."
  },

  {
    question: "Ce graphique représente la fonction cube f(x) = x³. Quel est son sens de variation sur ℝ ?",
    graphique: "img/q4.png",
    options: [
      "Elle est strictement croissante sur ℝ",
      "Elle est strictement décroissante sur ℝ",
      "Elle décroît puis croît",
      "Elle est constante"
    ],
    bonne_reponse: "Elle est strictement croissante sur ℝ",
    explication: "La fonction cube est strictement croissante sur tout ℝ, comme le montre l'allure toujours montante de sa courbe."
  },

  {
    question: "Combien de solutions possède l'équation x³ = c (c étant un réel donné) ?",
    options: [
      "Exactement une solution, quel que soit c",
      "Toujours deux solutions",
      "Toujours trois solutions",
      "Cela dépend uniquement du signe de c, avec 0, 1 ou 2 solutions"
    ],
    bonne_reponse: "Exactement une solution, quel que soit c",
    explication: "La fonction cube étant strictement croissante (donc bijective) sur ℝ, l'équation x³ = c admet une unique solution réelle pour tout réel c."
  },

  {
    question: "Ce graphique compare deux fonctions exponentielles de base q. Laquelle est croissante ?",
    graphique: "img/q6.png",
    options: [
      "Celle avec q = 0,6",
      "Celle avec q = 2",
      "Les deux sont croissantes",
      "Aucune des deux n'est croissante"
    ],
    bonne_reponse: "Celle avec q = 2",
    explication: "Une fonction exponentielle x ↦ qˣ est croissante si q > 1 et décroissante si 0 < q < 1 : la courbe avec q = 2 est donc la croissante."
  },

  {
    question: "Ce graphique représente la fonction logarithme décimal x ↦ log(x). Sur quel intervalle est-elle définie ?",
    graphique: "img/q7.png",
    options: [
      "Sur ]0 ; +∞[",
      "Sur ℝ tout entier",
      "Sur ]−∞ ; 0[",
      "Uniquement sur les entiers positifs"
    ],
    bonne_reponse: "Sur ]0 ; +∞[",
    explication: "La fonction logarithme décimal n'est définie que pour les réels strictement positifs, comme le montre le graphique qui ne s'étend pas à gauche de 0."
  },

  {
    question: "Résoudre l'équation log(x) = 2.",
    options: [
      "x = 100",
      "x = 20",
      "x = 2",
      "x = 0,01"
    ],
    bonne_reponse: "x = 100",
    explication: "log(x) = 2 équivaut à x = 10² = 100."
  },

  {
    question: "Un capital de 1000 € est placé à intérêts composés au taux annuel de 4 %. Quel est le capital obtenu après 3 ans (arrondi à l'euro) ?",
    options: [
      "1125 €",
      "1120 €",
      "1040 €",
      "1300 €"
    ],
    bonne_reponse: "1125 €",
    explication: "Capital final = 1000 × 1,04³ ≈ 1000 × 1,124864 ≈ 1125 €."
  },

  {
    question: "Dans un tableau d'amortissement d'emprunt à annuités constantes, que représente la part d'intérêt de chaque échéance au fil du temps ?",
    options: [
      "Elle diminue progressivement, tandis que la part de capital remboursé augmente",
      "Elle augmente progressivement",
      "Elle reste rigoureusement constante",
      "Elle est toujours nulle après la première échéance"
    ],
    bonne_reponse: "Elle diminue progressivement, tandis que la part de capital remboursé augmente",
    explication: "Dans un emprunt à annuités constantes, les intérêts sont calculés sur le capital restant dû, qui diminue au fil du temps : la part d'intérêt décroît donc progressivement, et la part de capital remboursé augmente d'autant, l'annuité totale restant constante."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
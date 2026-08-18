/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE A04  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce graphique compare deux fonctions exponentielles de base q. Laquelle est croissante ?",
    graphique: "img/q1.png",
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
    question: "Quelle est la valeur de q^0 pour une fonction exponentielle de base q (q > 0) ?",
    options: [
      "1",
      "0",
      "q",
      "Cela dépend de q"
    ],
    bonne_reponse: "1",
    explication: "Toute fonction exponentielle de base q > 0 vérifie q^0 = 1, quel que soit q."
  },

  {
    question: "Comment évolue une population de 1000 individus qui augmente de 5 % chaque année ?",
    options: [
      "Elle suit une évolution exponentielle de la forme 1000 × 1,05ⁿ",
      "Elle suit une évolution arithmétique de raison 50",
      "Elle reste constante",
      "Elle diminue chaque année"
    ],
    bonne_reponse: "Elle suit une évolution exponentielle de la forme 1000 × 1,05ⁿ",
    explication: "Une augmentation de 5 % chaque année correspond à une multiplication par 1,05 à chaque étape, ce qui définit une évolution exponentielle (suite géométrique) de raison 1,05."
  },

  {
    question: "Ce graphique représente la fonction logarithme décimal x ↦ log(x). Sur quel intervalle est-elle définie ?",
    graphique: "img/q6.png",
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
    question: "Quelle est la valeur de log(1) ?",
    options: [
      "0",
      "1",
      "10",
      "Cela n'existe pas"
    ],
    bonne_reponse: "0",
    explication: "log(1) = 0 car 10⁰ = 1."
  },

  {
    question: "Quelle propriété vérifie le logarithme décimal d'un produit de deux nombres strictement positifs a et b ?",
    options: [
      "log(a × b) = log(a) + log(b)",
      "log(a × b) = log(a) × log(b)",
      "log(a × b) = log(a) − log(b)",
      "log(a × b) = log(a) / log(b)"
    ],
    bonne_reponse: "log(a × b) = log(a) + log(b)",
    explication: "Le logarithme décimal transforme un produit en somme : log(a×b) = log(a) + log(b), propriété fondamentale utilisée notamment pour les échelles logarithmiques (pH, décibels)."
  },

  {
    question: "Pourquoi la fonction logarithme décimal est-elle utile pour représenter des grandeurs variant sur plusieurs ordres de grandeur (comme le pH ou les décibels) ?",
    options: [
      "Parce qu'elle « compresse » une large gamme de valeurs en une échelle plus lisible",
      "Parce qu'elle est toujours négative",
      "Parce qu'elle rend toutes les valeurs égales",
      "Elle n'a en réalité aucune utilité dans ce contexte"
    ],
    bonne_reponse: "Parce qu'elle « compresse » une large gamme de valeurs en une échelle plus lisible",
    explication: "La fonction logarithme permet de représenter sur une échelle resserrée des grandeurs qui varient sur plusieurs puissances de 10, ce qui la rend précieuse pour des échelles comme le pH ou le niveau sonore en décibels."
  },

  {
    question: "Quel est le sens de variation de la fonction logarithme décimal sur son ensemble de définition ?",
    options: [
      "Elle est strictement croissante",
      "Elle est strictement décroissante",
      "Elle est constante",
      "Elle n'a pas de sens de variation défini"
    ],
    bonne_reponse: "Elle est strictement croissante",
    explication: "La fonction logarithme décimal est strictement croissante sur ]0 ; +∞[."
  },

  {
    question: "Comment résout-on une équation du type qˣ = c (avec q et c strictement positifs) à l'aide du logarithme ?",
    options: [
      "En appliquant le logarithme aux deux membres : x×log(q) = log(c), donc x = log(c)/log(q)",
      "En divisant simplement c par q",
      "Cette équation ne peut jamais être résolue",
      "En multipliant q et c entre eux"
    ],
    bonne_reponse: "En appliquant le logarithme aux deux membres : x×log(q) = log(c), donc x = log(c)/log(q)",
    explication: "Pour isoler l'exposant x dans une équation exponentielle, on applique le logarithme aux deux membres, ce qui transforme qˣ = c en x×log(q) = log(c), d'où x = log(c)/log(q)."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
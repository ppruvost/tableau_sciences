/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE A02  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce graphique, on observe les 8 premiers termes d'une suite (uₙ). Quelle est sa nature ?",
    graphique: "img/q1.png",
    options: [
      "Une suite arithmétique",
      "Une suite géométrique",
      "Une suite ni arithmétique ni géométrique",
      "Une suite constante"
    ],
    bonne_reponse: "Une suite arithmétique",
    explication: "Les points sont alignés : la différence entre deux termes consécutifs est constante, ce qui caractérise une suite arithmétique."
  },

  {
    question: "Une suite arithmétique a pour premier terme u₀ = 5 et pour raison r = 3. Quelle est la valeur de u₄ ?",
    options: [
      "17",
      "20",
      "8",
      "12"
    ],
    bonne_reponse: "17",
    explication: "uₙ = u₀ + n×r, donc u₄ = 5 + 4×3 = 17."
  },

  {
    question: "Comment détermine-t-on le sens de variation d'une suite arithmétique de raison r ?",
    options: [
      "Croissante si r > 0, décroissante si r < 0, constante si r = 0",
      "Toujours croissante",
      "Toujours décroissante",
      "Le sens de variation ne dépend jamais de r"
    ],
    bonne_reponse: "Croissante si r > 0, décroissante si r < 0, constante si r = 0",
    explication: "Le signe de la raison r détermine directement le sens de variation d'une suite arithmétique."
  },

  {
    question: "Pour comparer deux évolutions dont l'une est arithmétique et l'autre géométrique, sur le long terme, que peut-on généralement observer ?",
    options: [
      "L'évolution géométrique finit par dépasser largement l'évolution arithmétique",
      "L'évolution arithmétique dépasse toujours l'évolution géométrique",
      "Les deux évolutions restent toujours égales",
      "Aucune comparaison n'est possible"
    ],
    bonne_reponse: "L'évolution géométrique finit par dépasser largement l'évolution arithmétique",
    explication: "Une croissance géométrique (multiplicative) finit toujours par dépasser une croissance arithmétique (additive) de raison constante, même si celle-ci démarre plus vite."
  },

  {
    question: "Ce graphique représente les 8 premiers termes d'une suite (vₙ). Quelle est sa nature ?",
    graphique: "img/q5.png",
    options: [
      "Une suite géométrique",
      "Une suite arithmétique",
      "Une suite constante",
      "Une suite ni arithmétique ni géométrique"
    ],
    bonne_reponse: "Une suite géométrique",
    explication: "L'allure exponentielle de la courbe montre que chaque terme est obtenu en multipliant le précédent par une raison constante : c'est une suite géométrique."
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
    explication: "uₙ = u₀ × qⁿ, donc u₃ = 3 × 2³ = 24."
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
    question: "Ce graphique compare deux évolutions A (arithmétique) et B (géométrique) à partir du même point de départ. Laquelle des deux devient la plus grande à long terme ?",
    graphique: "img/q8.png",
    options: [
      "L'évolution B",
      "L'évolution A",
      "Les deux restent toujours égales",
      "Cela dépend uniquement du rang n = 0"
    ],
    bonne_reponse: "L'évolution B",
    explication: "Bien que les deux évolutions démarrent proches, la croissance géométrique de l'évolution B finit par l'emporter nettement sur la croissance arithmétique de l'évolution A."
  },

  {
    question: "Comment calcule-t-on la somme des n premiers termes d'une suite arithmétique de premier terme u0 et de dernier terme un ?",
    options: [
      "Somme = n × (u0 + un) / 2",
      "Somme = n × u0 × un",
      "Somme = u0 + un",
      "Somme = (u0 + un) / n"
    ],
    bonne_reponse: "Somme = n × (u0 + un) / 2",
    explication: "La somme des termes d'une suite arithmétique se calcule par le nombre de termes multiplié par la moyenne du premier et du dernier terme."
  },

  {
    question: "Comment calcule-t-on la somme des n+1 premiers termes d'une suite géométrique de premier terme u0 et de raison q ≠ 1 ?",
    options: [
      "Somme = u0 × (1 − q^(n+1)) / (1 − q)",
      "Somme = u0 × q^(n+1)",
      "Somme = u0 + q×(n+1)",
      "Somme = u0 / (1 − q)"
    ],
    bonne_reponse: "Somme = u0 × (1 − q^(n+1)) / (1 − q)",
    explication: "La somme des premiers termes d'une suite géométrique de raison q ≠ 1 se calcule à l'aide de la formule Somme = u0 × (1 − q^(n+1)) / (1 − q)."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce graphique, on observe les 8 premiers termes d'une suite (uₙ). Quelle est la nature de cette suite ?",
    graphique: "img/q1.png",
    options: [
      "Une suite arithmétique",
      "Une suite géométrique",
      "Une suite ni arithmétique ni géométrique",
      "Une suite constante"
    ],
    bonne_reponse: "Une suite arithmétique",
    explication: "Les points sont alignés : la différence entre deux termes consécutifs est constante (ici +2), ce qui caractérise une suite arithmétique."
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
      "La suite est croissante si r > 0, décroissante si r < 0, constante si r = 0",
      "La suite est toujours croissante",
      "La suite est toujours décroissante",
      "Le sens de variation ne dépend jamais de r"
    ],
    bonne_reponse: "La suite est croissante si r > 0, décroissante si r < 0, constante si r = 0",
    explication: "Le signe de la raison r détermine directement le sens de variation d'une suite arithmétique."
  },

  {
    question: "Ce graphique représente une fonction f. Quelles sont les solutions de l'équation f(x) = 0 lues graphiquement ?",
    graphique: "img/q4.png",
    options: [
      "x = 1 et x = 3",
      "x = 0 uniquement",
      "x = 2 uniquement",
      "Il n'y a pas de solution"
    ],
    bonne_reponse: "x = 1 et x = 3",
    explication: "Les solutions de f(x) = 0 correspondent aux abscisses des points où la courbe coupe l'axe des abscisses, ici x = 1 et x = 3."
  },

  {
    question: "Une parabole donnée sous forme factorisée f(x) = a(x−r1)(x−r2), avec a > 0, admet un minimum. Où se situe l'abscisse de ce minimum (le sommet) ?",
    options: [
      "Au milieu des deux racines r1 et r2",
      "Toujours en x = 0",
      "À l'infini",
      "Cela ne peut pas être déterminé"
    ],
    bonne_reponse: "Au milieu des deux racines r1 et r2",
    explication: "Une parabole étant symétrique par rapport à son axe, l'abscisse du sommet (extremum) est la moyenne des deux racines : (r1+r2)/2."
  },

  {
    question: "Sur ce graphique, une droite (en pointillés rouge) est tracée au point d'abscisse x = 1. Que représente cette droite ?",
    graphique: "img/q6.png",
    options: [
      "La tangente à la courbe au point d'abscisse 1",
      "Une asymptote de la courbe",
      "La droite des solutions de f(x) = 0",
      "Une droite parallèle à l'axe des abscisses sans lien avec la courbe"
    ],
    bonne_reponse: "La tangente à la courbe au point d'abscisse 1",
    explication: "La tangente à une courbe en un point est la droite qui approche le mieux la courbe localement en ce point ; son coefficient directeur est le nombre dérivé de la fonction en ce point."
  },

  {
    question: "Que représente le nombre dérivé f'(a) d'une fonction f en un point d'abscisse a ?",
    options: [
      "Le coefficient directeur de la tangente à la courbe de f au point d'abscisse a",
      "La valeur de f en a",
      "L'aire sous la courbe entre 0 et a",
      "La distance entre deux points de la courbe"
    ],
    bonne_reponse: "Le coefficient directeur de la tangente à la courbe de f au point d'abscisse a",
    explication: "Le nombre dérivé f'(a) donne la pente (coefficient directeur) de la tangente à la courbe représentative de f au point d'abscisse a."
  },

  {
    question: "Un capital de 2000 € est placé à intérêts simples au taux annuel de 3 % pendant 5 ans. Quel est le montant des intérêts obtenus ?",
    options: [
      "300 €",
      "2300 €",
      "600 €",
      "60 €"
    ],
    bonne_reponse: "300 €",
    explication: "Intérêts simples = Capital × taux × durée = 2000 × 0,03 × 5 = 300 €."
  },

  {
    question: "Qu'appelle-t-on le coût marginal d'une production, en économie ?",
    options: [
      "Le coût de production d'une unité supplémentaire",
      "Le coût total de toute la production",
      "Le coût moyen de l'ensemble de la production",
      "Le prix de vente unitaire"
    ],
    bonne_reponse: "Le coût de production d'une unité supplémentaire",
    explication: "Le coût marginal correspond au coût engendré par la production d'une unité supplémentaire ; il peut être approché par le nombre dérivé de la fonction coût total."
  },

  {
    question: "Comment calcule-t-on le coût moyen unitaire de production, connaissant le coût total C(x) pour x unités produites ?",
    options: [
      "Coût moyen = C(x) / x",
      "Coût moyen = C(x) × x",
      "Coût moyen = C(x) + x",
      "Coût moyen = x / C(x)"
    ],
    bonne_reponse: "Coût moyen = C(x) / x",
    explication: "Le coût moyen unitaire est le coût total divisé par le nombre d'unités produites : Cmoy(x) = C(x)/x."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
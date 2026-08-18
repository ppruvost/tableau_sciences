/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE A03  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce graphique représente une fonction f. Quelles sont les solutions de l'équation f(x) = 0 lues graphiquement ?",
    graphique: "img/q1.png",
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
    question: "Quelle méthode permet de résoudre graphiquement une équation du type f(x) = k ?",
    options: [
      "Tracer la courbe de f et l'horizontale y = k, puis lire les abscisses des points d'intersection",
      "Calculer uniquement l'image de 0 par f",
      "Tracer uniquement l'axe des abscisses",
      "Résoudre systématiquement par le calcul, jamais graphiquement"
    ],
    bonne_reponse: "Tracer la courbe de f et l'horizontale y = k, puis lire les abscisses des points d'intersection",
    explication: "Résoudre f(x) = k graphiquement consiste à repérer les points d'intersection de la courbe de f avec la droite horizontale d'équation y = k, puis à lire leurs abscisses."
  },

  {
    question: "Cette parabole représente une fonction polynôme du second degré. Quelles sont les coordonnées de son sommet ?",
    graphique: "img/q3.png",
    options: [
      "(2 ; −1)",
      "(0 ; −1)",
      "(−1 ; 2)",
      "(2 ; 0)"
    ],
    bonne_reponse: "(2 ; −1)",
    explication: "Le sommet de la parabole, point d'extremum de la fonction, se lit directement sur le graphique aux coordonnées (2 ; −1)."
  },

  {
    question: "Une fonction polynôme du second degré f(x) = ax² + bx + c, avec a > 0, admet un minimum. Comment calcule-t-on l'abscisse de ce minimum ?",
    options: [
      "x = −b / (2a)",
      "x = −c / a",
      "x = b / a",
      "x = −b / a"
    ],
    bonne_reponse: "x = −b / (2a)",
    explication: "L'abscisse du sommet (extremum) d'une parabole d'équation f(x) = ax² + bx + c est donnée par x = −b/(2a)."
  },

  {
    question: "Sur ce graphique, une droite en pointillés rouge est tracée au point d'abscisse x = 1. Que représente cette droite ?",
    graphique: "img/q5.png",
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
    question: "Ce graphique représente la fonction cube f(x) = x³. Quel est son sens de variation sur ℝ ?",
    graphique: "img/q7.png",
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
    question: "Comment factorise-t-on un polynôme de degré 3 dont on connaît une racine évidente x0 ?",
    options: [
      "En le mettant sous la forme (x − x0) × (polynôme du second degré)",
      "En le divisant simplement par x0",
      "Un polynôme de degré 3 ne peut jamais être factorisé",
      "En multipliant le polynôme par (x − x0)"
    ],
    bonne_reponse: "En le mettant sous la forme (x − x0) × (polynôme du second degré)",
    explication: "Si x0 est une racine d'un polynôme de degré 3, on peut le factoriser sous la forme (x − x0) fois un polynôme de degré 2, que l'on détermine ensuite par identification ou division euclidienne."
  },

  {
    question: "Comment étudie-t-on les variations d'une fonction à l'aide de sa dérivée ?",
    options: [
      "La fonction est croissante là où sa dérivée est positive, décroissante là où elle est négative",
      "La fonction est toujours croissante là où sa dérivée est négative",
      "Le signe de la dérivée n'a aucun lien avec les variations de la fonction",
      "La dérivée permet seulement de calculer une aire"
    ],
    bonne_reponse: "La fonction est croissante là où sa dérivée est positive, décroissante là où elle est négative",
    explication: "Le signe de la dérivée d'une fonction renseigne directement sur son sens de variation : positive, la fonction est croissante ; négative, elle est décroissante."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
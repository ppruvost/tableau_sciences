/* ============================================================
   ==============  QUIZ PLAYMATHS — ÉVALUATION 1ÈRE  ============
   ============================================================ */

window.questions = [

  /* ---------------- ALGÈBRE ---------------- */
  {
    question: "Soit une suite arithmétique de premier terme u₀ = 5 et de raison r = 3. Quelle est la valeur de u₁ ?",
    options: ["8", "15", "3", "2"],
    bonne_reponse: "8",
    explication: "Pour une suite arithmétique, u₁ = u₀ + r = 5 + 3 = 8."
  },
  {
    question: "Soit une suite géométrique de premier terme u₀ = 2 et de raison q = 3. Quelle est la valeur de u₂ ?",
    options: ["6", "8", "18", "24"],
    bonne_reponse: "18",
    explication: "u₁ = u₀ × q = 2 × 3 = 6 puis u₂ = u₁ × q = 6 × 3 = 18."
  },
  {
    question: "Voici la courbe représentative d'une fonction f. Quelle est la valeur de f(4), lue sur le graphique au point M ?",
    graphique: "graphique1.png",
    options: ["3", "4", "5", "8"],
    bonne_reponse: "5",
    explication: "Le point M a pour ordonnée 5 lorsque x = 4, donc f(4) = 5."
  },
  {
    question: "Soit f(x) = 2x − 3. Calculer f(4).",
    options: ["1", "5", "8", "11"],
    bonne_reponse: "5",
    explication: "f(4) = 2 × 4 − 3 = 8 − 3 = 5."
  },

  /* ---------------- STATISTIQUES ---------------- */
  {
    question: "Voici les boîtes à moustaches de deux séries statistiques. Quelle série a la plus grande médiane ?",
    graphique: "graphique2.png",
    options: ["Série A", "Série B", "Elles sont égales", "On ne peut pas savoir"],
    bonne_reponse: "Série B",
    explication: "La barre centrale (médiane) de la boîte de la série B est plus haute que celle de la série A."
  },
  {
    question: "Que mesure l'écart type d'une série statistique ?",
    options: [
      "La valeur la plus fréquente de la série",
      "La dispersion des valeurs autour de la moyenne",
      "La différence entre le maximum et le minimum",
      "La valeur du milieu de la série ordonnée"
    ],
    bonne_reponse: "La dispersion des valeurs autour de la moyenne",
    explication: "L'écart type mesure à quel point les valeurs de la série sont dispersées autour de la moyenne."
  },
  {
    question: "Qu'appelle-t-on la fluctuation d'échantillonnage ?",
    options: [
      "Le fait que la moyenne d'une série est toujours entière",
      "La variation des fréquences observées d'un échantillon à l'autre pour un même caractère",
      "Le calcul de l'étendue d'une série",
      "La probabilité qu'un événement soit certain"
    ],
    bonne_reponse: "La variation des fréquences observées d'un échantillon à l'autre pour un même caractère",
    explication: "D'un échantillon à l'autre, la fréquence observée d'un caractère varie : c'est la fluctuation d'échantillonnage."
  },
  {
    question: "Sur 200 lancers d'une pièce, « pile » est sorti 92 fois. Quelle est la fréquence d'apparition de « pile » ?",
    options: ["0,46", "0,92", "0,54", "0,08"],
    bonne_reponse: "0,46",
    explication: "Fréquence = effectif ÷ effectif total = 92 ÷ 200 = 0,46."
  },

  /* ---------------- GÉOMÉTRIE ---------------- */
  {
    question: "Sur le quadrillage, quelles sont les coordonnées du vecteur AB ?",
    graphique: "graphique3.png",
    options: ["(3 ; 2)", "(2 ; 3)", "(4 ; 3)", "(1 ; 1)"],
    bonne_reponse: "(3 ; 2)",
    explication: "Coordonnées du vecteur AB = (xB − xA ; yB − yA) = (4 − 1 ; 3 − 1) = (3 ; 2)."
  },
  {
    question: "Soit u(2 ; 3) et v(−1 ; 4) deux vecteurs. Quelles sont les coordonnées du vecteur u + v ?",
    options: ["(1 ; 7)", "(3 ; −1)", "(1 ; 1)", "(−2 ; 12)"],
    bonne_reponse: "(1 ; 7)",
    explication: "u + v = (2 + (−1) ; 3 + 4) = (1 ; 7)."
  },
  {
    question: "Voici une pyramide à base carrée. Combien a-t-elle de faces au total ?",
    graphique: "graphique4.png",
    options: ["4", "5", "6", "8"],
    bonne_reponse: "5",
    explication: "Une pyramide à base carrée possède 1 face de base (le carré) et 4 faces latérales triangulaires, soit 5 faces."
  },

  /* ---------------- ALGORITHME ---------------- */
  {
    question: "Que calcule ce programme Python ?",
    graphique: "graphique5.png",
    options: [
      "La somme des notes de la liste",
      "La moyenne des notes de la liste",
      "La note la plus élevée de la liste",
      "Le nombre de notes de la liste"
    ],
    bonne_reponse: "La moyenne des notes de la liste",
    explication: "Le programme additionne toutes les notes puis divise le total par le nombre de notes (len(notes)) : c'est la moyenne."
  },
  {
    question: "Quelle fonction Python permet de générer un nombre aléatoire décimal entre 0 et 1 ?",
    options: ["random.random()", "random.randint(0, 1)", "random.decimal()", "random.float(1)"],
    bonne_reponse: "random.random()",
    explication: "random.random() renvoie un nombre décimal aléatoire dans l'intervalle [0 ; 1[."
  },
  {
    question: "On exécute : u = 5 ; puis, trois fois de suite, u prend la valeur u × 2. Que vaut u à la fin ?",
    options: ["10", "20", "40", "15"],
    bonne_reponse: "40",
    explication: "u = 5, puis 5×2 = 10, puis 10×2 = 20, puis 20×2 = 40 après trois répétitions."
  }
];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */

/* ============================================================
   ==============  QUIZ PLAYMATHS — ÉVALUATION 2NDE  ============
   ============================================================ */

window.questions = [

  /* ---------------- ALGÈBRE ---------------- */
  {
    question: "Résoudre l'équation : 3x + 5 = 20",
    options: ["x = 5", "x = 3", "x = 15", "x = 25/3"],
    bonne_reponse: "x = 5",
    explication: "3x + 5 = 20 donc 3x = 15 donc x = 15 ÷ 3 = 5."
  },
  {
    question: "Résoudre l'équation : 2(x − 3) = 10",
    options: ["x = 2", "x = 5", "x = 8", "x = 11"],
    bonne_reponse: "x = 8",
    explication: "2(x − 3) = 10 donc x − 3 = 5 donc x = 8."
  },
  {
    question: "Résoudre l'équation : −4x + 7 = −1",
    options: ["x = −2", "x = 2", "x = −1,5", "x = 1,5"],
    bonne_reponse: "x = 2",
    explication: "−4x + 7 = −1 donc −4x = −8 donc x = 2."
  },

  /* ---------------- STATISTIQUES ---------------- */
  {
    question: "Voici la répartition d'une série statistique. Quelle est la valeur du mode de cette série ?",
    graphique: "graphique1.png",
    options: ["8", "10", "12", "14"],
    bonne_reponse: "12",
    explication: "Le mode est la valeur ayant le plus grand effectif : ici 12, avec un effectif de 9."
  },
  {
    question: "Calculer la moyenne de la série : 5 ; 7 ; 8 ; 10 ; 10.",
    options: ["7", "8", "9", "10"],
    bonne_reponse: "8",
    explication: "Moyenne = (5+7+8+10+10) ÷ 5 = 40 ÷ 5 = 8."
  },
  {
    question: "Calculer l'étendue de la série : 3 ; 8 ; 15 ; 20 ; 22.",
    options: ["17", "19", "20", "22"],
    bonne_reponse: "19",
    explication: "Étendue = valeur maximale − valeur minimale = 22 − 3 = 19."
  },

  /* ---------------- GÉOMÉTRIE ---------------- */
  {
    question: "Quel est le volume de ce cube ?",
    graphique: "graphique2.png",
    options: ["25 cm³", "60 cm³", "125 cm³", "150 cm³"],
    bonne_reponse: "125 cm³",
    explication: "Volume d'un cube = côté³ = 5³ = 125 cm³."
  },
  {
    question: "Quel est le volume de ce cylindre ? (π ≈ 3,14)",
    graphique: "graphique3.png",
    options: ["75,36 cm³", "150,72 cm³", "226,08 cm³", "301,44 cm³"],
    bonne_reponse: "226,08 cm³",
    explication: "Volume = π × r² × h = 3,14 × 3² × 8 = 3,14 × 9 × 8 = 226,08 cm³."
  },
  {
    question: "Quelle est l'aire de cette sphère ? (π ≈ 3,14 ; formule : A = 4πr²)",
    graphique: "graphique4.png",
    options: ["113,04 cm²", "226,08 cm²", "452,16 cm²", "904,32 cm²"],
    bonne_reponse: "452,16 cm²",
    explication: "A = 4 × π × r² = 4 × 3,14 × 6² = 4 × 3,14 × 36 = 452,16 cm²."
  },

  /* ---------------- ALGORITHME ---------------- */
  {
    question: "Que fait ce programme Python ?",
    graphique: "graphique5.png",
    options: [
      "Il affiche toujours le nombre 6",
      "Il affiche un nombre entier tiré au hasard entre 1 et 6",
      "Il affiche un nombre décimal entre 1 et 6",
      "Il provoque une erreur"
    ],
    bonne_reponse: "Il affiche un nombre entier tiré au hasard entre 1 et 6",
    explication: "random.randint(1, 6) tire au hasard un entier compris entre 1 et 6 inclus, comme un dé à 6 faces."
  },
  {
    question: "Quelle instruction Python permet de simuler le lancer d'un dé à 6 faces ?",
    options: [
      "random.randint(1, 6)",
      "random.choice(6)",
      "random.range(1, 6)",
      "random(1, 6)"
    ],
    bonne_reponse: "random.randint(1, 6)",
    explication: "random.randint(a, b) renvoie un entier aléatoire entre a et b inclus, ce qui convient pour un dé à 6 faces."
  },
  {
    question: "Dans le script suivant : for i in range(10): ... combien de fois le bloc d'instructions est-il exécuté ?",
    options: ["9 fois", "10 fois", "11 fois", "Une seule fois"],
    bonne_reponse: "10 fois",
    explication: "range(10) génère les valeurs 0 à 9, soit 10 valeurs : la boucle s'exécute donc 10 fois."
  }
];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */

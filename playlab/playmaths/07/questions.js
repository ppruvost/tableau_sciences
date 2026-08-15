/* ============================================================
   ===============  QUIZ PLAYMATHS — ÉVALUATION TLE  =============
   ============================================================ */

window.questions = [

  /* ---------------- ALGÈBRE ---------------- */
  {
    question: "Résoudre dans ℝ : 2^x = 8",
    options: ["x = 2", "x = 3", "x = 4", "x = 6"],
    bonne_reponse: "x = 3",
    explication: "8 = 2³, donc 2^x = 2³ entraîne x = 3."
  },
  {
    question: "Calculer log(100), logarithme décimal de 100.",
    options: ["1", "2", "10", "100"],
    bonne_reponse: "2",
    explication: "log(100) = log(10²) = 2 car le logarithme décimal de 10ⁿ vaut n."
  },
  {
    question: "Un article coûte 80 €. Il subit une augmentation de 15 %. Quel est son nouveau prix ?",
    options: ["82 €", "88 €", "92 €", "95 €"],
    bonne_reponse: "92 €",
    explication: "Nouveau prix = 80 × (1 + 0,15) = 80 × 1,15 = 92 €."
  },
  {
    question: "Une grandeur est multipliée par 1,2. Quel est le taux d'évolution correspondant ?",
    options: ["+1,2 %", "+2 %", "+12 %", "+20 %"],
    bonne_reponse: "+20 %",
    explication: "Coefficient multiplicateur 1,2 = 1 + 0,20, ce qui correspond à une hausse de 20 %."
  },

  /* ---------------- STATISTIQUES ---------------- */
  {
    question: "Le nuage de points ci-dessus a été modélisé par une droite d'ajustement affine. Quel est le coefficient directeur de cette droite ?",
    graphique: "graphique1.png",
    options: ["0,5", "1,5", "2", "3,5"],
    bonne_reponse: "1,5",
    explication: "La droite d'ajustement a pour équation y = 1,5x + 2 : le coefficient directeur est 1,5."
  },
  {
    question: "D'après ce tableau croisé, combien de filles ont choisi l'option B ?",
    graphique: "graphique2.png",
    options: ["12", "14", "16", "18"],
    bonne_reponse: "14",
    explication: "La case correspondant à la ligne « Option B » et à la colonne « Filles » indique 14."
  },
  {
    question: "D'après cet arbre pondéré, quelle est la probabilité de l'événement « A puis B » ?",
    graphique: "graphique3.png",
    options: ["0,2", "0,3", "0,5", "0,6"],
    bonne_reponse: "0,3",
    explication: "Sur un arbre pondéré, on multiplie les probabilités le long des branches : 0,6 × 0,5 = 0,3."
  },
  {
    question: "Que représente la probabilité conditionnelle notée P(B|A) ?",
    options: [
      "La probabilité que A et B se réalisent en même temps",
      "La probabilité que B se réalise sachant que A est déjà réalisé",
      "La probabilité que A se réalise sachant que B est déjà réalisé",
      "La probabilité que ni A ni B ne se réalisent"
    ],
    bonne_reponse: "La probabilité que B se réalise sachant que A est déjà réalisé",
    explication: "P(B|A) se lit « probabilité de B sachant A » : c'est la probabilité que B se réalise, en sachant que A s'est déjà réalisé."
  },

  /* ---------------- GÉOMÉTRIE (trigonométrie) ---------------- */
  {
    question: "Sur cette figure, l'angle en C mesure 30° et AB = 10 cm. Calculer BC (arrondir au dixième).",
    graphique: "graphique4.png",
    options: ["5,0 cm", "8,7 cm", "17,3 cm", "20,0 cm"],
    bonne_reponse: "17,3 cm",
    explication: "tan(30°) = AB / BC donc BC = AB / tan(30°) = 10 / 0,577 ≈ 17,3 cm."
  },
  {
    question: "Dans un triangle rectangle, quelle relation est vraie pour un angle aigu donné ?",
    options: [
      "cos(angle) = côté opposé / hypoténuse",
      "cos(angle) = côté adjacent / hypoténuse",
      "sin(angle) = côté adjacent / hypoténuse",
      "tan(angle) = hypoténuse / côté opposé"
    ],
    bonne_reponse: "cos(angle) = côté adjacent / hypoténuse",
    explication: "Par définition, dans un triangle rectangle, cos(angle) = côté adjacent ÷ hypoténuse."
  },
  {
    question: "Un triangle rectangle a un angle de 40° et une hypoténuse de 12 cm. Quelle est la longueur du côté opposé à cet angle ? (arrondir au dixième)",
    options: ["7,7 cm", "9,2 cm", "10,3 cm", "12,0 cm"],
    bonne_reponse: "7,7 cm",
    explication: "sin(40°) = côté opposé / hypoténuse donc côté opposé = 12 × sin(40°) ≈ 12 × 0,643 ≈ 7,7 cm."
  },

  /* ---------------- ALGORITHME ---------------- */
  {
    question: "Que calcule ce programme Python ?",
    graphique: "graphique5.png",
    options: [
      "Le montant d'un capital de 1000 € après 5 ans à un taux d'intérêt composé de 3 %",
      "Le montant d'un capital de 1000 € après 3 ans à un taux d'intérêt composé de 5 %",
      "La somme de 5 versements de 1000 €",
      "Le taux d'intérêt nécessaire pour doubler 1000 € en 5 ans"
    ],
    bonne_reponse: "Le montant d'un capital de 1000 € après 5 ans à un taux d'intérêt composé de 3 %",
    explication: "La boucle multiplie 5 fois le capital par (1 + 0,03) : cela correspond à 5 années d'intérêts composés à 3 % sur un capital initial de 1000 €."
  },
  {
    question: "Quelle fonction du module math permet de calculer le cosinus d'un angle en Python ?",
    options: ["math.cosinus()", "math.cos()", "math.acos()", "math.cx()"],
    bonne_reponse: "math.cos()",
    explication: "math.cos(x) renvoie le cosinus de x, exprimé en radians, en utilisant le module math."
  },
  {
    question: "Pour un cercle de rayon 5 cm, que renvoie print(round(2 * math.pi * 5, 2)) ?",
    options: ["15,71", "31,42", "78,54", "10,00"],
    bonne_reponse: "31,42",
    explication: "Périmètre = 2 × π × r = 2 × 3,14159… × 5 ≈ 31,4159, arrondi à 31,42."
  }
];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */

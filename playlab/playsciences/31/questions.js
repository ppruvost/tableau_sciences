/* ============================================================
   ============  QUIZ PLAYSCIENCES — A5. Pression et niveau acoustiques (Tle)  ============
   ============================================================ */

window.questions = [

  {
    question: "Le niveau d'intensité sonore L se calcule à partir de l'intensité acoustique I selon :",
    options: [
      "L = 10 log(I/I₀)",
      "L = I × I₀",
      "L = I / 10",
      "L = I₀ − I"
    ],
    bonne_reponse: "L = 10 log(I/I₀)",
    explication: "L (en dB) = 10 × log₁₀(I/I₀), où I₀ = 10⁻¹² W/m² est l'intensité de référence."
  },

  {
    question: "Si l'intensité acoustique double, le niveau sonore augmente d'environ :",
    options: [
      "3 dB",
      "10 dB",
      "100 dB",
      "0,3 dB"
    ],
    bonne_reponse: "3 dB",
    explication: "10 × log(2) ≈ 3 dB : doubler l'intensité acoustique augmente le niveau sonore d'environ 3 dB, en raison de l'échelle logarithmique."
  },

  {
    question: "Deux sources sonores identiques émettant ensemble, comparées à une seule, augmentent le niveau sonore de :",
    options: [
      "Environ 3 dB",
      "Le double exact en dB",
      "0 dB",
      "20 dB"
    ],
    bonne_reponse: "Environ 3 dB",
    explication: "L'intensité totale double avec deux sources identiques, ce qui correspond à une augmentation d'environ 3 dB (échelle logarithmique)."
  },

  {
    question: "L'intensité acoustique I est reliée à la pression acoustique p par une relation où I est proportionnelle à :",
    options: [
      "p",
      "p²",
      "1/p",
      "log(p)"
    ],
    bonne_reponse: "p²",
    explication: "L'intensité acoustique est proportionnelle au carré de la pression acoustique (I ∝ p²)."
  },

  {
    question: "Lorsque la distance à une source sonore ponctuelle double, l'intensité acoustique reçue est :",
    options: [
      "Divisée par 4",
      "Multipliée par 2",
      "Inchangée",
      "Multipliée par 4"
    ],
    bonne_reponse: "Divisée par 4",
    explication: "L'intensité décroît en 1/d² : doubler la distance divise l'intensité reçue par 4 (loi de l'atténuation géométrique)."
  },

  {
    question: "Lorsque la distance à une source sonore double, le niveau sonore L diminue d'environ :",
    options: [
      "3 dB",
      "6 dB",
      "20 dB",
      "0 dB"
    ],
    bonne_reponse: "6 dB",
    explication: "Comme I est divisée par 4, L diminue de 10×log(4) ≈ 6 dB à chaque doublement de distance."
  },

  {
    question: "À 10 m d'une source, L = 80 dB. Quel est approximativement le niveau à 20 m ?",
    options: [
      "80 dB",
      "74 dB",
      "86 dB",
      "40 dB"
    ],
    bonne_reponse: "74 dB",
    explication: "Doubler la distance (10 m → 20 m) diminue le niveau d'environ 6 dB : 80 − 6 = 74 dB."
  },

  {
    question: "Le seuil d'audibilité (I₀ = 10⁻¹² W/m²) correspond à un niveau sonore de :",
    options: [
      "0 dB",
      "10 dB",
      "100 dB",
      "−10 dB"
    ],
    bonne_reponse: "0 dB",
    explication: "Par définition, l'intensité de référence I₀ correspond exactement à L = 0 dB, le seuil d'audibilité théorique."
  },

  {
    question: "En espace libre (sans obstacle ni réflexion), l'atténuation du son avec la distance suit une loi dite :",
    options: [
      "Linéaire",
      "En inverse du carré de la distance (1/d²) pour l'intensité",
      "Exponentielle croissante",
      "Constante"
    ],
    bonne_reponse: "En inverse du carré de la distance (1/d²) pour l'intensité",
    explication: "En champ libre, l'énergie sonore se répartit sur une sphère de plus en plus grande, d'où une décroissance en 1/d² de l'intensité."
  },

  {
    question: "Comparer le niveau sonore mesuré près d'une machine et à 50 m de celle-ci permet d'évaluer :",
    options: [
      "L'atténuation due à l'éloignement de la source",
      "La masse de la machine",
      "Sa consommation électrique",
      "Sa couleur"
    ],
    bonne_reponse: "L'atténuation due à l'éloignement de la source",
    explication: "La différence de niveau sonore mesurée à deux distances permet de quantifier l'atténuation liée à la propagation dans l'espace."
  }
];

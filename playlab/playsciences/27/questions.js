/* ============================================================
   ============  QUIZ PLAYSCIENCES — A1. Caractériser un son (2nde)  ============
   ============================================================ */

window.questions = [

  {
    question: "La période T d'un son correspond à :",
    options: [
      "La durée d'un cycle complet de l'onde sonore",
      "Le nombre de cycles par seconde",
      "L'amplitude du signal",
      "Le niveau sonore en dB"
    ],
    bonne_reponse: "La durée d'un cycle complet de l'onde sonore",
    explication: "La période T, en secondes, est la durée d'un motif qui se répète dans le signal sonore."
  },

  {
    question: "La relation entre la fréquence f et la période T est :",
    options: [
      "f = T",
      "f = 1/T",
      "f = T²",
      "f = 2T"
    ],
    bonne_reponse: "f = 1/T",
    explication: "La fréquence (en Hz) est l'inverse de la période (en s) : f = 1/T."
  },

  {
    question: "Un son de fréquence 220 Hz a une période de :",
    options: [
      "220 s",
      "1/220 ≈ 4,5 × 10⁻³ s",
      "2,2 s",
      "0,22 s"
    ],
    bonne_reponse: "1/220 ≈ 4,5 × 10⁻³ s",
    explication: "T = 1/f = 1/220 ≈ 4,5 ms."
  },

  {
    question: "L'oreille humaine perçoit généralement les sons dans la gamme de fréquences :",
    options: [
      "20 Hz à 20 kHz",
      "0 Hz à 100 Hz",
      "1 kHz à 1 MHz",
      "20 kHz à 200 kHz"
    ],
    bonne_reponse: "20 Hz à 20 kHz",
    explication: "Le domaine audible standard pour l'humain s'étend approximativement de 20 Hz à 20 000 Hz."
  },

  {
    question: "Un son de fréquence inférieure à 20 Hz est appelé :",
    options: [
      "Un ultrason",
      "Un infrason",
      "Un son aigu",
      "Un son audible"
    ],
    bonne_reponse: "Un infrason",
    explication: "En dessous de 20 Hz, le son est un infrason, inaudible pour l'humain."
  },

  {
    question: "Un son de fréquence supérieure à 20 kHz est appelé :",
    options: [
      "Un infrason",
      "Un ultrason",
      "Un son grave",
      "Un bruit blanc"
    ],
    bonne_reponse: "Un ultrason",
    explication: "Au-delà de 20 000 Hz, le son est un ultrason, également inaudible pour l'humain."
  },

  {
    question: "Le niveau d'intensité acoustique se mesure en :",
    options: [
      "Hertz (Hz)",
      "Décibels (dB)",
      "Watts (W)",
      "Mètres (m)"
    ],
    bonne_reponse: "Décibels (dB)",
    explication: "Le niveau d'intensité acoustique L s'exprime en décibels, une échelle logarithmique."
  },

  {
    question: "Un son plus aigu qu'un autre a une fréquence :",
    options: [
      "Plus élevée",
      "Plus faible",
      "Identique",
      "Nulle"
    ],
    bonne_reponse: "Plus élevée",
    explication: "Plus la fréquence est élevée, plus le son est perçu comme aigu."
  },

  {
    question: "Le seuil de douleur pour l'oreille humaine se situe autour de :",
    options: [
      "0 dB",
      "50 dB",
      "120 dB",
      "1000 dB"
    ],
    bonne_reponse: "120 dB",
    explication: "Au-delà d'environ 120 dB, le son devient douloureux et peut endommager l'audition."
  },

  {
    question: "Pour classer des sons du plus grave au plus aigu, on les compare selon :",
    options: [
      "Leur niveau sonore uniquement",
      "Leur fréquence, du plus faible au plus élevé",
      "Leur couleur",
      "Leur durée uniquement"
    ],
    bonne_reponse: "Leur fréquence, du plus faible au plus élevé",
    explication: "Le caractère grave ou aigu d'un son dépend directement de sa fréquence."
  }
];

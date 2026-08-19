/* ============================================================
   ============  QUIZ PLAYSCIENCES — O4. Photocomposants (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Un photocomposant est un dispositif qui :",
    options: [
      "Interagit avec la lumière (émission ou réception)",
      "Ne réagit jamais à la lumière",
      "Fonctionne uniquement avec le son",
      "Mesure uniquement la température"
    ],
    bonne_reponse: "Interagit avec la lumière (émission ou réception)",
    explication: "Les photocomposants (LED, photodiode, phototransistor...) émettent ou détectent de la lumière selon leur fonction."
  },

  {
    question: "Pour une photodiode (récepteur), le courant généré dépend principalement de :",
    options: [
      "L'éclairement reçu : plus il est élevé, plus le courant est élevé",
      "La couleur de son boîtier",
      "Sa masse",
      "Sa forme uniquement"
    ],
    bonne_reponse: "L'éclairement reçu : plus il est élevé, plus le courant est élevé",
    explication: "La caractéristique courant-éclairement d'une photodiode montre une relation croissante entre l'éclairement reçu et le courant produit."
  },

  {
    question: "La courbe caractéristique liant le courant produit par un capteur à l'éclairement permet de :",
    options: [
      "Étalonner le capteur pour mesurer un éclairement inconnu",
      "Mesurer une masse",
      "Déterminer une fréquence sonore",
      "Calculer un pH"
    ],
    bonne_reponse: "Étalonner le capteur pour mesurer un éclairement inconnu",
    explication: "Une fois la relation courant/éclairement connue (étalonnage), on peut déduire un éclairement à partir d'une mesure de courant."
  },

  {
    question: "La caractéristique d'une LED en fonction de la longueur d'onde montre que :",
    options: [
      "Chaque LED émet une lumière avec un pic à une longueur d'onde spécifique",
      "Toutes les LED émettent exactement la même couleur",
      "La longueur d'onde n'a pas d'influence",
      "Les LED n'émettent jamais de lumière visible"
    ],
    bonne_reponse: "Chaque LED émet une lumière avec un pic à une longueur d'onde spécifique",
    explication: "Une LED possède un spectre d'émission centré autour d'une longueur d'onde dominante, qui détermine sa couleur perçue."
  },

  {
    question: "L'énergie d'un photon E est reliée à sa fréquence f par la relation :",
    options: [
      "E = h × f",
      "E = h / f",
      "E = h + f",
      "E = h − f"
    ],
    bonne_reponse: "E = h × f",
    explication: "La relation de Planck-Einstein E = h×f relie l'énergie d'un photon à sa fréquence, avec h la constante de Planck."
  },

  {
    question: "Plus la longueur d'onde d'un photon est petite, plus son énergie est :",
    options: [
      "Grande",
      "Petite",
      "Nulle",
      "Constante quelle que soit λ"
    ],
    bonne_reponse: "Grande",
    explication: "Comme E = h×c/λ, l'énergie est inversement proportionnelle à la longueur d'onde : un photon UV est plus énergétique qu'un photon rouge."
  },

  {
    question: "La relation entre l'énergie E, la longueur d'onde λ, la constante de Planck h et la célérité c est :",
    options: [
      "E = h×c/λ",
      "E = h×λ/c",
      "E = λ/(h×c)",
      "E = h+c+λ"
    ],
    bonne_reponse: "E = h×c/λ",
    explication: "En combinant E=h×f et λ=c/f, on obtient E = h×c/λ."
  },

  {
    question: "Un capteur de lumière (photocomposant) placé à la sortie d'une fibre optique permet de :",
    options: [
      "Convertir le signal lumineux reçu en signal électrique exploitable",
      "Créer de la lumière",
      "Amplifier uniquement le son",
      "Changer la couleur de la fibre"
    ],
    bonne_reponse: "Convertir le signal lumineux reçu en signal électrique exploitable",
    explication: "Le photorécepteur reconvertit l'information lumineuse transmise par la fibre en signal électrique pour traitement."
  },

  {
    question: "Une LED bleue émet des photons plus énergétiques qu'une LED rouge car :",
    options: [
      "Sa longueur d'onde d'émission est plus petite",
      "Elle consomme plus de courant obligatoirement",
      "Elle est plus grosse",
      "Le bleu n'a pas d'énergie"
    ],
    bonne_reponse: "Sa longueur d'onde d'émission est plus petite",
    explication: "Le bleu a une longueur d'onde plus courte que le rouge, donc, d'après E=hc/λ, une énergie de photon plus élevée."
  },

  {
    question: "Tracer la caractéristique d'un phototransistor en fonction de l'éclairement permet notamment de déterminer :",
    options: [
      "Son domaine de linéarité d'utilisation",
      "Sa couleur exacte",
      "Le pH ambiant",
      "La vitesse du son"
    ],
    bonne_reponse: "Son domaine de linéarité d'utilisation",
    explication: "La caractéristique du composant révèle la plage d'éclairement pour laquelle sa réponse est linéaire, utile pour le calibrer."
  }
];

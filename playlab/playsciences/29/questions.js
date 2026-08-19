/* ============================================================
   ============  QUIZ PLAYSCIENCES — A3. Chaîne de transmission sonore (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Un émetteur piézoélectrique convertit :",
    options: [
      "Un signal électrique en vibration mécanique (son)",
      "Un son en lumière",
      "De la chaleur en électricité",
      "Une image en son"
    ],
    bonne_reponse: "Un signal électrique en vibration mécanique (son)",
    explication: "L'effet piézoélectrique inverse permet de transformer une tension électrique en déformation mécanique, produisant une onde sonore."
  },

  {
    question: "Un récepteur piézoélectrique (capteur) convertit :",
    options: [
      "Une vibration mécanique (son) en signal électrique",
      "Un signal électrique en lumière",
      "De l'électricité en chaleur",
      "Un son en image"
    ],
    bonne_reponse: "Une vibration mécanique (son) en signal électrique",
    explication: "L'effet piézoélectrique direct transforme la pression exercée par l'onde sonore en une tension électrique mesurable."
  },

  {
    question: "Dans une chaîne de transmission sonore complète, l'ordre logique est :",
    options: [
      "Récepteur → émetteur → traitement",
      "Émetteur → propagation dans le milieu → récepteur → traitement du signal",
      "Traitement → émetteur → propagation",
      "Il n'y a pas d'ordre particulier"
    ],
    bonne_reponse: "Émetteur → propagation dans le milieu → récepteur → traitement du signal",
    explication: "Le signal est d'abord émis, se propage dans le milieu, est capté par le récepteur, puis traité (amplifié, affiché...)."
  },

  {
    question: "Le matériau utilisé dans un capteur piézoélectrique possède la propriété de :",
    options: [
      "Générer une tension électrique lorsqu'il est déformé mécaniquement",
      "Conduire parfaitement la chaleur",
      "Être totalement transparent",
      "Ne jamais vibrer"
    ],
    bonne_reponse: "Générer une tension électrique lorsqu'il est déformé mécaniquement",
    explication: "C'est la propriété piézoélectrique du matériau (souvent un cristal ou une céramique) qui permet cette conversion."
  },

  {
    question: "Sur un oscillogramme, le signal reçu par le récepteur piézoélectrique après émission permet de mesurer :",
    options: [
      "La couleur du son",
      "Le temps de propagation entre émetteur et récepteur",
      "La masse de l'émetteur",
      "La tension du secteur"
    ],
    bonne_reponse: "Le temps de propagation entre émetteur et récepteur",
    explication: "En mesurant le décalage temporel entre le signal émis et le signal reçu, on peut en déduire la durée de propagation."
  },

  {
    question: "Dans le schéma d'une chaîne de transmission sonore, le bloc 'émetteur' représente :",
    options: [
      "La source qui transforme un signal électrique en onde sonore",
      "Le dispositif qui capte l'onde",
      "Le milieu de propagation",
      "L'écran d'affichage uniquement"
    ],
    bonne_reponse: "La source qui transforme un signal électrique en onde sonore",
    explication: "L'émetteur est le premier maillon de la chaîne, qui génère l'onde sonore à partir d'un signal électrique."
  },

  {
    question: "La distance entre émetteur et récepteur, combinée au temps de propagation mesuré, permet de calculer :",
    options: [
      "La vitesse du son dans le milieu",
      "La masse du récepteur",
      "La fréquence du secteur électrique",
      "La couleur du signal"
    ],
    bonne_reponse: "La vitesse du son dans le milieu",
    explication: "v = d/t : connaissant la distance parcourue et le temps de propagation, on calcule la vitesse du son dans le milieu."
  },

  {
    question: "Un même émetteur piézoélectrique peut aussi fonctionner en récepteur car :",
    options: [
      "L'effet piézoélectrique est réversible (direct et inverse)",
      "Il change de matière",
      "Il n'a pas de propriété électrique",
      "Le son n'a aucun effet sur lui"
    ],
    bonne_reponse: "L'effet piézoélectrique est réversible (direct et inverse)",
    explication: "Le même cristal piézoélectrique peut convertir tension→vibration (émission) ou vibration→tension (réception)."
  },

  {
    question: "Dans une chaîne de transmission, le traitement du signal reçu (amplification, filtrage) sert à :",
    options: [
      "Améliorer la qualité et l'exploitation du signal capté",
      "Supprimer totalement le signal",
      "Créer un nouveau son sans rapport",
      "Ralentir la propagation du son"
    ],
    bonne_reponse: "Améliorer la qualité et l'exploitation du signal capté",
    explication: "Le traitement électronique permet d'amplifier un signal faible ou de filtrer le bruit parasite avant exploitation."
  },

  {
    question: "Un microphone à électret, comme le capteur piézoélectrique, réalise la conversion :",
    options: [
      "Mécanique (son) vers électrique",
      "Électrique vers lumineuse",
      "Thermique vers mécanique",
      "Chimique vers électrique"
    ],
    bonne_reponse: "Mécanique (son) vers électrique",
    explication: "Tout microphone, quelle que soit sa technologie, convertit l'onde sonore mécanique en un signal électrique exploitable."
  }
];

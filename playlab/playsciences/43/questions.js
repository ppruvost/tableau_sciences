/* ============================================================
   ============  QUIZ PLAYSCIENCES — T1. Capteurs de température (2nde)  ============
   ============================================================ */

window.questions = [

  {
    question: "La relation entre une température en kelvin (T) et en degrés Celsius (θ) est :",
    options: [
      "T = θ + 273,15",
      "T = θ − 273,15",
      "T = θ × 273,15",
      "T = θ / 273,15"
    ],
    bonne_reponse: "T = θ + 273,15",
    explication: "On passe des degrés Celsius aux kelvins en ajoutant 273,15."
  },

  {
    question: "Le zéro absolu, origine de l'échelle Kelvin, correspond à :",
    options: [
      "0 K, soit environ −273,15 °C",
      "0 °C",
      "100 °C",
      "273 °C"
    ],
    bonne_reponse: "0 K, soit environ −273,15 °C",
    explication: "0 K est la température la plus basse théoriquement atteignable, correspondant à −273,15 °C."
  },

  {
    question: "Une thermistance est un capteur de température dont la grandeur mesurée est :",
    options: [
      "Sa résistance électrique, qui varie avec la température",
      "Sa couleur",
      "Son volume uniquement",
      "Sa masse"
    ],
    bonne_reponse: "Sa résistance électrique, qui varie avec la température",
    explication: "La thermistance est un composant dont la résistance électrique varie fortement et de façon non linéaire avec la température."
  },

  {
    question: "Une sonde Pt100 est un capteur de température :",
    options: [
      "À résistance de platine, valant 100 Ω à 0°C",
      "Optique",
      "Chimique",
      "Sonore"
    ],
    bonne_reponse: "À résistance de platine, valant 100 Ω à 0°C",
    explication: "La Pt100 est une résistance de platine dont la valeur, 100 Ω à 0°C, varie de façon quasi linéaire avec la température."
  },

  {
    question: "Un thermocouple mesure la température grâce à :",
    options: [
      "Une tension électrique générée à la jonction de deux métaux différents",
      "Un changement de couleur",
      "Une variation de pression",
      "Un changement de fréquence sonore"
    ],
    bonne_reponse: "Une tension électrique générée à la jonction de deux métaux différents",
    explication: "L'effet thermoélectrique (effet Seebeck) génère une tension proportionnelle à l'écart de température entre les deux jonctions de métaux différents."
  },

  {
    question: "Comparé à une thermistance, un thermocouple présente l'avantage de :",
    options: [
      "Pouvoir mesurer des températures très élevées",
      "Ne jamais nécessiter d'étalonnage",
      "Être totalement insensible à la chaleur",
      "Ne mesurer que des températures négatives"
    ],
    bonne_reponse: "Pouvoir mesurer des températures très élevées",
    explication: "Les thermocouples, robustes, sont souvent utilisés pour des mesures à haute température (fours, moteurs) contrairement aux thermistances."
  },

  {
    question: "Un capteur infrarouge (ou à cristaux liquides) permet de mesurer une température :",
    options: [
      "Sans contact direct avec l'objet, à distance",
      "Uniquement en le plongeant dans un liquide",
      "En pesant l'objet",
      "En mesurant sa couleur visible uniquement"
    ],
    bonne_reponse: "Sans contact direct avec l'objet, à distance",
    explication: "Le capteur infrarouge détecte le rayonnement thermique émis par l'objet, permettant une mesure de température sans contact."
  },

  {
    question: "La résistance d'une thermistance CTN (coefficient de température négatif) :",
    options: [
      "Diminue lorsque la température augmente",
      "Augmente lorsque la température augmente",
      "Reste constante quelle que soit la température",
      "Devient négative à haute température"
    ],
    bonne_reponse: "Diminue lorsque la température augmente",
    explication: "Pour une thermistance CTN, la résistance décroît quand la température croît (comportement inverse d'une résistance métallique classique)."
  },

  {
    question: "Étalonner un capteur de température consiste à :",
    options: [
      "Établir la relation entre la grandeur mesurée (résistance, tension...) et la température réelle",
      "Le peindre d'une couleur spécifique",
      "Le plonger dans l'eau bouillante uniquement sans mesure",
      "Le débrancher du circuit"
    ],
    bonne_reponse: "Établir la relation entre la grandeur mesurée (résistance, tension...) et la température réelle",
    explication: "L'étalonnage consiste à comparer les indications du capteur à des températures de référence connues, pour établir sa courbe de réponse."
  },

  {
    question: "Sur une bandelette à cristaux liquides utilisée comme thermomètre, le changement de couleur indique :",
    options: [
      "Une variation de température autour d'un seuil précis",
      "Une variation de pression",
      "Une variation de pH",
      "Une variation d'humidité uniquement"
    ],
    bonne_reponse: "Une variation de température autour d'un seuil précis",
    explication: "Les cristaux liquides thermochromiques changent d'orientation moléculaire (donc de couleur) selon la température atteinte."
  }
];

/* ============================================================
   ============  QUIZ PLAYSCIENCES — THERMIQUE 2NDE A  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur cette échelle de température, à quelle valeur en kelvin correspond 0 °C ?",
    graphique: "img/q1.png",
    options: [
      "0 K",
      "100 K",
      "273 K",
      "373 K"
    ],
    bonne_reponse: "273 K",
    explication: "La relation entre température en kelvin (T) et en degrés Celsius (θ) est T = θ + 273 : 0 °C correspond donc à 273 K."
  },

  {
    question: "Quelle relation permet de convertir une température θ en degrés Celsius vers une température T en kelvin ?",
    options: [
      "T = θ + 273",
      "T = θ − 273",
      "T = θ × 273",
      "T = θ / 273"
    ],
    bonne_reponse: "T = θ + 273",
    explication: "T(K) = θ(°C) + 273."
  },

  {
    question: "Quel est le principe de fonctionnement d'une thermistance utilisée comme capteur de température ?",
    graphique: "img/q3.png",
    options: [
      "Sa résistance électrique varie fortement avec la température",
      "Elle produit directement une tension proportionnelle à la couleur de l'objet",
      "Elle mesure la pression du milieu",
      "Elle ne fonctionne qu'à très haute température"
    ],
    bonne_reponse: "Sa résistance électrique varie fortement avec la température",
    explication: "Une thermistance est un capteur dont la résistance électrique varie de façon importante et non linéaire avec la température."
  },

  {
    question: "Quelle propriété caractérise une sonde à résistance de platine (Pt100) ?",
    options: [
      "Sa résistance vaut 100 Ω à 0 °C et varie de façon très stable et linéaire avec la température",
      "Elle ne peut mesurer que des températures négatives",
      "Elle fonctionne uniquement sans alimentation électrique",
      "Elle mesure uniquement la température de l'air"
    ],
    bonne_reponse: "Sa résistance vaut 100 Ω à 0 °C et varie de façon très stable et linéaire avec la température",
    explication: "La sonde Pt100 doit son nom à sa résistance de 100 Ω à 0 °C ; elle est appréciée pour la stabilité et la linéarité de sa réponse en température."
  },

  {
    question: "Sur quel principe physique repose un thermocouple pour mesurer une température ?",
    options: [
      "La jonction de deux métaux différents génère une tension électrique dépendant de la différence de température entre ses deux extrémités (effet Seebeck)",
      "Il mesure directement la dilatation d'un liquide",
      "Il change de couleur selon la température",
      "Il pèse plus lourd à haute température"
    ],
    bonne_reponse: "La jonction de deux métaux différents génère une tension électrique dépendant de la différence de température entre ses deux extrémités (effet Seebeck)",
    explication: "Un thermocouple exploite l'effet Seebeck : la jonction de deux métaux différents produit une tension électrique proportionnelle à l'écart de température entre la jonction de mesure et la jonction de référence."
  },

  {
    question: "Comment un thermomètre à infrarouge mesure-t-il une température sans contact ?",
    options: [
      "En captant le rayonnement infrarouge émis par l'objet, dont l'intensité dépend de sa température",
      "En touchant l'objet avec une sonde métallique",
      "En mesurant uniquement la couleur visible de l'objet",
      "En pesant l'objet à distance"
    ],
    bonne_reponse: "En captant le rayonnement infrarouge émis par l'objet, dont l'intensité dépend de sa température",
    explication: "Tout corps émet un rayonnement infrarouge dont l'intensité et la répartition spectrale dépendent de sa température ; le thermomètre IR capte ce rayonnement pour en déduire la température sans contact."
  },

  {
    question: "Sur quel principe reposent les thermomètres à cristaux liquides (comme certains autocollants thermosensibles) ?",
    options: [
      "Certains cristaux liquides changent de couleur de façon réversible selon la température",
      "Ils fondent définitivement à une température donnée",
      "Ils mesurent la pression atmosphérique",
      "Ils ne fonctionnent que dans l'obscurité totale"
    ],
    bonne_reponse: "Certains cristaux liquides changent de couleur de façon réversible selon la température",
    explication: "Certains cristaux liquides thermochromes changent de couleur de manière réversible en fonction de la température, ce qui permet une lecture visuelle rapide, quoique peu précise."
  },

  {
    question: "Lorsqu'on répète plusieurs fois la mesure d'une même température, quelles grandeurs statistiques permettent de caractériser la série de mesures obtenue ?",
    options: [
      "La moyenne et l'écart-type",
      "Uniquement la valeur maximale",
      "Uniquement la valeur minimale",
      "Le produit de toutes les mesures"
    ],
    bonne_reponse: "La moyenne et l'écart-type",
    explication: "La moyenne donne la valeur représentative de la série de mesures, et l'écart-type caractérise leur dispersion, ce qui permet d'exprimer le résultat avec une incertitude et un nombre de chiffres significatifs adapté."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
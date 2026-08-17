/* ============================================================
   ============  QUIZ PLAYSCIENCES — ELECTRICITE TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce graphique, on observe la tension u(t) et l'intensité i(t) aux bornes d'un dipôle en régime sinusoïdal. Que représente le décalage entre les deux courbes ?",
    graphique: "img/q1.png",
    options: [
      "Une erreur de mesure à corriger",
      "Le déphasage entre la tension et l'intensité",
      "Une différence de fréquence entre les deux signaux",
      "Un court-circuit dans le circuit"
    ],
    bonne_reponse: "Le déphasage entre la tension et l'intensité",
    explication: "Pour un dipôle non purement résistif, la tension et l'intensité sont déphasées : ce décalage temporel correspond à l'angle de déphasage φ."
  },

  {
    question: "Quelle relation permet de calculer la puissance active P consommée par un dipôle en régime sinusoïdal ?",
    options: [
      "P = Uefficace × Iefficace × cos(φ)",
      "P = Uefficace × Iefficace",
      "P = Uefficace / Iefficace",
      "P = Uefficace + Iefficace"
    ],
    bonne_reponse: "P = Uefficace × Iefficace × cos(φ)",
    explication: "P = Uefficace × Iefficace × cos(φ), où φ est le déphasage entre tension et intensité, et cos(φ) le facteur de puissance."
  },

  {
    question: "Ce montage représente un pont de diodes. Quelle est sa fonction dans un circuit électronique ?",
    graphique: "img/q3.png",
    options: [
      "Amplifier la tension alternative",
      "Redresser un courant alternatif en un courant de sens unique (redressement)",
      "Transformer le courant continu en courant alternatif",
      "Mesurer une intensité"
    ],
    bonne_reponse: "Redresser un courant alternatif en un courant de sens unique (redressement)",
    explication: "Un pont de diodes redresse une tension alternative ; un condensateur en sortie permet ensuite de filtrer et lisser cette tension redressée."
  },

  {
    question: "Ce schéma représente le principe d'un moteur électrique. Quel phénomène physique permet la mise en rotation du rotor ?",
    graphique: "img/q5.png",
    options: [
      "L'interaction entre le champ magnétique créé par le stator et le courant circulant dans le rotor",
      "La seule chaleur dégagée par effet Joule",
      "La pression exercée par l'air ambiant",
      "Un phénomène purement chimique"
    ],
    bonne_reponse: "L'interaction entre le champ magnétique créé par le stator et le courant circulant dans le rotor",
    explication: "Un moteur électrique convertit l'énergie électrique en énergie mécanique grâce aux forces exercées par le champ magnétique du stator sur les courants induits ou imposés dans le rotor, ce qui produit sa rotation."
  },

  {
    question: "Sur quel type de réaction chimique repose le fonctionnement d'une pile ?",
    options: [
      "Une réaction de précipitation uniquement",
      "Une réaction d'oxydoréduction spontanée, qui convertit de l'énergie chimique en énergie électrique",
      "Une réaction acido-basique uniquement",
      "Aucune réaction chimique n'est nécessaire"
    ],
    bonne_reponse: "Une réaction d'oxydoréduction spontanée, qui convertit de l'énergie chimique en énergie électrique",
    explication: "Une pile fonctionne grâce à une réaction d'oxydoréduction spontanée entre les espèces des deux demi-piles, qui produit un courant électrique en convertissant de l'énergie chimique en énergie électrique."
  },

  {
    question: "Que se passe-t-il aux électrodes d'un accumulateur pendant sa charge, par opposition à sa décharge ?",
    options: [
      "Les réactions d'oxydoréduction sont inversées par rapport à la décharge, grâce à l'énergie électrique fournie par un générateur",
      "Rien, l'accumulateur ne réagit pas pendant la charge",
      "Le métal des électrodes fond",
      "Seule la température augmente sans réaction chimique"
    ],
    bonne_reponse: "Les réactions d'oxydoréduction sont inversées par rapport à la décharge, grâce à l'énergie électrique fournie par un générateur",
    explication: "Pendant la charge, un générateur externe force les réactions inverses de celles de la décharge, stockant à nouveau de l'énergie sous forme chimique."
  },

  {
    question: "Quelle grandeur d'un accumulateur permet de calculer l'énergie qu'il peut stocker, connaissant sa tension d'utilisation ?",
    options: [
      "Sa capacité, exprimée en ampère-heure (Ah)",
      "Sa couleur",
      "Sa masse uniquement, sans autre donnée",
      "Sa fréquence propre"
    ],
    bonne_reponse: "Sa capacité, exprimée en ampère-heure (Ah)",
    explication: "L'énergie stockée se calcule à partir de la capacité (Ah) et de la tension d'utilisation : E = Capacité × Tension."
  },

  {
    question: "Un accumulateur a une capacité de 2000 mAh et fonctionne sous une tension de 3,7 V. Quelle est l'énergie stockée (arrondie) ?",
    options: [
      "7,4 Wh",
      "2000 Wh",
      "540 Wh",
      "0,54 Wh"
    ],
    bonne_reponse: "7,4 Wh",
    explication: "E = Capacité × Tension = 2,0 Ah × 3,7 V = 7,4 Wh."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
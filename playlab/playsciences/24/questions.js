/* ============================================================
   ============  QUIZ PLAYSCIENCES — C3. Titrages (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Un titrage pH-métrique consiste à :",
    options: [
      "Mesurer le pH du mélange au cours de l'ajout progressif du réactif titrant",
      "Peser le précipité formé",
      "Mesurer uniquement la température",
      "Compter les bulles produites"
    ],
    bonne_reponse: "Mesurer le pH du mélange au cours de l'ajout progressif du réactif titrant",
    explication: "On suit l'évolution du pH avec un pH-mètre à chaque ajout de volume de solution titrante, ce qui donne la courbe pH = f(V)."
  },

  {
    question: "Le volume à l'équivalence d'un titrage correspond au moment où :",
    options: [
      "Les réactifs ont été mélangés en proportions quelconques",
      "Les réactifs ont été introduits en proportions stœchiométriques",
      "Le pH vaut exactement 7",
      "La solution devient incolore"
    ],
    bonne_reponse: "Les réactifs ont été introduits en proportions stœchiométriques",
    explication: "À l'équivalence, les quantités de matière des réactifs respectent exactement les proportions de l'équation de la réaction."
  },

  {
    question: "Dans la méthode des tangentes, on détermine le volume équivalent en :",
    options: [
      "Traçant deux tangentes parallèles de part et d'autre du saut de pH puis leur médiatrice",
      "Mesurant la masse du bécher",
      "Comptant les gouttes ajoutées uniquement",
      "Chronométrant la réaction"
    ],
    bonne_reponse: "Traçant deux tangentes parallèles de part et d'autre du saut de pH puis leur médiatrice",
    explication: "La médiatrice des deux tangentes parallèles coupe la courbe au point d'équivalence."
  },

  {
    question: "Dans la méthode de la dérivée, le volume équivalent correspond :",
    options: [
      "Au minimum de la courbe dérivée dpH/dV",
      "Au maximum (pic) de la courbe dérivée dpH/dV",
      "À l'intersection des axes",
      "À la valeur moyenne du pH"
    ],
    bonne_reponse: "Au maximum (pic) de la courbe dérivée dpH/dV",
    explication: "La dérivée du pH par rapport au volume présente un pic marqué exactement au volume équivalent, où le pH varie le plus vite."
  },

  {
    question: "Comparée à un titrage colorimétrique, une méthode pH-métrique permet en plus :",
    options: [
      "De connaître l'évolution complète du pH et de tracer la courbe",
      "D'aller plus vite",
      "De se passer de burette",
      "D'éviter tout calcul"
    ],
    bonne_reponse: "De connaître l'évolution complète du pH et de tracer la courbe",
    explication: "Le suivi pH-métrique donne toute la courbe pH=f(V), ce qui permet d'exploiter plusieurs méthodes graphiques d'équivalence."
  },

  {
    question: "Quelle verrerie contient la solution titrante lors d'un titrage ?",
    options: [
      "Le bécher",
      "La burette graduée",
      "L'éprouvette",
      "Le ballon"
    ],
    bonne_reponse: "La burette graduée",
    explication: "La burette permet un ajout progressif et précis, goutte à goutte, du réactif titrant."
  },

  {
    question: "La solution titrée est celle :",
    options: [
      "Dont on veut déterminer la concentration inconnue, placée dans le bécher",
      "Toujours de concentration connue placée dans la burette",
      "Jamais utilisée dans un titrage",
      "Utilisée uniquement pour rincer la verrerie"
    ],
    bonne_reponse: "Dont on veut déterminer la concentration inconnue, placée dans le bécher",
    explication: "On titre la solution de concentration inconnue avec une solution titrante de concentration connue."
  },

  {
    question: "À l'équivalence d'un titrage acide fort/base forte, le pH théorique vaut environ :",
    options: [
      "0",
      "7",
      "14",
      "−7"
    ],
    bonne_reponse: "7",
    explication: "Pour un titrage acide fort par une base forte (ou inversement), l'équivalence correspond à un pH voisin de 7."
  },

  {
    question: "Un agitateur magnétique est utilisé pendant un titrage pour :",
    options: [
      "Chauffer la solution",
      "Homogénéiser le mélange en continu",
      "Mesurer le pH",
      "Filtrer le précipité"
    ],
    bonne_reponse: "Homogénéiser le mélange en continu",
    explication: "L'agitation continue assure un mélange homogène, indispensable pour une mesure de pH fiable à chaque ajout."
  },

  {
    question: "Comparer plusieurs méthodes d'exploitation (tangentes, dérivée) d'un même titrage sert à :",
    options: [
      "Vérifier la cohérence du volume équivalent obtenu",
      "Changer la nature de la réaction",
      "Modifier la concentration de la solution titrée",
      "Éviter d'utiliser un pH-mètre"
    ],
    bonne_reponse: "Vérifier la cohérence du volume équivalent obtenu",
    explication: "Si les différentes méthodes graphiques donnent un volume équivalent proche, cela valide la fiabilité de la mesure."
  }
];

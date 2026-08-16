/* ============================================================
   ============  QUIZ PLAYSCIENCES — ELECTRICITE 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce circuit, un ampèremètre A et un voltmètre V sont branchés. Comment doit-on brancher un voltmètre pour mesurer une tension ?",
    graphique: "img/q1.png",
    options: [
      "En série dans le circuit",
      "En dérivation (en parallèle) aux bornes du composant",
      "Il n'a pas besoin d'être connecté au circuit",
      "Toujours juste après la source"
    ],
    bonne_reponse: "En dérivation (en parallèle) aux bornes du composant",
    explication: "Le voltmètre se branche en dérivation, aux bornes du composant, alors que l'ampèremètre se branche en série."
  },

  {
    question: "Quelle relation relie la puissance électrique P, la tension U et l'intensité I en régime continu ?",
    options: [
      "P = U × I",
      "P = U / I",
      "P = U + I",
      "P = U − I"
    ],
    bonne_reponse: "P = U × I",
    explication: "En régime continu, P = U × I."
  },

  {
    question: "Un appareil de puissance 1500 W fonctionne pendant 2 heures. Quelle énergie a-t-il consommée ?",
    options: [
      "750 Wh",
      "3000 Wh (3 kWh)",
      "1500 Wh",
      "6000 Wh"
    ],
    bonne_reponse: "3000 Wh (3 kWh)",
    explication: "E = P × t = 1500 × 2 = 3000 Wh, soit 3 kWh."
  },

  {
    question: "Ce schéma représente le transport de l'énergie électrique depuis une centrale jusqu'aux habitations. Pourquoi élève-t-on la tension avant le transport sur de longues distances ?",
    graphique: "img/q4.png",
    options: [
      "Pour rendre le courant continu",
      "Pour limiter les pertes par effet Joule en réduisant l'intensité du courant transporté",
      "Pour augmenter la couleur du courant",
      "Ce n'est pas utile, c'est juste une habitude"
    ],
    bonne_reponse: "Pour limiter les pertes par effet Joule en réduisant l'intensité du courant transporté",
    explication: "À puissance transportée égale, élever la tension réduit l'intensité, ce qui diminue fortement les pertes par effet Joule."
  },

  {
    question: "Quelle relation permet de calculer la puissance dissipée par effet Joule dans un conducteur de résistance R traversé par un courant d'intensité I ?",
    graphique: "img/q6.png",
    options: [
      "P = R × I²",
      "P = R / I",
      "P = R + I",
      "P = R × I"
    ],
    bonne_reponse: "P = R × I²",
    explication: "La puissance dissipée par effet Joule est P = R × I² : elle croît avec le carré de l'intensité, comme le montre le graphique fourni."
  },

  {
    question: "D'après ce graphique montrant la puissance dissipée par effet Joule en fonction de l'intensité, si l'intensité double, comment varie la puissance dissipée ?",
    graphique: "img/q6.png",
    options: [
      "Elle double aussi",
      "Elle est multipliée par 4",
      "Elle reste identique",
      "Elle est divisée par 2"
    ],
    bonne_reponse: "Elle est multipliée par 4",
    explication: "P = R×I² étant proportionnelle au carré de l'intensité, doubler I multiplie P par 2² = 4."
  },

  {
    question: "Ce schéma représente un transformateur avec N1 spires au primaire et N2 spires au secondaire. Quel est son rôle dans un réseau électrique ?",
    graphique: "img/q7.png",
    options: [
      "Élever ou abaisser la valeur d'une tension alternative selon le rapport N2/N1",
      "Transformer le courant alternatif en courant continu",
      "Stocker de l'énergie électrique",
      "Produire de l'énergie électrique"
    ],
    bonne_reponse: "Élever ou abaisser la valeur d'une tension alternative selon le rapport N2/N1",
    explication: "Un transformateur élève ou abaisse une tension alternative selon le rapport du nombre de spires U2/U1 = N2/N1, sans changer la fréquence ni la nature du courant."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/* ============================================================
   ============  QUIZ PLAYSCIENCES — MECANIQUE 2NDE  ============
   ============================================================ */

window.questions = [

  {
    question: "Voici les trajectoires de deux mobiles A et B. Comment qualifie-t-on chacune de ces trajectoires ?",
    graphique: "img/q1.png",
    options: [
      "A est circulaire, B est rectiligne",
      "A est rectiligne, B est circulaire",
      "Les deux sont rectilignes",
      "Les deux sont circulaires"
    ],
    bonne_reponse: "A est rectiligne, B est circulaire",
    explication: "La trajectoire A est une droite (rectiligne), la trajectoire B est un cercle (circulaire)."
  },

  {
    question: "Qu'est-ce qu'un référentiel en mécanique ?",
    options: [
      "Un solide par rapport auquel on étudie le mouvement d'un objet",
      "Une unité de mesure de la vitesse",
      "Un instrument de mesure de la masse",
      "Une trajectoire particulière"
    ],
    bonne_reponse: "Un solide par rapport auquel on étudie le mouvement d'un objet",
    explication: "Un référentiel est un solide par rapport auquel on décrit position et mouvement d'un système."
  },

  {
    question: "Ce schéma représente un point mobile en rotation autour d'un axe. Comment définit-on sa fréquence de rotation ?",
    graphique: "img/q3.png",
    options: [
      "Le nombre de tours effectués par unité de temps",
      "La distance parcourue en un tour",
      "La vitesse au centre du cercle",
      "Le rayon du cercle décrit"
    ],
    bonne_reponse: "Le nombre de tours effectués par unité de temps",
    explication: "La fréquence de rotation, exprimée en tours par seconde (ou en Hz, ou en tr/min), correspond au nombre de tours effectués par unité de temps."
  },

  {
    question: "Un disque tourne à 300 tours par minute. Quelle est sa fréquence de rotation en Hz ?",
    options: [
      "5 Hz",
      "300 Hz",
      "30 Hz",
      "18000 Hz"
    ],
    bonne_reponse: "5 Hz",
    explication: "300 tr/min = 300/60 = 5 tours par seconde = 5 Hz."
  },

  {
    question: "Comment calcule-t-on la vitesse moyenne d'un mobile pour un mouvement rectiligne ?",
    options: [
      "v = distance parcourue × durée",
      "v = distance parcourue / durée",
      "v = durée / distance parcourue",
      "v = distance parcourue + durée"
    ],
    bonne_reponse: "v = distance parcourue / durée",
    explication: "v = d / t."
  },

  {
    question: "Ce schéma représente le poids P d'un objet de masse m. Quelle relation relie le poids à la masse ?",
    graphique: "img/q5.png",
    options: [
      "P = m × g",
      "P = m + g",
      "P = m / g",
      "P = g / m"
    ],
    bonne_reponse: "P = m × g",
    explication: "P = m × g, où g est l'intensité de pesanteur (≈ 9,8 N/kg sur Terre)."
  },

  {
    question: "Que faut-il préciser pour modéliser complètement une force exercée sur un objet ?",
    options: [
      "Uniquement sa valeur",
      "Son point d'application, sa direction, son sens et sa valeur",
      "Uniquement sa direction",
      "Uniquement son sens"
    ],
    bonne_reponse: "Son point d'application, sa direction, son sens et sa valeur",
    explication: "Une force est une grandeur vectorielle : elle doit être modélisée par un point d'application, une direction, un sens et une valeur (norme), généralement représentée par un vecteur."
  },

  {
    question: "Sur ce schéma, un objet est soumis à deux forces F1 et F2 de même valeur mais de sens opposés. Cet objet est-il en équilibre ?",
    graphique: "img/q7.png",
    options: [
      "Oui, car les deux forces ont la même direction, des sens opposés et des valeurs égales",
      "Non, un objet ne peut jamais être en équilibre sous deux forces",
      "Oui, mais uniquement si l'objet est immobile au départ",
      "Non, il faut au moins trois forces pour un équilibre"
    ],
    bonne_reponse: "Oui, car les deux forces ont la même direction, des sens opposés et des valeurs égales",
    explication: "Pour qu'un solide soumis à deux forces soit en équilibre, ces forces doivent avoir la même droite d'action, des sens opposés et des valeurs égales."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
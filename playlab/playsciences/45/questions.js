/* ============================================================
   ============  QUIZ PLAYSCIENCES — T3. Changement d'état (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Lors d'un changement d'état (ex : fusion de la glace), la température du corps pur :",
    options: [
      "Reste constante pendant toute la durée du changement d'état",
      "Augmente continuellement",
      "Diminue continuellement",
      "Devient négative"
    ],
    bonne_reponse: "Reste constante pendant toute la durée du changement d'état",
    explication: "Tant que les deux états coexistent, l'énergie apportée sert uniquement au changement d'état, la température reste donc constante (palier)."
  },

  {
    question: "Sur une courbe de température en fonction du temps lors d'un chauffage, le palier observé correspond à :",
    options: [
      "Un changement d'état",
      "Une erreur de mesure",
      "Un équilibre thermique avec l'air",
      "Une accélération du chauffage"
    ],
    bonne_reponse: "Un changement d'état",
    explication: "Le palier de température traduit que toute l'énergie apportée est utilisée pour le changement d'état, sans faire varier la température."
  },

  {
    question: "L'énergie nécessaire au changement d'état d'un corps de masse m, de chaleur latente L, se calcule par :",
    options: [
      "Q = m × L",
      "Q = m / L",
      "Q = m + L",
      "Q = L / m"
    ],
    bonne_reponse: "Q = m × L",
    explication: "La formule Q = mL relie l'énergie de changement d'état à la masse du corps et à sa chaleur latente massique."
  },

  {
    question: "La chaleur latente de fusion de la glace est d'environ :",
    options: [
      "334 kJ/kg",
      "4,18 kJ/kg",
      "2260 kJ/kg",
      "0 kJ/kg"
    ],
    bonne_reponse: "334 kJ/kg",
    explication: "Il faut environ 334 kJ pour faire fondre 1 kg de glace à 0°C, sans variation de température."
  },

  {
    question: "Quelle énergie faut-il pour faire fondre entièrement 0,5 kg de glace (L = 334 kJ/kg) ?",
    options: [
      "167 kJ",
      "334 kJ",
      "668 kJ",
      "0,5 kJ"
    ],
    bonne_reponse: "167 kJ",
    explication: "Q = m×L = 0,5×334 = 167 kJ."
  },

  {
    question: "La chaleur latente de vaporisation de l'eau (≈ 2260 kJ/kg) est nettement supérieure à sa chaleur latente de fusion (≈ 334 kJ/kg), ce qui montre que :",
    options: [
      "La vaporisation nécessite bien plus d'énergie que la fusion",
      "La fusion nécessite plus d'énergie que la vaporisation",
      "Les deux processus nécessitent la même énergie",
      "Aucune énergie n'est nécessaire pour vaporiser l'eau"
    ],
    bonne_reponse: "La vaporisation nécessite bien plus d'énergie que la fusion",
    explication: "Passer de l'état liquide à l'état gazeux demande de rompre davantage de liaisons intermoléculaires que passer de solide à liquide."
  },

  {
    question: "Un bilan énergétique complet lors d'un chauffage avec changement d'état doit prendre en compte :",
    options: [
      "L'énergie pour chauffer chaque état (Q=mcΔθ) et l'énergie de changement d'état (Q=mL)",
      "Uniquement l'énergie de changement d'état",
      "Uniquement l'échauffement, sans changement d'état",
      "Aucune énergie, tout est gratuit"
    ],
    bonne_reponse: "L'énergie pour chauffer chaque état (Q=mcΔθ) et l'énergie de changement d'état (Q=mL)",
    explication: "Le bilan total additionne les énergies d'échauffement de chaque phase et l'énergie nécessaire à chaque changement d'état traversé."
  },

  {
    question: "Pour faire passer un glaçon de −10°C à de la vapeur d'eau à 100°C, il faut successivement :",
    options: [
      "Chauffer la glace, la faire fondre, chauffer l'eau liquide, la faire vaporiser",
      "Uniquement la faire fondre",
      "Uniquement la vaporiser directement",
      "Uniquement la refroidir"
    ],
    bonne_reponse: "Chauffer la glace, la faire fondre, chauffer l'eau liquide, la faire vaporiser",
    explication: "Ce processus complet comprend plusieurs étapes successives d'échauffement et de changements d'état (fusion puis vaporisation)."
  },

  {
    question: "La durée d'un palier de changement d'état, à puissance de chauffage constante, dépend principalement de :",
    options: [
      "La masse du corps et sa chaleur latente",
      "La couleur du récipient",
      "La forme du récipient uniquement",
      "La pression atmosphérique uniquement"
    ],
    bonne_reponse: "La masse du corps et sa chaleur latente",
    explication: "Plus la masse ou la chaleur latente est grande, plus l'énergie à apporter est importante, donc plus le palier dure longtemps à puissance constante."
  },

  {
    question: "Repérer précisément le début et la fin d'un palier sur une courbe expérimentale permet de :",
    options: [
      "Déterminer la durée du changement d'état et calculer l'énergie mise en jeu",
      "Mesurer directement une masse",
      "Déterminer un pH",
      "Calculer une vitesse de propagation du son"
    ],
    bonne_reponse: "Déterminer la durée du changement d'état et calculer l'énergie mise en jeu",
    explication: "Connaissant la puissance de chauffage et la durée du palier, on peut calculer l'énergie Q = P×t fournie lors du changement d'état."
  }
];

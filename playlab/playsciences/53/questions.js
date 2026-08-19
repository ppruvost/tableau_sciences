/* ============================================================
   ============  QUIZ PLAYSCIENCES — E4. Conversion et moteurs électriques (Tle)  ============
   ============================================================ */

window.questions = [

  {
    question: "Le redressement d'une tension alternative consiste à :",
    options: [
      "La transformer en une tension unidirectionnelle (toujours de même signe)",
      "Augmenter sa fréquence",
      "La rendre nulle",
      "La transformer en son sonore"
    ],
    bonne_reponse: "La transformer en une tension unidirectionnelle (toujours de même signe)",
    explication: "Un redresseur (souvent à diodes) transforme une tension alternative, changeant de signe, en une tension qui reste positive (ou négative)."
  },

  {
    question: "Un pont de diodes utilisé pour le redressement double alternance permet d'obtenir en sortie :",
    options: [
      "Une tension dont les alternances négatives sont retournées en positives",
      "Une tension parfaitement continue sans aucune variation",
      "Une tension nulle en permanence",
      "Une tension alternative inchangée"
    ],
    bonne_reponse: "Une tension dont les alternances négatives sont retournées en positives",
    explication: "Le pont de diodes redresse les deux alternances du signal, ce qui donne une tension positive mais encore ondulée."
  },

  {
    question: "Après redressement, la tension obtenue est souvent ondulée. Le filtrage (souvent par condensateur) sert à :",
    options: [
      "Lisser la tension pour la rendre plus proche d'une tension continue",
      "Augmenter les ondulations",
      "Rendre la tension alternative à nouveau",
      "Supprimer totalement le courant"
    ],
    bonne_reponse: "Lisser la tension pour la rendre plus proche d'une tension continue",
    explication: "Le condensateur de filtrage se charge et se décharge pour combler les creux de la tension redressée, réduisant l'ondulation résiduelle."
  },

  {
    question: "Une alimentation stabilisée de matériel électronique combine généralement :",
    options: [
      "Un transformateur, un redresseur et un filtre",
      "Uniquement un interrupteur",
      "Uniquement une résistance",
      "Uniquement une bobine"
    ],
    bonne_reponse: "Un transformateur, un redresseur et un filtre",
    explication: "La chaîne classique d'une alimentation continue régulée abaisse la tension (transformateur), la redresse puis la filtre avant régulation."
  },

  {
    question: "Un moteur électrique convertit :",
    options: [
      "L'énergie électrique en énergie mécanique",
      "L'énergie mécanique en énergie chimique",
      "L'énergie lumineuse en énergie électrique",
      "L'énergie thermique en énergie électrique"
    ],
    bonne_reponse: "L'énergie électrique en énergie mécanique",
    explication: "Le moteur électrique est un convertisseur électromécanique : il transforme l'énergie électrique reçue en mouvement (énergie mécanique)."
  },

  {
    question: "Le rendement d'un moteur électrique correspond au rapport entre :",
    options: [
      "La puissance mécanique utile fournie et la puissance électrique absorbée",
      "La puissance électrique et la tension d'alimentation",
      "La vitesse et le courant",
      "La masse et le volume du moteur"
    ],
    bonne_reponse: "La puissance mécanique utile fournie et la puissance électrique absorbée",
    explication: "η = P_utile / P_absorbée : le rendement traduit la part de l'énergie électrique effectivement convertie en énergie mécanique utile."
  },

  {
    question: "Un moteur électrique dont le rendement est de 80% et qui absorbe 1000 W fournit une puissance mécanique de :",
    options: [
      "800 W",
      "1000 W",
      "200 W",
      "1250 W"
    ],
    bonne_reponse: "800 W",
    explication: "P_utile = η × P_absorbée = 0,80 × 1000 = 800 W."
  },

  {
    question: "Dans un moteur, la puissance non convertie en énergie mécanique est le plus souvent dissipée sous forme de :",
    options: [
      "Chaleur (pertes par effet Joule et frottements)",
      "Lumière visible",
      "Son uniquement",
      "Énergie chimique"
    ],
    bonne_reponse: "Chaleur (pertes par effet Joule et frottements)",
    explication: "Les pertes d'un moteur électrique proviennent principalement de l'effet Joule dans les bobinages et des frottements mécaniques."
  },

  {
    question: "Un moteur à courant continu nécessite généralement une alimentation :",
    options: [
      "Continue, obtenue par exemple après redressement et filtrage d'une tension alternative",
      "Alternative uniquement",
      "Nulle en permanence",
      "Purement sonore"
    ],
    bonne_reponse: "Continue, obtenue par exemple après redressement et filtrage d'une tension alternative",
    explication: "Un moteur à courant continu fonctionne avec une tension continue, souvent produite à partir du secteur via redressement et filtrage."
  },

  {
    question: "La vitesse de rotation d'un moteur à courant continu dépend principalement de :",
    options: [
      "La tension d'alimentation appliquée à ses bornes",
      "Sa couleur",
      "Sa masse uniquement",
      "La pression atmosphérique"
    ],
    bonne_reponse: "La tension d'alimentation appliquée à ses bornes",
    explication: "Pour un moteur à courant continu, la vitesse de rotation est globalement proportionnelle à la tension appliquée."
  }
];

/* ============================================================
   ============  QUIZ PLAYSCIENCES — M5. Pression, débit et résonance (Tle)  ============
   ============================================================ */

window.questions = [

  {
    question: "Dans un fluide immobile, la pression augmente avec :",
    options: [
      "La profondeur",
      "L'altitude",
      "La couleur du fluide",
      "Le temps écoulé"
    ],
    bonne_reponse: "La profondeur",
    explication: "La pression hydrostatique croît avec la profondeur, en raison du poids de la colonne de fluide au-dessus du point considéré."
  },

  {
    question: "La relation fondamentale de l'hydrostatique s'écrit P = P₀ + ρ×g×h, où h représente :",
    options: [
      "La profondeur sous la surface libre du fluide",
      "La masse du fluide",
      "La température",
      "Le débit"
    ],
    bonne_reponse: "La profondeur sous la surface libre du fluide",
    explication: "h est la hauteur de fluide (profondeur) au-dessus du point où l'on calcule la pression."
  },

  {
    question: "Le débit volumique d'un fluide en mouvement dans une canalisation se définit comme :",
    options: [
      "Le volume de fluide qui traverse une section par unité de temps",
      "La masse totale du fluide",
      "La pression du fluide",
      "La vitesse uniquement, sans lien avec la section"
    ],
    bonne_reponse: "Le volume de fluide qui traverse une section par unité de temps",
    explication: "Le débit volumique Qv (en m³/s) mesure le volume de fluide traversant une section donnée chaque seconde."
  },

  {
    question: "La relation entre débit Qv, vitesse v et section S d'écoulement est :",
    options: [
      "Qv = v × S",
      "Qv = v / S",
      "Qv = v + S",
      "Qv = S / v"
    ],
    bonne_reponse: "Qv = v × S",
    explication: "Le débit volumique est le produit de la vitesse d'écoulement par la section traversée."
  },

  {
    question: "Pour un fluide incompressible en écoulement dans une canalisation de section variable, le débit :",
    options: [
      "Reste constant tout au long de la canalisation (conservation du débit)",
      "Diminue toujours vers l'aval",
      "Augmente toujours vers l'aval",
      "N'a aucune règle de conservation"
    ],
    bonne_reponse: "Reste constant tout au long de la canalisation (conservation du débit)",
    explication: "Pour un fluide incompressible, la conservation de la matière impose un débit volumique constant en tout point du circuit."
  },

  {
    question: "Si la section d'une canalisation diminue, la vitesse du fluide (débit constant) doit :",
    options: [
      "Augmenter",
      "Diminuer",
      "Rester identique",
      "Devenir nulle"
    ],
    bonne_reponse: "Augmenter",
    explication: "Puisque Qv = v×S est constant, une réduction de section S impose une augmentation de la vitesse v."
  },

  {
    question: "L'effet Venturi désigne le phénomène où, dans un rétrécissement, la vitesse augmente et la pression :",
    options: [
      "Diminue",
      "Augmente",
      "Reste identique",
      "Devient négative"
    ],
    bonne_reponse: "Diminue",
    explication: "D'après le théorème de Bernoulli, lorsque la vitesse d'un fluide augmente dans un étranglement, sa pression statique diminue."
  },

  {
    question: "La résonance mécanique d'un système se produit lorsque :",
    options: [
      "La fréquence d'excitation coïncide avec une fréquence propre du système",
      "Le système est totalement immobile",
      "La fréquence d'excitation est très différente de sa fréquence propre",
      "Il n'y a aucune force appliquée"
    ],
    bonne_reponse: "La fréquence d'excitation coïncide avec une fréquence propre du système",
    explication: "À la résonance, l'amplitude des oscillations devient maximale car l'énergie apportée par l'excitation s'accumule efficacement."
  },

  {
    question: "Un exemple classique de résonance mécanique dangereuse est :",
    options: [
      "Un pont qui se met à osciller violemment sous l'effet du vent ou d'un pas cadencé",
      "Une lampe allumée",
      "Une réaction chimique lente",
      "Un objet immobile"
    ],
    bonne_reponse: "Un pont qui se met à osciller violemment sous l'effet du vent ou d'un pas cadencé",
    explication: "Si la fréquence des sollicitations externes coïncide avec une fréquence propre du pont, les oscillations peuvent s'amplifier dangereusement."
  },

  {
    question: "La traînée exercée sur un objet en mouvement dans un fluide s'oppose :",
    options: [
      "Au mouvement de l'objet",
      "À la gravité uniquement",
      "À la portance uniquement",
      "À rien de particulier"
    ],
    bonne_reponse: "Au mouvement de l'objet",
    explication: "La force de traînée, due aux frottements du fluide, s'oppose toujours au déplacement de l'objet dans ce fluide."
  }
];

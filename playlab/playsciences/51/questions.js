/* ============================================================
   ============  QUIZ PLAYSCIENCES — E2. Transport de l'énergie électrique (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Le réseau électrique achemine l'énergie depuis les centrales de production jusqu'aux habitations en passant par :",
    options: [
      "Des lignes à haute tension puis un abaissement progressif de la tension",
      "Une seule ligne à tension constante",
      "Uniquement des câbles souterrains basse tension",
      "Aucune transformation de tension"
    ],
    bonne_reponse: "Des lignes à haute tension puis un abaissement progressif de la tension",
    explication: "L'énergie est transportée à très haute tension sur de longues distances, puis la tension est progressivement abaissée avant la distribution."
  },

  {
    question: "Pourquoi élève-t-on la tension avant le transport de l'énergie électrique sur de longues distances ?",
    options: [
      "Pour réduire l'intensité du courant et donc limiter les pertes par effet Joule",
      "Pour rendre le courant continu",
      "Pour changer la couleur du courant",
      "Ce n'est pas nécessaire, c'est une habitude"
    ],
    bonne_reponse: "Pour réduire l'intensité du courant et donc limiter les pertes par effet Joule",
    explication: "À puissance transportée égale, élever la tension réduit l'intensité, ce qui diminue fortement les pertes par effet Joule (proportionnelles à I²)."
  },

  {
    question: "La puissance dissipée par effet Joule dans une ligne de résistance R traversée par un courant d'intensité I est donnée par :",
    options: [
      "P = R × I²",
      "P = R / I",
      "P = R + I",
      "P = R × I"
    ],
    bonne_reponse: "P = R × I²",
    explication: "La puissance dissipée par effet Joule croît avec le carré de l'intensité : P = R×I²."
  },

  {
    question: "Si l'intensité dans une ligne double, la puissance perdue par effet Joule est :",
    options: [
      "Multipliée par 4",
      "Multipliée par 2",
      "Inchangée",
      "Divisée par 2"
    ],
    bonne_reponse: "Multipliée par 4",
    explication: "P = R×I² étant proportionnelle au carré de l'intensité, doubler I multiplie P par 2² = 4."
  },

  {
    question: "Un transformateur permet de :",
    options: [
      "Modifier la valeur d'une tension alternative",
      "Transformer un courant alternatif en courant continu",
      "Stocker de l'énergie électrique",
      "Produire de l'énergie à partir de rien"
    ],
    bonne_reponse: "Modifier la valeur d'une tension alternative",
    explication: "Le transformateur élève ou abaisse une tension alternative, grâce à deux bobinages couplés par un noyau magnétique."
  },

  {
    question: "Pour un transformateur idéal, la relation entre les tensions U1, U2 et le nombre de spires N1, N2 des bobinages primaire et secondaire est :",
    options: [
      "U2/U1 = N2/N1",
      "U2/U1 = N1/N2",
      "U2 × U1 = N1 × N2",
      "U2 − U1 = N2 − N1"
    ],
    bonne_reponse: "U2/U1 = N2/N1",
    explication: "Le rapport des tensions est égal au rapport du nombre de spires des enroulements secondaire et primaire."
  },

  {
    question: "Un transformateur élévateur possède :",
    options: [
      "Plus de spires au secondaire qu'au primaire",
      "Moins de spires au secondaire qu'au primaire",
      "Le même nombre de spires des deux côtés",
      "Aucune spire"
    ],
    bonne_reponse: "Plus de spires au secondaire qu'au primaire",
    explication: "Pour élever la tension (U2 > U1), il faut N2 > N1 d'après la relation de transformation."
  },

  {
    question: "Les postes de transformation situés en bout de ligne, près des habitations, servent à :",
    options: [
      "Abaisser la haute tension vers une tension basse utilisable (230 V)",
      "Élever encore la tension",
      "Stocker l'énergie",
      "Produire de nouvelles centrales"
    ],
    bonne_reponse: "Abaisser la haute tension vers une tension basse utilisable (230 V)",
    explication: "Avant la distribution finale, la tension doit être abaissée jusqu'à la valeur domestique standard, généralement 230 V."
  },

  {
    question: "Réduire les pertes en ligne lors du transport de l'électricité permet notamment de :",
    options: [
      "Améliorer le rendement global du réseau électrique",
      "Augmenter systématiquement la pollution",
      "Réduire la production nécessaire aux centrales",
      "Les deux réponses précédentes sont correctes"
    ],
    bonne_reponse: "Les deux réponses précédentes sont correctes",
    explication: "En limitant les pertes, on améliore le rendement du transport et on réduit d'autant la quantité d'énergie à produire pour un même besoin."
  },

  {
    question: "Un transformateur ne peut fonctionner qu'avec :",
    options: [
      "Une tension alternative, car il repose sur l'induction électromagnétique",
      "Une tension continue uniquement",
      "N'importe quel type de tension sans distinction",
      "Aucune tension, il fonctionne seul"
    ],
    bonne_reponse: "Une tension alternative, car il repose sur l'induction électromagnétique",
    explication: "Le principe du transformateur repose sur la variation du flux magnétique, qui nécessite un courant alternatif (variable dans le temps)."
  }
];

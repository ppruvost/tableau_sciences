/* ============================================================
   ============  QUIZ PLAYSCIENCES — OPTIQUE 2NDE A  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce schéma d'un rayon lumineux se réfléchissant sur un miroir, quelle relation relie l'angle d'incidence i1 et l'angle de réflexion i2 ?",
    graphique: "img/q1.png",
    options: [
      "i1 = i2",
      "i1 = 2 × i2",
      "i1 + i2 = 90°",
      "i1 = −i2"
    ],
    bonne_reponse: "i1 = i2",
    explication: "La loi de la réflexion indique que l'angle de réflexion est toujours égal à l'angle d'incidence."
  },

  {
    question: "Un rayon lumineux passe de l'air vers le verre, comme sur ce schéma. Quelle relation traduit la loi de la réfraction ?",
    graphique: "img/q2.png",
    options: [
      "n1 × sin(i1) = n2 × sin(i2)",
      "n1 + i1 = n2 + i2",
      "i1 = i2",
      "n1 × i1 = n2 × i2"
    ],
    bonne_reponse: "n1 × sin(i1) = n2 × sin(i2)",
    explication: "La loi de Snell-Descartes pour la réfraction s'écrit n1 × sin(i1) = n2 × sin(i2)."
  },

  {
    question: "Qu'appelle-t-on l'angle limite de réfraction ?",
    options: [
      "L'angle d'incidence pour lequel le rayon réfracté rase la surface de séparation (i2 = 90°)",
      "L'angle entre le rayon incident et le rayon réfléchi",
      "L'angle maximal que peut prendre un rayon réfléchi",
      "Un angle qui n'existe que dans le vide"
    ],
    bonne_reponse: "L'angle d'incidence pour lequel le rayon réfracté rase la surface de séparation (i2 = 90°)",
    explication: "Au-delà de l'angle limite, dans le milieu le plus réfringent, il n'existe plus de rayon réfracté : c'est la réflexion totale."
  },

  {
    question: "Ce schéma illustre la décomposition de la lumière blanche par un prisme. Que révèle cette décomposition ?",
    graphique: "img/q4.png",
    options: [
      "La lumière blanche est composée d'une seule couleur",
      "La lumière blanche est la superposition de plusieurs lumières colorées, de longueurs d'onde différentes",
      "Le prisme colore artificiellement la lumière",
      "La décomposition ne fonctionne qu'avec la lumière du Soleil"
    ],
    bonne_reponse: "La lumière blanche est la superposition de plusieurs lumières colorées, de longueurs d'onde différentes",
    explication: "Le prisme dévie différemment chaque longueur d'onde (dispersion), révélant que la lumière blanche est la superposition de toutes les couleurs du spectre visible ; on peut ensuite recomposer la lumière blanche en réunissant ces couleurs."
  },

  {
    question: "Ce schéma représente le spectre de la lumière visible. Entre quelles longueurs d'onde se situe approximativement le domaine visible par l'œil humain ?",
    graphique: "img/q5.png",
    options: [
      "Entre 400 nm et 700 nm environ",
      "Entre 10 nm et 100 nm",
      "Entre 1000 nm et 2000 nm",
      "Entre 1 nm et 10 nm"
    ],
    bonne_reponse: "Entre 400 nm et 700 nm environ",
    explication: "Le domaine visible s'étend approximativement de 400 nm (violet) à 700 nm (rouge)."
  },

  {
    question: "Quel risque une exposition excessive aux rayonnements ultraviolets (UV) fait-elle courir pour la santé ?",
    options: [
      "Aucun risque, les UV sont totalement inoffensifs",
      "Des risques pour la peau et les yeux (brûlures, cancers cutanés, lésions oculaires)",
      "Une baisse de la tension artérielle uniquement",
      "Un risque uniquement auditif"
    ],
    bonne_reponse: "Des risques pour la peau et les yeux (brûlures, cancers cutanés, lésions oculaires)",
    explication: "Une exposition excessive aux UV peut provoquer brûlures cutanées, cancers de la peau et lésions oculaires."
  },

  {
    question: "Ce schéma illustre la synthèse additive des couleurs à partir de trois lumières colorées. Quelles sont ces trois couleurs primaires ?",
    graphique: "img/q7.png",
    options: [
      "Rouge, vert, bleu",
      "Cyan, magenta, jaune",
      "Rouge, jaune, bleu",
      "Blanc, noir, gris"
    ],
    bonne_reponse: "Rouge, vert, bleu",
    explication: "La synthèse additive combine rouge, vert et bleu (RVB) pour reconstituer les couleurs, dont le blanc."
  },

  {
    question: "Ce second schéma illustre la synthèse soustractive des couleurs, utilisée par exemple en peinture ou en imprimerie. En quoi diffère-t-elle de la synthèse additive ?",
    graphique: "img/q8.png",
    options: [
      "Elle combine des pigments qui absorbent une partie de la lumière reçue, au lieu de superposer des lumières colorées",
      "Elle est rigoureusement identique à la synthèse additive",
      "Elle ne fonctionne qu'avec des lumières monochromatiques",
      "Elle ne produit jamais de couleur noire"
    ],
    bonne_reponse: "Elle combine des pigments qui absorbent une partie de la lumière reçue, au lieu de superposer des lumières colorées",
    explication: "La synthèse soustractive superpose des filtres ou pigments (cyan, magenta, jaune) qui absorbent chacun une partie du spectre de la lumière incidente, contrairement à la synthèse additive qui superpose des lumières colorées émises."
  },

  {
    question: "Pourquoi un objet rouge éclairé uniquement en lumière bleue apparaît-il noir ?",
    options: [
      "Parce que l'objet absorbe toute la lumière bleue qui l'éclaire et ne réfléchit donc aucune lumière visible",
      "Parce que le rouge et le bleu sont des couleurs complémentaires qui se neutralisent",
      "Parce que l'objet devient transparent",
      "Parce que la lumière bleue est invisible"
    ],
    bonne_reponse: "Parce que l'objet absorbe toute la lumière bleue qui l'éclaire et ne réfléchit donc aucune lumière visible",
    explication: "La couleur perçue dépend de ce que l'objet réfléchit ; un objet rouge n'a rien à réfléchir sous un éclairage exclusivement bleu, il apparaît donc noir."
  },

  {
    question: "Dans ce modèle simplifié de l'œil, quel élément joue un rôle analogue à une lentille convergente, formant l'image sur la rétine ?",
    graphique: "img/q10.png",
    options: [
      "Le cristallin",
      "Le nerf optique",
      "La pupille uniquement",
      "La paupière"
    ],
    bonne_reponse: "Le cristallin",
    explication: "Le cristallin, lentille convergente naturelle de l'œil, focalise la lumière pour former une image nette sur la rétine, qui la transmet au cerveau via le nerf optique."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
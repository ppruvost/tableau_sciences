/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES S01  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce diagramme représente une série statistique regroupée en classes. Pourquoi regroupe-t-on parfois une série en classes ?",
    graphique: "img/q1.png",
    options: [
      "Pour synthétiser une série comportant de nombreuses valeurs différentes ou continues, et faciliter sa lecture",
      "Pour rendre la série plus difficile à comprendre",
      "Pour supprimer certaines valeurs de la série",
      "Le regroupement en classes est toujours interdit en statistiques"
    ],
    bonne_reponse: "Pour synthétiser une série comportant de nombreuses valeurs différentes ou continues, et faciliter sa lecture",
    explication: "Regrouper une série statistique en classes permet de synthétiser un grand nombre de valeurs, notamment continues, en un nombre restreint d'intervalles, facilitant l'analyse et la représentation graphique."
  },

  {
    question: "Comment calcule-t-on l'effectif d'une classe dans une série statistique regroupée ?",
    options: [
      "En comptant le nombre de valeurs de la série appartenant à cette classe",
      "En additionnant toutes les valeurs de la série",
      "En divisant l'effectif total par le nombre de classes",
      "En prenant la valeur centrale de la classe"
    ],
    bonne_reponse: "En comptant le nombre de valeurs de la série appartenant à cette classe",
    explication: "L'effectif d'une classe est le nombre d'individus (ou de valeurs) de la série statistique dont la valeur appartient à l'intervalle défini par cette classe."
  },

  {
    question: "Comment représente-t-on graphiquement une série statistique quantitative regroupée en classes ?",
    options: [
      "Par un histogramme, où l'aire de chaque rectangle est proportionnelle à l'effectif de la classe",
      "Par un diagramme circulaire uniquement",
      "Par un simple tableau, jamais par un graphique",
      "Par une courbe continue reliant les extrémités des classes"
    ],
    bonne_reponse: "Par un histogramme, où l'aire de chaque rectangle est proportionnelle à l'effectif de la classe",
    explication: "L'histogramme est la représentation graphique adaptée à une série quantitative continue regroupée en classes, chaque rectangle ayant une aire proportionnelle à l'effectif (ou à la fréquence) de la classe qu'il représente."
  },

  {
    question: "Ce diagramme circulaire représente une série statistique qualitative. Pourquoi ce type de diagramme est-il adapté à une série qualitative ?",
    graphique: "img/q4.png",
    options: [
      "Il permet de visualiser directement la part de chaque catégorie dans l'effectif total",
      "Il ne peut représenter que des données numériques continues",
      "Il masque systématiquement les petites catégories",
      "Il est réservé aux séries chronologiques uniquement"
    ],
    bonne_reponse: "Il permet de visualiser directement la part de chaque catégorie dans l'effectif total",
    explication: "Un diagramme en secteurs (circulaire) est particulièrement adapté à une série qualitative car il représente visuellement la proportion de chaque catégorie par rapport au total."
  },

  {
    question: "Quelle autre représentation graphique, en plus du diagramme circulaire, est couramment utilisée pour une série qualitative ?",
    options: [
      "Le diagramme en barres (ou en bâtons)",
      "L'histogramme",
      "Le nuage de points",
      "La boîte à moustaches"
    ],
    bonne_reponse: "Le diagramme en barres (ou en bâtons)",
    explication: "Le diagramme en barres, où la hauteur de chaque barre est proportionnelle à l'effectif de la catégorie, est une alternative fréquente au diagramme circulaire pour représenter une série qualitative."
  },

  {
    question: "Quelle proportion représente le secteur « Sciences » sur ce diagramme circulaire ?",
    graphique: "img/q4.png",
    options: [
      "35 %",
      "20 %",
      "30 %",
      "15 %"
    ],
    bonne_reponse: "35 %",
    explication: "On lit directement le pourcentage associé au secteur « Sciences » sur le diagramme circulaire, ici 35 %."
  },

  {
    question: "Ce graphique représente l'évolution d'une grandeur au cours des mois de l'année, à l'aide de lignes brisées. Pourquoi ce type de représentation est-il adapté ?",
    graphique: "img/q7.png",
    options: [
      "Il met en évidence l'évolution chronologique d'une grandeur au fil du temps",
      "Il ne peut représenter que des données qualitatives",
      "Il ne permet jamais de comparer deux périodes différentes",
      "Il est réservé exclusivement aux très grandes séries de données"
    ],
    bonne_reponse: "Il met en évidence l'évolution chronologique d'une grandeur au fil du temps",
    explication: "Un diagramme en lignes brisées relie chronologiquement les valeurs successives d'une série, ce qui permet de visualiser clairement son évolution dans le temps (tendance, saisonnalité...)."
  },

  {
    question: "Sur ce graphique en lignes brisées, entre quels mois observe-t-on la valeur maximale de la grandeur représentée ?",
    graphique: "img/q7.png",
    options: [
      "Autour du mois de juillet (mois 7)",
      "Autour du mois de janvier (mois 1)",
      "Autour du mois de décembre (mois 12)",
      "La valeur maximale n'est pas identifiable sur ce type de graphique"
    ],
    bonne_reponse: "Autour du mois de juillet (mois 7)",
    explication: "La lecture du graphique montre que le point le plus haut de la courbe se situe autour du 7ᵉ mois, correspondant à la valeur maximale de la série sur l'année."
  },

  {
    question: "Quelle différence fondamentale existe-t-il entre un diagramme en barres et un histogramme ?",
    options: [
      "L'histogramme représente une série quantitative continue regroupée en classes, alors que le diagramme en barres représente généralement une série qualitative ou discrète",
      "Ils représentent exactement la même chose sans aucune différence",
      "Le diagramme en barres ne peut représenter que des pourcentages",
      "L'histogramme ne peut jamais comporter plus de deux classes"
    ],
    bonne_reponse: "L'histogramme représente une série quantitative continue regroupée en classes, alors que le diagramme en barres représente généralement une série qualitative ou discrète",
    explication: "L'histogramme est réservé aux séries quantitatives continues regroupées en classes (les rectangles sont jointifs), tandis que le diagramme en barres représente typiquement des catégories qualitatives ou des valeurs discrètes (les barres sont séparées)."
  },

  {
    question: "Pourquoi choisir judicieusement le nombre de classes lors du regroupement d'une série statistique est-il important ?",
    options: [
      "Trop peu de classes fait perdre de l'information, trop de classes rend la lecture peu synthétique",
      "Le nombre de classes n'a aucune importance sur la lecture des données",
      "Il faut toujours choisir exactement 10 classes, quelle que soit la série",
      "Le choix du nombre de classes est imposé par la loi"
    ],
    bonne_reponse: "Trop peu de classes fait perdre de l'information, trop de classes rend la lecture peu synthétique",
    explication: "Le choix du nombre de classes est un compromis : un nombre trop faible masque la répartition réelle des données, un nombre trop élevé nuit à la lisibilité synthétique recherchée par le regroupement."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
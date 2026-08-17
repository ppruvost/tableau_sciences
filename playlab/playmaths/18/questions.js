/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce nuage de points, une droite d'ajustement affine a été tracée. Comment détermine-t-on son équation par la méthode des moindres carrés ?",
    graphique: "img/q1.png",
    options: [
      "En minimisant la somme des carrés des écarts entre les points du nuage et la droite",
      "En reliant simplement deux points extrêmes du nuage",
      "En traçant une droite parallèle à l'axe des ordonnées",
      "La méthode des moindres carrés ne s'applique pas à un nuage de points"
    ],
    bonne_reponse: "En minimisant la somme des carrés des écarts entre les points du nuage et la droite",
    explication: "La droite d'ajustement affine obtenue par la méthode des moindres carrés est celle qui minimise la somme des carrés des écarts verticaux entre chaque point du nuage et la droite."
  },

  {
    question: "Que représente le coefficient de détermination R² d'un ajustement affine ?",
    options: [
      "Une mesure de la qualité de l'ajustement, proche de 1 lorsque le modèle affine décrit bien le nuage de points",
      "Le coefficient directeur de la droite d'ajustement",
      "La valeur moyenne de la série statistique",
      "Le nombre de points du nuage"
    ],
    bonne_reponse: "Une mesure de la qualité de l'ajustement, proche de 1 lorsque le modèle affine décrit bien le nuage de points",
    explication: "Le coefficient de détermination R² évalue la pertinence de l'ajustement affine choisi : plus il est proche de 1, mieux la droite décrit la tendance du nuage de points."
  },

  {
    question: "Sur ce même graphique, on utilise la droite d'ajustement pour estimer une valeur de y en x = 11, au-delà du nuage de points observé. Comment appelle-t-on cette estimation ?",
    graphique: "img/q1.png",
    options: [
      "Une extrapolation",
      "Une interpolation",
      "Une régression logarithmique",
      "Un dénombrement"
    ],
    bonne_reponse: "Une extrapolation",
    explication: "Estimer une valeur en dehors de l'intervalle des données observées, à l'aide du modèle d'ajustement, s'appelle une extrapolation ; estimer une valeur à l'intérieur de cet intervalle s'appelle une interpolation."
  },

  {
    question: "Quelle est la différence entre interpoler et extrapoler une valeur à partir d'un ajustement affine ?",
    options: [
      "Interpoler estime une valeur à l'intérieur de l'intervalle des données observées, extrapoler à l'extérieur de cet intervalle",
      "Interpoler et extrapoler désignent exactement la même opération",
      "Extrapoler est toujours plus fiable qu'interpoler",
      "Interpoler ne peut se faire qu'avec des données qualitatives"
    ],
    bonne_reponse: "Interpoler estime une valeur à l'intérieur de l'intervalle des données observées, extrapoler à l'extérieur de cet intervalle",
    explication: "L'interpolation reste dans le domaine des données observées et est généralement fiable, alors que l'extrapolation, en dehors de ce domaine, est plus risquée car rien ne garantit que le modèle reste valable."
  },

  {
    question: "Ce tableau croisé d'effectifs présente la répartition d'élèves selon leur genre et leur filière. Combien d'élèves au total sont en filière Sciences ?",
    graphique: "img/q6.png",
    options: [
      "40",
      "43",
      "37",
      "80"
    ],
    bonne_reponse: "40",
    explication: "On lit directement dans la ligne « Sciences » du tableau croisé : 18 + 22 = 40 élèves au total."
  },

  {
    question: "À partir de ce tableau croisé, quelle est la probabilité qu'un élève choisi au hasard soit une fille ?",
    graphique: "img/q6.png",
    options: [
      "43/80",
      "18/80",
      "40/80",
      "25/80"
    ],
    bonne_reponse: "43/80",
    explication: "Il y a 43 filles sur un total de 80 élèves, donc P(fille) = 43/80."
  },

  {
    question: "Comment calcule-t-on, à partir d'un tableau croisé d'effectifs, la probabilité conditionnelle P_Sciences(Fille), c'est-à-dire la probabilité qu'un élève soit une fille sachant qu'il est en filière Sciences ?",
    graphique: "img/q6.png",
    options: [
      "En divisant l'effectif des filles en Sciences par l'effectif total de la filière Sciences (18/40)",
      "En divisant l'effectif des filles en Sciences par l'effectif total des filles (18/43)",
      "En divisant l'effectif total par l'effectif des filles en Sciences",
      "La probabilité conditionnelle ne peut pas être calculée à partir d'un tableau croisé"
    ],
    bonne_reponse: "En divisant l'effectif des filles en Sciences par l'effectif total de la filière Sciences (18/40)",
    explication: "La probabilité conditionnelle P_Sciences(Fille) se calcule en restreignant l'univers à la filière Sciences (l'événement conditionnant) : on divise l'effectif des filles en Sciences par l'effectif total de la filière Sciences, soit 18/40."
  },

  {
    question: "Quelle est la relation générale entre la probabilité conditionnelle P_A(B), P(A∩B) et P(A) ?",
    options: [
      "P_A(B) = P(A∩B) / P(A)",
      "P_A(B) = P(A∩B) × P(A)",
      "P_A(B) = P(A) / P(A∩B)",
      "P_A(B) = P(A) + P(B)"
    ],
    bonne_reponse: "P_A(B) = P(A∩B) / P(A)",
    explication: "La probabilité conditionnelle de B sachant A est définie par P_A(B) = P(A∩B) / P(A), avec P(A) non nul."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
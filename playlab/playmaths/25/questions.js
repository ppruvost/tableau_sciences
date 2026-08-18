/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES S04  ============
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
    explication: "Estimer une valeur en dehors de l'intervalle des données observées, à l'aide du modèle d'ajustement, s'appelle une extrapolation."
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
    question: "Pourquoi une extrapolation est-elle généralement moins fiable qu'une interpolation ?",
    options: [
      "Parce que rien ne garantit que la tendance observée sur le nuage de points se poursuive au-delà des données mesurées",
      "Parce que l'extrapolation utilise une formule mathématique différente de l'interpolation",
      "Parce que l'interpolation est toujours fausse par nature",
      "Il n'existe en réalité aucune différence de fiabilité entre les deux"
    ],
    bonne_reponse: "Parce que rien ne garantit que la tendance observée sur le nuage de points se poursuive au-delà des données mesurées",
    explication: "En dehors de l'intervalle des données observées, aucune garantie n'existe que le phénomène étudié continue de suivre le même modèle : l'extrapolation comporte donc un risque d'erreur plus important que l'interpolation."
  },

  {
    question: "Ce nuage de points suit une évolution non affine, ajustée ici par une courbe logarithmique. Pourquoi choisit-on ce type de modèle plutôt qu'une droite ?",
    graphique: "img/q9.png",
    options: [
      "Parce que la forme du nuage de points suggère une évolution qui ralentit, mieux décrite par un modèle logarithmique qu'affine",
      "Parce qu'un ajustement affine est toujours faux",
      "Parce qu'un modèle logarithmique est toujours plus simple qu'une droite",
      "Le choix du modèle ne dépend jamais de la forme du nuage"
    ],
    bonne_reponse: "Parce que la forme du nuage de points suggère une évolution qui ralentit, mieux décrite par un modèle logarithmique qu'affine",
    explication: "Lorsque le nuage de points présente une croissance qui ralentit progressivement, un modèle logarithmique décrit souvent mieux la tendance qu'une simple droite."
  },

  {
    question: "Comment peut-on se ramener à un ajustement affine pour étudier un nuage de points suivant une évolution exponentielle y = k×qˣ ?",
    options: [
      "En effectuant le changement de variable z = ln(y), qui rend la relation entre x et z affine",
      "En multipliant simplement toutes les valeurs de y par x",
      "Ce type de nuage ne peut jamais être étudié",
      "En ajoutant une constante arbitraire à chaque valeur de y"
    ],
    bonne_reponse: "En effectuant le changement de variable z = ln(y), qui rend la relation entre x et z affine",
    explication: "Si y = k×qˣ, alors ln(y) = ln(k) + x×ln(q), ce qui est une relation affine entre x et z = ln(y) : on peut donc ajuster ce nouveau nuage de points (x ; z) par une droite."
  },

  {
    question: "Quel outil numérique permet de choisir et exploiter un modèle d'ajustement non affine adapté à un nuage de points ?",
    options: [
      "Un tableur ou une calculatrice proposant plusieurs types de régression (affine, exponentielle, logarithmique, puissance...)",
      "Uniquement une règle et un crayon",
      "Un dictionnaire papier",
      "Aucun outil numérique ne permet ce type d'ajustement"
    ],
    bonne_reponse: "Un tableur ou une calculatrice proposant plusieurs types de régression (affine, exponentielle, logarithmique, puissance...)",
    explication: "Les tableurs et calculatrices modernes proposent plusieurs types de régression, ce qui permet de comparer différents modèles d'ajustement et de choisir celui qui décrit le mieux le nuage de points observé."
  },

  {
    question: "Comment compare-t-on objectivement plusieurs modèles d'ajustement (affine, exponentiel, logarithmique) pour un même nuage de points ?",
    options: [
      "En comparant leur coefficient de détermination R² : le modèle avec le R² le plus proche de 1 est généralement le plus pertinent",
      "En choisissant systématiquement le modèle affine, quel que soit le nuage",
      "En choisissant le modèle au hasard",
      "Il est impossible de comparer objectivement plusieurs modèles"
    ],
    bonne_reponse: "En comparant leur coefficient de détermination R² : le modèle avec le R² le plus proche de 1 est généralement le plus pertinent",
    explication: "Le coefficient de détermination R² permet de comparer objectivement la qualité de différents modèles d'ajustement testés sur un même nuage de points, le modèle le plus adapté étant celui dont le R² est le plus proche de 1."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
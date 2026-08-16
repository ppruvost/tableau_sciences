/* ============================================================
   ============  QUIZ PLAYSCIENCES — GEOMETRIE TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Dans un repère orthonormé de l'espace, un vecteur u a pour coordonnées (2 ; 3 ; 1), comme sur ce schéma. Comment calcule-t-on sa norme ?",
    graphique: "img/q1.png",
    options: [
      "‖u‖ = √(x² + y² + z²)",
      "‖u‖ = x + y + z",
      "‖u‖ = x × y × z",
      "‖u‖ = √(x + y + z)"
    ],
    bonne_reponse: "‖u‖ = √(x² + y² + z²)",
    explication: "Dans l'espace, la norme d'un vecteur de coordonnées (x ; y ; z) se calcule par ‖u‖ = √(x²+y²+z²), généralisation directe de la formule du plan."
  },

  {
    question: "Quelle est la norme du vecteur u(2 ; 3 ; 1) ?",
    options: [
      "√14",
      "6",
      "√6",
      "14"
    ],
    bonne_reponse: "√14",
    explication: "‖u‖ = √(2²+3²+1²) = √(4+9+1) = √14."
  },

  {
    question: "Comment calcule-t-on les coordonnées de la somme de deux vecteurs u(x1 ; y1 ; z1) et v(x2 ; y2 ; z2) dans l'espace ?",
    options: [
      "u+v a pour coordonnées (x1+x2 ; y1+y2 ; z1+z2)",
      "u+v a pour coordonnées (x1×x2 ; y1×y2 ; z1×z2)",
      "u+v a pour coordonnées (x1−x2 ; y1−y2 ; z1−z2)",
      "La somme de deux vecteurs de l'espace n'est pas définie"
    ],
    bonne_reponse: "u+v a pour coordonnées (x1+x2 ; y1+y2 ; z1+z2)",
    explication: "Comme dans le plan, les coordonnées de la somme de deux vecteurs de l'espace s'obtiennent en additionnant leurs coordonnées respectives."
  },

  {
    question: "Deux vecteurs de l'espace u et v sont colinéaires si :",
    options: [
      "Il existe un réel k tel que u = k × v",
      "Ils ont nécessairement la même norme",
      "Ils sont nécessairement orthogonaux",
      "Ils appartiennent nécessairement à des plans différents"
    ],
    bonne_reponse: "Il existe un réel k tel que u = k × v",
    explication: "La définition de la colinéarité de deux vecteurs, dans l'espace comme dans le plan, repose sur l'existence d'un réel k tel que l'un soit un multiple scalaire de l'autre."
  },

  {
    question: "Dans un repère orthonormé de l'espace, comment calcule-t-on les coordonnées d'un point M, connaissant un point A et un vecteur AM ?",
    options: [
      "Les coordonnées de M s'obtiennent en ajoutant celles du vecteur AM à celles de A",
      "Les coordonnées de M sont indépendantes de celles de A",
      "Les coordonnées de M sont toujours (0 ; 0 ; 0)",
      "On ne peut pas déterminer les coordonnées de M dans l'espace"
    ],
    bonne_reponse: "Les coordonnées de M s'obtiennent en ajoutant celles du vecteur AM à celles de A",
    explication: "Si A(xA ; yA ; zA) et AM(x ; y ; z), alors M a pour coordonnées (xA+x ; yA+y ; zA+z), généralisation directe de la relation utilisée dans le plan."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
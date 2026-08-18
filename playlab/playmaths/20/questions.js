/* ============================================================
   ============  QUIZ PLAYSCIENCES — GEOMETRIE G03  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce schéma représente un vecteur AB. Que faut-il préciser pour caractériser complètement un vecteur ?",
    graphique: "img/q1.png",
    options: [
      "Sa direction, son sens et sa norme (longueur)",
      "Uniquement sa longueur",
      "Uniquement son point de départ",
      "Uniquement sa couleur sur le schéma"
    ],
    bonne_reponse: "Sa direction, son sens et sa norme (longueur)",
    explication: "Un vecteur est caractérisé par trois éléments : sa direction, son sens et sa norme (longueur) ; deux vecteurs sont égaux s'ils ont ces trois éléments identiques."
  },

  {
    question: "Comment reconnaît-on que deux vecteurs sont égaux ?",
    options: [
      "Ils ont la même direction, le même sens et la même norme",
      "Ils ont uniquement la même norme",
      "Ils partent obligatoirement du même point",
      "Il suffit qu'ils aient la même direction"
    ],
    bonne_reponse: "Ils ont la même direction, le même sens et la même norme",
    explication: "Deux vecteurs sont égaux s'ils ont exactement la même direction, le même sens et la même norme, quel que soit leur point d'application."
  },

  {
    question: "Deux vecteurs AB et CD sont dits colinéaires si :",
    options: [
      "Ils ont la même direction (l'un est un multiple de l'autre)",
      "Ils ont nécessairement la même norme",
      "Ils ont nécessairement le même sens",
      "Ils sont nécessairement égaux"
    ],
    bonne_reponse: "Ils ont la même direction (l'un est un multiple de l'autre)",
    explication: "Deux vecteurs non nuls sont colinéaires s'ils ont la même direction, c'est-à-dire s'il existe un réel k tel que l'un soit égal à k fois l'autre."
  },

  {
    question: "Dans un repère orthogonal, un vecteur u a pour coordonnées (3 ; 4). Quelle est sa norme ?",
    options: [
      "5",
      "7",
      "12",
      "25"
    ],
    bonne_reponse: "5",
    explication: "La norme d'un vecteur de coordonnées (x ; y) est √(x²+y²) = √(9+16) = √25 = 5."
  },

  {
    question: "Comment calcule-t-on les coordonnées de la somme de deux vecteurs u(x1 ; y1) et v(x2 ; y2) dans le plan ?",
    options: [
      "u+v a pour coordonnées (x1+x2 ; y1+y2)",
      "u+v a pour coordonnées (x1×x2 ; y1×y2)",
      "u+v a pour coordonnées (x1−x2 ; y1−y2)",
      "La somme de deux vecteurs n'est pas définie"
    ],
    bonne_reponse: "u+v a pour coordonnées (x1+x2 ; y1+y2)",
    explication: "Les coordonnées de la somme de deux vecteurs s'obtiennent en additionnant leurs coordonnées respectives."
  },

  {
    question: "Comment calcule-t-on le produit d'un vecteur u(x ; y) par un réel k ?",
    options: [
      "k×u a pour coordonnées (k×x ; k×y)",
      "k×u a pour coordonnées (k+x ; k+y)",
      "k×u a pour coordonnées (x/k ; y/k)",
      "Le produit d'un vecteur par un réel n'est pas défini"
    ],
    bonne_reponse: "k×u a pour coordonnées (k×x ; k×y)",
    explication: "Multiplier un vecteur par un réel k revient à multiplier chacune de ses coordonnées par k."
  },

  {
    question: "Dans un repère orthonormé de l'espace, un vecteur u a pour coordonnées (2 ; 3 ; 1), comme sur ce schéma. Comment calcule-t-on sa norme ?",
    graphique: "img/q9.png",
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
    question: "Quelle est la norme du vecteur u(2 ; 3 ; 1) représenté ci-dessus ?",
    graphique: "img/q9.png",
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
    question: "Comment calcule-t-on les coordonnées de la somme de deux vecteurs de l'espace u(x1 ; y1 ; z1) et v(x2 ; y2 ; z2) ?",
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

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
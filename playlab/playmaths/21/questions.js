/* ============================================================
   ============  QUIZ PLAYSCIENCES — GEOMETRIE G04  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce cercle trigonométrique, un point M est associé à un angle de 60°. Combien de radians cela représente-t-il ?",
    graphique: "img/q1.png",
    options: [
      "π/3",
      "π/6",
      "π/2",
      "2π"
    ],
    bonne_reponse: "π/3",
    explication: "La conversion degrés-radians suit la règle de proportionnalité 180° = π rad, donc 60° = 60×π/180 = π/3 radians."
  },

  {
    question: "Combien de radians correspond un tour complet du cercle trigonométrique ?",
    options: [
      "2π radians",
      "π radians",
      "π/2 radians",
      "360 radians"
    ],
    bonne_reponse: "2π radians",
    explication: "Un tour complet du cercle trigonométrique correspond à 360°, soit 2π radians."
  },

  {
    question: "Quelles sont les valeurs de cos(π/2) et sin(π/2) ?",
    options: [
      "cos(π/2) = 0 et sin(π/2) = 1",
      "cos(π/2) = 1 et sin(π/2) = 0",
      "cos(π/2) = 1 et sin(π/2) = 1",
      "cos(π/2) = 0 et sin(π/2) = 0"
    ],
    bonne_reponse: "cos(π/2) = 0 et sin(π/2) = 1",
    explication: "Au point du cercle trigonométrique associé à l'angle π/2 (90°), l'abscisse (cosinus) vaut 0 et l'ordonnée (sinus) vaut 1."
  },

  {
    question: "Sur le cercle trigonométrique, à quoi correspond géométriquement le cosinus d'un angle ?",
    options: [
      "L'abscisse du point associé à cet angle sur le cercle",
      "L'ordonnée du point associé à cet angle sur le cercle",
      "Le rayon du cercle",
      "La longueur de l'arc associé à cet angle"
    ],
    bonne_reponse: "L'abscisse du point associé à cet angle sur le cercle",
    explication: "Sur le cercle trigonométrique de rayon 1, le cosinus d'un angle correspond à l'abscisse du point M associé à cet angle, tandis que le sinus correspond à son ordonnée."
  },

  {
    question: "Quelle relation fondamentale relie le cosinus et le sinus d'un même angle x ?",
    options: [
      "cos²(x) + sin²(x) = 1",
      "cos(x) + sin(x) = 1",
      "cos(x) × sin(x) = 1",
      "cos(x) − sin(x) = 1"
    ],
    bonne_reponse: "cos²(x) + sin²(x) = 1",
    explication: "Cette relation, dite identité trigonométrique fondamentale, découle directement du théorème de Pythagore appliqué au cercle trigonométrique de rayon 1."
  },

  {
    question: "Quel est le signe du sinus d'un angle appartenant à l'intervalle ]π ; 2π[ (troisième et quatrième quadrants du cercle trigonométrique) ?",
    options: [
      "Négatif",
      "Positif",
      "Toujours nul",
      "Cela dépend uniquement du cosinus"
    ],
    bonne_reponse: "Négatif",
    explication: "Sur le cercle trigonométrique, le sinus (ordonnée du point M) est négatif pour les angles compris entre π et 2π, correspondant à la moitié inférieure du cercle."
  },

  {
    question: "Sur ce graphique représentant les fonctions sinus et cosinus, quelle est la période commune de ces deux fonctions ?",
    graphique: "img/q7.png",
    options: [
      "2π",
      "π",
      "π/2",
      "4π"
    ],
    bonne_reponse: "2π",
    explication: "Les fonctions sinus et cosinus sont périodiques de période 2π : leur courbe se répète identique à elle-même tous les 2π sur l'axe des abscisses."
  },

  {
    question: "Comment obtient-on la représentation graphique de la fonction cosinus à partir de celle de la fonction sinus ?",
    options: [
      "Par une translation de la courbe de la fonction sinus",
      "Par une symétrie centrale par rapport à l'origine",
      "Les deux courbes sont rigoureusement identiques, sans aucune transformation",
      "Il n'existe aucun lien graphique entre les deux fonctions"
    ],
    bonne_reponse: "Par une translation de la courbe de la fonction sinus",
    explication: "La courbe de la fonction cosinus s'obtient à partir de celle de la fonction sinus par une translation horizontale (de vecteur -π/2 selon l'axe des abscisses), puisque cos(x) = sin(x + π/2)."
  },

  {
    question: "Quelles sont les valeurs maximale et minimale que peuvent prendre les fonctions sinus et cosinus ?",
    options: [
      "Un maximum de 1 et un minimum de −1",
      "Un maximum de 2π et un minimum de 0",
      "Un maximum de π et un minimum de −π",
      "Elles ne sont pas bornées"
    ],
    bonne_reponse: "Un maximum de 1 et un minimum de −1",
    explication: "Les fonctions sinus et cosinus sont toujours comprises entre −1 et 1, ces deux valeurs correspondant aux extrémités du cercle trigonométrique de rayon 1."
  },

  {
    question: "À quoi correspond concrètement un angle négatif sur le cercle trigonométrique ?",
    options: [
      "Un déplacement dans le sens horaire (sens des aiguilles d'une montre) à partir de l'axe des abscisses",
      "Un déplacement toujours dans le sens antihoraire",
      "Un angle qui n'existe pas mathématiquement",
      "Un angle strictement supérieur à 2π"
    ],
    bonne_reponse: "Un déplacement dans le sens horaire (sens des aiguilles d'une montre) à partir de l'axe des abscisses",
    explication: "Sur le cercle trigonométrique, les angles positifs sont mesurés dans le sens antihoraire (sens trigonométrique direct) et les angles négatifs dans le sens horaire."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
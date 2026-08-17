/* ============================================================
   ============  QUIZ PLAYSCIENCES — GEOMETRIE 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur cette représentation d'un pavé droit, quel logiciel permet de la construire et de la faire pivoter pour l'observer sous différents angles ?",
    graphique: "img/q1.png",
    options: [
      "Un logiciel de géométrie dynamique (comme GeoGebra 3D)",
      "Un tableur uniquement",
      "Un logiciel de traitement de texte",
      "Cela ne peut se faire qu'à la main, sans logiciel"
    ],
    bonne_reponse: "Un logiciel de géométrie dynamique (comme GeoGebra 3D)",
    explication: "Un logiciel de géométrie dynamique en 3D permet de représenter un solide usuel et de le manipuler (rotation, zoom) pour mieux visualiser sa structure spatiale."
  },

  {
    question: "Comment exploite-t-on la représentation d'un assemblage de solides usuels pour en calculer le volume total ?",
    options: [
      "En identifiant chaque solide usuel composant l'assemblage, puis en additionnant ou soustrayant leurs volumes respectifs",
      "En mesurant uniquement la hauteur totale de l'assemblage",
      "En ignorant les solides internes non visibles",
      "Le volume d'un assemblage ne peut jamais être calculé"
    ],
    bonne_reponse: "En identifiant chaque solide usuel composant l'assemblage, puis en additionnant ou soustrayant leurs volumes respectifs",
    explication: "Pour calculer le volume d'un assemblage de solides usuels, on décompose la figure en solides simples dont on connaît les formules de volume, puis on additionne ou soustrait ces volumes selon la construction."
  },

  {
    question: "Sur ce cube dont on réalise la section par un plan horizontal, quelle est la forme de la section obtenue ?",
    graphique: "img/q3.png",
    options: [
      "Un carré (ou un rectangle), parallèle à la face du cube",
      "Un cercle",
      "Un triangle",
      "La section n'a jamais de forme définie"
    ],
    bonne_reponse: "Un carré (ou un rectangle), parallèle à la face du cube",
    explication: "La section d'un cube par un plan parallèle à l'une de ses faces est un carré (de mêmes dimensions que la face si le plan est situé à l'intérieur du cube)."
  },

  {
    question: "Comment construit-on la section plane d'un solide passant par des points donnés situés sur ses arêtes ?",
    options: [
      "En reliant les points situés sur des faces communes du solide, en respectant le parallélisme des faces opposées",
      "En reliant les points au hasard, sans règle particulière",
      "En ignorant les faces du solide",
      "La section ne peut être construite qu'en 2D, jamais en 3D"
    ],
    bonne_reponse: "En reliant les points situés sur des faces communes du solide, en respectant le parallélisme des faces opposées",
    explication: "Construire une section plane consiste à relier progressivement les points donnés situés sur les arêtes, en utilisant notamment la propriété que les traces du plan sécant sur deux faces parallèles sont elles-mêmes parallèles."
  },

  {
    question: "Ce schéma représente un vecteur AB. Que faut-il préciser pour caractériser complètement un vecteur ?",
    graphique: "img/q5.png",
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
    question: "Sur ce cercle trigonométrique, un point M est associé à un angle de 60°. Combien de radians cela représente-t-il ?",
    graphique: "img/q8.png",
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

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
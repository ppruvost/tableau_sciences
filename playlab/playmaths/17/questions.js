/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME AL05  ============
   ============================================================ */

window.questions = [

  {
    question: "Quels nombres entiers (a, b, c) forment un triplet pythagoricien ?",
    options: [
      "Des entiers vérifiant a² + b² = c²",
      "Des entiers vérifiant a + b = c",
      "Des entiers premiers entre eux uniquement",
      "Des entiers consécutifs"
    ],
    bonne_reponse: "Des entiers vérifiant a² + b² = c²",
    explication: "Un triplet pythagoricien est un triplet d'entiers naturels (a, b, c) vérifiant l'égalité du théorème de Pythagore a² + b² = c², comme (3, 4, 5)."
  },

  {
    question: "Sur ce triangle rectangle de côtés 3 et 4, l'hypoténuse mesure 5. Comment un programme Python peut-il vérifier que (3, 4, 5) est bien un triplet pythagoricien ?",
    graphique: "img/q1.png",
    options: [
      "En testant si 3**2 + 4**2 == 5**2",
      "En testant si 3 + 4 == 5",
      "En testant si 3 * 4 == 5",
      "En testant si 3 == 4"
    ],
    bonne_reponse: "En testant si 3**2 + 4**2 == 5**2",
    explication: "Vérifier un triplet pythagoricien revient à tester par programme l'égalité a²+b²=c², soit ici 3**2 + 4**2 == 5**2, qui est vraie (9+16=25)."
  },

  {
    question: "Comment un programme peut-il rechercher automatiquement tous les triplets pythagoriciens dont les côtés sont inférieurs à une valeur maximale donnée ?",
    options: [
      "En testant, à l'aide de boucles imbriquées, toutes les combinaisons possibles de a, b, c et en conservant celles qui vérifient a²+b²=c²",
      "En devinant les triplets un par un, sans méthode systématique",
      "Cette recherche est impossible à programmer",
      "En ne testant qu'une seule combinaison de valeurs"
    ],
    bonne_reponse: "En testant, à l'aide de boucles imbriquées, toutes les combinaisons possibles de a, b, c et en conservant celles qui vérifient a²+b²=c²",
    explication: "Une recherche exhaustive de triplets pythagoriciens utilise des boucles imbriquées qui parcourent toutes les valeurs possibles de a, b et c jusqu'à une borne donnée, en ne conservant que celles vérifiant la relation de Pythagore."
  },

  {
    question: "Ce schéma représente un carré et un disque. Un programme calcule leurs aires. Quelle formule utilise-t-il pour l'aire du disque de rayon r ?",
    graphique: "img/q4.png",
    options: [
      "Aire = π × r²",
      "Aire = 2 × π × r",
      "Aire = π × r",
      "Aire = r²"
    ],
    bonne_reponse: "Aire = π × r²",
    explication: "L'aire d'un disque de rayon r est donnée par la formule π × r², directement traduisible dans un programme utilisant le module math de Python (math.pi)."
  },

  {
    question: "Comment un programme Python utilise-t-il la proportionnalité pour convertir une longueur mesurée sur un plan à l'échelle 1/100 en longueur réelle ?",
    options: [
      "En multipliant la longueur mesurée par 100",
      "En divisant la longueur mesurée par 100",
      "En ajoutant 100 à la longueur mesurée",
      "La proportionnalité ne s'applique pas à un plan à l'échelle"
    ],
    bonne_reponse: "En multipliant la longueur mesurée par 100",
    explication: "Une échelle 1/100 signifie que 1 unité sur le plan représente 100 unités dans la réalité : on multiplie donc la longueur mesurée sur le plan par 100 pour obtenir la longueur réelle."
  },

  {
    question: "Quel est l'intérêt d'utiliser un logiciel de géométrie dynamique (comme GeoGebra) pour construire une figure ?",
    options: [
      "Il permet de construire une figure précise et de faire varier ses paramètres tout en conservant les propriétés géométriques imposées",
      "Il ne sert qu'à colorier des figures déjà existantes",
      "Il remplace totalement le raisonnement géométrique, sans apport pédagogique",
      "Il ne permet de construire que des triangles"
    ],
    bonne_reponse: "Il permet de construire une figure précise et de faire varier ses paramètres tout en conservant les propriétés géométriques imposées",
    explication: "Un logiciel de géométrie dynamique permet de construire une figure respectant des contraintes géométriques précises, et d'observer comment elle évolue lorsqu'on déplace certains éléments, tout en conservant les propriétés imposées à la construction."
  },

  {
    question: "Comment construit-on, avec un logiciel de géométrie dynamique, un triangle rectangle dont l'hypoténuse a une longueur fixée à l'avance ?",
    options: [
      "En utilisant un cercle de diamètre l'hypoténuse : tout point de ce cercle (hors extrémités) forme un triangle rectangle avec les extrémités du diamètre",
      "En traçant trois segments de longueurs quelconques au hasard",
      "Ce type de construction est impossible avec un logiciel de géométrie dynamique",
      "En ne traçant qu'un seul côté du triangle"
    ],
    bonne_reponse: "En utilisant un cercle de diamètre l'hypoténuse : tout point de ce cercle (hors extrémités) forme un triangle rectangle avec les extrémités du diamètre",
    explication: "Cette construction repose sur la propriété selon laquelle un triangle inscrit dans un cercle, dont un côté est un diamètre, est nécessairement rectangle en son troisième sommet (réciproque du théorème de l'angle inscrit)."
  },

  {
    question: "Comment calcule-t-on le volume d'un solide composé d'un pavé droit et d'une pyramide à l'aide d'un programme Python ?",
    options: [
      "En calculant séparément le volume de chaque solide usuel puis en les additionnant",
      "En multipliant les deux volumes entre eux",
      "En ne calculant que le volume du plus grand des deux solides",
      "Le volume d'un solide composé ne peut pas être calculé par un programme"
    ],
    bonne_reponse: "En calculant séparément le volume de chaque solide usuel puis en les additionnant",
    explication: "Un programme calcule le volume d'un solide composé en appliquant séparément la formule de volume de chaque solide usuel qui le compose, puis en additionnant (ou soustrayant, selon les cas) ces résultats."
  },

  {
    question: "Quelle bibliothèque Python fournit la constante mathématique π nécessaire aux calculs d'aires et de volumes de solides comportant des cercles ?",
    options: [
      "Le module math (math.pi)",
      "Le module random",
      "Le module time",
      "Aucune bibliothèque Python ne fournit π"
    ],
    bonne_reponse: "Le module math (math.pi)",
    explication: "Le module standard math de Python fournit la constante math.pi, valeur approchée du nombre π utile pour tout calcul géométrique impliquant des cercles, disques ou solides de révolution."
  },

  {
    question: "Comment un programme peut-il vérifier automatiquement le théorème de Thalès sur une configuration donnée, à partir de longueurs mesurées ?",
    options: [
      "En comparant numériquement les rapports de longueurs correspondants pour vérifier leur égalité (à une tolérance de calcul près)",
      "En vérifiant uniquement que les longueurs sont positives",
      "Le théorème de Thalès ne peut pas être vérifié par un programme",
      "En comparant uniquement les couleurs des segments"
    ],
    bonne_reponse: "En comparant numériquement les rapports de longueurs correspondants pour vérifier leur égalité (à une tolérance de calcul près)",
    explication: "Un programme peut vérifier le théorème de Thalès en calculant les rapports de longueurs correspondants (AM/AB, AN/AC, MN/BC) et en comparant leur égalité numériquement, avec une tolérance pour tenir compte des erreurs d'arrondi."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME AL03  ============
   ============================================================ */

window.questions = [

  {
    question: "Comment calcule-t-on, en Python, le terme de rang n d'une suite arithmétique de premier terme u0 et de raison r, à l'aide d'une boucle ?",
    options: [
      "En ajoutant r à u0 à chaque tour de boucle, n fois de suite",
      "En multipliant u0 par r à chaque tour de boucle",
      "En ne faisant aucun calcul, juste u0",
      "En divisant u0 par r à chaque tour"
    ],
    bonne_reponse: "En ajoutant r à u0 à chaque tour de boucle, n fois de suite",
    explication: "Une suite arithmétique se calcule par récurrence en ajoutant la raison r au terme précédent à chaque itération de la boucle."
  },

  {
    question: "Une suite arithmétique est définie par récurrence en Python avec une boucle for. Comment calcule-t-on la somme de ses n premiers termes dans le programme ?",
    options: [
      "En accumulant chaque terme calculé dans une variable somme, initialisée à 0 avant la boucle",
      "En multipliant uniquement le premier et le dernier terme",
      "En ignorant les termes intermédiaires",
      "La somme ne peut pas être calculée par une boucle"
    ],
    bonne_reponse: "En accumulant chaque terme calculé dans une variable somme, initialisée à 0 avant la boucle",
    explication: "Pour calculer une somme avec une boucle, on initialise une variable accumulateur à 0, puis on lui ajoute chaque terme de la suite au fur et à mesure de la boucle."
  },

  {
    question: "Sur ce graphique représentant une suite (uₙ) arithmétique croissante, comment détermine-t-on par programme le rang à partir duquel les termes dépassent le seuil indiqué ?",
    graphique: "img/q3.png",
    options: [
      "Avec une boucle while qui incrémente n tant que uₙ reste inférieur au seuil",
      "Avec une seule instruction, sans boucle",
      "En calculant uniquement u₀",
      "Cela ne peut pas être déterminé par un programme"
    ],
    bonne_reponse: "Avec une boucle while qui incrémente n tant que uₙ reste inférieur au seuil",
    explication: "Une boucle while permet de répéter le calcul du terme suivant et d'incrémenter le rang n tant que la condition (uₙ inférieur au seuil) reste vraie, jusqu'à trouver le premier rang qui dépasse le seuil."
  },

  {
    question: "Quelle structure de contrôle Python est la plus adaptée pour rechercher le premier rang n vérifiant une condition inconnue à l'avance (comme dépasser un seuil) ?",
    options: [
      "Une boucle while",
      "Une boucle for avec un nombre d'itérations fixé à l'avance",
      "Une simple instruction if",
      "Une fonction sans aucune boucle"
    ],
    bonne_reponse: "Une boucle while",
    explication: "La boucle while est adaptée lorsque le nombre d'itérations nécessaires n'est pas connu à l'avance, contrairement à la boucle for, mieux adaptée à un nombre d'itérations fixé."
  },

  {
    question: "Comment calcule-t-on, en Python, le terme de rang n d'une suite géométrique de premier terme u0 et de raison q, à l'aide d'une boucle ?",
    options: [
      "En multipliant u0 par q à chaque tour de boucle, n fois de suite",
      "En additionnant q à u0 à chaque tour de boucle",
      "En ne faisant aucun calcul, juste u0",
      "En divisant u0 par q à chaque tour"
    ],
    bonne_reponse: "En multipliant u0 par q à chaque tour de boucle, n fois de suite",
    explication: "Une suite géométrique se calcule par récurrence en multipliant le terme précédent par la raison q à chaque itération de la boucle."
  },

  {
    question: "Comment calcule-t-on par programme la somme des n premiers termes d'une suite géométrique ?",
    options: [
      "En accumulant chaque terme calculé dans une variable somme au fil de la boucle, comme pour une suite arithmétique",
      "En utilisant uniquement le premier terme",
      "La somme d'une suite géométrique ne peut jamais être calculée par un programme",
      "En multipliant tous les termes entre eux"
    ],
    bonne_reponse: "En accumulant chaque terme calculé dans une variable somme au fil de la boucle, comme pour une suite arithmétique",
    explication: "Comme pour une suite arithmétique, on calcule la somme des termes d'une suite géométrique en accumulant chaque terme successif dans une variable initialisée à 0 avant la boucle."
  },

  {
    question: "Sur ce graphique représentant une suite géométrique croissante, comment détermine-t-on par un programme le rang à partir duquel les termes dépassent le seuil indiqué ?",
    graphique: "img/q8.png",
    options: [
      "Avec une boucle while qui multiplie le terme courant par la raison tant qu'il reste inférieur au seuil",
      "En calculant directement sans aucune boucle",
      "En multipliant le seuil par la raison une seule fois",
      "Cela ne peut pas être déterminé par un programme"
    ],
    bonne_reponse: "Avec une boucle while qui multiplie le terme courant par la raison tant qu'il reste inférieur au seuil",
    explication: "Comme pour une suite arithmétique, une boucle while permet de calculer successivement les termes et de s'arrêter dès que le terme dépasse le seuil fixé."
  },

  {
    question: "Comment un programme Python peut-il représenter graphiquement le nuage de points (n ; uₙ) d'une suite numérique ?",
    options: [
      "En utilisant une bibliothèque graphique (comme matplotlib) pour tracer chaque point de coordonnées (n ; uₙ)",
      "Un programme ne peut jamais tracer de graphique",
      "En affichant uniquement les valeurs sous forme de texte",
      "En traçant uniquement une droite, quelle que soit la suite"
    ],
    bonne_reponse: "En utilisant une bibliothèque graphique (comme matplotlib) pour tracer chaque point de coordonnées (n ; uₙ)",
    explication: "Une bibliothèque graphique comme matplotlib permet de tracer un nuage de points, chaque terme de la suite étant représenté par le point de coordonnées (n ; uₙ), pour visualiser son évolution."
  },

  {
    question: "Pourquoi représenter le nuage de points d'une suite numérique est-il utile pour conjecturer sa nature (arithmétique, géométrique, ou autre) ?",
    options: [
      "Parce que l'allure du nuage de points (aligné, exponentiel...) donne des indices visuels sur le type d'évolution de la suite",
      "Parce que cela ne donne aucune information sur la suite",
      "Parce que seule une lecture algébrique permet de connaître la nature d'une suite",
      "Le nuage de points n'a aucun intérêt pour l'étude d'une suite"
    ],
    bonne_reponse: "Parce que l'allure du nuage de points (aligné, exponentiel...) donne des indices visuels sur le type d'évolution de la suite",
    explication: "Un nuage de points aligné suggère une suite arithmétique, tandis qu'une allure exponentielle suggère une suite géométrique : cette lecture visuelle aide à formuler une conjecture avant de la démontrer par le calcul."
  },

  {
    question: "Comment détermine-t-on par balayage, à l'aide d'un programme, le seuil de rang n à partir duquel une suite dépasse une valeur donnée, sans connaître de formule explicite du terme général ?",
    options: [
      "En calculant successivement chaque terme de la suite par récurrence jusqu'à dépasser la valeur donnée",
      "En résolvant uniquement une équation algébrique, sans aucun calcul informatique",
      "Cette recherche n'est possible que si l'on connaît la formule explicite du terme général",
      "En devinant le rang au hasard"
    ],
    bonne_reponse: "En calculant successivement chaque terme de la suite par récurrence jusqu'à dépasser la valeur donnée",
    explication: "Même sans formule explicite du terme général, un programme peut calculer successivement chaque terme d'une suite définie par récurrence, jusqu'à ce qu'il dépasse la valeur cherchée, ce qui permet de déterminer le rang seuil par balayage."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
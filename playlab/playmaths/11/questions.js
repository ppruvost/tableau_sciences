/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME 2NDE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce graphique, on augmente progressivement la taille n de l'échantillon simulé. Que peut-on observer sur la fréquence observée ?",
    graphique: "img/q1.png",
    options: [
      "Elle se rapproche de plus en plus de la probabilité théorique lorsque n augmente",
      "Elle s'éloigne de plus en plus de la probabilité théorique",
      "Elle reste toujours identique quelle que soit n",
      "Elle devient nulle pour n grand"
    ],
    bonne_reponse: "Elle se rapproche de plus en plus de la probabilité théorique lorsque n augmente",
    explication: "C'est une version vulgarisée de la loi des grands nombres : lorsque n est grand, la fréquence observée se rapproche de la probabilité théorique de l'événement."
  },

  {
    question: "Pourquoi modifie-t-on une simulation donnée en augmentant la taille de l'échantillon ?",
    options: [
      "Pour observer que la fréquence se stabilise autour de la probabilité lorsque n devient grand",
      "Pour rendre le programme plus lent, sans autre intérêt",
      "Pour changer la nature de l'expérience aléatoire simulée",
      "Pour supprimer tout hasard de la simulation"
    ],
    bonne_reponse: "Pour observer que la fréquence se stabilise autour de la probabilité lorsque n devient grand",
    explication: "Modifier la taille de l'échantillon dans une simulation permet de mettre en évidence expérimentalement le phénomène de stabilisation de la fréquence autour de la probabilité théorique."
  },

  {
    question: "À quoi sert une simulation informatique fournie pour estimer une probabilité non triviale ?",
    options: [
      "À obtenir une estimation numérique de la probabilité par répétition d'un grand nombre d'essais, lorsque le calcul théorique est difficile",
      "À remplacer systématiquement tout calcul de probabilités",
      "À visualiser uniquement des graphiques sans lien avec les probabilités",
      "À calculer une moyenne arithmétique uniquement"
    ],
    bonne_reponse: "À obtenir une estimation numérique de la probabilité par répétition d'un grand nombre d'essais, lorsque le calcul théorique est difficile",
    explication: "Lorsque le calcul exact d'une probabilité est complexe, une simulation informatique permet d'en obtenir une estimation fiable en répétant un grand nombre de fois l'expérience aléatoire."
  },

  {
    question: "Ce graphique représente la fréquence de certaines lettres dans un texte. Comment une fonction Python peut-elle déterminer la fréquence d'une lettre dans un mot ?",
    graphique: "img/q4.png",
    options: [
      "En comptant le nombre d'occurrences de la lettre puis en divisant par la longueur totale du mot",
      "En multipliant le nombre de lettres par 100",
      "En ne comptant que la première occurrence de la lettre",
      "La fréquence d'une lettre ne peut pas être calculée par un programme"
    ],
    bonne_reponse: "En comptant le nombre d'occurrences de la lettre puis en divisant par la longueur totale du mot",
    explication: "Une fonction Python parcourt le mot, compte les occurrences de la lettre recherchée, puis divise ce nombre par la longueur totale du mot pour obtenir la fréquence."
  },

  {
    question: "Comment écrit-on une fonction Python pour simuler un lancer de dé équilibré à 6 faces ?",
    options: [
      "Avec la fonction randint(1, 6) du module random, qui renvoie un entier aléatoire entre 1 et 6",
      "Avec une boucle qui affiche toujours le nombre 6",
      "Avec une simple addition de deux nombres fixes",
      "Il est impossible de simuler un dé avec Python"
    ],
    bonne_reponse: "Avec la fonction randint(1, 6) du module random, qui renvoie un entier aléatoire entre 1 et 6",
    explication: "La fonction randint(1, 6) du module random de Python génère un entier aléatoire compris entre 1 et 6 inclus, simulant ainsi le lancer d'un dé équilibré."
  },

  {
    question: "En Python, comment définit-on une fonction f qui calcule l'image de x par f(x) = 2x + 3 ?",
    options: [
      "def f(x): return 2*x + 3",
      "def f(x): print(2*x + 3)",
      "f(x) = 2x + 3",
      "function f(x) = 2*x + 3"
    ],
    bonne_reponse: "def f(x): return 2*x + 3",
    explication: "En Python, une fonction se définit avec le mot-clé def, suivi de son nom et de ses paramètres, et le résultat est renvoyé avec return."
  },

  {
    question: "Un article coûte 80 € avant une remise de 15 %. Quel est le montant net après remise ?",
    options: [
      "68 €",
      "65 €",
      "92 €",
      "12 €"
    ],
    bonne_reponse: "68 €",
    explication: "Montant net = 80 × (1 − 0,15) = 80 × 0,85 = 68 €."
  },

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
    question: "Un cylindre a un volume de 500 cm³ et une hauteur de 10 cm. Quel est approximativement son diamètre ? (formule V = π×r²×h)",
    options: [
      "Environ 8 cm",
      "Environ 4 cm",
      "Environ 16 cm",
      "Environ 50 cm"
    ],
    bonne_reponse: "Environ 8 cm",
    explication: "r² = V/(π×h) = 500/(π×10) ≈ 15,9, donc r ≈ 4 cm et le diamètre ≈ 8 cm."
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

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
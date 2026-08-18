/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME AL01  ============
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
    explication: "C'est la loi des grands nombres, version vulgarisée : lorsque n est grand, la fréquence observée se rapproche de la probabilité théorique de l'événement."
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
    question: "Comment utilise-t-on une simulation déjà fournie pour répondre à une question de probabilité, sans en modifier le code ?",
    options: [
      "En exécutant le programme et en interprétant les résultats affichés (fréquences, graphiques) au regard de la question posée",
      "En réécrivant systématiquement tout le programme depuis le début",
      "En ignorant les résultats affichés par le programme",
      "Une simulation fournie ne peut jamais être exploitée directement"
    ],
    bonne_reponse: "En exécutant le programme et en interprétant les résultats affichés (fréquences, graphiques) au regard de la question posée",
    explication: "Utiliser une simulation déjà écrite consiste à l'exécuter, éventuellement en ajustant certains paramètres d'entrée, puis à interpréter les résultats numériques ou graphiques qu'elle produit pour répondre à la question posée."
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
    question: "Ce graphique représente la fréquence de certaines lettres dans un texte. Comment une fonction Python peut-elle déterminer la fréquence d'une lettre dans un mot ?",
    graphique: "img/q6.png",
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
    question: "Quelle instruction Python permet de compter les occurrences d'un caractère c dans une chaîne mot ?",
    options: [
      "mot.count(c)",
      "mot.find(c)",
      "len(mot)",
      "mot.index(c)"
    ],
    bonne_reponse: "mot.count(c)",
    explication: "La méthode count() appliquée à une chaîne de caractères Python renvoie le nombre d'occurrences de l'élément recherché."
  },

  {
    question: "Pourquoi la lettre E apparaît-elle beaucoup plus fréquemment que la lettre Z dans un texte français, comme le montre le graphique ?",
    graphique: "img/q6.png",
    options: [
      "Parce que la fréquence d'apparition des lettres dépend de la langue et de son vocabulaire courant",
      "Parce que toutes les lettres apparaissent forcément avec la même fréquence dans n'importe quelle langue",
      "Parce que Z est une lettre interdite dans la plupart des mots",
      "Il n'existe aucune différence de fréquence entre les lettres d'une langue"
    ],
    bonne_reponse: "Parce que la fréquence d'apparition des lettres dépend de la langue et de son vocabulaire courant",
    explication: "Chaque langue possède sa propre distribution statistique de fréquence des lettres, liée à son vocabulaire et à sa grammaire ; en français, le E est particulièrement fréquent, contrairement au Z."
  },

  {
    question: "Quel est l'intérêt d'écrire sa propre fonction de simulation plutôt que d'utiliser uniquement une simulation déjà fournie ?",
    options: [
      "Cela permet d'adapter précisément la simulation à une nouvelle expérience aléatoire non prévue par le programme existant",
      "Cela n'a aucun intérêt particulier",
      "Cela rend systématiquement le programme plus lent sans bénéfice",
      "Une fonction personnelle ne peut jamais fonctionner correctement"
    ],
    bonne_reponse: "Cela permet d'adapter précisément la simulation à une nouvelle expérience aléatoire non prévue par le programme existant",
    explication: "Écrire sa propre fonction de simulation permet de modéliser une expérience aléatoire spécifique qui n'est pas couverte par un programme existant, en choisissant précisément les instructions aléatoires nécessaires."
  },

  {
    question: "Dans une boucle simulant N répétitions d'une expérience aléatoire, comment calcule-t-on la fréquence finale d'un événement observé ?",
    options: [
      "En divisant le nombre de fois où l'événement s'est produit par le nombre total de répétitions N",
      "En multipliant le nombre d'occurrences par N",
      "En ne prenant en compte que la dernière répétition",
      "La fréquence ne peut pas être calculée à la fin d'une boucle"
    ],
    bonne_reponse: "En divisant le nombre de fois où l'événement s'est produit par le nombre total de répétitions N",
    explication: "La fréquence d'un événement observé sur une série de N répétitions se calcule en divisant le nombre de réalisations de cet événement par le nombre total de répétitions N."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES S02  ============
   ============================================================ */

window.questions = [

  {
    question: "Quels sont les indicateurs de position d'une série statistique ?",
    options: [
      "Le mode, la moyenne et la médiane",
      "L'étendue et l'écart type uniquement",
      "Les quartiles uniquement",
      "Le nombre total de valeurs de la série"
    ],
    bonne_reponse: "Le mode, la moyenne et la médiane",
    explication: "Les indicateurs de position (mode, moyenne, médiane, quartiles) renseignent sur les valeurs centrales ou caractéristiques d'une série."
  },

  {
    question: "Comment calcule-t-on la médiane d'une série statistique de valeurs classées par ordre croissant ?",
    options: [
      "C'est la valeur qui partage la série en deux parties de même effectif",
      "C'est toujours la valeur la plus élevée de la série",
      "C'est la moyenne des deux valeurs extrêmes",
      "C'est le mode de la série"
    ],
    bonne_reponse: "C'est la valeur qui partage la série en deux parties de même effectif",
    explication: "La médiane d'une série ordonnée est la valeur telle qu'au moins la moitié des valeurs lui sont inférieures ou égales, et au moins la moitié lui sont supérieures ou égales."
  },

  {
    question: "Quels sont les indicateurs de dispersion d'une série statistique ?",
    options: [
      "L'étendue, l'écart interquartile et l'écart type",
      "Le mode et la moyenne",
      "La médiane uniquement",
      "Les effectifs cumulés"
    ],
    bonne_reponse: "L'étendue, l'écart interquartile et l'écart type",
    explication: "Les indicateurs de dispersion (étendue, écart interquartile, écart type) renseignent sur l'étalement des valeurs d'une série autour de sa position centrale, contrairement aux indicateurs de position."
  },

  {
    question: "Comment calcule-t-on l'écart interquartile d'une série statistique ?",
    options: [
      "Q3 − Q1",
      "Q3 + Q1",
      "Q3 × Q1",
      "La médiane moins le premier quartile"
    ],
    bonne_reponse: "Q3 − Q1",
    explication: "L'écart interquartile se calcule en soustrayant le premier quartile Q1 au troisième quartile Q3."
  },

  {
    question: "Ce diagramme en boîte à moustaches compare deux séries A et B. Que peut-on en conclure si la boîte de la série B est plus étalée que celle de la série A ?",
    graphique: "img/q4.png",
    options: [
      "La série B est plus dispersée que la série A",
      "La série B a une moyenne plus faible que la série A",
      "Les deux séries sont identiques",
      "La série B contient moins de valeurs que la série A"
    ],
    bonne_reponse: "La série B est plus dispersée que la série A",
    explication: "Une boîte à moustaches plus étalée (plus large) traduit une plus grande dispersion des valeurs de la série autour de sa médiane."
  },

  {
    question: "Sur ce même diagramme, comment compare-t-on la position générale (les valeurs typiques) des deux séries A et B ?",
    graphique: "img/q4.png",
    options: [
      "En comparant la position de leurs médianes respectives (le trait à l'intérieur de chaque boîte)",
      "En comparant uniquement les valeurs minimales",
      "En comparant uniquement les valeurs maximales",
      "La position des séries ne peut pas être comparée sur ce type de diagramme"
    ],
    bonne_reponse: "En comparant la position de leurs médianes respectives (le trait à l'intérieur de chaque boîte)",
    explication: "La médiane, représentée par le trait à l'intérieur de chaque boîte, permet de comparer rapidement la position générale (le niveau typique) des deux séries."
  },

  {
    question: "Comment interprète-t-on la comparaison de deux diagrammes en boîte à moustaches représentant deux séries statistiques ?",
    options: [
      "En comparant à la fois leur position (médiane) et leur dispersion (étendue de la boîte et des moustaches)",
      "En ne comparant que la valeur maximale de chaque série",
      "En ignorant systématiquement les valeurs extrêmes",
      "Les diagrammes en boîte ne permettent aucune comparaison"
    ],
    bonne_reponse: "En comparant à la fois leur position (médiane) et leur dispersion (étendue de la boîte et des moustaches)",
    explication: "Comparer deux diagrammes en boîte à moustaches consiste à observer à la fois la position des médianes et l'étalement des boîtes et moustaches (quelle série est la plus dispersée)."
  },

  {
    question: "Deux séries statistiques ont la même moyenne mais des écarts types très différents. Que peut-on en conclure ?",
    options: [
      "La série avec l'écart type le plus grand est plus dispersée autour de la moyenne",
      "Les deux séries sont nécessairement identiques",
      "La série avec l'écart type le plus petit a une moyenne plus élevée",
      "L'écart type n'apporte aucune information supplémentaire dans ce cas"
    ],
    bonne_reponse: "La série avec l'écart type le plus grand est plus dispersée autour de la moyenne",
    explication: "Même à moyenne égale, l'écart type révèle des différences importantes : une série avec un écart type élevé a des valeurs plus dispersées autour de la moyenne qu'une série avec un écart type faible."
  },

  {
    question: "Pourquoi la médiane est-elle parfois préférée à la moyenne pour décrire une série contenant des valeurs extrêmes ?",
    options: [
      "Parce que la médiane est peu sensible aux valeurs extrêmes, contrairement à la moyenne",
      "Parce que la médiane est toujours plus facile à calculer que la moyenne",
      "Parce que la moyenne ne peut être calculée qu'avec un tableur",
      "La médiane n'est en réalité jamais préférée à la moyenne"
    ],
    bonne_reponse: "Parce que la médiane est peu sensible aux valeurs extrêmes, contrairement à la moyenne",
    explication: "La moyenne est fortement influencée par des valeurs extrêmes (très grandes ou très petites), alors que la médiane, qui dépend uniquement du rang des valeurs, reste peu affectée par ces valeurs atypiques."
  },

  {
    question: "Comment calcule-t-on l'écart type d'une série statistique à partir de sa variance ?",
    options: [
      "L'écart type est la racine carrée de la variance",
      "L'écart type est le carré de la variance",
      "L'écart type est égal à la variance",
      "L'écart type est l'inverse de la variance"
    ],
    bonne_reponse: "L'écart type est la racine carrée de la variance",
    explication: "L'écart type, indicateur de dispersion exprimé dans la même unité que les valeurs de la série, se calcule comme la racine carrée de la variance."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
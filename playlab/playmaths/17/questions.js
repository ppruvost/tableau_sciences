/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES 2NDE  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce diagramme représente une série statistique regroupée en classes. Pourquoi regroupe-t-on parfois une série en classes ?",
    graphique: "img/q1.png",
    options: [
      "Pour synthétiser une série comportant de nombreuses valeurs différentes ou continues, et faciliter sa lecture",
      "Pour rendre la série plus difficile à comprendre",
      "Pour supprimer certaines valeurs de la série",
      "Le regroupement en classes est toujours interdit en statistiques"
    ],
    bonne_reponse: "Pour synthétiser une série comportant de nombreuses valeurs différentes ou continues, et faciliter sa lecture",
    explication: "Regrouper une série statistique en classes permet de synthétiser un grand nombre de valeurs, notamment continues, en un nombre restreint d'intervalles, facilitant l'analyse et la représentation graphique."
  },

  {
    question: "Ce diagramme circulaire représente une série statistique qualitative. Pourquoi ce type de diagramme est-il adapté à une série qualitative ?",
    graphique: "img/q2.png",
    options: [
      "Il permet de visualiser directement la part de chaque catégorie dans l'effectif total",
      "Il ne peut représenter que des données numériques continues",
      "Il masque systématiquement les petites catégories",
      "Il est réservé aux séries chronologiques uniquement"
    ],
    bonne_reponse: "Il permet de visualiser directement la part de chaque catégorie dans l'effectif total",
    explication: "Un diagramme en secteurs (circulaire) est particulièrement adapté à une série qualitative car il représente visuellement la proportion de chaque catégorie par rapport au total."
  },

  {
    question: "Ce graphique représente l'évolution d'une grandeur au cours des mois de l'année, à l'aide de lignes brisées. Pourquoi ce type de représentation est-il adapté ?",
    graphique: "img/q3.png",
    options: [
      "Il met en évidence l'évolution chronologique d'une grandeur au fil du temps",
      "Il ne peut représenter que des données qualitatives",
      "Il ne permet jamais de comparer deux périodes différentes",
      "Il est réservé exclusivement aux très grandes séries de données"
    ],
    bonne_reponse: "Il met en évidence l'évolution chronologique d'une grandeur au fil du temps",
    explication: "Un diagramme en lignes brisées relie chronologiquement les valeurs successives d'une série, ce qui permet de visualiser clairement son évolution dans le temps (tendance, saisonnalité...)."
  },

  {
    question: "Quels sont les indicateurs de position d'une série statistique ?",
    options: [
      "Le mode, la moyenne et la médiane",
      "L'étendue et l'écart type uniquement",
      "Les quartiles uniquement",
      "Le nombre total de valeurs de la série"
    ],
    bonne_reponse: "Le mode, la moyenne et la médiane",
    explication: "Les indicateurs de position (mode, moyenne, médiane, quartiles) renseignent sur les valeurs centrales ou caractéristiques d'une série, tandis que les indicateurs de dispersion (étendue, écart type, écart interquartile) renseignent sur son étalement."
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
    explication: "L'écart interquartile, indicateur de dispersion, se calcule en soustrayant le premier quartile Q1 au troisième quartile Q3."
  },

  {
    question: "Ce diagramme en boîte à moustaches compare deux séries A et B. Que peut-on en conclure si la boîte de la série B est plus étalée que celle de la série A ?",
    graphique: "img/q6.png",
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
    question: "Comment interprète-t-on la comparaison de deux diagrammes en boîte à moustaches représentant deux séries statistiques ?",
    options: [
      "En comparant à la fois leur position (médiane) et leur dispersion (étendue de la boîte et des moustaches)",
      "En ne comparant que la valeur maximale de chaque série",
      "En ignorant systématiquement les valeurs extrêmes",
      "Les diagrammes en boîte ne permettent aucune comparaison"
    ],
    bonne_reponse: "En comparant à la fois leur position (médiane) et leur dispersion (étendue de la boîte et des moustaches)",
    explication: "Comparer deux diagrammes en boîte à moustaches consiste à observer à la fois la position des médianes (qui série est globalement plus élevée) et l'étalement des boîtes et moustaches (quelle série est la plus dispersée)."
  },

  {
    question: "Sur ce graphique, on augmente progressivement la taille n de l'échantillon prélevé dans une population où la fréquence p est connue. Que peut-on observer ?",
    graphique: "img/q8.png",
    options: [
      "La fréquence observée se stabilise progressivement autour de la probabilité p lorsque n augmente",
      "La fréquence observée s'éloigne de p lorsque n augmente",
      "La fréquence reste toujours rigoureusement égale à p, quel que soit n",
      "Il n'existe aucune relation entre n et la fréquence observée"
    ],
    bonne_reponse: "La fréquence observée se stabilise progressivement autour de la probabilité p lorsque n augmente",
    explication: "C'est le phénomène de stabilisation relative des fréquences : plus l'échantillon est grand, plus la fréquence observée se rapproche de la probabilité théorique p de l'événement étudié."
  },

  {
    question: "Cet arbre représente les résultats possibles de deux lancers successifs d'une pièce de monnaie. Combien d'issues possibles ce dénombrement permet-il d'obtenir ?",
    graphique: "img/q9.png",
    options: [
      "4 issues possibles (PP, PF, FP, FF)",
      "2 issues possibles seulement",
      "8 issues possibles",
      "1 seule issue possible"
    ],
    bonne_reponse: "4 issues possibles (PP, PF, FP, FF)",
    explication: "Un arbre de dénombrement pour deux lancers successifs d'une pièce (2 issues à chaque lancer) donne 2×2 = 4 issues possibles au total."
  },

  {
    question: "Quelle est l'étendue d'une série de fréquences d'échantillons de taille n fixée, comportant la valeur minimale 0,42 et la valeur maximale 0,58 ?",
    options: [
      "0,16",
      "0,50",
      "1,00",
      "0,08"
    ],
    bonne_reponse: "0,16",
    explication: "L'étendue est la différence entre la valeur maximale et la valeur minimale de la série : 0,58 − 0,42 = 0,16."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
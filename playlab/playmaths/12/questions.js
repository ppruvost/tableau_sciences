/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE A05  ============
   ============================================================ */

window.questions = [

  {
    question: "Un capital de 2000 € est placé à intérêts simples au taux annuel de 3 % pendant 5 ans. Quel est le montant des intérêts obtenus ?",
    options: [
      "300 €",
      "2300 €",
      "600 €",
      "60 €"
    ],
    bonne_reponse: "300 €",
    explication: "Intérêts simples = Capital × taux × durée = 2000 × 0,03 × 5 = 300 €."
  },

  {
    question: "Qu'appelle-t-on le coût marginal d'une production, en économie ?",
    options: [
      "Le coût de production d'une unité supplémentaire",
      "Le coût total de toute la production",
      "Le coût moyen de l'ensemble de la production",
      "Le prix de vente unitaire"
    ],
    bonne_reponse: "Le coût de production d'une unité supplémentaire",
    explication: "Le coût marginal correspond au coût engendré par la production d'une unité supplémentaire ; il peut être approché par le nombre dérivé de la fonction coût total."
  },

  {
    question: "Comment calcule-t-on le coût moyen unitaire de production, connaissant le coût total C(x) pour x unités produites ?",
    options: [
      "Coût moyen = C(x) / x",
      "Coût moyen = C(x) × x",
      "Coût moyen = C(x) + x",
      "Coût moyen = x / C(x)"
    ],
    bonne_reponse: "Coût moyen = C(x) / x",
    explication: "Le coût moyen unitaire est le coût total divisé par le nombre d'unités produites : Cmoy(x) = C(x)/x."
  },

  {
    question: "Ce graphique compare l'évolution des intérêts cumulés d'un même capital placé à intérêts simples et à intérêts composés. Que peut-on observer sur le long terme ?",
    graphique: "img/q1.png",
    options: [
      "Les intérêts composés finissent par dépasser largement les intérêts simples",
      "Les intérêts simples finissent toujours par dépasser les intérêts composés",
      "Les deux courbes restent toujours confondues",
      "Aucune comparaison n'est possible entre ces deux modes de calcul"
    ],
    bonne_reponse: "Les intérêts composés finissent par dépasser largement les intérêts simples",
    explication: "Les intérêts composés, calculés sur un capital qui inclut les intérêts déjà acquis, croissent de façon exponentielle et finissent par dépasser nettement les intérêts simples, qui croissent linéairement."
  },

  {
    question: "Un capital de 1000 € est placé à intérêts composés au taux annuel de 4 %. Quel est le capital obtenu après 3 ans (arrondi à l'euro) ?",
    options: [
      "1125 €",
      "1120 €",
      "1040 €",
      "1300 €"
    ],
    bonne_reponse: "1125 €",
    explication: "Capital final = 1000 × 1,04³ ≈ 1125 €."
  },

  {
    question: "Quelle est la différence fondamentale entre intérêts simples et intérêts composés ?",
    options: [
      "Les intérêts composés sont calculés chaque période sur le capital augmenté des intérêts déjà acquis, contrairement aux intérêts simples calculés uniquement sur le capital initial",
      "Les intérêts simples sont toujours plus élevés que les intérêts composés",
      "Il n'existe aucune différence entre les deux",
      "Les intérêts composés ne s'appliquent qu'aux emprunts, jamais aux placements"
    ],
    bonne_reponse: "Les intérêts composés sont calculés chaque période sur le capital augmenté des intérêts déjà acquis, contrairement aux intérêts simples calculés uniquement sur le capital initial",
    explication: "Avec les intérêts simples, seul le capital initial génère des intérêts à chaque période ; avec les intérêts composés, les intérêts déjà versés s'ajoutent au capital et génèrent eux-mêmes des intérêts, d'où une croissance plus rapide."
  },

  {
    question: "Dans un tableau d'amortissement d'emprunt à annuités constantes, que représente la part d'intérêt de chaque échéance au fil du temps ?",
    options: [
      "Elle diminue progressivement, tandis que la part de capital remboursé augmente",
      "Elle augmente progressivement",
      "Elle reste rigoureusement constante",
      "Elle est toujours nulle après la première échéance"
    ],
    bonne_reponse: "Elle diminue progressivement, tandis que la part de capital remboursé augmente",
    explication: "Dans un emprunt à annuités constantes, les intérêts sont calculés sur le capital restant dû, qui diminue au fil du temps : la part d'intérêt décroît donc progressivement."
  },

  {
    question: "Que représente le capital restant dû dans un tableau d'amortissement d'emprunt ?",
    options: [
      "Le montant du capital emprunté qu'il reste encore à rembourser à une date donnée",
      "Le montant total des intérêts déjà versés",
      "Le montant total de l'annuité",
      "La somme des intérêts et du capital initial"
    ],
    bonne_reponse: "Le montant du capital emprunté qu'il reste encore à rembourser à une date donnée",
    explication: "Le capital restant dû est la part du capital emprunté qui n'a pas encore été remboursée à un instant donné ; il diminue à chaque échéance de la part de capital remboursée."
  },

  {
    question: "Comment calcule-t-on la fonction coût marginal à partir d'une fonction de coût total C(x) ?",
    options: [
      "Le coût marginal est approché par le nombre dérivé de la fonction coût total, C'(x)",
      "Le coût marginal est toujours égal à C(x)/2",
      "Le coût marginal ne peut pas être calculé à partir de C(x)",
      "Le coût marginal est la primitive de C(x)"
    ],
    bonne_reponse: "Le coût marginal est approché par le nombre dérivé de la fonction coût total, C'(x)",
    explication: "Le coût marginal, coût de production d'une unité supplémentaire, est classiquement approché par le nombre dérivé C'(x) de la fonction coût total."
  },

  {
    question: "Une entreprise remarque que son coût moyen unitaire est minimal pour une certaine production x0. Que peut-on généralement observer à ce niveau de production concernant le coût marginal ?",
    options: [
      "Le coût marginal est égal au coût moyen en ce point",
      "Le coût marginal est toujours nul en ce point",
      "Le coût marginal est toujours maximal en ce point",
      "Il n'existe aucune relation entre les deux à ce point"
    ],
    bonne_reponse: "Le coût marginal est égal au coût moyen en ce point",
    explication: "Un résultat classique d'analyse économique est qu'au minimum du coût moyen, le coût marginal est égal au coût moyen, ce qui correspond au point où la courbe du coût marginal coupe celle du coût moyen."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
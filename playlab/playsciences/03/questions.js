/* ============================================================
   ============  QUIZ PLAYSCIENCES — CHIMIE TLE A  ============
   ============================================================ */

window.questions = [

  {
    question: "Une solution a un pH = 2. Quelle est sa nature ?",
    graphique: "img/q1.png",
    options: [
      "Fortement acide",
      "Neutre",
      "Fortement basique",
      "Impossible à savoir"
    ],
    bonne_reponse: "Fortement acide",
    explication: "Un pH proche de 0 correspond à une solution fortement acide, un pH proche de 7 à une solution neutre, un pH proche de 14 à une solution fortement basique."
  },

  {
    question: "Quelle est la relation entre le pH d'une solution aqueuse et la concentration en ions oxonium [H₃O⁺] ?",
    options: [
      "pH = −log([H₃O⁺])",
      "pH = log([H₃O⁺])",
      "pH = [H₃O⁺] / 10",
      "pH = 10 × [H₃O⁺]"
    ],
    bonne_reponse: "pH = −log([H₃O⁺])",
    explication: "pH = −log([H₃O⁺]), où [H₃O⁺] est exprimée en mol/L."
  },

  {
    question: "Une solution a un pH = 3. Quelle est sa concentration en ions H₃O⁺ ?",
    options: [
      "3 mol/L",
      "10⁻³ mol/L",
      "10³ mol/L",
      "0,3 mol/L"
    ],
    bonne_reponse: "10⁻³ mol/L",
    explication: "[H₃O⁺] = 10^(−pH) = 10⁻³ mol/L."
  },

  {
    question: "Vérifier que la relation entre pH et concentration suit un modèle logarithmique revient à observer que :",
    options: [
      "Le pH double quand la concentration double",
      "Une multiplication par 10 de [H₃O⁺] fait diminuer le pH d'une unité",
      "Le pH et la concentration sont indépendants",
      "Le pH est toujours égal à la concentration"
    ],
    bonne_reponse: "Une multiplication par 10 de [H₃O⁺] fait diminuer le pH d'une unité",
    explication: "La relation pH = −log([H₃O⁺]) étant logarithmique, multiplier la concentration en H₃O⁺ par 10 diminue le pH d'exactement une unité."
  },

  {
    question: "Ce schéma illustre la réaction d'un métal (zinc) avec une solution acide, avec dégagement gazeux. Quel gaz se dégage typiquement lors de cette réaction ?",
    graphique: "img/q5.png",
    options: [
      "Du dioxygène",
      "Du dihydrogène",
      "Du dioxyde de carbone",
      "De l'ozone"
    ],
    bonne_reponse: "Du dihydrogène",
    explication: "La réaction d'un métal réducteur comme le zinc avec une solution acide produit du dihydrogène gazeux (bulles observées) et des ions métalliques en solution."
  },

  {
    question: "Comment établit-on une classification qualitative des couples oxydant/réducteur à partir de tests métal/solution ?",
    options: [
      "En mesurant la masse de chaque métal avant et après réaction",
      "En observant si une réaction se produit ou non entre un métal et la solution d'un autre métal, ce qui indique quel réducteur est le plus fort",
      "En mesurant uniquement la couleur de la solution",
      "En chauffant les métaux jusqu'à fusion"
    ],
    bonne_reponse: "En observant si une réaction se produit ou non entre un métal et la solution d'un autre métal, ce qui indique quel réducteur est le plus fort",
    explication: "En testant systématiquement des métaux avec des solutions d'ions métalliques, on observe quelles réactions ont lieu spontanément, ce qui permet de classer qualitativement les couples oxydant/réducteur par pouvoir réducteur croissant ou décroissant."
  },

  {
    question: "Dans une pile électrochimique comme celle représentée, quel est le rôle du pont salin ?",
    graphique: "img/q6.png",
    options: [
      "Fournir l'énergie électrique de la pile",
      "Assurer la fermeture du circuit en permettant la migration des ions et maintenir l'électroneutralité des solutions",
      "Chauffer les électrodes",
      "Empêcher tout passage de courant"
    ],
    bonne_reponse: "Assurer la fermeture du circuit en permettant la migration des ions et maintenir l'électroneutralité des solutions",
    explication: "Le pont salin permet le passage des ions entre les deux demi-piles, fermant le circuit électrique et maintenant l'électroneutralité de chaque compartiment."
  },

  {
    question: "Dans une pile Zn/Cu, à quelle électrode se produit l'oxydation ?",
    options: [
      "À l'électrode de zinc (borne négative)",
      "À l'électrode de cuivre (borne positive)",
      "Aux deux électrodes simultanément",
      "Ni l'une ni l'autre"
    ],
    bonne_reponse: "À l'électrode de zinc (borne négative)",
    explication: "Le zinc, plus réducteur, s'oxyde à l'électrode négative (Zn → Zn²⁺ + 2e⁻)."
  },

  {
    question: "Pour classer quantitativement des couples oxydant/réducteur, quelle grandeur mesure-t-on entre chaque paire de demi-piles ?",
    options: [
      "La masse volumique de chaque solution",
      "La tension à vide entre les deux électrodes de la pile formée",
      "La couleur des solutions uniquement",
      "Le pH de chaque solution"
    ],
    bonne_reponse: "La tension à vide entre les deux électrodes de la pile formée",
    explication: "Mesurer la tension à vide (f.é.m.) de piles formées à partir de différents couples permet de les classer quantitativement selon leur pouvoir oxydant ou réducteur."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/* ============================================================
   ============  QUIZ PLAYSCIENCES — C2. pH - Indicateurs (2nde)  ============
   ============================================================ */

window.questions = [

  {
    question: "Un indicateur coloré est une espèce chimique qui :",
    options: [
      "Change de couleur selon le pH du milieu",
      "Fait toujours bouillir la solution",
      "Neutralise tous les acides",
      "Ne sert qu'en cuisine"
    ],
    bonne_reponse: "Change de couleur selon le pH du milieu",
    explication: "Un indicateur coloré possède une teinte différente selon qu'il est en milieu acide ou basique."
  },

  {
    question: "Le papier pH, comparé à un indicateur coloré unique, permet :",
    options: [
      "De mesurer précisément une masse",
      "D'estimer le pH sur toute une échelle grâce à une gamme de couleurs",
      "De mesurer une température",
      "De mesurer un volume"
    ],
    bonne_reponse: "D'estimer le pH sur toute une échelle grâce à une gamme de couleurs",
    explication: "Le papier pH contient plusieurs indicateurs combinés, ce qui donne une teinte différente pour chaque valeur de pH."
  },

  {
    question: "Dans un titrage colorimétrique, l'équivalence est repérée par :",
    options: [
      "Un changement brutal de couleur de l'indicateur ajouté",
      "Une élévation de température",
      "Un dégagement gazeux",
      "Un précipité qui se dissout"
    ],
    bonne_reponse: "Un changement brutal de couleur de l'indicateur ajouté",
    explication: "L'indicateur coloré choisi change de teinte précisément au voisinage de l'équivalence, ce qui permet de la repérer visuellement."
  },

  {
    question: "Une solution acido-basique de pH = 3 est :",
    options: [
      "Basique",
      "Neutre",
      "Acide",
      "Impossible à déterminer"
    ],
    bonne_reponse: "Acide",
    explication: "À 25°C, un pH inférieur à 7 correspond à une solution acide, un pH supérieur à 7 à une solution basique."
  },

  {
    question: "Une solution de pH = 10 est :",
    options: [
      "Acide",
      "Neutre",
      "Basique",
      "Impossible à déterminer"
    ],
    bonne_reponse: "Basique",
    explication: "À 25°C, un pH supérieur à 7 correspond à une solution basique (pH = 7 : neutre)."
  },

  {
    question: "La relation entre le pH et la concentration en ions oxonium [H₃O⁺] est :",
    options: [
      "pH = [H₃O⁺]",
      "pH = −log([H₃O⁺])",
      "pH = log([H₃O⁺])",
      "pH = [H₃O⁺] × 10"
    ],
    bonne_reponse: "pH = −log([H₃O⁺])",
    explication: "Par définition, pH = −log₁₀([H₃O⁺]), avec [H₃O⁺] exprimée en mol/L."
  },

  {
    question: "Une solution a une concentration [H₃O⁺] = 1,0 × 10⁻⁵ mol/L. Son pH vaut :",
    options: [
      "5",
      "9",
      "1,0 × 10⁻⁵",
      "−5"
    ],
    bonne_reponse: "5",
    explication: "pH = −log(1,0×10⁻⁵) = 5."
  },

  {
    question: "Une solution a un pH = 4. Quelle est sa concentration en ions oxonium [H₃O⁺] ?",
    options: [
      "4 mol/L",
      "1,0 × 10⁻⁴ mol/L",
      "1,0 × 10⁴ mol/L",
      "0,4 mol/L"
    ],
    bonne_reponse: "1,0 × 10⁻⁴ mol/L",
    explication: "[H₃O⁺] = 10⁻ᵖᴴ = 10⁻⁴ mol/L."
  },

  {
    question: "Si l'on dilue une solution acide par 10, son pH :",
    options: [
      "Diminue d'environ 1 unité",
      "Augmente d'environ 1 unité",
      "Reste identique",
      "Devient négatif"
    ],
    bonne_reponse: "Augmente d'environ 1 unité",
    explication: "Diluer par 10 divise [H₃O⁺] par 10, ce qui augmente le pH d'environ une unité (solution moins acide)."
  },

  {
    question: "Le suc gastrique (pH ≈ 1,5) et l'eau de mer (pH ≈ 8) : lequel est le plus acide ?",
    options: [
      "Le suc gastrique",
      "L'eau de mer",
      "Ils sont identiques",
      "Aucun n'est acide"
    ],
    bonne_reponse: "Le suc gastrique",
    explication: "Plus le pH est bas, plus la solution est acide : pH 1,5 correspond à une acidité bien plus forte que pH 8."
  }
];

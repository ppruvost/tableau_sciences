/* ============================================================
   ============  QUIZ PLAYSCIENCES — ACOUSTIQUE TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Quelle relation permet de calculer le niveau d'intensité acoustique L (en dB) à partir de l'intensité acoustique I ?",
    options: [
      "L = 10 × log(I / I₀)",
      "L = I / I₀",
      "L = 10 × I / I₀",
      "L = log(I) + I₀"
    ],
    bonne_reponse: "L = 10 × log(I / I₀)",
    explication: "L = 10 × log(I / I₀), où I₀ = 10⁻¹² W/m² est l'intensité de référence au seuil d'audibilité."
  },

  {
    question: "Une intensité acoustique double. De combien de dB le niveau sonore augmente-t-il environ ?",
    options: [
      "Environ 3 dB",
      "Environ 10 dB",
      "Environ 20 dB",
      "Il double aussi, donc +100%"
    ],
    bonne_reponse: "Environ 3 dB",
    explication: "10 × log(2) ≈ 3 dB : l'échelle des décibels est logarithmique."
  },

  {
    question: "D'après ce graphique du niveau sonore mesuré en fonction de la distance à la source, comment évolue le niveau sonore lorsqu'on s'éloigne ?",
    graphique: "img/q3.png",
    options: [
      "Il augmente proportionnellement à la distance",
      "Il diminue progressivement lorsque la distance augmente",
      "Il reste constant quelle que soit la distance",
      "Il varie de façon aléatoire"
    ],
    bonne_reponse: "Il diminue progressivement lorsque la distance augmente",
    explication: "L'énergie sonore se répartit sur une surface croissante à mesure que l'on s'éloigne : le niveau sonore diminue donc avec la distance, même dans un milieu non absorbant."
  },

  {
    question: "Quel appareil permet de mesurer directement un niveau sonore en dB ?",
    options: [
      "Un ampèremètre",
      "Un sonomètre",
      "Un luxmètre",
      "Un pH-mètre"
    ],
    bonne_reponse: "Un sonomètre",
    explication: "Le sonomètre est l'appareil de mesure dédié au niveau d'intensité acoustique."
  },

  {
    question: "Quelle grandeur physique un signal sonore transporte-t-il en se propageant ?",
    options: [
      "De la matière",
      "De l'énergie",
      "De la charge électrique",
      "Rien, seule l'information se propage"
    ],
    bonne_reponse: "De l'énergie",
    explication: "Une onde sonore transporte de l'énergie sans transport de matière."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
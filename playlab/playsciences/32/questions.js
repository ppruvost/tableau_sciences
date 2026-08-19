/* ============================================================
   ============  QUIZ PLAYSCIENCES — O1. Réflexion et réfraction (2nde)  ============
   ============================================================ */

window.questions = [

  {
    question: "La loi de la réflexion énonce que l'angle de réflexion est :",
    options: [
      "Égal à l'angle d'incidence",
      "Toujours nul",
      "Le double de l'angle d'incidence",
      "Indépendant de l'angle d'incidence"
    ],
    bonne_reponse: "Égal à l'angle d'incidence",
    explication: "Les deux angles, mesurés par rapport à la normale, sont toujours égaux lors d'une réflexion."
  },

  {
    question: "Les angles de réflexion et d'incidence sont mesurés par rapport à :",
    options: [
      "La surface du miroir",
      "La normale à la surface",
      "L'horizontale du sol",
      "Le rayon réfléchi"
    ],
    bonne_reponse: "La normale à la surface",
    explication: "Par convention, tous les angles d'optique géométrique sont mesurés par rapport à la normale (perpendiculaire à la surface)."
  },

  {
    question: "La réfraction est le phénomène par lequel un rayon lumineux :",
    options: [
      "Change de direction en changeant de milieu",
      "Disparaît totalement",
      "Se réfléchit uniquement",
      "Devient invisible"
    ],
    bonne_reponse: "Change de direction en changeant de milieu",
    explication: "Lorsqu'un rayon passe d'un milieu à un autre (ex : air vers eau), sa direction change du fait de la variation de vitesse de la lumière."
  },

  {
    question: "La loi de Snell-Descartes pour la réfraction s'écrit :",
    options: [
      "n₁ sin(i₁) = n₂ sin(i₂)",
      "n₁ × i₁ = n₂ × i₂",
      "n₁ + i₁ = n₂ + i₂",
      "n₁ / i₁ = n₂ / i₂"
    ],
    bonne_reponse: "n₁ sin(i₁) = n₂ sin(i₂)",
    explication: "Cette loi relie les indices de réfraction des deux milieux aux angles d'incidence et de réfraction."
  },

  {
    question: "Un rayon lumineux passant de l'air (n=1) vers l'eau (n=1,33) se rapproche de :",
    options: [
      "La normale",
      "La surface",
      "L'horizontale",
      "Rien ne change"
    ],
    bonne_reponse: "La normale",
    explication: "En passant vers un milieu plus réfringent (indice plus élevé), le rayon réfracté se rapproche de la normale."
  },

  {
    question: "L'indice de réfraction n d'un milieu est toujours :",
    options: [
      "Supérieur ou égal à 1",
      "Négatif",
      "Compris entre −1 et 0",
      "Nul dans le vide"
    ],
    bonne_reponse: "Supérieur ou égal à 1",
    explication: "Par convention, n = 1 dans le vide (et environ dans l'air), et n > 1 dans tout milieu matériel plus dense optiquement."
  },

  {
    question: "L'angle limite de réfraction correspond au cas où :",
    options: [
      "L'angle de réfraction atteint 90°",
      "L'angle d'incidence est nul",
      "Le rayon incident disparaît",
      "L'indice devient négatif"
    ],
    bonne_reponse: "L'angle de réfraction atteint 90°",
    explication: "L'angle limite est l'angle d'incidence pour lequel le rayon réfracté rase la surface (angle de réfraction = 90°)."
  },

  {
    question: "La réflexion totale se produit lorsque :",
    options: [
      "L'angle d'incidence dépasse l'angle limite, en allant du milieu le plus réfringent vers le moins réfringent",
      "La lumière passe de l'air vers le verre",
      "L'angle d'incidence est nul",
      "Le milieu est totalement transparent"
    ],
    bonne_reponse: "L'angle d'incidence dépasse l'angle limite, en allant du milieu le plus réfringent vers le moins réfringent",
    explication: "Au-delà de l'angle limite, il n'existe plus de rayon réfracté : toute la lumière est réfléchie, c'est la réflexion totale."
  },

  {
    question: "La réflexion totale est le principe physique exploité dans :",
    options: [
      "Les fibres optiques",
      "Les lentilles convergentes uniquement",
      "Les prismes de dispersion uniquement",
      "Les filtres colorés"
    ],
    bonne_reponse: "Les fibres optiques",
    explication: "La lumière reste guidée à l'intérieur de la fibre optique grâce à des réflexions totales successives sur ses parois."
  },

  {
    question: "Un rayon incident perpendiculaire à une surface (angle d'incidence = 0°) :",
    options: [
      "Traverse sans être dévié",
      "Est totalement réfléchi",
      "Disparaît",
      "Change de couleur"
    ],
    bonne_reponse: "Traverse sans être dévié",
    explication: "Quand l'angle d'incidence est nul, le rayon reste perpendiculaire à la surface : il n'y a pas de déviation à la traversée."
  }
];

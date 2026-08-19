/* ============================================================
   ============  QUIZ PLAYSCIENCES — E3. Puissance active (Tle)  ============
   ============================================================ */

window.questions = [

  {
    question: "En régime alternatif sinusoïdal, un déphasage entre la tension et l'intensité apparaît lorsque le circuit contient :",
    options: [
      "Des éléments inductifs ou capacitifs (bobines, condensateurs)",
      "Uniquement des résistances pures",
      "Uniquement des fils sans composant",
      "Aucun composant"
    ],
    bonne_reponse: "Des éléments inductifs ou capacitifs (bobines, condensateurs)",
    explication: "Contrairement à une résistance pure, une bobine ou un condensateur introduit un décalage temporel (déphasage) entre u(t) et i(t)."
  },

  {
    question: "Pour un circuit purement résistif, le déphasage entre tension et intensité est :",
    options: [
      "Nul (elles sont en phase)",
      "De 90°",
      "De 180°",
      "Toujours variable"
    ],
    bonne_reponse: "Nul (elles sont en phase)",
    explication: "Dans une résistance pure, tension et intensité varient en phase, sans décalage temporel."
  },

  {
    question: "La puissance active P d'un circuit en régime sinusoïdal s'exprime par :",
    options: [
      "P = U × I × cos(φ)",
      "P = U × I",
      "P = U / I",
      "P = U × I × sin(φ)"
    ],
    bonne_reponse: "P = U × I × cos(φ)",
    explication: "La puissance active tient compte du déphasage φ entre tension et intensité via le facteur cos(φ)."
  },

  {
    question: "Le facteur de puissance d'une installation électrique correspond à :",
    options: [
      "cos(φ), le rapport entre puissance active et puissance apparente",
      "L'intensité maximale supportée",
      "La tension nominale",
      "La fréquence du réseau"
    ],
    bonne_reponse: "cos(φ), le rapport entre puissance active et puissance apparente",
    explication: "Le facteur de puissance cos(φ) = P/S mesure l'efficacité avec laquelle la puissance apparente est convertie en puissance réellement utile."
  },

  {
    question: "Un facteur de puissance proche de 1 traduit :",
    options: [
      "Une installation efficace, où la quasi-totalité de la puissance apparente est utile",
      "Une installation totalement inefficace",
      "Une absence totale de courant",
      "Un court-circuit permanent"
    ],
    bonne_reponse: "Une installation efficace, où la quasi-totalité de la puissance apparente est utile",
    explication: "Plus cos(φ) est proche de 1, moins il y a de puissance réactive inutile transportée par le réseau."
  },

  {
    question: "La puissance apparente S d'un circuit se calcule par :",
    options: [
      "S = U × I (valeurs efficaces)",
      "S = U / I",
      "S = U × I × cos(φ) uniquement",
      "S = P − Q"
    ],
    bonne_reponse: "S = U × I (valeurs efficaces)",
    explication: "La puissance apparente, exprimée en volt-ampères (VA), est simplement le produit des valeurs efficaces de U et I, sans tenir compte du déphasage."
  },

  {
    question: "Un déphasage φ = 90° entre tension et intensité correspond à un facteur de puissance :",
    options: [
      "cos(90°) = 0, aucune puissance active transmise",
      "cos(90°) = 1, puissance active maximale",
      "Un facteur négatif impossible",
      "Un facteur toujours égal à 0,5"
    ],
    bonne_reponse: "cos(90°) = 0, aucune puissance active transmise",
    explication: "Lorsque tension et intensité sont en quadrature (déphasage de 90°), la puissance active moyenne transmise est nulle."
  },

  {
    question: "Un moteur électrique inductif a tendance à présenter un facteur de puissance :",
    options: [
      "Inférieur à 1, nécessitant parfois une compensation",
      "Toujours égal à 1",
      "Négatif",
      "Indépendant de sa charge"
    ],
    bonne_reponse: "Inférieur à 1, nécessitant parfois une compensation",
    explication: "Les moteurs inductifs consomment de la puissance réactive, ce qui dégrade le facteur de puissance, souvent compensé par des condensateurs."
  },

  {
    question: "Améliorer le facteur de puissance d'une installation industrielle permet notamment de :",
    options: [
      "Réduire les pertes en ligne et les pénalités facturées par le fournisseur",
      "Augmenter systématiquement la consommation électrique",
      "Supprimer totalement le besoin en électricité",
      "Rendre le courant continu"
    ],
    bonne_reponse: "Réduire les pertes en ligne et les pénalités facturées par le fournisseur",
    explication: "Un bon facteur de puissance limite le courant réactif inutile, réduisant les pertes par effet Joule et les surcoûts facturés."
  },

  {
    question: "La puissance réactive Q, associée aux éléments inductifs/capacitifs, s'exprime en :",
    options: [
      "Volt-ampères réactifs (VAR)",
      "Watts (W)",
      "Volt-ampères (VA)",
      "Joules (J)"
    ],
    bonne_reponse: "Volt-ampères réactifs (VAR)",
    explication: "Contrairement à la puissance active (W), la puissance réactive, non consommée réellement, s'exprime en VAR."
  }
];

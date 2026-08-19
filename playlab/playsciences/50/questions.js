/* ============================================================
   ============  QUIZ PLAYSCIENCES — E1. Puissance et énergie électrique (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Pour mesurer une tension aux bornes d'un composant, un voltmètre doit être branché :",
    options: [
      "En dérivation (en parallèle) aux bornes du composant",
      "En série dans le circuit",
      "N'importe où sans précaution",
      "Toujours avant la source"
    ],
    bonne_reponse: "En dérivation (en parallèle) aux bornes du composant",
    explication: "Le voltmètre, de très grande résistance interne, se branche en parallèle pour ne pas perturber le circuit."
  },

  {
    question: "Pour mesurer l'intensité du courant, un ampèremètre doit être branché :",
    options: [
      "En série dans le circuit",
      "En dérivation aux bornes du composant",
      "Jamais dans le circuit",
      "En parallèle avec le générateur uniquement"
    ],
    bonne_reponse: "En série dans le circuit",
    explication: "L'ampèremètre, de très faible résistance interne, se place en série pour mesurer tout le courant qui le traverse."
  },

  {
    question: "En régime continu, la relation entre la puissance électrique P, la tension U et l'intensité I est :",
    options: [
      "P = U × I",
      "P = U / I",
      "P = U + I",
      "P = U − I"
    ],
    bonne_reponse: "P = U × I",
    explication: "En courant continu, la puissance électrique consommée par un dipôle est le produit de la tension à ses bornes par l'intensité qui le traverse."
  },

  {
    question: "Un appareil fonctionne sous une tension de 230 V avec une intensité de 2 A. Sa puissance est de :",
    options: [
      "460 W",
      "232 W",
      "115 W",
      "228 W"
    ],
    bonne_reponse: "460 W",
    explication: "P = U×I = 230×2 = 460 W."
  },

  {
    question: "L'énergie électrique consommée par un appareil se calcule à partir de sa puissance P et de la durée t de fonctionnement par :",
    options: [
      "E = P × t",
      "E = P / t",
      "E = P + t",
      "E = t / P"
    ],
    bonne_reponse: "E = P × t",
    explication: "L'énergie consommée est le produit de la puissance de l'appareil par sa durée de fonctionnement."
  },

  {
    question: "Un radiateur de 1500 W fonctionne pendant 3 heures. Quelle énergie a-t-il consommée ?",
    options: [
      "4500 Wh (4,5 kWh)",
      "500 Wh",
      "1500 Wh",
      "3 Wh"
    ],
    bonne_reponse: "4500 Wh (4,5 kWh)",
    explication: "E = P×t = 1500×3 = 4500 Wh, soit 4,5 kWh."
  },

  {
    question: "L'unité usuelle de l'énergie électrique facturée par les fournisseurs d'électricité est :",
    options: [
      "Le kilowattheure (kWh)",
      "Le watt (W)",
      "L'ampère (A)",
      "Le volt (V)"
    ],
    bonne_reponse: "Le kilowattheure (kWh)",
    explication: "Le kWh, unité pratique d'énergie, correspond à l'énergie consommée par un appareil de 1 kW fonctionnant pendant 1 heure."
  },

  {
    question: "Pour un appareil résistif, la relation entre la puissance P, la résistance R et l'intensité I est :",
    options: [
      "P = R × I²",
      "P = R / I",
      "P = R + I",
      "P = R × I"
    ],
    bonne_reponse: "P = R × I²",
    explication: "Pour un dipôle purement résistif, en combinant P=UI et U=RI, on obtient P = R×I²."
  },

  {
    question: "À puissance identique, un appareil utilisé deux fois plus longtemps consomme :",
    options: [
      "Deux fois plus d'énergie",
      "La même énergie",
      "Deux fois moins d'énergie",
      "Une énergie nulle"
    ],
    bonne_reponse: "Deux fois plus d'énergie",
    explication: "Puisque E = P×t, à puissance constante, l'énergie consommée est proportionnelle à la durée d'utilisation."
  },

  {
    question: "Un wattmètre est un appareil qui permet de mesurer directement :",
    options: [
      "La puissance électrique consommée par un appareil",
      "Uniquement la tension",
      "Uniquement l'intensité",
      "La résistance uniquement"
    ],
    bonne_reponse: "La puissance électrique consommée par un appareil",
    explication: "Le wattmètre combine la mesure de tension et d'intensité pour afficher directement la puissance électrique en watts."
  }
];

/* ============================================================
   ============  QUIZ PLAYSCIENCES — OPTIQUE 2NDE B  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce graphique montre la réponse d'une photorésistance en fonction de l'éclairement reçu. Comment évolue le photocourant lorsque l'éclairement augmente ?",
    graphique: "img/q1.png",
    options: [
      "Il diminue",
      "Il augmente",
      "Il reste constant",
      "Il devient nul"
    ],
    bonne_reponse: "Il augmente",
    explication: "La réponse électrique d'un photocomposant, comme une photorésistance ou une photodiode, croît avec l'éclairement lumineux qu'il reçoit."
  },

  {
    question: "La réponse d'un photocomposant dépend-elle de la longueur d'onde de la lumière incidente ?",
    options: [
      "Non, tous les photocomposants réagissent de façon identique à toutes les longueurs d'onde",
      "Oui, chaque photocomposant possède une sensibilité qui varie selon la longueur d'onde de la lumière reçue",
      "Seule l'intensité compte, jamais la longueur d'onde",
      "Les photocomposants ne réagissent qu'à l'obscurité totale"
    ],
    bonne_reponse: "Oui, chaque photocomposant possède une sensibilité qui varie selon la longueur d'onde de la lumière reçue",
    explication: "Chaque photocomposant a une courbe de sensibilité spectrale propre : sa réponse électrique dépend de la longueur d'onde de la lumière incidente, avec une sensibilité maximale dans un domaine donné."
  },

  {
    question: "Ce schéma représente un photon transportant une énergie E. Quelle relation relie cette énergie à la fréquence f du rayonnement ?",
    graphique: "img/q3.png",
    options: [
      "E = h × f",
      "E = h / f",
      "E = h + f",
      "E = f / h"
    ],
    bonne_reponse: "E = h × f",
    explication: "L'énergie d'un photon est donnée par E = h × f, où h est la constante de Planck et f la fréquence du rayonnement."
  },

  {
    question: "Comment varie l'énergie d'un photon lorsque sa longueur d'onde diminue ?",
    options: [
      "Elle diminue",
      "Elle augmente",
      "Elle reste identique",
      "Elle devient nulle"
    ],
    bonne_reponse: "Elle augmente",
    explication: "L'énergie du photon est inversement proportionnelle à sa longueur d'onde (E = hc/λ) : plus λ est petite, plus f est grande, et plus l'énergie transportée est élevée."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
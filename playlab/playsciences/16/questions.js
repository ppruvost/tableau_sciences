/* ============================================================
   ============  QUIZ PLAYSCIENCES — SIGNAUX 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Quelle relation relie la longueur d'onde λ dans le vide, la vitesse de la lumière c et la fréquence f d'une onde électromagnétique ?",
    options: [
      "λ = c / f",
      "λ = c × f",
      "λ = f / c",
      "λ = c + f"
    ],
    bonne_reponse: "λ = c / f",
    explication: "Pour une onde électromagnétique se propageant dans le vide, la longueur d'onde est reliée à la vitesse de la lumière et à la fréquence par λ = c / f, avec c ≈ 3×10⁸ m/s."
  },

  {
    question: "Une onde radio a une fréquence de 100 MHz. Quelle est sa longueur d'onde dans le vide ? (c = 3×10⁸ m/s)",
    options: [
      "3 m",
      "0,33 m",
      "30 m",
      "300 m"
    ],
    bonne_reponse: "3 m",
    explication: "λ = c/f = (3×10⁸)/(100×10⁶) = (3×10⁸)/(10⁸) = 3 m."
  },

  {
    question: "D'après cette frise du spectre électromagnétique, classée par longueur d'onde croissante, où se situe le domaine visible ?",
    graphique: "img/q1.png",
    options: [
      "Entre les rayons X et les UV",
      "Entre les UV et l'infrarouge",
      "Entre les micro-ondes et les ondes radio",
      "Avant les rayons gamma"
    ],
    bonne_reponse: "Entre les UV et l'infrarouge",
    explication: "Le domaine visible, perceptible par l'œil humain, se situe entre les ultraviolets (longueurs d'onde plus courtes) et l'infrarouge (longueurs d'onde plus longues) dans le spectre électromagnétique."
  },

  {
    question: "Quels sont, dans l'ordre, les grands domaines du spectre électromagnétique, des plus courtes aux plus grandes longueurs d'onde ?",
    options: [
      "Rayons gamma, rayons X, UV, visible, IR, micro-ondes, ondes radio",
      "Ondes radio, micro-ondes, IR, visible, UV, rayons X, rayons gamma",
      "Visible, UV, IR, rayons X, rayons gamma, ondes radio, micro-ondes",
      "Il n'existe pas d'ordre particulier"
    ],
    bonne_reponse: "Rayons gamma, rayons X, UV, visible, IR, micro-ondes, ondes radio",
    explication: "Le spectre électromagnétique s'ordonne, des plus courtes aux plus grandes longueurs d'onde, ainsi : rayons gamma, rayons X, ultraviolets, visible, infrarouge, micro-ondes puis ondes radio (dont les ondes hertziennes)."
  },

  {
    question: "Un réseau wifi domestique utilise des ondes électromagnétiques appartenant à quel domaine du spectre ?",
    options: [
      "Les rayons X",
      "Les ondes radio (domaine des micro-ondes/ondes hertziennes)",
      "Les rayons gamma",
      "Les ultraviolets"
    ],
    bonne_reponse: "Les ondes radio (domaine des micro-ondes/ondes hertziennes)",
    explication: "Le wifi, comme la téléphonie cellulaire ou la RFID, utilise des ondes électromagnétiques du domaine des ondes radio/micro-ondes (fréquences de l'ordre du GHz)."
  },

  {
    question: "Qu'ont en commun tous les objets de la vie courante utilisant des ondes électromagnétiques (wifi, télécommande infrarouge, badge RFID, lampe UV) ?",
    options: [
      "Ils émettent tous de la lumière visible",
      "Ils exploitent tous une onde électromagnétique pour transmettre ou recevoir de l'information ou de l'énergie",
      "Ils fonctionnent tous uniquement avec des ondes sonores",
      "Ils n'ont aucun point commun"
    ],
    bonne_reponse: "Ils exploitent tous une onde électromagnétique pour transmettre ou recevoir de l'information ou de l'énergie",
    explication: "Chacun de ces objets utilise une onde électromagnétique, dans une gamme de longueur d'onde différente, pour transmettre de l'information (wifi, RFID, télécommande) ou de l'énergie."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
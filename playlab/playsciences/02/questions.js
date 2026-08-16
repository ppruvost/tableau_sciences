/* ============================================================
   ============  QUIZ PLAYSCIENCES — CHIMIE 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "On dilue 10 mL d'une solution mère 5 fois. Quel volume de solution fille obtient-on ?",
    options: [
      "2 mL",
      "10 mL",
      "50 mL",
      "5 mL"
    ],
    bonne_reponse: "50 mL",
    explication: "Un facteur de dilution de 5 signifie que le volume final est 5 fois plus grand : 10 × 5 = 50 mL."
  },

  {
    question: "D'après ce schéma de dilution, quelle relation relie les concentrations et volumes des solutions mère et fille ?",
    graphique: "img/q1.png",
    options: [
      "C1 × V1 = C2 × V2",
      "C1 + V1 = C2 + V2",
      "C1 / V1 = C2 / V2",
      "C1 − V1 = C2 − V2"
    ],
    bonne_reponse: "C1 × V1 = C2 × V2",
    explication: "Lors d'une dilution, la quantité de matière de soluté est conservée : n = C1×V1 = C2×V2."
  },

  {
    question: "On veut préparer 250 mL d'une solution à 0,10 mol/L à partir d'une solution mère à 0,50 mol/L. Quel volume de solution mère faut-il prélever ?",
    options: [
      "25 mL",
      "50 mL",
      "125 mL",
      "5 mL"
    ],
    bonne_reponse: "50 mL",
    explication: "V1 = (C2×V2)/C1 = (0,10×250)/0,50 = 50 mL."
  },

  {
    question: "Quelle est l'unité de la concentration en quantité de matière (concentration molaire) ?",
    options: [
      "g/L",
      "mol/L",
      "mol",
      "g/mol"
    ],
    bonne_reponse: "mol/L",
    explication: "La concentration molaire C est le rapport de la quantité de matière de soluté (en mol) sur le volume de solution (en L)."
  },

  {
    question: "Pour préparer une solution de concentration molaire donnée par dissolution, quelle donnée doit-on d'abord calculer à partir de la quantité de matière souhaitée ?",
    options: [
      "La masse de soluté à peser, à l'aide de la masse molaire",
      "La couleur attendue de la solution",
      "La température d'ébullition du solvant",
      "La densité du solvant"
    ],
    bonne_reponse: "La masse de soluté à peser, à l'aide de la masse molaire",
    explication: "On calcule la masse à peser par m = n × M (quantité de matière visée multipliée par la masse molaire), avant de dissoudre ce soluté dans le volume de solvant voulu."
  },

  {
    question: "Quel est le principe d'un titrage par équivalence ?",
    options: [
      "Peser directement le soluté à doser",
      "Verser progressivement une solution titrante de concentration connue jusqu'à l'équivalence, pour en déduire une concentration inconnue",
      "Chauffer la solution jusqu'à évaporation complète",
      "Filtrer la solution pour isoler le soluté"
    ],
    bonne_reponse: "Verser progressivement une solution titrante de concentration connue jusqu'à l'équivalence, pour en déduire une concentration inconnue",
    explication: "Un titrage consiste à verser une solution titrante jusqu'au repérage de l'équivalence, ce qui permet de calculer la concentration inconnue de la solution titrée."
  },

  {
    question: "Sur ce montage de titrage, quel volume doit-on relever à l'équivalence pour calculer la concentration Ca inconnue ?",
    graphique: "img/q6.png",
    options: [
      "Le volume initial de l'erlenmeyer",
      "Le volume de solution titrante versé (Veq)",
      "Le volume total de la burette",
      "La masse de l'erlenmeyer"
    ],
    bonne_reponse: "Le volume de solution titrante versé (Veq)",
    explication: "On relève le volume Veq versé depuis la burette au virage, puis on utilise Ca×Va = Cb×Veq pour calculer Ca."
  },

  {
    question: "À l'équivalence d'un titrage acido-basique, on a Ca×Va = Cb×Veq. Si Va = 20 mL, Cb = 0,10 mol/L et Veq = 15 mL, quelle est la concentration Ca ?",
    options: [
      "0,075 mol/L",
      "0,13 mol/L",
      "0,30 mol/L",
      "1,5 mol/L"
    ],
    bonne_reponse: "0,075 mol/L",
    explication: "Ca = (Cb × Veq) / Va = (0,10 × 15) / 20 = 0,075 mol/L."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
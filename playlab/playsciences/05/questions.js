/* ============================================================
   ============  QUIZ PLAYSCIENCES — ACOUSTIQUE 2NDE  ============
   ============================================================ */

window.questions = [

  {
    question: "Voici deux signaux sonores enregistrés. Lequel a la fréquence la plus élevée ?",
    graphique: "img/q1.png",
    options: [
      "Le son A",
      "Le son B",
      "Les deux ont la même fréquence",
      "On ne peut pas comparer deux signaux périodiques"
    ],
    bonne_reponse: "Le son B",
    explication: "Le son B présente davantage d'oscillations sur la même durée : sa fréquence est donc plus élevée."
  },

  {
    question: "Quelle relation relie la fréquence f et la période T d'un son pur ?",
    options: [
      "f = T",
      "f = 1/T",
      "f = T²",
      "f = 2T"
    ],
    bonne_reponse: "f = 1/T",
    explication: "La fréquence f (Hz) est l'inverse de la période T (s) : f = 1/T."
  },

  {
    question: "Un son de fréquence 100 Hz est-il grave ou aigu ?",
    options: [
      "Grave",
      "Aigu",
      "Ni grave ni aigu",
      "Inaudible"
    ],
    bonne_reponse: "Grave",
    explication: "Plus la fréquence est basse, plus le son est grave."
  },

  {
    question: "D'après cette échelle de niveau d'intensité acoustique, à partir de quel seuil environ un son devient-il dangereux pour l'audition en exposition prolongée ?",
    graphique: "img/q4.png",
    options: [
      "Autour de 20 dB",
      "Autour de 60 dB",
      "Autour de 90 dB",
      "Il n'existe aucun seuil de danger"
    ],
    bonne_reponse: "Autour de 90 dB",
    explication: "Au-delà d'environ 90 dB, une exposition prolongée présente un risque réel pour l'audition."
  },

  {
    question: "Classer ces trois sons du plus grave au plus aigu : un son de 200 Hz, un son de 2000 Hz, un son de 50 Hz.",
    options: [
      "50 Hz < 200 Hz < 2000 Hz",
      "2000 Hz < 200 Hz < 50 Hz",
      "200 Hz < 50 Hz < 2000 Hz",
      "Tous ont la même hauteur"
    ],
    bonne_reponse: "50 Hz < 200 Hz < 2000 Hz",
    explication: "La hauteur d'un son croît avec sa fréquence."
  },

  {
    question: "Ce graphique compare l'atténuation sonore de l'air seul et de la laine de verre. Que peut-on en conclure sur les isolants phoniques efficaces ?",
    graphique: "img/q6.png",
    options: [
      "Un bon isolant phonique atténue fortement le son qui le traverse, contrairement à l'air seul",
      "Un bon isolant phonique laisse passer le son sans l'atténuer",
      "L'air est le meilleur isolant phonique connu",
      "L'atténuation ne dépend jamais du matériau traversé"
    ],
    bonne_reponse: "Un bon isolant phonique atténue fortement le son qui le traverse, contrairement à l'air seul",
    explication: "Un isolant phonique comme la laine de verre absorbe une grande partie de l'énergie sonore, provoquant une atténuation bien plus importante que la simple traversée de l'air."
  },

  {
    question: "Quelle grandeur mesure-t-on pour comparer l'efficacité de plusieurs matériaux isolants phoniques ?",
    options: [
      "Le niveau d'intensité acoustique avant et après traversée du matériau",
      "La couleur du matériau",
      "Sa masse volumique uniquement",
      "Sa conductivité électrique"
    ],
    bonne_reponse: "Le niveau d'intensité acoustique avant et après traversée du matériau",
    explication: "On compare le niveau sonore mesuré avant et après la traversée du matériau : plus la différence (atténuation) est grande, plus l'isolant est efficace."
  },

  {
    question: "Dans cette chaîne de transmission, quel est le rôle de l'émetteur piézoélectrique, avant que le récepteur ne convertisse le signal reçu ?",
    graphique: "img/q8.png",
    options: [
      "Convertir un signal électrique en vibration mécanique produisant une onde sonore",
      "Amplifier uniquement le son ambiant",
      "Convertir directement le son en image",
      "Bloquer la propagation du son"
    ],
    bonne_reponse: "Convertir un signal électrique en vibration mécanique produisant une onde sonore",
    explication: "L'émetteur piézoélectrique convertit un signal électrique en vibration mécanique, générant ainsi l'onde sonore transmise, avant que le récepteur ne réalise l'opération inverse."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
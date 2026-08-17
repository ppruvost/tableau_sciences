/* ============================================================
   ============  QUIZ PLAYSCIENCES — ACOUSTIQUE 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Cette expérience place une sonnerie sous une cloche mise progressivement sous vide. Que peut-on en conclure ?",
    graphique: "img/q1.png",
    options: [
      "Le son se propage aussi bien dans le vide que dans l'air",
      "La propagation d'un son nécessite un milieu matériel",
      "Le vide amplifie le son",
      "Le son et la lumière se comportent de la même façon dans le vide"
    ],
    bonne_reponse: "La propagation d'un son nécessite un milieu matériel",
    explication: "Le son de la sonnerie disparaît progressivement quand l'air est retiré : contrairement à la lumière, le son a besoin d'un milieu matériel pour se propager."
  },

  {
    question: "Dans quel milieu le son se propage-t-il le plus vite ?",
    options: [
      "Dans l'air",
      "Dans l'eau",
      "Le son ne se propage que dans l'air",
      "La vitesse du son est la même dans tous les milieux"
    ],
    bonne_reponse: "Dans l'eau",
    explication: "La vitesse du son vaut environ 340 m/s dans l'air contre environ 1500 m/s dans l'eau, un milieu plus dense."
  },

  {
    question: "Deux microphones espacés d'une distance d captent un même signal avec un retard τ entre les deux réceptions, comme sur ce schéma d'acquisition ExAO. Comment détermine-t-on la vitesse de propagation du son ?",
    graphique: "img/q4.png",
    options: [
      "v = d × τ",
      "v = d / τ",
      "v = τ / d",
      "v = d + τ"
    ],
    bonne_reponse: "v = d / τ",
    explication: "En mesurant le retard τ, on calcule la vitesse de propagation par v = d/τ (méthode ExAO par corrélation croisée)."
  },

  {
    question: "Un système ExAO mesure un retard τ = 6 ms entre deux microphones distants de 2,04 m. Quelle est la vitesse de propagation mesurée (arrondie) ?",
    options: [
      "12,24 m/s",
      "340 m/s",
      "0,34 m/s",
      "3,4 m/s"
    ],
    bonne_reponse: "340 m/s",
    explication: "v = d/τ = 2,04 / 0,006 = 340 m/s."
  },

  {
    question: "Quelle relation relie la vitesse de propagation v, la longueur d'onde λ et la fréquence f d'une onde sonore ?",
    options: [
      "v = λ × f",
      "v = λ / f",
      "v = f / λ",
      "v = λ + f"
    ],
    bonne_reponse: "v = λ × f",
    explication: "v = λ × f, soit aussi λ = v/f."
  },

  {
    question: "Un son se propage dans l'air à 340 m/s avec une fréquence de 680 Hz. Quelle est sa longueur d'onde ?",
    options: [
      "0,5 m",
      "2 m",
      "231 200 m",
      "1,5 m"
    ],
    bonne_reponse: "0,5 m",
    explication: "λ = v/f = 340/680 = 0,5 m."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
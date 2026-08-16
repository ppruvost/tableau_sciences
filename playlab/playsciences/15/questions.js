/* ============================================================
   ============  QUIZ PLAYSCIENCES — MECANIQUE TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce schéma, une force F est appliquée à une distance d (bras de levier) de l'axe de rotation O. Quelle relation donne le moment de cette force ?",
    graphique: "img/q1.png",
    options: [
      "M = F × d",
      "M = F / d",
      "M = F + d",
      "M = d / F"
    ],
    bonne_reponse: "M = F × d",
    explication: "M = F × d, exprimé en N·m."
  },

  {
    question: "À l'équilibre, un solide mobile autour d'un axe fixe soumis à plusieurs forces vérifie :",
    options: [
      "La somme des moments des forces appliquées est nulle",
      "La somme des forces appliquées est infinie",
      "Une seule force peut être appliquée",
      "Le solide doit nécessairement être en mouvement"
    ],
    bonne_reponse: "La somme des moments des forces appliquées est nulle",
    explication: "Théorème des moments : à l'équilibre, la somme algébrique des moments est nulle."
  },

  {
    question: "Un opérateur exerce une force de 40 N à 0,3 m de l'axe d'un tournevis dynamométrique. Quel est le moment de cette force ?",
    options: [
      "12 N·m",
      "13,3 N·m",
      "40,3 N·m",
      "120 N·m"
    ],
    bonne_reponse: "12 N·m",
    explication: "M = F × d = 40 × 0,3 = 12 N·m."
  },

  {
    question: "Ce schéma représente un objet immergé, soumis à son poids et à la poussée d'Archimède. Quels sont les deux paramètres qui déterminent la valeur de la poussée d'Archimède ?",
    graphique: "img/q4.png",
    options: [
      "La masse volumique du fluide et le volume immergé de l'objet",
      "La couleur de l'objet et sa forme",
      "La température du fluide uniquement",
      "La masse de l'objet uniquement"
    ],
    bonne_reponse: "La masse volumique du fluide et le volume immergé de l'objet",
    explication: "La poussée d'Archimède dépend de la masse volumique du fluide et du volume immergé de l'objet."
  },

  {
    question: "Que dit la relation de Pascal pour un fluide incompressible au repos, comme celui représenté dans un vase clos ?",
    options: [
      "Toute variation de pression en un point se transmet intégralement en tout point du fluide",
      "La pression est nulle en tout point du fluide",
      "Seule la surface du fluide subit une pression",
      "La pression ne dépend que de la température"
    ],
    bonne_reponse: "Toute variation de pression en un point se transmet intégralement en tout point du fluide",
    explication: "Le principe de Pascal explique le fonctionnement d'une presse ou d'un vérin hydraulique : toute variation de pression se transmet intégralement en tout point d'un fluide incompressible au repos."
  },

  {
    question: "Quelle relation permet de calculer le débit volumique Qv d'un fluide en mouvement à partir de sa vitesse d'écoulement v et de la section S du conduit ?",
    options: [
      "Qv = v × S",
      "Qv = v / S",
      "Qv = v + S",
      "Qv = S / v"
    ],
    bonne_reponse: "Qv = v × S",
    explication: "Qv = v × S."
  },

  {
    question: "Ce graphique représente l'amplitude d'oscillation d'un système mécanique en fonction de la fréquence d'excitation. Que se passe-t-il lorsque la fréquence d'excitation se rapproche de la fréquence propre du système ?",
    graphique: "img/q7.png",
    options: [
      "L'amplitude d'oscillation diminue fortement",
      "L'amplitude d'oscillation devient maximale : c'est le phénomène de résonance",
      "Le système s'arrête complètement de vibrer",
      "Rien de particulier ne se produit"
    ],
    bonne_reponse: "L'amplitude d'oscillation devient maximale : c'est le phénomène de résonance",
    explication: "La résonance mécanique se produit lorsque la fréquence d'excitation d'un système se rapproche de sa fréquence propre, provoquant une amplification importante de l'amplitude d'oscillation."
  },

  {
    question: "Pourquoi la résonance mécanique doit-elle être surveillée dans la conception d'un pont ou d'un bâtiment ?",
    options: [
      "Parce qu'une excitation à la fréquence propre de la structure peut provoquer des oscillations dangereusement amplifiées",
      "Parce qu'elle rend toujours la structure plus solide",
      "Parce qu'elle n'a aucun effet mécanique réel",
      "Parce qu'elle ne concerne que les circuits électriques"
    ],
    bonne_reponse: "Parce qu'une excitation à la fréquence propre de la structure peut provoquer des oscillations dangereusement amplifiées",
    explication: "Si une structure est excitée à une fréquence proche de sa fréquence propre, le phénomène de résonance peut amplifier dangereusement les oscillations et endommager voire détruire la structure."
  },

  {
    question: "Ce schéma représente un fluide s'écoulant dans une canalisation présentant un étranglement (effet Venturi). Que se passe-t-il au niveau de l'étranglement, où la vitesse d'écoulement augmente ?",
    graphique: "img/q9.png",
    options: [
      "La pression du fluide y diminue",
      "La pression du fluide y augmente",
      "La pression reste rigoureusement constante",
      "Le débit y devient nul"
    ],
    bonne_reponse: "La pression du fluide y diminue",
    explication: "L'effet Venturi montre que, dans un étranglement où la vitesse du fluide augmente (conservation du débit), la pression statique diminue ; ce principe explique aussi la portance d'une aile ou la traînée d'un objet dans un fluide."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
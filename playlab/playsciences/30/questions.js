/* ============================================================
   ============  QUIZ PLAYSCIENCES — A4. Propagation du son (1ère)  ============
   ============================================================ */

window.questions = [

  {
    question: "Le son a besoin, pour se propager, d'un :",
    options: [
      "Milieu matériel (solide, liquide ou gaz)",
      "Vide total",
      "Champ magnétique",
      "Champ électrique uniquement"
    ],
    bonne_reponse: "Milieu matériel (solide, liquide ou gaz)",
    explication: "Contrairement à la lumière, le son est une onde mécanique : il ne peut pas se propager dans le vide."
  },

  {
    question: "Dans le vide, contrairement à l'air, le son :",
    options: [
      "Se propage plus vite",
      "Ne peut pas se propager",
      "Se propage à la même vitesse",
      "Devient plus grave"
    ],
    bonne_reponse: "Ne peut pas se propager",
    explication: "L'absence de matière dans le vide empêche toute transmission de l'onde sonore mécanique."
  },

  {
    question: "La vitesse du son dans l'air à température ambiante est environ :",
    options: [
      "340 m/s",
      "3 × 10⁸ m/s",
      "1500 m/s",
      "34 m/s"
    ],
    bonne_reponse: "340 m/s",
    explication: "Dans l'air, à 20°C, le son se propage à environ 340 m/s, bien plus lentement que la lumière."
  },

  {
    question: "La vitesse du son est généralement plus élevée dans :",
    options: [
      "Les solides que dans les liquides et les gaz",
      "Le vide",
      "Les gaz uniquement",
      "L'air raréfié"
    ],
    bonne_reponse: "Les solides que dans les liquides et les gaz",
    explication: "Plus le milieu est dense et rigide (solide > liquide > gaz), plus les particules transmettent rapidement la vibration."
  },

  {
    question: "La relation entre la longueur d'onde λ, la vitesse v et la fréquence f est :",
    options: [
      "λ = v × f",
      "λ = v / f",
      "λ = f / v",
      "λ = v + f"
    ],
    bonne_reponse: "λ = v / f",
    explication: "La longueur d'onde λ (en m) est égale à la vitesse de propagation v divisée par la fréquence f."
  },

  {
    question: "Un son de fréquence 1000 Hz se propage dans l'air à 340 m/s. Sa longueur d'onde est environ :",
    options: [
      "0,34 m",
      "3,4 m",
      "340 m",
      "1000 m"
    ],
    bonne_reponse: "0,34 m",
    explication: "λ = v/f = 340/1000 = 0,34 m."
  },

  {
    question: "Une acquisition ExAO (expérimentation assistée par ordinateur) permet de :",
    options: [
      "Mesurer et enregistrer en temps réel un signal (ex : pression sonore)",
      "Uniquement dessiner des schémas",
      "Remplacer totalement l'expérience réelle",
      "Calculer une masse molaire"
    ],
    bonne_reponse: "Mesurer et enregistrer en temps réel un signal (ex : pression sonore)",
    explication: "L'ExAO utilise des capteurs reliés à un ordinateur pour acquérir et visualiser un signal physique en temps réel."
  },

  {
    question: "Grâce à l'ExAO, on peut mesurer le décalage temporel entre deux capteurs de son pour en déduire :",
    options: [
      "La vitesse de propagation du son",
      "La couleur du son",
      "La masse molaire de l'air",
      "Le pH du milieu"
    ],
    bonne_reponse: "La vitesse de propagation du son",
    explication: "En connaissant la distance entre les deux capteurs et le décalage temporel mesuré, on calcule v = d/Δt."
  },

  {
    question: "Si la température de l'air augmente, la vitesse du son :",
    options: [
      "Augmente légèrement",
      "Diminue fortement",
      "Reste rigoureusement identique",
      "Devient nulle"
    ],
    bonne_reponse: "Augmente légèrement",
    explication: "La vitesse du son dans l'air augmente avec la température, car l'agitation des molécules facilite la transmission de la vibration."
  },

  {
    question: "Le son ne se propage pas dans l'espace entre deux astronautes en dehors de leur vaisseau car :",
    options: [
      "Il fait trop froid",
      "L'espace est un vide, sans milieu matériel pour transmettre le son",
      "La gravité est trop faible",
      "La lumière bloque le son"
    ],
    bonne_reponse: "L'espace est un vide, sans milieu matériel pour transmettre le son",
    explication: "En l'absence de matière (vide spatial), aucune onde mécanique comme le son ne peut se propager."
  }
];

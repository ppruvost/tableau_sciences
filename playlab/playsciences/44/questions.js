/* ============================================================
   ============  QUIZ PLAYSCIENCES — T2. Équilibre thermique (2nde)  ============
   ============================================================ */

window.questions = [

  {
    question: "Lorsqu'on mélange de l'eau chaude et de l'eau froide dans un récipient isolé, à l'équilibre thermique, les deux parties atteignent :",
    options: [
      "Une même température finale",
      "Deux températures différentes indéfiniment",
      "La température la plus haute des deux",
      "La température la plus basse des deux"
    ],
    bonne_reponse: "Une même température finale",
    explication: "À l'équilibre thermique, en l'absence de pertes, les deux corps en contact atteignent une température commune."
  },

  {
    question: "Dans un système isolé, l'énergie thermique cédée par le corps chaud est :",
    options: [
      "Égale à l'énergie thermique reçue par le corps froid (en valeur absolue)",
      "Toujours perdue dans l'environnement",
      "Sans rapport avec l'énergie reçue par le corps froid",
      "Nulle"
    ],
    bonne_reponse: "Égale à l'énergie thermique reçue par le corps froid (en valeur absolue)",
    explication: "Le principe de conservation de l'énergie, dans un système isolé, impose que l'énergie cédée par l'un soit intégralement reçue par l'autre."
  },

  {
    question: "L'énergie thermique Q échangée par un corps de masse m, de capacité thermique massique c, subissant une variation de température Δθ, vaut :",
    options: [
      "Q = m × c × Δθ",
      "Q = m / (c × Δθ)",
      "Q = m + c + Δθ",
      "Q = c / (m × Δθ)"
    ],
    bonne_reponse: "Q = m × c × Δθ",
    explication: "La formule Q = mcΔθ relie l'énergie thermique échangée à la masse, la capacité thermique massique et la variation de température."
  },

  {
    question: "La capacité thermique massique de l'eau est d'environ :",
    options: [
      "4185 J/(kg·K)",
      "1 J/(kg·K)",
      "100 J/(kg·K)",
      "0,001 J/(kg·K)"
    ],
    bonne_reponse: "4185 J/(kg·K)",
    explication: "L'eau possède une capacité thermique massique élevée (≈ 4185 J/(kg·K)), ce qui la rend efficace pour stocker de la chaleur."
  },

  {
    question: "Quelle énergie faut-il pour élever la température de 2 kg d'eau de 20°C à 40°C (c = 4185 J/(kg·K)) ?",
    options: [
      "167 400 J",
      "8370 J",
      "4185 J",
      "83 700 J"
    ],
    bonne_reponse: "167 400 J",
    explication: "Q = m×c×Δθ = 2×4185×20 = 167 400 J."
  },

  {
    question: "Le suivi temporel de la température d'un mélange lors de l'équilibre thermique permet de :",
    options: [
      "Observer l'évolution de la température jusqu'à stabilisation",
      "Mesurer directement une masse",
      "Mesurer directement un pH",
      "Déterminer une couleur"
    ],
    bonne_reponse: "Observer l'évolution de la température jusqu'à stabilisation",
    explication: "En enregistrant la température au cours du temps, on visualise la convergence progressive vers la température d'équilibre."
  },

  {
    question: "Sur une courbe de suivi temporel de température lors d'un mélange, le palier final atteint représente :",
    options: [
      "La température d'équilibre du système",
      "La température initiale du corps froid",
      "La température initiale du corps chaud",
      "Une erreur de mesure"
    ],
    bonne_reponse: "La température d'équilibre du système",
    explication: "Une fois l'équilibre atteint, la température ne varie plus : la courbe forme un palier correspondant à la température finale commune."
  },

  {
    question: "Si le récipient utilisé pour le mélange n'est pas parfaitement isolé, la température mesurée à l'équilibre :",
    options: [
      "S'écarte légèrement de la valeur théorique à cause des pertes vers l'extérieur",
      "Reste rigoureusement égale à la valeur théorique",
      "Devient négative",
      "N'a plus aucun sens physique"
    ],
    bonne_reponse: "S'écarte légèrement de la valeur théorique à cause des pertes vers l'extérieur",
    explication: "Les pertes thermiques vers le milieu extérieur (non isolé) introduisent un écart entre la mesure expérimentale et le calcul théorique idéal."
  },

  {
    question: "Pour un système isolé constitué de deux corps 1 et 2, on peut écrire :",
    options: [
      "Q₁ + Q₂ = 0",
      "Q₁ = Q₂",
      "Q₁ × Q₂ = 0",
      "Q₁ − Q₂ = constante non nulle"
    ],
    bonne_reponse: "Q₁ + Q₂ = 0",
    explication: "La conservation de l'énergie dans le système isolé impose que la somme des énergies échangées par les deux corps soit nulle."
  },

  {
    question: "Un corps qui cède de l'énergie thermique (il se refroidit) a une énergie échangée Q :",
    options: [
      "Négative par convention",
      "Toujours positive",
      "Toujours nulle",
      "Égale à sa masse"
    ],
    bonne_reponse: "Négative par convention",
    explication: "Par convention thermodynamique, l'énergie cédée par un système est comptée négativement, celle reçue positivement."
  }
];

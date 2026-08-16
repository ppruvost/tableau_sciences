/* ============================================================
   ============  QUIZ PLAYSCIENCES — THERMIQUE 2NDE B  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce graphique, deux corps de températures initiales différentes sont mis en contact. Que peut-on observer au bout d'un certain temps ?",
    graphique: "img/q1.png",
    options: [
      "Les deux corps atteignent progressivement une même température d'équilibre",
      "Le corps froid continue de refroidir indéfiniment",
      "Le corps chaud continue de chauffer indéfiniment",
      "Les deux températures divergent l'une de l'autre"
    ],
    bonne_reponse: "Les deux corps atteignent progressivement une même température d'équilibre",
    explication: "Deux corps en contact, initialement à des températures différentes, évoluent spontanément vers un état d'équilibre thermique, où ils atteignent une température commune."
  },

  {
    question: "Que nécessite l'élévation de température d'un corps ?",
    options: [
      "Un apport d'énergie",
      "Une perte d'énergie",
      "Aucun échange d'énergie n'est nécessaire",
      "Uniquement un changement de pression"
    ],
    bonne_reponse: "Un apport d'énergie",
    explication: "Élever la température d'un corps nécessite de lui apporter de l'énergie, généralement sous forme de transfert thermique."
  },

  {
    question: "Comment appelle-t-on le mode de transfert d'énergie entre deux corps de températures différentes ?",
    options: [
      "Le travail",
      "La chaleur (transfert thermique)",
      "Le rayonnement uniquement",
      "La pression"
    ],
    bonne_reponse: "La chaleur (transfert thermique)",
    explication: "La chaleur désigne le transfert d'énergie thermique qui s'établit spontanément entre deux corps de températures différentes, du plus chaud vers le plus froid."
  },

  {
    question: "Dans quelle unité s'exprime l'énergie échangée sous forme thermique ?",
    options: [
      "Le joule (J)",
      "Le degré Celsius (°C)",
      "Le kelvin (K)",
      "Le pascal (Pa)"
    ],
    bonne_reponse: "Le joule (J)",
    explication: "L'énergie, y compris l'énergie échangée sous forme thermique, s'exprime en joules (J) dans le Système international."
  },

  {
    question: "Quelle relation permet de calculer l'énergie thermique Q échangée par un corps de masse m et de capacité thermique massique c, dont la température varie de Δθ ?",
    options: [
      "Q = m × c × Δθ",
      "Q = m + c + Δθ",
      "Q = m / (c × Δθ)",
      "Q = c / (m × Δθ)"
    ],
    bonne_reponse: "Q = m × c × Δθ",
    explication: "Q = m × c × Δθ, où c est la capacité thermique massique du corps (en J/(kg·K))."
  },

  {
    question: "1 kg d'eau (c = 4185 J/(kg·K)) passe de 20 °C à 60 °C. Quelle énergie thermique a-t-elle reçue ?",
    options: [
      "Environ 167 400 J",
      "Environ 4185 J",
      "Environ 41 850 J",
      "Environ 837 000 J"
    ],
    bonne_reponse: "Environ 167 400 J",
    explication: "Q = m×c×Δθ = 1 × 4185 × (60−20) = 4185 × 40 = 167 400 J."
  },

  {
    question: "Sur ce graphique de suivi temporel de la température d'un corps pur lors d'un changement d'état, que remarque-t-on pendant le palier (entre 4 et 8 minutes) ?",
    graphique: "img/q7.png",
    options: [
      "La température reste constante malgré l'apport ou la perte d'énergie",
      "La température continue d'augmenter normalement",
      "La température chute brutalement",
      "Aucun changement particulier ne se produit"
    ],
    bonne_reponse: "La température reste constante malgré l'apport ou la perte d'énergie",
    explication: "Lors d'un changement d'état d'un corps pur, la température reste constante (palier) tant que le changement d'état n'est pas achevé, même si le corps continue à échanger de l'énergie thermique."
  },

  {
    question: "Quelle relation permet de calculer l'énergie Q nécessaire pour faire changer d'état une masse m d'un corps pur, de chaleur latente de changement d'état L ?",
    options: [
      "Q = m × L",
      "Q = m + L",
      "Q = m / L",
      "Q = L / m"
    ],
    bonne_reponse: "Q = m × L",
    explication: "Q = m × L, où L est la chaleur latente massique de changement d'état (en J/kg), par exemple de fusion ou de vaporisation."
  },

  {
    question: "Quel bilan énergétique décrit correctement le passage complet d'un glaçon à 0 °C à de l'eau liquide à 20 °C ?",
    options: [
      "Une énergie de fusion (palier à 0 °C) suivie d'une énergie d'échauffement du liquide de 0 °C à 20 °C",
      "Une seule étape d'échauffement sans changement d'état",
      "Un unique transfert d'énergie, sans distinction d'étapes",
      "Aucune énergie n'est nécessaire, le processus est spontané et gratuit"
    ],
    bonne_reponse: "Une énergie de fusion (palier à 0 °C) suivie d'une énergie d'échauffement du liquide de 0 °C à 20 °C",
    explication: "Le bilan énergétique complet distingue l'énergie de changement d'état (Q = mL, à température constante) de l'énergie d'échauffement du corps (Q = mcΔθ, à un seul état physique) ; l'énergie totale reçue est la somme de ces deux contributions."
  },

  {
    question: "Quelle source d'erreur peut fausser le relevé précis du palier de température lors d'un changement d'état ?",
    options: [
      "Le temps de réponse du capteur ou une mauvaise homogénéité du bain de température",
      "La couleur du récipient utilisé",
      "Le jour de la semaine où l'expérience est réalisée",
      "Le nombre de personnes présentes dans la salle"
    ],
    bonne_reponse: "Le temps de réponse du capteur ou une mauvaise homogénéité du bain de température",
    explication: "Le temps de réponse du capteur (retard à afficher la vraie température) et une homogénéité insuffisante du bain (gradients de température) sont des sources d'erreur classiques lors du relevé expérimental d'un palier de changement d'état."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
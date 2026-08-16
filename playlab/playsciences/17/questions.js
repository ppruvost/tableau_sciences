/* ============================================================
   ============  QUIZ PLAYSCIENCES — SIGNAUX TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "On distingue deux modes de propagation d'un signal de transmission d'informations. Que représentent ces deux schémas ?",
    graphique: "img/q1.png",
    options: [
      "Deux exemples de propagation libre uniquement",
      "Une propagation libre (à gauche) et une propagation guidée (à droite, dans un câble ou une fibre)",
      "Deux exemples de propagation guidée",
      "Il n'y a aucune différence entre les deux schémas"
    ],
    bonne_reponse: "Une propagation libre (à gauche) et une propagation guidée (à droite, dans un câble ou une fibre)",
    explication: "En propagation libre, l'onde se propage dans toutes les directions de l'espace (ondes radio dans l'air, par exemple) ; en propagation guidée, l'onde est confinée dans un support matériel comme un câble électrique ou une fibre optique."
  },

  {
    question: "Quels types d'ondes peuvent être utilisés dans un système de transmission d'informations de la vie courante ?",
    options: [
      "Uniquement des ondes sonores",
      "Uniquement des ondes électromagnétiques",
      "Des ondes sonores, lumineuses ou électromagnétiques, selon le système",
      "Aucune onde n'est nécessaire pour transmettre une information"
    ],
    bonne_reponse: "Des ondes sonores, lumineuses ou électromagnétiques, selon le système",
    explication: "Selon la technologie utilisée, un système de transmission d'informations peut s'appuyer sur des ondes sonores (téléphonie filaire ancienne), lumineuses (fibre optique) ou électromagnétiques (wifi, téléphonie mobile)."
  },

  {
    question: "Quels sont les trois éléments principaux indispensables à toute chaîne de transmission d'informations ?",
    options: [
      "Un émetteur, un canal de propagation, un récepteur",
      "Une pile, une résistance, un interrupteur",
      "Une lentille, un miroir, un prisme",
      "Un aimant, une bobine, un générateur"
    ],
    bonne_reponse: "Un émetteur, un canal de propagation, un récepteur",
    explication: "Toute chaîne de transmission d'informations comprend un émetteur qui produit le signal, un canal (guidé ou libre) qui le propage, et un récepteur qui le capte et le restitue."
  },

  {
    question: "Ce schéma illustre le principe de fonctionnement d'une fibre optique. Sur quel phénomène physique repose-t-il ?",
    graphique: "img/q4.png",
    options: [
      "La diffraction de la lumière",
      "La réflexion totale à l'interface entre le cœur et la gaine optique",
      "L'absorption totale de la lumière par la gaine",
      "La dispersion de la lumière blanche"
    ],
    bonne_reponse: "La réflexion totale à l'interface entre le cœur et la gaine optique",
    explication: "Le fonctionnement d'une fibre optique repose sur le phénomène de réflexion totale : la lumière, arrivant avec un angle d'incidence supérieur à l'angle limite à l'interface cœur/gaine (indice n1 > n2), est intégralement réfléchie et reste ainsi guidée à l'intérieur de la fibre."
  },

  {
    question: "Pourquoi le cœur d'une fibre optique a-t-il un indice de réfraction plus élevé que celui de sa gaine ?",
    options: [
      "Pour que la lumière puisse en sortir facilement",
      "Pour permettre la réflexion totale de la lumière à l'interface cœur/gaine et ainsi guider le signal lumineux",
      "Pour rendre la fibre plus solide mécaniquement",
      "L'indice de la gaine n'a aucune importance"
    ],
    bonne_reponse: "Pour permettre la réflexion totale de la lumière à l'interface cœur/gaine et ainsi guider le signal lumineux",
    explication: "La condition n1 > n2 (cœur plus réfringent que la gaine) est nécessaire pour que la réflexion totale puisse se produire à l'interface, ce qui permet de guider la lumière tout au long de la fibre sans qu'elle ne s'échappe."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
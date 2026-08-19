/* ============================================================
   ============  QUIZ PLAYSCIENCES — S2. Transmettre l'information (Tle)  ============
   ============================================================ */

window.questions = [

  {
    question: "La propagation libre d'une onde (ex : onde radio dans l'atmosphère) se fait :",
    options: [
      "Sans support matériel physique dédié, dans toutes les directions",
      "Uniquement à l'intérieur d'un câble",
      "Uniquement dans une fibre optique",
      "Jamais dans l'air"
    ],
    bonne_reponse: "Sans support matériel physique dédié, dans toutes les directions",
    explication: "En propagation libre, l'onde se déplace dans l'espace (air, vide) sans être canalisée par un guide physique."
  },

  {
    question: "La propagation guidée d'un signal se fait, par exemple, à travers :",
    options: [
      "Un câble ou une fibre optique",
      "L'espace libre uniquement",
      "Le vide interstellaire",
      "L'air uniquement"
    ],
    bonne_reponse: "Un câble ou une fibre optique",
    explication: "En propagation guidée, le signal est confiné et orienté par un support physique comme un câble coaxial ou une fibre optique."
  },

  {
    question: "Une chaîne de transmission de l'information comprend généralement, dans l'ordre :",
    options: [
      "Émetteur → canal de transmission → récepteur",
      "Récepteur → émetteur → canal",
      "Canal → récepteur → émetteur",
      "Il n'y a pas d'ordre logique"
    ],
    bonne_reponse: "Émetteur → canal de transmission → récepteur",
    explication: "L'information part de la source (émetteur), traverse un canal (guidé ou libre), puis est captée par le récepteur."
  },

  {
    question: "Le rôle du codeur/décodeur dans une chaîne de transmission est de :",
    options: [
      "Mettre en forme l'information pour la transmission puis la restituer à l'arrivée",
      "Amplifier uniquement le bruit",
      "Détruire l'information",
      "Remplacer le récepteur"
    ],
    bonne_reponse: "Mettre en forme l'information pour la transmission puis la restituer à l'arrivée",
    explication: "Le codage transforme l'information en un signal adapté au canal, le décodage réalise l'opération inverse à la réception."
  },

  {
    question: "Une fibre optique transmet l'information sous forme de :",
    options: [
      "Signal lumineux guidé par réflexion totale",
      "Signal électrique uniquement",
      "Signal sonore",
      "Ondes radio uniquement"
    ],
    bonne_reponse: "Signal lumineux guidé par réflexion totale",
    explication: "La lumière injectée dans le cœur de la fibre s'y propage en restant confinée grâce à des réflexions totales successives sur la gaine."
  },

  {
    question: "Comparée à un câble électrique, la fibre optique présente l'avantage de :",
    options: [
      "Ne pas être sensible aux perturbations électromagnétiques",
      "Coûter systématiquement moins cher",
      "Ne transmettre aucune information",
      "Nécessiter un courant électrique dans le cœur"
    ],
    bonne_reponse: "Ne pas être sensible aux perturbations électromagnétiques",
    explication: "L'information circulant sous forme de lumière, la fibre optique est insensible aux parasites électromagnétiques qui affectent les câbles électriques."
  },

  {
    question: "L'atténuation du signal dans un câble ou une fibre optique correspond à :",
    options: [
      "La perte progressive d'intensité du signal au cours de la propagation",
      "Une amplification automatique du signal",
      "Un changement de fréquence uniquement",
      "Une accélération du signal"
    ],
    bonne_reponse: "La perte progressive d'intensité du signal au cours de la propagation",
    explication: "Tout signal transmis perd de l'énergie en se propageant, ce qui nécessite parfois des répéteurs/amplificateurs sur de longues distances."
  },

  {
    question: "Un signal numérique, comparé à un signal analogique, présente l'avantage d'être :",
    options: [
      "Plus robuste face au bruit lors de la transmission",
      "Toujours plus lent",
      "Impossible à coder",
      "Sans aucune information"
    ],
    bonne_reponse: "Plus robuste face au bruit lors de la transmission",
    explication: "Un signal numérique (0/1) peut être régénéré facilement même après une atténuation ou un bruit modéré, contrairement à l'analogique."
  },

  {
    question: "La vitesse de propagation de la lumière dans une fibre optique est :",
    options: [
      "Inférieure à c, car elle dépend de l'indice de réfraction du cœur de la fibre",
      "Toujours égale à c comme dans le vide",
      "Supérieure à c",
      "Nulle"
    ],
    bonne_reponse: "Inférieure à c, car elle dépend de l'indice de réfraction du cœur de la fibre",
    explication: "Dans un milieu matériel d'indice n > 1, la lumière se propage à la vitesse v = c/n, donc plus lentement que dans le vide."
  },

  {
    question: "Les satellites de télécommunication utilisent une propagation :",
    options: [
      "Libre, à travers l'atmosphère et l'espace",
      "Uniquement guidée par câble",
      "Uniquement guidée par fibre optique",
      "Impossible en pratique"
    ],
    bonne_reponse: "Libre, à travers l'atmosphère et l'espace",
    explication: "Les ondes électromagnétiques échangées avec les satellites se propagent librement, sans guide physique, à travers l'atmosphère et le vide spatial."
  }
];

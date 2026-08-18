/* ============================================================
   ============  QUIZ PLAYSCIENCES — GEOMETRIE G02  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur cette représentation d'un pavé droit, quel logiciel permet de la construire et de la faire pivoter pour l'observer sous différents angles ?",
    graphique: "img/q1.png",
    options: [
      "Un logiciel de géométrie dynamique (comme GeoGebra 3D)",
      "Un tableur uniquement",
      "Un logiciel de traitement de texte",
      "Cela ne peut se faire qu'à la main, sans logiciel"
    ],
    bonne_reponse: "Un logiciel de géométrie dynamique (comme GeoGebra 3D)",
    explication: "Un logiciel de géométrie dynamique en 3D permet de représenter un solide usuel et de le manipuler (rotation, zoom) pour mieux visualiser sa structure spatiale."
  },

  {
    question: "Quelle est la convention utilisée en perspective cavalière pour représenter les arêtes cachées d'un solide sur un dessin en 2D ?",
    options: [
      "Elles sont tracées en pointillés",
      "Elles sont tracées en couleur rouge",
      "Elles ne sont jamais représentées",
      "Elles sont tracées plus épaisses que les arêtes visibles"
    ],
    bonne_reponse: "Elles sont tracées en pointillés",
    explication: "En perspective cavalière, les arêtes cachées d'un solide (non visibles depuis le point de vue choisi) sont conventionnellement représentées en traits pointillés."
  },

  {
    question: "Comment exploite-t-on la représentation d'un assemblage de solides usuels pour en calculer le volume total ?",
    options: [
      "En identifiant chaque solide usuel composant l'assemblage, puis en additionnant ou soustrayant leurs volumes respectifs",
      "En mesurant uniquement la hauteur totale de l'assemblage",
      "En ignorant les solides internes non visibles",
      "Le volume d'un assemblage ne peut jamais être calculé"
    ],
    bonne_reponse: "En identifiant chaque solide usuel composant l'assemblage, puis en additionnant ou soustrayant leurs volumes respectifs",
    explication: "Pour calculer le volume d'un assemblage de solides usuels, on décompose la figure en solides simples dont on connaît les formules de volume, puis on additionne ou soustrait ces volumes selon la construction."
  },

  {
    question: "Sur ce cube dont on réalise la section par un plan horizontal, quelle est la forme de la section obtenue ?",
    graphique: "img/q3.png",
    options: [
      "Un carré (ou un rectangle), parallèle à la face du cube",
      "Un cercle",
      "Un triangle",
      "La section n'a jamais de forme définie"
    ],
    bonne_reponse: "Un carré (ou un rectangle), parallèle à la face du cube",
    explication: "La section d'un cube par un plan parallèle à l'une de ses faces est un carré (de mêmes dimensions que la face si le plan est situé à l'intérieur du cube)."
  },

  {
    question: "Quelle est la forme de la section d'un cylindre de révolution par un plan perpendiculaire à son axe ?",
    options: [
      "Un cercle (ou un disque)",
      "Un carré",
      "Un triangle",
      "Une ellipse allongée"
    ],
    bonne_reponse: "Un cercle (ou un disque)",
    explication: "Un plan perpendiculaire à l'axe d'un cylindre de révolution le coupe selon un disque de même rayon que la base du cylindre."
  },

  {
    question: "Comment construit-on la section plane d'un solide passant par des points donnés situés sur ses arêtes ?",
    options: [
      "En reliant les points situés sur des faces communes du solide, en respectant le parallélisme des faces opposées",
      "En reliant les points au hasard, sans règle particulière",
      "En ignorant les faces du solide",
      "La section ne peut être construite qu'en 2D, jamais en 3D"
    ],
    bonne_reponse: "En reliant les points situés sur des faces communes du solide, en respectant le parallélisme des faces opposées",
    explication: "Construire une section plane consiste à relier progressivement les points donnés situés sur les arêtes, en utilisant notamment la propriété que les traces du plan sécant sur deux faces parallèles sont elles-mêmes parallèles."
  },

  {
    question: "Pourquoi la section d'une pyramide par un plan parallèle à sa base est-elle toujours semblable à cette base ?",
    options: [
      "Parce que le plan de section réalise un agrandissement ou une réduction de la base, selon sa position sur la hauteur de la pyramide",
      "Parce que toutes les sections d'une pyramide ont toujours la même taille",
      "Parce que la base et la section n'ont en réalité aucun rapport géométrique",
      "Cette propriété est fausse en général"
    ],
    bonne_reponse: "Parce que le plan de section réalise un agrandissement ou une réduction de la base, selon sa position sur la hauteur de la pyramide",
    explication: "Une section d'une pyramide par un plan parallèle à la base est l'image de la base par un agrandissement ou une réduction (homothétie) dont le rapport dépend de la position du plan sur la hauteur de la pyramide."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
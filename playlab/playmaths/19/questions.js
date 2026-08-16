/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce nuage de points est ajusté par une courbe non affine (logarithmique). Pourquoi choisit-on ce type de modèle plutôt qu'une droite ?",
    graphique: "img/q1.png",
    options: [
      "Parce que la forme du nuage de points suggère une évolution qui ralentit, mieux décrite par un modèle logarithmique qu'affine",
      "Parce qu'un ajustement affine est toujours faux",
      "Parce qu'un modèle logarithmique est toujours plus simple qu'une droite",
      "Le choix du modèle ne dépend jamais de la forme du nuage"
    ],
    bonne_reponse: "Parce que la forme du nuage de points suggère une évolution qui ralentit, mieux décrite par un modèle logarithmique qu'affine",
    explication: "Lorsque le nuage de points présente une croissance qui ralentit progressivement, un modèle logarithmique (ou un autre modèle non affine adapté) décrit souvent mieux la tendance qu'une simple droite."
  },

  {
    question: "Comment peut-on se ramener à un ajustement affine pour étudier un nuage de points suivant une évolution exponentielle y = k×qˣ ?",
    options: [
      "En effectuant le changement de variable z = ln(y), qui rend la relation entre x et z affine",
      "En multipliant simplement toutes les valeurs de y par x",
      "Ce type de nuage ne peut jamais être étudié",
      "En ajoutant une constante arbitraire à chaque valeur de y"
    ],
    bonne_reponse: "En effectuant le changement de variable z = ln(y), qui rend la relation entre x et z affine",
    explication: "Si y = k×qˣ, alors ln(y) = ln(k) + x×ln(q), ce qui est une relation affine entre x et z = ln(y) : on peut donc ajuster ce nouveau nuage de points (x ; z) par une droite."
  },

  {
    question: "Quel outil numérique permet de choisir et exploiter un modèle d'ajustement non affine adapté à un nuage de points ?",
    options: [
      "Un tableur ou une calculatrice proposant plusieurs types de régression (affine, exponentielle, logarithmique, puissance...)",
      "Uniquement une règle et un crayon",
      "Un dictionnaire papier",
      "Aucun outil numérique ne permet ce type d'ajustement"
    ],
    bonne_reponse: "Un tableur ou une calculatrice proposant plusieurs types de régression (affine, exponentielle, logarithmique, puissance...)",
    explication: "Les tableurs et calculatrices modernes proposent plusieurs types de régression, ce qui permet de comparer différents modèles d'ajustement et de choisir celui qui décrit le mieux le nuage de points observé."
  },

  {
    question: "Sur cet arbre pondéré à deux niveaux, quelle formule permet de calculer P(B), en utilisant la formule des probabilités totales ?",
    graphique: "img/q4.png",
    options: [
      "P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B)",
      "P(B) = P(A) + P(Ā)",
      "P(B) = P_A(B) × P_Ā(B)",
      "P(B) = P(A) − P(Ā)"
    ],
    bonne_reponse: "P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B)",
    explication: "La formule des probabilités totales, appliquée à la partition {A, Ā} de l'univers, permet de calculer P(B) en sommant les contributions de chaque chemin de l'arbre menant à B."
  },

  {
    question: "Sur cet arbre pondéré, quelle est la probabilité du chemin menant à A puis B (calculée par la règle du produit le long des branches) ?",
    graphique: "img/q4.png",
    options: [
      "0,3 × 0,4 = 0,12",
      "0,3 + 0,4 = 0,7",
      "0,3 − 0,4 = −0,1",
      "0,3 / 0,4 = 0,75"
    ],
    bonne_reponse: "0,3 × 0,4 = 0,12",
    explication: "Sur un arbre pondéré, la probabilité d'un chemin s'obtient en multipliant les probabilités inscrites sur chaque branche parcourue, ici P(A) × P_A(B) = 0,3 × 0,4 = 0,12."
  },

  {
    question: "Comment démontre-t-on, à partir d'un arbre pondéré, que deux événements A et B sont indépendants ?",
    options: [
      "En vérifiant que P_A(B) = P(B) (la probabilité de B ne dépend pas de la réalisation de A)",
      "En vérifiant que P(A) = P(B)",
      "En vérifiant que les deux branches de l'arbre ont la même longueur graphique",
      "L'indépendance ne peut jamais être vérifiée à partir d'un arbre"
    ],
    bonne_reponse: "En vérifiant que P_A(B) = P(B) (la probabilité de B ne dépend pas de la réalisation de A)",
    explication: "Deux événements A et B sont indépendants si la réalisation de A ne modifie pas la probabilité de B, ce qui se traduit par P_A(B) = P(B) (et de façon équivalente P(A∩B) = P(A)×P(B))."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
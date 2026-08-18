/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME AL02  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce nuage de points représente une série statistique à deux variables, avec une droite d'ajustement. Comment obtient-on cette droite par la méthode des moindres carrés ?",
    graphique: "img/q1.png",
    options: [
      "En minimisant la somme des carrés des écarts entre les points et la droite",
      "En reliant simplement le premier et le dernier point",
      "En passant par le maximum de points possible",
      "En traçant une droite horizontale à hauteur moyenne"
    ],
    bonne_reponse: "En minimisant la somme des carrés des écarts entre les points et la droite",
    explication: "La méthode des moindres carrés détermine la droite qui minimise la somme des carrés des écarts verticaux entre chaque point du nuage et la droite."
  },

  {
    question: "Comment détermine-t-on, à l'aide de listes en Python, la moyenne d'une série statistique ?",
    options: [
      "En calculant la somme des valeurs de la liste divisée par le nombre de valeurs (sum(liste)/len(liste))",
      "En prenant uniquement la première valeur de la liste",
      "En multipliant toutes les valeurs entre elles",
      "En triant la liste sans faire de calcul"
    ],
    bonne_reponse: "En calculant la somme des valeurs de la liste divisée par le nombre de valeurs (sum(liste)/len(liste))",
    explication: "En Python, sum(liste) donne la somme des éléments et len(liste) leur nombre : leur rapport donne la moyenne de la série."
  },

  {
    question: "Ce schéma représente deux événements A et B. Quelle relation relie P(A∪B), P(A), P(B) et P(A∩B) ?",
    graphique: "img/q4.png",
    options: [
      "P(A∪B) = P(A) + P(B) − P(A∩B)",
      "P(A∪B) = P(A) + P(B)",
      "P(A∪B) = P(A) × P(B)",
      "P(A∪B) = P(A) − P(B)"
    ],
    bonne_reponse: "P(A∪B) = P(A) + P(B) − P(A∩B)",
    explication: "Pour ne pas compter deux fois les éléments communs aux deux événements, on soustrait la probabilité de leur intersection : P(A∪B) = P(A) + P(B) − P(A∩B)."
  },

  {
    question: "Comment calcule-t-on, en Python, la probabilité de l'intersection de deux événements A et B à partir de leurs effectifs dans une liste de résultats simulés ?",
    options: [
      "En comptant les issues simulées qui vérifient à la fois A et B, puis en divisant par le nombre total d'issues",
      "En additionnant simplement les probabilités de A et de B",
      "En ne comptant que les issues qui vérifient A, sans tenir compte de B",
      "Cela ne peut pas être estimé par simulation"
    ],
    bonne_reponse: "En comptant les issues simulées qui vérifient à la fois A et B, puis en divisant par le nombre total d'issues",
    explication: "Pour estimer P(A∩B) par simulation, on compte, parmi toutes les répétitions de l'expérience, celles qui vérifient simultanément les conditions de A et de B, puis on divise par le nombre total de répétitions."
  },

  {
    question: "Ce nuage de points suit une évolution non affine, ajustée ici par une courbe exponentielle. Pourquoi choisit-on parfois un ajustement non affine plutôt qu'une simple droite ?",
    graphique: "img/q7.png",
    options: [
      "Parce que la forme du nuage de points ne correspond pas à une évolution linéaire, et qu'un autre modèle décrit mieux la tendance observée",
      "Parce qu'un ajustement affine est toujours interdit en mathématiques",
      "Parce que les nuages de points ne servent à rien",
      "Parce qu'il faut toujours choisir le modèle le plus compliqué possible"
    ],
    bonne_reponse: "Parce que la forme du nuage de points ne correspond pas à une évolution linéaire, et qu'un autre modèle décrit mieux la tendance observée",
    explication: "Lorsque la forme du nuage de points suggère une tendance non linéaire, on choisit un modèle d'ajustement adapté (exponentiel, logarithmique...), quitte à utiliser un changement de variable pour s'y ramener."
  },

  {
    question: "Comment un programme Python peut-il tester plusieurs types d'ajustement (affine, exponentiel...) sur un même nuage de points pour choisir le plus pertinent ?",
    options: [
      "En calculant, pour chaque modèle candidat, une mesure d'écart (comme la somme des carrés des résidus) et en comparant ces mesures",
      "En choisissant le modèle au hasard",
      "En ne testant qu'un seul modèle, systématiquement le même",
      "Un programme ne peut jamais comparer plusieurs modèles d'ajustement"
    ],
    bonne_reponse: "En calculant, pour chaque modèle candidat, une mesure d'écart (comme la somme des carrés des résidus) et en comparant ces mesures",
    explication: "Pour choisir objectivement le modèle d'ajustement le plus pertinent, on calcule pour chacun une mesure de la qualité de l'ajustement (comme la somme des carrés des résidus ou le coefficient de détermination R²), et on retient celui qui minimise l'écart."
  },

  {
    question: "Sur cet arbre pondéré, quelle est la probabilité de l'événement A, sachant les probabilités indiquées sur les branches ?",
    graphique: "img/q9.png",
    options: [
      "0,6",
      "0,4",
      "1",
      "0,24"
    ],
    bonne_reponse: "0,6",
    explication: "Sur un arbre pondéré, la probabilité associée à une branche partant de la racine correspond directement à la probabilité de l'événement à son extrémité : ici P(A) = 0,6."
  },

  {
    question: "Que dit la formule des probabilités totales, pour un événement B et une partition de l'univers en événements A1, A2 ?",
    options: [
      "P(B) = P(A1) × P_A1(B) + P(A2) × P_A2(B)",
      "P(B) = P(A1) + P(A2)",
      "P(B) = P(A1) × P(A2)",
      "P(B) = P_A1(B) − P_A2(B)"
    ],
    bonne_reponse: "P(B) = P(A1) × P_A1(B) + P(A2) × P_A2(B)",
    explication: "La formule des probabilités totales additionne, sur chaque branche d'une partition de l'univers, le produit de la probabilité de l'événement de la partition par la probabilité conditionnelle de B sachant cet événement."
  },

  {
    question: "Comment simule-t-on en Python un arbre pondéré à deux niveaux, pour estimer une probabilité conditionnelle complexe ?",
    options: [
      "En simulant successivement le premier tirage puis, selon son résultat, un second tirage avec des probabilités adaptées",
      "En simulant les deux niveaux de façon totalement indépendante des résultats du premier",
      "Un arbre pondéré ne peut pas être simulé par ordinateur",
      "En ne simulant qu'un seul des deux niveaux"
    ],
    bonne_reponse: "En simulant successivement le premier tirage puis, selon son résultat, un second tirage avec des probabilités adaptées",
    explication: "Simuler un arbre pondéré consiste à reproduire informatiquement chaque étape successive : on simule d'abord le premier événement, puis, en fonction du résultat obtenu, on simule le second avec les probabilités conditionnelles adaptées à la branche empruntée."
  },

  {
    question: "Comment montre-t-on, à l'aide d'une simulation informatique répétée un grand nombre de fois, que deux événements A et B sont vraisemblablement indépendants ?",
    options: [
      "En vérifiant que la fréquence observée de A∩B se rapproche du produit des fréquences observées de A et de B",
      "En vérifiant que A et B se produisent toujours ensemble",
      "En vérifiant que A et B ne se produisent jamais ensemble",
      "L'indépendance ne peut jamais être approchée par simulation"
    ],
    bonne_reponse: "En vérifiant que la fréquence observée de A∩B se rapproche du produit des fréquences observées de A et de B",
    explication: "Par simulation, on peut vérifier numériquement la condition d'indépendance P(A∩B) = P(A)×P(B) en comparant la fréquence observée de l'intersection au produit des fréquences observées de chaque événement pris séparément."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
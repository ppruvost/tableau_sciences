/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES S05  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce tableau croisé d'effectifs présente la répartition d'élèves selon leur genre et leur filière. Combien d'élèves au total sont en filière Sciences ?",
    graphique: "img/q1.png",
    options: [
      "40",
      "43",
      "37",
      "80"
    ],
    bonne_reponse: "40",
    explication: "On lit directement dans la ligne « Sciences » du tableau croisé : 18 + 22 = 40 élèves au total."
  },

  {
    question: "À partir de ce tableau croisé, quelle est la probabilité qu'un élève choisi au hasard soit une fille ?",
    graphique: "img/q1.png",
    options: [
      "43/80",
      "18/80",
      "40/80",
      "25/80"
    ],
    bonne_reponse: "43/80",
    explication: "Il y a 43 filles sur un total de 80 élèves, donc P(fille) = 43/80."
  },

  {
    question: "Comment calcule-t-on, à partir d'un tableau croisé d'effectifs, la probabilité conditionnelle P_Sciences(Fille), c'est-à-dire la probabilité qu'un élève soit une fille sachant qu'il est en filière Sciences ?",
    graphique: "img/q1.png",
    options: [
      "En divisant l'effectif des filles en Sciences par l'effectif total de la filière Sciences (18/40)",
      "En divisant l'effectif des filles en Sciences par l'effectif total des filles (18/43)",
      "En divisant l'effectif total par l'effectif des filles en Sciences",
      "La probabilité conditionnelle ne peut pas être calculée à partir d'un tableau croisé"
    ],
    bonne_reponse: "En divisant l'effectif des filles en Sciences par l'effectif total de la filière Sciences (18/40)",
    explication: "La probabilité conditionnelle P_Sciences(Fille) se calcule en restreignant l'univers à la filière Sciences : on divise l'effectif des filles en Sciences par l'effectif total de la filière Sciences, soit 18/40."
  },

  {
    question: "Quelle est la relation générale entre la probabilité conditionnelle P_A(B), P(A∩B) et P(A) ?",
    options: [
      "P_A(B) = P(A∩B) / P(A)",
      "P_A(B) = P(A∩B) × P(A)",
      "P_A(B) = P(A) / P(A∩B)",
      "P_A(B) = P(A) + P(B)"
    ],
    bonne_reponse: "P_A(B) = P(A∩B) / P(A)",
    explication: "La probabilité conditionnelle de B sachant A est définie par P_A(B) = P(A∩B) / P(A), avec P(A) non nul."
  },

  {
    question: "Sur cet arbre pondéré à deux niveaux, quelle est la probabilité du chemin menant à A puis B, calculée par la règle du produit le long des branches ?",
    graphique: "img/q6.png",
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
    question: "Sur cet arbre pondéré, quelle formule permet de calculer P(B) à l'aide de la formule des probabilités totales ?",
    graphique: "img/q6.png",
    options: [
      "P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B)",
      "P(B) = P(A) + P(Ā)",
      "P(B) = P_A(B) × P_Ā(B)",
      "P(B) = P(A) − P(Ā)"
    ],
    bonne_reponse: "P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B)",
    explication: "La formule des probabilités totales additionne, sur chaque branche d'une partition de l'univers, le produit de la probabilité de l'événement de la partition par la probabilité conditionnelle de B sachant cet événement."
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

  {
    question: "Comment complète-t-on un arbre pondéré lorsqu'on connaît seulement P(A) et qu'on sait que l'univers est partagé entre A et son événement contraire Ā ?",
    options: [
      "On calcule P(Ā) = 1 − P(A), la somme des probabilités des branches issues d'un même nœud valant toujours 1",
      "On laisse la branche vide car P(Ā) ne peut pas être déterminé",
      "On suppose arbitrairement que P(Ā) = P(A)",
      "On additionne P(A) et 1 pour obtenir P(Ā)"
    ],
    bonne_reponse: "On calcule P(Ā) = 1 − P(A), la somme des probabilités des branches issues d'un même nœud valant toujours 1",
    explication: "Sur un arbre pondéré, la somme des probabilités des branches issues d'un même nœud vaut toujours 1 : connaissant P(A), on en déduit P(Ā) = 1 − P(A)."
  },

  {
    question: "Pourquoi le tableau croisé et l'arbre pondéré sont-ils deux représentations complémentaires d'une même situation de probabilités conditionnelles ?",
    options: [
      "Parce qu'ils permettent tous deux de retrouver les mêmes probabilités conditionnelles et probabilités totales, sous une forme différente (tabulaire ou arborescente)",
      "Parce qu'ils donnent systématiquement des résultats différents pour une même situation",
      "Parce que seul le tableau croisé permet de calculer des probabilités, contrairement à l'arbre",
      "Ils ne sont en réalité pas du tout liés l'un à l'autre"
    ],
    bonne_reponse: "Parce qu'ils permettent tous deux de retrouver les mêmes probabilités conditionnelles et probabilités totales, sous une forme différente (tabulaire ou arborescente)",
    explication: "Le tableau croisé d'effectifs et l'arbre pondéré de probabilités sont deux façons complémentaires de représenter la même situation : on peut passer de l'un à l'autre et retrouver les mêmes probabilités conditionnelles et probabilités totales."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
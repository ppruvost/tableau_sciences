/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME TLE  ============
   ============================================================ */

window.questions = [

  {
    question: "Ce nuage de points suit une évolution non affine, ajustée ici par une courbe exponentielle. Pourquoi choisit-on parfois un ajustement non affine en Terminale plutôt qu'une simple droite ?",
    graphique: "img/q1.png",
    options: [
      "Parce que la forme du nuage de points ne correspond pas à une évolution linéaire, et qu'un autre modèle décrit mieux la tendance observée",
      "Parce qu'un ajustement affine est toujours interdit en mathématiques",
      "Parce que les nuages de points ne servent à rien en Terminale",
      "Parce qu'il faut toujours choisir le modèle le plus compliqué possible"
    ],
    bonne_reponse: "Parce que la forme du nuage de points ne correspond pas à une évolution linéaire, et qu'un autre modèle décrit mieux la tendance observée",
    explication: "Lorsque la forme du nuage de points suggère une tendance non linéaire, on choisit un modèle d'ajustement adapté (exponentiel, logarithmique...), quitte à utiliser un changement de variable pour s'y ramener."
  },

  {
    question: "Sur cet arbre pondéré, quelle est la probabilité de l'événement A, sachant les probabilités indiquées sur les branches ?",
    graphique: "img/q2.png",
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
    question: "Que dit la formule des probabilités totales, pour un événement B et une partition de l'univers en événements A1, A2 (par exemple A et son contraire) ?",
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
    question: "Comment montre-t-on que deux événements A et B sont indépendants ?",
    options: [
      "En vérifiant que P(A∩B) = P(A) × P(B)",
      "En vérifiant que P(A) = P(B)",
      "En vérifiant que A et B sont incompatibles",
      "L'indépendance ne peut jamais être démontrée par le calcul"
    ],
    bonne_reponse: "En vérifiant que P(A∩B) = P(A) × P(B)",
    explication: "Deux événements A et B sont indépendants si et seulement si la probabilité de leur intersection est égale au produit de leurs probabilités : P(A∩B) = P(A) × P(B)."
  },

  {
    question: "Comment calcule-t-on, en Python, le terme de rang n d'une suite géométrique de premier terme u0 et de raison q, à l'aide d'une boucle ?",
    options: [
      "En multipliant u0 par q à chaque tour de boucle, n fois de suite",
      "En additionnant q à u0 à chaque tour de boucle",
      "En ne faisant aucun calcul, juste u0",
      "En divisant u0 par q à chaque tour"
    ],
    bonne_reponse: "En multipliant u0 par q à chaque tour de boucle, n fois de suite",
    explication: "Une suite géométrique se calcule par récurrence en multipliant le terme précédent par la raison q à chaque itération de la boucle."
  },

  {
    question: "Sur ce graphique représentant une suite géométrique croissante, comment détermine-t-on par un programme le rang à partir duquel les termes dépassent le seuil indiqué ?",
    graphique: "img/q4.png",
    options: [
      "Avec une boucle while qui multiplie le terme courant par la raison tant qu'il reste inférieur au seuil",
      "En calculant directement sans aucune boucle",
      "En multipliant le seuil par la raison une seule fois",
      "Cela ne peut pas être déterminé par un programme"
    ],
    bonne_reponse: "Avec une boucle while qui multiplie le terme courant par la raison tant qu'il reste inférieur au seuil",
    explication: "Comme pour une suite arithmétique, une boucle while permet de calculer successivement les termes et de s'arrêter dès que le terme dépasse le seuil fixé."
  },

  {
    question: "Comment recherche-t-on par balayage une racine d'une fonction polynôme de degré 3 ou une solution d'une équation exponentielle ?",
    options: [
      "En testant des valeurs successives de x avec un pas donné et en repérant un changement de signe de f(x)",
      "En résolvant uniquement de tête, sans calcul numérique",
      "En ignorant totalement la fonction et en devinant une valeur au hasard",
      "Cette méthode ne fonctionne que pour les équations du premier degré"
    ],
    bonne_reponse: "En testant des valeurs successives de x avec un pas donné et en repérant un changement de signe de f(x)",
    explication: "La méthode de balayage, déjà vue en 1ère pour des équations plus simples, s'applique de la même façon à des fonctions polynômes de degré supérieur ou des équations exponentielles/logarithmes : on cherche un changement de signe de f(x)."
  },

  {
    question: "Un capital de 5000 € est placé à intérêts composés à 3 % par an. Quel capital obtient-on après 10 ans (arrondi à l'euro) ?",
    options: [
      "6719 €",
      "6500 €",
      "5150 €",
      "5300 €"
    ],
    bonne_reponse: "6719 €",
    explication: "Capital final = 5000 × 1,03¹⁰ ≈ 5000 × 1,3439 ≈ 6719 €."
  },

  {
    question: "Comment calcule-t-on par programme les annuités constantes d'un emprunt à intérêts composés ?",
    options: [
      "À l'aide d'une formule financière utilisant le capital emprunté, le taux périodique et le nombre de périodes",
      "En divisant simplement le capital emprunté par le nombre de périodes, sans tenir compte des intérêts",
      "Les annuités ne peuvent pas être calculées par programme",
      "En multipliant le capital emprunté par le taux une seule fois"
    ],
    bonne_reponse: "À l'aide d'une formule financière utilisant le capital emprunté, le taux périodique et le nombre de périodes",
    explication: "Le calcul de l'annuité constante d'un emprunt utilise une formule financière prenant en compte le capital emprunté, le taux d'intérêt périodique et le nombre total de périodes de remboursement."
  },

  {
    question: "Comment calcule-t-on un taux mensuel équivalent à un taux annuel de crédit, en tenant compte de la capitalisation des intérêts ?",
    options: [
      "Le taux mensuel équivalent tm vérifie (1+tm)¹² = 1+ta, où ta est le taux annuel",
      "On divise simplement le taux annuel par 12",
      "Le taux mensuel équivalent est toujours égal au taux annuel",
      "Cette conversion n'est pas possible mathématiquement"
    ],
    bonne_reponse: "Le taux mensuel équivalent tm vérifie (1+tm)¹² = 1+ta, où ta est le taux annuel",
    explication: "Pour respecter la capitalisation des intérêts composés sur 12 mois, le taux mensuel équivalent vérifie (1+tm)¹² = 1+ta, ce qui donne tm = (1+ta)^(1/12) − 1, différent d'une simple division par 12."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
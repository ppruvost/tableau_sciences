/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME 1ERE  ============
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
    graphique: "img/q2.png",
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
    question: "Une suite arithmétique est définie par récurrence en Python avec une boucle for. Comment calcule-t-on la somme de ses n premiers termes dans le programme ?",
    options: [
      "En accumulant chaque terme calculé dans une variable somme, initialisée à 0 avant la boucle",
      "En multipliant uniquement le premier et le dernier terme",
      "En ignorant les termes intermédiaires",
      "La somme ne peut pas être calculée par une boucle"
    ],
    bonne_reponse: "En accumulant chaque terme calculé dans une variable somme, initialisée à 0 avant la boucle",
    explication: "Pour calculer une somme avec une boucle, on initialise une variable accumulateur à 0, puis on lui ajoute chaque terme de la suite au fur et à mesure de la boucle."
  },

  {
    question: "Sur ce graphique représentant une suite (uₙ) croissante, comment détermine-t-on par programme le rang à partir duquel les termes dépassent le seuil indiqué ?",
    graphique: "img/q4.png",
    options: [
      "Avec une boucle while qui incrémente n tant que uₙ reste inférieur au seuil",
      "Avec une seule instruction, sans boucle",
      "En calculant uniquement u₀",
      "Cela ne peut pas être déterminé par un programme"
    ],
    bonne_reponse: "Avec une boucle while qui incrémente n tant que uₙ reste inférieur au seuil",
    explication: "Une boucle while permet de répéter le calcul du terme suivant et d'incrémenter le rang n tant que la condition (uₙ inférieur au seuil) reste vraie, jusqu'à trouver le premier rang qui dépasse le seuil."
  },

  {
    question: "Sur ce graphique, on cherche par balayage une solution de f(x) = 0 proche de x = 3. En quoi consiste la méthode de résolution par balayage ?",
    graphique: "img/q6.png",
    options: [
      "Tester successivement des valeurs de x avec un pas donné, et repérer où f(x) change de signe",
      "Résoudre directement l'équation par le calcul formel",
      "Ne tester qu'une seule valeur de x au hasard",
      "Ignorer entièrement le signe de f(x)"
    ],
    bonne_reponse: "Tester successivement des valeurs de x avec un pas donné, et repérer où f(x) change de signe",
    explication: "La résolution par balayage consiste à évaluer f(x) pour des valeurs successives de x avec un pas régulier, et à repérer l'intervalle où f(x) change de signe, ce qui encadre une solution de l'équation f(x) = 0."
  },

  {
    question: "À quoi sert la visualisation d'une tangente à l'aide d'un logiciel comme GeoGebra ?",
    options: [
      "À observer que la tangente est la meilleure approximation affine de la courbe au voisinage du point considéré",
      "À tracer uniquement des droites parallèles à l'axe des abscisses",
      "À remplacer le calcul du nombre dérivé sans aucun lien avec lui",
      "La tangente n'a pas de lien avec la dérivation"
    ],
    bonne_reponse: "À observer que la tangente est la meilleure approximation affine de la courbe au voisinage du point considéré",
    explication: "En zoomant sur une courbe au voisinage d'un point avec GeoGebra, on observe qu'elle se confond de plus en plus avec sa tangente, illustrant que la tangente est la meilleure approximation affine locale de la courbe."
  },

  {
    question: "Comment le coût marginal se réinvestit-il dans la notion de dérivation ?",
    options: [
      "Le coût marginal peut être approché par le nombre dérivé de la fonction coût total au point considéré",
      "Le coût marginal n'a aucun lien avec la dérivation",
      "Le coût marginal est toujours égal au coût moyen",
      "Le coût marginal est une constante indépendante de la production"
    ],
    bonne_reponse: "Le coût marginal peut être approché par le nombre dérivé de la fonction coût total au point considéré",
    explication: "Le coût marginal, coût de production d'une unité supplémentaire, est approché par le nombre dérivé de la fonction coût total, qui mesure la variation instantanée du coût."
  },

  {
    question: "Comment la fonction inverse intervient-elle dans le calcul du coût moyen unitaire ?",
    options: [
      "Le coût moyen s'écrit Cmoy(x) = C(x) × (1/x), ce qui fait intervenir la fonction inverse appliquée à x",
      "La fonction inverse n'intervient jamais dans ce calcul",
      "Le coût moyen est indépendant de x",
      "Le coût moyen est toujours égal au coût marginal"
    ],
    bonne_reponse: "Le coût moyen s'écrit Cmoy(x) = C(x) × (1/x), ce qui fait intervenir la fonction inverse appliquée à x",
    explication: "Le coût moyen Cmoy(x) = C(x)/x peut s'écrire comme le produit de C(x) par la fonction inverse 1/x, ce qui permet de réinvestir l'étude de cette fonction (variations, limites) dans un contexte de calcul commercial."
  },

  {
    question: "Un capital de 1500 € est placé à intérêts simples à un taux annuel de 2,5 % pendant 4 ans. Quel est le montant total des intérêts ?",
    options: [
      "150 €",
      "375 €",
      "60 €",
      "1650 €"
    ],
    bonne_reponse: "150 €",
    explication: "Intérêts = Capital × taux × durée = 1500 × 0,025 × 4 = 150 €."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
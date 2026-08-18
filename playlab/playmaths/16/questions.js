/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGORITHME AL04  ============
   ============================================================ */

window.questions = [

  {
    question: "En Python, comment définit-on une fonction f qui calcule l'image de x par f(x) = 2x + 3 ?",
    options: [
      "def f(x): return 2*x + 3",
      "def f(x): print(2*x + 3)",
      "f(x) = 2x + 3",
      "function f(x) = 2*x + 3"
    ],
    bonne_reponse: "def f(x): return 2*x + 3",
    explication: "En Python, une fonction se définit avec le mot-clé def, suivi de son nom et de ses paramètres, et le résultat est renvoyé avec return."
  },

  {
    question: "Un article coûte 80 € avant une remise de 15 %. Comment calcule-t-on son montant net avec une fonction Python ?",
    options: [
      "def prix_remise(prix, taux): return prix * (1 - taux)",
      "def prix_remise(prix, taux): return prix + taux",
      "def prix_remise(prix, taux): return prix * taux",
      "def prix_remise(prix, taux): return prix - 1"
    ],
    bonne_reponse: "def prix_remise(prix, taux): return prix * (1 - taux)",
    explication: "Une remise de taux (en proportion, ex. 0,15 pour 15 %) fait passer le prix à prix × (1 − taux)."
  },

  {
    question: "En reprenant la fonction précédente avec prix = 80 et taux = 0,15, quel est le montant net obtenu ?",
    options: [
      "68 €",
      "65 €",
      "92 €",
      "12 €"
    ],
    bonne_reponse: "68 €",
    explication: "80 × (1 − 0,15) = 80 × 0,85 = 68 €."
  },

  {
    question: "Sur ce graphique, on cherche par balayage une solution de f(x) = 0 proche de x = 3. En quoi consiste la méthode de résolution par balayage ?",
    graphique: "img/q3.png",
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
    question: "À quoi sert la visualisation d'une tangente à l'aide d'un logiciel comme GeoGebra, comme sur ce graphique ?",
    graphique: "img/q5.png",
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
    question: "Un capital de 1500 € est placé à intérêts simples à un taux annuel de 2,5 % pendant 4 ans. Quel est le montant total des intérêts, calculé par une fonction Python appliquant la formule capital×taux×durée ?",
    options: [
      "150 €",
      "375 €",
      "60 €",
      "1650 €"
    ],
    bonne_reponse: "150 €",
    explication: "Intérêts = Capital × taux × durée = 1500 × 0,025 × 4 = 150 €."
  },

  {
    question: "Comment recherche-t-on par balayage une racine d'une fonction polynôme de degré 3 ou une solution d'une équation exponentielle, en Terminale ?",
    options: [
      "En testant des valeurs successives de x avec un pas donné et en repérant un changement de signe de f(x)",
      "En résolvant uniquement de tête, sans calcul numérique",
      "En ignorant totalement la fonction et en devinant une valeur au hasard",
      "Cette méthode ne fonctionne que pour les équations du premier degré"
    ],
    bonne_reponse: "En testant des valeurs successives de x avec un pas donné et en repérant un changement de signe de f(x)",
    explication: "La méthode de balayage, déjà vue pour des équations plus simples, s'applique de la même façon à des fonctions polynômes de degré supérieur ou des équations exponentielles/logarithmes."
  },

  {
    question: "Un capital de 5000 € est placé à intérêts composés à 3 % par an. Comment une fonction Python calcule-t-elle le capital obtenu après n années ?",
    options: [
      "def capital_final(c, taux, n): return c * (1 + taux)**n",
      "def capital_final(c, taux, n): return c + taux*n",
      "def capital_final(c, taux, n): return c * taux * n",
      "def capital_final(c, taux, n): return c / (1+taux)**n"
    ],
    bonne_reponse: "def capital_final(c, taux, n): return c * (1 + taux)**n",
    explication: "Le capital final à intérêts composés se calcule par Capital × (1 + taux)^n, formule directement traduisible en une fonction Python avec l'opérateur puissance **."
  },

  {
    question: "Avec la fonction précédente, quel capital obtient-on après 10 ans pour un capital initial de 5000 € à 3 % (arrondi à l'euro) ?",
    options: [
      "6719 €",
      "6500 €",
      "5150 €",
      "5300 €"
    ],
    bonne_reponse: "6719 €",
    explication: "Capital final = 5000 × 1,03¹⁰ ≈ 6719 €."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
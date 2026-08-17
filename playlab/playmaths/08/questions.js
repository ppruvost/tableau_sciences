/* ============================================================
   ============  QUIZ PLAYSCIENCES — ALGEBRE 2NDE  ============
   ============================================================ */

window.questions = [

  {
    question: "Comment traduit-on par une équation la phrase « le double d'un nombre augmenté de 5 vaut 17 » ?",
    options: [
      "2x + 5 = 17",
      "x + 5 = 17 × 2",
      "2(x+5) = 17",
      "x/2 + 5 = 17"
    ],
    bonne_reponse: "2x + 5 = 17",
    explication: "« Le double d'un nombre x » se traduit par 2x, et « augmenté de 5 » ajoute 5 : on obtient 2x + 5 = 17."
  },

  {
    question: "Résoudre l'équation : 3x + 5 = 20",
    options: [
      "x = 5",
      "x = 3",
      "x = 15",
      "x = 25/3"
    ],
    bonne_reponse: "x = 5",
    explication: "3x = 20 − 5 = 15, donc x = 15/3 = 5."
  },

  {
    question: "Sur cette droite graduée, quel ensemble de solutions est représenté ?",
    graphique: "img/q3.png",
    options: [
      "x > 3",
      "x < 3",
      "x ⩾ 3",
      "x = 3"
    ],
    bonne_reponse: "x > 3",
    explication: "Le cercle ouvert (non rempli) en 3 signifie que 3 n'est pas inclus : l'ensemble représenté est x > 3."
  },

  {
    question: "Résoudre l'inéquation : 2x − 4 ⩽ 10",
    options: [
      "x ⩽ 7",
      "x ⩾ 7",
      "x ⩽ 3",
      "x ⩾ 3"
    ],
    bonne_reponse: "x ⩽ 7",
    explication: "2x ⩽ 14, donc x ⩽ 7."
  },

  {
    question: "Ce schéma représente un intervalle de ℝ. Comment le note-t-on ?",
    graphique: "img/q5.png",
    options: [
      "[1 ; 5]",
      "]1 ; 5[",
      "[1 ; 5[",
      "]1 ; 5]"
    ],
    bonne_reponse: "[1 ; 5]",
    explication: "Les crochets fermés (« [ » et « ] ») aux deux bornes 1 et 5 indiquent un intervalle fermé, incluant ses deux bornes : [1 ; 5]."
  },

  {
    question: "Que signifie l'intervalle ]−∞ ; 4[ ?",
    options: [
      "L'ensemble des nombres réels strictement inférieurs à 4",
      "L'ensemble des nombres réels supérieurs à 4",
      "L'ensemble des nombres réels égaux à 4",
      "L'ensemble vide"
    ],
    bonne_reponse: "L'ensemble des nombres réels strictement inférieurs à 4",
    explication: "Une borne infinie est toujours notée avec un crochet ouvert ; ]−∞ ; 4[ représente tous les réels strictement inférieurs à 4."
  },

  {
    question: "Quelle méthode permet de résoudre graphiquement une équation du type f(x) = k ?",
    options: [
      "Tracer la courbe de f et l'horizontale y = k, puis lire les abscisses des points d'intersection",
      "Calculer uniquement l'image de 0 par f",
      "Tracer uniquement l'axe des abscisses",
      "Résoudre systématiquement par le calcul, jamais graphiquement"
    ],
    bonne_reponse: "Tracer la courbe de f et l'horizontale y = k, puis lire les abscisses des points d'intersection",
    explication: "Résoudre f(x) = k graphiquement consiste à repérer les points d'intersection de la courbe de f avec la droite horizontale d'équation y = k, puis à lire leurs abscisses."
  },

  {
    question: "Pour un problème donnant lieu à une contrainte du type « au moins » ou « au plus », quel type d'outil mathématique choisit-on généralement ?",
    options: [
      "Une équation",
      "Une inéquation",
      "Une suite numérique",
      "Un vecteur"
    ],
    bonne_reponse: "Une inéquation",
    explication: "Les expressions « au moins », « au plus », « ne dépasse pas » traduisent une contrainte d'inégalité, modélisée par une inéquation plutôt que par une équation."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/* ============================================================
   ============  QUIZ PLAYSCIENCES — STATISTIQUES S03  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce graphique, on répète 15 fois une même expérience avec un échantillon de taille n = 20. Que remarque-t-on sur les fréquences observées ?",
    graphique: "img/q1.png",
    options: [
      "Elles fluctuent autour de la probabilité théorique, sans être toutes identiques",
      "Elles sont toutes rigoureusement égales à la probabilité théorique",
      "Elles sont toutes égales entre elles mais différentes de la probabilité théorique",
      "Elles ne suivent aucune tendance particulière et divergent indéfiniment"
    ],
    bonne_reponse: "Elles fluctuent autour de la probabilité théorique, sans être toutes identiques",
    explication: "C'est le phénomène de fluctuation d'échantillonnage : pour un échantillon de taille fixée, la fréquence observée varie d'un échantillon à l'autre, tout en restant globalement proche de la probabilité théorique."
  },

  {
    question: "Pourquoi la fréquence observée sur un échantillon n'est-elle presque jamais exactement égale à la probabilité théorique ?",
    options: [
      "Parce que le tirage d'un échantillon comporte une part de hasard, propre à chaque répétition de l'expérience",
      "Parce que la probabilité théorique change à chaque répétition",
      "Parce que les calculs de fréquence sont systématiquement faux",
      "Il n'existe en réalité aucune différence entre fréquence observée et probabilité théorique"
    ],
    bonne_reponse: "Parce que le tirage d'un échantillon comporte une part de hasard, propre à chaque répétition de l'expérience",
    explication: "La fréquence observée sur un échantillon dépend du hasard du tirage : elle varie naturellement d'un échantillon à l'autre, même si la probabilité théorique de l'événement reste fixe."
  },

  {
    question: "Sur ce graphique, on augmente progressivement la taille n de l'échantillon prélevé. Que peut-on observer ?",
    graphique: "img/q4.png",
    options: [
      "La fréquence observée se stabilise progressivement autour de la probabilité théorique lorsque n augmente",
      "La fréquence observée s'éloigne de la probabilité théorique lorsque n augmente",
      "La fréquence reste toujours rigoureusement égale à la probabilité théorique, quel que soit n",
      "Il n'existe aucune relation entre n et la fréquence observée"
    ],
    bonne_reponse: "La fréquence observée se stabilise progressivement autour de la probabilité théorique lorsque n augmente",
    explication: "Plus l'échantillon est grand, plus la fréquence observée se rapproche de la probabilité théorique de l'événement étudié : c'est le phénomène de stabilisation relative des fréquences."
  },

  {
    question: "Quelle est l'étendue d'une série de fréquences d'échantillons de taille n fixée, comportant la valeur minimale 0,42 et la valeur maximale 0,58 ?",
    options: [
      "0,16",
      "0,50",
      "1,00",
      "0,08"
    ],
    bonne_reponse: "0,16",
    explication: "L'étendue est la différence entre la valeur maximale et la valeur minimale de la série : 0,58 − 0,42 = 0,16."
  },

  {
    question: "Comment évolue généralement l'étendue des fréquences observées sur des échantillons de taille n, lorsque n augmente ?",
    options: [
      "Elle diminue, les fréquences observées se resserrant autour de la probabilité théorique",
      "Elle augmente systématiquement",
      "Elle reste toujours constante quelle que soit n",
      "Elle devient immédiatement nulle dès n = 2"
    ],
    bonne_reponse: "Elle diminue, les fréquences observées se resserrant autour de la probabilité théorique",
    explication: "Plus la taille des échantillons augmente, moins les fréquences observées fluctuent d'un échantillon à l'autre : leur étendue tend donc à diminuer, traduisant le phénomène de stabilisation."
  },

  {
    question: "Cet arbre représente les résultats possibles de deux lancers successifs d'une pièce de monnaie. Combien d'issues possibles ce dénombrement permet-il d'obtenir ?",
    graphique: "img/q8.png",
    options: [
      "4 issues possibles (PP, PF, FP, FF)",
      "2 issues possibles seulement",
      "8 issues possibles",
      "1 seule issue possible"
    ],
    bonne_reponse: "4 issues possibles (PP, PF, FP, FF)",
    explication: "Un arbre de dénombrement pour deux lancers successifs d'une pièce (2 issues à chaque lancer) donne 2×2 = 4 issues possibles au total."
  },

  {
    question: "Comment un arbre de dénombrement permet-il de compter le nombre total d'issues d'une expérience à plusieurs étapes ?",
    options: [
      "En multipliant, à chaque niveau de l'arbre, le nombre de branches possibles",
      "En additionnant le nombre de branches à chaque niveau",
      "En ne comptant que les branches du premier niveau",
      "Un arbre de dénombrement ne permet pas de compter les issues"
    ],
    bonne_reponse: "En multipliant, à chaque niveau de l'arbre, le nombre de branches possibles",
    explication: "Le nombre total d'issues d'une expérience à plusieurs étapes représentée par un arbre s'obtient en multipliant, à chaque niveau, le nombre de choix possibles (principe multiplicatif du dénombrement)."
  },

  {
    question: "Trois lancers successifs d'une pièce de monnaie sont représentés par un arbre. Combien d'issues possibles obtient-on au total ?",
    options: [
      "8 issues",
      "6 issues",
      "3 issues",
      "9 issues"
    ],
    bonne_reponse: "8 issues",
    explication: "Avec 2 issues possibles à chaque lancer répété 3 fois, le nombre total d'issues est 2×2×2 = 8."
  },

  {
    question: "Quel principe justifie que la fluctuation d'échantillonnage soit un phénomène normal en statistique, et non une erreur de calcul ?",
    options: [
      "Le hasard intervient dans le tirage de chaque échantillon, ce qui produit naturellement des résultats différents d'un échantillon à l'autre",
      "Toute variation observée est nécessairement une erreur du logiciel utilisé",
      "Un échantillon donné produit toujours exactement la même fréquence, sans exception",
      "La fluctuation d'échantillonnage n'existe pas réellement en statistique"
    ],
    bonne_reponse: "Le hasard intervient dans le tirage de chaque échantillon, ce qui produit naturellement des résultats différents d'un échantillon à l'autre",
    explication: "La fluctuation d'échantillonnage est un phénomène statistique normal, lié au caractère aléatoire du tirage de chaque échantillon, et non le signe d'une erreur de mesure ou de calcul."
  },

  {
    question: "Un arbre de dénombrement représentant un tirage sans remise de 2 boules parmi 5 boules numérotées diffère-t-il d'un tirage avec remise ?",
    options: [
      "Oui, car le nombre de choix possibles diminue d'une unité à chaque étape sans remise, contrairement au tirage avec remise",
      "Non, les deux arbres sont toujours strictement identiques",
      "Non, le tirage sans remise ne peut pas être représenté par un arbre",
      "Oui, mais uniquement si les boules sont de couleurs différentes"
    ],
    bonne_reponse: "Oui, car le nombre de choix possibles diminue d'une unité à chaque étape sans remise, contrairement au tirage avec remise",
    explication: "Dans un tirage sans remise, l'objet tiré n'est pas remis dans l'ensemble : le nombre de choix possibles diminue donc à chaque étape de l'arbre, contrairement à un tirage avec remise où ce nombre reste constant."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
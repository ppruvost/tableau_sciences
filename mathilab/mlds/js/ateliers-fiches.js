/* ============================================================
   MLDS MATHS — ateliers issus des fiches Eduscol « Accompagnement
   renforcé » (2de pro, déc. 2022) et des guides « La résolution de
   problèmes mathématiques » (cours moyen, collège).
   Énoncés repris ou adaptés, mis en QCM ; explications rédigées pour
   ce module. Voir sources.html. Même règle que les ateliers cuisine :
   pas de saisie au clavier, 5 questions, pas de note.
   ============================================================ */
(function () {
  "use strict";

  const FICHES = [

    {
      id: "equation",
      groupe: "fiches",
      titre: "Mettre en équation",
      sousTitre: "Problèmes du premier degré",
      icone: "fa-equals",
      couleur: "eq",
      sources: ["eduscol-ar-eq", "guide-college"],
      intro: "Un prix, un périmètre, une prime : on cherche un nombre inconnu. La bonne méthode : choisir la lettre, écrire ce que dit l'énoncé, puis résoudre.",
      questions: [
        {
          enonce: "Au marché : 2 croissants coûtent 1,80 € en tout, 1 pain aux raisins coûte 1,10 € et on achète aussi 3 baguettes. Le total est 5,15 €. On note x le prix d'une baguette. Quelle équation traduit la situation ?",
          choix: ["6x = 5,15", "3x + 2,90 = 5,15", "x/3 + 3,70 = 5,15", "3x + 2,60 + 1,10 + 5,15 = 0"],
          bonne: 1,
          explication: "Les 3 baguettes coûtent 3 × x. Croissants et pain : 1,80 + 1,10 = 2,90 €. Le total donne 3x + 2,90 = 5,15, donc 3x = 2,25 et x = 0,75 €. Attention : « 3 baguettes », c'est 3x, pas x divisé par 3."
        },
        {
          enonce: "Une famille va au parc d'attractions. 2 adultes prennent le billet « Classique » (prix x). 3 enfants prennent le billet « Mini », qui coûte 22 € de moins. Le total est 309 €. Quelle équation faut-il écrire ?",
          choix: ["2x + 3x − 22 = 309", "2x + 3(x − 22) = 309", "5x − 22 = 309", "x + 22 = 309"],
          bonne: 1,
          explication: "Un billet « Mini » vaut x − 22, et il y en a 3 : on écrit 3(x − 22), avec des parenthèses. Cela donne 5x − 66 = 309, donc 5x = 375 et x = 75 €. Sans parenthèses, on ne retire 22 € qu'une seule fois."
        },
        {
          enonce: "Un rectangle a un périmètre de 40 cm. Sa longueur est le triple de sa largeur x. Quelle équation permet de trouver x ?",
          choix: ["x + 3x = 40", "x × 3x = 40", "2(x + 3x) = 40", "2x + 2x³ = 40"],
          bonne: 2,
          explication: "Le périmètre, c'est le tour complet : 2 × (largeur + longueur) = 2(x + 3x) = 8x. Donc 8x = 40 et x = 5 cm. x × 3x serait l'aire, pas le périmètre."
        },
        {
          enonce: "Un chef d'entreprise partage une prime de 3 000 € entre trois employés, proportionnellement à leur ancienneté : A, 3 ans ; B, 8 ans ; C, 4 ans. Combien reçoit B ?",
          choix: ["15 €", "1 000 €", "1 600 €", "375 €"],
          bonne: 2,
          explication: "Total des anciennetés : 3 + 8 + 4 = 15 ans. Chaque année « vaut » 3 000 ÷ 15 = 200 €. B a 8 ans : 8 × 200 = 1 600 €. 1 000 €, c'est un partage en 3 parts égales, sans tenir compte de l'ancienneté."
        },
        {
          enonce: "Trois associés déstockent 50 vestes au prix initial x. Le 1er en vend 12 au prix x. Le 2e en vend 6 avec 10 € de remise (prix x − 10). Le 3e vend les 32 autres à moitié prix. La recette totale est 2 830 €. Quelle équation obtient-on après réduction ?",
          choix: ["34x − 60 = 2 830", "34x + 60 = 2 830", "18x − 60 = 2 830", "50x − 60 = 2 830"],
          bonne: 0,
          explication: "12x + 6(x − 10) + 32 × (x/2) = 12x + 6x − 60 + 16x = 34x − 60. Donc 34x = 2 890 et x = 85 €. Vérification : 12 × 85 + 6 × 75 + 32 × 42,50 = 1 020 + 450 + 1 360 = 2 830 €. On vérifie toujours le résultat dans l'énoncé."
        }
      ]
    },

    {
      id: "geometrie",
      groupe: "fiches",
      titre: "Aires et Pythagore",
      sousTitre: "Figures usuelles",
      icone: "fa-draw-polygon",
      couleur: "geo",
      sources: ["eduscol-ar-geo"],
      intro: "Un toit, un terrain de basket, un carré : pour calculer une surface, on décompose en figures simples et on fait attention aux unités.",
      questions: [
        {
          enonce: "Quelle est l'aire d'un rectangle de 4 m de long et de 2 m de large ?",
          choix: ["4 m²", "6 m²", "8 m²", "12 m²"],
          bonne: 2,
          explication: "Aire d'un rectangle = longueur × largeur = 4 × 2 = 8 m². 6 serait la somme 4 + 2, et 12 le périmètre : on cherche ici la surface."
        },
        {
          enonce: "Un terrain de basket mesure 28 m de long et 15 m de large. Quelle est son aire ?",
          choix: ["43 m²", "86 m²", "420 m²", "340 m²"],
          bonne: 2,
          explication: "28 × 15 = 420 m². 43 est la somme des deux côtés, 86 le périmètre du terrain : ni l'un ni l'autre n'est une surface."
        },
        {
          enonce: "Un rectangle de 4 m sur 2 m est colorié, sauf un rectangle blanc de 2 m sur 1 m dans un coin. Quelle est l'aire de la partie coloriée ?",
          choix: ["4 m²", "8 m²", "6 m²", "2 m²"],
          bonne: 2,
          explication: "On enlève la partie blanche à l'ensemble : 4 × 2 − 2 × 1 = 8 − 2 = 6 m². Quand une figure a un « trou » ou un coin retiré, on soustrait son aire."
        },
        {
          enonce: "Quelle est l'aire d'un carré de 200 cm de côté ?",
          choix: ["0,04 m²", "0,4 m²", "4 m²", "40 m²"],
          bonne: 2,
          explication: "Il faut d'abord convertir : 200 cm = 2 m. Puis 2 × 2 = 4 m². Si on calcule en cm : 200 × 200 = 40 000 cm², et 1 m² = 10 000 cm², ce qui donne bien 4 m²."
        },
        {
          enonce: "Un pan de toiture est un rectangle de 14 m sur 9 m, dont on a retiré un coin rectangulaire. Dans ce coin, un côté mesure 4 m et la diagonale 7,21 m (le triangle formé est rectangle). Quelle est la longueur de l'autre côté du coin ?",
          choix: ["3,21 m", "6 m", "8,25 m", "11,21 m"],
          bonne: 1,
          explication: "Théorème de Pythagore : côté² = 7,21² − 4² ≈ 51,98 − 16 = 35,98, donc côté ≈ 6 m. L'aire du toit est alors 14 × 9 − 6 × 4 = 126 − 24 = 102 m². 11,21 m serait la somme 7,21 + 4 : on ne fait pas la somme des côtés."
        }
      ]
    },

    {
      id: "nombres",
      groupe: "fiches",
      titre: "Fractions et puissances de 10",
      sousTitre: "Nombres et calculs",
      icone: "fa-divide",
      couleur: "nombres",
      sources: ["eduscol-ar-nombres"],
      intro: "Une feuille pliée en origami, un cocktail, de très petits nombres : on partage, on additionne des parts et on écrit proprement les nombres.",
      questions: [
        {
          enonce: "Quelle égalité est correcte ?",
          choix: ["2/3 + 7/4 = 9/7", "2/3 + 7/4 = 29/12", "2/3 + 7/4 = 9/12", "2/3 + 7/4 = 14/12"],
          bonne: 1,
          explication: "On met sur le même dénominateur, 12 : 2/3 = 8/12 et 7/4 = 21/12. Puis 8/12 + 21/12 = 29/12. On n'additionne jamais les dénominateurs entre eux (9/7), et on change aussi les numérateurs (9/12)."
        },
        {
          enonce: "Un cocktail de 10 cL contient 1/4 de jus d'orange, 2/5 de jus de pomme, et le reste de jus d'ananas. Quelle fraction du cocktail est du jus d'ananas ?",
          choix: ["7/20", "13/20", "3/9", "18/20"],
          bonne: 0,
          explication: "1/4 = 5/20 et 2/5 = 8/20, soit 13/20 en tout. Le reste : 20/20 − 13/20 = 7/20. Dans 10 cL, cela fait 3,5 cL d'ananas. 13/20 est la part des deux autres jus, pas le reste."
        },
        {
          enonce: "Une cocotte en origami est pliée dans une feuille carrée. Le pliage découpe la feuille en 32 petits triangles identiques. La tête (en rouge) est formée de 2 triangles. Quelle fraction de la feuille la tête représente-t-elle, sous forme irréductible ?",
          choix: ["2/32", "1/8", "1/16", "1/32"],
          bonne: 2,
          explication: "La tête occupe 2 triangles sur 32 : 2/32. On simplifie en divisant en haut et en bas par 2 : 1/16. Une fraction irréductible ne peut plus être simplifiée."
        },
        {
          enonce: "Toujours sur la cocotte (32 triangles) : la tête en compte 2, la patte en bleu 3 et la queue en vert 3. Quelle fraction de la feuille n'est pas coloriée ?",
          choix: ["1/4", "3/4", "5/8", "7/8"],
          bonne: 1,
          explication: "Le coloriage couvre 2 + 3 + 3 = 8 triangles. Il reste 32 − 8 = 24 triangles non coloriés : 24/32 = 3/4. Les 8 triangles coloriés, eux, font 8/32 = 1/4."
        },
        {
          enonce: "Comment écrit-on 0,0036 en écriture scientifique ?",
          choix: ["0,36 × 10⁻²", "3,6 × 10⁻²", "36 × 10³", "3,6 × 10⁻³"],
          bonne: 3,
          explication: "L'écriture scientifique a un seul chiffre non nul avant la virgule : 3,6. Pour passer de 0,0036 à 3,6, on décale la virgule de 3 rangs vers la droite : on multiplie par 10³, donc il faut compenser par 10⁻³. Soit 3,6 × 10⁻³."
        }
      ]
    },

    {
      id: "statistiques",
      groupe: "fiches",
      titre: "Fréquences et statistiques",
      sousTitre: "Organisation des données",
      icone: "fa-chart-column",
      couleur: "stat",
      sources: ["eduscol-ar-ogd"],
      intro: "Compter, calculer une fréquence, trouver une médiane : des outils pour lire des données… et même pour décoder un message secret.",
      questions: [
        {
          enonce: "Une urne contient 4 boules bleues, 9 rouges, 5 vertes et 2 jaunes. Quelle est la fréquence des boules vertes ?",
          choix: ["0,12", "0,25", "0,50", "5"],
          bonne: 1,
          explication: "Effectif total : 4 + 9 + 5 + 2 = 20 boules. Fréquence = effectif ÷ total = 5 ÷ 20 = 0,25, soit 25 %. Utiliser 5 directement (sans diviser par le total) est l'erreur la plus fréquente."
        },
        {
          enonce: "Des céréales contiennent 82 g de glucides pour 100 g de céréales. Combien de glucides dans un bol de 50 g de céréales ?",
          choix: ["82 g", "141 g", "0,82 g", "41 g"],
          bonne: 3,
          explication: "50 g, c'est la moitié de 100 g : il y a deux fois moins de glucides, 82 ÷ 2 = 41 g. On peut aussi calculer 82 × 50 ÷ 100 = 41 g (produit en croix)."
        },
        {
          enonce: "Les salaires mensuels de 6 employés sont : 1 900 €, 1 760 €, 2 200 €, 3 400 €, 1 200 € et 2 050 €. Quel est le salaire médian ?",
          choix: ["2 085 €", "1 975 €", "2 800 €", "10 801,67 €"],
          bonne: 1,
          explication: "On range d'abord par ordre croissant : 1 200 ; 1 760 ; 1 900 ; 2 050 ; 2 200 ; 3 400. Il y a 6 valeurs : la médiane est entre la 3e et la 4e, donc (1 900 + 2 050) ÷ 2 = 1 975 €. 2 085 € est la moyenne, pas la médiane."
        },
        {
          enonce: "Temps passé à regarder des séries par semaine, par élève : [0 ; 4[ : 40 élèves ; [4 ; 8[ : 80 ; [8 ; 12[ : 160 ; [12 ; 20[ : 200 ; [20 ; 28[ : 140. Quelle est la fréquence, arrondie au centième, des élèves qui regardent des séries plus de 12 h par semaine ?",
          choix: ["0,32", "0,45", "340", "0,55"],
          bonne: 3,
          explication: "Effectif total : 40 + 80 + 160 + 200 + 140 = 620. « Plus de 12 h » : 200 + 140 = 340 élèves. Fréquence : 340 ÷ 620 ≈ 0,55. 340 est un effectif, pas une fréquence, et 0,45 correspond à « moins de 12 h »."
        },
        {
          enonce: "Un message a été codé en décalant toutes les lettres du même nombre de rangs (chiffre de César). Dans le texte codé, la lettre la plus fréquente est U. En français, c'est le E. De combien de rangs les lettres ont-elles été décalées ?",
          choix: ["16", "4", "20", "10"],
          bonne: 0,
          explication: "E est la 5e lettre (rang 4 si A est au rang 0) et U la 21e (rang 20) : le décalage est 20 − 4 = 16. Pour décoder, on recule de 16 rangs : H devient R, Y devient I, U devient E, D devient N. « HYUD » se lit donc « RIEN »."
        }
      ]
    },

    {
      id: "problemes",
      groupe: "fiches",
      titre: "Résoudre un problème en 4 temps",
      sousTitre: "Comprendre, modéliser, calculer, répondre",
      icone: "fa-lightbulb",
      couleur: "probl",
      sources: ["guide-cm", "guide-college"],
      intro: "Un problème se résout en quatre temps : comprendre l'énoncé, le représenter (schéma, tableau, équation), calculer, puis répondre par une phrase. Ici, on s'entraîne à chaque temps.",
      questions: [
        {
          enonce: "Comprendre — Un mug cake cuit 1 min 30 à 800 W et contient 25 g de beurre. Léa prépare 3 mugs. Quelles données servent à calculer la quantité totale de beurre ?",
          choix: ["25 g par mug et 3 mugs", "1 min 30 et 800 W", "800 W et 3 mugs", "25 g et 800 W"],
          bonne: 0,
          explication: "La question porte sur le beurre : il faut la quantité par mug (25 g) et le nombre de mugs (3). Le temps de cuisson et la puissance sont des informations inutiles pour cette question, et 3 × 25 = 75 g."
        },
        {
          enonce: "Modéliser — Deux frères ont 36 billes en tout. Paul en a 8 de plus qu'Hugo. On représente Hugo par une barre de longueur x et Paul par une barre de longueur x plus un petit morceau de 8. Combien Hugo a-t-il de billes ?",
          choix: ["14", "18", "22", "28"],
          bonne: 0,
          explication: "Les deux barres font x + (x + 8) = 36. Donc 2x = 28 et x = 14 : Hugo a 14 billes, Paul 22 (14 + 22 = 36). 18 serait la moitié de 36 : on a oublié les 8 billes de plus."
        },
        {
          enonce: "Calculer — Marie veut préparer un mug cake pour 4 personnes. Pour 1 personne, il faut 25 g de beurre. Elle a 80 g de beurre. A-t-elle assez de beurre ?",
          choix: ["Oui, il lui en reste 20 g", "Non, il lui manque 20 g", "Non, il lui manque 100 g", "Oui, 80 g suffisent"],
          bonne: 1,
          explication: "Il faut 4 × 25 = 100 g. Elle a 80 g : 100 − 80 = 20 g manquent. Un bon réflexe : après le calcul, on relit la question (« a-t-elle assez ? ») pour répondre à ce qui est demandé."
        },
        {
          enonce: "Vérifier — Pour une recette pour 4 personnes, un élève trouve qu'il faut 3 200 g de farine. Que fait-il ?",
          choix: ["Il garde ce résultat, la calculatrice ne se trompe pas", "Il se dit que 3,2 kg de farine pour 4 personnes, c'est beaucoup trop, et il refait son calcul", "Il écrit la réponse sans relire", "Il change l'unité en kg et ne change rien d'autre"],
          bonne: 1,
          explication: "Un résultat doit être vraisemblable : 3,2 kg de farine, c'est la quantité de plusieurs gâteaux. Quand on a un doute, on vérifie l'ordre de grandeur et l'unité, puis on refait le calcul pour trouver l'erreur (souvent une virgule ou un zéro)."
        },
        {
          enonce: "Répondre — 3 cahiers coûtent 4,50 €. Combien coûtent 5 cahiers ?",
          choix: ["7,50 €", "6,50 €", "9,00 €", "1,50 €"],
          bonne: 0,
          explication: "Un cahier coûte 4,50 ÷ 3 = 1,50 €, donc 5 cahiers coûtent 5 × 1,50 = 7,50 €. 1,50 € est le prix d'un seul cahier : c'est une étape, pas la réponse à la question. On termine par une phrase : « 5 cahiers coûtent 7,50 €. »"
        }
      ]
    }

  ];

  window.ATELIERS = (window.ATELIERS || []).concat(FICHES);
})();

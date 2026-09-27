/* ============================================================
   MLDS MATHS — DONNÉES DES ATELIERS
   Chaque atelier reprend une compétence de base (proportionnalité,
   conversions, pourcentages, fractions) à partir de vraies
   recettes sucrées au micro-ondes. Volontairement : QCM uniquement
   (pas de saisie au clavier), 5 questions par atelier, explication
   courte et bienveillante après chaque réponse.
   ============================================================ */

const ATELIERS = [

  {
    id: "proportionnalite",
    titre: "Adapter une recette",
    sousTitre: "Proportionnalité",
    icone: "fa-scale-balanced",
    couleur: "prop",
    intro: "Quand on est plus ou moins nombreux à table, il faut adapter les quantités. C'est exactement ce que font les cuisiniers... et les mathématiciens !",
    questions: [
      {
        enonce: "Le mug cake tout chocolat (1 portion) demande 30 g de chocolat noir. Quelle quantité faut-il pour 3 portions ?",
        choix: ["60 g", "90 g", "100 g", "120 g"],
        bonne: 1,
        explication: "30 g pour 1 portion → 30 × 3 = 90 g pour 3 portions. On multiplie tout par le même nombre."
      },
      {
        enonce: "Toujours le mug cake (1 portion = 25 g de beurre). Combien de beurre pour 4 portions ?",
        choix: ["75 g", "90 g", "100 g", "110 g"],
        bonne: 2,
        explication: "25 g × 4 = 100 g. Chaque portion supplémentaire ajoute encore 25 g."
      },
      {
        enonce: "Le gâteau pommes-cannelle est prévu pour 4 personnes avec 4 pommes. Combien de pommes pour 8 personnes ?",
        choix: ["6 pommes", "8 pommes", "10 pommes", "12 pommes"],
        bonne: 1,
        explication: "8 personnes, c'est 2 fois plus que 4 personnes. Il faut donc 2 fois plus de pommes : 4 × 2 = 8."
      },
      {
        enonce: "La tarte Tatin utilise 150 g de sucre pour le caramel d'UNE tarte. Un professeur veut préparer 2 tartes pour sa classe : combien de sucre au total ?",
        choix: ["200 g", "250 g", "300 g", "350 g"],
        bonne: 2,
        explication: "150 g × 2 tartes = 300 g. On garde toujours le même « prix » pour chaque tarte."
      },
      {
        enonce: "Le mug cookie (1 portion) demande 30 g de farine. Combien de farine pour 2 portions ?",
        choix: ["45 g", "50 g", "60 g", "75 g"],
        bonne: 2,
        explication: "30 g × 2 = 60 g. Deux fois plus de gourmands, deux fois plus de farine."
      }
    ]
  },

  {
    id: "conversions",
    titre: "Le bon dosage",
    sousTitre: "Conversions d'unités",
    icone: "fa-ruler-combined",
    couleur: "conv",
    intro: "En cuisine, on jongle sans arrêt entre grammes et kilogrammes, minutes et secondes, litres et centilitres. Un même nombre peut s'écrire de plusieurs façons.",
    questions: [
      {
        enonce: "La crème dessert au chocolat demande 50 cl de lait. Combien cela fait-il de litres ?",
        choix: ["0,05 L", "0,5 L", "5 L", "50 L"],
        bonne: 1,
        explication: "1 L = 100 cl, donc 50 cl = 50 ÷ 100 = 0,5 L, soit un demi-litre."
      },
      {
        enonce: "Le mug cake cuit « 1 min 30 » au micro-ondes. Combien cela fait-il de secondes ?",
        choix: ["60 s", "90 s", "100 s", "130 s"],
        bonne: 1,
        explication: "1 min = 60 s, donc 1 min 30 = 60 + 30 = 90 secondes."
      },
      {
        enonce: "La crème dessert cuit « 4 minutes, par tranches de 1 minute ». Combien de tranches de cuisson doit-on faire au total ?",
        choix: ["2 tranches", "3 tranches", "4 tranches", "5 tranches"],
        bonne: 2,
        explication: "4 minutes divisées en tranches de 1 minute : 4 ÷ 1 = 4 tranches."
      },
      {
        enonce: "Le gâteau coco-chocolat cuit 6 minutes. Exprime ce temps en secondes.",
        choix: ["300 s", "360 s", "400 s", "600 s"],
        bonne: 1,
        explication: "6 min × 60 s = 360 s. On multiplie toujours par 60 pour passer des minutes aux secondes."
      },
      {
        enonce: "La tarte Tatin cuit 5 minutes, puis encore 10 minutes. Quel est le temps de cuisson TOTAL ?",
        choix: ["10 min", "12 min", "15 min", "20 min"],
        bonne: 2,
        explication: "5 min + 10 min = 15 min. On additionne simplement les deux durées."
      }
    ]
  },

  {
    id: "pourcentages",
    titre: "Ajuster une recette",
    sousTitre: "Pourcentages",
    icone: "fa-percent",
    couleur: "pct",
    intro: "Réduire le sucre de 20 %, doubler une recette (+100 %)... les pourcentages permettent d'ajuster une quantité sans tout recalculer depuis le début.",
    questions: [
      {
        enonce: "Le gâteau coco-chocolat utilise 125 g de sucre. Tu veux le rendre moins sucré et retirer 20 % de cette quantité. Combien de grammes cela représente-t-il ?",
        choix: ["15 g", "20 g", "25 g", "30 g"],
        bonne: 2,
        explication: "20 % de 125 g = (125 × 20) ÷ 100 = 25 g. C'est la quantité à retirer."
      },
      {
        enonce: "Suite de la question précédente : quelle est la NOUVELLE quantité de sucre, une fois les 25 g retirés ?",
        choix: ["90 g", "95 g", "100 g", "105 g"],
        bonne: 2,
        explication: "125 g − 25 g = 100 g. On enlève la quantité calculée à la quantité de départ."
      },
      {
        enonce: "Le mug cake utilise 20 g de sucre. Tu veux augmenter la recette de 50 % pour une portion plus généreuse. Combien de sucre en tout ?",
        choix: ["25 g", "30 g", "35 g", "40 g"],
        bonne: 1,
        explication: "50 % de 20 g = 10 g. Puis 20 g + 10 g = 30 g au total."
      },
      {
        enonce: "La tarte Tatin utilise 150 g de sucre pour le caramel. Quel est 10 % de cette quantité ?",
        choix: ["10 g", "15 g", "20 g", "25 g"],
        bonne: 1,
        explication: "10 % d'une quantité, c'est cette quantité divisée par 10 : 150 ÷ 10 = 15 g."
      },
      {
        enonce: "Le gâteau pommes-cannelle utilise 4 pommes. Une classe double la recette, soit une augmentation de 100 %. Combien de pommes faut-il maintenant ?",
        choix: ["6 pommes", "8 pommes", "9 pommes", "12 pommes"],
        bonne: 1,
        explication: "Augmenter de 100 %, c'est ajouter la totalité une deuxième fois : 4 + 4 = 8 pommes (autrement dit, doubler)."
      }
    ]
  },

  {
    id: "fractions",
    titre: "Doser comme un pro",
    sousTitre: "Fractions & mesures",
    icone: "fa-mortar-pestle",
    couleur: "frac",
    intro: "Une pincée, une demi-portion, deux blancs d'œuf sur trois... les cuisiniers utilisent des fractions en permanence, souvent sans même s'en rendre compte.",
    questions: [
      {
        enonce: "Une recette demande « 1 pincée de levure ». Une pincée est une TOUTE PETITE quantité. À quelle fraction d'une cuillère à café cela correspond-il, environ ?",
        choix: ["1/2 (la moitié)", "1/4 (le quart)", "1/8 environ (une toute petite part)", "1 cuillère entière"],
        bonne: 2,
        explication: "Une pincée, c'est ce qu'on prend entre deux doigts : bien moins qu'un quart, environ un huitième de cuillère à café."
      },
      {
        enonce: "1 cuillère à soupe (c.à.s) équivaut à 3 cuillères à café (c.à.c). Une recette demande 2 c.à.s : combien de c.à.c cela fait-il ?",
        choix: ["4 c.à.c", "5 c.à.c", "6 c.à.c", "9 c.à.c"],
        bonne: 2,
        explication: "2 c.à.s × 3 c.à.c = 6 c.à.c. On multiplie le nombre de cuillères à soupe par 3."
      },
      {
        enonce: "Le mug cookie utilise « 1 jaune d'œuf » (l'œuf entier étant composé d'un jaune et d'un blanc). Quelle fraction de l'œuf entier représente le jaune seul ?",
        choix: ["1/4", "1/2", "1/3", "2/3"],
        bonne: 1,
        explication: "Un œuf se sépare en deux parties : le jaune et le blanc. Le jaune seul représente donc la moitié, soit 1/2."
      },
      {
        enonce: "Pour les îles flottantes, une recette utilise 2 blancs d'œuf sur les 3 prévus par la recette d'origine. Quelle fraction du total cela représente-t-il ?",
        choix: ["1/2", "1/3", "2/3", "3/4"],
        bonne: 2,
        explication: "On utilise 2 parts sur un total de 3 : cela s'écrit 2/3 (« deux tiers »)."
      },
      {
        enonce: "Une recette est prévue pour 4 personnes, mais tu ne cuisines que pour 2 personnes. Quelle fraction de la recette dois-tu préparer ?",
        choix: ["1/4", "1/3", "1/2", "2/3"],
        bonne: 2,
        explication: "2 personnes sur 4, c'est la moitié : 2/4 se simplifie en 1/2."
      }
    ]
  }

];

window.ATELIERS = ATELIERS;

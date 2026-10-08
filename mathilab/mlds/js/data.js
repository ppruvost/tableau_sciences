/**
 * data.js — Banque de compétences et de modules pour le générateur de parcours MLDS.
 *
 * STRUCTURE
 * PARCOURS_DATA = [
 *   {
 *     id: "algebre",
 *     label: "Algèbre",
 *     priorite: 1,                 // ordre d'apparition dans le plan de travail
 *     competences: [
 *       {
 *         id: "calcul_numerique",
 *         label: "Calcul numérique et priorités opératoires",
 *         items: [ "affirmation d'auto-positionnement 1", "... 2", "... 3" ],
 *         modules: {
 *           remobilisation: { titre, objectif, activites: [...], duree, ressources: [...] },
 *           consolidation:  { titre, objectif, activites: [...], duree, ressources: [...] }
 *         }
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * ]
 *
 * POUR PERSONNALISER : ajoute/modifie librement des compétences ou des domaines.
 * Chaque item d'auto-positionnement est noté par l'élève sur 3 niveaux (0, 1, 2).
 * La moyenne des items détermine le niveau de maîtrise (voir app.js → SEUILS).
 */

const PARCOURS_DATA = [
  // ============================= ALGÈBRE =============================
  {
    id: "algebre",
    label: "Algèbre",
    priorite: 1,
    competences: [
      {
        id: "alg_calcul_numerique",
        label: "Calcul numérique et priorités opératoires",
        items: [
          "Je sais poser et effectuer une addition, une soustraction, une multiplication et une division.",
          "Je sais appliquer les priorités opératoires (parenthèses, ×/÷ avant +/−).",
          "Je sais calculer avec des nombres relatifs (positifs et négatifs)."
        ],
        modules: {
          remobilisation: {
            titre: "Remise en confiance : calculer sans se tromper",
            objectif: "Retrouver des automatismes de calcul dans des situations concrètes et sans enjeu d'évaluation.",
            activites: [
              "Jeu de calcul mental rapide (cartes, dés, chrono) en binôme",
              "Calculs contextualisés : rendu de monnaie, budget, recette de cuisine",
              "Manipulation avec jetons positifs/négatifs pour les relatifs"
            ],
            duree: "2 à 3 séances de 30 min",
            ressources: ["Jeu de cartes/dés", "Fiche « calculs de la vie quotidienne »", "Jetons bicolores"]
          },
          consolidation: {
            titre: "Consolider les priorités opératoires",
            objectif: "Sécuriser l'application des règles de priorité sur des expressions numériques.",
            activites: [
              "Série d'expressions à calculer en étapes détaillées",
              "Repérage d'erreurs dans des calculs déjà faits (correction de copies fictives)",
              "Auto-évaluation chronométrée avec barème de réussite progressif"
            ],
            duree: "2 séances de 45 min",
            ressources: ["Fiche d'exercices gradués", "Grille d'auto-correction"]
          }
        }
      },
      {
        id: "alg_calcul_litteral",
        label: "Calcul littéral (développer, réduire, factoriser)",
        items: [
          "Je comprends ce que représente une lettre dans une expression mathématique.",
          "Je sais réduire une expression littérale simple (ex : 3x + 2x).",
          "Je sais développer une expression du type k(a + b)."
        ],
        modules: {
          remobilisation: {
            titre: "Donner du sens à la lettre",
            objectif: "Redonner du sens concret à l'utilisation d'une lettre pour représenter un nombre inconnu.",
            activites: [
              "Programme de calcul oral : « pense à un nombre, ajoute 3, multiplie par 2… »",
              "Traduction d'énoncés concrets en expressions littérales simples",
              "Manipulation avec des boîtes/étiquettes représentant l'inconnue"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Fiche « programmes de calcul »", "Étiquettes ou boîtes opaques"]
          },
          consolidation: {
            titre: "Développer et réduire sans erreur",
            objectif: "Automatiser le développement et la réduction d'expressions littérales simples.",
            activites: [
              "Exercices gradués de réduction puis de développement",
              "Association expression/forme développée (jeu de memory ou dominos)",
              "Auto-correction avec code couleur des étapes"
            ],
            duree: "2 à 3 séances de 45 min",
            ressources: ["Fiche d'exercices gradués", "Jeu de dominos algébriques"]
          }
        }
      },
      {
        id: "alg_equations",
        label: "Résolution d'équations du premier degré",
        items: [
          "Je comprends ce que signifie « résoudre une équation ».",
          "Je sais résoudre une équation simple du type x + a = b ou ax = b.",
          "Je sais résoudre une équation du type ax + b = c."
        ],
        modules: {
          remobilisation: {
            titre: "L'équation comme une balance",
            objectif: "Comprendre visuellement le principe d'équilibre d'une équation avant tout formalisme.",
            activites: [
              "Modélisation avec une balance (réelle ou schématisée) et des objets",
              "Jeu de la « boîte mystère » : retrouver le nombre caché",
              "Verbalisation orale des étapes avant passage à l'écrit"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Balance de Roberval ou schéma", "Fiche « boîte mystère »"]
          },
          consolidation: {
            titre: "Résoudre méthodiquement une équation",
            objectif: "Automatiser la méthode de résolution pas à pas, avec vérification systématique du résultat.",
            activites: [
              "Exercices gradués avec méthode guidée (étapes numérotées)",
              "Vérification systématique par substitution de la solution",
              "Problèmes simples menant à une mise en équation"
            ],
            duree: "3 séances de 45 min",
            ressources: ["Fiche méthode pas à pas", "Fiche d'exercices gradués"]
          }
        }
      },
      {
        id: "alg_proportionnalite",
        label: "Proportionnalité et fonctions linéaires",
        items: [
          "Je sais reconnaître une situation de proportionnalité.",
          "Je sais utiliser le produit en croix ou un coefficient pour calculer une quatrième proportionnelle.",
          "Je sais lire et compléter un tableau de proportionnalité."
        ],
        modules: {
          remobilisation: {
            titre: "La proportionnalité dans le quotidien",
            objectif: "Identifier des situations de proportionnalité vécues (recettes, prix, vitesse) pour ancrer la notion.",
            activites: [
              "Recherche de situations proportionnelles ou non dans des documents réels (tickets de caisse, recettes)",
              "Jeu du « juste prix » avec quantités variables",
              "Construction collective d'un tableau de proportionnalité à partir d'une situation vécue"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Tickets de caisse / recettes", "Fiche « proportionnel ou pas »"]
          },
          consolidation: {
            titre: "Calculer avec un coefficient de proportionnalité",
            objectif: "Automatiser le calcul de quatrième proportionnelle par produit en croix et par coefficient.",
            activites: [
              "Exercices gradués de complétion de tableaux",
              "Problèmes de pourcentages et d'échelles",
              "Comparaison des deux méthodes (coefficient / produit en croix) sur un même exercice"
            ],
            duree: "2 à 3 séances de 45 min",
            ressources: ["Fiche d'exercices gradués", "Cartes de problèmes contextualisés"]
          }
        }
      },
      {
        id: "alg_mise_en_equation",
        label: "Mise en équation d'un problème",
        items: [
          "Je sais repérer l'inconnue dans un énoncé de problème.",
          "Je sais traduire un énoncé simple par une équation.",
          "Je sais interpréter la solution trouvée dans le contexte du problème."
        ],
        modules: {
          remobilisation: {
            titre: "Du texte au calcul, pas à pas",
            objectif: "Dédramatiser les problèmes en les décomposant en petites étapes concrètes.",
            activites: [
              "Surlignage collectif des informations utiles dans un énoncé court",
              "Reformulation orale du problème avec ses propres mots",
              "Résolution guidée d'un problème très court en 3 étapes maximum"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Fiche « je surligne, je reformule, je calcule »"]
          },
          consolidation: {
            titre: "Résoudre un problème de bout en bout",
            objectif: "Structurer la démarche complète : identifier l'inconnue, poser l'équation, résoudre, interpréter.",
            activites: [
              "Problèmes gradués avec grille méthodologique",
              "Rédaction complète d'une solution avec phrase de conclusion",
              "Auto-évaluation avec grille de critères de réussite"
            ],
            duree: "3 séances de 45 min",
            ressources: ["Grille méthodologique de résolution", "Banque de problèmes gradués"]
          }
        }
      }
    ]
  },

  // ============================ GÉOMÉTRIE ============================
  {
    id: "geometrie",
    label: "Géométrie",
    priorite: 2,
    competences: [
      {
        id: "geo_vocabulaire",
        label: "Vocabulaire, figures planes et angles",
        items: [
          "Je connais le vocabulaire de base (droite, segment, angle, polygone).",
          "Je sais mesurer et tracer un angle avec un rapporteur.",
          "Je sais reconnaître et nommer les figures planes usuelles."
        ],
        modules: {
          remobilisation: {
            titre: "Retrouver le vocabulaire géométrique",
            objectif: "Réactiver le vocabulaire de base par le jeu et la manipulation.",
            activites: [
              "Jeu du portrait géométrique (deviner une figure à partir d'indices)",
              "Chasse aux formes géométriques dans l'environnement proche",
              "Manipulation d'un rapporteur sur des angles concrets (coins de table, portes…)"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Cartes « portrait géométrique »", "Rapporteurs"]
          },
          consolidation: {
            titre: "Tracer et mesurer avec précision",
            objectif: "Automatiser l'usage des instruments (règle, équerre, rapporteur, compas).",
            activites: [
              "Ateliers tournants par instrument avec fiche de consignes",
              "Reproduction de figures simples sur papier quadrillé puis blanc",
              "Auto-contrôle de la précision des tracés (tolérance donnée)"
            ],
            duree: "2 à 3 séances de 45 min",
            ressources: ["Matériel de géométrie", "Fiches de figures à reproduire"]
          }
        }
      },
      {
        id: "geo_perimetre_aire",
        label: "Périmètres et aires",
        items: [
          "Je connais les formules de périmètre des figures usuelles.",
          "Je connais les formules d'aire des figures usuelles.",
          "Je sais choisir la bonne unité et convertir des unités de mesure."
        ],
        modules: {
          remobilisation: {
            titre: "Périmètre et aire, ça sert à quoi ?",
            objectif: "Ancrer les notions de périmètre et d'aire dans des situations concrètes et manipulables.",
            activites: [
              "Mesure réelle d'objets de la salle (bureau, tableau, sol)",
              "Pavage d'une surface avec des carreaux pour visualiser l'aire",
              "Comparaison intuitive avant calcul : « quelle figure a le plus grand périmètre ? »"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Mètre ruban", "Carreaux ou gabarits de pavage"]
          },
          consolidation: {
            titre: "Calculer périmètres et aires avec méthode",
            objectif: "Automatiser le choix et l'application de la bonne formule selon la figure.",
            activites: [
              "Fiche de formules à compléter et illustrer soi-même",
              "Exercices gradués avec figures composées",
              "Problèmes de conversion d'unités (cm², m², etc.)"
            ],
            duree: "2 à 3 séances de 45 min",
            ressources: ["Fiche formulaire illustrée", "Fiche d'exercices gradués"]
          }
        }
      },
      {
        id: "geo_pythagore",
        label: "Théorème de Pythagore",
        items: [
          "Je sais reconnaître un triangle rectangle et nommer l'hypoténuse.",
          "Je connais l'énoncé du théorème de Pythagore.",
          "Je sais l'utiliser pour calculer une longueur manquante."
        ],
        modules: {
          remobilisation: {
            titre: "Visualiser Pythagore",
            objectif: "Comprendre la relation entre les côtés d'un triangle rectangle avant la formule.",
            activites: [
              "Puzzle géométrique illustrant a² + b² = c² (aires de carrés)",
              "Vérification sur du papier quadrillé avec des triangles concrets",
              "Repérage de triangles rectangles dans l'environnement (charpente, escaliers…)"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Puzzle « carrés de Pythagore »", "Papier quadrillé"]
          },
          consolidation: {
            titre: "Appliquer Pythagore avec méthode",
            objectif: "Automatiser la démarche : identifier l'hypoténuse, écrire la relation, calculer.",
            activites: [
              "Exercices gradués avec méthode guidée en 3 étapes",
              "Problèmes concrets (échelle, diagonale d'un écran, d'un terrain)",
              "Auto-évaluation avec grille de critères de réussite"
            ],
            duree: "2 à 3 séances de 45 min",
            ressources: ["Fiche méthode Pythagore", "Banque de problèmes contextualisés"]
          }
        }
      },
      {
        id: "geo_thales",
        label: "Proportionnalité géométrique (théorème de Thalès)",
        items: [
          "Je sais reconnaître une configuration de Thalès (triangles emboîtés).",
          "Je sais écrire les rapports de longueurs correspondants.",
          "Je sais calculer une longueur manquante à l'aide de Thalès."
        ],
        modules: {
          remobilisation: {
            titre: "Agrandir et réduire une figure",
            objectif: "Relier Thalès à une expérience concrète d'agrandissement/réduction.",
            activites: [
              "Manipulation avec un agrandisseur/rétroprojecteur ou photocopieuse (échelle %)",
              "Construction de figures à l'échelle sur papier quadrillé",
              "Observation guidée d'une configuration de Thalès schématisée"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Photocopies à différentes échelles", "Papier quadrillé"]
          },
          consolidation: {
            titre: "Utiliser Thalès pour calculer une longueur",
            objectif: "Automatiser l'écriture des rapports et le calcul de la longueur manquante.",
            activites: [
              "Exercices gradués avec méthode guidée",
              "Problèmes concrets (ombre et hauteur, plan à l'échelle)",
              "Correction croisée entre pairs avec grille de vérification"
            ],
            duree: "2 à 3 séances de 45 min",
            ressources: ["Fiche méthode Thalès", "Banque de problèmes contextualisés"]
          }
        }
      },
      {
        id: "geo_reperage",
        label: "Repérage dans le plan (coordonnées)",
        items: [
          "Je sais placer un point à partir de ses coordonnées.",
          "Je sais lire les coordonnées d'un point placé sur un graphique.",
          "Je sais calculer la distance entre deux points simples sur un repère."
        ],
        modules: {
          remobilisation: {
            titre: "Se repérer dans un plan",
            objectif: "Ancrer la notion de repérage par des situations ludiques et spatiales.",
            activites: [
              "Jeu de bataille navale pour manipuler les coordonnées",
              "Repérage sur un plan de ville ou de salle de classe",
              "Placement de points « surprise » formant un dessin caché"
            ],
            duree: "2 séances de 30 min",
            ressources: ["Grilles de bataille navale", "Plan de ville ou de salle"]
          },
          consolidation: {
            titre: "Lire et calculer dans un repère",
            objectif: "Automatiser la lecture de coordonnées et le calcul de distances simples.",
            activites: [
              "Exercices gradués de placement et lecture de points",
              "Calcul de distance à l'aide du théorème de Pythagore dans un repère",
              "Construction d'une figure simple à partir de coordonnées données"
            ],
            duree: "2 séances de 45 min",
            ressources: ["Papier millimétré ou logiciel de géométrie", "Fiche d'exercices gradués"]
          }
        }
      }
    ]
  },

  // ============ TP : RECETTES SUCRÉES AU MICRO-ONDES ============
  {
    id: "tp_cuisine",
    label: "TP : recettes sucrées au micro-ondes",
    priorite: 3,
    competences: [
      {
        id: "tp_mesures_volumes",
        label: "Mesurer des volumes et des masses avec précision",
        items: [
          "Je sais lire une graduation sur un verre doseur (mL, cL, L).",
          "Je sais convertir entre mL, cL et L.",
          "Je sais utiliser une balance pour peser une quantité en grammes."
        ],
        modules: {
          remobilisation: {
            titre: "TP « Mug cake minute »",
            objectif: "Se réconcilier avec les unités de volume en réalisant une recette réussie du premier coup.",
            activites: [
              "Recette (1 mug, ~250 mL) : 60 mL de farine, 30 mL de sucre, 15 mL de cacao en poudre, une demi-dose de levure chimique, 60 mL de lait, 30 mL d'huile. Mélanger dans le mug, cuire 1 min 30 à 750 W.",
              "Mesurer chaque ingrédient au verre doseur ou à la cuillère graduée en annonçant la quantité à voix haute avant de verser",
              "Noter au fur et à mesure les quantités utilisées en mL sur une fiche, sans calcul écrit imposé"
            ],
            duree: "1 séance de 30 min (TP)",
            ressources: ["Micro-ondes", "Mug", "Verre doseur ou cuillères graduées", "Ingrédients du mug cake"]
          },
          consolidation: {
            titre: "TP « Brownie au micro-ondes, précision au gramme »",
            objectif: "Automatiser la conversion d'unités de masse et de volume à partir d'une recette pesée.",
            activites: [
              "Recette (2 parts) : 100 g de chocolat, 50 g de beurre, 80 g de sucre, 2 œufs, 40 g de farine. Faire fondre chocolat + beurre 1 min au micro-ondes, ajouter le reste, cuire 3 min à 600 W.",
              "Peser chaque ingrédient à la balance et convertir chaque masse en kg sur une fiche de suivi",
              "Calculer la masse totale de la préparation en g puis en kg, et vérifier par pesée du récipient plein"
            ],
            duree: "1 séance de 45 min (TP)",
            ressources: ["Balance de cuisine", "Micro-ondes", "Fiche de conversion g/kg", "Ingrédients du brownie"]
          }
        }
      },
      {
        id: "tp_proportionnalite_recette",
        label: "Adapter une recette (proportionnalité appliquée)",
        items: [
          "Je sais doubler ou diviser par deux les quantités d'une recette.",
          "Je sais adapter une recette pour un nombre de personnes différent (ex. pour 6 au lieu de 4).",
          "Je sais calculer le coût d'une recette à partir du prix des ingrédients au kg ou au litre."
        ],
        modules: {
          remobilisation: {
            titre: "TP « Un mug cake pour deux »",
            objectif: "Vivre concrètement le doublement d'une recette avant toute formalisation par un coefficient.",
            activites: [
              "Repartir de la recette du mug cake (1 mug) et préparer la même chose pour 2 mugs en doublant chaque quantité mesurée au verre doseur",
              "Comparer les deux mugs cuits : mêmes proportions, même goût ?",
              "Verbaliser à l'oral : « pour deux fois plus de mugs, je mets deux fois plus de chaque ingrédient »"
            ],
            duree: "1 séance de 30 min (TP)",
            ressources: ["Micro-ondes", "2 mugs", "Verre doseur", "Ingrédients du mug cake"]
          },
          consolidation: {
            titre: "TP « Recette à la carte »",
            objectif: "Utiliser un coefficient de proportionnalité pour adapter une recette à un nombre de parts donné et en calculer le coût.",
            activites: [
              "Recette de base d'un fondant au chocolat micro-ondes pour 4 personnes (tableau quantités fourni)",
              "Compléter un tableau de proportionnalité pour adapter la recette à 6, puis à 10, puis à 3 personnes",
              "Calculer le coût total de la recette à partir de prix au kg/L donnés (ex. chocolat 8 €/kg, beurre 6 €/kg, sucre 1,50 €/kg), puis le coût par part"
            ],
            duree: "1 à 2 séances de 45 min (TP + calculs)",
            ressources: ["Micro-ondes", "Fiche recette avec tableau de proportionnalité", "Fiche de prix des ingrédients"]
          }
        }
      },
      {
        id: "tp_volumes_recipients",
        label: "Volumes et contenance des récipients (lien avec la géométrie)",
        items: [
          "Je sais estimer si un mélange va rentrer dans un récipient donné (mug, bol, moule).",
          "Je sais calculer le volume d'un récipient cylindrique simple à partir de ses dimensions.",
          "Je sais relier une unité de volume géométrique (cm³) à une unité de contenance usuelle (mL)."
        ],
        modules: {
          remobilisation: {
            titre: "TP « Quel mug choisir ? »",
            objectif: "Comparer expérimentalement la contenance de plusieurs récipients avant tout calcul.",
            activites: [
              "Remplir 3 mugs de formes différentes avec de l'eau mesurée au verre doseur, jusqu'à 2 cm du bord",
              "Classer les mugs du plus petit au plus grand contenant, puis vérifier avec les mL mesurés",
              "Relier oralement : « 1 mL d'eau occupe 1 cm³ de volume »"
            ],
            duree: "1 séance de 30 min (TP)",
            ressources: ["3 mugs de formes différentes", "Verre doseur", "Eau"]
          },
          consolidation: {
            titre: "TP « Le mug cake tiendra-t-il dans le mug ? »",
            objectif: "Calculer le volume d'un mug (cylindre) et vérifier, avant cuisson, que la pâte ne débordera pas.",
            activites: [
              "Mesurer le diamètre et la hauteur intérieurs du mug avec une règle",
              "Calculer le volume du mug en cm³ avec la formule V = π × r² × h, puis le convertir en mL",
              "Comparer ce volume au volume total des ingrédients liquides et solides de la recette (augmenté d'environ 30 % pour tenir compte du gonflement à la cuisson) et conclure si le mug est adapté"
            ],
            duree: "1 séance de 45 min (TP + calculs)",
            ressources: ["Mug", "Règle graduée", "Fiche méthode « volume du cylindre »", "Ingrédients du mug cake"]
          }
        }
      },
      {
        id: "tp_puissance_temps",
        label: "Adapter un temps de cuisson à la puissance du four (proportionnalité inverse)",
        items: [
          "Je sais repérer, sur une recette, la puissance et le temps de cuisson de référence.",
          "Je comprends que si la puissance du four est plus faible, il faut cuire plus longtemps (et inversement).",
          "Je sais recalculer un temps de cuisson approché quand la puissance change, à l'aide d'une règle donnée."
        ],
        modules: {
          remobilisation: {
            titre: "TP « Mon four n'a pas la bonne puissance »",
            objectif: "Observer concrètement l'effet de la puissance sur la cuisson avant tout calcul.",
            activites: [
              "Réaliser le mug cake cookie (recette calibrée pour 700 W) avec le four disponible",
              "Si le four fait plus de 700 W, surveiller la cuisson dès 45 s pour éviter de trop cuire ; s'il fait moins, prolonger par tranches de 15 s",
              "Comparer à l'oral le résultat obtenu à la texture attendue (moelleux à cœur) et formuler la règle observée avec ses propres mots"
            ],
            duree: "1 séance de 30 min (TP)",
            ressources: ["Micro-ondes", "Recette du mug cake cookie (fiche recettes bonus)", "Ramequin"]
          },
          consolidation: {
            titre: "TP « Calculer le bon temps de cuisson »",
            objectif: "Utiliser la relation temps₂ ≈ temps₁ × puissance₁ ÷ puissance₂ pour adapter le temps de cuisson d'une recette à la puissance réelle du four.",
            activites: [
              "À partir des recettes de la fiche bonus (ex. mug cake tout chocolat : 1 min 30 à 800 W), recalculer le temps nécessaire pour un four de 700 W puis de 900 W",
              "Vérifier le calcul en réalisant effectivement la cuisson au temps recalculé, puis ajuster si besoin",
              "Construire un tableau puissance/temps pour une même recette et observer que le produit puissance × temps reste à peu près constant (proportionnalité inverse)"
            ],
            duree: "1 à 2 séances de 45 min (calculs + TP)",
            ressources: ["Fiche recettes bonus (puissances et temps de référence)", "Micro-ondes", "Calculatrice"]
          }
        }
      }
    ],
    recettesBonus: {
      chapo: "Une sélection de recettes sucrées rapides au micro-ondes, à utiliser pour varier les TP de remobilisation et de consolidation selon le temps disponible et le niveau des élèves.",
      recettes: [
        {
          titre: "Mug cake tout chocolat",
          portions: "1 portion",
          duree: "~2 min",
          etapes: [
            "Faire fondre 30 g de chocolat noir et 25 g de beurre (30 s à puissance moyenne)",
            "Ajouter 1 œuf et 20 g de sucre, mélanger",
            "Incorporer 25 g de farine, 1 pincée de levure et 1 c. à s. de lait (pépites de chocolat en option)",
            "Cuire 1 min 30 à 800 W (le cœur doit rester moelleux)"
          ]
        },
        {
          titre: "Mug cake cookie",
          portions: "1 portion",
          duree: "~1 min",
          etapes: [
            "Faire fondre 15 g de beurre dans un ramequin",
            "Ajouter 10 g de sucre, 10 g de cassonade et 1 jaune d'œuf, mélanger",
            "Incorporer 30 g de farine et 15 g de chocolat en morceaux",
            "Cuire 1 min à 700 W et déguster aussitôt"
          ]
        },
        {
          titre: "Gâteau aux pommes et cannelle",
          portions: "4 personnes",
          duree: "~10 min",
          etapes: [
            "Peler et évider 4 pommes, les déposer dans un plat micro-ondes",
            "Saupoudrer de cannelle et de sucre",
            "Cuire 10 min à 700 W",
            "Servir chaud, éventuellement avec une boule de glace vanille"
          ]
        },
        {
          titre: "Crème dessert au chocolat",
          portions: "4 à 6 personnes",
          duree: "~4 min",
          etapes: [
            "Délayer 2 c. à s. de Maïzena et 3 c. à s. de cacao dans 50 cl de lait",
            "Incorporer 3 œufs et 3 c. à s. de sucre, fouetter",
            "Cuire 4 min, par tranches de 1 min, en fouettant entre chaque",
            "Laisser refroidir au réfrigérateur avant de servir"
          ]
        },
        {
          titre: "Îles flottantes express",
          portions: "variable",
          duree: "~1 min",
          etapes: [
            "Monter 2 à 3 blancs en neige avec une pincée de sel et 1 à 2 c. à s. de sucre",
            "Répartir dans des ramequins individuels",
            "Cuire 1 min à puissance maximale",
            "Servir sur une crème anglaise et napper de caramel"
          ]
        },
        {
          titre: "Gâteau moelleux coco-chocolat",
          portions: "6 à 8 parts",
          duree: "~6 min",
          etapes: [
            "Faire fondre 60 g de chocolat noir et 65 g de chocolat blanc à la noix de coco",
            "Mélanger 3 œufs et 125 g de sucre dans un saladier",
            "Ajouter 40 g de farine, 35 g de noix de coco râpée et 1 c. à c. de levure",
            "Incorporer le chocolat fondu, verser dans un plat beurré et cuire 6 min à puissance maximale"
          ]
        },
        {
          titre: "Tarte Tatin micro-ondes",
          portions: "6 à 8 parts",
          duree: "~15 min",
          etapes: [
            "Préparer une pâte sablée rapide (100 g de farine, 50 g de beurre, 1 c. à s. de sucre, 2 c. à s. d'eau, 1 pincée de sel)",
            "Réaliser un caramel avec 150 g de sucre et un peu d'eau, verser dans un moule silicone",
            "Disposer 2 pommes pelées et coupées par-dessus, cuire 5 min à puissance maximale",
            "Recouvrir avec la pâte rabattue sur les bords, cuire encore 10 min, laisser refroidir 15 min avant de démouler"
          ]
        }
      ],
      conseils: [
        "Utiliser toujours des récipients adaptés au micro-ondes (verre, céramique, silicone)",
        "Adapter les temps selon la puissance de l'appareil (généralement 700 à 900 W)",
        "Pour les mug cakes, privilégier des tasses larges afin d'éviter que la pâte ne déborde"
      ]
    }
  }
];

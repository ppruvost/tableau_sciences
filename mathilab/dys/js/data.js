/**
 * data.js — Contenu pédagogique du parcours « Dys · Dyscalculie ».
 *
 * STRUCTURE (identique à /mlds, avec un champ en plus : `amenagements`)
 * DYS_DATA = [ { id, label, priorite, competences: [ {
 *     id, label,
 *     items: [3 affirmations d'auto-positionnement],
 *     modules: {
 *       remobilisation: { titre, objectif, activites[], amenagements[], duree, ressources[] },
 *       consolidation:  { titre, objectif, activites[], amenagements[], duree, ressources[] }
 *     }
 * } ] } ]
 *
 * Les affirmations sont notées par l'élève : 0 = pas encore, 1 = avec de l'aide, 2 = tout seul·e.
 *
 * IMPORTANT : cet outil est pédagogique. Il ne pose aucun diagnostic et ne remplace
 * ni un bilan (orthophonique, neuropsychologique…) ni un plan d'accompagnement (PAP, PPS).
 */

const DYS_DATA = [
  // ======================= 1. SENS DU NOMBRE =======================
  {
    id: "sens_nombre",
    label: "Sens du nombre",
    priorite: 1,
    competences: [
      {
        id: "dys_quantites",
        label: "Reconnaître et comparer des quantités",
        items: [
          "Je vois combien il y a de points (jusqu'à 5) sans les compter un par un.",
          "Je sais dire quel nombre est le plus grand entre deux nombres.",
          "Je sais ranger des nombres du plus petit au plus grand."
        ],
        modules: {
          remobilisation: {
            titre: "Voir les quantités d'un coup d'œil",
            objectif: "Reconstruire l'image mentale des petites quantités, sans compter un par un.",
            activites: [
              "Jeu de dés et de cartes à points : dire la quantité le plus vite possible… ou sans se presser",
              "Outil « Combien de points ? » de l'onglet Outils, en mode « je regarde le temps que je veux »",
              "Boîte d'œufs ou cadre de 10 : remplir, vider, dire combien il manque pour faire 10"
            ],
            amenagements: ["Aucun chronomètre", "Arrangements réguliers des points (dé, cadre de 10)", "Droit de se servir des doigts"],
            duree: "3 séances de 15 min",
            ressources: ["Dés et cartes à points", "Boîte d'œufs ou cadre de 10", "Outil « Combien de points ? »"]
          },
          consolidation: {
            titre: "Comparer et ranger les nombres",
            objectif: "Comparer et ordonner des nombres en s'appuyant sur des quantités et sur la droite numérique.",
            activites: [
              "Comparer deux nombres avec des cubes ou des barres, puis seulement avec les chiffres",
              "Ranger des cartes-nombres sur une droite numérique tracée au sol ou sur la table",
              "Expliquer à l'oral pourquoi un nombre est plus grand (« il a plus de dizaines »)"
            ],
            amenagements: ["Droite numérique graduée toujours disponible", "Cartes-nombres de couleurs différentes", "Ranger à deux, en discutant"],
            duree: "3 séances de 20 min",
            ressources: ["Cubes ou barres Base 10", "Cartes-nombres", "Droite numérique"]
          }
        }
      },
      {
        id: "dys_droite",
        label: "Se repérer sur la droite numérique",
        items: [
          "Je sais placer un nombre entre 0 et 10 sur une droite.",
          "Je sais placer un nombre entre 0 et 100 sur une droite.",
          "Je sais trouver le nombre juste avant et juste après un nombre donné."
        ],
        modules: {
          remobilisation: {
            titre: "Le chemin des nombres",
            objectif: "Donner un sens spatial aux nombres : plus on avance, plus le nombre grandit.",
            activites: [
              "Marche numérique : avancer et reculer sur une bande de nombres tracée au sol",
              "Jeu de l'oie avec dés : dire à voix haute le nombre de la case d'arrivée",
              "Outil « Placer un nombre sur la droite » (échelle 0–10 puis 0–20)"
            ],
            amenagements: ["Droite visible en permanence", "Repères 0, 5 et 10 colorés", "Aucune pénalité pour l'écart"],
            duree: "3 séances de 20 min",
            ressources: ["Bande numérique au sol", "Jeu de l'oie", "Outil « Placer un nombre sur la droite »"]
          },
          consolidation: {
            titre: "Placer et estimer sur la droite",
            objectif: "Estimer la place d'un nombre entre deux repères, jusqu'à 100.",
            activites: [
              "Outil « Placer un nombre sur la droite » en échelle 0–100, avec la correction visuelle",
              "Trouver le milieu entre deux nombres (50 entre 0 et 100, puis 25, 75…)",
              "Compléter une droite graduée dont certains nombres sont cachés"
            ],
            amenagements: ["Repères 0, 50 et 100 toujours visibles", "Aucun temps imposé", "Vérification par comptage de repères"],
            duree: "3 séances de 20 min",
            ressources: ["Outil « Placer un nombre sur la droite »", "Droites graduées à compléter"]
          }
        }
      }
    ]
  },

  // ======================= 2. NUMÉRATION =======================
  {
    id: "numeration",
    label: "Numération",
    priorite: 2,
    competences: [
      {
        id: "dys_position",
        label: "Comprendre la valeur des chiffres (unités, dizaines, centaines)",
        items: [
          "Je sais que dans 345, le 4 représente 4 dizaines, donc 40.",
          "Je sais échanger 10 unités contre 1 dizaine (et 10 dizaines contre 1 centaine).",
          "Je sais écrire un nombre sous la forme 300 + 40 + 5."
        ],
        modules: {
          remobilisation: {
            titre: "Les boîtes de dizaines",
            objectif: "Manipuler pour comprendre pourquoi la place d'un chiffre change sa valeur.",
            activites: [
              "Avec cubes, barres et plaques : construire un nombre, puis échanger 10 cubes contre une barre",
              "Outil « Construire un nombre » de l'onglet Outils (unités, dizaines, centaines en couleurs)",
              "Lire à voix haute le nombre construit, puis le décomposer"
            ],
            amenagements: ["Matériel manipulable", "Une couleur par colonne (centaines bleu, dizaines vert, unités rouge)", "Nombres limités à 3 chiffres"],
            duree: "3 séances de 20 min",
            ressources: ["Matériel Base 10 (cubes, barres, plaques)", "Outil « Construire un nombre »"]
          },
          consolidation: {
            titre: "Tableau de numération en couleurs",
            objectif: "Lire, écrire et décomposer des nombres avec un tableau de numération coloré.",
            activites: [
              "Dictée de nombres à écrire dans le tableau (centaines | dizaines | unités)",
              "Décomposer 5 nombres par jour : 273 = 200 + 70 + 3",
              "Repérer le rôle du zéro : 305, 350, 35 (écrire dans le tableau pour comparer)"
            ],
            amenagements: ["Tableau de numération imprimé et plastifié", "Colonnes de couleurs différentes", "Pas de lecture de nombres à voix haute devant la classe"],
            duree: "4 séances de 20 min",
            ressources: ["Tableau de numération en couleurs", "Cartes de nombres à décomposer"]
          }
        }
      }
    ]
  },

  // ======================= 3. CALCUL =======================
  {
    id: "calcul",
    label: "Calcul",
    priorite: 3,
    competences: [
      {
        id: "dys_addsous",
        label: "Additionner et soustraire avec des stratégies",
        items: [
          "Je sais compléter à 10 (par exemple 7 + ? = 10) sans compter sur mes doigts.",
          "Je sais utiliser les doubles (6 + 6 = 12, donc 6 + 7 = 13).",
          "Je sais poser une addition ou une soustraction en alignant bien les colonnes."
        ],
        modules: {
          remobilisation: {
            titre: "Compléments à 10 et doubles",
            objectif: "S'appuyer sur quelques repères solides (compléments à 10, doubles) plutôt que sur le comptage.",
            activites: [
              "Jeu de cartes « faire 10 » à deux (associer deux cartes dont la somme fait 10)",
              "Cadre de 10 : voir à chaque fois ce qu'il manque pour le remplir",
              "Mémoriser les doubles avec des images (2 pieds + 2 pieds…)"
            ],
            amenagements: ["Doigts et cadre de 10 autorisés", "Aucun calcul mental chronométré", "Mémo « compléments à 10 » sur la table"],
            duree: "4 séances de 15 min",
            ressources: ["Jeu de cartes", "Cadre de 10", "Mémo « Faire 10 »"]
          },
          consolidation: {
            titre: "Poser une opération avec des repères",
            objectif: "Poser et résoudre additions et soustractions sans perdre les colonnes ni les retenues.",
            activites: [
              "Opérations sur papier quadrillé ou à colonnes colorées, une case par chiffre",
              "Écrire la retenue au bon endroit, dans une couleur dédiée",
              "Vérifier avec l'opération inverse, puis à la calculatrice"
            ],
            amenagements: ["Papier à colonnes colorées", "Calculatrice pour vérifier (si accord de l'équipe)", "Moins d'exercices, mieux choisis"],
            duree: "4 séances de 25 min",
            ressources: ["Papier quadrillé ou à colonnes colorées", "Mémo « Poser une addition »"]
          }
        }
      },
      {
        id: "dys_tables",
        label: "Retrouver les tables de multiplication",
        items: [
          "Je connais les tables de 2, de 5 et de 10.",
          "Je sais retrouver 6 × 4 en passant par 2 × 4 doublé, ou 5 × 4 + 4.",
          "Je sais utiliser une table de multiplication de référence pour vérifier."
        ],
        modules: {
          remobilisation: {
            titre: "Les tables en tableaux de points",
            objectif: "Voir une multiplication comme un rectangle de points plutôt que comme une récitation.",
            activites: [
              "Outil « Les tables en images » : choisir deux nombres, voir le rectangle de points",
              "Compter les lignes plutôt que les points un par un",
              "Colorier un tableau de multiplication : repérer les motifs (table de 2, de 5, de 10)"
            ],
            amenagements: ["Tableau de multiplication imprimé à disposition", "Aucune récitation devant les autres", "Une table à la fois"],
            duree: "4 séances de 15 min",
            ressources: ["Outil « Les tables en images »", "Tableau de multiplication à colorier"]
          },
          consolidation: {
            titre: "Retrouver une table avec des stratégies",
            objectif: "Reconstruire un produit oublié à partir de produits connus (doubler, moitié de ×10, ×9).",
            activites: [
              "×2 = doubler ; ×5 = la moitié de ×10 ; ×10 = ajouter un zéro",
              "×9 : faire ×10 puis enlever une fois le nombre (9 × 7 = 70 − 7)",
              "Fiche-stratégie personnelle : pour chaque produit oublié, écrire le chemin qui marche pour moi"
            ],
            amenagements: ["Tableau de multiplication toujours autorisé", "Calculatrice pour vérifier", "Temps supplémentaire"],
            duree: "5 séances de 20 min",
            ressources: ["Mémos stratégies (×2, ×5, ×9, ×10)", "Tableau de multiplication"]
          }
        }
      },
      {
        id: "dys_signes",
        label: "Lire les signes et estimer un résultat",
        items: [
          "Je ne confonds pas les signes + , − , × et ÷.",
          "Je sais estimer à peu près le résultat avant de calculer.",
          "Je sais me servir d'une calculatrice et vérifier si le résultat est possible."
        ],
        modules: {
          remobilisation: {
            titre: "Les signes en images",
            objectif: "Associer chaque signe à une image ou un geste pour ne plus les confondre.",
            activites: [
              "Mimer chaque signe : + (ajouter), − (enlever), × (répéter), ÷ (partager)",
              "Associer chaque signe à une petite histoire dessinée",
              "Entourer le signe en couleur avant de calculer"
            ],
            amenagements: ["Signe entouré en couleur", "Mémo des signes sur la table", "Une seule opération par ligne"],
            duree: "2 séances de 15 min",
            ressources: ["Cartes « signes en images »", "Crayons de couleur"]
          },
          consolidation: {
            titre: "Estimer avant de calculer",
            objectif: "Se faire une idée du résultat pour repérer soi-même une erreur.",
            activites: [
              "Arrondir à la dizaine ou à la centaine, puis calculer à peu près",
              "Dire à l'oral : « Le résultat sera plutôt petit / grand, pourquoi ? »",
              "Taper le calcul à la calculatrice et comparer à l'estimation"
            ],
            amenagements: ["Calculatrice autorisée (outil de vérification)", "Valoriser l'estimation, pas seulement le résultat exact"],
            duree: "3 séances de 20 min",
            ressources: ["Fiche « estimer »", "Calculatrice"]
          }
        }
      }
    ]
  },

  // ======================= 4. GRANDEURS ET MESURES =======================
  {
    id: "grandeurs",
    label: "Grandeurs et mesures",
    priorite: 4,
    competences: [
      {
        id: "dys_heure_monnaie",
        label: "Lire l'heure, calculer des durées, utiliser la monnaie",
        items: [
          "Je sais lire l'heure sur une horloge à aiguilles.",
          "Je sais calculer une durée en passant par des étapes (de 14 h 15 à 15 h 00, puis jusqu'à 15 h 40).",
          "Je sais rendre la monnaie en complétant."
        ],
        modules: {
          remobilisation: {
            titre: "Une horloge à manipuler",
            objectif: "Relier l'horloge à des moments vécus de la journée.",
            activites: [
              "Horloge en carton à aiguilles mobiles : afficher les heures de la journée de l'élève",
              "Jeu du marchand avec pièces et billets factices",
              "Frise de la journée : placer les événements dans l'ordre"
            ],
            amenagements: ["Horloge à aiguilles ET affichage numérique côte à côte", "Pièces et billets en vrai", "Aucun chrono"],
            duree: "3 séances de 20 min",
            ressources: ["Horloge pédagogique", "Pièces et billets factices", "Frise de la journée"]
          },
          consolidation: {
            titre: "Durées par étapes et monnaie par compléments",
            objectif: "Décomposer pour calculer une durée ou rendre la monnaie.",
            activites: [
              "Durée par étapes : aller à l'heure pile suivante, puis ajouter le reste",
              "Rendre la monnaie en complétant jusqu'au prix, puis jusqu'au billet",
              "Tableau « heures | minutes » pour les conversions"
            ],
            amenagements: ["Frise ou droite des temps à dessiner", "Calculatrice pour vérifier", "Mises en situation réelles (emploi du temps)"],
            duree: "4 séances de 20 min",
            ressources: ["Droite des temps", "Pièces et billets factices", "Tableau heures | minutes"]
          }
        }
      },
      {
        id: "dys_mesures",
        label: "Mesurer, convertir et adapter une recette",
        items: [
          "Je sais lire une graduation (verre doseur, règle, balance).",
          "Je sais passer de mL à cL à L à l'aide d'un tableau.",
          "Je sais doubler ou diviser par deux les quantités d'une recette."
        ],
        modules: {
          remobilisation: {
            titre: "Cuisiner sans stress",
            objectif: "Mesurer pour de vrai avec un verre doseur et une balance, sans enjeu de note.",
            activites: [
              "Recette simple au micro-ondes (mug cake) : peser, mesurer, dire la quantité à voix haute",
              "Remplir un verre doseur jusqu'à un trait précis, puis vérifier à deux",
              "Doubler la recette pour deux mugs avec les mêmes contenants"
            ],
            amenagements: ["Recette illustrée étape par étape", "Quantités déjà notées en gros caractères", "Travail en binôme"],
            duree: "2 séances de 30 min (TP)",
            ressources: ["Micro-ondes", "Verre doseur, balance", "Recette illustrée"]
          },
          consolidation: {
            titre: "Tableau de conversion et recette proportionnelle",
            objectif: "Utiliser un tableau de conversion et un coefficient pour adapter une recette.",
            activites: [
              "Tableau de conversion : kg | g ; L | dL | cL | mL",
              "Adapter une recette de 4 à 6 personnes : coefficient 6 ÷ 4 = 1,5",
              "Vérifier à la calculatrice puis cuisiner la recette adaptée"
            ],
            amenagements: ["Tableau de conversion imprimé", "Calculatrice autorisée", "Mêmes recettes réutilisées pour gagner en confiance"],
            duree: "3 séances de 30 min",
            ressources: ["Tableau de conversion", "Fiche-recette à adapter", "Calculatrice"]
          }
        }
      }
    ]
  },

  // ======================= 5. PROBLÈMES =======================
  {
    id: "problemes",
    label: "Résolution de problèmes",
    priorite: 5,
    competences: [
      {
        id: "dys_problemes",
        label: "Comprendre et schématiser un problème",
        items: [
          "Je sais retrouver la question posée et les données utiles dans un énoncé.",
          "Je sais faire un dessin ou un schéma pour comprendre la situation.",
          "Je sais choisir l'opération et expliquer pourquoi."
        ],
        modules: {
          remobilisation: {
            titre: "Jouer le problème",
            objectif: "Comprendre la situation en la vivant avant de calculer.",
            activites: [
              "Rejouer l'énoncé avec des objets (billes, jetons, pièces)",
              "Reformuler l'énoncé avec ses mots, à l'oral ou en dessinant",
              "Résoudre à deux un problème très court en 3 étapes"
            ],
            amenagements: ["Énoncé lu à voix haute", "Aucune lecture à haute voix devant la classe", "Données et question surlignées de couleurs différentes"],
            duree: "3 séances de 20 min",
            ressources: ["Objets à manipuler", "Surligneurs de 2 couleurs"]
          },
          consolidation: {
            titre: "Schéma en barres et phrase-réponse",
            objectif: "Modéliser avec un schéma en barres, puis écrire une phrase-réponse.",
            activites: [
              "Dessiner une barre pour le tout et des morceaux pour les parties",
              "Écrire l'opération, la calculer (calculatrice si besoin), puis la phrase-réponse",
              "Vérifier : le résultat est-il possible dans la situation ?"
            ],
            amenagements: ["Calculatrice autorisée", "Grille méthode « 4 étapes » à disposition", "Un seul problème à la fois, bien aéré"],
            duree: "4 séances de 25 min",
            ressources: ["Grille méthode « 4 étapes »", "Schémas en barres modèles"]
          }
        }
      }
    ]
  },

  // ======================= 6. ESPACE ET ORGANISATION =======================
  {
    id: "espace",
    label: "Espace et organisation",
    priorite: 6,
    competences: [
      {
        id: "dys_espace",
        label: "Se repérer, lire un tableau, aligner les chiffres",
        items: [
          "Je sais distinguer ma gauche et ma droite, en haut et en bas.",
          "Je sais lire un tableau à double entrée ou trouver un point sur un quadrillage.",
          "Je sais écrire mes chiffres bien alignés, une case par chiffre."
        ],
        modules: {
          remobilisation: {
            titre: "Jeux de repérage",
            objectif: "Retrouver ses repères dans l'espace, avec le corps puis sur le papier.",
            activites: [
              "Bataille navale sur grille 5 × 5",
              "Chasse au trésor avec un plan de la salle",
              "Donner des directions à un camarade (avance, tourne à droite…)"
            ],
            amenagements: ["Repère gauche/droite (bracelet, gomme sur la main)", "Grilles aux cases larges", "Aucune notation"],
            duree: "3 séances de 20 min",
            ressources: ["Grilles de bataille navale", "Plan de la salle"]
          },
          consolidation: {
            titre: "Lire et construire tableaux et quadrillages",
            objectif: "Lire un tableau en suivant une ligne et une colonne, aligner ses calculs.",
            activites: [
              "Tableau à double entrée avec lignes de couleurs alternées",
              "Règle ou cache pour suivre une ligne",
              "Papier quadrillé : une case par chiffre, unités sous les unités"
            ],
            amenagements: ["Règle ou cache à disposition", "Tableaux aérés, lignes alternées", "Photocopies agrandies"],
            duree: "3 séances de 20 min",
            ressources: ["Tableaux à double entrée", "Papier quadrillé large", "Règle de lecture"]
          }
        }
      }
    ]
  }
];

/** Aménagements généraux proposés quel que soit le profil (à valider avec l'équipe éducative). */
const AMENAGEMENTS_GENERAUX = [
  "Consignes courtes, données une à une et reformulées à l'oral",
  "Temps supplémentaire, aucun exercice chronométré",
  "Tables de multiplication, formulaire et mémos disponibles pendant les exercices",
  "Calculatrice autorisée comme outil de vérification (selon l'accord de l'équipe)",
  "Papier quadrillé large ou à colonnes colorées",
  "Moins d'exercices, mieux choisis, présentés sur une page aérée",
  "Valoriser la démarche et les stratégies plutôt que le seul résultat",
  "Matériel manipulable disponible à tout moment",
  "Droit à l'erreur : on corrige ensemble, sans note ni comparaison"
];

/** Aide-mémoire (affichés dans l'onglet « Aide-mémoire », imprimables). */
const DYS_MEMOS = [
  {
    titre: "Faire 10",
    lignes: ["1 + 9 · 2 + 8 · 3 + 7 · 4 + 6 · 5 + 5", "Pour 7 + 5 : je prends 3 de 5 pour faire 10, il reste 2 → 12", "Je peux m'aider d'un cadre de 10"]
  },
  {
    titre: "Doubles et presque-doubles",
    lignes: ["Doubles : 3+3=6 · 4+4=8 · 6+6=12 · 7+7=14 · 8+8=16", "Presque-double : 6 + 7 = 6 + 6 + 1 = 13"]
  },
  {
    titre: "Multiplier par 2, 5, 10",
    lignes: ["×2 : je double", "×10 : j'ajoute un zéro (3 × 10 = 30)", "×5 : je prends la moitié de ×10 (5 × 6 = 60 ÷ 2 = 30)"]
  },
  {
    titre: "Multiplier par 9",
    lignes: ["9 × 7 = 10 × 7 − 7 = 70 − 7 = 63", "Je fais ×10, puis j'enlève une fois le nombre"]
  },
  {
    titre: "Poser une addition",
    lignes: ["1. J'aligne les unités sous les unités", "2. Je commence par la droite", "3. Si le total dépasse 9, j'écris le chiffre des unités et je note la retenue en couleur", "4. Je vérifie avec l'opération inverse"]
  },
  {
    titre: "Valeur des chiffres",
    lignes: ["Centaines | Dizaines | Unités", "345 = 300 + 40 + 5", "10 unités = 1 dizaine · 10 dizaines = 1 centaine"]
  },
  {
    titre: "Heure et durée",
    lignes: ["1 heure = 60 minutes", "De 14 h 15 à 15 h 40 : jusqu'à 15 h (45 min) puis 40 min → 1 h 25", "Je dessine une frise pour m'aider"]
  },
  {
    titre: "Un problème en 4 étapes",
    lignes: ["1. Je lis et je dis la situation avec mes mots", "2. Je surligne la question (bleu) et les données (jaune)", "3. Je fais un dessin ou un schéma en barres", "4. J'écris l'opération, je calcule, je réponds par une phrase"]
  }
];

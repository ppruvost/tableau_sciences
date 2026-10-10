/* ============================================================
   data-fiches.js — complète PARCOURS_DATA (js/data.js) à partir des
   fiches Eduscol « Accompagnement renforcé » (2de pro, déc. 2022) et
   des guides « La résolution de problèmes mathématiques ».
   À charger APRÈS data.js et sources.js.

   Champs ajoutés au niveau d'une compétence :
     atelier        id d'un atelier QCM (index.html#atelier=<id>)
     sources        ids du registre js/sources.js
     flash          question flash d'entrée de séance (automatisme)
     coupsDePouce   jokers : étapes du protocole de résolution des fiches
   ============================================================ */
(function () {
  "use strict";

  // PARCOURS_DATA est une « const » globale de data.js : visible par nom, pas via window.
  const D = typeof PARCOURS_DATA !== "undefined" ? PARCOURS_DATA : null;
  if (!Array.isArray(D)) return;

  function competence(id) {
    for (const d of D) for (const c of d.competences) if (c.id === id) return c;
    return null;
  }
  function domaine(id) { return D.find((d) => d.id === id); }

  // ---------------------------------------------------- ordre des domaines
  const ordre = { algebre: 1, nombres: 2, geometrie: 3, donnees: 4, problemes: 5, tp_cuisine: 6 };

  // ------------------------------------------- liens sur les compétences existantes
  const LIENS = {
    alg_calcul_litteral: {
      sources: ["eduscol-ar-eq"],
      flash: "Parmi quatre propositions, choisir la forme développée de (x + 5)(x − 3) : x² + 2x + 2, x² + 2x − 15, 2x + 2 ou x² + 8x − 15."
    },
    alg_equations: {
      atelier: "equation",
      sources: ["eduscol-ar-eq"],
      coupsDePouce: [
        "Indiquer la grandeur inconnue.",
        "Écrire l'équation correspondant à la situation.",
        "Résoudre cette équation.",
        "Valider le résultat à l'aide d'une vérification."
      ]
    },
    alg_proportionnalite: {
      atelier: "proportionnalite",
      sources: ["eduscol-ar-eq"],
      flash: "Une prime de 3 000 € est partagée proportionnellement à l'ancienneté : A, 3 ans ; B, 8 ans ; C, 4 ans. Combien reçoit B ? (15 €, 1 000 €, 1 600 € ou 375 €)"
    },
    alg_mise_en_equation: {
      atelier: "equation",
      sources: ["eduscol-ar-eq", "guide-college"],
      flash: "On cherche le prix x d'une baguette : 2 croissants à 1,80 €, 1 pain aux raisins à 1,10 €, 3 baguettes, total 5,15 €. Quelle équation ?",
      coupsDePouce: [
        "Indiquer la grandeur inconnue (ici : le prix initial d'une veste).",
        "Trouver l'expression de la recette de chaque associé.",
        "Si une remise s'applique à plusieurs articles, utiliser des parenthèses : 6(x − 10) = 6x − 60.",
        "En déduire l'équation de la recette totale, la réduire, puis la résoudre.",
        "Valider le résultat par une vérification dans l'énoncé."
      ]
    },
    geo_perimetre_aire: {
      atelier: "geometrie",
      sources: ["eduscol-ar-geo"],
      flash: "Quelle est l'aire d'un terrain de basket de 28 m sur 15 m ? (43 m², 86 m², 420 m² ou 340 m²)",
      coupsDePouce: [
        "Décomposer la figure en deux figures usuelles (un grand rectangle auquel on retire un coin).",
        "Calculer l'aire de chacune, puis les combiner (addition ou soustraction).",
        "Penser aux conversions : 100 cm = 1 m, donc 10 000 cm² = 1 m².",
        "Tenir compte des contraintes de l'énoncé (fenêtres à retirer, marge sur le contour)."
      ]
    },
    geo_pythagore: {
      atelier: "geometrie",
      sources: ["eduscol-ar-geo"],
      flash: "Quelle est la longueur de la diagonale d'un rectangle de 5 m sur 3 m ? (8, √8, √34 ou autre réponse)",
      coupsDePouce: [
        "Repérer le triangle rectangle et son côté le plus long (l'hypoténuse).",
        "Écrire l'égalité : hypoténuse² = somme des carrés des deux autres côtés.",
        "Déterminer d'abord les cotes manquantes, dans l'ordre (par exemple DE, puis DC, puis EF)."
      ]
    },
    tp_mesures_volumes: { atelier: "conversions" },
    tp_proportionnalite_recette: { atelier: "proportionnalite" },
    tp_volumes_recipients: { atelier: "conversions" }
  };
  Object.keys(LIENS).forEach((id) => {
    const c = competence(id);
    if (c) Object.assign(c, LIENS[id]);
  });

  // ------------------------------------------------------ nouveaux domaines
  const NOUVEAUX = [

    // ================= NOMBRES ET CALCULS =================
    {
      id: "nombres",
      label: "Nombres et calculs",
      priorite: ordre.nombres,
      competences: [
        {
          id: "num_fractions",
          label: "Fractions : exprimer une part, simplifier, additionner",
          atelier: "nombres",
          sources: ["eduscol-ar-nombres"],
          flash: "Cocher l'égalité correcte : 2/3 + 7/4 = 9/7, 29/12, 9/12 ou 14/12. (Erreurs types : additionner numérateurs et dénominateurs entre eux ; changer le dénominateur sans changer le numérateur ; multiplier.)",
          coupsDePouce: [
            "Réaliser la cocotte en papier avec le protocole proposé.",
            "Colorier les parties comme sur le schéma : tête, patte, queue.",
            "Déterminer la fraction coloriée en bleu, en vert et en rouge par rapport au carré initial.",
            "Déterminer la fraction non coloriée, puis simplifier."
          ],
          items: [
            "Je sais exprimer une part d'un tout sous forme de fraction (ex. 2 parts sur 5).",
            "Je sais simplifier une fraction pour obtenir une fraction irréductible.",
            "Je sais additionner des fractions de dénominateurs différents."
          ],
          modules: {
            remobilisation: {
              titre: "La cocotte en origami : partager une feuille",
              objectif: "Donner du sens aux fractions en manipulant une feuille pliée et en comptant des parts égales.",
              activites: [
                "Plier une feuille carrée en cocotte (protocole fourni), sans découpage ni ajout",
                "Repérer que le pliage délimite 32 triangles identiques, puis colorier la tête, la patte et la queue",
                "Dire à l'oral, pour chaque partie coloriée, « combien de triangles sur combien », avant d'écrire la fraction"
              ],
              duree: "1 séance de 55 min",
              ressources: ["Feuille carrée", "Schéma recto et verso de la cocotte", "Protocole de pliage", "Atelier « Fractions » (recettes)"]
            },
            consolidation: {
              titre: "Calculer avec des fractions : le cocktail",
              objectif: "Automatiser l'addition de fractions et la simplification, dans des situations de la vie courante.",
              activites: [
                "Cocktail de 10 cL : 1/4 d'orange, 2/5 de pomme, le reste d'ananas. Trouver la fraction d'ananas puis la quantité en cL",
                "Mettre les fractions au même dénominateur avant d'additionner, avec un schéma en bandes",
                "Cocotte : calculer la fraction de la partie non coloriée et la donner sous forme irréductible"
              ],
              duree: "2 séances de 45 min",
              ressources: ["Fiche d'exercices gradués", "Bandes de papier", "Atelier « Fractions et puissances de 10 »"]
            }
          }
        },
        {
          id: "num_scientifique",
          label: "Écriture scientifique et puissances de 10",
          atelier: "nombres",
          sources: ["eduscol-ar-nombres"],
          flash: "Quel est le chiffre des millièmes dans 2 045,783 ? (2, 3, 8 ou 7). Écrire 0,0036 sous forme scientifique.",
          items: [
            "Je sais lire un nombre décimal et nommer dixièmes, centièmes et millièmes.",
            "Je sais écrire un nombre sous forme scientifique (ex. 0,0036 = 3,6 × 10⁻³).",
            "Je sais comparer des nombres écrits avec des puissances de 10."
          ],
          modules: {
            remobilisation: {
              titre: "Lire de très grands et de très petits nombres",
              objectif: "Comprendre ce que changent les puissances de 10, avant tout formalisme.",
              activites: [
                "Tableau de numération : placer des nombres décimaux et nommer le chiffre des dixièmes, centièmes, millièmes",
                "Décaler la virgule à la calculatrice et observer l'exposant de 10",
                "Classer des distances au Soleil : Mars 227 × 10⁶ km, Jupiter 7,78 × 10⁸ km, Uranus 2,87 × 10⁹ km, Neptune 4,5 × 10⁹ km"
              ],
              duree: "2 séances de 30 min",
              ressources: ["Tableau de numération", "Calculatrice", "Tableau des distances des planètes"]
            },
            consolidation: {
              titre: "Calculer avec des puissances de 10",
              objectif: "Utiliser la notation scientifique pour comparer et calculer dans un contexte réel.",
              activites: [
                "Distance de freinage d = k × v² avec k = 4,8 × 10⁻³ sur route sèche : retrouver la vitesse pour d = 12 m (v = 50 km/h)",
                "Comparer deux distances en identifiant d'abord l'exposant, puis la partie décimale",
                "Repérer les erreurs types : confondre « le plus grand exposant » et « le plus grand nombre devant la puissance »"
              ],
              duree: "2 séances de 45 min",
              ressources: ["Calculatrice", "Fiche d'exercices gradués"]
            }
          }
        }
      ]
    },

    // ================= ORGANISATION ET GESTION DE DONNÉES =================
    {
      id: "donnees",
      label: "Organisation et gestion de données",
      priorite: ordre.donnees,
      competences: [
        {
          id: "don_frequences",
          label: "Effectifs et fréquences",
          atelier: "statistiques",
          sources: ["eduscol-ar-ogd"],
          flash: "Une urne contient 4 boules bleues, 9 rouges, 5 vertes et 2 jaunes. Quelle est la fréquence des boules vertes ? (0,12, 0,25, 0,50 ou 5)",
          coupsDePouce: [
            "Déterminer la lettre la plus fréquente en français (le E).",
            "Représenter en diagramme en bâtons les fréquences du français et celles du texte codé.",
            "Comparer les deux diagrammes et en déduire le décalage (la clé de cryptage).",
            "Décoder la citation lettre à lettre avec la clé trouvée."
          ],
          items: [
            "Je sais calculer un effectif total.",
            "Je sais calculer une fréquence (effectif ÷ effectif total) et l'écrire en décimal ou en pourcentage.",
            "Je sais faire un calcul de proportionnalité à partir d'un tableau (ex. teneur pour 100 g)."
          ],
          modules: {
            remobilisation: {
              titre: "L'urne et les céréales : compter pour comparer",
              objectif: "Retrouver le sens d'une fréquence sur des situations très concrètes.",
              activites: [
                "Urne de boules colorées : compter chaque couleur, additionner pour l'effectif total, puis écrire la fréquence",
                "Étiquette de céréales (82 g de glucides pour 100 g) : calculer la masse de glucides d'un bol de 50 g",
                "Reformuler à l'oral la différence entre « effectif » et « fréquence »"
              ],
              duree: "2 séances de 30 min",
              ressources: ["Urne et boules (ou schéma)", "Étiquette nutritionnelle", "Atelier « Fréquences et statistiques »"]
            },
            consolidation: {
              titre: "Décoder un message : l'analyse fréquentielle",
              objectif: "Calculer des fréquences, les représenter en diagramme en bâtons et s'en servir pour résoudre une énigme.",
              activites: [
                "À l'aide d'un tableur, calculer la fréquence de chaque lettre du texte codé et faire le diagramme en bâtons",
                "Repérer que la lettre la plus fréquente est U (le E en français) et que l'écart E → U vaut 16 rangs",
                "Décoder la citation « HYUD DU IU FUHT… » et retrouver son auteur"
              ],
              duree: "1 séance de 55 min (travail en îlots)",
              ressources: ["Tableau des fréquences des lettres en français", "Occurrences des lettres du texte codé", "Tableur ou calculatrice"]
            }
          }
        },
        {
          id: "don_indicateurs",
          label: "Moyenne, médiane et lecture de diagrammes",
          atelier: "statistiques",
          sources: ["eduscol-ar-ogd", "guide-college"],
          flash: "Salaires : 1 900, 1 760, 2 200, 3 400, 1 200, 2 050 €. Quel est le salaire médian ? (2 085, 1 975, 2 800 ou 10 801,67 €)",
          items: [
            "Je sais calculer une moyenne.",
            "Je sais ranger des valeurs dans l'ordre croissant et trouver la médiane.",
            "Je sais lire un diagramme en bâtons ou un diagramme circulaire."
          ],
          modules: {
            remobilisation: {
              titre: "Lire un diagramme : les notes de la classe",
              objectif: "Lire un diagramme en bâtons et retrouver les effectifs avant de calculer.",
              activites: [
                "Lire sur le diagramme en bâtons combien d'élèves ont chaque note, puis l'effectif total",
                "Calculer la note moyenne en détaillant les étapes (somme des notes ÷ effectif total) et l'arrondir à l'unité",
                "Distinguer à l'oral étendue, mode, médiane et moyenne sur ce même diagramme"
              ],
              duree: "2 séances de 30 min",
              ressources: ["Diagramme en bâtons des notes", "Calculatrice", "Fiche « quatre mots à ne pas confondre »"]
            },
            consolidation: {
              titre: "Choisir et comparer des représentations",
              objectif: "Associer un tableau à son diagramme circulaire et choisir la représentation adaptée au caractère étudié.",
              activites: [
                "Composition des poubelles de deux familles : choisir, parmi quatre diagrammes circulaires, celui de la famille A",
                "Répartition des plateformes les plus regardées : choisir entre diagramme circulaire, en bâtons ou histogramme, et justifier",
                "Salaires : ranger par ordre croissant avant de chercher la médiane, comparer avec la moyenne"
              ],
              duree: "2 séances de 45 min",
              ressources: ["Tableaux et diagrammes circulaires", "Calculatrice ou tableur"]
            }
          }
        }
      ]
    },

    // ================= RÉSOLUTION DE PROBLÈMES =================
    {
      id: "problemes",
      label: "Résolution de problèmes",
      priorite: ordre.problemes,
      competences: [
        {
          id: "res_comprendre",
          label: "Comprendre un énoncé",
          atelier: "problemes",
          sources: ["guide-cm", "eduscol-ar-eq"],
          flash: "Dans un énoncé, souligner la question posée, puis barrer une information inutile.",
          coupsDePouce: [
            "Lire l'énoncé en silence, puis le dire avec tes mots.",
            "Surligner la question en bleu et les informations utiles en jaune.",
            "Se demander : de quoi parle-t-on, et que cherche-t-on ?"
          ],
          items: [
            "Je sais redire un problème avec mes propres mots.",
            "Je sais repérer la question posée.",
            "Je sais trier les informations utiles et inutiles."
          ],
          modules: {
            remobilisation: {
              titre: "Je lis, je reformule, je trie",
              objectif: "Entrer dans un problème sans peur : comprendre ce qu'on demande avant de calculer.",
              activites: [
                "Lecture silencieuse d'un énoncé court, puis reformulation orale par chaque élève",
                "Surlignage de la question et des informations utiles dans un énoncé de recette",
                "Énoncé avec information inutile (temps et puissance du four pour une question sur le beurre) : barrer ce qui ne sert pas"
              ],
              duree: "2 séances de 30 min",
              ressources: ["Énoncés courts de recettes", "Surligneurs", "Atelier « Résoudre un problème en 4 temps »"]
            },
            consolidation: {
              titre: "Des énoncés plus longs, des questions différentes",
              objectif: "Résoudre un problème sans se laisser piéger par les informations inutiles ou par une question inattendue.",
              activites: [
                "Un même contexte, trois questions différentes : choisir à chaque fois les données qui servent",
                "Rédiger la question en une phrase avant de commencer à calculer",
                "Par binômes : s'échanger des énoncés et vérifier que la question est bien comprise"
              ],
              duree: "2 séances de 45 min",
              ressources: ["Banque d'énoncés contextualisés", "Grille « comprendre »"]
            }
          }
        },
        {
          id: "res_modeliser",
          label: "Modéliser : schéma, tableau, équation",
          atelier: "problemes",
          sources: ["guide-cm", "guide-college", "eduscol-ar-eq"],
          flash: "Deux frères ont 36 billes, Paul en a 8 de plus qu'Hugo : dessiner deux barres, puis écrire l'équation.",
          coupsDePouce: [
            "Dessiner une barre par quantité : même longueur pour deux quantités égales.",
            "Ajouter un petit morceau pour « de plus » et en enlever un pour « de moins ».",
            "Passer du schéma à l'équation : barres mises bout à bout, puis total."
          ],
          items: [
            "Je sais représenter un problème avec un schéma en barres ou un tableau.",
            "Je sais choisir l'inconnue et la nommer par une lettre.",
            "Je sais passer du schéma à une équation."
          ],
          modules: {
            remobilisation: {
              titre: "Des barres pour voir le problème",
              objectif: "Voir la structure d'un problème (parties et tout, comparaison) avant d'écrire un calcul.",
              activites: [
                "Représenter par des barres des problèmes de partage et de comparaison (billes, prix)",
                "Colorier sur le schéma ce qu'on cherche, et entourer ce qu'on connaît",
                "Écrire une phrase qui décrit le schéma, puis l'opération correspondante"
              ],
              duree: "2 séances de 30 min",
              ressources: ["Bandes de papier quadrillé", "Fiche « schéma en barres »"]
            },
            consolidation: {
              titre: "Du schéma à l'équation",
              objectif: "Traduire un problème par une équation du premier degré à une inconnue, à partir d'un schéma.",
              activites: [
                "Billes : 36 billes au total, Paul en a 8 de plus qu'Hugo. Schéma, équation 2x + 8 = 36, solution",
                "Vestes d'un magasin (12 au prix x, 6 à x − 10, 32 à x/2, recette de 2 830 €) : équation 34x − 60 = 2 830",
                "Rédiger à l'écrit la démarche et la comparer avec celle d'un camarade"
              ],
              duree: "2 à 3 séances de 45 min",
              ressources: ["Fiche méthode « du texte à l'équation »", "Atelier « Mettre en équation »"]
            }
          }
        },
        {
          id: "res_calculer_repondre",
          label: "Calculer, vérifier et répondre",
          atelier: "problemes",
          sources: ["guide-cm", "eduscol-ar-eq"],
          flash: "3 cahiers coûtent 4,50 €. Combien coûtent 5 cahiers ? (Attention : 1,50 € n'est pas la réponse.)",
          coupsDePouce: [
            "Écrire chaque calcul sur une ligne, avec son unité.",
            "Se demander : mon résultat est-il possible dans la vraie vie ?",
            "Terminer par une phrase qui répond à la question posée."
          ],
          items: [
            "Je sais écrire mes calculs étape par étape.",
            "Je sais vérifier si mon résultat est vraisemblable (ordre de grandeur, unité).",
            "Je sais répondre au problème par une phrase avec l'unité."
          ],
          modules: {
            remobilisation: {
              titre: "La phrase réponse",
              objectif: "Prendre l'habitude de relire la question et de répondre par une phrase.",
              activites: [
                "À partir de calculs déjà faits, écrire la phrase réponse qui correspond à la question",
                "Repérer les réponses qui ne répondent pas à la question (ex. prix d'un seul cahier au lieu de cinq)",
                "Jeu « vrai ou faux ? » sur des résultats vraisemblables ou non"
              ],
              duree: "1 séance de 30 min",
              ressources: ["Fiche « phrase réponse »", "Cartes de résultats à valider"]
            },
            consolidation: {
              titre: "Vérifier son résultat dans l'énoncé",
              objectif: "Valider un résultat par une vérification (substitution, ordre de grandeur) avant de conclure.",
              activites: [
                "Vestes à 85 € : vérifier 12 × 85 + 6 × 75 + 32 × 42,50 = 2 830 €",
                "Estimer l'ordre de grandeur avant de calculer, puis comparer avec le résultat",
                "Rédiger la démarche à l'oral, puis à l'écrit, sous la forme choisie par l'élève (texte, carte mentale, diaporama)"
              ],
              duree: "2 séances de 45 min",
              ressources: ["Liste de vérification corrective", "Grille d'attendus"]
            }
          }
        }
      ]
    }
  ];

  NOUVEAUX.forEach((n) => { if (!domaine(n.id)) D.push(n); });
  Object.keys(ordre).forEach((id) => { const d = domaine(id); if (d) d.priorite = ordre[id]; });

  // ----------------------- déroulé d'une séance de 55 minutes (fiches Eduscol)
  window.SEANCE_55 = {
    sources: ["eduscol-ar-eq", "eduscol-ar-nombres", "eduscol-ar-ogd"],
    etapes: [
      { duree: "5 min", titre: "Phase individuelle", detail: "Lecture silencieuse de l'activité, premières représentations." },
      { duree: "5 min", titre: "Phase collective", detail: "Vérifier que la consigne est comprise, reformuler la situation." },
      { duree: "25 min", titre: "Travail en îlots", detail: "Résolution de l'activité, avec un accompagnement et des coups de pouce selon les besoins." },
      { duree: "10 min", titre: "Mise en commun", detail: "Chacun explique à l'oral sa démarche, même si elle est incomplète ou erronée." },
      { duree: "10 min", titre: "Trace écrite", detail: "On généralise la méthode et on garde une trace pour la prochaine fois." }
    ]
  };
})();

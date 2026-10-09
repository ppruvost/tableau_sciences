/**
 * game.js — Activités bonus ("Jeux & activités") pour le parcours MLDS.
 * Contenu des jeux "Chercher la petite bête" et "Le mercure s'affole" :
 * source Agoralude (www.agoralude.com), fiches gratuites pour ateliers mémoire,
 * usage non commercial — reproduites ici avec attribution, pour un usage
 * pédagogique gratuit équivalent.
 * Le "Jeu de la grille d'images" est une réécriture originale (émojis) du principe
 * de mémorisation visuelle popularisé par memozor.com ; les visuels d'origine
 * (photographies) ne sont pas repris.
 */

// ============================================================================
// DONNÉES
// ============================================================================

const JEU_EXPRESSIONS = {
  id: "expressions",
  titre: "Chercher la petite bête",
  sousTitre: "Langage & vocabulaire",
  source: "Source : Agoralude (agoralude.com) — fiche 74, usage gratuit non commercial.",
  trou: {
    enonce: "Araignée du matin, _____, araignée du soir, _____ .",
    reponses: ["chagrin", "espoir"]
  },
  appariements: [
    { phrase: "Jeanne est très mince, elle a …", expression: "une taille de guêpe" },
    { phrase: "Rose a tout de suite compris, c'est …", expression: "une fine mouche" },
    { phrase: "André a l'esprit dérangé, il a …", expression: "une araignée dans le plafond" },
    { phrase: "Odile est mélancolique, elle …", expression: "a le bourdon" },
    { phrase: "Roger n'arrête pas de gigoter, il …", expression: "a des fourmis dans les jambes" },
    { phrase: "La discussion a mal tourné et Guy …", expression: "a pris la mouche" },
    { phrase: "Claude est un bon tireur, il …", expression: "a fait mouche" },
    { phrase: "Quel silence, …", expression: "on entendrait une mouche voler" },
    { phrase: "Quel spectacle incroyable, …", expression: "c'est pas piqué des hannetons" },
    { phrase: "Petite cause et grands impacts, …", expression: "c'est l'effet papillon" },
    { phrase: "Il a bondi d'un coup, …", expression: "quelle mouche le pique ?" }
  ],
  motsProches: {
    banque: ["VENIMEUX", "VÉNÉNEUX", "VÉNÉRÉS", "VEINEUX"],
    phrases: [
      { texte: "Il ne faut pas ramasser les champignons _____.", reponse: "VÉNÉNEUX" },
      { texte: "Le bois de noyer est particulièrement _____.", reponse: "VEINEUX" },
      { texte: "La plupart des araignées sont des animaux _____.", reponse: "VENIMEUX" },
      { texte: "Les joueurs de cette équipe sont _____ par leurs fans.", reponse: "VÉNÉRÉS" }
    ]
  }
};

const JEU_CALCUL = {
  id: "calcul",
  titre: "Le mercure s'affole",
  sousTitre: "Chiffres & calculs",
  source: "Source : Agoralude (agoralude.com) — fiche 73, usage gratuit non commercial.",
  intro: "Pour Nicole et Claude, la journée s'annonce chaude.",
  nicole: [
    { label: "Thé (petit-déj.)", volume: 30, emoji: "☕" },
    { label: "Jus de pomme (petit-déj.)", volume: 20, emoji: "🧃" },
    { label: "Limonade (après la marche)", volume: 35, emoji: "🥤" },
    { label: "Eau (déjeuner)", volume: 15, emoji: "💧" },
    { label: "Jus de raisin (après la sieste)", volume: 30, emoji: "🍇" },
    { label: "Eau (dîner)", volume: 20, emoji: "💧" },
    { label: "Potage (dîner)", volume: 40, emoji: "🍲" },
    { label: "Tisane Bonne Nuit (coucher)", volume: 35, emoji: "🍵" }
  ],
  claude: [
    { label: "Eau fraîche (petit-déj.)", volume: 25, qty: 2, emoji: "💧" },
    { label: "Eau pétillante citron (après la marche)", volume: 20, qty: 1, emoji: "🍋" },
    { label: "Eau (déjeuner)", volume: 15, qty: 3, emoji: "💧" },
    { label: "Thé (après la sieste)", volume: 35, qty: 1, emoji: "☕" },
    { label: "Jus d'orange (après la sieste)", volume: 15, qty: 1, emoji: "🍊" },
    { label: "Eau (dîner)", volume: 20, qty: 2, emoji: "💧" }
  ],
  temperature: {
    depart: { heure: 5, temp: 21 },
    etapes: [
      { deltaHeure: 4, deltaTemp: 5 },
      { deltaHeure: 3, deltaTemp: 3 },
      { deltaHeure: 4, deltaTemp: 6 }
    ],
    tempMinuit: 29
  }
};

const JEU_MEMOIRE = {
  id: "memoire",
  titre: "Jeu de la grille d'images",
  sousTitre: "Mémoire visuelle",
  source: "Principe inspiré de memozor.com — visuels originaux (émojis), sans reprise des photographies sources.",
  dureeMemorisation: 20,
  grilles: [
    {
      nom: "Fruits",
      items: ["🍒", "🍏", "🍌", "🍇", "🍓", "🍉", "🥝", "🥥", "🍍"],
      distracteurs: ["🍑", "🍋", "🥭", "🍐", "🫐", "🍈", "🍆", "🍅", "🌽"]
    },
    {
      nom: "Objets du quotidien",
      items: ["⏰", "🔑", "👓", "🥄", "☂️", "🍷", "🎲", "👛", "📖"],
      distracteurs: ["🪒", "🧦", "🖊️", "🧸", "🕯️", "🧺", "🪞", "🧵", "🧦"]
    },
    {
      nom: "Jeux de société",
      items: ["♟️", "🃏", "💰", "🀄", "🎯", "🧩", "🎳", "🎰", "🧸"],
      distracteurs: ["🎮", "🪀", "🎨", "🎭", "🥁", "🎺", "🏓", "⚽", "🎱"]
    }
  ]
};

// ----------------------------------------------------------------------
// FICHE 72 — De toutes les couleurs
// ----------------------------------------------------------------------
const JEU_COULEURS = {
  id: "couleurs",
  titre: "De toutes les couleurs",
  sousTitre: "Quizz, devinettes & jeux de questions",
  source: "Source : Agoralude (agoralude.com) — fiche 72, usage gratuit non commercial.",
  melanges: [
    { texte: "Rouge + Bleu = _____", reponses: ["violet"] },
    { texte: "Bleu + Jaune = _____", reponses: ["vert"] },
    { texte: "Jaune + Rouge = _____", reponses: ["orange"] },
    { texte: "Rouge + Bleu + Jaune = _____", reponses: ["marron"] }
  ],
  noirBlanc: [
    { texte: "À la télé, le carré _____.", reponse: "blanc" },
    { texte: "Dans la rue, un blouson _____.", reponse: "noir" },
    { texte: "En dessert, la crème Mont _____.", reponse: "blanc" },
    { texte: "Le pétrole, l'or _____.", reponse: "noir" },
    { texte: "À l'élection, le vote _____.", reponse: "blanc" },
    { texte: "Aux échecs, le joueur _____ démarre.", reponse: "blanc" },
    { texte: "En boxe, un œil au beurre _____.", reponse: "noir" },
    { texte: "Pendant la guerre, le marché _____.", reponse: "noir" },
    { texte: "Au cirque, le clown _____.", reponse: "blanc" },
    { texte: "À la banque, un chèque en _____.", reponse: "blanc" }
  ],
  titres: [
    { texte: "La Mariée était en _____", reponses: ["noir"] },
    { texte: "Le Grand _____", reponses: ["bleu"] },
    { texte: "Le Cercle _____", reponses: ["rouge"] },
    { texte: "_____ mécanique", reponses: ["orange"] },
    { texte: "Moulin _____", reponses: ["rouge"] },
    { texte: "L'Ange _____", reponses: ["bleu"] },
    { texte: "La Panthère _____", reponses: ["rose"] },
    { texte: "L'Auberge _____", reponses: ["rouge"] },
    { texte: "Le _____ et le _____", reponses: ["rouge", "noir"] },
    { texte: "Le Rayon _____", reponses: ["vert"] },
    { texte: "Le Mystère de la chambre _____", reponses: ["jaune"] },
    { texte: "Le Parfum de la dame en _____", reponses: ["noir"] },
    { texte: "Le Chien _____", reponses: ["jaune"] },
    { texte: "La Jument _____", reponses: ["verte"] },
    { texte: "Un Taxi _____", reponses: ["mauve"] },
    { texte: "La Bicyclette _____", reponses: ["bleue"] }
  ]
};

// ----------------------------------------------------------------------
// FICHE 69 — Et que ça saute !
// ----------------------------------------------------------------------
const JEU_CREPES = {
  id: "crepes",
  titre: "Et que ça saute !",
  sousTitre: "Chiffres & calculs",
  source: "Source : Agoralude (agoralude.com) — fiche 69, usage gratuit non commercial.",
  tables: [
    {
      titre: "Crêpes — recette pour 4 personnes, à adapter pour 12",
      basePersonnes: 4, ciblePersonnes: 12,
      items: [
        { baseText: "250 g de farine", base: 250, suffix: "g de farine" },
        { baseText: "0,5 litre de lait", base: 0.5, suffix: "litre de lait" },
        { baseText: "3 œufs", base: 3, suffix: "œufs" },
        { baseText: "2 cuillères à soupe de sucre", base: 2, suffix: "cuillères à soupe de sucre" },
        { baseText: "25 g de beurre", base: 25, suffix: "g de beurre" },
        { baseText: "1 pincée de sel", base: 1, suffix: "pincée(s) de sel" }
      ]
    },
    {
      titre: "Jus d'orange — recette pour 5 personnes, à adapter pour 12",
      basePersonnes: 5, ciblePersonnes: 12,
      items: [
        { baseText: "15 oranges", base: 15, suffix: "oranges" },
        { baseText: "2,5 citrons", base: 2.5, suffix: "citrons" },
        { baseText: "10 cl de sucre de canne", base: 10, suffix: "cl de sucre de canne" }
      ]
    },
    {
      titre: "Garniture chocolat-amandes — pour 10 crêpes, à adapter pour 6",
      basePersonnes: 10, ciblePersonnes: 6,
      items: [
        { baseText: "10 cuillères à soupe d'amandes effilées", base: 10, suffix: "cuillères d'amandes" },
        { baseText: "200 g de chocolat noir", base: 200, suffix: "g de chocolat noir" },
        { baseText: "120 g de crème fraîche", base: 120, suffix: "g de crème fraîche" },
        { baseText: "50 g de sucre", base: 50, suffix: "g de sucre" }
      ]
    }
  ],
  enigme: {
    texte:
      "Paul a mangé deux crêpes chocolat-amandes, Marie et Alexandre en ont pris chacun une. Alexandre et Paul ont pris chacun deux crêpes à la confiture de fraise et Marie une seule. Paul et Marie ont mangé chacun une crêpe au citron. Alexandre a mangé trois crêpes nature, Marie en a pris deux et Paul n'en a pris qu'une. Marie et Alexandre se sont partagé une crêpe caramel-beurre salé.",
    question: "Qui a mangé le plus de crêpes ? Combien en ont-ils mangé en tout ?",
    solution:
      "C'est Alexandre qui a mangé le plus de crêpes, avec 6 crêpes et demie. Paul en a mangé 6. Marie en a mangé 5 et demie. Au total, les trois ont mangé 18 crêpes."
  }
};

// ----------------------------------------------------------------------
// FICHE 70 — Pluie ou beau temps
// ----------------------------------------------------------------------
const JEU_METEO = {
  id: "meteo",
  titre: "Pluie ou beau temps",
  sousTitre: "Langage & vocabulaire",
  source: "Source : Agoralude (agoralude.com) — fiche 70, usage gratuit non commercial.",
  chaines: [
    { depart: "MARS", etapes: [{ reponses: ["mare", "mari", "mais", "arme"] }], arrivee: "AIME", consigne: "en changeant une seule lettre à chaque fois" },
    { depart: "FLEURS", etapes: [{ reponses: ["pleurs"] }], arrivee: "PRUNES", consigne: "en changeant une seule lettre à chaque fois" },
    { depart: "ÂGE", etapes: [{ reponses: ["ange", "auge", "aune", "nage"] }], arrivee: "NUAGE", consigne: "en ajoutant une seule lettre à chaque fois" },
    { depart: "ÎLE", etapes: [{ reponses: ["oeil", "œil"] }, { reponses: ["isole"] }], arrivee: "SOLEIL", consigne: "en ajoutant une seule lettre à chaque fois" }
  ],
  definitions: [
    { mot: "la bise", def: "un vent sec et froid" },
    { mot: "la brise", def: "un vent léger" },
    { mot: "la giboulée", def: "une averse soudaine, avec parfois du vent ou de la grêle" },
    { mot: "l'averse", def: "une pluie subite et abondante, de courte durée" },
    { mot: "la bruine", def: "une petite pluie très fine" },
    { mot: "la brume", def: "un brouillard léger" },
    { mot: "la bourrasque", def: "un grand coup de vent" }
  ]
};

// ----------------------------------------------------------------------
// FICHE 68 — Parlons de mois
// ----------------------------------------------------------------------
const JEU_MOIS = {
  id: "mois",
  titre: "Parlons de mois",
  sousTitre: "Quizz, devinettes & jeux de questions",
  source: "Source : Agoralude (agoralude.com) — fiche 68, usage gratuit non commercial.",
  serie1: [
    { texte: "Janvier est le mois du blanc, en référence à la couleur de la neige.", vrai: false, explication: "c'est une référence aux promotions sur le linge de maison, autrefois blanc." },
    { texte: "Le mois de février compte 28 jours lors des années bissextiles.", vrai: false, explication: "une année bissextile compte 29 jours en février." },
    { texte: "Dans le calendrier romain primitif, l'année commençait au mois de mars.", vrai: true, explication: "c'est pour cela que septembre, octobre, novembre et décembre (du latin septem, octo, novem, decem) portent des noms correspondant aux 7e, 8e, 9e et 10e mois." },
    { texte: "Le 25 avril 1974, la révolution des œillets, menée par les Capitaines d'avril, a eu lieu au Portugal.", vrai: true },
    { texte: "En 1968, c'est Claude Nougaro qui chante la chanson Paris mai, inspirée des événements de mai 1968.", vrai: true },
    { texte: "Le 18 juin 1944 a eu lieu le débarquement allié en Normandie.", vrai: false, explication: "le débarquement a eu lieu le 6 juin 1944." },
    { texte: "Le mois de juillet a été nommé ainsi par l'empereur romain Auguste, en hommage à Jules César.", vrai: true },
    { texte: "Le 15 août est l'un des jours de l'année où la circulation est la plus dense sur les routes de vacances (chassé-croisé).", vrai: true },
    { texte: "C'est en septembre est une chanson interprétée par Gilbert Bécaud en 1978.", vrai: true },
    { texte: "L'équinoxe d'automne a lieu en octobre.", vrai: false, explication: "il a lieu autour du 22-23 septembre." },
    { texte: "La sortie du Beaujolais nouveau a lieu le 4ème jeudi de novembre.", vrai: false, explication: "elle a lieu le 3ème jeudi de novembre." },
    { texte: "En décembre, la trêve des confiseurs correspond à un moment d'accalmie des débats politiques pendant les fêtes.", vrai: true }
  ],
  serie2: [
    { texte: "En janvier, la durée du jour augmente autant à Marseille qu'à Brest.", vrai: false, explication: "+51 min à Marseille contre +1h02 à Brest." },
    { texte: "À Paris, en janvier, la durée du jour augmente d'environ 30 minutes.", vrai: false, explication: "elle augmente d'environ 1h03 en janvier à Paris." },
    { texte: "Il y a deux solstices dans l'année, l'un en juin et l'autre en décembre.", vrai: true },
    { texte: "À Lille, le 21 juin, la durée du jour est supérieure à 16 heures.", vrai: true, explication: "elle est d'environ 16h33, jour du solstice d'été." }
  ]
};

// ----------------------------------------------------------------------
// FICHE 64 — Retour de vacances
// ----------------------------------------------------------------------
const JEU_VACANCES = {
  id: "vacances",
  titre: "Retour de vacances",
  sousTitre: "Quizz, devinettes & jeux de questions",
  source: "Source : Agoralude (agoralude.com) — fiche 64, usage gratuit non commercial.",
  ecole: [
    { lettre: "A", indice: "On écrit dessus avec une craie.", reponses: ["ardoise"] },
    { lettre: "E", indice: "Il va à l'école pour apprendre.", reponses: ["eleve", "élève"] },
    { lettre: "I", indice: "Avant, elle récompensait les bons élèves.", reponses: ["images", "image"] },
    { lettre: "O", indice: "En dictée, elle pousse à la faute.", reponses: ["orthographe"] },
    { lettre: "U", indice: "En Angleterre, on en porte un pour aller à l'école.", reponses: ["uniforme"] },
    { lettre: "Y", indice: "À la récréation, on s'amuse à le faire monter et descendre.", reponses: ["yoyo", "yo-yo"] }
  ],
  travail: [
    { lettre: "A", indice: "Qui démarre dans le métier.", reponses: ["apprenti"] },
    { lettre: "E", indice: "Ce que cherchent les chômeurs.", reponses: ["emploi"] },
    { lettre: "I", indice: "Elle est artificielle, mais on redoute ses effets dans le réel.", reponses: ["ia", "intelligence artificielle"] },
    { lettre: "O", indice: "Il est maintenant devenu indispensable dans les bureaux.", reponses: ["ordinateur"] },
    { lettre: "U", indice: "On y pratique les trois-huit.", reponses: ["usine"] },
    { lettre: "Y", indice: "Un laitage servi en dessert à la cantine.", reponses: ["yaourt"] }
  ],
  professions: [
    { metier: "Médecin", surnom: "Toubib" },
    { metier: "Policier", surnom: "Condé" },
    { metier: "Coiffeur", surnom: "Merlan" },
    { metier: "Contractuelle de police", surnom: "Pervenche" },
    { metier: "Surveillant de collège", surnom: "Pion" },
    { metier: "Mineur", surnom: "Gueule noire" },
    { metier: "Apprenti-cuisinier", surnom: "Marmiton" },
    { metier: "Charbonnier", surnom: "Bougnat" },
    { metier: "Apprenti-boulanger", surnom: "Mitron" }
  ]
};

// ----------------------------------------------------------------------
// FICHE 66 — Dictons de jardinier
// ----------------------------------------------------------------------
const JEU_CATHERINE = {
  id: "dictons",
  titre: "Dictons de jardinier",
  sousTitre: "Langage & vocabulaire",
  source: "Source : Agoralude (agoralude.com) — fiche 66, usage gratuit non commercial.",
  qcm: { question: "Fin novembre, un vieux dicton de jardinier affirme que …", options: ["pousse la glycine", "les chrysanthèmes se raniment", "tout prend racine"], reponse: "tout prend racine" },
  reveal: [
    { mot: "Pelle …", indices: "En grande quantité / s'embrasser avec la langue / se casser la figure", reponse: "à la pelle / se rouler une pelle / se prendre une pelle" },
    { mot: "Râteau …", indices: "Se faire éconduire / être très mal coiffé", reponse: "se prendre un râteau / se coiffer avec un râteau" },
    { mot: "Racine …", indices: "S'installer quelque part pour longtemps / être mort et enterré", reponse: "prendre racine / manger les pissenlits par la racine" },
    { mot: "Bêche …", indices: "Être côte à côte mais en sens inverse", reponse: "être tête-bêche" }
  ],
  categories: ["Jardinage", "Cuisine", "Peinture", "Autre (intrus)"],
  mots: [
    { mot: "bêche", categorie: "Jardinage" },
    { mot: "hérisson", categorie: "Autre (intrus)" },
    { mot: "louchet", categorie: "Jardinage" },
    { mot: "fourche", categorie: "Jardinage" },
    { mot: "emporte-pièce", categorie: "Cuisine" },
    { mot: "louche", categorie: "Cuisine" },
    { mot: "mandoline", categorie: "Cuisine" },
    { mot: "déboucheur", categorie: "Autre (intrus)" },
    { mot: "rouleau", categorie: "Peinture" },
    { mot: "brosse", categorie: "Peinture" },
    { mot: "cintreuse", categorie: "Autre (intrus)" },
    { mot: "queue-de-morue", categorie: "Peinture" }
  ],
  banque: ["BÊCHEUSE", "BÛCHEUSE", "BÉGUEULE", "BÉGUINE", "BÉGUM"],
  phrases: [
    { texte: "Marie a brillamment réussi ses examens, c'est une sacrée _____.", reponse: "BÛCHEUSE" },
    { texte: "Chantal est _____, un rien l'offusque.", reponse: "BÉGUEULE" },
    { texte: "Elle porte une ancienne coiffe de dentelle, c'est une _____.", reponse: "BÉGUINE" },
    { texte: "Elle retourne au palais, c'est la _____.", reponse: "BÉGUM" },
    { texte: "Julie se croit supérieure aux autres, elle est vraiment _____.", reponse: "BÊCHEUSE" }
  ]
};

// ----------------------------------------------------------------------
// FICHE 67 — Au menu ce soir (volet logique uniquement)
// ----------------------------------------------------------------------
const JEU_MENU = {
  id: "menu",
  titre: "Au menu ce soir",
  sousTitre: "Jeux de logique & chronologie",
  source: "Source : Agoralude (agoralude.com) — fiche 67, usage gratuit non commercial. Le volet « emporte-pièces » (visuel) n'est pas repris ici.",
  menus: [
    { id: "A", items: ["Coupe de Champagne et ses canapés", "Foie gras mi-cuit et confit de figue", "Rôti de bœuf laqué au miel et gratin dauphinois", "Bûche tout chocolat, sauce chocolat", "Café et assortiments aux 3 chocolats"] },
    { id: "B", items: ["Cocktail sans alcool gingembre et abricot", "Duo de foie gras et gelée de mangue", "Chapon farci aux marrons et aux cèpes", "Panier croustillant de chèvre au miel", "Tiramisu à la crème de marrons", "Café et mignardises"] },
    { id: "C", items: ["Huîtres de St-Vaast", "Trou normand", "Filet de bar et risotto aux morilles", "Plateau normand : camembert, pont-l'évêque et livarot", "Bûche noix de coco, fruits de la passion", "Café et rocher glacé aux trois chocolats"] },
    { id: "D", items: ["Champagne blanc de blanc", "Noix de St-Jacques en carpaccio", "Turbot rôti sur fondue de poireau", "Crottin de Chavignol au miel", "Feuillantine chocolat et crème fouettée", "Clémentines"] }
  ],
  invites: [
    { nom: "Agnès", indice: "Adore le foie gras et les huîtres, mais est allergique à l'oseille. Pour elle, le dessert bûche, c'est non négociable.", menu: "C" },
    { nom: "Chantal", indice: "Apprécie le foie gras, les volailles rôties et le poisson, mais ne digère pas le chocolat.", menu: "B" },
    { nom: "Luc", indice: "Apprécie le champagne, aime autant la viande que le poisson, et termine volontiers par un café. Allergique aux fruits de mer, terrorisé à l'idée de manger des champignons.", menu: "A" },
    { nom: "Jean", indice: "Préfère le poisson à la viande, adore le champagne et le chocolat, mais déteste les blettes.", menu: "D" }
  ]
};

// ----------------------------------------------------------------------
// FICHE 71 — Poisson d'avril (version originale, volet classification)
// ----------------------------------------------------------------------
const JEU_POISSON = {
  id: "poisson",
  titre: "Poisson d'avril !",
  sousTitre: "Jeux de logique & chronologie",
  source: "Principe inspiré d'Agoralude — fiche 71. Illustrations originales (SVG), le volet « moitiés à assembler » (visuel) n'est pas repris ici.",
  criteres: [
    { id: "clara", nom: "Clara", description: "ses poissons ont une nageoire ventrale, sans rayures." },
    { id: "nathan", nom: "Nathan", description: "ses poissons ont la bouche ouverte et une nageoire dorsale." },
    { id: "paul", nom: "Paul", description: "ses poissons ont des rayures et une queue fourchue." }
  ],
  poissons: [
    { id: "f1", categorie: "clara", color: "#3E7CB1", ventralFin: true },
    { id: "f2", categorie: "clara", color: "#4C8C6B", ventralFin: true },
    { id: "f3", categorie: "clara", color: "#C15B4A", ventralFin: true },
    { id: "f4", categorie: "nathan", color: "#D9963A", mouthOpen: true, dorsalFin: true },
    { id: "f5", categorie: "nathan", color: "#8B5FBF", mouthOpen: true, dorsalFin: true },
    { id: "f6", categorie: "nathan", color: "#3E7CB1", mouthOpen: true, dorsalFin: true },
    { id: "f7", categorie: "paul", color: "#C15B4A", stripes: true },
    { id: "f8", categorie: "paul", color: "#D9963A", stripes: true },
    { id: "f9", categorie: "paul", color: "#4C8C6B", stripes: true }
  ]
};

const JEUX_LISTE = [
  JEU_EXPRESSIONS, JEU_CALCUL, JEU_MEMOIRE,
  JEU_COULEURS, JEU_CREPES, JEU_METEO, JEU_MOIS,
  JEU_VACANCES, JEU_CATHERINE, JEU_MENU, JEU_POISSON
];

// ============================================================================
// UTILITAIRES
// ============================================================================
function gEscape(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalise(str) {
  return (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ============================================================================
// BRIQUES RÉUTILISABLES
// ============================================================================

// --- Texte libre à trou(s) : texte contient un ou plusieurs "_____" ---
function buildBlancParagraph(texte, reponses, groupName, itemIdx) {
  const p = document.createElement("p");
  p.className = "jeu-phrase";
  const parts = texte.split("_____");
  parts.forEach((part, i) => {
    p.appendChild(document.createTextNode(part));
    if (i < parts.length - 1) {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.className = "jeu-input";
      inp.size = Math.max(6, ((reponses[i] || "").length || 6) + 2);
      inp.dataset.group = groupName;
      inp.dataset.item = itemIdx;
      inp.dataset.blank = i;
      p.appendChild(inp);
    }
  });
  return p;
}

function checkBlancGroup(section, groupName, dataArray, answerKey) {
  let correct = 0;
  dataArray.forEach((item, idx) => {
    const reponses = answerKey(item);
    const inputs = [...section.querySelectorAll(`[data-group="${groupName}"][data-item="${idx}"]`)].sort(
      (a, b) => Number(a.dataset.blank) - Number(b.dataset.blank)
    );
    let itemOk = inputs.length > 0;
    inputs.forEach((inp, bIdx) => {
      const ok = normalise(inp.value) === normalise(reponses[bIdx]);
      inp.style.borderColor = inp.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
      if (!ok) itemOk = false;
    });
    if (itemOk) correct++;
  });
  return correct;
}

// --- Texte libre à trou unique, plusieurs réponses acceptées ---
function buildTexteLibreRow(label, inputSize) {
  const row = document.createElement("div");
  row.className = "tl-row";
  row.innerHTML = `<span class="tl-label">${gEscape(label)}</span><input type="text" class="jeu-input" size="${inputSize || 14}">`;
  return row;
}

// --- Select à trou unique (banque de mots fermée) ---
function buildSelectParagraph(texte, options, groupName, itemIdx) {
  const p = document.createElement("p");
  p.className = "jeu-phrase";
  const [avant, apres] = texte.split("_____");
  p.appendChild(document.createTextNode(avant));
  const sel = document.createElement("select");
  sel.className = "jeu-select-inline";
  sel.dataset.group = groupName;
  sel.dataset.item = itemIdx;
  sel.innerHTML = `<option value="">…</option>` + options.map((o) => `<option value="${gEscape(o)}">${gEscape(o)}</option>`).join("");
  p.appendChild(sel);
  p.appendChild(document.createTextNode(apres || ""));
  return p;
}

function checkSelectGroup(section, groupName, dataArray, answerKey) {
  let correct = 0;
  dataArray.forEach((item, idx) => {
    const sel = section.querySelector(`select[data-group="${groupName}"][data-item="${idx}"]`);
    if (!sel) return;
    const ok = sel.value === answerKey(item);
    sel.style.borderColor = sel.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
    if (ok) correct++;
  });
  return correct;
}

// --- Appariement (liste de phrases + select rempli des réponses mélangées) ---
function buildAppariementBlock(pairs, groupName, phraseKey, expressionKey) {
  const wrap = document.createElement("div");
  const optionsShuffled = shuffle(pairs.map((p) => p[expressionKey]));
  pairs.forEach((pair, i) => {
    const row = document.createElement("div");
    row.className = "jeu-appariement-row";
    row.innerHTML = `
      <span class="jeu-appariement-phrase">${i + 1}. ${gEscape(pair[phraseKey])}</span>
      <select class="jeu-select" data-group="${groupName}" data-item="${i}">
        <option value="">— choisir —</option>
        ${optionsShuffled.map((o) => `<option value="${gEscape(o)}">${gEscape(o)}</option>`).join("")}
      </select>
    `;
    wrap.appendChild(row);
  });
  return wrap;
}

function checkAppariementGroup(section, groupName, pairs, expressionKey) {
  let correct = 0;
  pairs.forEach((pair, idx) => {
    const sel = section.querySelector(`select[data-group="${groupName}"][data-item="${idx}"]`);
    if (!sel) return;
    const ok = sel.value === pair[expressionKey];
    sel.style.borderColor = sel.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
    if (ok) correct++;
  });
  return correct;
}

// --- Vrai / Faux ---
function buildVraiFauxRow(texte, groupName, idx) {
  const row = document.createElement("div");
  row.className = "vf-row";
  row.innerHTML = `
    <span class="vf-texte">${gEscape(texte)}</span>
    <span class="vf-choices">
      <label class="vf-label"><input type="radio" name="${groupName}-${idx}" data-group="${groupName}" data-item="${idx}" value="vrai"> Vrai</label>
      <label class="vf-label"><input type="radio" name="${groupName}-${idx}" data-group="${groupName}" data-item="${idx}" value="faux"> Faux</label>
    </span>
    <span class="vf-explication hidden" data-explication="${groupName}-${idx}"></span>
  `;
  return row;
}

function checkVraiFauxGroup(section, groupName, items) {
  let correct = 0;
  items.forEach((item, idx) => {
    const checked = section.querySelector(`input[data-group="${groupName}"][data-item="${idx}"]:checked`);
    const expl = section.querySelector(`[data-explication="${groupName}-${idx}"]`);
    const ok = checked && (checked.value === "vrai") === item.vrai;
    if (checked) checked.closest(".vf-row").style.borderColor = ok ? "var(--vert)" : "var(--brique)";
    if (ok) correct++;
    if (expl) {
      expl.textContent = (ok ? "✓ " : "✗ ") + (item.vrai ? "Vrai" : "Faux") + (item.explication ? " — " + item.explication : ".");
      expl.classList.remove("hidden");
    }
  });
  return correct;
}

// --- Carte "cliquer pour révéler la réponse" (exercices ouverts) ---
function buildRevealCard(prompt, reponse) {
  const card = document.createElement("div");
  card.className = "reveal-card";
  card.innerHTML = `
    <p class="reveal-prompt">${gEscape(prompt)}</p>
    <button type="button" class="secondary reveal-btn">Voir une réponse possible</button>
    <p class="reveal-answer hidden"></p>
  `;
  const btn = card.querySelector(".reveal-btn");
  const ans = card.querySelector(".reveal-answer");
  btn.addEventListener("click", () => {
    ans.textContent = reponse;
    ans.classList.remove("hidden");
    btn.classList.add("hidden");
  });
  return card;
}

// --- Petit poisson SVG original (pour le jeu de classification) ---
function makeFishSvg({ color = "#4C8C6B", stripes = false, mouthOpen = false, dorsalFin = false, ventralFin = false }) {
  const stripesEls = stripes
    ? [0, 1, 2].map((i) => `<rect x="${36 + i * 13}" y="14" width="4" height="26" fill="#ffffffaa" rx="1"/>`).join("")
    : "";
  const mouth = mouthOpen
    ? `<polygon points="16,30 2,25 2,35" fill="#5a2a1e"/>`
    : `<path d="M16,30 Q7,30 2,30" stroke="#5a2a1e" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const tail = `<polygon points="95,30 116,13 107,30 116,47" fill="${color}"/>`;
  const dorsal = dorsalFin ? `<polygon points="52,6 70,6 61,-9" fill="${color}" stroke="#00000022"/>` : "";
  const ventral = ventralFin ? `<polygon points="52,52 70,52 61,67" fill="${color}" stroke="#00000022"/>` : "";
  return `<svg viewBox="-12 -12 135 80" width="86" height="52" xmlns="http://www.w3.org/2000/svg">
    ${tail}
    <ellipse cx="55" cy="30" rx="42" ry="21" fill="${color}"/>
    ${stripesEls}
    ${dorsal}${ventral}
    <circle cx="79" cy="23" r="4" fill="#fff"/><circle cx="80" cy="23" r="2" fill="#111"/>
    ${mouth}
  </svg>`;
}

// ============================================================================
// LISTE DES JEUX
// ============================================================================
function renderJeuxListe(onOpen) {
  const section = document.createElement("section");
  section.innerHTML = `
    <h1>Jeux &amp; activités</h1>
    <p class="intro">Des activités courtes, ludiques et sans enjeu d'évaluation, utiles en ouverture de séance pour remobiliser en douceur avant un module du parcours.</p>
  `;

  const grid = document.createElement("div");
  grid.className = "jeux-grid";
  JEUX_LISTE.forEach((jeu) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "jeu-card";
    card.innerHTML = `
      <span class="jeu-card-title">${gEscape(jeu.titre)}</span>
      <span class="jeu-card-sub">${gEscape(jeu.sousTitre)}</span>
    `;
    card.addEventListener("click", () => onOpen(jeu.id));
    grid.appendChild(card);
  });
  section.appendChild(grid);
  return section;
}

// ============================================================================
// JEU 1 — EXPRESSIONS ("Chercher la petite bête")
// ============================================================================
function renderJeuExpressions(onBack) {
  const jeu = JEU_EXPRESSIONS;
  const section = document.createElement("section");

  section.innerHTML = `
    <h1>${gEscape(jeu.titre)}</h1>
    <p class="intro">${gEscape(jeu.sousTitre)}</p>
  `;

  // --- Trou à compléter ---
  const blocTrou = document.createElement("div");
  blocTrou.className = "jeu-bloc";
  blocTrou.innerHTML = `
    <h3>Complétez cette expression</h3>
    <p class="jeu-phrase">Araignée du matin,
      <input type="text" class="jeu-input" data-trou="0" size="10">,
      araignée du soir,
      <input type="text" class="jeu-input" data-trou="1" size="10">.
    </p>
    <div class="jeu-feedback" data-feedback="trou"></div>
  `;
  section.appendChild(blocTrou);

  // --- Appariement (select) ---
  const blocApp = document.createElement("div");
  blocApp.className = "jeu-bloc";
  blocApp.innerHTML = `<h3>Associez à chaque phrase une des expressions proposées</h3>`;
  const optionsShuffled = shuffle(jeu.appariements.map((a) => a.expression));
  jeu.appariements.forEach((pair, i) => {
    const row = document.createElement("div");
    row.className = "jeu-appariement-row";
    row.innerHTML = `
      <span class="jeu-appariement-phrase">${i + 1}. ${gEscape(pair.phrase)}</span>
      <select class="jeu-select" data-app="${i}">
        <option value="">— choisir —</option>
        ${optionsShuffled.map((o) => `<option value="${gEscape(o)}">${gEscape(o)}</option>`).join("")}
      </select>
    `;
    blocApp.appendChild(row);
  });
  blocApp.innerHTML += `<div class="jeu-feedback" data-feedback="app"></div>`;
  section.appendChild(blocApp);

  // --- Mots proches ---
  const blocMots = document.createElement("div");
  blocMots.className = "jeu-bloc";
  blocMots.innerHTML = `
    <h3>Complétez ces phrases avec ces mots aux sonorités proches</h3>
    <p class="jeu-banque">${jeu.motsProches.banque.map((m) => `<span class="jeu-mot-banque">${gEscape(m)}</span>`).join(" ")}</p>
  `;
  jeu.motsProches.phrases.forEach((p, i) => {
    const row = document.createElement("p");
    row.className = "jeu-phrase";
    const [avant, apres] = p.texte.split("_____");
    row.innerHTML = `${gEscape(avant)}<select class="jeu-select-inline" data-mot="${i}">
      <option value="">…</option>
      ${jeu.motsProches.banque.map((m) => `<option value="${gEscape(m)}">${gEscape(m)}</option>`).join("")}
    </select>${gEscape(apres)}`;
    blocMots.appendChild(row);
  });
  blocMots.innerHTML += `<div class="jeu-feedback" data-feedback="mots"></div>`;
  section.appendChild(blocMots);

  // --- Actions ---
  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary";
  btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);

  const btnCheck = document.createElement("button");
  btnCheck.className = "primary";
  btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    // Trou
    const inputs = section.querySelectorAll("[data-trou]");
    let okTrou = true;
    inputs.forEach((inp) => {
      const idx = Number(inp.dataset.trou);
      const correct = normalise(inp.value) === normalise(jeu.trou.reponses[idx]);
      inp.style.borderColor = correct ? "var(--vert)" : "var(--brique)";
      if (!correct) okTrou = false;
    });
    section.querySelector('[data-feedback="trou"]').innerHTML = okTrou
      ? `<span class="ok">✓ Bravo !</span>`
      : `<span class="ko">Réponse attendue : ${gEscape(jeu.trou.reponses.join(" … "))}</span>`;

    // Appariement
    let scoreApp = 0;
    section.querySelectorAll("[data-app]").forEach((sel) => {
      const idx = Number(sel.dataset.app);
      const correct = sel.value === jeu.appariements[idx].expression;
      sel.style.borderColor = sel.value ? (correct ? "var(--vert)" : "var(--brique)") : "var(--border)";
      if (correct) scoreApp++;
    });
    section.querySelector('[data-feedback="app"]').innerHTML = `<span class="${scoreApp === jeu.appariements.length ? "ok" : "ko"}">${scoreApp} / ${jeu.appariements.length} bonnes réponses</span>`;

    // Mots proches
    let scoreMots = 0;
    section.querySelectorAll("[data-mot]").forEach((sel) => {
      const idx = Number(sel.dataset.mot);
      const correct = sel.value === jeu.motsProches.phrases[idx].reponse;
      sel.style.borderColor = sel.value ? (correct ? "var(--vert)" : "var(--brique)") : "var(--border)";
      if (correct) scoreMots++;
    });
    section.querySelector('[data-feedback="mots"]').innerHTML = `<span class="${scoreMots === jeu.motsProches.phrases.length ? "ok" : "ko"}">${scoreMots} / ${jeu.motsProches.phrases.length} bonnes réponses</span>`;
  });

  actions.appendChild(btnBack);
  actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p");
  src.className = "jeu-source";
  src.textContent = jeu.source;
  section.appendChild(src);

  return section;
}

// ============================================================================
// JEU 2 — CALCUL ("Le mercure s'affole")
// ============================================================================
function renderJeuCalcul(onBack) {
  const jeu = JEU_CALCUL;
  const section = document.createElement("section");
  section.innerHTML = `
    <h1>${gEscape(jeu.titre)}</h1>
    <p class="intro">${gEscape(jeu.sousTitre)} — ${gEscape(jeu.intro)}</p>
  `;

  function boissonsList(liste) {
    return `<div class="boisson-grid">${liste
      .map(
        (b) => `<div class="boisson-item">
          <span class="boisson-emoji">${b.qty ? b.qty + " × " : ""}${b.emoji}</span>
          <span class="boisson-label">${gEscape(b.label)}</span>
          <span class="boisson-vol">${b.volume} cl</span>
        </div>`
      )
      .join("")}</div>`;
  }

  const blocBoissons = document.createElement("div");
  blocBoissons.className = "jeu-bloc";
  blocBoissons.innerHTML = `
    <h3>Nicole boit, au fil de la journée :</h3>
    ${boissonsList(jeu.nicole)}
    <h3 style="margin-top:18px">Claude boit, au fil de la journée :</h3>
    ${boissonsList(jeu.claude)}
    <p class="jeu-question" style="margin-top:14px"><strong>Qui de Nicole ou Claude a bu le plus durant la journée ? De combien de plus ?</strong></p>
    <div class="row">
      <div class="field"><label>Total bu par Nicole (cl)</label><input type="number" class="jeu-input" id="total-nicole"></div>
      <div class="field"><label>Total bu par Claude (cl)</label><input type="number" class="jeu-input" id="total-claude"></div>
    </div>
    <div class="jeu-feedback" data-feedback="boissons"></div>
  `;
  section.appendChild(blocBoissons);

  const blocTemp = document.createElement("div");
  blocTemp.className = "jeu-bloc";
  const t = jeu.temperature;
  let heure = t.depart.heure;
  const etapesTxt = [`À ${heure} heures du matin, la température est déjà de ${t.depart.temp}°.`];
  t.etapes.forEach((e) => {
    etapesTxt.push(`${e.deltaHeure} heures plus tard, elle augmente de ${e.deltaTemp}°.`);
  });
  etapesTxt.push(`Elle baisse ensuite doucement jusqu'à ${t.tempMinuit}° à minuit.`);

  blocTemp.innerHTML = `
    <h3>En ville, le thermomètre va grimper</h3>
    <ul>${etapesTxt.map((l) => `<li>${gEscape(l)}</li>`).join("")}</ul>
    <div class="row">
      <div class="field"><label>À quelle heure la température est-elle maximale ?</label><input type="text" class="jeu-input" id="heure-max" placeholder="ex. 14h"></div>
      <div class="field"><label>Quelle est cette température maximale ?</label><input type="number" class="jeu-input" id="temp-max"></div>
    </div>
    <div class="jeu-feedback" data-feedback="temp"></div>
  `;
  section.appendChild(blocTemp);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary";
  btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);

  const btnCheck = document.createElement("button");
  btnCheck.className = "primary";
  btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    const totalNicole = jeu.nicole.reduce((a, b) => a + b.volume, 0);
    const totalClaude = jeu.claude.reduce((a, b) => a + b.volume * (b.qty || 1), 0);
    const inNicole = Number(section.querySelector("#total-nicole").value);
    const inClaude = Number(section.querySelector("#total-claude").value);
    const okN = inNicole === totalNicole;
    const okC = inClaude === totalClaude;
    section.querySelector("#total-nicole").style.borderColor = okN ? "var(--vert)" : "var(--brique)";
    section.querySelector("#total-claude").style.borderColor = okC ? "var(--vert)" : "var(--brique)";
    const diff = Math.abs(totalNicole - totalClaude);
    const qui = totalNicole > totalClaude ? "Nicole" : "Claude";
    section.querySelector('[data-feedback="boissons"]').innerHTML =
      okN && okC
        ? `<span class="ok">✓ Exact ! Nicole : ${totalNicole} cl, Claude : ${totalClaude} cl. C'est ${qui} qui a bu le plus, avec ${diff} cl de plus.</span>`
        : `<span class="ko">Réponse : Nicole = ${totalNicole} cl, Claude = ${totalClaude} cl. C'est ${qui} qui a bu le plus (${diff} cl de plus).</span>`;

    // calcul heure et temp max
    let h = t.depart.heure;
    let temp = t.depart.temp;
    let heureMax = h, tempMax = temp;
    t.etapes.forEach((e) => {
      h += e.deltaHeure;
      temp += e.deltaTemp;
      if (temp > tempMax) { tempMax = temp; heureMax = h; }
    });
    const inHeure = section.querySelector("#heure-max").value;
    const inTemp = Number(section.querySelector("#temp-max").value);
    const okTemp = inTemp === tempMax;
    section.querySelector("#temp-max").style.borderColor = okTemp ? "var(--vert)" : "var(--brique)";
    section.querySelector('[data-feedback="temp"]').innerHTML = `<span class="${okTemp ? "ok" : "ko"}">Réponse : maximum atteint à ${heureMax}h, avec ${tempMax}° (votre réponse : ${gEscape(inHeure || "—")}).</span>`;
  });

  actions.appendChild(btnBack);
  actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p");
  src.className = "jeu-source";
  src.textContent = jeu.source;
  section.appendChild(src);

  return section;
}

// ============================================================================
// JEU 3 — MÉMOIRE (grille d'images)
// ============================================================================
function renderJeuMemoire(onBack) {
  const jeu = JEU_MEMOIRE;
  const section = document.createElement("section");
  section.innerHTML = `
    <h1>${gEscape(jeu.titre)}</h1>
    <p class="intro">${gEscape(jeu.sousTitre)} — Mémorisez la grille pendant ${jeu.dureeMemorisation} secondes, puis retrouvez les 9 images parmi les 18 proposées.</p>
  `;

  const zone = document.createElement("div");
  zone.className = "jeu-bloc";
  section.appendChild(zone);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary";
  btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  actions.appendChild(btnBack);
  section.appendChild(actions);

  const src = document.createElement("p");
  src.className = "jeu-source";
  src.textContent = jeu.source;
  section.appendChild(src);

  let timerInterval = null;

  function demarrer() {
    const grilleDef = jeu.grilles[Math.floor(Math.random() * jeu.grilles.length)];
    zone.innerHTML = `
      <h3>Grille « ${gEscape(grilleDef.nom)} »</h3>
      <p>Mémorisez ces 9 images : <span class="memo-chrono" id="memo-chrono">${jeu.dureeMemorisation}s</span></p>
      <div class="memo-grid">${grilleDef.items.map((e) => `<div class="memo-cell">${e}</div>`).join("")}</div>
    `;
    let reste = jeu.dureeMemorisation;
    timerInterval = setInterval(() => {
      reste--;
      const chrono = zone.querySelector("#memo-chrono");
      if (chrono) chrono.textContent = reste + "s";
      if (reste <= 0) {
        clearInterval(timerInterval);
        phaseRappel(grilleDef);
      }
    }, 1000);
  }

  function phaseRappel(grilleDef) {
    const pool = shuffle([...grilleDef.items, ...grilleDef.distracteurs]);
    zone.innerHTML = `
      <h3>À vous de jouer</h3>
      <p>Cliquez sur les 9 images qui étaient présentes dans la grille précédente.</p>
      <div class="memo-grid memo-grid-recall">${pool.map((e) => `<button type="button" class="memo-cell memo-cell-btn" data-emoji="${e}">${e}</button>`).join("")}</div>
      <div class="actions" style="margin-top:16px">
        <button class="primary" id="memo-valider">Valider mes réponses</button>
      </div>
      <div class="jeu-feedback" data-feedback="memo"></div>
    `;
    const selected = new Set();
    zone.querySelectorAll(".memo-cell-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const e = btn.dataset.emoji;
        if (selected.has(e)) { selected.delete(e); btn.classList.remove("selected"); }
        else { selected.add(e); btn.classList.add("selected"); }
      });
    });
    zone.querySelector("#memo-valider").addEventListener("click", () => {
      let correct = 0;
      zone.querySelectorAll(".memo-cell-btn").forEach((btn) => {
        const e = btn.dataset.emoji;
        const wasPresent = grilleDef.items.includes(e);
        const wasSelected = selected.has(e);
        btn.classList.remove("memo-ok", "memo-ko", "memo-missed");
        if (wasPresent && wasSelected) { btn.classList.add("memo-ok"); correct++; }
        else if (!wasPresent && wasSelected) { btn.classList.add("memo-ko"); }
        else if (wasPresent && !wasSelected) { btn.classList.add("memo-missed"); }
      });
      zone.querySelector('[data-feedback="memo"]').innerHTML = `<span class="${correct === 9 ? "ok" : "ko"}">${correct} / 9 images correctement retrouvées</span>`;
      const retry = document.createElement("div");
      retry.className = "actions";
      retry.style.marginTop = "14px";
      const btnRetry = document.createElement("button");
      btnRetry.className = "secondary";
      btnRetry.textContent = "Recommencer avec une nouvelle grille";
      btnRetry.addEventListener("click", demarrer);
      retry.appendChild(btnRetry);
      zone.appendChild(retry);
    });
  }

  demarrer();
  return section;
}

// ============================================================================
// FICHE 72 — De toutes les couleurs
// ============================================================================
function renderJeuCouleurs(onBack) {
  const jeu = JEU_COULEURS;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)}</p>`;

  const blocMel = document.createElement("div");
  blocMel.className = "jeu-bloc";
  blocMel.innerHTML = `<h3>En peinture, quel est le résultat de ces mélanges de couleurs ?</h3>`;
  jeu.melanges.forEach((m, i) => blocMel.appendChild(buildBlancParagraph(m.texte, m.reponses, "melanges", i)));
  blocMel.innerHTML += `<div class="jeu-feedback" data-feedback="melanges"></div>`;
  section.appendChild(blocMel);

  const blocNB = document.createElement("div");
  blocNB.className = "jeu-bloc";
  blocNB.innerHTML = `<h3>Noir ou blanc ? Complétez ces expressions</h3>`;
  jeu.noirBlanc.forEach((p, i) => blocNB.appendChild(buildSelectParagraph(p.texte, ["noir", "blanc"], "noirblanc", i)));
  blocNB.innerHTML += `<div class="jeu-feedback" data-feedback="noirblanc"></div>`;
  section.appendChild(blocNB);

  const blocTitres = document.createElement("div");
  blocTitres.className = "jeu-bloc";
  blocTitres.innerHTML = `<h3>Complétez les titres de ces œuvres, avec des couleurs</h3>`;
  jeu.titres.forEach((t, i) => blocTitres.appendChild(buildBlancParagraph(t.texte, t.reponses, "titres", i)));
  blocTitres.innerHTML += `<div class="jeu-feedback" data-feedback="titres"></div>`;
  section.appendChild(blocTitres);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    const n1 = checkBlancGroup(section, "melanges", jeu.melanges, (it) => it.reponses);
    section.querySelector('[data-feedback="melanges"]').innerHTML = `<span class="${n1 === jeu.melanges.length ? "ok" : "ko"}">${n1} / ${jeu.melanges.length}</span>`;
    const n2 = checkSelectGroup(section, "noirblanc", jeu.noirBlanc, (it) => it.reponse);
    section.querySelector('[data-feedback="noirblanc"]').innerHTML = `<span class="${n2 === jeu.noirBlanc.length ? "ok" : "ko"}">${n2} / ${jeu.noirBlanc.length}</span>`;
    const n3 = checkBlancGroup(section, "titres", jeu.titres, (it) => it.reponses);
    section.querySelector('[data-feedback="titres"]').innerHTML = `<span class="${n3 === jeu.titres.length ? "ok" : "ko"}">${n3} / ${jeu.titres.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 69 — Et que ça saute !
// ============================================================================
function renderJeuCrepes(onBack) {
  const jeu = JEU_CREPES;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)} — un TP de proportionnalité appliqué à la cuisine.</p>`;

  const expectedByTable = [];
  jeu.tables.forEach((table, tIdx) => {
    const ratio = table.ciblePersonnes / table.basePersonnes;
    const expected = table.items.map((it) => it.base * ratio);
    expectedByTable.push(expected);
    const bloc = document.createElement("div");
    bloc.className = "jeu-bloc";
    bloc.innerHTML = `<h3>${gEscape(table.titre)}</h3>`;
    table.items.forEach((it, iIdx) => {
      const row = document.createElement("div");
      row.className = "scale-row";
      row.innerHTML = `
        <span class="scale-base">${gEscape(it.baseText)}</span>
        <span class="scale-arrow">→</span>
        <input type="text" class="jeu-input" data-group="table${tIdx}" data-item="${iIdx}" size="6">
        <span class="scale-unit">${gEscape(it.suffix)}</span>
      `;
      bloc.appendChild(row);
    });
    bloc.innerHTML += `<div class="jeu-feedback" data-feedback="table${tIdx}"></div>`;
    section.appendChild(bloc);
  });

  const blocEnigme = document.createElement("div");
  blocEnigme.className = "jeu-bloc";
  blocEnigme.innerHTML = `
    <h3>Qui a mangé le plus de crêpes ?</h3>
    <p class="jeu-phrase">${gEscape(jeu.enigme.texte)}</p>
    <p class="jeu-question"><strong>${gEscape(jeu.enigme.question)}</strong></p>
  `;
  blocEnigme.appendChild(buildRevealCard("Vérifiez votre calcul avant de révéler :", jeu.enigme.solution));
  section.appendChild(blocEnigme);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    jeu.tables.forEach((table, tIdx) => {
      let correct = 0;
      expectedByTable[tIdx].forEach((exp, iIdx) => {
        const inp = section.querySelector(`[data-group="table${tIdx}"][data-item="${iIdx}"]`);
        const val = parseFloat((inp.value || "").replace(",", "."));
        const ok = !isNaN(val) && Math.abs(val - exp) < 0.05;
        inp.style.borderColor = inp.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
        if (ok) correct++;
      });
      section.querySelector(`[data-feedback="table${tIdx}"]`).innerHTML = `<span class="${correct === expectedByTable[tIdx].length ? "ok" : "ko"}">${correct} / ${expectedByTable[tIdx].length}</span>`;
    });
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 70 — Pluie ou beau temps
// ============================================================================
function renderJeuMeteo(onBack) {
  const jeu = JEU_METEO;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)}</p>`;

  const blocChaines = document.createElement("div");
  blocChaines.className = "jeu-bloc";
  blocChaines.innerHTML = `<h3>Passez d'un mot à l'autre</h3>`;
  jeu.chaines.forEach((c, ci) => {
    const row = document.createElement("div");
    row.className = "chaine-row";
    const spans = [`<span class="chaine-mot">${gEscape(c.depart)}</span>`];
    c.etapes.forEach((etape, ei) => {
      spans.push(`<span class="chaine-arrow">→</span>`);
      spans.push(`<input type="text" class="jeu-input" data-group="chaine${ci}" data-item="${ei}" size="${Math.max(6, etape.reponses[0].length + 2)}">`);
    });
    spans.push(`<span class="chaine-arrow">→</span>`);
    spans.push(`<span class="chaine-mot">${gEscape(c.arrivee)}</span>`);
    row.innerHTML = spans.join("");
    blocChaines.appendChild(row);
    const note = document.createElement("p");
    note.className = "jeu-meta";
    note.textContent = `(${c.consigne})`;
    blocChaines.appendChild(note);
  });
  blocChaines.innerHTML += `<div class="jeu-feedback" data-feedback="chaines"></div>`;
  section.appendChild(blocChaines);

  const blocDef = document.createElement("div");
  blocDef.className = "jeu-bloc";
  blocDef.innerHTML = `<h3>Reliez ces mots de la météo à leur définition</h3>`;
  blocDef.appendChild(buildAppariementBlock(jeu.definitions, "defs", "mot", "def"));
  blocDef.innerHTML += `<div class="jeu-feedback" data-feedback="defs"></div>`;
  section.appendChild(blocDef);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    let totalOk = 0, totalEtapes = 0;
    jeu.chaines.forEach((c, ci) => {
      c.etapes.forEach((etape, ei) => {
        totalEtapes++;
        const inp = section.querySelector(`[data-group="chaine${ci}"][data-item="${ei}"]`);
        const ok = etape.reponses.some((r) => normalise(r) === normalise(inp.value));
        inp.style.borderColor = inp.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
        if (ok) totalOk++;
      });
    });
    section.querySelector('[data-feedback="chaines"]').innerHTML = `<span class="${totalOk === totalEtapes ? "ok" : "ko"}">${totalOk} / ${totalEtapes} étapes correctes</span>`;
    const nDef = checkAppariementGroup(section, "defs", jeu.definitions, "def");
    section.querySelector('[data-feedback="defs"]').innerHTML = `<span class="${nDef === jeu.definitions.length ? "ok" : "ko"}">${nDef} / ${jeu.definitions.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 68 — Parlons de mois
// ============================================================================
function renderJeuMois(onBack) {
  const jeu = JEU_MOIS;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)}</p>`;

  const bloc1 = document.createElement("div");
  bloc1.className = "jeu-bloc";
  bloc1.innerHTML = `<h3>Vrai ou faux ?</h3>`;
  jeu.serie1.forEach((it, i) => bloc1.appendChild(buildVraiFauxRow(it.texte, "serie1", i)));
  bloc1.innerHTML += `<div class="jeu-feedback" data-feedback="serie1"></div>`;
  section.appendChild(bloc1);

  const bloc2 = document.createElement("div");
  bloc2.className = "jeu-bloc";
  bloc2.innerHTML = `<h3>La durée des jours et des nuits varie au fil de l'année</h3>`;
  jeu.serie2.forEach((it, i) => bloc2.appendChild(buildVraiFauxRow(it.texte, "serie2", i)));
  bloc2.innerHTML += `<div class="jeu-feedback" data-feedback="serie2"></div>`;
  section.appendChild(bloc2);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    const n1 = checkVraiFauxGroup(section, "serie1", jeu.serie1);
    section.querySelector('[data-feedback="serie1"]').innerHTML = `<span class="${n1 === jeu.serie1.length ? "ok" : "ko"}">${n1} / ${jeu.serie1.length}</span>`;
    const n2 = checkVraiFauxGroup(section, "serie2", jeu.serie2);
    section.querySelector('[data-feedback="serie2"]').innerHTML = `<span class="${n2 === jeu.serie2.length ? "ok" : "ko"}">${n2} / ${jeu.serie2.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 64 — Retour de vacances
// ============================================================================
function renderJeuVacances(onBack) {
  const jeu = JEU_VACANCES;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)}</p>`;

  function voyellesBloc(titreH3, items, groupName) {
    const bloc = document.createElement("div");
    bloc.className = "jeu-bloc";
    bloc.innerHTML = `<h3>${gEscape(titreH3)}</h3>`;
    items.forEach((it, i) => {
      const row = document.createElement("div");
      row.className = "voyelle-row";
      row.innerHTML = `<span class="voyelle-lettre">par ${it.lettre}</span><span class="voyelle-indice">${gEscape(it.indice)}</span><input type="text" class="jeu-input" data-group="${groupName}" data-item="${i}" size="14">`;
      bloc.appendChild(row);
    });
    bloc.innerHTML += `<div class="jeu-feedback" data-feedback="${groupName}"></div>`;
    return bloc;
  }
  section.appendChild(voyellesBloc("Quizz des voyelles — à l'école", jeu.ecole, "ecole"));
  section.appendChild(voyellesBloc("Quizz des voyelles — au travail", jeu.travail, "travail"));

  const blocProf = document.createElement("div");
  blocProf.className = "jeu-bloc";
  blocProf.innerHTML = `<h3>Reliez ces professions à leur surnom</h3>`;
  blocProf.appendChild(buildAppariementBlock(jeu.professions, "prof", "metier", "surnom"));
  blocProf.innerHTML += `<div class="jeu-feedback" data-feedback="prof"></div>`;
  section.appendChild(blocProf);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    [["ecole", jeu.ecole], ["travail", jeu.travail]].forEach(([key, arr]) => {
      let correct = 0;
      arr.forEach((it, i) => {
        const inp = section.querySelector(`[data-group="${key}"][data-item="${i}"]`);
        const ok = it.reponses.some((r) => normalise(r) === normalise(inp.value));
        inp.style.borderColor = inp.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
        if (ok) correct++;
      });
      section.querySelector(`[data-feedback="${key}"]`).innerHTML = `<span class="${correct === arr.length ? "ok" : "ko"}">${correct} / ${arr.length}</span>`;
    });
    const nProf = checkAppariementGroup(section, "prof", jeu.professions, "surnom");
    section.querySelector('[data-feedback="prof"]').innerHTML = `<span class="${nProf === jeu.professions.length ? "ok" : "ko"}">${nProf} / ${jeu.professions.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 66 — Dictons de jardinier
// ============================================================================
function renderJeuCatherine(onBack) {
  const jeu = JEU_CATHERINE;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)}</p>`;

  const blocQcm = document.createElement("div");
  blocQcm.className = "jeu-bloc";
  blocQcm.innerHTML = `
    <h3>Complétez cette expression</h3>
    <p class="jeu-phrase">${gEscape(jeu.qcm.question)}</p>
    <div class="qcm-options">
      ${jeu.qcm.options.map((o, i) => `<label class="qcm-label"><input type="radio" name="qcm-catherine" value="${gEscape(o)}"> ${gEscape(o)}</label>`).join("")}
    </div>
    <div class="jeu-feedback" data-feedback="qcm"></div>
  `;
  section.appendChild(blocQcm);

  const blocReveal = document.createElement("div");
  blocReveal.className = "jeu-bloc";
  blocReveal.innerHTML = `<h3>Trouvez des expressions contenant les mots indiqués</h3><p class="intro" style="margin:0 0 10px">${"Indice : la définition attendue est donnée, cherchez l'expression avant de révéler."}</p>`;
  jeu.reveal.forEach((r) => blocReveal.appendChild(buildRevealCard(`${r.mot} — ${r.indices}`, r.reponse)));
  section.appendChild(blocReveal);

  const blocCat = document.createElement("div");
  blocCat.className = "jeu-bloc";
  blocCat.innerHTML = `<h3>Classez ces mots (un intrus par famille d'origine)</h3>`;
  jeu.mots.forEach((m, i) => {
    const row = document.createElement("div");
    row.className = "jeu-appariement-row";
    row.innerHTML = `
      <span class="jeu-appariement-phrase">${gEscape(m.mot)}</span>
      <select class="jeu-select" data-group="cat" data-item="${i}">
        <option value="">— choisir —</option>
        ${jeu.categories.map((c) => `<option value="${gEscape(c)}">${gEscape(c)}</option>`).join("")}
      </select>
    `;
    blocCat.appendChild(row);
  });
  blocCat.innerHTML += `<div class="jeu-feedback" data-feedback="cat"></div>`;
  section.appendChild(blocCat);

  const blocMots = document.createElement("div");
  blocMots.className = "jeu-bloc";
  blocMots.innerHTML = `
    <h3>Complétez ces phrases avec ces mots aux sonorités proches</h3>
    <p class="jeu-banque">${jeu.banque.map((m) => `<span class="jeu-mot-banque">${gEscape(m)}</span>`).join(" ")}</p>
  `;
  jeu.phrases.forEach((p, i) => blocMots.appendChild(buildSelectParagraph(p.texte, jeu.banque, "mots", i)));
  blocMots.innerHTML += `<div class="jeu-feedback" data-feedback="mots"></div>`;
  section.appendChild(blocMots);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    const checked = section.querySelector('input[name="qcm-catherine"]:checked');
    const okQcm = checked && checked.value === jeu.qcm.reponse;
    section.querySelector('[data-feedback="qcm"]').innerHTML = okQcm ? `<span class="ok">✓ Bravo !</span>` : `<span class="ko">Réponse : ${gEscape(jeu.qcm.reponse)}</span>`;

    let nCat = 0;
    jeu.mots.forEach((m, i) => {
      const sel = section.querySelector(`select[data-group="cat"][data-item="${i}"]`);
      const ok = sel.value === m.categorie;
      sel.style.borderColor = sel.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
      if (ok) nCat++;
    });
    section.querySelector('[data-feedback="cat"]').innerHTML = `<span class="${nCat === jeu.mots.length ? "ok" : "ko"}">${nCat} / ${jeu.mots.length}</span>`;

    const nMots = checkSelectGroup(section, "mots", jeu.phrases, (it) => it.reponse);
    section.querySelector('[data-feedback="mots"]').innerHTML = `<span class="${nMots === jeu.phrases.length ? "ok" : "ko"}">${nMots} / ${jeu.phrases.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 67 — Au menu ce soir
// ============================================================================
function renderJeuMenu(onBack) {
  const jeu = JEU_MENU;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)} — aidez chaque invité à retrouver son menu préféré.</p>`;

  const blocMenus = document.createElement("div");
  blocMenus.className = "jeu-bloc";
  blocMenus.innerHTML = `<h3>Les 4 menus</h3>`;
  const grid = document.createElement("div");
  grid.className = "menu-grid";
  jeu.menus.forEach((m) => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `<p class="menu-card-id">Menu ${m.id}</p><ul>${m.items.map((it) => `<li>${gEscape(it)}</li>`).join("")}</ul>`;
    grid.appendChild(card);
  });
  blocMenus.appendChild(grid);
  section.appendChild(blocMenus);

  const blocInvites = document.createElement("div");
  blocInvites.className = "jeu-bloc";
  blocInvites.innerHTML = `<h3>Les invités</h3>`;
  jeu.invites.forEach((inv, i) => {
    const row = document.createElement("div");
    row.className = "jeu-appariement-row";
    row.innerHTML = `
      <span class="jeu-appariement-phrase"><strong>${gEscape(inv.nom)}</strong> — ${gEscape(inv.indice)}</span>
      <select class="jeu-select" data-group="invites" data-item="${i}">
        <option value="">— menu —</option>
        ${jeu.menus.map((m) => `<option value="${m.id}">Menu ${m.id}</option>`).join("")}
      </select>
    `;
    blocInvites.appendChild(row);
  });
  blocInvites.innerHTML += `<div class="jeu-feedback" data-feedback="invites"></div>`;
  section.appendChild(blocInvites);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    let correct = 0;
    jeu.invites.forEach((inv, i) => {
      const sel = section.querySelector(`select[data-group="invites"][data-item="${i}"]`);
      const ok = sel.value === inv.menu;
      sel.style.borderColor = sel.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
      if (ok) correct++;
    });
    section.querySelector('[data-feedback="invites"]').innerHTML = `<span class="${correct === jeu.invites.length ? "ok" : "ko"}">${correct} / ${jeu.invites.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// FICHE 71 — Poisson d'avril (classification)
// ============================================================================
function renderJeuPoisson(onBack) {
  const jeu = JEU_POISSON;
  const section = document.createElement("section");
  section.innerHTML = `<h1>${gEscape(jeu.titre)}</h1><p class="intro">${gEscape(jeu.sousTitre)} — retrouvez les poissons dessinés par Clara, Nathan et Paul.</p>`;

  const blocCriteres = document.createElement("div");
  blocCriteres.className = "jeu-bloc";
  blocCriteres.innerHTML = `<h3>Indices</h3>` + jeu.criteres.map((c) => `<p class="jeu-phrase"><strong>${gEscape(c.nom)}</strong> — ${gEscape(c.description)}</p>`).join("");
  section.appendChild(blocCriteres);

  const blocPoissons = document.createElement("div");
  blocPoissons.className = "jeu-bloc";
  const grid = document.createElement("div");
  grid.className = "poisson-grid";
  const ordered = shuffle(jeu.poissons);
  ordered.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "poisson-card";
    card.innerHTML = `
      <div class="poisson-svg">${makeFishSvg(p)}</div>
      <select class="jeu-select" data-group="poisson" data-item="${i}">
        <option value="">— qui ? —</option>
        ${jeu.criteres.map((c) => `<option value="${c.id}">${gEscape(c.nom)}</option>`).join("")}
      </select>
    `;
    grid.appendChild(card);
  });
  blocPoissons.appendChild(grid);
  blocPoissons.innerHTML += `<div class="jeu-feedback" data-feedback="poisson" style="margin-top:14px"></div>`;
  section.appendChild(blocPoissons);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnBack = document.createElement("button");
  btnBack.className = "secondary"; btnBack.textContent = "← Retour aux jeux";
  btnBack.addEventListener("click", onBack);
  const btnCheck = document.createElement("button");
  btnCheck.className = "primary"; btnCheck.textContent = "Vérifier mes réponses";
  btnCheck.addEventListener("click", () => {
    let correct = 0;
    ordered.forEach((p, i) => {
      const sel = section.querySelector(`select[data-group="poisson"][data-item="${i}"]`);
      const ok = sel.value === p.categorie;
      sel.style.borderColor = sel.value ? (ok ? "var(--vert)" : "var(--brique)") : "var(--border)";
      if (ok) correct++;
    });
    section.querySelector('[data-feedback="poisson"]').innerHTML = `<span class="${correct === ordered.length ? "ok" : "ko"}">${correct} / ${ordered.length}</span>`;
  });
  actions.appendChild(btnBack); actions.appendChild(btnCheck);
  section.appendChild(actions);

  const src = document.createElement("p"); src.className = "jeu-source"; src.textContent = jeu.source;
  section.appendChild(src);
  return section;
}

// ============================================================================
// ROUTAGE INTERNE
// ============================================================================
const JEUX_RENDERERS = {
  expressions: renderJeuExpressions,
  calcul: renderJeuCalcul,
  memoire: renderJeuMemoire,
  couleurs: renderJeuCouleurs,
  crepes: renderJeuCrepes,
  meteo: renderJeuMeteo,
  mois: renderJeuMois,
  vacances: renderJeuVacances,
  dictons: renderJeuCatherine,
  menu: renderJeuMenu,
  poisson: renderJeuPoisson
};

function renderJeuxSection(jeuOuvert, setJeuOuvert) {
  if (!jeuOuvert) return renderJeuxListe(setJeuOuvert);
  const renderer = JEUX_RENDERERS[jeuOuvert];
  if (renderer) return renderer(() => setJeuOuvert(null));
  return renderJeuxListe(setJeuOuvert);
}

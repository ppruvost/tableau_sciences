/* ============================================================
   ============  QUIZ PLAYSCIENCES — GEOMETRIE 2NDE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur ce triangle rectangle, quelle formule permet de calculer son aire ?",
    graphique: "img/q1.png",
    options: [
      "Aire = (base × hauteur) / 2",
      "Aire = base × hauteur",
      "Aire = base + hauteur",
      "Aire = base² + hauteur²"
    ],
    bonne_reponse: "Aire = (base × hauteur) / 2",
    explication: "L'aire d'un triangle rectangle (comme de tout triangle) est le produit de la base par la hauteur relative, divisé par 2."
  },

  {
    question: "Sur cette figure combinant un pavé droit et une pyramide, comment calcule-t-on le volume total du solide composé ?",
    graphique: "img/q2.png",
    options: [
      "En additionnant le volume du pavé droit et celui de la pyramide",
      "En multipliant les deux volumes entre eux",
      "En ne prenant en compte que le plus grand des deux volumes",
      "Le volume d'un solide composé ne peut pas être calculé"
    ],
    bonne_reponse: "En additionnant le volume du pavé droit et celui de la pyramide",
    explication: "Le volume d'un solide composé de plusieurs solides usuels s'obtient en additionnant (ou soustrayant, selon les cas) les volumes de chacune des parties qui le constituent."
  },

  {
    question: "Quelle est la formule du volume d'un cylindre de rayon r et de hauteur h ?",
    options: [
      "V = π × r² × h",
      "V = π × r × h",
      "V = 2 × π × r × h",
      "V = (4/3) × π × r³"
    ],
    bonne_reponse: "V = π × r² × h",
    explication: "Le volume d'un cylindre de révolution est le produit de l'aire de sa base circulaire (π×r²) par sa hauteur h."
  },

  {
    question: "Sur ce triangle rectangle de côtés a = 4 cm et b = 3 cm, quelle est la longueur de l'hypoténuse c ?",
    graphique: "img/q4.png",
    options: [
      "5 cm",
      "7 cm",
      "1 cm",
      "25 cm"
    ],
    bonne_reponse: "5 cm",
    explication: "D'après le théorème de Pythagore, c² = a² + b² = 16 + 9 = 25, donc c = 5 cm."
  },

  {
    question: "À quelle condition peut-on utiliser la réciproque du théorème de Pythagore pour démontrer qu'un triangle est rectangle ?",
    options: [
      "Lorsque le carré du plus grand côté est égal à la somme des carrés des deux autres côtés",
      "Lorsque tous les côtés du triangle sont égaux",
      "Lorsque le triangle a un angle obtus",
      "La réciproque ne permet jamais de démontrer qu'un triangle est rectangle"
    ],
    bonne_reponse: "Lorsque le carré du plus grand côté est égal à la somme des carrés des deux autres côtés",
    explication: "La réciproque du théorème de Pythagore permet d'affirmer qu'un triangle est rectangle si le carré de son plus grand côté est égal à la somme des carrés des deux autres côtés."
  },

  {
    question: "Sur cette figure, la droite (MN) est parallèle à (BC). Quelle relation donne le théorème de Thalès dans ce triangle ?",
    graphique: "img/q6.png",
    options: [
      "AM/AB = AN/AC = MN/BC",
      "AM + AB = AN + AC",
      "AM × AB = AN × AC",
      "AM/AB = BC/MN"
    ],
    bonne_reponse: "AM/AB = AN/AC = MN/BC",
    explication: "Le théorème de Thalès, appliqué lorsque (MN) est parallèle à (BC), donne l'égalité des rapports AM/AB = AN/AC = MN/BC."
  },

  {
    question: "Dans un triangle, deux droites parallèles définissent des longueurs AM = 3 cm, AB = 6 cm et AN = 4 cm. Quelle est la longueur AC ?",
    options: [
      "8 cm",
      "2 cm",
      "12 cm",
      "7 cm"
    ],
    bonne_reponse: "8 cm",
    explication: "D'après Thalès, AM/AB = AN/AC, donc 3/6 = 4/AC, d'où AC = 4×6/3 = 8 cm."
  },

  {
    question: "Sur cette figure, un carré est agrandi avec un rapport k = 2. Comment évolue son aire par rapport à l'aire initiale ?",
    graphique: "img/q8.png",
    options: [
      "Elle est multipliée par k² = 4",
      "Elle est multipliée par k = 2",
      "Elle reste identique",
      "Elle est multipliée par 2k = 4 uniquement en apparence"
    ],
    bonne_reponse: "Elle est multipliée par k² = 4",
    explication: "Lors d'un agrandissement (ou d'une réduction) de rapport k, les longueurs sont multipliées par k, les aires par k², et les volumes par k³."
  },

  {
    question: "Un solide de volume 20 cm³ subit une réduction de rapport k = 1/2. Quel est le volume du solide réduit ?",
    options: [
      "2,5 cm³",
      "10 cm³",
      "5 cm³",
      "40 cm³"
    ],
    bonne_reponse: "2,5 cm³",
    explication: "Les volumes sont multipliés par k³ = (1/2)³ = 1/8, donc le nouveau volume est 20 × 1/8 = 2,5 cm³."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
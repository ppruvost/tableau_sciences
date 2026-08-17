/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"Dans un triangle rectangle, comment appelle-t-on le côté opposé à l'angle droit ?",
options:["L'hypoténuse","Le côté adjacent","Le côté opposé","La médiane"],
bonne_reponse:"L'hypoténuse",
explication:"L'hypoténuse est toujours le plus grand côté, opposé à l'angle droit."
},

{
question:"D'après le théorème de Pythagore, quelle est la longueur de l'hypoténuse du triangle ci-dessous ?",
graphique:"triangle_pythagore.png",
options:["5 cm","7 cm","6 cm","4,5 cm"],
bonne_reponse:"5 cm",
explication:"3² + 4² = 9 + 16 = 25, donc l'hypoténuse = √25 = 5 cm."
},

{
question:"Vrai ou Faux : le théorème de Pythagore ne s'applique que dans un triangle rectangle.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est une propriété spécifique aux triangles rectangles."
},

{
question:"Un triangle rectangle a des côtés de l'angle droit mesurant 6 cm et 8 cm. Quelle est la longueur de l'hypoténuse ?",
options:["10 cm","14 cm","12 cm","9 cm"],
bonne_reponse:"10 cm",
explication:"6² + 8² = 36 + 64 = 100, donc l'hypoténuse = √100 = 10 cm."
},

{
question:"Dans la configuration ci-dessous, (MN) est parallèle à (BC). Sachant que SB = 5 cm, SM = 2 cm et SC = 4 cm, quelle est la longueur SN ?",
graphique:"thales_config.png",
options:["1,6 cm","2 cm","2,5 cm","3,2 cm"],
bonne_reponse:"1,6 cm",
explication:"D'après Thalès : SM/SB = SN/SC, donc SN = SC × SM/SB = 4 × 2/5 = 1,6 cm."
},

{
question:"Vrai ou Faux : dans la configuration de Thalès, les rapports de longueurs sur les deux droites sécantes sont égaux.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la propriété fondamentale du théorème de Thalès."
},

{
question:"Un triangle a pour côtés 5 cm, 12 cm et 13 cm. Est-il rectangle ?",
options:["Oui","Non"],
bonne_reponse:"Oui",
explication:"5² + 12² = 25 + 144 = 169 = 13², la réciproque de Pythagore s'applique."
},

{
question:"Dans une configuration de Thalès, SM/SB = 3/5. Sachant que SC = 10 cm, quelle est la longueur SN ?",
options:["6 cm","5 cm","8 cm","3 cm"],
bonne_reponse:"6 cm",
explication:"SN = SC × SM/SB = 10 × 3/5 = 6 cm."
},

{
question:"Un triangle a pour côtés 4 cm, 6 cm et 8 cm. Est-il rectangle ?",
options:["Non","Oui"],
bonne_reponse:"Non",
explication:"4² + 6² = 16 + 36 = 52, alors que 8² = 64. Les deux ne sont pas égaux : le triangle n'est pas rectangle."
},

{
question:"Une échelle de 5 m est posée contre un mur. Son pied est à 3 m du mur. À quelle hauteur touche-t-elle le mur ?",
options:["4 m","3,5 m","4,5 m","2 m"],
bonne_reponse:"4 m",
explication:"D'après Pythagore : hauteur² = 5² − 3² = 25 − 9 = 16, donc hauteur = √16 = 4 m."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"On lance un dé à 6 faces, comme celui ci-dessous. Quelle est la probabilité d'obtenir un 4 ?",
graphique:"de_6faces.png",
options:["1/6","1/4","1/2","4/6"],
bonne_reponse:"1/6",
explication:"Il y a 6 issues possibles équiprobables, une seule correspond au 4."
},

{
question:"On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?",
options:["1/2","1/3","1/6","2/6"],
bonne_reponse:"1/2",
explication:"3 issues favorables (2, 4, 6) sur 6 issues possibles : 3/6 = 1/2."
},

{
question:"Vrai ou Faux : la somme des probabilités de toutes les issues d'une expérience aléatoire vaut toujours 1.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est une propriété fondamentale des probabilités."
},

{
question:"Dans l'urne ci-dessous, on tire une boule au hasard. Quelle est la probabilité de tirer une boule rouge ?",
graphique:"urne_boules.png",
options:["1/2","1/3","1/6","2/3"],
bonne_reponse:"1/2",
explication:"3 boules rouges sur 6 boules au total : 3/6 = 1/2."
},

{
question:"Dans l'urne ci-dessous, quelle est la probabilité de tirer une boule verte ?",
graphique:"urne_boules.png",
options:["1/6","1/3","1/2","0"],
bonne_reponse:"1/6",
explication:"1 boule verte sur 6 boules au total : 1/6."
},

{
question:"On tire une carte dans un jeu de 32 cartes. Quelle est la probabilité de tirer un roi ?",
options:["4/32","1/32","8/32","1/4"],
bonne_reponse:"4/32",
explication:"Il y a 4 rois dans un jeu de 32 cartes : 4/32 = 1/8."
},

{
question:"Une probabilité peut-elle valoir 1,3 ?",
options:["Non","Oui"],
bonne_reponse:"Non",
explication:"Une probabilité est toujours comprise entre 0 et 1."
},

{
question:"On lance une pièce de monnaie équilibrée. Quelle est la probabilité d'obtenir « pile » ?",
options:["1/2","1/4","1","0"],
bonne_reponse:"1/2",
explication:"Il y a 2 issues équiprobables (pile ou face) : la probabilité de chacune est 1/2."
},

{
question:"Vrai ou Faux : un événement impossible a une probabilité de 0.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Par définition, la probabilité d'un événement impossible est nulle."
},

{
question:"On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre strictement supérieur à 4 ?",
options:["1/3","1/2","2/3","1/6"],
bonne_reponse:"1/3",
explication:"2 issues favorables (5 et 6) sur 6 : 2/6 = 1/3."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

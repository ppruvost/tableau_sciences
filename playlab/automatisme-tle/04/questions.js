/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le diagramme ci-dessous, quelle est la probabilité P(A∩B) ?",
graphique:"intersection_deux_evenements.png",
options:["0,15","0,95","0,8","0,05"],
bonne_reponse:"0,15",
explication:"P(A∩B) = P(A) + P(B) − P(A∪B) = 0,55 + 0,4 − 0,8 = 0,15."
},

{
question:"Que représente l'événement A∩B ?",
options:["A et B se réalisent tous les deux","A ou B se réalise","Ni A ni B ne se réalise","Seulement A se réalise"],
bonne_reponse:"A et B se réalisent tous les deux",
explication:"L'intersection A∩B correspond à la réalisation simultanée de A et de B."
},

{
question:"Sachant P(A) = 0,6, P(B) = 0,5 et P(A∪B) = 0,9, quelle est P(A∩B) ?",
options:["0,2","0,1","1,1","0,4"],
bonne_reponse:"0,2",
explication:"P(A∩B) = 0,6 + 0,5 − 0,9 = 0,2."
},

{
question:"Vrai ou Faux : si A et B sont incompatibles, alors P(A∩B) = 0.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la définition même des événements incompatibles."
},

{
question:"Dans une entreprise, P(salarié cadre) = 0,3, P(salarié à temps partiel) = 0,25, P(cadre ou temps partiel) = 0,5. Quelle est la probabilité qu'un salarié soit cadre ET à temps partiel ?",
options:["0,05","0,55","0,45","0,1"],
bonne_reponse:"0,05",
explication:"P(A∩B) = 0,3 + 0,25 − 0,5 = 0,05."
},

{
question:"P(A) = 0,4 et P(A∩B) = 0,4. Que peut-on en déduire ?",
options:["A est inclus dans B","B est inclus dans A","A et B sont incompatibles","P(B) = 0"],
bonne_reponse:"A est inclus dans B",
explication:"Si P(A∩B) = P(A), cela signifie que chaque fois que A se réalise, B se réalise aussi : A ⊂ B."
},

{
question:"Vrai ou Faux : P(A∩B) est toujours inférieure ou égale à P(A) et à P(B).",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"L'intersection ne peut pas contenir plus d'éléments que chacun des deux ensembles pris séparément."
},

{
question:"P(A) = 0,7, P(B) = 0,6, A et B indépendants. Quelle est P(A∩B) ?",
options:["0,42","1,3","0,1","0,35"],
bonne_reponse:"0,42",
explication:"Pour des événements indépendants, P(A∩B) = P(A) × P(B) = 0,7 × 0,6 = 0,42."
},

{
question:"Vrai ou Faux : deux événements incompatibles peuvent avoir une intersection non vide.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"Par définition, des événements incompatibles ont une intersection vide (probabilité nulle)."
},

{
question:"P(A) = 0,25, P(B) = 0,25, P(A∪B) = 0,45. Quelle est P(A∩B) ?",
options:["0,05","0,5","0,2","0,0625"],
bonne_reponse:"0,05",
explication:"P(A∩B) = 0,25 + 0,25 − 0,45 = 0,05."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

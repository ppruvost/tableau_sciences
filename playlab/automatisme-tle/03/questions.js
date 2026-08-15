/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le diagramme ci-dessous, quelle est la probabilité P(A ∪ B) ?",
graphique:"union_deux_evenements.png",
options:["0,65","0,75","0,85","0,4"],
bonne_reponse:"0,65",
explication:"P(A∪B) = P(A) + P(B) − P(A∩B) = 0,4 + 0,35 − 0,1 = 0,65."
},

{
question:"Quelle est la formule générale de la probabilité de la réunion de deux événements A et B ?",
options:["P(A) + P(B) − P(A∩B)","P(A) + P(B)","P(A) × P(B)","P(A) − P(B)"],
bonne_reponse:"P(A) + P(B) − P(A∩B)",
explication:"On soustrait P(A∩B) pour ne pas compter deux fois la partie commune."
},

{
question:"Sachant P(A) = 0,5, P(B) = 0,3 et P(A∩B) = 0,15, quelle est P(A∪B) ?",
options:["0,65","0,8","0,95","0,45"],
bonne_reponse:"0,65",
explication:"P(A∪B) = 0,5 + 0,3 − 0,15 = 0,65."
},

{
question:"Vrai ou Faux : si A et B sont incompatibles, la formule P(A∪B) = P(A) + P(B) − P(A∩B) reste valable.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la formule générale ; pour des événements incompatibles, P(A∩B) = 0, donc elle se simplifie en P(A)+P(B)."
},

{
question:"P(A) = 0,6, P(B) = 0,4, P(A∪B) = 0,8. Quelle est P(A∩B) ?",
options:["0,2","0,4","1,0","0,8"],
bonne_reponse:"0,2",
explication:"P(A∩B) = P(A) + P(B) − P(A∪B) = 0,6 + 0,4 − 0,8 = 0,2."
},

{
question:"Dans un atelier, P(pièce mal usinée) = 0,08, P(pièce mal peinte) = 0,05, P(les deux défauts) = 0,02. Quelle est la probabilité qu'une pièce ait au moins un défaut ?",
options:["0,11","0,13","0,15","0,03"],
bonne_reponse:"0,11",
explication:"P(au moins un défaut) = 0,08 + 0,05 − 0,02 = 0,11."
},

{
question:"Vrai ou Faux : P(A∪B) est toujours supérieure ou égale à P(A) et à P(B).",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"L'union contient au moins autant d'éléments que chacun des deux événements pris séparément."
},

{
question:"P(A) = 0,7 et P(A∪B) = 0,9 avec A et B incompatibles. Quelle est P(B) ?",
options:["0,2","0,9","1,6","0,7"],
bonne_reponse:"0,2",
explication:"Comme A et B sont incompatibles, P(A∪B)=P(A)+P(B), donc P(B) = 0,9 − 0,7 = 0,2."
},

{
question:"Vrai ou Faux : P(A∪B) peut être strictement supérieure à 1.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"Une probabilité, y compris celle d'une union, est toujours comprise entre 0 et 1."
},

{
question:"P(A) = 0,45, P(B) = 0,3, A et B incompatibles. Quelle est P(A∪B) ?",
options:["0,75","0,15","0,135","1"],
bonne_reponse:"0,75",
explication:"P(A∪B) = 0,45 + 0,3 = 0,75 (les deux événements sont incompatibles, donc P(A∩B) = 0)."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

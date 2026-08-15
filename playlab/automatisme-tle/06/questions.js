/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après l'arbre ci-dessous, quelle est la probabilité P(A∩B) ?",
graphique:"arbre_probabilites_cond.png",
options:["0,42","0,7","0,6","0,12"],
bonne_reponse:"0,42",
explication:"P(A∩B) = P(A) × P_A(B) = 0,6 × 0,7 = 0,42 (on multiplie le long des branches)."
},

{
question:"D'après l'arbre, quelle est la probabilité P(Ā∩B) ?",
graphique:"arbre_probabilites_cond.png",
options:["0,08","0,2","0,4","0,32"],
bonne_reponse:"0,08",
explication:"P(Ā∩B) = P(Ā) × P_Ā(B) = 0,4 × 0,2 = 0,08."
},

{
question:"Que note-t-on P_A(B) ?",
options:["La probabilité de B sachant A","La probabilité de A sachant B","La probabilité de A et B","La probabilité de A ou B"],
bonne_reponse:"La probabilité de B sachant A",
explication:"P_A(B) se lit « probabilité de B sachant A » : c'est une probabilité conditionnelle."
},

{
question:"D'après l'arbre, quelle est la probabilité P(B) (totale) ?",
graphique:"arbre_probabilites_cond.png",
options:["0,5","0,42","0,08","0,9"],
bonne_reponse:"0,5",
explication:"P(B) = P(A∩B) + P(Ā∩B) = 0,42 + 0,08 = 0,5 (formule des probabilités totales)."
},

{
question:"Vrai ou Faux : sur un arbre pondéré, la somme des probabilités des branches issues d'un même nœud vaut 1.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est une propriété fondamentale des arbres de probabilités."
},

{
question:"Quelle est la formule de la probabilité conditionnelle P_A(B) en fonction de P(A∩B) et P(A) ?",
options:["P_A(B) = P(A∩B) / P(A)","P_A(B) = P(A) / P(A∩B)","P_A(B) = P(A∩B) × P(A)","P_A(B) = P(A) + P(B)"],
bonne_reponse:"P_A(B) = P(A∩B) / P(A)",
explication:"C'est la définition de la probabilité conditionnelle (avec P(A) ≠ 0)."
},

{
question:"Sachant P(A∩B) = 0,18 et P(A) = 0,3, quelle est P_A(B) ?",
options:["0,6","0,054","1,67","0,3"],
bonne_reponse:"0,6",
explication:"P_A(B) = P(A∩B) / P(A) = 0,18 / 0,3 = 0,6."
},

{
question:"Dans un contrôle qualité, P(pièce provenant de la machine 1) = 0,6 et P_(machine 1)(défaut) = 0,05. Quelle est la probabilité qu'une pièce provienne de la machine 1 ET soit défectueuse ?",
options:["0,03","0,05","0,65","0,006"],
bonne_reponse:"0,03",
explication:"On multiplie le long des branches : 0,6 × 0,05 = 0,03."
},

{
question:"Vrai ou Faux : P_A(B) et P_B(A) désignent toujours la même valeur.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"En général P_A(B) ≠ P_B(A), sauf cas particulier ; ce sont deux probabilités conditionnelles différentes."
},

{
question:"D'après l'arbre, quelle est la probabilité P(A∩B̄) ?",
graphique:"arbre_probabilites_cond.png",
options:["0,18","0,3","0,42","0,08"],
bonne_reponse:"0,18",
explication:"P(A∩B̄) = P(A) × P_A(B̄) = 0,6 × 0,3 = 0,18."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

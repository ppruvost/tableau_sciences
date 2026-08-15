/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après l'arbre ci-dessous, quelle est la probabilité P(A∩B) ?",
graphique:"arbre_independance.png",
options:["0,1","0,25","0,4","0,15"],
bonne_reponse:"0,1",
explication:"P(A∩B) = P(A) × P_A(B) = 0,4 × 0,25 = 0,1 (on multiplie le long des branches)."
},

{
question:"D'après l'arbre, que remarque-t-on en comparant P_A(B) et P_Ā(B) ?",
graphique:"arbre_independance.png",
options:["Elles sont égales (toutes deux 0,25)","Elles sont opposées","Leur somme vaut 1","Elles sont incompatibles"],
bonne_reponse:"Elles sont égales (toutes deux 0,25)",
explication:"P_A(B) = 0,25 et P_Ā(B) = 0,25 : la probabilité de B ne dépend pas de la réalisation de A."
},

{
question:"D'après l'arbre, en utilisant la formule des probabilités totales, quelle est la probabilité P(B) ?",
graphique:"arbre_independance.png",
options:["0,25","0,1","0,4","0,5"],
bonne_reponse:"0,25",
explication:"P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B) = 0,4×0,25 + 0,6×0,25 = 0,1 + 0,15 = 0,25."
},

{
question:"Quelle est la définition mathématique de l'indépendance de deux événements A et B ?",
options:["P(A∩B) = P(A) × P(B)","P(A∩B) = P(A) + P(B)","P(A∩B) = 0","P_A(B) = P(A)"],
bonne_reponse:"P(A∩B) = P(A) × P(B)",
explication:"C'est le critère qui permet de démontrer si deux événements sont indépendants."
},

{
question:"D'après l'arbre, A et B sont-ils indépendants ?",
graphique:"arbre_independance.png",
options:["Oui, car P(A)×P(B) = 0,4×0,25 = 0,1 = P(A∩B)","Non, car P(A) ≠ P(B)","Oui, car A et B sont incompatibles","Impossible à savoir sans calcul supplémentaire"],
bonne_reponse:"Oui, car P(A)×P(B) = 0,4×0,25 = 0,1 = P(A∩B)",
explication:"On vérifie le critère d'indépendance : P(A)×P(B) = 0,4×0,25 = 0,1, qui est bien égal à P(A∩B) calculé précédemment."
},

{
question:"Vrai ou Faux : pour montrer que deux événements sont indépendants à l'aide d'un arbre pondéré, il suffit de vérifier que P_A(B) = P_Ā(B).",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Si la probabilité de B est la même, que A soit réalisé ou non, alors B ne dépend pas de A : les événements sont indépendants."
},

{
question:"P(A) = 0,3, P_A(B) = 0,5 et P_Ā(B) = 0,2. Les événements A et B sont-ils indépendants ?",
options:["Non, car P_A(B) ≠ P_Ā(B)","Oui, car P(A) < P(B)","Oui, car les deux valeurs sont positives","Impossible à dire"],
bonne_reponse:"Non, car P_A(B) ≠ P_Ā(B)",
explication:"La probabilité de B dépend de la réalisation de A (0,5 contre 0,2) : les événements ne sont pas indépendants."
},

{
question:"Sur une chaîne de production, deux machines M1 et M2 fonctionnent indépendamment. P(panne M1) = 0,05 et P(panne M2) = 0,08. Quelle est la probabilité que les deux tombent en panne en même temps ?",
options:["0,004","0,13","0,0004","0,4"],
bonne_reponse:"0,004",
explication:"Comme les pannes sont indépendantes, P(panne M1 ∩ panne M2) = 0,05 × 0,08 = 0,004."
},

{
question:"Vrai ou Faux : deux événements incompatibles (qui ne peuvent jamais se produire ensemble) et de probabilités non nulles sont toujours indépendants.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"Si A et B sont incompatibles, P(A∩B) = 0. Or P(A)×P(B) ≠ 0 en général : le critère d'indépendance n'est donc pas vérifié."
},

{
question:"Dans un arbre pondéré à deux étapes, quelle formule permet de calculer la probabilité totale d'un événement B situé en 2ᵉ étape ?",
options:["P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B)","P(B) = P(A) + P(Ā)","P(B) = P_A(B) × P_Ā(B)","P(B) = P(A) − P_A(B)"],
bonne_reponse:"P(B) = P(A)×P_A(B) + P(Ā)×P_Ā(B)",
explication:"C'est la formule des probabilités totales : on additionne les contributions de tous les chemins menant à B."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

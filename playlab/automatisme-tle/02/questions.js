/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le diagramme ci-dessous, A et B sont incompatibles. Quelle est la probabilité de P(A ∪ B) ?",
graphique:"evenements_incompatibles.png",
options:["0,75","0,3","0,45","0,15"],
bonne_reponse:"0,75",
explication:"A et B sont incompatibles (disjoints), donc P(A∪B) = P(A) + P(B) = 0,3 + 0,45 = 0,75."
},

{
question:"Vrai ou Faux : deux événements sont incompatibles s'ils ne peuvent pas se réaliser en même temps.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la définition des événements incompatibles : leur intersection est vide."
},

{
question:"Pour deux événements incompatibles A et B, quelle est la formule de P(A ∪ B) ?",
options:["P(A) + P(B)","P(A) × P(B)","P(A) + P(B) − P(A∩B)","P(A) − P(B)"],
bonne_reponse:"P(A) + P(B)",
explication:"Lorsque A et B sont incompatibles, P(A∩B) = 0, donc P(A∪B) = P(A) + P(B)."
},

{
question:"Sachant que P(A) = 0,2 et P(B) = 0,55, avec A et B incompatibles, quelle est P(A ∪ B) ?",
options:["0,75","0,35","0,11","1,75"],
bonne_reponse:"0,75",
explication:"P(A∪B) = 0,2 + 0,55 = 0,75."
},

{
question:"On lance un dé. Soit A l'événement « obtenir un 1 » et B l'événement « obtenir un 6 ». A et B sont-ils incompatibles ?",
options:["Oui, on ne peut pas obtenir 1 et 6 en même temps","Non, ils peuvent se réaliser ensemble","Impossible à savoir","Oui, car ce sont les mêmes"],
bonne_reponse:"Oui, on ne peut pas obtenir 1 et 6 en même temps",
explication:"Un seul chiffre sort à chaque lancer : on ne peut pas obtenir 1 et 6 simultanément."
},

{
question:"Vrai ou Faux : un événement A et son événement contraire Ā sont toujours incompatibles.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"A et Ā ne peuvent jamais se réaliser en même temps, par définition."
},

{
question:"P(A) = 0,4 et A, B incompatibles avec P(A∪B) = 0,9. Quelle est P(B) ?",
options:["0,5","0,4","1,3","0,9"],
bonne_reponse:"0,5",
explication:"P(B) = P(A∪B) − P(A) = 0,9 − 0,4 = 0,5."
},

{
question:"Dans une urne, on tire une boule. A : « boule rouge », B : « boule bleue », C : « boule verte », événements 2 à 2 incompatibles avec P(A)=0,3, P(B)=0,25, P(C)=0,45. Quelle est P(A∪B∪C) ?",
options:["1","0,55","0,7","0,75"],
bonne_reponse:"1",
explication:"0,3 + 0,25 + 0,45 = 1 (ces trois événements couvrent tout l'univers)."
},

{
question:"Vrai ou Faux : si P(A∩B) ≠ 0, alors A et B sont incompatibles.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"Si l'intersection n'est pas vide (probabilité non nulle), les événements peuvent se produire ensemble : ils ne sont pas incompatibles."
},

{
question:"P(A) = 0,15 et P(B) = 0,15, A et B incompatibles. Quelle est P(A∪B) ?",
options:["0,3","0,15","0,0225","0,45"],
bonne_reponse:"0,3",
explication:"P(A∪B) = 0,15 + 0,15 = 0,3."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

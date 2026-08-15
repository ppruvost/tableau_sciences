/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après la série ci-dessous, quelle est la moyenne (arrondie au dixième) ?",
graphique:"serie_notes.png",
options:["12,3","12","10","14"],
bonne_reponse:"12,3",
explication:"Somme = 8+10+12+12+14+18 = 74. Moyenne = 74 ÷ 6 ≈ 12,3."
},

{
question:"D'après la série ci-dessous, quelle est la médiane ?",
graphique:"serie_notes.png",
options:["12","10","12,3","14"],
bonne_reponse:"12",
explication:"La série triée a 6 valeurs. La médiane est la moyenne des 2 valeurs centrales : (12+12)/2 = 12."
},

{
question:"D'après la série ci-dessous, quelle est l'étendue ?",
graphique:"serie_notes.png",
options:["10","6","18","8"],
bonne_reponse:"10",
explication:"Étendue = valeur maximale − valeur minimale = 18 − 8 = 10."
},

{
question:"Vrai ou Faux : la médiane d'une série partage celle-ci en deux groupes de même effectif.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la définition de la médiane : autant de valeurs en dessous qu'au-dessus."
},

{
question:"Une série de 7 valeurs triées : quelle est la position de la médiane ?",
options:["La 4ᵉ valeur","La 3ᵉ valeur","La moyenne des 3ᵉ et 4ᵉ valeurs","La dernière valeur"],
bonne_reponse:"La 4ᵉ valeur",
explication:"Avec un effectif impair (7), la médiane est la valeur centrale, ici la 4ᵉ (3 valeurs avant, 3 après)."
},

{
question:"Comment calcule-t-on la moyenne d'une série de valeurs ?",
options:["On divise la somme des valeurs par leur nombre","On prend la valeur du milieu","On soustrait le minimum du maximum","On multiplie toutes les valeurs entre elles"],
bonne_reponse:"On divise la somme des valeurs par leur nombre",
explication:"C'est la définition de la moyenne arithmétique."
},

{
question:"Une série a pour minimum 4 et pour maximum 19. Quelle est son étendue ?",
options:["15","23","4","19"],
bonne_reponse:"15",
explication:"Étendue = 19 − 4 = 15."
},

{
question:"Vrai ou Faux : la moyenne et la médiane d'une série sont toujours égales.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"Ces deux indicateurs peuvent être différents, surtout si la série contient des valeurs extrêmes."
},

{
question:"Sur une calculatrice, quelle touche ou mode permet généralement de calculer directement la moyenne d'une série statistique ?",
options:["Le mode statistique (STAT)","Le mode graphique","La touche racine carrée","La touche pourcentage"],
bonne_reponse:"Le mode statistique (STAT)",
explication:"Les calculatrices disposent d'un mode statistique dédié au calcul de moyenne, écart-type, etc."
},

{
question:"Une série de notes a une étendue très grande. Que peut-on en déduire ?",
options:["Les notes sont très dispersées","Les notes sont toutes identiques","La moyenne est forcément haute","La médiane est forcément fausse"],
bonne_reponse:"Les notes sont très dispersées",
explication:"Une grande étendue traduit un grand écart entre les valeurs extrêmes de la série, donc une forte dispersion."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

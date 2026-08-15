/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après la droite graduée, quel est l'arrondi à l'unité du nombre placé ?",
graphique:"droite_graduee.png",
options:["7","8","7,3","7,5"],
bonne_reponse:"7",
explication:"7,3 est plus proche de 7 que de 8, donc son arrondi à l'unité est 7."
},

{
question:"Arrondir 12,47 à l'unité.",
options:["12","13","12,5","12,4"],
bonne_reponse:"12",
explication:"Le chiffre des dixièmes (4) est inférieur à 5, on arrondit à l'inférieur : 12."
},

{
question:"Arrondir 3,68 au dixième.",
options:["3,7","3,6","3,68","4"],
bonne_reponse:"3,7",
explication:"Le chiffre des centièmes (8) est supérieur ou égal à 5, on arrondit au supérieur : 3,7."
},

{
question:"La calculatrice affiche le résultat ci-dessous. Quel est l'arrondi au centième ?",
graphique:"calculatrice.png",
options:["4,67","4,66","4,7","4,666"],
bonne_reponse:"4,67",
explication:"4,6666667 arrondi au centième : le chiffre des millièmes (6) fait arrondir au supérieur, soit 4,67."
},

{
question:"Vrai ou Faux : arrondir un nombre donne toujours une valeur approchée, pas la valeur exacte.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Un arrondi est par définition une approximation."
},

{
question:"Arrondir 249 à la dizaine.",
options:["250","240","249","200"],
bonne_reponse:"250",
explication:"Le chiffre des unités (9) fait arrondir au supérieur : 250."
},

{
question:"Une pièce mesure 2,346 m. Quelle est sa longueur arrondie au centimètre ?",
options:["2,35 m","2,34 m","2,3 m","2,346 m"],
bonne_reponse:"2,35 m",
explication:"2,346 m = 2 m 34,6 cm. Le chiffre des millimètres (6) fait arrondir au centimètre supérieur : 2,35 m."
},

{
question:"Vrai ou Faux : la valeur approchée par défaut d'un nombre est toujours inférieure ou égale à ce nombre.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Par définition, une approximation « par défaut » ne dépasse jamais la valeur exacte."
},

{
question:"π ≈ 3,14159... Quel est l'arrondi de π au centième ?",
options:["3,14","3,15","3,1","3,142"],
bonne_reponse:"3,14",
explication:"Le chiffre des millièmes (1) est inférieur à 5, on garde 3,14."
},

{
question:"Un budget de 458,73 € doit être arrondi à l'euro près pour un devis. Quel est le résultat ?",
options:["459 €","458 €","460 €","458,70 €"],
bonne_reponse:"459 €",
explication:"Le chiffre des dixièmes (7) fait arrondir au supérieur : 459 €."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

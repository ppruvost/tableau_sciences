/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après les formules ci-dessous, quelle est la dérivée de f(x) = 7 ?",
graphique:"formules_derivation.png",
options:["f '(x) = 0","f '(x) = 7","f '(x) = 7x","f '(x) = 1"],
bonne_reponse:"f '(x) = 0",
explication:"La dérivée d'une constante est toujours nulle."
},

{
question:"D'après les formules ci-dessus, quelle est la dérivée de f(x) = 5x ?",
graphique:"formules_derivation.png",
options:["f '(x) = 5","f '(x) = 5x","f '(x) = 0","f '(x) = x"],
bonne_reponse:"f '(x) = 5",
explication:"La dérivée de ax est a, donc ici 5."
},

{
question:"D'après les formules ci-dessus, quelle est la dérivée de f(x) = 3x² ?",
graphique:"formules_derivation.png",
options:["f '(x) = 6x","f '(x) = 3x","f '(x) = 6","f '(x) = 9x"],
bonne_reponse:"f '(x) = 6x",
explication:"La dérivée de ax² est 2ax, donc ici 2×3×x = 6x."
},

{
question:"Quelle est la dérivée de f(x) = x² + 4x + 1 ?",
options:["f '(x) = 2x + 4","f '(x) = 2x + 1","f '(x) = x + 4","f '(x) = 2x + 4x"],
bonne_reponse:"f '(x) = 2x + 4",
explication:"On dérive terme à terme : (x²)'=2x, (4x)'=4, (1)'=0. Donc f '(x) = 2x + 4."
},

{
question:"Quelle est la dérivée de f(x) = -2x² + 3 ?",
options:["f '(x) = -4x","f '(x) = -4x + 3","f '(x) = -2x","f '(x) = 4x"],
bonne_reponse:"f '(x) = -4x",
explication:"(-2x²)' = -4x et (3)' = 0. Donc f '(x) = -4x."
},

{
question:"Vrai ou Faux : la dérivée d'une fonction affine f(x) = ax + b est constante et égale à a.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"f '(x) = a (la dérivée de ax est a, celle de b est 0)."
},

{
question:"Quelle est la dérivée de f(x) = x² − 6x + 9 ?",
options:["f '(x) = 2x − 6","f '(x) = 2x + 6","f '(x) = x − 6","f '(x) = 2x − 9"],
bonne_reponse:"f '(x) = 2x − 6",
explication:"(x²)'=2x, (-6x)'=-6, (9)'=0. Donc f '(x) = 2x − 6."
},

{
question:"Pour quelle valeur de x la dérivée de f(x) = x² − 6x + 9 s'annule-t-elle ?",
options:["x = 3","x = 6","x = 0","x = -3"],
bonne_reponse:"x = 3",
explication:"On résout 2x − 6 = 0, donc x = 3 (c'est l'abscisse du sommet de la parabole)."
},

{
question:"Vrai ou Faux : le signe de la dérivée f '(x) permet de déterminer le sens de variation de f.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Si f '(x) > 0, f est croissante ; si f '(x) < 0, f est décroissante."
},

{
question:"Quelle est la dérivée de f(x) = 4x² + 2x − 5 ?",
options:["f '(x) = 8x + 2","f '(x) = 8x − 5","f '(x) = 4x + 2","f '(x) = 8x + 2x"],
bonne_reponse:"f '(x) = 8x + 2",
explication:"(4x²)'=8x, (2x)'=2, (-5)'=0. Donc f '(x) = 8x + 2."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

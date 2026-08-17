/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après la courbe ci-dessous, combien de solutions possède l'équation f(x) = 0 ?",
graphique:"parabole_0solution.png",
options:["0","1","2","Une infinité"],
bonne_reponse:"0",
explication:"La courbe ne touche jamais l'axe des abscisses : l'équation f(x)=0 n'a aucune solution."
},

{
question:"D'après la courbe ci-dessous, combien de solutions possède l'équation f(x) = 0 ?",
graphique:"parabole_1solution.png",
options:["1","0","2","Une infinité"],
bonne_reponse:"1",
explication:"La courbe touche l'axe des abscisses en un seul point (elle y est tangente) : une seule solution."
},

{
question:"D'après la courbe ci-dessous, combien de solutions possède l'équation f(x) = 0 ?",
graphique:"parabole_2solutions.png",
options:["2","0","1","Une infinité"],
bonne_reponse:"2",
explication:"La courbe coupe l'axe des abscisses en deux points distincts : deux solutions."
},

{
question:"Pour une fonction polynôme de degré 2, quel est le nombre maximal de solutions de l'équation f(x)=0 ?",
options:["2","1","3","Une infinité"],
bonne_reponse:"2",
explication:"Un polynôme de degré 2 admet au maximum 2 racines réelles."
},

{
question:"Vrai ou Faux : si le discriminant Δ d'un polynôme du 2nd degré est strictement négatif, l'équation f(x)=0 n'a pas de solution réelle.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Un discriminant négatif signifie que la courbe ne coupe jamais l'axe des abscisses."
},

{
question:"Vrai ou Faux : si Δ = 0, l'équation f(x)=0 admet exactement une solution (racine double).",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Un discriminant nul correspond à une courbe tangente à l'axe des abscisses : une seule racine, dite double."
},

{
question:"Vrai ou Faux : si Δ > 0, l'équation f(x)=0 admet deux solutions distinctes.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Un discriminant strictement positif correspond à deux points d'intersection avec l'axe des abscisses."
},

{
question:"Sans calculer le discriminant, comment peut-on estimer le nombre de solutions de f(x)=0 pour une fonction du second degré ?",
options:["En observant combien de fois la courbe coupe l'axe des abscisses","En regardant la couleur de la courbe","En comptant les graduations de l'axe","En mesurant la largeur du repère"],
bonne_reponse:"En observant combien de fois la courbe coupe l'axe des abscisses",
explication:"C'est la méthode graphique : chaque point d'intersection correspond à une solution."
},

{
question:"Une parabole tournée vers le bas (a < 0) et dont le sommet est au-dessus de l'axe des abscisses. Combien de solutions a f(x) = 0 ?",
options:["2","0","1","Impossible à dire"],
bonne_reponse:"2",
explication:"Le sommet étant au-dessus de l'axe et la parabole tournée vers le bas, elle redescend forcément de chaque côté et coupe l'axe deux fois."
},

{
question:"Une parabole tournée vers le haut (a > 0) et dont le sommet est strictement au-dessus de l'axe des abscisses. Combien de solutions a f(x) = 0 ?",
options:["0","1","2","Impossible à dire"],
bonne_reponse:"0",
explication:"Toute la courbe reste au-dessus de l'axe : elle ne le touche jamais."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

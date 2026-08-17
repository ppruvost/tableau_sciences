/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après les données ci-dessous, quelle est la formule du terme général de la suite ?",
graphique:"suite_arithmetique.png",
options:["uₙ = 5 + 3n","uₙ = 5 × 3n","uₙ = 3 + 5n","uₙ = 5n"],
bonne_reponse:"uₙ = 5 + 3n",
explication:"Pour une suite arithmétique, uₙ = u₀ + n × r = 5 + 3n."
},

{
question:"D'après les données ci-dessus (u₀ = 5, r = 3), quelle est la valeur de u₄ ?",
graphique:"suite_arithmetique.png",
options:["17","20","15","12"],
bonne_reponse:"17",
explication:"u₄ = 5 + 4 × 3 = 5 + 12 = 17."
},

{
question:"Vrai ou Faux : dans une suite arithmétique, on passe d'un terme au suivant en ajoutant toujours la même valeur (la raison).",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la définition d'une suite arithmétique."
},

{
question:"Une suite arithmétique a pour premier terme u₀ = 10 et raison r = -2. Quelle est la valeur de u₅ ?",
options:["0","20","-10","8"],
bonne_reponse:"0",
explication:"u₅ = 10 + 5 × (-2) = 10 − 10 = 0."
},

{
question:"Une suite arithmétique a pour premier terme u₁ = 7 et raison r = 4. Quelle est la formule du terme général uₙ (pour n ≥ 1) ?",
options:["uₙ = 7 + (n-1) × 4","uₙ = 7 + 4n","uₙ = 4 + 7n","uₙ = 7n"],
bonne_reponse:"uₙ = 7 + (n-1) × 4",
explication:"Quand le premier terme est u₁, la formule devient uₙ = u₁ + (n-1) × r."
},

{
question:"Une suite arithmétique a pour terme u₀ = 2 et raison r = 5. Quel est le rang n pour lequel uₙ = 47 ?",
options:["9","45","10","8"],
bonne_reponse:"9",
explication:"On résout 2 + 5n = 47, donc 5n = 45, donc n = 9."
},

{
question:"Vrai ou Faux : si la raison r d'une suite arithmétique est négative, la suite est décroissante.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Une raison négative signifie qu'on retranche à chaque étape, donc la suite décroît."
},

{
question:"Un salaire de départ est de 1 500 € et augmente chaque année de 40 € (suite arithmétique). Quel sera le salaire après 6 augmentations ?",
options:["1 740 €","1 940 €","1 700 €","1 500 €"],
bonne_reponse:"1 740 €",
explication:"u₆ = 1500 + 6 × 40 = 1500 + 240 = 1 740 €."
},

{
question:"Comment calcule-t-on la raison r d'une suite arithmétique à partir de deux termes consécutifs uₙ et uₙ₊₁ ?",
options:["r = uₙ₊₁ − uₙ","r = uₙ₊₁ + uₙ","r = uₙ₊₁ × uₙ","r = uₙ₊₁ / uₙ"],
bonne_reponse:"r = uₙ₊₁ − uₙ",
explication:"La raison est la différence constante entre deux termes consécutifs."
},

{
question:"Une suite a pour termes u₀ = 3, u₁ = 8, u₂ = 13. Quelle est sa raison ?",
options:["5","4","8","3"],
bonne_reponse:"5",
explication:"r = u₁ − u₀ = 8 − 3 = 5 (on vérifie : u₂ − u₁ = 13 − 8 = 5 aussi)."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

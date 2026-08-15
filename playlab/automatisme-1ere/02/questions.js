/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le tableau ci-dessous, combien d'élèves sont en filière Chaudronnerie ?",
graphique:"tableau_double_entree.png",
options:["23","17","5","18"],
bonne_reponse:"23",
explication:"5 filles + 18 garçons en chaudronnerie = 23 élèves."
},

{
question:"D'après le tableau, combien de filles y a-t-il au total ?",
graphique:"tableau_double_entree.png",
options:["17","21","5","12"],
bonne_reponse:"17",
explication:"5 (chaudronnerie) + 12 (confection) = 17 filles."
},

{
question:"D'après le tableau, quel est l'effectif total des élèves ?",
graphique:"tableau_double_entree.png",
options:["38","35","40","23"],
bonne_reponse:"38",
explication:"5 + 12 + 18 + 3 = 38 élèves."
},

{
question:"D'après l'arbre ci-dessous (tirage de 2 boules avec remise, Rouge ou Bleue), combien d'issues possibles y a-t-il au total ?",
graphique:"arbre_denombrement.png",
options:["4","2","6","8"],
bonne_reponse:"4",
explication:"Il y a 4 branches possibles : RR, RB, BR, BB."
},

{
question:"D'après l'arbre, combien d'issues comportent exactement une boule rouge ?",
graphique:"arbre_denombrement.png",
options:["2","1","3","4"],
bonne_reponse:"2",
explication:"RB et BR comportent exactement une boule rouge."
},

{
question:"Vrai ou Faux : un arbre de dénombrement permet de lister toutes les issues possibles d'une expérience à plusieurs étapes.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est l'utilité principale d'un arbre de dénombrement."
},

{
question:"On lance 2 fois une pièce de monnaie (Pile ou Face). Combien d'issues possibles y a-t-il ?",
options:["4","2","3","8"],
bonne_reponse:"4",
explication:"2 issues au premier lancer × 2 issues au second = 4 issues (PP, PF, FP, FF)."
},

{
question:"On choisit un menu avec 3 entrées possibles et 2 plats possibles. Combien de menus (entrée + plat) peut-on composer ?",
options:["6","5","3","2"],
bonne_reponse:"6",
explication:"3 × 2 = 6 combinaisons possibles."
},

{
question:"Vrai ou Faux : dans un tableau à double entrée, le total d'une ligne doit être égal à la somme des cases de cette ligne.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la propriété de base d'un tableau croisé d'effectifs."
},

{
question:"Une plaque d'immatriculation utilise 2 lettres suivies de 3 chiffres. Quelle méthode permet de dénombrer toutes les plaques possibles ?",
options:["Un arbre ou un principe multiplicatif","Une simple addition","Une moyenne","Un tableau à simple entrée"],
bonne_reponse:"Un arbre ou un principe multiplicatif",
explication:"Le dénombrement d'un tirage à plusieurs étapes se fait par un arbre ou en multipliant le nombre de choix à chaque étape."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le tableau ci-dessous, combien de candidats ont été admis ?",
graphique:"tableau_croise_reussite.png",
options:["77","50","100","23"],
bonne_reponse:"77",
explication:"42 filles admises + 35 garçons admis = 77 admis."
},

{
question:"D'après le tableau, quel est l'effectif total de candidats ?",
graphique:"tableau_croise_reussite.png",
options:["100","77","23","90"],
bonne_reponse:"100",
explication:"42 + 8 + 35 + 15 = 100 candidats au total."
},

{
question:"D'après le tableau, quelle est la fréquence de filles admises parmi l'ensemble des candidats ?",
graphique:"tableau_croise_reussite.png",
options:["0,42","0,5","0,77","0,08"],
bonne_reponse:"0,42",
explication:"42 filles admises sur 100 candidats au total : 42/100 = 0,42."
},

{
question:"D'après le tableau, quelle est la probabilité qu'un candidat pris au hasard soit une fille refusée ?",
graphique:"tableau_croise_reussite.png",
options:["0,08","0,15","0,5","0,42"],
bonne_reponse:"0,08",
explication:"8 filles refusées sur 100 candidats : 8/100 = 0,08."
},

{
question:"Vrai ou Faux : dans un tableau croisé d'effectifs, la somme de tous les effectifs des cases donne l'effectif total.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est une propriété fondamentale des tableaux croisés."
},

{
question:"D'après le tableau, combien de garçons ont participé au total ?",
graphique:"tableau_croise_reussite.png",
options:["50","42","35","15"],
bonne_reponse:"50",
explication:"35 admis + 15 refusés = 50 garçons."
},

{
question:"Vrai ou Faux : un diagramme en barres empilées permet de visualiser les données d'un tableau croisé.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Les barres empilées permettent de montrer la répartition de chaque catégorie selon plusieurs critères."
},

{
question:"D'après le tableau, quel pourcentage de filles ont été admises PARMI les filles ?",
graphique:"tableau_croise_reussite.png",
options:["84 %","42 %","50 %","8 %"],
bonne_reponse:"84 %",
explication:"42 filles admises sur 50 filles au total (42+8) : 42/50 = 0,84 = 84 %."
},

{
question:"D'après le tableau, quel pourcentage de garçons ont été admis PARMI les garçons ?",
graphique:"tableau_croise_reussite.png",
options:["70 %","35 %","77 %","50 %"],
bonne_reponse:"70 %",
explication:"35 garçons admis sur 50 garçons au total : 35/50 = 0,7 = 70 %."
},

{
question:"Pour comparer visuellement rapidement des proportions issues d'un tableau croisé, quel diagramme est le plus adapté ?",
options:["Un diagramme en secteurs ou en barres","Un nuage de points isolé","Une droite graduée","Un arbre de dénombrement uniquement"],
bonne_reponse:"Un diagramme en secteurs ou en barres",
explication:"Ces diagrammes permettent de visualiser rapidement des répartitions et proportions."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

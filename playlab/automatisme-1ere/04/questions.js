/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le graphique ci-dessous, quelle température a été relevée mardi ?",
graphique:"temperatures_semaine.png",
options:["17 °C","14 °C","20 °C","13 °C"],
bonne_reponse:"17 °C",
explication:"La barre correspondant à « Mar » atteint 17 sur l'axe des températures."
},

{
question:"D'après le graphique, quel jour a connu la température la plus élevée ?",
graphique:"temperatures_semaine.png",
options:["Jeudi","Mardi","Lundi","Vendredi"],
bonne_reponse:"Jeudi",
explication:"La barre du jeudi est la plus haute, à 20 °C."
},

{
question:"D'après le tableau ci-dessous, quelle température a été relevée mercredi ?",
graphique:"tableau_temperatures.png",
options:["13","17","14","20"],
bonne_reponse:"13",
explication:"On lit directement dans la colonne « Mer » : 13."
},

{
question:"Le graphique et le tableau ci-dessus (températures de la semaine) représentent-ils les mêmes données ?",
graphique:"tableau_temperatures.png",
options:["Oui, les valeurs correspondent jour par jour","Non, elles sont différentes","Impossible à savoir","Seul lundi correspond"],
bonne_reponse:"Oui, les valeurs correspondent jour par jour",
explication:"Chaque jour (Lun, Mar, Mer, Jeu, Ven) a la même valeur dans le tableau et dans le diagramme en bâtons."
},

{
question:"Vrai ou Faux : un même jeu de données peut être représenté de plusieurs façons différentes (tableau, diagramme en bâtons, courbe...).",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Le choix de la représentation dépend de ce que l'on veut mettre en évidence, mais les données restent identiques."
},

{
question:"Pour associer correctement un graphique à un tableau de données, quelle est la première chose à vérifier ?",
options:["Que les valeurs se correspondent pour chaque catégorie","Que les couleurs sont identiques","Que le graphique est plus grand que le tableau","Que le tableau est en haut de la page"],
bonne_reponse:"Que les valeurs se correspondent pour chaque catégorie",
explication:"L'essentiel est la correspondance des valeurs numériques, pas la présentation."
},

{
question:"Un diagramme en bâtons affiche une barre à 20 pour « Jeu ». Un tableau affiche 18 pour « Jeu ». Ces deux représentations peuvent-elles correspondre au même jeu de données ?",
options:["Non, les valeurs sont différentes","Oui, ce sont les mêmes données","Impossible à dire","Oui si les autres jours sont identiques"],
bonne_reponse:"Non, les valeurs sont différentes",
explication:"Si une seule valeur diffère, ce ne sont pas exactement les mêmes données."
},

{
question:"D'après le graphique des températures, quelle est l'étendue des températures relevées (max − min) ?",
graphique:"temperatures_semaine.png",
options:["7 °C","6 °C","20 °C","13 °C"],
bonne_reponse:"7 °C",
explication:"Maximum 20 °C (jeudi) − minimum 13 °C (mercredi) = 7 °C."
},

{
question:"Vrai ou Faux : pour lire une valeur sur un diagramme en bâtons, il faut suivre le sommet du bâton jusqu'à l'axe gradué.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"C'est la méthode de lecture standard d'un diagramme en bâtons."
},

{
question:"D'après le tableau des températures, quel est l'ordre croissant des jours selon la température ?",
graphique:"tableau_temperatures.png",
options:["Mer, Lun, Ven, Mar, Jeu","Jeu, Mar, Ven, Lun, Mer","Lun, Mar, Mer, Jeu, Ven","Mer, Ven, Lun, Mar, Jeu"],
bonne_reponse:"Mer, Lun, Ven, Mar, Jeu",
explication:"En ordonnant les valeurs 13, 14, 16, 17, 20, on obtient : Mer, Lun, Ven, Mar, Jeu."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après le schéma ci-dessous, quelle relation illustre-t-il ?",
graphique:"somme_vecteurs.png",
options:["La relation de Chasles : u + v","La différence u − v","Le produit u × v","La colinéarité de u et v"],
bonne_reponse:"La relation de Chasles : u + v",
explication:"En mettant bout à bout u puis v, on obtient directement le vecteur somme u+v (relation de Chasles)."
},

{
question:"Pour construire la somme de deux vecteurs u et v par la relation de Chasles, comment procède-t-on ?",
options:["On place l'origine de v à l'extrémité de u","On place les deux vecteurs à la même origine","On additionne les longueurs des deux vecteurs","On multiplie les deux vecteurs"],
bonne_reponse:"On place l'origine de v à l'extrémité de u",
explication:"C'est la méthode « bout à bout » : le vecteur somme va de l'origine de u à l'extrémité de v."
},

{
question:"D'après le schéma ci-dessous, quelle relation existe entre les vecteurs u et 2u ?",
graphique:"produit_vecteur.png",
options:["2u a la même direction que u mais une longueur double","2u est perpendiculaire à u","2u a une direction opposée à u","2u est deux fois plus court que u"],
bonne_reponse:"2u a la même direction que u mais une longueur double",
explication:"Multiplier un vecteur par 2 conserve sa direction et son sens, mais double sa longueur."
},

{
question:"Vrai ou Faux : multiplier un vecteur par un réel négatif inverse son sens.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Par exemple, -u a la même direction que u mais un sens opposé."
},

{
question:"Vrai ou Faux : deux vecteurs colinéaires ont nécessairement la même direction.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Des vecteurs colinéaires sont portés par des droites parallèles (même direction), mais peuvent avoir des sens opposés."
},

{
question:"Le vecteur u a pour coordonnées (2 ; 3). Quelles sont les coordonnées du vecteur 3u ?",
options:["(6 ; 9)","(5 ; 6)","(2 ; 9)","(6 ; 3)"],
bonne_reponse:"(6 ; 9)",
explication:"On multiplie chaque coordonnée par 3 : (3×2 ; 3×3) = (6 ; 9)."
},

{
question:"Le vecteur u a pour coordonnées (4 ; -2) et le vecteur v a pour coordonnées (1 ; 5). Quelles sont les coordonnées de u + v ?",
options:["(5 ; 3)","(3 ; 7)","(5 ; -7)","(4 ; 5)"],
bonne_reponse:"(5 ; 3)",
explication:"On additionne coordonnée par coordonnée : (4+1 ; -2+5) = (5 ; 3)."
},

{
question:"Le vecteur u a pour coordonnées (3 ; -1). Quelles sont les coordonnées du vecteur -2u ?",
options:["(-6 ; 2)","(6 ; -2)","(-6 ; -2)","(6 ; 2)"],
bonne_reponse:"(-6 ; 2)",
explication:"On multiplie chaque coordonnée par -2 : (-2×3 ; -2×(-1)) = (-6 ; 2)."
},

{
question:"Vrai ou Faux : le vecteur nul peut s'obtenir en additionnant un vecteur u et son opposé -u.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"u + (-u) = vecteur nul, par définition du vecteur opposé."
},

{
question:"Les vecteurs u(2 ; 4) et v(1 ; 2) sont-ils colinéaires ?",
options:["Oui, car v = 0,5 × u","Non, ils n'ont aucun rapport","Oui, mais seulement en norme","Non, car leurs coordonnées sont différentes"],
bonne_reponse:"Oui, car v = 0,5 × u",
explication:"On vérifie (2×2 = 1×4), donc les coordonnées sont proportionnelles : les vecteurs sont colinéaires."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

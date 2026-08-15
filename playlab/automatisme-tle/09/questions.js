/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [

{
question:"D'après la courbe ci-dessous (coefficient dominant a = 1), quelle est la forme factorisée de f(x) ?",
graphique:"parabole_racines.png",
options:["f(x) = (x-1)(x-4)","f(x) = (x+1)(x+4)","f(x) = (x-1)(x+4)","f(x) = x(x-1)(x-4)"],
bonne_reponse:"f(x) = (x-1)(x-4)",
explication:"Avec a=1 et les racines 1 et 4, la forme factorisée est f(x) = 1×(x-1)(x-4)."
},

{
question:"Quelle est la formule générale de la forme factorisée d'un polynôme du 2nd degré, de racines x₁ et x₂ et de coefficient dominant a ?",
options:["f(x) = a(x-x₁)(x-x₂)","f(x) = a(x+x₁)(x+x₂)","f(x) = a×x₁×x₂","f(x) = (x-x₁) + (x-x₂)"],
bonne_reponse:"f(x) = a(x-x₁)(x-x₂)",
explication:"C'est la formule standard de factorisation d'un trinôme connaissant ses deux racines."
},

{
question:"Un polynôme a pour racines 2 et 5, et pour coefficient dominant a = 3. Quelle est sa forme factorisée ?",
options:["f(x) = 3(x-2)(x-5)","f(x) = 3(x+2)(x+5)","f(x) = (x-2)(x-5)","f(x) = 3(x-2) + (x-5)"],
bonne_reponse:"f(x) = 3(x-2)(x-5)",
explication:"On applique la formule f(x) = a(x-x₁)(x-x₂) = 3(x-2)(x-5)."
},

{
question:"Un polynôme a pour racines -1 et 3, et pour coefficient dominant a = 1. Quelle est sa forme factorisée ?",
options:["f(x) = (x+1)(x-3)","f(x) = (x-1)(x+3)","f(x) = (x+1)(x+3)","f(x) = (x-1)(x-3)"],
bonne_reponse:"f(x) = (x+1)(x-3)",
explication:"Racine -1 donne le facteur (x-(-1)) = (x+1) ; racine 3 donne (x-3)."
},

{
question:"Vrai ou Faux : la forme factorisée d'un polynôme du 2nd degré permet de lire directement ses racines.",
options:["Vrai","Faux"],
bonne_reponse:"Vrai",
explication:"Dans f(x) = a(x-x₁)(x-x₂), les racines x₁ et x₂ apparaissent directement."
},

{
question:"Une parabole a une seule racine double x₀ = 2 et un coefficient dominant a = 1. Quelle est sa forme factorisée ?",
options:["f(x) = (x-2)²","f(x) = (x+2)²","f(x) = 2(x-2)","f(x) = (x-2)(x+2)"],
bonne_reponse:"f(x) = (x-2)²",
explication:"Une racine double x₀ donne f(x) = a(x-x₀)² = (x-2)²."
},

{
question:"Un polynôme a pour racines 0 et 6, et pour coefficient dominant a = 2. Quelle est sa forme factorisée ?",
options:["f(x) = 2x(x-6)","f(x) = 2(x-6)","f(x) = x(x-6)","f(x) = 2(x)(x+6)"],
bonne_reponse:"f(x) = 2x(x-6)",
explication:"La racine 0 donne le facteur x (car x-0=x), la racine 6 donne (x-6), avec a=2 devant."
},

{
question:"À partir de la forme factorisée f(x) = 2(x-3)(x+1), quelles sont les racines du polynôme ?",
options:["3 et -1","-3 et 1","3 et 1","-3 et -1"],
bonne_reponse:"3 et -1",
explication:"(x-3)=0 donne x=3 ; (x+1)=0 donne x=-1."
},

{
question:"À partir de la forme factorisée f(x) = -(x-2)(x-5), quel est le coefficient dominant a ?",
options:["-1","1","2","5"],
bonne_reponse:"-1",
explication:"Le signe « moins » devant les parenthèses correspond à a = -1."
},

{
question:"Vrai ou Faux : deux polynômes ayant les mêmes racines mais des coefficients dominants différents ont la même courbe.",
options:["Faux","Vrai"],
bonne_reponse:"Faux",
explication:"Le coefficient a modifie l'ouverture et l'orientation de la parabole, donc la courbe change même si les racines sont identiques."
}

];



/* ============================================================
   =================== FIN DES QUESTIONS ================
   ============================================================ */

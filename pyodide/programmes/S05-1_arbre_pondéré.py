# A : "l'élève est interne"  |  B : "l'élève mange à la cantine"
pA = 0.4        # P(A) : 40 % d'internes
pB_A = 0.9      # P(B sachant A) : 90 % des internes mangent à la cantine
pB_nA = 0.5     # P(B sachant non A) : 50 % des externes mangent à la cantine
arbre(pA, pB_A, pB_nA)
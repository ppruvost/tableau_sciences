/**
 * MATHILAB — ALGORITHMIQUE / PYTHON : modèles de l'activité Puzzle (TD01 à TD05)
 * mathilab/tp-algorithme/js/puzzle-algorithme.js
 */
import { fmt, R5 } from '../../js/puzzle-onglet.js';

/* ---------- TD01 : simuler une expérience aléatoire (2nde) ---------- */
const A1_LIB = {
  remi: { obj: 'pièces non conformes', p: 0.08 },
  gatl: { obj: 'livraisons en retard', p: 0.10 },
  mcc: { obj: 'pièces à retoucher', p: 0.12 },
};
export const A1 = {
  params: A1_LIB,
  build: (P, N, cad) => {
    const code = n => `import random

def estimer_probabilite(n, p):
    nb_succes = 0
    # TODO : compléter la boucle
    return nb_succes / n

frequence = estimer_probabilite(${n}, ${P.p})
print("Fréquence obtenue :", frequence)`;
    return {
      A: { contexte: `${cad}, un taux de ${P.obj} de ${P.p * 100} % est annoncé.`,
        problematique: `Une simulation de 2000 essais donne-t-elle une fréquence proche de ${P.p * 100} % ?`, questions: [
          `Compléter la boucle de la fonction estimer_probabilite(n, p) pour tirer un nombre aléatoire et compter les succès.`,
          `Exécuter le programme avec n = 2000 et p = ${P.p}.`,
          `Relever la fréquence obtenue.`,
          `Comparer cette fréquence au taux annoncé de ${P.p * 100} %.`, R5], code: code(2000) },
      B: { contexte: `${cad}, on veut savoir si augmenter la taille de l'échantillon rapproche la fréquence du taux réel de ${P.p * 100} %.`,
        problematique: `La fréquence se stabilise-t-elle davantage avec n = 20000 qu'avec n = 2000 ?`, questions: [
          `Reprendre la fonction estimer_probabilite(n, p) déjà complétée.`,
          `Exécuter le programme avec n = 20000 et p = ${P.p}.`,
          `Comparer cette fréquence à celle obtenue avec n = 2000.`,
          `Expliquer l'effet de la taille de l'échantillon sur la stabilité de la fréquence.`, R5], code: code(20000) },
      C: { contexte: `${cad}, on veut comparer plusieurs simulations indépendantes de même taille pour évaluer la fluctuation.`,
        problematique: `Les fréquences obtenues sur plusieurs simulations de n = 2000 sont-elles toutes identiques ?`, questions: [
          `Exécuter trois fois le programme avec n = 2000 et p = ${P.p}.`,
          `Relever les trois fréquences obtenues.`,
          `Calculer l'écart entre la plus petite et la plus grande fréquence.`,
          `Expliquer pourquoi ces fréquences varient d'une exécution à l'autre.`, R5], code: code(2000) },
    };
  },
};

/* ---------- TD02 : statistiques et probabilités en Python (1ère/Tle) ---------- */
const A2_LIB = {
  trpm: "le temps d'usinage", tci: "la surface de tôle développée", mcc: "le temps de montage",
  log: "le délai de livraison", agora: "le délai de traitement d'un dossier",
};
export const A2 = {
  params: A2_LIB,
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, on dispose d'une série de mesures liant deux grandeurs, dont ${P}.`,
      problematique: `Quelle droite ajuste au mieux ces mesures, et quelle prévision peut-on en tirer ?`, questions: [
        `Reprendre les listes x et y du programme « Droite d'ajustement ».`,
        `Exécuter le programme pour obtenir les coefficients a et b de la droite y = ax + b.`,
        `Utiliser la droite pour estimer y pour une nouvelle valeur de x.`,
        `Discuter si cette estimation est une interpolation ou une extrapolation.`, R5] },
    B: { contexte: `${cad}, deux évènements A et B sont associés à deux contrôles indépendants, avec p_a = 0,4 et p_b = 0,3.`,
      problematique: `Quelles sont les probabilités P(A∪B) et P(A∩B) ?`, questions: [
        `Exécuter le programme de simulation avec p_a = 0,4 et p_b = 0,3.`,
        `Relever les fréquences simulées de A∪B et de A∩B.`,
        `Comparer ces fréquences à la formule P(A∪B) = P(A) + P(B) − P(A∩B).`,
        `Conclure sur la formule vérifiée par la simulation.`, R5] },
    C: { contexte: `${cad}, un arbre pondéré modélise deux contrôles successifs avec p_b_si_a = 0,9 et p_b_si_non_a = 0,5.`,
      problematique: `Les évènements A et B sont-ils indépendants ?`, questions: [
        `Exécuter le programme « Simuler un arbre pondéré » avec ces valeurs.`,
        `Relever P(A et B) simulée.`,
        `Calculer P(A) × P(B) et le comparer à P(A et B).`,
        `Modifier p_b_si_a et p_b_si_non_a pour qu'elles soient égales : que devient l'indépendance ?`, R5] },
  }),
};

/* ---------- TD03 : suites numériques en Python (1ère/Tle) ---------- */
const A3_LIB = {
  trpm: "la cadence de production", tci: "la production de pièces chaudronnées", mcc: "la production de vêtements",
  log: "le volume de colis traité", agora: "le nombre de dossiers traités",
};
export const A3 = {
  params: A3_LIB,
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, ${P} augmente chaque période d'une quantité fixe : u0 = 200, r = 15.`,
      problematique: `Quelle est la valeur après 15 périodes, et la somme cumulée sur ces 15 périodes ?`, questions: [
        `Adapter le programme « Termes d'une suite arithmétique » avec u0 = 200, r = 15, n_termes = 15.`,
        `Exécuter le programme et relever la liste des termes.`,
        `Relever le dernier terme (u14) et la somme cumulée affichée.`,
        `Vérifier u14 avec la formule u0 + 14 × r.`, R5] },
    B: { contexte: `${cad}, ${P} augmente chaque période de 5 % : u0 = 200, q = 1,05.`,
      problematique: `Quelle est la valeur après 15 périodes, et la somme cumulée sur ces 15 périodes ?`, questions: [
        `Adapter le programme « Termes d'une suite géométrique » avec u0 = 200, q = 1.05, n_termes = 15.`,
        `Exécuter le programme et relever la liste des termes.`,
        `Relever le dernier terme (u14) et la somme cumulée affichée.`,
        `Vérifier u14 avec la formule u0 × q^14.`, R5] },
    C: { contexte: `${cad}, on compare les deux évolutions de ${P} (fiches A et B) sur 15 périodes.`,
      problematique: `Laquelle des deux évolutions devient la plus favorable à long terme ?`, questions: [
        `Reprendre les sommes cumulées obtenues en A et en B.`,
        `Comparer les deux sommes sur 15 périodes.`,
        `Modifier n_termes pour observer l'évolution sur 25 périodes.`,
        `Expliquer pourquoi l'écart entre les deux modèles s'accentue avec le temps.`, R5] },
  }),
};

/* ---------- TD04 : fonctions et calculs commerciaux en Python (2nde/1ère/Tle) ---------- */
const A4_LIB = {
  remi: "un procédé d'usinage", gatl: "une tournée de livraison", mcc: "un procédé de confection",
  trpm: "un procédé d'usinage", tci: "un procédé de chaudronnerie", log: "une tournée logistique", agora: "un traitement de dossiers",
};
export const A4 = {
  params: A4_LIB,
  build: (P, N, cad) => {
    if (N === '2nde') return {
      A: { contexte: `${cad}, ${P} est modélisé par une fonction Python simple f(x).`,
        problematique: `Comment programmer et évaluer cette fonction pour différentes valeurs de x ?`, questions: [
          `Écrire une fonction Python f(x) modélisant la situation.`,
          `Tester f(x) pour trois valeurs de x différentes.`,
          `Représenter les résultats dans un tableau.`,
          `Identifier la valeur de x qui donne le résultat le plus favorable.`, R5] },
      B: { contexte: `${cad}, un investissement lié à ${P} rapporte un intérêt simple annuel.`,
        problematique: `Quel capital final obtient-on après plusieurs années de placement à intérêt simple ?`, questions: [
          `Écrire une fonction Python calculant le capital final avec un intérêt simple.`,
          `Tester cette fonction avec un capital et un taux choisis par le groupe.`,
          `Faire varier la durée du placement.`,
          `Comparer les résultats obtenus pour ces différentes durées.`, R5] },
      C: { contexte: `${cad}, on combine une fonction de coût pour ${P} et un calcul de remise commerciale.`,
        problematique: `Comment automatiser, en un seul programme, le calcul d'un coût optimal et d'une remise ?`, questions: [
          `Écrire une fonction calculant le coût selon x.`,
          `Ajouter une fonction calculant le prix après une remise en pourcentage.`,
          `Combiner les deux fonctions dans un même programme.`,
          `Tester le programme complet avec des valeurs choisies par le groupe.`, R5] },
    };
    if (N === '1ere') return {
      A: { contexte: `${cad}, un coût lié à ${P} est donné par une équation qui ne se factorise pas simplement.`,
        problematique: `Comment résoudre cette équation par balayage en Python ?`, questions: [
          `Reprendre le programme « Résoudre f(x) = g(x) par balayage ».`,
          `Adapter les fonctions f et g à la situation du groupe.`,
          `Exécuter le programme et relever la ou les solutions approchées.`,
          `Vérifier la solution en calculant f(x) et g(x) pour cette valeur.`, R5] },
      B: { contexte: `${cad}, on étudie la fonction de coût liée à ${P} avec GéoGébra, notamment sa tangente.`,
        problematique: `Que représente la pente de la tangente en un point de la courbe ?`, questions: [
          `Suivre le protocole de l'onglet « Tangente (GeoGebra) » avec f(x) = −0,5x² + 3x.`,
          `Tracer la tangente en un point choisi.`,
          `Relever le coefficient directeur de la tangente.`,
          `Interpréter ce coefficient dans la situation (vitesse de variation du coût).`, R5] },
      C: { contexte: `${cad}, un placement à intérêts simples finance un investissement lié à ${P}.`,
        problematique: `Quel capital obtient-on après plusieurs périodes de placement ?`, questions: [
          `Écrire une fonction Python calculant le capital avec intérêt simple.`,
          `Exécuter cette fonction avec un capital et un taux choisis.`,
          `Faire varier la durée du placement.`,
          `Comparer les capitaux obtenus pour ces différentes durées.`, R5] },
    };
    return {
      A: { contexte: `${cad}, un coût lié à ${P} est donné par une équation du troisième degré qui ne se factorise pas simplement.`,
        problematique: `Comment résoudre cette équation par balayage en Python ?`, questions: [
          `Reprendre le programme « Résoudre f(x) = g(x) par balayage » (niveau Tle).`,
          `Adapter les fonctions f et g à la situation du groupe.`,
          `Exécuter le programme et relever la ou les solutions approchées.`,
          `Vérifier la solution en calculant f(x) et g(x) pour cette valeur.`, R5] },
      B: { contexte: `${cad}, un placement à intérêts composés finance un investissement lié à ${P}.`,
        problematique: `Quel capital obtient-on après plusieurs périodes, avec deux taux différents ?`, questions: [
          `Écrire une fonction Python calculant le capital avec intérêts composés.`,
          `Exécuter cette fonction avec un premier taux.`,
          `Exécuter cette fonction avec un second taux, capital et durée identiques.`,
          `Comparer les deux capitaux finaux obtenus.`, R5] },
      C: { contexte: `${cad}, on combine résolution par balayage et calcul d'intérêts composés pour un même projet lié à ${P}.`,
        problematique: `Comment un même programme peut-il combiner ces deux outils pour aider une décision d'investissement ?`, questions: [
          `Reprendre les deux fonctions Python des fiches A et B.`,
          `Les intégrer dans un même programme.`,
          `Exécuter le programme complet avec des valeurs choisies par le groupe.`,
          `Discuter de la décision d'investissement suggérée par les résultats.`, R5] },
    };
  },
};

/* ---------- TD05 : géométrie (2nde) ---------- */
const A5_LIB = {
  remi: "une pièce mécanique", gatl: "un espace de stockage", mcc: "une pièce de patronage",
};
export const A5 = {
  params: A5_LIB,
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, on cherche des triplets pythagoriciens pour vérifier l'équerrage de ${P}.`,
      problematique: `Quels triplets d'entiers (a, b, c) vérifient a² + b² = c² parmi les 100 premiers entiers ?`, questions: [
        `Exécuter le programme « Rechercher des triplets pythagoriciens » avec limite = 100.`,
        `Relever tous les triplets trouvés.`,
        `Vérifier l'un d'eux à la main (a² + b² = c²).`,
        `Compter le nombre total de triplets trouvés.`, R5] },
    B: { contexte: `${cad}, ${P} peut être modélisée par un carré ou un cylindre.`,
      problematique: `Quelle aire ou quel volume obtient-on pour ${P} avec les dimensions choisies par le groupe ?`, questions: [
        `Choisir une forme (carré ou cylindre) adaptée à ${P}.`,
        `Adapter le programme d'aires et de volumes avec des dimensions réalistes.`,
        `Exécuter le programme et relever le résultat.`,
        `Vérifier ce résultat à la main avec la formule correspondante.`, R5] },
    C: { contexte: `${cad}, on construit un triangle rectangle à partir d'un triplet pythagoricien différent, par exemple 5, 12, 13.`,
      problematique: `La relation de Pythagore est-elle vérifiée sur la construction obtenue ?`, questions: [
        `Reprendre le protocole de construction GéoGébra du triangle rectangle.`,
        `Construire le triangle avec les côtés 5, 12 et 13.`,
        `Mesurer l'angle entre les côtés 5 et 12.`,
        `Vérifier que 5² + 12² = 13².`, R5] },
  }),
};

export const PUZZLES_ALGORITHME = { td01: A1, td02: A2, td03: A3, td04: A4, td05: A5 };

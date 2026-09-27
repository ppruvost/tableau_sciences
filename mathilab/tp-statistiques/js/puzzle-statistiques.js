/**
 * MATHILAB — STATISTIQUES : modèles de l'activité Puzzle (TP01 à TP05)
 * mathilab/tp-statistiques/js/puzzle-statistiques.js
 */
import { fmt, R5 } from '../../js/puzzle-onglet.js';

const L1 = '0, 1, 0, 2, 1, 3, 0, 2, 1, 0, 2, 0, 1, 0, 2, 3, 1, 0, 1, 2';
const H = [173, 169, 174, 179, 169, 166, 179, 172, 166, 172, 170, 170, 175, 162, 169, 169, 162, 175, 164, 171];
const rot = (s, k) => { const a = s.split(', '); return [...a.slice(k), ...a.slice(0, k)].join(', '); };
const dec = k => H.map(v => v - k).join(', ');

/* ---------- TP01 : organiser une série (2nde) ---------- */
export const S1 = {
  params: {
    remi: { dA: "le nombre de pannes de machine par semaine (5 semaines)", sA: "2, 0, 3, 1, 4",
      pA: "Combien de pannes par semaine observe-t-on en moyenne, et quelle semaine est la plus critique ?",
      dB: "le nombre d'arrêts d'une machine par jour, sur 20 jours", sB: rot(L1, 0),
      pB: "Combien d'arrêts par jour observe-t-on en moyenne, et quelle situation est la plus fréquente ?",
      dC: "la longueur (en cm) de 20 barres usinées",
      pC: "Dans quelle plage de longueurs se situe la majorité des barres ?" },
    mcc: { dA: "le nombre de pièces retouchées par jour (du lundi au vendredi)", sA: "6, 8, 7, 5, 9",
      pA: "Combien de pièces sont retouchées en moyenne par jour, et quel jour la charge est-elle maximale ?",
      dB: "le nombre de défauts de couture par pièce, sur 20 pièces contrôlées", sB: rot(L1, 5),
      pB: "Combien de défauts par pièce observe-t-on en moyenne, et quel cas est le plus fréquent ?",
      dC: "la longueur (en cm) de 20 pièces de tissu coupées",
      pC: "Dans quelle plage de longueurs se situe la majorité des pièces coupées ?" },
    gatl: { dA: "le nombre de livraisons en retard par jour (du lundi au vendredi)", sA: "3, 5, 2, 4, 6",
      pA: "Combien de livraisons sont en retard en moyenne par jour, et quel jour est le plus difficile ?",
      dB: "le nombre de réclamations clients par jour, sur 20 jours", sB: rot(L1, 11),
      pB: "Combien de réclamations par jour reçoit-on en moyenne, et quelle situation est la plus fréquente ?",
      dC: "la longueur (en cm) de 20 colis préparés",
      pC: "Dans quelle plage de longueurs se situe la majorité des colis ?" },
  },
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, on relève ${P.dA} : ${P.sA}.`, problematique: P.pA, questions: [
      `Calculer le total de cette série.`,
      `Calculer la valeur moyenne (arrondie au dixième).`,
      `Construire le diagramme en bâtons de la série.`,
      `Repérer la valeur la plus élevée et la plus faible, et les interpréter dans la situation.`, R5] },
    B: { contexte: `${cad}, on a relevé ${P.dB} : ${P.sB}.`, problematique: P.pB, questions: [
      `Organiser les données dans un tableau (valeur, effectif, fréquence en %).`,
      `Calculer le total et la moyenne de la série.`,
      `Déterminer la valeur la plus fréquente (le mode).`,
      `Construire un diagramme en secteurs à partir du tableau.`, R5] },
    C: { contexte: `${cad}, on mesure ${P.dC} : ${H.join(', ')}.`, problematique: P.pC, questions: [
      `Relever la valeur minimale, la valeur maximale et calculer l'étendue.`,
      `Regrouper la série en 4 classes de même amplitude (tableau des effectifs).`,
      `Construire l'histogramme correspondant.`,
      `Identifier la classe la plus fréquente (classe modale).`, R5] },
  }),
};

/* ---------- TP02 : comparer des séries (2nde) ---------- */
export const S2 = {
  params: {
    remi: { d: "la durée d'une intervention de maintenance", u: 'minutes', k: 110,
      pA: "Quelle durée typique prévoir pour une intervention ?",
      pB: "Les durées sont-elles régulières ou très variables d'une intervention à l'autre ?",
      pC: "Que révèle la répartition des durées pour planifier les interventions ?" },
    mcc: { d: "le temps de réalisation d'une pièce", u: 'minutes', k: 140,
      pA: "Quel temps de réalisation prévoir pour une pièce ?",
      pB: "Le temps de réalisation est-il régulier d'une pièce à l'autre ?",
      pC: "Comment présenter la répartition des temps pour organiser l'atelier ?" },
    gatl: { d: "le temps de préparation d'une commande", u: 'minutes', k: 130,
      pA: "Quel temps de préparation annoncer à un client ?",
      pB: "Le temps de préparation est-il régulier d'une commande à l'autre ?",
      pC: "Que montre la répartition des temps pour organiser les équipes ?" },
  },
  build: (P, N, cad) => {
    const s = `${P.d} sur 20 relevés (en ${P.u}) : ${dec(P.k)}`;
    return {
      A: { contexte: `${cad}, on étudie ${s}. On cherche la valeur « typique ».`, problematique: P.pA, questions: [
        `Calculer la moyenne de la série (calculatrice ou tableur).`,
        `Déterminer la médiane.`,
        `Déterminer le mode.`,
        `Expliquer ce que représente chacun de ces trois indicateurs dans la situation.`, R5] },
      B: { contexte: `${cad}, on étudie ${s}. On cherche à savoir si les valeurs sont régulières.`, problematique: P.pB, questions: [
        `Déterminer la valeur minimale, la valeur maximale et l'étendue.`,
        `Calculer l'écart type.`,
        `Déterminer Q1, Q3 et l'écart interquartile Q3 − Q1.`,
        `Expliquer à quoi sert chacun de ces indicateurs de dispersion.`, R5] },
      C: { contexte: `${cad}, on étudie ${s}. On veut présenter la répartition de façon visuelle à un responsable.`, problematique: P.pC, questions: [
        `Relever le minimum, Q1, la médiane, Q3 et le maximum.`,
        `Placer ces cinq valeurs sur un axe gradué.`,
        `Tracer la boîte (de Q1 à Q3) et les moustaches (minimum et maximum).`,
        `Décrire la répartition : est-elle symétrique ? Y a-t-il des valeurs éloignées ?`, R5] },
    };
  },
};

/* ---------- TP03 : fluctuation d'échantillonnage (2nde) ---------- */
export const S3 = {
  params: {
    remi: { obj: 'pièces non conformes', u: 'pièces', p: 8, n: 50, k: 4, n2: 500, k2: 43 },
    mcc: { obj: 'pièces à retoucher', u: 'pièces', p: 15, n: 60, k: 9, n2: 600, k2: 87 },
    gatl: { obj: 'livraisons en retard', u: 'livraisons', p: 10, n: 40, k: 6, n2: 400, k2: 38 },
  },
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, un taux de ${P.obj} de ${P.p} % est annoncé. Sur un contrôle de ${P.n} ${P.u}, on compte ${P.k} ${P.obj}.`,
      problematique: `L'écart entre la fréquence observée et le taux annoncé est-il surprenant ?`, questions: [
        `Calculer la fréquence observée sur l'échantillon (en %).`,
        `Calculer l'écart avec le taux annoncé de ${P.p} %.`,
        `Expliquer pourquoi une fréquence observée peut différer du taux réel.`,
        `Conclure : l'écart est-il surprenant ou plausible ?`, R5] },
    B: { contexte: `${cad}, pour comprendre la fluctuation, on simule dix contrôles indépendants de ${P.n} ${P.u}, avec un taux réel de ${P.p} % de ${P.obj}.`,
      problematique: `Les fréquences varient-elles d'un contrôle à l'autre, et dans quelle mesure ?`, questions: [
        `Simuler 10 échantillons de ${P.n} ${P.u} (calculatrice ou tableur, fonction aléatoire).`,
        `Relever les 10 fréquences obtenues.`,
        `Déterminer la plus petite, la plus grande fréquence et l'étendue.`,
        `Comparer ces fréquences au taux réel de ${P.p} %.`, R5] },
    C: { contexte: `${cad}, un second contrôle, plus important, porte sur ${P.n2} ${P.u} : on compte ${P.k2} ${P.obj}. Le premier contrôle portait sur ${P.n} ${P.u} avec ${P.k} ${P.obj}.`,
      problematique: `Un échantillon plus grand donne-t-il une fréquence plus proche du taux annoncé de ${P.p} % ?`, questions: [
        `Calculer la fréquence du second contrôle (en %).`,
        `Comparer les écarts au taux annoncé pour les deux contrôles.`,
        `Expliquer l'effet de la taille de l'échantillon sur la fluctuation.`,
        `Quelle estimation du taux retenir avec l'ensemble des informations ?`, R5] },
  }),
};

/* ---------- TP04 : nuage de points et ajustement (1ère / Tle) ---------- */
const NUAGES = {
  trpm: { xn: "le nombre de pièces usinées", yn: "le temps d'usinage total (en min)", x: "1 ; 2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8", y: "6 ; 10 ; 13 ; 18 ; 21 ; 25 ; 29 ; 32", xi: 5, xe: 12 },
  tci: { xn: "l'épaisseur de tôle soudée (en mm)", yn: "le temps de soudage (en min)", x: "2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8 ; 9", y: "3 ; 5 ; 6 ; 8 ; 9 ; 11 ; 12 ; 14", xi: 6, xe: 12 },
  mcc: { xn: "la taille de la cliente (en cm)", yn: "la quantité de tissu pour une robe (en m)", x: "160 ; 164 ; 168 ; 172 ; 176 ; 180 ; 184 ; 188", y: "1,9 ; 2,0 ; 2,1 ; 2,2 ; 2,4 ; 2,5 ; 2,6 ; 2,7", xi: 174, xe: 200 },
  log: { xn: "le nombre de colis par commande", yn: "le temps de préparation (en min)", x: "3 ; 5 ; 2 ; 7 ; 6 ; 4 ; 8 ; 5", y: "6 ; 10 ; 5 ; 14 ; 13 ; 8 ; 15 ; 11", xi: 6, xe: 12 },
  agora: { xn: "le nombre de dossiers à traiter", yn: "le temps de traitement (en h)", x: "10 ; 20 ; 30 ; 40 ; 50 ; 60 ; 70 ; 80", y: "4 ; 7 ; 9 ; 13 ; 15 ; 18 ; 20 ; 24", xi: 45, xe: 120 },
};
export const S4 = {
  params: NUAGES,
  build: (P, N, cad) => {
    const d = `x = ${P.x} ; y = ${P.y}`;
    const tle = N === 'tle';
    return {
      A: { contexte: `${cad}, on étudie la relation entre ${P.xn} (x) et ${P.yn} (y). Données : ${d}.`,
        problematique: `Existe-t-il un lien entre ${P.xn} et ${P.yn} ?`, questions: [
          `Construire le nuage de points (x en abscisse, y en ordonnée).`,
          `Décrire la forme du nuage : croissant ou décroissant, allongé ou dispersé.`,
          `Calculer les coordonnées du point moyen G et le placer sur le nuage.`,
          `Un ajustement affine vous semble-t-il pertinent ? Justifier.`, R5] },
      B: { contexte: `${cad}, on souhaite modéliser par une droite la relation entre ${P.xn} (x) et ${P.yn} (y). Données : ${d}.`,
        problematique: `Quelle droite modélise cette relation, et avec quelle qualité ?`, questions: [
          `Saisir les données dans la calculatrice ou le tableur.`,
          `Déterminer l'équation y = ax + b de la droite d'ajustement.`,
          `Tracer la droite sur le nuage et vérifier qu'elle passe près de G.`,
          tle ? `Donner le coefficient de détermination R² et l'interpréter.` : `Interpréter le coefficient directeur a dans la situation.`, R5] },
      C: { contexte: `${cad}, à partir de la droite d'ajustement de ${P.yn} en fonction de ${P.xn}, on veut prévoir des valeurs non mesurées. Données : ${d}.`,
        problematique: `Quelle valeur de y prévoir pour x = ${P.xi} et pour x = ${P.xe}, et ces prévisions sont-elles fiables ?`, questions: [
          `Estimer y pour x = ${P.xi} (interpolation).`,
          `Estimer y pour x = ${P.xe} (extrapolation).`,
          `Laquelle de ces deux estimations est la plus fiable ? Justifier.`,
          tle ? `Discuter les limites du modèle affine et envisager un ajustement non affine.` : `Vérifier graphiquement ces estimations sur la droite tracée.`, R5] },
    };
  },
};

/* ---------- TP05 : tableau croisé et arbre pondéré (1ère / Tle) ---------- */
export const S5 = {
  params: {
    trpm: { N: 200, u: 'pièces', nE: 80, nD: 30, nED: 18, e: 'usinées sur la machine 1', d: 'non conformes', es: 'usiné sur la machine 1', ds: 'non conforme' },
    tci: { N: 150, u: 'pièces soudées', nE: 60, nD: 24, nED: 15, e: 'réalisées par l\'équipe A', d: 'à reprendre', es: 'réalisé par l\'équipe A', ds: 'à reprendre' },
    mcc: { N: 240, u: 'vêtements', nE: 100, nD: 36, nED: 20, e: 'cousus sur la ligne 1', d: 'à retoucher', es: 'cousu sur la ligne 1', ds: 'à retoucher' },
    log: { N: 300, u: 'livraisons', nE: 60, nD: 45, nED: 15, e: 'en zone urbaine', d: 'en retard', es: 'livré en zone urbaine', ds: 'en retard' },
    agora: { N: 250, u: 'dossiers', nE: 100, nD: 40, nED: 12, e: 'déposés en ligne', d: 'incomplets', es: 'déposé en ligne', ds: 'incomplet' },
  },
  build: (P, N, cad) => {
    const data = `on contrôle ${P.N} ${P.u} : ${P.nE} sont ${P.e}, ${P.nD} sont ${P.d}, dont ${P.nED} à la fois ${P.e} et ${P.d}`;
    const tle = N === 'tle';
    return {
      A: { contexte: `${cad}, ${data}.`,
        problematique: `Quelle est la probabilité qu'un élément choisi au hasard soit ${P.ds}, et qu'il soit à la fois ${P.es} et ${P.ds} ?`, questions: [
          `Compléter le tableau croisé d'effectifs (E / non E × D / non D), avec E : « ${P.es} » et D : « ${P.ds} ».`,
          `Calculer P(D).`,
          `Calculer P(E ∩ D).`,
          `Vérifier que les effectifs du tableau s'additionnent bien au total de ${P.N}.`, R5] },
      B: { contexte: `${cad}, ${data}. On veut savoir si le fait d'être ${P.es} modifie le risque d'être ${P.ds}.`,
        problematique: `Le risque d'être ${P.ds} est-il différent pour un élément ${P.es} ?`, questions: [
          `Calculer P(D).`,
          `Calculer la probabilité conditionnelle P_E(D) = P(E ∩ D) / P(E).`,
          `Calculer P_D(E) et expliquer la différence de sens avec P_E(D).`,
          `Comparer P(D) et P_E(D), puis interpréter dans la situation.`, R5] },
      C: { contexte: `${cad}, ${data}. Les résultats sont organisés dans un arbre pondéré.`,
        problematique: tle ? `Les événements E et D sont-ils indépendants ?` : `Quelle est la probabilité de chaque chemin de l'arbre ?`,
        questions: tle ? [
          `Construire l'arbre pondéré (E puis D) avec P(E), P_E(D) et P_Ē(D).`,
          `Calculer P(D) avec la formule des probabilités totales.`,
          `Calculer P(E) × P(D) et le comparer à P(E ∩ D).`,
          `Conclure sur l'indépendance de E et D.`, R5
        ] : [
          `Calculer P(E), P_E(D) et P_Ē(D).`,
          `Construire l'arbre pondéré en plaçant ces probabilités sur les branches.`,
          `Calculer P(E ∩ D) en multipliant les probabilités le long de la branche.`,
          `Vérifier que les probabilités des branches issues d'un même nœud ont pour somme 1.`, R5] },
    };
  },
};

export const PUZZLES_STATISTIQUES = { tp01: S1, tp02: S2, tp03: S3, tp04: S4, tp05: S5 };

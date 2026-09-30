/**
 * MATHILAB — GÉOMÉTRIE : modèles de l'activité Puzzle (TD01 à TD04)
 * mathilab/tp-geometrie/js/puzzle-geometrie.js
 */
import { fmt, R5 } from '../../js/puzzle-onglet.js';

/* ---------- TD01 : solides, aires, volumes, Pythagore, Thalès (2nde) ---------- */
const G1_LIB = {
  remi: { piece: "une pièce mécanique", u: 'mm' },
  mcc: { piece: "une pièce de patronage", u: 'cm' },
  gatl: { piece: "un espace de stockage", u: 'cm' },
};
export const G1 = {
  params: G1_LIB,
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, on vérifie que ${P.piece} de côtés 6 ${P.u}, 8 ${P.u} et 10 ${P.u} a un angle droit entre les deux plus petits côtés.`,
      problematique: `${P.piece.charAt(0).toUpperCase() + P.piece.slice(1)} est-elle bien d'équerre ?`, questions: [
        `Identifier le plus grand côté (hypoténuse potentielle).`,
        `Calculer le carré du plus grand côté, puis la somme des carrés des deux autres.`,
        `Comparer les deux résultats.`,
        `Énoncer la réciproque du théorème de Pythagore utilisée.`, R5] },
    B: { contexte: `${cad}, deux droites parallèles coupent deux sécantes issues d'un même point A. On mesure AB = 12 ${P.u}, AC = 9 ${P.u}, BC = 7 ${P.u} et AD = 8 ${P.u}.`,
      problematique: `Quelles sont les longueurs AE et DE ?`, questions: [
        `Faire un schéma de la configuration de Thalès et placer les longueurs connues.`,
        `Écrire les rapports égaux donnés par le théorème de Thalès.`,
        `Calculer AE.`,
        `Calculer DE.`, R5] },
    C: { contexte: `${cad}, un plan de ${P.piece} est agrandi avec un coefficient k = 1,5. Une longueur de référence mesure 20 ${P.u}, une aire 400 ${P.u}² et un volume 8000 ${P.u}³.`,
      problematique: `Quels deviennent la longueur, l'aire et le volume après cet agrandissement ?`, questions: [
        `Rappeler l'effet d'un coefficient k sur une longueur, une aire (k²) et un volume (k³).`,
        `Calculer la nouvelle longueur.`,
        `Calculer la nouvelle aire.`,
        `Calculer le nouveau volume.`, R5] },
  }),
};

/* ---------- TD02 : géométrie dans l'espace, sections (1ère) ---------- */
const G2_LIB = {
  trpm: "une pièce usinée", tci: "une pièce chaudronnée", mcc: "un gabarit de patronage",
  log: "un espace de stockage", agora: "un agencement de mobilier",
};
export const G2 = {
  params: G2_LIB,
  build: (P, N, cad, fil) => ({
    A: { contexte: `${cad}, ${P} est représenté par un cube de 10 cm d'arête, sectionné par un plan passant par trois points situés à égale distance d'un même sommet.`,
      problematique: `Quelle est la nature de la section obtenue ?`, questions: [
        `Construire le cube et placer les trois points de section sur trois arêtes issues d'un même sommet.`,
        `Tracer les segments joignant ces trois points.`,
        `Identifier le polygone obtenu.`,
        `Justifier que ce polygone est équilatéral.`, R5] },
    B: { contexte: `${cad}, ${P} comporte une partie cylindrique de rayon 5 cm et de hauteur 12 cm.`,
      problematique: `Quelle est la différence entre une section par un plan horizontal et par un plan incliné ?`, questions: [
        `Sectionner le cylindre par un plan horizontal et identifier la figure obtenue.`,
        `Sectionner le cylindre par un plan incliné et identifier la figure obtenue.`,
        `Comparer les deux figures obtenues.`,
        `Expliquer pourquoi l'inclinaison du plan change la nature de la section.`, R5] },
    C: { contexte: `${cad}, ${P} est modélisé par un cylindre de rayon 5 cm et de hauteur 12 cm, surmonté d'un cône de même rayon et de hauteur 6 cm.`,
      problematique: `Quel est le volume total de ${P} ?`, questions: [
        `Calculer le volume du cylindre.`,
        `Calculer le volume du cône.`,
        `Calculer le volume total du solide composé.`,
        `Représenter le solide avec GéoGébra pour vérifier sa forme.`, R5] },
  }),
};

/* ---------- TD03 : vecteurs (1ère plan, Tle espace) ----------
   Chaque filière a ses propres situations et valeurs numériques.
   - 1ère (et Tle hors groupement B) : vecteurs du plan
   - Tle groupement B (TRPM, TCI, MCC) : vecteurs de l'espace
   Toutes les normes sont « entières » pour faciliter la vérification. */
const G3_LIB = {
  trpm: {
    plan: {
      A: { ctx: `la table d'une fraiseuse déplace l'outil du point A(2 ; 1) au point B(7 ; 13), coordonnées exprimées en mm dans le repère de la pièce`,
           interp: `longueur du déplacement de l'outil, en mm`, pb: `Quelles sont les coordonnées et la longueur du déplacement de l'outil ?` },
      B: { ctx: `l'outil subit un effort d'avance u(50 ; 0) et un effort de pénétration v(0 ; 120), exprimés en N`,
           interp: `intensité de l'effort résultant, en N`, pb: `Quel est l'effort résultant sur l'outil et quelle est son intensité ?` },
      C: { ctx: `après le déplacement AB (A(2 ; 1), B(7 ; 13), en mm), une correction de réglage modélisée par le vecteur w(3 ; 3) est appliquée à l'outil`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
    espace: {
      A: { ctx: `l'outil d'une fraiseuse cinq axes passe du point A(1 ; 2 ; 0) au point B(4 ; 6 ; 12), coordonnées exprimées en mm`,
           pb: `Quelle est la longueur du déplacement de l'outil dans l'espace ?` },
      B: { ctx: `deux efforts de coupe sont modélisés par les vecteurs u(2 ; 4 ; 6) et v(1 ; 2 ; 3), exprimés en N`,
           pb: `Ces deux efforts de coupe ont-ils la même direction ?` },
      C: { ctx: `deux déplacements de l'outil sont modélisés par AB(3 ; 4 ; 12) et CD(6 ; 8 ; 24), exprimés en mm`,
           pb: `Ces deux déplacements ont-ils la même direction, et comment comparer leurs longueurs ?` },
    },
  },
  tci: {
    plan: {
      A: { ctx: `un chalumeau de découpe se déplace du point A(1 ; 2) au point B(9 ; 17) sur une tôle, coordonnées exprimées en cm`,
           interp: `longueur du trajet du chalumeau, en cm`, pb: `Quelles sont les coordonnées et la longueur du trajet du chalumeau ?` },
      B: { ctx: `un galet de cintrage exerce sur un tube un effort horizontal u(240 ; 0) et un effort vertical v(0 ; 70), exprimés en daN`,
           interp: `intensité de l'effort résultant, en daN`, pb: `Quel est l'effort résultant sur le tube et quelle est son intensité ?` },
      C: { ctx: `après le déplacement AB (A(1 ; 2), B(9 ; 17), en cm), la tôle est décalée du vecteur w(−8 ; 9)`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
    espace: {
      A: { ctx: `un point de soudure passe de A(0 ; 1 ; 2) à B(2 ; 4 ; 8) sur une virole, coordonnées exprimées en cm`,
           pb: `Quelle est la longueur du déplacement du point de soudure dans l'espace ?` },
      B: { ctx: `deux efforts s'exercent sur un support : u(4 ; −2 ; 8) et v(−2 ; 1 ; −4), exprimés en daN`,
           pb: `Ces deux efforts ont-ils la même direction, et sont-ils de même sens ?` },
      C: { ctx: `deux déplacements de pièce sont modélisés par AB(2 ; 3 ; 6) et CD(−4 ; −6 ; −12), exprimés en cm`,
           pb: `Ces deux déplacements ont-ils la même direction, et comment comparer leurs longueurs ?` },
    },
  },
  mcc: {
    plan: {
      A: { ctx: `sur un patron, l'aiguille doit aller du point de piqûre A(1 ; 2) au point B(10 ; 14), coordonnées exprimées en cm`,
           interp: `longueur du déplacement de l'aiguille, en cm`, pb: `Quelles sont les coordonnées et la longueur du déplacement de l'aiguille ?` },
      B: { ctx: `un fil est tendu par deux forces perpendiculaires u(6 ; 0) et v(0 ; 8), exprimées en N`,
           interp: `intensité de la tension résultante, en N`, pb: `Quelle est la tension résultante dans le fil et quelle est son intensité ?` },
      C: { ctx: `après le déplacement AB (A(1 ; 2), B(10 ; 14), en cm), le tissu est décalé du vecteur w(6 ; 8)`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
    espace: {
      A: { ctx: `sur un mannequin en trois dimensions, un point de couture passe de A(1 ; 0 ; 2) à B(3 ; 6 ; 11), coordonnées exprimées en cm`,
           pb: `Quelle est la longueur du déplacement du point de couture dans l'espace ?` },
      B: { ctx: `deux tensions de fil sont modélisées par u(3 ; 6 ; 9) et v(1 ; 2 ; 4), exprimées en N`,
           pb: `Ces deux tensions de fil ont-elles la même direction ?` },
      C: { ctx: `deux déplacements sont modélisés par AB(2 ; 6 ; 9) et CD(1 ; 3 ; 4,5), exprimés en cm`,
           pb: `Ces deux déplacements ont-ils la même direction, et comment comparer leurs longueurs ?` },
    },
  },
  remi: {
    plan: {
      A: { ctx: `un technicien déplace un capteur du point A(1 ; 2) au point B(7 ; 10) sur un bâti, coordonnées exprimées en dm`,
           interp: `longueur du déplacement du capteur, en dm`, pb: `Quelles sont les coordonnées et la longueur du déplacement du capteur ?` },
      B: { ctx: `un support de machine subit un effort horizontal u(30 ; 0) et un effort vertical v(0 ; 40), exprimés en daN`,
           interp: `intensité de l'effort résultant, en daN`, pb: `Quel est l'effort résultant sur le support et quelle est son intensité ?` },
      C: { ctx: `après le déplacement AB (A(1 ; 2), B(7 ; 10), en dm), le capteur est encore décalé du vecteur w(5 ; 0)`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
  },
  gatl: {
    plan: {
      A: { ctx: `un véhicule de livraison va du dépôt A(1 ; 2) à la plateforme B(9 ; 8), coordonnées exprimées en km`,
           interp: `distance à vol d'oiseau entre le dépôt et la plateforme, en km`, pb: `Quelles sont les coordonnées et la longueur du trajet du véhicule ?` },
      B: { ctx: `un camion parcourt u(12 ; 0) vers l'est puis v(0 ; 16) vers le nord, exprimés en km`,
           interp: `distance à vol d'oiseau entre le départ et l'arrivée, en km`, pb: `Quel est le déplacement résultant du camion et quelle est sa longueur ?` },
      C: { ctx: `après le trajet AB (A(1 ; 2), B(9 ; 8), en km), le véhicule doit encore rejoindre un client par le déplacement w(4 ; 3)`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
  },
  log: {
    plan: {
      A: { ctx: `un chariot élévateur va du point A(2 ; 1) au point B(11 ; 13) dans l'entrepôt, coordonnées exprimées en m`,
           interp: `distance parcourue en ligne droite, en m`, pb: `Quelles sont les coordonnées et la longueur du trajet du chariot ?` },
      B: { ctx: `un chariot avance de u(7 ; 0) le long d'un quai, puis de v(0 ; 24) le long d'une allée, exprimés en m`,
           interp: `distance en ligne droite entre le départ et l'arrivée, en m`, pb: `Quel est le déplacement résultant du chariot et quelle est sa longueur ?` },
      C: { ctx: `après le trajet AB (A(2 ; 1), B(11 ; 13), en m), le chariot doit encore se déplacer de w(3 ; 4)`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
  },
  agora: {
    plan: {
      A: { ctx: `sur le plan d'un étage, un dossier passe du service A(1 ; 1) au service B(4 ; 5), coordonnées exprimées en m`,
           interp: `distance à vol d'oiseau entre les deux services, en m`, pb: `Quelles sont les coordonnées et la longueur du déplacement du dossier ?` },
      B: { ctx: `un coursier parcourt un premier couloir u(6 ; 0) puis un second couloir v(0 ; 8), exprimés en m`,
           interp: `distance à vol d'oiseau entre le départ et l'arrivée, en m`, pb: `Quel est le déplacement résultant du coursier et quelle est sa longueur ?` },
      C: { ctx: `après le trajet AB (A(1 ; 1), B(4 ; 5), en m), le dossier est encore transféré selon le vecteur w(2 ; 8)`,
           pb: `Quel est le déplacement final AB + w et quelle est sa longueur ?` },
    },
  },
};

// Filières du groupement B : seules à aborder les vecteurs de l'espace en Tle.
const G3_GROUPEMENT_B = ['trpm', 'tci', 'mcc'];

export const G3 = {
  params: G3_LIB,
  build: (P, N, cad, fil) => {
    const espace = N === 'tle' && G3_GROUPEMENT_B.includes(fil) && P.espace;
    if (espace) {
      const E = P.espace;
      return {
        A: { contexte: `${cad}, ${E.A.ctx}.`, problematique: E.A.pb, questions: [
          `Calculer les coordonnées du vecteur AB (xB − xA ; yB − yA ; zB − zA).`,
          `Rappeler la formule de la norme d'un vecteur de l'espace.`,
          `Calculer la norme de AB.`,
          `Interpréter cette norme dans la situation (longueur du déplacement).`, R5] },
        B: { contexte: `${cad}, ${E.B.ctx}.`, problematique: E.B.pb, questions: [
          `Rappeler la condition de colinéarité de deux vecteurs de l'espace.`,
          `Chercher un réel k tel que u = k × v sur chaque coordonnée.`,
          `Vérifier si ce réel k convient pour les trois coordonnées.`,
          `Conclure sur la colinéarité de u et v et, si elle existe, sur le sens des deux vecteurs.`, R5] },
        C: { contexte: `${cad}, ${E.C.ctx}.`, problematique: E.C.pb, questions: [
          `Calculer la norme du premier vecteur (AB).`,
          `Calculer la norme du second vecteur (CD).`,
          `Tester la colinéarité de AB et CD à l'aide de leurs coordonnées.`,
          `Comparer les deux normes et relier ce résultat à la colinéarité.`, R5] },
      };
    }
    const L = P.plan;
    return {
      A: { contexte: `${cad}, ${L.A.ctx}.`, problematique: L.A.pb, questions: [
        `Calculer les coordonnées du vecteur AB (xB − xA ; yB − yA).`,
        `Rappeler la formule de la norme d'un vecteur du plan.`,
        `Calculer la norme de AB.`,
        `Interpréter cette norme dans la situation (${L.A.interp}).`, R5] },
      B: { contexte: `${cad}, ${L.B.ctx}.`, problematique: L.B.pb, questions: [
        `Calculer les coordonnées du vecteur somme u + v.`,
        `Représenter u, v et u + v sur un repère (règle du parallélogramme).`,
        `Calculer la norme du vecteur u + v.`,
        `Interpréter cette norme dans la situation (${L.B.interp}).`, R5] },
      C: { contexte: `${cad}, ${L.C.ctx}.`, problematique: L.C.pb, questions: [
        `Calculer les coordonnées du vecteur AB.`,
        `Calculer les coordonnées du vecteur somme AB + w.`,
        `Calculer la norme de ce vecteur somme.`,
        `Comparer cette norme à celle de AB seul et expliquer la différence.`, R5] },
    };
  },
};

/* ---------- TD04 : trigonométrie (1ère) ---------- */
const G4_LIB = { trpm: "un angle de coupe sur un tour", tci: "un angle de pliage", mcc: "un angle de coupe de tissu" };
export const G4 = {
  params: G4_LIB,
  build: (P, N, cad) => ({
    A: { contexte: `${cad}, on doit régler ${P} de 45°, 90° et 180°.`,
      problematique: `Quelles sont les valeurs en radians, et le cosinus et le sinus de ces trois angles ?`, questions: [
        `Convertir 45°, 90° et 180° en radians (formule α_rad = α_deg × π/180).`,
        `Relever ou calculer le cosinus de chacun de ces trois angles.`,
        `Relever ou calculer le sinus de chacun de ces trois angles.`,
        `Placer les trois angles sur le cercle trigonométrique.`, R5] },
    B: { contexte: `${cad}, on modélise ${P} de mesure α = π/3 par le point image M sur le cercle trigonométrique.`,
      problematique: `Quelles sont les coordonnées du point M pour α = π/3 ?`, questions: [
        `Construire le cercle trigonométrique avec GéoGébra.`,
        `Placer le point M correspondant à l'angle α = π/3.`,
        `Relever les coordonnées (cos α ; sin α) de M.`,
        `Comparer ces valeurs aux valeurs usuelles connues.`, R5] },
    C: { contexte: `${cad}, on veut relier la lecture graphique sur le cercle trigonométrique aux valeurs usuelles pour ${P}.`,
      problematique: `Comment retrouver rapidement le cosinus et le sinus des angles usuels sans calculatrice ?`, questions: [
        `Rappeler le tableau des valeurs usuelles (0, π/6, π/4, π/3, π/2).`,
        `Relire ces valeurs sur le cercle trigonométrique construit.`,
        `Choisir un angle usuel et vérifier la correspondance table / cercle.`,
        `Expliquer la symétrie du cercle qui permet de retrouver certaines valeurs.`, R5] },
  }),
};

export const PUZZLES_GEOMETRIE = { td01: G1, td02: G2, td03: G3, td04: G4 };

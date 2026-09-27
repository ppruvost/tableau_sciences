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

/* ---------- TD03 : vecteurs (1ère plan, Tle espace) ---------- */
const G3_LIB = {
  trpm: { n: "une force de coupe", n2: "un déplacement d'outil" }, tci: { n: "un effort de cintrage", n2: "un déplacement de tôle" },
  mcc: { n: "une tension de fil", n2: "un déplacement d'aiguille" }, log: { n: "un trajet de livraison", n2: "un déplacement de marchandise" },
  agora: { n: "un déplacement de dossier", n2: "un second déplacement" },
};
export const G3 = {
  params: G3_LIB,
  build: (P, N, cad) => {
    if (N === 'tle') return {
      A: { contexte: `${cad}, un point de départ A(1 ; 2 ; 0) et un point d'arrivée B(4 ; 6 ; 12) repèrent ${P.n2} dans l'espace.`,
        problematique: `Quelle est la longueur de ce déplacement dans l'espace ?`, questions: [
          `Calculer les coordonnées du vecteur AB (xB − xA ; yB − yA ; zB − zA).`,
          `Rappeler la formule de la norme d'un vecteur de l'espace.`,
          `Calculer la norme de AB.`,
          `Interpréter cette norme dans la situation (distance parcourue).`, R5] },
      B: { contexte: `${cad}, deux vecteurs de l'espace sont donnés : u(2 ; 4 ; 6) et v(1 ; 2 ; 3), modélisant ${P.n}.`,
        problematique: `Ces deux vecteurs représentent-ils la même direction ?`, questions: [
          `Rappeler la condition de colinéarité de deux vecteurs de l'espace.`,
          `Chercher un réel k tel que u = k × v sur chaque coordonnée.`,
          `Vérifier que ce réel k convient pour les trois coordonnées.`,
          `Conclure sur la colinéarité de u et v.`, R5] },
      C: { contexte: `${cad}, on combine les deux résultats précédents (norme dans l'espace et colinéarité) pour analyser ${P.n2}.`,
        problematique: `Comment décider si deux déplacements dans l'espace ont la même direction et comparer leurs longueurs ?`, questions: [
          `Rappeler la méthode pour calculer une norme dans l'espace.`,
          `Rappeler la méthode pour tester la colinéarité de deux vecteurs.`,
          `Appliquer ces deux méthodes à un exemple choisi par le groupe.`,
          `Discuter des cas où colinéarité et normes égales suffisent à conclure à l'égalité de deux vecteurs.`, R5] },
    };
    return {
      A: { contexte: `${cad}, un point de départ A(2 ; 1) et un point d'arrivée B(7 ; 13) repèrent ${P.n2}.`,
        problematique: `Quelles sont les coordonnées et la longueur de ce déplacement ?`, questions: [
          `Calculer les coordonnées du vecteur AB.`,
          `Rappeler la formule de la norme d'un vecteur du plan.`,
          `Calculer la norme de AB.`,
          `Interpréter cette norme dans la situation (distance).`, R5] },
      B: { contexte: `${cad}, deux vecteurs u(5 ; 0) et v(0 ; 3) modélisent ${P.n}.`,
        problematique: `Quel est le vecteur résultant de u et v, et quelle est son intensité ?`, questions: [
          `Calculer les coordonnées du vecteur somme u + v.`,
          `Représenter u, v et u + v sur un repère (règle du parallélogramme).`,
          `Calculer la norme du vecteur résultant.`,
          `Interpréter cette norme dans la situation.`, R5] },
      C: { contexte: `${cad}, on combine un déplacement AB (A(2 ; 1), B(7 ; 13)) avec une action modélisée par le vecteur v(0 ; 3).`,
        problematique: `Quel est le vecteur final AB + v, et quelle est sa longueur ?`, questions: [
          `Calculer les coordonnées du vecteur AB.`,
          `Calculer les coordonnées du vecteur somme AB + v.`,
          `Calculer la norme de ce vecteur somme.`,
          `Comparer cette norme à celle de AB seul.`, R5] },
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

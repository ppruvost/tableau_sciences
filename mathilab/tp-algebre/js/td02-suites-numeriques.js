/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * TD02 : Étudier et comparer des suites numériques
 * (1ère : suites arithmétiques / Tle : suites géométriques)
 * mathilab/tp-algebre/js/td02-suites-numeriques.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';
import { initContextePro } from '../../js/contexte-pro.js';
import {
  calculerTermesSuiteArithmetique, calculerTermesSuiteGeometrique,
  sommeTermes, sensVariationArithmetique, sensVariationGeometrique,
  dessinerNuagePoints
} from '../../js/algebre.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-algebre.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

import { initPuzzle, CADRES, fmt, polynome } from './puzzle-algebre.js';

const CONTEXTES_TD02 = {
  '1ere-trpm': {
    contexte: "Le coût d'une intervention de maintenance comprend des frais fixes, puis un tarif horaire constant (variation constante) ; la valeur d'un équipement se déprécie d'un pourcentage fixe chaque année (taux fixe).",
    problematique: "Quel est le coût facturé pour n heures d'intervention, et comment évolue la valeur d'un équipement au fil des années ?",
  },
  '1ere-tci': {
    contexte: "La production d'un atelier de chaudronnerie augmente d'un nombre fixe de pièces chaque semaine (variation constante) ; la valeur d'un équipement se déprécie d'un pourcentage fixe chaque année (taux fixe).",
    problematique: "Combien de pièces l'atelier produira-t-il à la semaine n, et comment évolue la valeur de l'équipement au fil du temps ?",
  },
  '1ere-mcc': {
    contexte: "Un atelier de confection augmente sa production d'un nombre fixe de pièces chaque semaine (variation constante) ; la valeur d'une machine à coudre se déprécie d'un pourcentage fixe chaque année (taux fixe).",
    problematique: "Combien de pièces l'atelier produira-t-il à la semaine n, et comment évolue la valeur de l'équipement au fil du temps ?",
  },
  '1ere-log': {
    contexte: "Le tarif d'un transporteur comprend des frais fixes, puis un montant constant par kilomètre (variation constante) ; le volume de colis traité par un entrepôt augmente d'un pourcentage fixe chaque mois (taux fixe).",
    problematique: "Quel est le coût facturé pour n kilomètres, et quel volume de colis l'entrepôt devra-t-il traiter dans n mois ?",
  },
  '1ere-agora': {
    contexte: "Le nombre de dossiers traités par une structure administrative augmente d'un nombre fixe chaque semaine (variation constante) ; un budget de fonctionnement évolue d'un pourcentage fixe chaque année (taux fixe).",
    problematique: "Combien de dossiers seront traités à la semaine n, et comment évolue le budget au fil des années ?",
  },
  'tle-trpm': {
    contexte: "La cadence d'une machine de production augmente d'un pourcentage fixe chaque jour (suite géométrique) ; ce même modèle décrit la dépréciation d'un équipement.",
    problematique: "Quelle sera la production de la machine après n jours, et quelle est la production totale cumulée ?",
  },
  'tle-tci': {
    contexte: "La production d'un atelier de chaudronnerie augmente d'un pourcentage fixe chaque jour (suite géométrique) ; ce même modèle décrit la dépréciation d'un équipement.",
    problematique: "Quelle sera la production de l'atelier après n jours, et quelle est la production totale cumulée ?",
  },
  'tle-mcc': {
    contexte: "La valeur d'un équipement de confection se déprécie d'un même pourcentage chaque année (suite géométrique).",
    problematique: "Comment évolue la valeur de l'équipement au fil des années, et à partir de quand faut-il le remplacer ?",
  },
  'tle-log': {
    contexte: "Le volume de colis traité par un entrepôt augmente d'un pourcentage fixe chaque mois (suite géométrique).",
    problematique: "Quel volume de colis l'entrepôt devra-t-il traiter dans n mois, et quel volume cumulé sur la période ?",
  },
  'tle-agora': {
    contexte: "Le nombre de dossiers traités par une structure administrative augmente d'un pourcentage fixe chaque mois (suite géométrique).",
    problematique: "Quel nombre de dossiers la structure devra-t-elle traiter dans n mois, et quel nombre cumulé sur la période ?",
  },
};

/* ============================================================
   ACTIVITÉS PUZZLE — sujets A/B/C liés à la filière et au niveau
   (mêmes clés que CONTEXTES_TD02)
   ============================================================ */

const PUZZLE_TD02 = {
  '1ere-trpm': {
    grandeurArith: 'le coût facturé (en €)', periodeArith: 'heure', u0A: 35, rA: 22,
    grandeurGeo: 'la valeur de l’équipement (en €)', periodeGeo: 'année', u0G: 8000, qG: 0.90,
  },
  '1ere-tci': {
    grandeurArith: 'le nombre de pièces produites', periodeArith: 'semaine', u0A: 200, rA: 15,
    grandeurGeo: 'la valeur de l’équipement (en €)', periodeGeo: 'année', u0G: 12000, qG: 0.88,
  },
  '1ere-mcc': {
    grandeurArith: 'le nombre de pièces confectionnées', periodeArith: 'semaine', u0A: 150, rA: 10,
    grandeurGeo: 'la valeur de la machine à coudre (en €)', periodeGeo: 'année', u0G: 3000, qG: 0.85,
  },
  '1ere-log': {
    grandeurArith: 'le coût facturé (en €)', periodeArith: 'kilomètre', u0A: 60, rA: 1.2,
    grandeurGeo: 'le volume de colis traités', periodeGeo: 'mois', u0G: 800, qG: 1.05,
  },
  '1ere-agora': {
    grandeurArith: 'le nombre de dossiers traités', periodeArith: 'semaine', u0A: 40, rA: 5,
    grandeurGeo: 'le budget de fonctionnement (en €)', periodeGeo: 'année', u0G: 50000, qG: 1.03,
  },
  'tle-trpm': {
    grandeurArith: 'la production journalière (en pièces usinées)', periodeArith: 'jour', u0A: 500, rA: 20,
    grandeurGeo: 'la production journalière (en pièces usinées)', periodeGeo: 'jour', u0G: 500, qG: 1.04,
  },
  'tle-tci': {
    grandeurArith: 'la production journalière (en pièces chaudronnées)', periodeArith: 'jour', u0A: 400, rA: 15,
    grandeurGeo: 'la production journalière (en pièces chaudronnées)', periodeGeo: 'jour', u0G: 400, qG: 1.03,
  },
  'tle-mcc': {
    grandeurArith: 'la production journalière (en pièces confectionnées)', periodeArith: 'jour', u0A: 300, rA: 10,
    grandeurGeo: 'la valeur de la machine à coudre (en €)', periodeGeo: 'année', u0G: 3000, qG: 0.85,
  },
  'tle-log': {
    grandeurArith: 'le volume de colis traités', periodeArith: 'mois', u0A: 800, rA: 60,
    grandeurGeo: 'le volume de colis traités', periodeGeo: 'mois', u0G: 800, qG: 1.05,
  },
  'tle-agora': {
    grandeurArith: 'le nombre de dossiers traités', periodeArith: 'mois', u0A: 200, rA: 15,
    grandeurGeo: 'le nombre de dossiers traités', periodeGeo: 'mois', u0G: 200, qG: 1.06,
  },
};

function pourcentageDepuisQ(q) {
  const p = Math.round((q - 1) * 10000) / 100;
  return p >= 0 ? `+${p} %` : `${p} %`;
}

const LIBELLES_RESULTATS = [
  ['nombreTermes', 'Nombre de termes calculés'],
  ['dernierTerme', 'Dernier terme calculé'],
  ['sens', 'Sens de variation'],
  ['somme', 'Somme des n premiers termes'],
];

function formater(v) {
  return typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v;
}

/* ============================================================
   NIVEAU 1ère — SUITES ARITHMÉTIQUES (préfixe ar-)
   ============================================================ */

function calculerEtAfficherSuiteArithmetique() {
  const u0 = parseFloat(document.getElementById('ar-u0').value);
  const r = parseFloat(document.getElementById('ar-r').value);
  const n = parseInt(document.getElementById('ar-n').value, 10);

  if (Number.isNaN(u0) || Number.isNaN(r) || Number.isNaN(n) || n < 2) return;

  const termes = calculerTermesSuiteArithmetique(u0, r, n);
  const somme = sommeTermes(termes);
  const variation = sensVariationArithmetique(r);

  document.getElementById('ar-tbody-termes').innerHTML = termes
    .map((t) => `<tr><td>${t.n}</td><td>${formater(t.valeur)}</td></tr>`).join('');

  const resultats = {
    nombreTermes: n,
    dernierTerme: termes[termes.length - 1].valeur,
    sens: `${variation.sens} (${variation.explication})`,
    somme,
  };

  document.getElementById('ar-tbody-resultats').innerHTML = LIBELLES_RESULTATS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(resultats[cle])}</td></tr>`).join('');

  dessinerNuagePoints('ar-nuage', [{ label: 'u(n)', points: termes }]);
}

function initEtudierSuiteArithmetique() {
  document.getElementById('ar-calculer')?.addEventListener('click', calculerEtAfficherSuiteArithmetique);
  calculerEtAfficherSuiteArithmetique();
}

function calculerEtAfficherComparaisonArithmetique() {
  const u0A = parseFloat(document.getElementById('ar-cs-u0-a').value);
  const rA = parseFloat(document.getElementById('ar-cs-r-a').value);
  const u0B = parseFloat(document.getElementById('ar-cs-u0-b').value);
  const rB = parseFloat(document.getElementById('ar-cs-r-b').value);
  const n = parseInt(document.getElementById('ar-cs-n').value, 10);

  const labelA = document.getElementById('ar-cs-label-a').value || 'Évolution A';
  const labelB = document.getElementById('ar-cs-label-b').value || 'Évolution B';
  document.getElementById('ar-cs-th-a').textContent = labelA;
  document.getElementById('ar-cs-th-b').textContent = labelB;

  if ([u0A, rA, u0B, rB, n].some((v) => Number.isNaN(v)) || n < 2) {
    document.getElementById('ar-cs-tbody-comparaison').innerHTML =
      '<tr><td colspan="3">Renseigner les deux évolutions puis cliquer sur « Comparer ».</td></tr>';
    document.getElementById('ar-cs-nuage').innerHTML = '';
    return;
  }

  const termesA = calculerTermesSuiteArithmetique(u0A, rA, n);
  const termesB = calculerTermesSuiteArithmetique(u0B, rB, n);
  const sommeA = sommeTermes(termesA);
  const sommeB = sommeTermes(termesB);
  const variationA = sensVariationArithmetique(rA);
  const variationB = sensVariationArithmetique(rB);

  const lignes = [
    ['Dernier terme', formater(termesA[termesA.length - 1].valeur), formater(termesB[termesB.length - 1].valeur)],
    ['Sens de variation', variationA.sens, variationB.sens],
    ['Somme des n premiers termes', formater(sommeA), formater(sommeB)],
  ];

  document.getElementById('ar-cs-tbody-comparaison').innerHTML = lignes
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join('');

  dessinerNuagePoints('ar-cs-nuage', [
    { label: labelA, points: termesA, couleur: 'var(--couleur-primaire, #2563eb)' },
    { label: labelB, points: termesB, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initComparerSuitesArithmetiques() {
  document.getElementById('ar-cs-calculer')?.addEventListener('click', calculerEtAfficherComparaisonArithmetique);
  ['ar-cs-label-a', 'ar-cs-label-b'].forEach((id) =>
    document.getElementById(id)?.addEventListener('input', calculerEtAfficherComparaisonArithmetique));
  calculerEtAfficherComparaisonArithmetique();
}

/* ============================================================
   NIVEAU Tle — SUITES GÉOMÉTRIQUES (préfixe geo-)
   ============================================================ */

function calculerEtAfficherSuiteGeometrique() {
  const u0 = parseFloat(document.getElementById('geo-u0').value);
  const q = parseFloat(document.getElementById('geo-q').value);
  const n = parseInt(document.getElementById('geo-n').value, 10);

  if (Number.isNaN(u0) || Number.isNaN(q) || q <= 0 || Number.isNaN(n) || n < 2) return;

  const termes = calculerTermesSuiteGeometrique(u0, q, n);
  const somme = sommeTermes(termes);
  const variation = sensVariationGeometrique(u0, q);

  document.getElementById('geo-tbody-termes').innerHTML = termes
    .map((t) => `<tr><td>${t.n}</td><td>${formater(t.valeur)}</td></tr>`).join('');

  const resultats = {
    nombreTermes: n,
    dernierTerme: termes[termes.length - 1].valeur,
    sens: `${variation.sens} (${variation.explication})`,
    somme,
  };

  document.getElementById('geo-tbody-resultats').innerHTML = LIBELLES_RESULTATS
    .map(([cle, label]) => `<tr><td>${label}</td><td>${formater(resultats[cle])}</td></tr>`).join('');

  dessinerNuagePoints('geo-nuage', [{ label: 'u(n)', points: termes }]);
}

function initEtudierSuiteGeometrique() {
  document.getElementById('geo-calculer')?.addEventListener('click', calculerEtAfficherSuiteGeometrique);
  calculerEtAfficherSuiteGeometrique();
}

function calculerEtAfficherComparaisonGeometrique() {
  const u0A = parseFloat(document.getElementById('geo-cs-u0-a').value);
  const qA = parseFloat(document.getElementById('geo-cs-q-a').value);
  const u0B = parseFloat(document.getElementById('geo-cs-u0-b').value);
  const qB = parseFloat(document.getElementById('geo-cs-q-b').value);
  const n = parseInt(document.getElementById('geo-cs-n').value, 10);

  const labelA = document.getElementById('geo-cs-label-a').value || 'Évolution A';
  const labelB = document.getElementById('geo-cs-label-b').value || 'Évolution B';
  document.getElementById('geo-cs-th-a').textContent = labelA;
  document.getElementById('geo-cs-th-b').textContent = labelB;

  if ([u0A, qA, u0B, qB, n].some((v) => Number.isNaN(v)) || qA <= 0 || qB <= 0 || n < 2) {
    document.getElementById('geo-cs-tbody-comparaison').innerHTML =
      '<tr><td colspan="3">Renseigner les deux évolutions puis cliquer sur « Comparer ».</td></tr>';
    document.getElementById('geo-cs-nuage').innerHTML = '';
    return;
  }

  const termesA = calculerTermesSuiteGeometrique(u0A, qA, n);
  const termesB = calculerTermesSuiteGeometrique(u0B, qB, n);
  const sommeA = sommeTermes(termesA);
  const sommeB = sommeTermes(termesB);
  const variationA = sensVariationGeometrique(u0A, qA);
  const variationB = sensVariationGeometrique(u0B, qB);

  const lignes = [
    ['Dernier terme', formater(termesA[termesA.length - 1].valeur), formater(termesB[termesB.length - 1].valeur)],
    ['Sens de variation', variationA.sens, variationB.sens],
    ['Somme des n premiers termes', formater(sommeA), formater(sommeB)],
  ];

  document.getElementById('geo-cs-tbody-comparaison').innerHTML = lignes
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join('');

  dessinerNuagePoints('geo-cs-nuage', [
    { label: labelA, points: termesA, couleur: 'var(--couleur-primaire, #2563eb)' },
    { label: labelB, points: termesB, couleur: 'var(--couleur-secondaire, #dc2626)' },
  ]);
}

function initComparerSuitesGeometriques() {
  document.getElementById('geo-cs-calculer')?.addEventListener('click', calculerEtAfficherComparaisonGeometrique);
  ['geo-cs-label-a', 'geo-cs-label-b'].forEach((id) =>
    document.getElementById(id)?.addEventListener('input', calculerEtAfficherComparaisonGeometrique));
  calculerEtAfficherComparaisonGeometrique();
}

/* ============================================================
   ACTIVITÉS PUZZLE — rendu dynamique selon filière et niveau
   ============================================================ */

function construirePuzzleTD02(cle) {
  const d = PUZZLE_TD02[cle];
  if (!d) return null;
  const [niv, fil] = cle.split('-');
  const tle = niv === 'tle';
  const cadre = CADRES[fil];
  const { grandeurArith: gA, periodeArith: pA, u0A, rA, grandeurGeo: gG, periodeGeo: pG, u0G, qG } = d;
  const pct = pourcentageDepuisQ(qG);
  const croit = qG > 1;
  const cibleG = croit ? `u_n ⩾ ${fmt(2 * u0G)}` : `u_n ⩽ ${fmt(u0G / 2)}`;
  const motG = croit ? 'doublé' : 'été divisée par deux';

  const A = {
    contexte: `${cadre}, ${gA} vaut ${fmt(u0A)} au départ, puis augmente de ${fmt(rA)} à chaque ${pA}.`,
    problematique: tle
      ? `Au bout de combien de ${pA}s la valeur initiale de ${gA} aura-t-elle doublé ?`
      : `Quelle valeur atteindra ${gA} après 10 ${pA}s, et quelle sera la somme des 10 premières valeurs ?`,
    questions: [
      `Justifier que l'évolution est arithmétique et donner u0 et la raison r.`,
      `Exprimer u_n en fonction de n.`,
      `Calculer u10, la valeur après 10 ${pA}s.`,
      tle ? `Résoudre l'inéquation u_n ⩾ ${fmt(2 * u0A)} pour trouver le plus petit entier n cherché.`
          : `Calculer la somme S = u0 + u1 + … + u9 à l'aide de la formule.`,
      `Répondre à la problématique par une phrase, avec l'unité.`],
  };
  const B = {
    contexte: `${cadre}, ${gG} vaut ${fmt(u0G)} au départ, puis évolue de ${pct} à chaque ${pG}.`,
    problematique: tle
      ? `Au bout de combien de ${pG}s la valeur initiale de ${gG} aura-t-elle ${motG} ?`
      : `Quelle valeur atteindra ${gG} après 10 ${pG}s, et quelle sera la somme des 10 premières valeurs ?`,
    questions: [
      `Justifier que l'évolution est géométrique et donner u0 et la raison q = 1 + t.`,
      `Exprimer u_n = u0 × q^n en fonction de n.`,
      `Calculer u10, la valeur après 10 ${pG}s.`,
      tle ? `À l'aide de la calculatrice (tableau de valeurs), trouver le plus petit entier n tel que ${cibleG}.`
          : `Calculer la somme S = u0 + u1 + … + u9 avec la formule u0 × (1 − q^10) / (1 − q).`,
      `Répondre à la problématique par une phrase, avec l'unité.`],
  };
  const C = {
    contexte: tle
      ? `${cadre}, on compare deux évolutions : l'une à variation constante (+${fmt(rA)} par ${pA}), l'autre à taux fixe (${pct} par ${pG}).`
      : `${cadre}, deux grandeurs sont suivies en parallèle : ${gA} (variation constante) et ${gG} (taux fixe de ${pct}).`,
    problematique: tle
      ? `Laquelle des deux évolutions atteint la première son seuil (doublement ou division par deux) ?`
      : `Après 10 périodes, laquelle des deux grandeurs a le plus évolué, en pourcentage ?`,
    questions: tle ? [
      `Sujet A : déterminer le nombre de ${pA}s nécessaire pour que ${gA} double.`,
      `Sujet B : déterminer le nombre de ${pG}s nécessaire pour que ${gG} ${croit ? 'double' : 'soit divisée par deux'}.`,
      `Comparer les deux durées.`,
      `Expliquer la différence entre une évolution à variation constante et une évolution à taux fixe sur le long terme.`,
      `Répondre à la problématique par une recommandation argumentée.`
    ] : [
      `Calculer u10 pour la suite arithmétique (sujet A).`,
      `Calculer u10 pour la suite géométrique (sujet B).`,
      `Calculer, pour chacune, la variation relative (u10 − u0) / u0 en pourcentage.`,
      `Comparer les deux résultats et expliquer la différence entre variation constante et taux fixe.`,
      `Répondre à la problématique par une phrase.`],
  };
  return { A, B, C };
}

function initActivitesPuzzleTD02() {
  initPuzzle(construirePuzzleTD02);
}

/* ============================================================
   INITIALISATION
   ============================================================ */

initOngletsParFiliere();
initContextePro({ filieres: FILIERES_PRO, contextes: CONTEXTES_TD02 });

initEtudierSuiteArithmetique();
initComparerSuitesArithmetiques();

initEtudierSuiteGeometrique();
initComparerSuitesGeometriques();

initActivitesPuzzleTD02();

initRadarCompetences();
initImpressionCompteRendu({ titre: 'Étudier et comparer des suites numériques', tp: 'TD02' });
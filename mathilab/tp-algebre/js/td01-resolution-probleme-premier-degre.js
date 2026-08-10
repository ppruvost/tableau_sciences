/**
 * ============================================================
 * MATHILAB — ALGÈBRE / ANALYSE
 * TD01 : Résoudre un problème du premier degré
 * mathilab/tp-algebre/js/td01-resolution-probleme-premier-degre.js
 * ============================================================
 */

import FILIERES_PRO from '../../data/filieres.js';

import {
  initContextePro
} from '../../js/contexte-pro.js';

import {
  initRadarCompetences
} from '../../js/radar.js';

import {
  initImpressionCompteRendu
} from './compte-rendu-algebre.js';

import {
  initOngletsParFiliere
} from '../../js/onglets-filiere.js';

/* ============================================================
   CONTEXTES PROFESSIONNELS — TD01 (2nde)
   ============================================================ */

const CONTEXTES_TD01 = {

  '2nde-remi': {

    contexte:
      "Dans un atelier de maintenance industrielle, une intervention " +
      "sur une machine est facturée avec des frais de déplacement " +
      "fixes, auxquels s'ajoute un tarif horaire.",

    problematique:
      "Comment déterminer la durée d'une intervention à partir du " +
      "montant total d'une facture ?"

  },

  '2nde-mcc': {

    contexte:
      "Dans un atelier de confection, un contrôle qualité est facturé " +
      "avec un forfait de mise en route auquel s'ajoute un tarif par " +
      "pièce contrôlée.",

    problematique:
      "Comment déterminer le nombre de pièces contrôlées à partir du " +
      "montant total d'une facture ?"

  },

  '2nde-gatl': {

    contexte:
      "Dans le domaine du transport et de la logistique, un trajet est " +
      "facturé avec des frais de prise en charge fixes, auxquels " +
      "s'ajoute un tarif kilométrique.",

    problematique:
      "Comment déterminer la distance parcourue à partir du montant " +
      "total d'une facture de transport ?"

  }

};

/* ============================================================
   PROBLÈMES DE MISE EN ÉQUATION (onglet 4)
   ============================================================ */

const PROBLEMES = [

  {
    id: 'remi',
    filiereLabel: 'Maintenance industrielle',
    enonce:
      "Un technicien facture 35 € de déplacement, plus 22 € par heure " +
      "d'intervention sur une machine. Pour quelle durée x (en heures) " +
      "sa facture atteint-elle 145 € ?",
    a: 22,
    b: 35,
    c: 145,
    equationsAcceptees: ['22x+35=145', '35+22x=145'],
    interpretation: "x est une durée en heures : l'intervention a duré 5 heures."
  },

  {
    id: 'mcc',
    filiereLabel: 'Confection',
    enonce:
      "Un atelier de confection facture un forfait de mise en route de " +
      "40 €, puis 15 € par pièce contrôlée. Pour quel nombre x de " +
      "pièces la facture atteint-elle 190 € ?",
    a: 15,
    b: 40,
    c: 190,
    equationsAcceptees: ['15x+40=190', '40+15x=190'],
    interpretation: "x est un nombre de pièces : 10 pièces ont été contrôlées."
  },

  {
    id: 'gatl',
    filiereLabel: 'Transport et logistique',
    enonce:
      "Un transporteur facture 60 € de prise en charge, plus 1,20 € " +
      "par kilomètre parcouru. Pour quelle distance x (en km) la " +
      "facture atteint-elle 300 € ?",
    a: 1.2,
    b: 60,
    c: 300,
    equationsAcceptees: ['1.2x+60=300', '60+1.2x=300'],
    interpretation: "x est une distance en kilomètres : le trajet fait 200 km."
  }

];

/* ============================================================
   OUTILS NUMÉRIQUES ET TEXTUELS
   ============================================================ */

function lireNombre(champ) {
  if (!champ) return null;
  const valeur = parseFloat(champ.value);
  return Number.isFinite(valeur) ? valeur : null;
}

function afficherMessage(message, type = 'erreur') {
  const zone = document.getElementById('alg01-message');
  if (!zone) return;
  zone.textContent = message;
  zone.className = `feedback-verification ${type}`;
}

function effacerMessage() {
  const zone = document.getElementById('alg01-message');
  if (!zone) return;
  zone.textContent = '';
  zone.className = 'feedback-verification';
}

function formaterNombre(valeur) {
  if (!Number.isFinite(valeur)) return '';
  const arrondi = Math.round(valeur * 10000) / 10000;
  if (Number.isInteger(arrondi)) return String(arrondi);
  return String(arrondi).replace('.', ',');
}

function texteCoefficient(a) {
  if (a === 1) return 'x';
  if (a === -1) return '−x';
  return `${formaterNombre(a)}x`;
}

function texteConstanteSignee(valeur) {
  if (valeur === 0) return '';
  return valeur > 0
    ? ` + ${formaterNombre(valeur)}`
    : ` − ${formaterNombre(Math.abs(valeur))}`;
}

function normaliserEquation(texte) {
  return (texte || '')
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .toLowerCase();
}

/* ============================================================
   ONGLET 1 — ÉQUATION DU PREMIER DEGRÉ
   ============================================================ */

function resoudreEquationPremierDegre(a, b, c) {
  const etapes = [];

  etapes.push(`${texteCoefficient(a)}${texteConstanteSignee(b)} = ${formaterNombre(c)}`);

  if (a === 0) {
    if (b === c) {
      etapes.push("0 = 0 : l'égalité est vraie quelle que soit la valeur de x → une infinité de solutions (𝕊 = ℝ).");
    } else {
      etapes.push(`${formaterNombre(b)} ≠ ${formaterNombre(c)} : l'égalité est impossible → aucune solution (𝕊 = ∅).`);
    }
    return { etapes, solution: null };
  }

  const membreDroit = c - b;

  etapes.push(`${texteCoefficient(a)} = ${formaterNombre(c)}${texteConstanteSignee(-b)}`);
  etapes.push(`${texteCoefficient(a)} = ${formaterNombre(membreDroit)}`);

  const x = membreDroit / a;

  etapes.push(`x = ${formaterNombre(membreDroit)} ÷ ${formaterNombre(a)}`);
  etapes.push(`x = ${formaterNombre(x)}`);

  return { etapes, solution: x };
}

function afficherEtapes(listeId, etapes) {
  const liste = document.getElementById(listeId);
  if (!liste) return;

  liste.innerHTML = etapes
    .map(
      (etape, index) =>
        `<li${index === etapes.length - 1 ? ' class="etape-resultat"' : ''}>${etape}</li>`
    )
    .join('');
}

function initOngletEquation() {
  const bouton = document.getElementById('eq-resoudre');

  function resoudre() {
    const a = lireNombre(document.getElementById('eq-a'));
    const b = lireNombre(document.getElementById('eq-b'));
    const c = lireNombre(document.getElementById('eq-c'));

    if (a === null || b === null || c === null) {
      afficherMessage('Saisir trois nombres valides (a, b et c).');
      return;
    }

    effacerMessage();

    const { etapes } = resoudreEquationPremierDegre(a, b, c);
    afficherEtapes('eq-etapes', etapes);
  }

  bouton?.addEventListener('click', resoudre);

  resoudre();
}

/* ============================================================
   ONGLET 2 — INÉQUATION DU PREMIER DEGRÉ
   ============================================================ */

const SYMBOLES_OPERATEUR = { lt: '<', le: '≤', gt: '>', ge: '≥' };
const OPERATEUR_INVERSE = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' };

function resoudreInequationPremierDegre(a, b, operateur, c) {
  const etapes = [];

  etapes.push(
    `${texteCoefficient(a)}${texteConstanteSignee(b)} ${SYMBOLES_OPERATEUR[operateur]} ${formaterNombre(c)}`
  );

  if (a === 0) {
    const comparaisons = {
      lt: b < c,
      le: b <= c,
      gt: b > c,
      ge: b >= c
    };

    if (comparaisons[operateur]) {
      etapes.push(`${formaterNombre(b)} ${SYMBOLES_OPERATEUR[operateur]} ${formaterNombre(c)} est toujours vrai → 𝕊 = ℝ.`);
    } else {
      etapes.push(`${formaterNombre(b)} ${SYMBOLES_OPERATEUR[operateur]} ${formaterNombre(c)} est toujours faux → 𝕊 = ∅.`);
    }

    return { etapes, borne: null, operateurFinal: null };
  }

  const membreDroit = c - b;

  etapes.push(
    `${texteCoefficient(a)} ${SYMBOLES_OPERATEUR[operateur]} ${formaterNombre(c)}${texteConstanteSignee(-b)}`
  );
  etapes.push(
    `${texteCoefficient(a)} ${SYMBOLES_OPERATEUR[operateur]} ${formaterNombre(membreDroit)}`
  );

  let operateurFinal = operateur;

  if (a < 0) {
    operateurFinal = OPERATEUR_INVERSE[operateur];
    etapes.push(`On divise par ${formaterNombre(a)}, un nombre négatif : le sens de l'inégalité change.`);
  }

  const borne = membreDroit / a;

  etapes.push(`x ${SYMBOLES_OPERATEUR[operateurFinal]} ${formaterNombre(borne)}`);

  return { etapes, borne, operateurFinal };
}

function notationDepuisInegalite(operateur, borne) {
  const b = formaterNombre(borne);
  switch (operateur) {
    case 'lt': return `]−∞ ; ${b}[`;
    case 'le': return `]−∞ ; ${b}]`;
    case 'gt': return `]${b} ; +∞[`;
    case 'ge': return `[${b} ; +∞[`;
    default: return '';
  }
}

function dessinerDemiDroite(conteneurId, borne, operateurFinal) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  if (borne === null || operateurFinal === null) {
    conteneur.innerHTML = '';
    return;
  }

  const largeur = 480;
  const hauteur = 90;
  const margeGauche = 40;
  const margeDroite = 40;
  const y = 45;

  const demiEtendue = Math.max(Math.abs(borne), 3) + 4;
  const min = borne - demiEtendue;
  const max = borne + demiEtendue;

  const x = valeur =>
    margeGauche + ((valeur - min) / (max - min)) * (largeur - margeGauche - margeDroite);

  const versGauche = operateurFinal === 'lt' || operateurFinal === 'le';
  const rempli = operateurFinal === 'le' || operateurFinal === 'ge';

  const xBorne = x(borne);
  const xExtreme = versGauche ? margeGauche : (largeur - margeDroite);

  const pointeFleche = versGauche
    ? `<polygon points="${xExtreme},${y} ${xExtreme + 10},${y - 6} ${xExtreme + 10},${y + 6}" fill="var(--domaine-accent)"></polygon>`
    : `<polygon points="${xExtreme},${y} ${xExtreme - 10},${y - 6} ${xExtreme - 10},${y + 6}" fill="var(--domaine-accent)"></polygon>`;

  conteneur.innerHTML = `
    <svg class="droite-graduee-svg" viewBox="0 0 ${largeur} ${hauteur}" role="img" aria-label="Droite graduée représentant la solution">
      <line class="droite-graduee-axe" x1="${margeGauche}" y1="${y}" x2="${largeur - margeDroite}" y2="${y}"></line>
      <line class="droite-graduee-trait" x1="${xBorne}" y1="${y}" x2="${xExtreme}" y2="${y}"></line>
      ${pointeFleche}
      <circle class="droite-graduee-point${rempli ? ' plein' : ''}" cx="${xBorne}" cy="${y}" r="7"></circle>
      <text class="droite-graduee-etiquette" x="${xBorne}" y="${y + 24}">${formaterNombre(borne)}</text>
    </svg>
  `;
}

function initOngletInequation() {
  const bouton = document.getElementById('in-resoudre');

  function resoudre() {
    const a = lireNombre(document.getElementById('in-a'));
    const b = lireNombre(document.getElementById('in-b'));
    const c = lireNombre(document.getElementById('in-c'));
    const operateur = document.getElementById('in-op')?.value || 'lt';

    if (a === null || b === null || c === null) {
      afficherMessage('Saisir trois nombres valides (a, b et c).');
      return;
    }

    effacerMessage();

    const { etapes, borne, operateurFinal } = resoudreInequationPremierDegre(a, b, operateur, c);
    afficherEtapes('in-etapes', etapes);

    const zoneNotation = document.getElementById('in-notation');
    if (zoneNotation) {
      if (borne === null) {
        zoneNotation.style.display = 'none';
      } else {
        zoneNotation.style.display = 'inline-block';
        zoneNotation.textContent = `𝕊 = ${notationDepuisInegalite(operateurFinal, borne)}`;
      }
    }

    dessinerDemiDroite('in-droite', borne, operateurFinal);
  }

  bouton?.addEventListener('click', resoudre);

  resoudre();
}

/* ============================================================
   ONGLET 3 — INTERVALLES DE ℝ
   ============================================================ */

function etatToggle(conteneurId) {
  const actif = document.querySelector(`#${conteneurId} button.actif`);
  return actif?.dataset.etat || 'ferme';
}

function dessinerSegmentIntervalle(conteneurId, a, b, etatGauche, etatDroite) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  if (a === null || b === null || a >= b) {
    conteneur.innerHTML = a !== null && b !== null && a >= b
      ? '<p class="info">La borne gauche doit être strictement inférieure à la borne droite.</p>'
      : '';
    return;
  }

  const largeur = 480;
  const hauteur = 90;
  const margeGauche = 40;
  const margeDroite = 40;
  const y = 45;

  const etendue = (b - a) || 1;
  const min = a - etendue * 0.4;
  const max = b + etendue * 0.4;

  const x = valeur =>
    margeGauche + ((valeur - min) / (max - min)) * (largeur - margeGauche - margeDroite);

  const remplGauche = etatGauche === 'ferme';
  const remplDroite = etatDroite === 'ferme';

  conteneur.innerHTML = `
    <svg class="droite-graduee-svg" viewBox="0 0 ${largeur} ${hauteur}" role="img" aria-label="Segment représentant l'intervalle">
      <line class="droite-graduee-axe" x1="${margeGauche}" y1="${y}" x2="${largeur - margeDroite}" y2="${y}"></line>
      <line class="droite-graduee-trait" x1="${x(a)}" y1="${y}" x2="${x(b)}" y2="${y}"></line>
      <circle class="droite-graduee-point${remplGauche ? ' plein' : ''}" cx="${x(a)}" cy="${y}" r="7"></circle>
      <circle class="droite-graduee-point${remplDroite ? ' plein' : ''}" cx="${x(b)}" cy="${y}" r="7"></circle>
      <text class="droite-graduee-etiquette" x="${x(a)}" y="${y + 24}">${formaterNombre(a)}</text>
      <text class="droite-graduee-etiquette" x="${x(b)}" y="${y + 24}">${formaterNombre(b)}</text>
    </svg>
  `;
}

function initGenerateurIntervalle() {
  function majToggle(conteneurId, boutonClique) {
    document.querySelectorAll(`#${conteneurId} button`).forEach(btn => btn.classList.remove('actif'));
    boutonClique.classList.add('actif');
  }

  ['gi-toggle-gauche', 'gi-toggle-droite'].forEach(conteneurId => {
    document.querySelectorAll(`#${conteneurId} button`).forEach(btn => {
      btn.addEventListener('click', () => {
        majToggle(conteneurId, btn);
        actualiserGenerateur();
      });
    });
  });

  function actualiserGenerateur() {
    const a = lireNombre(document.getElementById('gi-a'));
    const b = lireNombre(document.getElementById('gi-b'));

    const etatGauche = etatToggle('gi-toggle-gauche');
    const etatDroite = etatToggle('gi-toggle-droite');

    const zoneResultat = document.getElementById('gi-resultat');

    if (a === null || b === null) {
      if (zoneResultat) zoneResultat.textContent = '';
      return;
    }

    if (a >= b) {
      if (zoneResultat) zoneResultat.textContent = 'Borne gauche invalide (doit être < borne droite).';
      dessinerSegmentIntervalle('gi-droite', a, b, etatGauche, etatDroite);
      return;
    }

    const crochetGauche = etatGauche === 'ferme' ? '[' : ']';
    const crochetDroite = etatDroite === 'ferme' ? ']' : '[';

    if (zoneResultat) {
      zoneResultat.textContent = `${crochetGauche}${formaterNombre(a)} ; ${formaterNombre(b)}${crochetDroite}`;
    }

    dessinerSegmentIntervalle('gi-droite', a, b, etatGauche, etatDroite);
  }

  document.getElementById('gi-a')?.addEventListener('input', actualiserGenerateur);
  document.getElementById('gi-b')?.addEventListener('input', actualiserGenerateur);

  actualiserGenerateur();
}

const QUIZ_INTERVALLES = [
  { enonce: 'x ≥ −3', correcte: '[−3 ; +∞[', propositions: ['[−3 ; +∞[', ']−3 ; +∞[', ']−∞ ; −3]', ']−∞ ; −3['] },
  { enonce: 'x < 5', correcte: ']−∞ ; 5[', propositions: [']−∞ ; 5[', ']−∞ ; 5]', '[5 ; +∞[', ']5 ; +∞['] },
  { enonce: '−2 ≤ x < 4', correcte: '[−2 ; 4[', propositions: ['[−2 ; 4[', ']−2 ; 4[', '[−2 ; 4]', ']−2 ; 4]'] },
  { enonce: 'x ≤ 0', correcte: ']−∞ ; 0]', propositions: [']−∞ ; 0]', ']−∞ ; 0[', '[0 ; +∞[', ']0 ; +∞['] },
  { enonce: '1 < x ≤ 6', correcte: ']1 ; 6]', propositions: [']1 ; 6]', '[1 ; 6]', ']1 ; 6[', '[1 ; 6['] }
];

let scoreQuiz = 0;
let questionsRepondues = 0;

function initQuizIntervalles() {
  const liste = document.getElementById('qi-liste');
  if (!liste) return;

  scoreQuiz = 0;
  questionsRepondues = 0;

  liste.innerHTML = QUIZ_INTERVALLES
    .map((item, index) => `
      <div class="quiz-intervalle-item" data-index="${index}">
        <div class="quiz-intervalle-enonce">${item.enonce}</div>
        <div class="quiz-intervalle-options">
          ${item.propositions
            .map(prop => `<button type="button" data-valeur="${prop}">${prop}</button>`)
            .join('')}
        </div>
      </div>
    `)
    .join('');

  liste.querySelectorAll('.quiz-intervalle-item').forEach(itemEl => {
    const index = parseInt(itemEl.dataset.index, 10);
    const item = QUIZ_INTERVALLES[index];

    itemEl.querySelectorAll('button').forEach(bouton => {
      bouton.addEventListener('click', () => {
        if (itemEl.dataset.repondu === 'true') return;

        itemEl.dataset.repondu = 'true';
        questionsRepondues += 1;

        const bonneValeur = item.correcte;

        itemEl.querySelectorAll('button').forEach(b => {
          if (b.dataset.valeur === bonneValeur) {
            b.classList.add('bonne-reponse');
          } else if (b === bouton) {
            b.classList.add('mauvaise-reponse');
          }
        });

        if (bouton.dataset.valeur === bonneValeur) {
          scoreQuiz += 1;
        }

        majScoreQuiz();
      });
    });
  });

  majScoreQuiz();
}

function majScoreQuiz() {
  const zone = document.getElementById('qi-score');
  if (!zone) return;
  zone.textContent = `Score : ${scoreQuiz} / ${QUIZ_INTERVALLES.length} (${questionsRepondues} question${questionsRepondues > 1 ? 's' : ''} traitée${questionsRepondues > 1 ? 's' : ''})`;
}

/* ============================================================
   ONGLET 4 — TRADUIRE UN PROBLÈME
   ============================================================ */

function initOngletProbleme() {
  const select = document.getElementById('pb-select');
  const zoneEnonce = document.getElementById('pb-enonce');
  const champEquation = document.getElementById('pb-equation');
  const boutonVerifier = document.getElementById('pb-verifier');
  const zoneFeedback = document.getElementById('pb-feedback');
  const boutonSolution = document.getElementById('pb-solution');
  const zoneInterpretation = document.getElementById('pb-interpretation');

  if (!select) return;

  select.innerHTML = PROBLEMES
    .map(p => `<option value="${p.id}">${p.filiereLabel}</option>`)
    .join('');

  function probleme() {
    return PROBLEMES.find(p => p.id === select.value) || PROBLEMES[0];
  }

  function reinitialiser() {
    const p = probleme();

    if (zoneEnonce) zoneEnonce.textContent = p.enonce;
    if (champEquation) champEquation.value = '';

    if (zoneFeedback) {
      zoneFeedback.textContent = '';
      zoneFeedback.className = 'feedback-verification';
    }

    if (boutonSolution) boutonSolution.style.display = 'none';

    afficherEtapes('pb-etapes', []);

    if (zoneInterpretation) zoneInterpretation.textContent = '';
  }

  select.addEventListener('change', reinitialiser);

  boutonVerifier?.addEventListener('click', () => {
    const p = probleme();
    const saisie = normaliserEquation(champEquation?.value);

    const correcte = p.equationsAcceptees.some(
      accepted => normaliserEquation(accepted) === saisie
    );

    if (!zoneFeedback) return;

    if (correcte) {
      zoneFeedback.textContent = 'Équation correcte ! Vous pouvez maintenant la résoudre.';
      zoneFeedback.className = 'feedback-verification succes';
      if (boutonSolution) boutonSolution.style.display = 'inline-block';
    } else {
      zoneFeedback.textContent = "Équation incorrecte. Relire l'énoncé : quel est le montant fixe, quel est le tarif par unité ?";
      zoneFeedback.className = 'feedback-verification erreur';
      if (boutonSolution) boutonSolution.style.display = 'none';
    }
  });

  boutonSolution?.addEventListener('click', () => {
    const p = probleme();
    const { etapes } = resoudreEquationPremierDegre(p.a, p.b, p.c);
    afficherEtapes('pb-etapes', etapes);
    if (zoneInterpretation) zoneInterpretation.textContent = p.interpretation;
  });

  reinitialiser();
}

/* ============================================================
   INITIALISATION
   ============================================================ */

function initialiserTD01() {
  initOngletsParFiliere();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_TD01
  });

  initOngletEquation();
  initOngletInequation();
  initGenerateurIntervalle();
  initQuizIntervalles();
  initOngletProbleme();

  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Résoudre un problème du premier degré',
    tp: 'TD01'
  });
}

initialiserTD01();

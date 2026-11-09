/**
 * ============================================================
 * MATHILAB — Module commun « Activités Puzzle »
 * js/puzzle-onglet.js  (racine du site, partagé par les tp-<domaine>)
 * ============================================================
 * Affiche, dans l'onglet « Activités Puzzle » d'un TD, les sujets A, B et C
 * correspondant à la filière et au niveau choisis dans le menu
 * « Votre filière professionnelle » (#select-filiere-pro, valeurs « niveau-filiere »,
 * ex. « 2nde-remi », « 1ere-trpm », « tle-mcc »).
 *
 * Utilisation (dans le JS du TD) :
 *     import { demarrerPuzzle } from '../../../js/puzzle-onglet.js';
 *     import { G1 } from './puzzle-geometrie.js';
 *     demarrerPuzzle(G1);
 *
 * Un modèle est un objet { params, build } :
 *   - params : { <filiere>: ... } données propres à chaque filière ;
 *   - build(P, N, cad, fil) : renvoie { A, B, C } où chaque sujet est
 *       { contexte, problematique, questions: [q1, q2, q3, q4, R5], titre? }
 *     P = params[filière], N = niveau ('2nde' | '1ere' | 'tle'),
 *     cad = début de phrase « En 2nde REMI », fil = clé de la filière.
 *   Si une filière n'a pas d'entrée dans params, aucun sujet n'est affiché.
 *
 * Le HTML du TD fournit, pour chaque lettre x (a, b, c) :
 *   #puzzle-sujet-x  .fiche-puzzle[data-titre]  #puzzle-x-contexte
 *   #puzzle-x-problematique  #puzzle-x-enonce (<ol>)
 * ainsi que #puzzle-info (message tant qu'aucune filière n'est choisie).
 *
 * Deux modes pour les questions :
 *  - MODE HISTORIQUE (sans option) : les cinq questions sont écrites dans
 *    #puzzle-x-enonce avec une zone de réponse (textarea) ; elles sont reprises
 *    dans le compte rendu.
 *  - MODE « QUESTIONS ÉCRITES » (TD qui suivent le modèle des onglets 1 et 2 :
 *    méthodologie dans l'onglet, 5 questions dans « Trace écrite ») :
 *        demarrerPuzzle(G2, { questionsEcrites: { a: {titre, questions:[5]}, b:…, c:… } });
 *    #puzzle-x-enonce devient facultatif (laissé vide s'il est présent). Le bloc
 *    .questions-bloc[data-onglet="activites-puzzle"] reçoit les 5 questions du
 *    sujet actif, et le <p data-puzzle-rappel> de #puzzle-rappel-ecrit (question 5)
 *    reçoit la problématique du sujet actif, selon niveau et filière.
 *    Options : blocEcrit (sélecteur du bloc), rappelEcrit (sélecteur du conteneur du rappel, #puzzle-rappel-ecrit par défaut :
 *    il est reconstruit avec la seule problématique du sujet actif).
 * ============================================================
 */

/** Cinquième question de chaque sujet : réponse à la problématique. */
export const R5 = 'Répondre à la problématique en vous appuyant sur vos résultats.';

/** Formate un nombre à la française (2 décimales au plus par défaut). */
export const fmt = (n, decimales = 2) =>
  Number(n).toLocaleString('fr-FR', { maximumFractionDigits: decimales });

const NIVEAUX = { '2nde': '2nde', '1ere': '1ère', 'tle': 'Terminale' };
const FILIERES = {
  remi: 'REMI', mcc: 'MCC', gatl: 'GATL', trpm: 'TRPM', tci: 'TCI',
  log: 'Logistique', agora: 'AGorA',
};

const MSG_ATTENTE =
  'Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher les sujets.';
const MSG_ABSENT =
  'Aucun sujet n\'est défini pour cette filière à ce niveau dans ce TD. Choisir une autre filière.';
const MSG_RAPPEL =
  'Sélectionner votre filière professionnelle dans « Contexte professionnel » pour afficher ici la problématique du sujet.';

function decouper(cle) {
  const i = cle.indexOf('-');
  return i < 0 ? { niveau: cle, filiere: '' } : { niveau: cle.slice(0, i), filiere: cle.slice(i + 1) };
}

function viderSujet(lettre) {
  const l = lettre.toLowerCase();
  const ctx = document.getElementById(`puzzle-${l}-contexte`);
  const pb = document.getElementById(`puzzle-${l}-problematique`);
  const ol = document.getElementById(`puzzle-${l}-enonce`);
  if (ctx) ctx.textContent = '';
  if (pb) pb.textContent = '';
  if (ol) ol.replaceChildren();
}

function remplirSujet(lettre, sujet, avecQuestions = true) {
  const l = lettre.toLowerCase();
  const ctx = document.getElementById(`puzzle-${l}-contexte`);
  const pb = document.getElementById(`puzzle-${l}-problematique`);
  const ol = document.getElementById(`puzzle-${l}-enonce`);
  if (ctx) ctx.textContent = sujet.contexte || '';
  if (pb) {
    pb.textContent = '';
    if (sujet.problematique) {
      // Dans l'encadré « Problématique » des TD au modèle des onglets 1 et 2,
      // l'étiquette est déjà fournie par le HTML : texte seul.
      if (pb.closest('.problematique-onglet')) {
        pb.textContent = sujet.problematique;
      } else {
        const fort = document.createElement('strong');
        fort.textContent = 'Problématique : ';
        pb.append(fort, document.createTextNode(sujet.problematique));
      }
    }
  }

  // Titre fourni par le modèle (facultatif) : fiche, en-tête du sujet
  if (sujet.titre) {
    const fiche = document.querySelector(`#puzzle-sujet-${l} .fiche-puzzle`);
    if (fiche) fiche.dataset.titre = sujet.titre;
    const entete = document.querySelector(`#puzzle-sujet-${l} .question-entete > strong`);
    if (entete) entete.textContent = `Sujet ${lettre.toUpperCase()} — ${sujet.titre}`;
  }

  if (!ol) return;
  ol.replaceChildren();
  if (!avecQuestions) return;
  const questions = Array.isArray(sujet.questions) ? sujet.questions : [];
  questions.forEach((texte, i) => {
    const dernier = i === questions.length - 1;
    const li = document.createElement('li');
    if (dernier) li.className = 'question-problematique';

    const entete = document.createElement('div');
    entete.className = 'question-entete';
    const fort = document.createElement('strong');
    fort.textContent = texte;
    entete.appendChild(fort);
    if (dernier) {
      const cartouche = document.createElement('span');
      cartouche.className = 'cartouche';
      cartouche.dataset.comp = 'COM';
      cartouche.textContent = 'COM';
      entete.appendChild(cartouche);
    }

    const zone = document.createElement('div');
    zone.className = 'zone-eleve';
    const champ = document.createElement('textarea');
    champ.id = `puzzle-${l}-reponse-${i + 1}`;
    champ.rows = dernier ? 4 : 3;
    champ.placeholder = dernier ? 'Votre réponse à la problématique...' : 'Votre réponse...';
    zone.appendChild(champ);

    li.append(entete, zone);
    ol.appendChild(li);
  });
}

/** Lettre (a, b ou c) du sous-onglet actif. */
function lettreActive(racine) {
  const btn = racine && racine.querySelector('.sous-btn.actif[data-sous]');
  const m = btn && /-([abc])$/.exec(btn.dataset.sous);
  return m ? m[1] : 'a';
}

/**
 * Mode « questions écrites » : adapte les 5 questions de « Trace écrite » au
 * sujet actif et y reporte (question 5) la problématique du sujet actif.
 * Sans option questionsEcrites, ne fait rien (comportement historique).
 */
function synchroniserEcrit(racine, options, sujets) {
  const defs = options && options.questionsEcrites;
  if (!defs) return;

  const lettre = lettreActive(racine);
  const def = defs[lettre];
  const bloc = document.querySelector(
    options.blocEcrit || '.questions-bloc[data-onglet="activites-puzzle"]'
  );
  if (!def || !bloc) return;

  const titre = bloc.querySelector('h4');
  if (titre) {
    titre.textContent =
      `Questions de l'onglet « Activités Puzzle » — Sujet ${lettre.toUpperCase()} : ${def.titre}`;
  }

  const items = bloc.querySelectorAll(':scope > .questions-tp > li');
  (def.questions || []).forEach((texte, i) => {
    const fort = items[i] && items[i].querySelector('.question-entete strong');
    if (fort && fort.textContent !== texte) fort.textContent = texte;
  });

  // Rappel de la question 5 : UNE seule problématique, celle du sujet actif.
  // Le conteneur est reconstruit à chaque synchronisation : tout autre contenu
  // (ex. rappel historique listant les sujets A, B et C) est ainsi remplacé.
  const conteneur = document.querySelector(options.rappelEcrit || '#puzzle-rappel-ecrit');
  if (conteneur) {
    const sujet = sujets && sujets[lettre.toUpperCase()];
    const p = document.createElement('p');
    p.className = 'problematique-rappel';
    p.setAttribute('data-puzzle-rappel', '');
    p.textContent = (sujet && sujet.problematique) || MSG_RAPPEL;
    conteneur.replaceChildren(p);
  }
}

/** Sous-onglets Sujet A / B / C : un clic affiche le panneau correspondant. */
function brancherSousOnglets(racine, apres) {
  if (!racine || racine.dataset.sousPuzzleModule === '1') return;
  racine.dataset.sousPuzzleModule = '1';
  racine.addEventListener('click', (e) => {
    const btn = e.target.closest('.sous-btn[data-sous]');
    if (!btn || !racine.contains(btn)) return;
    racine.querySelectorAll('.sous-btn[data-sous]').forEach((b) => {
      b.classList.toggle('actif', b === btn);
    });
    racine.querySelectorAll('.sous-panel').forEach((p) => {
      const actif = p.id === btn.dataset.sous;
      p.classList.toggle('actif', actif);
      p.style.display = actif ? '' : 'none';
    });
    if (typeof apres === 'function') apres();
  });
}

/**
 * Démarre l'activité puzzle d'un TD à partir de son modèle.
 * Réagit au changement du menu « Votre filière professionnelle ».
 * @param {Object} modele  { params, build }
 * @param {Object} [options]  { questionsEcrites, blocEcrit, rappelEcrit } (voir en-tête)
 */
export function demarrerPuzzle(modele, options = {}) {
  const select = document.getElementById('select-filiere-pro');
  const info = document.getElementById('puzzle-info');
  const racine = document.getElementById('activites-puzzle');
  if (!modele || typeof modele.build !== 'function') {
    console.error('[puzzle-onglet] modèle de puzzle invalide');
    return;
  }

  const modeEcrit = Boolean(options && options.questionsEcrites);
  let sujetsCourants = {};
  const majEcrit = () => synchroniserEcrit(racine, options, sujetsCourants);

  brancherSousOnglets(racine, majEcrit);

  // Garde-fou : si un autre code réécrit le rappel de la question 5 (par exemple
  // en y listant les trois sujets), on rétablit aussitôt la seule problématique
  // du sujet actif. Pas de boucle : l'état rétabli est déjà conforme.
  if (modeEcrit) {
    const conteneur = document.querySelector(options.rappelEcrit || '#puzzle-rappel-ecrit');
    if (conteneur && conteneur.dataset.gardePuzzle !== '1') {
      conteneur.dataset.gardePuzzle = '1';
      new MutationObserver(() => {
        const conforme = conteneur.children.length === 1
          && conteneur.firstElementChild.hasAttribute('data-puzzle-rappel');
        if (!conforme) majEcrit();
      }).observe(conteneur, { childList: true, subtree: true, characterData: true });
    }
  }

  const lettresPresentes = () =>
    ['A', 'B', 'C'].filter((L) => {
      const l = L.toLowerCase();
      return document.getElementById(`puzzle-${l}-enonce`) || document.getElementById(`puzzle-sujet-${l}`);
    });

  const message = (texte) => {
    if (!info) return;
    info.textContent = texte;
    info.hidden = !texte;
    info.style.display = texte ? '' : 'none';
  };

  let derniereCle = null;

  function rafraichir() {
    const cle = select ? select.value : '';
    if (cle === derniereCle) return;
    derniereCle = cle;
    sujetsCourants = {};

    if (!cle) {
      lettresPresentes().forEach(viderSujet);
      message(MSG_ATTENTE);
      majEcrit();
      return;
    }

    const { niveau, filiere } = decouper(cle);
    const P = modele.params ? modele.params[filiere] : undefined;
    if (!P) {
      lettresPresentes().forEach(viderSujet);
      message(MSG_ABSENT);
      majEcrit();
      return;
    }

    try {
      const cad = `En ${NIVEAUX[niveau] || niveau} ${FILIERES[filiere] || filiere.toUpperCase()}`;
      const sujets = modele.build(P, niveau, cad, filiere) || {};
      sujetsCourants = sujets;
      lettresPresentes().forEach((L) => {
        if (sujets[L]) remplirSujet(L, sujets[L], !modeEcrit); else viderSujet(L);
      });
      message('');
    } catch (err) {
      console.error('[puzzle-onglet] construction des sujets impossible :', err);
      sujetsCourants = {};
      lettresPresentes().forEach(viderSujet);
      message('Les sujets n\'ont pas pu être affichés pour cette filière.');
    }
    majEcrit();
  }

  if (select) {
    select.addEventListener('change', rafraichir);
    // Valeur déjà sélectionnée au chargement (retour sur le TD, navigateur qui restaure le choix)
    rafraichir();
  } else {
    message(MSG_ATTENTE);
  }

  // Textes des questions du sujet actif dès le chargement (avant tout choix de filière).
  majEcrit();
}
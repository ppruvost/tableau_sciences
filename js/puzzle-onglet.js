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
 * Les cinq questions sont écrites dans #puzzle-x-enonce avec une zone de
 * réponse pour l'élève (textarea) : elles sont reprises dans le compte rendu.
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

function remplirSujet(lettre, sujet) {
  const l = lettre.toLowerCase();
  const ctx = document.getElementById(`puzzle-${l}-contexte`);
  const pb = document.getElementById(`puzzle-${l}-problematique`);
  const ol = document.getElementById(`puzzle-${l}-enonce`);
  if (ctx) ctx.textContent = sujet.contexte || '';
  if (pb) {
    pb.textContent = '';
    if (sujet.problematique) {
      const fort = document.createElement('strong');
      fort.textContent = 'Problématique : ';
      pb.append(fort, document.createTextNode(sujet.problematique));
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

/** Sous-onglets Sujet A / B / C : un clic affiche le panneau correspondant. */
function brancherSousOnglets(racine) {
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
  });
}

/**
 * Démarre l'activité puzzle d'un TD à partir de son modèle.
 * Réagit au changement du menu « Votre filière professionnelle ».
 */
export function demarrerPuzzle(modele) {
  const select = document.getElementById('select-filiere-pro');
  const info = document.getElementById('puzzle-info');
  const racine = document.getElementById('activites-puzzle');
  if (!modele || typeof modele.build !== 'function') {
    console.error('[puzzle-onglet] modèle de puzzle invalide');
    return;
  }

  brancherSousOnglets(racine);

  const lettresPresentes = () =>
    ['A', 'B', 'C'].filter((L) => document.getElementById(`puzzle-${L.toLowerCase()}-enonce`));

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

    if (!cle) {
      lettresPresentes().forEach(viderSujet);
      message(MSG_ATTENTE);
      return;
    }

    const { niveau, filiere } = decouper(cle);
    const P = modele.params ? modele.params[filiere] : undefined;
    if (!P) {
      lettresPresentes().forEach(viderSujet);
      message(MSG_ABSENT);
      return;
    }

    try {
      const cad = `En ${NIVEAUX[niveau] || niveau} ${FILIERES[filiere] || filiere.toUpperCase()}`;
      const sujets = modele.build(P, niveau, cad, filiere) || {};
      lettresPresentes().forEach((L) => {
        if (sujets[L]) remplirSujet(L, sujets[L]); else viderSujet(L);
      });
      message('');
    } catch (err) {
      console.error('[puzzle-onglet] construction des sujets impossible :', err);
      lettresPresentes().forEach(viderSujet);
      message('Les sujets n\'ont pas pu être affichés pour cette filière.');
    }
  }

  if (select) {
    select.addEventListener('change', rafraichir);
    // Valeur déjà sélectionnée au chargement (retour sur le TD, navigateur qui restaure le choix)
    rafraichir();
  } else {
    message(MSG_ATTENTE);
  }
}
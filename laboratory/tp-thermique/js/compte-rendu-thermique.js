/**
 * tp-thermique/js/compte-rendu-thermique.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * thermique actuellement affiché (questions de l’onglet actif seulement), et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import { getBlocQuestionsActif } from './questions-par-onglet.js';

function texte(el) {
  return (el?.textContent || '').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

// R9 : seules les questions de l'onglet actif sont reprises. Une section
// "notation" (question + compétence + zone de réponse) par <li> du bloc
// .questions-bloc[data-onglet] actif. Repli : toutes les listes de
// questions de la page si aucun bloc n'est rattaché à l'onglet actif.
// La question 5 est précédée du rappel étiqueté « Problématique ».
function construireSectionsQuestions() {
  const bloc = getBlocQuestionsActif();
  const racine = bloc || document;

  return [...racine.querySelectorAll('.questions-tp > li')].map(li => {
    const question = texte(li.querySelector('.question-entete strong'));
    const rappel = texte(li.querySelector('.problematique-rappel'));
    const estProblematique = li.classList.contains('question-problematique') && rappel;
    return {
      titre: question,
      notation: true,
      competence: texte(li.querySelector('.cartouche')),
      texte: valeur(li.querySelector('.zone-eleve textarea')),
      // Champs natifs de compte-rendu.js : énoncé rappelé au-dessus de la réponse.
      ...(estProblematique ? { rappel, rappelEtiquette: 'Problématique' } : {}),
    };
  });
}

// R12 : lecture de la filière par import dynamique, avec repli sur le DOM
// (le contexte pro imprimé doit refléter ce qui est affiché à l'écran).
async function lireFiliere() {
  try {
    const module = await import('../../js/contexte-pro.js');
    const filiere = module.getFiliereSelectionnee?.();
    if (filiere) return filiere;
  } catch (erreur) {
    console.warn('[tp-thermique] contexte-pro.js indisponible, repli sur le DOM :', erreur);
  }
  const option = document.querySelector('#select-filiere-pro option:checked');
  if (!option || !option.value) return null;
  const [niveau, ...reste] = option.value.split('-');
  return { niveau, filiere: option.textContent.trim() || reste.join('-') };
}

// Libellé de la pastille de niveau attendu par compte-rendu.js.
const NIVEAUX = { '2nde': '2nde', '1ere': '1ère', 'tle': 'Tle' };

function libelleNiveau(niveau) {
  const cle = String(niveau || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return NIVEAUX[cle] || undefined;
}

async function construireSectionContextePro() {
  const filiere = await lireFiliere();
  if (!filiere) return null;
  return {
    titre: 'Contexte professionnel',
    items: [
      { label: 'Filière', valeur: `${filiere.niveau} — ${filiere.filiere}` },
    ],
  };
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Mesurer et caractériser une température")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 */
export function initImpressionCompteRendu({ titre, tp }) {

  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', async () => {

    const filiere = await lireFiliere();
    const sections = [
      await construireSectionContextePro(),
      ...construireSectionsQuestions(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      marque: 'scilab',
      niveau: libelleNiveau(filiere?.niveau),
      domaine: 'Thermique',
      tp,
      sections,
      noteFinale: true,
    });
  });
}

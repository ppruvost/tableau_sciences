/**
 * tp-algorithme/js/compte-rendu-algorithme.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TD
 * d'algorithmique actuellement affiché, et câble le bouton
 * #btn-imprimer dessus.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import {
  initAffichageQuestionsParActivite,
  construireSectionsQuestionsActivite,
  verifierActiviteChoisie,
  panneauxActiviteChoisie,
} from '../../js/questions-par-activite.js';

function texte(el) {
  return (el?.textContent || '').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

// Résumé du TD, en texte libre.
function construireSectionResume() {

  const zone = document.getElementById('resume-tp');

  if (!zone) return null;

  return { titre: 'Résumé du TD', texte: valeur(zone) };
}

// Une section par exercice de code (.code-exercice) de l'activité réalisée :
// le programme Python final écrit/modifié par l'élève avant envoi vers PyLab.
// Les codes des fiches puzzle ne sont repris que s'ils sont remplis.
// Le résultat d'exécution reste dans l'onglet PyLab (outil externe,
// comme NumWorks) — à reporter à la main dans le tableau de résultats.
function construireSectionsCode() {

  const panneaux = panneauxActiviteChoisie();

  return [...document.querySelectorAll('.code-exercice')]
    .filter(bloc => panneaux.some(p => p.contains(bloc)))
    .map(bloc => ({
      bloc,
      code: valeur(bloc.querySelector('.code-editeur-python')),
    }))
    .filter(({ bloc, code }) => code || !bloc.closest('.fiche-puzzle'))
    .map(({ bloc, code }) => ({
      titre: `Code Python — ${bloc.dataset.titre || ''}`,
      texte: code,
    }));
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TD
 * @param {string} params.tp    - Numéro du TD (ex. "A1")
 */
export function initImpressionCompteRendu({ titre, tp }) {

  // Seules les questions et les codes de l'activité réalisée sont affichés
  // et repris (fiches puzzle et synthèse comprises si le puzzle est choisi).
  initAffichageQuestionsParActivite();

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    if (!verifierActiviteChoisie()) return;

    const sections = [
      ...construireSectionsCode(),
      ...construireSectionsQuestionsActivite(),
      construireSectionResume(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Algorithmique',
      tp,
      sections,
      noteFinale: true,
      plateforme: 'MathiLab',
    });
  });
}

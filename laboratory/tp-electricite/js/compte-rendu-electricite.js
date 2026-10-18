/**
 * tp-electricite/js/compte-rendu-electricite.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * électricité actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import { getFiliereSelectionnee } from '../../js/contexte-pro.js';

function texte(el) {
  return (el?.textContent || '').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

// Une section "notation" (question + compétence + zone de réponse)
// par <li> de .questions-tp, au format attendu par compte-rendu.js.
// Quand un TP propose plusieurs jeux de questions (un par onglet, blocs
// [data-onglet]), seul le jeu de l'onglet affiché est repris, plus celui
// d'un autre onglet s'il contient des réponses.
function construireSectionsQuestions() {

  const blocs = [...document.querySelectorAll('.questions-bloc')];

  const retenus = blocs.filter(bloc =>
    !bloc.hidden ||
    [...bloc.querySelectorAll('textarea')].some(t => valeur(t) !== '')
  );

  const prefixer = retenus.length > 1;

  return retenus.flatMap(bloc => {

    const nomOnglet = bloc.dataset.ongletNom;

    return [...bloc.querySelectorAll('.questions-tp > li')].map(li => {

      const titre = texte(li.querySelector('.question-entete strong'));

      return {
        titre: prefixer && nomOnglet ? `[${nomOnglet}] ${titre}` : titre,
        notation: true,
        competence: texte(li.querySelector('.cartouche')),
        texte: valeur(li.querySelector('.zone-eleve textarea')),
      };
    });
  });
}

// Contexte professionnel (filière/niveau choisis par l'élève), pour que le
// compte-rendu imprimé indique la même chose que ce qui est affiché à l'écran
// via contexte-pro.js.
function construireSectionContextePro() {
  const filiere = getFiliereSelectionnee();
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
 * @param {string} params.titre - Titre du TP (ex. "Puissance et énergie électrique")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 * @param {() => Object[]} [params.sectionsSupplementaires]
 *        Fonction appelée au moment de l'impression ; retourne des sections
 *        supplémentaires (ex. tableau de mesures + graphique), insérées
 *        avant les questions.
 */
export function initImpressionCompteRendu({ titre, tp, sectionsSupplementaires }) {

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    const sections = [
      construireSectionContextePro(),
      ...(typeof sectionsSupplementaires === 'function' ? sectionsSupplementaires() : []),
      ...construireSectionsQuestions(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Électricité',
      tp,
      sections,
      noteFinale: true,
    });
  });
}
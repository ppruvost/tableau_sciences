/**
 * tp-chimie/js/compte-rendu-chimie.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * chimie actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 *
 * Même interface que tp-electricite/js/compte-rendu-electricite.js :
 * chaque TP appelle initImpressionCompteRendu({ titre, tp,
 * sectionsSupplementaires }).
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import { getFiliereSelectionnee } from '../../js/contexte-pro.js';
import { listerQuestionsCR, titreCR } from './questions-par-onglet.js';

function texte(el) {
  return (el?.textContent || '').replace(/\s+/g, ' ').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

// Une section "notation" (question + compétence + zone de réponse)
// par <li> de .questions-tp, au format attendu par compte-rendu.js.
// Quand un TP propose plusieurs jeux de questions (un par onglet, blocs
// .questions-bloc[data-onglet]), seul le jeu de l'onglet affiché est repris,
// plus celui d'un autre onglet s'il contient des réponses (questions alors
// préfixées du nom de l'onglet). Cette sélection est faite par
// listerQuestionsCR(), qui ignore les sous-onglets imbriqués.
function construireSectionsQuestions() {

  const sections = [];

  listerQuestionsCR().forEach((li, index) => {

    const zone = li.querySelector('.zone-eleve textarea') || li.querySelector('textarea');
    if (!zone) return;

    const titre = texte(li.querySelector('.question-entete strong')) || `Question ${index + 1}`;
    const cartouche = li.querySelector('.cartouche');

    sections.push({
      titre: titreCR(li, titre),
      notation: true,
      competence: cartouche?.dataset.comp || texte(cartouche),
      texte: valeur(zone),
    });
  });

  return sections;
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
 * @param {string} params.titre - Titre du TP (ex. "pH et indicateurs colorés")
 * @param {string} params.tp    - Numéro du TP (ex. "TP02")
 * @param {() => Object[]} [params.sectionsSupplementaires]
 *        Fonction appelée au moment de l'impression ; retourne des sections
 *        supplémentaires (ex. paramètres et résultats du TP), insérées
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
      domaine: 'Chimie',
      tp,
      sections,
      noteFinale: true,
    });
  });
}

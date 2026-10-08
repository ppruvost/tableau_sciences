/**
 * tp-signaux/js/compte-rendu-signaux.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * signaux actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Calqué sur tp-acoustique/js/compte-rendu-acoustique.js.
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
function construireSectionsQuestions() {
  return [...document.querySelectorAll('.questions-tp > li')].map(li => ({
    titre: texte(li.querySelector('.question-entete strong')),
    notation: true,
    competence: texte(li.querySelector('.cartouche')),
    texte: valeur(li.querySelector('.zone-eleve textarea')),
  }));
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
 * @param {string} params.titre - Titre du TP (ex. "Caractériser une onde électromagnétique")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 */
export function initImpressionCompteRendu({ titre, tp }) {
  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', () => {
    const sections = [
      construireSectionContextePro(),
      ...construireSectionsQuestions(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Signaux',
      tp,
      sections,
      noteFinale: true,
    });
  });
}

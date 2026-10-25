/**
 * tp-mecanique/js/compte-rendu-mecanique.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * mécanique actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import { getFiliereSelectionnee } from '../../js/contexte-pro.js';

export function texte(el) {
  return (el?.textContent || '').trim();
}

export function valeur(el) {
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
 * @param {string} params.titre - Titre du TP (ex. "Décrire un mouvement")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 * @param {() => Object[]} [params.sectionsSupplementaires]
 *        Fonction appelée au moment de l'impression ; retourne des sections
 *        supplémentaires (ex. tableau de mesures), insérées avant les
 *        questions.
 * @param {() => {canvas: HTMLCanvasElement, titre: string}[]} [params.canvasesSupplementaires]
 *        Fonction appelée au moment de l'impression ; retourne les courbes
 *        (canvas) à capturer en image dans le compte rendu.
 */
export function initImpressionCompteRendu({ titre, tp, sectionsSupplementaires, canvasesSupplementaires }) {

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    // Signale aux modules du TP (ex. les courbes P = f(V)) qu'une
    // impression va avoir lieu, pour qu'ils puissent se redessiner
    // une dernière fois avant la capture des canvas en image.
    document.dispatchEvent(new CustomEvent('cr:avant-impression'));

    const sections = [
      construireSectionContextePro(),
      ...(typeof sectionsSupplementaires === 'function' ? sectionsSupplementaires() : []),
      ...construireSectionsQuestions(),
    ].filter(Boolean);

    const canvases = (typeof canvasesSupplementaires === 'function'
      ? canvasesSupplementaires()
      : []).filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Mécanique',
      tp,
      sections,
      noteFinale: true,
      ...(canvases.length ? { canvases } : {}),
    });
  });
}
/**
 * tp-acoustique/js/compte-rendu-acoustique.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * acoustique actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import { getFiliereSelectionnee } from '../../js/contexte-pro.js';


// ---------------------------------------------------------------
// Utilitaires partagés par les contrôleurs des TP d'acoustique,
// pour construire les sections « mesures » du compte rendu.
// ---------------------------------------------------------------

/** Nombre au format français (virgule décimale), pour les tableaux imprimés. */
export function nombreFr(valeur, decimales = 1) {
  if (valeur === null || valeur === undefined || Number.isNaN(valeur)) return '—';
  return Number(valeur).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  });
}

/**
 * <canvas> contenu dans l'élément d'identifiant donné (graphique tracé par
 * js/graphique.js), ou null s'il n'existe pas ou n'est pas encore tracé.
 */
export function canvasDe(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return null;
  const canvas = conteneur.tagName === 'CANVAS' ? conteneur : conteneur.querySelector('canvas');
  return canvas && canvas.width && canvas.height ? canvas : null;
}

/** Ajoute une ligne au tableau : cellules en texte brut (aucune injection HTML). */
export function ajouterLigne(tbody, cellules) {
  const tr = document.createElement('tr');
  cellules.forEach(c => {
    const td = document.createElement('td');
    td.textContent = String(c ?? '');
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
}

/**
 * Section « items » (libellé / valeur) à partir de champs de la page.
 * champs : [[libellé, idElement, motifValide?], …] ; <input> et <select> sont lus par leur
 * valeur (texte de l'option pour un <select>), <output> et autres par leur
 * texte. Les champs vides (ou « — ») sont ignorés ; null si rien n'est saisi.
 */
export function sectionValeurs(titre, champs) {
  const items = champs.map(champ => {
    const [label, id] = champ;
    const el = document.getElementById(id);
    if (!el) return null;
    let v;
    if (el.tagName === 'SELECT') {
      v = el.value ? (el.options[el.selectedIndex]?.text || '').trim() : '';
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      v = (el.value || '').trim();
    } else {
      v = (el.textContent || '').trim();
    }
    if (!v || v === '—') return null;
    // 3ᵉ élément facultatif : motif que la valeur doit respecter (pour ignorer
    // les textes d'attente du type « Compléter les observations… »).
    if (champ[2] && !champ[2].test(v)) return null;
    return { label, valeur: v };
  }).filter(Boolean);
  return items.length ? { titre, items } : null;
}

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
 * @param {string} params.titre - Titre du TP (ex. "Caractériser un son")
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
      domaine: 'Acoustique',
      tp,
      sections,
      noteFinale: true,
    });
  });
}
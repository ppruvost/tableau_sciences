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
 * Fichier strictement calqué sur tp-mecanique/js/compte-rendu-mecanique.js
 * pour garantir un rendu d'impression cohérent entre domaines SciLab.
 * STATUT : ce module n'est actuellement importé par aucun TP01-05 de
 * tp-chimie — chacun garde sa propre fonction lancerCompteRendu() avec des
 * besoins spécifiques (contexte pro, réactif, résultats dédiés, groupes de
 * sections). Conservé pour cohérence avec les 6 autres domaines si un futur
 * TP chimie n'a pas besoin de logique dédiée ; à supprimer sinon.
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
// Couvre aussi la question transversale "Chimie et environnement"
// (cartouche ANA), qui est un <li> comme les autres dans le DOM.
function construireSectionsQuestions() {
  return [...document.querySelectorAll('.questions-tp > li')].map(li => ({
    titre: texte(li.querySelector('.question-entete strong')),
    notation: true,
    competence: texte(li.querySelector('.cartouche')),
    texte: valeur(li.querySelector('.zone-eleve textarea')),
  }));
}

// Résumé du TP, en texte libre.
function construireSectionResume() {
  const zone = document.getElementById('resume-tp');
  if (!zone) return null;
  return { titre: 'Résumé du TP', texte: valeur(zone) };
}

// Contexte professionnel (filière/niveau choisis par l'élève).
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

// Tableau de résultats de la section [data-type="resultats"], lu
// génériquement ligne par ligne (1ère cellule = libellé, cellules
// suivantes = valeurs saisies ou déjà affichées).
function construireSectionResultats() {
  const lignes = document.querySelectorAll('[data-type="resultats"] table tbody tr');
  if (!lignes.length) return null;
  const items = [...lignes].map(tr => {
    const cellules = [...tr.children];
    const label = texte(cellules[0]);
    const valeurs = cellules.slice(1).map(td => {
      const input = td.querySelector('input');
      return input ? valeur(input) : texte(td);
    }).filter(Boolean);
    return { label, valeur: valeurs.join(' — ') || '—' };
  });
  return { titre: 'Tableau de résultats', items };
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Suivi pH-métrique d'un titrage")
 * @param {string} params.tp    - Numéro du TP (ex. "TP03")
 */
export function initImpressionCompteRendu({ titre, tp }) {
  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;
  bouton.addEventListener('click', () => {
    const sections = [
      construireSectionContextePro(),
      construireSectionResultats(),
      ...construireSectionsQuestions(),
      construireSectionResume(),
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

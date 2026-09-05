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

// Résumé du TP, en texte libre.
function construireSectionResume() {
  const zone = document.getElementById('resume-tp');
  if (!zone) return null;
  return { titre: 'Résumé du TP', texte: valeur(zone) };
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

// Tableau de mesures (V, P) de l'onglet "Pression et force pressante"
// (loi de Boyle-Mariotte), construit à partir du tableau dynamique
// #bm-table-corps généré par tp03-cinematique-pression.js. Retourne
// null si aucune mesure exploitable n'a été saisie, pour ne pas
// polluer le compte-rendu des élèves qui n'ont pas utilisé cet onglet.
function construireSectionMesuresPression() {
  const lignes = document.querySelectorAll('#bm-table-corps tr');
  if (!lignes.length) return null;

  const items = [...lignes].map((tr, index) => {
    const selectDispositif = tr.querySelector('.bm-dispositif');
    const dispositif = selectDispositif
      ? selectDispositif.options[selectDispositif.selectedIndex].text
      : '—';
    const v = valeur(tr.querySelector('.bm-volume'));
    const p = valeur(tr.querySelector('.bm-pression'));
    const pv = texte(tr.querySelector('.bm-pv'));

    const contenu = (v && p)
      ? `V = ${v} mL — P = ${p} hPa — P × V = ${pv} hPa·mL`
      : '(mesure non renseignée)';

    return { label: `Mesure ${index + 1} (${dispositif})`, valeur: contenu };
  });

  const auMoinsUneMesure = [...lignes].some(tr =>
    valeur(tr.querySelector('.bm-volume')) && valeur(tr.querySelector('.bm-pression'))
  );
  if (!auMoinsUneMesure) return null;

  return { titre: 'Mesures de pression — loi de Boyle-Mariotte', items };
}

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Décrire un mouvement")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 */
export function initImpressionCompteRendu({ titre, tp }) {
  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;
  bouton.addEventListener('click', () => {

    // Signale aux modules du TP (ex. la courbe P = f(V)) qu'une
    // impression va avoir lieu, pour qu'ils puissent se redessiner
    // une dernière fois avant la capture du canvas en image.
    document.dispatchEvent(new CustomEvent('cr:avant-impression'));

    const sectionMesuresPression = construireSectionMesuresPression();

    const sections = [
      construireSectionContextePro(),
      construireSectionResultats(),
      sectionMesuresPression,
      ...construireSectionsQuestions(),
      construireSectionResume(),
    ].filter(Boolean);

    // La courbe P = f(V) n'est incluse que si des mesures exploitables
    // ont été saisies (évite un graphique vide dans le compte-rendu).
    const canvasCourbe = sectionMesuresPression
      ? document.getElementById('bm-canvas-courbe')
      : null;

    genererCompteRendu({
      titre,
      domaine: 'Mécanique',
      tp,
      sections,
      noteFinale: true,
      ...(canvasCourbe ? { canvas: canvasCourbe } : {}),
    });
  });
}

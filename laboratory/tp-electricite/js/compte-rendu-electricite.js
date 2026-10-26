/**
 * tp-electricite/js/compte-rendu-electricite.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * électricité actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 *
 * Contenu du compte rendu (dans l'ordre) :
 *   1. contexte professionnel (filière choisie + texte du contexte) ;
 *   2. travail réalisé dans les onglets de manipulation :
 *        - sectionsSupplementaires() si le TP la fournit (TP01 : mesures +
 *          graphiques P = f(U×I) et E = f(P×t)) ;
 *        - sinon capture automatique des onglets : valeurs saisies, résultats
 *          calculés (.resultat-calcul[id*="resultat"]), tableaux de mesures
 *          (tbody[id] ou cellules de saisie) et graphiques (.graphique-conteneur) ;
 *   3. questions et réponses (numérotées) ; la question 5 reprend le texte
 *      de la problématique de l'onglet ;
 *   4. auto-évaluation des compétences (+ radar s'il a été généré).
 * L'identité est lue par compte-rendu.js dans la rubrique « Identification » de la page.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';
import { getFiliereSelectionnee } from '../../js/contexte-pro.js';

/* ==========================================================
   LECTURE DU DOM
   ========================================================== */

function nettoyer(chaine) {
  return String(chaine ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function texte(el) {
  return nettoyer(el?.textContent);
}

// Texte d'un bloc HTML en conservant la structure : un paragraphe / élément
// de liste / titre par ligne (les listes sont reprises avec une puce).
function texteBloc(el) {
  if (!el) return '';
  const copie = el.cloneNode(true);
  copie.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
  copie.querySelectorAll('li').forEach(li => li.prepend('• '));
  copie.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, div, tr').forEach(b => b.append('\n'));
  return copie.textContent
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

// Saisie libre : les retours à la ligne sont conservés (seul le trim est appliqué).
function valeur(el) {
  return (el?.value || '').trim();
}

const SELECTEUR_CHAMPS =
  'input:not([type="radio"]):not([type="checkbox"]):not([type="range"])' +
  ':not([type="button"]):not([type="submit"]):not([type="hidden"]), select';

function libelleChamp(champ) {
  const pourId = champ.id
    ? document.querySelector(`label[for="${CSS.escape(champ.id)}"]`)
    : null;
  const label = pourId || champ.closest('.form-group')?.querySelector('label');
  return texte(label) || champ.getAttribute('aria-label') || champ.placeholder || champ.id || 'Champ';
}

// Virgule décimale (impression française) ; texte de l'option pour un <select>.
function valeurChamp(champ) {
  if (champ.tagName === 'SELECT') {
    return champ.value ? texte(champ.selectedOptions[0]) : '';
  }
  return valeur(champ).replace(/^(-?\d+)\.(\d+)$/, '$1,$2');
}

// Zone de résultat calculé. Le texte d'invite affiché avant la saisie
// (« Saisir … pour calculer … ») ne contient aucun élément : on l'ignore.
function texteResultat(el) {
  if (!el || !el.children.length) return '';
  const copie = el.cloneNode(true);
  copie.querySelectorAll('br').forEach(br => br.replaceWith(' · '));
  return nettoyer(copie.textContent);
}

/* ==========================================================
   MANIPULATIONS (capture générique des onglets)
   ========================================================== */

function nomOnglet(panneau) {
  const bouton = panneau.id
    ? document.querySelector(`.tabs-header .tab-btn[data-tab="${CSS.escape(panneau.id)}"]`)
    : null;
  return texte(bouton) || panneau.id || 'Manipulation';
}

function tableauDepuisDom(table) {
  return {
    entetes: [...table.querySelectorAll('thead th')].map(texte),
    lignes: [...table.querySelectorAll('tbody tr')].map(tr =>
      [...tr.cells].map(td => {
        const champ = td.querySelector(SELECTEUR_CHAMPS);
        return champ ? (valeurChamp(champ) || '—') : texte(td);
      })),
  };
}

// Un tableau est repris s'il contient des données de l'élève : cellules de
// saisie renseignées, ou lignes ajoutées dynamiquement dans un tbody[id].
// Les tableaux de référence (tbody sans id, sans saisie) sont ignorés.
function tableauRenseigne(table) {
  const champs = [...table.querySelectorAll('tbody')]
    .flatMap(tb => [...tb.querySelectorAll(SELECTEUR_CHAMPS)]);
  if (champs.length) return champs.some(c => valeurChamp(c) !== '');
  const tbody = table.querySelector('tbody[id]');
  return Boolean(tbody) && tbody.rows.length > 0;
}

function sectionsDepuisOnglet(panneau) {

  const nom = nomOnglet(panneau);
  const sections = [];

  // Valeurs saisies hors tableau + résultats calculés
  const items = [];

  panneau.querySelectorAll(SELECTEUR_CHAMPS).forEach(champ => {
    if (champ.closest('table') || champ.closest('.questions-bloc')) return;
    const v = valeurChamp(champ);
    if (v) items.push({ label: libelleChamp(champ), valeur: v });
  });

  const resultats = [...panneau.querySelectorAll('.resultat-calcul[id*="resultat"]')]
    .map(texteResultat)
    .filter(Boolean);

  resultats.forEach((v, i) => items.push({
    label: resultats.length > 1 ? `Résultat ${i + 1}` : 'Résultat',
    valeur: v,
  }));

  if (items.length) sections.push({ titre: `Manipulation — ${nom}`, items });

  // Tableaux de mesures
  panneau.querySelectorAll('table').forEach(table => {
    if (tableauRenseigne(table)) {
      sections.push({ titre: `Tableau — ${nom}`, tableau: tableauDepuisDom(table) });
    }
  });

  // Graphiques (conteneur contenant un <canvas> ou un <svg> ; le texte
  // « Ajouter au moins 2 points… » seul ne produit rien)
  const graphiques = [
    ...panneau.querySelectorAll('.graphique-conteneur'),
    ...[...panneau.querySelectorAll('canvas')].filter(c => !c.closest('.graphique-conteneur') && c.width > 0),
  ];

  graphiques.forEach(g => {
    if (g.matches('canvas') || g.querySelector('canvas, svg')) {
      sections.push({ titre: `Graphique — ${nom}`, canvas: g });
    }
  });

  return sections;
}

function construireSectionsManipulations() {

  let panneaux = [...document.querySelectorAll('[data-type="preparation"] .tab-panel')];
  if (!panneaux.length) panneaux = [...document.querySelectorAll('.tab-panel')];

  return panneaux
    .filter(p => !p.closest('.questions-bloc'))
    .flatMap(sectionsDepuisOnglet);
}

/* ==========================================================
   QUESTIONS, CONTEXTE PRO, AUTO-ÉVALUATION, IDENTITÉ
   ========================================================== */

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

    const nomBloc = bloc.dataset.ongletNom;

    return [...bloc.querySelectorAll('.questions-tp > li')].map((li, index) => {

      // La numérotation de l'écran vient d'un compteur CSS : on la reprend ici.
      const intitule = `Q${index + 1}. ${texte(li.querySelector('.question-entete strong'))}`;

      // Question 5 (problématique) : le texte de la problématique, rempli à
      // l'écran par contexte-pro.js dans .problematique-rappel, est repris.
      const enonce = li.classList.contains('question-problematique')
        ? texteBloc(li.querySelector('.problematique-rappel'))
        : '';

      return {
        titre: prefixer && nomBloc ? `[${nomBloc}] ${intitule}` : intitule,
        notation: true,
        competence: texte(li.querySelector('.cartouche')),
        texte: valeur(li.querySelector('.zone-eleve textarea')),
        ...(enonce ? { enonce } : {}),
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

  // Texte du contexte professionnel affiché à l'écran (#contexte-pro-resultat,
  // rempli par contexte-pro.js) : repris tel quel dans le compte rendu.
  const contexte = texteBloc(document.getElementById('contexte-pro-resultat'));

  return {
    titre: 'Contexte professionnel',
    items: [
      { label: 'Filière', valeur: `${filiere.niveau} — ${filiere.filiere}` },
    ],
    ...(contexte ? { texte: contexte } : {}),
  };
}

// Tableau d'auto-évaluation (.autoeval-table : une ligne par compétence,
// boutons radio 0 / 1 / 2) + radar des compétences s'il a été généré.
// Rien n'est imprimé tant que l'élève n'a coché aucune case.
function construireSectionAutoEvaluation() {

  const lignes = [...document.querySelectorAll('.autoeval-table tbody tr[data-comp]')];

  if (!lignes.some(tr => tr.querySelector('input[type="radio"]:checked'))) return null;

  const section = {
    titre: 'Auto-évaluation des compétences',
    position: 'fin', // après les questions, comme à l'écran
    tableau: {
      entetes: ['Domaine', 'Sigle', 'Je suis capable de…', 'Niveau (0 à 2)'],
      lignes: lignes.map(tr => {
        const coche = tr.querySelector('input[type="radio"]:checked');
        return [texte(tr.cells[0]), tr.dataset.comp, texte(tr.cells[2]), coche ? coche.value : '—'];
      }),
    },
  };

  const radar = document.getElementById('radar-resultat');
  if (radar && radar.querySelector('canvas, svg')) {
    section.canvas = radar;
    section.legende = 'Radar des compétences';
  }

  return section;
}

/* ==========================================================
   POINT D'ENTRÉE
   ========================================================== */

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Puissance et énergie électrique")
 * @param {string} params.tp    - Numéro du TP (ex. "TP01")
 * @param {() => Object[]} [params.sectionsSupplementaires]
 *        Fonction appelée au moment de l'impression ; retourne les sections
 *        propres au TP (ex. tableau de mesures + graphique). Si elle ne
 *        retourne rien, les onglets de manipulation sont capturés
 *        automatiquement.
 */
export function initImpressionCompteRendu({ titre, tp, sectionsSupplementaires }) {

  const bouton = document.getElementById('btn-imprimer');

  if (!bouton) return;

  bouton.addEventListener('click', () => {

    const propres = typeof sectionsSupplementaires === 'function'
      ? (sectionsSupplementaires() || []).filter(Boolean)
      : [];

    const sections = [
      construireSectionContextePro(),
      ...(propres.length ? propres : construireSectionsManipulations()),
      ...construireSectionsQuestions(),
      construireSectionAutoEvaluation(),
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
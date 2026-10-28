/**
 * tp-acoustique/js/compte-rendu-acoustique.js
 *
 * Construit la configuration attendue par le module partagé
 * js/compte-rendu.js (genererCompteRendu) à partir du DOM du TP
 * acoustique actuellement affiché, et câble le bouton #btn-imprimer
 * dessus. Le matériel (Verrerie/Équipements) est récupéré tout seul
 * par compte-rendu.js via les cases à cocher #materiel-verrerie /
 * #materiel-equipements — rien à faire ici pour cette partie.
 *
 * Contenu du compte rendu (dans l'ordre) :
 *   1. contexte professionnel (filière choisie) ;
 *   2. travail réalisé dans les onglets de manipulation :
 *        - sectionsSupplementaires() si le TP la fournit (valeurs saisies, tableaux de
 *          classement/mesures, graphiques du TP) ;
 *        - sinon capture automatique des onglets : valeurs saisies, résultats
 *          calculés (.resultat-calcul[id*="resultat"]), tableaux de mesures
 *          (tbody[id] ou cellules de saisie) et graphiques (.graphique-conteneur) ;
 *   3. questions et réponses (numérotées) ;
 *   4. auto-évaluation des compétences (+ radar s'il a été généré).
 * L'identité est lue par compte-rendu.js dans la rubrique « Identification » de la page.
 */

import { genererCompteRendu } from '../../js/compte-rendu.js';

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

/* ==========================================================
   LECTURE DU DOM
   ========================================================== */

function nettoyer(chaine) {
  return String(chaine ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function texte(el) {
  return nettoyer(el?.textContent);
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

// Texte d'un bloc HTML en conservant les paragraphes (un saut de ligne par
// <p>, <li>, titre ou <div>) ; les rappels de problématique sont exclus.
function texteBlocs(el) {
  if (!el) return '';
  const copie = el.cloneNode(true);
  copie.querySelectorAll('.problematique-onglet, .problematique-rappel, [class*="problematique"]')
    .forEach(n => n.remove());
  copie.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
  copie.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, div, tr')
    .forEach(n => n.append('\n'));
  return copie.textContent
    .split('\n').map(nettoyer).filter(Boolean).join('\n');
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
   NIVEAU ET FILIÈRE CHOISIS PAR L'ÉLÈVE
   ========================================================== */

// Lecture de secours dans le DOM (menus de contexte-pro.js).
function lireFiliereDom() {
  const selFiliere = document.getElementById('select-filiere-pro');
  const filiere = selFiliere?.value ? texte(selFiliere.selectedOptions[0]) : '';

  const selNiveau = document.querySelector('select[id*="niveau"]');
  let niveau = selNiveau?.value ? texte(selNiveau.selectedOptions[0]) : '';

  if (!niveau) {
    const tags = [...document.querySelectorAll('.tp-meta .tag')].map(texte)
      .filter(t => /2nde|seconde|1(ère|ere)|premi|tle|term/i.test(t));
    if (tags.length === 1) niveau = tags[0];
  }
  return niveau || filiere ? { niveau, filiere } : null;
}

// Import DYNAMIQUE de contexte-pro.js : si getFiliereSelectionnee n'y est pas
// exporté (ou si le module est introuvable), un import statique ferait échouer
// en silence tout le module d'impression. Ici on retombe sur le DOM.
async function lireFiliere() {
  try {
    const module = await import('../../js/contexte-pro.js');
    if (typeof module.getFiliereSelectionnee === 'function') {
      return module.getFiliereSelectionnee() || null;
    }
  } catch (err) {
    console.warn('[compte-rendu] contexte-pro.js indisponible, lecture du DOM :', err);
  }
  return lireFiliereDom();
}

/* ==========================================================
   QUESTIONS, CONTEXTE PRO, AUTO-ÉVALUATION, IDENTITÉ
   ========================================================== */

// Une section "notation" (question + compétence + zone de réponse)
// par <li> de .questions-tp, au format attendu par compte-rendu.js.
// Seules les questions de l'onglet de manipulation ACTIF (bloc affiché) sont
// reprises : les jeux de questions des autres onglets sont ignorés, même
// s'ils contiennent des réponses. Un TP sans bloc [data-onglet] (activité
// unique) reprend ses questions telles quelles.
function blocVisible(bloc) {
  return !bloc.hidden && getComputedStyle(bloc).display !== 'none';
}

function construireSectionsQuestions() {

  const blocs = [...document.querySelectorAll('.questions-bloc')];

  const listes = blocs.length
    ? blocs.filter(blocVisible).map(bloc => bloc.querySelector('.questions-tp'))
    : [...document.querySelectorAll('.questions-tp')];

  return listes.filter(Boolean).flatMap(liste =>
    [...liste.querySelectorAll(':scope > li')].map((li, index) => {

      // La numérotation de l'écran vient d'un compteur CSS : on la reprend ici.
      const intitule = `Q${index + 1}. ${texte(li.querySelector('.question-entete strong'))}`;

      const question = {
        titre: intitule,
        notation: true,
        competence: texte(li.querySelector('.cartouche')),
        texte: valeur(li.querySelector('.zone-eleve textarea')),
      };

      // Question 5 : rappel du texte de la problématique de l'onglet
      // (rempli à l'écran par contexte-pro.js selon la filière choisie).
      const rappel = texte(li.querySelector('.problematique-rappel'));
      if (rappel) {
        question.rappel = rappel;
        question.rappelEtiquette = 'Problématique';
      }

      return question;
    }));
}

// Contexte professionnel (filière/niveau choisis par l'élève), pour que le
// compte-rendu imprimé indique la même chose que ce qui est affiché à l'écran
// via contexte-pro.js.
function construireSectionContextePro(filiere) {

  // Texte affiché dans « Contexte professionnel » pour la filière choisie
  // (jamais le texte d'invite « Sélectionner votre filière… »).
  const choix = document.getElementById('select-filiere-pro');
  const contexte = choix?.value ? texteBlocs(document.getElementById('contexte-pro-resultat')) : '';

  if (!filiere && !contexte) return null;

  const section = { titre: 'Contexte professionnel' };

  const libelle = filiere ? [filiere.niveau, filiere.filiere].filter(Boolean).join(' — ') : '';
  if (libelle) section.items = [{ label: 'Filière', valeur: libelle }];
  if (contexte) section.texte = contexte;

  return section;
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
    section.echelle = 0.5; // radar imprimé à 50 % de la largeur
  }

  return section;
}

/* ==========================================================
   POINT D'ENTRÉE
   ========================================================== */

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TP (ex. "Caractériser un son")
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

  bouton.addEventListener('click', async () => {

    const propres = typeof sectionsSupplementaires === 'function'
      ? (sectionsSupplementaires() || []).filter(Boolean)
      : [];

    // Niveau et filière choisis par l'élève (contexte-pro.js)
    const filiere = await lireFiliere();

    const sections = [
      construireSectionContextePro(filiere),
      ...(propres.length ? propres : construireSectionsManipulations()),
      ...construireSectionsQuestions(),
      construireSectionAutoEvaluation(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Acoustique',
      tp,
      sections,
      noteFinale: true,
      niveau: filiere?.niveau, // pastille « 2nde / 1ère / Tle » de l'en-tête
    });
  });
}
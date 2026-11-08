/**
 * mathilab/tp-geometrie/js/compte-rendu-geometrie.js
 *
 * Configuration du compte rendu du domaine Géométrie : construit les
 * sections attendues par js/compte-rendu.js (genererCompteRendu) et câble
 * le bouton #btn-imprimer. Même squelette que les compte-rendu-<domaine>.js
 * de SciLab (claude_v6.md §8).
 *
 * Exports :
 *   initImpressionCompteRendu({ titre, tp, sectionsSupplementaires })
 *   sectionValeurs(titre, champs)   section « items » depuis des ids de champs
 *   nombreFr(valeur, décimales)     nombre en notation française (« — » si vide)
 *   ajouterLigne(tbody, cellules)   ajoute une ligne en texte brut
 *
 * Contenu du PDF, dans l'ordre :
 *   1. Contexte professionnel (niveau — filière + texte du contexte) ;
 *   2. Manipulations : sectionsSupplementaires() du TD si elle retourne
 *      quelque chose, SINON capture automatique des onglets
 *      ([data-type="preparation"] .tab-panel) : Manipulation / Tableau /
 *      Graphique — <onglet> ;
 *   3. Questions de l'onglet visible (5 questions, Q5 = problématique) ;
 *      pour l'onglet « Activités Puzzle », les fiches Sujet A, B, C remplies
 *      sont ajoutées après les questions ;
 *   4. Auto-évaluation (position « fin ») + radar à 50 % — rien n'est
 *      imprimé tant qu'aucune case n'est cochée.
 *
 * Un résultat n'est repris que si son bloc .resultat-calcul (id contenant
 * « resultat ») a été réécrit après l'initialisation du TD : les calculs
 * automatiques faits au chargement (valeurs par défaut) ne sont donc pas
 * imprimés. Voir suivreResultats().
 *
 * Robustesse : js/contexte-pro.js est importé dynamiquement (try/catch),
 * avec repli sur la lecture du DOM ; un échec d'import n'empêche jamais
 * l'impression.
 */

import { genererCompteRendu } from '../../../js/compte-rendu.js';
import { ongletActif, blocOngletActif } from './questions-par-onglet.js';

const ID_PUZZLE = 'activites-puzzle';

// ============================================================
// Outils
// ============================================================

function texte(el) {
  return (el?.textContent || '').replace(/\s+/g, ' ').trim();
}

function valeur(el) {
  return (el?.value || '').trim();
}

/** Valeur lisible d'un champ (input, select, textarea ou output). */
function valeurElement(el) {
  if (!el) return '';
  if (el.tagName === 'SELECT') return texte(el.options[el.selectedIndex]);
  if (el.tagName === 'OUTPUT') return texte(el);
  return valeur(el);
}

/**
 * Nombre en notation française (virgule décimale) ; « — » si la valeur est vide.
 * @param {number|string|null|undefined} valeur
 * @param {number} [decimales] nombre de décimales imposé (sinon : celles de la valeur)
 */
export function nombreFr(valeur, decimales) {
  if (valeur === null || valeur === undefined || String(valeur).trim() === '') return '—';
  const n = typeof valeur === 'number' ? valeur : parseFloat(String(valeur).replace(',', '.'));
  if (!Number.isFinite(n)) return String(valeur).trim();
  const options = Number.isInteger(decimales)
    ? { minimumFractionDigits: decimales, maximumFractionDigits: decimales }
    : { maximumFractionDigits: 10 };
  return n.toLocaleString('fr-FR', options);
}

/** Chaîne numérique saisie (« 2.5 ») → notation française (« 2,5 ») ; autre texte inchangé. */
function nombreFrSaisi(chaine) {
  return /^-?\d+(\.\d+)?$/.test(chaine) ? chaine.replace('.', ',') : chaine;
}

/**
 * Section « items » depuis des identifiants de champs.
 * @param {string} titre
 * @param {Array<[string, string, RegExp?]>} champs [libellé, idElement, motifValide?]
 * @returns {{titre: string, items: Array<{label: string, valeur: string}>}|null}
 */
export function sectionValeurs(titre, champs) {
  const items = [];
  champs.forEach(([libelle, id, motifValide]) => {
    const v = valeurElement(document.getElementById(id));
    if (!v || v === '—') return;
    if (motifValide && !motifValide.test(v)) return;
    items.push({ label: libelle, valeur: nombreFrSaisi(v) });
  });
  return items.length ? { titre, items } : null;
}

/** Ajoute une ligne de cellules en texte brut (jamais d'innerHTML). */
export function ajouterLigne(tbody, cellules) {
  const ligne = document.createElement('tr');
  cellules.forEach((contenu) => {
    const cellule = document.createElement('td');
    cellule.textContent = String(contenu ?? '');
    ligne.appendChild(cellule);
  });
  tbody.appendChild(ligne);
  return ligne;
}

/** Nom d'un onglet : texte du bouton, sans pictogramme initial. */
function nomOnglet(id) {
  const bouton = document.querySelector(`.tabs-header .tab-btn[data-tab="${id}"]`);
  return texte(bouton).replace(/^[^\p{L}\p{N}]+/u, '') || id;
}

function niveauTag() {
  return [...document.querySelectorAll('.tp-meta .tag')].map(texte)
    .find((t) => /^(2nde|1ère|1ere|Tle|Term)/i.test(t)) || '';
}

// ============================================================
// Suivi des résultats calculés
// ============================================================

/**
 * À appeler une fois l'initialisation du TD terminée : marque (data-calcule)
 * tout .resultat-calcul réécrit ensuite par un calcul lancé par l'élève.
 */
export function suivreResultats() {
  document.querySelectorAll('.resultat-calcul').forEach((zone) => {
    if (zone.dataset.suivi) return;
    zone.dataset.suivi = '1';
    new MutationObserver(() => { zone.dataset.calcule = '1'; })
      .observe(zone, { childList: true, characterData: true, subtree: true });
  });
}

// ============================================================
// 1. Contexte professionnel
// ============================================================

/** Import dynamique de contexte-pro.js : null en cas d'échec (repli DOM). */
async function chargerContextePro() {
  try {
    return await import('../../../js/contexte-pro.js');
  } catch (err) {
    console.warn('[compte-rendu] contexte-pro.js indisponible, repli sur le DOM :', err);
    return null;
  }
}

function construireSectionContextePro() {
  const select = document.getElementById('select-filiere-pro');
  if (!select || !select.value) return null;

  const option = select.options[select.selectedIndex];
  const niveau = option?.parentElement?.label || '';
  const filiere = texte(option) || select.value;
  const contexte = texte(document.getElementById('contexte-pro-resultat')?.querySelector('.contexte-pro-bloc p')
    || document.getElementById('contexte-pro-resultat'));

  const items = [{ label: 'Filière', valeur: niveau ? `${niveau} — ${filiere}` : filiere }];
  if (contexte && !/^Sélectionner/.test(contexte)) items.push({ label: 'Contexte', valeur: contexte });
  return { titre: 'Contexte professionnel', items };
}

// ============================================================
// 2. Manipulations (capture automatique des onglets)
// ============================================================

const CHAMPS = 'input:not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="hidden"]), select';

/** Libellé d'un champ : label[for], label du groupe, en-tête de colonne, sinon id. */
function libelleChamp(champ) {
  const pourCeChamp = champ.id ? document.querySelector(`label[for="${champ.id}"]`) : null;
  if (pourCeChamp) return texte(pourCeChamp);

  const label = champ.closest('.form-group')?.querySelector('label');
  if (label && texte(label)) return texte(label);

  return champ.getAttribute('aria-label') || champ.id || 'Champ';
}

/** Texte d'un résultat : <br> → « · ». */
function texteResultat(zone) {
  const copie = zone.cloneNode(true);
  copie.querySelectorAll('br').forEach((br) => br.replaceWith(' · '));
  return texte(copie).replace(/(\d)\.(\d)/g, '$1,$2');   // virgule décimale à l'impression (§12.8)
}

/** Tableaux de saisie ou dynamiques (hors auto-évaluation et tableaux de référence). */
function tableauxCapturables(conteneur) {
  return [...conteneur.querySelectorAll('table.tableau-resultats')]
    .filter((table) => !table.classList.contains('autoeval-table'))
    .filter((table) => table.querySelector('tbody input, tbody[id]'));
}

function sectionManipulation(conteneur, titre) {
  const resultats = [...conteneur.querySelectorAll('.resultat-calcul[id*="resultat"]')]
    .filter((zone) => zone.dataset.calcule === '1' && texte(zone));
  if (!resultats.length) return null;

  const items = [];
  conteneur.querySelectorAll(CHAMPS).forEach((champ) => {
    if (champ.closest('table')) return;            // repris par la section « Tableau »
    const v = valeurElement(champ);
    if (v) items.push({ label: libelleChamp(champ), valeur: nombreFrSaisi(v) });
  });
  resultats.forEach((zone, i) => {
    items.push({ label: resultats.length > 1 ? `Résultat ${i + 1}` : 'Résultat', valeur: texteResultat(zone) });
  });
  return { titre, items };
}

function sectionsTableaux(conteneur, titre) {
  // Valeurs par défaut des ateliers : un tableau n'est repris que si le calcul
  // de son conteneur a été lancé par l'élève.
  const zones = [...conteneur.querySelectorAll('.resultat-calcul')];
  if (zones.length && !zones.some((zone) => zone.dataset.calcule === '1')) return [];

  return tableauxCapturables(conteneur).map((table, rang) => {
    const entetes = [...table.querySelectorAll('thead th')].map(texte);
    const lignes = [...table.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((cellule) => {
      const champ = cellule.querySelector('input, select');
      return champ ? nombreFrSaisi(valeurElement(champ)) : texte(cellule);
    }));
    const rempli = lignes.some((ligne) => ligne.some((cellule) => cellule && cellule !== '—'));
    if (!rempli) return null;
    return { titre: `${titre}${rang ? ` (${rang + 1})` : ''}`, tableau: { entetes, lignes } };
  }).filter(Boolean);
}

function sectionsGraphiques(conteneur, titre) {
  return [...conteneur.querySelectorAll('.graphique-conteneur')]
    .filter((zone) => zone.querySelector('canvas, svg, img'))
    .map((zone, rang) => ({ titre: `${titre}${rang ? ` (${rang + 1})` : ''}`, canvas: zone }));
}

function sectionsManipulations() {
  const sections = [];

  document.querySelectorAll('[data-type="preparation"] .tab-panel').forEach((panneau) => {
    if (panneau.id === ID_PUZZLE) return;
    const nom = nomOnglet(panneau.id);

    // Conteneurs : sous-panneaux d'atelier s'il y en a, sinon l'onglet lui-même.
    const sousPanneaux = [...panneau.querySelectorAll('.sous-panel')];
    const conteneurs = sousPanneaux.length
      ? sousPanneaux.map((sous) => {
        const bouton = panneau.querySelector(`[data-atelier="${sous.id}"]`);
        return { element: sous, suffixe: `${nom} — ${texte(bouton) || sous.id}` };
      })
      : [{ element: panneau, suffixe: nom }];

    conteneurs.forEach(({ element, suffixe }) => {
      const manipulation = sectionManipulation(element, `Manipulation — ${suffixe}`);
      if (manipulation) sections.push(manipulation);
      sections.push(...sectionsTableaux(element, `Tableau — ${suffixe}`));
      sections.push(...sectionsGraphiques(element, `Graphique — ${suffixe}`));
    });

    // Observations saisies dans l'onglet (zones de notes hors sous-panneaux)
    const notes = [...panneau.querySelectorAll('.zone-eleve textarea')]
      .filter((zone) => !zone.closest('.sous-panel'))
      .map(valeur).filter(Boolean);
    if (notes.length) sections.push({ titre: `Observations — ${nom}`, texte: notes.join('\n') });
  });

  return sections;
}

// ============================================================
// 3. Questions de l'onglet visible
// ============================================================

function construireSectionsQuestions(bloc) {
  return [...bloc.querySelectorAll('.questions-tp > li')].map((li, i) => {
    const intitule = texte(li.querySelector('.question-entete strong'));
    let rappel = texte(li.querySelector('.problematique-rappel'));
    if (/^Sélectionner/.test(rappel)) rappel = '';   // texte d'invite, pas une problématique

    const section = {
      titre: `Q${i + 1}. ${intitule}`,
      notation: true,
      competence: li.querySelector('.cartouche')?.dataset.comp || '',
      texte: valeur(li.querySelector('textarea')),
    };
    if (rappel) {
      section.rappel = rappel;
      section.rappelEtiquette = 'Problématique';
    }
    return section;
  });
}

/** Fiches du puzzle (Sujet A, B, C) remplies, hors Q1–Q5 de l'onglet. */
function construireSectionsFichesPuzzle() {
  const sections = [];
  document.querySelectorAll('#activites-puzzle .questions-bloc[data-tp^="puzzle-"]').forEach((bloc) => {
    const li = bloc.querySelector('.questions-tp > li');
    if (!li) return;
    const reponse = [...li.querySelectorAll('textarea:not(.code-editeur-python), input[type="text"]')]
      .filter((champ) => !champ.closest('.form-row'))
      .map(valeur).filter(Boolean).join('\n');
    if (!reponse) return;

    const problematique = texte(li.querySelector('.puzzle-problematique'));
    sections.push({
      titre: texte(li.querySelector('.question-entete strong')) || 'Fiche puzzle',
      texte: [problematique, reponse].filter(Boolean).join('\n\n'),
      competence: li.querySelector('.cartouche')?.dataset.comp || '',
      notation: true,
    });
  });
  return sections;
}

// ============================================================
// 4. Auto-évaluation
// ============================================================

function construireSectionAutoEvaluation() {
  const lignes = [...document.querySelectorAll('.autoeval-table tbody tr[data-comp]')];
  const coche = (tr) => tr.querySelector('input[type="radio"]:checked');
  if (!lignes.some(coche)) return null;     // rien n'est imprimé tant qu'aucune case n'est cochée

  const section = {
    titre: 'Auto-évaluation des compétences',
    position: 'fin',
    tableau: {
      entetes: ['Domaine', 'Sigle', 'Je suis capable de…', 'Niveau (0 à 2)'],
      lignes: lignes.map((tr) => {
        const cellules = [...tr.children].map(texte);
        return [cellules[0], cellules[1], cellules[2], coche(tr) ? coche(tr).value : '—'];
      }),
    },
  };

  const radar = document.getElementById('radar-resultat');
  if (radar && radar.querySelector('svg, canvas, img')) {
    section.canvas = radar;
    section.echelle = 0.5;
    section.legende = 'Radar des compétences';
  }
  return section;
}

// ============================================================
// Point d'entrée
// ============================================================

/**
 * @param {Object} params
 * @param {string} params.titre - Titre du TD
 * @param {string} params.tp    - Identifiant du TD (ex. « TD01 »)
 * @param {Function} [params.sectionsSupplementaires] - retourne les sections
 *        « Manipulations » propres au TD (remplace la capture automatique)
 */
export function initImpressionCompteRendu({ titre, tp, sectionsSupplementaires } = {}) {
  suivreResultats();   // en dernier dans init() : l'initialisation du TD est terminée

  const bouton = document.getElementById('btn-imprimer');
  if (!bouton || bouton.dataset.impressionLiee) return;
  bouton.dataset.impressionLiee = '1';

  bouton.addEventListener('click', async () => {
    const contextePro = await chargerContextePro();
    let niveau = niveauTag();
    try {
      niveau = contextePro?.getFiliereSelectionnee?.()?.niveau || niveau;
    } catch (err) {
      console.warn('[compte-rendu] getFiliereSelectionnee a échoué :', err);
    }

    const supplementaires = typeof sectionsSupplementaires === 'function'
      ? (sectionsSupplementaires() || []).filter(Boolean)
      : [];
    const bloc = blocOngletActif();

    const sections = [
      construireSectionContextePro(),
      ...(supplementaires.length ? supplementaires : sectionsManipulations()),
      ...(bloc ? construireSectionsQuestions(bloc) : []),
      ...(ongletActif() === ID_PUZZLE ? construireSectionsFichesPuzzle() : []),
      construireSectionAutoEvaluation(),
    ].filter(Boolean);

    genererCompteRendu({
      titre,
      domaine: 'Géométrie',
      tp,
      sections,
      noteFinale: true,
      marque: 'mathilab',
      niveau,
    });
  });
}

/**
 * ============================================================
 * MATHILAB — Questions affichées selon l'activité réalisée
 * mathilab/js/questions-par-activite.js
 * ============================================================
 *
 * Module partagé par les 4 domaines (statistiques, algèbre,
 * géométrie, algorithmique) et importé par les fichiers
 * compte-rendu-*.js.
 *
 * Convention HTML (section « Trace écrite ») :
 *
 *   <select id="activite-realisee">
 *     <option value="">-- Choisir l'activité réalisée --</option>
 *     <option value="aires-volumes"
 *             data-tabs="aires-perimetres volumes">…</option>
 *     <option value="puzzle" data-tabs="activites-puzzle">…</option>
 *   </select>
 *
 *   <p id="activite-vide"></p>
 *   <p id="activite-avertissement" hidden></p>
 *
 *   <div class="questions-bloc" data-activite="aires-volumes" hidden>
 *     <ol class="questions-tp"><li>…</li></ol>
 *   </div>
 *
 * Les fiches du puzzle (Sujet A, B, C et synthèse) sont des
 * .questions-bloc[data-tp="puzzle-a|b|c|synthese"] placés dans
 * l'onglet « Activités Puzzle » : elles ne sont jointes au
 * compte-rendu que si l'activité « puzzle » est choisie et
 * qu'elles ont été remplies.
 * ============================================================
 */

const ID_SELECT = 'activite-realisee';
const ID_VIDE = 'activite-vide';
const ID_AVERTISSEMENT = 'activite-avertissement';
const ACTIVITE_PUZZLE = 'puzzle';

/* ============================================================
   OUTILS
   ============================================================ */

/** Valeur d'un champ (input / textarea / select), sans espaces superflus. */
export function valeur(el) {
  return (el?.value || '').trim();
}

function texte(el) {
  return (el?.textContent || '').replace(/\s+/g, ' ').trim();
}

function selectActivite() {
  return document.getElementById(ID_SELECT);
}

/** Activité actuellement choisie ('' si aucune). */
function activiteChoisie() {
  return selectActivite()?.value || '';
}

/** Les blocs de questions propres à une activité (hors fiches puzzle). */
function blocsActivite() {
  return [...document.querySelectorAll('.questions-bloc[data-activite]')];
}

function estPuzzleChoisi() {
  return activiteChoisie() === ACTIVITE_PUZZLE;
}

/* ============================================================
   AFFICHAGE
   ============================================================ */

function appliquerAffichage() {
  const activite = activiteChoisie();
  const select = selectActivite();

  blocsActivite().forEach(bloc => {
    // Sans menu d'activité, tout reste visible.
    bloc.hidden = select ? bloc.dataset.activite !== activite : false;
  });

  const vide = document.getElementById(ID_VIDE);
  if (vide) vide.hidden = !select || Boolean(activite);

  if (activite) {
    const avertissement = document.getElementById(ID_AVERTISSEMENT);
    if (avertissement) avertissement.hidden = true;
  }
}

/**
 * Affiche uniquement les questions de l'activité choisie et met
 * l'affichage à jour à chaque changement du menu « Activité réalisée ».
 */
export function initAffichageQuestionsParActivite() {
  const select = selectActivite();

  if (select && select.dataset.activiteInitialisee !== 'true') {
    select.addEventListener('change', appliquerAffichage);
    select.dataset.activiteInitialisee = 'true';
  }

  appliquerAffichage();
}

/* ============================================================
   VÉRIFICATION AVANT IMPRESSION
   ============================================================ */

/**
 * Vérifie qu'une activité est choisie avant de générer le compte-rendu.
 * Affiche l'avertissement dans le cas contraire.
 * @returns {boolean}
 */
export function verifierActiviteChoisie() {
  const select = selectActivite();

  // Pas de menu d'activité dans ce TD : rien à vérifier.
  if (!select) return true;

  const avertissement = document.getElementById(ID_AVERTISSEMENT);

  if (select.value) {
    if (avertissement) avertissement.hidden = true;
    return true;
  }

  if (avertissement) {
    avertissement.hidden = false;
    avertissement.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }
  select.focus();
  return false;
}

/* ============================================================
   PANNEAUX DE L'ACTIVITÉ
   ============================================================ */

/**
 * Panneaux d'onglets (.tab-panel) correspondant à l'activité choisie,
 * d'après l'attribut data-tabs de l'option sélectionnée.
 * @returns {HTMLElement[]}
 */
export function panneauxActiviteChoisie() {
  const select = selectActivite();
  if (!select || !select.value) return [];

  const option = select.options[select.selectedIndex];
  const ids = (option?.dataset.tabs || '').split(/\s+/).filter(Boolean);

  return ids
    .map(id => document.getElementById(id))
    .filter(Boolean);
}

/* ============================================================
   SECTIONS DU COMPTE-RENDU
   ============================================================ */

/**
 * Réponse saisie dans un élément de question : textareas (hors éditeurs
 * de code) et champs texte, hors champs « Groupe / Rôle » (.form-row).
 */
function reponseDe(conteneur) {
  return [
    ...conteneur.querySelectorAll(
      'textarea:not(.code-editeur-python), input[type="text"]'
    ),
  ]
    .filter(champ => !champ.closest('.form-row'))
    .map(valeur)
    .filter(Boolean)
    .join('\n');
}

/** Sections « question » issues d'un bloc .questions-bloc classique. */
function sectionsDuBloc(bloc) {
  return [...bloc.querySelectorAll('.questions-tp > li')].map(li => {
    const entete = li.querySelector('.question-entete');
    const intitule = texte(entete?.querySelector('strong')) || texte(entete);
    const rappel = texte(li.querySelector('.problematique-rappel'));

    return {
      titre: rappel ? `${intitule} ${rappel}` : intitule,
      texte: reponseDe(li),
      competence: li.querySelector('.cartouche')?.dataset.comp || '',
      notation: true,
    };
  });
}

/** Section issue d'une fiche du puzzle (Sujet A, B, C ou synthèse). */
function sectionDeFichePuzzle(bloc) {
  const li = bloc.querySelector('.questions-tp > li');
  if (!li) return null;

  const reponse = reponseDe(li);
  // Une fiche non remplie n'est pas reprise dans le compte-rendu.
  if (!reponse) return null;

  const intitule = texte(li.querySelector('.question-entete strong'));
  const problematique = texte(li.querySelector('.puzzle-problematique'))
    || texte(li.querySelector('.problematique-rappel'));

  const groupe = valeur(li.querySelector('.form-row input'));
  const role = valeur(li.querySelectorAll('.form-row input')[1]);

  const entete = [
    groupe ? `Groupe : ${groupe}` : '',
    role ? `Rôle : ${role}` : '',
  ].filter(Boolean).join(' — ');

  const corps = [
    entete,
    problematique,
    reponse,
  ].filter(Boolean).join('\n\n');

  return {
    titre: intitule || 'Fiche puzzle',
    texte: corps,
    competence: li.querySelector('.cartouche')?.dataset.comp || '',
    notation: true,
  };
}

/**
 * Sections du compte-rendu : uniquement les questions de l'activité
 * choisie (et, pour le puzzle, les fiches A, B, C et la synthèse remplies).
 * @returns {Object[]} sections au format attendu par genererCompteRendu()
 */
export function construireSectionsQuestionsActivite() {
  const select = selectActivite();
  const activite = activiteChoisie();

  const blocs = blocsActivite().filter(
    bloc => !select || bloc.dataset.activite === activite
  );

  const sections = blocs.flatMap(sectionsDuBloc);

  if (estPuzzleChoisi()) {
    document
      .querySelectorAll('.questions-bloc[data-tp^="puzzle-"]')
      .forEach(bloc => {
        const section = sectionDeFichePuzzle(bloc);
        if (section) sections.push(section);
      });
  }

  return sections;
}
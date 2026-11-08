/**
 * js/onglets-filiere.js — RACINE du site, point unique SciLab + MathiLab.
 *
 * Deux fonctions :
 *   1. Rendre les onglets cliquables (.tabs-container > .tabs-header > .tab-btn
 *      [data-tab] ↔ .tab-panel#<data-tab>) : classes `actif`, aria-selected,
 *      attribut hidden des panneaux, événement « ongletChange ». Un seul jeu
 *      d'écouteurs par conteneur (marqueur data-onglets-initialises, partagé
 *      avec initTabs de utils.js : le premier appelé câble, l'autre passe).
 *   2. Afficher / masquer des onglets selon la filière ET le niveau choisis dans
 *      le menu « Contexte professionnel » (js/contexte-pro.js), dont la valeur
 *      encode « <niveau>-<idFiliere> » (ex. « 1ere-tci »).
 *
 * Les onglets de premier niveau seuls sont filtrés : les sous-onglets imbriqués
 * dans un .tab-panel (ex. chimie TP02 « acido-basique ») ne sont pas concernés.
 *
 * @param {Object} params
 * @param {Object} [params.mapping]
 *   { "<niveau>-<idFiliere>": ["idOnglet1", …] }.
 *   - Clé absente → tous les onglets restent visibles.
 *   - Tableau vide [] → hors programme : tous les onglets masqués, message affiché.
 *   MathiLab filtre par data-filieres dans le contrôleur et appelle cette fonction
 *   sans argument : seul le câblage des clics s'applique alors.
 * @param {string} [params.selectId]
 * @param {string} [params.messageId] - conteneur du message « hors programme »
 * @param {string} [params.messageTexte]
 */

/* ============================================================
   CLICS SUR LES ONGLETS
   ============================================================ */

function boutonsDe(conteneur) {
  return [...conteneur.querySelectorAll(':scope > .tabs-header > .tab-btn')];
}

function panneauxDe(conteneur) {
  return [...conteneur.querySelectorAll(':scope > .tab-panel')];
}

function activerOnglet(conteneur, identifiant) {
  const boutons = boutonsDe(conteneur);
  const panneaux = panneauxDe(conteneur);
  const boutonCible = boutons.find(b => b.dataset.tab === identifiant);
  const panneauCible = panneaux.find(p => p.id === identifiant);

  if (!boutonCible || !panneauCible) {
    console.warn('[onglets] onglet introuvable :', identifiant);
    return;
  }

  boutons.forEach(b => {
    b.classList.remove('actif');
    b.setAttribute('aria-selected', 'false');
  });
  panneaux.forEach(p => {
    p.classList.remove('actif');
    p.hidden = true;
  });

  boutonCible.classList.add('actif');
  boutonCible.setAttribute('aria-selected', 'true');
  panneauCible.classList.add('actif');
  panneauCible.hidden = false;

  conteneur.dispatchEvent(new CustomEvent('ongletChange', { detail: { tab: identifiant } }));
}

function initialiserClicsOnglets(conteneur) {
  if (conteneur.dataset.ongletsInitialises === 'true') return;

  const boutons = boutonsDe(conteneur);
  if (!boutons.length || !panneauxDe(conteneur).length) return;

  boutons.forEach(bouton => {
    bouton.addEventListener('click', evenement => {
      evenement.preventDefault();
      if (!bouton.dataset.tab) {
        console.warn('[onglets] attribut data-tab absent.');
        return;
      }
      activerOnglet(conteneur, bouton.dataset.tab);
    });
  });

  conteneur.dataset.ongletsInitialises = 'true';

  // Onglet actif du HTML, sinon le premier.
  const initial = boutons.find(b => b.classList.contains('actif')) || boutons[0];
  if (initial?.dataset.tab) activerOnglet(conteneur, initial.dataset.tab);
}

/* ============================================================
   FILTRAGE PAR FILIÈRE
   ============================================================ */

export function initOngletsParFiliere({
  mapping = {},
  selectId = 'select-filiere-pro',
  messageId,
  messageTexte = "Ce TP n'est pas au programme de votre filière à ce niveau.",
} = {}) {

  // 1. Clics : toujours câblés, même sans menu de filière.
  document.querySelectorAll('.tabs-container').forEach(initialiserClicsOnglets);

  // 2. Filtrage : seulement si le menu de filière existe.
  const select = document.getElementById(selectId);
  const zoneMessage = messageId ? document.getElementById(messageId) : null;

  if (!select) return;

  // Attribut hidden (fragments sans style en ligne) ET style.display (fragments
  // des anciens domaines qui portent encore style="display:none;").
  function afficherMessage(visible) {
    if (!zoneMessage) return;
    zoneMessage.hidden = !visible;
    zoneMessage.style.display = visible ? 'block' : 'none';
  }

  function appliquer() {
    const config = mapping[select.value];

    const boutons = [...document.querySelectorAll('.tabs-header .tab-btn')]
      .filter(b => !b.closest('.tab-panel'));
    const panneaux = [...document.querySelectorAll('.tab-panel')]
      .filter(p => !p.parentElement.closest('.tab-panel'));

    // Hors programme : tout masquer, message à la place.
    if (Array.isArray(config) && config.length === 0) {
      boutons.forEach(b => { b.style.display = 'none'; });
      panneaux.forEach(p => { p.classList.remove('actif'); p.hidden = true; });

      if (zoneMessage) zoneMessage.textContent = messageTexte;
      afficherMessage(true);
      return;
    }

    afficherMessage(false);

    // Pas de règle pour cette clé (ou aucune filière choisie) : tout afficher.
    const visibles = config || null;

    boutons.forEach(b => {
      const visible = !visibles || visibles.includes(b.dataset.tab);
      b.style.display = visible ? '' : 'none';
    });

    // Onglet actif masqué → premier onglet visible ; retour d'un état hors
    // programme (aucun panneau actif) → onglet actif, sinon premier visible.
    const actif = boutons.find(b => b.classList.contains('actif'));
    const premierVisible = boutons.find(b => b.style.display !== 'none');
    if (actif && actif.style.display === 'none') {
      premierVisible?.click();
    } else if (!panneaux.some(p => p.classList.contains('actif'))) {
      (actif && actif.style.display !== 'none' ? actif : premierVisible)?.click();
    }
  }

  select.addEventListener('change', appliquer);
  appliquer();
}

export default initOngletsParFiliere;

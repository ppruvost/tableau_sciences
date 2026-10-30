/**
 * tp-chimie/js/molecule-3d.js
 *
 * Module partagé des TP de chimie : bouton « Voir en 3D » qui ouvre
 * directement, dans une fenêtre superposée à la page, le projet /molecule
 * (viewer 3Dmol.js) avec la recherche déjà lancée (molecule/index.html?q=<nom>).
 * La fenêtre se referme avec le bouton rond bleu « − » (ou Échap, ou clic
 * sur le fond) : plus de nouvel onglet.
 *
 * Principe :
 *   - le bouton n'est affiché que si la molécule existe dans
 *     molecule/molecules.json (recherche par numéro CAS, puis par nom ou
 *     alias, accents et casse ignorés — même règle que molecule/script.js) :
 *     jamais de bouton menant à « Molécule non trouvée » ;
 *   - si molecules.json est injoignable (hors ligne, ouverture en file://),
 *     le bouton reste affiché : le viewer cherchera alors la molécule sur
 *     PubChem à partir du nom ;
 *   - aucun <script> ni style en ligne dans les fragments : les boutons sont
 *     produits par les contrôleurs (bouton3D) ou par afficherBouton3D*, et
 *     un seul écouteur délégué sur document gère tous les clics.
 *
 * Pour ajouter une molécule absente : molecule/outils/ajouter_molecules.py.
 */

// Chemin du projet molecule/ vu depuis tp-chimie/index.html
export const CHEMIN_MOLECULE = '../../molecule/';

const URL_JSON = `${CHEMIN_MOLECULE}molecules.json`;
const URL_VIEWER = `${CHEMIN_MOLECULE}index.html`;

/* ==========================================================
   RECHERCHE DANS molecules.json
   ========================================================== */

export function normaliser(texte) {
  return String(texte ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .trim();
}

let promesseMolecules = null;

/** Liste des molécules (mise en cache), ou null si le fichier est injoignable. */
function chargerMolecules() {
  if (!promesseMolecules) {
    promesseMolecules = fetch(URL_JSON)
      .then(r => (r.ok ? r.json() : null))
      .then(liste => (Array.isArray(liste) ? liste : null))
      .catch(() => null);
  }
  return promesseMolecules;
}

/**
 * Molécule correspondant à un nom (et/ou un CAS) : CAS exact, puis nom ou
 * alias identique, puis nom ou alias contenant la saisie.
 */
export function trouverMolecule(liste, { nom, cas } = {}) {
  if (!Array.isArray(liste)) return null;

  if (cas) {
    const parCas = liste.find(m => m.cas === cas || (m.cas_autres || []).includes(cas));
    if (parCas) return parCas;
  }

  const requete = normaliser(nom);
  if (!requete) return null;

  const noms = m => [m.nom, ...(m.aliases || [])].map(normaliser);

  return liste.find(m => noms(m).includes(requete))
    || liste.find(m => noms(m).some(n => n.includes(requete)))
    || null;
}

/* ==========================================================
   BOUTONS
   ========================================================== */

/** « acide éthanoïque (acétique) » -> « acide éthanoïque » (nom cherchable). */
export function nomSansParentheses(nom) {
  return String(nom ?? '').replace(/\s*\(.*\)\s*$/, '').trim();
}

function echapper(texte) {
  return String(texte ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function libelleBouton(nom) {
  return `🧊 Voir « ${nom} » en 3D`;
}

/**
 * HTML d'un bouton « Voir en 3D » (masqué tant que initBoutons3D n'a pas
 * vérifié que la molécule existe). À insérer dans un innerHTML, puis appeler
 * initBoutons3D(zone).
 *
 * @param {string} nom  nom de la molécule tel qu'affiché dans le TP
 * @param {Object} [options]
 * @param {string} [options.cas]      numéro CAS, pour un rapprochement fiable
 * @param {string} [options.libelle]  nom affiché sur le bouton (défaut : nom)
 */
export function bouton3D(nom, { cas = '', libelle = '' } = {}) {
  const affiche = libelle || nom;
  return `<button type="button" class="btn btn-secondaire btn-molecule-3d" hidden
    data-molecule="${echapper(nom)}"${cas ? ` data-cas="${echapper(cas)}"` : ''}
    data-libelle="${echapper(affiche)}"
    aria-label="Voir la molécule ${echapper(affiche)} en 3D (ouvre une fenêtre)">${echapper(libelleBouton(affiche))}</button>`;
}

/** Affiche les boutons 3D d'une zone dont la molécule existe dans molecules.json. */
export async function initBoutons3D(racine = document) {
  const boutons = [...racine.querySelectorAll('.btn-molecule-3d[data-molecule]')];
  if (!boutons.length) return;

  const liste = await chargerMolecules();

  boutons.forEach(bouton => {
    // La zone a pu être réécrite pendant le chargement.
    if (!bouton.isConnected) return;

    if (liste === null) {
      // molecules.json injoignable : le viewer interrogera PubChem
      bouton.dataset.moleculeNom = bouton.dataset.molecule;
      bouton.hidden = false;
      return;
    }

    const trouvee = trouverMolecule(liste, {
      nom: bouton.dataset.molecule,
      cas: bouton.dataset.cas,
    });

    if (trouvee) {
      bouton.dataset.moleculeNom = trouvee.nom; // nom canonique du JSON
      bouton.hidden = false;
    } else {
      bouton.hidden = true;
    }
  });
}

/** Remplit une zone avec un bouton 3D et le vérifie. */
export function afficherBouton3D(zone, nom, options = {}) {
  if (!zone) return;
  zone.innerHTML = nom ? bouton3D(nom, options) : '';
  if (nom) initBoutons3D(zone);
}

/**
 * Bouton 3D du réactif sélectionné, sous son bloc de sécurité
 * (#securite-bloc par défaut). La zone #molecule3d-<id> est créée au besoin,
 * juste après le bloc : le fragment HTML reste inchangé.
 *
 * @param {Object|null} produit  produit de data/products.js (nom, cas)
 * @param {string} [zoneSecuriteId]
 */
export function afficherBouton3DProduit(produit, zoneSecuriteId = 'securite-bloc') {
  const ancre = document.getElementById(zoneSecuriteId);
  if (!ancre) return;

  const idZone = `molecule3d-${zoneSecuriteId}`;
  let zone = document.getElementById(idZone);

  if (!zone) {
    zone = document.createElement('div');
    zone.id = idZone;
    zone.className = 'molecule-3d-zone';
    ancre.insertAdjacentElement('afterend', zone);
  }

  if (!produit || !produit.nom) {
    zone.innerHTML = '';
    return;
  }

  afficherBouton3D(zone, produit.nom, { cas: produit.cas || '' });
}

/**
 * Zone 3D insérée juste après un élément existant (ex. un <select>), pour les
 * espèces qui ne passent pas par le bloc de sécurité.
 */
export function zone3DApres(element, id) {
  if (!element) return null;
  let zone = document.getElementById(id);
  if (!zone) {
    zone = document.createElement('div');
    zone.id = id;
    zone.className = 'molecule-3d-zone';
    element.insertAdjacentElement('afterend', zone);
  }
  return zone;
}

/* ==========================================================
   CLIC : un seul écouteur pour tous les TP
   ========================================================== */

export function urlViewer(nom) {
  // embed=1 : mise en page compacte du viewer (molécule visible sans défiler).
  // Le nom est transmis par TROIS canaux, car certains serveurs / redirections
  // suppriment la chaîne de requête (?q=) :
  //   1. ?q=<nom>   2. #q=<nom> (l'ancre survit aux redirections)
  //   3. message postMessage envoyé à l'iframe une fois chargée (voir plus bas).
  // t=... évite qu'une ancienne version de la page viewer reste en cache.
  const q = encodeURIComponent(nom);
  return `${URL_VIEWER}?q=${q}&embed=1&t=${Date.now()}#q=${q}`;
}

/* ==========================================================
   FENÊTRE 3D (iframe du viewer + bouton rond bleu « − »)
   ========================================================== */

let fenetre = null;
let declencheur = null;
let nomCourant = '';

/** Envoie le nom à la page viewer (iframe) : canal de secours si ?q= est perdu. */
function envoyerNomAuViewer() {
  const cadre = fenetre?.querySelector('.mol3d-cadre');
  if (!cadre?.contentWindow || !nomCourant) return;
  cadre.contentWindow.postMessage({ type: 'mol3d:recherche', nom: nomCourant }, '*');
}

function creerFenetre() {
  if (fenetre) return fenetre;

  fenetre = document.createElement('div');
  fenetre.className = 'mol3d-overlay';
  fenetre.hidden = true;
  fenetre.innerHTML = `
    <div class="mol3d-fenetre" role="dialog" aria-modal="true" aria-labelledby="mol3d-titre">
      <div class="mol3d-entete">
        <h3 id="mol3d-titre" class="mol3d-titre"></h3>
        <button type="button" class="btn-rond-bleu mol3d-fermer"
                aria-label="Fermer la fenêtre 3D" title="Fermer">−</button>
      </div>
      <iframe class="mol3d-cadre" title="Molécule en 3D"></iframe>
    </div>`;
  document.body.appendChild(fenetre);

  fenetre.addEventListener('click', e => {
    if (e.target === fenetre || e.target.closest('.mol3d-fermer')) fermerMolecule3D();
  });

  // Dès que l'iframe est chargée, on lui donne le nom à chercher.
  fenetre.querySelector('.mol3d-cadre').addEventListener('load', envoyerNomAuViewer);

  // Le viewer signale aussi lui-même qu'il est prêt (au cas où « load » serait passé trop tôt).
  window.addEventListener('message', e => {
    const cadre = fenetre?.querySelector('.mol3d-cadre');
    if (cadre && e.source === cadre.contentWindow && e.data?.type === 'mol3d:pret') {
      envoyerNomAuViewer();
    }
  });
  return fenetre;
}

export function ouvrirMolecule3D(nom, bouton = null) {
  creerFenetre();
  declencheur = bouton;
  nomCourant = nom;
  fenetre.querySelector('.mol3d-titre').textContent = nom;
  // La fenêtre est affichée AVANT de charger le viewer : le conteneur 3D
  // a ainsi une taille mesurable dès le démarrage.
  fenetre.hidden = false;
  fenetre.querySelector('.mol3d-cadre').src = urlViewer(nom);
  document.body.classList.add('mol3d-ouverte');
  fenetre.querySelector('.mol3d-fermer').focus();
}

export function fermerMolecule3D() {
  if (!fenetre || fenetre.hidden) return;
  fenetre.hidden = true;
  nomCourant = '';
  fenetre.querySelector('.mol3d-cadre').src = 'about:blank'; // libère le contexte WebGL
  document.body.classList.remove('mol3d-ouverte');
  if (declencheur && declencheur.isConnected) declencheur.focus();
  declencheur = null;
}

/* ==========================================================
   CLIC : un seul écouteur pour tous les TP
   ========================================================== */

let ecouteurInstalle = false;

export function installerEcouteur3D() {
  if (ecouteurInstalle || typeof document === 'undefined') return;
  ecouteurInstalle = true;

  document.addEventListener('click', evenement => {
    const bouton = evenement.target.closest?.('.btn-molecule-3d');
    if (!bouton) return;

    const nom = bouton.dataset.moleculeNom || bouton.dataset.molecule;
    if (!nom) return;

    evenement.preventDefault();
    ouvrirMolecule3D(nom, bouton);
  });

  document.addEventListener('keydown', evenement => {
    if (evenement.key === 'Escape') fermerMolecule3D();
  });
}

// Installé dès l'import : le module reste en cache d'un TP à l'autre,
// l'écouteur n'est donc posé qu'une fois.
installerEcouteur3D();
/**
 * laboratory/js/geogebra-pdf.js
 *
 * Bouton bleu « Imprimer en PDF » pour les réalisations sous GéoGébra
 * (Classique ou 3D). Il génère un compte rendu dans le style des autres
 * comptes rendus (en-tête MathiLab, pied de page, identifiant unique id=xxxxxxxx),
 * en s’appuyant sur laboratory/js/compte-rendu.js.
 *
 * Contenu du PDF :
 *   - la figure : vue graphique active de GéoGébra (2D ou 3D), exportée en PNG ;
 *   - la construction : tableau Objet / Type / Définition / Valeur de tous
 *     les objets créés (points, polygones, curseurs, nombres, …).
 *
 * Utilisation (page qui contient GéoGébra) :
 *
 *   <script type="module">
 *     import { initBoutonPdfGeoGebra } from '../laboratory/js/geogebra-pdf.js';
 *     initBoutonPdfGeoGebra({ conteneur: document.querySelector('#page-geogebra') });
 *   </script>
 *
 * Options :
 *   conteneur  élément dans lequel la barre est insérée (en premier) ;
 *   avant      ou : élément devant lequel la barre est insérée ;
 *              (sans l’un ni l’autre : barre flottante en bas à droite)
 *   applet     objet ggbApplet, ou fonction qui le renvoie
 *              (par défaut : window.ggbApplet, puis les <iframe> de même origine) ;
 *   titre      titre du document (défaut : « Réalisation sous GéoGébra ») ;
 *   niveau     '2nde' | '1ère' | 'Tle' (pastille de l’en-tête, facultatif) ;
 *   marque     'mathilab' (défaut) | 'scilab' | 'pylab' | 'algolab' ;
 *   domaine    étiquette de l’en-tête (défaut : « Géométrie »).
 *   tp         texte ou fonction renvoyant le texte de l’étiquette
 *              (ex. () => 'GéoGébra 3D') ; défaut : détecté d’après la perspective.
 *
 * Barre flottante : les champs d’identification restent masqués ; au premier
 * clic, si le nom ou le prénom manque, ils s’affichent (le PDF n’est généré
 * qu’au clic suivant).
 *
 * Nom, prénom, classe et date : si la page n’a pas déjà les champs
 * #nom-eleve, #prenom-eleve, #classe-eleve et #date-eleve, la barre les ajoute
 * (compte-rendu.js les lit et exige le nom et le prénom).
 *
 * Remarque : l’API de GéoGébra n’est accessible que si l’applet est injecté dans
 * la page avec deployggb.js (GGBApplet) ou si l’iframe est de même origine.
 * Un <iframe src="https://www.geogebra.org/…"> est inaccessible (sécurité du navigateur).
 */

import { genererCompteRendu } from './compte-rendu.js';

/* ==========================================================
   CONSTANTES
   ========================================================== */

const MAX_OBJETS = 150;      // au-delà, la liste est tronquée (avec mention)

const TYPES = {
  point: 'Point', segment: 'Segment', line: 'Droite', ray: 'Demi-droite',
  vector: 'Vecteur', polygon: 'Polygone', circle: 'Cercle', conic: 'Conique',
  arc: 'Arc', sector: 'Secteur', number: 'Nombre', angle: 'Angle',
  text: 'Texte', function: 'Fonction', curve: 'Courbe', locus: 'Lieu',
  list: 'Liste', boolean: 'Booléen', image: 'Image', plane: 'Plan',
  sphere: 'Sphère', quadric: 'Quadrique', polyhedron: 'Polyèdre',
  surface: 'Surface', cone: 'Cône', cylinder: 'Cylindre', prism: 'Prisme',
  pyramid: 'Pyramide', cube: 'Cube', tetrahedron: 'Tétraèdre', net: 'Patron',
};

/* ==========================================================
   APPLET GÉOGÉBRA
   ========================================================== */

function trouverApplet(source) {
  const valide = a => a && typeof a.getPNGBase64 === 'function' ? a : null;

  if (typeof source === 'function') return valide(source());
  if (source) return valide(source);

  const global = valide(window.ggbApplet);
  if (global) return global;

  // Applet injecté avec un identifiant autre que « ggbApplet » (GGBApplet({ id: … })) :
  // il est alors publié sous ce nom dans window.
  for (const cle of Object.keys(window)) {
    try {
      const v = window[cle];
      if (v && typeof v.getPNGBase64 === 'function' && typeof v.getAllObjectNames === 'function') return v;
    } catch (err) {
      /* propriété inaccessible : on continue */
    }
  }

  for (const cadre of document.querySelectorAll('iframe')) {
    try {
      const a = valide(cadre.contentWindow?.ggbApplet);
      if (a) return a;
    } catch (err) {
      /* iframe d’une autre origine : inaccessible, on continue */
    }
  }
  return null;
}

function est3D(app) {
  try {
    // Code de perspective GéoGébra : la lettre « T » désigne la vue graphique 3D.
    return /T/.test(String(app.getPerspective?.() || ''));
  } catch (err) {
    return false;
  }
}

function exporterFigure(app) {
  try {
    let b64 = app.getPNGBase64(1.5, false, 96);
    if (!b64) return null;
    if (!String(b64).startsWith('data:')) b64 = 'data:image/png;base64,' + b64;

    const img = new Image();
    img.src = b64;
    return img;
  } catch (err) {
    console.error('[geogebra-pdf] export de la figure impossible :', err);
    return null;
  }
}

function echapperRegex(texte) {
  return String(texte).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function lireConstruction(app) {
  let noms = [];
  try {
    noms = app.getAllObjectNames() || [];
  } catch (err) {
    console.error('[geogebra-pdf] lecture des objets impossible :', err);
  }

  const lignes = noms.slice(0, MAX_OBJETS).map(nom => {
    let type = '';
    let definition = '';
    let valeur = '';

    try { type = app.getObjectType(nom) || ''; } catch (err) { /* ignoré */ }
    try { definition = app.getCommandString(nom) || ''; } catch (err) { /* ignoré */ }
    try { valeur = app.getValueString(nom) || ''; } catch (err) { /* ignoré */ }

    // « a = 6 » → « 6 » : le nom est déjà dans la première colonne.
    valeur = valeur.replace(new RegExp('^\\s*' + echapperRegex(nom) + '\\s*[=:]\\s*'), '');

    return [
      nom,
      TYPES[type.toLowerCase()] || type || '—',
      definition || '—',
      valeur || '—',
    ];
  });

  return { lignes, total: noms.length };
}

/* ==========================================================
   SECTIONS DU COMPTE RENDU
   ========================================================== */

function construireSections(app) {
  const sections = [];

  const figure = exporterFigure(app);
  if (figure) {
    sections.push({ titre: 'Figure', canvas: figure, echelle: 0.9 });
  }

  const { lignes, total } = lireConstruction(app);
  const entetes = ['Objet', 'Type', 'Définition', 'Valeur'];

  // Un seul tableau « fluide » : il commence juste sous la figure, sur la même page,
  // et se poursuit sur les pages suivantes (en-tête répété, lignes jamais coupées).
  if (lignes.length) {
    sections.push({
      titre: 'Construction',
      tableau: { entetes, lignes },
      fluide: true,
    });
  }

  if (total > MAX_OBJETS) {
    sections.push({
      texte: `… ${total - MAX_OBJETS} objet(s) supplémentaire(s) non listé(s).`,
    });
  }

  return sections;
}

/* ==========================================================
   BARRE « IDENTIFICATION + IMPRIMER EN PDF »
   ========================================================== */

const STYLE = `
.ggb-pdf-barre {
  display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px;
  padding: 10px 14px; box-sizing: border-box;
  background: #f5f9fc; border: 1px solid #d5e2ec; border-radius: 12px;
  font-family: inherit; color: #243b73;
}
.ggb-pdf-flottante {
  position: fixed; right: 16px; bottom: 16px; z-index: 10001;
  max-width: calc(100vw - 32px);
  box-shadow: 0 6px 20px rgba(20, 40, 70, 0.25);
}
.ggb-pdf-barre[hidden] { display: none !important; }
.ggb-pdf-flottante { flex-direction: column; align-items: stretch; }
.ggb-pdf-flottante .ggb-pdf-champs { flex-direction: column; width: 250px; }
.ggb-pdf-flottante .ggb-pdf-champ { flex: 0 0 auto; }
.ggb-pdf-flottante:not(.ggb-pdf-ouverte) .ggb-pdf-champs { display: none; }
.ggb-pdf-champs { display: flex; flex-wrap: wrap; gap: 12px; flex: 1 1 auto; }
.ggb-pdf-champ { display: flex; flex-direction: column; gap: 4px; flex: 1 1 130px; min-width: 110px; }
.ggb-pdf-champ label { font-size: 0.8rem; font-weight: bold; color: #243b73; }
.ggb-pdf-champ input {
  min-height: 38px; padding: 0 10px; box-sizing: border-box; width: 100%;
  color: #172033; font-size: 0.95rem; font-family: inherit;
  border: 1px solid #c3d3ec; border-radius: 6px; background: #e9effd;
}
.ggb-pdf-champ input:focus { outline: 3px solid #1e90ff; outline-offset: 1px; background: #f8fcff; }
.ggb-pdf-bouton {
  min-height: 44px; padding: 0 22px; display: inline-flex; align-items: center;
  justify-content: center; gap: 9px; cursor: pointer;
  color: #ffffff; font-size: 0.95rem; font-weight: bold; font-family: inherit;
  border: none; border-radius: 9px; background: #4169e1;
  box-shadow: 0 3px 8px rgba(65, 105, 225, 0.20);
  transition: background 0.2s ease, transform 0.2s ease;
}
.ggb-pdf-bouton:hover:not(:disabled) { background: #1e90ff; transform: translateY(-2px); }
.ggb-pdf-bouton:focus-visible { outline: 3px solid #1e90ff; outline-offset: 3px; }
.ggb-pdf-bouton:disabled { cursor: wait; opacity: 0.55; }
.ggb-pdf-bouton svg { width: 20px; height: 20px; flex: 0 0 auto; }
@media print { .ggb-pdf-barre { display: none !important; } }
`;

const ICONE_PDF = `
<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/>
  <path d="M6 14h12v7H6z" fill="currentColor" fill-opacity="0.25"/>
</svg>`;

function injecterStyle() {
  if (document.getElementById('ggb-pdf-style')) return;
  const style = document.createElement('style');
  style.id = 'ggb-pdf-style';
  style.textContent = STYLE;
  document.head.appendChild(style);
}

function dateDuJour() {
  const d = new Date();
  return d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');
}

function champHtml(id, libelle, type = 'text', autocomplete = 'off') {
  return `<div class="ggb-pdf-champ">
    <label for="${id}">${libelle}</label>
    <input id="${id}" type="${type}" autocomplete="${autocomplete}" spellcheck="false">
  </div>`;
}

function creerBarre() {
  const barre = document.createElement('div');
  barre.className = 'ggb-pdf-barre';
  barre.setAttribute('role', 'group');
  barre.setAttribute('aria-label', 'Compte rendu PDF');

  // Champs d’identification : seulement si la page ne les a pas déjà.
  const identiteDansLaPage = Boolean(document.getElementById('nom-eleve'));

  barre.innerHTML = `
    ${identiteDansLaPage ? '' : `<div class="ggb-pdf-champs">
      ${champHtml('nom-eleve', 'Nom', 'text', 'family-name')}
      ${champHtml('prenom-eleve', 'Prénom', 'text', 'given-name')}
      ${champHtml('classe-eleve', 'Classe')}
      ${champHtml('date-eleve', 'Date', 'date')}
    </div>`}
    <button type="button" class="ggb-pdf-bouton" title="Générer le compte rendu en PDF">
      ${ICONE_PDF}
      Imprimer en PDF
    </button>`;

  return barre;
}

/* ==========================================================
   POINT D’ENTRÉE
   ========================================================== */

export function initBoutonPdfGeoGebra(options = {}) {
  const {
    conteneur,
    avant,
    applet,
    titre = 'Réalisation sous GéoGébra',
    niveau,
    marque = 'mathilab',
    domaine = 'Géométrie',
    tp,
  } = options;

  injecterStyle();

  const barre = creerBarre();
  const bouton = barre.querySelector('.ggb-pdf-bouton');

  if (avant && avant.parentNode) {
    avant.parentNode.insertBefore(barre, avant);
  } else if (conteneur) {
    conteneur.prepend(barre);
  } else {
    barre.classList.add('ggb-pdf-flottante');
    document.body.appendChild(barre);
  }

  // Date du jour par défaut (champ ajouté par la barre, ou déjà présent et vide).
  const date = document.getElementById('date-eleve');
  if (date && !date.value) date.value = dateDuJour();

  bouton.addEventListener('click', async () => {

    // Barre flottante : identification masquée tant qu’elle n’est pas nécessaire.
    const manque = ['nom-eleve', 'prenom-eleve'].find(id => {
      const champ = document.getElementById(id);
      return champ && !champ.value.trim();
    });

    if (manque && barre.classList.contains('ggb-pdf-flottante')
        && !barre.classList.contains('ggb-pdf-ouverte')) {
      barre.classList.add('ggb-pdf-ouverte');
      document.getElementById(manque).focus();
      return;
    }

    const app = trouverApplet(applet);

    if (!app) {
      window.alert('GéoGébra n’est pas encore chargé (ou n’est pas accessible). Attends quelques secondes puis réessaie.');
      return;
    }

    bouton.disabled = true;

    try {
      const sections = construireSections(app);

      if (!sections.length) {
        window.alert('Rien à imprimer : la construction GéoGébra est vide.');
        return;
      }

      await genererCompteRendu({
        marque,
        titre,
        domaine,
        tp: (typeof tp === 'function' ? tp() : tp) || (est3D(app) ? 'GéoGébra 3D' : 'GéoGébra'),
        niveau,
        sections,
      });

    } catch (err) {
      console.error('[geogebra-pdf] impression impossible :', err);
      window.alert('Impossible de générer le PDF : ' + err.message);

    } finally {
      bouton.disabled = false;
    }
  });

  return { barre, bouton };
}

export default initBoutonPdfGeoGebra;
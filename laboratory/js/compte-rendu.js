/**
 * laboratory/js/compte-rendu.js
 *
 * Module partagé de génération et d'impression du compte rendu de TP
 * (tp-electricite, tp-mecanique, …). Le style provient de css/compte-rendu.css,
 * chargé à la demande (trame @media print du document imprimé).
 *
 *   genererCompteRendu({ titre, domaine, tp, sections, noteFinale, canvases })
 *
 * Sections acceptées :
 *   { titre, items: [{ label, valeur }] }
 *   { titre, tableau: { entetes: [], lignes: [[]] }, canvas?, legende? }
 *   { titre, notation: true, competence, texte }   (question notée 0 / 1 / 2)
 *   { titre, texte }                               (texte libre)
 * En-tête : marque: 'scilab' (défaut) | 'mathilab', discipline? (texte en haut à droite),
 *   domaine + tp (étiquette), titre (titre du TP).
 * Option commune : position: 'fin' → la rubrique est imprimée après les questions.
 *
 * `canvas` (section) et `canvases[].canvas` acceptent un <canvas>, un <svg> ou un
 * conteneur qui en contient un (ex. <div class="graphique-conteneur">) ; le
 * graphique est capturé en image au moment de l'impression.
 *
 * Le matériel coché (.materiel-check-input dans #materiel-verrerie /
 * #materiel-equipements) est repris automatiquement.
 *
 * Déroulement : aucune fenêtre intermédiaire. L'identité est lue dans la rubrique
 * « Identification » de la page (#nom-eleve, #prenom-eleve, #classe-eleve,
 * #date-eleve ; nom et prénom obligatoires) et toutes les parties sont imprimées.
 * Le document est construit dans une iframe hors écran (copie des feuilles
 * de style de la page + compte-rendu.css), puis imprimé : l'élève choisit
 * « Enregistrer au format PDF ». Le titre du document est
 * NOM_Prenom_TPxx_compte-rendu, qui devient le nom de fichier proposé.
 *
 * Pourquoi une iframe plutôt que body.cr-printing : si `afterprint` n'est pas
 * déclenché (iOS Safari, annulation sur certains navigateurs), la page restait
 * entièrement masquée ; l'iframe n'affecte jamais la page de l'élève.
 */

/* ==========================================================
   CHARGEMENT DU CSS (à la demande)
   ========================================================== */

// css/compte-rendu.css, relatif à ce module (laboratory/js/ → laboratory/css/).
const URL_CSS = new URL('../css/compte-rendu.css', import.meta.url).href;

let promesseCss = null;

function chargerCss() {
  if (promesseCss) return promesseCss;

  promesseCss = new Promise(resolve => {
    const existant = document.getElementById('cr-css');

    if (existant) {
      if (existant.sheet) { resolve(); return; }
      existant.addEventListener('load', () => resolve(), { once: true });
      existant.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    const link = document.createElement('link');
    link.id = 'cr-css';
    link.rel = 'stylesheet';
    link.href = URL_CSS;
    link.addEventListener('load', () => resolve(), { once: true });
    link.addEventListener('error', () => {
      console.error('[compte-rendu] CSS introuvable :', URL_CSS);
      resolve(); // on continue : le document reste imprimable, sans mise en forme
    }, { once: true });
    document.head.appendChild(link);
  });

  return promesseCss;
}

/* ==========================================================
   UTILITAIRES
   ========================================================== */

function e(valeur) {
  return String(valeur ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Texte saisi par l'élève : les retours à la ligne sont conservés à l'impression.
function eMulti(valeur) {
  return e(valeur).replace(/\r?\n/g, '<br>');
}

function canvasVersImage(canvas) {
  if (!canvas || !canvas.width || !canvas.height) return null;
  try {
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('[compte-rendu] capture du canvas impossible :', err);
    return null;
  }
}

// Propriétés recopiées en style en ligne : une image SVG chargée via data: URI
// ne voit ni les feuilles de style de la page ni les variables CSS (var(--…)).
const PROPRIETES_SVG = [
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap',
  'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity',
  'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
  'dominant-baseline',
];

function svgVersImage(svg) {
  try {
    const boite = svg.getBoundingClientRect();
    const clone = svg.cloneNode(true);
    const origines = [svg, ...svg.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];

    origines.forEach((origine, i) => {
      const style = getComputedStyle(origine);
      const css = PROPRIETES_SVG
        .map(p => [p, style.getPropertyValue(p)])
        .filter(([, v]) => v)
        .map(([p, v]) => `${p}:${v}`)
        .join(';');
      if (copies[i] && css) copies[i].setAttribute('style', css);
    });

    let [vx, vy, vw, vh] = (clone.getAttribute('viewBox') || '')
      .split(/[\s,]+/).map(Number);

    if (!(vw > 0 && vh > 0)) {
      if (!(boite.width > 0 && boite.height > 0)) return null;
      vx = 0; vy = 0; vw = boite.width; vh = boite.height;
      clone.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    }

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', boite.width > 0 ? boite.width : vw);
    clone.setAttribute('height', boite.height > 0 ? boite.height : vh);

    const fond = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fond.setAttribute('x', vx);
    fond.setAttribute('y', vy);
    fond.setAttribute('width', vw);
    fond.setAttribute('height', vh);
    fond.setAttribute('style', 'fill:#fff;stroke:none');
    clone.insertBefore(fond, clone.firstChild);

    const xml = new XMLSerializer().serializeToString(clone);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  } catch (err) {
    console.error('[compte-rendu] capture du SVG impossible :', err);
    return null;
  }
}

// <canvas>, <svg> ou conteneur d'un des deux → URL d'image (ou null).
function elementVersImage(el) {
  if (!el) return null;
  if (typeof HTMLCanvasElement !== 'undefined' && el instanceof HTMLCanvasElement) {
    return canvasVersImage(el);
  }
  if (el.matches?.('svg')) return svgVersImage(el);

  const canvas = el.querySelector?.('canvas');
  if (canvas) {
    const src = canvasVersImage(canvas);
    if (src) return src;
  }
  const svg = el.querySelector?.('svg');
  if (svg) return svgVersImage(svg);
  return null;
}

function lireMateriel(idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return [];
  return [...conteneur.querySelectorAll('.materiel-check-input:checked')]
    .map(cb => cb.dataset.nom)
    .filter(Boolean);
}

function dateFr(valeurIso) {
  const d = valeurIso ? new Date(valeurIso + 'T12:00:00') : new Date();
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR');
}

// NOM_Prenom_TP01_compte-rendu : nom de fichier proposé pour le PDF.
function nomFichier(config, eleve) {
  return [eleve.nom, eleve.prenom, config.tp, 'compte-rendu']
    .filter(Boolean)
    .join('_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ==========================================================
   BLOCS DU DOCUMENT IMPRIMÉ
   ========================================================== */

const STYLE_TABLEAU = 'width:100%;border-collapse:collapse;font-size:8pt;margin:4px 0;';
const STYLE_CELLULE = 'border:1px solid #9CA3AF;padding:3px 6px;text-align:center;';

function htmlItems(items) {
  return `<table class="cr-items"><tbody>${items.map(it =>
    `<tr><td>${e(it.label)}</td><td>${eMulti(it.valeur)}</td></tr>`).join('')}</tbody></table>`;
}

function htmlTableau({ entetes = [], lignes = [] }) {
  const th = entetes.map(h => `<th style="${STYLE_CELLULE}background:#EAF1F8;">${e(h)}</th>`).join('');
  const tr = lignes.map(l =>
    `<tr>${l.map(c => `<td style="${STYLE_CELLULE}">${e(c)}</td>`).join('')}</tr>`).join('');
  return `<table style="${STYLE_TABLEAU}"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

function htmlGraphique(source, legende) {
  const src = elementVersImage(source);
  if (!src) return '';
  return `<img class="cr-graphique" src="${e(src)}" alt="">`
    + (legende ? `<p class="cr-vide" style="margin:2px 0 0;font-size:7.5pt;">${e(legende)}</p>` : '');
}

function htmlSection(section) {
  let corps = '';
  if (Array.isArray(section.items) && section.items.length) corps += htmlItems(section.items);
  if (section.tableau) corps += htmlTableau(section.tableau);
  if (section.canvas) corps += htmlGraphique(section.canvas, section.legende);
  if (section.texte && !section.notation) {
    corps += `<div class="cr-texte-libre">${eMulti(section.texte)}</div>`;
  }
  return `<div class="cr-section">${section.titre ? `<h3>${e(section.titre)}</h3>` : ''}${corps}</div>`;
}

function htmlQuestion(q) {
  const reponse = q.texte
    ? eMulti(q.texte)
    : '<span class="cr-vide">(pas de réponse saisie)</span>';
  return `
    <div class="cr-section cr-section-question">
      <div class="cr-question-entete">
        <p class="cr-question-titre">${e(q.titre)}</p>
        <div class="cr-question-droite">
          ${q.competence ? `<span class="cr-comp-badge" style="color:#1B6CA8;border-color:#1B6CA8;">${e(q.competence)}</span>` : ''}
          <span class="cr-notation">
            <span class="cr-notation-label">Note</span>
            <span class="cr-notation-case">0</span>
            <span class="cr-notation-case">1</span>
            <span class="cr-notation-case">2</span>
          </span>
        </div>
      </div>
      <div class="cr-reponse-zone">${reponse}</div>
    </div>`;
}

function htmlMateriel() {
  const verrerie = lireMateriel('materiel-verrerie');
  const equipements = lireMateriel('materiel-equipements');
  if (!verrerie.length && !equipements.length) return '';

  const bloc = (titre, noms) => noms.length
    ? `<h4>${titre}</h4><ul class="cr-materiel">${noms.map(n => `<li>${e(n)}</li>`).join('')}</ul>`
    : '';

  return `<div class="cr-section"><h3>Matériel utilisé</h3>${bloc('Équipements', equipements)}${bloc('Verrerie', verrerie)}</div>`;
}

function htmlCourbes(canvases) {
  const blocs = (canvases || []).map(({ canvas, titre }) => {
    const img = htmlGraphique(canvas, null);
    return img ? `<h4>${e(titre)}</h4>${img}` : '';
  }).filter(Boolean);
  return blocs.length ? `<div class="cr-section"><h3>Graphiques</h3>${blocs.join('')}</div>` : '';
}

function htmlNoteFinale(nbQuestions) {
  const total = nbQuestions * 2;
  return `
    <div class="cr-note-finale">
      <div class="cr-note-grille">
        <div class="cr-note-bareme">
          <span class="cr-note-label">Barème</span>
          <span class="cr-note-val">0 = non traité · 1 = partiel · 2 = réussi</span>
        </div>
        ${nbQuestions ? `
        <div class="cr-note-case">
          <span class="cr-note-label">Total</span>
          <span class="cr-note-blanc">…… / ${total}</span>
        </div>` : ''}
        <div class="cr-note-case cr-note-grande">
          <span class="cr-note-label">Note</span>
          <span class="cr-note-blanc">…… / 20</span>
        </div>
      </div>
    </div>`;
}

// Logos des deux modèles d'en-tête (SciLab : fiole grise ; MathiLab : calculatrice bleue).
const LOGO_SCILAB = `
  <svg viewBox="0 0 34 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 2h14v4h-2.5v9.5l8 14.2a3.2 3.2 0 0 1-2.8 4.8H7.3A3.2 3.2 0 0 1 4.5 29.7l8-14.2V6H10z" fill="#4B5563"/>
    <rect x="12.5" y="22" width="9" height="1.8" rx="0.9" fill="#fff"/>
    <circle cx="16" cy="28" r="1.7" fill="#fff"/>
    <circle cx="21.5" cy="30" r="1.2" fill="#fff"/>
  </svg>`;

const LOGO_MATHILAB = `
  <svg viewBox="0 0 34 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="1" width="30" height="38" rx="5" fill="#1B6CA8" stroke="#134B75" stroke-width="1.5"/>
    <rect x="6" y="5" width="22" height="8" rx="1.5" fill="#fff"/>
    <g fill="#fff">
      <rect x="7" y="17" width="5" height="4.5" rx="0.8"/><rect x="14.5" y="17" width="5" height="4.5" rx="0.8"/><rect x="22" y="17" width="5" height="4.5" rx="0.8"/>
      <rect x="7" y="23.5" width="5" height="4.5" rx="0.8"/><rect x="14.5" y="23.5" width="5" height="4.5" rx="0.8"/><rect x="22" y="23.5" width="5" height="4.5" rx="0.8"/>
      <rect x="7" y="30" width="5" height="4.5" rx="0.8"/><rect x="14.5" y="30" width="5" height="4.5" rx="0.8"/><rect x="22" y="30" width="5" height="4.5" rx="0.8"/>
    </g>
  </svg>`;

const MARQUES = {
  scilab: {
    cle: 'scilab', nom: 'SciLab', debut: 'Sci', fin: 'Lab',
    discipline: 'Bac Pro — Sciences physiques et chimiques', logo: LOGO_SCILAB,
  },
  mathilab: {
    cle: 'mathilab', nom: 'MathiLab', debut: 'Mathi', fin: 'Lab',
    discipline: 'Bac Pro — Mathématiques', logo: LOGO_MATHILAB,
  },
};

// config.marque : 'scilab' (défaut) ou 'mathilab'. config.discipline remplace
// la mention « Bac Pro — … » du coin supérieur droit.
function construireDocument(config, eleve, corps) {
  const marque = MARQUES[String(config.marque || 'scilab').toLowerCase()] || MARQUES.scilab;
  const m = `cr-marque-${marque.cle}`;
  const badge = [config.domaine || 'Sciences', config.tp].filter(Boolean).join(' — ');
  return `
    <header class="cr-entete ${m}">
      <div class="cr-logo">${marque.logo}<span class="cr-logo-texte"><b>${marque.debut}</b>${marque.fin}</span></div>
      <div class="cr-entete-droite">Compte-rendu généré le ${e(dateFr(''))}<br>${e(config.discipline || marque.discipline)}</div>
    </header>
    <span class="cr-domaine-badge ${m}">${e(badge)}</span>
    <h1 class="cr-titre-tp">${e(config.titre || 'Compte rendu de TP')}</h1>
    <div class="cr-identification">
      <div><span class="cr-label">Nom</span><span class="cr-valeur">${e(eleve.nom)}</span></div>
      <div><span class="cr-label">Prénom</span><span class="cr-valeur">${e(eleve.prenom)}</span></div>
      <div><span class="cr-label">Classe</span><span class="cr-valeur">${e(eleve.classe)}</span></div>
      <div><span class="cr-label">Date</span><span class="cr-valeur">${e(eleve.date)}</span></div>
    </div>
    ${corps}
    <footer class="cr-pied"><span>${marque.nom} — Mermoz Lab</span><span>${e(config.tp || '')}</span></footer>`;
}

/* ==========================================================
   IMPRESSION / PDF (iframe hors écran)
   ========================================================== */

// Règles minimales garantissant un PDF A4 correct même si compte-rendu.css
// n'a pas pu être chargé. Placées AVANT les feuilles de style de la page :
// celles-ci gardent la priorité.
const CSS_NOYAU = `
  @page { size: A4; margin: 12mm; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  img { max-width: 100%; height: auto; }
  .cr-section, .cr-section-question, .cr-note-finale { break-inside: avoid; page-break-inside: avoid; }
  h3, h4 { break-after: avoid; page-break-after: avoid; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  thead { display: table-header-group; }
`;

function imprimer(html, titreDocument) {

  return new Promise(resolve => {

    document.getElementById('cr-print-frame')?.remove();

    // Mêmes feuilles de style que la page (variables CSS, polices, print.css…),
    // compte-rendu.css comprise puisque chargerCss() l'a ajoutée au <head>.
    const feuilles = [...new Set(
      [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href).filter(Boolean)
    )];

    const frame = document.createElement('iframe');
    frame.id = 'cr-print-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    // Hors écran mais bien rendue : visibility:hidden / display:none l'exclueraient
    // du rendu sous Chrome et Safari (PDF vide).
    frame.style.cssText =
      'position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;pointer-events:none;';

    // body.cr-printing + #cr-print-container : les sélecteurs de compte-rendu.css
    // continuent de s'appliquer tels quels dans l'iframe.
    frame.srcdoc = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<title>${e(titreDocument)}</title>
<style>${CSS_NOYAU}</style>
${feuilles.map(h => `<link rel="stylesheet" href="${e(h)}">`).join('\n')}
</head>
<body class="cr-printing"><div id="cr-print-container">${html}</div></body></html>`;

    frame.addEventListener('load', async () => {

      const win = frame.contentWindow;
      const doc = frame.contentDocument;

      // Polices et images (graphiques) prêtes avant l'ouverture du dialogue.
      try {
        await Promise.all([
          doc.fonts?.ready,
          ...[...doc.images].map(img => (img.decode ? img.decode().catch(() => {}) : null)),
        ]);
      } catch (err) {
        console.warn('[compte-rendu] attente des ressources interrompue :', err);
      }

      const ancienTitre = document.title;
      const restaurer = () => {
        document.title = ancienTitre;
        setTimeout(() => frame.remove(), 500);
      };
      win.addEventListener('afterprint', restaurer, { once: true });
      window.addEventListener('afterprint', restaurer, { once: true });

      // Le titre devient le nom de fichier proposé à l'enregistrement du PDF.
      document.title = titreDocument;

      try {
        win.focus();
        win.print();
      } catch (err) {
        console.error('[compte-rendu] impression impossible :', err);
        restaurer();
        window.alert("Impossible d'ouvrir la fenêtre d'impression. Essaie avec un autre navigateur.");
      }

      resolve();

    }, { once: true });

    document.body.appendChild(frame);
  });
}

/* ==========================================================
   IDENTITÉ (rubrique « Identification » de la page)
   ========================================================== */

function lireEleve() {
  const val = id => (document.getElementById(id)?.value || '').trim();
  return {
    nom: val('nom-eleve'),
    prenom: val('prenom-eleve'),
    classe: val('classe-eleve'),
    date: dateFr(val('date-eleve')), // vide → date du jour
  };
}

// Nom et prénom obligatoires (s'ils sont présents dans la page) : le champ
// vide est signalé à l'élève, sans fenêtre supplémentaire.
function identiteIncomplete() {
  for (const id of ['nom-eleve', 'prenom-eleve']) {
    const champ = document.getElementById(id);
    if (!champ || champ.value.trim()) continue;

    const message = 'Renseigne ton nom et ton prénom dans la rubrique « Identification » avant de générer le compte rendu.';

    if (champ.offsetParent === null) { // rubrique repliée : champ invisible
      window.alert(message);
      return true;
    }

    champ.setCustomValidity(message);
    champ.addEventListener('input', () => champ.setCustomValidity(''), { once: true });
    champ.scrollIntoView({ block: 'center' });
    champ.focus();
    champ.reportValidity();
    return true;
  }
  return false;
}

/* ==========================================================
   POINT D'ENTRÉE
   ========================================================== */

export async function genererCompteRendu(config = {}) {

  if (identiteIncomplete()) return;

  const sections = Array.isArray(config.sections) ? config.sections : [];
  const questions = sections.filter(s => s.notation);
  const autres = sections.filter(s => !s.notation);
  const rubriquesDebut = autres.filter(s => s.position !== 'fin');
  const rubriquesFin = autres.filter(s => s.position === 'fin');

  // Toutes les parties sont imprimées, dans cet ordre.
  const blocs = [];

  blocs.push(htmlMateriel());
  rubriquesDebut.forEach(s => blocs.push(htmlSection(s)));
  blocs.push(htmlCourbes(config.canvases));
  if (questions.length) blocs.push(questions.map(htmlQuestion).join(''));
  rubriquesFin.forEach(s => blocs.push(htmlSection(s)));
  if (config.noteFinale) blocs.push(htmlNoteFinale(questions.length));

  const corps = blocs.filter(Boolean).join('');

  if (!corps) {
    console.warn('[compte-rendu] rien à imprimer');
    return;
  }

  await chargerCss();

  const eleve = lireEleve();

  imprimer(
    construireDocument(config, eleve, corps),
    nomFichier(config, eleve) || 'compte-rendu'
  );
}

export default genererCompteRendu;
/**
 * laboratory/js/compte-rendu.js
 *
 * Module partagé de génération et d'impression du compte rendu de TP
 * (tp-electricite, tp-mecanique, …). Le style provient de css/compte-rendu.css,
 * chargé à la demande (modales écran + trame @media print).
 *
 *   genererCompteRendu({ titre, domaine, tp, sections, noteFinale, canvases })
 *
 * Sections acceptées :
 *   { titre, items: [{ label, valeur }] }
 *   { titre, tableau: { entetes: [], lignes: [[]] }, canvas?, legende? }
 *   { titre, notation: true, competence, texte }   (question notée 0 / 1 / 2)
 * `canvases` (optionnel) : [{ canvas, titre }] — courbes capturées en PNG.
 *
 * Le matériel coché (.materiel-check-input dans #materiel-verrerie /
 * #materiel-equipements) est repris automatiquement.
 *
 * Déroulement : 1) identification de l'élève ; 2) choix des parties ;
 * 3) injection de #cr-print-container, body.cr-printing, window.print().
 */

/* ==========================================================
   CHARGEMENT DU CSS (à la demande)
   ========================================================== */

// css/compte-rendu.css, relatif à ce module (laboratory/js/ → laboratory/css/).
const URL_CSS = new URL('../css/compte-rendu.css', import.meta.url).href;

function chargerCss() {
  return new Promise(resolve => {
    const existant = document.getElementById('cr-css');
    if (existant) { resolve(); return; }
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

function canvasVersImage(canvas) {
  if (!canvas || !canvas.width || !canvas.height) return null;
  try {
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('[compte-rendu] capture du canvas impossible :', err);
    return null;
  }
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

/* ==========================================================
   BLOCS DU DOCUMENT IMPRIMÉ
   ========================================================== */

const STYLE_TABLEAU = 'width:100%;border-collapse:collapse;font-size:8pt;margin:4px 0;';
const STYLE_CELLULE = 'border:1px solid #9CA3AF;padding:3px 6px;text-align:center;';

function htmlItems(items) {
  return `<table class="cr-items"><tbody>${items.map(it =>
    `<tr><td>${e(it.label)}</td><td>${e(it.valeur)}</td></tr>`).join('')}</tbody></table>`;
}

function htmlTableau({ entetes = [], lignes = [] }) {
  const th = entetes.map(h => `<th style="${STYLE_CELLULE}background:#EAF1F8;">${e(h)}</th>`).join('');
  const tr = lignes.map(l =>
    `<tr>${l.map(c => `<td style="${STYLE_CELLULE}">${e(c)}</td>`).join('')}</tr>`).join('');
  return `<table style="${STYLE_TABLEAU}"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

function htmlGraphique(canvas, legende) {
  const src = canvasVersImage(canvas);
  if (!src) return '';
  return `<img class="cr-graphique" src="${src}" alt="">`
    + (legende ? `<p class="cr-vide" style="margin:2px 0 0;font-size:7.5pt;">${e(legende)}</p>` : '');
}

function htmlSection(section) {
  let corps = '';
  if (Array.isArray(section.items) && section.items.length) corps += htmlItems(section.items);
  if (section.tableau) corps += htmlTableau(section.tableau);
  if (section.canvas) corps += htmlGraphique(section.canvas, section.legende);
  if (section.texte && !section.notation) {
    corps += `<div class="cr-texte-libre">${e(section.texte)}</div>`;
  }
  return `<div class="cr-section">${section.titre ? `<h3>${e(section.titre)}</h3>` : ''}${corps}</div>`;
}

function htmlQuestion(q) {
  const reponse = q.texte
    ? e(q.texte)
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

const LOGO_SVG = `
  <svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="17" cy="17" r="15" fill="none" stroke="#1B6CA8" stroke-width="2.5"/>
    <path d="M12 9h10M14 9v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V9" fill="none" stroke="#1B6CA8" stroke-width="2" stroke-linejoin="round"/>
  </svg>`;

function construireDocument(config, eleve, corps) {
  return `
    <header class="cr-entete">
      <div class="cr-logo">${LOGO_SVG}<span class="cr-logo-texte">Sci<span>Lab</span></span></div>
      <div class="cr-entete-droite">Mermoz Lab<br>${e(eleve.date)}</div>
    </header>
    <span class="cr-domaine-badge">${e(config.domaine || 'Sciences')}</span>
    <h1 class="cr-titre-tp">${e([config.tp, config.titre].filter(Boolean).join(' — ') || 'Compte rendu de TP')}</h1>
    <div class="cr-identification">
      <div><span class="cr-label">Nom</span><span class="cr-valeur">${e(eleve.nom)}</span></div>
      <div><span class="cr-label">Prénom</span><span class="cr-valeur">${e(eleve.prenom)}</span></div>
      <div><span class="cr-label">Classe</span><span class="cr-valeur">${e(eleve.classe)}</span></div>
      <div><span class="cr-label">Date</span><span class="cr-valeur">${e(eleve.date)}</span></div>
    </div>
    ${corps}
    <footer class="cr-pied"><span>SciLab — Mermoz Lab</span><span>${e(config.tp || '')}</span></footer>`;
}

/* ==========================================================
   IMPRESSION (#cr-print-container + body.cr-printing)
   ========================================================== */

function imprimer(html) {

  document.getElementById('cr-print-container')?.remove();

  const conteneur = document.createElement('div');
  conteneur.id = 'cr-print-container';
  conteneur.innerHTML = html;
  document.body.appendChild(conteneur);

  const nettoyer = () => {
    document.body.classList.remove('cr-printing');
    conteneur.remove();
    window.removeEventListener('afterprint', nettoyer);
  };
  window.addEventListener('afterprint', nettoyer);

  document.body.classList.add('cr-printing');

  // Double requestAnimationFrame : laisse le navigateur appliquer le style
  // d'impression avant l'ouverture de la boîte de dialogue (mobile surtout).
  requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
}

/* ==========================================================
   MODALES
   ========================================================== */

function ouvrirModale(contenu) {
  document.getElementById('cr-modal-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'cr-modal-overlay';
  overlay.className = 'cr-modal-overlay-base';
  overlay.innerHTML = `<div class="cr-modal-box" role="dialog" aria-modal="true">${contenu}</div>`;
  document.body.appendChild(overlay);

  const fermer = () => {
    overlay.remove();
    document.removeEventListener('keydown', surEchap);
  };
  const surEchap = ev => { if (ev.key === 'Escape') fermer(); };
  document.addEventListener('keydown', surEchap);
  return { overlay, fermer };
}

function etapeIdentification(suite) {

  const aujourdhui = new Date().toISOString().slice(0, 10);

  const { overlay, fermer } = ouvrirModale(`
    <h2>Identification de l'élève</h2>
    <p class="cr-soustitre">Ces informations figureront en tête du compte rendu.</p>
    <label for="cr-nom">Nom</label>
    <input type="text" id="cr-nom" autocomplete="family-name">
    <div class="cr-erreur-champ" data-erreur="nom">Merci de renseigner le nom.</div>
    <label for="cr-prenom">Prénom</label>
    <input type="text" id="cr-prenom" autocomplete="given-name">
    <div class="cr-erreur-champ" data-erreur="prenom">Merci de renseigner le prénom.</div>
    <label for="cr-classe">Classe</label>
    <input type="text" id="cr-classe">
    <label for="cr-date">Date</label>
    <input type="date" id="cr-date" value="${aujourdhui}">
    <div class="cr-modal-actions">
      <button type="button" data-action="annuler">Annuler</button>
      <button type="button" data-action="suivant">Continuer</button>
    </div>`);

  const champ = id => overlay.querySelector(`#cr-${id}`);
  overlay.querySelector('[data-action="annuler"]').addEventListener('click', fermer);
  overlay.querySelector('[data-action="suivant"]').addEventListener('click', () => {

    const eleve = {
      nom: champ('nom').value.trim(),
      prenom: champ('prenom').value.trim(),
      classe: champ('classe').value.trim(),
      date: dateFr(champ('date').value),
    };

    let valide = true;
    ['nom', 'prenom'].forEach(id => {
      const manquant = !eleve[id];
      overlay.querySelector(`[data-erreur="${id}"]`).style.display = manquant ? 'block' : 'none';
      if (manquant) valide = false;
    });
    if (!valide) return;

    fermer();
    suite(eleve);
  });

  champ('nom').focus();
}

function etapeChoixParties(groupes, suite) {

  const { overlay, fermer } = ouvrirModale(`
    <h2>Parties à imprimer</h2>
    <p class="cr-soustitre">Coche les parties à inclure dans le compte rendu.</p>
    <div class="cr-groupes-liste">
      ${groupes.map((g, i) => `
        <label class="cr-groupe-ligne">
          <input type="checkbox" data-index="${i}" checked>
          <span>${e(g.libelle)}</span>
          ${g.badge ? `<span class="cr-niveau-badge">${e(g.badge)}</span>` : ''}
        </label>`).join('')}
    </div>
    <div class="cr-modal-actions">
      <button type="button" data-action="annuler">Annuler</button>
      <button type="button" data-action="imprimer">Imprimer</button>
    </div>`);

  overlay.querySelector('[data-action="annuler"]').addEventListener('click', fermer);
  overlay.querySelector('[data-action="imprimer"]').addEventListener('click', () => {
    const retenus = [...overlay.querySelectorAll('input[data-index]')]
      .filter(cb => cb.checked)
      .map(cb => groupes[Number(cb.dataset.index)]);
    if (!retenus.length) return;
    fermer();
    suite(retenus);
  });
}

/* ==========================================================
   POINT D'ENTRÉE
   ========================================================== */

export async function genererCompteRendu(config = {}) {

  const sections = Array.isArray(config.sections) ? config.sections : [];
  const questions = sections.filter(s => s.notation);
  const autres = sections.filter(s => !s.notation);

  // Groupes proposés à l'élève, dans l'ordre d'impression.
  const groupes = [];

  const materiel = htmlMateriel();
  if (materiel) groupes.push({ libelle: 'Matériel utilisé', html: materiel });

  autres.forEach(s => groupes.push({ libelle: s.titre || 'Rubrique', html: htmlSection(s) }));

  const courbes = htmlCourbes(config.canvases);
  if (courbes) groupes.push({ libelle: 'Graphiques', html: courbes });

  if (questions.length) {
    groupes.push({
      libelle: 'Questions et réponses',
      badge: `${questions.length} question${questions.length > 1 ? 's' : ''}`,
      html: questions.map(htmlQuestion).join(''),
    });
  }

  if (config.noteFinale) {
    groupes.push({ libelle: 'Note finale', html: htmlNoteFinale(questions.length) });
  }

  if (!groupes.length) {
    console.warn('[compte-rendu] rien à imprimer');
    return;
  }

  await chargerCss();

  etapeIdentification(eleve => {
    etapeChoixParties(groupes, retenus => {
      imprimer(construireDocument(config, eleve, retenus.map(g => g.html).join('')));
    });
  });
}

export default genererCompteRendu;
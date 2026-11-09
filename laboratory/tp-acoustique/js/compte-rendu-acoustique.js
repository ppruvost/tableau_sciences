/**
 * tp-acoustique/js/compte-rendu-acoustique.js
 *
 * Impression du compte rendu (PDF via la boîte d'impression du navigateur)
 * pour les TP d'acoustique A1 à A5.
 *
 * Ce fichier est un MODULE JAVASCRIPT. La feuille de style du domaine
 * (chaîne global → reset → tp → animations → print → domaine, couleurs
 * acoustique, ExAO...) est css/style.css, déjà chargée par index.html.
 *
 * API utilisée par tp01 à tp05 :
 *   initImpressionCompteRendu({ titre, tp, sectionsSupplementaires })
 *   sectionValeurs(titre, [[libellé, idÉlément, filtreRegExp?], ...])
 *   nombreFr(valeur, décimales)
 *   ajouterLigne(tbody, [cellules])
 *
 * Format d'une section (renvoyée à initImpressionCompteRendu) :
 *   { titre, valeurs: [[libellé, valeur], ...] }
 *   { titre, tableau: { entetes: [...], lignes: [[...], ...] },
 *     canvas?: <élément contenant un <svg> ou un <canvas>>, legende?: string }
 */

/* ==========================================================
   OUTILS
   ========================================================== */

const VALEURS_VIDES = new Set(['', '—', '-', '–']);

function echapper(texte) {
  return String(texte ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Texte d'un champ ou d'une sortie : valeur saisie, option choisie ou contenu. */
function lireElement(el) {
  if (!el) return '';

  if (el.tagName === 'SELECT') {
    const option = el.options[el.selectedIndex];
    // Une option sans valeur (« Choisir... ») compte comme non renseignée.
    return option && option.value !== '' ? option.textContent.trim() : '';
  }

  if ('value' in el && el.tagName !== 'OUTPUT' && el.tagName !== 'LI') {
    return String(el.value ?? '').trim();
  }

  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

/* ==========================================================
   FONCTIONS EXPORTÉES POUR LES TP
   ========================================================== */

/** Nombre au format français : nombreFr(2.5, 1) → « 2,5 ». */
export function nombreFr(valeur, decimales = 0) {
  const n = Number(valeur);
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

/** Ajoute une ligne <tr> (cellules en texte brut) à un <tbody>. */
export function ajouterLigne(tbody, cellules) {
  const tr = document.createElement('tr');
  cellules.forEach(contenu => {
    const td = document.createElement('td');
    td.textContent = String(contenu ?? '');
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
  return tr;
}

/**
 * Section « libellé : valeur » lue dans le DOM au moment de l'impression.
 * Un 3e élément facultatif (RegExp) ne retient la valeur que si elle
 * correspond (évite d'imprimer un texte d'attente).
 * Renvoie null si aucune valeur n'est renseignée.
 */
export function sectionValeurs(titre, champs) {
  const valeurs = [];

  champs.forEach(([libelle, id, filtre]) => {
    const texte = lireElement(document.getElementById(id));
    if (VALEURS_VIDES.has(texte)) return;
    if (filtre instanceof RegExp && !filtre.test(texte)) return;
    valeurs.push([libelle, texte]);
  });

  return valeurs.length ? { titre, valeurs } : null;
}

/* ==========================================================
   COLLECTE DES DONNÉES DE LA PAGE
   ========================================================== */

function lireIdentite() {
  const champ = id => lireElement(document.getElementById(id));

  const nom = [champ('prenom-eleve'), champ('nom-eleve')].filter(Boolean).join(' ');
  const classe = champ('classe-eleve');
  const dateBrute = champ('date-eleve');

  let date = dateBrute;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateBrute)) {
    const [a, m, j] = dateBrute.split('-');
    date = `${j}/${m}/${a}`;
  }

  return { nom, classe, date };
}

function blocContientReponse(bloc) {
  return [...bloc.querySelectorAll('textarea')].some(t => t.value.trim() !== '');
}

/** Questions : bloc affiché + blocs des autres onglets s'ils contiennent des réponses. */
function collecterQuestions() {
  const blocs = [...document.querySelectorAll('.questions-bloc')];

  return blocs
    .filter(bloc => (!bloc.hidden && bloc.style.display !== 'none') || blocContientReponse(bloc))
    .map(bloc => {
      const items = [...bloc.querySelectorAll('.questions-tp > li')].map((li, i) => ({
        numero: i + 1,
        enonce: (li.querySelector('.question-entete strong')?.textContent || '')
          .replace(/\s+/g, ' ').trim(),
        competence: li.querySelector('.cartouche')?.textContent.trim() || '',
        rappel: (li.querySelector('.problematique-rappel')?.textContent || '')
          .replace(/\s+/g, ' ').trim(),
        reponse: li.querySelector('textarea')?.value.trim() || '',
      }));

      return {
        titre: bloc.dataset.ongletNom || bloc.querySelector('h4')?.textContent.trim() || 'Questions',
        items,
      };
    });
}

/** Auto-évaluation : une ligne par compétence, niveau coché (0, 1, 2). */
function collecterAutoEvaluation() {
  const lignes = [...document.querySelectorAll('.autoeval-table tbody tr[data-comp]')];

  return lignes.map(tr => {
    const sigle = tr.dataset.comp;
    const coche = tr.querySelector('input[type="radio"]:checked');
    return {
      domaine: tr.children[0]?.textContent.trim() || '',
      sigle,
      capacite: tr.children[2]?.textContent.trim() || '',
      niveau: coche ? coche.value : null,
    };
  });
}

/** Image du radar (svg ou canvas) si l'élève l'a généré. */
function collecterRadar() {
  const conteneur = document.getElementById('radar-resultat');
  return conteneur ? extraireVisuel(conteneur) : '';
}

/** HTML d'un graphique : <svg> cloné, ou <canvas> converti en image. */
function extraireVisuel(conteneur) {
  const svg = conteneur.querySelector('svg');
  if (svg) {
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    clone.style.maxWidth = '100%';
    clone.style.height = 'auto';
    return clone.outerHTML;
  }

  const canvas = conteneur.querySelector('canvas');
  if (canvas) {
    try {
      return `<img alt="" src="${canvas.toDataURL('image/png')}" style="max-width:100%;height:auto">`;
    } catch (e) {
      console.warn('Canvas non exportable :', e);
    }
  }

  return '';
}

/* ==========================================================
   CONSTRUCTION DU DOCUMENT IMPRIMABLE
   ========================================================== */

const STYLE_IMPRESSION = `
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    font-size: 11pt; line-height: 1.4; color: #1a1a1a; margin: 0;
  }
  header.cr-entete {
    border-bottom: 3px solid #1B6CA8; padding-bottom: 6pt; margin-bottom: 10pt;
  }
  header.cr-entete h1 { font-size: 17pt; margin: 0; color: #114A75; }
  header.cr-entete .cr-tp { font-size: 10pt; color: #5a6b78; margin: 2pt 0 0; }
  .cr-identite { display: flex; flex-wrap: wrap; gap: 4pt 18pt; margin: 6pt 0 10pt; font-size: 10.5pt; }
  .cr-identite span strong { color: #114A75; }
  h2 {
    font-size: 13pt; color: #114A75; margin: 14pt 0 5pt;
    padding-bottom: 2pt; border-bottom: 1px solid #c9d6e2; break-after: avoid;
  }
  h3 { font-size: 11.5pt; color: #114A75; margin: 10pt 0 4pt; break-after: avoid; }
  table { width: 100%; border-collapse: collapse; margin: 4pt 0 8pt; break-inside: avoid; }
  th, td { border: 1px solid #b8c4cf; padding: 3pt 6pt; text-align: left; vertical-align: top; }
  th { background: #e8f2fb; color: #114A75; }
  table.cr-valeurs th { width: 55%; font-weight: 600; }
  .cr-question { margin: 0 0 9pt; break-inside: avoid; }
  .cr-enonce { font-weight: 600; }
  .cr-comp {
    display: inline-block; margin-left: 6pt; padding: 0 5pt; border-radius: 8pt;
    background: #1B6CA8; color: #fff; font-size: 8pt; font-weight: 700; vertical-align: 1pt;
  }
  .cr-rappel { font-style: italic; color: #5a6b78; margin: 2pt 0; }
  .cr-reponse {
    margin-top: 3pt; padding: 4pt 7pt; min-height: 18pt;
    border-left: 3px solid #1B6CA8; background: #f4f8fb; white-space: pre-wrap;
  }
  .cr-reponse.cr-vide { color: #8a97a3; font-style: italic; }
  .cr-figure { margin: 6pt 0 10pt; text-align: center; break-inside: avoid; }
  .cr-figure svg, .cr-figure img { max-width: 100%; height: auto; }
  .cr-figure figcaption { font-size: 9.5pt; color: #5a6b78; margin-top: 2pt; }
  .cr-niveau { text-align: center; white-space: nowrap; }
  footer.cr-pied { margin-top: 14pt; font-size: 8.5pt; color: #8a97a3; text-align: right; }
`;

function htmlSection(section) {
  let html = `<h2>${echapper(section.titre)}</h2>`;

  if (section.valeurs?.length) {
    html += '<table class="cr-valeurs"><tbody>';
    section.valeurs.forEach(([libelle, valeur]) => {
      html += `<tr><th>${echapper(libelle)}</th><td>${echapper(valeur)}</td></tr>`;
    });
    html += '</tbody></table>';
  }

  if (section.tableau) {
    const { entetes = [], lignes = [] } = section.tableau;
    html += '<table><thead><tr>'
      + entetes.map(e => `<th>${echapper(e)}</th>`).join('')
      + '</tr></thead><tbody>'
      + lignes.map(l => `<tr>${l.map(c => `<td>${echapper(c)}</td>`).join('')}</tr>`).join('')
      + '</tbody></table>';
  }

  if (section.canvas) {
    const visuel = extraireVisuel(section.canvas);
    if (visuel) {
      html += `<figure class="cr-figure">${visuel}`
        + (section.legende ? `<figcaption>${echapper(section.legende)}</figcaption>` : '')
        + '</figure>';
    }
  }

  return html;
}

function htmlQuestions(blocs) {
  return blocs.map(bloc => {
    let html = `<h2>Questions : ${echapper(bloc.titre)}</h2>`;

    bloc.items.forEach(q => {
      html += '<div class="cr-question">'
        + `<div class="cr-enonce">${q.numero}. ${echapper(q.enonce)}`
        + (q.competence ? `<span class="cr-comp">${echapper(q.competence)}</span>` : '')
        + '</div>'
        + (q.rappel ? `<div class="cr-rappel">${echapper(q.rappel)}</div>` : '')
        + (q.reponse
          ? `<div class="cr-reponse">${echapper(q.reponse)}</div>`
          : '<div class="cr-reponse cr-vide">Pas de réponse.</div>')
        + '</div>';
    });

    return html;
  }).join('');
}

function htmlAutoEvaluation(lignes, radar) {
  if (!lignes.length) return '';
  // Rien à imprimer si l'élève n'a rien coché et n'a pas généré de radar.
  if (!radar && lignes.every(l => l.niveau === null)) return '';

  let html = '<h2>Auto-évaluation des compétences</h2>'
    + '<table><thead><tr><th>Domaine</th><th>Sigle</th><th>Je suis capable de...</th>'
    + '<th>Niveau (0 à 2)</th></tr></thead><tbody>';

  lignes.forEach(l => {
    html += `<tr><td>${echapper(l.domaine)}</td><td>${echapper(l.sigle)}</td>`
      + `<td>${echapper(l.capacite)}</td>`
      + `<td class="cr-niveau">${l.niveau === null ? '—' : echapper(l.niveau)}</td></tr>`;
  });

  html += '</tbody></table>';

  if (radar) {
    html += `<figure class="cr-figure">${radar}<figcaption>Radar de compétences</figcaption></figure>`;
  }

  return html;
}

function construireDocument({ titre, tp, sections }) {
  const identite = lireIdentite();
  const dateImpression = new Date().toLocaleDateString('fr-FR');

  const identiteHtml = [
    ['Nom', identite.nom],
    ['Classe', identite.classe],
    ['Date', identite.date || dateImpression],
  ].map(([lib, val]) =>
    `<span><strong>${lib} :</strong> ${val ? echapper(val) : '………………………'}</span>`
  ).join('');

  const corps = sections.map(htmlSection).join('')
    + htmlQuestions(collecterQuestions())
    + htmlAutoEvaluation(collecterAutoEvaluation(), collecterRadar());

  const titreComplet = `Compte rendu${tp ? ` ${tp}` : ''} : ${titre}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${echapper(titreComplet)}</title>
<style>${STYLE_IMPRESSION}</style>
</head>
<body>
<header class="cr-entete">
  <h1>${echapper(titre)}</h1>
  <p class="cr-tp">TP Acoustique${tp ? ` · ${echapper(tp)}` : ''} · Compte rendu</p>
</header>
<div class="cr-identite">${identiteHtml}</div>
${corps}
<footer class="cr-pied">Imprimé le ${echapper(dateImpression)}</footer>
</body>
</html>`;
}

/* ==========================================================
   IMPRESSION (iframe invisible : pas de fenêtre pop-up bloquée)
   ========================================================== */

function imprimer(documentHtml) {
  const ancien = document.getElementById('cr-iframe-impression');
  if (ancien) ancien.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'cr-iframe-impression';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';

  iframe.addEventListener('load', () => {
    const fenetre = iframe.contentWindow;
    if (!fenetre) return;

    // Un court délai laisse le moteur de rendu finir la mise en page.
    setTimeout(() => {
      fenetre.focus();
      fenetre.print();
      // Nettoyage : afterprint n'est pas fiable partout, d'où le délai.
      setTimeout(() => iframe.remove(), 60000);
    }, 150);
  }, { once: true });

  document.body.appendChild(iframe);
  iframe.srcdoc = documentHtml;
}

/* ==========================================================
   POINT D'ENTRÉE
   ========================================================== */

/**
 * Câble le bouton « Imprimer le compte-rendu » (#btn-imprimer).
 *
 * @param {object}   options
 * @param {string}   options.titre                  Titre du TP.
 * @param {string}   options.tp                     Repère (ex. « TP01 »).
 * @param {Function} options.sectionsSupplementaires  Renvoie les sections de
 *        mesures, évaluées au moment du clic (valeurs saisies à jour).
 */
export function initImpressionCompteRendu({ titre, tp, sectionsSupplementaires } = {}) {
  const bouton = document.getElementById('btn-imprimer');
  if (!bouton) return;

  bouton.addEventListener('click', () => {
    let sections = [];

    try {
      sections = (sectionsSupplementaires ? sectionsSupplementaires() : []).filter(Boolean);
    } catch (erreur) {
      console.error('Compte rendu : erreur dans les sections de mesures', erreur);
    }

    imprimer(construireDocument({ titre: titre || 'TP Acoustique', tp, sections }));
  });
}
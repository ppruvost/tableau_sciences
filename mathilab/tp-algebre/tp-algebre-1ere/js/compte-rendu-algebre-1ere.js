/**
 * tp-algebre-1ere/js/compte-rendu-algebre-1ere.js
 * Construit et imprime le compte-rendu (identification, tableau de résultats,
 * réponses aux questions, auto-évaluation) pour un TP d'algèbre de 1ère.
 */

function texteChamp(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function construireCompteRendu(titre, tp) {
  const nom = texteChamp('nom-eleve');
  const prenom = texteChamp('prenom-eleve');
  const classe = texteChamp('classe-eleve');
  const date = texteChamp('date-eleve');

  const tableauResultats = document.querySelector('[data-type="resultats"] table')?.outerHTML || '';

  const questions = Array.from(document.querySelectorAll('.questions-tp > li')).map((li) => {
    const enonce = li.querySelector('.question-entete strong')?.textContent.trim() || '';
    const reponse = li.querySelector('textarea')?.value || '';
    return `<p><strong>${enonce}</strong></p><p>${reponse.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  const autoeval = Array.from(document.querySelectorAll('.autoeval-table tbody tr')).map((tr) => {
    const libelle = tr.children[2]?.textContent.trim() || '';
    const coche = tr.querySelector('input[type="radio"]:checked');
    return `<li>${libelle} : ${coche ? coche.value : 'non renseigné'}</li>`;
  }).join('');

  return `
    <h1>${titre} (${tp})</h1>
    <p>${nom} ${prenom} — ${classe} — ${date}</p>
    <h2>Résumé du TD</h2>
    <p>${texteChamp('resume-tp').replace(/\n/g, '<br>')}</p>
    <h2>Tableau de résultats</h2>
    ${tableauResultats}
    <h2>Questions</h2>
    ${questions}
    <h2>Auto-évaluation des compétences</h2>
    <ul>${autoeval}</ul>
  `;
}

export function initImpressionCompteRendu({ titre, tp }) {
  const bouton = document.getElementById('btn-imprimer');
  const conteneur = document.getElementById('cr-print-container');
  if (!bouton || !conteneur) return;

  bouton.addEventListener('click', () => {
    conteneur.innerHTML = construireCompteRendu(titre, tp);
    conteneur.style.display = 'block';
    window.print();
    conteneur.style.display = 'none';
  });
}

/**
 * mathilab/tp-statistiques/js/filiere-select.js
 *
 * Filet de sécurité du menu « filière » (claude_v7.md §5) :
 *   - remplit #select-filiere-pro (optgroups Seconde / Première / Terminale)
 *     s'il est resté vide après initContextePro() ;
 *   - affiche le contexte professionnel (#contexte-pro-resultat) et les
 *     problématiques (.problematique-rappel[data-activite]) si
 *     contexte-pro.js ne l'a pas fait.
 * Quand tout fonctionne, il ne modifie rien (les textes sont déjà identiques).
 *
 * À appeler juste après initContextePro(). [À VÉRIFIER] : à retirer quand la
 * cause racine sera corrigée dans js/contexte-pro.js ou data/filieres.js.
 */

const NIVEAUX = [
  ['2nde', 'Seconde'],
  ['1ere', 'Première'],
  ['tle', 'Terminale'],
];

// Libellés de repli (à aligner sur mathilab/data/filieres.js)
const FILIERES = {
  remi: 'Réalisation d’ensembles mécaniques et industriels (REMI)',
  mcc: 'Métiers de la couture et de la confection (MCC)',
  gatl: 'Gestion administrative, transport et logistique (GATL)',
  trpm: 'Technicien en réalisation de produits mécaniques (TRPM)',
  tci: 'Technicien en chaudronnerie industrielle (TCI)',
  log: 'Logistique (LOG)',
  agora: 'Assistance à la gestion des organisations et de leurs activités (AGORA)',
};

function peuplerMenu(select, contextes) {
  const cles = Object.keys(contextes);
  NIVEAUX.forEach(([niveau, libelleNiveau]) => {
    const cles_niveau = cles.filter(cle => cle.split('-')[0] === niveau);
    if (!cles_niveau.length) return;
    const groupe = document.createElement('optgroup');
    groupe.label = libelleNiveau;
    cles_niveau.forEach(cle => {
      const filiere = cle.split('-').pop();
      const option = document.createElement('option');
      option.value = cle;
      option.textContent = FILIERES[filiere] || filiere.toUpperCase();
      groupe.appendChild(option);
    });
    select.appendChild(groupe);
  });
}

function afficherSiBesoin(select, contextes) {
  const cle = select.value;
  const contexte = cle ? contextes[cle] : null;
  if (!contexte) return;

  const resultat = document.getElementById('contexte-pro-resultat');
  if (resultat && contexte.contexte) {
    let bloc = resultat.querySelector('.contexte-pro-bloc');
    let paragraphe = bloc?.querySelector('p');
    if (!paragraphe) {
      resultat.textContent = '';
      bloc = document.createElement('div');
      bloc.className = 'contexte-pro-bloc';
      paragraphe = document.createElement('p');
      bloc.appendChild(paragraphe);
      resultat.appendChild(bloc);
    }
    if (paragraphe.textContent !== contexte.contexte) paragraphe.textContent = contexte.contexte;
  }

  document.querySelectorAll('.problematique-rappel[data-activite]').forEach(element => {
    const texte = contexte.problematiques?.[element.dataset.activite];
    if (texte && element.textContent !== texte) element.textContent = texte;
  });
}

export function garantirMenuFiliere(contextes) {
  const select = document.getElementById('select-filiere-pro');
  if (!select || !contextes) return;

  if (select.options.length <= 1) peuplerMenu(select, contextes);

  if (select.dataset.filiereGarantie !== '1') {
    select.dataset.filiereGarantie = '1';
    // setTimeout : laisse d'abord contexte-pro.js réagir au changement
    select.addEventListener('change', () => setTimeout(() => afficherSiBesoin(select, contextes), 0));
  }

  afficherSiBesoin(select, contextes);
}

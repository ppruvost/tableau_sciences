/**
 * ============================================================
 * MATHILAB — GÉOMÉTRIE
 * Menu déroulant « Votre filière professionnelle » (garantie)
 * mathilab/tp-geometrie/js/filiere-select.js
 * ============================================================
 * Filet de sécurité appelé juste APRÈS initContextePro() dans chaque TD :
 *  - si le menu est resté vide (seule l'option « -- Sélectionner -- »),
 *    il est rempli à partir des filières du TD (clés « niveau-filière »
 *    de CONTEXTES_PRO), regroupées par niveau (<optgroup>) ;
 *  - à chaque changement de filière, si le contexte professionnel n'a pas
 *    été affiché par contexte-pro.js, il l'est ici, ainsi que les
 *    problématiques d'onglet (.problematique-rappel[data-activite]).
 * Quand contexte-pro.js fonctionne, ce module n'ajoute ni ne modifie rien.
 */

const NIVEAUX = { '2nde': 'Seconde', '1ere': 'Première', 'tle': 'Terminale' };
const FILIERES = {
  remi: 'Réalisation mécanique (REMI)',
  mcc: 'Métiers de la couture et de la confection (MCC)',
  gatl: 'Gestion-administration, transport, logistique (GATL)',
  trpm: 'Technicien en réalisation de produits mécaniques (TRPM)',
  tci: 'Technicien en chaudronnerie industrielle (TCI)',
  log: 'Logistique',
  agora: 'Assistance à la gestion des organisations (AGorA)',
};

function decouper(cle) {
  const i = cle.indexOf('-');
  return { niveau: cle.slice(0, i), filiere: cle.slice(i + 1) };
}

function remplirMenu(select, contextes) {
  const groupes = new Map();
  Object.keys(contextes).forEach((cle) => {
    const { niveau, filiere } = decouper(cle);
    if (!groupes.has(niveau)) {
      const groupe = document.createElement('optgroup');
      groupe.label = NIVEAUX[niveau] || niveau;
      groupes.set(niveau, groupe);
    }
    const option = document.createElement('option');
    option.value = cle;
    option.textContent = FILIERES[filiere] || filiere.toUpperCase();
    groupes.get(niveau).appendChild(option);
  });
  groupes.forEach((groupe) => select.appendChild(groupe));
}

function texteBloc(contexte) {
  const bloc = document.createElement('div');
  bloc.className = 'contexte-pro-bloc';
  const p = document.createElement('p');
  p.textContent = contexte;
  bloc.appendChild(p);
  return bloc;
}

function afficherContexte(select, contextes) {
  const zone = document.getElementById('contexte-pro-resultat');
  const donnees = contextes[select.value];

  if (zone) {
    const dejaAffiche = zone.querySelector('.contexte-pro-bloc');
    if (!select.value) {
      if (!dejaAffiche) return;
    } else if (donnees && !dejaAffiche) {
      zone.replaceChildren(texteBloc(donnees.contexte));
    } else if (donnees && dejaAffiche && dejaAffiche.textContent.trim() !== donnees.contexte.trim()) {
      zone.replaceChildren(texteBloc(donnees.contexte));
    }
  }

  document.querySelectorAll('.problematique-rappel[data-activite]').forEach((p) => {
    const texte = donnees?.problematiques?.[p.dataset.activite];
    if (texte) p.textContent = texte;
  });
}

export function garantirMenuFiliere(contextes) {
  const select = document.getElementById('select-filiere-pro');
  if (!select || !contextes) return;

  if (select.options.length <= 1) remplirMenu(select, contextes);

  if (select.dataset.filiereLie) return;
  select.dataset.filiereLie = '1';
  // setTimeout : laisse d'abord contexte-pro.js réagir, on ne complète que s'il n'a rien fait.
  select.addEventListener('change', () => setTimeout(() => afficherContexte(select, contextes), 0));
  afficherContexte(select, contextes);
}

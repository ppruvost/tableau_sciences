/**
 * tp-mecanique/js/questions-par-onglet.js
 *
 * Module partagé des TP de mécanique : « Trace écrite et compte rendu ».
 *
 * Chaque onglet de manipulation possède son propre bloc de 5 questions
 * (.questions-bloc[data-onglet="<id de l'onglet>"]) :
 *   - questions 1 à 4 : objet du TP de l'onglet ;
 *   - question 5 : problématique de l'onglet (rappel .problematique-rappel
 *     portant data-activite="<id de l'onglet>", rempli par contexte-pro.js
 *     à partir de `problematiques` dans CONTEXTES_PRO).
 *
 * Ce module n'affiche que le bloc de l'onglet actif. L'impression du
 * compte-rendu (compte-rendu-mecanique.js) reprend le bloc affiché, et
 * celui d'un autre onglet seulement s'il contient des réponses.
 */

export function initQuestionsParOnglet() {

  const blocs = [...document.querySelectorAll('.questions-bloc[data-onglet]')];
  const boutons = [...document.querySelectorAll('.tabs-header .tab-btn')];

  if (!blocs.length) return;

  const synchroniser = () => {

    const actif = boutons.find(b => b.classList.contains('actif'));
    const onglet = actif ? actif.dataset.tab : blocs[0].dataset.onglet;

    // Onglet sans jeu de questions propre : on garde le premier bloc.
    const cible = blocs.some(b => b.dataset.onglet === onglet)
      ? onglet
      : blocs[0].dataset.onglet;

    blocs.forEach(bloc => {
      const visible = bloc.dataset.onglet === cible;
      bloc.hidden = !visible;
      bloc.style.display = visible ? '' : 'none';
    });
  };

  // initTabs() peut changer d'onglet par clic ou programmatiquement
  // (initOngletsParFiliere) : on suit les deux.
  boutons.forEach(b => b.addEventListener('click', () => setTimeout(synchroniser, 0)));

  const observateur = new MutationObserver(synchroniser);
  boutons.forEach(b => observateur.observe(b, { attributes: true, attributeFilter: ['class'] }));

  synchroniser();
}
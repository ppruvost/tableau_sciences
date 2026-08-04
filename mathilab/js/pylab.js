/**
 * js/pylab.js
 * Lien entre MathiLab et PyLab (../../pyodide/index.html), l'atelier
 * Python en ligne basé sur Pyodide.
 *
 * PyLab lit un paramètre d'URL ?code=<base64> pour pré-remplir son
 * éditeur et s'ouvrir directement sur l'onglet Python (voir la
 * petite extension ajoutée à pyodide/app.js). Ce module se contente
 * d'encoder le code Python de l'exercice et d'ouvrir PyLab dans un
 * nouvel onglet — PyLab reste un outil autonome, comme NumWorks ou
 * la roue.
 */

function encoderCodePython(code) {
  return btoa(unescape(encodeURIComponent(code)));
}

/**
 * Ouvre PyLab dans un nouvel onglet avec le code fourni déjà chargé
 * dans l'éditeur.
 */
export function ouvrirDansPyLab(code) {
  const url = `../../pyodide/index.html?code=${encoderCodePython(code)}`;
  window.open(url, '_blank', 'noopener');
}

/**
 * Câble tous les boutons correspondant à selecteur : au clic, on
 * récupère le code Python dans le textarea .code-editeur-python le
 * plus proche (même bloc .code-exercice) et on ouvre PyLab avec.
 */
export function initBoutonsPyLab(selecteur = '.btn-pylab') {

  document.querySelectorAll(selecteur).forEach(bouton => {

    bouton.addEventListener('click', () => {

      const bloc = bouton.closest('.code-exercice');
      const editeur = bloc?.querySelector('.code-editeur-python');

      if (editeur) ouvrirDansPyLab(editeur.value);
    });
  });
}

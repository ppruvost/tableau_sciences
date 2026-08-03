// =====================================================
// MERMOZ LAB — PYTHONLAB
// Exécution de Python avec Pyodide
// =====================================================


// Instance Pyodide

let pyodidePromise = null;

let pyodide = null;


// =====================================================
// CHARGEMENT DE PYODIDE
// =====================================================

async function getPyodide() {

  if (!pyodidePromise) {

    pyodidePromise = loadPyodide({

      // Le chemin est conservé
      // selon ton organisation actuelle

      indexURL: "./pyodide/",

    });

  }


  pyodide = await pyodidePromise;


  return pyodide;

}


// =====================================================
// CONSOLE
// =====================================================

function setOutput(text) {

  const output =
    document.getElementById("output");


  if (output) {

    output.textContent =
      text;

  }

}


// =====================================================
// STATUT
// =====================================================

function setStatus(text) {

  const status =
    document.getElementById("status");


  if (status) {

    status.textContent =
      text;

  }

}


// =====================================================
// EXÉCUTION DU CODE PYTHON
// =====================================================

async function runCode() {


  // Récupération de l'éditeur

  const editor =
    document.getElementById("code");


  // Récupération du bouton

  const runButton =
    document.getElementById("run");


  // Vérification de l'éditeur

  if (!editor) {

    return;

  }


  // Code écrit par l'utilisateur

  const code =
    editor.value;


  // Programme vide

  if (!code.trim()) {

    setOutput(
      "L'éditeur Python est vide."
    );

    return;

  }


  try {


    // Désactivation temporaire

    if (runButton) {

      runButton.disabled =
        true;


      runButton.innerHTML =

        '<i class="fa-solid fa-spinner fa-spin"></i>'

        + " Exécution...";

    }


    // Chargement

    setStatus(
      "Chargement..."
    );


    await getPyodide();


    // Exécution

    setStatus(
      "Exécution..."
    );


    setOutput(
      "Exécution du programme..."
    );


    // ===============================================
    // CAPTURE DE LA SORTIE PYTHON
    // ===============================================

    await pyodide.runPythonAsync(`

import sys
import io

# Création d'une console temporaire

mermoz_console = io.StringIO()

# Redirection de print()

sys.stdout = mermoz_console

# Redirection des erreurs

sys.stderr = mermoz_console

    `);


    // ===============================================
    // EXÉCUTION DU PROGRAMME
    // ===============================================

    const result =

      await pyodide.runPythonAsync(
        code
      );


    // ===============================================
    // RÉCUPÉRATION DES PRINT()
    // ===============================================

    const printedText =

      pyodide.runPython(

        "mermoz_console.getvalue()"

      );


    // ===============================================
    // AFFICHAGE
    // ===============================================

    let consoleText =

      printedText || "";


    // Ajout de la valeur finale
    // si le programme en retourne une

    if (

      result !== undefined

      &&

      result !== null

    ) {

      const resultText =

        String(result);


      if (resultText) {

        consoleText +=

          consoleText

            ? "\n" + resultText

            : resultText;

      }

    }


    // Message si aucun résultat

    if (!consoleText.trim()) {

      consoleText =

        "✓ Programme exécuté "
        + "sans erreur.";

    }


    setOutput(
      consoleText
    );


  }


  catch (err) {


    // ===============================================
    // AFFICHAGE DES ERREURS
    // ===============================================

    setOutput(

      "❌ Erreur Python\n\n"

      + String(err)

    );


  }


  finally {


    // ===============================================
    // RESTAURATION DE LA CONSOLE PYTHON
    // ===============================================

    if (pyodide) {

      try {

        await pyodide.runPythonAsync(`

sys.stdout = sys.__stdout__

sys.stderr = sys.__stderr__

        `);

      }

      catch (error) {

        console.warn(

          "Impossible de restaurer "
          + "la console Python.",

          error

        );

      }

    }


    // Statut final

    setStatus(
      "Prêt."
    );


    // Réactivation du bouton

    if (runButton) {

      runButton.disabled =
        false;


      runButton.innerHTML =

        '<i class="fa-solid fa-play"></i>'

        + " Exécuter le programme";

    }

  }

}


// =====================================================
// INITIALISATION
// =====================================================

document.addEventListener(

  "DOMContentLoaded",

  async () => {


    // Éléments

    const runButton =

      document.getElementById(
        "run"
      );


    const editor =

      document.getElementById(
        "code"
      );


    // État initial

    setStatus(
      "Chargement de Python..."
    );


    if (runButton) {

      runButton.disabled =
        true;

    }


    try {


      // Chargement de Python

      await getPyodide();


      setStatus(
        "Prêt."
      );


      // Activation du bouton

      if (runButton) {

        runButton.disabled =
          false;

      }


    }


    catch (error) {


      setStatus(
        "Erreur de chargement"
      );


      setOutput(

        "❌ Impossible de charger "
        + "Python.\n\n"

        + String(error)

      );

    }


    // ===============================================
    // BOUTON EXÉCUTER
    // ===============================================

    if (runButton) {

      runButton.addEventListener(

        "click",

        runCode

      );

    }


    // ===============================================
    // CTRL + ENTRÉE
    // ===============================================

    if (editor) {

      editor.addEventListener(

        "keydown",

        (event) => {


          if (

            event.key === "Enter"

            &&

            (

              event.ctrlKey

              ||

              event.metaKey

            )

          ) {


            event.preventDefault();


            runCode();

          }

        }

      );

    }

  }

);

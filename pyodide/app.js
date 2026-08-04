/* =========================================================
PYLAB
INTERFACE UTILISATEUR + MOTEUR PYTHON (PYODIDE)
PYODIDE CORE + NUMPY + MATPLOTLIB
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

```
/* =================================================
   ÉLÉMENTS HTML
================================================= */

const homeButton =
    document.getElementById("homeButton");

const pythonButton =
    document.getElementById("pythonButton");

const startButton =
    document.getElementById("startButton");

const homePage =
    document.getElementById("home-message");

const pythonPage =
    document.getElementById("python-page");

const clearButton =
    document.getElementById("clear");

const menuClear =
    document.getElementById("menuClear");

const editor =
    document.getElementById("code");

const output =
    document.getElementById("output");

const examplesButton =
    document.getElementById("examplesButton");

const examplesMenu =
    document.getElementById("examplesMenu");

const runButton =
    document.getElementById("run");

const status =
    document.getElementById("status");


/* =================================================
   VARIABLES PYODIDE
================================================= */

let pyodideReady = null;

let pyodidePromise = null;


/* =================================================
   AFFICHER PYLAB
================================================= */

function showPython() {

    homePage.classList.remove(
        "active-page"
    );

    pythonPage.classList.add(
        "active-page"
    );

    homeButton.classList.remove(
        "active"
    );

    pythonButton.classList.add(
        "active"
    );

}


/* =================================================
   AFFICHER ACCUEIL
================================================= */

function showHome() {

    pythonPage.classList.remove(
        "active-page"
    );

    homePage.classList.add(
        "active-page"
    );

    pythonButton.classList.remove(
        "active"
    );

    homeButton.classList.add(
        "active"
    );

}


/* =================================================
   BOUTONS DE NAVIGATION
================================================= */

if (homeButton) {

    homeButton.addEventListener(
        "click",
        showHome
    );

}


if (pythonButton) {

    pythonButton.addEventListener(
        "click",
        showPython
    );

}


if (startButton) {

    startButton.addEventListener(
        "click",
        showPython
    );

}


/* =================================================
   STATUT DE CHARGEMENT
================================================= */

function setStatus(
    text,
    state
) {

    if (!status) {
        return;
    }

    status.textContent =
        text;

    status.className =
        state;

}


/* =================================================
   EFFACER
================================================= */

function clearProgram() {

    if (editor) {

        editor.value = "";

        editor.focus();

    }


    if (output) {

        output.textContent =
            "Console effacée.";

    }

}


if (clearButton) {

    clearButton.addEventListener(
        "click",
        clearProgram
    );

}


if (menuClear) {

    menuClear.addEventListener(
        "click",
        () => {

            showPython();

            clearProgram();

        }
    );

}


/* =================================================
   SOUS-MENU EXEMPLES
================================================= */

if (
    examplesButton &&
    examplesMenu
) {

    examplesButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            examplesMenu.classList.toggle(
                "show"
            );

        }
    );


    document.addEventListener(
        "click",
        () => {

            examplesMenu.classList.remove(
                "show"
            );

        }
    );


    examplesMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );

}


/* =================================================
   PROGRAMMES D'EXEMPLE
================================================= */

const examples = {


    bonjour:
```

`print("Bonjour !")
print("Bienvenue dans PyLab !")`,

```
    boucle:
```

`for nombre in range(1, 11):
    print(nombre)`,

```
    calcul:
```

`nombre1 = 12
nombre2 = 8

somme = nombre1 + nombre2

print("Résultat :", somme)`,

```
    graphique:
```

`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(
0,
10,
200
)

y = np.sin(x)

plt.figure(
figsize=(8, 4)
)

plt.plot(
x,
y,
linewidth=2,
label="sin(x)"
)

plt.title(
"Fonction sinus"
)

plt.xlabel(
"x"
)

plt.ylabel(
"sin(x)"
)

plt.grid(
True
)

plt.legend()

plt.show()`

```
};


/* =================================================
   CHARGER UN EXEMPLE
================================================= */

document
    .querySelectorAll(
        "[data-example]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const exampleName =
                        button.dataset.example;


                    if (
                        examples[
                            exampleName
                        ]
                    ) {

                        editor.value =
                            examples[
                                exampleName
                            ];

                    }


                    showPython();


                    if (
                        examplesMenu
                    ) {

                        examplesMenu
                            .classList
                            .remove(
                                "show"
                            );

                    }


                    editor.focus();

                }
            );

        }
    );


/* =================================================
   RACCOURCI :
   CTRL + ENTRÉE
================================================= */

if (editor) {

    editor.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                event.preventDefault();


                if (
                    runButton &&
                    !runButton.disabled
                ) {

                    runButton.click();

                }

            }

        }
    );

}


/* =================================================
   INITIALISATION DE PYODIDE CORE
================================================= */

async function initPyodide() {

    /*
    Empêche plusieurs chargements simultanés
    si la fonction est appelée plusieurs fois.
    */

    if (
        pyodidePromise
    ) {

        return pyodidePromise;

    }


    pyodidePromise =
        (async () => {

            try {

                /* =============================
                   PYODIDE CORE
                ============================= */

                setStatus(
                    "Chargement de Python...",
                    "status-loading"
                );


                if (output) {

                    output.textContent =
                        "Chargement de Pyodide Core...";

                }


                console.log(
                    "PyLab : chargement de Pyodide Core..."
                );


                const instance =
                    await loadPyodide({

                        indexURL:
                            "./pyodide/"

                    });


                console.log(
                    "PyLab : Pyodide Core chargé."
                );


                /* =============================
                   NUMPY
                ============================= */

                setStatus(
                    "Chargement de NumPy...",
                    "status-loading"
                );


                if (output) {

                    output.textContent =
                        "Python est chargé.\n\n" +
                        "Chargement de NumPy...";

                }


                console.log(
                    "PyLab : chargement de NumPy..."
                );


                await instance.loadPackage(
                    "numpy"
                );


                console.log(
                    "PyLab : NumPy chargé."
                );


                /* =============================
                   MATPLOTLIB
                ============================= */

                setStatus(
                    "Chargement de Matplotlib...",
                    "status-loading"
                );


                if (output) {

                    output.textContent =
                        "Python est chargé.\n" +
                        "NumPy est chargé.\n\n" +
                        "Chargement de Matplotlib...";

                }


                console.log(
                    "PyLab : chargement de Matplotlib..."
                );


                await instance.loadPackage(
                    "matplotlib"
                );


                console.log(
                    "PyLab : Matplotlib chargé."
                );


                /* =============================
                   VÉRIFICATION PYTHON
                ============================= */

                await instance.runPythonAsync(
```

`import sys
import numpy
import matplotlib

print(
"Python",
sys.version.split()[0]
)

print(
"NumPy",
numpy.**version**
)

print(
"Matplotlib",
matplotlib.**version**
)`

```
                );


                /* =============================
                   PYLAB PRÊT
                ============================= */

                pyodideReady =
                    instance;


                setStatus(
                    "Python et Matplotlib prêts",
                    "status-ready"
                );


                if (output) {

                    output.textContent =

                        "PyLab est prêt.\n\n" +

                        "✓ Python chargé\n" +

                        "✓ NumPy chargé\n" +

                        "✓ Matplotlib chargé\n\n" +

                        "Écris ton programme puis " +

                        "clique sur Exécuter.";

                }


                if (runButton) {

                    runButton.disabled =
                        false;

                }


                console.log(
                    "PyLab : Python, NumPy et Matplotlib sont prêts."
                );


                return instance;

            }

            catch (error) {

                console.error(
                    "Erreur de chargement PyLab :",
                    error
                );


                pyodidePromise =
                    null;


                setStatus(
                    "Erreur de chargement",
                    "status-error"
                );


                if (output) {

                    output.textContent =

                        "Impossible de démarrer PyLab.\n\n" +

                        "Vérifie :\n" +

                        "• le fichier pyodide.js ;\n" +

                        "• le fichier pyodide.asm.wasm ;\n" +

                        "• le fichier python_stdlib.zip ;\n" +

                        "• l'accès aux paquets NumPy et Matplotlib.\n\n" +

                        "Détail :\n" +

                        error;

                }


                if (runButton) {

                    runButton.disabled =
                        true;

                }


                throw error;

            }

        })();


    return pyodidePromise;

}


/* =================================================
   EXÉCUTER LE PROGRAMME
================================================= */

async function runProgram() {

    if (
        !pyodideReady
    ) {

        return;

    }


    if (
        !editor ||
        !output
    ) {

        return;

    }


    runButton.disabled =
        true;


    output.textContent =
        "";


    /* =============================================
       REDIRECTION DE LA CONSOLE PYTHON
    ============================================= */

    pyodideReady.setStdout({

        batched:
            text => {

                output.textContent +=
                    text + "\n";

            }

    });


    pyodideReady.setStderr({

        batched:
            text => {

                output.textContent +=
                    text + "\n";

            }

    });


    try {

        await pyodideReady
            .runPythonAsync(

                editor.value

            );


        if (
            !output.textContent
                .trim()
        ) {

            output.textContent =

                "Programme exécuté " +

                "(aucune sortie texte).";

        }

    }

    catch (error) {

        output.textContent +=

            "\n" +

            error;

    }

    finally {

        runButton.disabled =
            false;

    }

}


/* =================================================
   BOUTON EXÉCUTER
================================================= */

if (runButton) {

    runButton.addEventListener(
        "click",
        runProgram
    );

}


/* =================================================
   DÉMARRAGE AUTOMATIQUE
   PYODIDE + NUMPY + MATPLOTLIB
================================================= */

initPyodide();
```

});

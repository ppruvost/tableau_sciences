// =========================================================
// MATHILAB
// NAVIGATION + PYODIDE + NUMPY + MATPLOTLIB
// =========================================================


// =========================================================
// VARIABLES PYTHON
// =========================================================

let pyodide = null;
let pythonReady = false;


// =========================================================
// ÉLÉMENTS DOM
// =========================================================

const homeButton    = document.getElementById("homeButton");
const pythonButton  = document.getElementById("pythonButton");
const examplesButton = document.getElementById("examplesButton");

const startButton   = document.getElementById("startButton");

const runButton     = document.getElementById("run");
const clearButton   = document.getElementById("clear");
const exportButton  = document.getElementById("export");

const codeEditor    = document.getElementById("code");
const output        = document.getElementById("output");
const status        = document.getElementById("status");

const examplesMenu  = document.getElementById("examplesMenu");


// =========================================================
// NAVIGATION
// =========================================================

window.setActive = function (element) {

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.remove("active");

        });

    if (element) {

        element.classList.add("active");

    }

};


// =========================================================
// AFFICHER UNE PAGE
// =========================================================

window.showSection = function (
    sectionId,
    element = null
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active-page");

        });

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.classList.add("active-page");

    }

    window.setActive(element);

};


// =========================================================
// CHARGER UNE PAGE EXTERNE
// =========================================================

window.loadInFrame = function (
    url,
    element = null
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active-page");

        });

    const section =
        document.getElementById(
            "external-content"
        );

    const frame =
        document.getElementById(
            "external-frame"
        );

    if (!section || !frame) return;

    frame.src = url;

    section.classList.add("active-page");

    window.setActive(element);

};


// =========================================================
// ACCUEIL
// =========================================================

homeButton?.addEventListener(
    "click",
    () => {

        window.showSection(
            "home-message",
            homeButton
        );

    }
);


// =========================================================
// OUVRIR MATHILAB
// =========================================================

pythonButton?.addEventListener(
    "click",
    () => {

        window.showSection(
            "python-page",
            pythonButton
        );

    }
);


// =========================================================
// BOUTON COMMENCER
// =========================================================

startButton?.addEventListener(
    "click",
    () => {

        window.showSection(
            "python-page",
            pythonButton
        );

    }
);


// =========================================================
// MENU DOMAINES
// =========================================================

examplesButton?.addEventListener(
    "click",
    () => {

        if (!examplesMenu) return;

        examplesMenu.classList.toggle("show");

    }
);


// =========================================================
// FERMER LE MENU SI CLIC AILLEURS
// =========================================================

document.addEventListener(
    "click",
    event => {

        if (
            !examplesButton?.contains(event.target) &&
            !examplesMenu?.contains(event.target)
        ) {

            examplesMenu?.classList.remove("show");

        }

    }
);


// =========================================================
// TP VIEWER
// =========================================================

const tpViewer =
    document.getElementById("tpViewer");

const tpFrame =
    document.getElementById("tpFrame");

const closeViewer =
    document.getElementById("closeViewer");


// =========================================================
// OUVRIR UN TP
// =========================================================

function openTP(url) {

    if (!tpViewer || !tpFrame) return;

    tpViewer.classList.remove("hidden");

    tpFrame.src = url;

}


// =========================================================
// FERMER LE TP
// =========================================================

closeViewer?.addEventListener(
    "click",
    () => {

        tpViewer.classList.add("hidden");

        tpFrame.src = "";

    }
);


// =========================================================
// DOMAINES
// =========================================================

document
    .getElementById("openStatistiques")
    ?.addEventListener(
        "click",
        () => {

            openTP(
                "tp-statistiques/index.html"
            );

        }
    );


document
    .getElementById("openAlgebre")
    ?.addEventListener(
        "click",
        () => {

            openTP(
                "tp-algebre/index.html"
            );

        }
    );


document
    .getElementById("openGeometrie")
    ?.addEventListener(
        "click",
        () => {

            openTP(
                "tp-geometrie/index.html"
            );

        }
    );


document
    .getElementById("openAlgorithme")
    ?.addEventListener(
        "click",
        () => {

            openTP(
                "tp-algorithme/index.html"
            );

        }
    );


// =========================================================
// PROGRESS BAR
// =========================================================

let progress = 10;


window.updateProgress = function () {

    progress += 10;

    if (progress > 100) {

        progress = 100;

    }

    const bar =
        document.getElementById("bar");

    if (bar) {

        bar.style.width =
            progress + "%";

    }

};


// =========================================================
// CHARGEMENT DE PYODIDE
// =========================================================

async function loadPyodideEngine() {

    if (typeof loadPyodide !== "function") {

        console.error(
            "Pyodide n'est pas disponible."
        );

        if (status) {

            status.textContent =
                "Erreur : Pyodide indisponible";

            status.className =
                "status-error";

        }

        if (output) {

            output.textContent =
                "Impossible de charger Pyodide.";

        }

        return;

    }


    try {

        if (status) {

            status.textContent =
                "Chargement de Python...";

            status.className =
                "status-loading";

        }


        if (output) {

            output.textContent =
                "Initialisation de Python...";

        }


        // =================================================
        // PYODIDE
        // =================================================

        pyodide = await loadPyodide();


        // =================================================
        // NUMPY
        // =================================================

        if (status) {

            status.textContent =
                "Chargement de NumPy...";

        }

        await pyodide.loadPackage("numpy");


        // =================================================
        // MATPLOTLIB
        // =================================================

        if (status) {

            status.textContent =
                "Chargement de Matplotlib...";

        }

        await pyodide.loadPackage(
            "matplotlib"
        );


        // =================================================
        // ENVIRONNEMENT PYTHON
        // =================================================

        await pyodide.runPythonAsync(`

import sys
import math

import numpy as np
import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt

        `);


        // =================================================
        // PYTHON PRÊT
        // =================================================

        pythonReady = true;


        if (status) {

            status.textContent =
                "Python + NumPy + Matplotlib prêts";

            status.className =
                "status-ready";

        }


        if (output) {

            output.textContent =
                "MathiLab est prêt.\\n\\n" +
                "Python + NumPy + Matplotlib sont chargés.";

        }


        if (runButton) {

            runButton.disabled = false;

        }


        console.log(
            "MathiLab : Python chargé"
        );

        console.log(
            "MathiLab : NumPy chargé"
        );

        console.log(
            "MathiLab : Matplotlib chargé"
        );


    } catch (error) {

        console.error(
            "Erreur lors du chargement de Pyodide :",
            error
        );


        pythonReady = false;


        if (status) {

            status.textContent =
                "Erreur de chargement";

            status.className =
                "status-error";

        }


        if (output) {

            output.textContent =
                "Erreur lors du chargement de Python :\\n\\n" +
                error;

        }

    }

}


// =========================================================
// EXÉCUTER PYTHON
// =========================================================

async function runPython() {

    if (!pythonReady || !pyodide) {

        if (output) {

            output.textContent =
                "Python n'est pas encore prêt.";

        }

        return;

    }


    if (!codeEditor) return;


    const code =
        codeEditor.value;


    if (!code.trim()) {

        if (output) {

            output.textContent =
                "Aucun programme à exécuter.";

        }

        return;

    }


    if (runButton) {

        runButton.disabled = true;

        runButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Exécution...';

    }


    if (output) {

        output.textContent =
            "Exécution du programme...";

    }


    try {

        // =================================================
        // REDIRECTION DE LA CONSOLE PYTHON
        // =================================================

        pyodide.runPython(`

import sys
from io import StringIO

_mathilab_output = StringIO()

sys.stdout = _mathilab_output
sys.stderr = _mathilab_output

        `);


        // =================================================
        // EXÉCUTION
        // =================================================

        await pyodide.runPythonAsync(code);


        // =================================================
        // RÉCUPÉRATION DU RÉSULTAT
        // =================================================

        const result =
            pyodide.runPython(
                "_mathilab_output.getvalue()"
            );


        if (output) {

            output.textContent =
                result || "Programme exécuté avec succès.";

        }


    } catch (error) {

        console.error(
            "Erreur Python :",
            error
        );


        if (output) {

            output.textContent =
                "Erreur Python :\\n\\n" +
                error;

        }

    } finally {


        // =================================================
        // RESTAURATION STDOUT / STDERR
        // =================================================

        try {

            pyodide.runPython(`

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

            `);

        } catch (e) {

            console.warn(
                "Impossible de restaurer stdout.",
                e
            );

        }


        if (runButton) {

            runButton.disabled = false;

            runButton.innerHTML =
                '<i class="fas fa-play"></i> Exécuter';

        }

    }

}


// =========================================================
// BOUTON EXÉCUTER
// =========================================================

runButton?.addEventListener(
    "click",
    runPython
);


// =========================================================
// CTRL + ENTRÉE
// =========================================================

codeEditor?.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            runPython();

        }

    }
);


// =========================================================
// EFFACER L'ÉDITEUR
// =========================================================

function clearEditor() {

    if (codeEditor) {

        codeEditor.value = "";

    }


    if (output) {

        output.textContent =
            "Éditeur effacé.";

    }

}


clearButton?.addEventListener(
    "click",
    clearEditor
);


// =========================================================
// EFFACER VIA LE MENU LATÉRAL
// =========================================================

document
    .getElementById("menuClear")
    ?.addEventListener(
        "click",
        clearEditor
    );


// =========================================================
// EXPORTER LE SCRIPT PYTHON
// =========================================================

function exportPython() {

    if (!codeEditor) return;


    const code =
        codeEditor.value;


    const blob =
        new Blob(
            [code],
            {
                type: "text/x-python"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "programme.py";


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


exportButton?.addEventListener(
    "click",
    exportPython
);


// =========================================================
// EXEMPLES PYTHON
// =========================================================

const EXAMPLES = {

    bonjour: `print("Bonjour depuis MathiLab !")`,



    boucle: `for nombre in range(1, 11):
    print(nombre)`,



    liste: `nombres = [12, 15, 18, 20, 25]

print("Données :", nombres)
print("Effectif :", len(nombres))
print("Somme :", sum(nombres))
print("Moyenne :", sum(nombres) / len(nombres))`,



    calcul: `a = 12
b = 5

print("a + b =", a + b)
print("a - b =", a - b)
print("a × b =", a * b)
print("a ÷ b =", a / b)`,



    graphique: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = x ** 2

plt.figure(figsize=(7, 4))
plt.plot(x, y)
plt.title("Fonction carré")
plt.xlabel("x")
plt.ylabel("y")
plt.grid()

print("Graphique créé avec NumPy et Matplotlib.")

plt.show()`

};


// =========================================================
// CHARGER UN EXEMPLE
// =========================================================

document
    .querySelectorAll(
        "[data-example]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const name =
                    button.dataset.example;


                if (
                    !EXAMPLES[name] ||
                    !codeEditor
                ) {

                    return;

                }


                codeEditor.value =
                    EXAMPLES[name];


                examplesMenu?.classList.remove(
                    "show"
                );


                window.showSection(
                    "python-page",
                    pythonButton
                );

            }
        );

    });


// =========================================================
// DOMAINE → EXEMPLES
// =========================================================

document
    .querySelectorAll(
        "[data-domaine]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const domaine =
                    button.dataset.domaine;


                examplesMenu?.classList.remove(
                    "show"
                );


                console.log(
                    "Domaine sélectionné :",
                    domaine
                );

            }
        );

    });


// =========================================================
// INITIALISATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "MathiLab : interface chargée"
        );


        loadPyodideEngine();

    }
);


console.log(
    "MathiLab chargé avec succès"
);

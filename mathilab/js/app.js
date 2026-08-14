// =========================================================
// MATHILAB
// PYODIDE + NUMPY + MATPLOTLIB
// =========================================================


// =========================================================
// VARIABLES
// =========================================================

let pyodide = null;
let pythonReady = false;


// =========================================================
// ÉLÉMENTS DOM
// =========================================================

const homeButton =
    document.getElementById("homeButton");

const pythonButton =
    document.getElementById("pythonButton");

const examplesButton =
    document.getElementById("examplesButton");

const examplesMenu =
    document.getElementById("examplesMenu");

const startButton =
    document.getElementById("startButton");

const runButton =
    document.getElementById("run");

const clearButton =
    document.getElementById("clear");

const exportButton =
    document.getElementById("export");

const menuClear =
    document.getElementById("menuClear");

const codeEditor =
    document.getElementById("code");

const output =
    document.getElementById("output");

const status =
    document.getElementById("status");

const graphContainer =
    document.getElementById("graph-container");

const graphStatus =
    document.getElementById("graph-status");


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
// IFRAME
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
// MATHILAB
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
// COMMENCER
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
// MENU EXEMPLES
// =========================================================

examplesButton?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        examplesMenu?.classList.toggle("show");

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !examplesButton?.contains(event.target) &&
            !examplesMenu?.contains(event.target)
        ) {

            examplesMenu?.classList.remove(
                "show"
            );

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


function openTP(url) {

    if (!tpViewer || !tpFrame) return;

    tpViewer.classList.remove("hidden");

    tpFrame.src = url;

}


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
// AFFICHAGE GRAPHIQUE
// =========================================================

function clearGraph() {

    if (!graphContainer) return;

    graphContainer.innerHTML = `

        <div class="graph-placeholder">

            <i class="fas fa-chart-area"></i>

            <p>
                Le graphique apparaîtra ici.
            </p>

            <small>
                Utilise Matplotlib dans ton programme Python.
            </small>

        </div>

    `;

    if (graphStatus) {

        graphStatus.textContent =
            "● Prêt";

    }

}


// =========================================================
// AFFICHER UNE IMAGE PNG
// =========================================================

function displayGraph(base64) {

    if (!graphContainer || !base64) {

        return;

    }


    graphContainer.innerHTML = "";


    const image =
        document.createElement("img");


    image.className =
        "mathilab-graph";


    image.alt =
        "Graphique généré avec Matplotlib";


    image.src =
        "data:image/png;base64," +
        base64;


    graphContainer.appendChild(
        image
    );


    if (graphStatus) {

        graphStatus.textContent =
            "● Graphique généré";

    }

}


// =========================================================
// CHARGEMENT PYODIDE
// =========================================================

async function loadPyodideEngine() {

    if (
        typeof loadPyodide !==
        "function"
    ) {

        console.error(
            "Pyodide indisponible."
        );

        if (status) {

            status.textContent =
                "Erreur : Pyodide indisponible";

            status.className =
                "status-error";

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


        pyodide =
            await loadPyodide();


        // =================================================
        // NUMPY
        // =================================================

        if (status) {

            status.textContent =
                "Chargement de NumPy...";

        }


        await pyodide.loadPackage(
            "numpy"
        );


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
import base64
from io import StringIO, BytesIO

import numpy as np

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt

        `);


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


        runButton &&
            (runButton.disabled = false);


        console.log(
            "MathiLab : Python prêt"
        );

        console.log(
            "MathiLab : NumPy prêt"
        );

        console.log(
            "MathiLab : Matplotlib prêt"
        );


    } catch (error) {

        console.error(
            "Erreur Pyodide :",
            error
        );


        if (status) {

            status.textContent =
                "Erreur de chargement";

            status.className =
                "status-error";

        }


        if (output) {

            output.textContent =
                "Erreur lors du chargement :\\n\\n" +
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


    clearGraph();


    if (output) {

        output.textContent =
            "Exécution du programme...";

    }


    try {

        // =================================================
        // PRÉPARATION DE LA CONSOLE
        // =================================================

        pyodide.runPython(`

_mathilab_output = StringIO()

sys.stdout = _mathilab_output
sys.stderr = _mathilab_output

        `);


        // =================================================
        // EXÉCUTION DU CODE
        // =================================================

        await pyodide.runPythonAsync(
            code
        );


        // =================================================
        // RÉCUPÉRER LE TEXTE
        // =================================================

        const result =
            pyodide.runPython(
                "_mathilab_output.getvalue()"
            );


        if (output) {

            output.textContent =
                result ||
                "Programme exécuté avec succès.";

        }


        // =================================================
        // RECHERCHER LES FIGURES
        // =================================================

        const figureCount =
            pyodide.runPython(
                "len(plt.get_fignums())"
            );


        if (figureCount > 0) {

            const base64 =
                pyodide.runPython(`

import base64
from io import BytesIO

_fig = plt.gcf()

_buffer = BytesIO()

_fig.savefig(
    _buffer,
    format="png",
    bbox_inches="tight",
    dpi=120
)

_buffer.seek(0)

base64.b64encode(
    _buffer.read()
).decode("utf-8")

                `);


            displayGraph(
                base64
            );


            // Fermer les figures
            pyodide.runPython(
                "plt.close('all')"
            );

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


        if (graphStatus) {

            graphStatus.textContent =
                "● Erreur";

        }

    } finally {

        // =================================================
        // RESTAURATION CONSOLE
        // =================================================

        try {

            pyodide.runPython(`

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

            `);

        } catch (error) {

            console.warn(
                "Restauration console impossible.",
                error
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
// EFFACER
// =========================================================

function clearEditor() {

    if (codeEditor) {

        codeEditor.value = "";

    }


    if (output) {

        output.textContent =
            "Éditeur effacé.";

    }


    clearGraph();

}


clearButton?.addEventListener(
    "click",
    clearEditor
);


menuClear?.addEventListener(
    "click",
    clearEditor
);


// =========================================================
// EXPORT PYTHON
// =========================================================

function exportPython() {

    if (!codeEditor) return;


    const blob =
        new Blob(
            [codeEditor.value],
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


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


exportButton?.addEventListener(
    "click",
    exportPython
);


// =========================================================
// EXEMPLES
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

plt.show()

print("Graphique créé avec Matplotlib.")`

};


// =========================================================
// CHARGER LES EXEMPLES
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

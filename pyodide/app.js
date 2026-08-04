/* =========================================================
   PYLAB
   INTERFACE UTILISATEUR + MOTEUR PYTHON (PYODIDE)
   PYODIDE FULL (via CDN jsDelivr) + NUMPY + MATPLOTLIB
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ÉLÉMENTS HTML
    ================================================= */

    const homeButton = document.getElementById("homeButton");
    const pythonButton = document.getElementById("pythonButton");
    const startButton = document.getElementById("startButton");
    const homePage = document.getElementById("home-message");
    const pythonPage = document.getElementById("python-page");
    const clearButton = document.getElementById("clear");
    const menuClear = document.getElementById("menuClear");
    const editor = document.getElementById("code");
    const output = document.getElementById("output");
    const examplesButton = document.getElementById("examplesButton");
    const examplesMenu = document.getElementById("examplesMenu");
    const runButton = document.getElementById("run");
    const exportButton = document.getElementById("export");
    const status = document.getElementById("status");

    /* =================================================
       VARIABLES PYODIDE
    ================================================= */

    let pyodideReady = null;
    let pyodidePromise = null;

    /* =================================================
       AFFICHER PYLAB
    ================================================= */

    function showPython() {
        if (homePage) homePage.classList.remove("active-page");
        if (pythonPage) pythonPage.classList.add("active-page");
        if (homeButton) homeButton.classList.remove("active");
        if (pythonButton) pythonButton.classList.add("active");
    }

    /* =================================================
       AFFICHER ACCUEIL
    ================================================= */

    function showHome() {
        if (pythonPage) pythonPage.classList.remove("active-page");
        if (homePage) homePage.classList.add("active-page");
        if (pythonButton) pythonButton.classList.remove("active");
        if (homeButton) homeButton.classList.add("active");
    }

    /* =================================================
       BOUTONS DE NAVIGATION
    ================================================= */

    if (homeButton) homeButton.addEventListener("click", showHome);
    if (pythonButton) pythonButton.addEventListener("click", showPython);
    if (startButton) startButton.addEventListener("click", showPython);

    /* =================================================
       STATUT DE CHARGEMENT
    ================================================= */

    function setStatus(text, state) {
        if (!status) return;
        status.textContent = text;
        status.className = state;
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
            output.textContent = "Console effacée.";
        }
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearProgram);
    }

    if (menuClear) {
        menuClear.addEventListener("click", () => {
            showPython();
            clearProgram();
        });
    }

    /* =================================================
       SOUS-MENU EXEMPLES
    ================================================= */

    if (examplesButton && examplesMenu) {
        examplesButton.addEventListener("click", event => {
            event.stopPropagation();
            examplesMenu.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            examplesMenu.classList.remove("show");
        });

        examplesMenu.addEventListener("click", event => {
            event.stopPropagation();
        });
    }

    /* =================================================
       PROGRAMMES D'EXEMPLE
    ================================================= */

    const examples = {
        bonjour: `print("Bonjour !")
print("Bienvenue dans PyLab !")`,

        boucle: `for nombre in range(1, 11):
    print(nombre)`,

        calcul: `nombre1 = 12
nombre2 = 8

somme = nombre1 + nombre2

print("Résultat :", somme)`,

        graphique: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 200)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y, linewidth=2, label="sin(x)")
plt.title("Fonction sinus")
plt.xlabel("x")
plt.ylabel("sin(x)")
plt.grid(True)
plt.legend()
plt.show()`
    };

    /* =================================================
       CHARGER UN EXEMPLE
    ================================================= */

    document.querySelectorAll("[data-example]").forEach(button => {
        button.addEventListener("click", () => {
            const exampleName = button.dataset.example;

            if (examples[exampleName] && editor) {
                editor.value = examples[exampleName];
            }

            showPython();

            if (examplesMenu) {
                examplesMenu.classList.remove("show");
            }

            if (editor) editor.focus();
        });
    });

    /* =================================================
       RACCOURCI : CTRL + ENTRÉE
    ================================================= */

    if (editor) {
        editor.addEventListener("keydown", event => {
            if (event.ctrlKey && event.key === "Enter") {
                event.preventDefault();
                if (runButton && !runButton.disabled) {
                    runButton.click();
                }
            }
        });
    }

    /* =================================================
       INITIALISATION DE PYODIDE
    ================================================= */

    async function initPyodide() {
        if (pyodidePromise) return pyodidePromise;

        pyodidePromise = (async () => {
            try {
                setStatus("Chargement de Python...", "status-loading");

                if (output) {
                    output.textContent = "Chargement de Pyodide...";
                }

                console.log("PyLab : chargement de Pyodide...");

                const instance = await loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/"
                });

                console.log("PyLab : Pyodide chargé.");

                setStatus("Chargement de NumPy et Matplotlib...", "status-loading");

                if (output) {
                    output.textContent =
                        "Python est chargé.\n\nChargement de NumPy et Matplotlib...";
                }

                console.log("PyLab : chargement de NumPy et Matplotlib...");

                await instance.loadPackage(["numpy", "matplotlib"]);

                console.log("PyLab : NumPy et Matplotlib chargés.");

                await instance.runPythonAsync(`
import sys
import numpy
import matplotlib
import math
import warnings

warnings.filterwarnings("ignore", message=".*non-interactive.*")

matplotlib.use("Agg")

print("Python", sys.version.split()[0])
print("NumPy", numpy.__version__)
print("Matplotlib", matplotlib.__version__)
print("Math", math.__version__)
`);

                pyodideReady = instance;

                setStatus("Python et Matplotlib prêts", "status-ready");

                if (output) {
                    output.textContent =
                        "PyLab est prêt.\n\n" +
                        "✓ Python chargé\n" +
                        "✓ NumPy chargé\n" +
                        "✓ Matplotlib chargé\n\n" +
                        "Écris ton programme puis clique sur Exécuter.";
                }

                if (runButton) {
                    runButton.disabled = false;
                }

                console.log("PyLab : Python, NumPy et Matplotlib sont prêts.");

                return instance;
            } catch (error) {
                console.error("Erreur de chargement PyLab :", error);

                pyodidePromise = null;

                setStatus("Erreur de chargement", "status-error");

                if (output) {
                    output.textContent =
                        "Impossible de démarrer PyLab.\n\n" +
                        "Détail :\n" +
                        error;
                }

                if (runButton) {
                    runButton.disabled = true;
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
        if (!pyodideReady || !editor || !output) return;

        runButton.disabled = true;
        output.textContent = "";

        pyodideReady.setStdout({
            batched: text => {
                output.textContent += text + "\n";
            }
        });

        pyodideReady.setStderr({
            batched: text => {
                output.textContent += text + "\n";
            }
        });

        let imagesCount = 0;

        try {
            await pyodideReady.runPythonAsync(editor.value);

            const figuresJson = await pyodideReady.runPythonAsync(`
import io, base64, json

_images = []
try:
    import matplotlib.pyplot as plt
    for _num in plt.get_fignums():
        _fig = plt.figure(_num)
        _buf = io.BytesIO()
        _fig.savefig(_buf, format="png", bbox_inches="tight")
        _buf.seek(0)
        _images.append(base64.b64encode(_buf.read()).decode("ascii"))
    plt.close("all")
except ImportError:
    pass

json.dumps(_images)
`);

            const images = JSON.parse(figuresJson);
            imagesCount = images.length;

            images.forEach(b64 => {
                const img = document.createElement("img");
                img.src = "data:image/png;base64," + b64;
                img.alt = "Graphique généré par le programme Python";
                img.className = "plot-image";
                output.appendChild(img);
            });

            if (!output.textContent.trim() && imagesCount === 0) {
                output.textContent = "Programme exécuté (aucune sortie texte).";
            }
        } catch (error) {
            output.textContent += "\n" + error;
        } finally {
            runButton.disabled = false;
        }
    }

    /* =================================================
       BOUTON EXÉCUTER
    ================================================= */

    if (runButton) {
        runButton.addEventListener("click", runProgram);
    }

    /* =================================================
       EXPORTER LE SCRIPT PYTHON
    ================================================= */

    function exportPythonScript() {

        if (!editor) return;

        const pythonCode = editor.value;

        if (!pythonCode.trim()) {

            if (output) {
                output.textContent =
                    "Impossible d'exporter le script.\n\n" +
                    "L'Éditeur Python est vide.";
            }

            editor.focus();

            return;
        }

        const pythonFile = new Blob(
            [pythonCode],
            {
                type: "text/x-python;charset=utf-8"
            }
        );

        const fileURL = URL.createObjectURL(pythonFile);

        const downloadLink = document.createElement("a");

        downloadLink.href = fileURL;

        downloadLink.download = "programme.py";

        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);

        setTimeout(() => {
            URL.revokeObjectURL(fileURL);
        }, 100);

        if (output) {
            output.textContent =
                "✓ Script Python exporté avec succès.\n\n" +
                "Fichier : programme.py";
        }
    }

    /* =================================================
       BOUTON EXPORTER LE SCRIPT
    ================================================= */

    if (exportButton) {
        exportButton.addEventListener(
            "click",
            exportPythonScript
        );
    }

    /* =================================================
       DÉMARRAGE AUTOMATIQUE
    ================================================= */

    initPyodide();

});

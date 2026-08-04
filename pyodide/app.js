/* =========================================================
PYLAB
INTERFACE UTILISATEUR + MOTEUR PYTHON (PYODIDE)
PYODIDE CORE + NUMPY + MATPLOTLIB
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
       INITIALISATION DE PYODIDE CORE
    ================================================= */

    async function initPyodide() {
        if (pyodidePromise) return pyodidePromise;

        pyodidePromise = (async () => {
            try {
                setStatus("Chargement de Python...", "status-loading");

                if (output) {
                    output.textContent = "Chargement de Pyodide Core...";
                }

                console.log("PyLab : chargement de Pyodide Core...");

                const instance = await loadPyodide({
                    // IMPORTANT :
                    // adapte ce chemin à l’emplacement réel de ton dossier pyodide
                    // Exemple GitHub Pages :
                    // "/tableau_sciences/pyodide/"
                    indexURL: "./pyodide/pyodide/"
                });

                console.log("PyLab : Pyodide Core chargé.");

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

print("Python", sys.version.split()[0])
print("NumPy", numpy.__version__)
print("Matplotlib", matplotlib.__version__)
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

        try {
            await pyodideReady.runPythonAsync(editor.value);

            if (!output.textContent.trim()) {
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
       DÉMARRAGE AUTOMATIQUE
    ================================================= */

    initPyodide();

});

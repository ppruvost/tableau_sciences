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

       CORRECTIF STABLE : indexURL pointe désormais vers le
       CDN officiel jsDelivr (distribution "full"), qui
       contient tous les paquets scientifiques (numpy,
       matplotlib, etc.) avec leurs fichiers .whl et
       pyodide-lock.json.

       Auparavant, le dossier local "pyodide/pyodide/" ne
       contenait que la distribution "pyodide-core", une
       version minimale du runtime sans aucun paquet
       scientifique (prévue pour Node.js avec CDN de secours
       automatique, absent en navigateur). C'est pour cela que
       loadPackage(["numpy", "matplotlib"]) échouait avec
       "ModuleNotFoundError: No module named 'numpy'".

       Avec le CDN, plus besoin d'héberger ni de maintenir de
       fichiers volumineux dans le dépôt : la version utilisée
       doit juste correspondre exactement au numéro de version
       Pyodide (ici 314.0.3).
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

# Filtre l'avertissement inoffensif émis par plt.show() avec le
# backend "Agg" (rendu non interactif, cf. plus bas). Sans ce
# filtre, il apparaît dans la console à chaque exécution qui
# utilise Matplotlib.
warnings.filterwarnings("ignore", message=".*non-interactive.*")

# Rendu "headless" fiable : les figures sont capturées en PNG
# côté JS après exécution plutôt que dessinées directement dans
# la page (évite les soucis de backend interactif dans le navigateur).
matplotlib.use("Agg")

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

        let imagesCount = 0;

        try {
            await pyodideReady.runPythonAsync(editor.value);

            // Récupère les éventuelles figures Matplotlib ouvertes par le
            // programme (plt.show() ne peut rien afficher lui-même avec le
            // backend "Agg" : on les convertit ici en images PNG).
            //
            // CORRECTIF : json.dumps(_images) doit être la dernière
            // instruction de haut niveau et une EXPRESSION NUE (pas à
            // l'intérieur du try/except) pour que runPythonAsync()
            // renvoie effectivement une valeur à JavaScript. Avant ce
            // correctif, la dernière instruction de haut niveau était le
            // try/except lui-même : Pyodide renvoyait alors "undefined"
            // à JS, d'où l'erreur systématique
            // "SyntaxError: 'undefined' is not valid JSON" à CHAQUE
            // exécution, même sans graphique.
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
       DÉMARRAGE AUTOMATIQUE
    ================================================= */

    initPyodide();

});

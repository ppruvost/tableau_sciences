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
    const importButton = document.getElementById("import");
    const importFile = document.getElementById("importFile");
    const status = document.getElementById("status");
    const zoomOpenButton = document.getElementById("zoomOpen");
    const zoomCloseButton = document.getElementById("zoomClose");
    const zoomModalClose = document.getElementById("zoomModalClose");
    const zoomModal = document.getElementById("zoomModal");
    const zoomContent = document.getElementById("zoomContent");
    const consoleZoomOpenButton = document.getElementById("consoleZoomOpen");
    const consoleZoomCloseButton = document.getElementById("consoleZoomClose");
    const consoleZoomModalClose = document.getElementById("consoleZoomModalClose");
    const consoleZoomModal = document.getElementById("consoleZoomModal");
    const consoleZoomContent = document.getElementById("consoleZoomContent");

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
       CODE PRÉ-REMPLI DEPUIS UNE AUTRE PAGE
       ?code=<base64 de l'UTF-8>
    ================================================= */

    try {
        const params = new URLSearchParams(window.location.search);
        const codeParam = params.get("code");

        if (codeParam && editor) {
            const decode = s => {
                s = s.replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
                while (s.length % 4) s += "=";
                return decodeURIComponent(escape(atob(s)));
            };
            editor.value = decode(codeParam);
            showPython();
        }
    } catch (e) {
        console.warn("Paramètre ?code= illisible :", e);
    }

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

        liste: `valeurs = [10, 20, 30, 40]
effectifs = [1, 2, 3, 4]

liste = numpy.repeat(valeurs, effectifs)
print("Moyenne :", round(numpy.mean(liste), 2))
print("Médiane :", numpy.median(liste))
print("Variance :", round(numpy.var(liste), 2))
print("Écart-type :", round(numpy.std(liste), 2))`,

        arbre: `# P(A) ; P(B sachant A) ; P(B sachant non A)
arbre(0.4, 0.9, 0.5)`,

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
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
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
import numpy as np
import matplotlib
import math
from math import log10
import random
import warnings

warnings.filterwarnings("ignore", message=".*non-interactive.*")
warnings.filterwarnings("ignore", message=".*non-GUI backend.*")
warnings.filterwarnings("ignore", message=".*cannot show the figure.*")

matplotlib.use("Agg")

import matplotlib.pyplot as plt

# Les figures sont récupérées et affichées par PyLab.
plt.show = lambda *args, **kwargs: None


# ========================================================
# BOÎTE À MOUSTACHES (programme de BAC Pro)
# Fonction disponible directement pour les élèves.
# Utilisation : boite_moustaches([12, 15, 18, 20, 25])
#
# Définitions utilisées :
#   - Min et Max : plus petite et plus grande valeur
#   - Médiane : valeur centrale (moyenne des deux valeurs
#     centrales si l'effectif est pair)
#   - Q1 : plus petite valeur de la série telle qu'au moins
#     25 % des valeurs lui soient inférieures ou égales
#     (rang = n/4 arrondi à l'entier supérieur)
#   - Q3 : plus petite valeur de la série telle qu'au moins
#     75 % des valeurs lui soient inférieures ou égales
#     (rang = 3n/4 arrondi à l'entier supérieur)
#   - Les moustaches vont du minimum au maximum.
# ========================================================

def boite_moustaches(data):
    """Trace une boîte à moustaches horizontale (Min, Q1, Médiane, Q3, Max)."""

    valeurs = numpy.asarray(data, dtype=float).ravel()
    valeurs = valeurs[numpy.isfinite(valeurs)]

    if valeurs.size == 0:
        raise ValueError(
            "La liste doit contenir au moins une valeur numérique."
        )

    tri = numpy.sort(valeurs)
    n = len(tri)

    minimum = float(tri[0])
    q1 = float(tri[int(math.ceil(n / 4)) - 1])
    mediane = float(numpy.median(tri))
    q3 = float(tri[int(math.ceil(3 * n / 4)) - 1])
    maximum = float(tri[-1])

    fig, ax = plt.subplots(figsize=(8, 3))

    stats = [{
        "whislo": minimum,
        "q1": q1,
        "med": mediane,
        "q3": q3,
        "whishi": maximum,
        "fliers": []
    }]

    ax.bxp(
        stats,
        vert=False,
        patch_artist=True,
        boxprops={
            "facecolor": "lightblue",
            "edgecolor": "#1f3c63"
        },
        medianprops={
            "color": "#d9480f",
            "linewidth": 2
        },
        whiskerprops={"color": "#1f3c63"},
        capprops={"color": "#1f3c63"}
    )

    ax.set_title("Boîte à moustaches")
    ax.set_xlabel("Valeurs")
    ax.set_yticks([])
    ax.set_ylim(0.4, 1.6)
    ax.grid(axis="x", alpha=0.3)

    # Étiquettes au-dessus : Min, Médiane, Max
    for valeur, nom in [(minimum, "Min"), (mediane, "Médiane"), (maximum, "Max")]:
        ax.annotate(
            f"{nom}={valeur:g}",
            (valeur, 1.25),
            xytext=(0, 6),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=8
        )

    # Étiquettes en dessous : Q1 et Q3
    for valeur, nom in [(q1, "Q1"), (q3, "Q3")]:
        ax.annotate(
            f"{nom}={valeur:g}",
            (valeur, 0.75),
            xytext=(0, -6),
            textcoords="offset points",
            ha="center",
            va="top",
            fontsize=8
        )

    fig.tight_layout()
    return fig


# ========================================================
# ARBRE PONDÉRÉ (probabilités conditionnelles)
# Fonction disponible directement pour les élèves.
# Utilisation : arbre(0.4, 0.9, 0.5)
#   - 1er nombre : P(A)
#   - 2e nombre  : P(B sachant A)
#   - 3e nombre  : P(B sachant non A)   (facultatif)
# Les branches complémentaires sont calculées automatiquement.
# Si le 3e nombre est omis, les branches correspondantes
# affichent « … » (comme sur l'énoncé).
# ========================================================

def arbre(pA, pB_A, pB_nA=None):
    """Trace l'arbre pondéré : Ω -> A / non A -> B / non B."""

    for p in (pA, pB_A, pB_nA):
        if p is not None and not (0 <= p <= 1):
            raise ValueError(
                "Les probabilités doivent être comprises entre 0 et 1."
            )

    def f(x):
        return "…" if x is None else f"{round(x, 6):g}"

    def comp(x):
        return None if x is None else 1 - x

    nA = r"$\\overline{A}$"
    nB = r"$\\overline{B}$"

    pos = {
        "O": (0.1, 0.5),
        "A": (1.2, 0.75), "nA": (1.2, 0.25),
        "AB": (2.3, 0.88), "AnB": (2.3, 0.62),
        "nAB": (2.3, 0.38), "nAnB": (2.3, 0.12)
    }
    noms = {
        "O": "Ω", "A": "A", "nA": nA,
        "AB": "B", "AnB": nB, "nAB": "B", "nAnB": nB
    }
    branches = [
        ("O", "A", pA), ("O", "nA", comp(pA)),
        ("A", "AB", pB_A), ("A", "AnB", comp(pB_A)),
        ("nA", "nAB", pB_nA), ("nA", "nAnB", comp(pB_nA))
    ]

    fig, ax = plt.subplots(figsize=(8, 5))

    for debut, fin, p in branches:
        (x1, y1), (x2, y2) = pos[debut], pos[fin]
        ax.plot([x1, x2], [y1, y2], color="#1f3c63", linewidth=1.5, zorder=1)
        ax.text(
            (x1 + x2) / 2, (y1 + y2) / 2, f(p),
            ha="center", va="center", fontsize=11, zorder=2,
            bbox=dict(fc="white", ec="none", pad=1.5)
        )

    for cle, (x, y) in pos.items():
        ax.text(
            x, y, noms[cle],
            ha="center", va="center", fontsize=14, zorder=3,
            bbox=dict(boxstyle="round,pad=0.3", fc="lightblue", ec="#1f3c63")
        )

    ax.set_xlim(-0.1, 2.6)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title("Arbre pondéré")
    fig.tight_layout()
    return fig


print("Python", sys.version.split()[0])
print("numPy", numpy.__version__)
print("matplotlib", matplotlib.__version__)
print("math")
print("random")
`);

                pyodideReady = instance;

                setStatus("Python et Imports prêts", "status-ready");

                if (output) {
                    output.textContent =
                        "PyLab est prêt.\n\n" +
                        "✓ Python chargé\n" +
                        "✓ NumPy chargé\n" +
                        "✓ Matplotlib chargé\n" +
                        "✓ random chargé\n" +
                        "✓ math chargé\n\n" +
                        "Écris ton programme puis clique sur Exécuter.";
                }

                if (runButton) {
                    runButton.disabled = false;
                }

                console.log("PyLab : Python, NumPy, Matplotlib et Math sont prêts.");

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
       ZOOM DE L'ÉDITEUR
    ================================================= */

    function openZoom() {
        if (!zoomModal || !zoomContent || !editor) return;

        zoomContent.value = editor.value;
        zoomModal.classList.add("show");
        zoomModal.setAttribute("aria-hidden", "false");
        zoomContent.scrollTop = 0;
        zoomContent.focus();
        zoomContent.setSelectionRange(
            zoomContent.value.length,
            zoomContent.value.length
        );
    }

    function closeZoom() {
        if (!zoomModal || !zoomModal.classList.contains("show")) return;

        if (editor && zoomContent) editor.value = zoomContent.value;

        zoomModal.classList.remove("show");
        zoomModal.setAttribute("aria-hidden", "true");

        if (zoomOpenButton) zoomOpenButton.focus();
    }

    if (zoomContent && editor) {
        zoomContent.addEventListener("input", () => {
            editor.value = zoomContent.value;
        });
    }

    if (zoomOpenButton) zoomOpenButton.addEventListener("click", openZoom);
    if (zoomCloseButton) zoomCloseButton.addEventListener("click", closeZoom);
    if (zoomModalClose) zoomModalClose.addEventListener("click", closeZoom);

    if (zoomModal) {
        zoomModal.addEventListener("click", event => {
            if (event.target === zoomModal) closeZoom();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeZoom();
    });

    /* =================================================
       ZOOM DE LA CONSOLE
    ================================================= */

    function openConsoleZoom() {
        if (!consoleZoomModal || !consoleZoomContent || !output) return;

        consoleZoomContent.replaceChildren(
            ...Array.from(output.childNodes).map(node => node.cloneNode(true))
        );

        consoleZoomModal.classList.add("show");
        consoleZoomModal.setAttribute("aria-hidden", "false");
        consoleZoomContent.scrollTop = 0;
        consoleZoomContent.focus();
    }

    function closeConsoleZoom() {
        if (!consoleZoomModal || !consoleZoomModal.classList.contains("show")) return;

        consoleZoomModal.classList.remove("show");
        consoleZoomModal.setAttribute("aria-hidden", "true");

        if (consoleZoomOpenButton) consoleZoomOpenButton.focus();
    }

    if (consoleZoomOpenButton) {
        consoleZoomOpenButton.addEventListener("click", openConsoleZoom);
    }

    if (consoleZoomCloseButton) {
        consoleZoomCloseButton.addEventListener("click", closeConsoleZoom);
    }

    if (consoleZoomModalClose) {
        consoleZoomModalClose.addEventListener("click", closeConsoleZoom);
    }

    if (consoleZoomModal) {
        consoleZoomModal.addEventListener("click", event => {
            if (event.target === consoleZoomModal) closeConsoleZoom();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeConsoleZoom();
    });

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
                    "L'éditeur Python est vide.";
            }

            editor.focus();
            return;
        }

        const pythonFile = new Blob(
            [pythonCode],
            { type: "text/x-python;charset=utf-8" }
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
        exportButton.addEventListener("click", exportPythonScript);
    }

    /* =================================================
       IMPORTER UN SCRIPT PYTHON
    ================================================= */

    const IMPORT_TAILLE_MAX = 512 * 1024;

    function decoderTexte(buffer) {
        let texte;

        try {
            texte = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
        } catch (e) {
            texte = new TextDecoder("windows-1252").decode(buffer);
        }

        return texte.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    }

    async function importPythonScript(file) {
        if (!file || !editor) return;

        if (file.size > IMPORT_TAILLE_MAX) {
            if (output) {
                output.textContent =
                    "Impossible d'importer le script.\n\n" +
                    "Le fichier est trop volumineux (" +
                    Math.round(file.size / 1024) +
                    " Ko, maximum 512 Ko).";
            }
            return;
        }

        try {
            const code = decoderTexte(await file.arrayBuffer());

            if (!code.trim()) {
                if (output) {
                    output.textContent =
                        "Impossible d'importer le script.\n\n" +
                        "Le fichier « " + file.name + " » est vide.";
                }
                return;
            }

            editor.value = code;
            editor.scrollTop = 0;
            editor.focus();

            if (output) {
                output.textContent =
                    "✓ Script Python importé avec succès.\n\n" +
                    "Fichier : " + file.name + "\n\n" +
                    "Clique sur Exécuter pour le lancer.";
            }

        } catch (e) {
            console.warn("Import du script impossible :", e);

            if (output) {
                output.textContent =
                    "Impossible d'importer le script.\n\n" +
                    "Le fichier n'a pas pu être lu.";
            }
        }
    }

    if (importButton && importFile) {
        importButton.addEventListener("click", () => importFile.click());

        importFile.addEventListener("change", async () => {
            await importPythonScript(
                importFile.files && importFile.files[0]
            );

            importFile.value = "";
        });
    }

    /* =================================================
       DÉMARRAGE AUTOMATIQUE
    ================================================= */

    initPyodide();

});
/* =========================================================
   PYLAB
   INTERFACE UTILISATEUR + MOTEUR PYTHON (PYODIDE)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ÉLÉMENTS HTML
    ================================================= */

    const homeButton     = document.getElementById("homeButton");
    const pythonButton   = document.getElementById("pythonButton");
    const startButton    = document.getElementById("startButton");
    const homePage       = document.getElementById("home-message");
    const pythonPage     = document.getElementById("python-page");
    const clearButton    = document.getElementById("clear");
    const menuClear      = document.getElementById("menuClear");
    const editor         = document.getElementById("code");
    const output         = document.getElementById("output");
    const examplesButton = document.getElementById("examplesButton");
    const examplesMenu   = document.getElementById("examplesMenu");
    const runButton      = document.getElementById("run");
    const status         = document.getElementById("status");

    /* =================================================
       AFFICHER PYLAB
    ================================================= */

    function showPython() {
        homePage.classList.remove("active-page");
        pythonPage.classList.add("active-page");
        homeButton.classList.remove("active");
        pythonButton.classList.add("active");
    }

    /* =================================================
       AFFICHER ACCUEIL
    ================================================= */

    function showHome() {
        pythonPage.classList.remove("active-page");
        homePage.classList.add("active-page");
        pythonButton.classList.remove("active");
        homeButton.classList.add("active");
    }

    /* =================================================
       BOUTONS DE NAVIGATION
    ================================================= */

    homeButton.addEventListener("click", showHome);
    pythonButton.addEventListener("click", showPython);
    startButton.addEventListener("click", showPython);

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

    clearButton.addEventListener("click", clearProgram);

    menuClear.addEventListener("click", () => {
        showPython();
        clearProgram();
    });

    /* =================================================
       SOUS-MENU EXEMPLES
    ================================================= */

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

    /* =================================================
       PROGRAMMES D'EXEMPLE
       (indentation Python corrigée : les corps de boucle
       doivent être indentés, sinon Pyodide lève une
       IndentationError et l'exemple semble "ne pas marcher")
    ================================================= */

    const examples = {

        bonjour:
`print("Bonjour !")
print("Bienvenue dans PyLab !")`,

        boucle:
`for nombre in range(1, 11):
    print(nombre)`,

        calcul:
`nombre1 = 12
nombre2 = 8
somme = nombre1 + nombre2
print("Résultat :", somme)`

    };

    /* =================================================
       CHARGER UN EXEMPLE
    ================================================= */

    document.querySelectorAll("[data-example]").forEach(button => {
        button.addEventListener("click", () => {
            const exampleName = button.dataset.example;

            if (examples[exampleName]) {
                editor.value = examples[exampleName];
            }

            showPython();
            examplesMenu.classList.remove("show");
            editor.focus();
        });
    });

    /* =================================================
       RACCOURCI : CTRL + ENTRÉE
    ================================================= */

    editor.addEventListener("keydown", event => {
        if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault();

            if (runButton && !runButton.disabled) {
                runButton.click();
            }
        }
    });

    /* =================================================
       INITIALISATION DE PYODIDE

       C'est la pièce qui manquait au projet : sans elle,
       le bouton "Exécuter" restait désactivé pour toujours
       et le statut affichait indéfiniment
       "Chargement de Python...".
    ================================================= */

    let pyodideReady = null;

    function setStatus(text, state) {
        status.textContent = text;
        status.className = state; // "status-loading" | "status-ready" | "status-error"
    }

    async function initPyodide() {
        setStatus("Chargement de Python...", "status-loading");

        try {
            // loadPyodide() est fourni par ./pyodide/pyodide.js
            pyodideReady = await loadPyodide({ indexURL: "./pyodide/" });

            setStatus("Python prêt", "status-ready");
            output.textContent = "Python est prêt. Écris ton programme et clique sur Exécuter.";
            runButton.disabled = false;
        } catch (error) {
            setStatus("Erreur de chargement", "status-error");
            output.textContent =
                "Impossible de charger Python.\n" +
                "Vérifie que le dossier ./pyodide/ contient bien la distribution Pyodide " +
                "(pyodide.js, pyodide.asm.js, pyodide.asm.wasm, python_stdlib.zip...).\n\n" +
                "Détail : " + error;
        }
    }

    /* =================================================
       EXÉCUTER LE PROGRAMME
    ================================================= */

    async function runProgram() {
        if (!pyodideReady) {
            return;
        }

        runButton.disabled = true;
        output.textContent = "";

        // Redirige stdout / stderr de Python vers la console PyLab
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
                output.textContent = "Programme exécuté (aucune sortie).";
            }
        } catch (error) {
            // error contient déjà la trace Python (SyntaxError, NameError, etc.)
            output.textContent += "\n" + error;
        } finally {
            runButton.disabled = false;
        }
    }

    runButton.addEventListener("click", runProgram);

    initPyodide();

});

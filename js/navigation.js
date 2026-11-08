/* ==========================================================
   NAVIGATION.JS UNIVERSEL — js/navigation.js (RACINE du site)
   Point unique pour les plateformes laboratory (SciLab) et mathilab.

   Chaque tp-<domaine>/index.html le charge par ../../js/navigation.js.
   Les chemins du fragment (modules/<m>.html) et du contrôleur (js/<m>.js)
   sont résolus par rapport à la PAGE tp-<domaine>/index.html : ce fichier
   peut donc vivre n'importe où.

   Domaines :
     laboratory : tp-chimie, tp-acoustique, tp-optique, tp-electricite,
                  tp-mecanique, tp-thermique, tp-signaux
     mathilab   : tp-statistiques, tp-algebre, tp-geometrie, tp-algorithme
   ========================================================== */

const content = document.getElementById("content");

let isLoading = false;

/* ==========================================================
   DOMAINES ET MODULE PAR DÉFAUT
   ========================================================== */

const MODULES_PAR_DEFAUT = {
    // laboratory
    "tp-chimie":       "tp01-solutions",
    "tp-thermique":    "tp01-capteurs-temperature",
    "tp-electricite":  "tp01-puissance-energie",
    "tp-acoustique":   "tp01-caracteriser-un-son",
    "tp-optique":      "tp01-reflexion-refraction",
    "tp-mecanique":    "tp01-decrire-mouvement",
    "tp-signaux":      "tp01-onde-electromagnetique",
    // mathilab
    "tp-statistiques": "tp01-organiser-une-serie-statistique",
    "tp-algebre":      "td01-resolution-probleme-premier-degre",
    "tp-geometrie":    "td01-solides-aires-volumes",
    "tp-algorithme":   "td01-simuler-une-experience-aleatoire"
};

function getCurrentDomain() {
    const path = window.location.pathname;

    for (const domaine of Object.keys(MODULES_PAR_DEFAUT)) {
        if (path.includes("/" + domaine + "/")) {
            return domaine;
        }
    }

    // Repli : première page de la plateforme détectée dans l'URL.
    const repli = path.includes("/mathilab/") ? "tp-statistiques" : "tp-chimie";
    console.warn("Domaine non détecté, repli sur", repli);
    return repli;
}

function getDefaultModule(domaine) {
    return MODULES_PAR_DEFAUT[domaine] || MODULES_PAR_DEFAUT["tp-chimie"];
}

/* ==========================================================
   NAVIGATION
   ========================================================== */

function initNavigation() {
    document.querySelectorAll("nav button").forEach(btn => {
        btn.addEventListener("click", () => {
            const moduleName = btn.dataset.module;
            if (!moduleName || isLoading) {
                return;
            }
            loadModule(moduleName);
        });
    });
}

/* ==========================================================
   BOUTON ACTIF
   ========================================================== */

function setActiveButton(moduleName) {
    document.querySelectorAll("nav button").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.module === moduleName) {
            btn.classList.add("active");
        }
    });
}

/* ==========================================================
   CLEANUP
   ========================================================== */

function cleanupModule() {
    if (window.currentAnimationFrame) {
        cancelAnimationFrame(window.currentAnimationFrame);
        window.currentAnimationFrame = null;
    }

    if (window.currentInterval) {
        clearInterval(window.currentInterval);
        window.currentInterval = null;
    }
}

/* ==========================================================
   CHARGEMENT MODULE
   ========================================================== */

async function loadModule(moduleName) {
    if (isLoading) return;
    isLoading = true;
    cleanupModule();

    try {
        const domaine = getCurrentDomain();
        setActiveButton(moduleName);

        content.innerHTML = `
        <div class="card">
            Chargement...
        </div>
        `;

        /* =====================================
           CHEMINS (relatifs à la page du domaine)
           ===================================== */

        const htmlPath = new URL(`./modules/${moduleName}.html`, document.baseURI).href;
        const jsPath   = new URL(`./js/${moduleName}.js`, document.baseURI).href;

        console.log("Chargement module :", domaine, moduleName);
        console.log("HTML :", htmlPath);
        console.log("JS :", jsPath);

        /* =====================================
           HTML
           ===================================== */

        const response = await fetch(`${htmlPath}?v=${Date.now()}`);

        if (!response.ok) {
            throw new Error(`Module introuvable : ${htmlPath}`);
        }

        const html = await response.text();
        content.innerHTML = html;

        /* =====================================
           JS
           ===================================== */

        try {
            const module = await import(`${jsPath}?v=${Date.now()}`);
            if (typeof module.init === "function") {
                module.init();
                console.log("init() exécuté");
            }
        } catch (err) {
            console.error("Erreur JS module :", err);
        }

        saveProgress(domaine, moduleName);
        updateProgress();

        history.pushState(
            { moduleName },
            "",
            `#${moduleName}`
        );

    } catch (error) {
        console.error(error);
        content.innerHTML = `
        <div class="card">
            <h2>Erreur</h2>
            <p>${error.message}</p>
        </div>
        `;
    } finally {
        isLoading = false;
    }
}

/* ==========================================================
   SAUVEGARDE
   ========================================================== */

function saveProgress(domaine, moduleName) {
    localStorage.setItem(`laboratory_${domaine}`, moduleName);
}

/* ==========================================================
   BARRE DE PROGRESSION
   ========================================================== */

function updateProgress() {
    const bar = document.getElementById("bar");
    if (!bar) return;

    const buttons = document.querySelectorAll("nav button");
    const active = document.querySelector("nav button.active");

    if (!active || buttons.length === 0) {
        return;
    }

    let index = 1;
    buttons.forEach((btn, i) => {
        if (btn === active) {
            index = i + 1;
        }
    });

    bar.style.width = ((index / buttons.length) * 100) + "%";
}

/* ==========================================================
   BOUTON RETOUR
   ========================================================== */

window.addEventListener("popstate", () => {
    const moduleName = location.hash.replace("#", "");
    if (moduleName) {
        loadModule(moduleName);
    }
});

/* ==========================================================
   INITIALISATION
   ========================================================== */

window.addEventListener("DOMContentLoaded", () => {
    initNavigation();

    const domaine = getCurrentDomain();
    const saved = localStorage.getItem(`laboratory_${domaine}`);
    const hash = location.hash.replace("#", "");

    // Priorité : hash > localStorage > module par défaut
    if (hash) {
        loadModule(hash);
    } else if (saved) {
        loadModule(saved);
    } else {
        loadModule(getDefaultModule(domaine));
    }
});

/* ==========================================================
   NAVIGATION DEPUIS LES MODULES
   ========================================================== */

window.loadTP = function(moduleName) {
    loadModule(moduleName);
};

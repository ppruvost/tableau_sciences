/* ==========================================================
   NAVIGATION.JS UNIVERSEL
   Laboratory / MathiLab
   Compatible :
   tp-statistiques
   tp-algebre
   tp-geometrie
   tp-algorithme

   ========================================================== */

const content = document.getElementById("content");

let isLoading = false;

/* ==========================================================
   DOMAINE COURANT
   ========================================================== */

function getCurrentDomain() {
    const path = window.location.pathname;
    const domaines = [
        "tp-statistiques",
        "tp-algebre",
        "tp-geometrie",
        "tp-algorithme"
    ];

    for (const domaine of domaines) {
        if (path.includes("/" + domaine + "/")) {
            return domaine;
        }
    }

    console.warn("Domaine non détecté");
    return "tp-statistiques";
}

/* ==========================================================
   MODULE PAR DÉFAUT PAR DOMAINE
   ========================================================== */

function getDefaultModule(domaine) {
    const defaultModules = {        
        
        "tp-statistiques": "tp01-organiser-une-serie-statistique",
        "tp-algebre": "td01-resolution-probleme-premier-degre",
        "tp-geometrie": "tp01-",        
        "tp-algorithme": "td01-simuler-une-experience-aleatoire"
        
    };
    return defaultModules[domaine] || "tp01-organiser-une-serie-statistique"; // Fallback
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
           CHEMINS
           ===================================== */

        const htmlPath = `../${domaine}/modules/${moduleName}.html`;
        const jsPath = `../${domaine}/js/${moduleName}.js`;

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
        // Charger le module par défaut du domaine
        const defaultModule = getDefaultModule(domaine);
        loadModule(defaultModule);
    }
});

/* ==========================================================
   NAVIGATION DEPUIS LES MODULES
   ========================================================== */

window.loadTP = function(moduleName) {
    loadModule(moduleName);
};

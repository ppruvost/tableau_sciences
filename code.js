let frame1, frame2, frame3, img1;

/* =============================== */
/* REFRESH FRAMES */
/* =============================== */

function refreshFrames() {
    frame1 = document.getElementById("frame1");
    frame2 = document.getElementById("frame2");
    frame3 = document.getElementById("frame3");
    img1 = document.getElementById("img1");
}

/* =============================== */
/* HORLOGE */
/* =============================== */

function updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const date = now.toLocaleDateString('fr-FR');

    document.getElementById("clock").innerHTML =
        `<div>${h}:${m}</div><div>${date}</div>`;
}

setInterval(updateClock, 1000);

/* =============================== */
/* MENU (CORRIGÉ) */
/* =============================== */

function toggleMenu(menuId, btn) {
    const menu = document.getElementById(menuId);

    const isOpen = menu.classList.contains("show");

    // 🔴 Fermer TOUS les sous-menus
    document.querySelectorAll(".submenu").forEach(m => {
        m.classList.remove("show");
    });

    // 🔴 Reset tous les boutons
    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });

    // ✅ Si déjà ouvert → on ferme tout
    if (isOpen) return;

    // ✅ Sinon on ouvre celui-ci
    menu.classList.add("show");
    setActiveButton(btn);
}

/* 🔥 Clic extérieur = fermeture totale */
document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu-item")) {
        document.querySelectorAll(".submenu").forEach(m => {
            m.classList.remove("show");
        });

        document.querySelectorAll(".menu-item").forEach(item => {
            item.classList.remove("active");
        });
    }
});

/* ============================== */
/* GESTION COULEUR ORANGE MENU */
/* ============================== */

function setActiveButton(btn) {
    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });

    btn.classList.add("active");
}

/* =============================== */
/* LOAD CONTENU */
/* =============================== */

function loadInFrame(url) {
    refreshFrames();

    // 🔴 reset affichage
    img1.classList.add("hidden");
    frame1.classList.add("hidden");

    // ✅ image ou iframe
    if (url.match(/\.(png|jpg|jpeg|gif)$/i)) {
        img1.src = url;
        img1.classList.remove("hidden");
    } else {
        frame1.src = url;
        frame1.classList.remove("hidden");
    }
}

function loadURL(url) {
    loadInFrame(url);
}

/* =============================== */
/* MODES AFFICHAGE */
/* =============================== */

function modeFull() {
    const container = document.getElementById("content-container");

    container.classList.remove("split-mode");

    container.innerHTML = `
        <div id="section1" class="content-section">
            <iframe id="frame1"></iframe>
            <img id="img1" class="hidden"/>
        </div>
    `;

    refreshFrames();
}

function modeSplit() {
    const container = document.getElementById("content-container");

    container.classList.add("split-mode");

    container.innerHTML = `
        <!-- ✅ GAUCHE 70% (vide ou contenu principal) -->
        <div class="left-panel" id="leftPanel">
            <iframe id="frame1" class="panel-frame"></iframe>
            <img id="img1" class="hidden"/>
        </div>

        <!-- ✅ DROITE 30% -->
        <div class="right-panel">
            <iframe class="panel-frame" src="https://ppruvost.github.io/noise/"></iframe>
            <iframe class="panel-frame" src="https://ppruvost.github.io/Time-Timer/"></iframe>
        </div>
    `;

    refreshFrames();
}

/* =============================== */
/* INIT */
/* =============================== */

window.onload = () => {
    refreshFrames();
    modeFull();
    loadInFrame("LP MERMOZ - VIRE.png");
    updateClock();
};

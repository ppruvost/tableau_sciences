let mainFrame, leftFrame, noiseFrame, timerFrame;

/* ============================== */
/* INITIALISATION */
/* ============================== */
window.onload = () => {
    modeFull();
    updateClock();
};

/* ============================== */
/* CHARGEMENT IFRAME (CORRIGÉ) */
/* ============================== */
function loadInFrame(url) {
    const home = document.getElementById("home-message");
    const mainFrame = document.getElementById("main-frame");
    const leftFrame = document.getElementById("left-frame");

    if (home) home.style.display = "none";

    const isFullscreen = document.querySelector(".fullscreen-mode").style.display !== "none";

    if (isFullscreen) {
        mainFrame.style.display = "block";
        mainFrame.src = url;
    } else {
        leftFrame.src = url;
    }
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
/* MENU ACTIF */
/* =============================== */
function setActiveButton(btn) {
    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });
    btn.classList.add("active");
}

/* =============================== */
/* MENU TOGGLE */
/* =============================== */
function toggleMenu(menuId, btn) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains("show");

    // Ferme tous les autres menus
    document.querySelectorAll(".submenu").forEach(m => {
        if (m.id !== menuId) m.classList.remove("show");
    });

    document.querySelectorAll(".menu-item").forEach(item => {
        if (item !== btn) item.classList.remove("active");
    });

    // toggle propre
    if (isOpen) {
        menu.classList.remove("show");
        btn.classList.remove("active");
    } else {
        menu.classList.add("show");
        btn.classList.add("active");
    }
}
/* fermer si clic extérieur */
document.addEventListener("click", (e) => {
    const isInsideMenu = e.target.closest(".menu");
    const isSubmenu = e.target.closest(".submenu");

    if (!isInsideMenu && !isSubmenu) {
        document.querySelectorAll(".submenu").forEach(m => m.classList.remove("show"));
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
    }
});

/* =============================== */
/* MODE PLEIN ÉCRAN */
/* =============================== */
function modeFull() {
    document.querySelector(".fullscreen-mode").style.display = "flex";
    document.querySelector(".split-mode").style.display = "none";

    const home = document.getElementById("home-message");
    const frame = document.getElementById("main-frame");

    home.style.display = "block";
    frame.style.display = "none";
    frame.src = "";
}
/* =============================== */
/* MODE SPLIT */
/* =============================== */
function modeSplit() {
    document.querySelector(".fullscreen-mode").style.display = "none";
    document.querySelector(".split-mode").style.display = "flex";

    document.getElementById("left-frame").src = "";
}

/* =============================== */
/* (OPTION) RESET HOME */
/* =============================== */
function showHome() {
    const home = document.getElementById("home-message");
    const frame = document.getElementById("main-frame");

    home.style.display = "block";
    frame.style.display = "none";
    frame.src = "";
}

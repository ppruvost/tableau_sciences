let mainFrame, leftFrame, rightFrame, noiseFrame, timerFrame;

/* =============================== */
/* HORLOGE */
/* =============================== */
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const date = now.toLocaleDateString('fr-FR');
    document.getElementById("clock").innerHTML = `<div>${h}:${m}</div><div>${date}</div>`;
}
setInterval(updateClock, 1000);

/* =============================== */
/* ACTIVER UN BOUTON DU MENU */
/* =============================== */
function setActiveButton(btn) {
    // Désactive tous les boutons
    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });
    // Active le bouton cliqué
    btn.classList.add("active");
}

/* =============================== */
/* MENU (OUVERTURE/FERMETURE) */
/* =============================== */
function toggleMenu(menuId, btn) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains("show");

    // Fermer tous les sous-menus
    document.querySelectorAll(".submenu").forEach(m => m.classList.remove("show"));
    // Désactiver tous les boutons
    document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));

    if (!isOpen) {
        menu.classList.add("show");
        btn.classList.add("active");
    }
}

/* Fermer les menus si clic à l'extérieur */
document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu-item")) {
        document.querySelectorAll(".submenu").forEach(m => m.classList.remove("show"));
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
    }
});

/* =============================== */
/* CHARGEMENT DES FRAMES */
/* =============================== */
function loadInFrame(url) {
    const activeMode = document.querySelector(".fullscreen-mode").style.display !== "none" ? "fullscreen" : "split";

    if (activeMode === "fullscreen") {
        document.getElementById("main-frame").src = url;
    } else {
        document.getElementById("left-frame").src = url;
    }
}

/* =============================== */
/* MODES D'AFFICHAGE */
/* =============================== */
function modeFull() {
    document.querySelector(".fullscreen-mode").style.display = "block";
    document.querySelector(".split-mode").style.display = "none";
    loadInFrame("LP MERMOZ - VIRE.png"); // Exemple : image par défaut
}

function modeSplit() {
    document.querySelector(".fullscreen-mode").style.display = "none";
    document.querySelector(".split-mode").style.display = "flex";
    document.getElementById("left-frame").src = "LP MERMOZ - VIRE.png"; // Exemple
}

/* =============================== */
/* INITIALISATION */
/* =============================== */
window.onload = () => {
    modeFull(); // Démarre en mode plein écran
    updateClock();
};

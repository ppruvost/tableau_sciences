window.addEventListener("DOMContentLoaded", () => {

// =========================
// ETAT
// =========================
let isSingleColumn = false;

// =========================
// ELEMENTS
// =========================
const frame1 = document.getElementById("frame1");
const frame2 = document.getElementById("frame2");
const frame3 = document.getElementById("frame3");
const img1 = document.getElementById("img1");
const container = document.getElementById("content-container");

// =========================
// MENU CLICK (VERSION STABLE)
// =========================
document.querySelector(".menu").addEventListener("click", (e) => {

    const item = e.target.closest(".menu-item");
    if (!item) return;

    const action = item.dataset.action;
    if (!action) return;

    document.querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    handleAction(action);
});

// =========================
// ACTIONS MENU
// =========================
function handleAction(action) {

    switch(action) {

        case "img1":
            loadInFrame("LP MERMOZ - VIRE.png");
            return;

        case "noise":
            loadInFrame("https://ppruvost.github.io/noise/");
            return;

        case "timer":
            loadInFrame("https://ppruvost.github.io/Time-Timer/");
            return;

        case "roue":
            window.open("https://ppruvost.github.io/roue/", "_blank");
            return;

        case "collab":
            window.open(
                "https://formationenligne.onlyoffice.com/rooms/shared/filter?page=1&sortBy=DateAndTime&sortOrder=descending",
                "_blank"
            );
            return;

        case "basthon":
            window.open("https://console.basthon.fr/", "_blank");
            return;

        case "notion":
            window.open(
                "https://lp-mermoz.notion.site/Maths-Sciences-2ac3d9a0652d8001a27cc98c97fd21cb",
                "_blank"
            );
            return;

        case "labo":
            loadInFrame("https://ppruvost.github.io/laboratory/");
            return;

        case "calc":
            loadInFrame("https://www.numworks.com/fr/emulateur/graphique/");
            return;

        case "edu":
            window.open("https://www.l-educdenormandie.fr/", "_blank");
            return;

        case "geo":
            toggleSubmenu();
            return;

        case "layout":
            toggleLayout();
            return;
    }
}

// =========================
// HORLOGE
// =========================
function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const date = now.toLocaleDateString('fr-FR');

    clock.innerHTML = `${h}:${m}<br>${date}`;
}

setInterval(updateClock, 1000);
updateClock();

// =========================
// SUBMENU GEO
// =========================
window.toggleSubmenu = function () {
    const menu = document.getElementById("geoMenu");
    if (!menu) return;

    const open = menu.style.display === "flex";
    menu.style.display = open ? "none" : "flex";
};

// boutons submenu
document.querySelectorAll(".submenu button").forEach(btn => {
    btn.addEventListener("click", () => {
        const url = btn.dataset.url;
        if (url) loadInFrame(url);
    });
});

// =========================
// LOAD FRAME
// =========================
function loadInFrame(url, sectionIndex = 0) {

    const frames = [frame1, frame2, frame3];
    const frame = frames[sectionIndex];

    const img = sectionIndex === 0 ? img1 : null;

    if (!frame) return;

    if (img) img.classList.add("hidden");
    frame.classList.add("hidden");

    if (url.match(/\.(png|jpg|jpeg|gif)$/i)) {

        if (img) {
            img.src = url;
            img.classList.remove("hidden");
        }

    } else {
        frame.src = url;
        frame.classList.remove("hidden");
    }
}

// =========================
// LAYOUT
// =========================
window.toggleLayout = function () {

    const rightColumn = document.querySelector(".column-right");

    isSingleColumn = !isSingleColumn;

    if (isSingleColumn) {
        container.classList.remove("layout-3");
        rightColumn.style.display = "none";
    } else {
        container.classList.add("layout-3");
        rightColumn.style.display = "flex";
        initThreeColumns();
    }
};

// =========================
// INIT 3 COLONNES
// =========================
function initThreeColumns() {

    loadInFrame("LP MERMOZ - VIRE.png", 0);

    frame2.src = "https://ppruvost.github.io/noise/";
    frame3.src = "https://ppruvost.github.io/Time-Timer/";

    frame2.classList.remove("hidden");
    frame3.classList.remove("hidden");
    img1.classList.add("hidden");
}

// =========================
// START
// =========================
initThreeColumns();

});

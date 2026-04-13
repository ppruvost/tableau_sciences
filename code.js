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
const geoMenu = document.getElementById("geoMenu");

// =========================
// MENU CLICK (ULTRA STABLE)
// =========================
document.querySelector(".menu").addEventListener("click", (e) => {

    const item = e.target.closest(".menu-item");
    if (!item) return;

    const action = item.dataset.action;
    if (!action) return;

    // active state
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
            break;

        case "noise":
            loadInFrame("https://ppruvost.github.io/noise/");
            break;

        case "timer":
            loadInFrame("https://ppruvost.github.io/Time-Timer/");
            break;

        case "roue":
            loadInFrame("https://ppruvost.github.io/roue/");
            break;

        case "collab":
            loadInFrame("https://formationenligne.onlyoffice.com/rooms/shared/filter?page=1&sortBy=DateAndTime&sortOrder=descending");
            break;

        case "basthon":
            loadInFrame("https://console.basthon.fr/");
            break;

        case "notion":
            loadInFrame("https://lp-mermoz.notion.site/Maths-Sciences-2ac3d9a0652d8001a27cc98c97fd21cb");
            break;

        case "labo":
            loadInFrame("https://ppruvost.github.io/laboratory/");
            break;

        case "calc":
            loadInFrame("https://www.numworks.com/fr/emulateur/graphique/");
            break;

        case "edu":
            loadInFrame("https://www.l-educdenormandie.fr/");
            break;

        case "geo":
            toggleSubmenu();
            break;

        case "layout":
            toggleLayout();
            break;
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
// SUBMENU GEO (CORRIGÉ PROPRE)
// =========================
window.toggleSubmenu = function () {
    if (!geoMenu) return;

    geoMenu.classList.toggle("show");
};

// fermeture automatique si clic ailleurs
document.addEventListener("click", (e) => {

    const geoWrapper = document.querySelector(".geo-wrapper");
    if (!geoWrapper) return;

    if (!geoWrapper.contains(e.target)) {
        geoMenu?.classList.remove("show");
    }
});

// boutons submenu
document.querySelectorAll(".submenu button").forEach(btn => {
    btn.addEventListener("click", () => {

        const url = btn.dataset.url;

        if (url) {
            loadInFrame(url);
            geoMenu?.classList.remove("show");
        }
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
    frame.classList.remove("hidden");

    if (url.match(/\.(png|jpg|jpeg|gif)$/i)) {

        if (img) {
            img.src = url;
            img.classList.remove("hidden");
        }

        frame.src = "";

    } else {
        frame.src = url;
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
// INIT
// =========================
function initThreeColumns() {

    loadInFrame("LP MERMOZ - VIRE.png", 0);

    frame2.src = "https://ppruvost.github.io/noise/";
    frame3.src = "https://ppruvost.github.io/Time-Timer/";

    frame2.classList.remove("hidden");
    frame3.classList.remove("hidden");
    img1.classList.add("hidden");
}

// START
initThreeColumns();

});

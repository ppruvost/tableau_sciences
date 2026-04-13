
// =========================
// INIT GLOBAL (ATTEND HTML)
// =========================
window.addEventListener("DOMContentLoaded", () => {

// =========================
// ÉTAT
// =========================
let isSingleColumn = false;

// =========================
// RÉFÉRENCES
// =========================
const frame1 = document.getElementById("frame1");
const frame2 = document.getElementById("frame2");
const frame3 = document.getElementById("frame3");
const img1 = document.getElementById("img1");
const container = document.getElementById("content-container");

// =========================
// BOUTONS ACTIFS
// =========================
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

// =========================
// HORLOGE
// =========================
function updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const date = now.toLocaleDateString('fr-FR');

    document.getElementById("clock").innerHTML =
        h + ":" + m + "<br>" + date;
}

setInterval(updateClock, 1000);
updateClock();

// =========================
// SOUS MENU
// =========================
window.toggleSubmenu = function () {
    const menu = document.getElementById("geoMenu");
    const btn = document.getElementById("geoBtn");

    const open = menu.style.display === "flex";

    closeSubmenu();

    if (!open) {
        menu.style.display = "flex";
        btn.classList.add("active");
    }
}

function closeSubmenu() {
    const menu = document.getElementById("geoMenu");
    const btn = document.getElementById("geoBtn");

    if (menu) menu.style.display = "none";
    if (btn) btn.classList.remove("active");
}

// =========================
// CHARGEMENT CONTENU
// =========================
window.loadInFrame = function (url, sectionIndex = 0) {

    let frame = [frame1, frame2, frame3][sectionIndex];
    let img = sectionIndex === 0 ? img1 : null;

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

    closeSubmenu();
}

// =========================
// RACCOURCI URL
// =========================
window.loadURL = function (url) {
    loadInFrame(url, 0);
}

// =========================
// LABO
// =========================
window.loadLabo = function () {
    loadInFrame("https://ppruvost.github.io/laboratory/", 0);
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
}

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

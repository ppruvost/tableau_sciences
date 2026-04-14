// État affichage
let isSingleColumn = false;

// Références
const frame1 = document.getElementById("frame1");
const frame2 = document.getElementById("frame2");
const frame3 = document.getElementById("frame3");
const img1 = document.getElementById("img1");

/* =========================
   HORLOGE
========================= */
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

/* =========================
   SOUS MENU
========================= */
function toggleSubmenu() {
    const menu = document.getElementById("geoMenu");
    const btn = document.getElementById("geoBtn");

    const open = menu.style.display === "flex";

    menu.style.display = open ? "none" : "flex";
    btn.classList.toggle("active", !open);
}

/* =========================
   CHARGEMENT CONTENU
========================= */
function loadInFrame(url, sectionIndex = 0) {

    let frame = [frame1, frame2, frame3][sectionIndex];
    let img = sectionIndex === 0 ? img1 : null;

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

/* =========================
   RACCOURCI URL
========================= */
function loadURL(url) {
    loadInFrame(url, 0);
}

/* =========================
   FERMETURE MENU
========================= */
function closeSubmenu() {
    const menu = document.getElementById("geoMenu");
    const btn = document.getElementById("geoBtn");

    if (menu) menu.style.display = "none";
    if (btn) btn.classList.remove("active");
}

/* =========================
   LAYOUT
========================= */
function toggleLayout() {
    const col2 = frame2.parentElement;
    const col3 = frame3.parentElement;

    isSingleColumn = !isSingleColumn;

    if (isSingleColumn) {
        col2.style.display = "none";
        col3.style.display = "none";
    } else {
        col2.style.display = "block";
        col3.style.display = "block";
        initThreeColumns();
    }
}

/* =========================
   INIT 3 COLONNES
========================= */
function initThreeColumns() {
    loadInFrame("LP MERMOZ - VIRE.png", 0);

    frame2.src = "https://ppruvost.github.io/noise/";
    frame3.src = "https://ppruvost.github.io/Time-Timer/";

    frame2.classList.remove("hidden");
    frame3.classList.remove("hidden");
}

/* =========================
   INIT
========================= */
window.onload = () => {
    initThreeColumns();

    // =========================
    // BOUTON ACTIF (MENU ORANGE)
    // =========================
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });
};

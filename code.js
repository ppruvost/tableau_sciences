/* =========================
   ÉTAT
========================= */
let isSingleColumn = false;

/* =========================
   RÉFÉRENCES (IMPORTANT : LET)
========================= */
let frame1, frame2, frame3, img1;

/* =========================
   INIT RÉFÉRENCES
========================= */
function refreshFrames() {
    frame1 = document.getElementById("frame1");
    frame2 = document.getElementById("frame2");
    frame3 = document.getElementById("frame3");
    img1 = document.getElementById("img1");
}

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

/* =========================
   SOUS-MENUS
========================= */
function toggleMenu(menuId, btn) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains("open");

    document.querySelectorAll(".submenu").forEach(m => {
        m.classList.remove("open");
        m.style.display = "none";
    });

    document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));

    if (!isOpen) {
        menu.classList.add("open");
        menu.style.display = "flex";
        btn.classList.add("active");
    }
}

function closeAllMenus() {
    document.querySelectorAll(".submenu").forEach(m => {
        m.classList.remove("open");
        m.style.display = "none";
    });

    document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
}

/* =========================
   CHARGEMENT CONTENU
========================= */
function loadInFrame(url, sectionIndex = 0) {

    refreshFrames();

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

    closeAllMenus();
}

/* =========================
   RACCOURCI
========================= */
function loadURL(url) {
    loadInFrame(url, 0);
}

/* =========================
   LAYOUT NORMAL (3 COLONNES)
========================= */
function initThreeColumns() {
    refreshFrames();

    loadInFrame("LP MERMOZ - VIRE.png", 0);

    frame2.src = "https://ppruvost.github.io/noise/";
    frame3.src = "https://ppruvost.github.io/Time-Timer/";

    document.getElementById("section2").style.display = "flex";
    document.getElementById("section3").style.display = "flex";

    const section2 = document.getElementById("section2");
    section2.classList.remove("right-split");
}

/* =========================
   MODE PLEIN ÉCRAN
========================= */
function modeFull() {
    const container = document.getElementById("content-container");

    container.classList.add("full-mode");
    container.classList.remove("split-mode");

    document.getElementById("section2").style.display = "none";
    document.getElementById("section3").style.display = "none";

    closeAllMenus();
}

/* =========================
   MODE SPLIT 60 / 40 + 60 / 40
========================= */
function modeSplit() {
    refreshFrames();

    const container = document.getElementById("content-container");
    const section2 = document.getElementById("section2");
    const section3 = document.getElementById("section3");

    container.classList.add("split-mode");
    container.classList.remove("full-mode");

    section3.style.display = "none";
    section2.classList.add("right-split");

    section2.innerHTML = `
        <iframe id="frame2"></iframe>
        <iframe id="frame3"></iframe>
    `;

    refreshFrames();

    frame2.src = "https://ppruvost.github.io/noise/";
    frame3.src = "https://ppruvost.github.io/Time-Timer/";

    closeAllMenus();
}

/* =========================
   TOGGLE MODE SIMPLE (optionnel)
========================= */
function toggleLayout() {
    isSingleColumn = !isSingleColumn;

    if (isSingleColumn) {
        modeFull();
    } else {
        initThreeColumns();
    }
}

/* =========================
   INIT
========================= */
window.onload = () => {

    refreshFrames();
    modeFull(); // 🔥 plein écran par défaut
    loadInFrame("LP MERMOZ - VIRE.png", 0); // contenu initial
    updateClock();

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });
};

// État affichage
let isSingleColumn = false;

// Références (chargées une seule fois = rapide)
const frame1 = document.getElementById("frame1");
const frame2 = document.getElementById("frame2");
const frame3 = document.getElementById("frame3");

const img1 = document.getElementById("img1");

/* =========================
   CHARGEMENT CONTENU
========================= */
function loadInFrame(url, sectionIndex = 0) {

    let frame = [frame1, frame2, frame3][sectionIndex];
    let img = sectionIndex === 0 ? img1 : null;

    // Reset affichage
    if (img) img.classList.add("hidden");
    frame.classList.add("hidden");

    // Image
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

/* =========================
   RACCOURCI URL (menu)
========================= */
function loadURL(url) {
    loadInFrame(url, 0); // toujours colonne 1
}

/* =========================
   TOGGLE LAYOUT
========================= */
function toggleLayout() {
    const col2 = frame2.parentElement;
    const col3 = frame3.parentElement;

    isSingleColumn = !isSingleColumn;

    if (isSingleColumn) {
        // MODE 1 COLONNE
        col2.style.display = "none";
        col3.style.display = "none";
    } else {
        // MODE 3 COLONNES
        col2.style.display = "block";
        col3.style.display = "block";

        initThreeColumns();
    }
}

/* =========================
   INITIALISATION 3 COLONNES
========================= */
function initThreeColumns() {

    // Colonne 1 → QR code
    loadInFrame("LP MERMOZ - VIRE.png", 0);

    // Colonne 2 → Noise
    frame2.src = "https://ppruvost.github.io/noise/";
    frame2.classList.remove("hidden");

    // Colonne 3 → Timer
    frame3.src = "https://ppruvost.github.io/Time-Timer/";
    frame3.classList.remove("hidden");
}

/* =========================
   INIT AU CHARGEMENT
========================= */
window.onload = () => {
    initThreeColumns();
};

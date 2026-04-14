let frame1, frame2, frame3, img1;

function refreshFrames() {
    frame1 = document.getElementById("frame1");
    frame2 = document.getElementById("frame2");
    frame3 = document.getElementById("frame3");
    img1 = document.getElementById("img1");
}

/* HORLOGE FIX */
function updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const date = now.toLocaleDateString('fr-FR');

    document.getElementById("clock").innerHTML =
        `<div>${h}:${m}</div><div>${date}</div>`;
}

setInterval(updateClock, 1000);

/* MENU */
function toggleMenu(menuId, btn) {
    const menu = document.getElementById(menuId);

    document.querySelectorAll(".submenu").forEach(m => {
        m.style.display = "none";
    });

    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}

/* LOAD */
function loadInFrame(url) {
    refreshFrames();

    img1.classList.add("hidden");
    frame1.classList.add("hidden");

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

/* MODES */
function modeFull() {
    document.getElementById("content-container").classList.remove("split-mode");

    document.getElementById("section2").style.display = "none";
    document.getElementById("section3").style.display = "none";
}

function modeSplit() {
    const container = document.getElementById("content-container");
    container.classList.add("split-mode");

    const section2 = document.getElementById("section2");
    section2.style.display = "block";
    section2.classList.add("right-split");

    section2.innerHTML = `
        <iframe id="frame2"></iframe>
        <iframe id="frame3"></iframe>
    `;

    refreshFrames();

    frame2.src = "https://ppruvost.github.io/noise/";
    frame3.src = "https://ppruvost.github.io/Time-Timer/";
}

/* INIT */
window.onload = () => {
    refreshFrames();
    modeFull();
    loadInFrame("LP MERMOZ - VIRE.png");
    updateClock();
};

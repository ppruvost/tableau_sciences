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
    btn.classList.add("active");
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

/* =============================== */
/* INIT */
/* =============================== */

window.onload = () => {
    refreshFrames();
    modeFull();
    loadInFrame("LP MERMOZ - VIRE.png");
    updateClock();
};

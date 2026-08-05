// =====================================================
// NAVIGATION
// =====================================================
window.setActive = function (el) {
    document.querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));
    if (el) el.classList.add("active");
};

window.loadInFrame = function (url, element = null) {
    document.querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));
    document.getElementById("external-content")?.classList.add("active");
    const frame = document.getElementById("external-frame");
    if (frame) frame.src = url;
    if (element) window.setActive(element);
};

// =====================================================
// TP VIEWER
// =====================================================
const tpViewer    = document.getElementById("tpViewer");
const tpFrame     = document.getElementById("tpFrame");
const closeViewer = document.getElementById("closeViewer");

function openTP(url) {
    if (!tpViewer || !tpFrame) return;
    tpViewer.classList.remove("hidden");
    tpFrame.src = url;
}

closeViewer?.addEventListener("click", () => {
    tpViewer.classList.add("hidden");
    tpFrame.src = "";
});

document.getElementById("openStatistiques")?.addEventListener("click", () => openTP("tp-statistiques/index.html"));
document.getElementById("openAlgebre")  ?.addEventListener("click", () => openTP("tp-algebre/index.html"));
document.getElementById("openGeometrie")    ?.addEventListener("click", () => openTP("tp-geometrie/index.html"));
document.getElementById("openAlgorithme") ?.addEventListener("click", () => openTP("tp-algorithme/index.html"));

// =====================================================
// PROGRESS BAR
// =====================================================
let progress = 10;

window.updateProgress = function () {
    progress += 10;
    if (progress > 100) progress = 100;
    const bar = document.getElementById("bar");
    if (bar) bar.style.width = progress + "%";
};

console.log("MathiLab chargé avec succès");

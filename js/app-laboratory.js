import products     from "../laboratory/data/products.js";
import dangerDB     from "../laboratory/data/dangerDB.js";
import pictogrammes from "../laboratory/data/pictogrammes.js";

import { initPrintLabels } from "../laboratory/data/print-labels.js";

// equipment.js et glassware.js ne sont plus importés ici :
// ils sont chargés à la demande (import() dynamique) au premier clic sur l'onglet.

// =====================================================
// CONFIG
// =====================================================
// Les images de assets/img sont servies telles quelles (volumineuses pour
// l'instant) : elles ne sont téléchargées que lorsqu'elles deviennent visibles.
// Préchargement en arrière-plan des images des onglets : à passer à true
// seulement une fois les images allégées, sinon on télécharge tout pour rien
// (et on pénalise les connexions lentes).
const PRELOAD_IMAGES = false;

// =====================================================
// GLOBAL ACCESS (UI uniquement)
// =====================================================
window.products = products;

// =====================================================
// ÉTIQUETTES
// =====================================================
initPrintLabels(dangerDB, products);

// =====================================================
// OUTILS
// =====================================================
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;")
                                 .replace(/</g, "&lt;").replace(/>/g, "&gt;");

// <img> avec chargement différé, décodage asynchrone, priorité basse
// et dimensions réservées (évite les sauts de mise en page)
function imgTag(full, alt, style, width, height) {
    if (!full) return "";
    const dims = (width ? ` width="${width}"` : "") + (height ? ` height="${height}"` : "");
    return `<img src="${esc(full)}" alt="${esc(alt)}"
                 loading="lazy" decoding="async" fetchpriority="low"${dims} style="${style}">`;
}

// Image introuvable : on la masque
// (l'événement "error" ne remonte pas : écoute en phase de capture sur le tbody)
function onImgError(e) {
    if (e.target?.tagName === "IMG") e.target.style.display = "none";
}

["table-body", "equipment-body", "glassware-body"].forEach(id => {
    document.getElementById(id)?.addEventListener("error", onImgError, true);
});

const idle = cb => ("requestIdleCallback" in window)
    ? requestIdleCallback(cb, { timeout: 3000 })
    : setTimeout(cb, 1500);

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
// PRODUITS
// CAS | Nom | Formule | Localisation | Pictogrammes
//     | Dangers | Prévention | Visuel
// =====================================================
function renderProductTable(data) {

    const tbody = document.getElementById("table-body");
    if (!tbody) return;

    const rows = document.createDocumentFragment();

    data.forEach(p => {

        const tr = document.createElement("tr");

        // ── Pictogrammes GHS ──
        const pictoHTML = (p.pictogramme || p.pictogrammes || [])
            .map(file => {
                const picto = pictogrammes.find(px => px.image === file || px.code === file);
                const src = picto ? `assets/picto/${picto.image}` : `assets/picto/${file}`;
                return `<img src="${esc(src)}" alt="" title="${esc(file)}"
                             loading="lazy" decoding="async" width="32" height="32"
                             style="width:32px;height:32px;object-fit:contain;">`;
            })
            .join(" ");

        // ── Codes H (dangers) ──
        const dangersHTML = (p.dangers || [])
            .filter(code => /^H/i.test(code))
            .map(code => {
                const info = dangerDB.find(d => d.code === code);
                const label = info ? (info.text ?? info.texte ?? "") : "";
                return `<span class="badge-h" title="${esc(label)}"
                              style="color:#c0392b;font-weight:600;display:block;">${code}</span>`;
            })
            .join("");

        // ── Codes P (prévention) ──
        const preventionHTML = (p.prevention || [])
            .filter(code => /^P/i.test(code))
            .map(code => {
                const info = dangerDB.find(d => d.code === code);
                const label = info ? (info.text ?? info.texte ?? "") : "";
                return `<span class="badge-p" title="${esc(label)}"
                              style="color:#1B6CA8;font-weight:600;display:block;">${code}</span>`;
            })
            .join("");

        // ── Visuel produit ──
        const srcProduit = !p.image ? ""
            : (p.image.startsWith("http") || p.image.startsWith("/") || p.image.includes("/")
                ? p.image
                : `assets/img/${p.image}`);
        const visuelHTML = imgTag(
            srcProduit, p.nom,
            "width:48px;height:48px;object-fit:contain;border-radius:4px;", 48, 48
        );

        tr.innerHTML = `
            <td style="white-space:nowrap;">${p.cas || "—"}</td>
            <td>${p.nom || "—"}</td>
            <td style="font-family:monospace;">${p.formule || "—"}</td>
            <td>${p.localisation || "—"}</td>
            <td style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
                ${pictoHTML || "—"}
            </td>
            <td>${dangersHTML || "—"}</td>
            <td>${preventionHTML || "—"}</td>
            <td style="text-align:center;">${visuelHTML}</td>
        `;

        rows.appendChild(tr);
    });

    tbody.replaceChildren(rows);
}

// =====================================================
// ÉQUIPEMENTS
// =====================================================
function renderEquipmentTable(data) {

    const tbody = document.getElementById("equipment-body");
    if (!tbody) return;

    const rows = document.createDocumentFragment();

    data.forEach(eq => {

        const tr = document.createElement("tr");
        const full = !eq.image ? ""
            : eq.image.includes("/") ? eq.image : `assets/img/equipments/${eq.image}`;

        tr.innerHTML = `
            <td>${eq.domaine || "—"}</td>
            <td>${eq.nom || "—"}</td>
            <td>${eq.description || "—"}</td>
            <td>${eq.lieu || "—"}</td>
            <td>${imgTag(full, eq.nom || "equipments", "width:48px;height:48px;object-fit:contain;", 48, 48)}</td>
        `;

        rows.appendChild(tr);
    });

    tbody.replaceChildren(rows);
}

// =====================================================
// VERRERIE
// =====================================================
function renderGlasswareTable(data) {

    const tbody = document.getElementById("glassware-body");
    if (!tbody) return;

    const rows = document.createDocumentFragment();

    data.forEach(g => {

        const tr = document.createElement("tr");
        const full = !g.image ? ""
            : g.image.includes("/") ? g.image : `assets/img/glassware/${g.image}`;

        tr.innerHTML = `
            <td>${g.nom || "—"}</td>
            <td>${g.contenance_ml ? g.contenance_ml + " mL" : "—"}</td>
            <td>${g.lieu || "—"}</td>
            <td>${imgTag(full, g.nom || "verrerie", "width:48px;height:48px;object-fit:contain;", 48, 48)}</td>
        `;

        rows.appendChild(tr);
    });

    tbody.replaceChildren(rows);
}

// =====================================================
// CONSTRUCTION DES TABLEAUX À LA DEMANDE
// =====================================================
const renderers = {
    products: async () => renderProductTable(products),
    equipment: async () => {
        const { default: data } = await import("../laboratory/data/equipment.js");
        renderEquipmentTable(data);
    },
    glassware: async () => {
        const { default: data } = await import("../laboratory/data/glassware.js");
        renderGlasswareTable(data);
    }
};

const rendered = {};   // promesses : chaque tableau n'est construit qu'une fois

function ensureRendered(sectionId) {
    if (!renderers[sectionId]) return Promise.resolve();
    return rendered[sectionId] ??= renderers[sectionId]();
}

// On enveloppe showSection (défini dans index.html) pour construire
// le tableau au premier affichage de l'onglet.
const baseShowSection = window.showSection;
window.showSection = function (sectionId, element = null) {
    baseShowSection?.(sectionId, element);
    ensureRendered(sectionId);
};

// =====================================================
// PRÉCHARGEMENT EN TÂCHE DE FOND
// Une fois la page affichée et le navigateur inactif : construction des
// tableaux (léger : le texte seulement, les images restent différées).
// Si PRELOAD_IMAGES = true, téléchargement en plus des images par petits lots.
// =====================================================
function preloadImages(urls) {
    const queue = [...new Set(urls)];
    (function next() {
        idle(() => {
            queue.splice(0, 4).forEach(u => {
                const im = new Image();
                im.decoding = "async";
                im.src = u;
            });
            if (queue.length) next();
        });
    })();
}

window.addEventListener("load", () => {
    // Respecte le mode économie de données / connexion très lente
    const conn = navigator.connection;
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return;

    idle(async () => {
        await Promise.all(Object.keys(renderers).map(ensureRendered));
        if (!PRELOAD_IMAGES) return;
        const urls = [...document.querySelectorAll(
            "#table-body img, #equipment-body img, #glassware-body img"
        )].map(img => img.getAttribute("src")).filter(Boolean);
        preloadImages(urls);
    });
});

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

document.getElementById("openChimie")     ?.addEventListener("click", () => openTP("tp-chimie/index.html"));
document.getElementById("openAcoustique") ?.addEventListener("click", () => openTP("tp-acoustique/index.html"));
document.getElementById("openOptique")    ?.addEventListener("click", () => openTP("tp-optique/index.html"));
document.getElementById("openElectricite")?.addEventListener("click", () => openTP("tp-electricite/index.html"));
document.getElementById("openMecanique")  ?.addEventListener("click", () => openTP("tp-mecanique/index.html"));
document.getElementById("openThermique")  ?.addEventListener("click", () => openTP("tp-thermique/index.html"));
document.getElementById("openSignaux")    ?.addEventListener("click", () => openTP("tp-signaux/index.html"));

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

console.log("Laboratory chargé avec succès");
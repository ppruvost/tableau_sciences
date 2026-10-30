/**
 * tp02-ph-indicateurs.js
 * TP02 — pH et indicateurs colorés
 */

import { initZoomVisuels } from "../../js/zoom-visuel.js";
import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";
import FILIERES_PRO from "../../data/filieres.js";
import { initQuestionsParOnglet } from "./questions-par-onglet.js";
import { initImpressionCompteRendu } from "./compte-rendu-chimie.js";
import { bouton3D, initBoutons3D, afficherBouton3DProduit, nomSansParentheses } from "./molecule-3d.js";

import {
    initSections,
    initTabs,
    initModesOperatoires,
    appliquerFiltresCategorie,
    $
} from "../../js/utils.js";

import {
    afficherSecuriteProduit,
    trouverProduit
} from "../../js/securite.js";

import {
    initMateriel
} from "../../js/materiel.js";

import {
    initRadarCompetences
} from "../../js/radar.js";

import { initContextePro } from "../../js/contexte-pro.js";

import {
    dessinerGraphiqueLigne
} from "../../js/graphique.js";

import {
    initOngletsParFiliere
} from "../../js/onglets-filiere.js";

/* ==========================================================
   CONTEXTE PROFESSIONNEL — TP02 (pH et indicateurs colorés)
   Niveaux 2nde, 1ère (toutes filières) et Tle (MCC uniquement,
   cf. cadre bleu et référentiel : « Caractériser une solution
   acido-basique » n'est au programme qu'en Métiers de la couture
   et de la confection).
   ========================================================== */
const CONTEXTES_PRO = {
    "2nde-remi": {
        contexte: "L'efficacité d'un bain de décapage acide ou d'un bain de dégraissage alcalin dépend fortement de son pH. Un contrôle régulier permet de savoir quand le bain doit être renouvelé ou rééquilibré, avant qu'il ne perde son efficacité sur les pièces métalliques.",
        problematiques: {
            "indicateur": "Comment choisir et utiliser un indicateur coloré pour savoir si un bain de traitement de surface est acide, neutre ou basique ?",
            "papier-ph": "Comment mesurer le pH de un bain de traitement de surface avec un papier pH ou un pH-mètre, et quelle méthode est la plus adaptée en atelier ?",
            "titrage-colorimetrique": "Comment déterminer, par un titrage colorimétrique, la concentration en acide ou en base de un bain de traitement de surface ?",
            "acido-basique": "Comment exploiter la relation pH = −log[H₃O⁺] pour relier le pH de un bain de traitement de surface à sa concentration en ions H₃O⁺ ?"
        }
    },
    "2nde-mcc": {
        contexte: "La fixation d'un colorant sur une fibre textile dépend étroitement du pH du bain de teinture : certains colorants nécessitent un milieu acide, d'autres un milieu basique. Un mauvais réglage du pH conduit à une teinte irrégulière ou peu tenace.",
        problematiques: {
            "indicateur": "Comment choisir et utiliser un indicateur coloré pour savoir si un bain de teinture est acide, neutre ou basique ?",
            "papier-ph": "Comment mesurer le pH de un bain de teinture avec un papier pH ou un pH-mètre, et quelle méthode est la plus adaptée en atelier ?",
            "titrage-colorimetrique": "Comment déterminer, par un titrage colorimétrique, la concentration en acide ou en base de un bain de teinture ?",
            "acido-basique": "Comment exploiter la relation pH = −log[H₃O⁺] pour relier le pH de un bain de teinture à sa concentration en ions H₃O⁺ ?"
        }
    },
    "1ere-tci": {
        contexte: "Un bain de phosphatation utilisé avant peinture doit être maintenu dans une plage de pH précise : un pH trop élevé ralentit la réaction de conversion, un pH trop faible attaque excessivement le métal. Le suivi du pH fait partie du contrôle qualité de l'atelier.",
        problematiques: {
            "indicateur": "Comment choisir et utiliser un indicateur coloré pour savoir si un bain de phosphatation est acide, neutre ou basique ?",
            "papier-ph": "Comment mesurer le pH de un bain de phosphatation avec un papier pH ou un pH-mètre, et quelle méthode est la plus adaptée en atelier ?",
            "titrage-colorimetrique": "Comment déterminer, par un titrage colorimétrique, la concentration en acide ou en base de un bain de phosphatation ?",
            "acido-basique": "Comment exploiter la relation pH = −log[H₃O⁺] pour relier le pH de un bain de phosphatation à sa concentration en ions H₃O⁺ ?"
        }
    },
    "1ere-trpm": {
        contexte: "Un liquide de coupe utilisé en usinage voit son pH évoluer avec le temps : une dérive vers l'acidité favorise la prolifération bactérienne et la corrosion des pièces et de la machine. Le suivi du pH permet d'anticiper la vidange ou le rééquilibrage du bain.",
        problematiques: {
            "indicateur": "Comment choisir et utiliser un indicateur coloré pour savoir si un liquide de coupe est acide, neutre ou basique ?",
            "papier-ph": "Comment mesurer le pH de un liquide de coupe avec un papier pH ou un pH-mètre, et quelle méthode est la plus adaptée en atelier ?",
            "titrage-colorimetrique": "Comment déterminer, par un titrage colorimétrique, la concentration en acide ou en base de un liquide de coupe ?",
            "acido-basique": "Comment exploiter la relation pH = −log[H₃O⁺] pour relier le pH de un liquide de coupe à sa concentration en ions H₃O⁺ ?"
        }
    },
    "1ere-mcc": {
        contexte: "Le blanchiment ou l'apprêt d'un tissu se réalise dans un bain dont le pH conditionne la vitesse et la qualité du traitement. Les indicateurs colorés permettent un contrôle rapide en atelier, sans attendre les résultats d'une analyse en laboratoire externe.",
        problematiques: {
            "indicateur": "Comment choisir et utiliser un indicateur coloré pour savoir si un bain de traitement textile est acide, neutre ou basique ?",
            "papier-ph": "Comment mesurer le pH de un bain de traitement textile avec un papier pH ou un pH-mètre, et quelle méthode est la plus adaptée en atelier ?",
            "titrage-colorimetrique": "Comment déterminer, par un titrage colorimétrique, la concentration en acide ou en base de un bain de traitement textile ?",
            "acido-basique": "Comment exploiter la relation pH = −log[H₃O⁺] pour relier le pH de un bain de traitement textile à sa concentration en ions H₃O⁺ ?"
        }
    },
    "tle-mcc": {
        contexte: "Le laboratoire qualité d'un atelier textile ne se contente pas de mesurer le pH : il doit parfois recalculer la concentration en ions H₃O⁺ d'un bain à partir d'une mesure de pH (ou l'inverse), pour la comparer précisément aux préconisations d'une fiche technique exprimées en concentration.",
        problematiques: {
            "indicateur": "Comment choisir et utiliser un indicateur coloré pour savoir si un bain de traitement textile est acide, neutre ou basique ?",
            "papier-ph": "Comment mesurer le pH de un bain de traitement textile avec un papier pH ou un pH-mètre, et quelle méthode est la plus adaptée en atelier ?",
            "titrage-colorimetrique": "Comment déterminer, par un titrage colorimétrique, la concentration en acide ou en base de un bain de traitement textile ?",
            "acido-basique": "Comment exploiter la relation pH = −log[H₃O⁺] pour relier le pH de un bain de traitement textile à sa concentration en ions H₃O⁺ ?"
        }
    },
    "tle-tci": {
        contexte: "En Terminale, votre filière approfondit l'oxydoréduction (piles, corrosion, anode sacrificielle) plutôt que la relation pH / concentration en ions H₃O⁺.",
        problematique: "Ce contenu n'est pas évalué pour votre filière à ce niveau — voir le TP « Oxydoréduction »."
    },
    "tle-trpm": {
        contexte: "En Terminale, votre filière approfondit l'oxydoréduction (piles, corrosion, anode sacrificielle) plutôt que la relation pH / concentration en ions H₃O⁺.",
        problematique: "Ce contenu n'est pas évalué pour votre filière à ce niveau — voir le TP « Oxydoréduction »."
    }
};

/* ==========================================================
   DONNÉES LOCALES AU TP02 (chimie du pH, pas de la sécurité)
   ========================================================== */

// Plages de virage — information pédagogique propre au TP02,
// distincte des fiches de sécurité (dangerDB) gérées par securite.js.
const INDICATEURS_B27 = [
    {
        nom: "Hélianthine (orange de méthyle)",
        formule: "C₁₄H₁₄N₃NaO₃S",
        cas: "547-58-0",
        plageMin: 3.1,
        plageMax: 4.4,
        couleurAcide: "#D32F2F",
        nomAcide: "rouge",
        couleurBasique: "#FBC02D",
        nomBasique: "jaune"
    },
    {
        nom: "Rouge de méthyle",
        formule: "C₁₅H₁₅N₃O₂",
        cas: "493-52-7",
        plageMin: 4.4,
        plageMax: 6.2,
        couleurAcide: "#C62828",
        nomAcide: "rouge",
        couleurBasique: "#FDD835",
        nomBasique: "jaune"
    },
    {
        nom: "Bleu de bromothymol (BBT)",
        formule: "C₂₇H₂₈Br₂O₅S",
        cas: "76-59-5",
        plageMin: 6.0,
        plageMax: 7.6,
        couleurAcide: "#FDD835",
        nomAcide: "jaune",
        couleurBasique: "#1565C0",
        nomBasique: "bleu"
    },
    {
        nom: "Phénolphtaléine",
        formule: "C₂₀H₁₄O₄",
        cas: "77-09-8",
        plageMin: 8.2,
        plageMax: 10.0,
        couleurAcide: "#ECF0F1",
        nomAcide: "incolore",
        couleurBasique: "#D81B60",
        nomBasique: "rose fuchsia"
    }
];

// Papiers / bandelettes pH — extraits de data/equipment.js (catégorie
// "Indicateur"), pour ne pas dupliquer l'inventaire réel de la salle B27.
const PAPIERS_PH = (laboratoryEquipment || []).filter(item =>
    Array.isArray(item.categorie) &&
    item.categorie.includes("Indicateur") &&
    /papier|bandelette/i.test(item.nom || "")
);

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;

/* ==========================================================
   ROBUSTESSE — une étape en erreur n'empêche pas les suivantes
   (même principe que tp-electricite)
   ========================================================== */
function etape(nom, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`[tp-chimie] étape « ${nom} » en erreur :`, err);
    }
}

/* ==========================================================
   INITIALISATION TP02
   ========================================================== */
export function init() {

    // Le module reste en cache d'une navigation à l'autre : l'état est
    // remis à zéro à chaque affichage du TP (le fragment HTML est neuf).
    reactifCourant = null;

    etape("initZoomVisuels", () => initZoomVisuels());

    etape("initReactifSelect", () => initReactifSelect());
    etape("initSimulateurPH", () => initSimulateurPH());
    etape("initTabIndicateur", () => initTabIndicateur());
    etape("initTabPapierPH", () => initTabPapierPH());
    etape("initTabAcidoBasique", () => initTabAcidoBasique());

    etape("initMateriel", () => {
        initMateriel({
            verreId: "materiel-verrerie",
            equipementId: "materiel-equipements",
            glassware,
            equipment: laboratoryEquipment,
            categorie: "pHmétrie"
        });
    });

    etape("initContextePro", () => {
        initContextePro({
            filieres: FILIERES_PRO,
            contextes: CONTEXTES_PRO,
            afficherProblematique: false
        });
    });

    etape("initOngletsParFiliere", () => {
        initOngletsParFiliere({
            mapping: {
                "tle-mcc": ["indicateur", "papier-ph", "titrage-colorimetrique", "acido-basique"],
                "tle-tci": [],
                "tle-trpm": []
            },
            messageId: "tp02-message-filiere",
            messageTexte: "En Terminale, votre filière approfondit l'oxydoréduction plutôt que la relation pH / concentration en ions H₃O⁺ — voir le TP « Oxydoréduction »."
        });
    });

    etape("initSections", () => initSections());
    etape("initTabs", () => initTabs());
    etape("initModesOperatoires", () => initModesOperatoires());
    etape("initRadarCompetences", () => initRadarCompetences());

    etape("initQuestionsParOnglet", () => initQuestionsParOnglet());

    etape("initImpressionCompteRendu", () => {
        initImpressionCompteRendu({
            titre: "pH et indicateurs colorés",
            tp: "TP02",
            sectionsSupplementaires: sectionsCompteRendu
        });
    });
}


/* ==========================================================
   REACTIF + FILTRE SECURITE  (identique au pattern TP01)
   ========================================================== */
function initReactifSelect() {
    const select = $("reactif");
    if (!select) {
        console.warn("Select #reactif introuvable dans le DOM.");
        return;
    }

    function rafraichir() {
        appliquerFiltresCategorie(select, products, "filtre-cat");
        afficherSecurite();
    }

    document.querySelectorAll(".filtre-cat").forEach(cb => {
        cb.addEventListener("change", rafraichir);
    });

    select.addEventListener("change", afficherSecurite);

    rafraichir();
}

function afficherSecurite() {
    const cas = $("reactif")?.value;
    const produit = trouverProduit(products, cas);
    reactifCourant = produit;

    afficherSecuriteProduit({
        produit,
        dangerDB,
        pictogrammes,
        zoneId: "securite-bloc"
    });

    afficherBouton3DProduit(produit);
}

/* ==========================================================
   SIMULATEUR pH
   ========================================================== */
function interpolerCouleur(c1, c2, t) {
    const parse = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const [r1, g1, b1] = parse(c1), [r2, g2, b2] = parse(c2);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
}

function formatSci(val) {
    if (val === 0) return "0";
    const exp = Math.floor(Math.log10(val));
    const mant = (val / Math.pow(10, exp)).toFixed(2).replace(".", ",");
    const expTxt = String(exp).replace("-", "\u2212");
    return `${mant} × 10<sup class="exp10">${expTxt}</sup> mol/L`;
}

function majSimulateur(ph) {
    const affichage = $("affichage-ph");
    const curseur = $("curseur-ph");
    const h3oEl = $("concentration-h3o");
    const hoEl = $("concentration-ho");
    const natureEl = $("nature-solution");
    const cont = $("resultats-indicateurs");

    if (affichage) affichage.textContent = parseFloat(ph).toFixed(1);
    if (curseur) curseur.style.left = (ph / 14 * 100) + "%";

    const h3o = Math.pow(10, -ph);
    const ho = Math.pow(10, -(14 - ph));
    if (h3oEl) h3oEl.innerHTML = formatSci(h3o);
    if (hoEl) hoEl.innerHTML = formatSci(ho);

    if (natureEl) {
        natureEl.textContent = ph < 7 ? "⚡ acide" : ph > 7 ? "🔷 basique" : "⚖️ neutre";
    }

    if (cont) {
        cont.innerHTML = INDICATEURS_B27.map(ind => {
            let couleur, nom;
            if (ph < ind.plageMin) {
                couleur = ind.couleurAcide; nom = ind.nomAcide;
            } else if (ph > ind.plageMax) {
                couleur = ind.couleurBasique; nom = ind.nomBasique;
            } else {
                couleur = interpolerCouleur(ind.couleurAcide, ind.couleurBasique, .5);
                nom = "zone de virage";
            }
            const isIncolore = nom === "incolore";
            return `<div class="carte-indicateur">
        <div class="ind-nom">${ind.nom}</div>
        <div class="ind-couleur" style="background:${couleur};color:${isIncolore ? "#333" : "#fff"};border:${isIncolore ? "1px solid #ccc" : "none"}">${nom}</div>
        <div class="ind-plage">virage pH ${ind.plageMin}–${ind.plageMax}</div>
      </div>`;
        }).join("");
    }
}

function initSimulateurPH() {
    const slider = $("slider-ph");
    if (!slider) return;

    slider.addEventListener("input", () => majSimulateur(parseFloat(slider.value)));
    majSimulateur(parseFloat(slider.value) || 7);
}

/* ==========================================================
   ONGLET "Indicateur"  (tests qualitatifs)
   ========================================================== */
function rendreFicheIndicateur(ind) {
    if (!ind) return "<p>Sélectionner un indicateur pour afficher sa fiche.</p>";
    return `
    <p><strong>${ind.nom}</strong>${ind.formule ? ` — <span class="produit-formule">${ind.formule}</span>` : ""}</p>
    ${ind.cas ? `<p class="produit-cas" style="display:inline-block">${ind.cas}</p>` : ""}
    <div class="virage-indicateur">
      <div class="couleur-acide" style="background:${ind.couleurAcide}">${ind.nomAcide}</div>
      <div class="fleche-virage">→</div>
      <div class="couleur-basique" style="background:${ind.couleurBasique}">${ind.nomBasique}</div>
      <div class="plage">pH ${ind.plageMin} – ${ind.plageMax}</div>
    </div>
    <div class="molecule-3d-zone">${bouton3D(nomSansParentheses(ind.nom), { cas: ind.cas })}</div>
  `;
}

function initTabIndicateur() {
    const select = $("select-indicateur");
    const fiche = $("fiche-indicateur");
    if (!select || !fiche) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        INDICATEURS_B27.map(ind => `<option value="${ind.cas}">${ind.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const ind = INDICATEURS_B27.find(i => i.cas === select.value);
        fiche.innerHTML = rendreFicheIndicateur(ind);
        initBoutons3D(fiche);
    });
}

/* ==========================================================
   ONGLET "Papier pH"  (tests qualitatifs)
   ========================================================== */
function rendreFichePapier(papier) {
    if (!papier) return "<p>Sélectionner un papier pour afficher sa fiche.</p>";
    const horsPH = /acétate de plomb/i.test(papier.nom || "");
    return `
    <p><strong>${papier.nom}</strong></p>
    ${papier.description ? `<p>${papier.description}</p>` : ""}
    ${papier.lieu ? `<p class="produit-localisation">${papier.lieu}</p>` : ""}
    ${horsPH ? `<p class="warning">⚠️ Ce papier ne sert pas à mesurer un pH — réservé à un autre TP (identification d'ions).</p>` : ""}
  `;
}

function initTabPapierPH() {
    const select = $("select-papier");
    const fiche = $("fiche-papier");
    if (!select || !fiche) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        PAPIERS_PH.map((p, i) => `<option value="${i}">${p.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const papier = PAPIERS_PH[select.value];
        fiche.innerHTML = rendreFichePapier(papier);
    });
}

/* ==========================================================
   ONGLET "Solution acido-basique" (Tle — MCC)
   pH = -log[H3O+]  <=>  [H3O+] = 10^-pH
   ========================================================== */

function initTabAcidoBasique() {

    // Calculateur 1 : concentration -> pH
    const inputConcentration = $("ab-concentration");
    const outputPh = $("ab-ph-calcule");

    if (inputConcentration && outputPh) {
        inputConcentration.addEventListener("input", () => {
            const c = parseFloat(inputConcentration.value);
            if (Number.isNaN(c) || c <= 0) {
                outputPh.textContent = "—";
                return;
            }
            const ph = -Math.log10(c);
            outputPh.textContent = ph.toFixed(2);
        });
    }

    // Calculateur 2 : pH -> concentration
    const inputPh = $("ab-ph");
    const outputConcentration = $("ab-concentration-calculee");

    if (inputPh && outputConcentration) {
        inputPh.addEventListener("input", () => {
            const ph = parseFloat(inputPh.value);
            if (Number.isNaN(ph)) {
                outputConcentration.textContent = "—";
                return;
            }
            const c = Math.pow(10, -ph);
            outputConcentration.textContent = `${c.toExponential(2)} mol/L`;
        });
    }

    // Série de vérification (concentration connue, pH mesuré)
    const btnAjouter = $("ab-serie-ajouter");
    const inputSerieC = $("ab-serie-concentration");
    const inputSeriePh = $("ab-serie-ph-mesure");
    const tbody = $("tbody-acido-basique");
    const graphiqueId = "graphique-acido-basique";

    if (!btnAjouter || !inputSerieC || !inputSeriePh || !tbody) return;

    const points = [];

    btnAjouter.addEventListener("click", () => {

        const c = parseFloat(inputSerieC.value);
        const phMesure = parseFloat(inputSeriePh.value);

        if (Number.isNaN(c) || c <= 0 || Number.isNaN(phMesure)) return;

        const phTheo = -Math.log10(c);
        const ecart = phMesure - phTheo;

        points.push({ c, phTheo, phMesure, ecart });

        redessinerTableauAcidoBasique();
        dessinerGraphiqueLigne(
            graphiqueId,
            points.map(p => ({ x: -Math.log10(p.c), y: p.phMesure })),
            { xLabel: "-log[H₃O⁺] théorique", yLabel: "pH mesuré" }
        );

        inputSerieC.value = "";
        inputSeriePh.value = "";
        inputSerieC.focus();
    });

    function redessinerTableauAcidoBasique() {
        tbody.innerHTML = points.map((p, i) => {
            const signe = p.ecart >= 0 ? "+" : "";
            return `<tr>
                <td>${i + 1}</td>
                <td>${p.c.toExponential(2)}</td>
                <td>${p.phTheo.toFixed(2)}</td>
                <td>${p.phMesure.toFixed(2)}</td>
                <td>${signe}${p.ecart.toFixed(2)}</td>
            </tr>`;
        }).join("");
    }
}

/* ==========================================================
   QUESTIONS DU COMPTE-RENDU : voir questions-par-onglet.js
   (un bloc de 5 questions par onglet, 4 + problématique)
   ========================================================== */

/* ==========================================================
   COMPTE-RENDU — sections propres au TP (insérées avant les questions ;
   le contexte professionnel et les questions sont gérés par
   compte-rendu-chimie.js)
   ========================================================== */
function sectionsCompteRendu() {
    return [
        {
            titre: "Réactif de sécurité consulté",
            items: [
                { label: "Réactif", valeur: reactifCourant?.nom || "—" }
            ]
        }
    ];
}
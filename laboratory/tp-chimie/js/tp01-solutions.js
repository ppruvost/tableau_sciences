/**
 * tp01-solutions.js
 * TP01 — Dissolution - Dilution - Identification d'ions - Solutions commerciales
 */

import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";
import FILIERES_PRO from "../../data/filieres.js";

import {
    initSections,
    initTabs,
    lireTexte,
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

import {
    genererCompteRendu
} from "../../js/compte-rendu.js";

import {
    initContextePro,
    getFiliereSelectionnee
} from "../../js/contexte-pro.js";

/* ==========================================================
   CONTEXTE PROFESSIONNEL — TP01 (Dissolution / Dilution /
   Identification d'ions)
   Propre à ce TP : niveaux 2nde, 1ère et Tle (cf. cadre bleu ; la Tle
   ne travaille que l'activité « solutions-commerciales »).
   Une problématique par activité (onglet de manipulation) : le
   rappel affiché en fin de chaque bloc de questions est sélectionné
   automatiquement selon l'attribut data-activite du rappel
   (cf. js/contexte-pro.js).
   ========================================================== */
const CONTEXTES_PRO_TP01 = {
    "2nde-remi": {
        contexte: "Avant l'assemblage de tôles par soudage, les ateliers de réalisation d'ensembles mécaniques utilisent des bains de dégraissage et de décapage pour préparer les surfaces métalliques. Ces bains sont livrés sous forme de concentrés qu'il faut diluer avec précision selon les préconisations du fabricant pour garantir leur efficacité sans gaspillage de produit. Après traitement, l'eau de rinçage doit elle aussi être contrôlée avant d'être évacuée, afin de vérifier qu'elle ne contient plus d'ions métalliques issus du bain.",
        problematiques: {
            "dissolution-dilution": "Comment préparer, à partir d'un concentré de dégraissant industriel, un bain de traitement de surface à la concentration exacte préconisée par le fabricant ?",
            "identification-ions": "Comment vérifier, par des tests de précipitation, qu'une eau de rinçage ne contient plus d'ions métalliques (fer, cuivre) issus du bain de traitement de surface avant son évacuation ?"
        }
    },
    "2nde-mcc": {
        contexte: "Dans un atelier de confection, la teinture d'un tissu nécessite de préparer un bain à partir d'une solution mère de colorant et de sels auxiliaires. La qualité de la teinte (uniformité, tenue) dépend directement du respect de la concentration prescrite par la fiche technique du fournisseur. Une fois la teinture terminée, le bain usé doit être contrôlé avant son traitement, notamment pour vérifier la présence d'ions métalliques utilisés comme fixateurs de colorant.",
        problematiques: {
            "dissolution-dilution": "Comment déterminer la masse de colorant à peser et le volume d'eau à utiliser pour obtenir un bain de teinture à la concentration voulue ?",
            "identification-ions": "Comment identifier, par des tests de précipitation, la présence d'ions métalliques dans un bain de teinture usagé avant son évacuation ?"
        }
    },
    "1ere-tci": {
        contexte: "En chaudronnerie industrielle, certaines pièces métalliques subissent un traitement de conversion chimique (phosphatation, passivation) avant peinture, afin d'améliorer l'adhérence du revêtement et la résistance à la corrosion. Ces bains doivent être préparés à une concentration précise en quantité de matière, et l'eau de rinçage qui suit le traitement doit être contrôlée avant rejet dans le réseau d'assainissement.",
        problematiques: {
            "dissolution-dilution": "Comment préparer, par dissolution ou dilution, un bain de traitement de surface dont la concentration en quantité de matière est imposée par le référentiel qualité de l'entreprise ?",
            "identification-ions": "Comment vérifier, par des tests de précipitation, la présence d'ions métalliques (fer, zinc) dans l'eau de rinçage d'un bain de phosphatation avant son rejet ?"
        }
    },
    "1ere-trpm": {
        contexte: "Sur un centre d'usinage, le liquide de coupe utilisé pour refroidir et lubrifier l'outil est un concentré dilué dans l'eau. Une concentration trop faible favorise la corrosion des outillages et de la pièce ; une concentration trop forte gaspille le produit et peut irriter la peau de l'opérateur. La qualité de l'eau utilisée pour préparer le liquide de coupe (présence d'ions indésirables) influence elle aussi sa stabilité et sa durée de vie.",
        problematiques: {
            "dissolution-dilution": "Comment vérifier et ajuster, par dilution, la concentration du liquide de coupe utilisé sur le centre d'usinage afin de respecter la plage préconisée par le fabricant ?",
            "identification-ions": "Comment identifier, par des tests de précipitation, les ions présents dans l'eau utilisée pour préparer le liquide de coupe, afin de vérifier sa compatibilité avec le concentré ?"
        }
    },
    "1ere-mcc": {
        contexte: "Lors du traitement d'un tissu technique (apprêt, imperméabilisation), l'atelier prépare un bain à partir d'un concentré dont la fiche technique donne la concentration en quantité de matière à respecter pour garantir la tenue du traitement dans le temps. L'eau de rinçage issue de cette étape doit ensuite être contrôlée avant son évacuation.",
        problematiques: {
            "dissolution-dilution": "Comment calculer le volume de concentré à prélever et le compléter avec de l'eau pour obtenir un bain d'apprêt à la concentration en quantité de matière prescrite ?",
            "identification-ions": "Comment vérifier, par des tests de précipitation, qu'une eau de rinçage textile ne contient plus les ions métalliques utilisés lors du traitement avant son évacuation ?"
        }
    },
    "tle-tci": {
        contexte: "En chaudronnerie industrielle, les bains de décapage et de neutralisation des pièces sont préparés à partir d'acides et de bases commerciaux (acide chlorhydrique à 23 %, solutions de soude) dont la concentration est indiquée en pourcentage massique ou en g·L⁻¹. Le technicien doit convertir ces indications en concentration molaire et calculer le volume de concentré à prélever, en veillant à la sécurité (hotte, acide versé dans l'eau) et au traitement des solutions non utilisées avant rejet.",
        problematiques: {
            "solutions-commerciales": "Comment déterminer, à partir de l'étiquette d'un acide ou d'une base commerciale, le volume à prélever pour préparer un bain de décapage ou de neutralisation à une concentration de 0,1 mol·L⁻¹, en limitant l'incertitude et les risques ?"
        }
    },
    "tle-trpm": {
        contexte: "En atelier d'usinage et de maintenance des outillages, des solutions acides ou basiques diluées servent au nettoyage, au décapage ou au contrôle du pH des bains et liquides de coupe. Elles sont préparées à partir de produits du commerce (acide chlorhydrique, vinaigre blanc, soude) : la concentration réelle dépend du titre massique et de la masse volumique du produit, et doit être vérifiée avant usage.",
        problematiques: {
            "solutions-commerciales": "Comment préparer, à partir d'un produit du commerce, une solution de nettoyage ou de décapage de concentration voisine de 0,1 mol·L⁻¹ et vérifier sa concentration réelle ?"
        }
    },
    "tle-mcc": {
        contexte: "Dans les ateliers de confection et de traitement des textiles, le vinaigre blanc (acide éthanoïque à 9,5°) est utilisé pour fixer une teinture ou neutraliser un bain basique, et des solutions de soude servent à l'avivage ou au dégraissage. Ces produits du commerce sont dilués : leur concentration molaire se déduit du titre massique et de la masse volumique, et la solution doit être préparée avec le matériel adapté au volume prélevé.",
        problematiques: {
            "solutions-commerciales": "Comment calculer le volume de vinaigre blanc ou de soude commerciale à prélever pour préparer un bain de traitement textile à la concentration prescrite ?"
        }
    }
};

/* ==========================================================
   DONNEES LOCALES — identification d'ions par précipitation
   (tests préliminaires puis analyse d'échantillons inconnus,
   dans un contexte de contrôle d'eaux de rinçage industrielles)
   ========================================================== */

const REACTIFS_IONS = [
    { id: "ag", nom: "nitrate d'argent", formule: "Ag⁺ + NO₃⁻" },
    { id: "ba", nom: "chlorure de baryum", formule: "Ba²⁺ + 2 Cl⁻" },
    { id: "oh", nom: "soude (hydroxyde de sodium)", formule: "Na⁺ + HO⁻" },
    { id: "ox", nom: "oxalate d'ammonium", formule: "2 NH₄⁺ + C₂O₄²⁻" }
];

const IONS = [
    { id: "cl",  nom: "ion chlorure",     symbole: "Cl⁻",  reactif: "ag", couleur: "blanc",  formule: "AgCl" },
    { id: "so4", nom: "ion sulfate",      symbole: "SO₄²⁻", reactif: "ba", couleur: "blanc",  formule: "BaSO₄" },
    { id: "cu2", nom: "ion cuivre (II)",  symbole: "Cu²⁺", reactif: "oh", couleur: "bleu",   formule: "Cu(OH)₂" },
    { id: "fe2", nom: "ion fer (II)",     symbole: "Fe²⁺", reactif: "oh", couleur: "vert",   formule: "Fe(OH)₂" },
    { id: "fe3", nom: "ion fer (III)",    symbole: "Fe³⁺", reactif: "oh", couleur: "orange", formule: "Fe(OH)₃" },
    { id: "ca2", nom: "ion calcium (II)", symbole: "Ca²⁺", reactif: "ox", couleur: "blanc",  formule: "CaC₂O₄" }
];

const ECHANTILLONS_IONS = [
    { id: "s1", nom: "S₁ — sulfate de fer (II)",           ions: ["fe2", "so4"] },
    { id: "s2", nom: "S₂ — chlorure de fer (III)",         ions: ["fe3", "cl"] },
    { id: "s3", nom: "S₃ — chlorure de sodium",            ions: ["cl"] },
    { id: "s4", nom: "S₄ — sulfate de zinc",                ions: ["so4"] },
    { id: "s5", nom: "S₅ — sulfate de cuivre",              ions: ["cu2", "so4"] },
    { id: "s6", nom: "S₆ — chlorure de calcium",            ions: ["ca2", "cl"] },
    { id: "eau-a",  nom: "Échantillon A — eau de rinçage en sortie de bain de traitement", ions: ["cl"] },
    { id: "eau-b",  nom: "Échantillon B — eau prélevée en sortie d'un autre poste de traitement", ions: ["so4", "fe2"] },
    { id: "eau-c",  nom: "Échantillon C — eau utilisée pour préparer le liquide de coupe", ions: ["ca2", "cl"] }
];

/* ==========================================================
   SERIE DE DILUTIONS PAR 2 (D0 à D5) — complément onglet Dilution
   D0 = concentration de la solution mère saisie par l'élève ;
   D1 à D5 sont calculés automatiquement (Cn = C0 / 2^n) et
   affichés en lecture seule.
   ========================================================== */
const IDS_SERIE_DILUTION = ["dil-serie-d0", "dil-serie-d1", "dil-serie-d2", "dil-serie-d3", "dil-serie-d4", "dil-serie-d5"];

function calculerSerieDilution() {
    const champ0 = $("dil-serie-d0");
    if (!champ0) return;

    const c0 = parseFloat(champ0.value);

    for (let n = 1; n <= 5; n++) {
        const champ = $(`dil-serie-d${n}`);
        if (!champ) continue;

        if (!Number.isFinite(c0) || c0 <= 0) {
            champ.value = "";
            continue;
        }

        const cn = c0 / Math.pow(2, n);
        champ.value = cn.toFixed(4);
    }
}

function initSerieDilution() {
    const champ0 = $("dil-serie-d0");
    if (!champ0) return;

    // D1 à D5 sont calculés automatiquement : lecture seule.
    for (let n = 1; n <= 5; n++) {
        const champ = $(`dil-serie-d${n}`);
        if (champ) champ.readOnly = true;
    }

    champ0.addEventListener("input", calculerSerieDilution);
    calculerSerieDilution();
}

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;

/* ==========================================================
   INITIALISATION TP01
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP01 — Initialisation des calculs de dissolution et dilution.");

    initSections();
    initTabs();
    initContextePro({
        filieres: FILIERES_PRO,
        contextes: CONTEXTES_PRO_TP01
    });
    initReactifSelect();
    initCalculsDissolution();
    initCalculsDilution();
    initSerieDilution();
    initTabIdentificationIons();
    initTabSolutionsCommerciales();
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Dissolution"
    });
    initQuestionsParOnglet();
    initBoutonImpressionCR();
    initRadarCompetences();
    initBalanceErreurs();
}

/* ==========================================================
   REACTIF + FILTRE SECURITE
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

    select.addEventListener("change", () => {
        afficherSecurite();
        updateDissolutionInfo();
    });

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
}

/* ==========================================================
   DISSOLUTION : MISE À JOUR DES INFORMATIONS
   ========================================================== */
function updateDissolutionInfo() {
    const cas = $("reactif")?.value;
    const produit = trouverProduit(products, cas);

    const nomReactifSpan = $("nom-reactif-selectionne");
    const formuleReactifSpan = $("formule-reactif-selectionne");
    const masseMolaireSpan = $("masse-molaire-reactif-selectionne");
    const mDissolutionInput = $("m-dissolution");
    const resDissolutionDiv = $("res-dissolution");

    if (!produit) {
        if (nomReactifSpan) nomReactifSpan.textContent = '-';
        if (formuleReactifSpan) formuleReactifSpan.textContent = '-';
        if (masseMolaireSpan) masseMolaireSpan.textContent = '-';
        if (mDissolutionInput) mDissolutionInput.value = '';
        if (resDissolutionDiv) resDissolutionDiv.textContent = 'Sélectionner un réactif.';
        return;
    }

    // Mettre à jour les informations du produit
    if (nomReactifSpan) nomReactifSpan.textContent = produit.nom || '-';
    if (formuleReactifSpan) formuleReactifSpan.textContent = produit.formule || '-';
    if (masseMolaireSpan) masseMolaireSpan.textContent = (produit.masseMolaire || 0).toFixed(2);
    if (mDissolutionInput) mDissolutionInput.value = (produit.masseMolaire || 0).toFixed(2);

    // Recalculer la masse à peser
    calculDissolution();
}

/* ==========================================================
   DISSOLUTION : CALCUL DE LA MASSE À PESER
   ========================================================== */
function calculDissolution() {
    const c = lireNombre($("c-dissolution"));
    const v = lireNombre($("v-dissolution"));
    const m = lireNombre($("m-dissolution"));
    const resDissolution = $("res-dissolution");

    if (!resDissolution) return;

    if (!$("reactif")?.value || c <= 0 || v <= 0 || m <= 0) {
        resDissolution.value = "";
        return;
    }

    const vL = v / 1000;
    const masse = c * vL * m;

    resDissolution.value = masse.toFixed(4);

}

/* ==========================================================
   INITIALISATION DES ÉCOUTEURS POUR LA DISSOLUTION
   ========================================================== */
function initCalculsDissolution() {
    $("c-dissolution")?.addEventListener("input", calculDissolution);
    $("v-dissolution")?.addEventListener("input", calculDissolution);
    // Écouter aussi les changements de masse molaire (au cas où)
    $("m-dissolution")?.addEventListener("input", calculDissolution);
}

/* ==========================================================
   DILUTION : CALCUL DU VOLUME À PRÉLEVER
   ========================================================== */
function calculDilution() {
    const c1 = parseFloat($("c1-hcl")?.value) || 0;
    const c2 = parseFloat($("c2-hcl")?.value) || 0;
    const v2 = parseFloat($("v2-hcl")?.value) || 0;
    const resDilutionDiv = $("res-hcl");

    if (!resDilutionDiv) return;

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {
        resDilutionDiv.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    // Calculer V1 = (C2 × V2) / C1
    const v1 = (c2 * v2) / c1;
    resDilutionDiv.textContent = `Volume à prélever : ${v1.toFixed(2)} mL`;
}

/* ==========================================================
   INITIALISATION DES ÉCOUTEURS POUR LA DILUTION
   ========================================================== */
function initCalculsDilution() {
    $("c1-hcl")?.addEventListener("input", calculDilution);
    $("c2-hcl")?.addEventListener("input", calculDilution);
    $("v2-hcl")?.addEventListener("input", calculDilution);
}

/* ==========================================================
   ANALYSE DES ERREURS DE PESÉE
   ========================================================== */
function initBalanceErreurs() {
    // Écouter les changements dans les champs de pesée
    const inputs = [
        "pe-masse-theo",
        "pe-lue-01",
        "pe-lue-1g"
    ];

    inputs.forEach(id => {
        $(id)?.addEventListener("input", calculerErreursPesee);
    });

    // Initialiser les calculs
    calculerErreursPesee();
    calculDissolution();
}

function evaluerQualitePesee(erreurRelative) {
    if (erreurRelative === null || Number.isNaN(erreurRelative)) return "—";
    if (erreurRelative <= 2) return "Excellente précision";
    if (erreurRelative <= 5) return "Bonne précision";
    if (erreurRelative <= 10) return "Précision acceptable";
    return "Précision insuffisante";
}

function calculerErreursPesee() {
    const theo = Number($("pe-masse-theo")?.value) || 0;
    const lue01 = Number($("pe-lue-01")?.value) || 0;
    const lue1g = Number($("pe-lue-1g")?.value) || 0;

    const res01 = $("res-01");
    const res1g = $("res-1g");
    const synth = $("synthese-balances");

    if (theo <= 0) {
        if (res01) res01.textContent = "Saisir la masse théorique attendue.";
        if (res1g) res1g.textContent = "Saisir la masse théorique attendue.";
        if (synth) synth.classList.add("hidden");
        return;
    }

    let abs01 = null, rel01 = null;
    let abs1g = null, rel1g = null;

    if (lue01 > 0) {
        abs01 = Math.abs(lue01 - theo);
        rel01 = (abs01 / theo) * 100;
        if (res01) res01.textContent = `Écart : ${abs01.toFixed(3)} g (${rel01.toFixed(1)} %) — ${evaluerQualitePesee(rel01)}`;
    } else if (res01) {
        res01.textContent = "Saisir la masse mesurée.";
    }

    if (lue1g > 0) {
        abs1g = Math.abs(lue1g - theo);
        rel1g = (abs1g / theo) * 100;
        if (res1g) res1g.textContent = `Écart : ${abs1g.toFixed(3)} g (${rel1g.toFixed(1)} %) — ${evaluerQualitePesee(rel1g)}`;
    } else if (res1g) {
        res1g.textContent = "Saisir la masse mesurée.";
    }

    if (synth && (lue01 > 0 || lue1g > 0)) {
        synth.classList.remove("hidden");
        if ($("syn-lue-01")) $("syn-lue-01").textContent = lue01 > 0 ? `${lue01.toFixed(1)} g` : "—";
        if ($("syn-lue-1g")) $("syn-lue-1g").textContent = lue1g > 0 ? `${lue1g.toFixed(0)} g` : "—";
        if ($("syn-abs-01")) $("syn-abs-01").textContent = abs01 !== null ? `${abs01.toFixed(3)} g` : "—";
        if ($("syn-abs-1g")) $("syn-abs-1g").textContent = abs1g !== null ? `${abs1g.toFixed(3)} g` : "—";
        if ($("syn-rel-01")) $("syn-rel-01").textContent = rel01 !== null ? `${rel01.toFixed(1)} %` : "—";
        if ($("syn-rel-1g")) $("syn-rel-1g").textContent = rel1g !== null ? `${rel1g.toFixed(1)} %` : "—";
        if ($("syn-qual-01")) $("syn-qual-01").textContent = evaluerQualitePesee(rel01);
        if ($("syn-qual-1g")) $("syn-qual-1g").textContent = evaluerQualitePesee(rel1g);
    } else if (synth) {
        synth.classList.add("hidden");
    }
}

/* Lecture tolérante d'un champ numérique (accepte la virgule décimale) */
function lireNombre(el) {
    if (!el) return 0;
    const n = parseFloat(String(el.value ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
}

/* Formatage à la française (virgule décimale) */
function formaterNombre(valeur, decimales) {
    return Number(valeur).toFixed(decimales).replace(".", ",");
}

/* ==========================================================
   ONGLET "Identification d'ions" (contrôle qualité d'une eau)
   ========================================================== */

function initTableauRecapIons() {
    const tbody = $("tbody-recap-ions");
    if (!tbody) return;

    tbody.innerHTML = IONS.map(ion => {
        const reactif = REACTIFS_IONS.find(r => r.id === ion.reactif);
        return `<tr><td>${ion.nom} (${ion.symbole})</td><td>${reactif.nom}</td><td>${ion.couleur}</td></tr>`;
    }).join("");
}

function calculerTestIon(idEchantillon, idReactif) {
    const echantillon = ECHANTILLONS_IONS.find(e => e.id === idEchantillon);
    const reactif = REACTIFS_IONS.find(r => r.id === idReactif);
    if (!echantillon || !reactif) return null;

    const ionRevele = echantillon.ions
        .map(id => IONS.find(i => i.id === id))
        .find(ion => ion.reactif === idReactif);

    return { echantillon, reactif, ionRevele };
}

function rendreTestIon(resultat) {
    if (!resultat) return "Sélectionner un échantillon et un réactif pour prédire le résultat du test.";

    const { echantillon, reactif, ionRevele } = resultat;

    if (ionRevele) {
        return `
            <p><strong>${echantillon.nom}</strong> + réactif <strong>${reactif.nom}</strong> (${reactif.formule})</p>
            <p>Il se forme un précipité <strong>${ionRevele.couleur}</strong> de ${ionRevele.formule}.</p>
            <p>Ce précipité met en évidence la présence de l'ion <strong>${ionRevele.nom} (${ionRevele.symbole})</strong> dans l'échantillon.</p>
        `;
    }

    return `
        <p><strong>${echantillon.nom}</strong> + réactif <strong>${reactif.nom}</strong> (${reactif.formule})</p>
        <p>Aucun précipité ne se forme.</p>
        <p>L'échantillon ne contient donc pas l'ion normalement révélé par ce réactif.</p>
    `;
}

function initTabIdentificationIons() {
    initTableauRecapIons();

    const selectEchantillon = $("select-echantillon-ions");
    const selectReactif = $("select-reactif-ions");
    const zone = $("resultat-test-ion");
    if (!selectEchantillon || !selectReactif || !zone) return;

    selectEchantillon.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ECHANTILLONS_IONS.map(e => `<option value="${e.id}">${e.nom}</option>`).join("");
    selectReactif.innerHTML = '<option value="">-- Sélectionner --</option>' +
        REACTIFS_IONS.map(r => `<option value="${r.id}">${r.nom} (${r.formule})</option>`).join("");

    const rafraichir = () => {
        const resultat = calculerTestIon(selectEchantillon.value, selectReactif.value);
        zone.innerHTML = rendreTestIon(resultat);
    };

    selectEchantillon.addEventListener("change", rafraichir);
    selectReactif.addEventListener("change", rafraichir);
}

/* ==========================================================
   ONGLET "Solutions commerciales" — dilution d'une solution du
   commerce (préparation des solutions acido-basiques à 0,1 mol/L
   pour le TP C02-4).
   Mêmes notations que l'onglet Dilution : mère C₁ (V₁), fille C₂ (V₂).
   Source : séquence C01 « Préparation de solutions par dilution ».
   ========================================================== */

const SC_C1_DEFAUT = 0.100;                 // mol/L (récapitulatif)
const SC_V1_DEFAUT = 100.0;                 // mL   (récapitulatif)
const SC_SEUIL_PETIT_VOLUME_ML = 2;         // en dessous : prélèvement peu précis
const SC_FIOLE_INTERMEDIAIRE_ML = 100;      // solution intermédiaire : fiole de 100 mL
const SC_FACTEUR_INTERMEDIAIRE = 10;        // ... dilution par 10 (10,0 mL de mère)
const SC_GRANDE_FIOLE_ML = 250;             // alternative : fiole de 250 mL
const SC_PIPETTES_GRADUEES_ML = [1, 2, 5, 10, 20];   // cf. data/glassware.js
const SC_U_LECTURE_DEFAUT_ML = 0.05;        // incertitude de lecture indicative

const SOLUTIONS_COMMERCIALES = {
    naoh: {
        groupe: "Bases",
        label: "Soude NaOH — solution mère à 50 g·L⁻¹",
        nomCourt: "NaOH",
        repere: "50 g·L⁻¹",
        cas: "1310-73-2",
        mode: "cm",
        cm0: 50, titre: "", rho: "", M: 40.0,
        description: "Solution mère de concentration massique Cm₁ = 50 g·L⁻¹. M(NaOH) = 23,0 + 16,0 + 1,0 = 40,0 g·mol⁻¹.",
        consignes: [
            "Corrosif (H314) : gants, lunettes et blouse obligatoires. Projection dans les yeux : rincer 15 min à l'eau et prévenir l'enseignant.",
            "Verser environ 20 mL de solution mère dans un bécher propre et sec : ne jamais pipeter directement dans le flacon.",
            "La dilution est légèrement exothermique : toujours ajouter la solution à l'eau, jamais l'inverse.",
            "La solution absorbe le CO₂ de l'air : la conserver bien fermée, avec un bouchon en plastique et non en verre rodé.",
            "NaOH est hygroscopique et se carbonate au contact de l'air : la concentration de la solution mère se vérifie par titrage."
        ]
    },
    destop: {
        groupe: "Bases",
        label: "Destop Liquid — hydroxyde de sodium à 20 %",
        nomCourt: "NaOH (Destop Liquid)",
        repere: "20 %",
        cas: "1310-73-2",
        mode: "titre",
        cm0: "", titre: 20, rho: 1219, M: 40.0,
        description: "Déboucheur liquide domestique à base d'hydroxyde de sodium, titre massique P = 20 %. Masse volumique ρ ≈ 1,219 g·mL⁻¹ = 1 219 g·L⁻¹ (valeur de table pour une solution de NaOH à 20 % : à vérifier sur l'étiquette, le produit du commerce pouvant contenir des additifs). M(NaOH) = 40,0 g·mol⁻¹.",
        consignes: [
            "Produit domestique fortement basique et corrosif (H314) : gants, lunettes et blouse obligatoires.",
            "Verser un peu de produit dans un bécher propre et sec : ne jamais pipeter directement dans le flacon.",
            "Toujours ajouter la solution concentrée à l'eau, jamais l'inverse (dilution exothermique).",
            "Ne pas mélanger avec un autre produit ménager. Ne pas verser sur de l'aluminium (dégagement de dihydrogène).",
            "Conserver avec un bouchon en plastique. La concentration réelle est à vérifier par titrage (additifs, carbonatation)."
        ]
    },
    hcl: {
        groupe: "Acides",
        label: "Acide chlorhydrique HCl — commercial à 23 %",
        nomCourt: "HCl",
        repere: "23 %",
        cas: "7647-01-0",
        mode: "titre",
        cm0: "", titre: 23, rho: 1115, M: 36.46,
        description: "Solution commerciale de titre massique P = 23 % et de masse volumique ρ ≈ 1,115 g·mL⁻¹ = 1 115 g·L⁻¹ (à vérifier sur l'étiquette du flacon). M(HCl) = 1,0 + 35,5 = 36,5 g·mol⁻¹ (36,46 en valeur précise).",
        consignes: [
            "Corrosif (H314) et irritant pour les voies respiratoires (H335) : travailler sous la hotte, avec gants, lunettes et blouse.",
            "Toujours verser l'acide dans l'eau (jamais l'eau dans l'acide).",
            "La masse volumique ρ varie avec la température : vérifier la valeur indiquée sur l'étiquette du flacon.",
            "Les solutions acides sont neutralisées avant rejet, selon la consigne du laboratoire."
        ]
    },
    vinaigre6: {
        groupe: "Acides",
        label: "Acide éthanoïque CH₃COOH — vinaigre blanc 6°",
        nomCourt: "CH₃COOH (vinaigre 6°)",
        repere: "6°",
        cas: "64-19-7",
        mode: "titre",
        cm0: "", titre: 6, rho: 1007, M: 60.0,
        description: "Vinaigre blanc à 6° : le degré d'acidité indique le nombre de grammes d'acide éthanoïque pour 100 g de vinaigre, donc P = 6 %. Masse volumique ρ ≈ 1,007 g·mL⁻¹ = 1 007 g·L⁻¹ (valeur de table, à vérifier). M(CH₃COOH) = 60,0 g·mol⁻¹.",
        consignes: [
            "Le vinaigre est irritant pour les yeux : lunettes obligatoires.",
            "Utiliser un vinaigre blanc incolore : un vinaigre coloré ou aromatisé serait inadapté."
        ]
    },
    vinaigre8: {
        groupe: "Acides",
        label: "Acide éthanoïque CH₃COOH — vinaigre blanc 8°",
        nomCourt: "CH₃COOH (vinaigre 8°)",
        repere: "8°",
        cas: "64-19-7",
        mode: "titre",
        cm0: "", titre: 8, rho: 1010, M: 60.0,
        description: "Vinaigre blanc à 8° : P = 8 % (8 g d'acide éthanoïque pour 100 g de vinaigre). Masse volumique ρ ≈ 1,010 g·mL⁻¹ = 1 010 g·L⁻¹ (valeur de table, à vérifier). M(CH₃COOH) = 60,0 g·mol⁻¹.",
        consignes: [
            "Le vinaigre est irritant pour les yeux : lunettes obligatoires.",
            "Utiliser un vinaigre blanc incolore : un vinaigre coloré ou aromatisé serait inadapté."
        ]
    },
    ch3cooh: {
        groupe: "Acides",
        label: "Acide éthanoïque CH₃COOH — vinaigre blanc 9,5°",
        nomCourt: "CH₃COOH",
        repere: "9,5°",
        cas: "64-19-7",
        mode: "titre",
        cm0: "", titre: 9.5, rho: 1010, M: 60.0,
        description: "Vinaigre blanc à 9,5° : le degré d'acidité indique le nombre de grammes d'acide éthanoïque pour 100 g de vinaigre, donc P = 9,5 %. Masse volumique ρ ≈ 1,01 g·mL⁻¹ = 1 010 g·L⁻¹. M(CH₃COOH) = 2 × 12,0 + 4 × 1,0 + 2 × 16,0 = 60,0 g·mol⁻¹.",
        consignes: [
            "Le vinaigre à 9,5° est irritant pour les yeux : lunettes obligatoires.",
            "Utiliser un vinaigre blanc incolore : un vinaigre coloré ou aromatisé serait inadapté."
        ]
    },
    vinaigre20: {
        groupe: "Acides",
        label: "Acide éthanoïque CH₃COOH — vinaigre ménager 20°",
        nomCourt: "CH₃COOH (vinaigre 20°)",
        repere: "20°",
        cas: "64-19-7",
        mode: "titre",
        cm0: "", titre: 20, rho: 1026, M: 60.0,
        description: "Vinaigre ménager à 20° : P = 20 % (20 g d'acide éthanoïque pour 100 g de vinaigre). Masse volumique ρ ≈ 1,026 g·mL⁻¹ = 1 026 g·L⁻¹ (valeur de table, à vérifier). M(CH₃COOH) = 60,0 g·mol⁻¹.",
        consignes: [
            "Vinaigre concentré, irritant pour la peau et les yeux : gants, lunettes et blouse obligatoires.",
            "Produit d'entretien, non alimentaire. Verser toujours le vinaigre concentré dans l'eau.",
            "Utiliser un produit incolore et non parfumé, sinon la solution est inadaptée."
        ]
    },
    citron998: {
        groupe: "Acides",
        label: "Jus de citron à 99,8 % — acide citrique",
        nomCourt: "Acide citrique (jus 99,8 %)",
        repere: "99,8 %",
        cas: "",
        securite: "Jus de citron : produit alimentaire peu dangereux. Lunettes néanmoins obligatoires au laboratoire (l'acide citrique est irritant pour les yeux).",
        mode: "cm",
        cm0: 59.88, titre: "", rho: "", M: 192.0,
        description: "Le pourcentage indiqué sur le flacon (99,8 %) est la proportion de jus pur, pas la teneur en acide. L'acide citrique C₆H₈O₇ (M = 6 × 12,0 + 8 × 1,0 + 7 × 16,0 = 192,0 g·mol⁻¹) est l'acide majoritaire du jus : le jus pur en contient environ 60 g·L⁻¹ (valeur indicative, variable selon les citrons). Cm₁ ≈ 0,998 × 60 ≈ 59,9 g·L⁻¹.",
        consignes: [
            "Utiliser un jus de citron clair, sans pulpe, ou le filtrer : la pulpe fausse le prélèvement.",
            "L'acide citrique est un triacide : lors d'un titrage par la soude, 1 mol d'acide citrique réagit avec 3 mol d'ions HO⁻.",
            "Teneur en acide indicative : la concentration réelle du jus se détermine par titrage.",
            "Le jus se conserve mal (fermentation) : préparer la solution le jour même."
        ]
    },
    citron40: {
        groupe: "Acides",
        label: "Jus de citron à 40 % — acide citrique",
        nomCourt: "Acide citrique (jus 40 %)",
        repere: "40 %",
        cas: "",
        securite: "Jus de citron dilué : produit alimentaire peu dangereux. Lunettes néanmoins obligatoires au laboratoire.",
        mode: "cm",
        cm0: 24, titre: "", rho: "", M: 192.0,
        description: "Boisson ou préparation à 40 % de jus de citron (le reste étant de l'eau). Le jus pur contient environ 60 g·L⁻¹ d'acide citrique C₆H₈O₇ (M = 192,0 g·mol⁻¹, valeur indicative) : Cm₁ ≈ 0,40 × 60 = 24 g·L⁻¹. Le pourcentage indiqué est la proportion de jus, pas la teneur en acide.",
        consignes: [
            "Vérifier l'étiquette : sucre, arômes ou colorants ajoutés rendent la préparation inadaptée pour un titrage.",
            "L'acide citrique est un triacide : lors d'un titrage par la soude, 1 mol d'acide citrique réagit avec 3 mol d'ions HO⁻.",
            "Teneur en acide indicative : la concentration réelle se détermine par titrage.",
            "Préparer la solution le jour même."
        ]
    },
    autre: {
        groupe: "Autre",
        label: "Autre solution commerciale (saisie libre)",
        nomCourt: "Autre solution",
        repere: "",
        cas: "",
        mode: null,
        cm0: "", titre: "", rho: "", M: "",
        description: "Renseigner les données de l'étiquette : concentration massique, ou titre massique et masse volumique, ainsi que la masse molaire du soluté.",
        consignes: [
            "Lire l'étiquette et la fiche de données de sécurité du produit avant toute manipulation.",
            "Verser toujours la solution concentrée dans l'eau, jamais l'inverse."
        ]
    }
};

/* ---------- utilitaires de formatage (virgule décimale) ---------- */

function texteNombre(valeur) {
    if (!Number.isFinite(valeur)) return "—";
    return String(Number(Number(valeur).toPrecision(6))).replace(".", ",");
}

function texteSignificatif(valeur, chiffres) {
    if (!Number.isFinite(valeur)) return "—";
    return Number(valeur).toPrecision(chiffres).replace(".", ",");
}

function remplirChamp(id, valeur) {
    const champ = $(id);
    if (champ) champ.value = (valeur === "" || valeur === null || valeur === undefined) ? "" : String(valeur);
}

/* ---------- calculs (fonctions pures) ---------- */

/**
 * Cm₁ = P × ρ (ou Cm₁ donnée), C₁ = Cm₁ / M, V₁ = C₂ × V₂ / C₁, F = C₁ / C₂ = V₂ / V₁
 * titre en %, rho en g/L, M en g/mol, c1 en mol/L, v1 en mL.
 */
function calculerDilutionCommerciale({ mode, cm0, titre, rho, M, c1, v1 }) {
    if (!(M > 0) || !(c1 > 0) || !(v1 > 0)) return null;

    let cm;
    if (mode === "titre") {
        if (!(titre > 0) || titre > 100 || !(rho > 0)) return null;
        cm = (titre / 100) * rho;
    } else {
        if (!(cm0 > 0)) return null;
        cm = cm0;
    }

    const c0 = cm / M;
    const v0 = (c1 * v1) / c0;
    return { cm, c0, v0, facteur: c0 / c1 };
}

function choisirPipetteSC(volumeMl) {
    return SC_PIPETTES_GRADUEES_ML.find(cap => cap >= volumeMl) ?? null;
}

function lireEtatSC() {
    const u = lireNombre($("sc-u-lecture"));
    return {
        mode: $("sc-mode")?.value || "cm",
        cm0: lireNombre($("sc-cm0")),
        titre: lireNombre($("sc-titre")),
        rho: lireNombre($("sc-rho")),
        M: lireNombre($("sc-M")),
        c1: lireNombre($("sc-c1")),
        v1: lireNombre($("sc-v1")),
        u: u > 0 ? u : SC_U_LECTURE_DEFAUT_ML
    };
}

/* ---------- rendu ---------- */

function rendreDetailsSC(e, r) {
    const lignes = [];
    let n = 1;

    if (e.mode === "titre") {
        lignes.push(`<p>Étape ${n++} — Cm₁ = P × ρ = ${texteNombre(e.titre / 100)} × ${texteNombre(e.rho)} = <strong>${formaterNombre(r.cm, 2)} g·L⁻¹</strong></p>`);
        lignes.push(`<p>Étape ${n++} — C₁ = Cm₁ / M = ${formaterNombre(r.cm, 2)} / ${texteNombre(e.M)} = <strong>${texteSignificatif(r.c0, 3)} mol·L⁻¹</strong></p>`);
    } else {
        lignes.push(`<p>Étape ${n++} — C₁ = Cm₁ / M = ${texteNombre(e.cm0)} / ${texteNombre(e.M)} = <strong>${texteSignificatif(r.c0, 3)} mol·L⁻¹</strong></p>`);
    }

    lignes.push(`<p>Étape ${n++} — V₁ = (C₂ × V₂) / C₁ = (${formaterNombre(e.c1, 3)} × ${formaterNombre(e.v1, 1)}) / ${texteSignificatif(r.c0, 3)} = <strong>${formaterNombre(r.v0, 2)} mL</strong></p>`);
    lignes.push(`<p>Vérification — F = C₁ / C₂ = ${texteSignificatif(r.facteur, 3)} et V₂ / V₁ = ${texteSignificatif(e.v1 / r.v0, 3)} ✔</p>`);

    return lignes.join("");
}

function rendreVerrerieSC(e, r) {
    const pipette = choisirPipetteSC(r.v0);
    const uRel = (u, v) => (u / v) * 100;

    if (r.v0 > SC_PIPETTES_GRADUEES_ML[SC_PIPETTES_GRADUEES_ML.length - 1]) {
        return `<p class="warning">⚠ V₁ = ${formaterNombre(r.v0, 2)} mL dépasse la capacité des pipettes graduées (20 mL) : utiliser une burette graduée ou une éprouvette graduée, ou réduire le volume V₂ à préparer.</p>`;
    }

    if (r.v0 >= SC_SEUIL_PETIT_VOLUME_ML) {
        return `<p class="success">✔ Prélever V₁ = ${formaterNombre(r.v0, 2)} mL à la <strong>pipette graduée de ${pipette} mL</strong> (V₁ ≥ ${SC_SEUIL_PETIT_VOLUME_ML} mL : prélèvement direct adapté). Incertitude relative de lecture estimée : ≈ ${texteSignificatif(uRel(e.u, r.v0), 2)} % pour u(V) = ${texteNombre(e.u)} mL.</p>`;
    }

    // Petit volume (< 2 mL) : comparaison de trois méthodes
    const prise = SC_FIOLE_INTERMEDIAIRE_ML / SC_FACTEUR_INTERMEDIAIRE;      // 10,0 mL
    const cInter = r.c0 / SC_FACTEUR_INTERMEDIAIRE;
    const vInter = (e.c1 * e.v1) / cInter;                                   // 10 × V₁
    const uInter = Math.sqrt(Math.pow(e.u / prise, 2) + Math.pow(e.u / vInter, 2)) * 100;
    const pipetteInter = choisirPipetteSC(vInter);

    let lignes = `
        <tr>
            <td>Prélèvement direct</td>
            <td>V₁ = ${formaterNombre(r.v0, 2)} mL (pipette graduée de ${pipette} mL) dans la fiole de ${formaterNombre(e.v1, 0)} mL</td>
            <td>≈ ${texteSignificatif(uRel(e.u, r.v0), 2)} %</td>
        </tr>
        <tr>
            <td>Solution intermédiaire (dilution par ${SC_FACTEUR_INTERMEDIAIRE})</td>
            <td>${formaterNombre(prise, 1)} mL de solution mère dans une fiole de ${SC_FIOLE_INTERMEDIAIRE_ML} mL (C = ${texteSignificatif(cInter, 3)} mol·L⁻¹), puis ${formaterNombre(vInter, 1)} mL de cette solution (${pipetteInter ? `pipette graduée de ${pipetteInter} mL` : "pipette jaugée"}) dans la fiole finale</td>
            <td>≈ ${texteSignificatif(uInter, 2)} %</td>
        </tr>`;

    if (e.v1 < SC_GRANDE_FIOLE_ML) {
        const v0Grande = (e.c1 * SC_GRANDE_FIOLE_ML) / r.c0;
        const pipetteGrande = choisirPipetteSC(v0Grande);
        lignes += `
        <tr>
            <td>Fiole plus grande (${SC_GRANDE_FIOLE_ML} mL)</td>
            <td>${formaterNombre(v0Grande, 2)} mL (${pipetteGrande ? `pipette graduée de ${pipetteGrande} mL` : "pipette jaugée"}) dans une fiole de ${SC_GRANDE_FIOLE_ML} mL</td>
            <td>≈ ${texteSignificatif(uRel(e.u, v0Grande), 2)} %</td>
        </tr>`;
    }

    return `
        <p class="warning">⚠ V₁ = ${formaterNombre(r.v0, 2)} mL est inférieur à ${SC_SEUIL_PETIT_VOLUME_ML} mL : l'incertitude relative sur le prélèvement est importante. Comparer les méthodes ci-dessous.</p>
        <div class="table-responsive">
            <table class="tableau-resultats">
                <caption>Précision du prélèvement selon la méthode (u(V) = ${texteNombre(e.u)} mL par lecture)</caption>
                <thead>
                    <tr>
                        <th scope="col">Méthode</th>
                        <th scope="col">Prélèvements</th>
                        <th scope="col">Incertitude relative estimée</th>
                    </tr>
                </thead>
                <tbody>${lignes}</tbody>
            </table>
        </div>
        <p>Estimation indicative : la même incertitude de lecture u(V) est supposée pour chaque prélèvement (combinaison quadratique pour la solution intermédiaire) ; les tolérances de la verrerie jaugée ne sont pas prises en compte.</p>`;
}

function viderSortiesSC() {
    ["sc-out-cm0", "sc-out-c0", "sc-out-v0", "sc-out-f"].forEach(id => remplirChamp(id, ""));
}

function actualiserSC() {
    const e = lireEtatSC();
    const r = calculerDilutionCommerciale(e);
    const details = $("sc-details");
    const verrerie = $("sc-verrerie");
    const preset = SOLUTIONS_COMMERCIALES[$("sc-solution")?.value];

    // Rappels dans le tableau de résultats de l'onglet
    if ($("sc-table-nom")) $("sc-table-nom").textContent = preset ? preset.nomCourt : "—";
    if ($("sc-table-c1")) $("sc-table-c1").textContent = e.c1 > 0 ? `${formaterNombre(e.c1, 3)} mol·L⁻¹` : "—";

    if (!r) {
        viderSortiesSC();
        if (details) details.textContent = "Sélectionner une solution et renseigner les données pour afficher le calcul.";
        if (verrerie) verrerie.innerHTML = "";
        if ($("sc-table-v0")) $("sc-table-v0").textContent = "—";
        calculerEcartsSC();
        return;
    }

    remplirChamp("sc-out-cm0", formaterNombre(r.cm, 2));
    remplirChamp("sc-out-c0", texteSignificatif(r.c0, 3));

    if (r.c0 <= e.c1) {
        remplirChamp("sc-out-v0", "");
        remplirChamp("sc-out-f", "");
        if (details) details.innerHTML = `<p class="warning">⚠ La solution mère doit être plus concentrée que la solution fille (C₁ = ${texteSignificatif(r.c0, 3)} mol·L⁻¹ ≤ C₂ = ${formaterNombre(e.c1, 3)} mol·L⁻¹) : ce n'est pas une dilution.</p>`;
        if (verrerie) verrerie.innerHTML = "";
        if ($("sc-table-v0")) $("sc-table-v0").textContent = "—";
        calculerEcartsSC();
        return;
    }

    remplirChamp("sc-out-v0", formaterNombre(r.v0, 2));
    remplirChamp("sc-out-f", texteSignificatif(r.facteur, 3));

    if (details) details.innerHTML = rendreDetailsSC(e, r);
    if (verrerie) verrerie.innerHTML = rendreVerrerieSC(e, r);
    if ($("sc-table-v0")) $("sc-table-v0").textContent = `${formaterNombre(r.v0, 2)} mL`;

    calculerEcartsSC();
}

/**
 * Résultats de l'onglet :
 *  - concentration obtenue  C_obt = C₁ × V₁,réel / V₂
 *  - écart relatif  = |C_obt − C₂| / C₂ × 100
 *  - facultatif : écart relatif entre la concentration mesurée par titrage et C₂
 */
function calculerEcartsSC() {
    const e = lireEtatSC();
    const r = calculerDilutionCommerciale(e);
    const v0Reel = lireNombre($("sc-v0-reel"));
    const cTitrage = lireNombre($("sc-c-titrage"));
    const zone = $("sc-res-ecart");

    const razCObtenue = () => {
        remplirChamp("sc-c-obtenue", "");
        if ($("sc-ecart-rel")) $("sc-ecart-rel").textContent = "—";
    };
    const razTitrage = () => {
        if ($("sc-ecart-titrage")) $("sc-ecart-titrage").textContent = "—";
    };

    const messages = [];

    if (!r || r.c0 <= e.c1) {
        razCObtenue();
        razTitrage();
        if (zone) zone.textContent = "Calculer d'abord le volume V₁ à prélever.";
        return;
    }

    if (v0Reel > 0) {
        const cObtenue = (r.c0 * v0Reel) / e.v1;
        const ecart = (Math.abs(cObtenue - e.c1) / e.c1) * 100;
        remplirChamp("sc-c-obtenue", cObtenue.toFixed(4));
        if ($("sc-ecart-rel")) $("sc-ecart-rel").textContent = `${formaterNombre(ecart, 2)} %`;
        messages.push(`C obtenue = ${formaterNombre(cObtenue, 4)} mol·L⁻¹ | Écart relatif sur C₂ : ${formaterNombre(ecart, 2)} %`);
    } else {
        razCObtenue();
        messages.push("Saisir le volume V₁ réellement prélevé.");
    }

    if (cTitrage > 0) {
        const ecartT = (Math.abs(cTitrage - e.c1) / e.c1) * 100;
        if ($("sc-ecart-titrage")) $("sc-ecart-titrage").textContent = `${formaterNombre(ecartT, 2)} %`;
        messages.push(`Titrage : C = ${formaterNombre(cTitrage, 4)} mol·L⁻¹ | Écart relatif sur C₂ : ${formaterNombre(ecartT, 2)} %`);
    } else {
        razTitrage();
    }

    if (zone) zone.textContent = messages.join(" — ");
}

function afficherConsignesEtSecuriteSC(preset) {
    const liste = $("sc-consignes");
    if (liste) {
        liste.innerHTML = preset
            ? preset.consignes.map(c => `<li>${c}</li>`).join("")
            : "";
    }

    const zoneSecurite = $("securite-bloc-sc");
    if (!zoneSecurite) return;

    if (preset && !preset.cas) {
        zoneSecurite.innerHTML = `<div class="info">${preset.securite || "Solution personnalisée : consulter l'étiquette du flacon et la fiche de données de sécurité avant de commencer."}</div>`;
        return;
    }

    afficherSecuriteProduit({
        produit: preset ? trouverProduit(products, preset.cas) : null,
        dangerDB,
        pictogrammes,
        zoneId: "securite-bloc-sc"
    });
}

function basculerModeSC() {
    const mode = $("sc-mode")?.value || "cm";
    $("sc-groupe-cm")?.classList.toggle("hidden", mode !== "cm");
    $("sc-groupe-titre")?.classList.toggle("hidden", mode !== "titre");
    $("sc-groupe-rho")?.classList.toggle("hidden", mode !== "titre");
}

function appliquerPresetSC(id) {
    const preset = SOLUTIONS_COMMERCIALES[id] || null;
    const description = $("sc-description");

    if (preset) {
        if (preset.mode && $("sc-mode")) $("sc-mode").value = preset.mode;
        remplirChamp("sc-cm0", preset.cm0);
        remplirChamp("sc-titre", preset.titre);
        remplirChamp("sc-rho", preset.rho);
        remplirChamp("sc-M", preset.M);
    }

    basculerModeSC();

    if (description) {
        description.textContent = preset ? preset.description : "";
        description.classList.toggle("hidden", !preset);
    }

    afficherConsignesEtSecuriteSC(preset);
    actualiserSC();
}

function initTableauRecapSC() {
    const tbody = $("sc-tbody-recap");
    if (!tbody) return;

    tbody.innerHTML = ["naoh", "hcl", "ch3cooh"].map(id => {
        const s = SOLUTIONS_COMMERCIALES[id];
        const r = calculerDilutionCommerciale({
            mode: s.mode, cm0: s.cm0, titre: s.titre, rho: s.rho, M: s.M,
            c1: SC_C1_DEFAUT, v1: SC_V1_DEFAUT
        });
        if (!r) return "";
        const pipette = choisirPipetteSC(r.v0);
        return `<tr>
            <td>${s.nomCourt}</td>
            <td>C₁ = ${texteSignificatif(r.c0, 3)} mol·L⁻¹ (${s.repere})</td>
            <td>${formaterNombre(r.v0, 2)} mL</td>
            <td>${texteSignificatif(r.facteur, 3)}</td>
            <td>${pipette ? `pipette graduée de ${pipette} mL` : "pipette jaugée"}</td>
        </tr>`;
    }).join("");
}

function initTabSolutionsCommerciales() {
    const select = $("sc-solution");
    if (!select) return;

    const groupes = {};
    Object.entries(SOLUTIONS_COMMERCIALES).forEach(([id, s]) => {
        (groupes[s.groupe] = groupes[s.groupe] || []).push(`<option value="${id}">${s.label}</option>`);
    });

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        Object.entries(groupes)
            .map(([nom, options]) => `<optgroup label="${nom}">${options.join("")}</optgroup>`)
            .join("");

    initTableauRecapSC();

    select.addEventListener("change", () => appliquerPresetSC(select.value));
    $("sc-mode")?.addEventListener("change", () => { basculerModeSC(); actualiserSC(); });

    ["sc-cm0", "sc-titre", "sc-rho", "sc-M", "sc-c1", "sc-v1", "sc-u-lecture"].forEach(id => {
        $(id)?.addEventListener("input", actualiserSC);
    });

    ["sc-v0-reel", "sc-c-titrage"].forEach(id => {
        $(id)?.addEventListener("input", calculerEcartsSC);
        $(id)?.addEventListener("change", calculerEcartsSC);
    });

    appliquerPresetSC("");
}

/* ==========================================================
   QUESTIONS DU COMPTE-RENDU
   Un bloc de 5 questions pour l'activité dissolution/dilution,
   un second bloc pour l'onglet identification d'ions ; seul le
   bloc correspondant à l'onglet actif est visible et imprimé.
   ========================================================== */

function afficherQuestionsTP(idOnglet) {
    document.querySelectorAll(".questions-bloc").forEach(bloc => {
        const onglets = (bloc.dataset.tp || "").split(",").map(s => s.trim());
        bloc.hidden = !onglets.includes(idOnglet);
    });
}

function initQuestionsParOnglet() {
    const boutons = document.querySelectorAll(".tabs-container .tab-btn");
    if (!boutons.length) return;

    boutons.forEach(btn => {
        btn.addEventListener("click", () => afficherQuestionsTP(btn.dataset.tab));
    });

    const actif = document.querySelector(".tabs-container .tab-btn.actif") || boutons[0];
    afficherQuestionsTP(actif.dataset.tab);
}

/* ==========================================================
   BOUTON IMPRESSION COMPTE-RENDU
   ========================================================== */
function initBoutonImpressionCR() {
    const btn = $("btn-imprimer");
    if (!btn) return;
    btn.addEventListener("click", lancerCompteRendu);
}

function lancerCompteRendu() {
    const identite = {
        nom: lireTexte("nom-eleve"),
        prenom: lireTexte("prenom-eleve"),
        classe: lireTexte("classe-eleve"),
        date: $("date-eleve")?.value || ""
    };

    const nomReactif = reactifCourant?.nom || "—";
    const masseMolaire = $("masse-molaire-reactif-selectionne")?.textContent || "—";
    const cDissolution = $("c-dissolution")?.value || "—";
    const vDissolution = $("v-dissolution")?.value || "—";
    const masseTheo = $("res-dissolution")?.value || "—";
    const filiereChoisie = getFiliereSelectionnee();

    const sections = [];

    if (filiereChoisie) {
        sections.push({
            titre: "Contexte professionnel",
            items: [
                { label: "Filière", valeur: `${filiereChoisie.niveau} — ${filiereChoisie.filiere}` }
            ]
        });
    }

    sections.push(
        {
            titre: "Paramètres de la dissolution",
            groupe: "dissolution",
            items: [
                { label: "Réactif", valeur: nomReactif },
                { label: "Masse molaire M", valeur: `${masseMolaire} g/mol` },
                { label: "Concentration C", valeur: `${cDissolution} mol/L` },
                { label: "Volume V", valeur: `${vDissolution} mL` },
                { label: "Masse théorique m", valeur: `${masseTheo} g` }
            ]
        },
        {
            titre: "Paramètres de la dilution (C₁V₁ = C₂V₂)",
            groupe: "dilution",
            items: [
                { label: "Concentration mère C₁", valeur: `${$("c1-hcl")?.value || "—"} mol/L` },
                { label: "Concentration fille C₂", valeur: `${$("c2-hcl")?.value || "—"} mol/L` },
                { label: "Volume final V₂", valeur: `${$("v2-hcl")?.value || "—"} mL` },
                { label: "Volume à prélever V₁", valeur: `${$("res-hcl")?.textContent?.replace("Volume à prélever : ", "") || "—"}` }
            ]
        },
        {
            titre: "Série de dilutions par 2 (D0 à D5)",
            groupe: "dilution",
            items: IDS_SERIE_DILUTION.map((id, n) => ({
                label: `Concentration D${n}`,
                valeur: `${$(id)?.value || "—"} mol/L`
            }))
        },
        {
            titre: "Dilution d'une solution commerciale",
            groupe: "solutions-commerciales",
            items: [
                { label: "Solution préparée", valeur: $("sc-solution")?.selectedOptions?.[0]?.textContent || "—" },
                { label: "Concentration massique Cm₁", valeur: `${$("sc-out-cm0")?.value || "—"} g/L` },
                { label: "Concentration molaire C₁", valeur: `${$("sc-out-c0")?.value || "—"} mol/L` },
                { label: "Concentration visée C₂", valeur: `${$("sc-c1")?.value || "—"} mol/L` },
                { label: "Volume final V₂", valeur: `${$("sc-v1")?.value || "—"} mL` },
                { label: "Volume à prélever V₁", valeur: `${$("sc-out-v0")?.value || "—"} mL` },
                { label: "Facteur de dilution F", valeur: $("sc-out-f")?.value || "—" },
                { label: "V₁ réellement prélevé", valeur: `${$("sc-v0-reel")?.value || "—"} mL` },
                { label: "Concentration obtenue", valeur: `${$("sc-c-obtenue")?.value || "—"} mol/L` },
                { label: "Écart relatif", valeur: $("sc-ecart-rel")?.textContent?.trim() || "—" },
                { label: "Concentration mesurée par titrage", valeur: $("sc-c-titrage")?.value ? `${$("sc-c-titrage").value} mol/L` : "—" },
                { label: "Écart relatif (titrage)", valeur: $("sc-ecart-titrage")?.textContent?.trim() || "—" }
            ]
        },
        {
            titre: "Test d'identification d'ion",
            groupe: "identification-ions",
            items: [
                { label: "Échantillon testé", valeur: $("select-echantillon-ions")?.selectedOptions?.[0]?.textContent || "—" },
                { label: "Réactif ajouté", valeur: $("select-reactif-ions")?.selectedOptions?.[0]?.textContent || "—" }
            ]
        }
    );

    // Seules les questions du bloc actuellement visible (onglet de
    // manipulation actif) sont incluses dans le compte-rendu.
    const blocActif = document.querySelector(".questions-bloc:not([hidden])");
    const ongletsBlocActif = (blocActif?.dataset.tp || "").split(",").map(s => s.trim());

    const liste = blocActif
        ? blocActif.querySelectorAll(".questions-tp > li")
        : document.querySelectorAll(".questions-tp > li");

    liste.forEach((li, index) => {
        const zone = li.querySelector("textarea.cr-reponse, textarea[id^='question']")
                     || li.querySelector("textarea");
        if (!zone) return;

        const titreQuestion = li.querySelector(".question-entete strong")
            ?.textContent.replace(/\s+/g, " ").trim() || `Question ${index + 1}`;
        const competence = li.querySelector(".cartouche")?.dataset.comp || "";
        const groupe = ongletsBlocActif.includes("solutions-commerciales")
            ? "solutions-commerciales"
            : ongletsBlocActif.includes("identification-ions")
                ? "identification-ions"
                : (/dilution/i.test(titreQuestion) ? "dilution" : "dissolution");

        sections.push({
            titre: titreQuestion,
            competence,
            notation: true,
            groupe,
            texte: (zone.value || "").trim()
        });
    });

    genererCompteRendu({
        domaine: "Chimie",
        tp: "TP01",
        titre: "Préparation de solutions par dissolution et dilution",
        sections,
        groupes: [
            { id: "dissolution", label: "Partie Dissolution", defaut: true },
            { id: "dilution",    label: "Partie Dilution",    defaut: true },
            { id: "identification-ions", label: "Partie Identification d'ions", defaut: true },
            { id: "solutions-commerciales", label: "Partie Solutions commerciales (Tle)", defaut: true }
        ],
        identiteDefaut: identite,
        signature: false,
        noteFinale: true
    });
}

/* ==========================================================
   INITIALISATION AU CHARGEMENT
   ========================================================== */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
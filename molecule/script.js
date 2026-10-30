/**
 * molecule/script.js — visionneuse 3D (3Dmol.js).
 *
 * Utilisée seule (molecule/index.html) ou dans la fenêtre « Voir en 3D » des TP
 * (molecule/index.html?q=<nom>&embed=1).
 *
 * Points de robustesse :
 *   - la recherche ?q= est lancée tout de suite : le nom, la formule et la masse
 *     s'affichent même si la bibliothèque 3Dmol est lente ou injoignable ;
 *   - 3Dmol est chargée à la demande : copie locale lib/3Dmol-min.js, puis CDN
 *     en secours (plus de dépendance unique à 3dmol.org) ;
 *   - le viewer n'est créé qu'une fois son conteneur mesurable (fenêtre ouverte) ;
 *   - les structures XYZ au nombre d'atomes erroné sont réparées avant affichage ;
 *   - les erreurs s'affichent dans la page (plus de alert()).
 */

const SOURCES_3DMOL = [
  "lib/3Dmol-min.js",
  "https://cdn.jsdelivr.net/npm/3dmol@2.5.5/build/3Dmol-min.js",
  "https://3dmol.org/build/3Dmol-min.js",
];

let viewer = null;
let promesseViewer = null;
let promesseJSON = null;
let numeroRecherche = 0;
let derniereDemande = ""; // nom déjà lancé depuis un TP (évite une double recherche)

// ===============================
// Utilitaires
// ===============================
function normalize(str) {
  return String(str ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function $(id) {
  return document.getElementById(id);
}

function message(texte, type = "info") {
  const zone = $("message");
  if (!zone) return;
  zone.textContent = texte || "";
  zone.dataset.type = type;
  zone.hidden = !texte;
}

function prochaineImage() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

// ===============================
// Chargement de 3Dmol
// ===============================
function chargerScript(src, delai = 8000) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const minuteur = setTimeout(() => {
      script.remove();
      reject(new Error("délai dépassé : " + src));
    }, delai);
    script.onload = () => {
      clearTimeout(minuteur);
      window.$3Dmol ? resolve() : reject(new Error("3Dmol absent après " + src));
    };
    script.onerror = () => {
      clearTimeout(minuteur);
      script.remove();
      reject(new Error("échec : " + src));
    };
    script.src = src;
    document.head.appendChild(script);
  });
}

async function chargerBibliotheque() {
  if (window.$3Dmol) return true;
  for (const src of SOURCES_3DMOL) {
    try {
      await chargerScript(src);
      return true;
    } catch (erreur) {
      console.warn("3Dmol :", erreur.message);
    }
  }
  return false;
}

async function obtenirViewer() {
  if (viewer) return viewer;

  if (!promesseViewer) {
    promesseViewer = (async () => {
      if (!(await chargerBibliotheque())) return null;

      // Le conteneur doit avoir une taille (fenêtre visible) avant createViewer.
      const zone = $("viewer");
      for (let i = 0; i < 30 && (!zone.clientWidth || !zone.clientHeight); i++) {
        await prochaineImage();
      }

      try {
        viewer = $3Dmol.createViewer("viewer", { backgroundColor: "white" });
      } catch (erreur) {
        console.warn("Création du viewer impossible :", erreur);
        viewer = null;
      }
      return viewer;
    })();
  }

  const v = await promesseViewer;
  if (!v) promesseViewer = null; // nouvelle tentative possible à la recherche suivante
  return v;
}

// ===============================
// Affichage 3D
// ===============================
// Recalcule l'en-tête XYZ (nombre d'atomes) d'après les lignes réellement présentes.
function reparerXYZ(texte) {
  const lignes = String(texte).replace(/\r/g, "").split("\n");
  const atomes = lignes.slice(2).filter(l => l.trim() !== "");
  return [String(atomes.length), lignes[1] || "", ...atomes].join("\n") + "\n";
}

async function display3D(structure, format = "xyz") {
  const v = await obtenirViewer();

  if (!v) {
    message(
      "L'aperçu 3D n'a pas pu démarrer (bibliothèque 3Dmol introuvable ou WebGL désactivé). " +
      "Le nom, la formule et la masse restent valables.",
      "erreur"
    );
    return false;
  }

  try {
    v.clear();
    v.addModel(format === "xyz" ? reparerXYZ(structure) : structure, format);
    v.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
    v.zoomTo();
    // Vue initiale en perspective : sans cela, les molécules symétriques
    // (ex. octaèdre) apparaissent « à plat » et les atomes touchent les bords.
    v.rotate(25, "x");
    v.rotate(30, "y");
    v.zoom(0.85);
    v.render();
    message("");
    return true;
  } catch (erreur) {
    console.warn("Structure illisible :", erreur);
    message("Cette structure 3D n'a pas pu être affichée.", "erreur");
    return false;
  }
}

// ===============================
// Recherche locale JSON
// ===============================
function chargerMolecules() {
  if (!promesseJSON) {
    promesseJSON = fetch("molecules.json")
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .catch(erreur => {
        promesseJSON = null; // on réessaiera
        throw erreur;
      });
  }
  return promesseJSON;
}

async function chercherLocale(nom) {
  const liste = await chargerMolecules();
  const requete = normalize(nom);

  // 1. nom ou alias identique, 2. nom ou alias qui contient la saisie
  const noms = m => [m.nom, ...(m.aliases || [])].map(normalize);

  return (
    liste.find(m => noms(m).includes(requete)) ||
    liste.find(m => noms(m).some(n => n.includes(requete))) ||
    null
  );
}

function afficherInfos(mol) {
  $("nom").textContent = mol.nom || "-";
  $("formule").textContent = mol.formule || "-";
  $("masse").textContent = mol.masse || "-";
}

// ===============================
// PubChem (secours : molécule absente de molecules.json)
// ===============================
async function pubchem(url, delai = 10000) {
  const controle = new AbortController();
  const minuteur = setTimeout(() => controle.abort(), delai);
  try {
    return await fetch(url, { signal: controle.signal });
  } finally {
    clearTimeout(minuteur);
  }
}

async function chercherPubChem(nomNormalise, actuelle) {
  const base = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(nomNormalise)}`;
  let trouve = false;

  try {
    const res = await pubchem(`${base}/property/MolecularFormula,MolecularWeight/JSON`);
    if (res.ok) {
      const props = (await res.json())?.PropertyTable?.Properties?.[0];
      if (props && actuelle()) {
        $("formule").textContent = props.MolecularFormula || "-";
        $("masse").textContent = props.MolecularWeight || "-";
        trouve = true;
      }
    }
  } catch (erreur) {
    console.warn("Infos PubChem indisponibles");
  }

  try {
    const res = await pubchem(`${base}/record/SDF/?record_type=3d`);
    if (res.ok) {
      const sdf = await res.text();
      if (sdf && sdf.length > 100 && actuelle()) {
        $("nom").textContent = nomNormalise;
        await display3D(sdf, "sdf");
        return true;
      }
    }
  } catch (erreur) {
    console.warn("3D PubChem absente");
  }

  return trouve;
}

// ===============================
// Recherche principale
// ===============================
async function searchMolecule() {
  const champ = $("search");
  const saisie = champ.value.trim();
  if (!saisie) return;

  const numero = ++numeroRecherche;
  const actuelle = () => numero === numeroRecherche; // une recherche plus récente annule celle-ci

  // reset visuel
  $("nom").textContent = "-";
  $("formule").textContent = "-";
  $("masse").textContent = "-";
  message("");
  if (viewer) {
    viewer.clear();
    viewer.render();
  }

  // 0. molecules.json en priorité : noms français des TP, fonctionne hors connexion.
  try {
    const mol = await chercherLocale(saisie);
    if (!actuelle()) return;

    if (mol) {
      afficherInfos(mol);
      if (mol.structure) {
        await display3D(mol.structure, "xyz");
        return;
      }
    }
  } catch (erreur) {
    console.warn("molecules.json indisponible → PubChem", erreur);
  }

  // 1. PubChem
  message("Recherche sur PubChem…");
  const ok = await chercherPubChem(normalize(saisie), actuelle);
  if (!actuelle()) return;

  if (!ok && $("nom").textContent === "-") {
    message(`Molécule « ${saisie} » non trouvée.`, "erreur");
  } else if (!viewer) {
    // infos trouvées sans structure : message laissé par display3D le cas échéant
    if ($("message").hidden) message("");
  } else {
    message("");
  }
}

// ===============================
// Démarrage
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // Fenêtre « Voir en 3D » des TP : mise en page compacte, viewer visible sans défiler.
  if (params.get("embed") === "1" || window.self !== window.top) {
    document.documentElement.classList.add("embed");
    document.body.classList.add("embed");
  }

  const champ = $("search");
  champ.addEventListener("keydown", e => {
    if (e.key === "Enter") searchMolecule();
  });

  // Le viewer suit la taille de son conteneur (ouverture de la fenêtre, rotation de l'écran…).
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => {
      if (viewer) {
        viewer.resize();
        viewer.render();
      }
    }).observe($("viewer"));
  }

  // Lien depuis un TP : molecule/index.html?q=éthanol (ou #q=éthanol).
  // -> champ prérempli et recherche lancée directement.
  const demande = demandeDepuisURL(params);
  if (demande) lancerDemande(demande);

  // Canal de secours : la page parente envoie le nom par postMessage
  // (utile si le serveur a supprimé ?q= lors d'une redirection).
  window.addEventListener("message", e => {
    if (e.source !== window.parent || e.data?.type !== "mol3d:recherche") return;
    lancerDemande(String(e.data.nom ?? ""));
  });

  // Prévient la fenêtre parente que le viewer est prêt à recevoir un nom.
  if (window.parent !== window) {
    window.parent.postMessage({ type: "mol3d:pret" }, "*");
  }
});

// Nom demandé dans l'URL : ?q=... en priorité, sinon #q=...
function demandeDepuisURL(params) {
  const q = params.get("q");
  if (q && q.trim()) return q.trim();

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const h = hash.get("q");
  return h && h.trim() ? h.trim() : "";
}

// Remplit le champ et lance la recherche, une seule fois par nom.
function lancerDemande(nom) {
  const demande = nom.trim();
  if (!demande || demande === derniereDemande) return;
  derniereDemande = demande;
  $("search").value = demande;
  searchMolecule();
}
let viewer;

window.addEventListener("DOMContentLoaded", () => {
  viewer = $3Dmol.createViewer("viewer", {
    backgroundColor: "white"
  });

  const champ = document.getElementById("search");

  champ.addEventListener("keydown", e => {
    if (e.key === "Enter") searchMolecule();
  });

  // Lien depuis un TP : molecule/index.html?q=éthanol
  // -> champ prérempli et recherche lancée directement.
  const demande = new URLSearchParams(window.location.search).get("q");
  if (demande && demande.trim()) {
    champ.value = demande.trim();
    searchMolecule();
  }
});

// ===============================
// Normalisation
// ===============================
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ===============================
// Affichage 3D
// ===============================
function display3D(structure, format = "xyz") {
  viewer.clear();
  viewer.addModel(structure, format);
  viewer.setStyle({}, {
    stick: {},
    sphere: { scale: 0.3 }
  });
  viewer.zoomTo();
  viewer.render();
}

// ===============================
// Recherche locale JSON
// ===============================
async function searchLocalMolecule(name, onlyStructure = false) {
  const res = await fetch("molecules.json");
  const localData = await res.json();

  const query = normalize(name);

  // 1. nom ou alias identique, 2. nom ou alias qui contient la saisie
  const noms = m => [m.nom, ...(m.aliases || [])].map(normalize);

  const mol =
    localData.find(m => noms(m).includes(query)) ||
    localData.find(m => noms(m).some(n => n.includes(query)));

  if (!mol) return null;

  if (!onlyStructure) {
    document.getElementById("formule").textContent = mol.formule || "-";
    document.getElementById("masse").textContent = mol.masse || "-";
  }
  document.getElementById("nom").textContent = mol.nom;

  if (mol.structure) {
    display3D(mol.structure, "xyz");
  }

  return mol;
}

// ===============================
// Recherche principale
// ===============================
async function searchMolecule() {
  const rawName = document.getElementById("search").value.trim();
  const name = normalize(rawName);

  if (!name) return;

  // reset visuel
  document.getElementById("formule").textContent = "-";
  document.getElementById("masse").textContent = "-";
  viewer.clear();
  viewer.render();

  document.getElementById("nom").textContent = "-";

  // =====================================================
  // 0. Fichier local molecules.json en priorité : noms français
  //    des TP, réponse immédiate, fonctionne sans connexion.
  // =====================================================
  try {
    const locale = await searchLocalMolecule(rawName);
    if (locale && locale.structure) return;
  } catch (error) {
    console.warn("molecules.json indisponible → PubChem");
  }

  let pubchemWorked = false;

  // =====================================================
  // 1. Infos PubChem (formule + masse)
  // =====================================================
  try {
    const infoUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight/JSON`;

    const infoRes = await fetch(infoUrl);

    if (infoRes.ok) {
      const infoData = await infoRes.json();

      if (
        infoData.PropertyTable &&
        infoData.PropertyTable.Properties &&
        infoData.PropertyTable.Properties.length > 0
      ) {
        const props = infoData.PropertyTable.Properties[0];

        document.getElementById("formule").textContent =
          props.MolecularFormula || "-";

        document.getElementById("masse").textContent =
          props.MolecularWeight || "-";

        pubchemWorked = true;
      }
    }
  } catch (error) {
    console.warn("Infos PubChem indisponibles");
  }

  // =====================================================
  // 2. Structure 3D PubChem
  // =====================================================
  try {
    const structureUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/record/SDF/?record_type=3d`;

    const sdfRes = await fetch(structureUrl);

    if (sdfRes.ok) {
      const sdf = await sdfRes.text();

      // Vérifie si vraie structure
      if (sdf && sdf.length > 100) {
        display3D(sdf, "sdf");
        return;
      }
    }

    throw new Error("Pas de vraie structure 3D");

  } catch (error) {
    console.warn("3D PubChem absente → fallback JSON");

    // fallback uniquement structure
    const localMol = await searchLocalMolecule(name, pubchemWorked);

    if (localMol) return;
  }

  // =====================================================
  // 3. Si PubChem totalement échoué
  // =====================================================
  if (!pubchemWorked) {
    console.warn("Fallback complet JSON");

    const localMol = await searchLocalMolecule(name);

    if (!localMol) {
      alert("Molécule non trouvée");
    }
  }
}

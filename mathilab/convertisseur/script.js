// =========================================================
// CONVERTISSEUR D'UNITÉS — script.js
//
// Principe : chaque catégorie possède une liste d'unités,
// chacune définie par :
//   - name : nom affiché (ex. "kg")
//   - e    : exposant tel que 1 unité = 10^e unité de référence
//   - w    : largeur en nombre de cases-chiffres de la colonne
//            (1 pour la plupart des masses/longueurs, 2 pour les
//            aires, 3 pour les volumes, et 3 pour le saut
//            milli -> micro qui vaut aussi 3 ordres de grandeur)
//
// Le tableau reconstitue la valeur en unité de référence
// (gramme, mètre, m² ou m³) chiffre par chiffre : la case la
// plus à droite du groupe "unité de référence" est toujours
// suivie de la virgule.
// =========================================================

const CATEGORIES = [
  {
    id: "masses",
    label: "Masses",
    icone: "fa-weight-hanging",
    refLabel: "g",
    units: [
      { name: "kg", e: 3, w: 1 },
      { name: "hg", e: 2, w: 1 },
      { name: "dag", e: 1, w: 1 },
      { name: "g", e: 0, w: 1 },
      { name: "dg", e: -1, w: 1 },
      { name: "cg", e: -2, w: 1 },
      { name: "mg", e: -3, w: 1 },
      { name: "µg", e: -6, w: 3 }
    ],
    note: "Entre le mg et le µg, l'écart vaut 3 rangs (comme pour un volume) : le µg occupe donc 3 cases."
  },
  {
    id: "longueurs",
    label: "Distances",
    icone: "fa-ruler",
    refLabel: "m",
    units: [
      { name: "km", e: 3, w: 1 },
      { name: "hm", e: 2, w: 1 },
      { name: "dam", e: 1, w: 1 },
      { name: "m", e: 0, w: 1 },
      { name: "dm", e: -1, w: 1 },
      { name: "cm", e: -2, w: 1 },
      { name: "mm", e: -3, w: 1 },
      { name: "µm", e: -6, w: 3 }
    ],
    note: "Entre le mm et le µm, l'écart vaut 3 rangs : le µm occupe donc 3 cases."
  },
  {
    id: "aires",
    label: "Surfaces",
    icone: "fa-vector-square",
    refLabel: "m²",
    units: [
      { name: "km²", e: 6, w: 2 },
      { name: "hm²", e: 4, w: 2 },
      { name: "dam²", e: 2, w: 2 },
      { name: "m²", e: 0, w: 2 },
      { name: "dm²", e: -2, w: 2 },
      { name: "cm²", e: -4, w: 2 },
      { name: "mm²", e: -6, w: 2 }
    ],
    note: "Chaque unité d'aire occupe 2 cases : 1 unité linéaire de plus = 2 rangs (car aire = longueur²)."
  },
  {
    id: "volumes",
    label: "Volumes",
    icone: "fa-cube",
    refLabel: "m³",
    units: [
      { name: "km³", e: 9, w: 3 },
      { name: "hm³", e: 6, w: 3 },
      { name: "dam³", e: 3, w: 3 },
      { name: "m³", e: 0, w: 3 },
      { name: "dm³", e: -3, w: 3 },
      { name: "cm³", e: -6, w: 3 },
      { name: "mm³", e: -9, w: 3 }
    ],
    note: "Chaque unité de volume occupe 3 cases (car volume = longueur³). Rappel : 1 dm³ = 1 L, donc 1 m³ = 1000 L et 1 cm³ = 1 mL."
  }
];

// ---------------------------------------------------------
// Construit la liste ordonnée des cases-chiffres d'une
// catégorie (de la plus grande unité à la plus petite).
// ---------------------------------------------------------
function construireCases(units) {
  const cases = [];
  units.forEach(u => {
    for (let k = 0; k < u.w; k++) {
      cases.push({
        exp: u.e + u.w - 1 - k,
        unit: u.name,
        premiereDuGroupe: k === 0,
        largeurGroupe: u.w,
        estReference: u.e === 0
      });
    }
  });
  return cases;
}

// ---------------------------------------------------------
// Formate un nombre "propre" pour l'affichage (arrondi
// raisonnable, sans notation scientifique, sans zéros
// parasites dus aux flottants).
// ---------------------------------------------------------
function formaterNombre(valeur) {
  if (!isFinite(valeur)) return "—";
  if (valeur === 0) return "0";

  const arrondi = parseFloat(valeur.toPrecision(10));
  const abs = Math.abs(arrondi);

  let texte;
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
    texte = arrondi.toExponential(4).replace(".", ",");
  } else {
    // Jusqu'à 9 décimales, sans zéros inutiles à la fin
    texte = arrondi
      .toFixed(9)
      .replace(/0+$/, "")
      .replace(/\.$/, "")
      .replace(".", ",");
    if (texte === "" || texte === "-") texte = "0";
  }
  return texte;
}

// ---------------------------------------------------------
// Extrait le chiffre situé à la position "exp" (puissance de
// 10) de la valeur de référence. Le "epsilon" compense les
// petites erreurs d'arrondi en virgule flottante.
// ---------------------------------------------------------
function chiffreALaPosition(valeurRef, exp) {
  const echelle = Math.pow(10, exp);
  const quotient = Math.abs(valeurRef) / echelle + 1e-9;
  return Math.floor(quotient) % 10;
}

// ---------------------------------------------------------
// Construction du panneau HTML d'une catégorie
// ---------------------------------------------------------
function construirePanneau(cat) {
  const cases = construireCases(cat.units);
  const expMax = cases[0].exp;

  const panneau = document.createElement("div");
  panneau.className = "panneau";
  panneau.dataset.cat = cat.id;

  // ---- Titre ----
  const titre = document.createElement("h2");
  titre.innerHTML = `<i class="fa-solid ${cat.icone}"></i> ${cat.label}`;
  panneau.appendChild(titre);

  // ---- Zone de saisie ----
  const saisie = document.createElement("div");
  saisie.className = "saisie";

  const idInput = `valeur-${cat.id}`;
  const idSelect = `unite-${cat.id}`;

  saisie.innerHTML = `
    <label for="${idInput}">Valeur à convertir :</label>
    <input type="number" id="${idInput}" step="any" placeholder="ex : 12.5">
    <select id="${idSelect}"></select>
  `;
  panneau.appendChild(saisie);

  const select = saisie.querySelector(`#${idSelect}`);
  cat.units.forEach((u, i) => {
    const option = document.createElement("option");
    option.value = u.e;
    option.textContent = u.name;
    if (u.e === 0) option.selected = true;
    select.appendChild(option);
  });

  // ---- Tableau de conversion ----
  const scroll = document.createElement("div");
  scroll.className = "tableau-scroll";

  const table = document.createElement("table");
  table.className = "conversion";

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  cat.units.forEach(u => {
    const th = document.createElement("th");
    th.colSpan = u.w;
    th.textContent = u.name;
    if (u.e === 0) th.classList.add("unite-reference");
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const trBody = document.createElement("tr");
  cases.forEach(c => {
    const td = document.createElement("td");
    td.className = "chiffre";
    if (c.estReference) td.classList.add("reference");
    if (c.estReference && c.exp === 0) td.classList.add("virgule-apres");
    td.dataset.exp = c.exp;
    td.textContent = "0";
    trBody.appendChild(td);
  });
  tbody.appendChild(trBody);
  table.appendChild(tbody);

  scroll.appendChild(table);
  panneau.appendChild(scroll);

  // ---- Résultats équivalents ----
  const resultats = document.createElement("div");
  resultats.className = "resultats";
  resultats.innerHTML = `<h3>Valeur équivalente dans chaque unité :</h3><ul></ul>`;
  panneau.appendChild(resultats);

  if (cat.note) {
    const note = document.createElement("p");
    note.className = "note";
    note.innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${cat.note}`;
    panneau.appendChild(note);
  }

  // ---- Mise à jour dynamique ----
  function mettreAJour() {
    const input = saisie.querySelector(`#${idInput}`);
    const valeurSaisie = parseFloat(input.value.replace(",", "."));
    const exposantChoisi = parseFloat(select.value);

    const valeurRef = isFinite(valeurSaisie)
      ? valeurSaisie * Math.pow(10, exposantChoisi)
      : 0;

    // Remplissage des cases-chiffres
    const tds = tbody.querySelectorAll("td.chiffre");
    tds.forEach((td, i) => {
      const exp = cases[i].exp;
      let chiffre;
      if (i === 0) {
        // Case la plus significative : absorbe un éventuel
        // dépassement (nombre à plus de chiffres que le tableau)
        chiffre = Math.trunc(Math.abs(valeurRef) / Math.pow(10, expMax) + 1e-9);
      } else {
        chiffre = chiffreALaPosition(valeurRef, exp);
      }
      td.textContent = chiffre;
    });

    // Liste des résultats équivalents
    const ul = resultats.querySelector("ul");
    ul.innerHTML = "";
    cat.units.forEach(u => {
      const valeurDansUnite = valeurRef / Math.pow(10, u.e);
      const li = document.createElement("li");
      li.innerHTML = `<strong>${formaterNombre(valeurDansUnite)}</strong> ${u.name}`;
      ul.appendChild(li);
    });
  }

  saisie.querySelector(`#${idInput}`).addEventListener("input", mettreAJour);
  select.addEventListener("change", mettreAJour);

  mettreAJour();

  return panneau;
}

// ---------------------------------------------------------
// Initialisation : onglets + panneaux
// ---------------------------------------------------------
function init() {
  const onglets = document.getElementById("onglets");
  const panneaux = document.getElementById("panneaux");

  CATEGORIES.forEach((cat, index) => {
    const bouton = document.createElement("button");
    bouton.className = "onglet";
    bouton.dataset.cat = cat.id;
    bouton.innerHTML = `<i class="fa-solid ${cat.icone}"></i> ${cat.label}`;
    if (index === 0) bouton.classList.add("actif");
    bouton.addEventListener("click", () => activerCategorie(cat.id));
    onglets.appendChild(bouton);

    const panneau = construirePanneau(cat);
    if (index === 0) panneau.classList.add("actif");
    panneaux.appendChild(panneau);
  });
}

function activerCategorie(id) {
  document.querySelectorAll(".onglet").forEach(b => {
    b.classList.toggle("actif", b.dataset.cat === id);
  });
  document.querySelectorAll(".panneau").forEach(p => {
    p.classList.toggle("actif", p.dataset.cat === id);
  });
}

document.addEventListener("DOMContentLoaded", init);
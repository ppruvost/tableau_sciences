const ctx=document.getElementById("wheel").getContext("2d");

let eleves=[];
let segments=[];
let attribution=[];
let groupesSeance1={};
let groupesSeance2={};

let startAngle=0,arc=0;

// rôles
const roles = [
{nom:"Espion", img:"espion.png"},
{nom:"Rapporteur", img:"rapporteur.png"},
{nom:"Calculateur", img:"calculateur.png"},
{nom:"Stratège", img:"stratege.png"},
{nom:"Médiateur", img:"mediateur.png"}
];

// 🎡 roue
function drawWheel(){
ctx.clearRect(0,0,400,400);

if(segments.length===0){
ctx.fillStyle="#526b83";
ctx.font="16px Arial";
ctx.textAlign="center";
ctx.fillText("Charge fichier",200,205);
return;
}

arc=Math.PI*2/segments.length;

const palette=["#eaf2fb","#dce8f8","#edf5fb","#e3ecfa"];

segments.forEach((s,i)=>{
let angle=startAngle+i*arc;

ctx.beginPath();
ctx.fillStyle=palette[i%palette.length];
ctx.strokeStyle="#c8d9ee";
ctx.lineWidth=1;
ctx.moveTo(200,200);
ctx.arc(200,200,200,angle,angle+arc);
ctx.fill();
ctx.stroke();

ctx.save();
ctx.translate(200,200);
ctx.rotate(angle+arc/2);
ctx.fillStyle="#243b73";
ctx.font="14px Arial";
ctx.textAlign="right";
ctx.fillText(s,180,10);
ctx.restore();
});

// flèche
ctx.fillStyle="#4169e1";
ctx.beginPath();
ctx.moveTo(190,10);
ctx.lineTo(210,10);
ctx.lineTo(200,40);
ctx.fill();
}

// 🎡 spin
function spin(){
if(eleves.length===0)return alert("Charge fichier");

let vitesse = Math.random()*0.3 + 0.4;
let duree = 4000;
let start = Date.now();

(function anim(){
let elapsed = Date.now() - start;
vitesse *= 0.995;
startAngle += vitesse;
drawWheel();

if(elapsed < duree){
requestAnimationFrame(anim);
}else{
attribution = shuffle([...eleves]);
alert("Tirage effectué !");
}
})();
}

// mélange
function shuffle(a){
for(let i=a.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[a[i],a[j]]=[a[j],a[i]];
}
return a;
}

// fichier
function loadFromFile(){
let file=document.getElementById("fileInput").files[0];
if(!file)return alert("Choisir fichier");

let r=new FileReader();
r.onload=e=>{
eleves=e.target.result.split("\n").map(x=>x.trim()).filter(x=>x);
segments=[...eleves];
drawWheel();
};
r.readAsText(file);
}

// =======================
// 🧩 SÉANCE 1 ADAPTATIVE
// =======================
function tirageSeance1(){

  if(attribution.length === 0)
    return alert("Tourne la roue");

  let nbEleves = attribution.length;

  // noms des groupes
  const nomsGroupes = ["A","B","C","D","E"];

  // reset
  groupesSeance1 = {};
  groupesSeance2 = {};

  let tailles = [];

  // =====================================
  // CAS SPÉCIAL : 17 élèves → 5 / 4 / 4 / 4
  // =====================================
  if(nbEleves === 17){
    tailles = [5,4,4,4];
  }

  // =====================================
  // AUTRES CAS
  // =====================================
  else{

    let nbGroupes;

    if(nbEleves <= 10){
      nbGroupes = Math.min(3, Math.floor(nbEleves / 3));
      if(nbGroupes < 1) nbGroupes = 1;
    }
    else if(nbEleves > 20){
      nbGroupes = 5;
    }
    else{
      nbGroupes = 4;
    }

    let base = Math.floor(nbEleves / nbGroupes);
    let reste = nbEleves % nbGroupes;

    for(let i = 0; i < nbGroupes; i++){
      tailles.push(base + (i < reste ? 1 : 0));
    }
  }

  // =====================================
  // CRÉATION DES GROUPES
  // =====================================
  tailles.forEach((taille, i)=>{
    let nom = nomsGroupes[i];
    groupesSeance1[nom] = [];
  });

  // =====================================
  // DISTRIBUTION EXACTE DES ÉLÈVES
  // =====================================
  let index = 0;

  tailles.forEach((taille, i)=>{

    let nomGroupe = nomsGroupes[i];

    // IMPORTANT :
    // slice(index, index + taille)
    // garantit bien 5 / 4 / 4 / 4
    let elevesGroupe = attribution.slice(index, index + taille);

    index += taille;

    let rolesDisponibles = [...roles];

    // retirer espion si groupe < 5
    if(elevesGroupe.length < 5){
      rolesDisponibles = rolesDisponibles.filter(
        r => r.nom !== "Espion"
      );
    }

    // rôles obligatoires
    const rolesObligatoires = ["Rapporteur", "Médiateur"];

    let obligatoires = rolesDisponibles.filter(r =>
      rolesObligatoires.includes(r.nom)
    );

    let autresRoles = rolesDisponibles.filter(r =>
      !rolesObligatoires.includes(r.nom)
    );

    obligatoires = shuffle(obligatoires);
    autresRoles = shuffle(autresRoles);

    let rolesFinal = [];

    // 1. rôles obligatoires
    obligatoires.forEach(role=>{
      if(rolesFinal.length < elevesGroupe.length){
        rolesFinal.push(role);
      }
    });

    // 2. compléter sans doublon
    autresRoles.forEach(role=>{
      if(rolesFinal.length < elevesGroupe.length){
        rolesFinal.push(role);
      }
    });

    // 3. sécurité si besoin
    let j = 0;
    while(rolesFinal.length < elevesGroupe.length){
      rolesFinal.push(
        autresRoles[j % autresRoles.length]
      );
      j++;
    }

    // 4. mélange final
    rolesFinal = shuffle(rolesFinal);

    // 5. attribution aux élèves
    elevesGroupe.forEach((nom, k)=>{

      groupesSeance1[nomGroupe].push({
        nom: nom,
        role: rolesFinal[k],
        roleIndex: k
      });

    });

  });

  afficherSeance1();
}
// =======================
// 🎨 SÉANCE 2
// =======================
function tirageSeance2(){

  if(Object.keys(groupesSeance1).length===0)
    return alert("Fais d'abord la séance 1");

  const couleursBase = [
    "Jaune",
    "Vert",
    "Orange",
    "Rouge",
    "Violet",
    "Bleu"
  ];

  let tous = [];

  Object.values(groupesSeance1).forEach(g=>{
    g.forEach(e=>{
      if(e) tous.push(e);
    });
  });

  tous = shuffle(tous);

  let total = tous.length;

  // minimum 3 élèves par groupe
  let nbGroupesMax = Math.floor(total / 3);

  let nbGroupes = Math.min(couleursBase.length, nbGroupesMax);

  if(nbGroupes < 1) nbGroupes = 1;

  let couleurs = couleursBase.slice(0, nbGroupes);

  let groupes = {};
  couleurs.forEach(c => groupes[c] = []);

  let base = Math.floor(total / nbGroupes);
  let reste = total % nbGroupes;

  let index = 0;

  couleurs.forEach((c, i)=>{

    let tailleGroupe = base + (i < reste ? 1 : 0);

    for(let j=0; j<tailleGroupe; j++){
      if(tous[index]){
        groupes[c].push(tous[index]);
        index++;
      }
    }

  });

  groupesSeance2 = groupes;

  afficherSeance2(groupes);
}
// =======================
// 🖼️ affichage séance 1
// =======================
function afficherSeance1(){

let div=document.getElementById("results");
div.innerHTML="";

Object.keys(groupesSeance1).forEach(g=>{

let c=document.createElement("div");
c.className="card";
c.innerHTML=`<h4>Groupe ${g}</h4>`;

groupesSeance1[g].forEach(e=>{
c.innerHTML+=`
<div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
<img src="${e.role.img}" class="puzzle">
<strong>${e.role.nom}</strong>
<span>- ${e.nom}</span>
</div>`;
});

div.appendChild(c);

});
}

// =======================
// 🖼️ affichage séance 2
// =======================
function afficherSeance2(groupes){

let div=document.getElementById("results");
div.innerHTML="";

Object.keys(groupes).forEach(g=>{

let c=document.createElement("div");
c.className="card";
c.innerHTML=`<h4>Groupe ${g}</h4>`;

groupes[g].forEach(e=>{
c.innerHTML+=`
<div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
<img src="expert.png" class="puzzle">
<strong>Expert</strong>
<span>- ${e.nom}</span>
</div>`;
});

div.appendChild(c);

});
}

// =======================
// 🖨️ EXPORT PDF (Séance 1 + Séance 2)
// Même trame visuelle que les comptes rendus de /laboratory
// (voir roue/compte-rendu.css)
// =======================

function _echapper(s){
  const d = document.createElement("div");
  d.textContent = String(s ?? "");
  return d.innerHTML;
}

function _logoRoueSVG(){
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="19" fill="#EAF2F8" stroke="#1B6CA8" stroke-width="2.4"/>
    <path d="M24 5 A19 19 0 0 1 43 24 L24 24 Z" fill="#1B6CA8"/>
    <path d="M24 24 L43 24 A19 19 0 0 1 33.4 40.5 Z" fill="#0D4F8A"/>
    <circle cx="24" cy="24" r="4.5" fill="#fff" stroke="#0D4F8A" stroke-width="1.6"/>
    <path d="M20 5 L20 2 L28 2 L28 5" stroke="#0D4F8A" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;
}

function _construireBlocGroupe(nomGroupe, membres, libelleRole){
  const lignes = membres.map(e => {
    const nomEleve = _echapper(e.nom);
    const role = libelleRole ? libelleRole : (e.role ? e.role.nom : "");
    return `<tr><td>${nomEleve}</td><td><span class="cr-role-badge">${_echapper(role)}</span></td></tr>`;
  }).join("");

  return `
    <div class="cr-groupe-bloc">
      <h4>Groupe ${_echapper(nomGroupe)} <span style="font-weight:400;color:#6B7280;">(${membres.length} élèves)</span></h4>
      <table class="cr-items"><tbody>${lignes}</tbody></table>
    </div>`;
}

function _construireSectionSeance1(){
  const noms = Object.keys(groupesSeance1);
  if(!noms.length) return "";

  const blocs = noms.map(g => _construireBlocGroupe(g, groupesSeance1[g])).join("");

  return `
    <div class="cr-section">
      <h3>Séance 1 — Groupes adaptatifs (pédagogie différenciée)</h3>
      <div class="cr-groupes-grille">${blocs}</div>
    </div>`;
}

function _construireSectionSeance2(){
  const noms = Object.keys(groupesSeance2);
  if(!noms.length) return "";

  const blocs = noms.map(g => _construireBlocGroupe(g, groupesSeance2[g], "Expert")).join("");

  return `
    <div class="cr-section">
      <h3>Séance 2 — Groupes puzzle (regroupement des experts)</h3>
      <div class="cr-groupes-grille">${blocs}</div>
    </div>`;
}

function _construireTrameRoue(){
  const dateFr = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric"
  });

  const nbGroupes1 = Object.keys(groupesSeance1).length;
  const nbGroupes2 = Object.keys(groupesSeance2).length;

  return `
    <div class="cr-entete">
      <div class="cr-logo">
        ${_logoRoueSVG()}
        <div class="cr-logo-texte">Roue<span>ClassePuzzle</span></div>
      </div>
      <div class="cr-entete-droite">
        Tirage généré le ${dateFr}<br>
        Pédagogie de la classe puzzle
      </div>
    </div>

    <span class="cr-domaine-badge">Pédagogie — Tirage aléatoire</span>
    <div class="cr-titre-tp">Répartition des groupes — Classe puzzle</div>

    <div class="cr-identification">
      <div><div class="cr-label">Date du tirage</div><div class="cr-valeur">${dateFr}</div></div>
      <div><div class="cr-label">Nombre d'élèves</div><div class="cr-valeur">${eleves.length}</div></div>
      <div><div class="cr-label">Groupes séance 1</div><div class="cr-valeur">${nbGroupes1 || "—"}</div></div>
      <div><div class="cr-label">Groupes séance 2</div><div class="cr-valeur">${nbGroupes2 || "—"}</div></div>
    </div>

    ${_construireSectionSeance1()}
    ${_construireSectionSeance2()}

    <div class="cr-pied">
      <span>Roue Classe Puzzle — Tirage aléatoire</span>
      <span>Pédagogie du puzzle</span>
    </div>`;
}

function exporterPDF(){
  if(Object.keys(groupesSeance1).length === 0 && Object.keys(groupesSeance2).length === 0){
    return alert("Effectue d'abord le tirage de la séance 1 (et éventuellement de la séance 2) avant d'exporter.");
  }

  const contenuHTML = _construireTrameRoue();

  let conteneur = document.getElementById("cr-print-container");
  if(!conteneur){
    conteneur = document.createElement("div");
    conteneur.id = "cr-print-container";
  }
  if(conteneur.parentElement !== document.body){
    document.body.appendChild(conteneur);
  }

  conteneur.innerHTML = contenuHTML;

  // force le navigateur à calculer la mise en page
  void conteneur.offsetHeight;

  document.body.classList.add("cr-printing");

  void document.body.offsetHeight;

  const nettoyer = () => {
    document.body.classList.remove("cr-printing");
    conteneur.replaceChildren();
    window.removeEventListener("afterprint", nettoyer);
  };

  window.addEventListener("afterprint", nettoyer);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.focus();
        window.print();
      });
    });
  });
}

drawWheel();

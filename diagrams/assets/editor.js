/* ════════════════════════════════════════════════════════════════
   assets/editor.js — MermozLab / Éditeur diagrams.net

   Trois rôles :
   1. Construire dynamiquement l'URL de l'éditeur (iframe + lien
      "plein écran"), en ajoutant à clibs le chemin ABSOLU de la
      bibliothèque de verrerie MermozLab (libraries/chimie/
      verrerie-mermozlab.xml), calculé depuis l'URL de la page —
      ce fichier fait partie du dépôt et son adresse finale dépend
      de l'hébergement (GitHub Pages, domaine propre, etc.), d'où
      le calcul dynamique plutôt qu'une URL codée en dur.
   2. Gérer le protocole postMessage requis par embed.diagrams.net :
      l'iframe envoie un événement "init" une fois chargée, et
      attend en retour une action "load" contenant un diagramme à
      afficher. Sans cette réponse, l'éditeur reste bloqué (barre
      grisée, aucune page ni panneau de formes).
   3. Enregistrer le diagramme au format natif .drawio : en mode
      embed/proto=json, diagrams.net délègue entièrement
      l'enregistrement à la page hôte (Ctrl+S / File > Save dans
      l'éditeur restent sans effet sans ce relais). Le bouton
      "Enregistrer sous .drawio" du bandeau et l'action native
      "save" de l'éditeur déclenchent tous les deux le téléchargement
      du XML courant (suivi via les événements "autosave"), avec une
      vraie boîte "Enregistrer sous" (choix du nom et du dossier) sur
      les navigateurs supportant l'API File System Access, et un
      repli par lien de téléchargement classique sinon.
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var EMPTY_XML =
    '<mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" ' +
    'tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" ' +
    'pageWidth="850" pageHeight="1100" math="0" shadow="0">' +
    '<root><mxCell id="0" /><mxCell id="1" parent="0" /></root>' +
    '</mxGraphModel>';

  var EMBED_ORIGIN = "https://embed.diagrams.net";

  var EXTERNAL_CLIBS = [
    "https://raw.githubusercontent.com/owntech-foundation/LibraryDrawIO/main/circuit_library.xml",
    "https://raw.githubusercontent.com/bzarek/draw.io-electrical/main/Custom_Electrical.xml",
    "https://jgraph.github.io/drawio-libs/libs/material-design-icons.xml"
  ];

  function localLibraryUrl() {
    try {
      return new URL("libraries/chimie/verrerie-mermozlab.xml", window.location.href).href;
    } catch (e) {
      return null;
    }
  }

  function buildClibsParam() {
    var urls = EXTERNAL_CLIBS.slice();
    var local = localLibraryUrl();
    if (local) { urls.push(local); }
    return urls.map(function (u) { return "U" + encodeURIComponent(u); }).join(";");
  }

  function buildUrl(base, embedMode) {
    var params = [
      "splash=0",
      "libs=general;electrical",
      "clibs=" + buildClibsParam()
    ];
    if (embedMode) {
      params.unshift("embed=1&ui=kennedy&spin=1&proto=json&libraries=1");
    }
    return base + "/?" + params.join("&");
  }

  var frame = document.getElementById("drawio-frame");
  var status = document.getElementById("status");
  var fullTabLink = document.getElementById("fulltab-link");
  var btnEnregistrer = document.getElementById("btn-enregistrer-drawio");

  // XML du diagramme actuellement affiché dans l'iframe, tenu a jour
  // via les evenements "autosave"/"save" de diagrams.net, pour que le
  // bouton "Enregistrer sous .drawio" puisse toujours proposer le
  // contenu courant sans aller-retour supplementaire avec l'iframe.
  var currentXml = EMPTY_XML;

  if (btnEnregistrer) { btnEnregistrer.disabled = true; }

  if (fullTabLink) {
    fullTabLink.href = buildUrl("https://app.diagrams.net", false);
  }
  if (frame) {
    frame.src = buildUrl("https://embed.diagrams.net", true);
  }

  /**
   * Declenche le telechargement du XML fourni au format natif
   * diagrams.net (.drawio). Utilise l'API File System Access
   * (window.showSaveFilePicker) quand le navigateur la propose, pour
   * une veritable boite de dialogue "Enregistrer sous" (choix du nom
   * ET du dossier) ; sinon, repli sur un lien <a download> classique
   * (le fichier part alors dans le dossier de telechargements, avec
   * le nom saisi).
   */
  function enregistrerSousDrawio(xml) {
    if (typeof xml !== "string" || !xml) {
      window.alert("Aucun diagramme a enregistrer pour le moment.");
      return;
    }

    var nomParDefaut = "diagramme.drawio";
    var blob = new Blob([xml], { type: "application/xml" });

    if (window.showSaveFilePicker) {
      window.showSaveFilePicker({
        suggestedName: nomParDefaut,
        types: [{
          description: "Fichier diagrams.net (.drawio)",
          accept: { "application/xml": [".drawio"] }
        }]
      }).then(function (handle) {
        return handle.createWritable().then(function (writable) {
          return writable.write(blob).then(function () { return writable.close(); });
        });
      }).catch(function (erreur) {
        if (erreur && erreur.name === "AbortError") { return; }
        telechargerViaLien(blob, nomParDefaut);
      });
      return;
    }

    telechargerViaLien(blob, nomParDefaut);
  }

  function telechargerViaLien(blob, nomParDefaut) {
    var nom = window.prompt("Nom du fichier :", nomParDefaut) || nomParDefaut;
    if (!/\.drawio$/i.test(nom)) { nom += ".drawio"; }

    var url = URL.createObjectURL(blob);
    var lien = document.createElement("a");
    lien.href = url;
    lien.download = nom;
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  if (btnEnregistrer) {
    btnEnregistrer.addEventListener("click", function () {
      enregistrerSousDrawio(currentXml);
    });
  }

  window.addEventListener("message", function (evt) {
    if (evt.origin !== EMBED_ORIGIN) { return; }

    var msg;
    try {
      msg = JSON.parse(evt.data);
    } catch (e) {
      return;
    }

    if (msg.event === "init") {
      if (status) { status.textContent = ""; }
      if (btnEnregistrer) { btnEnregistrer.disabled = false; }
      frame.contentWindow.postMessage(JSON.stringify({
        action: "load",
        xml: EMPTY_XML,
        autosave: 1
      }), EMBED_ORIGIN);
    } else if (msg.event === "autosave") {
      if (typeof msg.xml === "string") { currentXml = msg.xml; }
    } else if (msg.event === "save") {
      // Declenche via Ctrl+S ou File > Save DANS l'editeur diagrams.net
      // lui-meme : sans cette prise en charge, l'action reste sans
      // effet visible (le protocole embed/proto=json delegue
      // entierement l'enregistrement a la page hote).
      if (typeof msg.xml === "string") { currentXml = msg.xml; }
      enregistrerSousDrawio(currentXml);
      frame.contentWindow.postMessage(JSON.stringify({
        action: "status",
        message: "Enregistre",
        modified: false
      }), EMBED_ORIGIN);
    } else if (msg.event === "exit") {
      window.location.href = "index.html";
    }
  });
})();

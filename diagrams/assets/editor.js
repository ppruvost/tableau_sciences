/* ════════════════════════════════════════════════════════════════
   assets/editor.js — MermozLab / Éditeur diagrams.net

   Deux rôles :
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

  if (fullTabLink) {
    fullTabLink.href = buildUrl("https://app.diagrams.net", false);
  }
  if (frame) {
    frame.src = buildUrl("https://embed.diagrams.net", true);
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
      frame.contentWindow.postMessage(JSON.stringify({
        action: "load",
        xml: EMPTY_XML,
        autosave: 1
      }), EMBED_ORIGIN);
    } else if (msg.event === "exit") {
      window.location.href = "index.html";
    }
  });
})();

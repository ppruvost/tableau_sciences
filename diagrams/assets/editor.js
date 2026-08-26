/* ════════════════════════════════════════════════════════════════
   assets/editor.js — MermozLab / Éditeur diagrams.net
   Gère le protocole postMessage requis par embed.diagrams.net :
   l'iframe envoie un événement "init" une fois chargée, et attend
   en retour une action "load" contenant un diagramme à afficher.
   Sans cette réponse, l'éditeur reste bloqué (barre grisée, aucune
   page ni panneau de formes) — voir SOURCES.md / le workflow pour
   le détail du problème corrigé ici.
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var EMPTY_XML =
    '<mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" ' +
    'tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" ' +
    'pageWidth="850" pageHeight="1100" math="0" shadow="0">' +
    '<root><mxCell id="0" /><mxCell id="1" parent="0" /></root>' +
    '</mxGraphModel>';

  var ORIGIN = "https://embed.diagrams.net";
  var frame = document.getElementById("drawio-frame");
  var status = document.getElementById("status");

  window.addEventListener("message", function (evt) {
    if (evt.origin !== ORIGIN) { return; }

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
      }), ORIGIN);
    } else if (msg.event === "exit") {
      window.location.href = "index.html";
    }
  });
})();

/* ════════════════════════════════════════════════════════════════
   assets/editor.js — MermozLab / Éditeur diagrams.net

   Quatre rôles :
   1. Construire dynamiquement l'URL de l'éditeur (iframe + lien
      "plein écran"), en ajoutant à clibs le chemin ABSOLU des
      bibliothèques MermozLab locales (LOCAL_LIBRARIES, format
      mxlibrary), calculé depuis l'URL de la page — ces fichiers
      font partie du dépôt et leur adresse finale dépend de
      l'hébergement (GitHub Pages, domaine propre, etc.), d'où le
      calcul dynamique plutôt qu'une URL codée en dur. La bibliothèque
      native "floorplan" (murs, portes, fenêtres, mobilier) est quant
      à elle activée directement via le paramètre `libs=`.
   2. Gérer le protocole postMessage requis par embed.diagrams.net :
      l'iframe envoie un événement "init" une fois chargée, et
      attend en retour une action "load" contenant un diagramme à
      afficher. Sans cette réponse, l'éditeur reste bloqué (barre
      grisée, aucune page ni panneau de formes).
   3. Charger un modèle de diagramme pré-rempli (MODELES) quand
      l'éditeur est ouvert avec ?modele=<clé> (utilisé par les cartes
      "bibliothèque intégrée" du catalogue, cf. index.html) — par
      exemple editor.html?modele=batiment charge le plan de maison de
      départ (libraries/batiment/modele-plan-maison.xml) à la place
      du diagramme vide.
   4. Enregistrer le diagramme au format natif .drawio : en mode
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

  // Bibliotheques MermozLab au format "mxlibrary" (formes glissables
  // dans le panneau de gauche), hebergees localement dans ce depot.
  // Pour ajouter une nouvelle bibliotheque locale : l'ajouter ici ET
  // dans manifest.json (cle "libraries" du domaine concerne).
  var LOCAL_LIBRARIES = [
    "libraries/chimie/verrerie-mermozlab.xml"
  ];

  function localLibraryUrls() {
    var urls = [];
    LOCAL_LIBRARIES.forEach(function (chemin) {
      try {
        urls.push(new URL(chemin, window.location.href).href);
      } catch (e) { /* ignore */ }
    });
    return urls;
  }

  function buildClibsParam() {
    var urls = EXTERNAL_CLIBS.slice().concat(localLibraryUrls());
    return urls.map(function (u) { return "U" + encodeURIComponent(u); }).join(";");
  }

  function buildUrl(base, embedMode) {
    var params = [
      "splash=0",
      // "floorplan" active la bibliotheque native diagrams.net "Plan
      // d'architecte" (murs, portes, fenetres, mobilier cuisine /
      // salle de bain / chambre, escaliers...) dans le panneau de
      // gauche, sans avoir a reconstruire ces formes a la main -
      // c'est elle qui permet reellement de dessiner des plans de
      // maison completes (cf. modele de depart dans
      // libraries/batiment/modele-plan-maison.xml).
      "libs=general;electrical;floorplan",
      "clibs=" + buildClibsParam()
    ];
    if (embedMode) {
      params.unshift("embed=1&ui=kennedy&spin=1&proto=json&libraries=1");
    }
    return base + "/?" + params.join("&");
  }

  // Modeles de diagramme pre-remplis, ouvrables directement dans
  // l'editeur via editor.html?modele=<cle> (utilise par le catalogue,
  // cf. index.html). Chaque modele est un fichier .drawio complet
  // (pas une bibliotheque de formes) charge par fetch() au demarrage.
  var MODELES = {
    "batiment": "libraries/batiment/modele-plan-maison.xml"
  };

  function extraireXmlDuFichierDrawio(texte) {
    // Un fichier .drawio "standard" enveloppe le diagramme dans
    // <mxfile><diagram>...</diagram></mxfile> ; on ne garde que le
    // contenu de <diagram>, seul attendu par l'action "load" de
    // l'API embed. Deux cas : le diagramme est stocke en XML brut
    // (mxGraphModel comme element enfant direct, notre cas ici -> il
    // faut le RE-SERIALISER, ".textContent" ne renvoie que les
    // noeuds texte et ignore les elements), ou compresse par
    // diagrams.net (base64/deflate, comme simple texte -> on le
    // renvoie tel quel, l'editeur saura le decoder). Si le fichier
    // est deja un <mxGraphModel> nu (cas de EMPTY_XML), on le renvoie
    // tel quel.
    try {
      var doc = new DOMParser().parseFromString(texte, "application/xml");
      if (doc.querySelector("parsererror")) { return texte; }
      var diagram = doc.querySelector("diagram");
      if (!diagram) { return texte; }
      if (diagram.firstElementChild) {
        return new XMLSerializer().serializeToString(diagram.firstElementChild);
      }
      return diagram.textContent;
    } catch (e) {
      return texte;
    }
  }

  function chargerModeleDemande() {
    var params = new URLSearchParams(window.location.search);
    var cle = params.get("modele");
    var chemin = cle && MODELES[cle];
    if (!chemin) { return Promise.resolve(EMPTY_XML); }

    return fetch(chemin)
      .then(function (reponse) {
        if (!reponse.ok) { throw new Error("HTTP " + reponse.status); }
        return reponse.text();
      })
      .then(extraireXmlDuFichierDrawio)
      .catch(function () { return EMPTY_XML; });
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

  // XML a charger dans l'editeur au demarrage : le modele demande via
  // ?modele=... s'il existe, sinon un diagramme vide. Recupere une
  // seule fois pendant que l'iframe se charge, pour etre pret des que
  // l'evenement "init" arrive.
  var xmlInitialPromise = chargerModeleDemande();

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
      xmlInitialPromise.then(function (xml) {
        currentXml = xml;
        frame.contentWindow.postMessage(JSON.stringify({
          action: "load",
          xml: xml,
          autosave: 1
        }), EMBED_ORIGIN);
      });
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

/* ============================================================
   MLDS MATHS — moteur des ateliers QCM
   Lit window.ATELIERS (js/ateliers.js + js/ateliers-fiches.js).
   Aucune note. Si l'élève a ouvert son historique (js/historique.js),
   le résultat de chaque atelier y est ajouté ; sinon rien n'est gardé.
   Liens directs : index.html#atelier=<id>  et  index.html#historique
   ============================================================ */
(function () {
  "use strict";

  const data = window.ATELIERS || [];
  const cloud = window.MLDSCloud;
  const GROUPES = [
    { id: "cuisine", titre: "Les maths avec des recettes", icone: "fa-utensils", note: "Quatre ateliers autour de vraies recettes au micro-ondes." },
    { id: "fiches", titre: "Des problèmes pour s'entraîner", icone: "fa-puzzle-piece", note: "Inspirés des fiches d'accompagnement renforcé d'Eduscol et des guides sur la résolution de problèmes." }
  ];

  const groupesEl = document.getElementById("ateliers-groupes");
  const vueListe = document.getElementById("vue-liste");
  const vueAtelier = document.getElementById("vue-atelier");
  const vueHisto = document.getElementById("vue-historique");
  const contenu = document.getElementById("atelier-contenu");
  const histoContenu = document.getElementById("historique-contenu");

  function el(tag, props, children) {
    const n = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else n.setAttribute(k, v);
    });
    (children || []).forEach((c) => n.appendChild(c));
    return n;
  }

  function parId(id) { return data.find((a) => a.id === id); }

  // ------------------------------------------------------- navigation
  function montrer(vue) {
    vueListe.hidden = vue !== "liste";
    vueAtelier.hidden = vue !== "atelier";
    vueHisto.hidden = vue !== "historique";
    window.scrollTo(0, 0);
  }

  function afficherListe() {
    contenu.innerHTML = "";
    histoContenu.innerHTML = "";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    montrer("liste");
  }

  function ouvrir(atelier) {
    vueAtelier.className = "carte";
    vueAtelier.style.setProperty("--accent", "var(--" + atelier.couleur + "-1)");
    vueAtelier.style.setProperty("--accent-fonce", "var(--" + atelier.couleur + "-2)");
    montrer("atelier");
    jouer(atelier, 0, 0, []);
  }

  // ----------------------------------------------------------- atelier
  function entete(atelier) {
    const bloc = el("div", { class: "atelier-entete" }, [
      el("h2", {}, [el("i", { class: "fa-solid " + atelier.icone, "aria-hidden": "true" }), document.createTextNode(" " + atelier.titre + " — " + atelier.sousTitre)]),
      el("p", { text: atelier.intro })
    ]);
    if (atelier.sources && window.citerSources) {
      bloc.appendChild(el("p", { class: "source-atelier", html: window.citerSources(atelier.sources) }));
    }
    return bloc;
  }

  function jouer(atelier, index, bonnes, trace) {
    contenu.innerHTML = "";
    contenu.appendChild(entete(atelier));

    if (index >= atelier.questions.length) {
      afficherBilan(atelier, bonnes, trace);
      return;
    }

    const q = atelier.questions[index];
    contenu.appendChild(el("p", { class: "progression", text: "Question " + (index + 1) + " sur " + atelier.questions.length }));
    contenu.appendChild(el("p", { class: "enonce", text: q.enonce }));

    const zoneChoix = el("div", { class: "choix", role: "group", "aria-label": "Choix de réponse" });
    const zoneRetour = el("div", { "aria-live": "polite" });
    let repondu = false;

    q.choix.forEach((texte, i) => {
      const b = el("button", { type: "button", text: texte });
      b.addEventListener("click", () => {
        if (repondu) return;
        repondu = true;
        const ok = i === q.bonne;
        zoneChoix.querySelectorAll("button").forEach((x, j) => {
          x.disabled = true;
          if (j === q.bonne) {
            x.classList.add("bonne");
            x.appendChild(el("span", { class: "marque", html: '<i class="fa-solid fa-check" aria-hidden="true"></i> Bonne réponse' }));
          } else if (j === i) {
            x.classList.add("choisi");
            x.appendChild(el("span", { class: "marque", html: '<i class="fa-solid fa-xmark" aria-hidden="true"></i> Ta réponse' }));
          }
        });
        zoneRetour.appendChild(el("div", { class: "retour-reponse" }, [
          el("strong", { text: ok ? "Bien joué ! " : "Pas tout à fait. La bonne réponse est « " + q.choix[q.bonne] + " ». " }),
          document.createTextNode(q.explication)
        ]));
        const dernier = index + 1 >= atelier.questions.length;
        const suite = el("button", { type: "button", class: "btn-simple btn-principal", text: dernier ? "Voir le bilan" : "Question suivante" });
        suite.addEventListener("click", () => jouer(atelier, index + 1, bonnes + (ok ? 1 : 0), trace.concat([ok ? 1 : 0])));
        zoneRetour.appendChild(suite);
        suite.focus();
      });
      zoneChoix.appendChild(b);
    });

    contenu.appendChild(zoneChoix);
    contenu.appendChild(zoneRetour);
  }

  function afficherBilan(atelier, bonnes, trace) {
    const total = atelier.questions.length;
    const message = el("p", { class: "etat-historique", role: "status", "aria-live": "polite" });
    const bilan = el("div", { class: "bilan" }, [
      el("p", { text: "Atelier terminé : " + bonnes + " réponse(s) trouvée(s) du premier coup sur " + total + ". Ce n'est pas une note : relis les explications si tu veux, et recommence quand tu veux." }),
      message,
      el("div", { class: "actions-atelier" }, [
        el("button", { type: "button", class: "btn-simple btn-principal", text: "Refaire l'atelier" }),
        el("button", { type: "button", class: "btn-simple", text: "Choisir un autre atelier" })
      ])
    ]);
    const [encore, autre] = bilan.querySelectorAll("button");
    encore.addEventListener("click", () => jouer(atelier, 0, 0, []));
    autre.addEventListener("click", afficherListe);
    contenu.appendChild(bilan);

    if (cloud && cloud.session()) {
      message.textContent = "Ajout à ton historique…";
      cloud.enregistrer("atelier", atelier.id, atelier.titre, bonnes, total, { q: trace }).then((ok) => {
        message.textContent = ok
          ? "Ce résultat est ajouté à ton historique."
          : "Impossible d'enregistrer ce résultat pour le moment. Ton travail reste valable, tu peux continuer.";
      });
    } else if (cloud && cloud.disponible()) {
      message.textContent = "Pour garder une trace de tes ateliers, retrouve ton historique en haut de la page.";
    }
  }

  // -------------------------------------------------------- historique
  function dateFr(iso) {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
  function points(score, total) {
    return "●".repeat(score) + "○".repeat(Math.max(0, total - score));
  }

  function dessinerHistorique(res) {
    histoContenu.innerHTML = "";
    const s = cloud && cloud.session();
    histoContenu.appendChild(el("h2", { class: "titre-section", html: '<i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> Mon historique' }));

    if (!s) {
      histoContenu.appendChild(el("p", { text: "Retrouve d'abord ton historique avec ton prénom, ton nom et ta date de naissance (en haut de la page d'accueil des ateliers)." }));
      return;
    }
    const lignes = (res && res.historique) || [];
    if (!lignes.length) {
      histoContenu.appendChild(el("p", { class: "vide", text: "Rien pour le moment. Fais un atelier : son résultat apparaîtra ici." }));
      return;
    }

    const ateliers = lignes.filter((l) => l.type === "atelier");
    if (ateliers.length) {
      histoContenu.appendChild(el("h3", { text: "Tes ateliers" }));
      const table = el("table", { class: "histo-table" });
      table.appendChild(el("caption", { class: "sr-seulement", text: "Résumé par atelier" }));
      table.appendChild(el("thead", { html: "<tr><th scope=\"col\">Atelier</th><th scope=\"col\">Dernier passage</th><th scope=\"col\">Passages</th><th scope=\"col\"></th></tr>" }));
      const corps = el("tbody");
      data.forEach((a) => {
        const passages = ateliers.filter((l) => l.ref === a.id);
        if (!passages.length) return;
        const dernier = passages[0];
        const tr = el("tr");
        tr.appendChild(el("th", { scope: "row", text: a.titre }));
        tr.appendChild(el("td", { html: '<span aria-label="' + dernier.score + ' sur ' + dernier.total + ' du premier coup">' + points(dernier.score, dernier.total) + '</span> ' + dernier.score + "/" + dernier.total + "<br><small>" + dateFr(dernier.cree_le) + "</small>" }));
        tr.appendChild(el("td", { text: String(passages.length) }));
        const cell = el("td");
        const b = el("button", { type: "button", class: "btn-simple", text: "Refaire" });
        b.addEventListener("click", () => { location.hash = "atelier=" + a.id; });
        cell.appendChild(b);
        tr.appendChild(cell);
        corps.appendChild(tr);
      });
      table.appendChild(corps);
      histoContenu.appendChild(el("div", { class: "histo-defile" }, [table]));
    }

    const parcours = lignes.filter((l) => l.type !== "atelier");
    if (parcours.length) {
      histoContenu.appendChild(el("h3", { text: "Ton parcours individuel" }));
      const ul = el("ul", { class: "histo-liste" });
      parcours.slice(0, 40).forEach((l) => {
        const icone = l.type === "module" ? "fa-circle-check" : "fa-list-check";
        const libelle = l.type === "module" ? "Module réalisé : " : "Positionnement : ";
        ul.appendChild(el("li", { html: '<i class="fa-solid ' + icone + '" aria-hidden="true"></i> ' + libelle + (l.titre ? l.titre.replace(/[<>&]/g, "") : "") + " <small>— " + dateFr(l.cree_le) + "</small>" }));
      });
      histoContenu.appendChild(ul);
    }
  }

  async function ouvrirHistorique() {
    montrer("historique");
    dessinerHistorique(null);
    if (!(cloud && cloud.session())) return;
    histoContenu.appendChild(el("p", { text: "Chargement…" }));
    try {
      dessinerHistorique(await cloud.recharger());
    } catch (e) {
      histoContenu.appendChild(el("p", { class: "vide", text: "L'historique ne répond pas pour le moment. Réessaie dans un instant." }));
    }
  }

  // --------------------------------------------------------- accueil
  function dessinerAccueil() {
    GROUPES.forEach((g) => {
      const ateliers = data.filter((a) => (a.groupe || "cuisine") === g.id);
      if (!ateliers.length) return;
      groupesEl.appendChild(el("h2", { class: "titre-section", html: '<i class="fa-solid ' + g.icone + '" aria-hidden="true"></i> ' + g.titre }));
      groupesEl.appendChild(el("p", { class: "note-groupe", text: g.note }));
      const grille = el("div", { class: "ateliers-grille" });
      ateliers.forEach((a) => {
        const carte = el("button", { type: "button", class: "carte-atelier " + a.couleur }, [
          el("i", { class: "fa-solid " + a.icone, "aria-hidden": "true" }),
          el("strong", { text: a.titre }),
          el("span", { text: a.sousTitre + " · " + a.questions.length + " questions" })
        ]);
        carte.addEventListener("click", () => { location.hash = "atelier=" + a.id; });
        grille.appendChild(carte);
      });
      groupesEl.appendChild(grille);
    });
  }

  function suivreAdresse() {
    const h = location.hash.replace(/^#/, "");
    if (h === "historique") { ouvrirHistorique(); return; }
    const m = h.match(/^atelier=([\w-]+)$/);
    const a = m && parId(m[1]);
    if (a) ouvrir(a);
    else montrer("liste");
  }

  document.getElementById("btn-retour-liste").addEventListener("click", afficherListe);
  document.getElementById("btn-retour-liste-histo").addEventListener("click", afficherListe);
  window.addEventListener("hashchange", suivreAdresse);

  if (cloud && document.getElementById("panneau-eleve")) {
    cloud.monterPanneau(document.getElementById("panneau-eleve"), {
      onConnecte: (res) => {
        const nb = (res.historique || []).length;
        const message = res.nouveau
          ? "Nouveau dossier créé. Si tu pensais en avoir déjà un, vérifie l'orthographe de ton prénom, de ton nom et ta date de naissance."
          : "Dossier retrouvé : " + nb + " activité" + (nb > 1 ? "s" : "") + " dans ton historique.";
        const etat = document.querySelector("#panneau-eleve .mlds-etat");
        if (etat) etat.textContent = message;
        if (!res.nouveau && nb) location.hash = "historique";
      },
      onHistorique: () => { location.hash = "historique"; }
    });
    window.addEventListener("mlds:session", () => { if (!vueHisto.hidden) ouvrirHistorique(); });
  }

  dessinerAccueil();
  suivreAdresse();
})();

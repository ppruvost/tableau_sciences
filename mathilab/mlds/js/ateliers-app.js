/* ============================================================
   MLDS MATHS — moteur des ateliers QCM
   Lit window.ATELIERS (js/ateliers.js). Aucune note, aucune
   sauvegarde : on répond, on lit l'explication, on continue.
   ============================================================ */
(function () {
  "use strict";

  const data = window.ATELIERS || [];
  const grille = document.getElementById("ateliers-grille");
  const vueListe = document.getElementById("vue-liste");
  const vueAtelier = document.getElementById("vue-atelier");
  const contenu = document.getElementById("atelier-contenu");
  const btnRetour = document.getElementById("btn-retour-liste");

  function el(tag, props, children) {
    const n = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v);
    });
    (children || []).forEach((c) => n.appendChild(c));
    return n;
  }

  function afficherListe() {
    vueAtelier.hidden = true;
    vueListe.hidden = false;
    contenu.innerHTML = "";
    window.scrollTo(0, 0);
  }

  function ouvrir(atelier) {
    vueListe.hidden = true;
    vueAtelier.hidden = false;
    vueAtelier.className = "carte";
    vueAtelier.style.setProperty("--accent", `var(--${atelier.couleur}-1)`);
    vueAtelier.style.setProperty("--accent-fonce", `var(--${atelier.couleur}-2)`);
    jouer(atelier, 0, 0);
    window.scrollTo(0, 0);
  }

  function entete(atelier) {
    return el("div", { class: "atelier-entete" }, [
      el("h2", {}, [el("i", { class: "fa-solid " + atelier.icone }), document.createTextNode(" " + atelier.titre + " — " + atelier.sousTitre)]),
      el("p", { text: atelier.intro })
    ]);
  }

  function jouer(atelier, index, bonnes) {
    contenu.innerHTML = "";
    contenu.appendChild(entete(atelier));

    if (index >= atelier.questions.length) {
      const bilan = el("div", { class: "bilan" }, [
        el("p", { text: `Atelier terminé : ${bonnes} réponse(s) trouvée(s) du premier coup sur ${atelier.questions.length}. Ce n'est pas une note : relis les explications si tu veux, et recommence quand tu veux.` }),
        el("div", { class: "actions-atelier" }, [
          el("button", { type: "button", class: "btn-simple btn-principal", text: "Refaire l'atelier" }),
          el("button", { type: "button", class: "btn-simple", text: "Choisir un autre atelier" })
        ])
      ]);
      const [again, other] = bilan.querySelectorAll("button");
      again.addEventListener("click", () => jouer(atelier, 0, 0));
      other.addEventListener("click", afficherListe);
      contenu.appendChild(bilan);
      return;
    }

    const q = atelier.questions[index];
    contenu.appendChild(el("p", { class: "progression", text: `Question ${index + 1} sur ${atelier.questions.length}` }));
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
        b.classList.add("choisi");
        zoneChoix.querySelectorAll("button").forEach((x, j) => {
          x.disabled = true;
          if (j === q.bonne) x.classList.add("bonne");
        });
        zoneRetour.appendChild(el("div", { class: "retour-reponse" }, [
          el("strong", { text: ok ? "Bien joué ! " : "Pas tout à fait. La bonne réponse est « " + q.choix[q.bonne] + " ». " }),
          document.createTextNode(q.explication)
        ]));
        const dernier = index + 1 >= atelier.questions.length;
        const suite = el("button", { type: "button", class: "btn-simple btn-principal", text: dernier ? "Voir le bilan" : "Question suivante" });
        suite.addEventListener("click", () => jouer(atelier, index + 1, bonnes + (ok ? 1 : 0)));
        zoneRetour.appendChild(suite);
        suite.focus();
      });
      zoneChoix.appendChild(b);
    });

    contenu.appendChild(zoneChoix);
    contenu.appendChild(zoneRetour);
  }

  data.forEach((a) => {
    const carte = el("button", { type: "button", class: "carte-atelier " + a.couleur }, [
      el("i", { class: "fa-solid " + a.icone, "aria-hidden": "true" }),
      el("strong", { text: a.titre }),
      el("span", { text: a.sousTitre + " · " + a.questions.length + " questions" })
    ]);
    carte.addEventListener("click", () => ouvrir(a));
    grille.appendChild(carte);
  });

  btnRetour.addEventListener("click", afficherListe);
})();

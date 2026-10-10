/* ============================================================
   MLDS — historique personnel de l'élève (Supabase)
   - L'élève s'identifie avec nom + prénom + date de naissance.
   - Ces trois informations ne quittent jamais le navigateur en clair :
     on en tire une empreinte (PBKDF2-SHA256, 100 000 itérations) et seule
     cette empreinte est envoyée à la base.
   - L'identité est gardée dans sessionStorage (effacée à la fermeture de
     l'onglet), jamais dans localStorage : plusieurs élèves partagent les
     mêmes ordinateurs.
   - Tout est facultatif : si la base ne répond pas, les pages fonctionnent
     comme avant, sans rien enregistrer.
   ============================================================ */
(function () {
  "use strict";

  const CFG = window.MLDS_SUPABASE || {};
  const SESSION_KEY = "mlds_session_v1";
  const SEL = "mathilab-mlds-v1";
  const ITERATIONS = 100000;

  function disponible() {
    return Boolean(CFG.url && CFG.cle && window.crypto && window.crypto.subtle);
  }

  function normaliser(texte) {
    return (texte || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
  }

  async function calculerCle(nom, prenom, ddn) {
    const n = normaliser(nom);
    const p = normaliser(prenom);
    if (!n || !p || !/^\d{4}-\d{2}-\d{2}$/.test(ddn || "")) {
      throw new Error("Renseigne ton prénom, ton nom et ta date de naissance.");
    }
    const enc = new TextEncoder();
    const matiere = await crypto.subtle.importKey("raw", enc.encode(n + "|" + p + "|" + ddn), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: enc.encode(SEL), iterations: ITERATIONS },
      matiere, 256
    );
    return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function rpc(fonction, args) {
    const rep = await fetch(CFG.url + "/rest/v1/rpc/" + fonction, {
      method: "POST",
      headers: { apikey: CFG.cle, "Content-Type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!rep.ok) {
      let message = "";
      try { message = (await rep.json()).message || ""; } catch (e) { /* corps vide */ }
      throw new Error(message || "Erreur " + rep.status);
    }
    const texte = await rep.text();
    return texte ? JSON.parse(texte) : null;
  }

  function lireSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; }
  }
  function ecrireSession(s) {
    try {
      if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch (e) { /* stockage indisponible : la session ne survit pas à la page */ }
    window.dispatchEvent(new CustomEvent("mlds:session", { detail: s }));
  }

  const MLDSCloud = {
    disponible,
    session: lireSession,

    /** Ouvre (ou crée) le dossier de l'élève et renvoie { nouveau, historique, etats }. */
    async ouvrirSession({ nom, prenom, ddn, classe }) {
      if (!disponible()) throw new Error("L'historique en ligne n'est pas disponible sur cet appareil.");
      const cle = await calculerCle(nom, prenom, ddn);
      const resultat = await rpc("mlds_ouvrir", { p_cle: cle, p_classe: classe || null });
      ecrireSession({ cle, prenom: (prenom || "").trim() });
      return resultat;
    },

    /** Recharge l'historique de la session en cours. */
    async recharger() {
      const s = lireSession();
      if (!s) return null;
      return rpc("mlds_ouvrir", { p_cle: s.cle, p_classe: null });
    },

    /** Ajoute une ligne à l'historique. Renvoie true si c'est enregistré. */
    async enregistrer(type, ref, titre, score, total, details) {
      const s = lireSession();
      if (!s || !disponible()) return false;
      try {
        await rpc("mlds_enregistrer", {
          p_cle: s.cle, p_type: type, p_ref: ref, p_titre: titre || null,
          p_score: score === undefined ? null : score,
          p_total: total === undefined ? null : total,
          p_details: details || null
        });
        return true;
      } catch (e) {
        console.warn("Historique : enregistrement impossible", e);
        return false;
      }
    },

    /** Sauvegarde l'état courant d'une activité (écrase le précédent). */
    async sauverEtat(nom, details) {
      const s = lireSession();
      if (!s || !disponible()) return false;
      try {
        await rpc("mlds_sauver_etat", { p_cle: s.cle, p_nom: nom, p_details: details });
        return true;
      } catch (e) {
        console.warn("Historique : sauvegarde impossible", e);
        return false;
      }
    },

    /** Efface définitivement le dossier de l'élève connecté. */
    async effacer() {
      const s = lireSession();
      if (!s) return;
      await rpc("mlds_effacer", { p_cle: s.cle });
      ecrireSession(null);
    },

    deconnecter() { ecrireSession(null); },

    /** Construit le panneau « Retrouve ton historique » dans un conteneur. */
    monterPanneau(conteneur, options) {
      const opt = Object.assign({ avecClasse: false, onConnecte: null, onHistorique: null }, options);

      function champ(id, libelle, type, extra) {
        return '<div class="mlds-champ"><label for="' + id + '">' + libelle + '</label>' +
          '<input id="' + id + '" type="' + type + '" ' + (extra || "") + '></div>';
      }

      function dessiner() {
        const s = lireSession();
        if (!disponible()) {
          conteneur.innerHTML = '<section class="mlds-id mlds-id-off"><p><i class="fa-solid fa-circle-info" aria-hidden="true"></i> L\'historique en ligne n\'est pas disponible ici. Tu peux travailler normalement, rien ne sera enregistré.</p></section>';
          return;
        }
        if (s) {
          conteneur.innerHTML =
            '<section class="mlds-id mlds-id-ok" aria-label="Historique personnel">' +
            '<p class="mlds-bonjour"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Bonjour ' + echapper(s.prenom) + '.</strong> Ton historique est actif : tes résultats sont enregistrés.</p>' +
            '<div class="mlds-actions">' +
            (opt.onHistorique ? '<button type="button" class="mlds-btn mlds-btn-principal" data-act="historique"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> Mon historique</button>' : "") +
            '<button type="button" class="mlds-btn" data-act="changer"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Changer d\'élève</button>' +
            '<button type="button" class="mlds-btn mlds-btn-danger" data-act="effacer"><i class="fa-solid fa-trash" aria-hidden="true"></i> Effacer mon historique</button>' +
            '</div><p class="mlds-etat" role="status" aria-live="polite"></p></section>';
          conteneur.querySelector('[data-act="changer"]').addEventListener("click", () => { MLDSCloud.deconnecter(); });
          conteneur.querySelector('[data-act="effacer"]').addEventListener("click", async () => {
            if (!window.confirm("Effacer pour toujours ton historique ? Cette action est définitive.")) return;
            const etat = conteneur.querySelector(".mlds-etat");
            try { await MLDSCloud.effacer(); } catch (e) { etat.textContent = "Impossible d'effacer pour le moment : " + e.message; }
          });
          const bh = conteneur.querySelector('[data-act="historique"]');
          if (bh) bh.addEventListener("click", opt.onHistorique);
          return;
        }
        conteneur.innerHTML =
          '<section class="mlds-id" aria-labelledby="mlds-id-titre">' +
          '<h2 id="mlds-id-titre"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> Retrouve ton historique</h2>' +
          '<p>C\'est facultatif. Avec ton prénom, ton nom et ta date de naissance, tes résultats sont gardés et tu les retrouves sur n\'importe quel ordinateur. Sans ça, tu travailles normalement : rien n\'est enregistré.</p>' +
          '<form class="mlds-form" novalidate>' +
          champ("mlds-prenom", "Prénom", "text", 'autocomplete="off" required') +
          champ("mlds-nom", "Nom", "text", 'autocomplete="off" required') +
          champ("mlds-ddn", "Date de naissance", "date", "required") +
          (opt.avecClasse ? champ("mlds-classe", "Classe (facultatif)", "text", 'autocomplete="off" maxlength="40"') : "") +
          '<button type="submit" class="mlds-btn mlds-btn-principal"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Retrouver mon historique</button>' +
          '</form><p class="mlds-etat" role="status" aria-live="polite"></p>' +
          '<details class="mlds-info"><summary>Ce qui est enregistré</summary>' +
          '<p>Une empreinte chiffrée de ton prénom, de ton nom et de ta date de naissance (pas ton nom en clair), ta classe si tu l\'écris, et tes résultats aux ateliers. Toute personne qui connaît ces trois informations peut ouvrir cet historique : il ne contient que des résultats d\'ateliers. Tu peux tout effacer quand tu veux.</p></details>' +
          '</section>';

        const form = conteneur.querySelector("form");
        const etat = conteneur.querySelector(".mlds-etat");
        form.addEventListener("submit", async (ev) => {
          ev.preventDefault();
          const bouton = form.querySelector("button[type=submit]");
          bouton.disabled = true;
          etat.textContent = "Recherche de ton dossier…";
          try {
            const classeEl = form.querySelector("#mlds-classe");
            const res = await MLDSCloud.ouvrirSession({
              nom: form.querySelector("#mlds-nom").value,
              prenom: form.querySelector("#mlds-prenom").value,
              ddn: form.querySelector("#mlds-ddn").value,
              classe: classeEl ? classeEl.value : null
            });
            if (opt.onConnecte) opt.onConnecte(res);
          } catch (e) {
            etat.textContent = e.message || "Connexion impossible pour le moment. Tu peux continuer sans historique.";
            bouton.disabled = false;
          }
        });
      }

      window.addEventListener("mlds:session", dessiner);
      dessiner();
      return { redessiner: dessiner };
    }
  };

  function echapper(texte) {
    const d = document.createElement("div");
    d.textContent = texte || "";
    return d.innerHTML;
  }

  window.MLDSCloud = MLDSCloud;
})();

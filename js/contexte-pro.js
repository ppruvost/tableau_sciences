/**
 * js/contexte-pro.js
 * Module partagé : menu déroulant "filière professionnelle" affiché
 * juste après "Capacités évaluées" dans chaque TP, et rendu du
 * contexte professionnel + de la problématique associée.
 *
 * Les niveaux de classe proposés dans le menu sont déduits dynamiquement
 * des tags affichés dans le cadre bleu de l'en-tête (.tp-meta .tag) :
 * seuls les niveaux réellement annoncés par le TP (2nde / 1ère / Term)
 * génèrent un groupe d'options. Le contenu (contexte + problématique)
 * est propre à chaque TP et fourni par l'appelant via `contextes`.
 */

const LIBELLES_NIVEAU = {
    "2nde": "2nde",
    "1ere": "1ère",
    "tle": "Tle"
};

function normaliserNiveau(texte) {
    const t = (texte || "").trim().toLowerCase();
    if (t === "2nde") return "2nde";
    if (t === "1ère" || t === "1ere") return "1ere";
    if (t === "term" || t === "tle" || t === "terminale") return "tle";
    return null;
}

function detecterNiveauxPresents() {
    const niveaux = new Set();
    document.querySelectorAll(".tp-meta .tag").forEach(tag => {
        const niveau = normaliserNiveau(tag.textContent);
        if (niveau) niveaux.add(niveau);
    });
    return niveaux;
}

// Libellés d'activité utilisés uniquement pour l'affichage du bloc
// "Contexte professionnel" lorsqu'un TP fournit plusieurs problématiques
// (une par onglet de manipulation) via `data.problematiques`.
const LIBELLES_ACTIVITE = {
    "dissolution-dilution": "Dissolution / Dilution",
    "identification-ions": "Identification d'ions"
};

// Libellé d'une activité : table ci-dessus, sinon intitulé du bouton d'onglet
// portant le même identifiant (data-tab), sinon l'identifiant lui-même.
function libelleActivite(activite) {
    if (LIBELLES_ACTIVITE[activite]) return LIBELLES_ACTIVITE[activite];
    const bouton = document.querySelector(`.tab-btn[data-tab="${activite}"]`);
    return (bouton && bouton.textContent.trim()) || activite;
}

function rendreContexte(data, avecProblematique = true) {
    if (!data) {
        return avecProblematique
            ? "<p>Sélectionner votre filière professionnelle pour afficher le contexte et la problématique associée.</p>"
            : "<p>Sélectionner votre filière professionnelle pour afficher le contexte professionnel associé.</p>";
    }

    // Contexte seul : la problématique n'est alors affichée qu'en tête de
    // chaque onglet de « Manipulations » et dans les questions (rappels).
    if (!avecProblematique) {
        return `
    <div class="contexte-pro-bloc">
      <h3>Contexte professionnel</h3>
      <p>${data.contexte}</p>
    </div>`;
    }

    let blocProblematiques;

    if (data.problematiques && typeof data.problematiques === "object") {
        const entrees = Object.entries(data.problematiques);
        const plusieurs = entrees.length > 1;
        blocProblematiques = entrees.map(([activite, texte]) => `
      <h3>Problématique${plusieurs ? ` — ${libelleActivite(activite)}` : ""}</h3>
      <p class="problematique-txt" data-activite="${activite}">${texte}</p>`).join("");
    } else {
        blocProblematiques = `
      <h3>Problématique</h3>
      <p class="problematique-txt">${data.problematique}</p>`;
    }

    return `
    <div class="contexte-pro-bloc">
      <h3>Contexte professionnel</h3>
      <p>${data.contexte}</p>${blocProblematiques}
    </div>`;
}

/**
 * Répercute la problématique choisie dans tous les rappels affichés au fil
 * du TP (dernière question de chaque bloc « questions-tp »), sans que
 * l'élève ait à retourner consulter le Contexte professionnel.
 * Cible tout élément portant la classe .problematique-rappel.
 *
 * Si le TP fournit plusieurs problématiques (`data.problematiques`, une par
 * activité), chaque rappel doit porter un attribut `data-activite` pour
 * recevoir la problématique qui lui correspond (ex : le rappel du bloc de
 * questions « identification-ions » porte `data-activite="identification-ions"`).
 * Un rappel sans cet attribut reçoit la problématique unique `data.problematique`
 * (comportement historique, inchangé pour les TP à une seule activité).
 */
function rendreRappelsProblematique(data) {
    const placeholder = "Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher ici la problématique.";

    document.querySelectorAll(".problematique-rappel").forEach(el => {
        if (!data) {
            el.textContent = placeholder;
            return;
        }

        const activite = el.dataset.activite;

        if (activite && data.problematiques && data.problematiques[activite]) {
            el.textContent = data.problematiques[activite];
        } else if (typeof data.problematique === "string") {
            el.textContent = data.problematique;
        } else if (data.problematiques) {
            el.textContent = Object.values(data.problematiques)[0];
        } else {
            el.textContent = placeholder;
        }
    });
}

// Libellés de secours si le catalogue FILIERES_PRO n'a pas d'entrée pour un niveau.
const LIBELLES_FILIERE = {
    remi: "Maintenance des équipements industriels (REMI)",
    gatl: "Gestion-administration, transport, logistique (GATL)",
    mcc: "Métiers de la couture et de la confection",
    tci: "Technicien en chaudronnerie industrielle",
    trpm: "Technicien en réalisation de produits mécaniques",
    agora: "Accueil et relation clients et usagers (AGorA)",
    log: "Logistique"
};

// Filières proposées pour un niveau : catalogue partagé, sinon déduites des
// clés « niveau-filiere » du dictionnaire de contextes propre au TP.
function filieresDuNiveau(niveau, filieres, contextes) {
    const catalogue = filieres && filieres[niveau];
    if (Array.isArray(catalogue) && catalogue.length) return catalogue;

    return Object.keys(contextes)
        .filter(cle => cle.startsWith(`${niveau}-`))
        .map(cle => {
            const id = cle.slice(niveau.length + 1);
            return { id, label: LIBELLES_FILIERE[id] || id.toUpperCase() };
        });
}

/**
 * Initialise le sélecteur de filière professionnelle.
 * @param {Object} params
 * @param {Object} params.filieres  - Catalogue FILIERES_PRO (data/filieres.js)
 * @param {Object} params.contextes - Dictionnaire { "niveau-filiereId": {contexte, problematique} } propre au TP
 * @param {string[]} [params.filieresAutorisees] - Restreint le menu aux seules clés
 *        "niveau-filiereId" listées (ex : capacité évaluée pour certaines filières
 *        seulement selon le référentiel). Sans cette option, comportement inchangé :
 *        toutes les filières du/des niveau(x) détecté(s) sont proposées.
 * @param {string} [params.noteRestriction] - Petit texte affiché sous le menu
 *        lorsque `filieresAutorisees` est fourni, pour préciser que le TP n'est
 *        pas évalué pour les autres niveaux/filières (le pourquoi de la restriction).
 * @param {boolean} [params.afficherProblematique=true] - false : le bloc
 *        « Contexte professionnel » n'affiche que le contexte (la problématique
 *        reste visible dans les rappels .problematique-rappel).
 * @param {string} [params.selectId]
 * @param {string} [params.resultatId]
 */
export function initContextePro({
    filieres,
    contextes,
    filieresAutorisees,
    noteRestriction,
    afficherProblematique = true,
    selectId = "select-filiere-pro",
    resultatId = "contexte-pro-resultat"
} = {}) {
    const select = document.getElementById(selectId);
    const resultat = document.getElementById(resultatId);
    if (!select || !resultat || !contextes) return;

    let niveauxPresents = detecterNiveauxPresents();

    // Aucun tag de niveau reconnu dans l'en-tête : on déduit les niveaux des contextes.
    if (!niveauxPresents.size) {
        Object.keys(contextes).forEach(cle => niveauxPresents.add(cle.split("-")[0]));
    }
    const autorisees = filieresAutorisees ? new Set(filieresAutorisees) : null;

    select.innerHTML = '<option value="">-- Sélectionner une filière --</option>';

    ["2nde", "1ere", "tle"].forEach(niveau => {
        if (!niveauxPresents.has(niveau)) return;
        const options = filieresDuNiveau(niveau, filieres, contextes);
        if (!options.length) return;

        const optionsFiltrees = autorisees
            ? options.filter(f => autorisees.has(`${niveau}-${f.id}`))
            : options;

        if (!optionsFiltrees.length) return;

        const optgroup = document.createElement("optgroup");
        optgroup.label = LIBELLES_NIVEAU[niveau];

        optionsFiltrees.forEach(f => {
            const opt = document.createElement("option");
            opt.value = `${niveau}-${f.id}`;
            opt.textContent = f.label;
            optgroup.appendChild(opt);
        });

        select.appendChild(optgroup);
    });

    // Petit mot expliquant la restriction, affiché juste sous le menu.
    const blocSelect = select.closest(".filiere-select-bloc") || select.parentElement;
    let noteEl = blocSelect ? blocSelect.querySelector(".filiere-restriction-note") : null;

    if (autorisees && noteRestriction) {
        if (!noteEl && blocSelect) {
            noteEl = document.createElement("p");
            noteEl.className = "filiere-restriction-note";
            blocSelect.appendChild(noteEl);
        }
        if (noteEl) noteEl.textContent = noteRestriction;
    } else if (noteEl) {
        noteEl.remove();
    }

    select.addEventListener("change", () => {
        const data = contextes[select.value];
        resultat.innerHTML = rendreContexte(data, afficherProblematique);
        rendreRappelsProblematique(data);
    });

    resultat.innerHTML = rendreContexte(null, afficherProblematique);
    rendreRappelsProblematique(null);
}

/**
 * Renvoie la filière actuellement sélectionnée, ou null.
 * Utile pour l'inclure dans le compte-rendu.
 */
export function getFiliereSelectionnee(selectId = "select-filiere-pro") {
    const select = document.getElementById(selectId);
    if (!select || !select.value) return null;
    const option = select.options[select.selectedIndex];
    return {
        cle: select.value,
        filiere: option ? option.textContent : select.value,
        niveau: LIBELLES_NIVEAU[select.value.split("-")[0]] || ""
    };
}
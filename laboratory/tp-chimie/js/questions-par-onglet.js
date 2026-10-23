/**
 * tp-chimie/js/questions-par-onglet.js
 *
 * Module partagé des TP de chimie : « Trace écrite et compte rendu ».
 *
 * Chaque onglet de manipulation possède son propre bloc de 5 questions
 * (.questions-bloc[data-onglet="<id de l'onglet>"]) :
 *   - questions 1 à 4 : objet du TP de l'onglet ;
 *   - question 5 : problématique de l'onglet (rappel .problematique-rappel
 *     portant data-activite="<id de l'onglet>", rempli par contexte-pro.js
 *     à partir de `problematiques` dans CONTEXTES_PRO_TPxx).
 *
 * Seul le bloc de l'onglet actif est affiché. L'impression du compte-rendu
 * reprend le bloc affiché, et celui d'un autre onglet seulement s'il
 * contient des réponses (questions alors préfixées du nom de l'onglet).
 */

let prefixer = false;

export function initQuestionsParOnglet() {

    const blocs = [...document.querySelectorAll(".questions-bloc[data-onglet]")];
    // onglets de premier niveau seulement (pas les sous-onglets imbriqués)
    const boutons = [...document.querySelectorAll(".tabs-container > .tabs-header > .tab-btn")]
        .filter(b => !b.closest(".tab-panel"));

    if (!blocs.length || !boutons.length) return;

    const synchroniser = () => {
        const actif = boutons.find(b => b.classList.contains("actif")) || boutons[0];
        const onglet = blocs.some(b => b.dataset.onglet === actif.dataset.tab)
            ? actif.dataset.tab
            : blocs[0].dataset.onglet;

        blocs.forEach(bloc => {
            const visible = bloc.dataset.onglet === onglet;
            bloc.hidden = !visible;
            bloc.style.display = visible ? "" : "none";
        });
    };

    // clic utilisateur, mais aussi changement programmatique d'onglet
    // (initOngletsParFiliere) : on suit la classe « actif » des boutons.
    boutons.forEach(b => b.addEventListener("click", () => setTimeout(synchroniser, 0)));

    const observateur = new MutationObserver(synchroniser);
    boutons.forEach(b => observateur.observe(b, { attributes: true, attributeFilter: ["class"] }));

    synchroniser();
}

/**
 * Questions à reprendre dans le compte-rendu : celles du bloc affiché,
 * plus celles d'un autre onglet si au moins une réponse y a été saisie.
 * Sans bloc (TP à une seule activité), toutes les questions de la page.
 */
export function listerQuestionsCR() {

    const blocs = [...document.querySelectorAll(".questions-bloc")];

    if (!blocs.length) {
        prefixer = false;
        return [...document.querySelectorAll(".questions-tp > li")];
    }

    const retenus = blocs.filter(bloc =>
        !bloc.hidden ||
        [...bloc.querySelectorAll("textarea")].some(t => (t.value || "").trim() !== "")
    );

    prefixer = retenus.length > 1;

    return retenus.flatMap(bloc => [...bloc.querySelectorAll(".questions-tp > li")]);
}

export function blocDeQuestion(li) {
    return li.closest(".questions-bloc");
}

/** Titre imprimé d'une question : préfixe d'onglet éventuel, énoncé et, pour la
 *  dernière question, rappel de la problématique de l'onglet. */
export function titreCR(li, titre) {
    const rappel = li.querySelector(".problematique-rappel")
        ?.textContent.replace(/\s+/g, " ").trim() || "";
    return prefixeOnglet(li) + (rappel ? `${titre} ${rappel}` : titre);
}

/** « [Nom de l'onglet] » quand plusieurs onglets sont imprimés, sinon vide. */
export function prefixeOnglet(li) {
    const bloc = blocDeQuestion(li);
    return prefixer && bloc && bloc.dataset.ongletNom ? `[${bloc.dataset.ongletNom}] ` : "";
}
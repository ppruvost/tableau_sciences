/* ============================================================
   HELPERS DOM
   ============================================================ */

export const $ = (id) => document.getElementById(id);

export function lireTexte(id) {
    return ($(id)?.value || "").trim();
}

/* ============================================================
   NOMBRES
   ============================================================ */

export function nombre(v) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
}

export function arrondir(v, decimales = 2) {
    return Number(v).toFixed(decimales);
}

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/* ============================================================
   AFFICHAGE DE MESSAGE
   ============================================================ */

export function message(id, texte, classe = "info") {
    const zone = $(id);
    if (!zone) return;
    zone.innerHTML = `
        <div class="${classe}">
            ${texte}
        </div>
    `;
}

/* ============================================================
   ACCORDEONS
   ============================================================ */

export function initSections() {
    document
    .querySelectorAll(".section-titre")
    .forEach(titre=>{
        const section =
            titre.closest(".section");
        if(!section)
            return;
        const corps =
            section.querySelector(".section-corps");
        const chevron =
            titre.querySelector(".chevron");
        if(!corps)
            return;
        // état initial
        corps.style.display =
            section.classList.contains("fermee")
            ?
            "none"
            :
            "block";
        if(chevron){
            chevron.textContent =
                section.classList.contains("fermee")
                ?
                "▶"
                :
                "▼";
        }

        titre.addEventListener(
            "click",
            ()=>{


                const fermee =
                    section.classList.toggle(
                        "fermee"
                    );



                corps.style.display =
                    fermee
                    ?
                    "none"
                    :
                    "block";



                if(chevron){

                    chevron.textContent =
                        fermee
                        ?
                        "▶"
                        :
                        "▼";

                }


            }
        );


    });


}



/* ============================================================
   ONGLET GENERIQUE
   ============================================================ */


export function initTabs() {


    document
    .querySelectorAll(".tabs-container")
    .forEach(container=>{


        const boutons =
            container.querySelectorAll(
                ".tab-btn"
            );


        const panneaux =
            container.querySelectorAll(
                ".tab-panel"
            );



        boutons.forEach(btn=>{


            btn.addEventListener(
                "click",
                ()=>{


                    boutons.forEach(
                        b=>
                        b.classList.remove(
                            "actif"
                        )
                    );


                    panneaux.forEach(
                        p=>
                        p.classList.remove(
                            "actif"
                        )
                    );



                    btn.classList.add(
                        "actif"
                    );



                    const cible =
                        container.querySelector(
                            "#"+btn.dataset.tab
                        );



                    if(cible)
                        cible.classList.add(
                            "actif"
                        );



                    // événement personnalisé
                    container.dispatchEvent(
                        new CustomEvent(
                            "ongletChange",
                            {
                                detail:
                                {
                                    tab:
                                    btn.dataset.tab
                                }
                            }
                        )
                    );


                }
            );


        });


    });


}



/* ============================================================
   INITIALISATION DES MODES OPERATOIRES
   ============================================================ */


export function initModesOperatoires() {


    document
    .querySelectorAll(
        "[data-mode-operatoire]"
    )
    .forEach(btn=>{


        btn.addEventListener(
            "click",
            ()=>{


                afficherModeOperatoire(
                    btn.dataset.modeOperatoire
                );


            }
        );


    });


}



/* ============================================================
   IMPRESSION SIMPLE
   ============================================================ */


export function initImprimer() {


    const btn =
        document.getElementById(
            "btn-imprimer"
        );



    if(!btn)
        return;



    btn.addEventListener(
        "click",
        ()=>window.print()
    );


}



/* ============================================================
   AJOUT D'UN BOUTON DANS UNE NAVIGATION TP
   ============================================================ */


export function ajouterBouton(
    conteneur,
    id,
    texte,
    callback,
    classe="btn btn-primaire"
){


    if(!conteneur)
        return null;



    if(
        document.getElementById(id)
    )
        return document.getElementById(id);



    const bouton =
        document.createElement(
            "button"
        );


    bouton.id =
        id;


    bouton.type =
        "button";


    bouton.className =
        classe;


    bouton.textContent =
        texte;



    bouton.addEventListener(
        "click",
        callback
    );



    conteneur.appendChild(
        bouton
    );



    return bouton;

}



/* ============================================================
   INITIALISATION COMPLETE COMMUNE
   ============================================================ */


export function initInterfaceTP(){


    initSections();


    initTabs();


    initModesOperatoires();


    initImprimer();


}



/* ============================================================
   CALCUL D'ERREUR RELATIVE
   ============================================================ */


export function erreurRelative(
    experimental,
    theorique
){

    experimental =
        nombre(experimental);

    theorique =
        nombre(theorique);



    if(theorique===0)
        return null;



    return Math.abs(
        (experimental-theorique)
        /
        theorique
    )*100;

}



/* ============================================================
   ECART SIGNE
   ============================================================ */


export function ecartSigne(
    experimental,
    theorique
){

    experimental =
        nombre(experimental);

    theorique =
        nombre(theorique);



    if(theorique===0)
        return null;



    return (
        (experimental-theorique)
        /
        theorique
    )*100;

}



/* ============================================================
   CALCUL GUIDÉ GENERIQUE
   ============================================================ */


export function bindCalcul(
    id,
    fonction
){


    const bloc =
        document.getElementById(id);



    if(!bloc)
        return;



    const inputs =
        bloc.querySelectorAll(
            "input"
        );


    const resultat =
        bloc.querySelector(
            ".resultat-calcul"
        );



    inputs.forEach(
        input=>{


            input.addEventListener(
                "input",
                ()=>{


                    const valeurs =
                    [
                        ...inputs
                    ]
                    .map(
                        i=>nombre(i.value)
                    );



                    const res =
                        fonction(valeurs);



                    if(resultat)
                        resultat.textContent =
                            res ?? "—";


                }
            );


        }
    );


}




/* ============================================================
   EXPORT DONNEES FORMULAIRE
   ============================================================ */


export function lireFormulaire(
    selecteur
){

    const zone =
        document.querySelector(
            selecteur
        );


    if(!zone)
        return {};



    const donnees =
        {};



    zone
    .querySelectorAll(
        "input,select,textarea"
    )
    .forEach(
        champ=>{


            if(
                champ.name ||
                champ.id
            ){

                donnees[
                    champ.name || champ.id
                ]
                =
                champ.value;


            }


        }
    );



    return donnees;

}



/* ============================================================
   RESET ZONE
   ============================================================ */


export function viderZone(id){

    const zone =
        $(id);


    if(zone)
        zone.innerHTML =
            "";

}



/* ============================================================
   INITIALISATION DOM COMPLETE
   ============================================================ */


export function initCommun(){

    initInterfaceTP();

}

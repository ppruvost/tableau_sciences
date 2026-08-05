/**
 * ============================================================
 * MATHILAB
 * GESTION DES ONGLETS ET DES FILIÈRES
 * ============================================================
 *
 * Ce module assure deux fonctions :
 *
 * 1. Changer d'onglet lors d'un clic.
 * 2. Afficher ou masquer certains onglets selon la filière.
 *
 * Convention HTML :
 *
 * Bouton :
 * <button class="tab-btn"
 *         data-tab="identifiant-onglet">
 *
 * Panneau :
 * <div class="tab-panel"
 *      id="identifiant-onglet">
 *
 * ============================================================
 */


/* ============================================================
   INITIALISATION DES CLICS SUR LES ONGLETS
   ============================================================ */

function initialiserClicsOnglets(
    conteneur
) {

    if (!conteneur) {
        return;
    }


    /*
     * Évite d'ajouter plusieurs fois les mêmes écouteurs
     * lorsqu'un TP est chargé plusieurs fois dans la SPA.
     */

    if (
        conteneur.dataset.ongletsInitialises ===
        'true'
    ) {
        return;
    }


    const boutons =

        [
            ...conteneur.querySelectorAll(
                '.tabs-header .tab-btn'
            )
        ];


    const panneaux =

        [
            ...conteneur.querySelectorAll(
                '.tab-panel'
            )
        ];


    /*
     * Vérification de sécurité.
     */

    if (
        boutons.length === 0 ||
        panneaux.length === 0
    ) {

        console.warn(
            'MathiLab : aucun onglet trouvé.'
        );

        return;

    }


    /*
     * Fonction qui active un onglet.
     */

    function activerOnglet(
        identifiant
    ) {

        const boutonCible =

            boutons.find(

                bouton =>

                    bouton.dataset.tab ===
                    identifiant

            );


        const panneauCible =

            panneaux.find(

                panneau =>

                    panneau.id ===
                    identifiant

            );


        /*
         * Le bouton ou le panneau demandé
         * n'existe pas.
         */

        if (
            !boutonCible ||
            !panneauCible
        ) {

            console.warn(

                'MathiLab : onglet introuvable :',

                identifiant

            );

            return;

        }


        /*
         * Désactivation de tous les boutons.
         */

        boutons.forEach(

            bouton => {

                bouton.classList.remove(
                    'actif'
                );


                bouton.setAttribute(
                    'aria-selected',
                    'false'
                );

            }

        );


        /*
         * Masquage de tous les panneaux.
         */

        panneaux.forEach(

            panneau => {

                panneau.classList.remove(
                    'actif'
                );


                panneau.hidden = true;

            }

        );


        /*
         * Activation du bouton choisi.
         */

        boutonCible.classList.add(
            'actif'
        );


        boutonCible.setAttribute(
            'aria-selected',
            'true'
        );


        /*
         * Affichage du panneau choisi.
         */

        panneauCible.classList.add(
            'actif'
        );


        panneauCible.hidden = false;


        console.log(

            'MathiLab : onglet activé :',

            identifiant

        );

    }


    /*
     * Ajout des événements click.
     */

    boutons.forEach(

        bouton => {

            bouton.addEventListener(

                'click',

                evenement => {

                    evenement.preventDefault();


                    const identifiant =

                        bouton.dataset.tab;


                    if (!identifiant) {

                        console.warn(

                            'MathiLab : attribut ' +

                            'data-tab absent.'

                        );

                        return;

                    }


                    activerOnglet(
                        identifiant
                    );

                }

            );

        }

    );


    /*
     * Le conteneur est maintenant initialisé.
     */

    conteneur.dataset.ongletsInitialises =
        'true';


    /*
     * Recherche de l'onglet actif dans le HTML.
     */

    const boutonActif =

        boutons.find(

            bouton =>

                bouton.classList.contains(
                    'actif'
                )

        );


    /*
     * Si aucun bouton n'est actif,
     * on active le premier.
     */

    const identifiantInitial =

        boutonActif?.dataset.tab ||

        boutons[0]?.dataset.tab;


    if (identifiantInitial) {

        activerOnglet(
            identifiantInitial
        );

    }

}


/* ============================================================
   FONCTION PRINCIPALE
   ============================================================ */

/**
 * Initialise les onglets du TP.
 *
 * @param {Object} params
 *
 * @param {Object} params.mapping
 *
 * Exemple :
 *
 * {
 *   "2nde-remi": [
 *     "regrouper-classes",
 *     "representer-qualitative"
 *   ]
 * }
 *
 * @param {string} params.selectId
 *
 * @param {string} params.messageId
 *
 * @param {string} params.messageTexte
 */

export function initOngletsParFiliere({

    mapping = {},

    selectId =
        'select-filiere-pro',

    messageId,

    messageTexte =

        "Ce TP n'est pas au programme " +

        "de votre filière à ce niveau."

} = {}) {


    /*
     * Tous les conteneurs d'onglets du TP.
     */

    const conteneurs =

        [
            ...document.querySelectorAll(
                '.tabs-container'
            )
        ];


    if (
        conteneurs.length === 0
    ) {

        console.warn(

            'MathiLab : aucun ' +

            '.tabs-container trouvé.'

        );

        return;

    }


    /*
     * Première fonction :
     * rendre les onglets cliquables.
     */

    conteneurs.forEach(

        conteneur => {

            initialiserClicsOnglets(
                conteneur
            );

        }

    );


    /*
     * Le sélecteur de filière est facultatif.
     *
     * Les onglets doivent continuer à fonctionner
     * même si le menu de filière n'existe pas.
     */

    const select =

        document.getElementById(
            selectId
        );


    const zoneMessage =

        messageId

            ? document.getElementById(
                messageId
            )

            : null;


    /*
     * Si aucun menu de filière n'est présent,
     * les clics restent fonctionnels.
     */

    if (!select) {

        console.warn(

            'MathiLab : menu de filière ' +

            'introuvable. Les onglets restent ' +

            'néanmoins actifs.'

        );

        return;

    }


    /* ========================================================
       APPLICATION DES RÈGLES DE FILIÈRE
       ======================================================== */

    function appliquerReglesFiliere() {


        const cle =

            select.value;


        const configuration =

            mapping[cle];


        conteneurs.forEach(

            conteneur => {


                const boutons =

                    [
                        ...conteneur.querySelectorAll(
                            '.tabs-header .tab-btn'
                        )
                    ];


                const panneaux =

                    [
                        ...conteneur.querySelectorAll(
                            '.tab-panel'
                        )
                    ];


                /*
                 * Cas :
                 * TP hors programme.
                 */

                if (

                    Array.isArray(
                        configuration
                    )

                    &&

                    configuration.length === 0

                ) {


                    boutons.forEach(

                        bouton => {

                            bouton.style.display =
                                'none';

                        }

                    );


                    panneaux.forEach(

                        panneau => {

                            panneau.classList.remove(
                                'actif'
                            );


                            panneau.hidden = true;

                        }

                    );


                    if (zoneMessage) {

                        zoneMessage.style.display =
                            'block';


                        zoneMessage.textContent =

                            messageTexte;

                    }


                    return;

                }


                /*
                 * Le TP est disponible.
                 */

                if (zoneMessage) {

                    zoneMessage.style.display =
                        'none';

                }


                /*
                 * Si aucune règle n'existe,
                 * tous les onglets sont visibles.
                 */

                const ongletsVisibles =

                    Array.isArray(
                        configuration
                    )

                        ? configuration

                        : null;


                boutons.forEach(

                    bouton => {


                        const identifiant =

                            bouton.dataset.tab;


                        const visible =

                            !ongletsVisibles

                            ||

                            ongletsVisibles.includes(
                                identifiant
                            );


                        bouton.style.display =

                            visible

                                ? ''

                                : 'none';

                    }

                );


                /*
                 * Recherche du bouton actif.
                 */

                let boutonActif =

                    boutons.find(

                        bouton =>

                            bouton.classList.contains(
                                'actif'
                            )

                            &&

                            bouton.style.display !==
                            'none'

                    );


                /*
                 * Si l'onglet actif est caché,
                 * on choisit le premier visible.
                 */

                if (!boutonActif) {

                    boutonActif =

                        boutons.find(

                            bouton =>

                                bouton.style.display !==
                                'none'

                        );

                }


                /*
                 * Active l'onglet visible choisi.
                 */

                if (boutonActif) {

                    boutonActif.click();

                }

            }

        );

    }


    /*
     * Changement de filière.
     */

    select.addEventListener(

        'change',

        appliquerReglesFiliere

    );


    /*
     * Application initiale.
     */

    appliquerReglesFiliere();

}

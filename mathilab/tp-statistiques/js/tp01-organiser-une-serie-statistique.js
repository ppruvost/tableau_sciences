/**

* ============================================================
* MATHILAB — STATISTIQUES
* TP S1 : Organiser et représenter une série statistique
* Fichier :
* tp-statistiques/js/tp01-organiser-une-serie-statistique.js
* ============================================================
  */

import FILIERES_PRO from '../../data/filieres.js';

import {
initContextePro
} from '../../js/contexte-pro.js';

import {
regrouperEnClasses,
classeModale,
dessinerDiagrammeBarres,
dessinerDiagrammeSecteurs
} from '../../js/statistiques.js';

import {
initRadarCompetences
} from '../../js/radar.js';

import {
initImpressionCompteRendu
} from './compte-rendu-statistiques.js';

import {
initOngletsParFiliere
} from '../../js/onglets-filiere.js';

/* ============================================================
CONTEXTES PROFESSIONNELS
============================================================ */

const CONTEXTES_S1 = {

```
'2nde-remi': {

    contexte:
        "En atelier REMI, chaque pièce usinée est mesurée " +
        "(cote, diamètre, épaisseur). Ces mesures répétées " +
        "forment une série statistique qu'il faut savoir " +
        "organiser avant de l'interpréter.",

    problematique:
        "Comment regrouper une série de cotes mesurées en " +
        "atelier pour en tirer une lecture claire de la " +
        "qualité de production ?"

},


'2nde-mcc': {

    contexte:
        "En atelier de confection, un contrôle qualité relève " +
        "un défaut ou son absence sur chaque pièce cousue : " +
        "c'est une série qualitative, différente d'une série " +
        "de mesures chiffrées.",

    problematique:
        "Comment représenter les résultats d'un contrôle " +
        "qualité en confection pour identifier le défaut " +
        "le plus fréquent ?"

},


'2nde-gatl': {

    contexte:
        "En logistique, les délais de livraison et les volumes " +
        "traités jour après jour forment des séries statistiques, " +
        "quantitatives ou chronologiques selon ce que l'on étudie.",

    problematique:
        "Comment organiser une série de délais de livraison " +
        "pour évaluer la régularité d'un transporteur ?"

}
```

};

/* ============================================================
ONGLET 1
REGROUPER UNE SÉRIE EN CLASSES
============================================================ */

const valeursClasses = [];

/* ------------------------------------------------------------
Afficher les valeurs
------------------------------------------------------------ */

function rendreTableauValeurs(
tbodyId,
valeurs
) {

```
const tbody = document.getElementById(
    tbodyId
);

if (!tbody) {
    return;
}


if (valeurs.length === 0) {

    tbody.innerHTML = `
        <tr>
            <td colspan="2">
                Aucune valeur saisie.
            </td>
        </tr>
    `;

    return;

}


tbody.innerHTML = valeurs
    .map(
        (valeur, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${valeur}</td>
            </tr>
        `
    )
    .join('');
```

}

/* ------------------------------------------------------------
Actualiser le regroupement
------------------------------------------------------------ */

function actualiserRegroupementClasses() {

```
rendreTableauValeurs(
    'rc-tbody-valeurs',
    valeursClasses
);


const champNbClasses =
    document.getElementById(
        'rc-nb-classes'
    );


let nbClasses = parseInt(
    champNbClasses?.value,
    10
);


/*
 * Valeur de sécurité.
 */

if (
    Number.isNaN(nbClasses) ||
    nbClasses < 2
) {

    nbClasses = 5;

}


const classesModaleDiv =
    document.getElementById(
        'rc-classe-modale'
    );


const tbodyClasses =
    document.getElementById(
        'rc-tbody-classes'
    );


const histogramme =
    document.getElementById(
        'rc-histogramme'
    );


/*
 * Il faut au moins deux valeurs.
 */

if (valeursClasses.length < 2) {

    if (tbodyClasses) {

        tbodyClasses.innerHTML = `
            <tr>
                <td colspan="2">
                    Saisir au moins 2 valeurs.
                </td>
            </tr>
        `;

    }


    if (classesModaleDiv) {

        classesModaleDiv.textContent = '';

    }


    if (histogramme) {

        histogramme.innerHTML = '';

    }


    return;

}


/*
 * Création des classes.
 */

const classes = regrouperEnClasses(
    valeursClasses,
    nbClasses
);


/*
 * Affichage du tableau.
 */

if (tbodyClasses) {

    tbodyClasses.innerHTML = classes
        .map(
            classe => `
                <tr>
                    <td>
                        [
                        ${classe.debut.toFixed(1)}
                        ;
                        ${classe.fin.toFixed(1)}
                        [
                    </td>

                    <td>
                        ${classe.effectif}
                    </td>
                </tr>
            `
        )
        .join('');

}


/*
 * Dessin du diagramme.
 */

dessinerDiagrammeBarres(

    'rc-histogramme',

    classes.map(
        classe => ({

            label:
                `[${classe.debut.toFixed(1)} ; ` +
                `${classe.fin.toFixed(1)}[`,

            effectif:
                classe.effectif

        })
    ),

    {
        yLabel: 'Effectif'
    }

);


/*
 * Recherche de la classe modale.
 */

const modale = classeModale(
    classes
);


if (
    classesModaleDiv &&
    modale
) {

    classesModaleDiv.textContent =
        `Classe modale : ` +
        `[${modale.debut.toFixed(1)} ; ` +
        `${modale.fin.toFixed(1)}[` +
        ` (effectif : ${modale.effectif})`;

}
```

}

/* ------------------------------------------------------------
Initialiser l'onglet 1
------------------------------------------------------------ */

function initRegroupementClasses() {

```
const bouton =
    document.getElementById(
        'rc-ajouter'
    );


const champValeur =
    document.getElementById(
        'rc-valeur'
    );


const champNbClasses =
    document.getElementById(
        'rc-nb-classes'
    );


if (
    !bouton ||
    !champValeur
) {

    console.warn(
        'MathiLab S1 : éléments du regroupement introuvables.'
    );

    return;

}


/*
 * Évite un double écouteur
 * lors d'un rechargement du TP.
 */

if (
    bouton.dataset.initialise ===
    'true'
) {

    return;

}


bouton.dataset.initialise =
    'true';


/*
 * Ajouter une valeur.
 */

bouton.addEventListener(

    'click',

    () => {

        const valeur = parseFloat(
            champValeur.value
        );


        if (
            Number.isNaN(valeur)
        ) {

            champValeur.focus();

            return;

        }


        valeursClasses.push(
            valeur
        );


        champValeur.value = '';


        champValeur.focus();


        actualiserRegroupementClasses();

    }

);


/*
 * Touche Entrée.
 */

champValeur.addEventListener(

    'keydown',

    evenement => {

        if (
            evenement.key ===
            'Enter'
        ) {

            evenement.preventDefault();

            bouton.click();

        }

    }

);


/*
 * Modification du nombre de classes.
 */

champNbClasses?.addEventListener(

    'input',

    actualiserRegroupementClasses

);


/*
 * Affichage initial.
 */

actualiserRegroupementClasses();
```

}

/* ============================================================
ONGLET 2
SÉRIE QUALITATIVE
============================================================ */

const categoriesQualitatives = [];

/* ------------------------------------------------------------
Actualiser la série qualitative
------------------------------------------------------------ */

function actualiserSerieQualitative() {

```
const tbody =
    document.getElementById(
        'ql-tbody'
    );


if (tbody) {

    if (
        categoriesQualitatives.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="2">
                    Aucune catégorie saisie.
                </td>
            </tr>
        `;

    }

    else {

        tbody.innerHTML =
            categoriesQualitatives
                .map(
                    categorie => `
                        <tr>
                            <td>
                                ${categorie.label}
                            </td>

                            <td>
                                ${categorie.effectif}
                            </td>
                        </tr>
                    `
                )
                .join('');

    }

}


/*
 * Les fonctions de dessin reçoivent
 * une liste vide au départ.
 */

dessinerDiagrammeBarres(

    'ql-barres',

    categoriesQualitatives,

    {
        yLabel: 'Effectif'
    }

);


dessinerDiagrammeSecteurs(

    'ql-secteurs',

    categoriesQualitatives

);
```

}

/* ------------------------------------------------------------
Initialiser l'onglet 2
------------------------------------------------------------ */

function initSerieQualitative() {

```
const bouton =
    document.getElementById(
        'ql-ajouter'
    );


const champCategorie =
    document.getElementById(
        'ql-categorie'
    );


const champEffectif =
    document.getElementById(
        'ql-effectif'
    );


if (
    !bouton ||
    !champCategorie ||
    !champEffectif
) {

    console.warn(
        'MathiLab S1 : éléments de la série qualitative introuvables.'
    );

    return;

}


if (
    bouton.dataset.initialise ===
    'true'
) {

    return;

}


bouton.dataset.initialise =
    'true';


bouton.addEventListener(

    'click',

    () => {

        const label =
            champCategorie.value.trim();


        const effectif =
            parseInt(
                champEffectif.value,
                10
            );


        if (
            !label ||
            Number.isNaN(effectif) ||
            effectif < 0
        ) {

            return;

        }


        categoriesQualitatives.push({

            label:
                label,

            effectif:
                effectif

        });


        champCategorie.value = '';

        champEffectif.value = '';


        champCategorie.focus();


        actualiserSerieQualitative();

    }

);


/*
 * Validation avec Entrée.
 */

champCategorie.addEventListener(

    'keydown',

    evenement => {

        if (
            evenement.key ===
            'Enter'
        ) {

            evenement.preventDefault();

            bouton.click();

        }

    }

);


champEffectif.addEventListener(

    'keydown',

    evenement => {

        if (
            evenement.key ===
            'Enter'
        ) {

            evenement.preventDefault();

            bouton.click();

        }

    }

);


actualiserSerieQualitative();
```

}

/* ============================================================
ONGLET 3
ÉVOLUTION CHRONOLOGIQUE
============================================================ */

const pointsChronologiques = [];

/* ------------------------------------------------------------
Dessiner les lignes brisées
------------------------------------------------------------ */

function dessinerLignesBrisees(
conteneurId,
points
) {

```
const conteneur =
    document.getElementById(
        conteneurId
    );


if (!conteneur) {

    return;

}


if (points.length < 2) {

    conteneur.innerHTML = `
        <p class="info">
            Ajouter au moins 2 points
            pour tracer le graphique.
        </p>
    `;

    return;

}


/*
 * Tri chronologique.
 */

const tries = [...points]
    .sort(
        (a, b) =>
            a.periode -
            b.periode
    );


const largeur = 480;

const hauteur = 240;


const marge = {

    haut: 20,

    bas: 35,

    gauche: 50,

    droite: 20

};


const largeurUtile =
    largeur -
    marge.gauche -
    marge.droite;


const hauteurUtile =
    hauteur -
    marge.haut -
    marge.bas;


const xMin =
    tries[0].periode;


const xMax =
    tries[
        tries.length - 1
    ].periode;


const yMin =
    Math.min(
        ...tries.map(
            point =>
                point.valeur
        )
    );


const yMax =
    Math.max(
        ...tries.map(
            point =>
                point.valeur
        )
    );


const etendueX =
    (xMax - xMin) || 1;


const etendueY =
    (yMax - yMin) || 1;


const x = periode =>

    marge.gauche +

    (
        (periode - xMin) /
        etendueX
    )

    *

    largeurUtile;


const y = valeur =>

    marge.haut +

    hauteurUtile -

    (
        (valeur - yMin) /
        etendueY
    )

    *

    hauteurUtile;


const pointsSvg =
    tries
        .map(
            point =>
                `${x(
                    point.periode
                ).toFixed(1)},${y(
                    point.valeur
                ).toFixed(1)}`
        )
        .join(' ');


const marqueurs =
    tries
        .map(
            point => `
                <circle
                    class="diagramme-barre"
                    cx="${x(
                        point.periode
                    ).toFixed(1)}"
                    cy="${y(
                        point.valeur
                    ).toFixed(1)}"
                    r="4">
                </circle>
            `
        )
        .join('');


conteneur.innerHTML = `

    <svg

        viewBox="
            0 0
            ${largeur}
            ${hauteur}
        "

        width="100%"

        style="
            max-width:${largeur}px;
            display:block;
            margin:0 auto;
        "

    >

        <line

            class="diagramme-axe"

            x1="${marge.gauche}"

            y1="${marge.haut}"

            x2="${marge.gauche}"

            y2="${
                hauteur -
                marge.bas
            }"

        />


        <line

            class="diagramme-axe"

            x1="${marge.gauche}"

            y1="${
                hauteur -
                marge.bas
            }"

            x2="${
                largeur -
                marge.droite
            }"

            y2="${
                hauteur -
                marge.bas
            }"

        />


        <polyline

            points="${pointsSvg}"

            fill="none"

            stroke="var(--domaine-accent)"

            stroke-width="3"

        />


        ${marqueurs}

    </svg>

`;
```

}

/* ------------------------------------------------------------
Initialiser l'onglet 3
------------------------------------------------------------ */

function initSerieChronologique() {

```
const bouton =
    document.getElementById(
        'lb-ajouter'
    );


const champPeriode =
    document.getElementById(
        'lb-periode'
    );


const champValeur =
    document.getElementById(
        'lb-valeur'
    );


if (
    !bouton ||
    !champPeriode ||
    !champValeur
) {

    console.warn(
        'MathiLab S1 : éléments de la série chronologique introuvables.'
    );

    return;

}


if (
    bouton.dataset.initialise ===
    'true'
) {

    return;

}


bouton.dataset.initialise =
    'true';


bouton.addEventListener(

    'click',

    () => {

        const periode =
            parseFloat(
                champPeriode.value
            );


        const valeur =
            parseFloat(
                champValeur.value
            );


        if (
            Number.isNaN(periode) ||
            Number.isNaN(valeur)
        ) {

            return;

        }


        pointsChronologiques.push({

            periode:
                periode,

            valeur:
                valeur

        });


        champPeriode.value = '';

        champValeur.value = '';


        champPeriode.focus();


        dessinerLignesBrisees(

            'lb-graphique',

            pointsChronologiques

        );

    }

);


/*
 * Touche Entrée.
 */

champPeriode.addEventListener(

    'keydown',

    evenement => {

        if (
            evenement.key ===
            'Enter'
        ) {

            evenement.preventDefault();

            bouton.click();

        }

    }

);


champValeur.addEventListener(

    'keydown',

    evenement => {

        if (
            evenement.key ===
            'Enter'
        ) {

            evenement.preventDefault();

            bouton.click();

        }

    }

);


dessinerLignesBrisees(

    'lb-graphique',

    pointsChronologiques

);
```

}

/* ============================================================
INITIALISATION GÉNÉRALE
============================================================ */

function initialiserTP() {

```
/*
 * Évite une double initialisation
 * du même fragment.
 */

const conteneurOnglets =
    document.querySelector(
        '.tabs-container'
    );


if (!conteneurOnglets) {

    return;

}


if (
    conteneurOnglets.dataset.tpInitialise ===
    'true'
) {

    return;

}


conteneurOnglets.dataset.tpInitialise =
    'true';


console.log(
    'MathiLab S1 : initialisation du TP'
);


/* ========================================================
   ONGLETS
   ======================================================== */

initOngletsParFiliere({

    /*
     * Ce TP est commun à toutes les filières.
     *
     * Une configuration vide signifie :
     * aucune restriction.
     */

    mapping: {},


    selectId:
        'select-filiere-pro',


    messageId:
        's01-message-filiere'

});


/* ========================================================
   CONTEXTE PROFESSIONNEL
   ======================================================== */

initContextePro({

    filieres:
        FILIERES_PRO,

    contextes:
        CONTEXTES_S1

});


/* ========================================================
   ACTIVITÉS
   ======================================================== */

initRegroupementClasses();

initSerieQualitative();

initSerieChronologique();


/* ========================================================
   COMPÉTENCES
   ======================================================== */

initRadarCompetences();


/* ========================================================
   IMPRESSION
   ======================================================== */

initImpressionCompteRendu({

    titre:
        "Organiser et représenter " +
        "une série statistique",

    tp:
        'S1'

});


console.log(
    'MathiLab S1 : TP prêt'
);
```

}

/* ============================================================
LANCEMENT
============================================================ */

/*

* Le fragment HTML est chargé dynamiquement
* par navigation.js.
*
* Le module est normalement importé après
* l'insertion du fragment dans le DOM.
  */

function lancerInitialisation() {

```
const onglets =
    document.querySelector(
        '.tabs-container'
    );


if (onglets) {

    initialiserTP();

    return;

}


/*
 * Sécurité pour les chargements SPA :
 * nouvelle tentative au prochain cycle
 * du navigateur.
 */

requestAnimationFrame(

    initialiserTP

);
```

}

lancerInitialisation();

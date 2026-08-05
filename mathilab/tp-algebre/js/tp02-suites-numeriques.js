import {
initContextePro
}
from "../../js/contexte-pro.js";

import FILIERES_PRO
from "../../data/filieres.js";

const CONTEXTES_TP02 = {

```
"2nde-remi": {

    contexte:
        "Dans un atelier de mécanique, la production augmente chaque semaine d'un nombre constant de pièces.",

    problematique:
        "Combien de pièces seront produites après plusieurs semaines ?"

},


"2nde-mcc": {

    contexte:
        "Un atelier de confection augmente chaque semaine la quantité de vêtements fabriqués.",

    problematique:
        "Quelle sera la production au rang demandé ?"

},


"2nde-gatl": {

    contexte:
        "Une plateforme logistique augmente régulièrement sa capacité de stockage.",

    problematique:
        "Quelle capacité sera atteinte après plusieurs périodes ?"

}
```

};

function initSuite() {

```
const bouton =
    document.getElementById(
        "suite-calculer"
    );


if (!bouton) {

    return;

}


bouton.addEventListener(
    "click",
    () => {

        const u0 =
            Number(
                document
                .getElementById(
                    "suite-u0"
                )
                .value
            );


        const r =
            Number(
                document
                .getElementById(
                    "suite-r"
                )
                .value
            );


        const n =
            Math.max(
                0,
                Math.floor(
                    Number(
                        document
                        .getElementById(
                            "suite-n"
                        )
                        .value
                    )
                )
            );


        const un =
            u0 + n * r;


        const sens =

            r > 0

            ? "croissante"

            : r < 0

            ? "décroissante"

            : "constante";


        document
        .getElementById(
            "suite-resultat"
        )
        .innerHTML = `

            <strong>

                uₙ = u₀ + n × r

            </strong>

            <br>

            u<sub>${n}</sub>
            =
            ${u0}
            +
            ${n}
            ×
            ${r}

            <br>

            <strong>

                u<sub>${n}</sub>
                =
                ${un}

            </strong>

            <br>

            La suite est
            <strong>

                ${sens}

            </strong>.

        `;


        const tableau =
            document.getElementById(
                "suite-tableau"
            );


        tableau.innerHTML =
            "";


        const limite =
            Math.min(
                n,
                30
            );


        for (

            let i = 0;

            i <= limite;

            i++

        ) {

            const valeur =
                u0 + i * r;


            tableau.innerHTML += `

                <tr>

                    <td>

                        ${i}

                    </td>

                    <td>

                        ${valeur}

                    </td>

                </tr>

            `;

        }

    }

);


bouton.click();
```

}

initContextePro({

```
filieres:
    FILIERES_PRO,

contextes:
    CONTEXTES_TP02
```

});

initSuite();

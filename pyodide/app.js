/* =========================================================
PYLAB
INTERFACE UTILISATEUR
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    /* =================================================
       ÉLÉMENTS HTML
       ================================================= */

    const homeButton =
        document.getElementById(
            "homeButton"
        );


    const pythonButton =
        document.getElementById(
            "pythonButton"
        );


    const startButton =
        document.getElementById(
            "startButton"
        );


    const homePage =
        document.getElementById(
            "home-message"
        );


    const pythonPage =
        document.getElementById(
            "python-page"
        );


    const clearButton =
        document.getElementById(
            "clear"
        );


    const menuClear =
        document.getElementById(
            "menuClear"
        );


    const editor =
        document.getElementById(
            "code"
        );


    const output =
        document.getElementById(
            "output"
        );


    const examplesButton =
        document.getElementById(
            "examplesButton"
        );


    const examplesMenu =
        document.getElementById(
            "examplesMenu"
        );


    /* =================================================
       AFFICHER PYLAB
       ================================================= */

    function showPython() {


        homePage.classList.remove(
            "active-page"
        );


        pythonPage.classList.add(
            "active-page"
        );


        homeButton.classList.remove(
            "active"
        );


        pythonButton.classList.add(
            "active"
        );


    }


    /* =================================================
       AFFICHER ACCUEIL
       ================================================= */

    function showHome() {


        pythonPage.classList.remove(
            "active-page"
        );


        homePage.classList.add(
            "active-page"
        );


        pythonButton.classList.remove(
            "active"
        );


        homeButton.classList.add(
            "active"
        );


    }


    /* =================================================
       BOUTONS DE NAVIGATION
       ================================================= */

    homeButton.addEventListener(
        "click",
        showHome
    );


    pythonButton.addEventListener(
        "click",
        showPython
    );


    startButton.addEventListener(
        "click",
        showPython
    );


    /* =================================================
       EFFACER
       ================================================= */

    function clearProgram() {


        if (editor) {

            editor.value = "";

            editor.focus();

        }


        if (output) {

            output.textContent =
                "Console effacée.";

        }


    }


    clearButton.addEventListener(
        "click",
        clearProgram
    );


    menuClear.addEventListener(
        "click",
        () => {


            showPython();


            clearProgram();


        }
    );


    /* =================================================
       SOUS-MENU EXEMPLES
       ================================================= */

    examplesButton.addEventListener(
        "click",
        event => {


            event.stopPropagation();


            examplesMenu.classList.toggle(
                "show"
            );


        }
    );


    document.addEventListener(
        "click",
        () => {


            examplesMenu.classList.remove(
                "show"
            );


        }
    );


    examplesMenu.addEventListener(
        "click",
        event => {


            event.stopPropagation();


        }
    );


    /* =================================================
       PROGRAMMES D'EXEMPLE
       ================================================= */

    const examples = {


        bonjour:
```

`print("Bonjour !")

print("Bienvenue dans PyLab !")`,

```
        boucle:
```

`for nombre in range(1, 11):

```
print(nombre)`,


        calcul:
```

`nombre1 = 12

nombre2 = 8

somme = nombre1 + nombre2

print("Résultat :", somme)`

```
    };


    /* =================================================
       CHARGER UN EXEMPLE
       ================================================= */

    document.querySelectorAll(
        "[data-example]"
    ).forEach(

        button => {


            button.addEventListener(
                "click",
                () => {


                    const exampleName =
                        button.dataset.example;


                    if (
                        examples[exampleName]
                    ) {

                        editor.value =
                            examples[
                                exampleName
                            ];

                    }


                    showPython();


                    examplesMenu.classList.remove(
                        "show"
                    );


                    editor.focus();


                }
            );


        }

    );


    /* =================================================
       RACCOURCI :
       CTRL + ENTRÉE
       ================================================= */

    editor.addEventListener(
        "keydown",
        event => {


            if (

                event.ctrlKey &&

                event.key === "Enter"

            ) {


                event.preventDefault();


                const runButton =
                    document.getElementById(
                        "run"
                    );


                if (

                    runButton &&

                    !runButton.disabled

                ) {

                    runButton.click();

                }


            }


        }
    );


}
```

);

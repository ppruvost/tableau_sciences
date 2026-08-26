# Sources des bibliothèques MermozLab

## 1. diagrams.net

Dépôt officiel :

https://github.com/jgraph/drawio

Bibliothèques utilisées :

- logic_gates.xml
- resistors.xml
- capacitors.xml
- inductors.xml
- diodes.xml
- signal_sources.xml
- instruments.xml
- waveforms.xml
- transistors.xml
- mosfets1.xml
- mosfets2.xml
- opto_electronics.xml
- electro-mechanical.xml

---

## 2. OwnTech

Dépôt :

https://github.com/owntech-foundation/LibraryDrawIO

Fichier :

circuit_library.xml

Licence :

CC-BY-SA-4.0

---

## 3. bzarek

Dépôt :

https://github.com/bzarek/draw.io-electrical

Fichier :

Custom_Electrical.xml

---

## 4. Material Design Icons — pictogrammes locaux (Pictogrammers)

Dépôt :

https://github.com/Templarian/MaterialDesign

Usage : aperçus statiques dans libraries/chimie/svg/ et
dans la page index.html (galerie du projet).

Fichiers (dans libraries/chimie/svg/) :

- beaker.svg
- beaker-outline.svg
- flask.svg
- flask-outline.svg
- flask-round-bottom.svg
- flask-round-bottom-outline.svg
- test-tube.svg
- test-tube-empty.svg
- cylinder.svg
- eyedropper.svg
- thermometer.svg
- scale-balance.svg
- molecule.svg
- atom.svg
- periodic-table.svg
- microscope.svg
- weight-gram.svg

Licence :

Apache License 2.0 (voir LICENSE-material-design-icons.txt
dans le même dossier)

---

## 5. Bibliothèques chargées en direct dans editor.html

La page diagrams/editor.html charge, via le paramètre
clibs de diagrams.net, trois bibliothèques au format
"custom library" (mxlibrary) officiel, utilisables
directement par glisser-déposer dans l'éditeur :

- OwnTech (circuit_library.xml) :
  https://github.com/owntech-foundation/LibraryDrawIO
  Licence CC-BY-SA-4.0

- bzarek/draw.io-electrical (Custom_Electrical.xml) :
  https://github.com/bzarek/draw.io-electrical

- Material Design Icons, reconditionnée au format
  diagrams.net par le dépôt officiel jgraph/drawio-libs
  (material-design-icons.xml) :
  https://github.com/jgraph/drawio-libs
  Icônes originales : Google, Apache License 2.0.

Ces trois fichiers ne sont pas copiés dans ce dépôt : ils
sont chargés à la demande depuis leurs URL d'origine à
chaque ouverture de editor.html.

Les catégories natives "General" et "Electrical" de
l'éditeur (déjà intégrées à diagrams.net) couvrent les
mêmes formes que diagrams/libraries/electricite/*.xml —
voir la note dans le workflow, section 20.

---

## 6. Verrerie MermozLab (photos originales du labo)

Fichier :

diagrams/libraries/chimie/verrerie-mermozlab.xml

Bibliothèque personnalisée (format mxlibrary, utilisable
par glisser-déposer) générée à partir des photos de
verrerie du laboratoire, déjà présentes dans ce dépôt à
laboratory/assets/img/glassware/. Contenu et droits
propres à MermozLab — aucune licence tierce à respecter.
27 pièces : bécher, erlenmeyer, fiole jaugée, éprouvette
graduée, tube à essai, verre à pied, ballons (fond rond /
plat / col long), burette, pipettes (graduée / jaugée),
ampoule à décanter, entonnoir, fiole à vide, tube à essai
gradué, tube de culture, réfrigérants (droit / à boules),
cristallisoir, verre de montre, flacon réactif, flacon
compte-gouttes, pissette, dessiccateur, ampoule de coulée,
tube de Thiele.

---

## 7. MermozLab Chemistry

Bibliothèque spécifique MermozLab.

Les éléments externes ajoutés dans cette bibliothèque
doivent être accompagnés de leur licence et de leur
attribution.


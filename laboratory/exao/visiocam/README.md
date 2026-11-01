# VisioCam — ExAO vidéo (`laboratory/exao/visiocam`)

Acquisition d'une vidéo (caméra du smartphone branchée en USB, fichier filmé au smartphone, ou démonstration),
pointage image par image (manuel ou suivi automatique) et exploitation graphique : trajectoire, vecteurs vitesse,
x(t), y(t), v(t), a(t), fréquence de rotation. Pour les TP de mécanique **M1 « Décrire un mouvement »** et
**M3 « Cinématique et pression »** (onglet « Vitesse et accélération »).

Page 100 % statique (HTML / CSS / JavaScript, aucune bibliothèque externe, aucune installation) : elle fonctionne
identiquement sous **Lubuntu** et **Windows**, dans Chrome, Chromium, Edge ou Firefox.

| Fichier | Rôle |
|---|---|
| `index.html` | Page (source vidéo, pointage, résultats) |
| `style.css` | Mise en forme (même charte bleu/blanc que `orphy-pression`) |
| `app.js` | Caméra, enregistrement, import, pointage, suivi automatique, exports |
| `calcul.js` | Calculs purs : repère, vitesses, accélérations, régression, rotation, suivi par gabarit |
| `graphes.js` | Tracé des graphiques sur `<canvas>` |

Liens directs depuis les TP : `visiocam/index.html?tp=m1` ou `?tp=m3` (la page affiche alors la démarche du TP).

## Choisir la méthode de connexion du smartphone

| Méthode | Précision | Matériel / installation |
|---|---|---|
| **B. Fichier filmé avec l'appli Appareil photo**, copié par USB | **La meilleure** (60, 120, 240 images/s) | Aucun pilote |
| **A. Caméra en direct** (« Webcam » USB Android 14+) | Moyenne (30 images/s) | Aucun logiciel |
| **A. Caméra en direct** via `scrcpy`, DroidCam ou OBS | Moyenne (30 images/s) | Voir ci-dessous |

Pour mesurer une vitesse ou une accélération, la méthode **B** est recommandée : cadence élevée et horodatage régulier.
Un flux caméra enregistré par le navigateur peut avoir une cadence variable (surtout en lumière faible), ce qui fausse un peu les durées.

### B. Fichier du smartphone (recommandé)
1. Fixer le smartphone (pied, pile de livres), l'axe de l'objectif **perpendiculaire** au plan du mouvement, sans zoom.
2. Placer dans le même plan que le mobile un objet de longueur connue (règle, mètre ruban).
3. Filmer en 60 images/s ou plus (ralenti 120/240 pour une chute). Réglage « format le plus compatible » (**H.264**) : les vidéos H.265/HEVC ne sont pas lues par tous les navigateurs.
4. Brancher le câble USB, choisir « Transfert de fichiers » sur le téléphone et copier la vidéo
   (Lubuntu : gestionnaire de fichiers PCManFM-Qt, au besoin `sudo apt install gvfs-backends` ; Windows : Explorateur de fichiers).
5. Dans VisioCam, bloc **B** : choisir le fichier. Laisser la cadence vide (mesurée automatiquement) ;
   pour une vidéo **au ralenti**, saisir la cadence de **prise de vue** (par ex. 240), pas celle de lecture.

### A. Caméra en direct
**Android 14 ou plus (selon le fabricant)** : brancher, ouvrir la notification USB (« Utiliser l'USB pour ») et choisir **Webcam**.
Le téléphone apparaît comme une caméra dans la liste de VisioCam (Lubuntu et Windows).

**Lubuntu, autres cas : `scrcpy` + `v4l2loopback`** (Android 12 ou plus, débogage USB activé dans les options pour les développeurs) :
```bash
sudo apt install adb v4l2loopback-dkms v4l2loopback-utils
scrcpy --version        # il faut la version 2.2 ou plus ; sinon installer la version de GitHub (release Linux)
sudo modprobe v4l2loopback video_nr=10 card_label="Smartphone" exclusive_caps=1
scrcpy --video-source=camera --camera-facing=back --camera-size=1280x720 --camera-fps=30 --no-playback --v4l2-sink=/dev/video10
```
Laisser cette commande tourner, puis « Actualiser la liste » dans VisioCam et choisir « Smartphone ».
Si le module ne se charge pas et que le démarrage sécurisé (Secure Boot) est activé, il faut l'enregistrer (MOK) ou le désactiver.
Vérifier les caméras vues par le système : `sudo apt install v4l-utils && v4l2-ctl --list-devices`.

**Windows (et Lubuntu) : DroidCam ou OBS**
- DroidCam (application Android + client PC, mode USB) : le client crée une caméra visible dans le navigateur.
- Ou `scrcpy` (fenêtre du téléphone) + **OBS Studio → « Démarrer la caméra virtuelle »** : OBS apparaît comme caméra dans VisioCam.

Dans tous les cas, fermer les autres applications qui utilisent la caméra avant de cliquer sur « Activer la caméra ».

### Utilisation depuis Codeberg
- **Codeberg Pages (HTTPS)** : la caméra est autorisée ; accepter la demande d'autorisation du navigateur.
- Hors ligne : Chrome autorise aussi `file:///…/index.html` (autorisation redemandée à chaque ouverture) ; ou `python3 -m http.server` dans le dossier puis `http://localhost:8000/`.
- Windows : si la caméra reste noire, vérifier Paramètres → Confidentialité → Caméra (accès autorisé aux applications de bureau).

## Utilisation en classe
1. **Étalon** : outil « Étalon », deux clics aux extrémités de l'objet connu, saisie de sa longueur en mètres.
   Case « Axe Ox le long de l'étalon » pour un plan incliné ou une chute verticale.
2. **Pointer** : un clic par image (la vidéo avance du « pas de pointage »). La loupe en haut à droite aide à viser le centre.
   Raccourcis : ← / → image par image, Maj + flèche = 10 images.
3. **Suivi automatique** (🎯) : pointer l'objet sur l'image de départ, placer éventuellement la fin du suivi, lancer.
   Le suivi s'arrête si l'objet est perdu : le pointer à la main, puis relancer. Les points automatiques sont des losanges orange.
4. **Résultats** : onglets Trajectoire, x(t) et y(t), v(t), a(t), Tableau ; faire glisser la souris sur un graphe en fonction du temps pour choisir l'intervalle d'étude.
   Le bilan donne durée, distance, vitesse moyenne, accélération (pente de v(t)) et, à reporter dans l'onglet « Vitesse et accélération » du TP, t₁, v₁, t₂, v₂.
5. **Rotation** (M1, fréquence de rotation) : mode « Rotation », outil « Centre de rotation », puis pointer un point du bord : f, T, tr/min, v = 2π·f·R.
6. **Exports** : CSV (format français : « ; » et virgule décimale, ouvrable dans LibreOffice Calc ou Excel), copie vers le tableur, PNG du graphique, PNG de la chronophotographie (positions et vecteurs sur l'image).

Définitions : v est calculée par différence centrée, v(i) = M(i−1)M(i+1) / (t(i+1) − t(i−1)) ; a de la même façon à partir de v.
La valeur de v est le module du vecteur vitesse : l'analyse « pente de v(t) » suppose un mouvement sans changement de sens.

## Intégrer dans les TP (facultatif)
Dans les fragments `tp01-decrire-mouvement.html` et `tp03-cinematique-pression.html` (pas de style en ligne) :
```html
<a class="btn btn-primaire" href="../exao/visiocam/index.html?tp=m1" target="_blank" rel="noopener">🎥 Ouvrir VisioCam (ExAO vidéo)</a>
<a class="btn btn-primaire" href="../exao/visiocam/index.html?tp=m3" target="_blank" rel="noopener">🎥 Ouvrir VisioCam (ExAO vidéo)</a>
```
(`href` relatif à `laboratory/tp-mecanique/index.html`, d'où `../exao/visiocam/`.)

## Dépannage
| Symptôme | Cause probable |
|---|---|
| « Accès refusé » | Autorisation caméra refusée : cliquer sur l'icône caméra/cadenas de la barre d'adresse |
| Liste de caméras vide | Câble ou mode « Webcam » absent ; relancer la commande `scrcpy` ; « Actualiser la liste » |
| « Caméra utilisée par une autre application » | Fermer DroidCam, OBS, visioconférence |
| Vidéo importée illisible | Codec H.265/HEVC : refilmer en H.264 ou `ffmpeg -i entree.mov -c:v libx264 -crf 18 sortie.mp4` |
| Valeurs de vitesse 2 à 8 fois trop faibles | Vidéo au ralenti : saisir la cadence de prise de vue, pas celle de lecture |
| Suivi qui décroche | Objet peu contrasté, flou de bougé, ou recherche « ± px » trop petite : augmenter la recherche ou la tolérance |

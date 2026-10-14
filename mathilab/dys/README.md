# Parcours Dys · Dyscalculie

Outil web autonome, sur le même principe que `/mlds` (positionnement → plan de travail → suivi), adapté aux élèves dyscalculiques : activités qui s'appuient sur la manipulation et les images, aménagements proposés, outils interactifs sans chrono, et réglages de confort de lecture.

> **Cadre d'usage.** Cet outil est pédagogique. Il ne pose aucun diagnostic et ne remplace ni un bilan (orthophonique, neuropsychologique…) ni un plan d'accompagnement (PAP, PPS). Les aménagements proposés sont à valider avec l'équipe éducative, la famille et, si besoin, les professionnels qui suivent l'élève.

## Installation

1. Place le dossier `dys/` à côté de `mlds/` : `/mathilab/dys/`.
2. Ouvre `dys/index.html` dans un navigateur, ou sers le site :
   ```bash
   cd /mathilab
   python3 -m http.server 8000   # puis http://localhost:8000/dys/index.html
   ```
Aucune dépendance externe, aucun serveur. La police « Atkinson Hyperlegible » est auto-hébergée dans le dossier `fonts/` situé à la racine du projet (`../../fonts/fonts.css` depuis `mathilab/dys/`) : l'application fonctionne hors connexion. Si le dossier `dys/` est copié seul, la police bascule sur Verdana.

## Les trois onglets

**Parcours.** Dossier élève → positionnement → plan de travail.
- Le positionnement porte sur 6 domaines (sens du nombre, numération, calcul, grandeurs et mesures, problèmes, espace) et 12 compétences. Pour chaque phrase, l'élève répond « Pas encore », « Avec de l'aide » ou « Tout seul·e ».
- Le plan propose, domaine par domaine, un module de **remobilisation** (manipuler, jouer, se rassurer) si c'est « à travailler », ou de **consolidation** (stratégies) si c'est « en progrès ». Chaque module liste ses activités, ses **aménagements** et ses ressources, avec une case « réalisé » et des notes.
- Une synthèse des **aménagements** (généraux + selon les modules retenus) est ajoutée au plan.
- Impression et export Markdown.

**Outils & jeux** (sans note, sans chrono imposé).
- *Combien de points ?* : voir une quantité d'un coup d'œil (dé ou cadre de 10).
- *Placer un nombre* : droite numérique 0–10, 0–20 ou 0–100, au clic ou en tapant.
- *Construire un nombre* : centaines, dizaines, unités en couleurs, avec lecture en lettres et décomposition.
- *Les tables en images* : une multiplication en rectangle de points, avec astuces (×2, ×5, ×9, ×10).

**Aide-mémoire.** 8 fiches courtes imprimables (faire 10, doubles, ×2/×5/×10, ×9, poser une addition, valeur des chiffres, heure et durée, problème en 4 étapes).

## Confort de lecture (en haut de chaque page)

Taille du texte (90 à 160 %), espacement des lignes, police (Atkinson Hyperlegible ou Verdana), 4 thèmes (clair, crème, sombre, contraste élevé) et **mode calme** (désactive le flash chronométré et les animations). Les réglages sont mémorisés dans le navigateur.

## Choix d'accessibilité

Texte aligné à gauche et lignes courtes, zones cliquables d'au moins 44 px, focus clavier très visible, navigation au clavier, jamais la couleur seule (les niveaux ont un libellé et un symbole), lien d'évitement, consignes courtes, correction bienveillante.

## Personnaliser

Tout le contenu pédagogique est dans **`data.js`** : domaines, compétences (3 affirmations chacune), modules (activités, aménagements, durée, ressources), aménagements généraux et aide-mémoire. Les `id` doivent rester uniques (ils servent de clé de sauvegarde). Les seuils de niveau sont en haut de `app.js` (`SEUILS`).

## Fichiers

```
dys/
├── index.html   page principale
├── /css/style.css    design accessible (thèmes, impression)
├── /js/data.js      contenu pédagogique
├── /js/tools.js     4 outils interactifs
├── /js/app.js       onglets, préférences, parcours, plan, export
└── README.md
```

## Confidentialité

Les données (dossier, réponses, suivi, préférences) restent dans le navigateur (`localStorage`). Rien n'est envoyé sur un serveur.

## Raccourci depuis la page d'accueil

Pour ajouter un bouton vers cette application dans `/mathilab/index.html`, réutilise la classe `.btn-decagone` déjà présente et ajoute :
```html
<a href="/dys/index.html" class="btn-decagone" aria-label="Accéder au parcours Dys">
  <i class="fa-solid fa-shapes" aria-hidden="true"></i><span>Parcours<br>Dys</span>
</a>
```

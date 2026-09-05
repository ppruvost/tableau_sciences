# MermozLab — Dessiner des plans (Bâtiment)

## Principe

Le domaine **🏗️ Bâtiment (plans de maison)** ajoute à l'éditeur
diagrams.net la bibliothèque native **"Plan d'architecte"**
("Floorplan") : murs, portes, fenêtres, mobilier de cuisine, salle
de bain, chambre et séjour, escaliers, etc. — le même principe que
les outils grand public de plan de maison en 3D (par exemple celui
de Leroy Merlin), mais directement intégré à l'éditeur diagrams.net
déjà utilisé pour les schémas de sciences.

Aucune donnée n'est envoyée à un service tiers : tout se passe dans
l'éditeur diagrams.net déjà utilisé pour les autres domaines
(électricité, chimie...), en local dans le navigateur.

## Ouvrir un plan

Deux points d'entrée, visibles dans le catalogue (`index.html`,
section "🏗️ Bâtiment") :

1. **Plan de maison (modèle de départ)** — ouvre l'éditeur avec un
   petit plan d'appartement déjà tracé (Salon, Chambre, Salle de
   bain : murs, porte d'entrée, fenêtres, mobilier de base), à
   modifier ou compléter.
2. **Bibliothèque intégrée : Plan d'architecte** — ouvre l'éditeur à
   vide, avec la bibliothèque de formes directement disponible dans
   le panneau de gauche (recherche par mot-clé : "wall", "door",
   "window", "bed", "sofa", "sink", "stairs"...).

Dans les deux cas, l'éditeur est le même que pour tous les autres
domaines de ce dépôt : mêmes menus, même bouton **"Enregistrer sous
.drawio"** dans le bandeau pour sauvegarder son travail (voir la
section correspondante du dépôt).

## Utilisations pédagogiques possibles

- **Sécurité en laboratoire** : plan d'implantation de la salle
  B27 (paillasses, postes de sécurité, issues de secours, matériel
  de premiers secours), plan d'évacuation.
- **Filières bâtiment / aménagement / logistique** (MCC, GATL, TCI,
  Logistique) : représenter un espace de travail, un entrepôt, une
  zone de stockage, une implantation de poste de travail.
- **Projets transversaux** : appui visuel pour un exposé, un rapport
  de stage ou un dossier professionnel nécessitant un plan simple.

## Ajouter un nouveau modèle de plan

Pour proposer un nouveau modèle de départ (autre pièce, autre
filière) :

1. Créer le fichier `.drawio` dans `diagrams/libraries/batiment/`
   (ou un autre sous-dossier pertinent).
2. Ajouter une entrée dans le tableau `modeles` du domaine concerné
   dans `diagrams/libraries/manifest.json` (champs `cle`, `fichier`,
   `titre`).
3. Déclarer la même `cle` dans l'objet `MODELES` de
   `diagrams/assets/editor.js`, associée au chemin du fichier.
4. Relancer `python3 diagrams/scripts/generate_index.py` (ou laisser
   le workflow GitHub Actions `diagrams-sciences.yml` s'en charger
   automatiquement au prochain push) pour que le catalogue
   `index.html` soit mis à jour.

Voir `diagrams/libraries/SOURCES.md` (sections 8 et 9) pour les
sources et licences de la bibliothèque native et du modèle fourni.

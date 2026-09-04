#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
diagrams/scripts/generate_index.py
===================================

Regenere diagrams/index.html a partir de diagrams/libraries/manifest.json
et du contenu reel du dossier diagrams/libraries/.

Appele par le workflow GitHub Actions
.github/workflows/diagrams-sciences.yml a chaque modification de
diagrams/libraries/** (nouveau fichier de bibliotheque, nouveau
domaine dans manifest.json, etc.) : plus besoin de retoucher
index.html a la main a chaque ajout.

Usage :
    python3 diagrams/scripts/generate_index.py
    python3 diagrams/scripts/generate_index.py --check   # verifie sans ecrire (CI)

Regles de generation (miroir de ce que faisait la mise a jour
manuelle de index.html jusqu'ici) :

- Un domaine de manifest.json n'apparait dans le menu et dans le
  catalogue QUE s'il a au moins un element a afficher (une entree
  dans "libraries", "modeles" ou "builtin"). Un domaine present dans
  manifest.json mais totalement vide (ex. "mecanique" tant qu'aucune
  bibliotheque mecanique n'existe) est ignore silencieusement -- il
  apparaitra automatiquement des qu'un fichier lui sera associe.
- "libraries" : fichiers reels du depot (.xml -> bibliotheque
  diagrams.net telechargeable/importable ; .svg -> pictogramme,
  affiche avec son apercu). Chaque fichier DOIT exister sur le
  disque, sinon la generation echoue avec un message clair (mieux
  vaut un echec de build visible qu'un lien mort silencieux).
- "modeles" : diagrammes .drawio complets (pas des bibliotheques de
  formes) consideres comme des points de depart. Ouverts directement
  dans l'editeur, pre-charges, via editor.html?modele=<cle> (la cle
  DOIT correspondre a une entree de l'objet MODELES dans
  assets/editor.js).
- "builtin" : bibliotheques natives de diagrams.net deja integrees a
  l'editeur (ex. "floorplan" pour "Plan d'architecte"), activees via
  le parametre libs= de assets/editor.js. Rendu sous forme d'une
  carte "bibliotheque integree" pointant vers l'editeur, distincte
  visuellement (classe item-builtin), pour ne pas laisser croire
  qu'il s'agit d'un fichier telechargeable du depot.
"""

import json
import sys
from pathlib import Path

DIAGRAMS_DIR = Path(__file__).resolve().parent.parent
LIBRARIES_DIR = DIAGRAMS_DIR / "libraries"
MANIFEST_PATH = LIBRARIES_DIR / "manifest.json"
INDEX_PATH = DIAGRAMS_DIR / "index.html"

# Bibliotheques natives de diagrams.net : libelle humain affiche sur
# la carte "bibliotheque integree" du catalogue pour chaque id
# eventuellement liste dans le champ "builtin" d'un domaine.
BIBLIOTHEQUES_NATIVES = {
    "floorplan": "Plan d'architecte (murs, portes, fenetres, mobilier)",
}


def echapper(texte):
    return (
        texte.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def item_fichier(domaine_cle, chemin_relatif):
    """Une entree de la liste "libraries" : fichier reel du depot."""
    chemin_disque = LIBRARIES_DIR / chemin_relatif
    if not chemin_disque.is_file():
        raise FileNotFoundError(
            f"manifest.json (domaine '{domaine_cle}') reference "
            f"'{chemin_relatif}' mais ce fichier n'existe pas dans "
            f"diagrams/libraries/."
        )
    href = f"libraries/{chemin_relatif}"
    nom = chemin_disque.name
    if chemin_relatif.lower().endswith(".svg"):
        return (
            '<li class="item">'
            f'<a href="{href}" target="_blank">'
            f'<img src="{href}" alt="{echapper(nom)}" loading="lazy">'
            f"<span>{echapper(nom)}</span></a></li>"
        )
    return (
        '<li class="item item-xml">'
        f'<a href="{href}" target="_blank">'
        '<i class="fas fa-file-code file-icon" aria-hidden="true"></i>'
        f"<span>{echapper(nom)}</span></a></li>"
    )


def item_modele(domaine_cle, modele):
    """Une entree de la liste "modeles" : diagramme complet pre-rempli,
    ouvert directement dans l'editeur (pas un lien de telechargement
    brut) via editor.html?modele=<cle>."""
    chemin_disque = LIBRARIES_DIR / modele["fichier"]
    if not chemin_disque.is_file():
        raise FileNotFoundError(
            f"manifest.json (domaine '{domaine_cle}', modele "
            f"'{modele.get('cle')}') reference '{modele['fichier']}' "
            f"mais ce fichier n'existe pas dans diagrams/libraries/."
        )
    href = f"editor.html?modele={modele['cle']}"
    titre = modele.get("titre", chemin_disque.name)
    return (
        '<li class="item item-modele">'
        f'<a href="{href}">'
        '<i class="fas fa-file-import file-icon" aria-hidden="true"></i>'
        f"<span>{echapper(titre)}</span></a></li>"
    )


def item_builtin(builtin_ids):
    """Une carte unique par domaine annoncant la ou les bibliotheques
    natives de diagrams.net deja activees dans l'editeur pour ce
    domaine (pas un fichier du depot -> pas de telechargement)."""
    libelles = []
    for bid in builtin_ids:
        libelles.append(BIBLIOTHEQUES_NATIVES.get(bid, bid))
    texte = "Bibliotheque integree : " + ", ".join(libelles)
    return (
        '<li class="item item-builtin">'
        '<a href="editor.html">'
        '<i class="fas fa-toolbox file-icon" aria-hidden="true"></i>'
        f"<span>{echapper(texte)}</span></a></li>"
    )


def construire_section(cle, domaine):
    items = []
    for chemin in domaine.get("libraries", []):
        items.append(item_fichier(cle, chemin))
    for modele in domaine.get("modeles", []):
        items.append(item_modele(cle, modele))
    if domaine.get("builtin"):
        items.append(item_builtin(domaine["builtin"]))

    if not items:
        return None, None

    icon = domaine.get("icon", "fa-shapes")
    css_class = domaine.get("cssClass", "domaine-electricite")
    nom = domaine["name"]

    nav_link = (
        f'  <a href="#{cle}"><i class="fas {icon}" aria-hidden="true"></i> '
        f"{nom}</a>"
    )
    section = (
        f'        <section id="{cle}"><h2 class="{css_class}">'
        f'<i class="fas {icon}" aria-hidden="true"></i> {nom}</h2>'
        f'<ul class="grid">\n          '
        + "\n          ".join(items)
        + "\n          </ul></section>"
    )
    return nav_link, section


def generer(manifest):
    nav_links = []
    sections = []
    for cle, domaine in manifest["domains"].items():
        nav_link, section = construire_section(cle, domaine)
        if nav_link is None:
            continue
        nav_links.append(nav_link)
        sections.append(section)

    nav_html = "\n".join(nav_links)
    sections_html = "\n\n".join(sections)

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>MermozLab -- Bibliotheques sciences</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header>
  <h1><i class="fas fa-diagram-project" aria-hidden="true"></i> MermozLab -- Bibliotheques sciences</h1>
  <p>Physique-chimie BAC Pro - diagrams.net</p>
</header>
<nav>
  <a href="editor.html" class="cta"><i class="fas fa-pen-to-square" aria-hidden="true"></i> Ouvrir l'editeur</a>
{nav_html}
  <a href="libraries/SOURCES.md"><i class="fas fa-file-lines" aria-hidden="true"></i> Sources &amp; licences</a>
  <a href="docs/couverture-bac-pro.md"><i class="fas fa-list-check" aria-hidden="true"></i> Couverture BAC Pro</a>
  <a href="docs/plans-maison.md"><i class="fas fa-drafting-compass" aria-hidden="true"></i> Dessiner des plans</a>
</nav>
<main>
{sections_html}
</main>
<footer>
  Genere automatiquement par le workflow GitHub Actions
  <code>diagrams-sciences.yml</code>. Cliquer sur un pictogramme ou une
  bibliotheque l'ouvre ou la telecharge ; les fichiers .xml
  s'importent dans diagrams.net via File &gt; Import Library.
</footer>
</body>
</html>
"""


def main():
    verification_seule = "--check" in sys.argv

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    contenu = generer(manifest)

    if verification_seule:
        existant = INDEX_PATH.read_text(encoding="utf-8") if INDEX_PATH.is_file() else None
        if existant == contenu:
            print("index.html est a jour.")
            return 0
        print("index.html N'EST PAS a jour par rapport a manifest.json.")
        print("Lancer : python3 diagrams/scripts/generate_index.py")
        return 1

    INDEX_PATH.write_text(contenu, encoding="utf-8")
    print(f"index.html regenere ({len(contenu)} caracteres).")
    return 0


if __name__ == "__main__":
    sys.exit(main())

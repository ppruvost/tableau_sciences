#!/usr/bin/env python3
"""Génère programmes/index.json à partir des fichiers .py du dossier.

Utilisation (depuis n'importe où) :
    python3 programmes/generer_index.py

À relancer après chaque ajout / suppression de fichier .py
si ton hébergement n'affiche pas le contenu des dossiers
(GitHub Pages, par exemple).
"""

import json
from pathlib import Path

dossier = Path(__file__).resolve().parent

fichiers = sorted(
    (p.name for p in dossier.glob("*.py")
     if p.name != Path(__file__).name and not p.name.startswith("_")),
    key=str.casefold,
)

(dossier / "index.json").write_text(
    json.dumps(fichiers, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

print(f"{len(fichiers)} programme(s) listé(s) dans index.json")

#!/usr/bin/env python3
"""
molecule/outils/ajouter_molecules.py

Complète (ou met à jour) molecule/molecules.json à partir d'une liste de
molécules décrites par un SMILES. La géométrie 3D est calculée avec RDKit
(plongement ETKDG puis optimisation MMFF94), la formule brute et la masse
molaire en sont déduites, puis l'entrée est fusionnée dans le JSON :

  * si le nom existe déjà (accents et casse ignorés) l'entrée est mise à
    jour : la structure est remplacée, les alias sont ajoutés aux alias
    existants ;
  * sinon l'entrée est ajoutée à la fin.

Usage (depuis le dossier molecule/) :

    pip install rdkit
    python3 outils/ajouter_molecules.py            # ajoute/actualise tout
    python3 outils/ajouter_molecules.py --liste    # affiche seulement les noms

Pour ajouter une molécule : ajouter une ligne dans ENTREES ci-dessous.

  nom      nom français tel qu'il apparaît dans les TP (clé de recherche)
  smiles   SMILES de la molécule ; plusieurs parties séparées par « . »
           pour un composé ionique (chaque ion est placé à côté de l'autre,
           sans liaison, comme pour sulfate de cuivre(II) dans le JSON)
  alias    autres écritures utilisables dans la recherche
  cas      numéro CAS (facultatif, sert à relier un produit des TP à sa molécule)
  formule  formule affichée (facultatif ; sinon formule brute calculée)
"""

import json
import math
import sys
import unicodedata
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors, rdMolDescriptors

CHEMIN_JSON = Path(__file__).resolve().parent.parent / "molecules.json"


def normaliser(texte):
    """Même normalisation que script.js : minuscules, sans accents."""
    texte = unicodedata.normalize("NFD", texte.lower())
    return "".join(c for c in texte if unicodedata.category(c) != "Mn")


# ---------------------------------------------------------------------------
# Données à ajouter
# ---------------------------------------------------------------------------

ACIDES = [
    # (nom, SMILES, alias, CAS)
    ("acide méthanoïque", "OC=O", ["acide formique", "formic acid", "methanoic acid", "HCOOH"], "64-18-6"),
    ("acide éthanoïque", "CC(=O)O", ["acide acétique", "acetic acid", "ethanoic acid", "ch3cooh"], "64-19-7"),
    ("acide propanoïque", "CCC(=O)O", ["acide propionique", "propanoic acid", "propionic acid", "CH3CH2COOH"], "79-09-4"),
    ("acide butanoïque", "CCCC(=O)O", ["acide butyrique", "butanoic acid", "butyric acid", "CH3CH2CH2COOH"], "107-92-6"),
]

ALCOOLS = [
    ("méthanol", "CO", ["methanol", "alcool méthylique", "CH3OH"], "67-56-1"),
    ("éthanol", "CCO", ["ethanol", "alcool éthylique", "C2H5OH", "CH3CH2OH"], "64-17-5"),
    ("propan-1-ol", "CCCO", ["1-propanol", "propanol", "alcool propylique", "propan-1-ol", "C3H7OH"], "71-23-8"),
    ("propan-2-ol", "CC(C)O", ["isopropanol", "2-propanol", "alcool isopropylique", "CH3CHOHCH3"], "67-63-0"),
    ("2-méthylpropan-2-ol", "CC(C)(C)O", ["tert-butanol", "alcool tertiobutylique", "tert-butyl alcohol", "(CH3)3COH"], "75-65-0"),
    ("3-méthylbutan-1-ol", "CC(C)CCO", ["alcool isoamylique", "isoamyl alcohol", "isopentyl alcohol", "3-methyl-1-butanol"], "123-51-3"),
]

CARBONYLES = [
    ("éthanal", "CC=O", ["acétaldéhyde", "acetaldehyde", "ethanal", "CH3CHO"], "75-07-0"),
    ("propanal", "CCC=O", ["propionaldéhyde", "propionaldehyde", "propanal", "CH3CH2CHO"], "123-38-6"),
    ("propanone", "CC(C)=O", ["acétone", "acetone", "propan-2-one", "CH3COCH3"], "67-64-1"),
    ("butanone", "CCC(C)=O", ["butan-2-one", "méthyléthylcétone", "methyl ethyl ketone", "MEK"], "78-93-3"),
]

# Acyles / alkyles des esters du TP05 (acide + alcool -> ester + eau)
ACYLES = [
    ("méthanoate", "formiate", "formate", "O=C"),
    ("éthanoate", "acétate", "acetate", "CC(=O)"),
    ("propanoate", "propionate", "propanoate", "CCC(=O)"),
    ("butanoate", "butyrate", "butanoate", "CCCC(=O)"),
]
ALKYLES = [
    ("méthyle", "methyl", "C"),
    ("éthyle", "ethyl", "CC"),
    ("propyle", "propyl", "CCC"),
    ("isoamyle", "isoamyl", "CCC(C)C"),
]

# Autres espèces des TP de chimie (acides/bases du TP03, produits usuels)
DIVERS = [
    ("chlorure d'hydrogène", "Cl", ["acide chlorhydrique", "HCl", "hydrogen chloride", "hydrochloric acid"], "7647-01-0"),
    ("acide sulfurique", "OS(=O)(=O)O", ["H2SO4", "sulfuric acid", "sulfate d'hydrogène"], "7664-93-9"),
    ("acide nitrique", "O[N+](=O)[O-]", ["HNO3", "nitric acid"], "7697-37-2"),
    ("acide phosphorique", "OP(=O)(O)O", ["H3PO4", "phosphoric acid", "acide orthophosphorique"], "7664-38-2"),
    ("fluorure d'hydrogène", "F", ["acide fluorhydrique", "HF", "hydrogen fluoride", "hydrofluoric acid"], "7664-39-3"),
    ("acide nitreux", "ON=O", ["HNO2", "nitrous acid"], "7782-77-6"),
    ("acide borique", "OB(O)O", ["H3BO3", "boric acid", "acide orthoborique"], "10043-35-3"),
    ("acide oxalique", "OC(=O)C(=O)O", ["acide éthanedioïque", "H2C2O4", "oxalic acid", "ethanedioic acid"], "144-62-7"),
    ("acide carbonique", "OC(O)=O", ["H2CO3", "carbonic acid"], "463-79-6"),
    ("sulfure d'hydrogène", "S", ["H2S", "hydrogen sulfide", "sulfane"], "7783-06-4"),
    ("EDTA", "OC(=O)CN(CC(O)=O)CCN(CC(O)=O)CC(O)=O",
     ["H4EDTA", "acide éthylènediaminetétraacétique", "acide éthylènediaminetétraacétique", "ethylenediaminetetraacetic acid"], "60-00-4"),
    ("ammoniac", "N", ["NH3", "ammonia", "azane"], "7664-41-7"),
    ("méthylamine", "CN", ["CH3NH2", "methylamine", "méthanamine"], "74-89-5"),
    ("éthylamine", "CCN", ["CH3CH2NH2", "C2H5NH2", "ethylamine", "éthanamine"], "75-04-7"),
    ("aniline", "Nc1ccccc1", ["C6H5NH2", "phénylamine", "benzenamine", "aniline"], "62-53-3"),
    ("acide citrique", "OC(=O)CC(O)(CC(O)=O)C(O)=O", ["citric acid", "acide 2-hydroxypropane-1,2,3-tricarboxylique", "jus de citron"], "77-92-9"),
    ("glucose", "OCC1OC(O)C(O)C(O)C1O", ["D-glucose", "dextrose", "C6H12O6"], "50-99-7"),
    ("saccharose", "OCC1OC(CO)(OC2OC(CO)C(O)C(O)C2O)C(O)C1O", ["sucrose", "sucre", "C12H22O11"], "57-50-1"),
    # Indicateurs colorés du TP02 (formes neutres représentatives)
    ("bleu de bromothymol",
     "CC(C)c1cc(C2(c3cc(C(C)C)c(O)c(Br)c3C)OS(=O)(=O)c3ccccc32)c(C)c(Br)c1O",
     ["BBT", "bromothymol blue", "bleu de bromothymol (BBT)"], "76-59-5"),
    ("phénolphtaléine", "O=C1OC(c2ccc(O)cc2)(c2ccc(O)cc2)c2ccccc12",
     ["phenolphthalein", "phtaléine du phénol"], "77-09-8"),
    ("rouge de méthyle", "CN(C)c1ccc(N=Nc2ccccc2C(=O)O)cc1",
     ["methyl red", "C.I. Acid Red 2", "rouge de méthyle indicateur"], "493-52-7"),
    ("hélianthine", "CN(C)c1ccc(N=Nc2ccc(S(=O)(=O)[O-])cc2)cc1.[Na+]",
     ["methyl orange", "orange de méthyle", "hélianthine (orange de méthyle)",
      "sodium 4-(dimethylamino)azobenzene-4'-sulfonate"], "547-58-0"),
    # Sel ionique : un cation / un anion
    ("chlorure de sodium", "[Na+].[Cl-]", ["NaCl", "sel de table", "sodium chloride", "sel"], "7647-14-5"),
    ("éthanoate de sodium", "CC(=O)[O-].[Na+]", ["acétate de sodium", "CH3COONa", "sodium acetate"], "127-09-3"),
    ("méthanoate de sodium", "O=C[O-].[Na+]", ["formiate de sodium", "HCOONa", "sodium formate"], "141-53-7"),
    ("propanoate de sodium", "CCC(=O)[O-].[Na+]", ["propionate de sodium", "CH3CH2COONa", "sodium propionate"], "137-40-6"),
    ("butanoate de sodium", "CCCC(=O)[O-].[Na+]", ["butyrate de sodium", "CH3CH2CH2COONa", "sodium butyrate"], "156-54-7"),
]

# Formules affichées des sels (la formule brute calculée suivrait l'ordre de Hill)
FORMULES = {
    "chlorure de sodium": "NaCl",
    "éthanoate de sodium": "CH3COONa",
    "méthanoate de sodium": "HCOONa",
    "propanoate de sodium": "CH3CH2COONa",
    "butanoate de sodium": "CH3CH2CH2COONa",
    "hélianthine": "C14H14N3NaO3S",
}

# CAS des entrées déjà présentes dans le JSON (ajoutés si absents)
CAS_EXISTANTS = {
    "eau": "7732-18-5",
    "hydroxyde de sodium": "1310-73-2",
    "permanganate de potassium": "7722-64-7",
    "hydrogène peroxyde": "7722-84-1",
    "chlorure de potassium": "7447-40-7",
    "éther diéthylique": "60-29-7",
    "carbonate de sodium": "497-19-8",
    "hydrogénocarbonate de sodium": "144-55-8",
}
ALIAS_EXISTANTS = {
    "hydrogène peroxyde": ["peroxyde d'hydrogène"],
    "eau": ["H2O"],
}


def construire_entrees():
    entrees = []

    for nom, smiles, alias, cas in ACIDES + ALCOOLS + CARBONYLES + DIVERS:
        entrees.append({"nom": nom, "smiles": smiles, "aliases": alias, "cas": cas})

    # 16 esters : acide + alcool - H2O
    for (acyle, trad, ang, smi_acyle) in ACYLES:
        for (alkyle, ang_alkyle, smi_alkyle) in ALKYLES:
            elision = "d'" if alkyle[0] in "aeiouyé" else "de "
            nom = f"{acyle} {elision}{alkyle}"
            alias = [
                f"{trad} {elision}{alkyle}",
                f"{ang_alkyle} {ang}",
                f"{acyle} de {alkyle}",
            ]
            entrees.append({
                "nom": nom,
                "smiles": f"{smi_acyle}O{smi_alkyle}",
                "aliases": list(dict.fromkeys(alias)),
            })
    return entrees


# ---------------------------------------------------------------------------
# Géométrie 3D
# ---------------------------------------------------------------------------

def plonger(mol_h):
    """Plongement ETKDG + optimisation MMFF94 (UFF en secours)."""
    params = AllChem.ETKDGv3()
    params.randomSeed = 7
    if AllChem.EmbedMolecule(mol_h, params) != 0:
        params.useRandomCoords = True
        if AllChem.EmbedMolecule(mol_h, params) != 0:
            raise RuntimeError("plongement 3D impossible")
    try:
        if AllChem.MMFFHasAllMoleculeParams(mol_h):
            AllChem.MMFFOptimizeMolecule(mol_h, maxIters=2000)
        else:
            AllChem.UFFOptimizeMolecule(mol_h, maxIters=2000)
    except Exception:
        pass
    return mol_h


def coordonnees(mol_h):
    conf = mol_h.GetConformer()
    return [(a.GetSymbol(), *conf.GetAtomPosition(a.GetIdx())) for a in mol_h.GetAtoms()]


def centrer(atomes):
    n = len(atomes)
    cx = sum(a[1] for a in atomes) / n
    cy = sum(a[2] for a in atomes) / n
    cz = sum(a[3] for a in atomes) / n
    return [(s, x - cx, y - cy, z - cz) for (s, x, y, z) in atomes]


def rayon(atomes):
    return max((math.sqrt(x * x + y * y + z * z) for (_, x, y, z) in atomes), default=0.0)


def fragment_3d(smiles_frag):
    """Retourne (atomes, indices des atomes de charge négative)."""
    mol = Chem.MolFromSmiles(smiles_frag)
    if mol is None:
        raise ValueError(f"SMILES invalide : {smiles_frag}")
    mol_h = Chem.AddHs(mol)
    negatifs = [a.GetIdx() for a in mol_h.GetAtoms() if a.GetFormalCharge() < 0]
    if mol_h.GetNumAtoms() == 1:
        return [(mol_h.GetAtomWithIdx(0).GetSymbol(), 0.0, 0.0, 0.0)], negatifs
    if mol_h.GetNumAtoms() == 2:  # H-X (HCl, HF) : plongement inutile
        sym = [a.GetSymbol() for a in mol_h.GetAtoms()]
        longueur = {"Cl": 1.27, "F": 0.92}.get(next(s for s in sym if s != "H"), 1.0)
        return [(sym[0], 0.0, 0.0, 0.0), (sym[1], longueur, 0.0, 0.0)], negatifs
    plonger(mol_h)
    return coordonnees(mol_h), negatifs


def placer_ions(fragments):
    """Place chaque fragment le long de l'axe x (anion au centre, cations de part et d'autre)."""
    fragments = [centrer(f) for f in fragments]
    if len(fragments) == 1:
        return fragments[0]

    # fragment le plus gros au centre, les autres alternativement à gauche et à droite
    ordre = sorted(range(len(fragments)), key=lambda i: -len(fragments[i]))
    centre = ordre[0]
    placement = {centre: 0.0}
    gauche = droite = rayon(fragments[centre])
    for k, i in enumerate(ordre[1:]):
        ri = rayon(fragments[i])
        ecart = 2.0
        if k % 2 == 0:
            droite += ecart + ri
            placement[i] = droite
            droite += ri
        else:
            gauche += ecart + ri
            placement[i] = -gauche
            gauche += ri

    atomes = []
    for i, frag in enumerate(fragments):
        dx = placement[i]
        atomes += [(s, x + dx, y, z) for (s, x, y, z) in frag]
    return atomes


def placer_cations_pres_anion(anion, negatifs, cations):
    """Cations monoatomiques à 2,3 Å de l'atome chargé, vers l'extérieur de l'anion."""
    centre_anion = tuple(sum(a[k] for a in anion) / len(anion) for k in (1, 2, 3))
    atomes = list(anion)
    for k, cation in enumerate(cations):
        cible = anion[negatifs[min(k, len(negatifs) - 1)]]
        v = [cible[i + 1] - centre_anion[i] for i in range(3)]
        norme = math.sqrt(sum(t * t for t in v)) or 1.0
        v = [t / norme for t in v]
        pos = tuple(cible[i + 1] + 2.3 * v[i] for i in range(3))
        atomes.append((cation[0][0], *pos))
    return atomes


def placer_carboxylate_sodium(carboxylate, sodium):
    """Na+ dans le plan du groupe COO-, à égale distance des deux oxygènes."""
    atomes = centrer(carboxylate)
    oxygenes = [i for i, a in enumerate(atomes) if a[0] == "O"]
    carbone = next(
        i for i, a in enumerate(atomes)
        if a[0] == "C" and sum(
            1 for j in oxygenes
            if math.dist(a[1:], atomes[j][1:]) < 1.5) == 2)
    o1, o2 = (atomes[i][1:] for i in oxygenes[:2])
    milieu = tuple((o1[k] + o2[k]) / 2 for k in range(3))
    c = atomes[carbone][1:]
    v = [milieu[k] - c[k] for k in range(3)]
    norme = math.sqrt(sum(t * t for t in v))
    v = [t / norme for t in v]
    na = tuple(milieu[k] + 2.0 * v[k] for k in range(3))
    return atomes + [(sodium[0][0], *na)]


def est_carboxylate_sodium(parts):
    return (len(parts) == 2 and any(p == "[Na+]" for p in parts)
            and any("C(=O)[O-]" in p or "O=C[O-]" in p for p in parts))


def structure_xyz(nom, smiles):
    parts = smiles.split(".")
    resultats = [fragment_3d(p) for p in parts]
    fragments = [r[0] for r in resultats]
    negatifs = [r[1] for r in resultats]

    gros_anions = [i for i, f in enumerate(fragments) if len(f) > 1 and negatifs[i]]
    cations = [i for i, f in enumerate(fragments) if len(f) == 1 and parts[i].startswith("[") and "+" in parts[i]]

    if est_carboxylate_sodium(parts):
        carbo = fragments[0] if parts[0] != "[Na+]" else fragments[1]
        sod = fragments[1] if parts[0] != "[Na+]" else fragments[0]
        atomes = placer_carboxylate_sodium(carbo, sod)
    elif len(parts) > 1 and len(gros_anions) == 1 and cations and len(cations) == len(parts) - 1:
        i = gros_anions[0]
        atomes = centrer(placer_cations_pres_anion(centrer(fragments[i]), negatifs[i],
                                                    [fragments[c] for c in cations]))
    elif len(fragments) > 1:
        atomes = placer_ions(fragments)
    else:
        atomes = centrer(fragments[0])

    lignes = [str(len(atomes)), f"{nom} (RDKit ETKDG + MMFF94)"]
    lignes += [f"{s:<2} {x:10.4f} {y:10.4f} {z:10.4f}" for (s, x, y, z) in atomes]
    return "\n".join(lignes) + "\n"


def formule_et_masse(smiles):
    mol = Chem.MolFromSmiles(smiles)
    formule = rdMolDescriptors.CalcMolFormula(mol)  # ex. C5H12O ou C2H3O2.Na (charges)
    formule = formule.replace("+", "").replace("-", "")
    return formule, round(Descriptors.MolWt(mol), 3)


# ---------------------------------------------------------------------------
# Fusion dans molecules.json
# ---------------------------------------------------------------------------

def main():
    entrees = construire_entrees()

    if "--liste" in sys.argv:
        for e in entrees:
            print(e["nom"])
        return

    donnees = json.loads(CHEMIN_JSON.read_text(encoding="utf-8"))
    index = {normaliser(m["nom"]): m for m in donnees}

    ajoutes, maj = [], []

    for e in entrees:
        formule, masse = formule_et_masse(e["smiles"])
        parts = e["smiles"].split(".")
        ionique = len(parts) > 1
        commentaire = (
            "composé ionique : les ions sont représentés côte à côte, sans liaison covalente ; "
            "géométrie de chaque ion calculée par RDKit (ETKDG + MMFF94)"
            if ionique else
            "géométrie générée par RDKit (plongement ETKDG puis optimisation MMFF94)"
        )
        nouveau = {
            "nom": e["nom"],
            "aliases": e["aliases"],
            "formule": e.get("formule") or FORMULES.get(e["nom"]) or formule,
            "masse": masse,
            "_comment": commentaire,
            "structure": structure_xyz(e["nom"], e["smiles"]),
        }
        if e.get("cas"):
            nouveau["cas"] = e["cas"]

        cle = normaliser(e["nom"])
        # un alias d'une entrée existante vaut aussi pour le rapprochement
        existant = index.get(cle) or next(
            (m for m in donnees
             if cle in {normaliser(a) for a in m.get("aliases", [])}), None)

        if existant:
            alias = list(existant.get("aliases", []))
            deja = {normaliser(a) for a in alias} | {normaliser(existant["nom"])}
            alias += [a for a in nouveau["aliases"] if normaliser(a) not in deja]
            existant.update({k: v for k, v in nouveau.items() if k not in ("nom", "aliases")})
            existant["aliases"] = alias
            maj.append(e["nom"])
        else:
            donnees.append(nouveau)
            index[cle] = nouveau
            ajoutes.append(e["nom"])

    # CAS / alias des entrées historiques conservées telles quelles
    for nom, cas in CAS_EXISTANTS.items():
        m = index.get(normaliser(nom))
        if m and "cas" not in m:
            m["cas"] = cas
    for nom, alias in ALIAS_EXISTANTS.items():
        m = index.get(normaliser(nom))
        if m:
            deja = {normaliser(a) for a in m.get("aliases", [])}
            m.setdefault("aliases", []).extend(a for a in alias if normaliser(a) not in deja)

    CHEMIN_JSON.write_text(
        json.dumps(donnees, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"{len(ajoutes)} molécule(s) ajoutée(s), {len(maj)} mise(s) à jour.")
    for n in ajoutes:
        print("  +", n)
    for n in maj:
        print("  ~", n)


if __name__ == "__main__":
    main()

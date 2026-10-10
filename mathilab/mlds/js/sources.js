/* ============================================================
   MLDS — registre des sources (fiches Eduscol, guides, mémoire).
   Utilisé par les ateliers, le générateur de parcours et sources.html.
   Les références viennent des documents fournis avec le projet.
   ============================================================ */
(function () {
  "use strict";

  const EDUSCOL = "Ministère de l'Éducation nationale et de la Jeunesse, Eduscol. Mathématiques, voie professionnelle, 2de, « Accompagnement renforcé »";

  const SOURCES = {
    "eduscol-ar-eq": {
      court: "Eduscol, AR 2de pro : « Résoudre un problème du premier degré » (déc. 2022)",
      complet: EDUSCOL + " : « Résoudre un problème du premier degré ». Décembre 2022.",
      fichier: "fiche-actioncalcul-algebrique2propdf-93798.pdf",
      repris: "Le problème des vestes (équation 34x − 60 = 2 830, prix initial 85 €), la question flash de la baguette, les situations « prime proportionnelle à l'ancienneté », « rectangle de périmètre 40 cm » et « parc d'attractions », le protocole de résolution et les pistes de différenciation."
    },
    "eduscol-ar-geo": {
      court: "Eduscol, AR 2de pro : « Reconnaître des figures usuelles et déterminer l'aire des surfaces associées » (déc. 2022)",
      complet: EDUSCOL + " : « Reconnaître des figures usuelles et déterminer l'aire des surfaces associées ». Décembre 2022.",
      fichier: "fiche-actiongeometrie2propdf-93807.pdf",
      repris: "Le pan de toiture végétalisé (cotes manquantes par le théorème de Pythagore, aire d'un rectangle auquel on retire un coin), les questions flash sur les aires et les conversions, le protocole de résolution."
    },
    "eduscol-ar-nombres": {
      court: "Eduscol, AR 2de pro : « Manipuler les nombres rationnels en écriture fractionnaire » (déc. 2022)",
      complet: EDUSCOL + " : « Manipuler les nombres rationnels en écriture fractionnaire ». Décembre 2022.",
      fichier: "fiche-actionnombres-et-calculs2-propdf-93813.pdf",
      repris: "La cocotte en origami (32 triangles, fractions de la tête, de la patte, de la queue et de la partie non coloriée), l'addition de fractions, le cocktail, l'écriture scientifique, la comparaison de distances, le protocole de résolution."
    },
    "eduscol-ar-ogd": {
      court: "Eduscol, AR 2de pro : « Décoder un texte par analyse fréquentielle » (déc. 2022)",
      complet: EDUSCOL + " : « Décoder un texte par analyse fréquentielle ». Décembre 2022.",
      fichier: "fiche-actionogd2propdf-93825.pdf",
      repris: "Le décodage d'un message chiffré par le chiffre de César, le calcul de fréquences (urne, céréales), la médiane de salaires, la fréquence « plus de 12 h », la moyenne d'une série lue sur un diagramme en bâtons."
    },
    "guide-cm": {
      court: "MENJS-DGESCO, « La résolution de problèmes mathématiques au cours moyen » (Les guides fondamentaux pour enseigner), ch. II p. 42, ch. III p. 65, ch. IV p. 107",
      complet: "Ministère de l'Éducation nationale, de la Jeunesse et des Sports, DGESCO. « La résolution de problèmes mathématiques au cours moyen », collection Les guides fondamentaux pour enseigner.",
      fichier: "guide-resolution-de-problemes-cours-moyen-90990.pdf",
      repris: "Le modèle en quatre phases (comprendre, modéliser, calculer, répondre, p. 42), les trois curseurs pour adapter un problème (structure, texte, champ numérique, p. 65), les schémas en barres et les tableaux (p. 107)."
    },
    "guide-college": {
      court: "MENJS-DGESCO, « La résolution de problèmes mathématiques au collège » (Les guides fondamentaux pour enseigner), p. 62 et ch. VII",
      complet: "Ministère de l'Éducation nationale, de la Jeunesse et des Sports, DGESCO. « La résolution de problèmes mathématiques au collège », collection Les guides fondamentaux pour enseigner.",
      fichier: "guide-resolution-de-problemes-mathematiques-au-college-73914.pdf",
      repris: "Le modèle en barres (p. 62) et les démarches pour enseigner la résolution de problèmes, dont les problèmes qui se modélisent par une équation (ch. VII, p. 177 et suivantes)."
    },
    "gigant": {
      court: "GIGANT, Gauthier, mémoire MEEF, INSPE de Besançon, 2021, « Le décrochage scolaire : maintenir l'intérêt des décrocheurs en mathématiques »",
      complet: "GIGANT, Gauthier. « Le décrochage scolaire : maintenir l'intérêt des décrocheurs en mathématiques ». Mémoire MEEF, INSPE de Besançon, 2021 (dumas-03810176, archive HAL).",
      fichier: "",
      repris: "L'esprit du défi collectif du plan de travail (travail en groupe, manipulation, pas de correction rouge/vert)."
    }
  };

  function lien(id) {
    const s = SOURCES[id];
    if (!s) return "";
    const a = document.createElement("a");
    a.href = "sources.html#" + id;
    a.textContent = s.court;
    return a.outerHTML;
  }

  /** « Source : … » en HTML, avec un lien vers la page des sources. */
  function citer(ids) {
    const liste = (ids || []).filter((id) => SOURCES[id]);
    if (!liste.length) return "";
    return '<i class="fa-solid fa-book-open" aria-hidden="true"></i> ' +
      (liste.length > 1 ? "Sources : " : "Source : ") + liste.map(lien).join(" ; ");
  }

  /** Texte brut (export .md, impression). */
  function citerTexte(ids) {
    return (ids || []).filter((id) => SOURCES[id]).map((id) => SOURCES[id].complet).join(" — ");
  }

  window.SOURCES = SOURCES;
  window.citerSources = citer;
  window.citerSourcesTexte = citerTexte;
})();

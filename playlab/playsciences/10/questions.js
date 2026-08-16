/* ============================================================
   ============  QUIZ PLAYSCIENCES — OPTIQUE 1ERE  ============
   ============================================================ */

window.questions = [

  {
    question: "Sur cette construction d'image à travers une lentille convergente, où se forme l'image A'B' d'un objet réel placé au-delà du foyer objet ?",
    graphique: "img/q1.png",
    options: [
      "Toujours entre la lentille et le foyer image",
      "De l'autre côté de la lentille, à une distance dépendant de la position de l'objet",
      "Toujours au même endroit quelle que soit la position de l'objet",
      "L'image ne peut jamais se former"
    ],
    bonne_reponse: "De l'autre côté de la lentille, à une distance dépendant de la position de l'objet",
    explication: "La position de l'image dépend de la position de l'objet, déterminée par construction géométrique ou par la relation de conjugaison."
  },

  {
    question: "Comment distingue-t-on expérimentalement une lentille convergente d'une lentille divergente, sans mesure précise ?",
    options: [
      "En regardant à travers la lentille un objet éloigné : l'image observée est droite et rapetissée avec une divergente, inversée avec une convergente selon la distance",
      "Les deux lentilles donnent toujours exactement la même image",
      "Seule la couleur du verre permet de les distinguer",
      "On ne peut jamais les distinguer sans instrument de mesure"
    ],
    bonne_reponse: "En regardant à travers la lentille un objet éloigné : l'image observée est droite et rapetissée avec une divergente, inversée avec une convergente selon la distance",
    explication: "On peut caractériser qualitativement une lentille en observant l'image d'un objet éloigné à travers elle : une divergente donne toujours une image droite et réduite, une convergente peut donner une image inversée selon la distance à l'objet."
  },

  {
    question: "Quelle est la relation de conjugaison pour une lentille mince convergente (formule de Descartes) ?",
    options: [
      "1/OA' − 1/OA = 1/f'",
      "1/OA' + 1/OA = 1/f'",
      "OA' − OA = f'",
      "OA' × OA = f'"
    ],
    bonne_reponse: "1/OA' − 1/OA = 1/f'",
    explication: "1/OA' − 1/OA = 1/f', où f' est la distance focale image, avec les distances comptées algébriquement depuis le centre optique O."
  },

  {
    question: "Comment détermine-t-on expérimentalement la distance focale d'une lentille convergente à l'aide d'un banc d'optique ?",
    graphique: "img/q8.png",
    options: [
      "En mesurant la distance entre la lentille et le point où l'image d'un objet situé à l'infini se forme nette sur un écran",
      "En pesant la lentille",
      "En mesurant son diamètre",
      "En comptant le nombre de rayons lumineux qui la traversent"
    ],
    bonne_reponse: "En mesurant la distance entre la lentille et le point où l'image d'un objet situé à l'infini se forme nette sur un écran",
    explication: "Un objet très éloigné (ou un faisceau parallèle) donne une image nette au foyer image F' : la distance entre la lentille et cette image nette sur l'écran donne expérimentalement la distance focale f'."
  },

  {
    question: "Comment calcule-t-on le grandissement γ d'une image formée par une lentille ?",
    options: [
      "γ = A'B' / AB (rapport algébrique de la taille de l'image sur celle de l'objet)",
      "γ = AB × A'B'",
      "γ = OA' + OA",
      "γ = f' / AB"
    ],
    bonne_reponse: "γ = A'B' / AB (rapport algébrique de la taille de l'image sur celle de l'objet)",
    explication: "Le grandissement γ = A'B'/AB (aussi égal à OA'/OA) compare algébriquement la taille de l'image à celle de l'objet : sa valeur et son signe renseignent sur la taille et l'orientation de l'image."
  },

  {
    question: "Ce graphique compare l'efficacité énergétique de différentes sources lumineuses, en lumens par watt (lm/W). Quelle technologie est la plus efficace énergétiquement ?",
    graphique: "img/q6.png",
    options: [
      "La lampe à incandescence",
      "La lampe halogène",
      "La lampe fluocompacte",
      "La lampe à LED"
    ],
    bonne_reponse: "La lampe à LED",
    explication: "La LED offre la meilleure efficacité énergétique parmi ces technologies."
  },

  {
    question: "Quel type de spectre d'émission produit une lampe à incandescence ?",
    options: [
      "Un spectre de raies très fines",
      "Un spectre continu, réparti sur l'ensemble du domaine visible",
      "Un spectre limité à une seule couleur",
      "Aucun spectre, elle n'émet pas de lumière visible"
    ],
    bonne_reponse: "Un spectre continu, réparti sur l'ensemble du domaine visible",
    explication: "Une lampe à incandescence produit un spectre continu, contrairement à une lampe à vapeur qui produit un spectre de raies."
  },

  {
    question: "Quelle propriété caractérise particulièrement la lumière émise par un laser, comparée à une lampe classique ?",
    options: [
      "Elle est très divergente et multicolore",
      "Elle est peu divergente, monochromatique et cohérente",
      "Elle ne transporte aucune énergie",
      "Elle ne peut pas être dangereuse pour les yeux"
    ],
    bonne_reponse: "Elle est peu divergente, monochromatique et cohérente",
    explication: "Le faisceau laser se caractérise par une très faible divergence, une seule longueur d'onde et une cohérence particulière, ce qui impose des précautions de sécurité (lunettes adaptées)."
  },

];
/* ============================================================
   ========================  FIN  ===============================
   ============================================================ */
/**
 * tp-mecanique/js/exao-pression.js
 *
 * 3ème onglet du TP03 « Cinématique et pression » : acquisition ExAO
 * du pressiomètre Jeulin (réf. 251 181) relié en USB, via l'API
 * WebHID du navigateur.
 *
 * Le pressiomètre a été identifié (via `lsusb`/`dmesg`) comme un
 * périphérique USB HID standard (bInterfaceClass = 3), et non comme
 * un port série classique — d'où l'usage de WebHID plutôt que de Web
 * Serial. Identifiants USB confirmés : vendorId 0x0fd7, productId
 * 0x6014.
 *
 * Principe :
 * - Le tableau propose une série FIXE de volumes (60 mL à 0 mL, pas de
 *   5 mL) — pas de notion de temps ici.
 * - Une fois l'appareil connecté (ou le mode démonstration activé), la
 *   pression instantanée reçue en continu est affichée en direct.
 * - L'élève ajuste le piston sur le volume demandé (ligne surlignée),
 *   puis valide la mesure avec la touche Entrée (ou le bouton dédié) :
 *   la valeur affichée est alors figée dans la ligne, et le tableau
 *   passe automatiquement à la ligne suivante non renseignée.
 *
 * IMPORTANT — calibration matérielle :
 * Le format exact du rapport HID envoyé par le pressiomètre (position
 * de la valeur de pression dans le rapport, encodage, unité) n'est pas
 * documenté publiquement de façon fiable. `traiterRapportHid()` lit un
 * nombre d'octets configurable à un emplacement configurable (voir le
 * bloc dépliant « Réglage de la lecture des rapports HID » dans
 * l'onglet), avec un facteur d'échelle et un décalage réglables. Le
 * dernier rapport brut reçu est affiché en hexadécimal pour permettre
 * de repérer, en comprimant/relâchant la seringue, quel(s) octet(s)
 * varient réellement.
 *
 * Convention SciLab : point d'entrée exporté en module ES, appelé par
 * tp03-cinematique-pression.js (import { initAcquisitionExaoPression }).
 */

import { $, arrondir } from '../../js/utils.js';

// Volumes imposés par la seringue graduée (60 mL → 0 mL, pas de 5 mL).
const VOLUMES_FIXES = [60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0];

export function initAcquisitionExaoPression() {

  const zoneEtatPoint       = $('exaop-etat-point');
  const zoneEtatTexte       = $('exaop-etat-texte');
  const inputOctetDepart    = $('exaop-octet-depart');
  const selectLongueurOctets = $('exaop-longueur-octets');
  const selectBoutisme      = $('exaop-boutisme');
  const caseSigne           = $('exaop-signe');
  const inputFacteur        = $('exaop-facteur');
  const inputDecalage       = $('exaop-decalage');
  const zoneTrameTexte      = $('exaop-trame-texte');
  const zoneMessage         = $('exaop-message');

  const btnConnecter    = $('exaop-btn-connecter');
  const btnDeconnecter  = $('exaop-btn-deconnecter');
  const btnDemo         = $('exaop-btn-demo');
  const btnRecommencer  = $('exaop-btn-recommencer');
  const btnValider      = $('exaop-btn-valider');
  const btnExportCsv    = $('exaop-btn-export-csv');

  const zonePressionInstantanee = document.querySelector('#exaop-pression-instantanee .exaop-pression-valeur');

  const corpsTableau    = $('exaop-table-corps');
  const zoneResultat    = $('exaop-table-resultat');

  // Si le fragment n'est pas présent (ex. TP chargé partiellement), on
  // n'initialise rien plutôt que de planter sur un élément manquant.
  if (!corpsTableau || !btnConnecter) return;

  let connecte = false;
  let demoActif = false;
  let demoInterval = null;
  let pressionDemoActuelle = 1013;

  let dernierePressionLue = null;

  let mesures = VOLUMES_FIXES.map(volume => ({ volume, pression: null }));
  let ligneActiveIndex = 0;

  /* ==============================================================
     ÉTAT / AFFICHAGE
     ============================================================== */

  function majEtat(classe, texte) {
    zoneEtatPoint.className = 'exaop-etat-point' + (classe ? ` exaop-etat-${classe}` : '');
    zoneEtatTexte.textContent = texte;
  }

  function afficherMessage(texte, classe = 'info') {
    if (!texte) {
      zoneMessage.style.display = 'none';
      return;
    }
    zoneMessage.style.display = 'block';
    zoneMessage.className = classe;
    zoneMessage.textContent = texte;
  }

  function afficherPressionInstantanee(valeur) {
    zonePressionInstantanee.textContent = (valeur === null || Number.isNaN(valeur))
      ? '—'
      : arrondir(valeur, 1);
  }

  /* ==============================================================
     IDENTIFIANT USB DU PRESSIOMÈTRE JEULIN (confirmé via lsusb)
     ============================================================== */

  const JEULIN_VENDOR_ID  = 0x0fd7;
  const JEULIN_PRODUCT_ID = 0x6014;

  /* ==============================================================
     LECTURE DU RAPPORT HID (à calibrer selon l'octet exact — voir
     le bloc dépliant « Réglage » dans l'onglet)
     ============================================================== */

  function octetsEnHexa(dataView) {
    let hexa = '';
    for (let i = 0; i < dataView.byteLength; i++) {
      hexa += dataView.getUint8(i).toString(16).padStart(2, '0') + ' ';
    }
    return hexa.trim();
  }

  function traiterRapportHid(dataView) {

    zoneTrameTexte.textContent = octetsEnHexa(dataView);

    const octetDepart = parseInt(inputOctetDepart.value, 10) || 0;
    const longueur = parseInt(selectLongueurOctets.value, 10) || 2;
    const grandBoutiste = selectBoutisme.value === 'big';
    const signe = caseSigne.checked;

    if (octetDepart + longueur > dataView.byteLength) return;

    let brut;
    if (longueur === 1) {
      brut = signe ? dataView.getInt8(octetDepart) : dataView.getUint8(octetDepart);
    } else {
      brut = signe
        ? dataView.getInt16(octetDepart, !grandBoutiste)
        : dataView.getUint16(octetDepart, !grandBoutiste);
    }

    const facteur = parseFloat(inputFacteur.value);
    const decalage = parseFloat(inputDecalage.value);
    const valeur = brut * (Number.isFinite(facteur) ? facteur : 1) + (Number.isFinite(decalage) ? decalage : 0);

    dernierePressionLue = valeur;
    afficherPressionInstantanee(valeur);
  }

  /* ==============================================================
     CONNEXION USB (WebHID)
     ============================================================== */

  let peripheriqueHid = null;

  function gererRapportEntrant(evenement) {
    // evenement.data est un DataView contenant le rapport HID reçu.
    traiterRapportHid(evenement.data);
  }

  async function ouvrirPeripherique(peripherique) {

    if (!peripherique.opened) await peripherique.open();

    peripheriqueHid = peripherique;
    peripheriqueHid.addEventListener('inputreport', gererRapportEntrant);

    if (demoActif) arreterDemo();

    connecte = true;
    afficherMessage('');
    majEtat('connecte', `Appareil connecté (${peripherique.productName || 'pressiomètre'})`);

    btnConnecter.disabled = true;
    btnDeconnecter.disabled = false;
    btnDemo.disabled = true;
    btnValider.disabled = false;
  }

  async function connecter() {

    if (!('hid' in navigator)) {
      afficherMessage(
        "La détection USB (API WebHID) n'est pas prise en charge par ce navigateur. Utiliser Chrome, Edge (ordinateur) ou choisir le mode démonstration ci-dessous.",
        'erreur'
      );
      return;
    }

    try {

      const peripheriques = await navigator.hid.requestDevice({
        filters: [{ vendorId: JEULIN_VENDOR_ID, productId: JEULIN_PRODUCT_ID }],
      });

      if (!peripheriques.length) return; // fenêtre fermée sans sélection

      await ouvrirPeripherique(peripheriques[0]);

    } catch (err) {
      majEtat('erreur', 'Connexion refusée ou appareil introuvable.');
    }
  }

  // Reconnexion automatique et silencieuse : si l'appareil a déjà été
  // autorisé une fois pour ce site, le navigateur le rend disponible
  // via getDevices() sans redemander de confirmation à l'ouverture du
  // TP. C'est la « détection automatique » la plus proche de ce que
  // permet l'API WebHID (impossible sans un premier geste manuel).
  async function tenterReconnexionAutomatique() {
    if (!('hid' in navigator)) return;
    try {
      const peripheriques = await navigator.hid.getDevices();
      const correspondant = peripheriques.find(
        p => p.vendorId === JEULIN_VENDOR_ID && p.productId === JEULIN_PRODUCT_ID
      );
      if (correspondant) await ouvrirPeripherique(correspondant);
    } catch { /* pas grave : l'élève connectera manuellement */ }
  }

  async function deconnecter() {

    connecte = false;

    try {
      peripheriqueHid?.removeEventListener('inputreport', gererRapportEntrant);
      await peripheriqueHid?.close();
    } catch { /* rien à faire */ }
    peripheriqueHid = null;

    dernierePressionLue = null;
    afficherPressionInstantanee(null);
    zoneTrameTexte.textContent = '—';
    majEtat('', 'Appareil non connecté');

    btnConnecter.disabled = false;
    btnDeconnecter.disabled = true;
    btnDemo.disabled = false;
    btnValider.disabled = true;
  }

  btnConnecter.addEventListener('click', connecter);
  btnDeconnecter.addEventListener('click', deconnecter);

  // Si l'appareil est débranché physiquement pendant la séance.
  if ('hid' in navigator) {
    navigator.hid.addEventListener('disconnect', (evenement) => {
      if (peripheriqueHid && evenement.device === peripheriqueHid) {
        deconnecter();
        majEtat('erreur', 'Appareil débranché.');
      }
    });
  }

  /* ==============================================================
     MODE DÉMONSTRATION (valeurs simulées, sans matériel)
     ============================================================== */

  function activerDemo() {

    if (connecte) return;

    demoActif = true;
    pressionDemoActuelle = 1013;

    clearInterval(demoInterval);
    demoInterval = setInterval(() => {

      const ligneRef = mesures[ligneActiveIndex] || mesures[mesures.length - 1];
      const volumeRef = Math.max(ligneRef ? ligneRef.volume : 60, 5);
      const kDemo = 60 * 1013; // constante fictive pour un comportement réaliste
      const cible = kDemo / volumeRef;

      pressionDemoActuelle += (cible - pressionDemoActuelle) * 0.2 + (Math.random() - 0.5) * 2;
      dernierePressionLue = Math.round(pressionDemoActuelle * 10) / 10;

      zoneTrameTexte.textContent = `[démonstration] P=${dernierePressionLue} hPa`;
      afficherPressionInstantanee(dernierePressionLue);

    }, 300);

    majEtat('connecte', 'Mode démonstration actif (valeurs simulées)');
    btnDemo.textContent = '🧪 Arrêter la démonstration';
    btnConnecter.disabled = true;
    btnValider.disabled = false;
  }

  function arreterDemo() {

    demoActif = false;
    clearInterval(demoInterval);

    btnDemo.textContent = '🧪 Mode démonstration';
    btnConnecter.disabled = false;

    if (!connecte) {
      btnValider.disabled = true;
      dernierePressionLue = null;
      afficherPressionInstantanee(null);
      zoneTrameTexte.textContent = '—';
      majEtat('', 'Appareil non connecté');
    }
  }

  btnDemo.addEventListener('click', () => {
    if (demoActif) arreterDemo();
    else activerDemo();
  });

  /* ==============================================================
     TABLEAU DE MESURES (volumes fixes, pression validée à l'Entrée)
     ============================================================== */

  function prochaineLigneNonRemplie() {
    const index = mesures.findIndex(m => m.pression === null);
    return index === -1 ? mesures.length - 1 : index;
  }

  function validerMesureCourante() {

    if (dernierePressionLue === null) return;
    if (!connecte && !demoActif) return;

    mesures[ligneActiveIndex].pression = dernierePressionLue;
    ligneActiveIndex = prochaineLigneNonRemplie();

    rafraichirTableau();
  }

  btnValider.addEventListener('click', validerMesureCourante);

  // Validation au clavier avec la touche Entrée, sans voler la saisie
  // d'un autre champ de texte du TP (résumé, questions...).
  document.addEventListener('keydown', (evenement) => {

    if (evenement.key !== 'Enter') return;

    const panneau = document.getElementById('acquisition-exao');
    if (!panneau || !panneau.classList.contains('actif')) return;

    const elementActif = document.activeElement;
    const balise = elementActif ? elementActif.tagName : '';
    const estSaisieLibre =
      balise === 'TEXTAREA' ||
      (balise === 'INPUT' && !['button', 'submit'].includes(elementActif.type) && elementActif.id !== 'exaop-facteur');

    if (estSaisieLibre) return;

    evenement.preventDefault();
    validerMesureCourante();
  });

  function reinitialiserTableau() {
    mesures = VOLUMES_FIXES.map(volume => ({ volume, pression: null }));
    ligneActiveIndex = 0;
    rafraichirTableau();
  }

  btnRecommencer.addEventListener('click', reinitialiserTableau);

  function rafraichirTableau() {

    corpsTableau.innerHTML = '';

    mesures.forEach((mesure, index) => {

      const ligne = document.createElement('tr');
      ligne.dataset.index = index;

      const estActive = index === ligneActiveIndex;
      const estAtteignable = mesure.volume >= 20 || mesure.pression !== null;

      ligne.className = [
        estActive ? 'exaop-ligne-active' : '',
        (!estAtteignable && !estActive) ? 'exaop-ligne-hors-portee' : '',
      ].filter(Boolean).join(' ');

      const pv = (mesure.pression !== null && mesure.volume > 0)
        ? arrondir(mesure.pression * mesure.volume, 0)
        : '—';

      ligne.innerHTML = `
        <td>${mesure.volume}</td>
        <td>${mesure.pression !== null ? arrondir(mesure.pression, 1) : '—'}</td>
        <td>${pv}</td>
        <td>${mesure.pression !== null ? '<button type="button" class="btn btn-secondaire exaop-refaire">🔁</button>' : ''}</td>
      `;

      ligne.addEventListener('click', (evenement) => {
        if (evenement.target.closest('.exaop-refaire')) return;
        ligneActiveIndex = index;
        rafraichirTableau();
      });

      const boutonRefaire = ligne.querySelector('.exaop-refaire');
      if (boutonRefaire) {
        boutonRefaire.addEventListener('click', (evenement) => {
          evenement.stopPropagation();
          mesure.pression = null;
          ligneActiveIndex = index;
          rafraichirTableau();
        });
      }

      corpsTableau.appendChild(ligne);
    });

    calculerResultat();
  }

  function calculerResultat() {

    const points = mesures
      .filter(m => m.pression !== null && m.volume > 0)
      .map(m => ({ v: m.volume, p: m.pression }));

    dessinerCourbeExaoPression(points);

    if (points.length < 2) {
      zoneResultat.textContent = 'Valider au moins deux mesures pour vérifier la constance du produit P × V.';
      return;
    }

    const produits = points.map(pt => pt.p * pt.v);
    const moyenne = produits.reduce((s, x) => s + x, 0) / produits.length;
    const ecartMaxRelatif = Math.max(...produits.map(x => Math.abs(x - moyenne) / moyenne)) * 100;

    const verdict = ecartMaxRelatif < 10
      ? 'Le produit P × V reste approximativement constant : les mesures sont cohérentes avec la loi de Boyle-Mariotte.'
      : "L'écart entre les valeurs de P × V dépasse 10 % : vérifier l'étanchéité du montage ou une éventuelle variation de température.";

    zoneResultat.innerHTML = `
      Produit moyen P × V ≈ <strong>${arrondir(moyenne, 0)} hPa·mL</strong>
      (écart maximal à la moyenne : ${arrondir(ecartMaxRelatif, 1)} %)<br>
      ${verdict}
    `;
  }

  /* ==============================================================
     COURBE P = f(V)
     ============================================================== */

  let dernierPointsCourbe = [];

  function dessinerCourbeExaoPression(points) {

    dernierPointsCourbe = points;

    const canvas = $('exaop-canvas-courbe');
    if (!canvas) return;

    const conteneur = canvas.parentElement;
    const largeurAffichee = (conteneur && conteneur.clientWidth) || 600;
    const hauteurAffichee = 320;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = largeurAffichee * dpr;
    canvas.height = hauteurAffichee * dpr;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largeurAffichee, hauteurAffichee);

    const marge = 55;

    if (points.length === 0) {
      ctx.fillStyle = '#8a8a8a';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Valider des mesures dans le tableau ci-dessus pour tracer la courbe.',
        largeurAffichee / 2,
        hauteurAffichee / 2
      );
      return;
    }

    const vMax = Math.max(...points.map(pt => pt.v)) * 1.15 || 1;
    const pMax = Math.max(...points.map(pt => pt.p)) * 1.15 || 1;

    const xPix = v => marge + (v / vMax) * (largeurAffichee - marge - 20);
    const yPix = p => hauteurAffichee - marge - (p / pMax) * (hauteurAffichee - marge - 20);

    ctx.strokeStyle = '#e5e5e5';
    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.lineWidth = 1;

    const nbDivisions = 5;
    for (let i = 0; i <= nbDivisions; i++) {

      const v = (vMax * i) / nbDivisions;
      const x = xPix(v);
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x, hauteurAffichee - marge);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(arrondir(v, 0), x, hauteurAffichee - marge + 16);

      const p = (pMax * i) / nbDivisions;
      const y = yPix(p);
      ctx.beginPath();
      ctx.moveTo(marge, y);
      ctx.lineTo(largeurAffichee - 20, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(arrondir(p, 0), marge - 8, y + 4);

    }

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(marge, 15);
    ctx.lineTo(marge, hauteurAffichee - marge);
    ctx.lineTo(largeurAffichee - 20, hauteurAffichee - marge);
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Volume V (mL)', largeurAffichee / 2, hauteurAffichee - 10);

    ctx.save();
    ctx.translate(16, hauteurAffichee / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Pression P (hPa)', 0, 0);
    ctx.restore();

    if (points.length >= 2) {

      const produits = points.map(pt => pt.p * pt.v);
      const k = produits.reduce((s, x) => s + x, 0) / produits.length;

      ctx.strokeStyle = '#1B6CA8';
      ctx.lineWidth = 2;
      ctx.beginPath();

      let depart = false;
      const nbEtapes = 300;

      for (let i = 1; i <= nbEtapes; i++) {
        const v = (vMax * i) / nbEtapes;
        const p = k / v;
        if (p > pMax) continue;
        const x = xPix(v);
        const y = yPix(p);
        if (!depart) { ctx.moveTo(x, y); depart = true; }
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    points.forEach(pt => {
      const x = xPix(pt.v);
      const y = yPix(pt.p);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#c0392b';
      ctx.fill();
      ctx.strokeStyle = '#7a1f14';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  window.addEventListener('resize', () => dessinerCourbeExaoPression(dernierPointsCourbe));

  // Redessine la courbe juste avant l'impression du compte-rendu (voir
  // compte-rendu-mecanique.js), au cas où cet onglet n'aurait jamais
  // été affiché à sa taille définitive.
  document.addEventListener('cr:avant-impression', () => dessinerCourbeExaoPression(dernierPointsCourbe));

  /* ==============================================================
     EXPORT CSV
     ============================================================== */

  function exporterCsv() {

    const lignes = ['Volume V (mL);Pression P (hPa);Produit P x V (hPa.mL)'];

    mesures.forEach(m => {
      const pv = (m.pression !== null && m.volume > 0) ? arrondir(m.pression * m.volume, 0) : '';
      lignes.push(`${m.volume};${m.pression !== null ? arrondir(m.pression, 1) : ''};${pv}`);
    });

    const blob = new Blob([lignes.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'mesures-pression-exao-tp03.csv';
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    URL.revokeObjectURL(url);
  }

  btnExportCsv.addEventListener('click', exporterCsv);

  /* ==============================================================
     INITIALISATION
     ============================================================== */

  rafraichirTableau();
  tenterReconnexionAutomatique();
}

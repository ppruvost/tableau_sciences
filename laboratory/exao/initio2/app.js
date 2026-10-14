/* Console Jeulin Initio2 – lecture USB (WebHID) et graphique en temps réel.
 *
 *   - périphérique USB HID, fabricant 0x0FD7, produits 0x0060 / 0x0040 ;
 *   - requête « mesures » : octets 03 04 04 (rapport de sortie, identifiant 0, complété par des 0) ;
 *   - réponse : [longueur][?] puis une suite d'enregistrements de 5 octets : 0x09 + flottant 32 bits
 *     petit-boutiste, un enregistrement par voie.
 */
(() => {
  'use strict';

  const ID_FABRICANT = 0x0FD7;
  const ID_PRODUITS = [0x0060, 0x0040];
  const REQUETE_MESURES = [0x03, 0x04, 0x04];
  const MAX_VOIES = 30;
  const MAX_POINTS = 200000;
  const LIGNES_TABLEAU = 200;
  const LIGNES_JOURNAL = 200;
  const POLICE = '12px "Atkinson Hyperlegible", system-ui, sans-serif';
  const COULEURS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

  const $ = (id) => document.getElementById(id);
  const el = {
    etat: $('etat'), alerte: $('alerte'), cartes: $('cartes'), graphe: $('graphe'), infobulle: $('infobulle'),
    tableau: $('tableau'), compteur: $('compteur'), journal: $('journal'), diag: $('diag'),
    btnConnecter: $('btnConnecter'), btnDemo: $('btnDemo'), btnDemarrer: $('btnDemarrer'),
    btnArreter: $('btnArreter'), btnEffacer: $('btnEffacer'), btnCsv: $('btnCsv'),
    btnTrame: $('btnTrame'), trameHex: $('trameHex'),
    selX: $('selX'), selFenetre: $('selFenetre'), selMode: $('selMode'), selPeriode: $('selPeriode'),
  };

  const etat = {
    transport: null,
    enCours: false,
    t0: 0,
    temps: [],
    voies: [],          // { nom, unite, couleur, visible, valeurs: [], carte: {...} }
    survol: -1,
    reponsesVides: 0,
  };

  /* ---------- utilitaires ---------- */

  const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
  const hex = (u8) => Array.from(u8, (b) => b.toString(16).padStart(2, '0')).join(' ');
  // 3 chiffres maximum après la virgule
  const nombre = (v) =>
    Number.isFinite(v) ? v.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) : '—';

  function stockageLire(cle) {
    try { return JSON.parse(localStorage.getItem(cle)); } catch (e) { return null; }
  }
  function stockageEcrire(cle, val) {
    try { localStorage.setItem(cle, JSON.stringify(val)); } catch (e) { /* stockage indisponible */ }
  }

  function message(texte, erreur = false) {
    if (!texte) { el.alerte.hidden = true; return; }
    el.alerte.textContent = texte;
    el.alerte.className = 'alerte' + (erreur ? ' erreur' : '');
    el.alerte.hidden = false;
  }

  function majEtat(texte, classe) {
    el.etat.textContent = texte;
    el.etat.className = 'puce ' + classe;
  }

  /* ---------- journal ---------- */

  const lignesJournal = [];
  function journaliser(sens, octets) {
    const t = ((performance.now() - (etat.t0 || 0)) / 1000).toFixed(3);
    lignesJournal.push(`${t.padStart(9)} ${sens} ${hex(octets)}`);
    if (lignesJournal.length > LIGNES_JOURNAL) lignesJournal.shift();
    if (el.diag.open) {
      el.journal.textContent = lignesJournal.join('\n');
      el.journal.scrollTop = el.journal.scrollHeight;
    }
  }
  el.diag.addEventListener('toggle', () => {
    if (el.diag.open) el.journal.textContent = lignesJournal.join('\n') || '(vide)';
  });

  /* ---------- décodage de la réponse « mesures » ---------- */

  function decoderMesures(u8) {
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    const lecture = (limite) => {
      const res = [];
      for (let i = 2; i + 4 < u8.length && i < limite && u8[i] === 9 && res.length < MAX_VOIES; i += 5) {
        res.push(dv.getFloat32(i + 1, true));
      }
      return res;
    };
    const longueur = u8[0];
    let valeurs = (longueur >= 7 && longueur <= u8.length) ? lecture(longueur - 2) : [];
    if (!valeurs.length) valeurs = lecture(u8.length);   // repli : on suit simplement les marqueurs 0x09
    return valeurs;
  }

  /* ---------- transport USB HID réel ---------- */

  class TransportHID {
    constructor(appareil) {
      this.appareil = appareil;
      this.nom = appareil.productName || 'Initio';
      this.attente = null;
      this.idSortie = 0;
      this.tailleSortie = 64;
      this.surRapport = this.surRapport.bind(this);
    }

    async ouvrir() {
      if (!this.appareil.opened) await this.appareil.open();
      const sorties = (this.appareil.collections || []).flatMap((c) => c.outputReports || []);
      if (sorties.length) {
        this.idSortie = sorties[0].reportId || 0;
        const bits = (sorties[0].items || []).reduce((s, it) => s + it.reportSize * it.reportCount, 0);
        if (bits > 0) this.tailleSortie = Math.ceil(bits / 8);
      }
      this.appareil.addEventListener('inputreport', this.surRapport);
    }

    async fermer() {
      this.appareil.removeEventListener('inputreport', this.surRapport);
      if (this.attente) { clearTimeout(this.attente.minuterie); this.attente.rejeter(new Error('Connexion fermée')); this.attente = null; }
      try { if (this.appareil.opened) await this.appareil.close(); } catch (e) { /* déjà fermé */ }
    }

    surRapport(evt) {
      const u8 = new Uint8Array(evt.data.buffer.slice(evt.data.byteOffset, evt.data.byteOffset + evt.data.byteLength));
      journaliser('←', u8);
      if (this.attente) {
        const { resoudre, minuterie } = this.attente;
        clearTimeout(minuterie);
        this.attente = null;
        resoudre(u8);
      }
    }

    envoyer(octets) {
      const trame = new Uint8Array(this.tailleSortie);
      trame.set(octets.slice(0, this.tailleSortie));
      journaliser('→', Uint8Array.from(octets));
      return this.appareil.sendReport(this.idSortie, trame);
    }

    echange(octets, delai = 1000) {
      return new Promise((resoudre, rejeter) => {
        const minuterie = setTimeout(() => {
          this.attente = null;
          rejeter(new Error('Pas de réponse de la console'));
        }, delai);
        this.attente = { resoudre, rejeter, minuterie };
        this.envoyer(octets).catch((e) => {
          clearTimeout(minuterie);
          this.attente = null;
          rejeter(e);
        });
      });
    }
  }

  /* ---------- transport de démonstration (même format de trame) ---------- */

  class TransportDemo {
    constructor() { this.nom = 'Démo'; this.debut = performance.now(); }
    async ouvrir() {}
    async fermer() {}
    async echange(octets) {
      journaliser('→', Uint8Array.from(octets));
      await dormir(8);
      const t = (performance.now() - this.debut) / 1000;
      const valeurs = [
        5 * Math.sin(2 * Math.PI * t / 8),
        20 + 3 * Math.exp(-t / 30) * Math.cos(2 * Math.PI * t / 3) + (Math.random() - 0.5) * 0.1,
        2.5 + 0.8 * Math.sin(2 * Math.PI * t / 5 + 1),
      ];
      const u8 = new Uint8Array(64);
      const dv = new DataView(u8.buffer);
      u8[0] = 2 + 5 * valeurs.length;
      u8[1] = 0x04;
      valeurs.forEach((v, k) => { u8[2 + 5 * k] = 9; dv.setFloat32(3 + 5 * k, v, true); });
      journaliser('←', u8);
      return u8;
    }
    async envoyerBrut(octets) { return this.echange(octets); }
  }

  /* ---------- données ---------- */

  function ajouterVoie() {
    const k = etat.voies.length;
    const sauve = (stockageLire('initio2-voies') || [])[k] || {};
    const voie = {
      nom: sauve.nom || `Voie ${k + 1}`,
      unite: sauve.unite || '',
      couleur: COULEURS[k % COULEURS.length],
      visible: sauve.visible !== false,
      valeurs: new Array(etat.temps.length).fill(NaN),
    };
    etat.voies.push(voie);
    creerCarte(voie, k);
    majSelecteurX();
    majEnteteTableau();
    return voie;
  }

  function sauverReglagesVoies() {
    stockageEcrire('initio2-voies', etat.voies.map((v) => ({ nom: v.nom, unite: v.unite, visible: v.visible })));
  }

  function enregistrer(valeurs) {
    const t = (performance.now() - etat.t0) / 1000;
    while (etat.voies.length < valeurs.length) ajouterVoie();
    if (etat.temps.length >= MAX_POINTS) {
      etat.temps.shift();
      etat.voies.forEach((v) => v.valeurs.shift());
    }
    etat.temps.push(t);
    etat.voies.forEach((v, k) => {
      const x = k < valeurs.length ? valeurs[k] : NaN;
      v.valeurs.push(x);
      if (v.carte && k < valeurs.length) v.carte.valeur.textContent = nombre(x);
    });
    ajouterLigneTableau(t, valeurs);
    el.compteur.textContent = `${etat.temps.length} points`;
    el.btnCsv.disabled = false;
    demanderDessin();
  }

  /* ---------- cartes de voies ---------- */

  function creerCarte(voie, k) {
    const vide = el.cartes.querySelector('.vide');
    if (vide) vide.remove();
    const carte = document.createElement('div');
    carte.className = 'carte-voie';
    carte.style.setProperty('--couleur', voie.couleur);

    const tete = document.createElement('div');
    tete.className = 'carte-tete';
    const coche = document.createElement('input');
    coche.type = 'checkbox';
    coche.checked = voie.visible;
    coche.title = 'Afficher la voie sur le graphique';
    coche.setAttribute('aria-label', `Afficher ${voie.nom}`);
    const nom = document.createElement('input');
    nom.type = 'text';
    nom.value = voie.nom;
    nom.setAttribute('aria-label', 'Nom de la voie');
    tete.append(coche, nom);

    const ligne = document.createElement('div');
    ligne.className = 'carte-valeur';
    const valeur = document.createElement('span');
    valeur.className = 'valeur';
    valeur.textContent = '—';
    const unite = document.createElement('input');
    unite.type = 'text';
    unite.value = voie.unite;
    unite.placeholder = 'unité';
    unite.setAttribute('aria-label', 'Unité');
    ligne.append(valeur, unite);

    carte.append(tete, ligne);
    el.cartes.append(carte);
    voie.carte = { racine: carte, valeur };
    carte.classList.toggle('masquee', !voie.visible);

    coche.addEventListener('change', () => {
      voie.visible = coche.checked;
      carte.classList.toggle('masquee', !voie.visible);
      sauverReglagesVoies();
      demanderDessin();
    });
    nom.addEventListener('input', () => { voie.nom = nom.value; majSelecteurX(); majEnteteTableau(); sauverReglagesVoies(); demanderDessin(); });
    unite.addEventListener('input', () => { voie.unite = unite.value; majEnteteTableau(); sauverReglagesVoies(); demanderDessin(); });
  }

  function majSelecteurX() {
    const courant = el.selX.value;
    el.selX.innerHTML = '<option value="-1">Temps (s)</option>';
    etat.voies.forEach((v, k) => {
      const o = document.createElement('option');
      o.value = String(k);
      o.textContent = v.nom + (v.unite ? ` (${v.unite})` : '');
      el.selX.append(o);
    });
    el.selX.value = courant && el.selX.querySelector(`option[value="${courant}"]`) ? courant : '-1';
  }

  /* ---------- tableau ---------- */

  const libelle = (v) => v.nom + (v.unite ? ` (${v.unite})` : '');

  function majEnteteTableau() {
    const tr = el.tableau.tHead.rows[0];
    tr.innerHTML = '';
    const th0 = document.createElement('th');
    th0.textContent = 't (s)';
    tr.append(th0);
    etat.voies.forEach((v) => {
      const th = document.createElement('th');
      th.textContent = libelle(v);
      tr.append(th);
    });
  }

  function ajouterLigneTableau(t, valeurs) {
    const corps = el.tableau.tBodies[0];
    const tr = document.createElement('tr');
    const cases = [t.toFixed(3), ...etat.voies.map((_, k) => (k < valeurs.length ? nombre(valeurs[k]) : ''))];
    cases.forEach((txt) => { const td = document.createElement('td'); td.textContent = txt; tr.append(td); });
    corps.prepend(tr);
    while (corps.rows.length > LIGNES_TABLEAU) corps.deleteRow(-1);
  }

  /* ---------- graphique ---------- */

  let dessinPrevu = false;
  function demanderDessin() {
    if (dessinPrevu) return;
    dessinPrevu = true;
    requestAnimationFrame(() => { dessinPrevu = false; dessiner(); });
  }

  function graduations(min, max, cible) {
    if (!(max > min)) { const c = Math.abs(min) || 1; min -= c * 0.5; max += c * 0.5; }
    const brut = (max - min) / cible;
    const puissance = Math.pow(10, Math.floor(Math.log10(brut)));
    const f = brut / puissance;
    const pas = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * puissance;
    const debut = Math.ceil(min / pas) * pas;
    const liste = [];
    for (let v = debut; v <= max + pas * 1e-9; v += pas) liste.push(Math.abs(v) < pas * 1e-9 ? 0 : v);
    return { liste, pas };
  }

  function formaterGrad(v, pas) {
    const dec = Math.max(0, Math.min(3, -Math.floor(Math.log10(pas))));
    return v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  function couleurCss(nom) {
    return getComputedStyle(document.documentElement).getPropertyValue(nom).trim() || '#888';
  }

  /** Retourne l'index du premier point t >= tmin (temps croissant). */
  function premierIndex(tmin) {
    let a = 0, b = etat.temps.length;
    while (a < b) { const m = (a + b) >> 1; if (etat.temps[m] < tmin) a = m + 1; else b = m; }
    return a;
  }

  let geometrie = null;   // mémorise les échelles du dernier tracé pour l'infobulle

  function dessiner() {
    const canvas = el.graphe;
    const dpr = window.devicePixelRatio || 1;
    const largeur = canvas.clientWidth, hauteur = canvas.clientHeight;
    if (!largeur || !hauteur) return;
    if (canvas.width !== Math.round(largeur * dpr) || canvas.height !== Math.round(hauteur * dpr)) {
      canvas.width = Math.round(largeur * dpr);
      canvas.height = Math.round(hauteur * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largeur, hauteur);

    const xVoie = parseInt(el.selX.value, 10);
    const modeTemps = xVoie < 0 || !etat.voies[xVoie];
    const n = etat.temps.length;
    const couleurTexte = couleurCss('--texte-doux');
    ctx.font = POLICE;

    if (!n) {
      ctx.fillStyle = couleurTexte;
      ctx.textAlign = 'center';
      ctx.fillText('Le graphique se trace ici dès l’arrivée des premières mesures.', largeur / 2, hauteur / 2);
      geometrie = null;
      return;
    }

    // intervalle d'indices à tracer
    let i0 = 0;
    const fenetre = parseFloat(el.selFenetre.value);
    if (modeTemps && fenetre > 0) i0 = premierIndex(etat.temps[n - 1] - fenetre);
    const xs = modeTemps ? etat.temps : etat.voies[xVoie].valeurs;

    // étendue en x
    let xmin = Infinity, xmax = -Infinity;
    for (let i = i0; i < n; i++) { const x = xs[i]; if (Number.isFinite(x)) { if (x < xmin) xmin = x; if (x > xmax) xmax = x; } }
    if (modeTemps && fenetre > 0) { xmax = Math.max(xmax, fenetre); xmin = xmax - fenetre; }
    if (!Number.isFinite(xmin)) { xmin = 0; xmax = 1; }
    if (xmax === xmin) { xmin -= 0.5; xmax += 0.5; }

    const tracees = etat.voies
      .map((v, k) => ({ v, k }))
      .filter(({ v, k }) => v.visible && (modeTemps || k !== xVoie));
    if (!tracees.length) {
      ctx.fillStyle = couleurTexte;
      ctx.textAlign = 'center';
      ctx.fillText('Aucune voie à afficher.', largeur / 2, hauteur / 2);
      geometrie = null;
      return;
    }

    const separe = el.selMode.value === 'sep' && tracees.length > 1;
    const groupes = separe ? tracees.map((t) => [t]) : [tracees];
    const marge = { g: 70, d: 16, h: 10, b: 34 };
    const ecart = separe ? 14 : 0;
    const hauteurUtile = hauteur - marge.h - marge.b - ecart * (groupes.length - 1);
    const hGroupe = hauteurUtile / groupes.length;
    const gauche = marge.g, droite = largeur - marge.d;
    const echelleX = (x) => gauche + ((x - xmin) / (xmax - xmin)) * (droite - gauche);

    geometrie = { gauche, droite, xmin, xmax, modeTemps, i0, groupes: [] };

    groupes.forEach((groupe, gi) => {
      const haut = marge.h + gi * (hGroupe + ecart);
      const bas = haut + hGroupe;

      let ymin = Infinity, ymax = -Infinity;
      groupe.forEach(({ v }) => {
        for (let i = i0; i < n; i++) {
          const x = xs[i], y = v.valeurs[i];
          if (!Number.isFinite(y) || !Number.isFinite(x) || x < xmin || x > xmax) continue;
          if (y < ymin) ymin = y;
          if (y > ymax) ymax = y;
        }
      });
      if (!Number.isFinite(ymin)) { ymin = 0; ymax = 1; }
      if (ymax === ymin) { const c = Math.abs(ymin) * 0.1 || 0.5; ymin -= c; ymax += c; }
      const marge10 = (ymax - ymin) * 0.06;
      ymin -= marge10; ymax += marge10;
      const echelleY = (y) => bas - ((y - ymin) / (ymax - ymin)) * (bas - haut);

      // grille + graduations Y
      ctx.lineWidth = 1;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      const gy = graduations(ymin, ymax, Math.max(2, Math.floor((bas - haut) / 45)));
      gy.liste.forEach((val) => {
        const py = Math.round(echelleY(val)) + 0.5;
        ctx.strokeStyle = couleurCss('--grille');
        ctx.beginPath(); ctx.moveTo(gauche, py); ctx.lineTo(droite, py); ctx.stroke();
        ctx.fillStyle = couleurTexte;
        ctx.fillText(formaterGrad(val, gy.pas), gauche - 6, py);
      });

      // grille + graduations X
      const gx = graduations(xmin, xmax, Math.max(3, Math.floor((droite - gauche) / 90)));
      gx.liste.forEach((val) => {
        const px = Math.round(echelleX(val)) + 0.5;
        ctx.strokeStyle = couleurCss('--grille');
        ctx.beginPath(); ctx.moveTo(px, haut); ctx.lineTo(px, bas); ctx.stroke();
        if (gi === groupes.length - 1) {
          ctx.fillStyle = couleurTexte;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(formaterGrad(val, gx.pas), px, bas + 6);
        }
      });

      // cadre
      ctx.strokeStyle = couleurCss('--axe');
      ctx.strokeRect(gauche + 0.5, haut + 0.5, droite - gauche, bas - haut);

      // courbes
      ctx.save();
      ctx.beginPath();
      ctx.rect(gauche, haut, droite - gauche, bas - haut);
      ctx.clip();
      groupe.forEach(({ v }) => {
        ctx.strokeStyle = v.couleur;
        ctx.fillStyle = v.couleur;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        let enTrace = false, nbPoints = 0, dernier = null;
        for (let i = i0; i < n; i++) {
          const x = xs[i], y = v.valeurs[i];
          if (!Number.isFinite(x) || !Number.isFinite(y)) { enTrace = false; continue; }
          const px = echelleX(x), py = echelleY(y);
          if (enTrace) ctx.lineTo(px, py); else { ctx.moveTo(px, py); enTrace = true; }
          nbPoints++;
          dernier = [px, py];
        }
        ctx.stroke();
        if (nbPoints <= 120) {
          for (let i = i0; i < n; i++) {
            const x = xs[i], y = v.valeurs[i];
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            ctx.beginPath(); ctx.arc(echelleX(x), echelleY(y), 3, 0, 2 * Math.PI); ctx.fill();
          }
        } else if (dernier) {
          ctx.beginPath(); ctx.arc(dernier[0], dernier[1], 3.5, 0, 2 * Math.PI); ctx.fill();
        }
      });
      ctx.restore();

      // titre d'axe Y (unité / nom) dans l'angle du graphique
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      let dx = gauche + 8;
      ctx.font = POLICE;
      groupe.forEach(({ v }) => {
        const txt = libelle(v);
        ctx.fillStyle = v.couleur;
        ctx.fillRect(dx, haut + 8, 10, 10);
        ctx.fillStyle = couleurTexte;
        ctx.fillText(txt, dx + 14, haut + 6);
        dx += 14 + ctx.measureText(txt).width + 16;
      });

      geometrie.groupes.push({ haut, bas, ymin, ymax, echelleY, voies: groupe });
    });

    // libellé de l'axe X
    ctx.fillStyle = couleurTexte;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(modeTemps ? 't (s)' : libelle(etat.voies[xVoie]), droite, hauteur - 1);

    // repère de survol
    if (modeTemps && etat.survol >= i0 && etat.survol < n) {
      const px = echelleX(etat.temps[etat.survol]);
      ctx.strokeStyle = couleurCss('--axe');
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(px, marge.h); ctx.lineTo(px, hauteur - marge.b); ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  el.graphe.addEventListener('pointermove', (e) => {
    if (!geometrie || !geometrie.modeTemps) { el.infobulle.hidden = true; return; }
    const rect = el.graphe.getBoundingClientRect();
    const px = e.clientX - rect.left;
    if (px < geometrie.gauche || px > geometrie.droite) { quitterSurvol(); return; }
    const t = geometrie.xmin + ((px - geometrie.gauche) / (geometrie.droite - geometrie.gauche)) * (geometrie.xmax - geometrie.xmin);
    let i = premierIndex(t);
    if (i > 0 && (i >= etat.temps.length || Math.abs(etat.temps[i - 1] - t) < Math.abs(etat.temps[i] - t))) i--;
    etat.survol = Math.min(Math.max(i, geometrie.i0), etat.temps.length - 1);
    const lignes = [`<strong>t = ${etat.temps[etat.survol].toFixed(3)} s</strong>`];
    etat.voies.forEach((v) => {
      if (!v.visible) return;
      const y = v.valeurs[etat.survol];
      lignes.push(`<div><i style="background:${v.couleur}"></i>${echapper(v.nom)} : ${nombre(y)} ${echapper(v.unite)}</div>`);
    });
    el.infobulle.innerHTML = lignes.join('');
    el.infobulle.hidden = false;
    const largeurBulle = el.infobulle.offsetWidth;
    el.infobulle.style.left = Math.min(Math.max(px + 14, 0), rect.width - largeurBulle) + 'px';
    el.infobulle.style.top = Math.max(e.clientY - rect.top - el.infobulle.offsetHeight - 10, 4) + 'px';
    demanderDessin();
  });
  function quitterSurvol() { etat.survol = -1; el.infobulle.hidden = true; demanderDessin(); }
  el.graphe.addEventListener('pointerleave', quitterSurvol);

  function echapper(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(demanderDessin);
  new ResizeObserver(demanderDessin).observe(el.graphe);
  [el.selX, el.selFenetre, el.selMode].forEach((s) => s.addEventListener('change', demanderDessin));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', demanderDessin);

  /* ---------- acquisition ---------- */

  async function boucleAcquisition() {
    let echecs = 0;
    while (etat.enCours && etat.transport) {
      const debut = performance.now();
      try {
        const reponse = await etat.transport.echange(REQUETE_MESURES);
        const valeurs = decoderMesures(reponse);
        if (valeurs.length) {
          echecs = 0;
          etat.reponsesVides = 0;
          message('');
          enregistrer(valeurs);
        } else if (++etat.reponsesVides === 5) {
          message('La console répond mais aucune mesure n’est reconnue. Vérifiez qu’un capteur est branché et ouvrez « Diagnostic et trames USB » pour voir les octets reçus.');
        }
      } catch (e) {
        if (!etat.enCours) break;
        if (++echecs >= 5) {
          arreter();
          message(`Acquisition interrompue : ${e.message}. Vérifiez le câble USB et que le logiciel Initio2 n’est pas ouvert en même temps.`, true);
          break;
        }
      }
      const periode = parseInt(el.selPeriode.value, 10);
      await dormir(Math.max(0, periode - (performance.now() - debut)));
    }
  }

  function demarrer() {
    if (!etat.transport || etat.enCours) return;
    if (!etat.temps.length) etat.t0 = performance.now();
    else etat.t0 = performance.now() - etat.temps[etat.temps.length - 1] * 1000 - 1;  // reprise : le temps continue
    etat.enCours = true;
    majBoutons();
    majEtatConnexion();
    boucleAcquisition();
  }

  function arreter() {
    etat.enCours = false;
    majBoutons();
    majEtatConnexion();
  }

  function effacer() {
    etat.temps.length = 0;
    etat.voies.forEach((v) => { v.valeurs.length = 0; if (v.carte) v.carte.valeur.textContent = '—'; });
    el.tableau.tBodies[0].innerHTML = '';
    el.compteur.textContent = '';
    el.btnCsv.disabled = true;
    etat.t0 = performance.now();
    etat.survol = -1;
    demanderDessin();
  }

  function majBoutons() {
    const connecte = !!etat.transport;
    el.btnDemarrer.disabled = !connecte || etat.enCours;
    el.btnArreter.disabled = !etat.enCours;
    el.btnTrame.disabled = !(connecte && etat.transport instanceof TransportHID) || etat.enCours;
  }

  function majEtatConnexion() {
    if (!etat.transport) { majEtat('Non connecté', 'puce-off'); return; }
    const demo = etat.transport instanceof TransportDemo;
    if (etat.enCours) majEtat(demo ? 'Démo : acquisition en cours' : 'Acquisition en cours', demo ? 'puce-demo' : 'puce-on');
    else majEtat(demo ? 'Mode démo' : `Connecté : ${etat.transport.nom}`, demo ? 'puce-demo' : 'puce-on');
  }

  /* ---------- connexion ---------- */

  async function utiliserTransport(transport) {
    if (etat.transport) { arreter(); await etat.transport.fermer(); }
    await transport.ouvrir();
    etat.transport = transport;
    majBoutons();
    majEtatConnexion();
  }

  async function connecter() {
    if (!('hid' in navigator)) {
      message('Ce navigateur ne gère pas l’USB HID (WebHID). Utilisez Google Chrome, Chromium ou Microsoft Edge, ou essayez le mode démo.', true);
      return;
    }
    try {
      const filtres = ID_PRODUITS.map((p) => ({ vendorId: ID_FABRICANT, productId: p }));
      const appareils = await navigator.hid.requestDevice({ filters: filtres });
      if (!appareils.length) { message('Aucun appareil sélectionné.'); return; }
      await utiliserTransport(new TransportHID(appareils[0]));
      message('');
    } catch (e) {
      message(texteErreurConnexion(e), true);
    }
  }

  function texteErreurConnexion(e) {
    const base = e && e.message ? e.message : String(e);
    if (e && e.name === 'SecurityError') return 'Accès USB refusé par le navigateur. Ouvrez la page depuis un fichier local ou http://localhost.';
    if (/access denied|permission/i.test(base)) return 'Accès à la console refusé. Sous Lubuntu, installez la règle udev (voir « Aide à la connexion ») ; sous Windows, fermez le logiciel Initio2.';
    return `Connexion impossible : ${base}`;
  }

  async function reconnexionAuto() {
    if (!('hid' in navigator)) return;
    try {
      const deja = (await navigator.hid.getDevices())
        .filter((d) => d.vendorId === ID_FABRICANT && ID_PRODUITS.includes(d.productId));
      if (deja.length && !etat.transport) await utiliserTransport(new TransportHID(deja[0]));
    } catch (e) { /* on laisse l'utilisateur cliquer sur « Connecter » */ }
    navigator.hid.addEventListener('disconnect', (evt) => {
      if (etat.transport && etat.transport.appareil === evt.device) {
        arreter();
        etat.transport = null;
        majBoutons();
        majEtatConnexion();
        message('La console a été débranchée.', true);
      }
    });
  }

  async function envoyerTrameManuelle() {
    const octets = el.trameHex.value.trim().split(/[\s,;]+/).filter(Boolean).map((s) => parseInt(s, 16));
    if (!octets.length || octets.some((b) => !(b >= 0 && b <= 255))) { message('Trame invalide : saisissez des octets hexadécimaux séparés par des espaces.', true); return; }
    try {
      el.diag.open = true;
      await etat.transport.echange(octets);
      message('');
    } catch (e) { message(`Envoi : ${e.message}`, true); }
  }

  /* ---------- export CSV ---------- */

  function exporterCsv() {
    const sep = ';';
    const num = (x, chiffres = 7) => (Number.isFinite(x) ? String(Number(x.toPrecision(chiffres))).replace('.', ',') : '');
    const lignes = [['t (s)', ...etat.voies.map(libelle)].join(sep)];
    for (let i = 0; i < etat.temps.length; i++) {
      lignes.push([num(etat.temps[i], 9), ...etat.voies.map((v) => num(v.valeurs[i]))].join(sep));
    }
    const blob = new Blob(['﻿' + lignes.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const lien = document.createElement('a');
    const d = new Date();
    const p = (x) => String(x).padStart(2, '0');
    lien.download = `mesures-initio2-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.csv`;
    lien.href = URL.createObjectURL(blob);
    document.body.append(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(lien.href), 2000);
  }

  /* ---------- initialisation ---------- */

  el.btnConnecter.addEventListener('click', connecter);
  el.btnDemo.addEventListener('click', async () => { await utiliserTransport(new TransportDemo()); message(''); });
  el.btnDemarrer.addEventListener('click', demarrer);
  el.btnArreter.addEventListener('click', arreter);
  el.btnEffacer.addEventListener('click', effacer);
  el.btnCsv.addEventListener('click', exporterCsv);
  el.btnTrame.addEventListener('click', envoyerTrameManuelle);

  if (!('hid' in navigator)) {
    message('Ce navigateur ne gère pas l’USB HID. Pour utiliser la console, ouvrez cette page dans Google Chrome, Chromium ou Microsoft Edge. Le mode démo reste disponible.');
  }
  majEnteteTableau();
  majBoutons();
  demanderDessin();
  reconnexionAuto();

  // pour les essais automatisés
  window.__initio2 = { decoderMesures, etat };
})();
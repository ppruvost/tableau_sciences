(function () {
  const rounds = window.MEMORY_ROUNDS;
  let current = -1;
  let results = []; // { good, bad } per round index actually played
  let timerInterval = null;

  const screens = {
    accueil: document.getElementById("screen-accueil"),
    jeu: document.getElementById("screen-jeu"),
    recap: document.getElementById("screen-recap"),
  };
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  // --- QR code vers la page élève (même dossier) ---
  const eleveUrl = new URL("eleve.html", window.location.href).href;
  document.getElementById("eleve-url-note").textContent = eleveUrl;
  /* global QRCode */
  new QRCode(document.getElementById("qrcode"), { text: eleveUrl, width: 180, height: 180 });

  document.getElementById("btn-start").addEventListener("click", () => startRound(0));

  function buildItemEl(item) {
    const wrap = document.createElement("div");
    wrap.className = "item pulse";
    if (item.type === "shape") {
      const el = document.createElement("div");
      el.className = `shape shape-color-fill ${item.shape} color-${item.color}`;
      const scale = item.scale || 1;
      const rotate = item.rotate || 0;
      const baseRotate = item.shape === "losange" ? 45 : 0;
      el.style.transform = `scale(${scale}) rotate(${baseRotate + rotate}deg)`;
      wrap.appendChild(el);
    } else if (item.type === "animal") {
      const el = document.createElement("div");
      el.className = "emoji";
      el.textContent = item.emoji;
      el.style.transform = `scale(${item.scale || 1})`;
      wrap.appendChild(el);
    } else if (item.type === "number") {
      const el = document.createElement("div");
      el.className = "number-chip" + (item.changed ? " changed" : "");
      el.textContent = item.value;
      wrap.appendChild(el);
    }
    return wrap;
  }

  function renderStage(items) {
    const stage = document.getElementById("stage");
    stage.classList.remove("blackout");
    stage.innerHTML = "";
    items.forEach(it => stage.appendChild(buildItemEl(it)));
  }

  function startRound(index) {
    current = index;
    const r = rounds[index];
    showScreen("jeu");
    document.getElementById("tag-block").textContent = r.block;
    document.getElementById("tag-round").textContent = r.label;
    document.getElementById("zone-choix").style.display = "none";
    document.getElementById("zone-tally").style.display = "none";
    document.getElementById("btn-reveal").style.display = "none";
    document.getElementById("btn-show-answer").style.display = "none";

    renderStage(r.initial);
    runTimer(r.memoTime, () => {
      // Blackout puis proposer la révélation
      const stage = document.getElementById("stage");
      stage.classList.add("blackout");
      stage.innerHTML = "";
      document.getElementById("btn-reveal").style.display = "inline-block";
    });

    document.getElementById("btn-reveal").onclick = () => {
      document.getElementById("btn-reveal").style.display = "none";
      renderStage(r.modified);
      document.getElementById("zone-choix").style.display = "block";
      const grid = document.getElementById("choices-grid");
      grid.innerHTML = "";
      r.choices.forEach((c, i) => {
        const b = document.createElement("div");
        b.className = "choice-btn";
        b.textContent = c;
        b.dataset.idx = i;
        grid.appendChild(b);
      });
      document.getElementById("btn-show-answer").style.display = "inline-block";
    };

    document.getElementById("btn-show-answer").onclick = () => {
      document.getElementById("btn-show-answer").style.display = "none";
      [...document.getElementById("choices-grid").children].forEach(b => {
        if (parseInt(b.dataset.idx, 10) === r.correct) b.classList.add("correct");
        else b.classList.add("wrong");
      });
      document.getElementById("zone-tally").style.display = "flex";
      document.getElementById("count-good").textContent = "0";
      document.getElementById("count-bad").textContent = "0";
    };
  }

  function runTimer(seconds, onDone) {
    clearInterval(timerInterval);
    const bar = document.getElementById("timer-bar");
    let elapsed = 0;
    bar.style.width = "100%";
    timerInterval = setInterval(() => {
      elapsed += 0.1;
      const pct = Math.max(0, 100 - (elapsed / seconds) * 100);
      bar.style.width = pct + "%";
      if (elapsed >= seconds) {
        clearInterval(timerInterval);
        onDone();
      }
    }, 100);
  }

  document.getElementById("btn-add-good").addEventListener("click", () => {
    const el = document.getElementById("count-good");
    el.textContent = parseInt(el.textContent, 10) + 1;
  });
  document.getElementById("btn-add-bad").addEventListener("click", () => {
    const el = document.getElementById("count-bad");
    el.textContent = parseInt(el.textContent, 10) + 1;
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    results[current] = {
      label: rounds[current].label,
      good: parseInt(document.getElementById("count-good").textContent, 10),
      bad: parseInt(document.getElementById("count-bad").textContent, 10),
    };
    if (current + 1 < rounds.length) {
      startRound(current + 1);
    } else {
      showRecap();
    }
  });

  function showRecap() {
    showScreen("recap");
    let totalGood = 0, totalBad = 0;
    const barsWrap = document.getElementById("recap-bars");
    barsWrap.innerHTML = "";
    results.forEach(r => {
      if (!r) return;
      totalGood += r.good; totalBad += r.bad;
      const total = r.good + r.bad || 1;
      const row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML = `
        <div class="bar-label">${r.label}</div>
        <div class="bar-track">
          <div class="bar-good" style="width:${(r.good/total)*100}%"></div>
          <div class="bar-bad" style="width:${(r.bad/total)*100}%"></div>
        </div>`;
      barsWrap.appendChild(row);
    });
    document.getElementById("total-good").textContent = totalGood;
    document.getElementById("total-bad").textContent = totalBad;
  }

  document.getElementById("btn-restart").addEventListener("click", () => {
    results = [];
    showScreen("accueil");
  });
})();

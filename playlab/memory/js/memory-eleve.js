(function () {
  const rounds = window.MEMORY_ROUNDS;
  const roundsById = Object.fromEntries(rounds.map(r => [r.id, r]));

  const screens = {
    pseudo: document.getElementById("screen-pseudo"),
    attente: document.getElementById("screen-attente"),
    question: document.getElementById("screen-question"),
    dejaRepondu: document.getElementById("screen-deja-repondu"),
    fin: document.getElementById("screen-fin"),
  };
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let pseudo = sessionStorage.getItem("memory_pseudo") || "";
  let answeredRounds = JSON.parse(sessionStorage.getItem("memory_answered_rounds") || "[]");
  let currentDisplayedRound = null;
  let hasAnsweredCurrent = false;
  let pollInterval = null;

  function markAnswered(roundId) {
    if (!answeredRounds.includes(roundId)) {
      answeredRounds.push(roundId);
      sessionStorage.setItem("memory_answered_rounds", JSON.stringify(answeredRounds));
    }
  }

  // --- Étape 1 : pseudo ---
  if (pseudo) {
    joinDone();
  } else {
    showScreen("pseudo");
  }

  document.getElementById("btn-join").addEventListener("click", async () => {
    const val = document.getElementById("pseudo-input").value.trim();
    if (!val) return;
    document.getElementById("btn-join").disabled = true;
    pseudo = val;
    sessionStorage.setItem("memory_pseudo", pseudo);
    await memoryJoin(pseudo);
    joinDone();
  });

  function joinDone() {
    document.getElementById("pseudo-affiche").textContent = pseudo;
    showScreen("attente");
    startPolling();
  }

  // --- Étape 2 : synchronisation automatique avec l'écran de l'animateur ---
  function startPolling() {
    clearInterval(pollInterval);
    const check = async () => {
      const roundId = await memoryGetSessionRound();
      handleRoundChange(roundId);
    };
    check();
    pollInterval = setInterval(check, 1500);
  }

  function handleRoundChange(roundId) {
    if (roundId === currentDisplayedRound) return; // rien de nouveau
    currentDisplayedRound = roundId;
    hasAnsweredCurrent = false;

    if (roundId === -1) {
      showScreen("attente");
      return;
    }
    if (roundId === 9999) {
      showScreen("fin");
      return;
    }
    const r = roundsById[roundId];
    if (!r) return;

    if (answeredRounds.includes(roundId)) {
      showScreen("dejaRepondu");
      return;
    }
    openRound(r);
  }

  function openRound(r) {
    showScreen("question");
    document.getElementById("q-block").textContent = r.block;
    document.getElementById("q-round").textContent = r.label;
    document.getElementById("q-feedback").style.display = "none";
    const choicesEl = document.getElementById("q-choices");
    choicesEl.innerHTML = "";
    const shuffled = shuffle(r.choices.map((text, i) => ({ text, isCorrect: i === r.correct })));
    shuffled.forEach(c => {
      const b = document.createElement("div");
      b.className = "choice-btn";
      b.textContent = c.text;
      b.dataset.correct = c.isCorrect ? "1" : "0";
      b.addEventListener("click", () => answer(b, c.isCorrect, r, choicesEl));
      choicesEl.appendChild(b);
    });
  }

  function answer(btnClicked, estCorrecte, r, choicesEl) {
    // Verrou anti-spam : un seul clic pris en compte par manche, même en cas de double-clic rapide
    if (hasAnsweredCurrent) return;
    hasAnsweredCurrent = true;
    markAnswered(r.id);

    [...choicesEl.children].forEach(b => { b.style.pointerEvents = "none"; });
    if (btnClicked.dataset.correct === "1") btnClicked.classList.add("correct");
    else {
      btnClicked.classList.add("wrong");
      [...choicesEl.children].find(b => b.dataset.correct === "1")?.classList.add("correct");
    }

    memorySubmitAnswer(r.id, estCorrecte, pseudo);

    const fb = document.getElementById("q-feedback");
    fb.style.display = "block";
    if (estCorrecte) {
      fb.textContent = "✅ Bonne réponse !";
      fb.style.color = "var(--good)";
    } else {
      fb.textContent = "❌ Raté ! " + r.explanation;
      fb.style.color = "var(--bad)";
    }
  }
})();

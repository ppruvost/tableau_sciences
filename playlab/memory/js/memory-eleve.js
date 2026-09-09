(function () {
  const rounds = window.MEMORY_ROUNDS;
  const screens = {
    choix: document.getElementById("screen-choix-manche"),
    question: document.getElementById("screen-question"),
  };
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  const grid = document.getElementById("round-grid");
  rounds.forEach((r, i) => {
    const cell = document.createElement("div");
    cell.className = "round-cell";
    cell.textContent = i;
    cell.addEventListener("click", () => openRound(i));
    grid.appendChild(cell);
  });

  function openRound(i) {
    const r = rounds[i];
    showScreen("question");
    document.getElementById("q-block").textContent = r.block;
    document.getElementById("q-round").textContent = r.label;
    document.getElementById("q-feedback").style.display = "none";
    const choicesEl = document.getElementById("q-choices");
    choicesEl.innerHTML = "";
    r.choices.forEach((c, idx) => {
      const b = document.createElement("div");
      b.className = "choice-btn";
      b.textContent = c;
      b.addEventListener("click", () => answer(idx, r, choicesEl));
      choicesEl.appendChild(b);
    });
  }

  function answer(idx, r, choicesEl) {
    // Réponse locale uniquement — rien n'est envoyé ni conservé après avoir quitté la page.
    [...choicesEl.children].forEach((b, i) => {
      b.style.pointerEvents = "none";
      if (i === r.correct) b.classList.add("correct");
      else if (i === idx) b.classList.add("wrong");
    });
    const fb = document.getElementById("q-feedback");
    fb.style.display = "block";
    if (idx === r.correct) {
      fb.textContent = "✅ Bonne réponse !";
      fb.style.color = "var(--good)";
    } else {
      fb.textContent = "❌ Raté ! " + r.explanation;
      fb.style.color = "var(--bad)";
    }
  }

  document.getElementById("btn-back").addEventListener("click", () => showScreen("choix"));
})();

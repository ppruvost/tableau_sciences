// Sons et musique 100% synthétisés (Web Audio API) — aucun fichier audio à héberger, aucun droit d'auteur.

const MemorySound = (function () {
  let ctx = null;
  let muted = localStorage.getItem("memory_muted") === "1";
  let loopTimer = null;
  let loopStep = 0;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function beep(freq, duration, type = "square", vol = 0.15, delay = 0) {
    if (muted) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain).connect(c.destination);
    const t0 = c.currentTime + delay;
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  // Petite mélodie chiptune entraînante en boucle, jouée pendant l'attente/le jeu
  const MELODY = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 987, 880, 784, 659, 523];
  function startLoop() {
    stopLoop();
    loopStep = 0;
    loopTimer = setInterval(() => {
      if (!muted) beep(MELODY[loopStep % MELODY.length], 0.18, "triangle", 0.06);
      loopStep++;
    }, 220);
  }
  function stopLoop() {
    clearInterval(loopTimer);
    loopTimer = null;
  }

  function tick() { beep(880, 0.08, "square", 0.12); }
  function correct() { beep(659, 0.1, "square", 0.18, 0); beep(988, 0.15, "square", 0.18, 0.1); }
  function wrong() { beep(196, 0.25, "sawtooth", 0.15); }
  function fanfare() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => beep(f, 0.25, "square", 0.2, i * 0.12));
  }
  function fireworkPop() {
    beep(1200 + Math.random() * 400, 0.12, "sawtooth", 0.12);
  }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("memory_muted", muted ? "1" : "0");
    if (muted) stopLoop();
    return muted;
  }
  function isMuted() { return muted; }
  function unlockAudioContext() { getCtx(); if (getCtx().state === "suspended") getCtx().resume(); }

  return { startLoop, stopLoop, tick, correct, wrong, fanfare, fireworkPop, toggleMute, isMuted, unlockAudioContext };
})();

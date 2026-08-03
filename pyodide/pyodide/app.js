let pyodideReady = null;
let pyodide = null;

async function loadPyodideOnce() {
  if (!pyodideReady) {
    pyodideReady = loadPyodide({
      indexURL: "./pyodide/",
    });
  }
  pyodide = await pyodideReady;
  return pyodide;
}

function setOutput(text) {
  const out = document.getElementById("output");
  out.textContent = text;
}

function setStatus(text) {
  const status = document.getElementById("status");
  if (status) status.textContent = text;
}

async function runPythonCode(code) {
  if (!code.trim()) {
    setOutput("");
    return;
  }

  await loadPyodideOnce();

  try {
    const result = await pyodide.runPythonAsync(code);
    setOutput(result === undefined ? "" : String(result));
  } catch (err) {
    setOutput(String(err));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const editor = document.getElementById("code");
  const runButton = document.getElementById("run");

  if (!editor || !runButton) return;

  setStatus("Chargement de Pyodide...");
  await loadPyodideOnce();
  setStatus("Prêt.");

  runButton.addEventListener("click", async () => {
    setStatus("Exécution...");
    await runPythonCode(editor.value);
    setStatus("Prêt.");
  });

  editor.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setStatus("Exécution...");
      await runPythonCode(editor.value);
      setStatus("Prêt.");
    }
  });
});

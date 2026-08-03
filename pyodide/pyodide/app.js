let pyodidePromise = null;
let pyodide = null;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide({
      indexURL: "./pyodide/",
    });
  }
  pyodide = await pyodidePromise;
  return pyodide;
}

function setOutput(text) {
  const output = document.getElementById("output");
  if (output) output.textContent = text;
}

function setStatus(text) {
  const status = document.getElementById("status");
  if (status) status.textContent = text;
}

async function runCode() {
  const editor = document.getElementById("code");
  if (!editor) return;

  const code = editor.value.trim();
  if (!code) {
    setOutput("");
    return;
  }

  try {
    setStatus("Chargement...");
    await getPyodide();
    setStatus("Exécution...");
    const result = await pyodide.runPythonAsync(code);
    setOutput(result === undefined ? "" : String(result));
  } catch (err) {
    setOutput(String(err));
  } finally {
    setStatus("Prêt.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const runButton = document.getElementById("run");
  const editor = document.getElementById("code");

  setStatus("Chargement...");
  await getPyodide();
  setStatus("Prêt.");

  if (runButton) {
    runButton.addEventListener("click", runCode);
  }

  if (editor) {
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        runCode();
      }
    });
  }
});

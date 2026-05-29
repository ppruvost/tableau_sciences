const canvas = document.getElementById("timerCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");
const minutesInput = document.getElementById("minutes");
const timeText = document.getElementById("timeText");

let totalTime = 0;
let remainingTime = 0;
let timerInterval = null;

function drawTimer(percentage) {
  const radius = canvas.width / 2 - 10;
  const center = canvas.width / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Cercle de fond
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Secteur bleu (temps restant)
  const endAngle = -Math.PI / 2 + 2 * Math.PI * percentage;
  ctx.beginPath();
  ctx.moveTo(center, center);
  ctx.arc(center, center, radius, -Math.PI / 2, endAngle, false);
  ctx.closePath();
  ctx.fillStyle = "blue";
  ctx.fill();
}

function updateTimer() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timeText.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const percentage = remainingTime / totalTime;
  drawTimer(percentage);

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    drawTimer(0);
    timeText.textContent = "⏰ Terminé !";
  } else {
    remainingTime--;
  }
}

startBtn.addEventListener("click", () => {
  const minutes = parseInt(minutesInput.value);
  if (isNaN(minutes) || minutes < 1 || minutes > 120) {
    alert("Veuillez entrer un nombre entre 1 et 120 minutes.");
    return;
  }

  totalTime = minutes * 60;
  remainingTime = totalTime;

  clearInterval(timerInterval);
  updateTimer(); // Dessine immédiatement
  timerInterval = setInterval(updateTimer, 1000);
});

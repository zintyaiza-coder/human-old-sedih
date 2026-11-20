// ==========================================
// 🔧 KUSTOMISASI MUDAH DI SINI
// ==========================================
const FOTO_KAMU = "foto-kamu.jpg"; // Ganti sesuai nama file fotomu di GitHub

const KATA_SEMANGAT = [
  "Keren banget! Senyummu tuh bikin ruangan jadi cerah ✨",
  "Kamu luar biasa hari ini, jangan lupa minum air putih ya! 💧",
  "Hari ini pantes banget ditutup pake jajan enak kesukaanmu! 🧋",
  "Energi positifmu nular banget nih, gas terus! 🌟",
  "Kamu berharga banget, aku selalu seneng punya temen kayak kamu 💖",
  "Auto happy! Habis ini kita ketawa-ketawa lagi ya 😄",
  "Hebat! Satu pukulan ceria buat hari yang makin seru 🎉",
  "Kamu keren tanpa perlu berusaha keras, beneran deh! 😎"
];

const KATA_SALAH_PUKUL = [
  "ADUH! Kok mukaku yang kena pukul sih?! 😭",
  "Woy! Ini aku bestie-mu, bukan target! 😤",
  "Eits kena aku! Hukumannya traktir es krim ya 🍦",
  "Aduh benjol! Fokus dong, matanya mana nih 🤣"
];

const TARGET_ICONS = ["👾", "🦄", "🍄", "🍬", "🛸"];
const BURST_ICONS = ["✨", "💖", "⭐", "🌸", "🎉"];

// ==========================================
// 🎵 EFEK SUARA RINGAN (WEB AUDIO API)
// ==========================================
let soundEnabled = true;
let audioCtx;

function playTone(type) {
  if (!soundEnabled) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "hit") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
    osc.start(now);
    osc.stop(now + 0.13);
  } else if (type === "oops") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.22);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.23);
    osc.start(now);
    osc.stop(now + 0.23);
  } else if (type === "win") {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, now + idx * 0.1);
      g.gain.setValueAtTime(0.15, now + idx * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(now + idx * 0.1);
      o.stop(now + idx * 0.1 + 0.25);
    });
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById("soundBtn").textContent = soundEnabled ? "🔊" : "🔇";
}

// ==========================================
// 🎮 LOGIKA GAME & ANIMASI EFEK
// ==========================================
const holes = document.querySelectorAll(".hole");
const scoreBoard = document.getElementById("score");
const timeBoard = document.getElementById("time");
const messageBox = document.getElementById("messageBox");
const startBtn = document.getElementById("startBtn");
const mascot = document.getElementById("mascot");
const gameContainer = document.getElementById("gameContainer");

let lastHole;
let timeUp = false;
let score = 0;
let timeLeft = 30;
let countdownTimer;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole() {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole();
  lastHole = hole;
  return hole;
}

function setMascotMood(emoji, excited = false) {
  mascot.textContent = emoji;
  if (excited) {
    mascot.classList.remove("excited");
    void mascot.offsetWidth;
    mascot.classList.add("excited");
  }
}

function spawnFloatingText(x, y, text, color) {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = color;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

function spawnParticles(x, y) {
  for (let i = 0; i < 7; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = BURST_ICONS[Math.floor(Math.random() * BURST_ICONS.length)];
    const angle = (Math.PI * 2 * i) / 7;
    const dist = 42 + Math.random() * 24;
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 650);
  }
}

function launchConfetti() {
  const colors = ["#FF5D8F", "#FFD43B", "#52D6A8", "#74C0FC", "#FF9F68"];
  for (let i = 0; i < 45; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = `${Math.random() * 100}vw`;
    c.style.width = `${8 + Math.random() * 8}px`;
    c.style.height = `${10 + Math.random() * 10}px`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = `${2 + Math.random() * 2}s`;
    c.style.animationDelay = `${Math.random() * 0.6}s`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

function peep() {
  const time = randomTime(720, 1200);
  const hole = randomHole();
  const mole = hole.querySelector(".mole");

  mole.classList.remove("bonked");
  const isFriend = Math.random() < 0.3;

  if (isFriend) {
    mole.innerHTML = `<img src="${FOTO_KAMU}" alt="Bestie">`;
    mole.dataset.type = "friend";
  } else {
    mole.textContent = TARGET_ICONS[Math.floor(Math.random() * TARGET_ICONS.length)];
    mole.dataset.type = "target";
  }

  hole.classList.add("up");

  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreBoard.textContent = score;
  timeBoard.textContent = timeLeft;
  timeUp = false;
  startBtn.disabled = true;
  setMascotMood("🤩", true);
  updateMessage("Ayo kumpulin poin ceria sebanyak-banyaknya! 💪", "normal");

  peep();

  countdownTimer = setInterval(() => {
    timeLeft--;
    timeBoard.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      timeUp = true;
      startBtn.disabled = false;
      startBtn.textContent = "Main Lagi! 🔄";
      setMascotMood("🥳", true);
      playTone("win");
      launchConfetti();
      updateMessage(
        `Waktunya habis! Skor kamu ${score} — kamu hebat banget hari ini! 🎊💖`,
        "pop"
      );
    }
  }, 1000);
}

function updateMessage(text, type) {
  messageBox.textContent = text;
  messageBox.classList.remove("pop", "oops");
  void messageBox.offsetWidth;
  if (type === "pop") messageBox.classList.add("pop");
  else if (type === "oops") messageBox.classList.add("oops");
}

holes.forEach((hole) => {
  hole.addEventListener("pointerdown", function () {
    if (!hole.classList.contains("up") || timeUp) return;

    const mole = hole.querySelector(".mole");
    const rect = hole.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    mole.classList.add("bonked");
    hole.classList.remove("up");

    if (mole.dataset.type === "friend") {
      score = Math.max(0, score - 1);
      playTone("oops");
      setMascotMood("😱", true);

      gameContainer.classList.remove("shake");
      void gameContainer.offsetWidth;
      gameContainer.classList.add("shake");

      spawnFloatingText(cx, cy, "-1 😅", "#E03131");
      const oopsMsg = KATA_SALAH_PUKUL[Math.floor(Math.random() * KATA_SALAH_PUKUL.length)];
      updateMessage(oopsMsg, "oops");
    } else {
      score++;
      playTone("hit");
      setMascotMood("🥰", true);
      spawnParticles(cx, cy);
      spawnFloatingText(cx, cy, "+1 ✨", "#D93B6C");

      const cheerMsg = KATA_SEMANGAT[Math.floor(Math.random() * KATA_SEMANGAT.length)];
      updateMessage(cheerMsg, "pop");
    }

    scoreBoard.textContent = score;
  });
});

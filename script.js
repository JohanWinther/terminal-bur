const PASSWORD = "pa"; // You can change the password here

const webcam = document.getElementById('webcam');
const tears = document.getElementById('tears');
const gameContainer = document.getElementById('game-container');
const tearsRight = document.getElementById('tears-right');
const fadeOverlay = document.getElementById('fade-black-overlay');
const webcamTimestamp = document.getElementById('webcam-timestamp');

// --- Password UI ---
const passwordBoxes = document.getElementById('password-boxes');
const keyboard = document.getElementById('keyboard');
const passwordArea = document.getElementById('password-area');

let input = "";

const swedishQwerty = [
  ['Q','W','E','R','T','Y','U','I','O','P','Å'],
  ['A','S','D','F','G','H','J','K','L','Ö','Ä'],
  ['Z','X','C','V','B','N','M']
];

let timestampInterval = null;
let frozenTimestamp = null;

const WEBCAM_MODEL = 'Panasonic WV-CW504 ';
const WEBCAM_MODEL_VICTORY = 'AXIS M3057-PLR ';

function renderBoxes() {
  passwordBoxes.innerHTML = '';
  for (let i = 0; i < PASSWORD.length; i++) {
    const box = document.createElement('div');
    box.className = 'password-box';
    // Show input in uppercase
    box.textContent = input[i] ? input[i].toUpperCase() : '';
    passwordBoxes.appendChild(box);
  }
}

function renderKeyboard() {
  keyboard.innerHTML = '';
  const maxCols = Math.max(...swedishQwerty.map(row => row.length));
  swedishQwerty.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    rowDiv.style.gridTemplateColumns = `repeat(${maxCols}, 1fr)`;
    const pad = maxCols - row.length;
    const leftPad = Math.floor(pad / 2);
    const rightPad = pad - leftPad;
    for (let i = 0; i < leftPad; i++) {
      const spacer = document.createElement('div');
      spacer.className = 'key-spacer';
      rowDiv.appendChild(spacer);
    }
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'key-btn';
      btn.textContent = key;
      btn.type = 'button';
      btn.onclick = () => handleKey(key);
      rowDiv.appendChild(btn);
    });
    for (let i = 0; i < rightPad; i++) {
      const spacer = document.createElement('div');
      spacer.className = 'key-spacer';
      rowDiv.appendChild(spacer);
    }
    keyboard.appendChild(rowDiv);
  });
}

function handleKey(key) {
  if (input.length < PASSWORD.length && /^[A-ZÅÄÖ]$/i.test(key)) {
    input += key.toLowerCase();
    renderBoxes();
    if (input.length === PASSWORD.length) {
      checkPassword();
    }
  }
}

function checkPassword() {
  if (input === PASSWORD) {
    passwordArea.classList.add('flash');
    fadeOverlay.classList.remove('fade-out');
    fadeOverlay.classList.add('fade-in');
    setTimeout(() => {
      victoryScreen();
    }, 5000);
  } else {
    passwordArea.classList.add('shake');
    setTimeout(() => {
      passwordArea.classList.remove('shake');
      input = '';
      renderBoxes();
    }, 500);
  }
}

function formatTimestamp(date) {
  // Format: YYYY-MM-DD HH:MM:SS
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function updateTimestamp() {
  let model = (frozenTimestamp !== null) ? WEBCAM_MODEL_VICTORY : WEBCAM_MODEL;
  if (frozenTimestamp !== null) {
    webcamTimestamp.textContent = `${model}${frozenTimestamp}`;
    return;
  }
  const now = new Date();
  webcamTimestamp.textContent = `${model}${formatTimestamp(now)}`;
}

function startTimestamp() {
  updateTimestamp();
  timestampInterval = setInterval(updateTimestamp, 1000);
}

function freezeTimestamp() {
  if (timestampInterval) clearInterval(timestampInterval);
  const now = new Date();
  frozenTimestamp = formatTimestamp(now);
  updateTimestamp();
}

function victoryScreen() {
  freezeTimestamp();
  document.body.classList.add('victory');
  webcam.src = 'images/webcam-2.jpg';
  tears.style.display = 'none';
  tearsRight.style.display = 'none';
  fadeOverlay.classList.remove('fade-in');
  fadeOverlay.classList.add('fade-out');
  passwordArea.innerHTML = '<div style="color:#00ff00;font-size:2em;margin-top:2em;">Lovis är fri!</div>';
  passwordArea.style.opacity = 1;
}

// Initial render
renderBoxes();
renderKeyboard();
startTimestamp();

// Add flicker effect to webcam image
webcam.classList.add('flicker');

// Remove flicker and noise on victory
const webcamNoise = document.getElementById('webcam-noise');
const originalVictoryScreen = victoryScreen;
victoryScreen = function() {
  webcam.classList.remove('flicker');
  if (webcamNoise) webcamNoise.style.display = 'none';
  originalVictoryScreen();
};

const PASSWORD = "rökpunk"; // You can change the password here

const webcam = document.getElementById('webcam');
const tears = document.getElementById('tears');
const gameContainer = document.getElementById('game-container');
const tearsRight = document.getElementById('tears-right');
const fadeOverlay = document.getElementById('fade-black-overlay');

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

function renderBoxes() {
  passwordBoxes.innerHTML = '';
  for (let i = 0; i < PASSWORD.length; i++) {
    const box = document.createElement('div');
    box.className = 'password-box';
    box.textContent = input[i] ? input[i] : '';
    passwordBoxes.appendChild(box);
  }
}

function renderKeyboard() {
  keyboard.innerHTML = '';
  swedishQwerty.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'key-btn';
      btn.textContent = key;
      btn.type = 'button';
      btn.onclick = () => handleKey(key);
      rowDiv.appendChild(btn);
    });
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

function victoryScreen() {
  document.body.classList.add('victory');
  webcam.src = 'images/webcam-2.jpg';
  tears.style.display = 'none';
  tearsRight.style.display = 'none';
  fadeOverlay.classList.remove('fade-in');
  fadeOverlay.classList.add('fade-out');
  passwordArea.innerHTML = '<div style="color:#00ff00;font-size:2em;margin-top:2em;">Lovis has been freed!</div>';
  passwordArea.style.opacity = 1;
}

// Initial render
renderBoxes();
renderKeyboard();

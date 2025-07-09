const PASSWORD = "lovis"; // You can change the password here

const terminalOutput = document.getElementById('terminal-output');
const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');
const webcam = document.getElementById('webcam');
const tears = document.getElementById('tears');
const gameContainer = document.getElementById('game-container');

function printToTerminal(text, isError = false) {
  const line = document.createElement('div');
  line.textContent = text;
  if (isError) line.style.color = '#ff4444';
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function hackingFeedback(guess) {
  const errors = [
    `ACCESS DENIED: Password '${guess}' incorrect.`,
    `ERROR: Invalid credentials.`,
    `SYSTEM ALERT: Unauthorized attempt detected.`,
    `Hint: The password is the cat's name...`,
    `CAGE LOCKDOWN: Try again.`,
    `Password rejected.`,
    `No match found for '${guess}'.`,
    `CAGE TERMINAL: Incorrect password.`
  ];
  // Random error message, but always show the hint after a few tries
  if (guess.toLowerCase() !== PASSWORD && Math.random() < 0.2) {
    printToTerminal(errors[3], true);
  } else {
    printToTerminal(errors[Math.floor(Math.random() * errors.length)], true);
  }
}

terminalForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const guess = terminalInput.value.trim();
  if (!guess) return;
  printToTerminal(`cage@terminal:~$ ${guess}`);
  if (guess.toLowerCase() === PASSWORD) {
    victoryScreen();
  } else {
    hackingFeedback(guess);
  }
  terminalInput.value = '';
});

function victoryScreen() {
  document.body.classList.add('victory');
  webcam.src = 'images/webcam-2.jpg';
  tears.style.display = 'none';
  terminalOutput.innerHTML = '';
  printToTerminal('Lovis has been freed!');
  printToTerminal('');
  printToTerminal('Thank you for hacking the cage.');
  terminalForm.style.display = 'none';
}

// Initial terminal greeting
printToTerminal('CAGE TERMINAL v1.0');
printToTerminal('-------------------');
printToTerminal('Enter password to unlock the cage.');
printToTerminal('');
terminalInput.focus();

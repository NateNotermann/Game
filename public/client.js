document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const messages = document.getElementById('messages');
  const turnBtn = document.getElementById('turn-btn');
  const statusDiv = document.getElementById('status');
  const nameDiv = document.createElement('div');
  const passWordBtn = document.getElementById('pass-word-btn');
  const startStopBtn = document.getElementById('start-stop-btn');
  const categorySelect = document.getElementById('category-select');
  let gameActive = false;
  let countdownInterval = null;
  let timeLeft = 0;
  let beepAudio = null;
  let startAudio = null;
  let isMuted = false;

  nameDiv.id = 'player-name';
  nameDiv.style.fontWeight = 'bold';
  nameDiv.style.marginBottom = '12px';
  document.getElementById('game-container').insertBefore(nameDiv, document.getElementById('status'));

  // Add mute button to UI
//   const muteBtn = document.createElement('button');
//   muteBtn.id = 'mute-btn';
//   muteBtn.textContent = '🔊';
//   muteBtn.title = 'Mute/Unmute Sounds';
//   muteBtn.style.position = 'absolute';
//   muteBtn.style.top = '10px';
//   muteBtn.style.right = '10px';
//   muteBtn.style.zIndex = '100';
//   muteBtn.style.background = '#fff';
//   muteBtn.style.border = '1px solid #ccc';
//   muteBtn.style.borderRadius = '50%';
//   muteBtn.style.width = '36px';
//   muteBtn.style.height = '36px';
//   muteBtn.style.fontSize = '18px';
//   muteBtn.style.cursor = 'pointer';
//   document.body.appendChild(muteBtn);

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  });

  turnBtn.addEventListener('click', () => {
    // stopAllSounds(); // Removed: Passing turn should not stop the sound
    socket.emit('passTurn');
    turnBtn.disabled = true;
    statusDiv.textContent = 'Waiting for other player...';
  });

  passWordBtn.addEventListener('click', () => {
    // stopAllSounds(); // Removed: Passing word should not stop the sound
    socket.emit('passWord');
    // Optionally, give feedback
    passWordBtn.disabled = true;
    passWordBtn.textContent = 'Word Passed!';
    setTimeout(() => {
      passWordBtn.disabled = false;
      passWordBtn.textContent = 'Pass on Word';
    }, 1000);
  });

  startStopBtn.addEventListener('click', () => {
    if (!gameActive) {
      socket.emit('startGame');
      startStopBtn.textContent = 'Stop Game';
      startStopBtn.style.background = 'linear-gradient(90deg,#e24a4a,#e3c250)';
      gameActive = true;
    } else {
      socket.emit('stopGame');
      startStopBtn.textContent = 'Start Game';
      startStopBtn.style.background = 'linear-gradient(90deg,#4ae250,#50e3c2)';
      gameActive = false;
    }
  });

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      socket.emit('setCategory', categorySelect.value);
    });
    socket.on('categoryChanged', (category) => {
      if (categorySelect.value !== category) {
        categorySelect.value = category;
      }
    });
  }

  function playStartSound() {
    if (isMuted) return;
    if (startAudio) {
      startAudio.pause();
      startAudio.currentTime = 0;
    }
    startAudio = new Audio('Sound.wav');
    startAudio.play();
  }

  function playBeep() {
    if (isMuted) return;
    if (beepAudio) {
      beepAudio.pause();
      beepAudio.currentTime = 0;
    }
    beepAudio = new Audio('Sound.wav');
    beepAudio.play();
  }

  function stopAllSounds() {
    if (beepAudio) {
      beepAudio.pause();
      beepAudio.currentTime = 0;
    }
    if (startAudio) {
      startAudio.pause();
      startAudio.currentTime = 0;
    }
  }

  function startCountdown(seconds) {
    clearInterval(countdownInterval);
    timeLeft = seconds;
    updateTimerDisplay();

    countdownInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  socket.on('gamePaused', () => {
    gameActive = false;
    stopAllSounds();
    startStopBtn.textContent = 'Start Game';
    startStopBtn.style.background = 'linear-gradient(90deg,#4ae250,#50e3c2)';
    statusDiv.textContent = 'Game paused. Press Start Game to play!';
    turnBtn.style.display = 'none';
    passWordBtn.style.display = 'none';
  });

  socket.on('gameStarted', () => {
    gameActive = true;
    playStartSound();
    startStopBtn.textContent = 'Stop Game';
    startStopBtn.style.background = 'linear-gradient(90deg,#e24a4a,#e3c250)';
  });

  socket.on('gameOver', (data) => {
    gameActive = false;
    stopAllSounds();
    startStopBtn.textContent = 'Start Game';
    startStopBtn.style.background = 'linear-gradient(90deg,#4ae250,#50e3c2)';
    statusDiv.textContent = `${data.loser} lost! ${data.winner} wins!`;
    turnBtn.style.display = 'none';
    passWordBtn.style.display = 'none';
  });

  socket.on('message', (data) => {
    if (data.name) {
      nameDiv.textContent = `Hi ${data.name}!`;
    }
    if (data.type === 'newWord') {
      // Do NOT play sound here
      statusDiv.textContent = `Your word: ${data.word}`;
      turnBtn.disabled = false;
      turnBtn.style.display = 'inline-block';
      passWordBtn.style.display = 'inline-block';
      passWordBtn.disabled = false;
      passWordBtn.textContent = 'Pass on Word';
    } else if (data.type === 'yourTurn') {
      statusDiv.textContent = `It is ${data.currentPlayer}'s turn.`;
      turnBtn.disabled = true;
      turnBtn.style.display = 'none';
      passWordBtn.style.display = 'none';
    } else if (data.type === 'timeout') {
      // handled by gameOver
    } else if (data.type === 'info') {
      statusDiv.textContent = data.text;
      turnBtn.disabled = true;
      turnBtn.style.display = 'none';
      passWordBtn.style.display = 'none';
    }
  });
});

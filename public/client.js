document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const messages = document.getElementById('messages');
  const turnBtn = document.getElementById('turn-btn');
  const statusDiv = document.getElementById('status');
  const nameDiv = document.createElement('div');
  const passWordBtn = document.getElementById('pass-word-btn');

  nameDiv.id = 'player-name';
  nameDiv.style.fontWeight = 'bold';
  nameDiv.style.marginBottom = '12px';
  document.getElementById('game-container').insertBefore(nameDiv, document.getElementById('status'));

  turnBtn.addEventListener('click', () => {
    socket.emit('passTurn');
    turnBtn.disabled = true;
    statusDiv.textContent = 'Waiting for other player...';
  });

  passWordBtn.addEventListener('click', () => {
    socket.emit('passWord');
    // Optionally, give feedback
    passWordBtn.disabled = true;
    passWordBtn.textContent = 'Word Passed!';
    setTimeout(() => {
      passWordBtn.disabled = false;
      passWordBtn.textContent = 'Pass on Word';
    }, 1000);
  });

  socket.on('message', (data) => {
    if (data.name) {
      nameDiv.textContent = `You are: ${data.name}`;
    }
    if (data.type === 'newWord') {
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
      if (socket.id === data.loser) {
        statusDiv.textContent = "Time's up! You lost this round.";
      } else {
        statusDiv.textContent = "Opponent ran out of time! Your turn.";
      }
      turnBtn.disabled = true;
      turnBtn.style.display = 'none';
      passWordBtn.style.display = 'none';
    } else if (data.type === 'info') {
      statusDiv.textContent = data.text;
      turnBtn.disabled = true;
      turnBtn.style.display = 'none';
      passWordBtn.style.display = 'none';
    }
  });
});

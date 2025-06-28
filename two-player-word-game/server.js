const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
let players = [];
let currentWord = '';
let currentPlayerIndex = 0;
let timer = null;
const TURN_TIME = 30; // seconds

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  if (players.length < 2) {
    players.push(socket);
    socket.emit('message', { type: 'info', text: 'Waiting for another player...' });
    
    if (players.length === 2) {
      startGame();
    }
  } else {
    socket.emit('message', { type: 'info', text: 'Game is full. Please wait.' });
  }

  socket.on('passTurn', () => {
    if (timer) clearTimeout(timer);
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    startGame();
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    players = players.filter(player => player !== socket);
    if (timer) clearTimeout(timer);
    if (players.length < 2) {
      currentWord = '';
      io.emit('message', { type: 'info', text: 'A player has disconnected. Waiting for a new player...' });
    }
  });
});

function startGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  players[currentPlayerIndex].emit('message', {
    type: 'newWord',
    word: currentWord,
    yourTurn: true,
    time: TURN_TIME
  });
  players[(currentPlayerIndex + 1) % 2].emit('message', {
    type: 'yourTurn',
    yourTurn: false,
    time: TURN_TIME
  });

  // Start timer
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    // Time's up, current player loses
    io.emit('message', { type: 'timeout', loser: players[currentPlayerIndex].id });
    // Switch turn
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    startGame();
  }, TURN_TIME * 1000);
}

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
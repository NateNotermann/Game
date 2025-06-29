const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const words = [
  'Miami', 'New York', 'Flingy', 'Dingy', 'Flamingo', 'Monkey', 'Public Domain',
  'Nicolet Island Inn', 'Cabana Club', 'Mezcal', 'Tequila', 'Whiskey',
  'Chocolate', 'Chocolate Ice Cream', 'Burgers', 'Donuts', 'Tiramisu',
  'Little Tijuana', 'Tii Cup', 'Mini Golf', "Butcher's Tale", 'Nightingale',
  'CC Club', 'Vegas Lounge', 'Parlor', 'Flora Room', 'Hewing Hotel', 'Wild Minds',
  'Meteor Bar', 'Tattersall', 'Star Gazer', "Nico's Tacos", 'Malcolm Yards',
  'Snack Bar', 'Minari', "Diane's Place", 'Paraguay', 'China', 'Pink', 'Blue',
  'Candy', 'Coco', 'Javier', 'clogging the toilet', 'spicy poos', 'Salsa Dancing'
];
let players = [];
const playerNames = ['Nate', 'Courtney'];
let currentWord = '';
let currentPlayerIndex = 0;
let timer = null;
const TURN_TIME = 30; // seconds
let gameActive = false;
let currentCategory = 'all';

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  if (players.length < 2) {
    players.push(socket);
    socket.emit('message', { type: 'info', text: 'Waiting for another player...', name: playerNames[players.length - 1] });
    
    if (players.length === 2) {
      socket.emit('message', { type: 'info', text: 'Both players connected. Click "Start Game" to begin.' });
    }
  } else {
    socket.emit('message', { type: 'info', text: 'Game is full. Please wait.' });
  }

  socket.emit('categoryChanged', currentCategory);

  socket.on('setCategory', (category) => {
    currentCategory = category;
    io.emit('categoryChanged', currentCategory);
  });

  socket.on('startGame', () => {
    if (!gameActive && players.length === 2) {
      gameActive = true;
      startGame();
      io.emit('gameStarted'); // This triggers the start sound globally
    }
  });

  socket.on('stopGame', () => {
    if (gameActive) {
      gameActive = false;
      if (timer) clearTimeout(timer);
      io.emit('gamePaused');
    }
  });

  socket.on('passTurn', () => {
    if (timer) clearTimeout(timer);
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    startGame();
  });

  socket.on('passWord', () => {
    // Just send a new word to the current player, do not change turn or timer
    currentWord = words[Math.floor(Math.random() * words.length)];
    players[currentPlayerIndex].emit('message', {
      type: 'newWord',
      word: currentWord,
      yourTurn: true,
      time: TURN_TIME,
      name: playerNames[currentPlayerIndex]
    });
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
  if (!gameActive) return;
  currentWord = words[Math.floor(Math.random() * words.length)];
  players[currentPlayerIndex].emit('message', {
    type: 'newWord',
    word: currentWord,
    yourTurn: true,
    time: TURN_TIME,
    name: playerNames[currentPlayerIndex]
  });
  players[(currentPlayerIndex + 1) % 2].emit('message', {
    type: 'yourTurn',
    yourTurn: false,
    time: TURN_TIME,
    name: playerNames[(currentPlayerIndex + 1) % 2],
    currentPlayer: playerNames[currentPlayerIndex]
  });

  // Start timer
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    // Time's up, current player loses
    gameActive = false;
    io.emit('gameOver', {
      loser: playerNames[currentPlayerIndex],
      winner: playerNames[(currentPlayerIndex + 1) % 2]
    });
    // Do not auto-restart
  }, TURN_TIME * 1000);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on http://localhost:' + PORT);
});

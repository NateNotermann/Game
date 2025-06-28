const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let wordCategories = {
  default: [
    'Miami', 'New York', 'Flingy', 'Dingy', 'Flamingo', 'Monkey', 'Public Domain',
    'Nicolet Island Inn', 'Cabana Club', 'Mezcal', 'Tequila', 'Whiskey',
    'Chocolate', 'Chocolate Ice Cream', 'Burgers', 'Donuts', 'Tiramisu',
    'Little Tijuana', 'Tii Cup', 'Mini Golf', "Butcher's Tale", 'Nightingale',
    'CC Club', 'Vegas Lounge', 'Parlor', 'Flora Room', 'Hewing Hotel', 'Wild Minds',
    'Meteor Bar', 'Tattersall', 'Star Gazer', "Nico's Tacos", 'Malcolm Yards',
    'Snack Bar', 'Minari', "Diane's Place", 'Paraguay', 'China', 'Pink', 'Blue',
    'Candy', 'Coco', 'Javier', 'clogging the toilet', 'spicy poos', 'Salsa Dancing'
  ],
  food: [
    'Chocolate', 'Chocolate Ice Cream', 'Burgers', 'Donuts', 'Tiramisu',
    'Mezcal', 'Tequila', 'Whiskey', 'Candy', 'Coco', 'Snack Bar', 'Minari'
  ],
  places: [
    'Miami', 'New York', 'Nicolet Island Inn', 'Cabana Club', 'Little Tijuana',
    'Tii Cup', 'Mini Golf', "Butcher's Tale", 'Nightingale', 'CC Club', 'Vegas Lounge',
    'Parlor', 'Flora Room', 'Hewing Hotel', 'Wild Minds', 'Meteor Bar', 'Tattersall',
    'Star Gazer', "Nico's Tacos", 'Malcolm Yards', 'Snack Bar', 'Minari', "Diane's Place",
    'Paraguay', 'China'
  ],
  activities: [
    'Salsa Dancing', 'Mini Golf', 'spicy poos', 'clogging the toilet'
  ],
  colors: [
    'Pink', 'Blue'
  ],
  people: [
    'Javier', 'Nate', 'Courtney'
  ],
  funny: [
    'spicy poos', 'clogging the toilet', 'Flingy', 'Dingy', 'Monkey'
  ]
};
let players = [];
const playerNames = ['Nate', 'Courtney'];
let currentWord = '';
let currentPlayerIndex = 0;
let timer = null;
const TURN_TIME = 30; // seconds
let currentCategory = 'default';

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  if (players.length < 2) {
    players.push(socket);
    socket.emit('message', { type: 'info', text: 'Waiting for another player...', name: playerNames[players.length - 1] });
    
    if (players.length === 2) {
      startGame();
    }
  } else {
    socket.emit('message', { type: 'info', text: 'Game is full. Please wait.' });
  }

  socket.on('setCategory', (category) => {
    if (wordCategories[category]) {
      currentCategory = category;
      // Tell both clients to update their dropdown
      players.forEach((player) => {
        player.emit('setCategory', category);
      });
    } else {
      currentCategory = 'default';
      players.forEach((player) => {
        player.emit('setCategory', 'default');
      });
    }
  });

  socket.on('passTurn', () => {
    if (timer) clearTimeout(timer);
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    startGame();
  });

  socket.on('passWord', () => {
    // Use the global category
    const words = wordCategories[currentCategory];
    currentWord = words[Math.floor(Math.random() * words.length)];
    const currentSocket = players[currentPlayerIndex];
    currentSocket.emit('message', {
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
  // Use the global category
  const words = wordCategories[currentCategory];
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
    io.emit('message', { type: 'timeout', loser: players[currentPlayerIndex].id });
    // Switch turn
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    startGame();
  }, TURN_TIME * 1000);
}

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// TV / Entertainment
const tvEntertainment = [
  'Friends', 'Breaking Bad', 'The Office', 'Game of Thrones', 'Netflix',
  'Reality TV', 'Oscars', 'SNL', 'Red Carpet', 'HBO', 'Disney+', 'Marvel',
  'Stranger Things', 'American Idol', 'The Bachelor', 'Sitcom', 'Streaming',
  'Talk Show', 'Soap Opera', 'Binge-Watching',
  'Jeopardy', 'Wheel of Fortune', 'The Simpsons', 'Family Guy', 'Survivor',
  'Big Brother', 'Late Night', 'The Mandalorian', 'The Crown', 'Peacock',
  'Hulu', 'YouTube', 'Commercial Break', 'Super Bowl Halftime', 'Soundtrack',
  'Cliffhanger', 'TV Remote', 'Game Show', 'Drama', 'Cartoon Network'
];

// History
const history = [
  'World War II', 'The Renaissance', 'Abraham Lincoln', 'The Cold War', 'Pyramids',
  'Cleopatra', 'The Great Depression', 'French Revolution', 'Founding Fathers',
  'Civil Rights Movement', 'Industrial Revolution', 'Titanic', 'Berlin Wall',
  'Julius Caesar', 'Gutenberg Press', 'Pearl Harbor', 'Napoleon', 'Moon Landing',
  'Vietnam War', 'Magna Carta', 'Stonehenge', 'Native Americans', 'Alexander the Great',
  'Martin Luther King Jr.', 'Columbus', 'Ancient Greece', 'Great Fire of London',
  'Prohibition', 'Suffrage', 'Invention of the Wheel', 'Roman Empire', 'The Black Plague',
  'Constitution', 'Boston Tea Party', 'Women’s Rights', 'Medieval Times', 'Cold War Spy',
  'Sputnik', 'Apollo 11'
];

// Geography
const geography = [
  'Amazon River', 'Mount Everest', 'The Sahara', 'Paris', 'Tokyo', 'Australia',
  'The Great Wall', 'Grand Canyon', 'Niagara Falls', 'Iceland', 'Equator',
  'Himalayas', 'New Zealand', 'Antarctica', 'Desert', 'Jungle', 'Island',
  'Peninsula', 'Great Lakes',
  'Pacific Ocean', 'Mississippi River', 'London', 'Mount Kilimanjaro', 'Great Barrier Reef',
  'Caribbean', 'Rocky Mountains', 'Rainforest', 'South Pole', 'Mediterranean',
  'North Pole', 'Andes', 'Death Valley', 'Gobi Desert', 'Greenland',
  'Arctic Circle', 'Siberia', 'Yosemite', 'Sahara Desert', 'Dubai'
];

// Things Around the House
const aroundTheHouse = [
  'Toaster', 'Remote Control', 'Sofa', 'Lamp', 'Blender', 'Pillow', 'Toilet Paper',
  'Microwave', 'Broom', 'Bathtub', 'Closet', 'Curtains', 'Fridge', 'Sink',
  'Shampoo', 'Mirror', 'Vacuum', 'Dishwasher',
  'Towel', 'Toothbrush', 'Bookshelf', 'Laundry Basket', 'TV', 'Chair', 'Table',
  'Rug', 'Fan', 'Iron', 'Mop', 'Candle', 'Doormat', 'Fireplace', 'Cupboard',
  'Window', 'Mattress', 'Nightstand', 'Alarm Clock', 'Trash Can'
];

// Food / Drink
const foodDrink = [
  'Pizza', 'Sushi', 'Spaghetti', 'Tacos', 'Ice Cream', 'Hot Dog', 'Cereal',
  'Coffee', 'Burger', 'Lemonade', 'Pancakes', 'Steak', 'Popcorn', 'Chili',
  'Burrito', 'Waffles', 'Cocktail', 'Margarita',
  'Salad', 'Nachos', 'Milkshake', 'French Fries', 'Orange Juice', 'Tea',
  'Cupcake', 'Bagel', 'Cheesecake', 'Ramen', 'Quesadilla', 'Croissant',
  'Turkey', 'Gravy', 'Smoothie', 'Bacon', 'Muffin', 'Ketchup', 'Mustard',
  'Pickles'
];

// Family
const family = [
  'Grandma', 'Uncle', 'Cousin', 'Baby', 'Mother-in-law', 'Sibling', 'Father',
  'Mom', 'Dad', 'Twins', 'Stepdad', 'Aunt', 'Niece', 'Nephew', 'Brother',
  'Sister', 'In-laws',
  'Stepmom', 'Godparent', 'Grandpa', 'Daughter', 'Son', 'Brother-in-law',
  'Sister-in-law', 'Partner', 'Husband', 'Wife', 'Parent', 'Family Reunion',
  'Household', 'Relatives', 'Great-Grandma', 'Adoption', 'Engagement',
  'Wedding', 'Newborn', 'Pregnant'
];

// Funny
const funny = [
  'Clown Car', 'Fart', 'Banana Peel', 'Toilet Explosion', 'Tickle Fight',
  'Whoopee Cushion', 'Dad Joke', 'Mullet', 'Sneezing Fit', 'Pogo Stick',
  'Burp Contest', 'Goose Chase', 'Spicy Poos', 'Clogging the Toilet', 'Lawn Gnome',
  'Sock Puppet',
  'Jelly Legs', 'Pants Falling Down', 'Fake Mustache', 'Belly Flop', 'Rubber Chicken',
  'Toilet Paper Shoe', 'Slippery Floor', 'Loud Snoring', 'Silly Dance', 'Snort Laugh',
  'Wet Sock', 'Fluffy Wig', 'Comedy Club', 'Chicken Dance', 'Mischievous Cat',
  'Spilled Milk', 'Hiccup Attack', 'Overcooked Spaghetti', 'Confetti Cannon',
  'Squeaky Shoes'
];

// Plants / Animals
const plantsAnimals = [
  'Cactus', 'Elephant', 'Pine Tree', 'Tiger', 'Koala', 'Goldfish', 'Tulip',
  'Rose', 'Sloth', 'Lion', 'Squirrel', 'Zebra', 'Dandelion', 'Crocodile',
  'Bamboo', 'Hedgehog', 'Otter',
  'Sunflower', 'Fern', 'Raccoon', 'Fox', 'Whale', 'Kangaroo', 'Pelican',
  'Lily', 'Octopus', 'Dolphin', 'Turtle', 'Bee', 'Penguin', 'Owl', 'Caterpillar',
  'Duck', 'Butterfly', 'Chameleon', 'Rabbit', 'Parrot'
];

// Tech / Inventions
const techInventions = [
  'Light Bulb', 'Smartphone', 'Airplane', 'Robot', 'Computer', 'Printer',
  'Microscope', 'Electric Car', 'Rocket', 'Wi-Fi', 'Television', 'Drone',
  'Camera', 'Headphones', 'GPS', 'Bluetooth', 'Smartwatch',
  'Laptop', 'Calculator', 'Vacuum Cleaner', 'Typewriter', 'Internet',
  'Telegraph', 'Telescope', 'Refrigerator', 'Microwave Oven', '3D Printer',
  'USB Drive', 'Touchscreen', 'Electric Guitar', 'Speaker', 'Keyboard',
  'Game Console', 'Flashlight', 'Battery', 'Jet Engine', 'Elevator'
];

// Sports / Games
const sportsGames = [
  'Soccer', 'Football', 'Basketball', 'Chess', 'Tennis', 'Ping Pong', 'Baseball',
  'Golf', 'Video Games', 'Poker', 'Tag', 'Hide and Seek', 'Volleyball', 'Hockey',
  'Bowling', 'Dodgeball', 'Board Games',
  'Wrestling', 'Running', 'Track and Field', 'Softball', 'Checkers', 'Charades',
  'Cornhole', 'Kickball', 'Jenga', 'Uno', 'Pictionary', 'Marathon', 'Olympics',
  'Darts', 'Pool', 'Boxing', 'Fencing', 'Lacrosse', 'Skating', 'Tabletop Games'
];

// Transportation
const transportation = [
  'Airplane', 'Bicycle', 'Bus', 'Train', 'Subway', 'Scooter', 'Taxi', 'Car',
  'Helicopter', 'Skateboard', 'Rollerblades', 'Hot Air Balloon', 'Tram', 'Sled',
  'Ferry', 'Motorcycle', 'Jet Ski',
  'Segway', 'Canoe', 'Horse', 'Camel', 'Spaceship', 'Golf Cart', 'Rickshaw',
  'Hoverboard', 'Monorail', 'Cruise Ship', 'Rocket', 'Station Wagon', 'Pickup Truck',
  'Racecar', 'Airboat', 'Dog Sled', 'Skis', 'Cable Car', 'Zeppelin', 'Submarine'
];

// NSFW (Adult / Dirty / Silly)
const nsfw = [
  'Butt Dial', 'One-Night Stand', 'Morning Wood', 'Nude Beach', 'Drunk Text',
  'Sex on the Beach', 'Thong', 'Walk of Shame', 'Crotchless Underwear', 'Dirty Talk',
  'Handcuffs', 'Strip Club', 'Lap Dance', 'Safe Word', 'Role Play', 'Lube',
  'Fuzzy Handcuffs', 'Latex', 'Booty Call', 'Pole Dancing',

  'Poop Emoji', 'Public Bathroom', 'Explosive Diarrhea', 'Skid Marks', 'Fart in Yoga Class',
  'Poop Knife', 'Taco Bell Regret', 'Clogged Toilet', 'Silent But Deadly', 'Number Two',
  'Bidet', 'Dingleberry', 'Wet Fart', 'Toilet Humor', 'Gas Station Bathroom', 'Blumpkin',

  'Moaning', '69', 'NSFW Email', 'Nipple Slip', 'Tinder Date', 'Netflix and Chill',
  'OnlyFans', 'Lubed Up', 'Pillow Talk', 'Naughty Nurse', 'Latex Suit', 'Foot Fetish',
  'Sexting', 'Peeping Tom', 'Eggplant Emoji', 'Sweaty Sheets', 'Backdoor Entry',
  'BDSM', 'Mile High Club', 'Strip Poker'
];

// All Categories Combined
const all = [
  ...tvEntertainment,
  ...history,
  ...geography,
  ...aroundTheHouse,
  ...foodDrink,
  ...family,
  ...funny,
  ...plantsAnimals,
  ...techInventions,
  ...sportsGames,
  ...transportation
];

let players = [];
const playerNames = ['Nate', 'Courtney'];
let currentWord = '';
let currentPlayerIndex = 0;
let timer = null;
const TURN_TIME = 30; // seconds
let gameActive = false;
let currentCategory = 'all';
let words = all; // Default to all categories

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
    // Set the words array based on the selected category
    switch (category) {
      case 'tvEntertainment':
        words = tvEntertainment;
        break;
      case 'history':
        words = history;
        break;
      case 'geography':
        words = geography;
        break;
      case 'aroundTheHouse':
        words = aroundTheHouse;
        break;
      case 'foodDrink':
        words = foodDrink;
        break;
      case 'family':
        words = family;
        break;
      case 'funny':
        words = funny;
        break;
      case 'plantsAnimals':
        words = plantsAnimals;
        break;
      case 'techInventions':
        words = techInventions;
        break;
      case 'sportsGames':
        words = sportsGames;
        break;
      case 'transportation':
        words = transportation;
        break;
      case 'nsfw':
        words = nsfw;
        break;
      case 'all':
      default:
        words = all;
        break;
    }
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

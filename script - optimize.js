// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,

  gameBoardDisplay: null,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,

  preSelected:null,
  checkMatching: null,
  gameOver: true,

  totalCards: 0,
  clearedCards: 0
};


setGame();

/*******************************************
/     game process
/******************************************/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function generateCards() {
  const gameSize = game.level * 2;
  const totalCards = gameSize * gameSize;
  game.totalCards = totalCards;
  game.gameBoardDisplay.style['grid-template-columns'] = `repeat(${gameSize},1fr)`;

  let cards = [];
  //generate random cards
  CARD_TECHS_shuffled = shuffle(CARD_TECHS);

  for (i=0; i<totalCards / 2; i++) {
    const tech = CARD_TECHS_shuffled[i % CARD_TECHS.length];
    const card = createCardElement(tech);
    cards.push(card);
    cards.unshift(card.cloneNode(true));
  }
  cards = shuffle(cards);
  for (i=0; i<cards.length; i++) {
    game.gameBoardDisplay.appendChild(cards[i]);
  }
}

function createCardElement(tech) {

  const node = document.createElement('div');
  const cardfront = document.createElement('div');
  const cardback = document.createElement('div');

  cardfront.classList.add('card__face', 'card__face--front');
  cardback.classList.add('card__face', 'card__face--back');
  node.classList.add('card',tech);
  node.dataset.tech = tech;


  node.appendChild(cardfront);
  node.appendChild(cardback);
  return node;
}

function clearGameBoard() {

  while(game.gameBoardDisplay.firstChild) {
    game.gameBoardDisplay.removeChild(game.gameBoardDisplay.firstChild);
  }

}


function setGame() {
  // register any element in your game object
  game.gameBoardDisplay = document.querySelector('.game-board');
  game.timerDisplay = document.querySelector('.game-timer__bar');
  game.scoreDisplay = document.querySelector('.game-stats__score--value');
  game.levelDisplay = document.querySelector('.game-stats__level--value');
  game.startButton = document.querySelector('.game-stats__button');

  bindStartButton();
}

function startGame() {
  clearGameBoard();
  game.startButton.innerHTML = `End Game`; 

  //initialization
  game.checkMatching = false;
  game.clearedCards = 0;
  game.level = 1;
  game.gameOver = false;
  game.score = 0;
  game.preSelected = null;
  game.totalCards = 0;
  game.clearedCards = 0;
  generateCards();
  bindCardClick();
  game.levelDisplay.innerHTML = game.level;
  game.scoreDisplay.innerHTML = game.score;

  startTimer();
}

function handleCardFlip() {
  var cards = document.querySelectorAll('.card');
  //no preSelected flip
  if (!game.preSelected) {
    this.classList.add('card--flipped');
    game.preSelected = this;
    return;
  } else {
    //there is preSelected card
    //click on the same card again
    if (this === game.preSelected) {
      this.classList.remove('card--flipped');
      game.preSelected = null;
      return;
    } else{
      //click on a different card compare
      this.classList.add('card--flipped');
      //match
      if (game.preSelected.dataset.tech === this.dataset.tech) {
        unBindCardClick(game.preSelected);
        unBindCardClick(this);
        game.preSelected = null;
        game.clearedCards +=2;
        updateScore();

        if (game.clearedCards === game.totalCards) {
          setTimeout(() => {
            nextLevel();
          }, 1000);
        }

      } else {
        //not match
        cards.forEach(card => {unBindCardClick(card);});
        setTimeout(() => {
          game.preSelected.classList.remove('card--flipped');
          this.classList.remove('card--flipped');
          game.preSelected = null;
          if (game.startButton.innerHTML === `End Game`) {
            bindCardClick();
          }
        },1000);

      }
      
    }
  }
}


function nextLevel() {
  clearGameBoard();

  //initialization
  game.level++;
  game.levelDisplay.innerHTML = game.level;
  game.clearedCards = 0;
  game.totalCards = 0; 

  generateCards();
  bindCardClick();
  startTimer();
}

function handleGameOver() {
  game.gameOver = true;
  clearInterval(game.timerInterval);
  const cards = document.querySelectorAll('.card');
  cards.forEach(card=>{
    unBindCardClick(card);
  });
  alert(`GAME OVER. Your score is ${game.score}`);
  game.startButton.innerHTML = `Start Game`; 

}

function startTimer() {
  if (game.timerInterval) {
    stopTimer();
  }
  game.timer = 60;
  updateTimerDisplay();
  game.timerInterval = setInterval(() => {
    game.timer --;
    updateTimerDisplay();
    if (game.timer === 0) {
      handleGameOver();
    }
  },1000);
}

function stopTimer() {
  clearInterval(game.timerInterval);
  game.timerInterval = null;
}
/*******************************************
/     UI update
/******************************************/
function updateScore() {
  game.score += game.level * game.timer;
  game.scoreDisplay.innerHTML = game.score; 
}

function updateTimerDisplay() {
    game.timerDisplay.innerHTML = `${game.timer}s`;
    game.timerDisplay.style.width = `${game.timer*100/60}%`;
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton.addEventListener('click', () => {
    if (game.gameOver) {
      startGame();
    } else {
      handleGameOver();
    }
  });
}

function unBindCardClick(card) {
  card.removeEventListener('click', handleCardFlip);
}

function bindCardClick() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card=>{
    card.addEventListener('click', handleCardFlip);
  });
}

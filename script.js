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
  timerDisplay: null,//seconds
  scoreDisplay: null,//update score
  // levelDisplay: null,
  timerInterval: null,//setIneterval
  startButton: null,

  preSelected:null,//card
  preScore:0, //score from last level
  cardArray: []
};

game.startButton = document.getElementsByClassName('game-stats__button')[0];
bindStartButton();

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

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function setGame() {
  // register any element in your game object

  //generate random cards
  CARD_TECHS_shuffled = shuffle(CARD_TECHS);

  // duplicate cards in the array
  CARD_TECHS_doubled = CARD_TECHS_shuffled.reduce(function (res, current, index, array) {
    return res.concat([current, current]);
  }, []);

  CARD_TECHS_doubled = CARD_TECHS_doubled.concat(CARD_TECHS_doubled);

  //choose first 2 elements & shuffle the chosen cards
  game.cardArray = CARD_TECHS_doubled.slice(0,Math.pow(game.level*2, 2));
  game.cardArray = shuffle (game.cardArray);

  //create new div for the cards

  const cards = {};
  for (x=0; x<game.cardArray.length; x++) {
    cards[x] = document.createElement('div');
    setAttributes(cards[x],{'class':`card ${game.cardArray[x]}`,'data-tech':game.cardArray[x]}); 
  }

  //add card div to game board
  const gameBoardDisplay = document.querySelector('.game-board');
  if (game.level === 1) {
    gameBoardDisplay.style = "grid-template-columns: 1fr 1fr";
  } else if (game.level === 2) {
    gameBoardDisplay.style = "grid-template-columns: 1fr 1fr 1fr 1fr";
  } else if (game.level === 3) {
    gameBoardDisplay.style = "grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr";
  }


  while(gameBoardDisplay.firstChild) {
    gameBoardDisplay.removeChild(gameBoardDisplay.firstChild);
  }

  for (x=0; x<game.cardArray.length; x++) {
    gameBoardDisplay.appendChild(cards[x]);
  }

  //add two side div to each card
  const parentObj = document.getElementsByClassName('card');
  const cardfront = document.createElement('div');
  cardfront.setAttribute('class','card__face card__face--front');
  const cardback = document.createElement('div');
  cardback.setAttribute('class','card__face card__face--back');
  [...parentObj].forEach( (parent)=> {
    parent.appendChild(cardfront.cloneNode());
    parent.appendChild(cardback.cloneNode());
  });

  //New game button change to end game button
  game.startButton.innerHTML = `End Game`; 
  bindStartButton();

  startGame();
}

function startGame() {
  //initialization
  if(game.timerInterval) {
    clearInterval(game.timerInterval);
  }

  document.getElementsByClassName('game-stats__level--value')[0].innerHTML = `${game.level}`; 
  document.getElementsByClassName('game-stats__score--value')[0].innerHTML = `${game.preScore}`; 
  game.scoreDisplay = game.preScore;

  document.getElementsByClassName('game-timer__bar')[0].innerHTML = `${game.timer}s`;
  document.getElementsByClassName('game-timer__bar')[0].style.width = `100%`;
  game.timerDisplay = game.timer;
  game.timerInterval = null;
  game.preSelected = null;

  bindCardClick();

  updateTimerDisplay();
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
        updateScore();

        var i=0;
        cards.forEach(card =>{ 
          if(card.classList.contains('card--flipped')){
            i++;
            if (i===game.cardArray.length){
              setTimeout(() => {
                nextLevel();
              }, 1000);

            }
          } 
        });


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
  //initialization
  game.preScore = game.scoreDisplay;
  game.level++;
  document.getElementsByClassName('game-stats__level--value')[0].innerHTML = `${game.level}`; 

  setGame();
}

function handleGameOver() {
  clearInterval(game.timerInterval);
  const cards = document.querySelectorAll('.card');
  cards.forEach(card=>{
    unBindCardClick(card);
  });
  alert(`GAME OVER. Your score is ${game.scoreDisplay}`);
  game.startButton.innerHTML = `Start Game`; 
  bindStartButton();

  //reset level and score
  game.preScore = 0;
  game.level = 1;

}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  game.scoreDisplay += game.timerDisplay;
  document.getElementsByClassName('game-stats__score--value')[0].innerHTML = `${game.scoreDisplay}`; 
}

function updateTimerDisplay() {
  // const startTime = new Date().getTime()+game.timer*1000;

  // game.timerInterval = setInterval(() => {
  //   const currentTime = new Date().getTime();
  //   const distance = startTime - currentTime;
  //   game.timerDisplay = Math.floor((distance % (1000 * 60)) / 1000);
  //   document.getElementsByClassName('game-timer__bar')[0].innerHTML = `${game.timerDisplay} s`;
  //   document.getElementsByClassName('game-timer__bar')[0].style.width = `${game.timerDisplay*100/60}%`;
  //   if (distance<0){
  //     handleGameOver();
  //   }
  // }, 1000);

  // game.timerDisplay = game.timer;
  game.timerInterval = setInterval(() => {
    game.timerDisplay--;
    document.getElementsByClassName('game-timer__bar')[0].innerHTML = `${game.timerDisplay}s`;
    document.getElementsByClassName('game-timer__bar')[0].style.width = `${game.timerDisplay*100/60}%`;
    if (game.timerDisplay <1){
      handleGameOver();
    }
  }, 1000);

}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  if (game.startButton.innerHTML === `End Game`){
    game.startButton.removeEventListener('click', setGame);
    game.startButton.addEventListener('click', handleGameOver);
  } else {
    game.startButton.removeEventListener('click', handleGameOver);
    game.startButton.addEventListener('click', setGame);
  }
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

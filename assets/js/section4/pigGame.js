let scores = [0,0];
let current = 0;
let player = 0;
let goal = 100;

function rollDice() {
  let dice = Math.floor(Math.random() * 6)+1;
  return dice
}

function resetGame() {
  removeActive();
  scores = [0,0];
  current = 0;
  player = 0;

  resetScore();
  addActive();

  document.querySelector('.done').remove();
}

function updateCurrentScore(score) {
  let counter = document.querySelector(`.current${player} p`);
  counter.innerHTML = current;
}
function currentScore(currentScore) {
  if (currentScore === 1) {
    current = 0;
    updateCurrentScore(current);
    hold(current);
  }
  else
    current += currentScore;

  updateCurrentScore(current);
  console.log(current);
}

function removeActive() {
  activePlayer = document.querySelector(`.player${player}`)
  activePlayer.className = `player player${player}`;
  console.log(activePlayer);
}

function addActive() {
  activePlayer = document.querySelector(`.player${player}`)
  activePlayer.className = `player player${player} active`;
  console.log(activePlayer);
}

function changePlayer(activePlayer) {
  switch (activePlayer) {
    case 0:
      removeActive();
      player = 1;
      addActive();
      break;
    case 1:
      removeActive();
      player = 0;
      addActive();
      break;
  };
}
function resetScore() {
  playerOne = document.querySelector(`.score0`);
  playerOne.innerHTML = '0';
  playerOne = document.querySelector(`.score1`);
  playerOne.innerHTML = '0';
}
function setScore() {
  target = document.querySelector(`.score${player}`);
  target.innerHTML = scores[player];
  console.log(scores[player]);
}

function checkWinner() {
  if (scores[player] >= goal) {
    createDoneScreen();
  };
}

function createDoneScreen() {
  let done = document.createElement('div');
  done.setAttribute('class','done');
  done.innerHTML = `Player ${player+1} is the winner with ${scores[player]} point.
  Good Game.`;
  document.body.appendChild(done);
  console.log('Game is done');
}

function hold(score){
  scores[player] += score;
  setScore();
  current = 0;
  updateCurrentScore(current);
  checkWinner();
  changePlayer(player);
  return current;
}

function setDice(dice) {
  let target = document.querySelector('.dice')

  switch (dice) {
    case 1:
      target.className = 'dice one'
      break;
    case 2:
      target.className = 'dice two'
      break;
    case 3:
      target.className = 'dice three'
      break;
    case 4:
      target.className = 'dice four'
      break;
    case 5:
      target.className = 'dice five'
      break;
    case 6:
      target.className = 'dice six'
      break;
  }

  console.log(target.className);
  currentScore(dice);
}

function showSettings() {
  let settings = document.querySelector('.settings');
  settings.className = "settings open"

  let settingsButton = document.querySelector('.settingsButton');
  settingsButton.className = 'settingsButton close'
}

function closeSettings() {
  let settings = document.querySelector('.settings');
  settings.className = "settings close"

  let settingsButton = document.querySelector('.settingsButton');
  settingsButton.className = 'settingsButton open'
}

function setDefault() {
  let oneName = document.getElementById('playerOneName').value;
  let twoName = document.getElementById('playerTwoName').value;
  let newGoal = document.getElementById('goal').value;

  let playerOne = document.querySelector('.nameOne');
  let playerTwo = document.querySelector('.nameTwo');

  if (oneName != '')
    playerOne.innerHTML = oneName;
  if (twoName != '')
    playerTwo.innerHTML = twoName;
  if (newGoal != "")
    goal = newGoal;

  closeSettings();
}

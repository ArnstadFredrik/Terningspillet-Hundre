let scores = [];
let current;
let player;
let goal;

let oneName;
let twoName;

const game = {
  domElement: {
    playerOneName: document.getElementById('player0Name').value,
    playerOneField: document.getElementById('player0Name'),
    playerTwoName: document.getElementById('player1Name').value,
    playerTwoField: document.getElementById('player1Name'),
    scoreBoardNameOne: document.querySelector('.nameOne'),
    scoreBoardNameTwo: document.querySelector('.nameTwo'),
    menu: document.querySelector('.menu'),
    player0: document.querySelector('.player0'),
    player1: document.querySelector('.player1'),
    newGoal: document.getElementById('goal'),
    welcome: document.getElementById('welcome'),
  },
}

function welcomeScreen(){
  let welcome = document.createElement('div');
  welcome.setAttribute('id','welcome');
  paragraph = document.createElement('p');
  welcome.innerHTML = `<h3>Terningsspillet</h3>
    <p>Det er om å gjøre å bli førstemann til <strong>100 poeng</strong></p>
    <p>Du kan trille så mange ganger du vil pr runde, men poengene må <span>«beholdes»</span></p>
    <p>Triller du <strong>1</strong> så mister du denne rundens poeng.</p>
    <p>Navn på spillere og poenggrense kan endres i innstillengene nederst på siden.</p>`;

  h = document.createElement('h2');
  pOne = document.createElement('p');
  pTwo = document.createElement('p');

  hContent = document.createTextNode('');
  pOneContent = document.createTextNode('');
  pTwoContetn = document.createTextNode('');

  let closeBtn = document.createElement('button');
  closeBtn.innerHTML = 'Lukk';
  closeBtn.setAttribute('onClick','removeWelcomeScreen()');

  welcome.appendChild(closeBtn);

  document.body.appendChild(welcome);
}
function removeWelcomeScreen() {
  document.getElementById('welcome').remove();
}

if(localStorage.length === 0) {
  welcomeScreen();
  scores = [0,0];
  current = 0;
  player = 0;
  goal = 100;
  visited = true;


  if (game.domElement.playerOneName == '') oneName = 'Spiller 1';
  else oneName = game.domElement.playerOneName;

  if(game.domElement.playerTwoName == '') twoName = 'Spiller 2';
  else twoName = game.domElement.playerTwoName;


  storeLocaly();
  setValues();
  initGame();
}
else{
  if(!localStorage.visited) {
    welcomeScreen();
    localStorage.setItem('visited',true);
  };
  setValues();
  initGame();
}


pushDefault();
//saveSetting();

function storeLocaly() {
  localStorage.setItem('scores',scores);
  localStorage.setItem('current',current);
  localStorage.setItem('player',player);
  localStorage.setItem('goal',goal);
  localStorage.setItem('oneName',oneName);
  localStorage.setItem('twoName',twoName);
  localStorage.setItem('visited', true);
}
function setValues() {
  tempScores = localStorage.getItem('scores');
  current = Number(localStorage.getItem('current'));
  player = Number(localStorage.getItem('player'));
  goal = Number(localStorage.getItem('goal'));
  oneName = localStorage.getItem('oneName');
  twoName = localStorage.getItem('twoName');

  tempScores = tempScores.split(',')
  scores.length = 0;

  for (let num of tempScores)
    scores.push(Number(num));

  playerOne = document.querySelector('.nameOne');
  playerTwo = document.querySelector('.nameTwo');

  playerOne.innerHTML = oneName;
  playerTwo.innerHTML = twoName;

  visited = localStorage.getItem('visited');

  return scores,current,player,goal,oneName,twoName;
}

function debug() {
  scores = [43,92];
  setScore();
  changePlayer(player);
  setScore();
  changePlayer(player);
}

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
  storeLocaly();
}

function initGame(){
  updateCurrentScore(current);

  target = document.querySelector(`.score0`);
  target.innerHTML = scores[0];

  target = document.querySelector(`.score1`);
  target.innerHTML = scores[1];

  game.domElement.menu.className = `menu menu${player}`;
  game.domElement.player0.classList.remove('active');
  game.domElement.player0.classList.add('passive');
  game.domElement.player1.classList.remove('active');
  game.domElement.player1.classList.add('passive');

  if (player === 0) {
    game.domElement.player0.classList.add('active');
    game.domElement.player0.classList.remove('passive');
  } else {
    game.domElement.player1.classList.add('active');
    game.domElement.player1.classList.remove('passive');
  }
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
  else {
    current += currentScore;
    updateCurrentScore(current);
  }
  storeLocaly();
}

function removeActive() {
  activePlayer = document.querySelector(`.player${player}`)
  activePlayer.className = `player player${player} passive`;

  activeMenu = document.querySelector(`.menu${player}`)
  activeMenu.className = `menu`;

  console.log(activePlayer);
}

function addActive() {
  activePlayer = document.querySelector(`.player${player}`)
  activePlayer.className = `player player${player} active`;

  activeMenu = document.querySelector(`.menu`)
  activeMenu.className = `menu menu${player}`;

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
  let winner = document.getElementById(`player${player}Name`).value

  if (winner == '')
    winner = `Spiller ${player+1}`

  done.setAttribute('class',`done done${player}`);
  done.innerHTML = `Gratulerer ${winner}. Du vant med ${scores[player]} poeng.`;
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
  storeLocaly();
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

function pushDefault() {
  game.domElement.newGoal.setAttribute('value',`${goal}`);
  game.domElement.playerOneField.setAttribute('value',`${oneName}`);
  game.domElement.playerTwoField.setAttribute('value',`${twoName}`);
}

function saveSetting() {
  oneName = document.getElementById(`player0Name`).value;
  twoName = document.getElementById(`player1Name`).value;
  newGoal = document.getElementById('goal').value;

  // storing user set newGoal back to games goal variable
  goal = newGoal;

  game.domElement.scoreBoardNameOne.innerHTML = oneName;
  game.domElement.scoreBoardNameTwo.innerHTML = twoName;

  localStorage.setItem('oneName',oneName);
  localStorage.setItem('twoName',twoName);
  localStorage.setItem('goal',goal);

  closeSettings();

}

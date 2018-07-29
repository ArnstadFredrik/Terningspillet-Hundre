//terningspill
window.addEventListener('load', e => {
  if('serviceWorker' in window.navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log('sw reg sucsess');
    } catch (e) {
      console.log('sw reg failed');
    }
  };
});
document.addEventListener('DOMContentLoaded',smsLink);

let scores = [];
let throws = [];
let current;
let player;
let goal;
let isDone;
let gameMode;
let gameDiff;

let oneName;
let twoName;
let tmpPlayerTwo;

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}
const isAndroid = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

function smsLink() {
  let href = '';
  let header = 'sms:'
  let message = `Prøv terningspillet hundre,
  http://arnstad.gitlab.io/terningspill/`;
  let element = document.querySelector('.smsLink');

  if(isIos()){
    href = header + '&body=' + message;
    element.setAttribute('href',href);
  }
  if(isAndroid()){
    href = header + '?body=' + message;
    element.setAttribute('href',href);
  }
}

const isInStandaloneMode = () => {
  return window.navigator.standalone;
};

if(isIos() && !isInStandaloneMode()) {
  console.log('need to install web app');
  let installBanner = document.createElement('div')
  installBanner.setAttribute('class','banner installBanner closeButton');
  installBanner.innerHTML = `
  <p>Du kan lagre dette spillet på telefonen.</br>
  Trykk <span class="share"></span>, deretter <span class="addToHomeScreen">«Legg til på Hjem-skjerm»</span>
  </p>
  `;

  document.body.appendChild(installBanner);

  const bannerElement = document.querySelector('.installBanner');
  bannerElement.addEventListener('click', e => {bannerElement.classList.add('animateDown');});

  setTimeout(()=> {
    bannerElement.classList.add('animateDown');
  },10000);

}


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
    checkbox: document.querySelector('.checkbox'),
    diceElement: document.querySelector('.dice'),
    diff: document.getElementById('gameDiff'),
  },
}

function welcomeScreen(){
  let welcome = document.createElement('div');
  welcome.setAttribute('id','welcome');
  welcome.setAttribute('class','banner');
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
  throws = [0,0];
  current = 0;
  player = 0;
  goal = 100;
  visited = true;
  isDone = false;
  gameMode = 0;
  gameDiff = 1;


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
  storeLocaly();
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
  localStorage.setItem('isDone',isDone);
  localStorage.setItem('gameMode',gameMode);
  localStorage.setItem('tmpPlayerTwo',tmpPlayerTwo);
  localStorage.setItem('throws',throws);
  localStorage.setItem('gameDiff',gameDiff);
}
function setValues() {
  tempScores = localStorage.getItem('scores');
  current = Number(localStorage.getItem('current'));
  player = Number(localStorage.getItem('player'));
  goal = Number(localStorage.getItem('goal'));
  oneName = localStorage.getItem('oneName');
  twoName = localStorage.getItem('twoName');
  tempThrows = localStorage.getItem('throws');

  if(tempThrows == null)
    tempThrows = [0,0];
  else {
    //extracting throws from string
    tempThrows = tempThrows.split(',');
    throws.length = 0;

    for (let num of tempThrows)
    throws.push(Number(num));
  }

  // extracting scores from string
  tempScores = tempScores.split(',');
  scores.length = 0;

  for (let num of tempScores)
    scores.push(Number(num));


  playerOne = document.querySelector('.nameOne');
  playerTwo = document.querySelector('.nameTwo');

  playerOne.innerHTML = oneName;
  playerTwo.innerHTML = twoName;

  visited = localStorage.getItem('visited');

  isDone = localStorage.getItem('isDone');
  if (isDone === 'false') isDone = false;
  else isDone = true;

  gameMode = Number(localStorage.getItem('gameMode'));

  if(tmpPlayerTwo === undefined && twoName != "Data Daniel") {
    tmpPlayerTwo = twoName;
    localStorage.setItem('tmpPlayerTwo',twoName);
  }
  else tmpPlayerTwo = localStorage.getItem('tmpPlayerTwo');

  gameDiff = Number(localStorage.getItem('gameDiff'));
  console.log(gameDiff);

  return scores,current,player,goal,oneName,twoName, visited, isDone, gameMode,tmpPlayerTwo, gameDiff;
}

function debug() {
  scores = [70,50];
  setScore();
  changePlayer(player);
  setScore();
  changePlayer(player);
}

function rollDice() {
  let dice = Math.floor(Math.random() * 6)+1;
  return dice
}

function resetGame(isOver) {
  if(isOver === true) {

    removeActive();

    scores = [0,0];
    throws = [0,0];
    current = 0;
    player = 0;
    isDone = false;

    resetScore();
    addActive();
    updateCurrentScore();

    let doneScreen = document.querySelector('.done');
    if (doneScreen) doneScreen.remove();
    let approveScreen = document.getElementById('approve');
    if (approveScreen) approveScreen.remove();
    const menu = document.querySelector('.settingsButton');

    storeLocaly();

  } else {
    let approveWindow = document.createElement('div');
    approveWindow.setAttribute('id','approve');
    approveWindow.setAttribute('class','banner');
    approveWindow.innerHTML = `
    <p>Vil du starte på nytt?</p>
    <button onClick="resetGame(true);toggleMenu();">Ja</button>
    <button onClick="document.getElementById('approve').remove();">Nei</button>
    `;
    document.body.appendChild(approveWindow);
  };

}

function initGame(){
  updateCurrentScore(current);

  target = document.querySelector(`.score0`);
  target.innerHTML = scores[0];

  target = document.querySelector(`.score1`);
  target.innerHTML = scores[1];

  game.domElement.diceElement.classList.add(`menu${player}`);
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

  if(gameMode === 1) {
    setTimeout(()=>{
      game.domElement.playerTwoField.style = 'display:none;';
      game.domElement.diff.style = 'display:grid;';
      game.domElement.diff.classList.add('diffIn');
    },500);
  }
  if(gameMode === 0) {
    setTimeout(()=>{
      game.domElement.diff.style = 'display:none;';
      game.domElement.diff.classList.add('diffOut');
    })
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
  //remove active player .active class
  activePlayer = document.querySelector(`.player${player}`)
  activePlayer.classList.remove(`active`);
  activePlayer.classList.add(`passive`);

  //remove active player menu/dice
  activeDice = document.querySelector(`.dice`)
  activeDice.classList.remove(`menu${player}`);
}

function addActive() {
  activePlayer = document.querySelector(`.player${player}`)
  activePlayer.classList.add(`active`);
  activePlayer.classList.remove(`passive`);

  activeDice = document.querySelector(`.dice`);
  activeDice.classList.add(`menu${player}`);
}

function changePlayer(activePlayer) {
  switch (activePlayer) {
    case 0:
      removeActive();
      player = 1;
      console.log(' ');
      console.log('---------------------------------');
      console.log(`Player ${player+1} is now playing`);
      addActive();
      break;
    case 1:
      removeActive();
      player = 0;
      console.log(' ');
      console.log('---------------------------------');
      console.log(`Player ${player+1} is now playing`);
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
  console.log('setting score for player:',player + 1,scores[player]);
}

function checkWinner() {
  if (scores[player] >= goal) {
    createDoneScreen();
    isDone = true;
  };
}

function createDoneScreen() {
  let done = document.createElement('div');
  let winner = document.getElementById(`player${player}Name`).value
  done.setAttribute('class',`done done${player}`);

  if(gameMode === 1 && player === 1) {
    done.innerHTML = `
    <p>Beklager, du tapte mot <strong>${winner}.</strong>
    </br>som vant du med <strong>${scores[player]} poeng.</strong>
    </br>mot dine <strong>${scores[0]} poeng.</strong></p>
    <p>Revansje?</p>
    <button onClick="resetGame(true)">Nytt spill</button>`;
    document.body.appendChild(done);
    console.log('Game is done');
    return
  }
  done.innerHTML = `
  <p>Gratulerer <strong>${winner}.</strong>
  </br>Du trillte <strong>${throws[player]}</strong> ganger
  </br>og vant du med <strong>${scores[player]} poeng.</strong></p>
  <button onClick="resetGame(true)">Nytt spill</button>`;
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
    if(gameMode === 1 && player === 1 && isDone === false) {
      console.log('ai, data spiller');
      return ai();
    }
    if(gameMode === 1 && player === 0 && isDone === false)
      return;
}

function setDice(dice) {
  throws[player]++;
  let target = document.querySelector('.dice')

  switch (dice) {
    case 1:
    target.className = `menu${player} dice one`
    break;
    case 2:
    target.className = `menu${player} dice two`
    break;
    case 3:
    target.className = `menu${player} dice three`
    break;
    case 4:
    target.className = `menu${player} dice four`
    break;
    case 5:
    target.className = `menu${player} dice five`
    break;
    case 6:
    target.className = `menu${player} dice six`
    break;
  }

  console.log('du trillte,',dice);
  currentScore(dice);
}

function showSettings() {
  let settings = document.querySelector('.settings');
  settings.classList.add('animateUpSettings');
}

function closeSettings() {
  let settings = document.querySelector('.settings');
  settings.classList.remove('animateUpSettings');
  settings.classList.add('animateDownSettings');
  toggleMenu();
  setTimeout(()=>{
    settings.classList.remove('animateDownSettings');
  },500);
}

function pushDefault() {
  game.domElement.newGoal.setAttribute('value',`${goal}`);
  game.domElement.playerOneField.setAttribute('value',`${oneName}`);
  game.domElement.playerTwoField.setAttribute('value',`${twoName}`);

  if(gameMode === 1) {
    game.domElement.checkbox.classList.add('checked');
  }

  if(gameDiff === 0) {
    document.querySelector('.easy').classList.add('checked');
  }
  else if(gameDiff === 1){
    document.querySelector('.medium').classList.add('checked');
  }
  else if(gameDiff === 2){
    document.querySelector('.hard').classList.add('checked');
  }

}

function saveSetting() {
  oneName = document.getElementById(`player0Name`).value || 'spiller 1';
  twoName = document.getElementById(`player1Name`).value || 'spiller 2';
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

function ai(){
  if(gameDiff === 0) { // EASY
    let temp = Math.round((Math.random() * (4 - 3+1) + 3));
    console.log('-------------------------------------');
    console.log('EASY - ai random goal',temp);

    while (player === 1 && current < temp ) {
      setDice(rollDice());
      console.log('current',current);
    };
    if(player === 1)
      return hold(current);
  }
  if (gameDiff === 1){ // MEDIUM
    let temp = Math.round((Math.random() * (23 - 6+1) + 6));
    console.log('-------------------------------------');
    console.log('MEDIUM - ai random goal',temp);

    while (player === 1 && current < temp ) {
      setDice(rollDice());
      console.log('current',current);
    };
    if(player === 1)
      return hold(current);
  }
  if(gameDiff === 2){ // HARD
    let temp = Math.round((Math.random() * (23 - 18+1) + 18));
    console.log('-------------------------------------');
    console.log('HARD - ai random goal',temp);

    while (player === 1 && current < temp) {
      setDice(rollDice());
      console.log('current',current);
    };
    if(player === 1)
      return hold(current);
  }
}

function toggleGameMode() {
  gameModeCheckbox = document.querySelector('.checkbox');
  gameModeCheckbox.classList.toggle('checked');
  const renderedHeight = game.domElement.playerOneField.clientHeight;

  if(gameDiff === undefined) gameDiff = 1;

  if(gameModeCheckbox.classList.contains('checked')) {
    tmpPlayerTwo = document.getElementById('player1Name').value;
    localStorage.setItem('tmpPlayerTwo',tmpPlayerTwo);

    gameMode = 1;
    game.domElement.playerTwoField.classList.add('animateOut');

    //Difficulty
    game.domElement.diff.style = `display:grid; position:absolute; height:${renderedHeight}px;`;
    game.domElement.diff.classList.remove('diffOut');
    game.domElement.diff.classList.add('diffIn');

    setTimeout(()=>{
      game.domElement.diff.style = 'position:relative;';
      game.domElement.playerTwoField.style = 'display:none;';
      game.domElement.playerTwoField.classList.remove('animateOut');
      document.getElementById('player1Name').value = 'Data Daniel';
      localStorage.setItem('twoName','Data Daniel');
    },500);
  }
  else if(!gameModeCheckbox.classList.contains('checked')){
    document.getElementById('player1Name').value = tmpPlayerTwo;
    gameMode = 0;

    //Difficulty
    game.domElement.diff.style = `display:grid; position:absolute; height:${renderedHeight}px;`;
    game.domElement.diff.classList.remove('diffIn');
    game.domElement.diff.classList.add('diffOut');

    game.domElement.playerTwoField.style = 'display:block;';
    game.domElement.playerTwoField.classList.add('animateIn');
    setTimeout(()=>{
      game.domElement.playerTwoField.classList.remove('animateIn');
      localStorage.setItem('twoName',tmpPlayerTwo);
      game.domElement.diff.style = 'display:none;';
    },500);
  };
  storeLocaly();
}

const el = document.querySelector('.checkbox');
el.addEventListener('click',toggleGameMode);

function toggleEasy() {
  gameDiff = 0;
  localStorage.setItem('gameDiff',gameDiff);

  let diffs = document.querySelectorAll('.diff');
  for (let diff of diffs) diff.classList.remove('checked');
  this.classList.add('checked');
}
function toggleMedium() {
  gameDiff = 1;
  localStorage.setItem('gameDiff',gameDiff);

  let diffs = document.querySelectorAll('.diff');
  for (let diff of diffs) diff.classList.remove('checked');
  this.classList.add('checked');
}
function toggleHard() {
  gameDiff = 2;
  localStorage.setItem('gameDiff',gameDiff);

  let diffs = document.querySelectorAll('.diff');
  for (let diff of diffs) diff.classList.remove('checked');
  this.classList.add('checked');
}

//EASY
const easy = document.querySelector('.easy');
easy.addEventListener('click',toggleEasy);

//MEDIUM
const medium = document.querySelector('.medium');
medium.addEventListener('click',toggleMedium);

//HARD
const hard = document.querySelector('.hard');
hard.addEventListener('click',toggleHard);

// Roll and hold click funcitons
function rollEvent() {
  setDice(rollDice());
}
function holdEvent() {
  hold(current);
}
  //Roll
const diceButton = document.getElementById('dice');
diceButton.addEventListener('click',rollEvent);
  //Hold
const holdButtonOne = document.querySelector('.player0');
holdButtonOne.addEventListener('click',holdEvent);
const holdButtonTwo = document.querySelector('.player1');
holdButtonTwo.addEventListener('click',holdEvent);

//Menu button
function toggleMenu() {
  const menu = document.querySelector('.settingsButton');

  if(!menu.classList.contains('openMenu')){
    menu.classList.add('openMenu');
    return
  };
  if(menu.classList.contains('openMenu')){
    menu.classList.add('closeMenu');
    setTimeout(()=>{
      menu.classList.remove('openMenu');
      menu.classList.remove('closeMenu');
      return
    },200);
  };
}
const menuButton = document.querySelector('.menuButton');
menuButton.addEventListener('click',toggleMenu);

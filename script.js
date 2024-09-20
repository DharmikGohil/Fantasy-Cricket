// Importing player data
import { data } from "./playerData.js";

class Player {
  constructor(name, role, credit, captain, viceCaptain, totRuns, fantPoint, isPlayed, totBallsPlayed, outBy, totWicketTakes) {
    this.name = name;
    this.role = role;
    this.credit = credit;
    this.captain = captain;
    this.viceCaptain = viceCaptain;
    this.totRuns = totRuns;
    this.fantPoint = fantPoint;
    this.isPlayed = isPlayed;
    this.totBallsPlayed = totBallsPlayed;
    this.outBy = outBy;
    this.totWicketTakes = totWicketTakes;
  }
}

class Players {
  static TOTAL_BATSMAN = 0;
  static TOTAL_BOWLER = 0;
  static TOTAL_KEEPER = 0;
  constructor() {
    this.players = [];
  }
  addPlayers(name, role, credit, captain, viceCaptain, totRuns, fantPoint, isPlayed) {
    this.players.push(new Player(name, role, credit, captain, viceCaptain, totRuns, fantPoint, isPlayed, 0, "", 0));
  }
  removePlayers(name) {
    const playerIndex = this.players.findIndex((p) => p.name === name);
    if(playerIndex != -1){
      this.players.splice(playerIndex, 1);
    }
  }
  setCaptain(name) {
    this.players.forEach((p) => (p.captain = p.name === name));
  }
  setViceCaptain(name) {
    this.players.forEach((p) => (p.viceCaptain = p.name === name));
  }
}

class Team {
  static TOTAL_CREDIT = 100;
  constructor() {
  }
  addTeam(name, isTossWon, win,totFantPoint, totScore, credit, players) {
    this.name = name;
    this.isTossWontoss = isTossWon;
    this.win = win;
    this.totFantPoint = totFantPoint;
    this.totScore = totScore;
    this.credit = Team.TOTAL_CREDIT - credit;
    Team.TOTAL_CREDIT = this.credit;
    this.players = players;
  }
}

class Teams {
  constructor() {
    this.team = [];
  }
  addTeams(team) {
    this.team.push(team);
  }
  returnTossWinnerTeam(){
    return this.team[0];
  }
  returnTossLoserTeam(){
    return this.team[1];
  }
}

let firstName;
let secondName;
let firstTeamName = document.getElementById("firstTeamName");
let secondTeamName = document.getElementById("secondTeamName");
let tossWinner;
let tossWinnerName;
let tossLoserName;
let isFirstTeamCreated = false;
let players = new Players();
let team1 = new Team();
let team2Players = new Players();
let team2 = new Team();
let teams = new Teams();
let tossWinnerTeam;
let tossLoserTeam;

// TOSS FUNCTION
function functionToss() {
  firstName = document.getElementById("firstName").value;
  secondName = document.getElementById("secondName").value;
  if (firstName == "" || secondName == "") {
    alert("Team names should not be empty");
    return;
  } else {
    tossWinner = Math.random() < 0.5 ? firstName : secondName;

    firstTeamName.innerHTML = `${tossWinner}'s Team`;
    secondTeamName.innerHTML = tossWinner === firstName ? `${secondName}'s Team` : `${firstName}'s Team`;
    
    tossWinnerName = tossWinner === firstName ? firstName : secondName;
    tossLoserName = tossWinner === firstName ? secondName : firstName;

    let winnerId = document.getElementById("tossWon");
    winnerId.textContent = `${tossWinner} won the toss!`;
    alert(`${tossWinner} won the toss! now select your team!`)
    showPlayerSelection();
  }
}

// Populate available players
// Make sure these are properly selected
const availablePlayers = document.getElementById("available-players");
const firstTeamPlayers = document.getElementById("firstTeamPlayers");
const secondTeamPlayers = document.getElementById("secondTeamPlayers");


data.forEach((player) => {
  const li = document.createElement("li");
  li.textContent = `${player.name} [${player.playingRole}, Credit: ${player.credit}]`;
  li.dataset.name = player.name;
  li.dataset.role = player.playingRole;
  li.dataset.credit = player.credit;
  availablePlayers.appendChild(li);

  document.getElementById("firstTeamSelectionArea").classList.remove("disabled");
  document.getElementById("secondTeamSelectionArea").classList.add("disabled");
 
});

// First Team Selection Logic
function selectPlayer(event) {
  const player = event.target;
  const playerName = player.dataset.name;
  const playerRole = player.dataset.role;
  const playerCredit = parseFloat(player.dataset.credit);
  const TOTAL_PLAYERS = Players.TOTAL_BATSMAN + Players.TOTAL_BOWLER + Players.TOTAL_KEEPER;

  if (TOTAL_PLAYERS == 11) {
    alert(`You can only choose 11 players!!`);
    return;
  }

  if (Team.TOTAL_CREDIT < playerCredit) {
    alert(`Your credit score ${Team.TOTAL_CREDIT} is not enough to buy ${playerName} with credit ${playerCredit}`);
    return;
  }

  if (playerRole === "Batsman" && Players.TOTAL_BATSMAN === 5) {
    alert(`5 Batsmen are enough, please choose Bowlers or one Wicketkeeper`);
    return;
  }

  if (playerRole === "Bowler" && Players.TOTAL_BOWLER === 5) {
    alert(`5 Bowlers are enough, please choose Batsmen or one Wicketkeeper`);
    return;
  }

  if (playerRole === "Wicketkeeper" && Players.TOTAL_KEEPER === 1) {
    alert(`You can only choose one Wicketkeeper`);
    return;
  }

  players.addPlayers(playerName, playerRole, playerCredit, false, false, 0, 0, false, 0, "", 0);
  team1.addTeam(tossWinnerName, true, false, 0, 0, playerCredit, players);
  
  

  availablePlayers.removeChild(player);
  firstTeamPlayers.appendChild(player);
  player.classList.add("selected");

  const captainDropdown = document.querySelector("#firstTeamPlayersCapOptions").parentElement;
  const option = document.createElement("option");
  option.value = playerName;
  option.text = playerName;
  captainDropdown.appendChild(option);

  const viceCaptainDropdown = document.querySelector("#firstTeamViceCaptainOptions").parentElement;
  const viceOption = document.createElement("option");
  viceOption.value = playerName;
  viceOption.text = playerName;
  viceCaptainDropdown.appendChild(viceOption);

  if (playerRole === "Batsman") {
    Players.TOTAL_BATSMAN++;
  } else if (playerRole === "Bowler") {
    Players.TOTAL_BOWLER++;
  } else if (playerRole === "Wicketkeeper") {
    Players.TOTAL_KEEPER++;
  }

  document.getElementById("firstTeamCredits").innerText = `Credits Left: ${Team.TOTAL_CREDIT} \nTotal Batsman: ${Players.TOTAL_BATSMAN} \n Total Bowlers: ${Players.TOTAL_BOWLER} \n Total Keepers: ${Players.TOTAL_KEEPER}`
}

function deselectPlayer(event) {
  const player = event.target;
  const playerName = player.dataset.name;
  const playerRole = player.dataset.role;
  const playerCredit = parseFloat(player.dataset.credit);

  firstTeamPlayers.removeChild(player);
  availablePlayers.appendChild(player);
  player.classList.remove("selected");

  const captainDropdown = document.querySelector("#firstTeamPlayersCapOptions").parentElement;
  const options = captainDropdown.querySelectorAll("option");
  options.forEach(option => {
    if (option.value === playerName) {
      captainDropdown.removeChild(option);
    }
  });
  
  const viceCaptainDropdown = document.querySelector("#firstTeamViceCaptainOptions").parentElement;
  const viceOptions = viceCaptainDropdown.querySelectorAll("option");
  viceOptions.forEach(option => {
    if (option.value === playerName) {
      viceCaptainDropdown.removeChild(option);
    }
  });
  
  players.removePlayers(playerName);
  Team.TOTAL_CREDIT += playerCredit;
  
  if (playerRole === "Batsman") {
    Players.TOTAL_BATSMAN--;
  } else if (playerRole === "Bowler") {
    Players.TOTAL_BOWLER--;
  } else if (playerRole === "Wicketkeeper") {
    Players.TOTAL_KEEPER--;
  }
  document.getElementById("firstTeamCredits").innerText = `Credits Left: ${Team.TOTAL_CREDIT} \nTotal Batsman: ${Players.TOTAL_BATSMAN} \n Total Bowlers: ${Players.TOTAL_BOWLER} \n Total Keepers: ${Players.TOTAL_KEEPER}`
}

// Event listeners for first team selection
availablePlayers.addEventListener("click", selectPlayer);
firstTeamPlayers.addEventListener("click", deselectPlayer);

function createFirstTeam() {
  const captainName = document.getElementById("firstTeamPlayersCapSelect").value;
  const viceCaptainName = document.getElementById("firstTeamPlayersViceCapSelect").value;
  const TOTAL_PLAYERS = Players.TOTAL_BATSMAN + Players.TOTAL_BOWLER + Players.TOTAL_KEEPER;

  if(captainName === viceCaptainName) {
    alert(`Captain and Vice captain should not be same!!`);
    return;
  }
  if(TOTAL_PLAYERS != 11) {
    alert("Please first choose 11 players!");
    return;
  }

  players.setCaptain(captainName);
  players.setViceCaptain(viceCaptainName);
  teams.addTeams(team1);
  console.log(teams)
  
  alert(`Congratulations ${tossWinnerName}, your team is created!!`);
  alert(`Now ${tossLoserName}, select your team!`);
  
  isFirstTeamCreated = true;

  // let winnerTeam = teams.returnTossWinnerTeam();
  // console.log(winnerTeam.players.players);
  // winnerTeam.players.players.forEach((p)=>console.log(`${p.name} ${p.credit} ${p.isPlayed}`))
  switchToSecondTeamSelection();
}

// Second Team Selection Logic
function initializeSecondTeam() {
  team2Players = new Players();
  team2 = new Team();
  Team.TOTAL_CREDIT = 100;
  Players.TOTAL_BATSMAN = 0;
  Players.TOTAL_BOWLER = 0;
  Players.TOTAL_KEEPER = 0;

  // Remove event listeners from first team selection
  availablePlayers.removeEventListener("click", selectPlayer);
  firstTeamPlayers.removeEventListener("click", deselectPlayer);

  // Add event listeners for second team selection
  availablePlayers.addEventListener("click", selectSecondTeamPlayer);
  document.getElementById("secondTeamPlayers").addEventListener("click", deselectSecondTeamPlayer);

  console.log("Second team initialized");
}

function switchToSecondTeamSelection() {
  document.getElementById("firstTeamSelectionArea").classList.add("disabled");
  document.getElementById("secondTeamSelectionArea").classList.remove("disabled");

  
  // Reset available players
  // while (availablePlayers.firstChild) {
  //   availablePlayers.removeChild(availablePlayers.firstChild);
  // }
  
  // Repopulate available players
  // data.forEach((player) => {
  //   const li = document.createElement("li");
  //   li.textContent = `${player.name} [${player.playingRole}, Credit: ${player.credit}]`;
  //   li.dataset.name = player.name;
  //   li.dataset.role = player.playingRole;
  //   li.dataset.credit = player.credit;
  //   availablePlayers.appendChild(li);
  // });

  initializeSecondTeam();
}

function selectSecondTeamPlayer(event) {
  const player = event.target;
  const playerName = player.dataset.name;
  const playerRole = player.dataset.role;
  const playerCredit = parseFloat(player.dataset.credit);
  const TOTAL_PLAYERS = Players.TOTAL_BATSMAN + Players.TOTAL_BOWLER + Players.TOTAL_KEEPER;

  if (TOTAL_PLAYERS == 11) {
    alert(`You can only choose 11 players!!`);
    return;
  }

  if (Team.TOTAL_CREDIT < playerCredit) {
    alert(`Your credit score ${Team.TOTAL_CREDIT} is not enough to buy ${playerName} with credit ${playerCredit}`);
    return;
  }

  if (playerRole === "Batsman" && Players.TOTAL_BATSMAN === 5) {
    alert(`5 Batsmen are enough, please choose Bowlers or one Wicketkeeper`);
    return;
  }

  if (playerRole === "Bowler" && Players.TOTAL_BOWLER === 5) {
    alert(`5 Bowlers are enough, please choose Batsmen or one Wicketkeeper`);
    return;
  }

  if (playerRole === "Wicketkeeper" && Players.TOTAL_KEEPER === 1) {
    alert(`You can only choose one Wicketkeeper`);
    return;
  }

  team2Players.addPlayers(playerName, playerRole, playerCredit, false, false, 0, 0, false, 0, "", 0);
  team2.addTeam(tossLoserName, false, false, 0, 0, playerCredit, team2Players);

  availablePlayers.removeChild(player);
  document.getElementById("secondTeamPlayers").appendChild(player);
  player.classList.add("selected");

  const captainDropdown = document.querySelector("#secondTeamPlayersCapOptions").parentElement;
  const option = document.createElement("option");
  option.value = playerName;
  option.text = playerName;
  captainDropdown.appendChild(option);

  const viceCaptainDropdown = document.querySelector("#secondTeamViceCaptainOptions").parentElement;
  const viceOption = document.createElement("option");
  viceOption.value = playerName;
  viceOption.text = playerName;
  viceCaptainDropdown.appendChild(viceOption);

  if (playerRole === "Batsman") {
    Players.TOTAL_BATSMAN++;
  } else if (playerRole === "Bowler") {
    Players.TOTAL_BOWLER++;
  } else if (playerRole === "Wicketkeeper") {
    Players.TOTAL_KEEPER++;
  }
 document.getElementById("secondTeamCredits").innerText = `Credits Left: ${Team.TOTAL_CREDIT} \nTotal Batsman: ${Players.TOTAL_BATSMAN} \n Total Bowlers: ${Players.TOTAL_BOWLER} \n Total Keepers: ${Players.TOTAL_KEEPER}`
}

function deselectSecondTeamPlayer(event) {
  const player = event.target;
  const playerName = player.dataset.name;
  const playerRole = player.dataset.role;
  const playerCredit = parseFloat(player.dataset.credit);
  
  document.getElementById("secondTeamPlayers").removeChild(player);
  availablePlayers.appendChild(player);
  player.classList.remove("selected");
  
  const captainDropdown = document.querySelector("#secondTeamPlayersCapOptions").parentElement;
  const options = captainDropdown.querySelectorAll("option");
  options.forEach(option => {
    if (option.value === playerName) {
      captainDropdown.removeChild(option);
    }
  });
  
  const viceCaptainDropdown = document.querySelector("#secondTeamViceCaptainOptions").parentElement;
  const viceOptions = viceCaptainDropdown.querySelectorAll("option");
  viceOptions.forEach(option => {
    if (option.value === playerName) {
      viceCaptainDropdown.removeChild(option);
    }
  });
  
  team2Players.removePlayers(playerName);
  Team.TOTAL_CREDIT += playerCredit;

  if (playerRole === "Batsman") {
    Players.TOTAL_BATSMAN--;
  } else if (playerRole === "Bowler") {
    Players.TOTAL_BOWLER--;
  } else if (playerRole === "Wicketkeeper") {
    Players.TOTAL_KEEPER--;
  }
  document.getElementById("secondTeamCredits").innerText = `Credits Left: ${Team.TOTAL_CREDIT} \nTotal Batsman: ${Players.TOTAL_BATSMAN} \n Total Bowlers: ${Players.TOTAL_BOWLER} \n Total Keepers: ${Players.TOTAL_KEEPER}`
}

function createSecondTeam() {
  const captainName = document.getElementById("secondTeamPlayersCapSelect").value;
  const viceCaptainName = document.getElementById("secondTeamPlayersViceCapSelect").value;
  const TOTAL_PLAYERS = Players.TOTAL_BATSMAN + Players.TOTAL_BOWLER + Players.TOTAL_KEEPER;

  if(captainName === viceCaptainName) {
    alert(`Captain and Vice captain should not be same!!`);
    return;
  }
  if(TOTAL_PLAYERS != 11) {
    alert("Please first choose 11 players!");
    return;
  }

  team2Players.setCaptain(captainName);
  team2Players.setViceCaptain(viceCaptainName);
  teams.addTeams(team2);
  
  alert(`Congratulations ${tossLoserName}, your team is created!!`);
  console.log(teams);
   tossWinnerTeam = teams.returnTossWinnerTeam();
   tossLoserTeam = teams.returnTossLoserTeam();
  showMatchSelection(tossWinnerTeam, tossLoserTeam);
}

// Initial setup
document.getElementById("available-players").addEventListener("click", selectPlayer);
firstTeamPlayers.addEventListener("click", deselectPlayer);

window.functionToss = functionToss;
window.createFirstTeam = createFirstTeam;
window.createSecondTeam = createSecondTeam;


//-------------------Display block and none area-------------------------
window.onload = function(){
  document.getElementById("toss-section").style.display = 'block';
  document.getElementById("players-selection").style.display = 'none';
  document.getElementById("match-section").style.display = 'none';


  document.getElementById("showMatchResult").style.display = "none";
  document.getElementById("matchResult").style.display = "none";
  
}

// when toss comppleted 
function showPlayerSelection(){
  console.log("inside toss completed");
  document.getElementById("toss-section").style.display = 'none';
  document.getElementById("players-selection").style.display = 'block';
  document.getElementById("match-section").style.display = 'none';
  document.getElementById("showMatchResult").style.display = "none";
  document.getElementById("matchResult").style.display = "none";
}


//-------------------------------------- MATCH SECTION -------------------------------------

function showMatchSelection(tossWinnerTeam, tossLoserTeam){
  document.getElementById("toss-section").style.display = 'none';
  document.getElementById("players-selection").style.display = 'none';
  document.getElementById("match-section").style.display = 'block';
  document.getElementById("showMatchResult").style.display = "none";
  document.getElementById("matchResult").style.display = "none";



  let marqueeTextId =  document.getElementById('marqueeText');
  marqueeTextId.innerHTML = `${tossWinnerName} Won the toss and choose to BAT first!`;
  setTimeout(() => {
      marqueeTextId.innerHTML = "";
  }, 14000);
  // showing first team players
  document.getElementById("tossWinnerTeamName").textContent = `${tossWinnerName}'s Team`;
  tossWinnerTeam.players.players.forEach((player) => {
  const li = document.createElement("li");
  li.textContent = `${player.name} [${player.role}, Credit: ${player.credit}]`;
  li.dataset.name = player.name;
  li.dataset.role = player.playingRole;
  li.dataset.credit = player.credit;
  matchTossWinnerTeamPlayers.appendChild(li);
  if(player.captain){
    li.classList.add("captain")
  }
  else if(player.viceCaptain){
    li.classList.add("vice-captain")
  }
});

// showing second team players
document.getElementById("tossLoserTeamName").textContent = `${tossLoserName}'s Team`;
tossLoserTeam.players.players.forEach((player) => {
  const li = document.createElement("li");
  li.textContent = `${player.name} [${player.role}, Credit: ${player.credit}]`;
  li.dataset.name = player.name;
  li.dataset.role = player.playingRole;
  li.dataset.credit = player.credit;
  matchTossLoserTeamPlayers.appendChild(li);
  if(player.captain){
    li.classList.add("captain")
  }
  else if(player.viceCaptain){
    li.classList.add("vice-captain")
  }
});
  // console.log(tossLoserTeam)
}



//-------------------------


const points =  [
  { run: 1, fantPoint: 1 },
  { run: 2, fantPoint: 2 },
  { run: 3, fantPoint: 3 },
  { run: 4, fantPoint: 5 },
  { run: 6, fantPoint: 8 },
  { run: "dot", fantPoint: 1 },
  { run: "w", fantPoint: 10 },
];


function randomNumberGenerator() {
return Math.floor(Math.random() * 7);
}

let count = 0;
let totOverBalls = 0;
let firstTeamFantPoints  = document.getElementById("firstTeamFantPoints");
let secondTeamFantPoints  = document.getElementById("secondTeamFantPoints");
let finalMatchResultId = document.getElementById("finalMatchResult");
let isFirstInningCompleted = false;
let over = 0;
let totComptInnings = 0;
let currPlayingTeam;
let currBowlingTeam;


function hitFunction(){
     currPlayingTeam =  isFirstInningCompleted ? tossLoserTeam : tossWinnerTeam;
     currBowlingTeam = isFirstInningCompleted ? tossWinnerTeam : tossLoserTeam;
  if(count < 11 && totOverBalls < 30){
    const player = currPlayingTeam.players.players.find((p) => !p.isPlayed);
    const bowler = currBowlingTeam.players.players.find((p) => (p.role === "Bowler" && !p.isPlayed));

    if (player === undefined || bowler === undefined) alert("First Innigs is completed");

    const randomBall = randomNumberGenerator();

    const {run , fantPoint} = points[randomBall];
    let playerMultiplier = 1;
    let bowlerMultiplier = 1;
 
    if(player.captain){
        playerMultiplier = 2;

    }else if(player.viceCaptain){
        playerMultiplier = 1.5;
      
    }
    
    if(bowler.captain){
        bowlerMultiplier = 2;
    }else if(bowler.viceCaptain){
        bowlerMultiplier = 1.5;
    }

    let playerPoints = fantPoint * playerMultiplier;
    let bowlerPoints = fantPoint * bowlerMultiplier;
    // console.log("after if else points " +playerPoints +bowlerPoints)
    // const point = (player.captain || bowler.captain) ? 2 * fantPoint : (player.viceCaptain || bowler.viceCaptain) ? 1.5 * fantPoint : fantPoint;
    // const point = fantPoint;
    // console.log(point)
   
    
    const runs = (typeof run) === 'number' ? +run  : run;

    
    if(runs === "dot"){
        bowler.fantPoint += bowlerPoints;
        currBowlingTeam.totFantPoint += bowlerPoints;
        updateFantasyPointsDisplay();
    }
    else if(runs === "w"){
        bowler.fantPoint += bowlerPoints;
        currBowlingTeam.totFantPoint += bowlerPoints;
        bowler.totWicketTakes++;
        updateFantasyPointsDisplay();
        if(player.totRuns === 0){
            player.fantPoint += player.captain ? -4 : player.viceCaptain ? -3 : -2;
            currPlayingTeam.totFantPoint += player.captain ? -4 : player.viceCaptain ? -3 : -2;
            updateFantasyPointsDisplay();
        }
        player.isPlayed = true; 
        player.outBy = bowler.name;
        // alert(`${player.name} is OUT! by ${bowler.name}`);
        count++;
    }
    else{
        player.fantPoint += playerPoints;
        currPlayingTeam.totFantPoint += playerPoints;
        updateFantasyPointsDisplay();
        player.totRuns += runs;
        currPlayingTeam.totScore +=runs;
        console.log(`${player.fantPoint} kohli`)
        
        // for last played player markingg true
        if(count == 10 || totOverBalls == 29){
            player.isPlayed = 'notOut';
        }
    }
    totOverBalls += 1;
    player.totBallsPlayed++;
    bowler.totBallsPlayed++;
    if(totOverBalls % 6 == 0){
        console.log(totOverBalls)
        bowler.isPlayed = true;
    }
    over = `${Math.floor(totOverBalls / 6)}.${totOverBalls % 6}` ;
    const time = new Date();
    
    console.log(`Batsman: ${player.name}`)
    console.log(`Bowler: ${bowler.name}`)
    console.log(`Over: ${over}`);
    console.log(currPlayingTeam)
    document.getElementById("playingDetails").textContent = `Current Batting Team: ${currPlayingTeam.name} \n\nCurrent Bowling Team : ${currBowlingTeam.name} \n\nBatsman: ${player.name} \n\nBowler: ${bowler.name} \n\nShot: ${runs} \n\nOver: ${over} \n\nDate & Time : ${time.toLocaleString()}`
    updateFantasyPointsDisplay();
}

    if(totOverBalls == 30){
        const title = isFirstInningCompleted ? "Second" : "First";
        isFirstInningCompleted = true;
        count = 0;
        totOverBalls = 0;
        totComptInnings++;

        // alert("First inning is completed!");
        const playingDetails = document.getElementById("playingDetails");
        alert(`${title} inning is over! now ${currPlayingTeam.name} is Bowl and ${currBowlingTeam.name} is Bat`)
        const firstInningTitle = `--------------------------${title} Inning Summary----------------------------------`;
        playingDetails.textContent = "";
        playingDetails.textContent += firstInningTitle + "\n";
        playingDetails.textContent += `${currPlayingTeam.name}'s Team Summary \n\n`
        // console.log(tossLoserTeam)
        currPlayingTeam.players.players.forEach((p) =>{
            if(p.isPlayed === true){
                playingDetails.textContent += `${p.name}\n${p.totRuns}(${p.totBallsPlayed})\n\n`
            }
            else if(p.isPlayed === "notOut"){
                playingDetails.textContent += `${p.name}\n${p.totRuns}*(${p.totBallsPlayed})\n\n`
                
            }
            // else if(p.isPlayed == 'notOut'){
            //     playingDetails.textContent += `Noutout`
            // }
        })
        playingDetails.textContent += `Total Score : ${currPlayingTeam.totScore} \nTotal Wickets: ${count} \nRun Rate:${(currPlayingTeam.totScore / 5).toFixed(2)} \nTotal Fantasy Point:${currPlayingTeam.totFantPoint}\n`
        playingDetails.textContent +="--------------------------------------------------------------------------------"
        playingDetails.textContent += `${currBowlingTeam.name}'s Team Summary \n\n`
        // console.log(tossLoserTeam)
        currBowlingTeam.players.players.forEach((p) =>{
            if(p.isPlayed){
                playingDetails.textContent += `${p.name}\n${p.totWicketTakes}/${p.totBallsPlayed}(${1})\n\n`
            }
        })
        playingDetails.textContent += `Total Fantasy Points : ${currBowlingTeam.totFantPoint}`
        finalMatchResultId.textContent += playingDetails.textContent;
     
        currPlayingTeam.players.players.forEach((p) => p.isPlayed = false);
        currBowlingTeam.players.players.forEach((p) => p.isPlayed = false);
        document.getElementById("firstTeamFantPoints").textContent = `${currPlayingTeam.name}'s Team Fantasy Points: ${currPlayingTeam.totFantPoint}`;
        document.getElementById("secondTeamFantPoints").textContent = `${currBowlingTeam.name}'s Team Fantasy Points: ${currBowlingTeam.totFantPoint}`;
        console.log(currPlayingTeam)
        console.log(currBowlingTeam)

        const marqueeTextId =  document.getElementById("marqueeText");
        marqueeTextId.innerHTML = `Now ${tossLoserName} is Batting and ${tossWinnerName} team is bowling!`;
        setTimeout(() => {
            marqueeTextId.innerHTML = "";
        }, 14000);
        if(totComptInnings == 2){
            document.getElementById("hit").style.display = "none";
            document.getElementById("showMatchResult").style.display = "block";
            document.getElementById("firstTeamFantPoints").innerHTML = `Fantasy Points: ${tossWinnerTeam.totFantPoint}`;
            document.getElementById("secondTeamFantPoints").innerHTML = `Fantasy Points: ${tossLoserTeam.totFantPoint}`;
            marqueeTextId.innerHTML = "";
            
        }
        
    }
}


window.hitFunction = hitFunction;

// seccond inning

function updateFantasyPointsDisplay() {
    const battingTeamPoints = document.getElementById(isFirstInningCompleted ? "secondTeamFantPoints" : "firstTeamFantPoints");
    const bowlingTeamPoints = document.getElementById(isFirstInningCompleted ? "firstTeamFantPoints" : "secondTeamFantPoints");
    
    battingTeamPoints.innerHTML = `Fantasy Points: ${currPlayingTeam.totFantPoint} <br> Score : ${currPlayingTeam.totScore}/${count} <br> Run Rate : ${(currPlayingTeam.totScore / 6).toFixed(2)} `;
    bowlingTeamPoints.innerHTML = `Fantasy Points: ${currBowlingTeam.totFantPoint} <br> Overs : ${over}`;
  }

function showMatchResult(){
    document.getElementById("match-section").style.display = "none";
    document.getElementById("matchResult").style.display = "block";

    let winnerTeam = tossWinnerTeam.totFantPoint > tossLoserTeam.totFantPoint ? tossWinnerTeam.name : tossLoserTeam.name;

    let diffFantPoint = Math.abs(tossWinnerTeam.totFantPoint - tossLoserTeam.totFantPoint);
    let matchResultInShort = document.getElementById("matchResultInShort");
    matchResultInShort.innerHTML = `${tossWinnerTeam.name} Fantasy Points: ${tossWinnerTeam.totFantPoint} <br> ${tossLoserTeam.name} Fantasy Points: ${tossLoserTeam.totFantPoint} <br> ${winnerTeam} won by ${diffFantPoint} Fantasy Points!`
    

    console.log(tossWinnerTeam);
    console.log(tossLoserTeam);

}
window.showMatchResult = showMatchResult;
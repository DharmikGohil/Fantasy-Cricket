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
  addTeam(name, isTossWon, win, totFantPoint, totScore, credit, players) {
    this.name = name;
    this.isTossWon = isTossWon;
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

// Combined Team Selection Logic


function selectPlayer(event) {
  if(event.target.closest("li")){
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

    const currentPlayers = currentTeamIndex === 0 ? players : team2Players;
    currentPlayers.addPlayers(playerName, playerRole, playerCredit, false, false, 0, 0, false, 0, "", 0);
    const currentTeam = currentTeamIndex === 0 ? team1 : team2;
    currentTeam.addTeam(currentTeamIndex === 0 ? tossWinnerName : tossLoserName, currentTeamIndex === 0, false, 0, 0, playerCredit, currentPlayers);

    availablePlayers.removeChild(player);
    (currentTeamIndex === 0 ? firstTeamPlayers : secondTeamPlayers).appendChild(player);
    player.classList.add("selected");

    const captainDropdown = document.querySelector(`#${currentTeamIndex === 0 ? 'first' : 'second'}TeamPlayersCapOptions`).parentElement;
    const option = document.createElement("option");
    option.value = playerName;
    option.text = playerName;
    captainDropdown.appendChild(option);

    const viceCaptainDropdown = document.querySelector(`#${currentTeamIndex === 0 ? 'first' : 'second'}TeamViceCaptainOptions`).parentElement;
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

    document.getElementById(`${currentTeamIndex === 0 ? 'first' : 'second'}TeamCredits`).innerText = `Credits Left: ${Team.TOTAL_CREDIT} \nTotal Batsman: ${Players.TOTAL_BATSMAN} \n Total Bowlers: ${Players.TOTAL_BOWLER} \n Total Keepers: ${Players.TOTAL_KEEPER}`
  }
}

function deselectPlayer(event) {
  if(event.target.closest("li")){
    const player = event.target;
    const playerName = player.dataset.name;
    const playerRole = player.dataset.role;
    const playerCredit = parseFloat(player.dataset.credit);

    (currentTeamIndex === 0 ? firstTeamPlayers : secondTeamPlayers).removeChild(player);
    availablePlayers.appendChild(player);
    player.classList.remove("selected");

    const captainDropdown = document.querySelector(`#${currentTeamIndex === 0 ? 'first' : 'second'}TeamPlayersCapOptions`).parentElement;
    const options = captainDropdown.querySelectorAll("option");
    options.forEach(option => {
      if (option.value === playerName) {
        captainDropdown.removeChild(option);
      }
    });
    
    const viceCaptainDropdown = document.querySelector(`#${currentTeamIndex === 0 ? 'first' : 'second'}TeamViceCaptainOptions`).parentElement;
    const viceOptions = viceCaptainDropdown.querySelectorAll("option");
    viceOptions.forEach(option => {
      if (option.value === playerName) {
        viceCaptainDropdown.removeChild(option);
      }
    });
    
    const currentPlayers = currentTeamIndex === 0 ? players : team2Players;
    currentPlayers.removePlayers(playerName);
    Team.TOTAL_CREDIT += playerCredit;
    
    if (playerRole === "Batsman") {
      Players.TOTAL_BATSMAN--;
    } else if (playerRole === "Bowler") {
      Players.TOTAL_BOWLER--;
    } else if (playerRole === "Wicketkeeper") {
      Players.TOTAL_KEEPER--;
    }
    document.getElementById(`${currentTeamIndex === 0 ? 'first' : 'second'}TeamCredits`).innerText = `Credits Left: ${Team.TOTAL_CREDIT} \nTotal Batsman: ${Players.TOTAL_BATSMAN} \n Total Bowlers: ${Players.TOTAL_BOWLER} \n Total Keepers: ${Players.TOTAL_KEEPER}`
  }
}

// single function to create both teams
let currentTeamIndex = 0;
function createTeam() {
  const teamData = [
    { name: tossWinnerName, players: players, team: team1 },
    { name: tossLoserName, players: team2Players, team: team2 }
  ];

  const currentTeam = teamData[currentTeamIndex];
  const captainName = document.getElementById(`${currentTeamIndex === 0 ? 'first' : 'second'}TeamPlayersCapSelect`).value;
  const viceCaptainName = document.getElementById(`${currentTeamIndex === 0 ? 'first' : 'second'}TeamPlayersViceCapSelect`).value;
  const TOTAL_PLAYERS = Players.TOTAL_BATSMAN + Players.TOTAL_BOWLER + Players.TOTAL_KEEPER;

  if (captainName === viceCaptainName) {
    alert(`Captain and Vice captain should not be same!!`);
    return;
  }
  if (TOTAL_PLAYERS != 11) {
    alert("Please first choose 11 players!");
    return;
  }

  currentTeam.players.setCaptain(captainName);
  currentTeam.players.setViceCaptain(viceCaptainName);
  teams.addTeams(currentTeam.team);

  alert(`Congratulations ${currentTeam.name}, your team is created!!`);

  if (currentTeamIndex === 0) {
    isFirstTeamCreated = true;
    currentTeamIndex++;
    alert(`Now ${tossLoserName}, select your team!`);
    switchToSecondTeamSelection();
  } else {
    console.log(teams);
    tossWinnerTeam = teams.returnTossWinnerTeam();
    tossLoserTeam = teams.returnTossLoserTeam();
    showMatchSelection(tossWinnerTeam, tossLoserTeam);
  }
}

// this function call after first team is successfully created

function switchToSecondTeamSelection() {
  document.getElementById("firstTeamSelectionArea").classList.add("disabled");
  document.getElementById("secondTeamSelectionArea").classList.remove("disabled");

  // Reset counteres for second team
  Players.TOTAL_BATSMAN = 0;
  Players.TOTAL_BOWLER = 0;
  Players.TOTAL_KEEPER = 0;
  Team.TOTAL_CREDIT = 100;

  // Update event listeners
  availablePlayers.removeEventListener("click", selectPlayer);
  firstTeamPlayers.removeEventListener("click", deselectPlayer);
  availablePlayers.addEventListener("click", selectPlayer);
  secondTeamPlayers.addEventListener("click", deselectPlayer);
}

// Event listeners for team selection
availablePlayers.addEventListener("click", selectPlayer);
firstTeamPlayers.addEventListener("click", deselectPlayer);



window.functionToss = functionToss;
window.createTeam = createTeam;



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



  let marqueeTextId =  document.getElementById("marqueeText");
  marqueeTextId.innerHTML = `${tossWinnerName} Won the toss and choose to BAT first!`;
  setTimeout(() => {
      marqueeTextId.innerHTML = "";
  }, 20000);
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
    li.textContent = `${player.name} [${player.role}, Credit: ${player.credit}] [C]`;
    li.classList.add("captain")
  }
  else if(player.viceCaptain){
    li.classList.add("vice-captain")
    li.textContent = `${player.name} [${player.role}, Credit: ${player.credit}] [VC]`;
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
    li.textContent = `${player.name} [${player.role}, Credit: ${player.credit}] [C]`;
  }
  else if(player.viceCaptain){
    li.classList.add("vice-captain")
    li.textContent = `${player.name} [${player.role}, Credit: ${player.credit}] [VC]`;
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

let wicketCounts = 0;
let totOverBalls = 0;
let totBalls = 30;
let firstTeamFantPoints  = document.getElementById("firstTeamFantPoints");
let secondTeamFantPoints  = document.getElementById("secondTeamFantPoints");
let hitButton = document.getElementById("hit");
let loadingGif = document.getElementById("loading");
let finalMatchResultId = document.getElementById("finalMatchResult");
let isFirstInningCompleted = false;
let over = 0;
let totComptInnings = 0;
let currPlayingTeam;
let currBowlingTeam;


hitButton.addEventListener('click', () =>{
    hitButton.classList.add("disabled");
    loadingGif.style.display = "block";
    
    setTimeout(() => {
        hitButton.classList.remove("disabled");
        loadingGif.style.display = "none";
    }, 5000);
  })


function hitFunction(){
     currPlayingTeam =  isFirstInningCompleted ? tossLoserTeam : tossWinnerTeam;
     currBowlingTeam = isFirstInningCompleted ? tossWinnerTeam : tossLoserTeam;
   if(wicketCounts < 11 && totOverBalls < totBalls){
    const player = currPlayingTeam.players.players.find((p) => {
      if (wicketCounts < 5 && !p.isPlayed && p.role === "Batsman") {
          return true;
      } else if (wicketCounts >= 5 && wicketCounts < 10 && !p.isPlayed && p.role === "Bowler") {
          return true;
      } else if (wicketCounts === 10 && !p.isPlayed && p.role === "Wicketkeeper") {
          return true;
      }
      return false;
  });
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
        alert(`${player.name} is OUT! by ${bowler.name}`);
        wicketCounts++;
    }
    else{
        player.fantPoint += playerPoints;
        currPlayingTeam.totFantPoint += playerPoints;
        updateFantasyPointsDisplay();
        player.totRuns += runs;
        currPlayingTeam.totScore +=runs;
        console.log(`${player.fantPoint} kohli`)
        
        // for last played player markingg true
        if(wicketCounts == 10 || totOverBalls == 29){
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

    if(totOverBalls == totBalls){
        const title = isFirstInningCompleted ? "Second" : "First";
        isFirstInningCompleted = true;
        wicketCounts = 0;
        totOverBalls = 0;
        totComptInnings++;

        // alert("First inning is completed!");
        const playingDetails = document.getElementById("playingDetails");
      
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
        playingDetails.textContent += `Total Score : ${currPlayingTeam.totScore} \nTotal Wickets: ${wicketCounts} \nRun Rate:${(currPlayingTeam.totScore / 5).toFixed(2)} \nTotal Fantasy Point:${currPlayingTeam.totFantPoint}\n`
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
        if(totComptInnings < 2){
          alert(`${title} inning is over! now ${currPlayingTeam.name} is Bowling and ${currBowlingTeam.name} is Batting`)
        }
        else{
          alert(`Both Teams Played their Match, Now Click on Show Result!!`)
        }
     
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
        }, 20000);
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
    
    battingTeamPoints.innerHTML = `Fantasy Points: ${currPlayingTeam.totFantPoint} <br> Score : ${currPlayingTeam.totScore}/${wicketCounts} <br> Run Rate : ${(currPlayingTeam.totScore / 6).toFixed(2)} `;
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

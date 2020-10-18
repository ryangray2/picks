
/// var picks = [[id, 'TEN', -4.5], ['CIN', 7]]


/// add id in submit function

var data;
var wins = 0;
var losses = 0;
var picksArr = [];


var request = new XMLHttpRequest();

request.open('GET', 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');

request.onload = function () {
  data = JSON.parse(this.response);

  // console.log("Week " + data.week.number);
  // console.log(data.events[0].competitions[0].competitors[0].team.shortDisplayName)
  //
  // for (let i = 0; i < data.events.length; i++) {
  //   console.log(data.events[i].competitions[0].competitors[0].team.shortDisplayName + " vs. " + data.events[i].competitions[0].competitors[1].team.shortDisplayName);
  // }

  document.getElementById("week").innerHTML = "Week " + data.week.number;

  if (localStorage.getItem("already") != null) {
    picksArr = JSON.parse(localStorage.getItem('already'));
    generateScoreboard();

    document.getElementById("schedule").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
  } else {
    generateChoices();
  }
}

request.send();

function generateScoreboard() {
  for (let i = 0; i < data.events.length; i++) {
    var d = document.createElement('div');
    d.setAttribute("id", data.events[i].id);
    d.classList.add("gameRow");
    var g = document.createElement('p');
    g.style.margin = "0px";
    g.innerHTML = data.events[i].competitions[0].competitors[0].team.shortDisplayName + " " + data.events[i].competitions[0].competitors[0].score + " " + data.events[i].competitions[0].competitors[1].score + " " + data.events[i].competitions[0].competitors[1].team.shortDisplayName;
    d.appendChild(g);
    document.getElementById("gamesDiv").appendChild(d);
  }
  checkScores();

}


function generateChoices() {
  for (let i = 0; i < data.events.length; i++) {
    var g = document.createElement('h3');
    g.innerHTML = data.events[i].competitions[0].competitors[0].team.abbreviation + " vs. " + data.events[i].competitions[0].competitors[1].team.abbreviation;
    document.getElementById("choicesDiv").appendChild(g);
    var form = document.createElement("form");
    form.setAttribute("id", data.events[i].competitions[0].competitors[0].team.abbreviation + data.events[i].competitions[0].competitors[1].team.abbreviation);

    var p = document.createElement('p');
    p.innerHTML = "Pick: ";

    var br = document.createElement('br');

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "choice" + i);
    input.setAttribute("id", "choice" + data.events[i].competitions[0].competitors[0].team.abbreviation + data.events[i].competitions[0].competitors[1].team.abbreviation);
    input.setAttribute("value", "");

    var p2 = document.createElement('p');
    p2.innerHTML = "Spread: ";

    var br2 = document.createElement('br');

    var input2 = document.createElement("input");
    input2.setAttribute("type", "number");
    input2.setAttribute("name", "spread" + i);
    input2.setAttribute("id", "spread" + data.events[i].competitions[0].competitors[0].team.abbreviation + data.events[i].competitions[0].competitors[1].team.abbreviation);

    form.appendChild(p);
    form.appendChild(input);
    form.appendChild(br);
    form.appendChild(p2);
    form.appendChild(input2);
    form.appendChild(br2);
    document.getElementById("choicesDiv").appendChild(form);
  }
}

function checkScores() {
  for (let i = 0; i < data.events.length; i++) {
    for (let j = 0; j < picksArr.length; j++) {
      if (data.events[i].id === picksArr[j][0]) {
        /// game match
        const gameTime = Date.parse(data.events[i].date);

        const now = new Date();
        if (Date.parse(now) < gameTime) {
          continue;
        }

        var myTeam = picksArr[j][1];
        var myTeamScore = 0;
        var otherTeamScore = 0;
        if (data.events[i].competitions[0].competitors[0].team.abbreviation === myTeam) {
          myTeamScore = parseFloat(data.events[i].competitions[0].competitors[0].score);
          otherTeamScore = parseFloat(data.events[i].competitions[0].competitors[1].score);
        } else {
          myTeamScore = parseFloat(data.events[i].competitions[0].competitors[1].score);
          otherTeamScore = parseFloat(data.events[i].competitions[0].competitors[0].score);
        }

        console.log((myTeamScore + parseFloat(picksArr[j][2])));

        if ((myTeamScore + parseFloat(picksArr[j][2])) > otherTeamScore) {
          wins += 1;
          document.getElementById(data.events[i].id).style.backgroundColor = "lightgreen";
        } else if ((myTeamScore + parseFloat(picksArr[j][2])) < otherTeamScore) {
          losses += 1;
          document.getElementById(data.events[i].id).style.backgroundColor = "lightcoral";
        }
        else {
          continue;
        }
      }
    }
  }
  console.log("wins: " + wins);
  document.getElementById("myRecord").innerHTML = wins + "-" + losses;
}

function enterPicks() {
  for (let i = 0; i < data.events.length; i++) {
    var pick = document.getElementById("choice" + data.events[i].competitions[0].competitors[0].team.abbreviation + data.events[i].competitions[0].competitors[1].team.abbreviation);
    var spread = document.getElementById("spread" + data.events[i].competitions[0].competitors[0].team.abbreviation + data.events[i].competitions[0].competitors[1].team.abbreviation);
    var id = data.events[i].id;

    var arr = [];
    arr.push(id);
    arr.push(pick.value);
    arr.push(spread.value);

    picksArr.push(arr);
  }
  generateScoreboard();

  document.getElementById("schedule").style.display = "none";
  document.getElementById("scoreboard").style.display = "block";
  localStorage.setItem('already', JSON.stringify(picksArr));
  console.log(picksArr);
}

var myVar = setInterval(myTimer, 60000);

function myTimer() {
  var myNode = document.getElementById("gamesDiv");
  while (myNode.lastElementChild) {
    myNode.removeChild(myNode.lastElementChild);
  }
  wins = 0;
  losses = 0;
  request.open('GET', 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
  request.send();
}

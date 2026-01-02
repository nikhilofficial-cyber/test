// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  ref,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6p0XB7mLUssAokwlkCASdzELbLqif-90",
  authDomain: "rockpaperscissor-b6a96.firebaseapp.com",
  databaseURL:
    "https://rockpaperscissor-b6a96-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rockpaperscissor-b6a96",
  storageBucket: "rockpaperscissor-b6a96.firebasestorage.app",
  messagingSenderId: "1038134331314",
  appId: "1:1038134331314:web:fd9a5829a80ef11a5586ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Firebase Initialized");

let userID = "user1";
set(ref(db, "users/" + userID), {
  username: "nikhil",
  email: "hello",
});
get(ref(db, "users/" + userID)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val().username);
  } else {
    console.log("No data available");
  }
});
// onValue(ref(db, "users/" + userID), (snapshot) => {
//   const data = snapshot.val();
//   console.log("Updated:", data.username);
// });

//
//
//
let gameId = "";
let Player = "";
let checkId = "";
let rock = document.querySelector("#rock");
let paper = document.querySelector("#paper");
let scissor = document.querySelector("#scissor");
let yourMove = "";
let opponentMove = "";
let yourName = "";
let opponentName = "";
let uiOppoName = "opponent";
let drc = 0;
let p1c = 0;
let p2c = 0;
let srNo = 1;
let body = document.querySelector("body");

//
//
//
let selectedMode = "";
let soloPlayerModule = document.querySelector("#soloplayermodule");
let sUserName = document.querySelector("#username");
let suName = "";
let uNameMissing = document.querySelector("#uNameMissing");
const modalElement2 = document.querySelector("#exampleModal2");
let modal2 = new bootstrap.Modal(modalElement2);
//let multiPlayerModule = document.querySelector("#multiplayermodule");

function setTimeOut3000(ele) {
  ele.style.display = "block";
  setTimeout(() => {
    ele.style.display = "none";
  }, 3000);
}

soloPlayerModule.addEventListener("click", () => {
  suName = sUserName.value;
  if (suName === "") {
    setTimeOut3000(uNameMissing);
    return;
  } else {
    selectedMode = "solo";
    console.log("Selected Mode: " + selectedMode);
  }
});

let mUserName = document.querySelector("#musername");
let muNameMissing = document.querySelector("#muNameMissing");
let muName = "";
let createNewID = document.querySelector("#createNewID");
let joinGame = document.querySelector("#joinGame");
let createGameID = document.querySelector("#createGameId");
let type = "";
let createGamePop = document.querySelector("#createGamePop");
let joinGamePop = document.querySelector("#joinGamePop");

createNewID.addEventListener("click", () => {
  muName = mUserName.value;
  if (muName === "") {
    setTimeOut3000(muNameMissing);
    return;
  } else {
    selectedMode = "";
    createGamePopup();
  }
});

joinGame.addEventListener("click", () => {
  muName = mUserName.value;
  if (muName === "") {
    setTimeOut3000(muNameMissing);
    return;
  } else {
    joinGamePopup();
  }
});

const createGamePopup = () => {
  selectedMode = "multi";
  createGamePop.style.display = "block";
  joinGamePop.style.display = "none";
  gameId = generateGameId();
  console.log("Generated Game ID: " + gameId);
  createGameID.value = gameId;
  type = "create";
  Player = "player1";
};

const joinGamePopup = () => {
  selectedMode = "multi";
  joinGamePop.style.display = "block";
  createGamePop.style.display = "none";
  type = "join";
  Player = "player2";
};

let sumbit = document.querySelector("#sumbit");
let mModeMissing = document.querySelector("#mModeMissing");
let jIdMissing = document.querySelector("#jIdMissing");
let jIdWrong = document.querySelector("#jIdWrong");
let joinID = "";
let joinGameID = document.querySelector("#joinGameID");
let check = "";

sumbit.addEventListener("click", async () => {
  if (type !== "") {
    uiUpdateBSY(muName);
    mModeMissing.style.display = "none";
    if (type === "join") {
      joinID = joinGameID.value;
      if (joinID === "") {
        setTimeOut3000(jIdMissing);
        console.log("enter id");
        return;
      }
      check = await checkJoinId(joinID);
      if (!check) {
        setTimeOut3000(jIdWrong);
        console.log("Game ID does not exist");
        return;
      }
      modal2.hide();
      gameId = joinID;
      console.log("Joined Game ID: " + joinID);
      Player = "player2";
      jsendData();
      getData();
      startListning();
    } else if (type === "create") {
      modal2.hide();
      csendData();
      console.log("Created Game ID: " + gameId);
      Player = "player1";
      getData();
      startListning();
    }
  } else {
    mModeMissing.style.display = "block";
    setTimeout(() => {
      mModeMissing.style.display = "none";
    }, 3000);
  }
});

const csendData = () => {
  set(ref(db, "rps/" + gameId), {
    gameId: gameId,
    username1: muName,
    move: "",
    username2: "",
    move2: "",
    ready1: false,
    ready2: false,
    newgame: false,
    rstgame1: false,
    rstgame2: false,
    rstgamedone1: false,
    rstgamedone2: false,
    cancelrst: false,
  });
};

const jsendData = () => {
  update(ref(db, "rps/" + gameId), {
    username2: muName,
  });
};

const checkJoinId = async (ID) => {
  const data = await get(ref(db, "rps/" + ID));
  return data.exists();
};

const getData = () => {
  get(ref(db, "rps/" + gameId)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  });
};

function generateGameId() {
  return "rps-" + Math.random().toString(36).substring(2, 8);
}

let copyBtn = document.querySelector("#copyBtn");
let msg = document.querySelector("#copyMsg");

copyBtn.addEventListener("click", function () {
  let gameId2 = createGameID.value;

  navigator.clipboard.writeText(gameId2).then(() => {
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 1500);
  });
});

let OTC = false; // One Time Choice

// joinGameStarts()
function startListning() {
  onValue(ref(db, "rps/" + gameId), (data) => {
    const gameData = data.val();
    if (gameData.username1 === "" || gameData.username2 === "") {
    } else {
      Player === "player1"
        ? (uiOppoName = gameData.username2)
        : (uiOppoName = gameData.username1);
      uiUpdateBSO(uiOppoName);
    }
    if (gameData.newgame) {
      newModal.show();
    }
    if (
      (gameData.rstgame1 && !gameData.rstgame2 && Player === "player2") ||
      (gameData.rstgame2 && !gameData.rstgame1 && Player === "player1")
    ) {
      rstModal.show();
    }
    if (gameData.cancelrst) cancelMsg();
    if (gameData.rstgame1 && gameData.rstgame2) resetGameDoneTrue();
    else if (gameData.rstgamedone1 || gameData.rstgamedone2) resetGameDone();
    else if (gameData.rstgame1 || gameData.rstgame2) return;
    else if (gameData.ready1 && gameData.ready2) {
      update(ref(db, "rps/" + gameId), {
        move: "",
        move2: "",
        ready1: false,
        ready2: false,
      });
      OTC = false;
      selectBoxWaiting.style.display = "none";
      selectBox2.style.display = "block";
      console.log("both rdy");
    } else if (gameData.move !== "" && gameData.move2 !== "") {
      console.log("Both players moves done");
      Player === "player1"
        ? (yourMove = gameData.move)
        : (yourMove = gameData.move2);
      Player === "player1"
        ? (yourName = gameData.username1)
        : (yourName = gameData.username2);
      Player === "player1"
        ? (opponentMove = gameData.move2)
        : (opponentMove = gameData.move);
      Player === "player1"
        ? (opponentName = gameData.username2)
        : (opponentName = gameData.username1);
      console.log(yourName + "'s Move: " + yourMove);
      console.log(opponentName + "'s Move: " + opponentMove);
      animationShow(yourMove, opponentMove);
      setTimeout(() => {
        winnerFinder(yourMove, opponentMove, yourName, opponentName);
        console1(yourMove, opponentMove);
      }, 2000);
    }
  });
}

function animationShow(right, left) {
  // right = you , left = oppo
  xyz.forEach((x) => {
    x.classList.add("d-none");
  });
  r1.style.display = "block";
  r2.style.display = "block";
  bgImg.style.display = "none";
  bgImg2.style.display = "none";
  if (right === "rock") showTimeOut(rockUser1);
  else if (right === "paper") showTimeOut(paperUser1);
  else if (right === "scissor") showTimeOut(scissorUser1);
  if (left === "rock") showTimeOut(rockUser2);
  else if (left === "paper") showTimeOut(paperUser2);
  else if (left === "scissor") showTimeOut(scissorUser2);
}
function showTimeOut(ele) {
  setTimeout(() => {
    r1.style.display = "none";
    r2.style.display = "none";
  }, 1900);
  setTimeout(() => {
    ele.style.display = "block";
    ele.classList.add("show-pop");
  }, 2000);
}

let xyz = document.querySelectorAll(".xyz");
let r1 = document.querySelector("#rockuser1_");
let r2 = document.querySelector("#rockuser2_");
let rockUser1 = document.querySelector("#rock-user1");
let paperUser1 = document.querySelector("#paper-user1");
let scissorUser1 = document.querySelector("#scissor-user1");
let rockUser2 = document.querySelector("#rock-user2");
let paperUser2 = document.querySelector("#paper-user2");
let scissorUser2 = document.querySelector("#scissor-user2");
let bgImg = document.querySelector("#bg-img");
let bgImg2 = document.querySelector("#bg-img2");
let allUserUiImgs = document.querySelectorAll(
  "#rock-user1, #paper-user1, #scissor-user1, #rock-user2, #paper-user2, #scissor-user2"
);

//
let uName1 = document.querySelector("#uname1");
let uName2 = document.querySelector("#uname2");
let consoleUNameUp1 = document.querySelector("#consoleUNameUp1");
let consoleUNameUp2 = document.querySelector("#consoleUNameUp2");
let footerp1c = document.querySelector("#footerp1c");
let footerp2c = document.querySelector("#footerp2c");
let footerdrc = document.querySelector("#footerdrc");
let selectBox1 = document.querySelector("#selectBox1");
let selectBox2 = document.querySelector("#selectBox2");
let selectBoxYWon = document.querySelector("#selectBoxYWon");
let selectBoxOWon = document.querySelector("#selectBoxOWon");
let selectBoxBtn = document.querySelector("#selectBoxBtn");
let selectBoxWaiting = document.querySelector("#selectBoxWaiting");

function uiUpdateBSO(oName) {
  uName2.textContent = oName;
  consoleUNameUp2.textContent = oName;
  footerp2c.textContent = oName + ` Win's :- ${p2c}`;
}

function uiUpdateBSY(yName) {
  uName1.textContent = yName;
  consoleUNameUp1.textContent = yName;
  footerp1c.textContent = yName + " Win's :- ";
}

function winnerFinder(yMove, oMove, yName, oName) {
  if (!yMove || !oMove) {
    console.log("waiting for moves");
    return;
  }
  if (yMove === oMove) {
    drawPrinter(yMove);
    updateDrawScore();
    console.log("It's a Tie!");
  } else if (
    (yMove === "rock" && oMove === "scissor") ||
    (yMove === "paper" && oMove === "rock") ||
    (yMove === "scissor" && oMove === "paper")
  ) {
    uiUpdateY(yName);
    updatePlayer1Score(yName);
    console.log(yName + " Wins! you");
  } else {
    uiUpdateO(oName);
    updatePlayer2Score(oName);
    console.log(oName + " Wins! opponent");
  }
}

function uiUpdateY(winnerName) {
  selectBox1.style.display = "block";
  selectBox2.style.display = "none";
  selectBoxYWon.style.display = "block";
  selectBoxYWon.innerText = winnerName + " WON";
}

function uiUpdateO(winnerName) {
  selectBox1.style.display = "block";
  selectBox2.style.display = "none";
  selectBoxOWon.style.display = "block";
  selectBoxOWon.innerText = winnerName + " WON";
}

selectBoxBtn.addEventListener("click", () => {
  selectBox1.style.display = "none";
  selectBoxYWon.style.display = "none";
  selectBoxOWon.style.display = "none";
  allUserUiImgs.forEach((ele) => {
    ele.style.display = "none";
    ele.classList.remove("show-pop");
  });
  xyz.forEach((x) => {
    x.classList.remove("d-none");
  });
  bgImg.style.display = "block";
  bgImg2.style.display = "block";
  rock.classList.remove("b-red");
  paper.classList.remove("b-red");
  scissor.classList.remove("b-red");
  if (selectedMode === "solo") {
    console.log("Solo Mode Rst");
    yourMove = "";
    opponentMove = "";
    selectBox2.style.display = "block";
    OTC = false;
  } else if (Player === "player1") {
    selectBoxWaiting.style.display = "block";
    console.log("check ready1");
    update(ref(db, "rps/" + gameId), {
      ready1: true,
      move: "",
    });
  } else {
    selectBoxWaiting.style.display = "block";
    console.log("check ready2");
    update(ref(db, "rps/" + gameId), {
      ready2: true,
      move: "",
    });
  }
});

function drawPrinter(move) {
  selectBox1.style.display = "block";
  selectBox2.style.display = "none";
  selectBoxYWon.style.display = "block";
  selectBoxOWon.style.display = "block";
  selectBoxYWon.innerText = "Both Chose " + move.toUpperCase();
  selectBoxOWon.innerText = "It's a TIE!";
}

function focus(ele, check) {
  if (check === 1) ele.classList.add("b-red");
  else ele.classList.remove("b-red");
}

// solo game

function randomMoveGenerator() {
  const moves = ["rock", "paper", "scissor"];
  const randomIndex = Math.floor(Math.random() * 3);
  return moves[randomIndex];
}

function handelRock() {
  if (OTC === true) return;
  OTC = true;
  focus(rock, 1);
  if (selectedMode === "solo") {
    yourMove = "rock";
    opponentMove = randomMoveGenerator();
    console.log("Opponent chose: " + opponentMove);
    animationShow(yourMove, opponentMove);
    setTimeout(() => {
      winnerFinder(yourMove, opponentMove, suName, "Computer");
      console1(yourMove, opponentMove);
    }, 2000);
  } else {
    if (OTC === true) return;
    OTC = true;
    update(ref(db, "rps/" + gameId), {
      [Player === "player1" ? "move" : "move2"]: "rock",
    });
  }
}

function handelPaper() {
  if (OTC === true) return;
  OTC = true;
  focus(paper, 1);
  if (selectedMode === "solo") {
    yourMove = "paper";
    opponentMove = randomMoveGenerator();
    console.log("Opponent chose: " + opponentMove);
    animationShow(yourMove, opponentMove);
    setTimeout(() => {
      winnerFinder(yourMove, opponentMove, suName, "Computer");
      console1(yourMove, opponentMove);
    }, 2000);
  } else {
    update(ref(db, "rps/" + gameId), {
      [Player === "player1" ? "move" : "move2"]: "paper",
    });
  }
}

function handelScissor() {
  if (OTC === true) return;
  OTC = true;
  focus(scissor, 1);
  if (selectedMode === "solo") {
    yourMove = "scissor";
    opponentMove = randomMoveGenerator();
    console.log("Opponent chose: " + opponentMove);
    animationShow(yourMove, opponentMove);
    setTimeout(() => {
      winnerFinder(yourMove, opponentMove, suName, "Computer");
      console1(yourMove, opponentMove);
    }, 2000);
  } else {
    update(ref(db, "rps/" + gameId), {
      [Player === "player1" ? "move" : "move2"]: "scissor",
    });
  }
}

const updatePlayer1Score = (name) => {
  p1c++;
  footerp1c.innerText = name + " Win's :- " + p1c;
};

const updatePlayer2Score = (name) => {
  p2c++;
  footerp2c.innerText = name + " Win's :- " + p2c;
};

const updateDrawScore = (name) => {
  drc++;
  footerdrc.innerText = "_Draw Matches_ :- " + drc;
};

// same things

rock.addEventListener("click", handelRock);
paper.addEventListener("click", handelPaper);
scissor.addEventListener("click", handelScissor);

// console
let serialNo = document.querySelector("#serialNo");
let consoleP1 = document.querySelector("#consoleP1");
let consoleP2 = document.querySelector("#consoleP2");
let consoleMain = document.querySelector("#consoleMain");
let consoleDiv = document.querySelector("#console");
let consoleX = document.querySelector("#console-x");
let consoleS = document.querySelector("#console-s");

const console1 = (user1, user2) => {
  let sNoC = document.createElement("p");
  let p1 = document.createElement("p");
  let p2 = document.createElement("p");
  sNoC.innerText = srNo;
  p1.innerText = user1;
  p2.innerText = user2;
  srNo++;
  serialNo.append(sNoC);
  consoleP1.append(p1);
  consoleP2.append(p2);
  consoleMain.scrollTop = consoleMain.scrollHeight;
};

const consoleOpener = () => {
  consoleDiv.style.display = "block";
  gameZone.classList.add("col-md-7");
};

const consoleClose = () => {
  consoleDiv.style.display = "none";
  gameZone.classList.remove("col-md-7");
};

consoleX.addEventListener("click", consoleClose);
consoleS.addEventListener("click", consoleOpener);

// screen mode change light dark
let screenMode = document.querySelector("#screenMode");
let nav = document.querySelector("nav");
let footer = document.querySelector("footer");

const modechanger = () => {
  if (screenMode.innerText === "🌞") {
    lightMode();
    screenMode.innerText = "🌙";
  } else if (screenMode.innerText === "🌙") {
    darkMode();
    screenMode.innerText = "🌞";
  }
};

function lightMode() {
  body.classList.add("bg-secondary-subtle");
  body.classList.remove("bg-black");
  nav.classList.add("bg-primary");
  nav.classList.remove("bg-body-tertiary");
  nav.setAttribute("data-bs-theme", "");
  footer.classList.add("bg-primary");
  footer.classList.remove("bg-dark");
  consoleDiv.classList.add("bg-secondary");
  consoleDiv.classList.remove("bg-dark");
}

function darkMode() {
  body.classList.add("bg-black");
  body.classList.remove("bg-secondary-subtle");
  nav.classList.add("bg-body-tertiary");
  nav.classList.remove("bg-primary");
  nav.setAttribute("data-bs-theme", "dark");
  footer.classList.add("bg-dark");
  footer.classList.remove("bg-primary");
  consoleDiv.classList.add("bg-dark");
  consoleDiv.classList.remove("bg-secondary");
}

screenMode.addEventListener("click", modechanger);

// new game
let newGame = document.querySelector("#newGame");
let newGameModal = document.querySelector("#newgame");
let newModal = new bootstrap.Modal(newGameModal);

function pageReload() {
  location.reload();
}

function updateNewGame() {
  update(ref(db, "rps/" + gameId), {
    newgame: true,
  });
}

newGame.addEventListener("click", () => {
  pageReload();
  updateNewGame();
});

// reset game

let resetGame = document.querySelector("#resetGame");
let rstCancel = document.querySelector("#rstCancel");
let rstDone = document.querySelector("#rstDone");
let lveGame = document.querySelector("#lveGame");
let rstGameModal = document.querySelector("#rstGame");
let rstModal = new bootstrap.Modal(rstGameModal);
let rstGameCancelModal = document.querySelector("#rstGameCancel");
let rstModal2 = new bootstrap.Modal(rstGameCancelModal);

function resetCheck() {
  if (selectedMode === "solo") {
    reset();
  } else {
    update(ref(db, "rps/" + gameId), {
      move: "",
      move2: "",
      ready1: false,
      ready2: false,
      ...(Player === "player1" ? { rstgame1: true } : { rstgame2: true }),
    });

    selectBox2.style.display = "none";
    selectBoxWaiting.style.display = "block";
  }
}

function reset() {
  console.log("Resetting game...");
  if (selectedMode === "solo") {
    resetHelper();
  } else {
    resetHelper();
    update(ref(db, "rps/" + gameId), {
      move: "",
      move2: "",
      ready1: false,
      ready2: false,
      rstgame1: false,
      rstgame2: false,
      newgame: false,
    });

    OTC = false;
    rstModal.hide();
  }
}

function resetHelper() {
  OTC = false;
  p1c = 0;
  p2c = 0;
  drc = 0;
  srNo = 1;

  footerp1c.innerText = uName1.textContent + " Win's :- 0";
  footerp2c.innerText = uName2.textContent + " Win's :- 0";
  footerdrc.innerText = "_Draw Matches_ :- 0";

  selectBox1.style.display = "none";
  selectBoxYWon.style.display = "none";
  selectBoxOWon.style.display = "none";
  selectBoxWaiting.style.display = "none";
  selectBox2.style.display = "block";

  rock.classList.remove("b-red");
  paper.classList.remove("b-red");
  scissor.classList.remove("b-red");

  allUserUiImgs.forEach((ele) => {
    ele.style.display = "none";
    ele.classList.remove("show-pop");
  });

  xyz.forEach((x) => x.classList.remove("d-none"));
  bgImg.style.display = "block";
  bgImg2.style.display = "block";

  let pList1 = document.querySelectorAll("#serialNo p");
  pList1.forEach((p) => {
    p.remove();
  });
  let pList2 = document.querySelectorAll("#consoleP1 p");
  pList2.forEach((p) => {
    p.remove();
  });
  let pList3 = document.querySelectorAll("#consoleP2 p");
  pList3.forEach((p) => {
    p.remove();
  });
}

resetGame.addEventListener("click", () => {
  resetCheck();
});

rstDone.addEventListener("click", () => {
  resetCheck();
});

rstCancel.addEventListener("click", () => {
  update(ref(db, "rps/" + gameId), {
    cancelrst: true,
  });
});

async function cancelMsg() {
  const snap = await get(ref(db, "rps/" + gameId));
  if (!snap.exists()) return;

  const gameData = snap.val();
  if (
    (gameData.rstgame1 && !gameData.rstgame2 && Player === "player1") ||
    (gameData.rstgame2 && !gameData.rstgame1 && Player === "player2")
  ) {
    rstModal2.show();
  }

  update(ref(db, "rps/" + gameId), {
    rstgame1: false,
    rstgame2: false,
    cancelrst: false,
  });
}

function resetGameDoneTrue() {
  update(ref(db, "rps/" + gameId), {
    rstgamedone1: true,
    rstgamedone2: true,
    rstgame1: false,
    rstgame2: false,
  });
}
function resetGameDone() {
  if (Player === "player1") {
    update(ref(db, "rps/" + gameId), {
      rstgamedone1: false,
    });
    reset();
  } else {
    update(ref(db, "rps/" + gameId), {
      rstgamedone2: false,
    });
    reset();
  }
}

lveGame.addEventListener("click", () => {
  pageReload();
  updateNewGame();
});

// modal
let modal;
let modeMissing = document.querySelector("#modeMissing");

window.addEventListener("DOMContentLoaded", () => {
  const modalElement = document.getElementById("welcomeModal");
  modal = new bootstrap.Modal(modalElement);
  modal.show();
});

modalCheck.addEventListener("click", () => {
  if (selectedMode !== "") {
    modeMissing.style.display = "none";
    modal.hide();
    uiUpdateBSY(suName);
    uiUpdateBSO("AI");
  } else {
    modeMissing.style.display = "block";
    setTimeout(() => {
      modeMissing.style.display = "none";
    }, 3000);
  }
});

console.log("Selected Mode: " + selectedMode);

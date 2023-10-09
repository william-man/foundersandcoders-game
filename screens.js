//change acitive screen
function changeActive(id) {
  const screens = document.getElementsByClassName("screen");
  for (let i = 0; i < screens.length; i++) {
    if (!screens[i].classList.contains("screen-inactive")) {
      screens[i].classList.remove("screen-active");
      screens[i].classList.add("screen-inactive");
    }
  }
  const screen = document.getElementById(id);
  screen.classList.remove("screen-inactive");
  screen.classList.add("screen-active");
}

//back to start-screen
function backToStart() {
  const screens = document.getElementsByClassName("screen");
  for (let i = 0; i < screens.length; i++) {
    if (!screens[i].classList.contains("screen-inactive")) {
      screens[i].classList.remove("screen-active");
      screens[i].classList.add("screen-inactive");
    }
  }
  const screen = document.getElementById("start-screen");
  screen.classList.remove("screen-inactive");
  screen.classList.add("screen-active");
}

//change game-screen-start state
function start(state) {
  const start = document.getElementById("game-screen-start");
  if (state) {
    start.classList.remove("game-screen-inactive");
    start.classList.add("game-screen-active");
  } else {
    start.classList.remove("game-screen-active");
    start.classList.add("game-screen-inactive");
  }
}

//change gmae-screen lose state
function lose(state) {
  const lose = document.getElementById("game-screen-lose");
  if (!state) {
    lose.classList.remove("game-screen-active");
    lose.classList.add("game-screen-inactive");
  }
}

//change gmae-screen win state
function win(state) {
  const win = document.getElementById("game-screen-win");
  if (!state) {
    win.classList.remove("game-screen-active");
    win.classList.add("game-screen-inactive");
  }
}
//change text on the pause button
function pause() {
  const pause = document.getElementById("start-pause-pause");
  const gameScreen = document.getElementById("game-screen");
  const pauseScreen = document.getElementById("game-screen-pause");
  if (gameScreen.classList.contains("screen-active")) {
    if (pause.innerText === "Pause") {
      pause.innerText = "Play";
      pauseScreen.classList.remove("game-screen-inactive");
      pauseScreen.classList.add("game-screen-active");
    } else {
      pause.innerText = "Pause";
      pauseScreen.classList.remove("game-screen-active");
      pauseScreen.classList.add("game-screen-inactive");
    }
  } else {
    pause.innerText = "Pause";
    pauseScreen.classList.remove("game-screen-active");
    pauseScreen.classList.add("game-screen-inactive");
  }
}

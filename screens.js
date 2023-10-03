function changeActive(id) {
  const screens = document.getElementsByClassName("screen");
  console.log(screens);
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

function pause() {
  const pause = document.getElementById("start-pause-pause");
  if (pause.innerText === "Pause") {
    pause.innerText = "Play";
  } else {
    pause.innerText = "Pause";
  }
}

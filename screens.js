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
  console.log(screens);
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

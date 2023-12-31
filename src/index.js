const canvas = document.getElementById("game-canvas-screen");
const ctx = canvas.getContext("2d");

///
/// Defender class
///

class Defender {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.bulletv = 10;
    this.bulletx = this.x;
    this.bullety = this.y - 50;
    //animate more bullets fired
    this.bullets = [];
    this.strafe = 10;
  }

  moveLeft() {
    this.x -= this.strafe;
  }

  moveRight() {
    this.x += this.strafe;
  }

  drawDefender() {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.clearRect(this.x - 20, this.y - 25, 40, 25);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 20, this.y);
    ctx.lineTo(this.x + 20, this.y - 12.5);
    ctx.lineTo(this.x + 5, this.y - 12.5);
    ctx.lineTo(this.x + 5, this.y - 25);
    ctx.lineTo(this.x - 5, this.y - 25);
    ctx.lineTo(this.x - 5, this.y - 12.5);
    ctx.lineTo(this.x - 20, this.y - 12.5);
    ctx.lineTo(this.x - 20, this.y);
    ctx.lineTo(this.x, this.y);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
  }

  drawBullet(bullet) {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x - 3, bullet.y - 25, 6, 10);
  }

  bulletTravel() {
    this.bullety -= this.bulletv;
  }
  //add bullet to list on click
  bulletFire() {
    const bullet = {
      x: this.x,
      y: this.y - 12,
    };
    this.bullets.push(bullet);
  }

  updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.y -= this.bulletv;
      if (bullet.y < 0) {
        //remove bullet if y is less than 0 or collides with an alien
        this.bullets.splice(i, 1);
        i--;
      } else if (
        aliens_r1.checkCollision(bullet) ||
        aliens_r2.checkCollision(bullet) ||
        aliens_r3.checkCollision(bullet)
      ) {
        this.bullets.splice(i, 1);
        i--;
        addScore();
        if (
          horde[0].aliens.length === 0 &&
          horde[1].aliens.length === 0 &&
          horde[2].aliens.length === 0
        ) {
          stopAnimate();
          document.getElementById("start-pause-pause").disabled = true;
          const win = document.getElementById("game-screen-win");
          win.classList.remove("game-screen-inactive");
          win.classList.add("game-screen-active");
        }
      } else {
        ctx.clearRect(bullet.x - 3, bullet.y - 25, 6, 12);
        ctx.beginPath();
        this.drawBullet(bullet);
      }
    }
  }

  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height * 0.9;
    this.bullets = [];
  }
}

///
/// Alien class
///

class Aliens {
  constructor(amount, spawn, colour) {
    this.x = 0;
    this.y = 0;
    this.amount = amount;
    this.svg =
      '<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 512 512" xml:space="preserve"> <path id="alien" style="fill:#AC92EC;" d="M469.344,266.664v-85.328h-42.656v-42.672H384v-21.328h42.688v-64h-64v42.656H320v42.672H192V95.992 h-42.656V53.336h-64v64H128v21.328H85.344v42.672H42.688v85.328H0v149.328h64v-85.328h21.344v85.328H128v42.672h106.688v-64h-85.344 v-21.328h213.344v21.328h-85.344v64H384v-42.672h42.688v-85.328H448v85.328h64V266.664H469.344z M192,245.336h-64v-64h64V245.336z M384,245.336h-64v-64h64V245.336z"/> </svg>';
    this.img = new Path2D(
      "M469.344,266.664v-85.328h-42.656v-42.672H384v-21.328h42.688v-64h-64v42.656H320v42.672H192V95.992 h-42.656V53.336h-64v64H128v21.328H85.344v42.672H42.688v85.328H0v149.328h64v-85.328h21.344v85.328H128v42.672h106.688v-64h-85.344 v-21.328h213.344v21.328h-85.344v64H384v-42.672h42.688v-85.328H448v85.328h64V266.664H469.344z M192,245.336h-64v-64h64V245.336z M384,245.336h-64v-64h64V245.336z"
    );
    //alien list
    this.aliens = [];
    this.spawn = spawn;
    this.colour = colour;
  }

  aliensList() {
    for (let i = 0; i < this.amount; i++) {
      const alienX = this.x * i;

      //get bounding box of alien shape
      const svgDoc = new DOMParser().parseFromString(this.svg, "image/svg+xml"); //parse svg path data with DOMParser
      const svgPath = svgDoc.querySelector("#alien"); //select path element to access path data
      const pathData = svgPath.getAttribute("d"); // access the d attribute
      const tempSvg = document.createElementNS(
        //create temporary svg element
        "http://www.w3.org/2000/svg",
        "svg"
      );

      const tempPath = document.createElementNS(
        //create temporary path element
        "http://www.w3.org/2000/svg",
        "path"
      );

      tempPath.setAttribute("d", pathData); //add d attribute to path element
      tempSvg.setAttribute("id", "temp");
      tempSvg.appendChild(tempPath); //append path element as a child to svg element
      document.body.appendChild(tempSvg); //append svg element to body
      const svgBoundingBox = tempPath.getBBox(); //get the bounding box of the svg path
      document.getElementById("temp").remove();
      const alienXCentered =
        (this.x * i + this.x * (i + 1)) / 2 - (svgBoundingBox.width / 2) * 0.09;

      this.aliens.push({
        x: alienXCentered,
        y: this.y,
        boxX: svgBoundingBox.x,
        boxY: svgBoundingBox.y,
        boxWidth: svgBoundingBox.width,
        boxHeight: svgBoundingBox.height,
      });
    }
  }

  draw() {
    for (let i = 0; i < this.aliens.length; i++) {
      const alien = this.aliens[i];
      ctx.save();
      ctx.translate(alien.x, alien.y);
      ctx.scale(0.09, 0.09);
      ctx.fillStyle = this.colour;
      ctx.fill(this.img);
      /*debug hitbox
      ctx.beginPath();
      ctx.lineWidth = "10";
      ctx.rect(alien.boxX, alien.boxY, alien.boxWidth, alien.boxHeight);
      ctx.strokeStyle = "red";
      ctx.stroke();
      */
      ctx.restore();
    }
  }
  //collision detection for bullet and alien
  checkCollision(bullet) {
    for (let i = 0; i < this.aliens.length; i++) {
      const alien = this.aliens[i];

      if (
        bullet.x >= alien.x &&
        bullet.x <= alien.x + alien.boxWidth * 0.09 &&
        bullet.y - 12 >= alien.y &&
        bullet.y - 12 <= alien.y + alien.boxHeight * 0.09
      ) {
        this.aliens.splice(i, 1);
        return true;
      }
    }
    return false; //no collision
  }

  moveDown(distance) {
    for (let i = 0; i < this.aliens.length; i++) {
      if (this.aliens[i].y < defender.y - 60) {
        this.aliens[i].y += distance;
      } else {
        stopAnimate();
        document.getElementById("start-pause-pause").disabled = true;
        const lose = document.getElementById("game-screen-lose");
        lose.classList.remove("game-screen-inactive");
        lose.classList.add("game-screen-active");
      }
    }
  }

  reset() {
    this.aliens = [];
  }
}

///
///initialise objects
///

const defender = new Defender();
const aliens_r1 = new Aliens(16, true, "#DC08A6");
const aliens_r2 = new Aliens(16, false, "#C67D67");
const aliens_r3 = new Aliens(16, false, "#4FB4CC");
const horde = [aliens_r1, aliens_r2, aliens_r3];

///
///draw game screen and change game screen states
///

let frameCount = 0;
let gameOn = false;
let player_score = 0;

function animate() {
  if (gameOn === true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    defender.drawDefender();
    defender.updateBullets();
    for (let i = 0; i < horde.length; i++) {
      if (frameCount % (60 * 3) === 0 && horde[i].spawn === true) {
        horde[i].moveDown(20);
      }
      horde[i].draw();
    }
    frameCount += 1;
    requestAnimationFrame(animate);
  } else {
    return;
  }
}
let animation = requestAnimationFrame(animate);

//animation controls
function stopAnimate() {
  gameOn = false;
}

function resumeAnimate() {
  gameOn = true;
  animate();
}

function pausePlay() {
  if (gameOn) {
    stopAnimate();
    window.removeEventListener("keydown", leftDown);
    window.removeEventListener("keydown", rightDown);
    window.removeEventListener("click", fire);
  } else {
    resumeAnimate();
    window.addEventListener("keydown", leftDown);
    window.addEventListener("keydown", rightDown);
    window.addEventListener("click", fire);
  }
}

function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("start-pause-pause").disabled = true;
  defender.reset();
  for (let i = 0; i < horde.length; i++) {
    horde[i].reset();
  }
  resetScore();
}

function resetScore() {
  player_score = 0;
  document.getElementById("game-score-points").innerText =
    "Score: " + player_score;
}

//draw objects on press start
function loadGame() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  defender.x = canvas.width / 2;
  defender.y = canvas.height * 0.9;
  defender.drawDefender();
  document.getElementById("start-pause-pause").disabled = false;
  for (let i = 0; i < horde.length; i++) {
    if (horde[i].spawn === true) {
      horde[i].x = canvas.width / horde[i].amount;
      horde[i].y = (canvas.height / 10) * (i + 1);
      horde[i].aliensList();
      horde[i].draw();
    }
  }
}

function addScore() {
  let score = document.getElementById("game-score-points");
  player_score += 100;
  score.innerText = "Score: " + player_score;
}

///
///controls
///

/*
function spaceDown(event) {
  if (event.key === " " && gameOn === false) {
    gameOn = true;
    animate();
  }
}
*/
function leftDown(e) {
  if (e.key === "a" && defender.x - 45 > 0) {
    defender.moveLeft();
    defender.update = true;
  }
}
function rightDown(e) {
  if (e.key === "d" && defender.x + 45 < canvas.width) {
    defender.moveRight();
    defender.update = true;
  }
}
function fire(e) {
  defender.bulletFire();
}
//window.addEventListener("keydown", spaceDown);
window.addEventListener("keydown", leftDown);
window.addEventListener("keydown", rightDown);
window.addEventListener("click", fire);

//settings

function difficultyChange() {
  const level = document.getElementById("settings-difficulty").value;
  switch (level) {
    case "easy":
      aliens_r1.spawn = true;
      aliens_r2.spawn = false;
      aliens_r3.spawn = false;
      break;
    case "normal":
      aliens_r1.spawn = true;
      aliens_r2.spawn = true;
      aliens_r3.spawn = false;
      break;
    case "hard":
      aliens_r1.spawn = true;
      aliens_r2.spawn = true;
      aliens_r3.spawn = true;
      break;
    default:
      aliens_r1.spawn = true;
      aliens_r2.spawn = false;
      aliens_r3.spawn = false;
  }
}

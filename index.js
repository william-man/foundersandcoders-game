const canvas = document.getElementById("game-canvas-screen");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

class Defender {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height * 0.9;
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
      if (bullet.y < 0 || aliens_r1.checkCollision(bullet)) {
        //remove bullet if y is less than 0 or collides with an alien
        this.bullets.splice(i, 1);
        i--;
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

// draw alien, this.svg = path data from svg file

class Aliens {
  constructor(x, y, amount, spawn) {
    this.x = x / amount;
    this.y = y;
    this.amount = amount;
    this.svg =
      '<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 512 512" xml:space="preserve"> <path id="alien" style="fill:#AC92EC;" d="M469.344,266.664v-85.328h-42.656v-42.672H384v-21.328h42.688v-64h-64v42.656H320v42.672H192V95.992 h-42.656V53.336h-64v64H128v21.328H85.344v42.672H42.688v85.328H0v149.328h64v-85.328h21.344v85.328H128v42.672h106.688v-64h-85.344 v-21.328h213.344v21.328h-85.344v64H384v-42.672h42.688v-85.328H448v85.328h64V266.664H469.344z M192,245.336h-64v-64h64V245.336z M384,245.336h-64v-64h64V245.336z"/> </svg>';
    this.img = new Path2D(
      "M469.344,266.664v-85.328h-42.656v-42.672H384v-21.328h42.688v-64h-64v42.656H320v42.672H192V95.992 h-42.656V53.336h-64v64H128v21.328H85.344v42.672H42.688v85.328H0v149.328h64v-85.328h21.344v85.328H128v42.672h106.688v-64h-85.344 v-21.328h213.344v21.328h-85.344v64H384v-42.672h42.688v-85.328H448v85.328h64V266.664H469.344z M192,245.336h-64v-64h64V245.336z M384,245.336h-64v-64h64V245.336z"
    );
    //alien list
    this.aliens = [];
    this.spawn = spawn;
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
        (this.x * i + this.x * (i + 1)) / 2 - (svgBoundingBox.width / 2) * 0.05;

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
      ctx.scale(0.05, 0.05);
      ctx.fillStyle = "green";
      ctx.fill(this.img);

      ctx.beginPath();
      ctx.lineWidth = "10";
      ctx.rect(alien.boxX, alien.boxY, alien.boxWidth, alien.boxHeight);
      ctx.strokeStyle = "red";
      ctx.stroke();

      ctx.restore();
    }
  }
  //collision detection for bullet and alien
  checkCollision(bullet) {
    for (let i = 0; i < this.aliens.length; i++) {
      const alien = this.aliens[i];

      if (
        bullet.x >= alien.x &&
        bullet.x <= alien.x + alien.boxWidth * 0.05 &&
        bullet.y - 12 >= alien.y &&
        bullet.y - 12 <= alien.y + alien.boxHeight * 0.05
      ) {
        this.aliens.splice(i, 1);
        return true;
      }
    }
    return false; //no collision
  }

  moveDown(distance) {
    for (let i = 0; i < this.aliens.length; i++) {
      if (this.aliens[i].y < defender.y - 50) {
        this.aliens[i].y += distance;
      } else {
        stopAnimate();
      }
    }
  }

  reset() {
    this.aliens = [];
  }
}

//initialise objects

const defender = new Defender();
const aliens_r1 = new Aliens(canvas.width, canvas.height / 10, 20, true);
const aliens_r2 = new Aliens(canvas.width, (canvas.height / 10) * 2, 20, false);
const aliens_r3 = new Aliens(canvas.width, (canvas.height / 10) * 3, 20, false);
const horde = [aliens_r1];

//draw game screen and change game screen states

let frameCount = 0;
let animateAliens = false;
let gameOn = false;

function animate() {
  if (gameOn === true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    defender.drawDefender();
    defender.updateBullets();
    if (animateAliens === true && frameCount % (60 * 3) === 0) {
      aliens_r1.moveDown(20);
    }
    aliens_r1.draw();
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
  animateAliens = true;
  animate();
}

function pausePlay() {
  if (gameOn) {
    stopAnimate();
  } else {
    resumeAnimate();
  }
}

function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  defender.reset();
  defender.drawDefender();
  for (let i = 0; i < horde.length; i++) {
    if (horde[i].spawn) {
      horde[i].reset();
      horde[i].aliensList();
      horde[i].draw();
    }
  }
}

//draw objects on load

window.addEventListener("load", function (e) {
  defender.drawDefender();
  for (let i = 0; i < horde.length; i++) {
    if (horde[i].spawn === true) {
      horde[i].aliensList();
      horde[i].draw();
    }
  }
});

//controls

function spaceDown(event) {
  if (event.key === " " && gameOn === false) {
    animateAliens = true;
    gameOn = true;
    animate();
  }
}
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
window.addEventListener("keydown", spaceDown);
window.addEventListener("keydown", leftDown);
window.addEventListener("keydown", rightDown);
canvas.addEventListener("click", fire);

//settings

function easy() {
  aliens_r1.spawn = true;
  aliens_r2.spawn = false;
  aliens_r3.spawn = false;
}

function normal() {
  aliens_r1.spawn = true;
  aliens_r2.spawn = true;
  aliens_r3.spawn = false;
}

function hard() {
  aliens_r1.spawn = true;
  aliens_r2.spawn = true;
  aliens_r3.spawn = true;
}

function defenderSpeed(value) {
  defender.strafe = value;
}

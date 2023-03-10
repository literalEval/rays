const EQUAL = 187;
const MINUS = 189;

let width_height;
let lightX;
let lightY;
let lineLen;
let lightAngle = -90;
let walls = [];
let newWall = [];

let rayColor = "#ffffff";
let colorBox = document.getElementById("color-input");
colorBox.addEventListener("change", (e) => {
  // console.log(e.target.value);
  rayColor = e.target.value;
});

let lightViewPort = 90;
let angleBox = document.getElementById("angle-input");
angleBox.addEventListener("change", (e) => {
  // console.log(e.target.value);
  lightViewPort = +e.target.value;
});
angleBox.addEventListener("submit", (e) => {
  // console.log(e.target.value);
  lightViewPort = +e.target.value;
});

function setup() {
  width_height = windowHeight * 0.6;
  lightX = lightY = windowHeight / 2;
  lineLen = lightX + width_height - 400;

  // createCanvas(windowHeight * 0.8, windowHeight * 0.8);
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(mouseEvent) {
  // console.log(mouseEvent);
  newWall = [[mouseX, mouseY]];
}

function mouseReleased(mouseEvent) {
  newWall.push([mouseX, mouseY]);
  walls.push(newWall);
  newWall = [];
}

function keyPressed(keyEvent) {
  if (keyEvent.code == "KeyF") {
    walls.pop();
  } else if (keyEvent.code == "Equal") {
    lightViewPort < 360 ? lightViewPort++ : 0;
  } else if (keyEvent.code == "Minus") {
    lightViewPort > 0 ? lightViewPort-- : 0;
  }

  console.log(keyEvent.code);
}

function draw() {
  if (keyIsDown(SHIFT)) {
    lightsOn(walls);
    return;
  }

  keyIsDown(UP_ARROW)
    ? keyIsDown(CONTROL)
      ? (lineLen += 2)
      : (lightY -= 5)
    : 0;
  keyIsDown(DOWN_ARROW)
    ? keyIsDown(CONTROL)
      ? (lineLen -= 2)
      : (lightY += 5)
    : 0;
  keyIsDown(LEFT_ARROW)
    ? keyIsDown(CONTROL)
      ? (lightAngle -= 1)
      : (lightX -= 5)
    : 0;
  keyIsDown(RIGHT_ARROW)
    ? keyIsDown(CONTROL)
      ? (lightAngle += 1)
      : (lightX += 5)
    : 0;
  keyIsDown(EQUAL) ? (lightViewPort < 360 ? lightViewPort++ : 0) : 0;
  keyIsDown(MINUS) ? (lightViewPort > 0 ? lightViewPort-- : 0) : 0;

  background(0);
  fill(255, 255, 255, 255);

  strokeWeight(6);

  for (let i = lightAngle + 0; i < lightAngle + lightViewPort; i += 0.5) {
    let endX = lineLen * cos((i * Math.PI) / 180) + lightX;
    let endY = lineLen * sin((i * Math.PI) / 180) + lightY;
    let { colPoint, doesCollide } = getCollisionPoint(endX, endY);

    stroke(rayColor + "cc");
    line(lightX, lightY, colPoint.x, colPoint.y);

    if (doesCollide) {
      stroke("#538C5F");
      point(colPoint.x, colPoint.y);
    }
  }

  stroke("#a040a0ff");
  circle(lightX, lightY, 6);
}

function getCollisionPoint(endX, endY) {
  let x1 = lightX,
    y1 = lightY,
    x2 = endX,
    y2 = endY;

  let minDist = Math.sqrt((endX - lightX) ** 2 + (endY - lightY) ** 2);
  let colPoint = { x: endX, y: endY };
  let doesCollide = false;

  walls.forEach((wall, index) => {
    let x3 = wall[0][0],
      y3 = wall[0][1],
      x4 = wall[1][0],
      y4 = wall[1][1];

    let t =
      ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    let u =
      ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if (t >= 0 && t < 1 && u >= 0 && u < 1) {
      let colX = x3 + u * (x4 - x3);
      let colY = y3 + u * (y4 - y3);

      let dist = Math.sqrt((colX - lightX) ** 2 + (colY - lightY) ** 2);
      if (dist < minDist) {
        minDist = dist;
        colPoint = { x: colX, y: colY };
        doesCollide = true;
      }
    }
  });

  return { colPoint, doesCollide };
}

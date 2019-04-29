// Deciated to Brenda <3

const RANDOM_MODE_A = 0;
const RANDOM_MODE_B = 1;

const STEP_MODE_RANDOM = 0;
const STEP_MODE_FIXED = 1;
const FIXED_INTERVAL = 0.005;

// SETTINGS
let useRandomColors = false;
let randomMode = RANDOM_MODE_B;
let stepMode = STEP_MODE_RANDOM;
// let startColors = [[245, 37, 218], [37, 236, 245]];
let startColors = ["#2d7ad4", "#46c98f"];
// END SETTINGS

let gameWidth = 600;
let gameHeight = 600;


window.setup = function setup() {
  createCanvas(gameWidth, gameHeight);

  gridSize = 20;
  width = gameWidth / gridSize;
  height = gameHeight / gridSize;

  values = {};
  directions = {};
  colorQueue = {};

  if (typeof startColors === "undefined") _startColors = [];
  else if (startColors) {
    _startColors = startColors.map(data =>
      color(...(typeof data === "string" ? [data] : data))
    );
  }

  for (let i = 0; i < gridSize ** 2; i++) {
    values[i] = Math.random();
    directions[i] = Math.random() > 0.5 ? 1 : -1;
    colorQueue[i] = [...(_startColors || [])];
  }

  for (let i = 0; i < gridSize ** 2; i++) {
    while (colorQueue[i].length <= 2) {
      let nextColor = randomColor();
      for (let j = 0; j < gridSize ** 2; j++) {
        colorQueue[j].push(nextColor);
      }
    }
  }
};

let randomColor = function() {};
if (randomMode == 1) {
  randomColor = () =>
    color(
      parseInt(Math.random() * 255),
      parseInt(Math.random() * 255),
      parseInt(Math.random() * 255)
    );
} else {
  randomColor = () =>
    color("#" + (((1 << 24) * Math.random()) | 0).toString(16));
}

window.draw = function draw() {
  background(0);

  for (let i = 0; i < gridSize ** 2; i++) {
    let xPos = (i % gridSize) * width;
    let yPos = parseInt(i / gridSize) * height;

    {
      let delta;
      if (stepMode == STEP_MODE_RANDOM) {
        delta = Math.random() / 80;
      } else if (stepMode == STEP_MODE_FIXED) {
        delta = FIXED_INTERVAL;
      }

      // Access value once for optimisation
      let value = values[i];
      let direction = directions[i];

      let newVal = value + direction * delta;
      if (newVal > 1 || newVal < 0) {
        if (useRandomColors) {
          while (colorQueue[i].length <= 2) {
            let newColor = randomColor();
            for (let j = 0; j < gridSize ** 2; j++) {
              colorQueue[j].push(newColor);
            }
          }
          colorQueue[i] = colorQueue[i].slice(1); // Supposedly this is faster than .shift();
        }
        direction = directions[i] = -direction;
      }
      values[i] += delta * direction;
    }

    fill(lerpColor(colorQueue[i][0], colorQueue[i][1], values[i]));

    rect(xPos, yPos, width, height);
  }
};

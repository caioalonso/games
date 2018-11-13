let canvas = document.getElementById("game");
canvas.width = 320;
canvas.height = 320;
canvas.style.display = "block";

let fps = 5
let blockSize = 10;
let gridHeight = canvas.height / blockSize;
let gridWidth = canvas.width / blockSize;

let ctx;
if (canvas.getContext) {
  ctx = canvas.getContext("2d");
  setupLoop();
} else {
  let p =
    "<p>Your browser doesn't seem to support canvas, \
            please enable this feature or update your browser.</p>";
  document.getElementById("game").insertAdjacentHTML("beforebegin", p);
}

var stop = false;
var fpsInterval, startTime, now, then, elapsed;

function setupLoop() {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  loop();
}

function loop() {
  if (stop === true) {
    return;
  }

  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    compute();
    draw();
  }
  requestAnimationFrame(loop);
}

let UP = { x: 0, y: -1 };
let DOWN = { x: 0, y: 1 };
let LEFT = { x: -1, y: 0 };
let RIGHT = { x: 1, y: 0 };

let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  clear: function() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
  }
};

let snake = {
  direction: RIGHT,
  body: [{x:5, y:5}, {x:4, y:5}],
  grew:false,
  step: function() {
      newBlock = {}
      newBlock.x = this.body[this.body.length - 1].x + this.direction.x
      newBlock.y = this.body[this.body.length - 1].y + this.direction.y
      this.body.push(newBlock)
      if(!this.grew) {
        this.body.shift()
      } else {
        this.grew = false;
      }
  }
};

let food = {
  x:10,
  y:10
}

window.addEventListener(
  "keydown",
  function(event) {
    switch (event.code) {
      case "ArrowLeft":
        keys.left = true;
        break;
      case "ArrowUp":
        keys.up = true;
        break;
      case "ArrowRight":
        keys.right = true;
        break;
      case "ArrowDown":
        keys.down = true;
        break;
    }
  },
  true
);

function compute() {
  changeSnakeDirection();
  snake.step();
  checkBoundaries();
  checkFood();
  keys.clear();
}

function checkBoundaries() {
  let x = snake.body[snake.body.length - 1].x
  let y = snake.body[snake.body.length - 1].y

  if(x <= 0 ||
    x >= gridWidth - 1 ||
    y <= 0 ||
    y >= gridHeight - 1) {
      stop = true;
    }
}

function checkFood() {
  let x = snake.body[snake.body.length - 1].x
  let y = snake.body[snake.body.length - 1].y
  if(x === food.x && y === food.y) {
    snake.grew = true;
    randomizeFood();
    speedUp()
  }
}

function randomizeFood() {
  let min = 1;
  let max = gridHeight-1;
  let candidate = {
    x: randomBlock(max, min),
    y: randomBlock(max, min)
  }
  if(isOnSnake(candidate)) {
    randomizeFood();
  } else {
    food = candidate;
  }
}

function randomBlock(max, min) {
  return Math.round(Math.random() * (max - min) + min)
}

function isOnSnake(candidate) {
  for(let i=0;i < snake.body.length; i++) {
    if(snake.body[i].x === candidate.x && snake.body[i].y === candidate.y) {
      return true
    }
  }
  return false;
}

function speedUp() {
  fps += 0.3;
  fpsInterval = 1000 / fps;
}

function changeSnakeDirection() {
  if (snake.direction != RIGHT && snake.direction != LEFT) {
    if (keys.right === true) {
      snake.direction = RIGHT;
    }
    if (keys.left === true) {
        snake.direction = LEFT;
    }
  } else if (snake.direction != UP && snake.direction != DOWN) {
    if (keys.up === true) {
        snake.direction = UP;
    }
    if (keys.down === true) {
        snake.direction = DOWN;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWalls()
  drawSnake()
  drawFood()
}

function drawWalls() {
  for(let i=0; i < gridWidth; i++) {
    drawWall(i,0);
    drawWall(i,gridHeight-1);
  }
  for(let i=0; i < gridHeight; i++) {
    drawWall(0,i);
    drawWall(gridWidth-1,i);
  }
}

function drawWall(x, y) {
  ctx.save();
  ctx.fillStyle = "#555";
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  ctx.restore();
}

function drawSnake() {
  ctx.save();
    snake.body.forEach(function(block) {
      ctx.fillStyle = "black";
      ctx.fillRect(block.x * blockSize, block.y * blockSize, blockSize, blockSize);
    })
    ctx.restore();
}

function drawFood() {
  ctx.save();
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
  ctx.restore();
}


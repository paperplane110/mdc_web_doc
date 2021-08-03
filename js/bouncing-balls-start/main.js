// 设置画布
const ballBoard = document.querySelector('p');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return 'rgb(' +
      random(0, 255) + ',' +
      random(0, 255) + ',' +
      random(0, 255) + ')';
}

function showBallNum(balls) {
  let alive = 0;
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      alive += 1;
    }
  }
  ballBoard.textContent = "Balls remain: " + alive;
}


class Shape {
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0 , 2*Math.PI);
  ctx.fill()
}

Ball.prototype.update = function() {
  if ((this.x + this.size) > width) {
    this.velX = -(this.velX);
  }
  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j] && balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y, exists) {
    super(x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0 , 2*Math.PI);
    ctx.stroke()
  }

  checkBounds() {
    if ((this.x + this.size) > width) {
      this.x = width-this.size;
    }
    if ((this.x - this.size) <= 0) {
      this.x = this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y = height-this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y = this.size;
    }
  }

  setControls() {
    window.onkeydown = e => {
      switch (e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    };
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
          showBallNum(balls);
        }
      }
    }
  }
}

let balls = [];
while(balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
      random(0+size, width-size),
      random(0+size, height-size),
      random(-7, 7),
      random(-7, 7),
      true,
      randomColor(),
      size
  )
  balls.push(ball);
  showBallNum(balls);
}

let evil = new EvilCircle(30, 30, true,)
evil.setControls()

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  requestAnimationFrame(loop);
}

loop();
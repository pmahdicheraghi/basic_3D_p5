let man, ball, ballShape, ballTexture;
let angelRotation;
let pageData, pageFont;
let ANGULAR_SPEED_Y = 0.1;
let GRAVITY = -10;
let GROUND_Y = 250;
let FRAME_RATE = 30;
let FONT_SIZE = 18;


function preload() {
  man = loadModel("assets/man.obj", true);
  ballShape = loadModel("assets/ball.obj", true);
  ballTexture = loadImage("assets/ballTexture.jpg");
  pageFont = loadFont("assets/Castoro-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pageData = createGraphics(200, 100);

  angleMode(DEGREES);
  colorMode(RGB);
  frameRate(FRAME_RATE);
  noStroke();

  ball = new Ball(ballShape, ballTexture, -20, 0, -70);
  angelRotation = new AngelHandler(ANGULAR_SPEED_Y);
}

function draw() {
  background(220);

  createStatusBar();

  // used for physics calculations
  fixedUpdate();

  // spot light followed by mouse
  spotLight(255, 255, 255, 0, 0, 500, mouseX - windowWidth / 2, mouseY - windowHeight / 2, -500, 45, 50);
  spotLight(255, 255, 255, 0, -windowHeight / 2, 0, 0, 1, 0, 45, 50);
  rotateY(angelRotation.getAngelY());

  push();
  translate(0, 0, 0);
  specularMaterial(0, 255, 0);
  shininess(5);
  rotateX(180);
  scale(2.5);
  model(man);
  pop();

  push();
  translate(0, GROUND_Y, 0);
  rotateX(90);
  circle(0, 0, 300);
  pop();

  push();
  translate(ball.getX(), ball.getY(), ball.getZ());
  scale(1 / 3);
  texture(ball.getTexture());
  model(ball.getModel());
  pop();
}

function fixedUpdate() {
  for (let i = 0; i < deltaTime/10; i++) {
    // try too calculate 100 times per sec
    ball.positionCalculator(GROUND_Y, GRAVITY);
    angelRotation.handleRotation();
  }
}

function createStatusBar() {
  pageData.background(100);
  pageData.textSize(FONT_SIZE);
  pageData.textFont(pageFont);
  pageData.text("FPS: " + floor(frameRate()), FONT_SIZE, 2 * FONT_SIZE);
  pageData.text("SEC: " + floor(millis()/1000) , FONT_SIZE, 4 * FONT_SIZE);
  image(pageData, windowWidth / 2 - 200, -windowHeight / 2);
}

class Ball {
  constructor(obj, _texture, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.model = obj;
    this.texture = _texture;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getZ() {
    return this.z;
  }
  getModel() {
    return this.model;
  }
  getTexture() {
    return this.texture;
  }
  positionCalculator(groundY, gravity = -10) {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    this.vy -= gravity / 40 ;
    if (Math.abs(this.y - groundY) < this.vy)
    {
      this.vy *= -0.95;
    }
  }
}

class AngelHandler {
  constructor(wy = 0.1) {
    this.wy = wy;
    this.ay = 0;
  }
  handleRotation() {
    if (mouseIsPressed)
    {
      this.ay += movedX;
    }
    else
    {
      this.ay += this.wy;
    }
  }
  getAngelY() {
    return this.ay;
  }
}
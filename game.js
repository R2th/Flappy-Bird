window.addEventListener('DOMContentLoaded', showIntroduction = () => { alert('Press space or mouse left to fly. Beware the obstacles!') })

const canvas = document.getElementById('canvas');
const c = canvas.getContext("2d");

const flySound = new Audio();
const scoreSound = new Audio();
const deadSound = new Audio();
const failSound = new Audio();

flySound.src = "sounds/fly.wav";
scoreSound.src = "sounds/score.wav";
deadSound.src = "sounds/dead.wav";
failSound.src = "sounds/fail.wav";

const bird = new Image();
const background = new Image();
const foreground = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = "images/bird.png";
background.src = "images/bg.png";
foreground.src = "images/fg.png";
pipeSouth.src = "images/pipeSouth.png";
pipeNorth.src = "images/pipeNorth.png";


//variables
var isDead = false;
var isControled = true;
var birdY;
var birdX;
var backgroundX;
var pipes;
var k;
if (!localStorage.getItem("FlappyBirdHighScore"))
    localStorage.setItem("FlappyBirdHighScore", 0);
var highScore = localStorage.getItem("FlappyBirdHighScore");
var speed;
var angle;

function init() {
    deadSound.load();
    failSound.load();
    backgroundX = 0;
    angle = 0;
    isControled = true;
    isDead = false;
    birdY = canvas.height / 2;
    birdX = 10;
    pipes = [];
    pipes.push({
        x: canvas.width,
        y: randomIntFromRange(-100, 0),
        space: randomIntFromRange(70, 130)
    });
    k = 0;
    speed = 1;
}

//constants
const gravity = 1.4;
const jumpHeight = 25;

//functions
window.addEventListener("keypress", jump);
window.addEventListener("click", jump2);

function jump(e) {
    if (isControled) {
        if (e.keyCode === 32) {
            flySound.load();
            flySound.play();
            birdY -= jumpHeight;
            angle = -20;
        }
    }
}

function jump2() {
    if (isControled) {
        flySound.load();
        flySound.play();
        birdY -= jumpHeight;
        angle = -20;
    }
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function detectCollision(birdX, birdY, pipeX, pipeY, space) {
    if (birdY >= canvas.height - 118 - 26 || birdY <= 0) return true;

    else if (birdY <= pipeY + 242 && birdX >= pipeX - 38 && birdX <= pipeX + 52 + 38) return true;

    else if (birdY + 26 >= pipeY + 242 + space && birdX >= pipeX - 38 && birdX <= pipeX + 52 + 38) return true;

    else return false;
}


init();

function drawImageRot(img, x, y, width, height, deg) {
    // Store the current context state (i.e. rotation, translation etc..)
    c.save()

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    c.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    c.rotate(rad);

    //draw the image    
    c.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);

    // Restore canvas state as saved from above
    c.restore();
}

function draw() {

    for (let i = 0; i < pipes.length + 1; i++) {
        c.drawImage(background, backgroundX + i * canvas.width, 0);
    }

    for (i = 0; i < pipes.length; i++) {
        c.drawImage(pipeNorth, pipes[i].x, pipes[i].y);
        c.drawImage(pipeSouth, pipes[i].x, pipes[i].y + 242 + pipes[i].space);
    }

    drawImageRot(bird, birdX, birdY, 38, 26, angle);
    angle = 0;

    for (let i = 0; i < pipes.length + 1; i++) {
        c.drawImage(foreground, backgroundX + i * canvas.width, canvas.height - 118);
    }

    birdY += gravity;

    for (i = 0; i < pipes.length; i++) {
        pipes[i].x -= speed;
    }

    if (detectCollision(birdX, birdY, pipes[k].x, pipes[k].y, pipes[k].space)) {
        isDead = true;
    }

    if (pipes[pipes.length - 1].x == 122) {
        pipes.push({
            x: canvas.width,
            y: randomIntFromRange(-100, 0),
            space: randomIntFromRange(85, 135)
        });
    }

    backgroundX -= speed;

    //draw score
    c.font = "20px Bangers";
    c.fillStyle = "red";
    c.fillText("Score: " + (k).toString(), canvas.width / 2 - 30, 20);
    c.fillStyle = "red";
    c.fillText("High Score: " + (highScore).toString(), 95, 500);
    //draw score

    if (pipes[k].x + 52 < birdX) {
        scoreSound.load();
        scoreSound.play();
        k++;
        if (k > highScore) {
            highScore = k;
            localStorage.setItem("FlappyBirdHighScore", highScore);
        }
    }

    if (isDead == false) requestAnimationFrame(draw);
    else {
        angle = 90;
        deadSound.play();
        isControled = false;
        speed = 0;
        birdY += gravity * 1.5;
        if (birdY + 26 > canvas.height - 118) {
            deadSound.load();
            angle = 180;
            birdY = canvas.height - 118 - 26;
            c.font = "50px Bangers";
            c.fillStyle = "khaki";
            c.fillText("GAME OVER !", 35, canvas.height / 2 - 30);
            failSound.play();
        }
        requestAnimationFrame(draw);
    }
}

draw();
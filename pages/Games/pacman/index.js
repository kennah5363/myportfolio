let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

// images 
let blueGhostImg;
let pinkGhostImg;
let redGhostImg;
let orangeGhostImg;
let pacmanUpImg;
let pacmanDownImg;
let pacmanRightImg;
let pacmanLeftImg;
let frightenedGhostImage;
let wallImg;
let currentLevel = 0;
const tileMap1 = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X       *X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXpXX X XXXX",
    "O       rob       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"
];
const tileMap2 = [
    "XXXXXXXXXXXXXXXXXXX",
    "X   oX  X        bX",
    "X XXXX  X X XXXXXXX",
    "X       X X X     X",
    "XXXX X XX X X XXX X",
    "X  X X X  X   X   X",
    "X  XXX X  X XXX XXX",
    "X  X   X  X   X   X",
    "X XX X X XX XXXXX X",
    "X    X   X  X   X X",
    "X XXXXXX X XX X X X",
    "X X  X   X X  X   X",
    "X X  X XXXXX XXXX X",
    "X    X    *  X  X X",
    "X X XXXXXXXXXX XX X",
    "X X  X  PX     X  X",
    "X X XX   X XXX X XX",
    "X X  X   X X X X  X",
    "XXXX X XXX X X    X",
    "Xb   X       X   rX",
    "XXXXXXXXXXXXXXXXXXX"
];
const tileMap3 = [
    "XXXXXXXXXXXXXXXXXXX",
    "X   pX  X   Xb X  X",
    "X    X  X   X  X  X",
    "XXXX X  X X X  X  X",
    "X    X  X X X     X",
    "X       X X X     X",
    "XXXXXX  X X XXXXX X",
    "X       X X       X",
    "X       X*X       X",
    "X XXXXXXXXX XXXXXXX",
    "X                 X",
    "X        P        X",
    "XXXXXXXXXXXXXXXXX X",
    "X       X         X",
    "X    X  X X       X",
    "XXX  X  X X XXXXXXX",
    "X    X  X X X     X",
    "X  X X  X X X     X",
    "X  X X  X X       X",
    "Xr X X    X      oX",
    "XXXXXXXXXXXXXXXXXXX",
];

const tileMap = [tileMap1, tileMap2, tileMap3];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;
let isFrightened = false;
let frightenedTimer = 0;
const frightenedDuration = 50;




const directions = ['U', 'D', 'R', 'L'];

let gameOver = false;
let lives = 3
let score = 0;
let currHighScore = JSON.parse(localStorage.getItem("highscore"));

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    loadImages();
    loadMap();

    update();
    for (let ghost of ghosts.values()) {



        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }


    document.addEventListener("keyup", movePacman);

}


function loadImages() {
    blueGhostImg = new Image();
    blueGhostImg.src = "Images/blueGhost.png";
    pinkGhostImg = new Image();
    pinkGhostImg.src = "Images/pinkGhost.png";
    redGhostImg = new Image();
    redGhostImg.src = "Images/redGhost.png";
    orangeGhostImg = new Image();
    orangeGhostImg.src = "Images/orangeGhost.png";

    pacmanDownImg = new Image();
    pacmanDownImg.src = "Images/pacmanDown.png";
    pacmanUpImg = new Image();
    pacmanUpImg.src = "Images/pacmanUp.png";
    pacmanLeftImg = new Image();
    pacmanLeftImg.src = "Images/pacmanLeft.png";
    pacmanRightImg = new Image();
    pacmanRightImg.src = "Images/pacmanRight.png";
    wallImg = new Image();
    wallImg.src = "Images/wall.png";

    frightenedGhostImage = new Image();
    frightenedGhostImage.src = "Images/scaredGhost.png";
}


function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();
    let currentMap = tileMap[currentLevel];



    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = currentMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == 'X') {
                const wall = new Block(wallImg, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'p') {
                const ghost = new Block(pinkGhostImg, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'b') {
                const ghost = new Block(blueGhostImg, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') {
                const ghost = new Block(orangeGhostImg, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') {
                const ghost = new Block(redGhostImg, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') {
                pacman = new Block(pacmanRightImg, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
            else if (tileMapChar == '*') {
                const food = new Block(null, x + 14, y + 14, 8, 8);
                food.isPower = true;
                foods.add(food);
            }
        }
    }
}

function nextLevel() {
    currentLevel = (currentLevel + 1) % tileMap.length;

    loadMap();
    resetPosition();
}



function update() {
    if (isFrightened) {
        frightenedTimer--;
        if (frightenedTimer <= 0) {
            isFrightened = false;
            for (let ghost of ghosts) {
                ghost.setFrightenedMode(false);
            }
        }
    }
    if (gameOver) {
        return;
    }
    move()
    draw();
    let highScore = score;
    if (gameOver) {
        if (currHighScore < score) {

            localStorage.setItem("highscore", JSON.stringify(highScore));
        }
    }
    setTimeout(update, 50);
}



function draw() {
    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    for (let food of foods.values()) {
        context.fillStyle = "red";
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    context.fillStyle = "white";
    context.font = "14px sans-serif";
    context.fillStyle = "white";
    context.font = "14px sans-serif";
    context.fillText("Highscore: " + String(currHighScore), tileSize * 15, tileSize / 2);

    if (gameOver) {
        context.fillText("GameOver: " + String(score), tileSize / 2, tileSize / 2);
    }
    else {
        context.fillText("X" + String(lives) + " " + String(score), tileSize / 2, tileSize / 2);
    }

}


function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    if (pacman.x + pacman.width <= 0) {
        pacman.x = boardWidth;
    } else if (pacman.x >= boardWidth) {
        pacman.x = -tileSize * 1;
    }

    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    for (let ghost of ghosts.values()) {
        if (ghost.x + ghost.width <= 0) {
            ghost.x = boardWidth;
        } else if (ghost.x >= boardWidth) {
            ghost.x = -tileSize * 1;
        }

        if (collision(ghost, pacman)) {
            if (isFrightened) {
                ghosts.delete(ghost);
                score += 200;
            } else {
                lives -= 1;
                if (lives == 0) {
                    gameOver = true;
                }
                resetPosition();
                return;
            }
        }
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        if (ghost.y == tileSize * 9 && ghost.direction != 'U' && ghost.direction != 'D') {
            ghost.updateDirection('U');
        }
        for (let wall of walls.values()) {
            if (collision(ghost, wall)) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;

                const newDirection = directions[Math.floor(Math.random() * 4)];
                ghost.updateDirection(newDirection);
            }
        }

    }

    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            if (food.isPower) {
                isFrightened = true;
                frightenedTimer = frightenedDuration;
                score += 50;
                for (let ghost of ghosts) {
                    ghost.setFrightenedMode(true);
                }
            }
            else {
                score += 10;
            }
            break;
        }
    }
    foods.delete(foodEaten);
}

function movePacman(e) {
    if (gameOver) {
        loadMap();
        resetPosition();
        lives = 3;
        score = 0;
        gameOver = false;
        update();
        return;
    }

    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection('U');
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection('D');
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection('L');
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection('R');
    }

    if (pacman.direction == 'U') {
        pacman.image = pacmanUpImg;
    }
    else if (pacman.direction == 'R') {
        pacman.image = pacmanRightImg;
    }
    else if (pacman.direction == 'D') {
        pacman.image = pacmanDownImg;
    }
    else if (pacman.direction == 'L') {
        pacman.image = pacmanLeftImg;
    }

    if (e.code == "KeyN") {
        nextLevel();
    }
}



function collision(a, b) {
    return a.x < b.x + b.width &&
        a.y < b.y + b.height &&
        b.x < a.x + a.width &&
        b.y < a.y + a.height
}

function resetPosition() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;

    for (let ghost of ghosts.values()) {
        ghost.reset();
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;


        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}


class Block {
    constructor(image, x, y, width, height, frightenedImage = null) {
        this.image = image;
        this.frightenedImage = frightenedGhostImage;
        this.originalImage = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.velocityX = 0;
        this.velocityY = 0
        this.direction = 'R';
    }
    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }

    updateDirection(direction) {
        const previousDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let wall of walls.values()) {
            if (collision(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = previousDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        }
    }

    setFrightenedMode(isOn) {
        if (isOn && this.frightenedImage) {
            this.image = this.frightenedImage;
        } else {
            this.image = this.originalImage;
        }
    }
}
//canvas
let canvas;
let ctx;

//set canvas dimensions
const rows = 19;
const cols = 19;
const tileSize = 32;
const canvasWidth = cols * tileSize;
const canvasHeight = rows * tileSize;

//images
let blueGhostImg;
let redGhostImg;
let orangeGhostImg;
let pinkGhostImg;
let wallImg;

// Pacman object
let pacman;

//game variables
const walls = new Set();
const pellets = new Set();
const powerUps = new Set();
const ghosts = new Set();
let score = 0;
let lives = 3;
let gameOver = false;

const directions = ['U', 'D', 'L', 'R'];

// Create the map using a 2D array
const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
    ['-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '-', '-', '.', '-', '-', '-', '-', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '.', '.', '.', '-'],
    ['-', '-', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '-', '-', '.', '-', '.', '-', '-', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '-', '.', '-', '-', '-', '.', '-', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '.', '-', '-', '-', '.', '.', 'p', '.', '.', '-', '-', '-', '.', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '-', '.', '-', '-', '-', '.', '-', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '-', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '-', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '-', '-', '.', '-', '.', '-', '-', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '-', '-'],
    ['-', '.', '.', '.', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '.', '-'],
    ['-', '.', '-', '-', '-', '-', '.', '-', '-', '-', '-', '-', '.', '-', '-', '-', '-', '.', '-'],
    ['-', 'p', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
];

//load canvas

window.onload = function() {
    canvas = document.getElementById("pacman-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    loadImages();
    loadMap();  
}

//load images
function loadImages() {
    wallImg = new Image();
    wallImg.src = "assets/images/wall.png";
    blueGhostImg = new Image();
    blueGhostImg.src = "assets/images/blueGhost.png";
    redGhostImg = new Image();
    redGhostImg.src = "assets/images/redGhost.png";
    orangeGhostImg = new Image();
    orangeGhostImg.src = "assets/images/orangeGhost.png";
    pinkGhostImg = new Image();
    pinkGhostImg.src = "assets/images/pinkGhost.png";
}

//load map
function loadMap() {
    walls.clear();
    pellets.clear();
    powerUps.clear();
    ghosts.clear();

    for(let r = 0; r < map.length; r++) {
        for(let c = 0; c < map[r].length; c++) {
            const tile = map[r][c];
            const x = c * tileSize;
            const y = r * tileSize;

            if(tile === '-') {
                walls.add(new Block(wallImg, x, y, tileSize, tileSize));
            } else if(tile === '.') {
                pellets.add(new Block(null, x + tileSize / 2.5, y + tileSize / 2.5, tileSize / 4, tileSize / 4));
            }
            else if(tile === 'p') {
                powerUps.add(new Block(null, x + tileSize / 2.5, y + tileSize / 2.5, tileSize / 3, tileSize / 3));
            }
        }
    }
}

//draw function
function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw walls
    for (let wall of walls.values()) {
        ctx.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    
    //draw pellets
    ctx.fillStyle = "white";
    for (let pellet of pellets.values()) {
        ctx.beginPath();
        ctx.arc(pellet.x + pellet.width / 2, pellet.y + pellet.height / 2, pellet.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    //draw power-ups
    ctx.fillStyle = "white";
    for (let powerUp of powerUps.values()) {
        ctx.beginPath();
        ctx.arc(powerUp.x + powerUp.width / 3, powerUp.y + powerUp.height / 3, powerUp.width / 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    //draw ghosts
    for (let ghost of ghosts.values()) {
        ctx.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
}

// Block class for walls, pellets, power-ups, and ghosts

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = directions[Math.floor(Math.random() * directions.length)]; // Random initial direction
        this.velocityX = 0;
        this.velocityY = 0;
        this.updateVelocity(); // Set initial velocity
    }

    updateVelocity() {
        if (this.direction === "U") {
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        } else if (this.direction === "D") {
            this.velocityX = 0;
            this.velocityY = tileSize/4;
        } else if (this.direction === "L") {
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
        } else if (this.direction === "R") {
            this.velocityX = tileSize/4;
            this.velocityY = 0;
        }
    }   

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}

//update function
function update() {
    // Only continue updating if game is not over
   //if () {
        //move();
        draw();
        setTimeout(update, 50);
   //}
}


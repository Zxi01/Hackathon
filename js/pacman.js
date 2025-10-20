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
let scaredGhostImg;

//sounds
let eatPelletSound;
// let eatGhostSound;
// let deathSound;
// let powerUpSound;
// let startUpSound;

// Pacman object
let pacman;

//game variables
const walls = new Set();
const pellets = new Set();
const powerUps = new Set();
const ghosts = new Set();
const eatenGhosts = new Set(); // Track eaten ghosts for respawning
let score = 0;
let lives = 3;
let gameOver = false;
let ghostsScared = false;
let scaredTimer = 0;
const SCARED_DURATION = 5000; // 5 seconds in milliseconds

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
    loadSounds();
    loadMap(); 
    
    // Initialize Pacman at position [1][1]
    pacman = {
        x: 1 * tileSize + tileSize/2, // Center in tile
        y: 1 * tileSize + tileSize/2, // Center in tile
        radius: 12.5,
        radians: 0.75,
        openRate: 0.12,
        rotation: 0,
        direction: "R",
        nextDirection: null, // Queue for next direction
        velocityX: 0,
        velocityY: 0,
        speed: 8, // Pixels per frame

        updateDirection: function(direction) {
            // Always queue the new direction
            this.nextDirection = direction;
            
            // If not currently moving, start moving immediately
            if (this.velocityX === 0 && this.velocityY === 0) {
                this.setDirection(direction);
            }
        },
        
        setDirection: function(direction) {
            this.direction = direction;
            this.updateVelocity();
        },
        
        updateVelocity: function() {
            switch (this.direction) {
                case "U":
                    this.velocityX = 0;
                    this.velocityY = -this.speed;
                    this.rotation = Math.PI * 1.5; // 270 degrees
                    break;
                case "D":
                    this.velocityX = 0;
                    this.velocityY = this.speed;
                    this.rotation = Math.PI * 0.5; // 90 degrees
                    break;
                case "L":
                    this.velocityX = -this.speed;
                    this.velocityY = 0;
                    this.rotation = Math.PI; // 180 degrees
                    break;
                case "R":
                    this.velocityX = this.speed;
                    this.velocityY = 0;
                    this.rotation = 0; // 0 degrees
                    break;
            }
        },
        
        // Check if Pacman is close enough to center of a tile to change direction
        canChangeDirection: function() {
            const tolerance = 4; // Pixels tolerance from tile center
            const tileX = Math.floor(this.x / tileSize) * tileSize + tileSize/2;
            const tileY = Math.floor(this.y / tileSize) * tileSize + tileSize/2;
            
            return Math.abs(this.x - tileX) <= tolerance && Math.abs(this.y - tileY) <= tolerance;
        },
        
        // Snap to the nearest tile center
        snapToGrid: function() {
            const tileX = Math.floor(this.x / tileSize) * tileSize + tileSize/2;
            const tileY = Math.floor(this.y / tileSize) * tileSize + tileSize/2;
            this.x = tileX;
            this.y = tileY;
        }
    };

    update();
    document.addEventListener('keydown', function(e) {
        e.preventDefault();
        if(e.code == 'ArrowUp' || e.code == "KeyW") {
            pacman.updateDirection("U");
        } else if(e.code == 'ArrowDown' || e.code == "KeyS") {
            pacman.updateDirection("D");
        } else if(e.code == 'ArrowLeft' || e.code == "KeyA") {
            pacman.updateDirection("L");
        } else if(e.code == 'ArrowRight' || e.code == "KeyD") {
            pacman.updateDirection("R");
        }
    });

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
    scaredGhostImg = new Image();
    scaredGhostImg.src = "assets/images/scaredGhost.png";
}

//load sounds
function loadSounds() {
    eatPelletSound = new Audio("assets/sounds/waka.wav");
    eatPelletSound.volume = 0.5;
    // eatGhostSound = new Audio("assets/sounds/eat_ghost.wav");
    // eatGhostSound.volume = 0.5;
    // deathSound = new Audio("assets/sounds/death.wav");
    // deathSound.volume = 0.5;
    // powerUpSound = new Audio("assets/sounds/power_up.wav");
    // powerUpSound.volume = 0.5;
    // startUpSound = new Audio("assets/sounds/start_up.wav");
    // startUpSound.volume = 0.5;
}

//load map
function loadMap() {
    walls.clear();
    pellets.clear();
    powerUps.clear();
    ghosts.clear();
    eatenGhosts.clear();

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
    // Spawn ghosts in the center of the map
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    
    // Position ghosts in a 1x4 formation horizontally across the center
    ghosts.add(new Block(redGhostImg, (centerCol - 2) * tileSize, centerRow * tileSize, tileSize, tileSize));
    ghosts.add(new Block(blueGhostImg, (centerCol - 1) * tileSize, centerRow * tileSize, tileSize, tileSize));
    ghosts.add(new Block(orangeGhostImg, centerCol * tileSize, centerRow * tileSize, tileSize, tileSize));
    ghosts.add(new Block(pinkGhostImg, (centerCol + 1) * tileSize, centerRow * tileSize, tileSize, tileSize));
}

//update function
function update() {
    // Only continue updating if game is not over
   if (!gameOver) {
        move();
        draw();
        setTimeout(update, 50);
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

    //draw pacman
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    ctx.rotate(pacman.rotation);
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, 0, pacman.radius, pacman.radians, Math.PI * 2 - pacman.radians);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();
}

// Add functions to handle scared ghosts
function makeGhostsScared() {
    ghostsScared = true;
    scaredTimer = Date.now() + SCARED_DURATION;
    
    // Change all ghost images to scared ghost
    for (let ghost of ghosts.values()) {
        ghost.image = scaredGhostImg;
    }
}

function updateScaredGhosts() {
    if (ghostsScared && Date.now() >= scaredTimer) {
        // Time's up, change ghosts back to normal and respawn eaten ghosts
        ghostsScared = false;
        
        // Restore original images for existing ghosts
        for (let ghost of ghosts.values()) {
            ghost.image = ghost.originalImage;
        }
        
        // Respawn eaten ghosts
        for (let eatenGhost of eatenGhosts.values()) {
            // Reset eaten ghost to original position and image
            eatenGhost.reset();
            eatenGhost.image = eatenGhost.originalImage;
            // Give it a new random direction
            const newDirection = directions[Math.floor(Math.random() * directions.length)];
            eatenGhost.direction = newDirection;
            eatenGhost.updateVelocity();
            // Add back to active ghosts
            ghosts.add(eatenGhost);
        }
        
        // Clear eaten ghosts set
        eatenGhosts.clear();
    }
}

function eatGhost(ghost) {
    // Remove from active ghosts and add to eaten ghosts
    ghosts.delete(ghost);
    eatenGhosts.add(ghost);
    score += 100;
    const scoreEl = document.getElementById("scoreEl");
    scoreEl.innerHTML = score;
}

//move function
function move() {
    // Don't process movement if game is over
    if (gameOver) return;

    //pacman movement logic
    // Check if we can change direction and have a queued direction
    if (pacman.nextDirection && pacman.canChangeDirection()) {
        // Test if the queued direction is valid
        pacman.snapToGrid(); // Ensure we're centered
        let testX = pacman.x;
        let testY = pacman.y;
        
        // Calculate test position based on queued direction
        switch (pacman.nextDirection) {
            case "U": testY -= pacman.speed; break;
            case "D": testY += pacman.speed; break;
            case "L": testX -= pacman.speed; break;
            case "R": testX += pacman.speed; break;
        }
        
        // Check if queued direction is clear
        let canMove = true;
        for (let wall of walls.values()) {
            if (pacmanWallCollision(testX, testY, wall)) {
                canMove = false;
                break;
            }
        }
        
        // If queued direction is clear, change to it
        if (canMove) {
            pacman.setDirection(pacman.nextDirection);
            pacman.nextDirection = null;
        }
    }
    
    // Calculate new position
    let newX = pacman.x + pacman.velocityX;
    let newY = pacman.y + pacman.velocityY;
    
    // Check if new position would cause collision
    let wouldCollide = false;
    for (let wall of walls.values()) {
        if (pacmanWallCollision(newX, newY, wall)) {
            wouldCollide = true;
            break;
        }
    }
    
    // Only move if no collision would occur
    if (!wouldCollide) {
        pacman.x = newX;
        pacman.y = newY;
    } else {
        // Stop moving if hit a wall
        pacman.velocityX = 0;
        pacman.velocityY = 0;
    }

    // Ghost movement
    for (let ghost of ghosts.values()) {
        // Calculate new position
        let newGhostX = ghost.x + ghost.velocityX;
        let newGhostY = ghost.y + ghost.velocityY;
        
        // Check if ghost would hit a wall
        let ghostWouldCollide = false;
        for (let wall of walls.values()) {
            if (ghostWallCollision(newGhostX, newGhostY, ghost.width, ghost.height, wall)) {
                ghostWouldCollide = true;
                break;
            }
        }

    // If ghost would hit wall or randomly change direction (5% chance per frame)
        if (ghostWouldCollide || Math.random() < 0.05) {
            // Try different directions until we find a valid one
            const availableDirections = [];
            
            for (let direction of directions) {
                let testX = ghost.x;
                let testY = ghost.y;
                
                switch (direction) {
                    case "U": testY -= tileSize/4; break;
                    case "D": testY += tileSize/4; break;
                    case "L": testX -= tileSize/4; break;
                    case "R": testX += tileSize/4; break;
                }
                
                let canMoveThisWay = true;
                for (let wall of walls.values()) {
                    if (ghostWallCollision(testX, testY, ghost.width, ghost.height, wall)) {
                        canMoveThisWay = false;
                        break;
                    }
                }
                
                if (canMoveThisWay) {
                    availableDirections.push(direction);
                }
            }

        // Choose a random valid direction
            if (availableDirections.length > 0) {
                const newDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
                ghost.direction = newDirection;
                ghost.updateVelocity();
            }
        }
        
        // Move ghost if no collision
        if (!ghostWouldCollide) {
            ghost.x = newGhostX;
            ghost.y = newGhostY;
        }
    }

    // Check for Pacman-Ghost collisions AFTER movement
    for(let ghost of ghosts.values()) {
        if(pacmanGhostCollision(pacman, ghost)) {
            if (ghostsScared) {
                // Pacman eats the scared ghost
                eatGhost(ghost);
                break; // Exit after eating one ghost
            } else {
                // Normal collision - Pacman loses a life
                lives -= 1;
                const livesEl = document.getElementById("livesEl");
                livesEl.innerHTML = lives;
                
                if(lives <= 0) {
                    gameOver = true;
                    handleGameOver();
                } else {
                    resetPositions();
                }
                return; // Exit after first collision to avoid multiple life losses
            }
        }
    }

    // Handle pellet collection
    for (let pellet of pellets.values()) {
        const scoreEl = document.getElementById("scoreEl");
        if (pacmanPelletCollision(pacman, pellet)) {
            pellets.delete(pellet);
            score += 10; // Increment score
            scoreEl.innerHTML = score; // Update score display

            // Play eatPellet sound when eating pellet
            if (eatPelletSound) {
                eatPelletSound.currentTime = 0; // Reset sound to beginning for rapid playback
                eatPelletSound.play().catch(e => {
                    // Handle any audio play errors silently
                    console.log("Audio play failed:", e);
                });
            }
        }
    }

    // Handle power-up collection
    for (let powerUp of powerUps.values()) {
        if (pacmanPelletCollision(pacman, powerUp)) {
            powerUps.delete(powerUp);
            makeGhostsScared(); // Make ghosts scared when power-up is collected
            score += 50; // Add points for power-up
            const scoreEl = document.getElementById("scoreEl");
            scoreEl.innerHTML = score;
        }
    }

    // Check win condition - if all pellets are collected
    if (pellets.size === 0) {
        gameOver = true;
        handleWinGame();
        return;
    }

    // Update scared ghost timer
    updateScaredGhosts();

    //Handles the mouth opening and closing effect
    if (pacman.radians < 0 || pacman.radians > 0.75) {
        pacman.openRate = -pacman.openRate;
    }
    pacman.radians += pacman.openRate;

    

    // Collision detection between Pacman (circle) and walls (rectangles)
    function pacmanWallCollision(pacmanX, pacmanY, wall) {
    // Find the closest point on the rectangle to the circle center
    let closestX = Math.max(wall.x, Math.min(pacmanX, wall.x + wall.width));
    let closestY = Math.max(wall.y, Math.min(pacmanY, wall.y + wall.height));
    
    // Calculate distance between circle center and closest point
    let distanceX = pacmanX - closestX;
    let distanceY = pacmanY - closestY;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Collision occurs if distance is less than circle radius
    return distance < pacman.radius;
    }

    // Collision detection between Pacman (circle) and ghosts (rectangles)
    function pacmanGhostCollision(pacman, ghost) {
    // Find the closest point on the rectangle to the circle center
    let closestX = Math.max(ghost.x, Math.min(pacman.x, ghost.x + ghost.width));
    let closestY = Math.max(ghost.y, Math.min(pacman.y, ghost.y + ghost.height));
    
    // Calculate distance between circle center and closest point
    let distanceX = pacman.x - closestX;
    let distanceY = pacman.y - closestY;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Collision occurs if distance is less than circle radius
    return distance < pacman.radius;
    }

    // Collision detection between Pacman and pellets/power-ups
    function pacmanPelletCollision(pacman, pellet) {
    // Calculate distance between centers
    let pelletCenterX = pellet.x + pellet.width / 2;
    let pelletCenterY = pellet.y + pellet.height / 2;
    
    let distanceX = pacman.x - pelletCenterX;
    let distanceY = pacman.y - pelletCenterY;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Collision occurs if distance is less than pacman radius
    return distance < pacman.radius;
    }

    // Collision detection between ghosts (rectangles) and walls (rectangles)
    function ghostWallCollision(ghostX, ghostY, ghostWidth, ghostHeight, wall) {
        return ghostX < wall.x + wall.width &&
            ghostX + ghostWidth > wall.x &&
            ghostY < wall.y + wall.height &&
            ghostY + ghostHeight > wall.y;
    }

    function ghostCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

}

//reset positions of pacman and ghosts
function resetPositions() {
    // Reset Pacman to starting position
    pacman.x = 1 * tileSize + tileSize/2;
    pacman.y = 1 * tileSize + tileSize/2;
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    pacman.direction = "R";
    pacman.nextDirection = null;

    // Reset ghosts to their starting positions
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    
    let ghostIndex = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        // Give each ghost a new random direction
        const newDirection = directions[Math.floor(Math.random() * directions.length)];
        ghost.direction = newDirection;
        ghost.updateVelocity();
        ghostIndex++;
    }
}

//handle game over
function handleGameOver() {
    const modal = document.getElementById("game-over-modal");
    const scoreEl = document.getElementById("final-score");
    scoreEl.textContent = score;
    modal.classList.remove("hidden");

    // Target buttons specifically within the game-over modal
    const restartBtn = modal.querySelector(".restart-btn");
    const homeBtn = modal.querySelector(".home-btn");

    if (restartBtn) {
        restartBtn.onclick = () => {
            modal.classList.add("hidden");
            resetGame();
        };
    }

    if (homeBtn) {
        homeBtn.onclick = () => {
            window.location.href = "index.html";
        };
    }
}

//handle win game
function handleWinGame() {
    const modal = document.getElementById("win-game-modal");
    const scoreEl = document.getElementById("win-score");
    scoreEl.textContent = score;
    modal.classList.remove("hidden");

    // Target buttons specifically within the win-game modal
    const restartBtn = modal.querySelector(".restart-btn");
    const homeBtn = modal.querySelector(".home-btn");

    if (restartBtn) {
        restartBtn.onclick = () => {
            modal.classList.add("hidden");
            resetGame();
        };
    }

    if (homeBtn) {
        homeBtn.onclick = () => {
            window.location.href = "index.html";
        };
    }
}

//reset game
function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    ghostsScared = false; // Reset scared state
    scaredTimer = 0;

    const scoreEl = document.getElementById("scoreEl");
    const livesEl = document.getElementById("livesEl");
    scoreEl.innerHTML = score;
    livesEl.innerHTML = lives;

    // Reload the map to restore pellets and power-ups
    loadMap();
    resetPositions();
    
    // Restart the game loop
    update();
}

// Block class for walls, pellets, power-ups, and ghosts

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.originalImage = image; // Store original image
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
        this.image = this.originalImage; // Reset to original image
    }
}




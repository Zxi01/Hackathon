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
let eatGhostSound;
let gameOverSound;
let startGameSound;
let powerUpSound;

// Pacman object
let pacman;
//score formatting
function formatScore(num) {
    return String(num).padStart(4, "0");
}
//game variables
const walls = new Set();
const pellets = new Set();
const powerUps = new Set();
const ghosts = new Set();
const eatenGhosts = new Set(); // Track eaten ghosts for respawning
let score = formatScore(0);
let lives = 3;
let highscore = localStorage.getItem("pacman-highscore") || 0;
let gameOver = false;
let gameStarted = false;
let ghostsScared = false;
let scaredTimer = 0;
let isProcessingCollision = false; // Prevent multiple collisions during sound
let pacmanDisappearing = false; // Track if Pacman is disappearing
let pacmanOpacity = 1.0; // Pacman's opacity for disappearing animation
let disappearStartTime = 0; // When the disappearing animation started
const SCARED_DURATION = 5000; // 5 seconds in milliseconds

const directions = ["U", "D", "L", "R"];

// Create the map using a 2D array
const map = [
    [
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
    ],
    [
        "-",
        " ",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "p",
        "-",
    ],
    [
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        ".",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        "-",
        ".",
        "-",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        "-",
        ".",
        "-",
        "-",
    ],
    [
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        "-",
        ".",
        "-",
        ".",
        "-",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        "-",
        "-",
        "-",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        "-",
        "-",
        "-",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        "-",
        "-",
        "-",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        "-",
        "-",
        ".",
        "-",
        "-",
        "-",
        ".",
        ".",
        "p",
        ".",
        ".",
        "-",
        "-",
        "-",
        ".",
        "-",
        "-",
        "-",
    ],
    [
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        "-",
        "-",
        "-",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        "-",
        "-",
        "-",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        "-",
        "-",
        "-",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        "-",
        ".",
        "-",
        ".",
        "-",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        "-",
        ".",
        "-",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        "-",
        ".",
        "-",
        "-",
    ],
    [
        "-",
        ".",
        ".",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
        ".",
        "-",
    ],
    [
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
        "-",
        "-",
        "-",
        ".",
        "-",
    ],
    [
        "-",
        "p",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "-",
    ],
    [
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
    ],
];

//load canvas

window.onload = function () {
    canvas = document.getElementById("pacman-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Load images first, then load map and initialize game
    loadImagesAndInitialize();
};

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

function updateHighscore() {
    const el = document.getElementById("highscore");
    if (el) el.textContent = formatScore(highscore);
}

//load images and initialize game
function loadImagesAndInitialize() {
    let imagesToLoad = 6;
    let imagesLoaded = 0;

    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === imagesToLoad) {
            // All images loaded, now initialize the game
            initializeGame();
        }
    }

    // Load all images with onload callbacks
    wallImg = new Image();
    wallImg.onload = imageLoaded;
    wallImg.src = "assets/images/wall.png";

    blueGhostImg = new Image();
    blueGhostImg.onload = imageLoaded;
    blueGhostImg.src = "assets/images/blueGhost.png";

    redGhostImg = new Image();
    redGhostImg.onload = imageLoaded;
    redGhostImg.src = "assets/images/redGhost.png";

    orangeGhostImg = new Image();
    orangeGhostImg.onload = imageLoaded;
    orangeGhostImg.src = "assets/images/orangeGhost.png";

    pinkGhostImg = new Image();
    pinkGhostImg.onload = imageLoaded;
    pinkGhostImg.src = "assets/images/pinkGhost.png";

    scaredGhostImg = new Image();
    scaredGhostImg.onload = imageLoaded;
    scaredGhostImg.src = "assets/images/scaredGhost.png";
}

//initialize game after images are loaded
function initializeGame() {
    loadSounds();
    loadMap(); // Load the map with walls, pellets, etc.
    updateHighscore();
    // Initialize Pacman at position [1][1]
    pacman = {
        x: 1 * tileSize + tileSize / 2, // Center in tile
        y: 1 * tileSize + tileSize / 2, // Center in tile
        radius: 12.5,
        radians: 0.75,
        openRate: 0.12,
        rotation: 0,
        direction: "R",
        nextDirection: null, // Queue for next direction
        velocityX: 0,
        velocityY: 0,
        speed: 8, // Pixels per frame

        updateDirection: function (direction) {
            // Always queue the new direction
            this.nextDirection = direction;

            // If not currently moving, start moving immediately
            if (this.velocityX === 0 && this.velocityY === 0) {
                this.setDirection(direction);
            }
        },

        setDirection: function (direction) {
            this.direction = direction;
            this.updateVelocity();
        },

        updateVelocity: function () {
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
        canChangeDirection: function () {
            const tolerance = 4; // Pixels tolerance from tile center
            const tileX =
                Math.floor(this.x / tileSize) * tileSize + tileSize / 2;
            const tileY =
                Math.floor(this.y / tileSize) * tileSize + tileSize / 2;

            return (
                Math.abs(this.x - tileX) <= tolerance &&
                Math.abs(this.y - tileY) <= tolerance
            );
        },

        // Snap to the nearest tile center
        snapToGrid: function () {
            const tileX =
                Math.floor(this.x / tileSize) * tileSize + tileSize / 2;
            const tileY =
                Math.floor(this.y / tileSize) * tileSize + tileSize / 2;
            this.x = tileX;
            this.y = tileY;
        },
    };

    // Show start game modal and draw initial state
    showStartGameModal();
    draw(); // Draw the initial game state with walls visible

    // Set up keyboard event listener
    document.addEventListener("keydown", function (e) {
        // Only process keyboard input if game has started
        if (!gameStarted) return;

        e.preventDefault();
        if (e.code == "ArrowUp" || e.code == "KeyW") {
            pacman.updateDirection("U");
        } else if (e.code == "ArrowDown" || e.code == "KeyS") {
            pacman.updateDirection("D");
        } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
            pacman.updateDirection("L");
        } else if (e.code == "ArrowRight" || e.code == "KeyD") {
            pacman.updateDirection("R");
        }
    });

    // Attach D-pad handlers (mobile) after pacman object exists.
    // This mirrors the pattern used in snake.js and two-zero-four-eight.js
    const dpadUp = document.getElementById("dpad-up");
    const dpadDown = document.getElementById("dpad-down");
    const dpadLeft = document.getElementById("dpad-left");
    const dpadRight = document.getElementById("dpad-right");

    const makeHandler = (dir) => (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!gameStarted) return;
        // Use the pacman.updateDirection method which queues direction changes
        pacman.updateDirection(dir);
    };

    if (dpadUp) {
        dpadUp.addEventListener("click", makeHandler("U"));
        dpadUp.addEventListener("touchstart", makeHandler("U"), {
            passive: false,
        });
    }
    if (dpadDown) {
        dpadDown.addEventListener("click", makeHandler("D"));
        dpadDown.addEventListener("touchstart", makeHandler("D"), {
            passive: false,
        });
    }
    if (dpadLeft) {
        dpadLeft.addEventListener("click", makeHandler("L"));
        dpadLeft.addEventListener("touchstart", makeHandler("L"), {
            passive: false,
        });
    }
    if (dpadRight) {
        dpadRight.addEventListener("click", makeHandler("R"));
        dpadRight.addEventListener("touchstart", makeHandler("R"), {
            passive: false,
        });
    }
}

//load sounds
function loadSounds() {
    eatPelletSound = new Audio("assets/sounds/waka.wav");
    eatPelletSound.volume = 0.5;
    eatGhostSound = new Audio("assets/sounds/eat_ghost.wav");
    eatGhostSound.volume = 0.5;
    gameOverSound = new Audio("assets/sounds/gameOver.wav");
    gameOverSound.volume = 0.5;
    powerUpSound = new Audio("assets/sounds/power_dot.wav");
    powerUpSound.volume = 0.5;
    startGameSound = new Audio("assets/sounds/gameStart.wav");
    startGameSound.volume = 0.5;
}

//load map
function loadMap() {
    walls.clear();
    pellets.clear();
    powerUps.clear();
    ghosts.clear();
    eatenGhosts.clear();

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = map[r][c];
            const x = c * tileSize;
            const y = r * tileSize;

            if (tile === "-") {
                walls.add(new Block(wallImg, x, y, tileSize, tileSize));
            } else if (tile === ".") {
                pellets.add(
                    new Block(
                        null,
                        x + tileSize / 2.5,
                        y + tileSize / 2.5,
                        tileSize / 4,
                        tileSize / 4
                    )
                );
            } else if (tile === "p") {
                powerUps.add(
                    new Block(
                        null,
                        x + tileSize / 2.5,
                        y + tileSize / 2.5,
                        tileSize / 3,
                        tileSize / 3
                    )
                );
            }
        }
    }
    // Spawn ghosts in the center of the map
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    // Position ghosts in a 1x4 formation horizontally across the center
    ghosts.add(
        new Block(
            redGhostImg,
            (centerCol - 2) * tileSize,
            centerRow * tileSize,
            tileSize,
            tileSize
        )
    );
    ghosts.add(
        new Block(
            blueGhostImg,
            (centerCol - 1) * tileSize,
            centerRow * tileSize,
            tileSize,
            tileSize
        )
    );
    ghosts.add(
        new Block(
            orangeGhostImg,
            centerCol * tileSize,
            centerRow * tileSize,
            tileSize,
            tileSize
        )
    );
    ghosts.add(
        new Block(
            pinkGhostImg,
            (centerCol + 1) * tileSize,
            centerRow * tileSize,
            tileSize,
            tileSize
        )
    );
}

//update function
function update() {
    // Only continue updating if game has started and is not over
    if (gameStarted && !gameOver) {
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
        ctx.arc(
            pellet.x + pellet.width / 2,
            pellet.y + pellet.height / 2,
            pellet.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    //draw power-ups
    ctx.fillStyle = "white";
    for (let powerUp of powerUps.values()) {
        ctx.beginPath();
        ctx.arc(
            powerUp.x + powerUp.width / 3,
            powerUp.y + powerUp.height / 3,
            powerUp.width / 1.5,
            0,
            Math.PI * 2
        );
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

    // Handle disappearing animation
    if (pacmanDisappearing) {
        const currentTime = Date.now();
        const elapsed = currentTime - disappearStartTime;
        const soundDuration =
            gameOverSound && gameOverSound.duration
                ? gameOverSound.duration * 1000
                : 2000; // Default 2 seconds

        // Calculate opacity based on time elapsed
        pacmanOpacity = Math.max(0, 1 - elapsed / soundDuration);
        ctx.globalAlpha = pacmanOpacity;

        // Optional: Add scaling effect for more dramatic disappearing
        const scale = pacmanOpacity;
        ctx.scale(scale, scale);
    } else {
        ctx.globalAlpha = 1.0;
        pacmanOpacity = 1.0;
    }

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
            const newDirection =
                directions[Math.floor(Math.random() * directions.length)];
            eatenGhost.direction = newDirection;
            eatenGhost.updateVelocity();
            // Add back to active ghosts
            ghosts.add(eatenGhost);
        }

        // Clear eaten ghosts set
        eatenGhosts.clear();
    }
}

//function to handle eating a ghost
function eatGhost(ghost) {
    // Remove from active ghosts and add to eaten ghosts
    ghosts.delete(ghost);
    eatenGhosts.add(ghost);
    score += 100;
    const scoreEl = document.getElementById("scoreEl");
    scoreEl.innerHTML = formatScore(score);

    // Play eatGhost sound when eating a scared ghost
    if (eatGhostSound && areSoundsEnabled()) {
        eatGhostSound.currentTime = 0; // Reset sound to beginning for rapid playback
        eatGhostSound.play().catch((e) => {
            // Handle any audio play errors silently
            console.log("Ghost eat audio play failed:", e);
        });
    }
}

//move function
function move() {
    // Don't process movement if game hasn't started or is over
    if (!gameStarted || gameOver) return;

    // ALWAYS handle mouth animation first, regardless of collisions
    if (pacman.radians < 0 || pacman.radians > 0.75) {
        pacman.openRate = -pacman.openRate;
    }
    pacman.radians += pacman.openRate;

    //pacman movement logic (only if not processing collision)
    if (!isProcessingCollision) {
        // Check if we can change direction and have a queued direction
        if (pacman.nextDirection && pacman.canChangeDirection()) {
            // Test if the queued direction is valid
            pacman.snapToGrid(); // Ensure we're centered
            let testX = pacman.x;
            let testY = pacman.y;

            // Calculate test position based on queued direction
            switch (pacman.nextDirection) {
                case "U":
                    testY -= pacman.speed;
                    break;
                case "D":
                    testY += pacman.speed;
                    break;
                case "L":
                    testX -= pacman.speed;
                    break;
                case "R":
                    testX += pacman.speed;
                    break;
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
    }

    // Ghost movement (always continues)
    for (let ghost of ghosts.values()) {
        // Calculate new position
        let newGhostX = ghost.x + ghost.velocityX;
        let newGhostY = ghost.y + ghost.velocityY;

        // Check if ghost would hit a wall
        let ghostWouldCollide = false;
        for (let wall of walls.values()) {
            if (
                ghostWallCollision(
                    newGhostX,
                    newGhostY,
                    ghost.width,
                    ghost.height,
                    wall
                )
            ) {
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
                    case "U":
                        testY -= tileSize / 4;
                        break;
                    case "D":
                        testY += tileSize / 4;
                        break;
                    case "L":
                        testX -= tileSize / 4;
                        break;
                    case "R":
                        testX += tileSize / 4;
                        break;
                }

                let canMoveThisWay = true;
                for (let wall of walls.values()) {
                    if (
                        ghostWallCollision(
                            testX,
                            testY,
                            ghost.width,
                            ghost.height,
                            wall
                        )
                    ) {
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
                const newDirection =
                    availableDirections[
                        Math.floor(Math.random() * availableDirections.length)
                    ];
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

    // Check for Pacman-Ghost collisions AFTER movement (only if not already processing)
    if (!isProcessingCollision) {
        for (let ghost of ghosts.values()) {
            if (pacmanGhostCollision(pacman, ghost)) {
                // Always stop Pacman movement on ghost collision
                pacman.velocityX = 0;
                pacman.velocityY = 0;
                pacman.nextDirection = null;

                if (ghostsScared) {
                    // Pacman eats the scared ghost and can continue moving
                    eatGhost(ghost);
                    break; // Exit after eating one ghost
                } else {
                    // Normal collision - lose a life and start disappearing animation
                    isProcessingCollision = true;
                    pacmanDisappearing = true;
                    disappearStartTime = Date.now();

                    lives -= 1;
                    const livesEl = document.getElementById("livesEl");
                    livesEl.innerHTML = lives;

                    // Play game over sound when losing a life
                    if (gameOverSound && areSoundsEnabled()) {
                        gameOverSound.currentTime = 0;
                        gameOverSound.play().catch((e) => {
                            console.log("Game over sound play failed:", e);
                        });

                        gameOverSound.addEventListener(
                            "ended",
                            () => {
                                pacmanDisappearing = false;
                                pacmanOpacity = 1.0;

                                if (lives <= 0) {
                                    gameOver = true;
                                    handleGameOver();
                                } else {
                                    resetPositions();
                                    isProcessingCollision = false;
                                }
                            },
                            { once: true }
                        );
                    } else {
                        const animationDuration = 2000;
                        setTimeout(() => {
                            pacmanDisappearing = false;
                            pacmanOpacity = 1.0;

                            if (lives <= 0) {
                                gameOver = true;
                                handleGameOver();
                            } else {
                                resetPositions();
                                isProcessingCollision = false;
                            }
                        }, animationDuration);
                    }
                    break; // Exit after collision, but mouth animation already ran
                }
            }
        }
    }

    // Handle pellet collection (only if not processing collision)
    if (!isProcessingCollision) {
        for (let pellet of pellets.values()) {
            const scoreEl = document.getElementById("scoreEl");
            if (pacmanPelletCollision(pacman, pellet)) {
                pellets.delete(pellet);
                score += 10;
                scoreEl.innerHTML = formatScore(score);

                if (eatPelletSound && areSoundsEnabled()) {
                    eatPelletSound.currentTime = 0;
                    eatPelletSound.play().catch((e) => {
                        console.log("Audio play failed:", e);
                    });
                }
            }
        }

        // Handle power-up collection
        for (let powerUp of powerUps.values()) {
            if (pacmanPelletCollision(pacman, powerUp)) {
                powerUps.delete(powerUp);
                makeGhostsScared();
                score += 50;
                const scoreEl = document.getElementById("scoreEl");
                scoreEl.innerHTML = formatScore(score);

                if (powerUpSound && areSoundsEnabled()) {
                    powerUpSound.currentTime = 0;
                    powerUpSound.loop = true;
                    powerUpSound.play().catch((e) => {
                        console.log("Audio play failed:", e);
                    });
                    // Stop the sound after 5 seconds
                    setTimeout(() => {
                        if (powerUpSound) {
                            powerUpSound.pause();
                            powerUpSound.loop = false;
                        }
                    }, SCARED_DURATION);
                }
            }
        }

        // Check win condition
        if (pellets.size === 0) {
            gameOver = true;
            handleWinGame();
        }
    }

    // Update scared ghost timer (always runs)
    updateScaredGhosts();
}

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
    let closestY = Math.max(
        ghost.y,
        Math.min(pacman.y, ghost.y + ghost.height)
    );

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
    return (
        ghostX < wall.x + wall.width &&
        ghostX + ghostWidth > wall.x &&
        ghostY < wall.y + wall.height &&
        ghostY + ghostHeight > wall.y
    );
}

function ghostCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

//reset positions of pacman and ghosts
function resetPositions() {
    // Reset Pacman to starting position and original direction
    pacman.x = 1 * tileSize + tileSize / 2;
    pacman.y = 1 * tileSize + tileSize / 2;
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    pacman.direction = "R"; // Reset to original direction (right)
    pacman.rotation = 0; // Reset to original rotation (facing right)
    pacman.nextDirection = null;

    // Reset animation state
    pacmanDisappearing = false;
    pacmanOpacity = 1.0;

    // Reset ghosts to their starting positions
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    let ghostIndex = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        // Give each ghost a new random direction
        const newDirection =
            directions[Math.floor(Math.random() * directions.length)];
        ghost.direction = newDirection;
        ghost.updateVelocity();
        ghostIndex++;
    }
}

//handle game over
function handleGameOver() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("pacman-highscore", highscore);
        updateHighscore();
    }

    const modal = document.getElementById("game-over-modal");
    const scoreEl = document.getElementById("final-score");
    const highscoreEl = document.getElementById("highscore");
    scoreEl.textContent = score;
    highscoreEl.textContent = highscore;
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
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("pacman-highscore", highscore);
        updateHighscore();
    }

    const modal = document.getElementById("win-game-modal");
    const scoreEl = document.getElementById("win-score");
    const highscoreEl = document.getElementById("highscore");
    scoreEl.textContent = score;
    highscoreEl.textContent = highscore;
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
    score = formatScore(0);
    lives = 3;
    gameOver = false;
    gameStarted = false; // Set to false initially to prevent movement
    ghostsScared = false;
    scaredTimer = 0;
    isProcessingCollision = false; // Reset collision state
    pacmanDisappearing = false; // Reset animation state
    pacmanOpacity = 1.0; // Reset opacity

    const scoreEl = document.getElementById("scoreEl");
    const livesEl = document.getElementById("livesEl");
    scoreEl.innerHTML = score;
    livesEl.innerHTML = lives;

    // Reset Pacman to original state
    pacman.x = 1 * tileSize + tileSize / 2;
    pacman.y = 1 * tileSize + tileSize / 2;
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    pacman.direction = "R"; // Reset to original direction (right)
    pacman.rotation = 0; // Reset to original rotation (facing right)
    pacman.nextDirection = null;

    // Reload the map to restore pellets and power-ups
    loadMap();
    resetPositions();

    // Draw the initial state (static)
    draw();

    // Play start game sound and wait for it to finish before starting
    if (startGameSound && areSoundsEnabled()) {
        startGameSound.currentTime = 0;
        startGameSound.play().catch((e) => {
            console.log("Start game sound play failed:", e);
        });

        // Wait for sound to finish before starting game
        startGameSound.addEventListener(
            "ended",
            () => {
                gameStarted = true;
                update(); // Start the game loop after sound ends
            },
            { once: true }
        );
    } else {
        // If no sound, start immediately
        gameStarted = true;
        update();
    }
}

//reset to menu - for going back to start screen
function resetToMenu() {
    score = 0;
    lives = 3;
    gameOver = false;
    gameStarted = false; // Set to false to show start modal
    ghostsScared = false;
    scaredTimer = 0;
    isProcessingCollision = false;
    pacmanDisappearing = false;
    pacmanOpacity = 1.0;

    const scoreEl = document.getElementById("scoreEl");
    const livesEl = document.getElementById("livesEl");
    scoreEl.innerHTML = score;
    livesEl.innerHTML = lives;

    // Reset Pacman to original state
    pacman.x = 1 * tileSize + tileSize / 2;
    pacman.y = 1 * tileSize + tileSize / 2;
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    pacman.direction = "R";
    pacman.rotation = 0;
    pacman.nextDirection = null;

    // Reload the map to restore pellets and power-ups
    loadMap();
    resetPositions();

    // Show start modal
    showStartGameModal();
    draw();
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

        this.direction =
            directions[Math.floor(Math.random() * directions.length)]; // Random initial direction
        this.velocityX = 0;
        this.velocityY = 0;
        this.updateVelocity(); // Set initial velocity
    }

    updateVelocity() {
        if (this.direction === "U") {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        } else if (this.direction === "D") {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        } else if (this.direction === "L") {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction === "R") {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.image = this.originalImage; // Reset to original image
    }
}

// Add this function after the loadMap function
function showStartGameModal() {
    const modal = document.getElementById("start-game-modal");
    modal.classList.remove("hidden");

    // Handle start button click
    const startBtn = document.getElementById("start-btn");
    const homeBtn = modal.querySelector(".home-btn");

    if (startBtn) {
        startBtn.onclick = () => {
            modal.classList.add("hidden");
            startGame();
        };
    }

    if (homeBtn) {
        homeBtn.onclick = () => {
            window.location.href = "index.html";
        };
    }
}

// Add this function to start the game
function startGame() {
    // Play start game sound
    if (startGameSound && areSoundsEnabled()) {
        startGameSound.currentTime = 0;
        startGameSound.play().catch((e) => {
            console.log("Start game sound play failed:", e);
        });

        // Wait for sound to finish before starting game
        startGameSound.addEventListener(
            "ended",
            () => {
                gameStarted = true;
                update(); // Start the game loop
            },
            { once: true }
        );
    } else {
        // If no sound, start immediately
        gameStarted = true;
        update(); // Start the game loop
    }
}

// Add sound toggle functionality to the start modal
function setupSoundToggle() {
    const soundsToggle = document.getElementById("game-sounds-toggle");

    // Load saved preference or default to enabled
    const soundsEnabled =
        localStorage.getItem("pacman-sounds-enabled") !== "false";

    // Set checkbox state based on saved preference
    if (soundsToggle) {
        soundsToggle.checked = soundsEnabled;

        // Add event listener to save preference
        soundsToggle.addEventListener("change", () => {
            localStorage.setItem("pacman-sounds-enabled", soundsToggle.checked);
        });
    }
}

// Call the setup function
setupSoundToggle();

// Function to check if sounds are enabled
function areSoundsEnabled() {
    return localStorage.getItem("pacman-sounds-enabled") !== "false";
}

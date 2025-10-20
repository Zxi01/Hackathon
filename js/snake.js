// Game configuration
const GAME_CONFIG = {
    blockSize: 20,
    rows: 30,
    cols: 30,
    fps: 10,
    startX: 5,
    startY: 5,
};

// Board
let board;
let context;

// Snake head
let snakeX = GAME_CONFIG.blockSize * GAME_CONFIG.startX;
let snakeY = GAME_CONFIG.blockSize * GAME_CONFIG.startY;

let velocityX = 0;
let velocityY = 0;

// Track last direction for preventing reverse moves
let lastDirection = "";

// snake body
let snakeBody = [];

// food
let foodX;
let foodY;

let gameOver = false;
let gameOverHandled = false;

// score
let score = 0;

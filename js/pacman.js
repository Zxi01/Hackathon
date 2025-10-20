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

const walls = new Set();
const pellets = new Set();
const powerUps = new Set();
const ghosts = new Set();
let score = 0;
let lives = 3;
let gameOver = false;

const directions = ['U', 'D', 'L', 'R'];


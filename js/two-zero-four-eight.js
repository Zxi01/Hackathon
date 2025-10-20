// init D-pad (replace old snake window.onload block)
document.addEventListener("DOMContentLoaded", () => {
    const up = document.getElementById("dpad-up");
    const down = document.getElementById("dpad-down");
    const left = document.getElementById("dpad-left");
    const right = document.getElementById("dpad-right");

    const handleMove = (fn) => {
        return (e) => {
            e && e.preventDefault && e.preventDefault();
            if (typeof fn === "function") {
                fn();
                if (typeof displayGrid === "function") displayGrid(grid);
                updateScore();
                if (checkGameOver()) displayGameOver();
            }
        };
    };

    if (up) {
        up.addEventListener("click", handleMove(moveUp));
        up.addEventListener("touchstart", handleMove(moveUp), {
            passive: false,
        });
    }
    if (down) {
        down.addEventListener("click", handleMove(moveDown));
        down.addEventListener("touchstart", handleMove(moveDown), {
            passive: false,
        });
    }
    if (left) {
        left.addEventListener("click", handleMove(moveLeft));
        left.addEventListener("touchstart", handleMove(moveLeft), {
            passive: false,
        });
    }
    if (right) {
        right.addEventListener("click", handleMove(moveRight));
        right.addEventListener("touchstart", handleMove(moveRight), {
            passive: false,
        });
    }
});

function updateScore() {
    const el = document.getElementById("score");
    if (el) el.textContent = String(score);
}

// Make grid and score global so all functions can access them
let grid = null;
let score = 0;

// FUNCTION setupGame
//     CREATE 4x4 grid filled with zeros
//     CALL addRandomTile()
//     CALL addRandomTile()
//     DISPLAY grid on screen
//     SET score = 0
// END FUNCTION
function setupGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    score = 0;
    addRandomTile(grid);
    addRandomTile(grid);
    // displayGrid is provided by your HTML renderer
    if (typeof displayGrid === "function") displayGrid(grid);
}

// FUNCTION addRandomTile
//     FIND all empty positions in the grid
//     IF there are no empty positions
//         RETURN (do nothing)
//     END IF
//     RANDOMLY choose one empty position
//     SET that position = 2 (90% chance) or 4 (10% chance)
// END FUNCTION

function addRandomTile(grid) {
    let emptyPositions = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) {
                emptyPositions.push([r, c]);
            }
        }
    }
    if (emptyPositions.length === 0) return;
    let [row, col] =
        emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
}

// Use the correct DOM event API
document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "ArrowLeft" || key === "a") {
        moveLeft();
    } else if (key === "ArrowRight" || key === "d") {
        moveRight();
    } else if (key === "ArrowUp" || key === "w") {
        moveUp();
    } else if (key === "ArrowDown" || key === "s") {
        moveDown();
    } else {
        return;
    }
    // update view and check game over after each move
    if (typeof displayGrid === "function") displayGrid(grid);
    if (checkGameOver()) displayGameOver();
    if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
        event.preventDefault();
    }
});

// FUNCTION moveLeft
//     SET moved = FALSE

//     FOR each row in grid
//         NEW_ROW = slideAndMerge(row)
//         IF NEW_ROW is different from original row
//             SET moved = TRUE
//         END IF
//         REPLACE original row with NEW_ROW
//     END FOR

//     IF moved == TRUE
//         CALL addRandomTile()
//         UPDATE display
//     END IF
// END FUNCTION

function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let originalRow = grid[r].slice();
        let newRow = slideAndMerge(originalRow);
        if (JSON.stringify(newRow) !== JSON.stringify(originalRow)) {
            moved = true;
        }
        grid[r] = newRow;
    }
    if (moved) {
        addRandomTile(grid);
        if (typeof displayGrid === "function") displayGrid(grid);
    }
    updateScore();
}

// FUNCTION slideAndMerge(row)
//     // Step 1: Remove zeros (compact to the left)
//     REMOVE all zeros from row
//     // Example: [2, 0, 2, 4] → [2, 2, 4]

//     // Step 2: Merge adjacent equals
//     FOR i = 0 TO length(row) - 2
//         IF row[i] == row[i + 1]
//             row[i] = row[i] * 2          // Merge tiles
//             ADD row[i] to score
//             row[i + 1] = 0               // Remove merged tile
//         END IF
//     END FOR

//     // Step 3: Remove zeros again
//     REMOVE all zeros again
//     // Step 4: Add zeros to fill row back to 4 tiles
//     WHILE length(row) < 4
//         APPEND 0 to end of row
//     END WHILE

//     RETURN row
// END FUNCTION
function slideAndMerge(row) {
    row = row.filter((num) => num !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    row = row.filter((num) => num !== 0);
    while (row.length < 4) {
        row.push(0);
    }
    return row;
}

// FUNCTION moveRight
//     REVERSE each row in grid
//     CALL moveLeft()
//     REVERSE each row again
// END FUNCTION

function moveRight() {
    for (let r = 0; r < 4; r++) {
        grid[r].reverse();
    }
    moveLeft();

    for (let r = 0; r < 4; r++) {
        grid[r].reverse();
    }
}

// FUNCTION rotateGrid90
//     ROTATE grid 90° clockwise
// END FUNCTION
function rotateGrid90(g) {
    const n = 4;
    const res = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            res[c][n - 1 - r] = g[r][c];
        }
    }
    return res;
}

// FUNCTION rotateGrid270
//     ROTATE grid 270° clockwise
// END FUNCTION
function rotateGrid270(g) {
    // 270 clockwise = 90 counter-clockwise
    const n = 4;
    const res = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            res[n - 1 - c][r] = g[r][c];
        }
    }
    return res;
}

// FUNCTION moveUp
//     ROTATE grid 90° clockwise
//     CALL moveLeft()
//     ROTATE grid 270° (back to normal)
// END FUNCTION

function moveDown() {
    grid = rotateGrid90(grid);
    moveLeft();
    grid = rotateGrid270(grid);
}

// FUNCTION moveDown
//     ROTATE grid 270° clockwise
//     CALL moveLeft()
//     ROTATE grid 90° (back to normal)
// END FUNCTION

function moveUp() {
    grid = rotateGrid270(grid);
    moveLeft();
    grid = rotateGrid90(grid);
}

// FUNCTION checkGameOver
//     IF there are any zeros in grid
//         RETURN FALSE  // Game still playable
//     END IF

//     FOR each cell in grid
//         IF any adjacent cell (up, down, left, right) has the same value
//             RETURN FALSE // A merge is still possible
//         END IF
//     END FOR

//     RETURN TRUE  // No moves left
// END FUNCTION
function checkGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) return false;
            if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

function displayGameOver() {
    const modal = document.getElementById("game-over-modal");
    const scoreEl = document.getElementById("final-score");
    scoreEl.textContent = score;
    modal.classList.remove("hidden");

    document.getElementById("restart-btn").onclick = () => {
        S;
        modal.classList.add("hidden");
        setupGame();
    };

    document.getElementById("home-btn").onclick = () => {
        window.location.href = "index.html";
    };
    // TODO: show a nicer overlay or restart button
}

// Start the game (do not block with a while loop)
setupGame();

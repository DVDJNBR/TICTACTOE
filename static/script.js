const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const themeToggle = document.getElementById('theme-toggle');
const designToggle = document.getElementById('design-toggle');

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let humanPlayer = "X";
let aiPlayer = "O";
let currentPlayer = "X"; // Always tracks whose turn it is

// Design Initialization
let currentDesign = localStorage.getItem('design') || 'original';
document.documentElement.setAttribute('data-design', currentDesign);
designToggle.checked = currentDesign === 'upgraded';

designToggle.addEventListener('change', (e) => {
    currentDesign = e.target.checked ? 'upgraded' : 'original';
    document.documentElement.setAttribute('data-design', currentDesign);
    localStorage.setItem('design', currentDesign);
    renderBoard();
    updateStatusUI();
});

// Theme Initialization
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

function getSymbol(player) {
    if (currentDesign === 'original') {
        return player === 'X' ? '❌' : '⭕';
    }
    return player;
}

function updateStatusUI() {
    if (!gameActive) {
        // Handled in handleGameOver
        return;
    }
    const humanSymbol = getSymbol(humanPlayer);
    const humanClass = humanPlayer === "X" ? "x-text" : "o-text";

    if (currentPlayer === aiPlayer) {
        statusElement.innerHTML = `You are <span class="${humanClass}">${humanSymbol}</span> - AI is thinking...`;
    } else {
        statusElement.innerHTML = `You are <span class="${humanClass}">${humanSymbol}</span> - Your turn`;
    }
}

// Initialize cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', startGame);

function updateHoverState() {
    boardElement.classList.remove('hover-x', 'hover-o');
    if (gameActive && currentPlayer === humanPlayer) {
        boardElement.classList.add(`hover-${humanPlayer.toLowerCase()}`);
    }
}

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;

    // Randomize players
    humanPlayer = Math.random() < 0.5 ? "X" : "O";
    aiPlayer = humanPlayer === "X" ? "O" : "X";

    // Randomize who starts
    currentPlayer = Math.random() < 0.5 ? "X" : "O";

    // Initially clear board
    renderBoard();
    updateHoverState();
    updateStatusUI();

    if (currentPlayer === aiPlayer) {
        // AI starts
        makeAiMove();
    }
}

async function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== "" || !gameActive || currentPlayer !== humanPlayer) return;

    // Human move
    makeMove(index, humanPlayer);
    currentPlayer = aiPlayer;
    updateHoverState();
    updateStatusUI();

    await makeAiMove();
}

async function makeAiMove() {
    if (!gameActive) return;

    try {
        const response = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                board: board,
                aiPlayer: aiPlayer
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        // Update board with server state (including computer move)
        board = data.board;
        renderBoard();

        if (data.winner) {
            handleGameOver(data.winner);
        } else {
            currentPlayer = humanPlayer;
            updateHoverState();
            updateStatusUI();
        }

    } catch (error) {
        console.error('Error:', error);
        statusElement.textContent = "Error communicating with server.";
        gameActive = false;
        updateHoverState();
    }
}

function makeMove(index, player) {
    board[index] = player;
    renderBoard();
}

function renderAsciiBoard() {
    const asciiBoard = document.getElementById('ascii-board');
    if (!asciiBoard) return;

    // Map board array to 2D
    const b = [
        [board[0], board[1], board[2]],
        [board[3], board[4], board[5]],
        [board[6], board[7], board[8]]
    ];

    const e = (val) => {
        if (!val) return ' '; // normal space
        return val;
    };

    // Using standard spacing
    const asciiText = `
 ${e(b[0][0])} │ ${e(b[0][1])} │ ${e(b[0][2])}
───┼───┼───
 ${e(b[1][0])} │ ${e(b[1][1])} │ ${e(b[1][2])}
───┼───┼───
 ${e(b[2][0])} │ ${e(b[2][1])} │ ${e(b[2][2])}
`.trim();

    asciiBoard.textContent = asciiText;
}

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        const val = board[i];
        if (val === "X" || val === "O") {
            cell.textContent = getSymbol(val);
        } else {
            cell.textContent = "";
        }

        cell.className = 'cell'; // reset classes
        if (val === "X") cell.classList.add('x');
        if (val === "O") cell.classList.add('o');
    });

    renderAsciiBoard();
}

function handleGameOver(winner) {
    gameActive = false;
    updateHoverState();
    if (winner === "Draw") {
        statusElement.textContent = "It's a Draw!";
    } else {
        const winnerSymbol = getSymbol(winner);
        const winnerClass = winner === "X" ? "x-text" : "o-text";
        const winnerName = winner === humanPlayer ? "You" : "AI";
        statusElement.innerHTML = `${winnerName} Won! <span class="${winnerClass}">${winnerSymbol}</span>`;
    }
}

// Start the game immediately on load
startGame();

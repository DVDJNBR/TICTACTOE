const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const themeToggle = document.getElementById('theme-toggle');

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let humanPlayer = "X";
let aiPlayer = "O";
let currentPlayer = "X"; // Always tracks whose turn it is

// Theme Initialization
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

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

    // Update UI initial state
    const humanSymbol = humanPlayer;
    const humanClass = humanPlayer === "X" ? "x-text" : "o-text";

    // Initially clear board
    renderBoard();
    updateHoverState();

    if (currentPlayer === aiPlayer) {
        statusElement.innerHTML = `You are <span class="${humanClass}">${humanSymbol}</span> - AI is thinking...`;
        // AI starts
        makeAiMove();
    } else {
        statusElement.innerHTML = `You are <span class="${humanClass}">${humanSymbol}</span> - Your turn`;
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

    const humanSymbol = humanPlayer;
    const humanClass = humanPlayer === "X" ? "x-text" : "o-text";
    statusElement.innerHTML = `You are <span class="${humanClass}">${humanSymbol}</span> - AI is thinking...`;

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
            const humanSymbol = humanPlayer;
            const humanClass = humanPlayer === "X" ? "x-text" : "o-text";
            statusElement.innerHTML = `You are <span class="${humanClass}">${humanSymbol}</span> - Your turn`;
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

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        const val = board[i];
        cell.textContent = val === "X" ? "X" : (val === "O" ? "O" : "");

        cell.className = 'cell'; // reset classes
        if (val === "X") cell.classList.add('x');
        if (val === "O") cell.classList.add('o');
    });
}

function handleGameOver(winner) {
    gameActive = false;
    updateHoverState();
    if (winner === "Draw") {
        statusElement.textContent = "It's a Draw!";
    } else {
        const winnerSymbol = winner === "X" ? "X" : "O";
        const winnerClass = winner === "X" ? "x-text" : "o-text";
        const winnerName = winner === humanPlayer ? "You" : "AI";
        statusElement.innerHTML = `${winnerName} Won! <span class="${winnerClass}">${winnerSymbol}</span>`;
    }
}

// Start the game immediately on load
startGame();

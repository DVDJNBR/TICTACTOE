const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let humanPlayer = "X";
let aiPlayer = "O";
let currentPlayer = "X"; // Always tracks whose turn it is

// Initialize cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', startGame);

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;

    // Randomize players
    humanPlayer = Math.random() < 0.5 ? "X" : "O";
    aiPlayer = humanPlayer === "X" ? "O" : "X";

    // Randomize who starts
    currentPlayer = Math.random() < 0.5 ? "X" : "O";

    // Update UI initial state
    const humanEmoji = humanPlayer === "X" ? "❌" : "⭕";
    const humanClass = humanPlayer === "X" ? "x-text" : "o-text";

    // Initially clear board
    renderBoard();

    if (currentPlayer === aiPlayer) {
        statusElement.innerHTML = `You are <span class="${humanClass}">${humanEmoji}</span> - AI is thinking...`;
        // AI starts
        makeAiMove();
    } else {
        statusElement.innerHTML = `You are <span class="${humanClass}">${humanEmoji}</span> - Your turn`;
    }
}

async function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== "" || !gameActive || currentPlayer !== humanPlayer) return;

    // Human move
    makeMove(index, humanPlayer);
    currentPlayer = aiPlayer;

    const humanEmoji = humanPlayer === "X" ? "❌" : "⭕";
    const humanClass = humanPlayer === "X" ? "x-text" : "o-text";
    statusElement.innerHTML = `You are <span class="${humanClass}">${humanEmoji}</span> - AI is thinking...`;

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
            const humanEmoji = humanPlayer === "X" ? "❌" : "⭕";
            const humanClass = humanPlayer === "X" ? "x-text" : "o-text";
            statusElement.innerHTML = `You are <span class="${humanClass}">${humanEmoji}</span> - Your turn`;
        }

    } catch (error) {
        console.error('Error:', error);
        statusElement.textContent = "Error communicating with server.";
        gameActive = false;
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
        cell.textContent = val === "X" ? "❌" : (val === "O" ? "⭕" : "");

        cell.className = 'cell'; // reset classes
        if (val === "X") cell.classList.add('x');
        if (val === "O") cell.classList.add('o');
    });
}

function handleGameOver(winner) {
    gameActive = false;
    if (winner === "Draw") {
        statusElement.textContent = "It's a Draw! 🤝";
    } else {
        const winnerEmoji = winner === "X" ? "❌" : "⭕";
        const winnerClass = winner === "X" ? "x-text" : "o-text";
        const winnerName = winner === humanPlayer ? "You" : "AI";
        statusElement.innerHTML = `${winnerName} Won! <span class="${winnerClass}">${winnerEmoji}</span>`;
    }
}

// Start the game immediately on load
startGame();

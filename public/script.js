const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Initialize cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);

// Initial status
statusElement.innerHTML = "Your turn (<span class='x-text'>❌</span>)";

async function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== "" || !gameActive) return;

    // Human move (optimistic UI update)
    makeMove(index, "X");
    statusElement.textContent = "Computer is thinking...";

    try {
        const response = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board: board })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        // Update board with server state (including computer move)
        board = data.board;
        renderBoard();

        if (data.winner) {
            handleGameOver(data.winner);
        } else {
            statusElement.innerHTML = "Your turn (<span class='x-text'>❌</span>)";
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
        const winnerName = winner === "X" ? "You" : "AI";
        statusElement.innerHTML = `${winnerName} Won! <span class="${winnerClass}">${winnerEmoji}</span>`;
    }
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    renderBoard();
    statusElement.innerHTML = "Your turn (<span class='x-text'>❌</span>)";
}
import { MARK, checkWinner, getBestMove } from './game.js';

const CELL_BLANK = ' '.repeat(5);
const CELL_SEP = '_ _ _';

function columns(start, text) {
  return [start, start + 1, start + 2]
    .map((i) => `<span class="cell" data-i="${i}">${text}</span>`)
    .join('|');
}

function blankLine(start) {
  return columns(start, CELL_BLANK);
}

function sepLine(start) {
  return columns(start, CELL_SEP);
}

function contentLine(start) {
  return [start, start + 1, start + 2]
    .map((i) => `<span class="cell mark" data-i="${i}">&nbsp;</span>`)
    .join('|');
}

function rowBlock(start, isLast) {
  const bottom = isLast ? blankLine(start) : sepLine(start);
  return [blankLine(start), contentLine(start), bottom].join('\n');
}

const rowStarts = [0, 3, 6];
const boardMarkup = rowStarts
  .map((start, i) => rowBlock(start, i === rowStarts.length - 1))
  .join('\n');

const app = document.getElementById('app');

app.innerHTML = `
  <div class="wrap">
    <div class="title">TicTacToe.py</div>
    <div id="status" class="status"></div>
    <pre id="board" class="board">${boardMarkup}</pre>
    <button id="restart">rejouer</button>
    <a class="source" href="https://github.com/DVDJNBR/TICTACTOE" target="_blank" rel="noopener">source</a>
  </div>
`;

const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let board, humanPlayer, aiPlayer, gameOver;

function render() {
  for (let i = 0; i < 9; i++) {
    const value = board[i];
    document.querySelector(`.mark[data-i="${i}"]`).textContent = value ? MARK[value] : ' ';
    document.querySelectorAll(`.cell[data-i="${i}"]`).forEach((el) => {
      el.classList.toggle('filled', Boolean(value));
      if (value) el.classList.remove('hover');
    });
  }
}

function setStatus(text) {
  statusEl.textContent = text;
}

function endIfOver() {
  const winner = checkWinner(board);
  if (!winner) return false;
  gameOver = true;
  if (winner === 'Draw') setStatus('match nul.');
  else setStatus(winner === humanPlayer ? 'tu gagnes !' : 'l\'IA gagne.');
  return true;
}

function aiMove() {
  const i = getBestMove(board, aiPlayer);
  board[i] = aiPlayer;
  render();
  if (endIfOver()) return;
  setStatus(`à toi de jouer ${MARK[humanPlayer]}`);
}

function handleClick(e) {
  const cell = e.target.closest('.cell');
  if (!cell || gameOver) return;
  const i = Number(cell.dataset.i);
  if (board[i] !== '') return;

  board[i] = humanPlayer;
  render();
  if (endIfOver()) return;

  setStatus('l\'IA réfléchit...');
  window.setTimeout(() => {
    if (!gameOver) aiMove();
  }, 300);
}

function newGame() {
  board = Array(9).fill('');
  humanPlayer = Math.random() < 0.5 ? 'X' : 'O';
  aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
  gameOver = false;
  render();
  setStatus(`tu joues ${humanPlayer}`);
  if (aiPlayer === 'X') window.setTimeout(aiMove, 300);
}

function setHover(i, on) {
  document.querySelectorAll(`.cell[data-i="${i}"]`).forEach((el) => {
    el.classList.toggle('hover', on);
  });
}

function handleMouseOver(e) {
  const cell = e.target.closest('.cell');
  if (!cell || gameOver) return;
  const i = Number(cell.dataset.i);
  if (board[i] !== '') return;
  setHover(i, true);
}

function handleMouseOut(e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  setHover(Number(cell.dataset.i), false);
}

const boardEl = document.getElementById('board');
boardEl.addEventListener('click', handleClick);
boardEl.addEventListener('mouseover', handleMouseOver);
boardEl.addEventListener('mouseout', handleMouseOut);
restartBtn.addEventListener('click', newGame);

newGame();

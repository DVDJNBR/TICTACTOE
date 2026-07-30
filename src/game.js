export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const MARK = { X: '❌', O: '⭕' };

export function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes('') ? null : 'Draw';
}

export function minimax(board, isMaximizing, aiPlayer, humanPlayer) {
  const winner = checkWinner(board);
  if (winner === aiPlayer) return 1;
  if (winner === humanPlayer) return -1;
  if (winner === 'Draw') return 0;

  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] !== '') continue;
    board[i] = isMaximizing ? aiPlayer : humanPlayer;
    scores.push(minimax(board, !isMaximizing, aiPlayer, humanPlayer));
    board[i] = '';
  }
  return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

export function getBestMove(board, aiPlayer) {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  if (board.every((c) => c === '')) return 4;

  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== '') continue;
    board[i] = aiPlayer;
    const score = minimax(board, false, aiPlayer, humanPlayer);
    board[i] = '';
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkWinner, getBestMove } from '../src/game.js';

test('checkWinner détecte une ligne', () => {
  const board = ['X', 'X', 'X', '', '', '', '', '', ''];
  assert.equal(checkWinner(board), 'X');
});

test('checkWinner détecte une colonne', () => {
  const board = ['O', '', '', 'O', '', '', 'O', '', ''];
  assert.equal(checkWinner(board), 'O');
});

test('checkWinner détecte une diagonale', () => {
  const board = ['X', '', '', '', 'X', '', '', '', 'X'];
  assert.equal(checkWinner(board), 'X');
});

test('checkWinner détecte un match nul', () => {
  const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
  assert.equal(checkWinner(board), 'Draw');
});

test('checkWinner renvoie null si la partie continue', () => {
  const board = ['X', '', '', '', '', '', '', '', ''];
  assert.equal(checkWinner(board), null);
});

test('getBestMove joue le centre sur une grille vide', () => {
  const board = Array(9).fill('');
  assert.equal(getBestMove(board, 'O'), 4);
});

test('getBestMove bloque un coup gagnant adverse', () => {
  const board = ['X', 'X', '', '', 'O', '', '', '', ''];
  assert.equal(getBestMove(board, 'O'), 2);
});

test('getBestMove prend le coup gagnant quand il est disponible', () => {
  const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
  assert.equal(getBestMove(board, 'O'), 2);
});

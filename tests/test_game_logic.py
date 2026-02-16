import unittest
from index import app, check_winner, get_best_move

class TestTicTacToe(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})

    def test_check_winner_x(self):
        board = ["X", "X", "X", "", "", "", "", "", ""]
        self.assertEqual(check_winner(board), "X")

    def test_check_winner_o(self):
        board = ["", "", "", "O", "O", "O", "", "", ""]
        self.assertEqual(check_winner(board), "O")

    def test_minimax_block_win_as_O(self):
        # AI is O, Human is X
        # X X _
        # _ O _
        # _ _ _
        board = ["X", "X", "", "", "O", "", "", "", ""]
        move = get_best_move(board, "O")
        self.assertEqual(move, 2)

    def test_minimax_win_as_O(self):
        # AI is O
        # O O _
        # _ X _
        # _ _ X
        board = ["O", "O", "", "", "X", "", "", "", "X"]
        move = get_best_move(board, "O")
        self.assertEqual(move, 2)

    def test_minimax_block_win_as_X(self):
        # AI is X, Human is O
        # O O _
        # _ X _
        # _ _ _
        board = ["O", "O", "", "", "X", "", "", "", ""]
        move = get_best_move(board, "X")
        self.assertEqual(move, 2)

    def test_minimax_win_as_X(self):
        # AI is X
        # X X _
        # _ O _
        # _ _ O
        board = ["X", "X", "", "", "O", "", "", "", "O"]
        move = get_best_move(board, "X")
        self.assertEqual(move, 2)

if __name__ == '__main__':
    unittest.main()

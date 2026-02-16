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

    def test_check_winner_draw(self):
        board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"]
        self.assertEqual(check_winner(board), "Draw")

    def test_minimax_block_win(self):
        # Board:
        # X X _
        # _ O _
        # _ _ _
        # Computer (O) should block X at index 2
        board = ["X", "X", "", "", "O", "", "", "", ""]
        move = get_best_move(board)
        self.assertEqual(move, 2)

    def test_minimax_win(self):
        # Board:
        # O O _
        # _ X _
        # _ _ X
        # Computer (O) should win at index 2
        board = ["O", "O", "", "", "X", "", "", "", "X"]
        move = get_best_move(board)
        self.assertEqual(move, 2)

if __name__ == '__main__':
    unittest.main()

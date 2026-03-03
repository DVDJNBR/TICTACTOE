# Triggering deploy with new secrets
from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_url_path='', static_folder='static')

# Board is a list of 9 strings: "X", "O", or "" (empty string)
# Representation indices:
# 0 1 2
# 3 4 5
# 6 7 8

def check_winner(board):
    """
    Checks for a winner on the board.
    Returns "X", "O", "Draw", or None if the game is ongoing.
    """
    lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], # Columns
        [0, 4, 8], [2, 4, 6]             # Diagonals
    ]
    for line in lines:
        if board[line[0]] and board[line[0]] == board[line[1]] == board[line[2]]:
            return board[line[0]]

    if "" not in board:
        return "Draw"

    return None

def minimax(board, depth, is_maximizing, ai_player, human_player):
    """
    Minimax algorithm to find the optimal move.
    """
    winner = check_winner(board)
    if winner == ai_player: return 10 - depth
    if winner == human_player: return depth - 10
    if winner == "Draw": return 0

    if is_maximizing:
        best_score = -float('inf')
        for i in range(9):
            if board[i] == "":
                board[i] = ai_player
                score = minimax(board, depth + 1, False, ai_player, human_player)
                board[i] = ""
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(9):
            if board[i] == "":
                board[i] = human_player
                score = minimax(board, depth + 1, True, ai_player, human_player)
                board[i] = ""
                best_score = min(score, best_score)
        return best_score

def get_best_move(board, ai_player):
    """
    Returns the best move index for the AI.
    """
    human_player = "X" if ai_player == "O" else "O"
    best_score = -float('inf')
    move = -1

    # Optimization: if board is empty, pick center (index 4)
    if board.count("") == 9:
        return 4

    for i in range(9):
        if board[i] == "":
            board[i] = ai_player
            score = minimax(board, 0, False, ai_player, human_player)
            board[i] = ""
            if score > best_score:
                best_score = score
                move = i
    return move

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/api/play', methods=['POST'])
def play():
    data = request.get_json()
    board = data.get('board') # Expecting list of 9 strings
    ai_player = data.get('aiPlayer', 'O') # Default to 'O' if not specified

    if not board or len(board) != 9:
        return jsonify({"error": "Invalid board state"}), 400

    # Check if game is already over
    winner = check_winner(board)
    if winner:
        return jsonify({"board": board, "winner": winner})

    # AI's turn
    move_index = get_best_move(board, ai_player)
    if move_index != -1:
        board[move_index] = ai_player

    # Check for winner after computer move
    winner = check_winner(board)

    return jsonify({"board": board, "winner": winner})

# Add explicit route for static files if needed, but Flask handles it via static_folder usually
# But for Vercel, having explicit routes helps debug
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)

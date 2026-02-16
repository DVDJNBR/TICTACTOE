# Tic-Tac-Toe vs AI (Python/Flask) ❌⭕

This project is a modern reimagining of my very first Python project from coding school. Originally a simple CLI (Command Line Interface) game designed to learn Python functions, this version brings the classic Tic-Tac-Toe into the web browser with a clean UI and a smart AI opponent.

## 🌟 About the Project

The goal was to revisit the logic of Tic-Tac-Toe but wrap it in a lightweight, modern web application.

- **Backend:** Python (Flask) handling the game logic and AI.
- **AI:** Implements the **Minimax algorithm**, making the computer an unbeatable opponent (or at least very hard to beat!).
- **Frontend:** Vanilla HTML/CSS/JavaScript with a focus on a clean, "light" design using emojis for game pieces.
- **Deployment:** Optimized for Vercel serverless deployment.

## 🎮 Features

- **Play vs Computer:** Challenge an AI that calculates the optimal move.
- **Randomized Start:** The game randomly assigns you 'X' or 'O' and decides who goes first.
- **Responsive UI:** Works on desktop and mobile.
- **Clean Aesthetic:** Minimalist design using system fonts and emojis.

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/tic-tac-toe-flask.git
    cd tic-tac-toe-flask
    ```

2.  **Install dependencies:**
    It's recommended to use a virtual environment.
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the application:**
    ```bash
    python index.py
    ```

4.  **Play:**
    Open your browser and navigate to `http://localhost:5000`.

## 🛠️ Project Structure

- `index.py`: The main Flask application containing the game routes and Minimax AI logic.
- `static/`: Contains the frontend assets (`index.html`, `style.css`, `script.js`).
- `tests/`: Unit tests to verify the game logic and AI performance.
- `vercel.json`: Configuration for deploying to Vercel.

## ☁️ Deployment

This project is configured for seamless deployment on [Vercel](https://vercel.com).
The `vercel.json` file ensures that all requests are routed to the Flask backend, which serves both the API and the static frontend files.

---
*Refactoring my first CLI project into a full-stack web app.*

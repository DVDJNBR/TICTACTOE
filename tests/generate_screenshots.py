from playwright.sync_api import sync_playwright, expect
import time
import os

def generate_screenshots():
    # Ensure screenshots directory exists
    if not os.path.exists('screenshots'):
        os.makedirs('screenshots')

    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 800, "height": 800}) # Force desktop size

        print("Navigating to http://localhost:5000...")
        page.goto("http://localhost:5000")

        # 1. Initial State
        print("Waiting for initial load...")
        page.wait_for_selector(".cell", state="visible")

        # Wait a moment for random AI move if AI starts
        time.sleep(1)

        print("Capturing initial state...")
        page.screenshot(path="screenshots/game_start.png")

        # 2. Gameplay State (Human moves)
        print("Simulating moves...")

        # Find an empty cell to click
        empty_cells = page.locator(".cell:not(.x):not(.o)")
        if empty_cells.count() > 0:
            empty_cells.first.click()
            time.sleep(1) # Wait for AI response

        print("Capturing gameplay state...")
        page.screenshot(path="screenshots/gameplay.png")

        # 3. Game Over State (Simulate game to end)
        # It's hard to force a specific end state against a Minimax AI without
        # complex logic, so we'll just try to play a few more moves.
        for _ in range(4):
            empty_cells = page.locator(".cell:not(.x):not(.o)")
            if empty_cells.count() > 0:
                # check if game over message is visible
                status = page.locator("#status").inner_text()
                if "Won!" in status or "Draw" in status:
                    break
                empty_cells.first.click()
                time.sleep(1)

        print("Capturing game over/end state...")
        page.screenshot(path="screenshots/game_end.png")

        browser.close()

if __name__ == "__main__":
    generate_screenshots()

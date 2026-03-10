from playwright.sync_api import sync_playwright, expect
import time
import os

def generate_screenshots():
    if not os.path.exists('screenshots'):
        os.makedirs('screenshots')

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 800, "height": 800})

        print("Navigating to http://localhost:5000...")
        page.goto("http://localhost:5000")

        # Wait for load
        page.wait_for_selector(".cell", state="visible")
        time.sleep(1)

        print("Capturing original mode...")
        page.screenshot(path="screenshots/original_mode.png")

        # Make a move to see symbols
        empty_cells = page.locator(".cell:has-text('')")
        if empty_cells.count() > 0:
            empty_cells.first.click()
            time.sleep(1)

        print("Capturing original mode gameplay...")
        page.screenshot(path="screenshots/original_mode_gameplay.png")

        # Toggle design
        print("Toggling to UPGRADED mode...")
        page.click("#design-toggle")
        time.sleep(1)

        print("Capturing upgraded mode gameplay...")
        page.screenshot(path="screenshots/upgraded_mode_gameplay.png")

        browser.close()

if __name__ == "__main__":
    generate_screenshots()

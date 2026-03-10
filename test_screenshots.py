from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 800, "height": 800})
        # Clear storage to test default state
        page.goto("http://localhost:5000")
        page.evaluate("localStorage.clear(); location.reload();")
        page.wait_for_timeout(500)

        page.screenshot(path="screenshots/default_view.png")

        # Now test upgraded
        page.evaluate('document.getElementById("design-toggle").click()')
        page.wait_for_timeout(500)
        page.screenshot(path="screenshots/upgraded_view.png")

        browser.close()

if __name__ == "__main__":
    test()

from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("file:///app/test_ascii4.html")
        page.screenshot(path="screenshots/ascii_test4.png")
        browser.close()

if __name__ == "__main__":
    main()

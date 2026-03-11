import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        # Set viewport to something standard
        await page.set_viewport_size({"width": 1280, "height": 720})

        await page.goto("http://127.0.0.1:5000/")
        # Ensure we are in original design
        await page.evaluate('() => { localStorage.setItem("designPreference", "original"); window.location.reload(); }')
        await page.wait_for_timeout(1000)

        # Take screenshot of the overall original theme
        await page.screenshot(path="screenshot_original.png", full_page=True)

        await browser.close()

asyncio.run(run())

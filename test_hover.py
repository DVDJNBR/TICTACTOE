import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5000")

        # Switch to modern design because it is easier to see the tooltip there
        await page.click('label.switch')
        await page.wait_for_timeout(1000)

        # Hover over the help icon
        await page.hover('.help-container')
        await page.wait_for_timeout(1000) # Give the transition time

        await page.screenshot(path="verification_hover.png")
        await browser.close()

asyncio.run(run())

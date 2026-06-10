const { chromium } = require("C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading local date"),
  );
  await page.getByRole("switch", { name: /24-hour format/i }).click();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "artifacts/clock-desktop-24h.png",
    fullPage: true,
  });

  await browser.close();
})();

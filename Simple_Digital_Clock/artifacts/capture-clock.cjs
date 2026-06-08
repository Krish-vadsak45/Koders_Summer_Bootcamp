const { chromium } = require("C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright");

async function capture() {
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
  await page.screenshot({ path: "artifacts/clock-desktop-styled.png", fullPage: true });
  await page.getByRole("button", { name: /focus/i }).click();
  await page.screenshot({ path: "artifacts/clock-desktop-focus.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading local date"),
  );
  await page.screenshot({ path: "artifacts/clock-mobile-styled.png", fullPage: true });
  await page.getByRole("button", { name: /focus/i }).click();
  await page.screenshot({ path: "artifacts/clock-mobile-focus.png", fullPage: true });

  const audit = await page.evaluate(() => ({
    bodyBackground: getComputedStyle(document.body).backgroundImage,
    bodyFont: getComputedStyle(document.body).fontFamily,
    mainDisplay: getComputedStyle(document.querySelector("main")).display,
  }));

  console.log(JSON.stringify(audit, null, 2));
  await browser.close();
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});

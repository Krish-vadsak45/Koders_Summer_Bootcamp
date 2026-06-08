const { chromium } = require("C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];

  page.on("console", (message) =>
    logs.push(`${message.type()}: ${message.text()}`),
  );
  page.on("pageerror", (error) => logs.push(`pageerror: ${error.message}`));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading local date"),
  );

  const data = await page.evaluate(() => {
    const main = document.querySelector("main");

    return {
      title: document.title,
      stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map(
        (link) => link.href,
      ),
      bodyBackground: getComputedStyle(document.body).backgroundImage,
      bodyFont: getComputedStyle(document.body).fontFamily,
      mainDisplay: main ? getComputedStyle(main).display : null,
      mainClassName: main?.className,
    };
  });

  console.log(JSON.stringify({ data, logs }, null, 2));

  await browser.close();
})();

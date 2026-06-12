import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const screenshotDir = path.join(projectRoot, "public", "assets", "screenshots");
const chromeUserData = path.join(projectRoot, ".chrome-capture");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;

await fs.mkdir(screenshotDir, { recursive: true });
await fs.rm(chromeUserData, { recursive: true, force: true });

for (const file of await fs.readdir(screenshotDir)) {
  if (file.endsWith(".png") || file === "write-test.tmp") {
    await fs.unlink(path.join(screenshotDir, file));
  }
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${chromeUserData}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);

async function waitForVersion() {
  const url = `http://127.0.0.1:${port}/json/version`;

  for (let index = 0; index < 80; index += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response.json();
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 125));
    }
  }

  throw new Error("Chrome DevTools endpoint did not become ready.");
}

const version = await waitForVersion();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);

  if (!request) {
    return;
  }

  pending.delete(message.id);

  if (message.error) {
    request.reject(new Error(message.error.message));
    return;
  }

  request.resolve(message.result);
});

function cdp(method, params = {}, sessionId) {
  const id = nextId;
  nextId += 1;

  const payload = { id, method, params };

  if (sessionId) {
    payload.sessionId = sessionId;
  }

  socket.send(JSON.stringify(payload));

  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

function escapeText(text) {
  return text.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

async function evalInPage(sessionId, expression) {
  const result = await cdp(
    "Runtime.evaluate",
    {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    },
    sessionId,
  );

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime evaluation failed.");
  }

  return result.result.value;
}

async function waitForPage(sessionId) {
  for (let index = 0; index < 80; index += 1) {
    const ready = await evalInPage(sessionId, "document.readyState === 'complete'");

    if (ready) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 125));
  }

  throw new Error("Page did not finish loading.");
}

async function clickButton(sessionId, label) {
  await evalInPage(
    sessionId,
    `
      (() => {
        const label = '${escapeText(label)}'.toLowerCase();
        const buttons = [...document.querySelectorAll('button')];
        const button = buttons.find((item) =>
          (item.getAttribute('aria-label') || item.textContent || '').toLowerCase().includes(label)
        );
        if (!button) throw new Error('Button not found: ' + label);
        button.click();
      })()
    `,
  );
  await new Promise((resolve) => setTimeout(resolve, 250));
}

async function capture(name, viewport, setup) {
  const { targetId } = await cdp("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp("Target.attachToTarget", {
    targetId,
    flatten: true,
  });

  await cdp("Page.enable", {}, sessionId);
  await cdp("Runtime.enable", {}, sessionId);
  await cdp(
    "Emulation.setDeviceMetricsOverride",
    {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 600,
    },
    sessionId,
  );
  await cdp("Page.navigate", { url: "http://localhost:3000" }, sessionId);
  await waitForPage(sessionId);

  if (setup) {
    await setup(sessionId);
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const metrics = await evalInPage(
    sessionId,
    `({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    })`,
  );
  const screenshot = await cdp(
    "Page.captureScreenshot",
    {
      format: "png",
      fromSurface: true,
      clip: {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
        scale: 1,
      },
    },
    sessionId,
  );

  await fs.writeFile(path.join(screenshotDir, name), Buffer.from(screenshot.data, "base64"));
  await cdp("Target.closeTarget", { targetId });

  return { name, metrics };
}

const captures = [];

captures.push(await capture("01-home-desktop.png", { width: 1440, height: 1000 }));
captures.push(
  await capture("02-result-desktop.png", { width: 1440, height: 1000 }, async (sessionId) => {
    await clickButton(sessionId, "calculate bmi");
    await clickButton(sessionId, "save bmi result");
  }),
);
captures.push(
  await capture("03-themes-imperial-desktop.png", { width: 1440, height: 1000 }, async (sessionId) => {
    await clickButton(sessionId, "use night theme");
    await clickButton(sessionId, "imperial");
    await clickButton(sessionId, "calculate bmi");
  }),
);
captures.push(await capture("04-home-mobile.png", { width: 390, height: 844 }));
captures.push(
  await capture("05-result-mobile.png", { width: 390, height: 844 }, async (sessionId) => {
    await clickButton(sessionId, "calculate bmi");
    await clickButton(sessionId, "save bmi result");
    await clickButton(sessionId, "use pulse theme");
  }),
);

socket.close();
chrome.kill();

try {
  await fs.rm(chromeUserData, { recursive: true, force: true });
} catch {
  // Chrome may hold Crashpad files briefly after exit; the folder is gitignored.
}

console.log(JSON.stringify(captures, null, 2));

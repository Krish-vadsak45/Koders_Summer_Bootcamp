import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = "http://localhost:3000";
const port = 9300 + Math.floor(Math.random() * 400);
const outDir = path.resolve("public/assets/screenshots");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, retries = 30) {
  for (let index = 0; index < retries; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch {
      await delay(250);
    }
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function encodeFrame(payload) {
  const data = Buffer.from(payload);
  const length = data.length;
  const header = length < 126 ? Buffer.alloc(6) : Buffer.alloc(8);
  header[0] = 0x81;

  if (length < 126) {
    header[1] = 0x80 | length;
    header.writeUInt32BE(0x12345678, 2);
    for (let index = 0; index < data.length; index += 1) {
      data[index] ^= header[2 + (index % 4)];
    }
    return Buffer.concat([header, data]);
  }

  header[1] = 0x80 | 126;
  header.writeUInt16BE(length, 2);
  header.writeUInt32BE(0x12345678, 4);
  for (let index = 0; index < data.length; index += 1) {
    data[index] ^= header[4 + (index % 4)];
  }

  return Buffer.concat([header, data]);
}

function decodeFrames(buffer) {
  const messages = [];
  let offset = 0;

  while (offset + 2 <= buffer.length) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    let length = second & 0x7f;
    let headerLength = 2;

    if (length === 126) {
      if (offset + 4 > buffer.length) break;
      length = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (length === 127) {
      if (offset + 10 > buffer.length) break;
      length = Number(buffer.readBigUInt64BE(offset + 2));
      headerLength = 10;
    }

    const masked = (second & 0x80) !== 0;
    const maskLength = masked ? 4 : 0;
    const frameEnd = offset + headerLength + maskLength + length;

    if (frameEnd > buffer.length) break;

    const payload = Buffer.from(buffer.subarray(offset + headerLength + maskLength, frameEnd));

    if (masked) {
      const mask = buffer.subarray(offset + headerLength, offset + headerLength + 4);
      for (let index = 0; index < payload.length; index += 1) {
        payload[index] ^= mask[index % 4];
      }
    }

    if ((first & 0x0f) === 1) {
      messages.push(payload.toString("utf8"));
    }

    offset = frameEnd;
  }

  return { messages, remaining: buffer.subarray(offset) };
}

async function connectWebSocket(wsUrl) {
  const parsed = new URL(wsUrl);
  const key = randomBytes(16).toString("base64");
  const socket = net.connect(Number(parsed.port), parsed.hostname);
  const pending = new Map();
  let nextId = 1;
  let buffer = Buffer.alloc(0);
  let earlySocketError;

  socket.on("error", (error) => {
    earlySocketError = error;
    for (const { reject } of pending.values()) {
      reject(error);
    }
    pending.clear();
  });

  await new Promise((resolve, reject) => {
    if (earlySocketError) {
      reject(earlySocketError);
      return;
    }

    socket.once("error", reject);
    socket.once("connect", () => {
      socket.write(
        [
          `GET ${parsed.pathname}${parsed.search} HTTP/1.1`,
          `Host: ${parsed.host}`,
          `Origin: http://${parsed.host}`,
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Key: ${key}`,
          "Sec-WebSocket-Version: 13",
          "",
          "",
        ].join("\r\n"),
      );
    });

    socket.once("data", (chunk) => {
      const text = chunk.toString("utf8");
      const splitAt = text.indexOf("\r\n\r\n");

      if (!text.startsWith("HTTP/1.1 101")) {
        reject(new Error(`Chrome did not accept the WebSocket connection: ${text.slice(0, 240)}`));
        return;
      }

      const rest = chunk.subarray(splitAt + 4);
      if (rest.length > 0) {
        buffer = Buffer.concat([buffer, rest]);
      }

      resolve();
    });
  });

  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    const decoded = decodeFrames(buffer);
    buffer = decoded.remaining;

    for (const message of decoded.messages) {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.id && pending.has(parsedMessage.id)) {
        const { resolve, reject } = pending.get(parsedMessage.id);
        pending.delete(parsedMessage.id);

        if (parsedMessage.error) {
          reject(new Error(parsedMessage.error.message));
        } else {
          resolve(parsedMessage.result);
        }
      }
    }
  });

  function send(method, params = {}) {
    const id = nextId;
    nextId += 1;
    socket.write(encodeFrame(JSON.stringify({ id, method, params })));

    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
  }

  return {
    close: () => socket.end(),
    send,
  };
}

async function openPage() {
  await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(appUrl)}`, {
    method: "PUT",
  });
  const pages = await waitForJson(`http://127.0.0.1:${port}/json`);
  const page = pages.find((entry) => entry.url.startsWith(appUrl));

  if (!page) {
    throw new Error("Could not find the Color Picker Tool tab.");
  }

  return connectWebSocket(page.webSocketDebuggerUrl);
}

async function evaluate(client, expression) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
}

async function screenshot(client, name) {
  const result = await client.send("Page.captureScreenshot", {
    captureBeyondViewport: false,
    format: "png",
    fromSurface: true,
  });
  await writeFile(path.join(outDir, name), Buffer.from(result.data, "base64"));
}

async function setViewport(client, width, height) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height,
    mobile: width < 600,
    width,
  });
  await client.send("Emulation.setVisibleSize", { width, height });
}

async function navigate(client) {
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Page.navigate", { url: appUrl });
  await delay(1400);
}

async function clickButton(client, text) {
  await evaluate(
    client,
    `(() => {
      const button = [...document.querySelectorAll("button")]
        .find((item) => item.textContent.trim().includes(${JSON.stringify(text)}));
      if (!button) throw new Error("Missing button: ${text}");
      button.click();
    })()`,
  );
  await delay(350);
}

async function fillContrast(client, value) {
  await evaluate(
    client,
    `(() => {
      const input = [...document.querySelectorAll("input")]
        .find((item) => item.value === "#111827");
      if (!input) throw new Error("Missing contrast input");
      input.value = ${JSON.stringify(value)};
      input.dispatchEvent(new Event("input", { bubbles: true }));
    })()`,
  );
  await delay(200);
}

await mkdir(outDir, { recursive: true });
const profileDir = await mkdtemp(path.join(os.tmpdir(), "color-picker-shots-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  `--remote-debugging-port=${port}`,
  `--remote-allow-origins=http://127.0.0.1:${port}`,
  `--user-data-dir=${profileDir}`,
  "--hide-scrollbars",
  "about:blank",
]);

try {
  await waitForJson(`http://127.0.0.1:${port}/json/version`);
  const client = await openPage();

  await setViewport(client, 1440, 1000);
  await navigate(client);
  await screenshot(client, "01-home-desktop.png");

  await clickButton(client, "Triadic");
  await screenshot(client, "02-palette-desktop.png");

  await clickButton(client, "Save");
  await fillContrast(client, "#FFFFFF");
  await clickButton(client, "Check");
  await screenshot(client, "03-saved-contrast-desktop.png");

  await setViewport(client, 390, 844);
  await navigate(client);
  await screenshot(client, "04-home-mobile.png");

  await clickButton(client, "Shades");
  await clickButton(client, "Save");
  await screenshot(client, "05-feature-mobile.png");

  client.close();
} finally {
  if (!chrome.killed) {
    chrome.kill();
  }

  await new Promise((resolve) => {
    chrome.once("exit", resolve);
    setTimeout(resolve, 1500);
  });

  await rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
}

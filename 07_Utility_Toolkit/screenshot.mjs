import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    if (!fs.existsSync('./public/assets/screenshots')) {
      fs.mkdirSync('./public/assets/screenshots', { recursive: true });
    }

    console.log("Capturing 01-dashboard-desktop...");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: './public/assets/screenshots/01-dashboard-desktop.png' });
    
    console.log("Capturing 02-password-gen-state-desktop...");
    await page.click('button[value="password"]');
    await page.waitForTimeout(1000);
    await page.click('button[aria-label="Copy password"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: './public/assets/screenshots/02-password-gen-state-desktop.png' });
    
    console.log("Capturing 03-tip-calc-state-desktop...");
    await page.click('button[value="tip"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: './public/assets/screenshots/03-tip-calc-state-desktop.png' });
    
    console.log("Capturing 04-dashboard-mobile...");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: './public/assets/screenshots/04-dashboard-mobile.png' });
    
    console.log("Capturing 05-clock-mobile...");
    await page.click('button[value="clock"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: './public/assets/screenshots/05-clock-mobile.png' });
    
    await browser.close();
    console.log("Screenshots captured successfully!");
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    process.exit(1);
  }
})();

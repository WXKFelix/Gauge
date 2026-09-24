import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.screenshot({
  path: "/opt/cursor/artifacts/quantified-life-login.png",
  fullPage: true,
});
await page.getByPlaceholder("昵称或姓名").fill("小明");
await page.getByRole("button", { name: "进入 BEARING" }).click();
await page.waitForTimeout(700);
await page.screenshot({
  path: "/opt/cursor/artifacts/quantified-life-home-after-login.png",
  fullPage: true,
});
await browser.close();

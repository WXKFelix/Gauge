import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.screenshot({
  path: "/opt/cursor/artifacts/quantified-life-ui-overview.png",
  fullPage: true,
});

await page.getByRole("button", { name: /A · 出生地与成长/ }).click();
await page.screenshot({
  path: "/opt/cursor/artifacts/quantified-life-journey-detail.png",
  fullPage: true,
});

await page.evaluate(() => {
  const raw = localStorage.getItem("quantified-life:v1");
  const base = raw
    ? JSON.parse(raw)
    : { version: 1, inputs: {}, journey: {}, advisorFeedback: [] };
  base.inputs = {
    ...base.inputs,
    workload: 78,
    assets: 44,
    wardrobeUtilization: 71,
    outfitSatisfaction: 68,
    age: 28,
  };
  localStorage.setItem("quantified-life:v1", JSON.stringify(base));
});
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({
  path: "/opt/cursor/artifacts/quantified-life-node-advisor.png",
  fullPage: true,
});

await browser.close();

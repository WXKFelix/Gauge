import { chromium } from "playwright";

const viewports = [
  { name: "mobile-se", width: 320, height: 568 },
  { name: "mobile-md", width: 390, height: 844 },
  { name: "mobile-lg", width: 430, height: 932 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `/opt/cursor/artifacts/quantified-life-home-${vp.name}.png`,
    fullPage: true,
  });
  await page.getByRole("tab", { name: "坐标" }).click();
  await page.screenshot({
    path: `/opt/cursor/artifacts/quantified-life-journey-${vp.name}.png`,
    fullPage: true,
  });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
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
await page.getByRole("tab", { name: "节点" }).click();
await page.screenshot({
  path: "/opt/cursor/artifacts/quantified-life-nodes-mobile-md.png",
  fullPage: true,
});

await browser.close();

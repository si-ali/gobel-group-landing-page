import puppeteer from 'puppeteer';
import { mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const yOffset = parseInt(process.argv[3] || '0');
const label = process.argv[4] || 'section';

const existing = readdirSync(dir).filter(f => f.endsWith('.png')).length;
const outputPath = join(dir, `screenshot-${existing + 1}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1000));
await page.evaluate(async (y) => {
  window.scrollTo(0, y);
  await new Promise(r => setTimeout(r, 600));
}, yOffset);
await page.screenshot({ path: outputPath });
await browser.close();
console.log(`Saved: ${outputPath}`);

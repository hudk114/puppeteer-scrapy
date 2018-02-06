const config = require('./config.json');

const puppeteer = require('puppeteer');

async function click(page, querySelector) {
  await page.click(querySelector);
  await page.waitFor(1000);
}

async function exec(url, querySelectorList) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor(1000);

  for (let i = 0; i < querySelectorList.length; i++) {
    const item = querySelectorList[i];
    await click(page, item);
  }

  // await browser.close();
}

module.exports = exec;
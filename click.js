const config = require('./config.json');

const puppeteer = require('puppeteer');

async function setClick() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(config.url);
  await page.waitFor(1000);

  await page.click(config.querySelector);

  // await browser.close();
}

setClick();

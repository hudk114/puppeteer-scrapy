/**
 * task entry
 */
const puppeteer = require('puppeteer');

const km = require('./km');
// const weibo = require('./weibo');

async function runTask() {
  const browser = await puppeteer.launch({ headless: true });
  
  km.topArtile(browser);
  // weibo.hotSearch();
}

runTask();
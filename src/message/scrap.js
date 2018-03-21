'use strict'
// TODO 作为一个基础服务库，对外提供page，对page进行管理
const scroll = require('../utils/scroll');

module.exports = async (pageLists, scrapyRule, scrollRule) => {
  // TODO 多个page一起跑
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const arr = [];

  pageList.forEach((p, i) => {
    await page.goto(p);

    // TODO use page function judge
    await page.waitFor(5000);

    await scroll(page, scrollRule);

    await page.waitFor(2000);

    arr[i] = await scrapyRule(page);
  });

  return arr;
};
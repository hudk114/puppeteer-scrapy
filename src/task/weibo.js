const puppeteer = require('puppeteer');
const inquirer = require('inquirer');

const {
  weibo,
} = require('./config');
const {
  loginWrapper,
  execLogin,
} = require('../components/login');
const {
  scrapyList
} = require('../components/scrapy');
const {
  writeJson
} = require('../components/fs');

async function login() {
  await execLogin(
    page,
    async page => {
        const ele = await page.$('a[node-type="loginBtn"]');
        return !!ele;
      },
      async page => {
          const ele = await page.$('a[node-type="loginBtn"]');
          await ele.click();
          await page.waitFor(1000);

          await loginWrapper(
            'div[node-type="login_frame"] input[node-type="username"]',
            'div[node-type="login_frame"] input[node-type="password"]',
            'div[node-type="login_frame"] a[node-type="submitBtn"]'
          )(page, {
            name: weibo.name,
            password: weibo.password,
          });
        },
        async page => {},
  );

}

/**
 * 抓取热搜
 */
async function hotSearch() {
  const browser = await puppeteer.launch(); // TODO browser抽出去

  const page = await browser.newPage();

  await page.goto('https://s.weibo.com/top/summary');
  await page.waitFor(5000);

  const arr = await scrapyList(
    page,
    '#pl_top_realtimehot tbody',
    'tr',
    async dom => {
      return await dom.evaluate(obj => {
        const content = obj.querySelector('.td-02 a');
        const times = obj.querySelector('.td-02 span');
        const types = obj.querySelector('.td-03 i');
        return {
          title: content.innerText,
          href: content.href,
          times: parseInt(times && times.innerText || '', 10),
          types: types && types.innerText || '',
        };
      });
    }
  );

  await writeJson('files', `weibo-hot-${(new Date()).toLocaleString()}`, JSON.stringify(arr));
}

module.exports = {
  hotSearch,
};
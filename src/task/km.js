const inquirer = require('inquirer');

const { km } = require('./config');
const {
  loginWrapper,
  execLogin,
} = require('../components/login');
const {
  scrapyList,
  scrapyDOM,
} = require('../components/scrapy');
const {
  writeJson,
  writeHTML,
} = require('../components/fs');

/**
 * 登陆
 * @param {Page} page
 * @returns {Promise}
 */
async function login(page) {
  return await execLogin(
    page,
    async page => {
      const ele = await page.$('input[name="ibnLogin"]');
      // 无论能否快速登陆，ele在登陆页面都会存在
      // const smartEle = await page.$('input[name="btn_smartlogin"]');
      return !!ele;
    },
    async page => {
      const smartEle = await page.$('input[name="btn_smartlogin"]');
      if (smartEle) {
        await page.click('input[name="btn_smartlogin"]');
      } else {
        const PIN = await inquirer.prompt([{
          name: 'PIN',
          type: 'input',
          message: '大爷您的pin是多少来着？',
        }]);

        await loginWrapper(
          'input[name="txtLoginName"]',
          'input[name="txtPassword"]',
          'input[name="ibnLogin"]',
        )(page, {
          name: km.name,
          password: `${km.password}${PIN.PIN}`
        });
      }
    },
    async page => {
      await page.waitFor(3000);

      // 去掉信息安全声明
      const info = await page.$('#bootstrap_modal');
      if (await info.evaluate(obj => obj.style.display === 'block')) {
        // 逗比用了一个iframe里的页面...
        const frame = (await page.frames())[1];
        await frame.waitFor(1000);

        await frame.click('#confirm');
        await frame.click('#btn_submit');
      }
    },
  );

}

/**
 * 文章热榜
 * @param {Browser} browser 
 */
async function topArtile(browser) {
  const page = await browser.newPage();
  await page.goto('http://km.oa.com/');
  await page.waitFor(2000);

  await login(page);

  const arr = await scrapyList(
    page,
    '.hot_list',
    '.artical_title a',
    async dom => {
      return await dom.evaluate(obj => ({
        title: obj.title,
        href: obj.href,
      }));
    }
  );

  // TODO page pool
  await Promise.all(arr.map(async ({ title, href }) => {
    const page = await browser.newPage();

    console.log(`open ${href}`);
    await page.goto(href);
    await page.waitFor(7000);

    const content = await scrapyDOM(page, '.middle-main-l.article_middle_main.left');
    await writeHTML('files', title, content);
    console.log(`write file: ${title}`);

    await page.close();
  }));
  console.log('done');
  
  await page.close();
}

module.exports = {
  topArtile,
};
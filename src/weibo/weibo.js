const puppeteer = require('puppeteer');
const login = require('./login');
// create your user file nad userList file!
const userList = require('./userList');

const weibo = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

const id = userList[0];

  const url = `https://weibo.com/p/${id}/photos`;

  await page.goto(url);

  // TODO 加一个判断机制，看页面是否加载
  await page.waitFor(10000);

  try {
    await login(page);
  } catch (e) {
    console.log(e);
  }

  await page.waitFor(2000);
  
  try {
    // TODO 对视频处理
    await page.click('ul[group_id="03月"] img[class="photo_pict"]');
    await page.waitFor(1000);
    await page.click('div[node-type="wrapIcon"] a[node-type="maximum"]');
  } catch (error) {
    
  }

  // try {
  //   const deploy = new Deploy(page, {
  //     message: 'upd8',
  //     dev: true,
  //     test: true
  //   });

  //   await deploy.deploy();
  // } catch (e) {
  //   console.log(e);
  // }

  // browser.close();
};

weibo();
const puppeteer = require('puppeteer');
const login = require('./login');
// create your user file nad userList file!
const userList = require('./userList');
const scroll = require('../utils/scroll');

const covertTime = function (str) {
  const pattern = /^((\d*)年)?(\d*)月/;
  const match = pattern.exec(str);

  return {
    year: match[3] ? parseInt(match[3], 10) : (new Date()).getFullYear(),
    month: parseInt(match[4], 10)
  };
};

/**
 * 确定根据微博时间线，在给定时间节点之前可能出现的所有时间组合，并比较
 * 微博的时间线有 年内: '{month}月(*日)' 年外: '{year}年{month}月(*日)'
 * @param {*} page 
 * @param {*} year 
 * @param {*} month 
 * @param {*} date 
 */
const judgeTimeBefore = async (page, year, month) => {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;

  if (y < year || (y === year && m < month)) {
    // 传入时间在当前时间之后
    return true;
  }

  const times = await page.$$eval(
    '.photo_album_list',
    uls => uls.map(ul => ul.getAttribute('group_id'))
  );

  // FIXME 对每个time进行判断，判断出每个的时间，然后和传入时间比较
  // 如果有一个早于的说明达到查询条件
  // TODO 其实只比较最后一个就可以了
  for (let i = 0; i < times.length; i++) {
    let cD = covertTime(times[i]);
    
  }

  console.log(times);

  if (y === year) {
    // year为本年的情况下
    // 
  }
  return true;
};

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
    await scroll(page, async p => {
      // TODO 在某个时间点之前的都可能
      return await judgeTimeBefore(page, 2018, 2);
      // let ele = await p.$('ul[group_id="2017年12月"]');
      // console.log(ele);
      // return !!ele;
    });
    
    // TODO 对视频处理
    // await page.click('ul[group_id="03月"] img[class="photo_pict"]');
    // await page.waitFor(1000);
    // await page.click('div[node-type="wrapIcon"] a[node-type="maximum"]');
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
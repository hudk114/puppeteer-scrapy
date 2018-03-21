const puppeteer = require('puppeteer');
const login = require('./login');
// create your user file nad userList file!
const userList = require('./userList');
const scroll = require('../utils/scroll');

const covertTime = function (str) {
  const pattern = /^((\d*)年)?((\d*)月)?/;
  const match = pattern.exec(str);
  return {
    year: match[2] ? parseInt(match[2], 10) : (new Date()).getFullYear(),
    // 没有month的情况下，要保证year的全部内容都加载，所以month要设置为最大，保证没有一个就早于输入条件
    month: match[4] ? parseInt(match[4], 10) : 13
  };
};

/**
 * date 1 > date 2 (date 1 is later than date 2) true else false
 * @param {Date} date1 
 * @param {Date} date2 
 */
const compareTime = (date1, date2) => {
  if (date1.year > date2.year) {
    return true;
  } else if (date1.year < date2.year) {
    return false;
  }
  
  if (date1.month > date2.month) {
    return true;
  } else {
    return false;
  }
};

/**
 * 确定根据微博时间线，在给定时间节点之前可能出现的所有时间组合，并比较
 * 微博的时间线有 年内: '{month}月(*日)' 年外: '{year}年{month}月(*日)', '{year}年'
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
  
  // 比较最后一个timer和传入时间，如果早于说明达到查询条件
  if (times.length <= 0) {
    return false;
  }
  let cD = covertTime(times[times.length - 1]);
  if (compareTime({
      year,
      month
    }, cD)) {
    // cD时间比传入的晚
    return true;
  } else {
    return false;
  }
};

const extractImg = imgUrl => {
  const pattern = /\/([^\/]*).jpg/;
  console.log(imgUrl);
  const match = pattern.exec(imgUrl);
  console.log(match);
  return match[1];
};

const weibo = async () => {
  const browser = await puppeteer.launch({ headless: false });
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
      // TODO 时间抽离出去
      return await judgeTimeBefore(page, 2018, 2);
    });
    
    // 获取所有图片
    // TODO 对视频处理
    const imgList = await page.$$eval(
      '.photo_pict',
      imgs => imgs.map(img => img.src)
    );
    imgList = imgList.map(item => extractImg(item));
    console.log(imgList);

    // await page.click('ul[group_id="03月"] img[class="photo_pict"]');
    // await page.waitFor(1000);
    // await page.click('div[node-type="wrapIcon"] a[node-type="maximum"]');
  } catch (error) {
  }

  browser.close();
};

weibo();
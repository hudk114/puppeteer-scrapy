const puppeteer = require('puppeteer');
const login = require('./login');
const scroll = require('../utils/scroll');
const config = require('./config');

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
  const patternVideo = /imgaliyuncdn.miaopai.com/;

  if (/miaopai.com/.test(imgUrl)) {
    // video
    return null;
  }
  const patternJpg = /\/([^\/]*.jpg)/;
  const patternGif = /\/([^\/]*.gif)/;
  let img = null;
  const matchJpg = patternJpg.exec(imgUrl);
  const matchGif = patternGif.exec(imgUrl);
  if (matchJpg) {
    img = {
      url: `${config.imgPrefix}${matchJpg[1]}`,
      name: matchJpg[1],
      type: 'jpg'
    };
  } else if (matchGif) {
    img = {
      url: `${config.gifPrefix}${matchGif[1]}`,
      name: matchGif[1],
      type: 'gif'
    };
  }
  return img;
};

const newInstance = async (browser, userId, year, month, user) => {
  let imgList = [];
  let fixedImgList = [];

  const page = await browser.newPage();
  const url = `https://weibo.com/p/${userId}/photos`;
  
  // TODO 用算法，不要一次性开太多
  await page.goto(url);

  // TODO 加一个判断机制，看页面是否加载
  await page.waitFor(10000);

  try {
    await login(page, user);
  } catch (e) {
    console.log(e);
  }

  await page.waitFor(2000);

  try {
    await scroll(page, async p => {
      return await judgeTimeBefore(page, year, month);
    });
    
    // 获取所有图片
    // TODO 对视频处理，目前没有处理
    imgList = await page.$$eval(
      '.photo_pict',
      imgs => imgs.map(img => img.src)
    );
    fixedImgList = imgList
      .map(item => extractImg(item))
      // filter video
      .filter(item => item !== null);
    
  } catch (e) {
    console.log(`爬虫报错：${e.message}`);
  } finally {
    return fixedImgList;
  }
};

const weibo = async (userList, user) => {
  const browser = await puppeteer.launch({ headless: true });
  
  let img = {};
  
  // TODO 有很多方式
  for (const i of userList) {
    img[i.id] = await newInstance(browser, i.id, i.year, i.month, user);
  }

  await browser.close();

  return img;
};

// weibo(userList, user).then(res => {
//   console.log(res);
// });

module.exports = weibo;
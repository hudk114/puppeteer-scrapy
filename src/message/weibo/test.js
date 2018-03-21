const scrap = require('../scrap');

const urlList = [
  'https://weibo.com/u/5062878707?profile_ftype=1&is_all=1#_0',
];

const scrapyCB = async page => {
  let text = '';
  let ele = await page.$('[feedtype="top"]');
  if (ele) {
    ele = await page.$('[feedtype="top"] [action-type="fl_unfold"]');
    if (ele) {
      // TODO
      await page.click('[feedtype="top"] [action-type="fl_unfold"]');
    }

    text = await page.$eval(
      '[feedtype="top"] [node-type="feed_list_content_full"]',
      div => div.innerText
    ) || await page.$eval(
      '[feedtype="top"] [node-type="feed_list_content"]',
      div => div.innerText
    );
  }
  return text;
};

const scrollCB = async page => {
  await page.evalat
  return true;
};

scrpa(urlList, scrapyCB, scrollCB);
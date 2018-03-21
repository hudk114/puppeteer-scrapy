/**
 * the scroll function of the page
 * @param {Object} page the page instance
 * @param {Function} callback the callback for each scroll
 */
module.exports = async (page, callback) => {
  // TODO 获取高度，每次滚动一段距离，若符合callback或者高度不再变化了则结束
  let scrollY = 0;
  let bodyH = 0;

  let i = 0;
  // while (i++ < 10) {
  while (true) {
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });
    await page.waitFor(2000);

    if (typeof callback === 'function' && await callback(page)) {
      console.log('to the end by callback');
      return;
    }

    let tmpH = await page.evaluate(() => document.body.clientHeight);
    let tmpY = await page.evaluate(() => window.scrollY);
    if (tmpH === bodyH && tmpY === bodyY) {
      // both not change, means to the end of page
      console.log('to the end');
      return;
    }
    bodyH = tmpH;
    bodyY = tmpY;
  }
};
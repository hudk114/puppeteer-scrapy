
/**
 * 抓取列表
 * @param {Page} page
 * @param {CssSelector} wrapper 列表wrapper selector
 * @param {CssSelector} selector 列表项selector
 * @param {Function} func
 * @returns {Array}
 */
async function scrapyList(
  page,
  wrapper,
  selector,
  func,
) {
  const wrapperDom = await page.$(wrapper);
  if (!wrapperDom) return [];

  const doms = await wrapperDom.$$(selector);
  if (!doms || !doms.length) return [];

  return await Promise.all(doms.map(async dom => await func(dom)));
}

module.exports = {
  scrapyList,
};

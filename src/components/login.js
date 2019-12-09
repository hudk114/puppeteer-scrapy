const {
  exampleFunc,
} = require('../utils/functions');

/**
 * 登陆的统一方法
 * @param {Page} page 主页面
 * @param {Function} beforeLogin login前的方法，返回boolean的false阻止login
 * @param {Function} login login方法
 * @param {Function} afterLogin login后的回调
 */
async function execLogin(
  page,
  beforeLogin = exampleFunc,
  login = exampleFunc,
  afterLogin = exampleFunc,
) {
  if (await beforeLogin(page) !== false) {
    await login(page);
  }

  await afterLogin(page);
}

/**
 * login wrapper
 * @param {cssSelector} nameInput 用户名输入框
 * @param {cssSelector} passwordInput 密码输入框
 * @param {cssSelector} submitBtn 确认按钮
 */
function loginWrapper(nameInput, passwordInput, submitBtn) {
  /**
   * login方法
   * @param {Page} page
   * @param {String} user.name
   * @param {String} user.password
   */
  return async function (page, user) {
    await page.type(nameInput, user.name);
    await page.type(passwordInput, user.password);
    await page.waitFor(500);
    await page.click(submitBtn);
  }
}

module.exports = {
  execLogin,
  loginWrapper,
};

// create your user file nad userList file!
const user = require('./user');

const needLogin = async page => {
  const ele = await page.$('#pl_login_form');

  return !!ele;
};

const login = async page => {
  
  if (needLogin(page)) {
    await page.click('a[node-type="loginBtn"]');
    await page.waitFor(500);
    await page.click('a[action-data="tabname=login"]');
    await page.waitFor(500);

    await page.type('div[node-type="login_frame"] input[node-type="username"]', user.name);
    await page.type('div[node-type="login_frame"] input[node-type="password"]', user.password);
    await page.waitFor(500);
    await page.click('div[node-type="login_frame"] a[node-type="submitBtn"]');

    // await page.type('#loginname', user.name);
    // await page.type('.info_list.password .W_input', user.password);
    // await page.waitFor(1000);
  
    // await page.click('div[node-type="normal_form"] a[node-type="submitBtn"]');
  }
};

module.exports = login;
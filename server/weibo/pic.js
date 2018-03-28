const weibo = require('../../src/weibo/weibo');
// create your user file nad userList file!
const userList = require('./userList');
const user = require('./user');

const getWeiboPic = async () => {
  return await weibo(userList, user);
};

module.exports = getWeiboPic;
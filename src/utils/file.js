
const NOT_ALLOW_CHAR_IN_NAME = ['.', ',', '/'];
const NAME_MAX_LENGTH = 255;

/**
 * 修复文件名称，去除不合法字符，截长
 * @param {String} name
 * @returns {String}
 */
function fixName(name) {
  return name
    .split('')
    .filter(char => !NOT_ALLOW_CHAR_IN_NAME.includes(char))
    .slice(0, NAME_MAX_LENGTH)
    .join('');
}

module.exports = {
  fixName,
};
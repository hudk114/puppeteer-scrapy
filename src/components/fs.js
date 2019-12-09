
const fs = require('fs');

async function createIfNotExist(file) {
  if (fs.existsSync(file)) return;

  return fs.createWriteStream(file);
}

/**
 * 写json文件
 * @param {*} path 
 * @param {*} name 
 * @param {*} content 
 */
async function writeJson(path, name, content) {
  const file = `${__dirname}/../../${path}/${name}.json`;

  await createIfNotExist(file);

  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


/**
 * 写txt文件
 * @param {String} path 文件路径
 * @param {String} name 文件名
 * @param {String} content 文本内容
 */
async function writeTxt(path, name, content) {
  const file = `${__dirname}/../../${path}/${name}.txt`;

  await createIfNotExist(file);

  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  writeTxt,
  writeJson,
};
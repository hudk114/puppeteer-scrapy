
const fs = require('fs');
const fileUtils = require('../utils/file');

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
  const file = `${__dirname}/../../${path}/${fileUtils.fixName(name)}.json`;

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
  const file = `${__dirname}/../../${path}/${fileUtils.fixName(name)}.txt`;

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
 * 写HTML文件
 * @param {*} path 文件路径
 * @param {*} name 文件名
 * @param {*} content HTML内容 全部放于body中
 */
async function writeHTML(path, name, content) {
  function fixed(content) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      ${content}
    </body>
    </html>`;
  }

  const file = `${__dirname}/../../${path}/${fileUtils.fixName(name)}.html`;

  await createIfNotExist(file);

  return new Promise((resolve, reject) => {
    fs.writeFile(file, fixed(content), err => {
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
  writeHTML,
};
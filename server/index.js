const http = require('http');
const fs = require('fs');

const Pool = require('../src/utils/pool');
const pool = new Pool(2);

const getWeiboPic = require('./weibo/pic');

// imgList item: { url, name, type }
const getAndStorePic = async (imgList, path) => {
  const ps = [];
  for (const img of imgList) {
    ps.push(new Promise((resolve, reject) => {
      http.get(img.url, res => {
        res.setEncoding('binary');
        var data = '';
        res.on('data', chunk => {
          data += chunk;
        }).on('end', () => {
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          };
          fs.writeFile(`${path}/${img.name}`, data, 'binary', err => {
            if (!err) {
              resolve();
              return;
            }
            console.log(`存储出错：${err && err.message}`);
            reject();
          });
        });
      });
    }));
  }
  return Promise.all(ps);
};

const gASP = (imgList, path) => {
  return _ => getAndStorePic(imgList, path);
};

const getPic = async () => {
  const imgLists = await getWeiboPic();

  console.log('获取数据列表成功！');

  for (const key in imgLists) {
    if (imgLists.hasOwnProperty(key)) {
      pool.add(gASP(imgLists[key], `./images/${key}`));
    }
  }
};

getPic();
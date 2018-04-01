const http = require('http');
const fs = require('fs');

const Pool = require('@hudk/pool');
const pool = new Pool(10);

const getWeiboPic = require('./weibo/pic');

// imgList item: { url, name, type }
const getAndStorePic = async (imgList, path) => {
  const ps = [];
  for (const img of imgList) {
    pool.add(_ => {
      return new Promise((resolve, reject) => {
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
        })
      });
    });
  }
};

const getPic = async () => {
  const imgLists = await getWeiboPic();

  console.log('获取数据列表成功！');

  for (const key in imgLists) {
    if (imgLists.hasOwnProperty(key)) {
      getAndStorePic(imgLists[key], `./images/${key}`);
    }
  }
};

getPic();
const http = require('http');
const fs = require('fs');

const url = 'http://wx3.sinaimg.cn/large/aeea9a29ly1fplkd4y7e9j21bf0qo424.jpg';

const imgList = [
  {
    url: 'http://wx3.sinaimg.cn/large/aeea9a29ly1fplkd4y7e9j21bf0qo424.jpg',
    name: 'aeea9a29ly1fplkd4y7e9j21bf0qo424.jpg',
    type: 'jpg'
  }
];

const getWeiboPic = require('./weibo/pic');

// imgList item: { url, name, type }
const getAndStorePic = async (imgList, path) => {
  for (const img of imgList) {
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
            return;
          }
          console.log(`存储出错：${err && err.message}`);
        });
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
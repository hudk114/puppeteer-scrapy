const Event = require('./event');

async function F (f, e) {
  await f();
  e.trigger('finish');
}

const Pool = function (length) {
  this.length = length;
  this.pool = [];
  this.waiting = [];
  this.e = new Event();

  e.on('finish', _ => {
    if (this.waiting.length > 0) {
      let f = this.waiting.splice(0, 1);
      this.pool.push(await F(f, this.e));
    }
  });
};

Pool.prototype = {
  constructor: Pool,
  add (cb) {
    if (this.pool.length >= this.length) {
      this.waiting.push(cb);
    } else {
      this.pool.push(await F(f, this.e));      
    }
  }
};

module.exports = Pool;
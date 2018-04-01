const Event = require('./event');

function judgeFunction(f) {
  return typeof f === 'function';
}

async function F(f, cb) {
  const ans = await f();
  cb(ans);
}

function Pool(len, e) {
  this.len = len;
  this.pool = Array.apply(null, new Array(len));
  this.e = e;

  e.on('pool-finish', msg => {
    // 清除第index个，向外发消息
    this.pool[msg.index] = null;
    e.trigger('pool-empty');
  });
}

Object.assign(Pool.prototype, {
  _getRest() {
    return this.pool
      .map((item, index) => (item ? true : index))
      .filter(item => item !== true);
  },
  add(f, cb) {
    const r = this._getRest();
    if (r.length === 0) {
      // full
      throw new Error('full');
    }
    this.pool[r[0]] = F(f, ans => {
      judgeFunction(cb) && cb(ans);
      this.e.trigger('pool-finish', {
        index: r[0]
      });
    });
  },
  // 正在跑的线程数量
  getLength() {
    return this.len - this._getRest.length;
  }
});

function MsgQueue(pool, e) {
  this.pool = pool;
  this.queue = [];
  this.e = e;

  e.on('pool-empty', _ => {
    if (this.queue.length <= 0) {
      return;
    }
    // 收到清空消息，将一个推入到pool中
    const F = this.queue[0];
    try {
      this.pool.add(F.f, F.cb);
      // 如果失败的话不会执行这句
      this.queue.shift();
    } catch (e) {}
    
    if (this.queue.length === 0) {
      e.trigger('msg-empty');
    }
  });
}

Object.assign(MsgQueue.prototype, {
  add(f, cb) {
    this.queue.push({ f, cb });
  },
  getLength() {
    return this.queue.length;
  }
});

function P(len) {
  this.e = new Event();
  this.pool = new Pool(len, this.e);
  this.msg = new MsgQueue(this.pool, this.e);
}

Object.assign(P.prototype, {
  // 异步方法
  add(f) {
    try {
      this.pool.add(f);
    } catch (e) {
      this.msg.add(f);
    }
  },
  _judgeEmpty () {
    return this.pool.getLength() === 0 && this.msg.getLength() === 0;
  },
  // 同步方法，只有所有fL执行完才能用
  async addSync(fL) {
    const ps = [];
    for (const f of fL) {
      ps.push(new Promise(resolve => {
        try {
          this.pool.add(f, resolve);
        } catch (e) {
          this.msg.add(f, resolve);
        }
      }));
    }

    return Promise.all(ps);
  }
});

module.exports = P;

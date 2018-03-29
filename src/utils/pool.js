const Event = require('./event');
const E = new Event();

function judgeFunction(f) {
  return typeof f === 'function';
}

async function F(f, cb) {
  const ans = await f();
  cb(ans);
}

function Pool(len) {
  this.len = len;
  this.pool = Array.apply(null, new Array(len));

  E.on('pool-finish', msg => {
    // 清除第index个，向外发消息
    this.pool[msg.index] = null;
    E.trigger('pool-empty');
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
      E.trigger('pool-finish', {
        index: r[0]
      });
    });
  },
  // 正在跑的线程数量
  getLength() {
    return this.len - this._getRest.length;
  }
});

function MsgQueue(pool) {
  this.pool = pool;
  this.queue = [];
  E.on('pool-empty', _ => {
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
      E.trigger('msg-empty');
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
  this.pool = new Pool(len);
  this.msg = new MsgQueue(this.pool);
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
    for (const i in fL) {
      const f = fL[i];
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

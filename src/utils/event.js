const Event = function () {
  this.pool = {};
};

const F = function (cb, once) {
  this.cb = cb;
  this.once = once;
  // 用于单次事件
  this.done = false;
};

function judgeFunction (f) {
  return typeof f === 'function';
}
Event.prototype = {
  constructor: Event,
  // 有的话直接返回，没有的话创建一个
  getPool (eventName) {
    if (!this.pool[eventName]) {
      this.pool[eventName] = [];
    }
    return this.pool[eventName];
  },
  // 注册触发多次的函数
  on (eventName, cb) {
    if (!judgeFunction(cb)) {
      return;
    }

    this
      .getPool(eventName)
      .push(new F(cb, false));
  },
  // 注册触发一次的函数
  once (eventName, cb) {
    if (!judgeFunction(cb)) {
      return;
    }

    this
      .getPool(eventName)
      .push(new F(cb, true));
  },
  // 触发函数并传递options
  trigger (eventName, options) {
    const p = this.pool[eventName];
    if (!p) {
      return;
    }

    for (const f of p) {
      if (!f.once || !f.done) {
        f.cb.call(null, options);
      }
      if (f.once) {
        f.done = true;
      }
    }

    this.pool[eventName] = p.filter(f => !f.once || !f.done);
  }
};

module.exports = Event;

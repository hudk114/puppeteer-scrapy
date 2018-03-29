const Event = function() {
  this.pool = {};
};

const E = function(cb, once) {
  this.cb = cb;
  this.once = once;
  // 用于单次事件
  this.done = false;
};

function judgeFunction(f) {
  return typeof f === 'function';
}

Event.prototype = {
  constructor: Event,
  // 有的话直接返回，没有的话创建一个
  _getPool(eventName) {
    if (!this.pool[eventName]) {
      this.pool[eventName] = {
        stop: true,
        list: []
      };
    }
    return this.pool[eventName];
  },
  // 注册触发多次的函数
  on(eventName, cb, ctx) {
    if (!judgeFunction(cb)) {
      return;
    }

    this._getPool(eventName).list.push(new E(cb.bind(ctx), false));
    return this;
  },
  // 注册触发一次的函数
  once(eventName, cb, ctx) {
    if (!judgeFunction(cb)) {
      return;
    }

    this._getPool(eventName).list.push(new E(cb.bind(ctx), true));
    return this;    
  },
  // 触发函数并传递options
  trigger(eventName, msg) {
    const p = this.pool[eventName];
    if (!p) {
      return;
    }

    p.stop = false;

    for (const f of p.list) {
      if (p.stop) {
        return;
      }

      if (!f.once || !f.done) {
        f.cb(msg);
      }
      if (f.once) {
        f.done = true;
      }
    }

    p.list = p.list.filter(f => !f.once || !f.done);
    p.stop = true;
  },
  // stop event trigger
  stop(eventName) {
    const p = this.pool[eventName];
    if (!p) {
      return;
    }

    p.stop = true;
  }
};

module.exports = Event;

/**
 * 计划任务
 */

const schedule = require('node-schedule');

/**
 * 计划任务wrapper
 * @param {Object} param0
 * @param {Function} fn
 */
function scheduleWrapper({
    year,
    month,
    date,
    hour,
    minute,
    second
  } = {},
  fn,
) {
  return () => {
    schedule.scheduleJob(
      `${ second || '*'} ${ minute || '*' } ${ hour || '*'} ${ date || '*' } ${ month || '*'} ${ year || '*' }`,
      fn,
    );
  }
}

module.exports = scheduleWrapper;
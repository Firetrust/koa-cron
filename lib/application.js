/**
 * Module dependencies.
 */

var debug = require('debug')('koa-cron');
var assert = require('assert');
var compose = require('composition');

/**
 * Expose `Application`.
 */

module.exports = Application;

/**
 * Initialize a new `Application`.
 *
 * @api public
 */

function Application() {
  if (!(this instanceof Application)) return new Application();
  this.middleware = [];
}

/**
 * Use the given middleware `fn`.
 *
 * @param {GeneratorFunction} fn
 * @return {Application}
 * @api public
 */

Application.prototype.use = function use(fn) {
  assert(fn && 'GeneratorFunction' === fn.constructor.name,
    'app.use() requires a generator function');

  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn);

  return this;
};

/**
 * Start cron processing.
 *
 * @return {Promise}
 * @api public
 */

Application.prototype.start = function start() {
  var fn = compose(this.middleware);
  return fn.call(Object.create(null)).catch(this.onerror);
};

/**
 * Default error handler.
 *
 * @param {Error} err
 * @api private
 */

Application.prototype.onerror = function onerror(err) {
  assert(err instanceof Error, 'non-error thrown: ' + err);

  var msg = err.stack || err.toString();
  console.error();
  console.error(msg.replace(/^/gm, '  '));
  console.error();
};

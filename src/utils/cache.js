const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
  get: (key) => {
    return cache.get(key);
  },
  set: (key, value, ttl) => {
    cache.set(key, value, ttl);
  },
  del: (key) => {
    cache.del(key);
  },
  flush: () => {
    cache.flushAll();
  }
};
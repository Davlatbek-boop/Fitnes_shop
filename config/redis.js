const redis = require('redis');

module.exports = redis.createClient({
    host: '172.29.168.1',  // WSLning IP manzili
    port: 6379
  }); 
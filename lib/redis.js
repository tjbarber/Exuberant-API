const redis = require('redis');
const config = require('../config/config');
const client = redis.createClient(config.redisUrl);

module.exports = client;
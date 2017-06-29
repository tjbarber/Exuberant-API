var express = require('express');
var router = express.Router();
var config = require('../config/config');
var redis  = require('../lib/redis');
var request = require('request');
var zlib = require('zlib');

/* GET home page. */

var standardHeaders = {
  "Ocp-Apim-Subscription-Key": config.apiKeys.h5APIKey,
  gzip: true
}

router.get('/maps', function(req, res, next) {
  redis.get('maps', function(err, reply) {
    if (reply) {
      res.send(JSON.parse(reply));
    } else {
      var requestObject = {
        url: 'https://www.haloapi.com/metadata/h5/metadata/maps',
        headers: standardHeaders
      }

      var data = "";
      var dataStream = request(requestObject).pipe(zlib.createGunzip());

      dataStream.on('data', function(chunk) {
        data += chunk
      });

      dataStream.on('end', function() {
        redis.set('maps', data, 'EX', 86400);
        res.send(JSON.parse(data));
      });
    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var config = require('../config/config');
var redis  = require('../lib/redis');
var request = require('request');
var zlib = require('zlib');

var standardHeaders = {
  "Ocp-Apim-Subscription-Key": config.apiKeys.h5APIKey,
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

      request(requestObject, function(error, response, body) {
        if (err) {
          var err = new Error(error.message);
          err.status = 500;
          next(err);
        }

        redis.set('maps', body, 'EX', 86400);
        res.send(JSON.parse(body));
      });
    }
  });
});

module.exports = router;

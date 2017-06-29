var express = require('express');
var router = express.Router();
var config = require('../config/config');
var redis  = require('../lib/redis');
var request = require('request');

var standardHeaders = {
  "Ocp-Apim-Subscription-Key": config.apiKeys.h5APIKey,
}

router.get('/matches', function(req, res, next) {
  var player = req.query['player'];
  var mode   = req.query['modes'];
  var start  = req.query['start'];
  var count  = req.query['count'];

  request({
    url: 'https://www.haloapi.com/stats/h5/players/' + player + '/matches?modes=' + mode + '&start=' + start + '&count=' + count, 
    headers: standardHeaders
  }, function(error, response, body) {
    if (error) {
      var err = new Error(error.message);
      err.status = 500;
      next(err);
    }

    res.send(JSON.parse(body));
  });
});

router.get('/servicerecord', function(req, res, next) {
  var player = req.query['player'];
  var redisKey = player.toLowerCase() + '_servicerecord';

  redis.get(redisKey, function(error, results) {
    if (error) {
      var err = new Error(error.message);
      err.status = 500;
      next(err);
    }

    if (results) {
      res.send(JSON.parse(results));
    } else {
      request({
        url: 'https://www.haloapi.com/stats/h5/servicerecords/arena?players=' + player,
        headers: standardHeaders
      }, function(error, response, body) { 
        if (error) {
          var err = new Error(error.message);
          err.status = 500;
          next(err);
        }

        redis.set(redisKey, body, 'EX', 86400);
        res.send(JSON.parse(body));
      });
    }
  });
});

module.exports = router;
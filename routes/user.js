var express = require('express');
var request = require('request');
var router = express.Router();
var redis  = require('../lib/redis');
var config = require('../config/config');

/* GET users listing. */
router.get('/profile', function(req, res, next) {
  var lowercasedGamertag = req.query['gamertag'].toLowerCase();
  redis.get(lowercasedGamertag, function(err, reply) {
    if (reply) {
      res.send(JSON.parse(reply));
    } else {
      var requestObject = {
        url: 'https://xboxapi.com/v2/xuid/' + req.query['gamertag'],
        headers: {
          'Accept': 'application/json',
          'X-AUTH': config.apiKeys.xboxLiveAPIKey
        }
      };

      request(requestObject, function(error, response, body) {
        if (error) {
          var err = new Error('Unable to access server.');
          err.status = 500;
          next(err);
        }
    
        var parsedBody = JSON.parse(body);

        if (parsedBody['success'] === false) {
          var err = new Error(parsedBody['error_message']);
          err.status = parsedBody['error_code'];
          next(err);
        }

        var xuid = parsedBody['xuid'];
        var requestObject = {
          url: 'https://xboxapi.com/v2/' + xuid + '/profile',
          headers: {
            'Accept': 'application/json',
            'X-AUTH': config.apiKeys.xboxLiveAPIKey
          }
        }

        request(requestObject, function(error, response, body) {
          if (error) {
            var err = new Error('Unable to access server.');
            err.status = 500;
            next(err);
          }
    
          var parsedBody = JSON.parse(body);

          if (parsedBody['success'] === false) {
            var err = new Error(parsedBody['error_message']);
            err.status = parsedBody['error_code'];
            next(err);
          }

          redis.set(lowercasedGamertag, JSON.stringify(parsedBody), 'EX', 259200);
          res.send(parsedBody);
        });
      });
    }
  });
});

module.exports = router;

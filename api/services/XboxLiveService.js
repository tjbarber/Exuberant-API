var standardHeaders = {
  'Accept': 'application/json',
  'X-AUTH': sails.config.xboxLiveAPIKey
}

module.exports = {
  getProfile: function(options, done) {
    var lowercasedGamertag = options.gamertag.toLowerCase();
    var requestObject = {
      url: 'https://xboxapi.com/v2/xuid/' + lowercasedGamertag,
      headers: standardHeaders
    };

    sails.request(requestObject, function(error, response, body) {
      if (error) {
        return done(error)
      }
  
      var parsedBody = JSON.parse(body);

      if (parsedBody['success'] === false) {
        var err = new Error(parsedBody['error_message']);
        err.status = parsedBody['error_code'];
        return done(err);
      }

      var xuid = parsedBody['xuid'];
      var requestObject = {
        url: 'https://xboxapi.com/v2/' + xuid + '/profile',
        headers: standardHeaders
      }

      sails.request(requestObject, function(error, response, body) {
        if (error) {
          return done(error);
        }
  
        var parsedBody = JSON.parse(body);

        if (parsedBody['success'] === false) {
          var error = new Error(parsedBody['error_message']);
          error.status = parsedBody['error_code'];
          return done(error);
        }

        return done(parsedBody);
      });
    });
  }
}
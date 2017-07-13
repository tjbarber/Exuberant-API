var standardHeaders = {
  "Ocp-Apim-Subscription-Key": sails.config.h5APIKey
}

module.exports = {
  stats: {
    getMatches: function(options, done) {
      var player = options.player,
        mode = options.mode,
        start = options.start,
        count = options.count;
      
      sails.request({
        url: 'https://www.haloapi.com/stats/h5/players/' + player + '/matches?modes=' + mode + '&start=' + start + '&count=' + count, 
        headers: standardHeaders
      }, function(error, response, body) {
        if (error) {
          return done(error)
        }

        return done(JSON.parse(body));
      });
    },
    getServiceRecord: function(options, done) {
      var player = options.player;

      request({
        url: 'https://www.haloapi.com/stats/h5/servicerecords/arena?players=' + player,
        headers: standardHeaders
      }, function(error, response, body) { 
        if (error) {
          return done(err)
        }

        return done(JSON.parse(body));
      });
    }
  },
  metadata: {
    getMaps: function(options, done) {
      var requestObject = {
        url: 'https://www.haloapi.com/metadata/h5/metadata/maps',
        headers: standardHeaders,
        gzip: true
      }

      sails.request(requestObject, function(error, response, body) {
        if (error) {
          return done(error)
        }

        return done(JSON.parse(body));
      });
    }
  }
}
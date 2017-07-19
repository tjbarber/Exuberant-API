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

        if (body.length === 0) {
          body = "{}";
        }

        var parsedBody = JSON.parse(body);
        var results = parsedBody['Results'];
        var modifiedResults = [];

        for (var i = 0; i < results.length; i++) {
          var match = results[i];
          var cleanedMatch = {};

          cleanedMatch.id = match['Id'];
          cleanedMatch.mapId = match['MapId'];
          cleanedMatch.mapVariant = match['MapVariant'];
          cleanedMatch.gameBaseVariantId = match['GameBaseVariantId'];
          cleanedMatch.gameVariant = match['GameVariant'];
          cleanedMatch.isTeamGame = match['IsTeamGame'];
          cleanedMatch.playlistId = match['HopperId'];
          cleanedMatch.queriedPlayer = match['Players'][0];
          cleanedMatch.queriedPlayer.gamertag = cleanedMatch.queriedPlayer['Player']['Gamertag'];
          cleanedMatch.seasonId = match['SeasonId'];

          modifiedResults.push(cleanedMatch);
        }

        return done(modifiedResults);
      });
    },
    getServiceRecord: function(options, done) {
      var player = options.player;

      sails.request({
        url: 'https://www.haloapi.com/stats/h5/servicerecords/arena?players=' + player,
        headers: standardHeaders
      }, function(error, response, body) { 
        if (error) {
          return done(err)
        }
        
        var parsedBody = JSON.parse(body);
        delete parsedBody['Results'][0]['Result']['ArenaStats']['ArenaPlaylistStats'];
        delete parsedBody['Results'][0]['Result']['ArenaStats']['ArenaGameBaseVariantStats'];
        delete parsedBody['Results'][0]['Result']['ArenaStats']['Impulses'];
        delete parsedBody['Results'][0]['Result']['ArenaStats']['WeaponStats'];
        delete parsedBody['Results'][0]['Result']['ArenaStats']['MedalAwards'];
        delete parsedBody['Results'][0]['Result']['ArenaStats']['DestroyedEnemyVehicles'];

        var prunedData = parsedBody['Results'][0];

        return done(prunedData);
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
    },
    getGameBaseVariants: function(options, done) {
      var requestObject = {
        url: 'https://www.haloapi.com/metadata/h5/metadata/game-base-variants',
        headers: standardHeaders,
        gzip: true
      }

      sails.request(requestObject, function(error, response, body) {
        if (error) {
          return done(error);
        }

        return done(JSON.parse(body));
      });
    },
    getPlaylists: function(options, done) {
      var requestObject = {
        url: 'https://www.haloapi.com/metadata/h5/metadata/playlists',
        headers: standardHeaders,
        gzip: true
      }

      sails.request(requestObject, function(error, response, body) {
        if (error) {
          return done(error);
        }

        return done(JSON.parse(body));
      });
    }
  },
  profile: {
    getEmblem: function(option, done) {
      var requestObject = {
        url: "https://www.haloapi.com/profile/h5/profiles/" + option.player + "/emblem?size=" + option.size,
        headers: standardHeaders,
        encoding: null
      }

      sails.request(requestObject, function(error, response, body) {
        if (error) {
          return done(error);
        }
        
        return done(body);
      });
    },
    getSpartanImage: function(option, done) {
      var requestObject = {
        url: "https://www.haloapi.com/profile/h5/profiles/" + option.player + "/spartan?size=512",
        headers: standardHeaders,
        encoding: null
      }

      sails.request(requestObject, function(error, response, body) {
        if (error) {
          return done(error);
        }
        
        return done(body);
      });
    }
  }
}
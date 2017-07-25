/**
 * H5Controller
 *
 * @description :: Server-side logic for managing Halo 5
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	maps: function(req, res) {
    Halo5Service.metadata.getMaps({}, function(data) {
      return res.send(data);
    });
  },
  gameBaseVariants: function(req, res) {
    Halo5Service.metadata.getGameBaseVariants({}, function(data) {
      return res.send(data);
    });
  },
  matches: function(req, res) {
    Halo5Service.stats.getMatches({
      player: req.query['player'],
      mode: req.query['mode'],
      start: req.query['start'],
      count: req.query['count']
    }, function(data) {
      return res.send(data);
    });
  },
  match: function(req, res) {
    Halo5Service.stats.getMatch({matchId: req.query['matchId']}, function(data) { 
      return res.send(data);
    });
  },
  servicerecord: function(req, res) {
    Halo5Service.stats.getServiceRecord({player: req.query['player']}, function(data) {
      return res.send(data);
    });
  },
  emblem: function(req, res) {
    Halo5Service.profile.getEmblem({player: req.query['player'], size: '512'}, function(data) {
      res.set('Content-Type', 'image/png');
      res.send(data);
    });
  },
  spartan: function(req, res) {
    Halo5Service.profile.getSpartanImage({player: req.query['player']}, function(data) {
      res.set('Content-Type', 'image/png');
      res.send(data);
    });
  },
  playlists: function(req, res) {
    Halo5Service.metadata.getPlaylists({}, function(data) {
      res.send(data);
    });
  }
};


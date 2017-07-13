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
  servicerecord: function(req, res) {
    Halo5Service.stats.getServiceRecord({player: req.query['player']}, function(data) {
      return res.send(data);
    });
  }
};

